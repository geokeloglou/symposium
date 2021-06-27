import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifierComponent } from '../components/notifier/notifier.component';

@Injectable({
  providedIn: 'root',
})
export class NotifierService {

  constructor(private snackBar: MatSnackBar) {
  }

  showNotification(
    displayMessage: string | undefined,
    buttonText: string,
    messageType: 'error' | 'success'
  ): void {
    this.snackBar.openFromComponent(NotifierComponent, {
      data: {
        message: displayMessage,
        buttonText,
        type: messageType,
      },
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: messageType,
    });
  }
}
