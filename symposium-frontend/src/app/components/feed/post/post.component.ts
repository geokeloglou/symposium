import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.sass'],
})
export class PostComponent {

  @Input() firstname: string;
  @Input() lastname: string;
  @Input() username: string;
  @Input() postImageUrl: string;
  @Input() date: Date;
  @Input() text: string;
  @Input() likes: number;
  @Input() liked: boolean;
  @Output() like = new EventEmitter<void>();

  constructor() {
  }

}
