import { server as WebSocketServer, request as WebSocketRequest, connection as WebSocketConnection } from 'websocket';
import * as http from 'http';

const server = http.createServer((request: any, response: any) => {
   console.log(`${new Date()} Received request for ${request.url}`);
   response.writeHead(404);
   response.end();
});

server.listen(8080, () => {
   console.log(`${new Date()} Server is listening on port 8080`);
});

const wsServer = new WebSocketServer({
   httpServer: server,
   autoAcceptConnections: false
});

function originIsAllowed(origin: string): boolean {
   // put logic here to detect whether the specified origin is allowed.
   return true;
}

wsServer.on('request', (request: WebSocketRequest) => {
   if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log(`${new Date()} Connection from origin ${request.origin} rejected.`);
      return;
   }

   const connection: WebSocketConnection = request.accept('echo-protocol', request.origin);
   console.log(`${new Date()} Connection accepted.`);

   connection.on('message', (message: any) => {
      if (message.type === 'utf8') {
         console.log(`Received Message: ${message.utf8Data}`);
         connection.sendUTF(message.utf8Data);
      } else if (message.type === 'binary') {
         console.log(`Received Binary Message of ${message.binaryData.length} bytes`);
         connection.sendBytes(message.binaryData);
      }
   });

   connection.on('close', (reasonCode: any, description: any) => {
      console.log(`${new Date()} Peer ${connection.remoteAddress} disconnected.`);
   });
});
