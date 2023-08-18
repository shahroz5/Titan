import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'poss-web-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleButtonComponent),
      multi: true
    }
  ]
})
export class ToggleButtonComponent implements ControlValueAccessor {
  @Input() isActive: boolean;
  @Input() isDisabled: boolean;
  @Output() changeEvent = new EventEmitter<any>();
  @Input() toggleCaption: string;
  @Input() className: string;

  @Input() formContolValue: boolean;
  onChange: any = () => {};
  onTouched: any = () => {};

  get value() {
    return this.formContolValue;
  }

  set value(val) {
    this.formContolValue = val;
    this.onChange(val);
    this.onTouched();
  }


  change($event) {
    this.changeEvent.emit($event);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  switch() {
    this.value = !this.value;
  }
}
