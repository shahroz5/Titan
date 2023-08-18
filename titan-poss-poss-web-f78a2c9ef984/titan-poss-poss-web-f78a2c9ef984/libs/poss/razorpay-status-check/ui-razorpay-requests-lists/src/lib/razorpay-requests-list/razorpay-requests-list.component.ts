import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  AirpayVerifyPaymentComponent,
  StatusComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { AirpayGenerateCNButtonComponent } from 'libs/shared/components/ui-ag-grid/src/lib/airpay-generate-cn-button/airpay-generate-cn-button.component';
import * as moment from 'moment';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-razorpay-requests-list',
  templateUrl: './razorpay-requests-list.component.html'
})
export class RazorpayRequestsListComponent implements OnInit, OnChanges {
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
  razorpayPaymentsListingComponent: any = this;

  domLayout = 'autoHeight';
  rowHeight = '75';
  animateRows = true;
  defaultColDef = {
    // flex: 1,
    resizable: true,
    suppressMovable: true
  };

  destroy$: Subject<null> = new Subject<null>();

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
          if (
            params.data.customerTitle &&
            params.data.customerTitle !== null &&
            params.data.customerTitle !== undefined
          ) {
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
          } else {
            return (
              `<div>` +
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
        field: 'requestedBy',
        headerName: 'Requested By',
        width: 208,
        minWidth: 80
      },
      {
        field: 'equestedDate',
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
        cellRenderer: 'statusComponentRenderer'
      },
      {
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
        // field: 'customerName',
        headerName: 'Customer Details',
        width: 208,
        minWidth: 80,
        pinned: 'left',
        cellRenderer: params => {
          if (
            params.data.customerTitle &&
            params.data.customerTitle !== null &&
            params.data.customerTitle !== undefined
          ) {
            return (
              `<div>` +
              params.data.customerTitle +
              `. ` +
              params.data.customerName +
              `</div>` +
              `<div class="pw-tertiary-color">` +
              params.data.customerMobileNo +
              `</div>`
              // +
              // `<div class="pw-tertiary-color">` +
              // params.data.ulpId +
              // `</div>`
            );
          } else {
            return (
              `<div>` +
              params.data.customerName +
              `</div>` +
              `<div class="pw-tertiary-color">` +
              params.data.customerMobileNo +
              `</div>`
              // +
              // `<div class="pw-tertiary-color">` +
              // params.data.ulpId +
              // `</div>`
            );
          }
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
        field: 'requestedBy',
        headerName: 'Requested By',
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
          return (
            `<div>` +
            moment(params.data.approvedDate).format(this.dateFormat) +
            `</div>` +
            `<div class="pw-tertiary-color">` +
            moment(params.data.approvedDate).format('HH:mm:ss') +
            `</div>`
          );
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
        field: 'errorMessage',
        headerName: 'Rejected Reason',
        width: 220,
        minWidth: 80,
        cellRenderer: params => {
          return (
            `<div>` + params?.data?.otherDetails?.data?.errorMessage + `</div>`
          );
        }
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
    // this.api.redrawRows();
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
      componentParent: this.razorpayPaymentsListingComponent
    };
  }

  verifyPayment(value: any) {
    this.verifyEmit.emit(value);
  }
  generateCN(value: any) {
    this.generateCNEmit.emit(value);
  }
}
