import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup } from '@angular/forms';

import { MarketDetails, LocationDetails } from '@poss-web/shared/models';

import { Subject } from 'rxjs';
@Component({
  selector: 'poss-web-material-price-items',
  templateUrl: './material-price-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialPriceItemsComponent implements  OnDestroy {
  @Input() locationDetailsCount: number;
  @Input() hasNewViewLocationSuccess: boolean;
  @Input() mode: string;
  @Input() materialPriceTypeCode: string;
  @Input() locationDetails: LocationDetails[];
  @Input() marketCodeListing: MarketDetails[];
  @Input() headerDetails: FormGroup;
  @Input() marketCodescount: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize: number;
  @Input() isAllSelected: boolean;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() computeBasePrice = new EventEmitter<MarketDetails>();
  @Output() computePriceForAll = new EventEmitter<{
    selected: boolean;
    basePrice: number;
  }>();
  @Output() updateChecked = new EventEmitter<{
    checked: boolean;
    ids: string[];
  }>();

  destroy$ = new Subject<null>();


  sendUpdateCheckedEvent(event) {
    this.updateChecked.emit(event);
  }

  sendComputePriceEvent(event) {
    this.computeBasePrice.emit(event);
  }

  sendComputePriceForAllEvent(event) {
    this.computePriceForAll.emit(event);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
