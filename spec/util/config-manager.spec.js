var assert = require('assert');
var Config = require('../../src/util/config-manager');

describe("Config Manager", function() {
  describe("Smoke tests", function() {
    var config;
    beforeEach(function() {
      config = Config();
    });
    it("expects config object to exist", function() {
      assert.ok(config);
    });
    it("expects .config() method to exist", function() {
      assert.ok(config.config);
    });
    it("expects .has() method to exist", function() {
      assert.ok(config.has);
    });
    it("expects .list() method to exist", function() {
      assert.ok(config.list);
    });
  });

  describe(".config()", function() {
    var config;
    beforeEach(function() {
      config = Config();
    });

    it("Expects a call to the base function to call .config", function() {
      config({"foo": "bar"});
      assert.deepEqual(config(), {"foo": "bar"});
    });

    it("Expects .config() to return an empty object if nothing has been set", function() {
      assert.deepEqual(config.config(), {});
    });

    it("Expects .config() to return current config object after something has been set", function() {
      config.config({foo: "bar"});
      assert.deepEqual(config.config(), {foo: "bar"});
    });

    it("Expects .config('foo') to return the current config for 'foo'", function() {
      config.config({foo: "bar"});
      assert.equal(config.config('foo'), "bar");
    });

    it("Expects .config('foo', 'bar') to set 'foo' to 'bar'", function() {
      config.config('foo', 'bar');
      assert.equal(config.config('foo'), "bar");
    });

    it("expects separate instances to have different configs", function() {
      var foo = Config();
      var bar = Config();

      foo.config({"foo": "foo"});
      bar.config({"bar": "bar"});

      assert.notDeepEqual(foo.config(), bar.config());
    });

    it("expects config('foo.bar') to return a deep reference to foo.bar data", function() {
      var foo = Config();
      foo.config({
        "foo": {
          "bar": "baz"
        }
      });

      assert.equal(foo.config("foo.bar"), "baz");
    });

    it("expects config('foo[0].bar') to return a deep reference to foo[0].bar data", function() {
      var foo = Config();
      foo.config({
        "foo": [
          {
            "bar": "baz"
          }
        ]
      });

      assert.equal(foo.config("foo[0].bar"), "baz");
    });
  });
  describe(".has()", function() {
    var config;
    beforeEach(function() {
      config = Config();
    });

    it ("Expects .has() to return true if a value exists", function() {
      config.config({"foo": "foo"});
      assert.ok(config.has("foo"));
    });

    it ("Expects .has() to return false if a value does not exists", function() {
      assert.ok(!config.has("foo"));
    });
  });
});