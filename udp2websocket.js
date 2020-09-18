#!/usr/bin/env node

/************************************************************************
 * 
 * Author: Mohammad Said Hefny (mohammad.hefny@gmail.com)
 * Date:   Sep 2020
 * 
 * This tool enables you to connect your webpage with a udp connection. 
 * Hence UDP has not been directly supported from javascript yet, 
 * this tool creates a bi-directional channel between weboscket & udp.
 * 
 */

'use strict';
let webSocket = require ('./websocket.js');
let udp = require ('./udpclient.js');
let program = require('commander');
var pjson = require('./package.json');

var {mavlink20, MAVLink20Processor} = require('./mavlink');
var m_MAVLinkProcessor= new MAVLink20Processor();

program
  .version(pjson.version)
  //.option('-h --html_port <port>', 'port number that your html code will connect to',8811)
  //.option('-u --udp_ip <ip address>', 'IP of UDP Listener', '0.0.0.0')
  .option('-p --udp_target_port <port number>', 'Mission Planner UDP Port', 16450)
  .parse(process.argv);

console.log ('Welcome to Andruav Web-Connector Telemetry version ' + pjson.version );
console.log('Listen to MAVlink at :' + program.udp_target_port);
udp.startServer ("0.0.0.0",program.udp_target_port);
webSocket.connect("127.0.0.1",8811);

webSocket.onMessageReceived = function (message)
{
   // console.log ("from WS: " + message)

    udp.sendMessage (message);
};

udp.onMessageReceived = function (message)
{
    try
    {
      var res = m_MAVLinkProcessor.decode(message);
      var data = null;
      const c_header = res.header ;
      if (c_header.msgId== 30) //'ATTITUDE'
      {
        data = 
        {
          src  : c_header.srcSystem,
          id    : 30,
          roll  : res.roll,
          pitch : res.pitch,
          yaw   : res.yaw,
        };
      }
      else 
      if (c_header.msgId == 24) //'GPS RAW'
      {
        data = 
        {
          src  : c_header.srcSystem,
          id   : 24,
          lat  : res.lat,
          lng  : res.lng,
          alt  : res.alt,
        };
      }
      else 
      if (c_header.msgId == 0) //'HEARTBEAT'
      {
        data = 
        {
          src  : c_header.srcSystem,
          id   : 0,
          type : res.type,
        };
      }
      else 
      if (res.header.msgId == 32) //'MAVLINK_MSG_ID_LOCAL_POSITION_NED'
      {
        data = 
        {
          src  : c_header.srcSystem,
          id   : 32,
          x : res.x,
          y : res.y,
          z : res.z
        };
      }
      
      if (data != null) 
      {
        webSocket.sendMessage (JSON.stringify(data));
        //console.log (data);
      }
      
    }
    catch (e)
    {
      console.log(e);
        return ;
    }

    
};


console.log ('UDP <------> WebSocket Adapter');

