import {Component, Host, OnInit, ChangeDetectionStrategy} from 'angular2/core';
import {Router, CanActivate} from 'angular2/router';
import {ControlGroup, Validators, FormBuilder} from 'angular2/common';

import { Subscription } from 'rxjs/Subscription';

import { shouldActivate } from '../../helpers/helpers';

import {AuthService} from '../../model/AuthService';
import {ShowError} from './showerror';

// need this to fix MDL
declare var componentHandler: any;


@Component({
  selector: 'log-in',
  directives: [ShowError],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="signup">
      <h1>Login to ngrx</h1>

      <div *ngIf="error">
        <h3>{{error}}</h3>
      </div>

      <form (ngSubmit)="onSubmit()" [ngFormModel]="form" #f="ngForm">
        <div class="mdl-card mdl-shadow--2dp">
          <div class="mdl-card__supporting-text">
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
              <show-error control="password" [errors]="['required']"></show-error>
            </div>

          </div>

          <div class="filler"></div>

          <div class="mdl-card__actions mdl-card--border">
            <button [disabled]="!f.form.valid"
                    type="submit"
                    class="mdl-button mdl-button--raised mdl-button--accent">
              Log In
            </button>
          </div>
        </div>
      </form>

      <div class="login-link">
        Don’t have an account?
        <a (click)="signup()" class="quiet-button">Create an @ngrx account</a>.
      </div>

    </div>
  `
})

/*
@CanActivate((to, from) => {
  return shouldActivate(to, from);
})
*/

export class Login {
  private form: ControlGroup;
  private subscription: any;

  private error: string;
  private errorSubscription: Subscription<string>;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {

    this.form = fb.group({
      'email':    ['', Validators.required],
      'password': ['', Validators.required]
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
    console.log('submitted form', this.form.value);

    this.auth.login(
      this.form.controls['email'].value,
      this.form.controls['password'].value
    );

    return false;
  }

  private signup(): void {
    this.router.navigate(['/Signup']) ;
  }

  private resetForm(): void {
    this.form.controls['email'].value.updateValue('');
    this.form.controls['password'].value.updateValue('');
  }

}
