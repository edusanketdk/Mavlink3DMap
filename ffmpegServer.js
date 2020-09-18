"use strict";

var WebSocketServer = require('ws').Server;
const child_process = require('child_process');
var wsS;
var Me = this;

function connect (host,port)
{
    wsS = new WebSocketServer(
    {
        host: host,
        port: port
    }); // start websocket server
    console.log ("WebSocket Listener at " + host + ":" + port);
    wsS.on('connection', onConnect_Handler);

}



function sendMessage (message)
{
    if (Me.ws != null)
    {
        try
        {
            
            Me.ws.send (message , {binary: false});
        }
        catch (e)
        {
            Me.ws = undefined;
        }
    }

}

function onConnect_Handler(ws)
{
     Me.ws = ws;

     const ffmpeg = child_process.spawn('ffmpeg', [
        '-i','-',
        '-r', '5',
  
        // video codec config: low latency, adaptive bitrate
        //'-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'zerolatency',
  
        //force to overwrite
        //'-y',
  
  
        '-vcodec', 'rawvideo',
        //'-strict', 'experimental',
        //'-bufsize', '1000',
        '-filter_complex' ,'nullsrc=size=640x480 [base]; [0:v]  setpts=PTS-STARTPTS, scale=640x480 [left]; [base][left] overlay=shortest=1,format=yuyv422',
        '-f', 'v4l2', '/dev/video3'
      ]);

     // Kill the WebSocket connection if ffmpeg dies.
     ffmpeg.on('close', (code, signal) => {
        console.log('FFmpeg child process closed, code ' + code + ', signal ' + signal);
        if (ws==null) return ;
        ws.terminate();
      });


      // FFmpeg outputs all of its messages to STDERR. Let's log them to the console.
      ffmpeg.stderr.on('data', (data) => {
        try
        {
        ws.send('ffmpeg got some data');
        }
        catch 
        {
            return ;
        }
        //console.log('FFmpeg STDERR:', data.toString());
      });

     console.log("WebSocket Listener Active"); 
     ws.on('message', message => {
        if (Buffer.isBuffer(message)) {
            //console.log('this is some video data');
            ffmpeg.stdin.write(message);
        } else {
            console.log(message);
        }
      });

      ws.on('close', e => {
        ffmpeg.kill('SIGINT');
        ffmpeg == null;
        ws = undefined;
      });

      ws.on('error', e => {
        console.error('onWsError: Client #%d error: %s', ws.id, JSON.stringify(err));

        });


}


connect("127.0.0.1",8812);