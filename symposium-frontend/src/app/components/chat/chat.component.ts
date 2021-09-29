import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/chat.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, filter, map } from 'rxjs/operators';
import { ApiResponse } from '../../models/http.interface';
import { Profile } from '../../models/profile.interface';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { NotifierService } from '../../services/notifier.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass'],
})
export class ChatComponent implements OnInit, OnDestroy {

  form: FormGroup;
  message: Message;
  messagesArray: Message[] = [];
  private getUserProfileInfoSubscription: Subscription;
  profile: Profile;

  constructor(private chatService: ChatService, private fb: FormBuilder, private profileService: ProfileService,
              private notifierService: NotifierService) {
  }

  ngOnInit(): void {
    this.getUserProfileInfo();
    this.form = this.fb.group({
      text: ['', Validators.required],
    });

  }

  send(): void {
    if (this.form.get('text')?.value.length === 0) {
      return;
    }
    this.chatService.broadcastMessage({
      user: this.profile.firstname + ' ' + this.profile.lastname,
      text: this.form.get('text')?.value,
      imageUrl: this.profile.imageUrl
    });
    this.form.reset();
  }

  addToInbox(message: Message): void {
    this.messagesArray.push({ user: message.user, text: message.text, imageUrl: message.imageUrl });
  }

  getUserProfileInfo(): void {
    this.getUserProfileInfoSubscription?.unsubscribe();
    this.getUserProfileInfoSubscription = this.profileService.getUserProfileInfo()
      .pipe(
        catchError((error: ApiResponse) => {
          this.notifierService.showNotification(error.message, 'OK', 'error');
          return [];
        }),
        filter((response: ApiResponse) => response.data !== null && response.data !== undefined),
        map((response: ApiResponse) => response.data)
      )
      .subscribe(profile => {
        if (profile !== null && profile !== undefined) {
          this.profile = profile.pop() as Profile;
          this.getMessages();
        }
      });
  }

  getMessages(): void {
    this.chatService.retrieveMappedObject().subscribe((message: Message) => {
      this.addToInbox(message);
    });
  }

  ngOnDestroy(): void {
    this.getUserProfileInfoSubscription?.unsubscribe();
  }

}
