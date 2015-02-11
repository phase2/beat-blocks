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
