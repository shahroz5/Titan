import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OrderPaymentConfigPayload } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'poss-web-order-payments-listing-items',
  templateUrl: './order-payments-listing-items.component.html'
})
export class OrderPaymentsListingItemsComponent implements OnInit {
  @Input() pageEvent: PageEvent;
  @Input() totalCount: number;
  @Input() configList: OrderPaymentConfigPayload[];
  @Input() pageSize: number[];
  @Input() permissions$: Observable<any[]>;

  @Output() paginator = new EventEmitter<PageTransitionEvent>();
  @Output() loadSelectedConfigId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<{
    isActive: boolean;
    configId: string;
  }>();
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  @Output() viewPage = new EventEmitter<string>();
  destroy$ = new Subject<null>();
  emitSelectedId(configId: any) {
    this.loadSelectedConfigId.emit(configId);
  }
  ngOnInit() {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }
  emitToggle(toggleValue) {
    this.toggleValue.emit(toggleValue);
  }

  trackBy(index: number, item: OrderPaymentConfigPayload) {
    return item.ruleId;
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
}
