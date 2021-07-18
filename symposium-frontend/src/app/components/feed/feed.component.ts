import { Component, OnInit } from '@angular/core';
import { PostSandbox } from './post/post.sandbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddPostDialogComponent } from './add-post-dialog/add-post-dialog.component';
import { CreatePost } from '../../models/post.interface';
import { FeedSandbox } from './feed.sandbox';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.sass'],
  providers: [PostSandbox, FeedSandbox]
})
export class FeedComponent implements OnInit {

  form: FormGroup;

  constructor(public postSandbox: PostSandbox, public feedSandbox: FeedSandbox, private dialog: MatDialog, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      profileImage: [''],
    });
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

  onFileChange(event: any): void {
    this.feedSandbox.uploadProfileImage(event.target.files[0]);
  }

}
