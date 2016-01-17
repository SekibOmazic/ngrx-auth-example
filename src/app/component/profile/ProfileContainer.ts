import { Component, ChangeDetectionStrategy } from 'angular2/core';
import { RouteParams } from 'angular2/router';
import { Observable } from 'rxjs/Observable';

import { UserProfile } from './UserProfile';
import { UserService } from '../../model/UserService';
import { User } from '../../model/models';
import { AuthService } from '../../model/AuthService';

@Component({
  selector: 'profile-container',
  directives: [ UserProfile ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <user-profile
        [user]="auth.current$ | async"
        (updateUser)="userService.updateUser($event)">
    </user-profile>
  `,
})
export class ProfileContainer {

  constructor(private userService: UserService, private auth: AuthService) {
    console.log('ProfileContainer init ...');
  }

}
