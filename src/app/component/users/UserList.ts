import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from 'angular2/core';
import {UserListItem} from './UserListItem';

@Component({
  selector: 'user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [UserListItem],
  template: `
    <div class="content">
      <button (click)="reloadUsers.emit()"
                class="mdl-button mdl-button--raised mdl-button--accent">
          Trigger Reload
      </button>

      <h5 *ngIf="loading" class="spacer">Fetching Users...</h5>

      <div *ngIf="!loading" class="spacer vertical">
        <user-list-item *ngFor="#user of users" [user]="user"></user-list-item>
      </div>
    </div>
  `
})
export class UserList {
  @Input() users;
  @Input() loading;
  @Output() reloadUsers = new EventEmitter(false);
}
