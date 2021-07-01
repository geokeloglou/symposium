import { Component, OnInit } from '@angular/core';
import { PostSandbox } from './post/post.sandbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddPostDialogComponent } from './add-post-dialog/add-post-dialog.component';
import { CreatePost } from '../../models/post.interface';
import { NotifierService } from '../../services/notifier.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.sass'],
  providers: [PostSandbox]
})
export class FeedComponent implements OnInit {

  constructor(public postSandbox: PostSandbox, private dialog: MatDialog, private notifierService: NotifierService) {
  }

  ngOnInit(): void {
  }

  createPost(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    const dialogRef = this.dialog.open(AddPostDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((post: CreatePost) => {
      if (!post) {
        return;
      }
      this.postSandbox.createPost(post);
    });
  }
}
