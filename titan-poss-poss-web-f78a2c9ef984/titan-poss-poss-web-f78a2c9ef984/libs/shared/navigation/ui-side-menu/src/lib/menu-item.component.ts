import {
  Component,
  ElementRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';

@Component({
  selector: 'poss-web-menu-item',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuItemComponent implements FocusableOption {
  @Output() focusToggle = new EventEmitter();

  constructor(public element: ElementRef) {}

  focus(): void {
    this.element.nativeElement.focus();
    this.focusToggle.emit();
  }
}
