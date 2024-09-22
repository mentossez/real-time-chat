import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  socket!: any;
  userName = 'Ashish';

  constructor() {
    this.socket = new WebSocket("ws://localhost:8080", ['echo-protocol']);
  }

  initialiseUser(userId: string) {
    this.socket.onopen = function () {
      this.socket.send(JSON.stringify({
        type: "JOIN_ROOM",
        payload: {
          name: this.userName,
          userId,
          roomId: "1"
        }
      }));
    }
  }
}
