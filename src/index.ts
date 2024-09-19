import { server as WebSocketServer, request as WebSocketRequest, connection as WebSocketConnection, connection } from 'websocket';
import * as http from 'http';
import { IncomingMessage, SupportedMessage } from './messages/incomingMessages';
import { UserManager } from './store/UserManager';
import { InMemoryStore } from './InMemoryStore';

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

const userManager = new UserManager();
const inMemoryStore = new InMemoryStore();

function originIsAllowed(origin: string): boolean {
   return true;
}

wsServer.on('request', (request: WebSocketRequest) => {
   if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log(`${new Date()} Connection from origin ${request.origin} rejected.`);
      return;
   }

   const connection: WebSocketConnection = request.accept('echo-protocol', request.origin);
   console.log(`${new Date()} Connection accepted.`);

   connection.on('message', (message: any) => {
      if (message.type === 'utf8') {
         messageHandler(message.utf8Data, connection);
      }
   });

   connection.on('close', (reasonCode: any, description: any) => {
      console.log(`${new Date()} Peer ${connection.remoteAddress} disconnected.`);
   });
});

function messageHandler(message: IncomingMessage, connection: connection) {
   if (message.type === SupportedMessage.JoinRoom) {
      const payload = message.payload;
      userManager.addUser(payload.name, payload.userId, payload.roomId, connection);
   }
   if (message.type === SupportedMessage.SendMessage) {
      const payload = message.payload;
      const user = userManager.getUser(payload.userId, payload.roomId);
      if (!user) {
         console.log("User not found in db");
         return;
      }
      inMemoryStore.addChat(payload.roomId, payload.userId, user.name, payload.message);
   }
   if (message.type === SupportedMessage.UpvoteMessage) {
      const payload = message.payload;
      inMemoryStore.upvote(payload.roomId, payload.userId, payload.chatId);
   }
}
