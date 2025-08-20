import { Injectable } from '@angular/core';
import {from, Observable, Subject} from "rxjs";
import {Stomp} from "@stomp/stompjs";
import * as SockJS from 'sockjs-client';

export interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
}
@Injectable({
  providedIn: 'root'
})
export class NewNotificationService {

  private stompClient: any;
  private messagesSubject: Subject<ChatMessage> = new Subject<ChatMessage>();
  public messages$: Observable<ChatMessage> = this.messagesSubject.asObservable();

  private jwtToken: any = "e6c912b1-b5d5-4a98-ae43-58f83a897142"; // Replace with real token from login
  private user:any = localStorage.getItem('username');
  connect(username: string): void {
    const socket = new SockJS('http://localhost:9090/ws'
    );

    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = (str: string) => console.log('STOMP: ' + str);

    this.stompClient.connect(
        { Authorization: `Bearer ${this.jwtToken}` },
        () => {
          console.log('Connected to WebSocket');

          // Subscribe to public chat
          this.stompClient.subscribe(`/user/shannilusharr456@gmail.com/queue/notifications`, (message: any) => {
            alert(message)
            console.log(message)
            const body: ChatMessage = JSON.parse(message.body);
            this.messagesSubject.next(body);
          });

          // Notify others that user joined
          // this.stompClient.send('/app/chat.addUser', {}, JSON.stringify({
          //   sender: username,
          //   content: 'Joined the chat!'
          // }));
        },
        (error: any) => {
          console.error('STOMP connection error:', error);
        }
    );
  }

  sendMessage(username: string, content: string): void {
    if (this.stompClient && this.stompClient.connected) {
      const message: ChatMessage = {
        sender: username,
        content,
        timestamp: new Date().toISOString()
      };
      this.stompClient.send('/app/chat.send', {}, JSON.stringify(message));
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
      console.log('Disconnected from WebSocket');
    }
  }
}
