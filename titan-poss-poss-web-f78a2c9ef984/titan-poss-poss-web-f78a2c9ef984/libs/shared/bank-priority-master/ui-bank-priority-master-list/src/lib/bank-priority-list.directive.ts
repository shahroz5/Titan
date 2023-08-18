import {
  Directive,
  HostBinding,
  HostListener,
  AfterContentInit,
  OnDestroy,
  Input,
  ContentChildren,
  QueryList
} from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BankPriorityListItemsDirective } from './bank-priority-list-items.directive';

@Directive({
  selector: '[possWebBankPriorityList]'
})
export class BankPriorityListDirective implements AfterContentInit, OnDestroy {
  @Input() vertical = true;
  @Input() horizontal = false;
  @Input() wrap = true;
  @Input() changes = true;

  @Input() index: number;
  @HostBinding() tabindex = 0;

  @ContentChildren(BankPriorityListItemsDirective)
  private focusableListItems: QueryList<BankPriorityListItemsDirective>;

  private keyManager: FocusKeyManager<BankPriorityListItemsDirective>;
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
            this.focusItemByIndex();
          }
        });
    }
  }

  focus() {
    this.keyManager.setFirstItemActive();
  }
  focusItemByIndex() {
    this.keyManager.setActiveItem(this.index);
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
    this.focus();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
