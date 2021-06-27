import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PostData } from '../../models/post.interface';
import { PostService } from '../../services/post.service';
import { catchError, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NotifierService } from '../../services/notifier.service';
import { ApiResponse } from '../../models/http.interface';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class PostSandbox implements OnDestroy {

  private getAllPostsSubscription: Subscription;
  private _posts$: BehaviorSubject<PostData[]> = new BehaviorSubject<PostData[]>([]);

  constructor(private postService: PostService, private notifierService: NotifierService) {
    this.init();
  }

  get posts$(): Observable<PostData[]> {
    return this._posts$;
  }

  protected init(): void {
    this.getAllPosts();
  }

  private getAllPosts(): void {
    this.getAllPostsSubscription = this.postService.getAllPosts()
      .pipe(
        catchError(error => {
          this.notifierService.showNotification(error.message, 'OK', 'error');
          return [];
        }),
        filter((response: ApiResponse) => response.data !== null && response.data !== undefined),
        map((response: ApiResponse) => response.data),
        distinctUntilChanged()
      )
      .subscribe(posts => this._posts$.next(posts as PostData[]));
  }

  ngOnDestroy(): void {
    this.getAllPostsSubscription.unsubscribe();
    this._posts$.complete();
    this._posts$.next([]);
  }
}
