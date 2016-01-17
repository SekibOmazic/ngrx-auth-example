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

declare var componentHandler: any;


@Component({
  selector: 'ngrx',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

      <div class="middle" *ngIf="auth.current$ | async">
        <span>Welcome {{(auth.current$ | async).name}}</span>
      </div>

      <div class="right" *ngIf="auth.current$ | async">
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
  private subscription: any;

  constructor(private auth: AuthService, private router: Router) {
    this.subscription = this.auth.token$.subscribe(
      (token) => {
        if (!token) {
          this.router.navigate(['/Login']);
        }
      }
    );
  }

  ngOnInit() {
    componentHandler.upgradeAllRegistered();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
