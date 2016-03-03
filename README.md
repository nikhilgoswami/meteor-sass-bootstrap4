# meteor-sass-bootstrap4

**Meteor 1.3 + sass + bootstrap4 the npm way.**

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
npm install --save bootstrap@4.0.0-alpha.2
```

now we've got a `node_modules` directory for our npm dependecies, and in it a `bootstrap` directory filled with the latest in startup-scaffoldware:

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



---

A [(╯°□°）╯︵TABLEFLIP](https://tableflip.io) side project for [● Meteor London](http://www.meetup.com/Meteor-London/)