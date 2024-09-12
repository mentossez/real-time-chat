type UserId = string;

export interface Chat {
   chatId: string;
   userId: UserId;
   name: string;
   message: string;
   upvotes: UserId[]; //who has upvoted what ?
}

export abstract class Store {
   constructor() { }

   initStore(roomId: string) { }

   //chats 0-50 limit - 50 offset - 0
   //chats 50-100 limit - 50 offset - 50
   getChats(roomId: string, limit: string, offset: string) { }

   addChat(roomId: string, limit: string, offset: string) { }

   upvote(roomId: string, chatId: string) { }
}