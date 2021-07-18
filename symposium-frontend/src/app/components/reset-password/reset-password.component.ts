import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiResponse } from '../../models/http.interface';
import { NotifierService } from '../../services/notifier.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  loginInvalid: boolean;
  token: string;
  params: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notifierService: NotifierService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.token = params['t'];
    });
  }

  ngOnInit(): void {
    this.createResetPasswordForm();
  }

  onSubmit(): void {
    if (
      this.resetPasswordForm.value.password !==
      this.resetPasswordForm.value.confirmPassword
    ) {
      this.loginInvalid = true;
      return;
    }

    this.loginInvalid = false;
    const body = {
      token: this.token,
      password: this.resetPasswordForm.value.password,
    };
    this.authService.resetPassword(body).subscribe(
      (response: ApiResponse) => {
        this.resetForm(this.resetPasswordForm);
        this.notifierService.showNotification(response.message, 'OK', 'success');
      },
      (error: ApiResponse) => {
        this.resetForm(this.resetPasswordForm);
        this.notifierService.showNotification(error.message, 'OK', 'error');
      }
    );
  }

  createResetPasswordForm(): void {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach((key) => {
      this.resetPasswordForm.get(key)?.setErrors(null);
    });
  }

  isValid(): boolean {
    return !this.resetPasswordForm.valid;
  }
}
