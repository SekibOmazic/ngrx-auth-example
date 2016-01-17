import {Component, Host} from 'angular2/core';
import {ControlGroup, NgFormModel} from 'angular2/common';


@Component({
  selector: 'show-error',
  inputs: ['controlPath: control', 'errorTypes: errors'],
  template: `<span *ngIf="errorMessage !== null">{{errorMessage}}</span>`
})
export class ShowError {
  formDir: NgFormModel;
  controlPath: string;
  errorTypes: string[];

  constructor(@Host() formDir: NgFormModel) { this.formDir = formDir; }

  get errorMessage(): string {
    var form: ControlGroup = this.formDir.form;
    var control = form.find(this.controlPath);

    if (control !== undefined && control.touched) {
      for (var i = 0; i < this.errorTypes.length; ++i) {
        if (control.hasError(this.errorTypes[i])) {
          return this._errorMessage(this.errorTypes[i]);
        }
      }
    }
    return null;
  }

  _errorMessage(code: string): string {
    var config = {
      'required': 'is required',
      'invalidEmail': 'hmm ... that doesn\'t look like an email address',
      'minlength': 'should be at least 4 characters long.'
    };

    return config[code];
  }
}
