"use strict";

/**
 * @file: Configuration object. Allows for getting and setting of various properties.
 */

var _ = require("lodash");

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
