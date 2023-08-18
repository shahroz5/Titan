import {
  Directive,
  Input,
  HostListener,
  HostBinding,
  ElementRef
} from '@angular/core';
import { fieldValidation } from './field-validators.pattern';

@Directive({
  selector:
    'input[possWebMaxLengthValidator], textarea[possWebMaxLengthValidator]'
})
export class MaxLengthValidatorDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event'])
  _onKeypress(e) {
    if (this.el.nativeElement.name) {
      const maxLengthValue =
        fieldValidation[this.el.nativeElement.name].maxLength;
      if (maxLengthValue) {
        if (e.target.value.length === maxLengthValue) e.preventDefault();
      }
    }
  }
}
