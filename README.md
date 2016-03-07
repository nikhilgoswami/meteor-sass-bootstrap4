# Meteor 1.3 + sass + bootstrap4: the npm way.

 A [(╯°□°）╯︵TABLEFLIP](https://tableflip.io) side project for [● Meteor London](http://www.meetup.com/Meteor-London/)

## TL;DR

**Meteor 1.3 has first class npm support. [npm run scripts][5] are a simple way to add build tools to your work flow.**

## Why?

Meteor has core plugins for working with less & stylus. Sass support isn't as up to date. Bootstrap 4 has moved to sass. At the time of writing the Meteor scss plugin doesn't support importing files from npm _or_ meteor packages.

If you want a nice setup where you can customise the core bootstrap 4 variables and have it re-build on demand, you're either going to have to upgrade the meteor scss compiler (I spent a 4 hours on it and gave up) or find your own way.

I've found [npm run scripts][5] super helpful on other projects. Setting them up to rebuild on change is painless. More importantly, there is very little magic involved so you can fit it all in your head; reuse the patterns to add other build steps; and use the knowledge on non-meteor projects too.

## How?

Meteor already compiles, minifies, versions and hot reloads your css files, so that's all covered. On this quest, we want to:

- Depend on the bootstrap source files, in a way we can import them into our project.
- A **build** step that'll run the sass compiler to create the css.
- A **watch** step that'll re-build the css when we change the scss, so dev is still fun.
- For bonus marks we'll add [autoprefixer][6], to add vendor-specific css prefixes for us.
- Pull in the bootstrap js files, for the advanced interactions like drop-downs.
- Grab the whole thing or have the option to whittle it down to what we use.
- Build it all from a single command into deployable bundle.

**Adventure time!** You can follow along or just check the source code in the repo to skip ahead.

This project was created by running `meteor create`

```shell
meteor create --release 1.3-beta.12 sass-bootstrap4
```

<small>The `--release 1.3-beta.12` is used to use the latest 1.3 release before it's out of beta. </small>

That scaffolds out a meteor project skeleton for us:

```shell
tree sass-bootstrap4
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

We see the familiar meteor launch sequence, _but why would you use npm start instead of just `meteor run`?_

Either is fine. An **npm run script** is just an command alias you can configure easily from your package.json.

```json
  "scripts": {
    "start": "meteor run",
    "test": "meteor test-app --driver-package practicalmeteor:mocha"
  }
```

Here, `npm start` is an alias for `meteor run`. Now check out the `test` script. That thing is remembering command line arguments for us. As soon as you need to pass a `--settings settings.json` to your app, you'll find a short cut like `npm start` a helpful way to save a few key strokes.

```
"scripts": {
  "start": "meteor run --settings settings.json"
```

The app should be up and running, go check it out... http://localhost:3000 in your navigator of choice.

---

![Meteor 1.3 default app screenshot][1]

It's not shiny yet. Bootstrap is still all in the node_modules folder where we left it. npm modules don't care about your needs. (npm <3s you, but that's cos they have intense feels and a wombat.)

![npm wombat][2]

**Tuck your brain in and put your safety goggles on. We are now going to make it work.**

## build:css

Upgrade the css to a scss file called `main.scss`. In it, we'll override a variable, and then import the all the bootstrap styles:

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

By adding `--include-path node_modules` we configure node-sass to check the node_modules dir when it encounters an `@import` statement. Open a new terminal, and run `build:css`

```shell
$ npm run build:css

> sass-bootstrap4@0.0.1 build:css /Users/oli/Code/tableflip/meteor-sass-bootstrap4
> node-sass --include-path node_modules main.scss bundle.css

Rendering Complete, saving .css file...
Wrote CSS to /Users/oli/Code/tableflip/meteor-sass-bootstrap4/bundle.css
```

![][4]

:tada: SUCCESS! The tell-tale bootstrap font-stack is evident and our body background color is hotpink.

We have a `bundle.css` that is derived from our `main.scss`. Add `bundle.css` to your `.gitignore` file.

The css file it gets picked up by the regular meteor build pipeline, versioned and hot-reloaded. But if we edit the .scss file nothing happens. Nothing is watching our main.scss for edits...

> Once you have an npm run sript, every problem looks like an npm run script problem.

<small>_@olizilla_ 3rd March 2016</small>

## watch:css

[`nodemon`][6] is the tool of choice for running commands when a file changes.

```shell
npm install --save-dev nodemon
```

We'll use it to add the `watch:css` script

```json
"scripts": {
  "start": "meteor run",
  "test": "meteor test-app --driver-package practicalmeteor:mocha",
  "build:css": "node-sass --include-path node_modules main.scss bundle.css",
  "watch:css": "nodemon -e scss -x npm run build:css"
}
```

Where:
- `nodemon`: watch for changes in the current directory...
- `-e scss`: in files with the `scss` extension...
- `-x npm run build:css`: execute `build:css` on change.


noe we can run the project and auto-build the css on change with _just_ a

```
npm build:css
npm start
npm watch:css
```

...But that is far too much faff. Let's iterate.

## npm-run-all

When you want to run multiple steps sequentially, or in parallel from a single script, [`npm-run-all`][7] is your friend

```json
"scripts": {
  "start": "npm-run-all build:* --parallel watch:* meteor",
  "meteor": "meteor run",
  "test": "meteor test-app --driver-package practicalmeteor:mocha",
  "build:css": "node-sass --include-path node_modules main.scss bundle.css",
  "watch:css": "nodemon -w client -e scss -x npm run build:css"
}
```

The `meteor` script is now an alias for `meteor run`.

`start` maps to `npm-run-all build:* --parallel watch:* meteor`, which translates to:

> "run all the scripts that start with `build:` in sequence. When they complete, run in `parallel` the `watch:` scripts and the `meteor` script.

Now you can build the scss into css, re-build on change, and run the meteor dev server all in one `npm start`.

**As an aside, if you find yourself running lots of npm scripts, you may find the [ns][9] tool rather handy.**

## autoprefixer

bootstrap 4 assumes you will use [autoprefixer][8] to add vendor specific css aliases, so let's add it

```shell
npm install --save-dev postcss-cli autoprefixer
```

```json
"scripts": {

  "build:css": "node-sass --include-path node_modules main.scss | postcss --local-plugins --use autoprefixer --output bundle.css"
}
```

This looks complicated, but it breaks down into two parts

- `node-sass --include-path node_modules main.scss |` is the same as before, but now we pipe the output to the next command rather than `bundle.css`.
- `postcss --local-plugins --use autoprefixer --output bundle.css` is new, and takes the css piped in, runs autoprefixer on it, and output the result to `bundle.css`

The `--use` is where you can include any other plugins from the PostCSS universe that you might find useful too: https://github.com/postcss/postcss#plugins

With that in place, running `build:css` now outputs customised bootstrap css, with vendor prefixes based on the current recommendations from http://caniuse.com

## require('bootstrap')

To make **all** the Bootstrap javascript plugins available to your app, create a `client/lib/bootstrap/plugins.js` file.

```js
/*
I load up the requried bootstrap plugins, from `node_modules/bootstrap`
*/
Tether = require('tether')
require('bootstrap')
```

you'll also need to install the tether module, as the tooltip component uses it

```shell
npm install tether
```

Your client app will now be able to use toggle buttons, modals, and all the fancy js dependent components.

## Production build

the `meteor` build tool isn't aware or sass build step, so we need to make sure the css is built before creating a deployable bundle. `npm-run-all` comes in handy again:

```
"scripts": {

  "meteor:build": "meteor build",
  "deploy": "npm-run-all build:* meteor:build",
}
```

`deploy` run all our `build:` steps, then runs `meteor:build` to create the deployable production bundle. There are plenty of arguments you might want to add to that step, which you can find by running `meteor help build`

## Optimise

You can later optimise your build to only include the components you use, by being more specific with your `require`.

```js
require('bootstrap/dist/umd/alert.js')
require('bootstrap/dist/umd/button.js')
```

would add just the `alert` and `button` components to be added to your js bundle. We no longer need the tether dependency as `tooltip` isn't required.

You can do a similar thing in your `main.scss`

```scss
// Get the basics
@import "bootsrap/scss/variables";
@import "bootsrap/scss/mixins/hover";
@import "bootsrap/scss/mixins/tab-focus";
@import "normalize";
@import "reboot";

// get specific bootstrap components
@import "bootsrap/scss/_alert"
@import "bootsrap/scss/_button"
```

Because we built the bootstrap integration ourselves, it was easier to figure out how to extend it, what parts are optional, and what we can change later.

We control the versions of node-sass and bootstrap we use, so we can get as close to the bleeding edge as we're comfortable with. Using stable releases would work just as well.

Meteor packages can do a lot of work for you, adding UI widgets and data sync options, but if sass and bootstrap are going to be the core of your UI, then it can be a confidence boost to remove some of the magic and get a little more control over the integration.

---

A [(╯°□°）╯︵TABLEFLIP](https://tableflip.io) side project for [● Meteor London](http://www.meetup.com/Meteor-London/)


[1]:https://cloud.githubusercontent.com/assets/58871/13501269/e2403c16-e15d-11e5-9ca0-ae5a73bb47d3.png
[2]:http://36.media.tumblr.com/1e63026e4211a6e7711fe95d5ff6b13e/tumblr_inline_nn489p271Z1t68bpr_500.png
[3]:http://wp.production.patheos.com/blogs/friendlyatheist/files/im/qiaVKwS.png
[4]:https://cloud.githubusercontent.com/assets/58871/13575136/229930dc-e47f-11e5-8d45-9f96d72123f8.png
[5]:http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm
[6]:https://github.com/remy/nodemon#nodemon
[7]:https://github.com/mysticatea/npm-run-all#npm-run-all
[8]:https://github.com/postcss/autoprefixer
[9]:https://github.com/knownasilya/npm-scripts