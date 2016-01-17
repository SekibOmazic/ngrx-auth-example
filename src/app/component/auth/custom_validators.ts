import {Injectable} from 'angular2/core';
import {Control} from 'angular2/common';

@Injectable()
export class CustomValidators {

  // c: Control
  email(c: Control) {
    let emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!c.value.match(emailRegex)) {
      return {
        invalidEmail: true
      };
    }
    // return null = valid
    return null;
  }

}
