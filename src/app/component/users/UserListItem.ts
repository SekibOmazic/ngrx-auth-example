import { Component, ChangeDetectionStrategy, Input } from 'angular2/core';

import { User } from '../../model/models';

@Component({
  selector: 'user-list-item',
  template: `
    ID: {{user.id}} - <a>{{user.name}}</a> - {{user.email}}
  `
})
export class UserListItem {
  @Input() user: User;
}
