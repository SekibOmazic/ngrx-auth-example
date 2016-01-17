import { Action, Reducer, Store } from '@ngrx/store';

import { User, Users } from '../model/models';

export const LOAD_USERS = 'LOAD_USERS';
export const LOADING_USERS = 'LOADING_USERS';
export const LOADED_USERS = 'LOADED_USERS';
export const ADD_USER = 'ADD_USER';
export const ADDING_USER = 'ADDING_USER';
export const ADDED_USER = 'ADDED_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATED_USER = 'UPDATED_USER';
export const INIT = 'INIT';

var initialState: Users = {
  users: [],
  loading: false,
  adding: false
};

export const users: Reducer<any> = (state = initialState, action: Action = {type: INIT}) => {
  switch (action.type) {
    case LOADING_USERS:
      return Object.assign({}, state, {loading: true});
    case LOADED_USERS:
      return Object.assign({}, state, {users: action.payload, loading: false});
    case ADDING_USER:
      return Object.assign({}, state, {adding: true});
    case ADDED_USER:
      return Object.assign({}, state, {users: [...state.users, action.payload], adding: false});
    case UPDATED_USER:
      return Object.assign(
        {},
        state,
        {users: state.users.map(
          user => { return user.id !== action.payload.id ? action.payload : user; })}
      );

    default:
      return state;
  }
};
