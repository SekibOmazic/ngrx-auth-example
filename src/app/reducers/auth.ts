import { Action, Reducer, Store } from '@ngrx/store';

import { Auth } from '../model/models';

export const LOGIN_USER = 'LOGIN_USER';
export const LOGIN_IN_PROGRESS = 'LOGIN_IN_PROGRESS';
export const SIGNUP_USER = 'SIGNUP_USER';
export const SIGNUP_IN_PROGRESS = 'SIGNUP_IN_PROGRESS';
export const USER_AUTHENTICATED = 'USER_AUTHENTICATED';
export const AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';
export const LOGOUT_USER = 'LOGOUT_USER';
export const LOGOUT_IN_PROGRESS = 'LOGOUT_IN_PROGRESS';
export const LOGOUT_RECEIVED = 'LOGOUT_RECEIVED';

export const INIT = 'INIT';

var initialState: Auth = {
  error: null,
  token: null,
  current: null
};

export const auth: Reducer<any> = (state = initialState, action: Action = {type: INIT}) => {

  switch (action.type) {
    case USER_AUTHENTICATED:
      return Object.assign({}, state,
        {token: action.payload.token, current: action.payload.user, error: null});

    case LOGOUT_RECEIVED:
      return Object.assign({}, initialState);

    case LOGIN_FAILURE:
    case SIGNUP_FAILURE:
    case AUTH_TOKEN_EXPIRED:
      return Object.assign({}, state, {error: action.payload.error, token: null, current: null});

    default:
      return state;
  }

};
