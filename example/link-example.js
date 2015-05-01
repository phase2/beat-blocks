"use strict";

var WidgetBase = BeatBlocks.helpers.widgetBase;

var ImageComponent = function(opts) {
  var config = {
    title: "",
    image: "",
    alt: "",
    caption: ""
  };

  opts = (opts) ? opts : {};

  config = _.defaults(opts, config);
  WidgetBase.call(this, config);
};

ImageComponent.prototype = new WidgetBase();

ImageComponent.prototype.link = function(elements) {
  var dateFormatter = d3.time.format('%c');
  elements.select('.date').text('Today\'s date: ' + dateFormatter(new Date()));
  setInterval(function() {
    elements.select('.date').text('Today\'s date: ' + dateFormatter(new Date()));
  }, 1000);
};

BeatBlocks.addWidgetToRegistry("image", ImageComponent);
