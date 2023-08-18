import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import {
  CmBillList,
  bcHistoryDetails
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import {Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'poss-web-bc-history-grid',
  templateUrl: './bc-history-grid.component.html',
})
export class BcHistoryGridComponent implements OnInit ,OnDestroy{
  domLayout = 'autoHeight';
  rowHeight = '50';
  animateRows = true;
  api: GridApi;
  rowData = [];
  columnDefs = [];
  defaultColDef = {
    resizable: true,
    suppressMovable: true
  };

  docNo: string;
  customerName: string;
  invoicedTime: string;
  cmNoHeader: string;
  customerNameHeader: string;


 fiscalYear: string;
 cmDate: any;
 cmAmount: string;
 cancellationType: string;
 reason: string;
 createdBy: string;
 createdDate: string;

 minPageSize: number;

  @Output() selectedCM = new EventEmitter<CmBillList>();

  @Input() historyItems: bcHistoryDetails[];
  @Input() totalCashMemoHistoryReq: number;
  @Input() approvalHrs: number;
  @Input() approvalRequired: boolean;
  destroy$: Subject<null> = new Subject<null>();
  @Output() selectedHistoryItem: EventEmitter<{[key:string]: string | number}> = new EventEmitter<
    {[key:string]: string | number}
  >();

  @Input() cashMemoHistory: bcHistoryDetails[];
  @Input() totalElements: number;
  @Input() pageSizeOptions: number[] = [];
  @Input() pageEvent;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() searchHistory = new EventEmitter<any>();

  fiscal: any;
  cmDateres: any;
  cmAmountres: any;
  cancellationTyperes: any;
  reasonres: any;
  createdByres: any;
  createdDateres: any;
  cmNo: any;
  customer: any;
  cmNoHeaderLabel: any;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private DateFormatterService:DateFormatterService
  ) {
    this.translate
      .get([
        'pw.bc.cmNoHeaderLabel',
        'pw.bc.cmNo',
        'pw.bc.customerNameLabel',
        'pw.bc.fiscalYearLable',
        'pw.bc.cmDateLable',
        'pw.bc.cmAmountLable',
        'pw.bc.cancellationTypeLable',
        'pw.bc.reasonForCancellationLable',
        'pw.bc.createdByLable',
        'pw.bc.createdDateLable',

        'pw.bc.fiscal',
        'pw.bc.cmDate',
        'pw.bc.cmAmount',
        'pw.bc.cancellationType',
        'pw.bc.reasonForCancellation',
        'pw.bc.createdBy',
        'pw.bc.createdDate',
        'pw.bc.customerName',
        'pw.bc.customerNameHeaderLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        (this.docNo = translatedMessages['pw.bc.cmNo']),
        (this.cmNoHeaderLabel = translatedMessages['pw.bc.cmNoHeaderLabel']),
        (this.customerName = translatedMessages['pw.bc.cmNoHeaderLabel']),
        (this.customer = translatedMessages['pw.bc.customerName']),
        (this.fiscalYear = translatedMessages['pw.bc.fiscalYearLable']),
        (this.fiscal = translatedMessages['pw.bc.fiscal']);
        (this.cmDate = translatedMessages['pw.bc.cmDateLable']),
        (this.cmDateres = translatedMessages['pw.bc.cmDate']),
        (this.cmAmount = translatedMessages['pw.bc.cmAmountLable']),
        (this.cmAmountres = translatedMessages['pw.bc.cmAmount']),
        (this.cancellationType = translatedMessages['pw.bc.cancellationTypeLable']),
        (this.cancellationTyperes = translatedMessages['pw.bc.cancellationType']),
        (this.reason = translatedMessages['pw.bc.reasonForCancellationLable']),
        (this.reasonres = translatedMessages['pw.bc.reasonForCancellation']),
        (this.createdBy = translatedMessages['pw.bc.createdByLable']),
        (this.createdByres = translatedMessages['pw.bc.createdBy']),
        (this.createdDate = translatedMessages['pw.bc.createdDateLable']),
        (this.createdDateres = translatedMessages['pw.bc.createdDate']),
        (this.customerNameHeader = translatedMessages['pw.bc.customerNameHeaderLabel'])

      });
  }

  ngOnInit(): void {
    this.loadColumns();
  }

  loadColumns() {
    this.columnDefs = [
      {
        field: this.docNo,
        headerName: this.cmNoHeaderLabel,
        // sortable: true,
        width: 100,
        cellRenderer: cmNoHeaderLabel =>
          `<a class="pw-anchor-underline">${cmNoHeaderLabel.value}</a>`
      },
      {
        field: this.customer,
        headerName: this.customerNameHeader,
        width: 208
      },
      {
        field: this.fiscal,
        headerName: this.fiscalYear,
        width: 200
      },
      {
        field: this.cmDateres,
        headerName: this.cmDate,
        width: 208,
        valueFormatter: params => {
          return this.DateFormatterService.format(moment(params.value));
        }
      },
      {
        field: this.cmAmountres,
        headerName: this.cmAmount,
        width: 200
      },
      {
        field: this.cancellationTyperes,
        headerName: this.cancellationType,
        width: 220
      },
      {
        field: this.reasonres,
        headerName: this.reason,
        width: 208
      },
      {
        field: this.createdByres,
        headerName: this.createdBy,
        width: 208
      },
      {
        field: this.createdDateres,
        headerName: this.createdDate,
        width: 208,
        valueFormatter: params => {
          return this.DateFormatterService.format(moment(params.value));
        }
      },

    ];
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  onCellClicked(event) {

      if (event && event.data) {
        this.selectedHistoryItem.emit(event.data);
        console.log(event.data.cmId,'emmitted iddd')
      }

  }

  timeRenderer(time) {
    const totalHours = moment().diff(time, 'hours');
    const totalMins = moment().diff(time, 'minutes');
    if (totalHours === 0) {
      if (totalMins < 10) {
        return `${time.format('LT')}(${time.fromNow()})`;
      } else {
        return `${time.format('LT')}(a few minutes ago)`;
      }
    } else if (totalHours === 1) {
      return `${time.format('LT')}(${totalHours} hour ago)`;
    } else if (totalHours > 1 && totalHours < 24) {
      return `${time.format('LT')}(${totalHours} hours ago)`;
    } else {
      return `${time.format('LT')}(${time.fromNow()})`;
    }
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if ([this.cmDate, this.createdDateres].some(x => x === this.currentRowField))
      this.currentRowInfo = this.DateFormatterService.format(moment(this.currentRowInfo));
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
