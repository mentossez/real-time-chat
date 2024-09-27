import { connection } from "websocket";
import { OutGoingMessage } from "./messages/outgoingMessages";

export interface User {
   id: string;
   name: string;
   connection: connection;
}

interface Room {
   roomId: string;
   users: User[];
}

export class UserManager {
   private rooms: Map<string, Room>;

   constructor() {
      this.rooms = new Map<string, Room>();
   }

   addUser(name: string, userId: string, roomId: string, ws: connection) {
      if (!this.rooms.get(roomId)) {
         this.rooms.set(roomId, {
            roomId: roomId,
            users: []
         });
      }
      this.rooms.get(roomId)?.users.push({
         id: userId,
         name,
         connection: ws
      });
      console.log(`${name}(${userId}) joined in room(${roomId})`);
      ws.on('close', () => {
         this.removeUser(userId, roomId);
      });
   }

   removeUser(userId: string, roomId: string) {
      const users = this.rooms.get(roomId)?.users;
      const user = users?.find(user => user.id === userId);
      users?.filter(user => user.id !== userId);
      console.log(`${user?.name} disconnected!`);
   }

   getUser(userId: string, roomId: string) {
      return this.rooms.get(roomId)?.users.find(user => user.id === userId) ?? null;
   }

   broadcast(roomId: string, userId: string, message: OutGoingMessage) {
      const room = this.rooms.get(roomId);
      if (!room) {
         console.log("Room not found");
         return;
      }
      const user = this.getUser(userId, roomId);
      if (!user) {
         console.log("User not found");
         return;
      }
      room.users.forEach(({ connection, id }) => {
         connection.sendUTF(JSON.stringify(message))
      });
   }
}