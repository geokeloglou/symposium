import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotifierService } from '../../services/notifier.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.sass']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit(): void {
    this.createForgotPasswordForm();
  }

  onSubmit(): void {
    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe(
      () => {
        this.resetForm(this.forgotPasswordForm);
        this.notifierService.showNotification('Please check your email.', 'OK', 'success');
      }
    );
  }

  createForgotPasswordForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach((key) => {
      this.forgotPasswordForm.get(key)?.setErrors(null);
    });
  }

  isValid(): boolean {
    return !this.forgotPasswordForm.valid;
  }
}
