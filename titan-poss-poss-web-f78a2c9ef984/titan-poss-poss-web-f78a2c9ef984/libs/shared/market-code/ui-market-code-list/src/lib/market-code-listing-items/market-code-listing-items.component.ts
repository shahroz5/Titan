import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { fromEvent, Observable, Subject } from 'rxjs';
import { MarketCodeDetails } from '@poss-web/shared/models';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-market-code-listing-items',
  templateUrl: './market-code-listing-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketCodeListingItemsComponent
  implements OnDestroy, AfterViewInit {
  @Input() marketCodeListing: MarketCodeDetails[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() marketCode = new EventEmitter<any>();
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() permissions$: Observable<any[]>;
  @Input() invalidSearch: boolean;
  @Output() isActive = new EventEmitter<any>();
  @Output() viewPage = new EventEmitter<string>();
  @Output() emitSearchValue = new EventEmitter<string>();
  @Output() clearEvent = new EventEmitter<string>();
  destroy$ = new Subject<null>();

  @Output() paginator = new EventEmitter<PageEvent>();
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });



  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.emitSearchValue.emit(searchValue);
        } else this.clearSearch();
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  emitMarketCode(marketCode) {
    this.searchForm.reset();
    this.marketCode.emit(marketCode);
  }
  marketDetailsStatus($event) {
    this.searchForm.reset();
    this.isActive.emit($event);
  }
  openViewPage($event) {
    this.searchForm.reset();
    this.viewPage.emit($event);
  }
  clearSearch() {
    this.searchForm.reset();
    this.clearEvent.emit();
  }
  trackBy(_: string, market: MarketCodeDetails) {
    return market.marketCode;
  }
  emitPagination($event) {
    this.searchForm.reset();
    this.paginator.emit($event);
  }
}
