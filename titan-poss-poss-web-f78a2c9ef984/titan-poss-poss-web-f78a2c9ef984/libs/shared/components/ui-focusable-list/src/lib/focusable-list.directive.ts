import {
  HostListener,
  HostBinding,
  Directive,
  QueryList,
  OnDestroy,
  ContentChildren,
  AfterContentInit,
  Input
} from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { FocusableListItemDirective } from './focusable-list-item.directive';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({
  selector: '[possWebFocusableList]'
})
export class FocusableListDirective implements AfterContentInit, OnDestroy {
  @Input() vertical = true;
  @Input() horizontal = false;
  @Input() wrap = true;
  @Input() changes = true;
  @Input() isFirstItem = false;
  @HostBinding() tabindex = 0;

  @ContentChildren(FocusableListItemDirective)
  private focusableListItems: QueryList<FocusableListItemDirective>;

  private keyManager: FocusKeyManager<FocusableListItemDirective>;
  private destroy$ = new Subject<null>();

  ngAfterContentInit(): void {
    /**
     * FocusKeyManager configuration
     */
    this.keyManager = new FocusKeyManager(this.focusableListItems)
      .withVerticalOrientation(this.vertical)
      .withWrap(this.wrap);

    if (this.horizontal) {
      this.keyManager.withHorizontalOrientation('ltr');
    }

    this.focus();

    if (this.changes) {
      this.focusableListItems.changes
        .pipe(takeUntil(this.destroy$))
        .subscribe((change: any) => {
          if (change.length > 0) {
            this.focus();
          }
        });
    }
  }

  focus() {
    this.keyManager.setFirstItemActive();
  }

  /**
   * Listen to the keyDown event for FocusKeyManager
   * Used to send focus event for the card
   */
  @HostListener('keydown', ['$event'])
  private onKeydown(event: KeyboardEvent): void {
    this.keyManager.onKeydown(event);
  }

  @HostListener('focus', ['$event'])
  private focusFirst(event: KeyboardEvent): void {
    if (this.isFirstItem === true) {
    } else {
      this.focus();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
