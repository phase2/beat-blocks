"use strict";

var Handlebars = require("handlebars"),
    moment = require("moment");

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
