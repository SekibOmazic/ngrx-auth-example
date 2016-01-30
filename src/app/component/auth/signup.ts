import { Component, Host, OnInit, ChangeDetectionStrategy } from 'angular2/core';
import { Router, CanActivate } from 'angular2/router';
import { ControlGroup, Validators, FormBuilder } from 'angular2/common';

import { Subscription } from 'rxjs/Subscription';

import { shouldActivate } from '../../helpers/helpers';

import { CustomValidators } from './custom_validators';
import { AuthService } from '../../model/AuthService';
import { ShowError } from './showerror';

// need this to fix MDL
declare var componentHandler: any;


@Component({
  selector: 'signup',
  viewProviders: [CustomValidators],
  directives: [ShowError],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="signup">
    <h1>Create an @ngrx account</h1>

    <div *ngIf="error">
      <h3>{{ error }}</h3>
    </div>

    <form (ngSubmit)="onSubmit()" [ngFormModel]="form" #f="ngForm">
      <div class="mdl-card mdl-shadow--2dp">
        <div class="mdl-card__supporting-text">
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
               upgrade="MaterialTextfield">
            <input class="mdl-textfield__input" id="name" type="text" ngControl="name"/>
            <label class="mdl-textfield__label" for="name">Name...</label>
            <show-error control="name" [errors]="['minlength']"></show-error>
          </div>

          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
               upgrade="MaterialTextfield">
            <input class="mdl-textfield__input" id="email" type="text" ngControl="email"/>
            <label class="mdl-textfield__label" for="email">Email...</label>
            <show-error control="email" [errors]="['required', 'invalidEmail']"></show-error>
          </div>

          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
               upgrade="MaterialTextfield">
            <input class="mdl-textfield__input" id="pwd" type="password" ngControl="password"/>
            <label class="mdl-textfield__label" for="pwd">Password...</label>
            <show-error control="password" [errors]="['minlength']"></show-error>
          </div>

        </div>

        <div class="filler"></div>

        <div class="mdl-card__actions mdl-card--border">
          <button [disabled]="!f.form.valid"
                  type="submit"
                  class="mdl-button mdl-button--raised mdl-button--accent">
            Create New Account
          </button>
        </div>
      </div>
    </form>

    <div class="login-link">
      Already have an account? <a (click)="login()" class="quiet-button">Log in</a>
    </div>

    </div>
  `
})


@CanActivate((to, from) => {
  return shouldActivate(to, from);
})


export class Signup {
  private form: ControlGroup;
  private subscription: any;

  private error: string;
  private errorSubscription: Subscription<string>;

  constructor(private customValidator: CustomValidators,
              private fb: FormBuilder,
              private router: Router,
              private auth: AuthService) {

    this.form = fb.group({
      'name':     ['', Validators.minLength(4)],
      'email':    ['', Validators.compose([Validators.required,
                          customValidator.email.bind(customValidator)])],
      'password': ['', Validators.minLength(4)]
    });

    this.subscription = this.auth.token$.subscribe(token => {
      if (token) { this.router.navigate(['/NgRx']); }
    });

    this.errorSubscription = this.auth.error$.subscribe(error => this.error = error);
  }

  ngOnInit() {
    // Only needed to fix Material Design Lite
    componentHandler.upgradeAllRegistered();
  }


  ngOnDestroy() {
    // don't forget to clean up the subscriptions
    this.subscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  private onSubmit(): boolean {

    this.auth.signup(
      this.form.controls['name'].value,
      this.form.controls['email'].value,
      this.form.controls['password'].value
    );

    return false;
  }

  private resetForm(): void {
    this.form.controls['name'].value.updateValue('');
    this.form.controls['email'].value.updateValue('');
    this.form.controls['password'].value.updateValue('');
  }

  private login(): void {
    this.router.navigate(['/Login']);
  }

}
