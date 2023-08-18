import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CurrencyFormatterService,
  CurrencySymbolService
} from '@poss-web/shared/components/ui-formatters';
@Component({
  selector: 'poss-web-view-transaction-level-discounts',
  templateUrl: './view-transaction-level-discounts.component.html',
  styleUrls: ['./view-transaction-level-discounts.component.scss']
})
export class ViewTransactionLevelDiscountsComponent implements OnInit {
  dialogData: any;
  api: GridApi;
  private gridColumnApi;
  billLevelDiscountRowData = [];
  karatOfferRowData = [];
  gepPurityDiscountRowData = [];
  coinOfferRowData = [];
  ghsDvDiscountRowData = [];

  columnsDef = [];
  domLayout = 'autoHeight';
  rowHeight = '50';
  animateRows = true;
  defaultColDef = {
    flex: 1,
    resizable: true,
    suppressMovable: true
  };
  viewTransactionLevelDiscountsComponent: any = this;
  totalDiscount = 0;
  totalBillLevelDiscount = 0;
  totalKaratageOfferDiscount = 0;
  totalSytemDiscountDiscount = 0;
  totalGepPurityDiscount = 0;
  totalCoinOfferDiscount = 0;

  get totalDiscountValue() {
    this.totalDiscount = 0;
    return (this.totalDiscount =
      this.totalBillLevelDiscount +
      this.totalKaratageOfferDiscount +
      this.totalGepPurityDiscount +
      this.totalSytemDiscountDiscount +
      this.totalCoinOfferDiscount);
  }
  constructor(
    private currencySymbolService: CurrencySymbolService,
    private currencyFormatterService: CurrencyFormatterService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ViewTransactionLevelDiscountsComponent>
  ) {
    this.dialogData = data;
    for (const discount of this.dialogData.billLevelDiscounts) {
      this.totalBillLevelDiscount =
        this.totalBillLevelDiscount + discount.discountValue;
      this.billLevelDiscountRowData.push(this.createData(discount));
    }
    for (const discount of this.dialogData.appliedKaratOfferDiscount) {
      this.totalKaratageOfferDiscount =
        this.totalKaratageOfferDiscount + discount.discountValue;
      this.karatOfferRowData.push(this.createData(discount));
    }
    for (const discount of this.dialogData.appliedCoinOfferDiscount) {
      this.totalCoinOfferDiscount =
        this.totalCoinOfferDiscount + discount.discountValue;
      this.coinOfferRowData.push(this.createData(discount));
    }
    for (const discount of this.dialogData.appliedSystemDiscountGepPurity) {
      this.totalGepPurityDiscount =
        this.totalGepPurityDiscount + discount.discountValue;
      this.gepPurityDiscountRowData.push({
        discountCode: discount.discountCode,
        discountId: discount.discountId,
        discountTxnId: discount.discountTxnId,
        discountType: discount.discountType,
        discountAmount: discount.discountValue
      });
    }
    // for (let discount of this.dialogData.appliedCoinOfferDiscount) {
    //   this.totalDiscount = this.totalDiscount + discount.discountValue;
    //   this.coinOfferRowData.push(this.createData(discount));
    // }
    for (const discount of this.dialogData.ghsDVDiscount) {
      this.totalSytemDiscountDiscount =
        this.totalSytemDiscountDiscount + discount.discountValue;
      this.ghsDvDiscountRowData.push(this.createDvRowData(discount));
    }
    for (const discount of this.dialogData.ghsBonusDiscount) {
      this.totalSytemDiscountDiscount =
        this.totalSytemDiscountDiscount + discount.discountValue;
      this.ghsDvDiscountRowData.push(this.createDvRowData(discount));
    }
  }
  createData(discount: any) {
    return {
      discountCode: discount.discountCode,
      discountId: discount.discountId,
      discountTxnId: discount.discountTxnId,
      discountType: discount.discountType,
      discountAmount: discount.discountValue,
      component: discount.discountValueDetails.data
        ? discount.discountValueDetails.data.discountValueDetails[0].component
        : '-',
      discountPercent:
        discount.discountValueDetails.data &&
        discount.discountValueDetails.data.discountValueDetails[0]
          .discountPercent
          ? discount.discountValueDetails.data.discountValueDetails[0]
              .discountPercent
          : '-',
      discountValue: discount.discountValueDetails.data
        ? discount.discountValueDetails.data.discountValueDetails[0]
            .discountValue
        : '-',
      isDiscountPercentage: discount.discountValueDetails.data
        ? discount.discountValueDetails.data.discountValueDetails[0]
            .isDiscountPercentage
        : '-'
    };
  }
  createDvRowData(discount: any) {
    return {
      discountCode: discount.discountCode,
      discountId: discount.discountId,
      discountTxnId: discount.discountTxnId,
      discountType: discount.discountType,
      discountAmount: discount.discountValue,
      component: null,
      discountPercent: '-',
      discountValue: discount.discountValue,
      isDiscountPercentage: false
    };
  }
  ngOnInit(): void {
    this.columnsDef = [
      {
        headerName: 'Discount Type',
        field: 'discountType',
        width: 220
      },
      {
        headerName: 'Discount Code',
        field: 'discountCode',
        width: 220
      },
      {
        headerName: 'Percentage (%)',
        field: 'discountPercent',
        width: 150
      },
      {
        headerName:
          'Amount' + ' (' + this.currencySymbolService.get('INR') + ')',
        field: 'discountAmount',
        valueFormatter: params => this.currencyRoundOff(params),
        // isAmount: true,
        cellClass: 'pw-justify-content-end',
        type: 'numericColumn',
        width: 150

        // isAmount: true,
        // type: 'numericColumn',
        // cellClass: 'pw-justify-content-right'.
      }
    ];
  }
  getContext() {
    return {
      componentParent: this.viewTransactionLevelDiscountsComponent
    };
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.gridColumnApi = params.columnApi;
  }
  // onGridSizeChanged() {
  //   if (window.innerWidth >= 768) {
  //     this.api.sizeColumnsToFit();
  //   }
  // }
  onClose() {
    this.dialogRef.close();
  }
  currencyRoundOff(params: any) {
    const amount = params.data.discountAmount;
    console.log(amount);
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      'INR',
      false
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }
}
