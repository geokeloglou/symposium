import { ChangeDetectionStrategy, Component, Inject, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.sass'],
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cancelText: string;
      confirmText: string;
      message: string;
      title: string;
    },
    private matDialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {
  }

  public cancel(): void {
    this.close(false);
  }

  public confirm(): void {
    this.close(true);
  }

  public close(value: any): void {
    this.matDialogRef.close(value);
  }

}
