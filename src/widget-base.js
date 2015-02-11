"use strict";

/**
 * @file: Contains the base functionality that we want with all widgets.
 */

var d3 = require("d3"),
    Handlebars = require("handlebars");

var configManager = require("./util/config-manager");
var junkDrawer = require("./util/junk-drawer");

/**
 * Constructor.
 * @param opts
 *   Options to pass to .config()
 */

var widgetBase = function(opts) {
  this._config = configManager();

  if (opts) {
    this.config(opts);
  }
};

/**
 * Config get/setter
 * @param [opts] - Options for config.
 * @returns {*}
 *   .config() - Returns config object.
 *   .config(obj) - Returns this for chaining.
 */

widgetBase.prototype.config = function() {
  var _return = this._config.apply(this, arguments);

  // chainable
  return (_return) ? _return : this;
};

widgetBase.prototype.has = function(key) {
  return this._config.has(key);
};

/**
 * Main render method. This should be the primary method that devs use
 * to trigger a component render.
 *
 * @param selector (string) - See https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors
 * for valid css selectors.
 *
 * @return - Nothing
 */

widgetBase.prototype.render = function(selector) {
  var elements = d3.selectAll(selector);
  var widget = this;

  this._compile(elements, function() {
    if (!junkDrawer.isNode()) {
      widget.link(elements);
    }
  });
};

widgetBase.prototype._compile = function(elements, next) {
  var config = this.config();
  var that = this;
  if (config.configFile) {
    d3.json(config.configFile, function(e, res) {
      for (var key in res) {
        that.config(key, res[key]);
      }
      that.compile(elements, next);
    });
  } else {
    this.compile(elements, next);
  }
};

/**
 * Renders the markup of a widget. Should only be used to set the initial state
 * of a widget. See .link() for ways to add interactivity to component.
 *
 * As a convention, this code should be runnable both server-side and in the browser.
 * Only override if you need to adjust how the markup is being processed.
 *
 * @param elements - D3 object with pre-selected elements.
 * @param next
 */

widgetBase.prototype.compile = function(elements, next) {
  this.template(function(content) {
    elements
      .classed("config-block-processed", true)
      .html(content);

    next();
  });
};

/**
 * Provides a way to adjust a component after initial rendering. This method should be
 * overridden whenever a component needs to provide interactivity.
 *
 * @param elements - D3 object with pre-selected elements.
 */

widgetBase.prototype.link = function(elements) {};

/**
 * Default templating method. Uses Handlebars (http://handlebarsjs.com/) to render
 * content. Functionality differs depending on what's being passed in via the
 * config.template option.
 *
 * Note that you probably shouldn't load this directly, but instead rely on the render method.
 *
 * If config.template is a method, the template is assumed to be a pre-compiled
 * Handlebars template (see http://handlebarsjs.com/precompilation.html)
 *
 * If config.template is a string, and it starts with a '#', the template is assumed
 * to be an inline template inside a script tag and loaded from there.
 *
 * Otherwise, config.template is assumed to be a url and the template is loaded from
 * the external file.
 *
 * @param callback - A method to call once the Handlebars template method is prepared.
 */

widgetBase.prototype.template = function(callback) {
  var config = this.config();

  if (config.template) {
    if (typeof config.template === "function") {
      callback(config.template(config));
    } else {
      if (config.template.charAt(0) === "#") {
        var content = d3.select(config.template).html();
        var template = Handlebars.compile(content);
        callback(template(config));
      } else {
        d3.text(config.template, function(res) {
          var template = Handlebars.compile(res);
          callback(template(config));
        });
      }
    }
  } else {
    throw new Error("No widget template specified.");
  }
};

module.exports = widgetBase;
