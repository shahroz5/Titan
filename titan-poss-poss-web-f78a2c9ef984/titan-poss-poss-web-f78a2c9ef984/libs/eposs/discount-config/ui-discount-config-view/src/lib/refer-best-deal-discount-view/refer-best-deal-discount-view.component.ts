import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-refer-best-deal-discount-view',
  templateUrl: './refer-best-deal-discount-view.component.html'
})
export class ReferBestDealDiscountViewComponent  {
  @Input() selectedDiscounts = [];

  @Input() allDiscounts = [];

  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize: number;
  @Input() totalSelectedElements: number;
  @Output() loadItems = new EventEmitter<any>();

  paginate(data) {
    console.log('data', data);
    this.loadItems.emit({
      pageEvent: data
    });
  }
}
