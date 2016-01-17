import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';
import { Action, Reducer, Store } from '@ngrx/store';
import { ApiService } from '../api/api';

import {
  LOGIN_USER,
  SIGNUP_USER,
  LOGIN_IN_PROGRESS,
  SIGNUP_IN_PROGRESS,
  USER_AUTHENTICATED,
  LOGIN_FAILURE,
  SIGNUP_FAILURE,
  AUTH_TOKEN_EXPIRED,

  LOGOUT_USER,
  LOGOUT_IN_PROGRESS,
  LOGOUT_RECEIVED,
  INIT
} from '../reducers/auth';

import { Auth, User } from './models';


@Injectable()
export class AuthService {
  error$: Observable<string>;
  token$: Observable<string>;
  current$: Observable<User>;

  private actions$ = new BehaviorSubject<Action>({type: INIT, payload: null});

  constructor(private _store: Store<any>, private api: ApiService) {
    const store$ = this._store.select<Auth>('auth');

    this.error$ = store$.map(data => data['error']);
    this.token$ = store$.map(data => data['token']);
    this.current$ = store$.map(data => data['current']);

    let logins = this.actions$
      .filter(action => action.type === LOGIN_USER)
      .do(() => _store.dispatch({type: LOGIN_IN_PROGRESS}))
      .mergeMap(
        action => api.loginUser(action.payload),
        (action, payload: Auth) => ( payload.token !== null ?
          {type: USER_AUTHENTICATED, payload} : {type: LOGIN_FAILURE, payload}
        )
      );

    let signups = this.actions$
      .filter(action => action.type === SIGNUP_USER)
      .do(() => _store.dispatch({type: SIGNUP_IN_PROGRESS}))
      .mergeMap(
        action => api.signupUser(action.payload),
        (action, payload: Auth) => ( payload.token !== null ?
          {type: USER_AUTHENTICATED, payload} : {type: SIGNUP_FAILURE, payload}
        )
      );

    let logouts = this.actions$
      .filter(action => action.type === LOGOUT_USER)
      .do(() => _store.dispatch({type: LOGOUT_IN_PROGRESS}))
      .map(() => ({type: LOGOUT_RECEIVED}));

    Observable
      .merge(logins, signups, logouts)
      .subscribe((action: Action) => _store.dispatch(action));
  }

  signup(name, email, password) {
    this.actions$.next({type: SIGNUP_USER, payload: {name, email, password}});
  }

  login(email, password) {
    this.actions$.next({type: LOGIN_USER, payload: {email, password}});
  }

  logout() {
    this.actions$.next({type: LOGOUT_USER});
  }

  check() {
    // take(1) will complete the stream and "then" the promise
    let promise = this.token$.take(1).toPromise();
    return promise;
  }
}
