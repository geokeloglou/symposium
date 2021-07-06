import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { CustomModalConfigData } from './modal.data';

@Injectable()
export class ConfirmDialogService {

  constructor(private matDialog: MatDialog) {
  }

  openConfirmDialog(modalConfig?: CustomModalConfigData): Observable<boolean> {
    return this.matDialog.open(ConfirmDialogComponent, modalConfig).afterClosed();
  }

}
