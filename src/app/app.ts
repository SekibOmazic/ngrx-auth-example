import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { Signup } from './component/auth/signup';
import { Login } from './component/auth/login';
import { NgRx } from './NgRx';
import { NotFound } from './component/notfound/notfound';

@Component({
  selector: 'app',
  directives: [ ROUTER_DIRECTIVES ],
  template: `<router-outlet></router-outlet>`
})
@RouteConfig([
  { path: '/', redirectTo: ['NgRx']},
  { path: '/ngrx/...',  component: NgRx,  name: 'NgRx' },
  { path: '/signup', component: Signup, name: 'Signup' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/**', component: NotFound }
])
export class App {

}
