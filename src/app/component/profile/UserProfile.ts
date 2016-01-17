import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from 'angular2/core';
import {UserService} from '../../model/UserService';
import {User} from '../../model/models';

@Component({
  selector: 'user-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>Current user</h3>
    ID: {{user.id}} - Name: {{user.name}} - Email: {{user.email}}
  `
})
export class UserProfile {
  @Input() user: User;
  @Output() updateUser = new EventEmitter<User>();

  constructor(private userService: UserService) {}
}
