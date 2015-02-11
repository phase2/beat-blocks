var assert = require('assert');
var junkDrawer = require('../../src/util/junk-drawer');

describe("Junk Drawer", function() {
  describe("Smoke tests", function() {
    it("expects isNode to be a method", function() {
      assert.equal(typeof junkDrawer.isNode, "function");
    });
  });
});
