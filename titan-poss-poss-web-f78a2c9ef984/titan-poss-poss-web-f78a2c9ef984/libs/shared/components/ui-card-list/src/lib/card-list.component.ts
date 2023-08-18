import {
  Component,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewChildren,
  HostListener,
  QueryList,
  TemplateRef,
  ContentChild,
  HostBinding,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { CardComponent } from './card/card.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

/**
 * Poss-Web-Card-List
 * Uses the Poss-Web-Card to display card the list
 * @param count [number] : Total count of the dataList, Used for pagination calculation
 * @param pageSize [number] (Input): PageSize shown. Used for pagination calculation
 * @param dataList  [any[]]: Array of data list to display
 * @param selected  [EventEmitter<any>]: Event emitter for selected data from poss-web-card
 * @param loadMore  [EventEmitter<number>]: Event emitter for loading data with next pageIndex
 */
@Component({
  selector: 'poss-web-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardListComponent implements AfterViewInit, OnDestroy {
  @HostBinding() tabindex = 0;
  @Input() count = 0;
  @Input() pageSize = 4;
  @Input() dataList: any[];

  @Output() private loadMore: EventEmitter<number> = new EventEmitter<number>();
  @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Template passed by the user of this controll
   * Will be used to render the cards based on the template passed
   */
  @ContentChild(TemplateRef, { static: true }) templateRef: any;
  @ViewChildren(CardComponent) private cardComponents: QueryList<CardComponent>;
  @ViewChild('cardList', { static: true })
  private cardListRef: ElementRef;
  private noOfColumns = 4;

  selectedIndex: number;
  isFocusSet = false;
  destroy$ = new Subject();
  private keyManager: FocusKeyManager<CardComponent>;

  constructor(private breakpointObserver: BreakpointObserver) {
    const col4 = '(min-width: 768px)';
    const col3 = '(min-width: 992px)';
    this.breakpointObserver
      .observe([col4, col3])
      .subscribe((state: BreakpointState) => {
        if (state.breakpoints[col3]) {
          this.noOfColumns = 4;
        } else if (state.breakpoints[col4]) {
          this.noOfColumns = 3;
        } else {
          this.noOfColumns = 2;
        }
      });
  }



  ngAfterViewInit(): void {
    /**
     * FocusKeyManager configuration
     */
    this.keyManager = new FocusKeyManager(this.cardComponents)
      .withHorizontalOrientation('ltr')
      .withVerticalOrientation(false)
      .withWrap();

    this.keyManager.setFirstItemActive();

    this.cardComponents.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe((change: any) => {
        if (change.length > 0) {
          /**
           * Set the focus to the last element if the no more data to be shown
           * Show more button will not be rendered in this case
           */
          if (
            this.count !== 0 &&
            this.dataList.length !== 0 &&
            this.count > this.pageSize &&
            this.count - this.dataList.length === 0
          ) {
            this.keyManager.setActiveItem(this.dataList.length - 1);
          }

          /**
           * Set the focus to the first element,
           */
          if (!this.isFocusSet) {
            this.keyManager.setFirstItemActive();
            this.isFocusSet = true;
          } else {
            this.scrollDown();
          }
        }
      });
  }

  /**
   *  Emits the load event with pageIndex of next page to load
   */
  onClickLoadMore(): void {
    console.log('pageIndex', this.dataList.length, this.pageSize);
    const pageIndex = this.dataList.length / this.pageSize;

    this.loadMore.emit(pageIndex);
  }

  /**
   *  Pass Emits with data and index of the card which is selected to the user of the control.
   */
  onSelected({ data, index }: { data: any; index: number }): void {
    this.selected.emit(data);
    this.selectedIndex = index;
  }

  focus() {
    this.keyManager.setFirstItemActive();
  }

  /**
   * Reset focus key to set the focus to the first element
   */
  resetFocus() {
    this.isFocusSet = false;
  }

  /**
   * Scroll down fucntion to scoll to the down whenever the data overflow
   */
  scrollDown() {
    try {
      this.cardListRef.nativeElement.scrollTo({
        top: this.cardListRef.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    } catch (err) {}
  }

  /**
   * Listen to the keyDown event for FocusKeyManager
   * Used to send focus event for the card
   */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.code !== 'ArrowDown' && event.code !== 'ArrowUp') {
      this.keyManager.onKeydown(event);
    } else {
      this.rowNavigation(event);
    }
  }

  rowNavigation(event: KeyboardEvent) {
    if (this.cardComponents.length > this.noOfColumns) {
      const totalCount = this.cardComponents.length;
      const currentIndex = this.keyManager.activeItemIndex;
      let nextIndex;
      if (event.code === 'ArrowDown') {
        nextIndex = currentIndex + this.noOfColumns;
        if (nextIndex > totalCount - 1) {
          if (
            this.count !== this.dataList.length ||
            (totalCount % this.noOfColumns &&
              totalCount - currentIndex > totalCount % this.noOfColumns)
          ) {
            nextIndex = totalCount - 1;
            this.scrollDown();
          } else {
            return;
          }
        }
      } else {
        nextIndex = currentIndex - this.noOfColumns;
        if (nextIndex < 0) {
          return;
        }
      }
      this.keyManager.setActiveItem(nextIndex);
      event.stopPropagation();
    }
  }

  @HostListener('focus', ['$event'])
  private focusFirst(event: KeyboardEvent): void {
    this.focus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
