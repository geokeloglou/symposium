import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { HomeContainerComponent } from './views/home-container/home-container.component';
import { LoginViewComponent } from './views/authentication-views/login-view/login-view.component';
import { RegisterViewComponent } from './views/authentication-views/register-view/register-view.component';
import { ForgotPasswordViewComponent } from './views/authentication-views/forgot-password-view/forgot-password-view.component';
import { ResetPasswordViewComponent } from './views/authentication-views/reset-password-view/reset-password-view.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeContainerComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: 'login',
    component: LoginViewComponent
  },
  {
    path: 'register',
    component: RegisterViewComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordViewComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordViewComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
