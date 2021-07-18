import { Injectable, OnDestroy } from '@angular/core';
import { NotifierService } from '../../services/notifier.service';
import { ProfileService } from '../../services/profile.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Profile } from '../../models/profile.interface';
import { catchError, filter, map } from 'rxjs/operators';
import { ApiResponse } from '../../models/http.interface';

@Injectable()
export class FeedSandbox implements OnDestroy {

  private getUserProfileInfoSubscription: Subscription;
  private _profile$ = new BehaviorSubject<Profile[]>([]);
  imageUrl: string;

  constructor(private profileService: ProfileService, private notifierService: NotifierService) {
    this.init();
  }

  protected init(): void {
    this.getUserProfileInfo();
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
        this._profile$.next(profile as Profile[]);
        this.imageUrl = (profile as Profile[]).map(p => p.imageUrl).toString();
      });
  }

  ngOnDestroy(): void {
    this.getUserProfileInfoSubscription?.unsubscribe();
    this._profile$.complete();
    this._profile$.next([]);
  }

}
