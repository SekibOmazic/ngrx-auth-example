import {provide, ComponentRef} from 'angular2/core';
import {bootstrap, ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {provideStore} from '@ngrx/store';
import {UserService} from './app/model/UserService';
import {AuthService} from './app/model/AuthService';
import {users} from './app/reducers/users';
import {auth} from './app/reducers/auth';
import {API_PROVIDERS} from './app/api/api';

// hack from https://github.com/brandonroberts/angular2-router-example
import {appInjector} from './app/helpers/helpers';


/*
 * App Component
 * our top level component that holds all of our components
 */
import {App} from './app/app';

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
document.addEventListener('DOMContentLoaded', function main() {
  bootstrap(App, [
    ('production' === process.env.ENV ? [] : ELEMENT_PROBE_PROVIDERS),
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    //provide(LocationStrategy, { useClass: HashLocationStrategy }),
    provideStore({ users, auth }),
    UserService,
    AuthService,
    API_PROVIDERS
  ])
  // hack from https://github.com/brandonroberts/angular2-router-example
  .then((appRef: ComponentRef) => {
    appInjector(appRef.injector);
  })
  .catch(err => console.error(err));
});
