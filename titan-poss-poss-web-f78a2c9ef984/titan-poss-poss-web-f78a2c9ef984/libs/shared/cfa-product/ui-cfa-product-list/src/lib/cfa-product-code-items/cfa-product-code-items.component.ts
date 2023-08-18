import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { fromEvent, Observable, Subject } from 'rxjs';
import { CFAProducts, CFAProductsResponse } from '@poss-web/shared/models';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-cfa-product-code-items',
  templateUrl: './cfa-product-code-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CfaProductCodeItemsComponent
  implements  OnDestroy, AfterViewInit {
  @Input() CFAProductCodeListing: CFAProductsResponse[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() productGroupCode = new EventEmitter<string>();
  destroy$ = new Subject<null>();
  @Input() pageSizeOptions;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Input() minPageSize;
  @Input() permissions$: Observable<any[]>;
  @Input() invalidSearch: boolean;
  @Output() isActive = new EventEmitter<{
    isActive: boolean;
    courierName: string;
  }>();
  @Output() viewProductCodeDetails = new EventEmitter<string>();
  @Output() emitSearchValue = new EventEmitter<string>();
  @Output() clearEvent = new EventEmitter();
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.emitSearchValue.emit(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  emitProductGroupCode(productGroupCode) {
    this.productGroupCode.emit(productGroupCode);
  }
  clearSearch() {
    this.searchForm.reset();
    this.clearEvent.emit(true);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  toggleButton($event) {
    this.searchForm.reset();
    this.isActive.emit($event);
  }
  viewMode($event) {
    this.viewProductCodeDetails.emit($event);
  }
  emitPagination($event) {
    this.searchForm.reset();
    this.paginator.emit($event);
  }
  trackBy(_: string, cfaProducts: CFAProducts) {
    return cfaProducts.productGroupCode;
  }
}
