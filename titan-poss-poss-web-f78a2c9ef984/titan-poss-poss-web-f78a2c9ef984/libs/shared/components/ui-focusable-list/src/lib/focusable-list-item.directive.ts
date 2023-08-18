import {
  ElementRef,
  HostBinding,
  Directive,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';

@Directive({
  selector: '[possWebFocusableListItem]'
})
export class FocusableListItemDirective implements FocusableOption {
  @HostBinding() tabindex = -1;

  @Output() private selected = new EventEmitter<any>();

  constructor(private elementRef: ElementRef) { }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  /**
   *  Listener for Enter key event to send  selected event
   */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.selected.emit();
    }
  }
}
