import { Component, ChangeDetectionStrategy } from 'angular2/core';
import { UserService } from '../../model/UserService';
import { AuthService } from '../../model/AuthService';
import { Users } from '../../model/models';
import { UserList } from './UserList';


@Component({
  selector: 'users-list-container',
  directives: [ UserList ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <user-list
      [users]="userService.users$ | async"
      [loading]="userService.loading$ | async"
      (reloadUsers)="userService.reloadUsers()">
    </user-list>
  `
})
export class UserListContainer {
  constructor(private userService: UserService, private auth: AuthService) {
    this.userService.loadUsers();
  }
}
