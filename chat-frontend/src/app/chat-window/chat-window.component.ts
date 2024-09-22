import { Component, Input, OnInit } from '@angular/core';

@Component({
   selector: 'app-chat-window',
   templateUrl: './chat-window.component.html',
   styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent implements OnInit{
   @Input() windowHeader!: string;
   @Input() hideSendChat: boolean = false;
   @Input() chats!: string[];

   ngOnInit(): void {
      this.chats = ['Hello', 'Hey there', 'How are you?', 'how are you doing ? I am big fan, how to install node?', 'how are you doing ? I am big fan, how to install node? how are you doing ? I am big fan, how to install node?', 'Hello', 'Hey there', 'How are you?', 'how are you doing ? I am big fan, how to install node?', 'how are you doing ? I am big fan, how to install node? how are you doing ? I am big fan, how to install node?'];
   }
}
