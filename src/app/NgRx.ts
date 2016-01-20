import {
  Component,
  Inject,
  ViewEncapsulation,
  OnInit,
  ChangeDetectionStrategy
} from 'angular2/core';

import { Router, RouteConfig, ROUTER_DIRECTIVES, CanActivate } from 'angular2/router';

import { shouldActivate } from './helpers/helpers';

import { UserListContainer } from './component/users/UserListContainer';
import { ProfileContainer } from './component/profile/ProfileContainer';
import { AuthService } from './model/AuthService';
import { User } from './model/models';
import {Subscription} from 'rxjs/Subscription';

declare var componentHandler: any;


@Component({
  selector: 'ngrx',
  //changeDetection: ChangeDetectionStrategy.OnPush, //not using Observable any more
  directives: [ ROUTER_DIRECTIVES ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <menu>
      <button id="menu" class="mdl-button mdl-js-button mdl-button--icon"
              data-upgraded="MaterialButton">
        <i class="material-icons">more_vert</i>
      </button>

      <span>NgRx users</span>

      <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
          for="menu" upgrade="MaterialMenu">
        <li class="mdl-menu__item" [routerLink]="['./Users']">Users</li>
        <li class="mdl-menu__item" [routerLink]="['./Profile']">Profile</li>
      </ul>

      <!-- Using *ngIf="auth.current$ | async" breaks the app -->
      <div class="middle" *ngIf="current">
        <span>Welcome {{ current.name }}</span>
      </div>

      <!-- Using *ngIf="auth.current$ | async" breaks the app -->
      <div class="right" *ngIf="current">
        <span (click)="auth.logout()">Logout</span>
      </div>
    </menu>

    <router-outlet></router-outlet>
  `
})
@RouteConfig([
  { path: '/users',   name: 'Users',   component: UserListContainer, useAsDefault: true },
  { path: '/profile', name: 'Profile', component: ProfileContainer }
])

@CanActivate((to, from) => {
  return shouldActivate(to, from);
})

export class NgRx implements OnInit {
  private tokenSub: Subscription<string;

  private current: User;
  private currentSub: Subscription<User>;

  constructor(private auth: AuthService, private router: Router) {
    this.tokenSub = this.auth.token$.subscribe(
      (token) => {
        if (!token) {
          this.router.navigate(['/Login']);
        }
      }
    );

    /*
     * previously used on Observable but it broke browser's
     * back/forward button. Not sure why.
     */
    this.currentSub = this.auth.current$.subscribe(c => this.current = c);
  }

  ngOnInit() {
    // needed to fix Material Design Lite
    componentHandler.upgradeAllRegistered();
  }

  ngOnDestroy() {
    // don't forget to clean up the subscriptions
    this.tokenSub.unsubscribe();
    this.currentSub.unsubscribe();
  }
}
