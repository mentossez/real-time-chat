import { Chat, Store } from "./Store";

let globalChatId = 500;

interface Room {
   roomId: string;
   chats: Chat[];
}

export class InMemoryStore implements Store {
   private store: Map<string, Room>;

   constructor() {
      this.store = new Map<string, Room>();
   }

   initStore(roomId: string) {
      this.store.set(roomId, {
         roomId: roomId,
         chats: []
      });
   }

   //chats 0-50 limit - 50 offset - 0
   //chats 50-100 limit - 50 offset - 50
   getChats(roomId: string, limit: number, offset: number) {
      const room = this.store.get(roomId);
      if (!room) {
         return [];
      }
      return room.chats.splice(0, limit); //Need to write login for limit and offset
   }

   addChat(roomId: string, userId: string, name: string, message: string) {
      if (!this.store.get(roomId)) {
         this.initStore(roomId);
      }
      const room = this.store.get(roomId);
      if (!room) {
         return;
      }
      const chat = {
         id: (++globalChatId).toString(),
         userId,
         name,
         message,
         upvotes: []
      };
      room.chats.push(chat);
      console.log(`chat is added in room(${roomId}) - ${JSON.stringify(chat)}`);
      return chat;
   }

   upvote(roomId: string, userId: string, chatId: string) {
      const room = this.store.get(roomId);
      if (!room) {
         return;
      }
      const chat = room.chats.find(chat => chat.id === chatId);
      if (chat?.upvotes.includes(userId)) {
         return chat;
      }
      chat?.upvotes.push(userId);
      return chat;
   }
}