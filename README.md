# Meteor 1.3 + sass + bootstrap4: the npm way.

 A [(╯°□°）╯︵TABLEFLIP](https://tableflip.io) side project for [● Meteor London](http://www.meetup.com/Meteor-London/)

## TL;DR

**Meteor 1.3 has first class npm support. [npm run scripts][5] are a simple way to add build tools to your meteor work flow.**

## Why?

Meteor core supports for pre-compiling less & stylus. Sass support is less up to date. Boostrap 4 has moved to sass. At the time of writing the Meteor scss package doesn't support importing additional scss files from npm packages or meteor packages. If you want a nice setup where you can customise the core boostrap 4 variables and have it re-build on demand, you're either going to have to upgrade the meteor scss comiler (I spent a 4 hours on it and gave up) or find another way.

I've found [npm run scripts][5] super helpful on other projects. Setting them up to rebuild on change is painless. More importantly, there is very little magic involved so you can fit it all in your head; reuse the pattern to add other build steps; and use the knowledge on non-meteor projects too.

## How?

Meteor already knows how to compile, minify, version and hot reload your css files, so that's all covered. For this quest, all we need is

- Access to the boostrap source scss files, in a way we can import them into our local scss file.
- A **build** step that'll run the sass comiler to create the css.
- A **watch** step that'll re-build the css when we chnage the scss, so dev is stil fun.
- For bonus marks we'll add [autoprefixer][6], to add vendor-specific css prefixes for us.
- And pull in the bootstrap js files, for the advanced interactions like drop-downs

**Adventure time!** You can follow along or just check the source code in the repo to skip ahead.

This project was created by running `meteor create`

```shell
meteor create --release 1.3-beta.12 sass-boostrap4
```

<small>The `--release 1.3-beta.12` is used to use the latest 1.3 release before it's out of beta. </small>

That scaffolds out a meteor project skeleton for us:

```shell
tree sass-boostrap4
.
├── package.json
├── sass-bootstrap4.css
├── sass-bootstrap4.html
├── sass-bootstrap4.js
└── tests.js
```

New for meteor 1.3, we get an npm package.json included as standard, like so:

```json
{
  "name": "meteor-sass-bootstrap4",
  "private": true,
  "version": "0.0.1",
  "main": "sass-bootstrap4.js",
  "scripts": {
    "start": "meteor run",
    "test": "meteor test-app --driver-package practicalmeteor:mocha"
  },
  "dependencies": {
    "meteor-node-stubs": "~0.2.0"
  }
}
```

It includes some scripts for `start` and `test` already which is interesting... we'll circle back to them in a minute...

---

Staying on the bleeding edge is a full time job, so let's add `bootstrap4-alpha`, via npm (I'm using `v3.7.5` according to my `npm -v`)

```shell
# Get all the existing deps listed in the package.json
npm install

# Add bootstrap, scss files and all.
npm install --save bootstrap@4.0.0-alpha.2
```

Now we've got a `node_modules` directory for our npm packages. In it, a `bootstrap` directory filled with the latest release

```shell
$ tree -L 3
.
├── README.md
├── node_modules
│   ├── bootstrap
│   │   ├── CHANGELOG.md
│   │   ├── LICENSE
│   │   ├── dist
│   │   ├── package.json
│   │   └── scss
```

Now try the `start` script from earlier

```shell
npm start
```

We see the familiar meteor launch sequence. _Why would you use npm start instead of just `meteor run`?_

Either is fine. An **npm run script** is just an alias you can configure easily.


```json
  "scripts": {
    "start": "meteor run",
    "test": "meteor test-app --driver-package practicalmeteor:mocha"
  }
```

Here, `npm start` is an alias for `meteor run`. Check out the `test` script. That thing is remembering command line arguments for us. As soon as you need to pass a `--settings settings.json` to your app, you'll find a short cut like `npm start` helpful to save a few key strokes.

```
"scripts": {
  "start": "meteor run --settings settings.json"
```

Now the app is running, go check it out... http://localhost:3000 in your navigator of choice.

---

![Meteor 1.3 default app screenshot][1]

It's not exactly shiny. **Where is the boostrap?**

Bootstrap is still all in the node_modules folder where we left it. npm modules don't care about your needs. (npm <3s you, but that's cos they have intense feels and a wombat.)

