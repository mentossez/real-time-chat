import { Chat, Store } from "./store/Store";

let globalChatId = 0;

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
      const room = this.store.get(roomId);
      if (!room) {
         return [];
      }
      room.chats.push({
         id: (globalChatId++).toString(),
         userId,
         name,
         message,
         upvotes: []
      });
   }

   upvote(roomId: string, userId: string, chatId: string) {
      const room = this.store.get(roomId);
      if (!room) {
         return;
      }
      const chat = room.chats.find(chat => chat.id === chatId);
      chat?.upvotes.push(userId);
      return chat;
   }
}