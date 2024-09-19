
export enum SupportedMessage {
   AddChat = "ADD_CHAT",
   UpdateChat = "UPDATE_CHAT"
};

type MessagePayload = {
   roomId: string;
   chatId: string;
   name: string;
   message: string;
   upvotes: number;
}

export type OutGoingMessage = {
   type: SupportedMessage.AddChat;
   payload: MessagePayload;
} | {
   type: SupportedMessage.UpdateChat;
   payload: Partial<MessagePayload>;
};


