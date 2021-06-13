import { Component, OnInit } from '@angular/core';
import { PostSandbox } from './post.sandbox';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.sass'],
  providers: [PostSandbox]
})
export class FeedComponent implements OnInit {

  constructor(public postSandbox: PostSandbox) {
  }

  ngOnInit(): void {
  }

}
