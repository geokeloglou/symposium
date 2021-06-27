import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponse } from '../../models/http.interface';
import { NotifierService } from '../../services/notifier.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe(
      (response: ApiResponse) => {
        this.router.navigate(['/']);
        this.notifierService.showNotification('Logged in successfully.', 'OK', 'success');
      },
      (error: any) => {
        this.resetForm(this.loginForm);
        this.notifierService.showNotification('Login failed.', 'OK', 'error');
      }
    );
  }

  resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach((key) => {
      this.loginForm.get(key)?.setErrors(null);
    });
  }

  isValid(): boolean {
    return !this.loginForm.valid;
  }

}
