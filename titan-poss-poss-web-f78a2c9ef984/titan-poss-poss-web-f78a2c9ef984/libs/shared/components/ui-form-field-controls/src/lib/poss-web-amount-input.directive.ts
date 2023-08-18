import {
  Directive,
  OnInit,
  HostListener,
  ElementRef,
  Inject,
  OnChanges,
  Input
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  POSS_WEB_AMOUNT_DIGITS_BEFORE_DECIMAL,
  POSS_WEB_AMOUNT_FRACTION_DIGITS
} from '@poss-web/shared/util-config';

@Directive({
  selector: 'input[possWebAmountInput]'
})
export class PossWebAmountInputDirective implements OnChanges, OnInit {
  defaultValue: any;

  private regex: RegExp;
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'Del',
    'Delete'
  ];

  @Input('allowDecimal') allowDecimal = true;
  @Input('allowEnterEscape') allowEnterEscape = false;

  constructor(
    private controlRef: NgControl,
    private elementRef: ElementRef,
    @Inject(POSS_WEB_AMOUNT_FRACTION_DIGITS) private fractionDigits,
    @Inject(POSS_WEB_AMOUNT_DIGITS_BEFORE_DECIMAL) private digitsBeforeDecimal
  ) {
    // Allow decimal numbers and negative values
  }

  ngOnInit(): void {
    if (this.allowDecimal) {
      this.regex = new RegExp(
        `^\\d{1,${this.digitsBeforeDecimal}}(\\.\\d{0,${this.fractionDigits}})?$`,
        'g'
      );
    } else {
      this.regex = new RegExp(`^\\d{1,${this.digitsBeforeDecimal}}$`, 'g');
    }
  }

  // ngOnInit() {
  //   this.defaultValue = this.controlRef.control.value;
  // }

  ngOnChanges() {
    if (this.controlRef.control && this.controlRef.control.value) {
      this.defaultValue = this.controlRef.control.value;
    }
  }

  @HostListener('blur', [])
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event) {
      if (this.allowEnterEscape) {
        if (
          event.key === 'Enter' ||
          event.key === 'Escape' ||
          event.key === 'Tab'
        )
          return;
      } else {
        if (event.key === 'Escape') {
          this.controlRef.control.setValue(this.defaultValue);
          event.stopPropagation();
          return;
        }
      }

      // Ctrl+A
      if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
        console.log(event.keyCode, ' ', event.ctrlKey, ' ', event.metaKey);
        return;
      }

      // Allow Backspace, tab, end, and home keys
      if (this.specialKeys.indexOf(event.key) !== -1) {
        event.stopPropagation();
        return;
      }
      const current: string = this.elementRef.nativeElement.value;
      const position = this.elementRef.nativeElement.selectionStart;
      const next: string = [
        current.slice(0, position),
        event.key === 'Decimal' ? '.' : event.key,
        current.slice(position)
      ].join('');
      if (next && !String(next).match(this.regex)) {
        event.preventDefault();
      }
    }
  }
}
