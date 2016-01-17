import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';
import { Action, Reducer, Store } from '@ngrx/store';
import { ApiService } from '../api/api';

import {
  LOAD_USERS,
  LOADING_USERS,
  LOADED_USERS,
  ADD_USER,
  ADDING_USER,
  ADDED_USER,
  UPDATE_USER,
  UPDATED_USER,
  INIT
} from '../reducers/users';

import { User, Users } from './models';

@Injectable()
export class UserService {
  loading$: Observable<Boolean>;
  adding$: Observable<Boolean>;
  users$: Observable<User[]>;

  private actions$ = new BehaviorSubject<Action>({type: INIT, payload: null});

  constructor(private _store: Store<any>, api: ApiService) {
    const store$ = this._store.select<Users>('users');

    this.adding$ = store$.map(data => data['adding']);
    this.loading$ = store$.map(data => data['loading']);
    this.users$ = store$.map(data => data['users']);

    let loads = this.actions$
      .filter(action => action.type === LOAD_USERS)
      .do(() => _store.dispatch({type: LOADING_USERS}))
      .mergeMap(
        action => api.loadUsers(),
        (action, payload: User[]) => ({type: LOADED_USERS, payload})
      );


    Observable
      .merge(loads)
      .subscribe((action: Action) => _store.dispatch(action));
  }

  addUser(user) {
    this.actions$.next({type: ADD_USER, payload: user});
  }

  loadUsers() {
    this.actions$.next({type: LOAD_USERS});
  }

  updateUser(user) {
    this.actions$.next({type: UPDATE_USER, payload: user});
  }

  reloadUsers() {
    this._store.dispatch({type: LOADED_USERS, payload: []});
    this.loadUsers();
  }
}
