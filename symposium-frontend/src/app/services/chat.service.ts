import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as SignalR from '@microsoft/signalr';
import { HubConnection } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { Message } from '../models/chat.interface';


// TODO: Refactor ChatService and use ChatSandbox
@Injectable()
export class ChatService extends BaseService {

  private hubUrl = environment.hubUrl;
  private apiUrl = environment.hubApiUrl;
  private connection: HubConnection = new SignalR.HubConnectionBuilder()
    .withUrl(this.hubUrl)
    .configureLogging(SignalR.LogLevel.Trace)
    .withAutomaticReconnect()
    .build();
  private message: Message;
  messageReceived$ = new Subject<Message>();

  constructor(private httpClient: HttpClient) {
    super();
    this.init();
  }

  private init(): void {
    this.connection.onclose(async () => {
      await this.start();
    });
    this.connection.on('ReceiveOne', (user: string, message: string, imageUrl: string) => {
      this.mapReceivedMessage(user, message, imageUrl);
    });
    this.start()
      .then(() => console.log('Connection established.'))
      .catch((e) => console.log('Connection failed due to: ', e));
  }

  async start(): Promise<void> {
    try {
      await this.connection.start();
      console.log('Connecting...');
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }

  async mapReceivedMessage(user: string, text: string, imageUrl: string): Promise<void> {
    this.message = {
      user,
      text,
      imageUrl
    };
    this.messageReceived$.next(this.message);
  }

  retrieveMappedObject(): Observable<Message> {
    return this.messageReceived$.asObservable();
  }

  broadcastMessage(message: Message): void {
    this.httpClient.post(`${ this.apiUrl }/send`, message).subscribe(data => console.log(data));

    // This can invoke the server method named as "SendMessage" directly.
    // this.connection.invoke('SendMessage', message.user, message.text, message.imageUrl).then(data => console.log(data));
  }

}
