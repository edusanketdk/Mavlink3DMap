#!/bin/bash

xterm -title "UDP2WebSocket"  -e "node udp2websocket.js" &

xterm -title "ffmpegServer"  -e "node ffmpegServer.js" &

pushd static

xterm -title "Mavlink3DMap"  -e "http-server" &

popd
