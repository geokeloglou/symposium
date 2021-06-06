import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  declarations: [ConfirmDialogComponent],
  exports: [ConfirmDialogComponent],
  entryComponents: [ConfirmDialogComponent],
  providers: [ConfirmDialogService],
})
export class ConfirmDialogModule {
}
