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
import { CnPriorityListItemsDirective } from './cn-priority-list-items.directive';

@Directive({
  selector: '[possWebCnPriorityList]'
})
export class CnPriorityListDirective implements AfterContentInit, OnDestroy {
  @Input() vertical = true;
  @Input() horizontal = false;
  @Input() wrap = true;
  @Input() changes = true;
  @Input() index: number;
  @HostBinding() tabindex = 0;

  @ContentChildren(CnPriorityListItemsDirective)
  private focusableListItems: QueryList<CnPriorityListItemsDirective>;

  private keyManager: FocusKeyManager<CnPriorityListItemsDirective>;
  private destroy$ = new Subject<null>();

  ngAfterContentInit(): void {
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
