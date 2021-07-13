<p align="center">
  <img src="https://github.com/chaance/new-component/blob/master/docs/logo@2x.png?raw=true" width="285" height="285" alt="new-component logo">
  <br>
  <a href="https://www.npmjs.org/package/@chancedigital/new-component"><img src="https://img.shields.io/npm/v/@chancedigital/new-component.svg?style=flat" alt="npm"></a>
</p>

# `@chancedigital/new-component`

### Simple, customizable utility for adding new React components to your project.

<img src="https://github.com/chancestrickland/new-component/blob/master/docs/divider@2x.png?raw=true" width="888" height="100" role="presentation">

Anyone else sick of writing the same component boilerplate, over and over?

This project is a globally-installable CLI for adding new React components. It's dead simple to use, and requires no configuration, although it's easy to customize it to fit your project's coding style.

<br />

## Features

- Simple CLI interface for adding various flavors of React components:
  - Function components
  - Components with forwarded refs\*
  - `React.Component` class
  - `React.PureComponent` class
- Uses [Prettier](https://github.com/prettier/prettier) to stylistically match the existing project.
- Offers global config, which can be overridden on a project-by-project basis.
- Colorful terminal output!
- Now supports TypeScript!\*

\* Supported as-of version 2.0

<hr />

## Quickstart

```bash
# Using Yarn:
$ yarn global add @chancedigital/new-component

# or, using NPM
$ npm i -g @chancedigital/new-component
```

`cd` into your project's directory, and try creating a new component:

<p align="center">
  <img src="https://github.com/chancestrickland/new-component/blob/master/docs/demo.gif?raw=true" width="888" height="369" alt="demo of CLI functionality">
</p>

By default, the new component will be created in the `src/components` directory relative to the directory from which the command is run, but you have a few options.

If you pass the `--index` argument, the component will be saved along with its stylesheet and an `index` file in its own sub-directory. This might be useful if you are building a particularly large component with multiple sub-files and you feel better organizing things this way. **Prior to version 2 this was the default behavior, but I generally prefer flat folder structures so this is now opt-in.**

Your project will now have a new directory at `src/components/Button`. This directory has two files:

<br />

## Configuration

Configuration can be done three different ways:

- Creating a global `.new-component-config.json` in your home directory (`~/.new-component-config.json`).
- Creating a local `.new-component-config.json` in your project's root directory.
- Command-line arguments.

The resulting values are merged, with command-line values overwriting local values, and local values overwriting global ones.

<br />

## API Reference

### Type

Control the type of component created:

- `functional` for a functional component (_default_),
- `forward-ref` for a functional component with a forwarded ref,
- `class` for a traditional `Component` class, or
- `pure-class` for a `PureComponent` class,

**Usage:**

Command line: `--type <value>` or `-t <value>`

JSON config: `{ "type": <value> }`
<br />

### Directory

Controls the desired directory for the created component. Defaults to `src/components`

**Usage:**

Command line: `--dir <value>` or `-d <value>`

JSON config: `{ "dir": <value> }`
<br />

### Style

Controls the type of style file created for the component:

- `css` (_default_),
- `scss`,
- `less`,
- `stylus`,
- `module.css`,
- `module.scss`, or
- `NONE` for no stylesheet

**Usage:**

Command line: `--style <value>` or `-s <value>`

JSON config: `{ "style": <value> }`
<br />

### File Extension

Controls the file extension for the created components. Can be either `js` (_default_) or `tsx` for TypeScript components.

**Usage:**

Command line: `--extension <value>` or `-x <value>`

JSON config: `{ "extension": <value> }`
<br />

### Index

Controls whether or not the component is created in its own sub-directory with an `index` file. Defaults to `false`.

**Usage:**

Command line: `--index` or `-i`

JSON config: `{ "index": true|false }`
<br />

### Prettier Config

Delegate settings to Prettier, so that your new component is formatted as you'd like. Defaults to Prettier defaults.

For a full list of options, see the [Prettier docs](https://github.com/prettier/prettier#options).

**Usage:**

Command line: N/A (Prettier config is only controllable through JSON)

JSON config: `{ "prettierConfig": { "key": "value" } }`
<br />

**Example:**

```js
{
  "prettierConfig": {
    "singleQuote": true,
    "semi": false,
  }
}
```

<br />

## Platform Support

This has only been tested in macOS. I think it'd work fine in linux, but I haven't tested it. Windows is a big question mark (would welcome contributions here!).

<br />

## TODO

This is a brand new thing! I'd like to add more functionality:

- Built-in support for more style tools (Aphrodite, styled-components, etc).
- Better error messaging, more edge-case support
- Editor integrations :o

## Development

To get started with development:

- Check out this git repo locally; you will need to ensure you have `npm` installed globally.
- In the folder run `npm install`
- Check that command runs `node ../new-component/src/index.js --help`
- Alternatively you can set up a symlink override by running `npm link` then `new-component --help`. Note: this will override any globally installed version of this package.
