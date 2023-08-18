import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import {
  CurrencyFormatterService,
  CurrencySymbolService
} from '@poss-web/shared/components/ui-formatters';
import {
  DiscountVoucherDetailsRequestPayload,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DiscountSystemDvPopupComponent } from '../discount-system-dv-popup/discount-system-dv-popup.component';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-discount-system-dv',
  templateUrl: './discount-system-dv.component.html',
  styleUrls: ['./discount-system-dv.component.scss']
})
export class DiscountSystemDvComponent implements OnInit, OnDestroy, OnChanges {
  @Input() cashMemoId: string = null;
  @Input() availableDvDiscountConfig;
  @Input() appliedDvDiscounts: any;
  @Input() dateFormat;
  @Input() resetFormEvent: Observable<null>;
  @Input() isRsoSelected: boolean;
  @Input() selectedCustomer: any;
  @Output() removeDvDiscount = new EventEmitter<string>();
  @Output() applyDiscount = new EventEmitter<
    DiscountVoucherDetailsRequestPayload
  >();
  api: GridApi;
  private gridColumnApi;
  rowData = [];
  columnsDef = [];
  domLayout = 'autoHeight';
  rowHeight = '50';
  animateRows = true;
  defaultColDef = {
    flex: 1,
    resizable: true,
    suppressMovable: true
  };
  discountSystemDvComponent: any = this;
  totalDiscount = 0;
  destroy$: Subject<null> = new Subject<null>();
  // isIdProofVerified = false;
  // isCheckBoxDisabled = false;

  get totalDiscountValue() {
    this.totalDiscount = 0;
    this.rowData.forEach(discount => {
      this.totalDiscount =
        this.totalDiscount + discount.discountValueDetails.data.discountAmount;
    });
    return this.totalDiscount;
  }
  constructor(
    private dialog: MatDialog,
    private currencySymbolService: CurrencySymbolService,
    private currencyFormatterService: CurrencyFormatterService,
    private overlayNotificationService: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.resetFormEvent
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.createRowData();
        }
      });
    this.columnsDef = [
      {
        headerName: 'GH Voucher No.',
        field: 'discountValueDetails.data.voucherNo'
        // width: 220
      },
      {
        headerName: 'GH Account No.',
        field: 'discountValueDetails.data.accountNo'
        // width: 220
      },
      {
        headerName: 'Discount Code',
        field: 'discountCode'
        // width: 220
      },
      {
        headerName: 'Customer Name',
        field: 'discountValueDetails.data.customerName'
        // width: 150
      },
      {
        headerName:
          'Discount Amount' +
          ' (' +
          this.currencySymbolService.get('INR') +
          ')',
        field: 'discountValueDetails.data.discountAmount',
        valueFormatter: params =>
          this.currencyRoundOff(
            params.data.discountValueDetails.data.discountAmount
          ),
        cellClass: 'pw-justify-content-end',
        type: 'numericColumn'
        // width: 150
      },
      {
        headerName:
          'Installment Amount' +
          ' (' +
          this.currencySymbolService.get('INR') +
          ')',
        field: 'discountValueDetails.data.installmentAmount',
        valueFormatter: params =>
          this.currencyRoundOff(
            params.data.discountValueDetails.data.installmentAmount
          ),
        cellClass: 'pw-justify-content-end',
        type: 'numericColumn'
      },
      {
        headerName: 'Installments Paid',
        field: 'discountValueDetails.data.noOfInstallmentsPaid',

        type: 'numericColumn'
      },
      // {
      //   headerName:
      //     'Total Installment Amount' +
      //     ' (' +
      //     this.currencySymbolService.get('INR') +
      //     ')',
      //   field: 'totalInstallmentAmount',
      //   valueFormatter: params =>
      //     this.currencyRoundOff(params.data.totalInstallmentAmount),
      //   cellClass: 'pw-justify-content-end',
      //   type: 'numericColumn'
      // },
      {
        headerName: 'Is Gold Coin Allowed',
        field: 'discountValueDetails.data.isGoldCoinAllowed'
      },
      {
        headerName: 'Issue Date',
        field: 'discountValueDetails.data.issueDate',
        valueFormatter: params => {
          return moment(params.data.discountValueDetails.data.issueDate).format(
            this.dateFormat
          );
        }
      },
      {
        headerName: 'Valid From',
        field: 'discountValueDetails.data.validFrom',
        valueFormatter: params => {
          return moment(params.data.discountValueDetails.data.validFrom).format(
            this.dateFormat
          );
        }
      },
      {
        headerName: 'Valid Till',
        field: 'discountValueDetails.data.validTill',
        valueFormatter: params => {
          return moment(params.data.discountValueDetails.data.validTill).format(
            this.dateFormat
          );
        }
      },
      {
        headerName: 'Status',
        field: 'discountValueDetails.data.status'
      },
      {
        headerName: '',
        minWidth: 21,
        maxWidth: 21,
        width: 21,
        cellClass: 'pw-delete-icon-width',
        cellRenderer: 'deleteRowRenderer',
        onCellClicked: this.remove.bind(this)
      }
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['appliedDvDiscounts']) {
      this.createRowData();
    }
  }
  createRowData() {
    this.rowData = [];
    // this.isCheckBoxDisabled = false;
    // this.isIdProofVerified = false;
    this.appliedDvDiscounts.forEach(discount => {
      if (
        discount.discountValueDetails.data &&
        discount.discountValueDetails.data.installmentAmount
      ) {
        const totalInstallmentAmount =
          discount.discountValueDetails.data.installmentAmount *
          discount.discountValueDetails.data.noOfInstallmentsPaid;
        const disc = { ...discount, totalInstallmentAmount };
        this.rowData.push(disc);
      }
    });
    // if (this.rowData.length > 0) {
    //   this.isIdProofVerified = true;
    //   this.isCheckBoxDisabled = true;
    // }
  }
  getContext() {
    return {
      componentParent: this.discountSystemDvComponent
    };
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.gridColumnApi = params.columnApi;
  }
  currencyRoundOff(params: any) {
    const amount = params;
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      'INR',
      false
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }
  openDvDetailsPopup() {
    if (!this.isRsoSelected) {
      this.showOverlayMsgNotification('RSO Name is Mandatory');
    } /* else if (!this.selectedCustomer) {
      this.showOverlayMsgNotification(
        'Add the customer before adding GHS voucher.'
      );
    } */
    // else if (this.availableDvDiscountConfig.length < 1) {
    //   this.showOverlayMsgNotification(
    //     'Discount Voucher Configuration not available'
    //   );
    // }
    // else if (!this.isIdProofVerified) {
    //   this.showOverlayMsgNotification('Please verify Id Proof');
    // }
    else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discount.systemDvDiscountAlertMsg'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            this.dialog
              .open(DiscountSystemDvPopupComponent, {
                data: {},
                disableClose: true
              })
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe(res => {
                if (res) {
                  this.applyDiscount.emit(res);
                }
              });
          }
        });
    }
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }
  remove(params) {
    this.removeDvDiscount.emit(params.data.discountTxnId);
  }
  // onChange(event: any) {
  //   this.isIdProofVerified = event.checked;
  // }
  showOverlayMsgNotification(key: string) {
    const selectErrorkey = key;
    // this.translate
    //   .get(selectErrorkey)
    //   .pipe(take(1))
    //   .subscribe((translatedMsg: any) => {
    this.overlayNotificationService
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        message: key,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
    // });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
