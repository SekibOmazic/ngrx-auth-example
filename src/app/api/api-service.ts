import { Injectable } from 'angular2/core';
import { Headers, Http, Request, RequestMethod, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';

import { User, Auth } from '../model/models';
import { API_USERS_URL, API_LOGIN_URL, API_SIGNUP_URL } from './constants';
import { AuthService } from '../model/AuthService';


@Injectable()
export class ApiService {
  //private token: string;

  constructor(private http: Http) {
    //this.auth.token$.subscribe(token => this.token = token);
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

  loadUsers(token: string): Observable<User[]> {
    return this.request({
      token: token,
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

  request(options: any): Observable<any> {
    if (options.body || options.token) {
      options.headers = new Headers();
    }

    if (options.body) {
      options.headers.append('Content-Type', 'application/json');

      if (typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);
      }
    }

    if (options.token) {
      options.headers.append('Authorization', 'Bearer ' + options.token);
    }

    return this.http.request(new Request(options))
      .map((res: Response) => res.json());
  }
}
