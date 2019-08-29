import { Component, OnInit } from '@angular/core';
import { UiService } from './../../../_services/ui/ui.service';
import { FbService } from '../../../_services/fb/fb.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage = '';
  loadingSpinner: boolean = false;
  
  loginForm = this.formBuilder.group({
    username: ['', [
      Validators.email,
      Validators.required
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(7)
    ]]
  });

  constructor(
    private uiService: UiService,
    private fbService: FbService, 
    private route: Router,
    private formBuilder: FormBuilder
  ) { }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    if (this.fbService.isAuthenticated()) {
      this.route.navigateByUrl('');
    }
  }

  login() {
    this.loadingSpinner = true;
    this.fbService.signIn(this.username.value, this.password.value)
    .then(() => {
      this.uiService.isLoggedIn.next(true);
      this.route.navigateByUrl('')
    })
    .catch(err => this.handleError(err))
  };

  signInWithFacebook() {
    this.fbService.signInWithFacebook()
      .then(() => this.uiService.isLoggedIn.next(true))
      .catch(err => this.handleError(err))
  }

  signInWithGoogle() {
    this.fbService.signInWithGoogle()
      .then(() => this.uiService.isLoggedIn.next(true))
      .catch(err => this.handleError(err))
  }

  handleError(err: string) {
    this.errorMessage = err;
    setTimeout(() => {
      this.errorMessage = '';
      this.loadingSpinner = false;
    }, 3000);
  }
}
