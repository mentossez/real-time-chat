import z from "zod";

export enum SupportedMessage {
   JoinRoom = "JOIN_ROOM",
   SendMessage = "SEND_MESSAGE",
   UpdateMessage = "UPDATE_MESSAGE",
};

export type IncomingMessage = {
   type: SupportedMessage.JoinRoom,
   payload: InitMessagesType
} | {
   type: SupportedMessage.SendMessage,
   payload: UserMessageType
} | {
   type: SupportedMessage.UpdateMessage,
   payload: UpdateMessageType
};

const InitMessages = z.object({
   name: z.string(),
   userId: z.string(),
   roomId: z.string()
});

export type InitMessagesType = z.infer<typeof InitMessages>;

const UserMessage = z.object({
   userId: z.string(),
   roomId: z.string(),
   message: z.string()
});

export type UserMessageType = z.infer<typeof UserMessage>;

const UpvoteMessage = z.object({
   userId: z.string(),
   roomId: z.string(),
   chatId: z.string()
});

export type UpdateMessageType = z.infer<typeof UpvoteMessage>;