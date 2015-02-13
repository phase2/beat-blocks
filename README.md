#Beat Blocks

A helpful scaffolding for building out configurable blocks that describe themselves.

##Global Build Dependencies

- [node/npm](http://nodejs.org/) - For package management
- [grunt](http://gruntjs.com/) - For task management
- [browserify](http://browserify.org/) - For bundling various src files into a single distribution

##Install

In root directory of the repo...

    npm install

##Development

For development, be sure to have `grunt watch` running during development so that the bundled
distribution is built. This also runs a code linter and unit tests on watch.

Other helper grunt commands are

    grunt test - runs lint, complexity checks, and automated tests
    grunt build - compiles a distribution copy of the library

##Widget structure

Widgets have a number of methods that make up a widget object. Understanding what each of these methods do is
helpful in understanding how to create new and unique widgets. It's helpful to examine src/widget-base.js to
get a better understanding of the specifics of how widgets behave.

At their core, a widget is a template file and a simple javascript object.

###Helpful methods

- .config() - Widget configuration get/setter
  Accepts 0, 1 or 2 parameters

  .config() - Returns the configuration of a widget as an object.
  .config(obj value) - Sets multiple config options, returns the full configuration of the widget as an object.
  .config(string key) - Returns the configuration of setting defined by the key of `string.`
  .config(string key, string|object value) - Sets the configuration for `key` to the value of `value`.

- .render(element) - Renders a widget where at a particular DOM element. Element can either be a string (CSS selector)
  or a DOMElement.

- .compile() - This method handles preparation of any configuration variables before rendering into a template. Override this
  method in your custom widgets if you want to load any external data into your template, or generate any additional
  content for your template before rendering.

- .link() - This method handles any event reactions or DOM manipulation that needs to happen after the initial DOM render.
  Override this method in your custom widgets to define your own js behaviors.

- .template() - The actual rendering method for a widget. By default, widgets use Handlebars.js for templating purposes.

##Creating a new widget

The rw-widget library allows for developers to create additional widgets that can be registered to the library.
Check the exapmle/custom-widget.html file for an example of how to define a custom widget.
