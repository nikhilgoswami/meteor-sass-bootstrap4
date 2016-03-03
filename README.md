# meteor-sass-bootstrap4

**Meteor 1.3 + sass + bootstrap4 the npm way.**

A [(╯°□°）╯︵TABLEFLIP](https://tableflip.io) side project for [● Meteor London](http://www.meetup.com/Meteor-London/)

This project was created by running `meteor create`:

```shell
meteor create --release 1.3-beta.12 sass-boostrap4
```

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

It includes some _"scripts"_ for `start` and `test` which is interesting... we'll circle back and kick them in a minute...

---

Staying on the bleeding edge is a full time job, so let's add `bootstrap4-alpha`, via npm (`v3.7.5` according to my `npm -v`)

```shell
# Get all the existing deps
npm install

# Get bootstrap, scss and all.
npm install --save bootstrap@4.0.0-alpha.2
```

Now we've got a `node_modules` directory for our npm dependecies, and in it a `bootstrap` directory filled with the latest in startup-scaffoldware:

```shell
$ tree -L 3
.
├── README.md
├── node_modules
│   ├── bootstrap
│   │   ├── CHANGELOG.md
│   │   ├── Gruntfile.js
│   │   ├── LICENSE
│   │   ├── README.md
│   │   ├── dist
│   │   ├── grunt
│   │   ├── package.json
│   │   └── scss
```

...and because we added a `--save` flag to `npm install`, it has kindly added record of the fact that our project depends on bootstrap to our `package.json` dependencies

```json
  "dependencies": {
    "bootstrap": "^4.0.0-alpha.2",
    "meteor-node-stubs": "~0.2.0"
  }
```

If we try the first of those npm run scripts with a

```shell
npm start
```

We see the familiar meteor launch sequence. _Why would you use npm start instead of just `meteor run`?_ Well, either is fine. An **npm run script** is just an alias you can configure easily, so:


```json
  "scripts": {
    "start": "meteor run",
    "test": "meteor test-app --driver-package practicalmeteor:mocha"
  }
```

means `npm start` is an alias for `meteor run`. But check out the `test` script... that thing is remembering command line arguments for us. As soon as you need to pass a `--settings settings.json` to your app, you'll be greaful of a short cut like `npm start`

```
"scripts": {
  "start": "meteor run --settings settings.json"
```

Now the app is running, go check it out... http://localhost:3000 in your navigator of choice.

---

![Meteor 1.3 default app screenshot][1]

Oh god. It's not exactly shiny. There is some tests though, so that's good I suppose.

**Where is the boostrap hotness?**

Bootstrap is still all in the node_modules folder where we left it. npm modules don't care about your needs. (npm <3s you, but that's cos they have intense feels and a wombat.)

![npm wombat][2]

Let's upgrade our css to a scss file and have it import bootstrap for us.

```shell
mv sass-bootstrap.css main.scss
echo "@import 'boostrap/scss/boostrap';"
```

And the meteor hot code reload does it's thing, but **[jibbers crabst!][3] where is my boostrap**

Ok, dude, chill out. npm modules do not care about your needs. sass cares about you at least that little too.

[sass](http://sass-lang.com/) is short for _sarsaparilla pre-processor for css_ and we need to encourage it to do some of that sweet pre-processing for us.


---

A [(╯°□°）╯︵TABLEFLIP](https://tableflip.io) side project for [● Meteor London](http://www.meetup.com/Meteor-London/)


[1]:https://cloud.githubusercontent.com/assets/58871/13501269/e2403c16-e15d-11e5-9ca0-ae5a73bb47d3.png
[2]:http://36.media.tumblr.com/1e63026e4211a6e7711fe95d5ff6b13e/tumblr_inline_nn489p271Z1t68bpr_500.png
[3]:http://wp.production.patheos.com/blogs/friendlyatheist/files/im/qiaVKwS.png