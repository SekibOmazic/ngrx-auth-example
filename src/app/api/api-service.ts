import { Injectable } from 'angular2/core';
import { Headers, Http, Request, RequestMethod, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';

import { User, Auth } from '../model/models';
import { API_USERS_URL, API_LOGIN_URL, API_SIGNUP_URL } from './constants';
import { AuthService } from '../model/AuthService';


@Injectable()
export class ApiService {
  private token$: Observable<string>;

  constructor(private http: Http, private _store: Store<any>) {
    this.token$ = _store.select<Auth>('auth')
                        .map(data => data['token'])
                        .filter(token => !!token);
  }

  loginUser(user: any): Observable<Auth> {
    return this.request({
      body: user,
      method: RequestMethod.Post,
      url: API_LOGIN_URL
    });
  }

  signupUser(user: any): Observable<User> {
    return this.request({
      body: user,
      method: RequestMethod.Post,
      url: API_SIGNUP_URL
    });
  }

  loadUsers(): Observable<User[]> {
    return this.oAuthRequest({
      method: RequestMethod.Get,
      url: API_USERS_URL
    });
  }
/*
  loadUser(userId: string): Observable<User> {
    return this.request({
      method: RequestMethod.Get,
      url: `${API_USERS_URL}/${userId}`
    });
  }
*/
  updateUser(user: User): Observable<User> {
    return this.request({
      body: user,
      method: RequestMethod.Put,
      url: `${API_USERS_URL}/${user.id}`
    });
  }

  oAuthRequest(options): Observable<any> {

    return this.token$.flatMap(token => {
      options.headers = new Headers();
      options.headers.append('Content-Type', 'Bearer ' + 'application/json');
      options.headers.append('Authorization', 'Bearer ' + token);

      if (options.body && typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);
      }

      return this.http.request(new Request(options)).map((res: Response) => res.json());
    });

  }

  request(options: any): Observable<any> {
    if (options.body) {
      if (typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);
      }

      options.headers = new Headers({
        'Content-Type': 'application/json'
      });
    }

    return this.http.request(new Request(options))
      .map((res: Response) => res.json());
  }

}
