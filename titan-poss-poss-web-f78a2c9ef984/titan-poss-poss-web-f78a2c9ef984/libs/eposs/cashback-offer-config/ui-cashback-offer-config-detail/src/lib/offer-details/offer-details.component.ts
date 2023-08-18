import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  BankDetailsPayload,
  OfferDetailResponse,
  OfferDetails,
  offerDetailsEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OfferDetailsPopUpComponent } from '../offer-details-pop-up/offer-details-pop-up.component';

@Component({
  selector: 'poss-web-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferDetailsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() offerDetails: OfferDetails[];
  @Input() excludeCashBack: boolean;
  @Input() isCashAmount: boolean;
  @Input() isCleared: boolean;
  @Input() bankDetails: BankDetailsPayload;

  @Output() clearEvent = new EventEmitter<OfferDetailResponse>();
  @Output() offerDetailsEvent = new EventEmitter<OfferDetailResponse>();

  i: number;
  disabled = false;
  disableButton = true;
  urlParam: string;
  radioOptions: string;
  gridApi: GridApi;
  columnDefs = [];
  destroy$ = new Subject<null>();
  defaultColDef = {
    suppressMovable: true
  };
  domLayout = 'autoHeight';

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;
  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.urlParam = this.activatedRoute.snapshot.params['_configId'];
  }

  ngOnInit() {
    this.translate
      .get([
        'pw.cashbackConfig.minSwipeAmt',
        'pw.cashbackConfig.maxSwipeAmt',
        'pw.cashbackConfig.cashBackAmt',
        'pw.cashbackConfig.discount%',
        'pw.cashbackConfig.maxDiscount%',
        'pw.cashbackConfig.minInvoiceAmt',
        'pw.cashbackConfig.maxInvoiceAmt'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerName: translatedMessages['pw.cashbackConfig.minSwipeAmt'],
            field: 'minSwipeAmt',
            width: 155,
            minWidth: 105
          },
          {
            headerName: translatedMessages['pw.cashbackConfig.maxSwipeAmt'],
            field: 'maxSwipeAmt',
            width: 155,
            minWidth: 105
          },
          {
            headerName: translatedMessages['pw.cashbackConfig.cashBackAmt'],
            field: 'discountAmt',
            width: 150,
            minWidth: 105
          },
          {
            headerName: translatedMessages['pw.cashbackConfig.discount%'],
            field: 'discountPercent',
            width: 150,
            minWidth: 105
          },
          {
            headerName: translatedMessages['pw.cashbackConfig.maxDiscount%'],
            field: 'maxDiscountPercent',
            width: 150,
            minWidth: 105
          },
          {
            headerName: translatedMessages['pw.cashbackConfig.minInvoiceAmt'],
            field: 'minInvoiceAmt',
            width: 150,
            minWidth: 105
          },
          {
            headerName: translatedMessages['pw.cashbackConfig.maxInvoiceAmt'],
            field: 'maxInvoiceAmt',
            width: 150,
            minWidth: 105
          },
          {
            headerName: '',
            field: '',
            width: 25,
            minWidth: 25,

            cellClassRules: {
              'pw-i-24 pw-edit-icon-24': params => {
                return true;
              }
            }
          }
        ];
      });
  }

  radioChange(event) {
    if (event) {
      this.isCleared = false;
      this.gridApi.setRowData([]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.i = this.offerDetails.length ? this.offerDetails.length : 0;
    this.radioOptions = this.isCashAmount
      ? offerDetailsEnum.amount
      : offerDetailsEnum.percentage;
    this.disableButton = this.offerDetails.length ? false : true;
    if (changes['offerDetails']) {
      if (this.offerDetails.length === 0) {
        this.disabled = false;
      } else {
        if (this.gridApi) {
          this.gridApi.setRowData(this.offerDetails);
        }
        this.disabled = true;
      }
    }
    if (this.isCleared === true) {
      this.gridApi.setRowData([]);
    }
  }
  onCellClicked(mode: string, event?: any) {
    if (this.bankDetails?.cashbackName !== '' && !this.bankDetails?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      let lastRowData;
      let nextRowData;
      if (this.getAllRows().length === 0 || event?.rowIndex === 0) {
        lastRowData = null;
        nextRowData = this.getRowData(event?.rowIndex + 1)
      } else if (mode === offerDetailsEnum.edit) {
        lastRowData = this.getRowData(event?.rowIndex - 1);
      } else {
        lastRowData = this.getLastRowData();
      }

      let data: any;
      if (mode === offerDetailsEnum.new) {
        data = {
          minSwipeAmt: '',
          maxSwipeAmt: '',
          discountPercent: '',
          discountAmt: '',
          isCashbackAmount:
            this.radioOptions === offerDetailsEnum.amount
              ? this.radioOptions === offerDetailsEnum.amount
              : false,
          maxDiscountPercent: '',
          minInvoiceAmt: '',
          maxInvoiceAmt: '',
          excludeCashback: this.excludeCashBack,
          mode: mode,
          lastRowData: lastRowData
        };
      } else if (mode === offerDetailsEnum.edit) {
        data = {
          minSwipeAmt: event.data ? event.data.minSwipeAmt : '',
          maxSwipeAmt: event.data ? event.data.maxSwipeAmt : '',
          discountPercent: event.data ? event.data.discountPercent : '',
          discountAmt: event.data ? event.data.discountAmt : '',
          isCashbackAmount:
            this.radioOptions === offerDetailsEnum.amount
              ? this.radioOptions === offerDetailsEnum.amount
              : false,
          maxDiscountPercent: event.data ? event.data.maxDiscountPercent : '',
          minInvoiceAmt: event.data ? event.data.minInvoiceAmt : '',
          maxInvoiceAmt: event.data ? event.data.maxInvoiceAmt : '',
          excludeCashback: this.excludeCashBack,
          id: event.data ? event.data.id : '',
          mode: mode,
          lastRowData: lastRowData,
          nextRowData: nextRowData,
          rowId: event.data.rowId ? event.data.rowId : ''
        };
      }
      if (
        offerDetailsEnum.edit === mode ? event.colDef.headerName === '' : true
      ) {
        const dialog = this.dialog.open(OfferDetailsPopUpComponent, {
          width: '500px',
          data: data,
          disableClose: true
        });
        dialog.afterClosed().subscribe(res => {
          if (res) {
            if (res.data.mode !== offerDetailsEnum.edit) {
              this.onAddRow(res.data);
            } else {
              this.onUpdateRow(res.data);
            }
          }
        });
      }
    }
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.offerDetails);
  }

  onAddRow(newItem: OfferDetails) {
    this.disableButton = false;
    newItem.rowId = ++this.i;
    newItem.isSaved = false;
    this.gridApi.applyTransaction({ add: [newItem] });
    this.cdr.markForCheck();
  }

  onGridSizeChanged() {
    this.gridApi.sizeColumnsToFit();


  }

  onUpdateRow(newItem) {
    this.disableButton = false;
    if (newItem.id !== '') {
      newItem.isUpdated = true;
    } else {
      newItem.isSaved = false;
    }

    const res = this.gridApi.applyTransaction({ update: [newItem] });
    this.gridApi.redrawRows({ rowNodes: res.update });
    if (newItem.id !== '') {
      newItem = {
        discountAmt: newItem.discountAmt,
        discountPercent: newItem.discountPercent,
        id: newItem.id ? newItem.id : '',
        maxDiscountAmt: newItem.maxDiscountPercent
          ? newItem.maxDiscountPercent
          : ''
      };

      this.offerDetailsEvent.emit({
        data: {
          updateOffers: [newItem],
          addOffers: [],
          removeOffers: [],
          isCashbackAmount:
            this.radioOptions === offerDetailsEnum.amount
              ? this.radioOptions === offerDetailsEnum.amount
              : false
        },
        id: this.urlParam
      });
    }
    this.cdr.markForCheck();
  }
  /**
   * Unique identifier for each row
   * @param data : data of each row
   */
  getRowNodeId(data: any) {
    return data.rowId;
  }

  clear() {
    if (this.bankDetails?.cashbackName !== '' && !this.bankDetails?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const rowData = this.getAllRows();
      if (rowData.filter(r => r.isSaved === false).length) {
        this.disabled = false;
        this.disableButton = true;
        this.i = 0;
        this.gridApi.setRowData([]);
      } else {
        const removeOffers = rowData.map(r => r.id);
        this.clearEvent.emit({
          data: {
            removeOffers: removeOffers,
            isCashbackAmount:
              this.radioOptions === offerDetailsEnum.amount ? true : false
          },
          id: this.urlParam
        });
      }
    }
  }
  showMessage(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }
  save() {
    if (this.bankDetails?.cashbackName !== '' && !this.bankDetails?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const offerDetails = this.prepareResponse();
      this.offerDetailsEvent.emit(offerDetails);
    }
  }
  prepareResponse() {
    const rowData = this.getAllRows();
    let offerDetailResponse: OfferDetailResponse;
    const newlyAded = rowData
      .filter(i => i.isSaved === false)
      .map(r => ({
        discountAmt: r.discountAmt,
        discountPercent: r.discountPercent,
        maxDiscountAmt: r.maxDiscountPercent,
        maxInvoiceAmt: r.maxInvoiceAmt,
        maxSwipeAmt: r.maxSwipeAmt,
        minInvoiceAmt: r.minInvoiceAmt,
        minSwipeAmt: r.minSwipeAmt,
        rowId: r.rowId
      }));

    offerDetailResponse = {
      data: {
        updateOffers: [],
        removeOffers: [],
        addOffers: newlyAded,
        isCashbackAmount:
          this.radioOptions === offerDetailsEnum.amount ? true : false
      },
      id: this.urlParam
    };

    return offerDetailResponse;
  }

  getAllRows() {
    const rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  getLastRowData() {
    if (this.gridApi.getDisplayedRowCount()) {
      return this.gridApi.getDisplayedRowAtIndex(
        this.gridApi.getLastDisplayedRow()
      ).data;
    }
  }
  getRowData(rowIndex: number) {
    if (this.gridApi.getDisplayedRowCount()) {
      return this.gridApi.getDisplayedRowAtIndex(
        rowIndex
      )?.data;
    }
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    const node = this.gridApi.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.gridApi.getValue(this.currentRowField, node);
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
