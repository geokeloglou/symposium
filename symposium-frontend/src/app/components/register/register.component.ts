import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotifierService } from '../../services/notifier.service';
import { ApiResponse } from '../../models/http.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loginInvalid: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notifierService: NotifierService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.parseUrl('/home');
    }
    this.registerForm = this.fb.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.loginInvalid = true;
      return;
    }

    this.loginInvalid = false;
    this.authService.register(this.registerForm.value).subscribe(
      (response: ApiResponse) => {
        this.resetForm(this.registerForm);
        this.notifierService.showNotification(response.message, 'OK', 'success');
      },
      (error: ApiResponse) => {
        this.resetForm(this.registerForm);
        this.notifierService.showNotification(error.message, 'OK', 'error');
      }
    );
  }

  resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      this.registerForm.get(key)?.setErrors(null);
    });
  }

  isValid(): boolean {
    return this.registerForm.valid ? false : true;
  }
}
