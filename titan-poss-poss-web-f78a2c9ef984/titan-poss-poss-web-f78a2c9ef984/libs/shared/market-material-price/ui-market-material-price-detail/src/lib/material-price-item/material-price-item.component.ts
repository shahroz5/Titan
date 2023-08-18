import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MarketDetails, LocationDetails } from '@poss-web/shared/models';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-material-price-item',
  templateUrl: './material-price-item.component.html',
  styleUrls: ['./material-price-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialPriceItemComponent implements OnInit, OnDestroy {
  @Input() hasNewViewLocationSuccess: boolean;
  @Input() mode: string;
  @Input() materialPriceTypeCode: string;
  @Input() marketCodeListing: MarketDetails[];
  @Input() headerDetails: FormGroup;
  @Input() locationDetails: LocationDetails[];
  @Input() isAllSelected: boolean;

  @Output() computePrice = new EventEmitter<MarketDetails>();
  @Output() computePriceForAll = new EventEmitter<{
    selected: boolean;
    basePrice: number;
  }>();
  @Output() updateChecked = new EventEmitter<{
    checked: boolean;
    ids: string[];
  }>();

  isDisabled = true;
  selectItemDisable = true;
  destroy$ = new Subject<null>();
  marketCodes: [] = [];
  columnsForDaily: string[] = [
    'marketCode',
    'markupFactor',
    'addAmount',
    'deductAmount'
  ];
  columnsToDisplay: string[] = [
    'marketCode',
    'marketDescription',
    'locationCode',
    'locationDescription',
    'materialPrice'
  ];
  displayedColumns: string[] = [
    'select',
    'marketCode',
    'description',
    'markupFactor',
    'addAmount',
    'deductAmount',
    'computedPrice'
  ];
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.headerDetails.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (
          this.headerDetails.get('basePrice').value !== '' &&
          !this.isAllSelected
        ) {
          this.isDisabled = false;
          this.selectItemDisable = false;
        } else if (this.headerDetails.get('basePrice').value === '') {
          this.isDisabled = true;
          this.selectItemDisable = true;
          const marketItems = this.marketCodeListing.filter(
          marketCode => marketCode.isChecked
        );
        this.updateChecked.emit({
          checked: false,
          ids: marketItems.map(data => data.marketCode)
        });
      }
        this.cdr.markForCheck();
      });
  }

  selectAllItem(checked) {
    if (!checked) {
      this.headerDetails.get('basePrice').enable();
    } else {
      this.headerDetails.get('basePrice').disable();
    }
    this.selectItemDisable = checked ? true : checked;
    const basePriceAmount = this.headerDetails.get('basePrice').value;
    this.computePriceForAll.emit({
      selected: checked,
      basePrice: basePriceAmount
    });
  }

  selectItem(checked, row) {
    if (!checked) {
      this.headerDetails.get('basePrice').enable();
    } else {
      this.headerDetails.get('basePrice').disable();
    }
    this.computePrice.emit({
      isChecked: checked,
      marketCode: row.marketCode,
      markupFactor: row.markupFactor,
      addAmount: row.addAmount,
      deductAmount: row.deductAmount,
      computedPrice: this.headerDetails.get('basePrice').value
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
