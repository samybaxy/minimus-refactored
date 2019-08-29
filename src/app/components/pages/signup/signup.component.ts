import { Subject } from 'rxjs';
import { UiService } from 'src/app/_services/ui/ui.service';
import { Component, OnInit } from '@angular/core';
import { FbService } from '../../../_services/fb/fb.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  errorMessage: string;
  loadingSpinner: boolean = false;

  signUpForm = this.formBuilder.group({
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
    return this.signUpForm.get('username');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  ngOnInit() {
    if (this.fbService.isAuthenticated())
      this.route.navigateByUrl('');
  }

  signup() {
    this.loadingSpinner = true;
    this.fbService
      .signUp(this.username.value, this.password.value)
      .then(() => this.uiService.isLoggedIn.next(true))
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
