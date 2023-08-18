import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  @Input() control = new FormControl();
  @Input() passwordCharPattern;
  @Input() placeholder;

  @Output() submit = new EventEmitter();

  @Output() valueChange = new EventEmitter<{
    value: string;
    isValid: boolean;
  }>();

  allowedPasswordCharPattern;
  maskForm: FormControl;
  password: String = '';
  passwordMask: String = '';
  currentkey: String;

  @ViewChild('input') elementRef: ElementRef;

  private skipSpecialKeys: Array<string> = [
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'Control',
    'Escape',
    'Delete',
    'Del'
  ];

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  ngOnInit() {
    this.allowedPasswordCharPattern = new RegExp(this.passwordCharPattern);
    this.maskForm = new FormControl(
      null,
      this.fieldValidatorsService.requiredField(this.placeholder)
    );
  }

  // keyEvent(event: KeyboardEvent) {
  //   if (event.ctrlKey) {
  //     return false;
  //   }

  //   if (event.key === 'Enter') {
  //     this.submit.next();
  //     return false;
  //   }

  //   this.currentkey = event.key;
  //   if (event.key === 'Tab') {
  //     return true;
  //   } else if (event.key === 'Backspace') {
  //     const current: String = this.password;
  //     const next = current.slice(0, current.length - 1);
  //     this.setPassword(next);
  //     return false;
  //   } else if (this.skipSpecialKeys.indexOf(event.key) !== -1) {
  //     return false;
  //   } else if (this.allowedPasswordCharPattern.test(event.key)) {
  //     this.setPassword(this.password + event.key);
  //     return false;
  //   } else {
  //     this.maskForm.patchValue(this.passwordMask);
  //     return false;
  //   }
  // }

  inputEvent(event) {
    if (this.allowedPasswordCharPattern.test(event.data)) {
      this.setPassword(this.password + event.data);
    }
  }

  setPassword(newPassword) {
    this.password = newPassword;
    this.control.patchValue(this.password);
    this.maskForm.patchValue(this.password);
  }

  setSelectionPosition(start, end) {
    this.elementRef.nativeElement.selectionStart = start;
    this.elementRef.nativeElement.selectionEnd = end;
  }

  valueChangeFn() {
    this.valueChange.emit({
      value: this.control.value,
      isValid: this.control.valid
    });
  }

  reset() {
    this.currentkey = '';
    this.passwordMask = '';
    this.password = '';
    this.maskForm.reset();
    this.control.reset();
  }
}
