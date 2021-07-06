import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CreatePost, LikedPostData, PostData } from '../../../models/post.interface';
import { PostService } from '../../../services/post.service';
import { catchError, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NotifierService } from '../../../services/notifier.service';
import { ApiResponse } from '../../../models/http.interface';
import { Injectable, OnDestroy } from '@angular/core';
import { Guid } from 'guid-typescript';
import { ConfirmDialogService } from '../../../shared/confirm-dialog/confirm-dialog.service';

@Injectable()
export class PostSandbox implements OnDestroy {

  private getAllPostsSubscription: Subscription;
  private _posts$ = new BehaviorSubject<PostData[]>([]);
  private createPostSubscription: Subscription;
  private likePostSubscription: Subscription;
  private _likedPosts$ = new BehaviorSubject<LikedPostData[]>([]);
  private getAllLikedPostsSubscription: Subscription;
  private deletePostSubscription: Subscription;

  constructor(private postService: PostService, private notifierService: NotifierService,
              private confirmDialogService: ConfirmDialogService) {
    this.init();
  }

  get posts$(): Observable<PostData[]> {
    return this._posts$;
  }

  isPostLiked(id: Guid): boolean {
    return this._likedPosts$.value.filter(lp => lp.postId === id).length > 0;
  }

  protected init(): void {
    this.getAllPosts();
    this.getAllLikedPosts();
  }

  private getAllPosts(): void {
    this.getAllPostsSubscription?.unsubscribe();
    this.getAllPostsSubscription = this.postService.getAllPosts()
      .pipe(
        catchError((error: ApiResponse) => {
          this.notifierService.showNotification(error.message, 'OK', 'error');
          return [];
        }),
        filter((response: ApiResponse) => response.data !== null && response.data !== undefined),
        map((response: ApiResponse) => response.data),
        distinctUntilChanged()
      )
      .subscribe(posts => this._posts$.next(posts as PostData[]));
  }

  createPost(post: CreatePost): void {
    this.createPostSubscription?.unsubscribe();
    this.createPostSubscription = this.postService.createPost(post)
      .subscribe((response: ApiResponse) => {
        this.getAllPosts();
        this.notifierService.showNotification(response.message, 'OK', 'success');
      }, (error: ApiResponse) => {
        this.notifierService.showNotification(error.message, 'OK', 'error');
      });
  }

  deletePost(postId: Guid): void {
    this.deletePostSubscription?.unsubscribe();
    this.confirmDialogService.openConfirmDialog().subscribe((bool: boolean) => {
      if (bool) {
        this.deletePostSubscription = this.postService.deletePost({ id: postId })
          .subscribe((response: ApiResponse) => {
            this.getAllPosts();
            this.notifierService.showNotification(response.message, 'OK', 'success');
          }, (error: ApiResponse) => {
            this.notifierService.showNotification(error.message, 'OK', 'error');
          });
      }
    });
  }

  likePost(postId: Guid): void {
    this.likePostSubscription?.unsubscribe();
    this.likePostSubscription = this.postService.likePost({ id: postId })
      .subscribe(() => {
        this.getAllPosts();
        this.getAllLikedPosts();
      });
  }

  getAllLikedPosts(): void {
    this.getAllLikedPostsSubscription?.unsubscribe();
    this.getAllLikedPostsSubscription = this.postService.getAllLikedPosts()
      .subscribe((response: ApiResponse) => {
        this._likedPosts$.next(response.data as LikedPostData[]);
      });
  }

  ngOnDestroy(): void {
    this.getAllPostsSubscription?.unsubscribe();
    this.createPostSubscription?.unsubscribe();
    this.likePostSubscription?.unsubscribe();
    this.getAllLikedPostsSubscription?.unsubscribe();
    this.deletePostSubscription?.unsubscribe();
    this._posts$.complete();
    this._likedPosts$.complete();
    this._posts$.next([]);
    this._likedPosts$.next([]);
  }

}
