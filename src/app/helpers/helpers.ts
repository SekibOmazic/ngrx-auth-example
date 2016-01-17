import {Injector} from 'angular2/core';
import {Router, ComponentInstruction} from 'angular2/router';
import {AuthService} from '../model/AuthService';


let appInjectorRef: Injector;

export const appInjector = (injector?: Injector) => {
  if (!injector) {
    return appInjectorRef;
  }

  appInjectorRef = injector;

  return appInjectorRef;
};


export const shouldActivate = (to: ComponentInstruction, from: ComponentInstruction) => {
  let injector: Injector = appInjector();
  let auth: AuthService = injector.get(AuthService);
  let router: Router = injector.get(Router);

  // return a promise that resolves true/false
  return new Promise((resolve) => {
    auth.token$
      .subscribe((result) => {
        if (result) {
          resolve(true);
        } else {
          if (to.urlPath === 'signup' || to.urlPath === 'login') {
            resolve(true);
          } else {
            router.navigate(['/Login']);
            resolve(false);
          }
        }
      });
  });

};
