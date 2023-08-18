import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { CashMemoHistoryDetails } from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { commonTranslateKeyMap } from 'libs/shared/util-adaptors/src/lib/helpers/common.map';

@Component({
  selector: 'poss-web-cash-memo-history-items',
  templateUrl: './cash-memo-history-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashMemoHistoryItemsComponent implements OnInit {
  @Input() cashMemoHistory: CashMemoHistoryDetails[];
  @Input() totalCashMemoHistoryReq: number;
  @Input() pageSizeOptions: number[] = [];
  @Input() pageEvent;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() searchHistory = new EventEmitter<any>();
  @Output() selectedHistoryItem: EventEmitter<string> = new EventEmitter<
    string
  >();
  @Output() sortOrder = new EventEmitter<any>();

  destroy$: Subject<null> = new Subject<null>();
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  columnDefs = [];

  defaultColDef = {
    flex: 1,
    suppressMovable: true
  };
  minPageSize: number;
  api: any;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;
  statusColor: string;

  constructor(
    private translate: TranslateService,
    private dateFormatterService: DateFormatterService
  ) {}

  ngOnInit(): void {
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );

    this.translate
      .get([
        'pw.cashMemoHistory.cmNumber',
        'pw.cashMemoHistory.docDate',
        'pw.cashMemoHistory.fiscalYear',
        'pw.cashMemoHistory.customerNameLabel',
        'pw.cashMemoHistory.netAmount',
        'pw.cashMemoHistory.createdBy',
        'pw.cashMemoHistory.createdDate',
        'pw.cashMemoHistory.statusLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerName: translatedMessages['pw.cashMemoHistory.cmNumber'],
            field: 'docNo',
            width: 150,
            suppressMovable: true,
            sortable: true,
            cellRenderer: params => this.viewAnchorRenderer(params),
            cellClass: 'pw-fourth-color',
            cellStyle: { cursor: 'pointer' }
          },
          {
            headerName: translatedMessages['pw.cashMemoHistory.docDate'],
            field: 'docDate',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true,
            sortable: true,
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            }
          },

          {
            headerName: translatedMessages['pw.cashMemoHistory.fiscalYear'],
            suppressMovable: true,
            field: 'fiscalYear',
            sortable: true,
            width: 150
          },
          {
            headerName:
              translatedMessages['pw.cashMemoHistory.customerNameLabel'],
            field: 'customerName',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.cashMemoHistory.netAmount'],
            field: 'netAmount',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.cashMemoHistory.createdBy'],
            field: 'createdBy',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            field: 'status',
            headerName: translatedMessages['pw.cashMemoHistory.statusLabel'],
            cellClass: params => {
              const color = this.getStatusColor(params.data.status);

              return color;
            }
          }
        ];
      });
  }
  viewAnchorRenderer(params) {
    return `<a class="pw-anchor-underline pw-fourth-color">${params.value}</a>`;
  }

  getStatusColor(status: string) {
    if (status) {
      let key;
      if (commonTranslateKeyMap.has(status)) {
        key = commonTranslateKeyMap.get(status);
      }
      if (key) {
        this.translate
          .get([key.statusColor])
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMessages: string) => {
            this.statusColor = translatedMessages[key.statusColor];
          });

        return this.statusColor;
      }
    }
  }

  onCellClicked(event) {
    if (event && event.column && event.column.getColId() === 'docNo') {
      if (event && event.data) {
        this.selectedHistoryItem.emit(event.data.id);
      } else if (!event || (event && !event.data)) {
        this.selectedHistoryItem.emit(null);
      }
    }
  }

  onCellKeyPress(pressEvent) {
    const keyPressed = pressEvent.event.key;
    if (keyPressed === 'Enter') {
      if (
        pressEvent &&
        pressEvent.column &&
        pressEvent.column.getColId() === 'docNo'
      ) {
        if (pressEvent && pressEvent.data) {
          this.selectedHistoryItem.emit(pressEvent.data.id);
        } else if (!pressEvent || (pressEvent && !pressEvent.data)) {
          this.selectedHistoryItem.emit(null);
        }
      }
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }
  printSortStateToConsole(event) {
    const sortState = this.api.getSortModel();
    console.log(sortState);
    if (sortState.length === 0) {
      this.sortOrder.emit(null);
    } else {
      for (let i = 0; i < sortState.length; i++) {
        const item = sortState[i];
        item.sort = item.sort[0].toUpperCase() + item.sort.slice(1);
        console.log(sortState);
        this.sortOrder.emit(item);
      }
    }
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if (this.currentRowField === 'docDate')
      this.currentRowInfo = this.dateFormatterService.format(
        moment(this.currentRowInfo)
      );
  }

  focusOut(event) {
    this.isFocusing = false;
  }
}
