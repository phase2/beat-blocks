!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.BeatBlocks=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * @file: Exposes various widgets and utilities to the global
 * context, mostly useful in a browser setting.
 */

// Utilities
require("./util/handlebar-extensions");

// Widgets
var widgetBase = require("./widget-base");

var widgetRegistry = require("./util/config-manager")();

module.exports = {
  widget: function(name, opts) {
    var Widget = widgetRegistry.config(name);
    if (Widget) {
      return new Widget(opts);
    }
    throw new Error("Can't find '" + name + "' widget.");
  },
  addWidgetToRegistry: function(name, widget) {
    widgetRegistry.config(name, widget);
  },
  listWidgets: function() {
    return widgetRegistry.list();
  },
  helpers: {
    widgetBase: widgetBase
  }
};

},{"./util/config-manager":2,"./util/handlebar-extensions":3,"./widget-base":5}],2:[function(require,module,exports){
(function (global){
"use strict";

/**
 * @file: Configuration object. Allows for getting and setting of various properties.
 */

var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var config = function() {
  var _config = {};

  /**
   *
   * @param object
   * @param key
   * @returns {*}
   */

  function stringToRef(object, key) {
    function arrDeref(o, key, i) {
      return !key ? o : (o[key.slice(0, i ? -1 : key.length)]);
    }
    function dotDeref(o, key) {
      return !key ? o : key.split("[").reduce(arrDeref, o);
    }
    return key.split(".").reduce(dotDeref, object);
  }

  /**
   *
   * @param object
   * @param key
   * @returns {*}
   */

  function loadArrayItem(object, key) {
    var originalKey = key,
      items = key.match(/\[[0-9]+\]/i),
      topKey;

    key = items[0];
    topKey = originalKey.replace(key, "");
    key = key.replace("[", "").replace("]", "");

    if (!Array.isArray(object[topKey])) {
      return false;
    }

    object = object[topKey];
    return {
      key: key,
      object: object
    };
  }

  /**
   * Sets a variable in a object, respecting dot and array notation.
   * @param object
   * @param path
   * @param value
   * @returns {*}
   */
  var deepSet = function deepSet(object, path, value) {
    if (typeof path === "string") {
      path = path.split(".");
    }

    if (!(path instanceof Array) || path.length === 0) {
      return false;
    }

    path = path.slice();

    var key = path.shift();

    if (typeof object !== "object" || object === null) {
      return false;
    }

    if (key.indexOf("[") !== -1) {
      var data = loadArrayItem(object, key);
      if (key === false) {
        return false;
      } else {
        key = data.key;
        object = data.object;
      }
    }

    if (path.length === 0) {
      object[key] = value;
    } else {
      if (typeof object[key] === "undefined") {
        object[key] = {};
      }

      if (typeof object[key] !== "object" || object[key] === null) {
        return false;
      }

      return deepSet(object[key], path, value);
    }
  };

  /**
   * @see .config().
   */
  function configMethod() {
    if (arguments.length === 0) {
      return _.cloneDeep(_config);
    }

    if (arguments.length === 1) {
      if (_.isObject(arguments[0])) {
        _config = _.defaults(arguments[0], _config);
        return _.cloneDeep(_config);
      } else if (_.isString(arguments[0])) {
        return stringToRef(_config, arguments[0]);
      }
    }

    if (arguments.length === 2) {
      return (deepSet(_config, arguments[0], arguments[1])) ? _.cloneDeep(_config) : false;
    }
  }

  /**
   * Shortcut method for .config().
   * @see .config();
   */
  var myConfig = function() {
    return configMethod.apply(this, arguments);
  };

  /**
   * Config get/setter
   * @param - Accepts 0, 1 or 2 parameters
   *
   * .config() - Load config object.
   * .config(obj) - Sets multiple config options.
   * .config(string) - Loads a single config item based on key
   * .config(string, string) - Sets a string
   *
   * @returns {*}
   *   .config() - Returns object.
   *   .config(obj) - Returns resulting config object.
   *   .config(string) - Returns single config object.
   *   .config(string, string) - Returns resulting config object.
   */
  myConfig.config = function () {
    return configMethod.apply(this, arguments);
  };

  /**
   *
   * @param key
   * @returns {*|boolean}
   */
  myConfig.has = function(key) {
    return (stringToRef(_config, key)) ? true : false;
  };

  /**
   *
   * @returns {*}
   */
  myConfig.list = function() {
    return _.keys(_config);
  };

  return myConfig;
};

module.exports = config;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
"use strict";

var Handlebars = (typeof window !== "undefined" ? window.Handlebars : typeof global !== "undefined" ? global.Handlebars : null),
    moment = (typeof window !== "undefined" ? window.moment : typeof global !== "undefined" ? global.moment : null);

//  format an ISO date using Moment.js
//  http://momentjs.com/
//  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
//  usage: {{#dateFormat creation_date format="MMMM YYYY"}}
Handlebars.registerHelper("dateFormat", function(context, block) {
  if (global.moment) {
    var f = block.hash.format || "MMM Do, YYYY";
    var myDate = new Date(context);
    return moment(myDate).format(f);
  } else {
    return context;   //  moment plugin not available. return data as is.
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
"use strict";

/**
 * @file
 *
 * Utility functions/methods that don't fit anywhere else.
 */


var isNode = function() {
  return window === undefined;
};

module.exports = {
  isNode: isNode
};

},{}],5:[function(require,module,exports){
(function (global){
"use strict";

/**
 * @file: Contains the base functionality that we want with all widgets.
 */

var d3 = (typeof window !== "undefined" ? window.d3 : typeof global !== "undefined" ? global.d3 : null),
    Handlebars = (typeof window !== "undefined" ? window.Handlebars : typeof global !== "undefined" ? global.Handlebars : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./util/config-manager":2,"./util/junk-drawer":4}]},{},[1])(1)
});