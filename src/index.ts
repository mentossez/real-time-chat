import { server as WebSocketServer, request as WebSocketRequest, connection as WebSocketConnection, connection } from 'websocket';
import * as http from 'http';
import { IncomingMessage, SupportedMessage } from './messages/incomingMessages';
import { SupportedMessage as OutGoingSupportedMessage } from './messages/outgoingMessages';
import { UserManager } from './UserManager';
import { InMemoryStore } from './store/InMemoryStore';
import { OutGoingMessage } from './messages/outgoingMessages';

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
   console.log("inside on");
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
});

function messageHandler(message: string, connection: connection) {
   const parsedMessage = JSON.parse(message);
   console.log(parsedMessage);
   if (parsedMessage.type === SupportedMessage.JoinRoom) {
      const payload = parsedMessage.payload;
      console.log("user added " + message);
      userManager.addUser(payload.name, payload.userId, payload.roomId, connection);
   }
   if (parsedMessage.type === SupportedMessage.SendMessage) {
      const payload = parsedMessage.payload;
      const user = userManager.getUser(payload.userId, payload.roomId);
      if (!user) {
         console.log("User not found in db");
         return;
      }
      const chat = inMemoryStore.addChat(payload.roomId, payload.userId, user.name, payload.message);
      const messagePayload: OutGoingMessage = {
         type: OutGoingSupportedMessage.AddChat,
         payload: {
            roomId: payload.roomId,
            message: payload.message,
            chatId: chat?.id,
            name: user.name,
            upvotes: 0
         }
      };
      userManager.broadcast(payload.roomId, payload.userId, messagePayload);
   }
   if (parsedMessage.type === SupportedMessage.UpvoteMessage) {
      const payload = parsedMessage.payload;
      const chat = inMemoryStore.upvote(payload.roomId, payload.userId, payload.chatId);
      const messagePayload: OutGoingMessage = {
         type: OutGoingSupportedMessage.UpdateChat,
         payload: {
            roomId: payload.roomId,
            chatId: payload.chatId,
            upvotes: chat?.upvotes.length
         }
      };
      console.log("outgoing upload message " + JSON.stringify(messagePayload));
      userManager.broadcast(payload.roomId, payload.userId, messagePayload);
   }
}
