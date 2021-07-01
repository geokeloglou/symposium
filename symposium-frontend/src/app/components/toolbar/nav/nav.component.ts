import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NotifierService } from '../../../services/notifier.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass']
})
export class NavComponent implements OnInit {

  constructor(private authService: AuthService, private notifierService: NotifierService) {
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.notifierService.showNotification('Logged out successfully.', 'OK', 'success');
    }).catch(() => {
      this.notifierService.showNotification('Log out failed.', 'OK', 'error');
    });
  }

}