![npm wombat][2]

**Tuck your brain in and put your safety goggles on. We are going to make it work.**

Upgrade our css to a scss file called `main.scss`. In it, we'll override a variable, and then import the all the bootstrap styles:

**main.scss**

```scss
$body-bg: hotpink;
@import 'bootstrap/scss/bootstrap';
```

Install the npm dependency `node-sass`, so we can call on it to compile things.

```shell
npm install --save node-sass
```

and in `package.json` add a `build:css` script:

```json
  "scripts": {
    "start": "meteor run",
    "test": "meteor test-app --driver-package practicalmeteor:mocha",
    "build:css": "node-sass --include-path node_modules main.scss bundle.css"
  }
```

Open a new terminal, **stand back (if you have a wireless keyboard), and run it**

```shell
$ npm run build:css

> sass-bootstrap4@0.0.1 build:css /Users/oli/Code/tableflip/meteor-sass-bootstrap4
> node-sass --include-path node_modules main.scss bundle.css

Rendering Complete, saving .css file...
Wrote CSS to /Users/oli/Code/tableflip/meteor-sass-bootstrap4/bundle.css
```

![][4]

:tada: SUCCESS! The tell-tale bootstrap font-stack is evident.

Now we have a build artefact... a `bundle.css` that is derived from our `main.scss`. As a vanilla css file it gets picked up by the meteor build pipeline, versioned and hot-reloaded.

But the hot-reload isn't so hot. If we edit the scss file nothing happens.

> Once you have npm run sripts, every problem looks like an npm run script problem.
_@olizilla_ 3rd March 2016

---

**Get Moar tools!**

```shell
npm install --save-dev npm-run-all nodemon
```

- nodemon by @rem - re-run things on change
- npm-run-all by @mysticatea - for running many things

Now whisper the incantations:

```json
"scripts": {
  "start": "meteor run",
  "test": "meteor test-app --driver-package practicalmeteor:mocha",
  "build:css": "node-sass --include-path node_modules main.scss bundle.css",
  "watch:css": "nodemon -e scss -x npm run build:css"
}
```

Where:
- `nodemon` ask `nodemon` to watch for changes in the current directory...
- `-e scss` in files with the `scss` extension...
- `-x npm run build:css` and execute `build:css`

and  `watch:css` is now script alias which we can call like:

```shell
npm run watch:css
```

to auto-build the sass on change with _just_ a

```
npm build:css
npm start
npm watch:css
```

...This is sub-optimal. Let's iterate.

---

Go go gadget `npm-run-all`

```json
"scripts": {
  "start": "npm-run-all build:* --parallel watch:* meteor",
  "meteor": "meteor run",
  "test": "meteor test-app --driver-package practicalmeteor:mocha",
  "build:css": "node-sass --include-path node_modules main.scss bundle.css",
  "watch:css": "nodemon -w client -e scss -x npm run build:css"
}
```


---

A [(╯°□°）╯︵TABLEFLIP](https://tableflip.io) side project for [● Meteor London](http://www.meetup.com/Meteor-London/)


[1]:https://cloud.githubusercontent.com/assets/58871/13501269/e2403c16-e15d-11e5-9ca0-ae5a73bb47d3.png
[2]:http://36.media.tumblr.com/1e63026e4211a6e7711fe95d5ff6b13e/tumblr_inline_nn489p271Z1t68bpr_500.png
[3]:http://wp.production.patheos.com/blogs/friendlyatheist/files/im/qiaVKwS.png
[4]:https://cloud.githubusercontent.com/assets/58871/13508865/b98fe38e-e180-11e5-8f8f-3ac925f5784c.png
[5]:http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm