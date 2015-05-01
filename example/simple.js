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

BeatBlocks.addWidgetToRegistry("image", ImageComponent);
