import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogService } from './confirm-dialog.service';

export const LOCPUSH_CONFIRM_DIALOG_OPTIONS = {
  width: '350px',
  hasBackdrop: true,
  panelClass: '.mat-dialog-container',
};

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  declarations: [ConfirmDialogComponent],
  exports: [ConfirmDialogComponent],
  providers: [
    {
      provide: ConfirmDialogService,
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: LOCPUSH_CONFIRM_DIALOG_OPTIONS,
    }
  ]
})

export class ConfirmDialogModule {
}
