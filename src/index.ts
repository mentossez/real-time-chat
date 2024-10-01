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
   const payload = parsedMessage.payload;
   if (parsedMessage.type === SupportedMessage.JoinRoom) {
      userManager.addUser(payload.name, payload.userId, payload.roomId, connection);
   }
   if (parsedMessage.type === SupportedMessage.SendMessage) {
      const user = userManager.getUser(payload.userId, payload.roomId);
      if (!user) {
         console.log("User not found");
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
   if (parsedMessage.type === SupportedMessage.UpdateMessage) {
      let chat;
      if (payload.isDismissed) {
         chat = inMemoryStore.dismissChat(payload.roomId, payload.chatId);
      } else {
         chat = inMemoryStore.upvote(payload.roomId, payload.userId, payload.chatId);
      }
      const messagePayload: OutGoingMessage = {
         type: OutGoingSupportedMessage.UpdateChat,
         payload: {
            roomId: payload.roomId,
            chatId: payload.chatId,
            upvotes: chat?.upvotes.length,
            isDismissed: chat?.isDismissed ?? false
         }
      };
      const updateMsg = messagePayload.payload.isDismissed ? 'dismissed' : 'upvoted';
      console.log(`user(${payload.userId}) ${updateMsg} chat(${payload.chatId}) in room(${payload.roomId})`);
      userManager.broadcast(payload.roomId, payload.userId, messagePayload);
   }
}
