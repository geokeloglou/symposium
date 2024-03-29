import { AppComponent } from './app.component';
import { FeedComponent } from './components/feed/feed.component';
import { HomeContainerComponent } from './views/home-container/home-container.component';
import { MainComponent } from './components/main/main.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { NavComponent } from './components/toolbar/nav/nav.component';
import { PostComponent } from './components/feed/post/post.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotifierComponent } from './components/notifier/notifier.component';
import { LoginViewComponent } from './views/authentication-views/login-view/login-view.component';
import { RegisterViewComponent } from './views/authentication-views/register-view/register-view.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ForgotPasswordViewComponent } from './views/authentication-views/forgot-password-view/forgot-password-view.component';
import { ResetPasswordViewComponent } from './views/authentication-views/reset-password-view/reset-password-view.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AddPostDialogComponent } from './components/feed/add-post-dialog/add-post-dialog.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatContainerComponent } from './views/chat-container/chat-container.component';

import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { ConfirmDialogModule } from './shared/confirm-dialog/confirm-dialog.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

import { TokenInterceptor } from './interceptors/token.interceptor';

import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { PostService } from './services/post.service';
import { ProfileService } from './services/profile.service';

import { AuthGuard } from './guards/auth.guard';
import { ChatService } from './services/chat.service';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    HomeContainerComponent,
    MainComponent,
    ToolbarComponent,
    NavComponent,
    PostComponent,
    LoginComponent,
    RegisterComponent,
    NotifierComponent,
    LoginViewComponent,
    RegisterViewComponent,
    ForgotPasswordComponent,
    ForgotPasswordViewComponent,
    ResetPasswordViewComponent,
    ResetPasswordComponent,
    AddPostDialogComponent,
    ChatComponent,
    ChatContainerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        allowedDomains: ['http://localhost:4200/'],
        disallowedRoutes: [''],
      },
    }),
    MatDividerModule,
    ConfirmDialogModule,
    MatDialogModule,
    MatMenuModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    TokenService,
    PostService,
    ProfileService,
    ChatService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
