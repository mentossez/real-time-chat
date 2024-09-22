import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
   selector: 'app-chat-window',
   templateUrl: './chat-window.component.html',
   styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent implements OnInit {
   @Input() windowHeader!: string;
   @Input() hideSendChat: boolean = false;
   @Input() chats!: Chat[];
   @Input() isMostLikedWindow!: boolean;

   constructor(
      private readonly chatService: ChatService
   ) {}

   ngOnInit(): void {
      const userId = Math.floor(Math.random() * 1000).toString();
      this.chatService.initialiseUser(userId);
      this.chats = [
         {
            username: 'PewDiePie', message: 'Hello',
            upvotes: 0,
            id: '1'
         },
         {
            username: 'MrBeast', message: 'Hey there',
            upvotes: 0,
            id: '2'
         },
         {
            username: 'LillySingh', message: 'How are you?',
            upvotes: 0,
            id: '3'
         },
         {
            username: 'LoganPaul', message: 'how are you doing ? I am big fan, how to install node?',
            upvotes: 0,
            id: '4'
         },
         {
            username: 'EmmaChamberlain', message: 'how are you doing ? I am big fan, how to install node? how are you doing ? I am big fan, how to install node?',
            upvotes: 0,
            id: '5'
         },
         {
            username: 'NikkieTutorials', message: 'Hello',
            upvotes: 0,
            id: '6'
         },
         {
            username: 'JamesCharles', message: 'Hey there',
            upvotes: 0,
            id: '7'
         },
         {
            username: 'DavidDobrik', message: 'How are you?',
            upvotes: 0,
            id: '8'
         },
         {
            username: 'CaseyNeistat', message: 'how are you doing ? I am big fan, how to install node?',
            upvotes: 0,
            id: '9'
         },
         {
            username: 'JoeyGraceffa', message: 'how are you doing ? I am big fan, how to install node? how are you doing ? I am big fan, how to install node?',
            upvotes: 0,
            id: '10'
         }
      ];
      this.chats.map(chat => chat.username = chat.username.toLocaleLowerCase());
   }
   
   upvote(chat: Chat): void {
      chat.upvotes++;
   }
   
   downvote(chat: Chat): void {
      if (chat.upvotes > 0) {
         chat.upvotes--;
      }
   }

   dismissChat(chat: Chat): void {
      this.chats = this.chats.filter(c => c.id !== chat.id);
   }
}

interface Chat {
   id: string;
   username: string;
   message: string;
   upvotes: number;
}
