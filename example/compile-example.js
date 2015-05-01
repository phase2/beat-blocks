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



ImageComponent.prototype.compile = function(elements, next) {
  var title = this.config('title');
  this.config('title', title.toUpperCase());
  console.log(this.config('title'));

  this.template(function(content) {
    elements
      .html(content);

    next();
  });
};

BeatBlocks.addWidgetToRegistry("image", ImageComponent);
