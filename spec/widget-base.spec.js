"use strict";

var assert = require('assert');
var WidgetBase = require('../src/widget-base');

var widgetbase = new WidgetBase();

describe("WidgetBase", function() {
  describe("Smoke tests", function() {
    it("expects WidgetBase to exist", function() {
      assert.ok(widgetbase);
    });
    it("expects WidgetBase.config to be a method", function() {
      assert.equal(typeof widgetbase.config, "function");
    });
    it("expects WidgetBase.template to be a method", function() {
      assert.equal(typeof widgetbase.template, "function");
    });
    it("expects WidgetBase.render to be a method", function() {
      assert.equal(typeof widgetbase.render, "function");
    });
    it("expects WidgetBase.compile to be a method", function() {
      assert.equal(typeof widgetbase.compile, "function");
    });
    it("expects WidgetBase.link to be a method", function() {
      assert.equal(typeof widgetbase.link, "function");
    });
  });

  describe(".config()", function() {
    var widgetBase;

    beforeEach(function(done) {
      widgetBase = new WidgetBase();
      done();
    });

    it("expects to be able to set config data", function() {
      var newConfig = {'foo': 'bar'};
      assert.deepEqual(widgetBase.config(), {});
      widgetBase.config(newConfig);
      assert.deepEqual(widgetBase.config(), newConfig);
    });

    it("expects to be able to override config data", function() {
      var baseConfig = {'foo': 'foo', 'bar': 'bar', 'baz': 'baz'};
      widgetBase.config(baseConfig);
      widgetBase.config({'foo': 'bar'});

      var overriddenConfig = widgetBase.config();
      assert.equal(overriddenConfig.foo, 'bar');
      assert.equal(overriddenConfig.bar, 'bar');
      assert.equal(overriddenConfig.baz, 'baz');
    });

    it("expects separate instances to have different configs", function() {
      var foo = new WidgetBase({'foo': 'foo'});
      var bar = new WidgetBase({'bar': 'bar'});
      assert.notDeepEqual(foo.config(), bar.config());
    });
  });

  describe(".template()", function() {
    var widgetBase;

    beforeEach(function(done) {
      widgetBase = new WidgetBase();
      done();
    });

    it ("expects template called without a template config item defined to throw an error.", function() {
      assert.throws(function() {widgetBase.template();}, /widget template/);
    });
  });
});
