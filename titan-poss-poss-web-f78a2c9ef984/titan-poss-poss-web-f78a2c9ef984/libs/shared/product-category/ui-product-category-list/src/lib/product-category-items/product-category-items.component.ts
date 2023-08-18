import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-product-category-items',
  templateUrl: './product-category-items.component.html'
})
export class ProductCategoryItemsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() productCategoryDetailsList;//: Observable<ProductCategoryDetails>;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() productCategoryCodeView = new EventEmitter<any>();
  @Output() productCategoryCode = new EventEmitter<any>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitToggleValue = new EventEmitter<any>();
  @Input() pageSize;
  destroy$ = new Subject<null>();
  pageSizeOptions: number[] = [];
  minPageSize = 0;


  ngOnChanges(): void {
    this.pageSizeOptions = this.pageSize;

    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  ngOnInit() {
    // this.appSettingFacade
    //   .getPageSizeOptions()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(data => {
    //     this.pageSizeOptions = data;
    //     this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
    //       a < b ? a : b
    //     );
    //   });
  }

  emitProductCategoryCodeView(productCategoryCode) {
    this.productCategoryCodeView.emit(productCategoryCode);
  }

  emitProductCategoryCode(productCategoryCode) {
    this.productCategoryCode.emit(productCategoryCode);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
}
