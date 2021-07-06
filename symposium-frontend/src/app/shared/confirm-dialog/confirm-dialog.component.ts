import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalData } from './modal.data';

export const CONFIRM_DEFAULT_DATA: ModalData = {
  title: 'Warning!',
  message: 'Are you sure you want to proceed?',
  cancelText: 'No',
  confirmText: 'Yes'
};

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
  ) {
    if (!this.data) {
      this.data = CONFIRM_DEFAULT_DATA;
    }
  }

}
