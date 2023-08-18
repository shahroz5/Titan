import {
  Directive,
  OnInit,
  HostListener,
  ElementRef,
  Inject
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { POSS_WEB_WEIGHT_FRACTION_DIGITS } from '@poss-web/shared/util-config';
import { DigiGoldWeightFormatterService } from '@poss-web/shared/components/ui-formatters';

@Directive({
  selector: 'input[digiGoldWeightInput]'
})
export class DigiGoldInputDirective implements OnInit {
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

  constructor(
    private controlRef: NgControl,
    private elementRef: ElementRef,
    private weightFormatterService: DigiGoldWeightFormatterService,
    @Inject(POSS_WEB_WEIGHT_FRACTION_DIGITS) fractionDigits
  ) {
    // Old Regex : Allow decimal numbers and negative values
    // this.regex = new RegExp(`^-?\\d*\\.?\\d{0,${fractionDigits}}$`, 'g');
    // this.regex = new RegExp(fieldValidation.weightField.pattern, 'g');
    this.regex = new RegExp(/^[0-9]{0,4}(\.\d{0,4})?$/, 'g');
  }

  ngOnInit() {
    this.format();
    this.defaultValue = this.controlRef.control.value;
  }

  format() {
    if (
      this.controlRef.control.value === 0 ||
      !!this.controlRef.control.value
    ) {
      this.controlRef.control.setValue(
        this.weightFormatterService.format(this.controlRef.control.value)
      );
    }
  }

  @HostListener('blur', [])
  onBlur() {
    this.format();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.controlRef.control.setValue(this.defaultValue);
      event.stopPropagation();
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
