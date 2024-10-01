type UserId = string;

export interface Chat {
   id: string;
   userId: UserId;
   name: string;
   message: string;
   upvotes: UserId[]; //who has upvoted what ?
   isDismissed?: boolean;
}

export abstract class Store {
   constructor() { }

   initStore(roomId: string) { }

   //chats 0-50 limit - 50 offset - 0
   //chats 50-100 limit - 50 offset - 50
   getChats(roomId: string, limit: number, offset: number) { }

   addChat(roomId: string, userId: string, name: string, message: string) { }

   upvote(roomId: string, userId: string, chatId: string) { }
}