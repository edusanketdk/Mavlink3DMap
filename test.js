"use strict";
var jspack = require("jspack").jspack
var mavlink2 = require('./mavlink2');
var MAV2 = new MAVLink(null,1,1);

var msg = new mavlink2.messages['heartbeat']();
//mav.send(msg);

var b = msg.pack(MAV2);
var c = MAV2.decode(b);
for (var i=0;i< b.length;++i)
{
    var c = MAV2.decode(b[i]);
}
