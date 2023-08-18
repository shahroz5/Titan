import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  CurrencyFormatterService,
  CurrencySymbolService
} from '@poss-web/shared/components/ui-formatters';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'poss-web-discount-details-system-discount',
  templateUrl: './discount-details-system-discount.component.html',
  styleUrls: ['./discount-details-system-discount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountDetailsSystemDiscountComponent
  implements  OnChanges {
  @Input() currencyCode: string;
  @Input() systemDiscounts: any = [];
  @Output() total = new EventEmitter<number>();

  columnDefs = [];

  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;
  api: GridApi;

  defaultColDef = {
    resizable: false,
    suppressMovable: true,
    suppressSizeToFit: true
  };

  totalData = [
    {
      discountType: 'Automated Bill Level Discount',
      total: 0
    }
  ];

  constructor(
    private currencyFormatterService: CurrencyFormatterService,
    private currencySymbolService: CurrencySymbolService
  ) {
    this.columnDefs = [
      {
        headerName: 'Applicable Discounts',
        field: 'discountType',
        flex: 1
      },
      {
        headerName:
          'Total Amount' +
          ' (' +
          this.currencySymbolService.get(this.currencyCode) +
          ')',
        field: 'total',
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        width: 300,
        valueFormatter: param => this.formatCurrency(param.value)
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['systemDiscounts']) {
      this.calculateTotal();
    }
  }

  calculateTotal() {
    const total = this.systemDiscounts
      .map(d => d.total)
      .reduce((t1, t2) => t1 + t2, 0);
    this.totalData[0].total = total;
    this.total.emit(total);
  }

  formatCurrency(value) {
    return this.currencyFormatterService.format(
      value,
      this.currencyCode,
      false
    );
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.api.sizeColumnsToFit();
  }


}
