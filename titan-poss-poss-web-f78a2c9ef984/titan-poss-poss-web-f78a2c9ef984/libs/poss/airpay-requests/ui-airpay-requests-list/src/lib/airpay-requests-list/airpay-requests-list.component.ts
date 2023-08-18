import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import {
  AirpayVerifyPaymentComponent,
  StatusComponent,
  AirpayGenerateCNButtonComponent
} from '@poss-web/shared/components/ui-ag-grid';
import * as moment from 'moment';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';

@Component({
  selector: 'poss-web-airpay-requests-list',
  templateUrl: './airpay-requests-list.component.html',
  styleUrls: ['./airpay-requests-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirpayRequestsListComponent implements OnInit, OnChanges {
  @Input() paymentsList;
  @Input() paymentsHistory;
  @Input() listCount = 0;
  @Input() historyCount = 0;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Input() dateFormat;
  @Input() tab: string;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() verifyEmit = new EventEmitter<any>();
  @Output() generateCNEmit = new EventEmitter<any>();

  api: GridApi;
  private gridColumnApi;
  listRowData = [];
  historyRowData = [];
  listColumnDefs = [];
  historyColumnDefs = [];
  airpayPaymentsListingComponent: any = this;

  domLayout = 'autoHeight';
  rowHeight = '75';
  animateRows = true;
  defaultColDef = {
    // flex: 1,
    resizable: true,
    suppressMovable: true
  };

  destroy$: Subject<null> = new Subject<null>();
  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(private currencySymbolService: CurrencySymbolService) {}

  ngOnInit(): void {
    this.loadColumns();
    this.loadPaymentDetails();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paymentsList']) {
      this.loadPaymentDetails();
    }
    if (changes['paymentsHistory']) {
      this.loadPaymentDetails();
    }
  }
  loadColumns() {
    this.listColumnDefs = [
      {
        // field: 'customerName',
        headerName: 'Customer Details',
        width: 208,
        minWidth: 80,
        pinned: 'left',
        cellRenderer: params => {
          return (
            `<div>` +
            params.data.customerTitle +
            `. ` +
            params.data.customerName +
            `</div>` +
            `<div class="pw-tertiary-color">` +
            params.data.customerMobileNo +
            `</div>` +
            `<div class="pw-tertiary-color">` +
            params.data.ulpId +
            `</div>`
          );
        }
      },
      {
        field: 'referenceId',
        headerName: 'Transaction Id',
        // cellClass: 'pw-justify-content-end',
        width: 208,
        minWidth: 80
      },
      {
        field: 'amount',
        isAmount: true,
        headerName:
          'Requested Amount' +
          ' (' +
          this.currencySymbolService.get('INR') +
          ')',
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        width: 208,
        minWidth: 80
      },
      {
        field: 'requestedDate',
        headerName: 'Requested Date & Time',
        width: 208,
        minWidth: 80,
        cellRenderer: params => {
          return (
            `<div>` +
            moment(params.data.requestedDate).format(this.dateFormat) +
            `</div>` +
            `<div class="pw-tertiary-color">` +
            moment(params.data.requestedDate).format('HH:mm:ss') +
            `</div>`
          );
        }
      },
      {
        field: 'approvedDate',
        headerName: 'Approved/Rejected Date & Time',
        width: 220,
        minWidth: 80,
        cellRenderer: params => {
          if (
            params.data.status === 'IN_PROGRESS' ||
            params.data.status === 'OPEN'
          ) {
            return null;
          } else {
            return (
              `<div>` +
              moment(params.data.approvedDate).format(this.dateFormat) +
              `</div>` +
              `<div class="pw-tertiary-color">` +
              moment(params.data.approvedDate).format('HH:mm:ss') +
              `</div>`
            );
          }
        }
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 220,
        minWidth: 80,
        // cellClass: 'justify-content-center',
        cellRenderer: 'statusComponentRenderer'
      },
      {
        // cellRenderer: 'verificationRenderer',
        // cellRendererFramework: params => {
        //   if (params.data.status === 'COMPLETED') {
        //     return 'generateCnButtonRenderer';
        //   } else {
        //     return 'verificationRenderer';
        //   }
        // },
        // cellRendererSelector: () => {
        //   return this.editItemRenderer(
        //     this.productGridPropertiesData?.actualWeight?.isEditable
        //   );
        cellRendererSelector: params => {
          if (params.data.status === 'COMPLETED') {
            return {
              component: 'generateCnButtonRenderer'
            };
          } else {
            return {
              component: 'verificationRenderer'
            };
          }
        },
        cellClass: 'justify-content-center'
      }
    ];
    this.historyColumnDefs = [
      {
        headerName: 'Customer Details',
        width: 208,
        minWidth: 80,
        pinned: 'left',
        cellRenderer: params => {
          return (
            `<div>` +
            params.data.customerTitle +
            `. ` +
            params.data.customerName +
            `</div>` +
            `<div class="pw-tertiary-color">` +
            params.data.customerMobileNo +
            `</div>` +
            `<div class="pw-tertiary-color">` +
            params.data.ulpId +
            `</div>`
          );
        }
      },
      {
        field: 'referenceId',
        headerName: 'Transaction Id',
        // cellClass: 'pw-justify-content-end',
        width: 208,
        minWidth: 80
      },
      {
        field: 'amount',
        isAmount: true,
        headerName:
          'Requested Amount' +
          ' (' +
          this.currencySymbolService.get('INR') +
          ')',
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        width: 208,
        minWidth: 80
      },
      {
        field: 'requestedDate',
        headerName: 'Requested Date & Time',
        width: 208,
        minWidth: 80,
        cellRenderer: params => {
          return (
            `<div>` +
            moment(params.data.requestedDate).format(this.dateFormat) +
            `</div>` +
            `<div class="pw-tertiary-color">` +
            moment(params.data.requestedDate).format('HH:mm:ss') +
            `</div>`
          );
        }
      },
      {
        field: 'approvedDate',
        headerName: 'Approved/Rejected Date & Time',
        width: 220,
        minWidth: 80,
        cellRenderer: params => {
          if (params.data.approvedDate) {
            return (
              `<div>` +
              moment(params.data.approvedDate).format(this.dateFormat) +
              `</div>` +
              `<div class="pw-tertiary-color">` +
              moment(params.data.approvedDate).format('HH:mm:ss') +
              `</div>`
            );
          } else {
            return `<div class="pw-tertiary-color"> - </div>`;
          }
        }
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 220,
        minWidth: 80,
        // cellClass: 'justify-content-center',
        cellRenderer: 'statusComponentRenderer'
      }
    ];
  }
  loadPaymentDetails() {
    this.listRowData = [];
    this.paymentsList.forEach(payment => {
      this.listRowData.push({ ...payment });
    });

    this.historyRowData = [];
    this.paymentsHistory.forEach(history => {
      this.historyRowData.push({ ...history });
    });
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.gridColumnApi = params.columnApi;
  }
  getComponents() {
    return {
      verificationRenderer: AirpayVerifyPaymentComponent,
      statusComponentRenderer: StatusComponent,
      generateCnButtonRenderer: AirpayGenerateCNButtonComponent
    };
  }
  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }
  getContext() {
    return {
      componentParent: this.airpayPaymentsListingComponent
    };
  }

  verifyPayment(value: any) {
    this.verifyEmit.emit(value);
  }
  generateCN(value: any) {
    this.generateCNEmit.emit(value);
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if (this.currentRowField === 'requestedDate' || this.currentRowField === 'approvedDate')
      this.currentRowInfo = moment(this.currentRowInfo).format(this.dateFormat) + moment(this.currentRowInfo).format('HH:mm:ss');
    if (this.focusedHeaderName === 'Customer Details') {
      this.currentRowInfo = node.data.customerTitle + `. ` +
      node.data.customerName + `, ` +
      node.data.customerMobileNo +`, ` +
      node.data.ulpId
    }
  }

  focusOut(event) {
    this.isFocusing = false;
  }

}
