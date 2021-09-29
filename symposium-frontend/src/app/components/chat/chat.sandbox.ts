import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class ChatSandbox implements OnDestroy {

  constructor() {
    this.init();
  }

  protected init(): void {
  }

  ngOnDestroy(): void {
  }

}
