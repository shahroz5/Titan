import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';

import { FocusableOption } from '@angular/cdk/a11y';

@Directive({
  selector: '[possWebBankPriorityListItems]'
})
export class BankPriorityListItemsDirective implements FocusableOption {
  @HostBinding() tabindex = -1;

  @Output() private up = new EventEmitter<any>();
  @Output() private down = new EventEmitter<any>();

  changeOrder = false;

  constructor(private elementRef: ElementRef) {}

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  @HostListener('keydown', ['$event'])
  private keyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.changeOrder = !this.changeOrder;
    }
    if (this.changeOrder === true) {
      if (event.key === 'ArrowUp') {
        this.up.emit();
      }
      if (event.key === 'ArrowDown') {
        this.down.emit();
      }
    }
  }
}
