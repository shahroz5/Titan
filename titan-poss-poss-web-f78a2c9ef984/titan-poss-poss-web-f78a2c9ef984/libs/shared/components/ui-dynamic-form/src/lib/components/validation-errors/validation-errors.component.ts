import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'poss-web-validation-errors',
  templateUrl: './validation-errors.component.html'
})
export class ValidationErrorsComponent implements OnInit {
  @Input() formId: number;
  @Input() controlName: string;
  @Input() form: FormGroup;
  @Input() validationErrorMessages: {
    errorType: string;
    errorMessage: string;
  }[];

  control: AbstractControl;

  ngOnInit(): void {
    this.control = this.form.get(this.controlName);
  }
}
