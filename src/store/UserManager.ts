import { connection } from "websocket";
import { OutGoingMessage } from "../messages/outgoingMessages";

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
      const room = this.rooms.get(roomId);
      if (!room) {
         this.rooms.set(roomId, {
            roomId: roomId,
            users: []
         })
      }
      room?.users.push({
         id: userId,
         name,
         connection: ws
      });
   }

   removeUser(userId: string, roomId: string) {
      const users = this.rooms.get(roomId)?.users;
      users?.filter(user => user.id !== userId);
   }

   getUser(userId: string, roomId: string) {
      return this.rooms.get(roomId)?.users.find(user => user.id === userId) ?? null;
   }

   broadcast(roomId: string, userId: string, message: OutGoingMessage) {
      const room = this.rooms.get(roomId);
      if (!room) {
         return;
      }
      const user = this.getUser(userId, roomId);
      if (!user) {
         return;
      }
      room.users.forEach(user => {
         user.connection.sendUTF(JSON.stringify(message));
      })
   }
}