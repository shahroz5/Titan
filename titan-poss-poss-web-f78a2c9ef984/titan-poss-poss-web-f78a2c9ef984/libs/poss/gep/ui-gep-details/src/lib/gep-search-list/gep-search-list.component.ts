import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessList,
  GEPList,
} from '@poss-web/shared/models';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { PageEvent } from '@angular/material/paginator';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'poss-web-gep-search-list',
  templateUrl: './gep-search-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GepSearchListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() gepHistory: GEPList[];
  @Input() totalGepHistoryReq = 0;
  @Input() pageSizeOptions: number[] = [];
  @Input() pageEvent;

  @Input() count = 0;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() searchHistory = new EventEmitter<any>();

  @Output() selectedGEP: EventEmitter<GEPList> = new EventEmitter<GEPList>();

  @Input() disable: boolean;
  @Output() activate = new EventEmitter<AccessList>();
  @Input() minPageSize = 0;
  @Input() pageSize = 10;
  @Output() sort = new EventEmitter<any>();
  destroy$: Subject<null> = new Subject<null>();

  api: GridApi;
  columnApi: ColumnApi;
  parentForm: FormArray = new FormArray([]);

  rowData: GEPList[] = [];
  domLayout = 'autoHeight';
  rowHeight = '50';
  animateRows = true;
  columnDefs = [];

  defaultColDef = {
    flex: 1,
    suppressMovable: true
  };

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

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
        'pw.gepHistory.docNumberLabel',
        'pw.gepHistory.cnDocNoLabel',
        'pw.gepHistory.fiscalYearLabel',
        'pw.gepHistory.docDateLabel',
        'pw.gepHistory.customerNameLabel',
        'pw.gepHistory.gepValueLabel',
        'pw.gepHistory.statusLabel',
        'pw.gepHistory.createdByLabel',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerName: translatedMessages['pw.gepHistory.docNumberLabel'],
            field: 'docNo',
            cellRenderer: params => this.viewAnchorRenderer(params),
            resizable: true,
            cellClass: 'pw-fourth-color',
            cellStyle: { cursor: 'pointer' }
          },
          {
            headerName: translatedMessages['pw.gepHistory.cnDocNoLabel'],
            field: 'cnDocNo',
            resizable: true,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.gepHistory.fiscalYearLabel'],
            field: 'fiscalYear',
            resizable: true,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.gepHistory.docDateLabel'],
            field: 'docDate',
            resizable: true,
            suppressMovable: true,
            suppressSizeToFit: true,
            valueFormatter: params => {
                return this.dateFormatterService.format(moment(params.value));
              }
          },
          {
            headerName: translatedMessages['pw.gepHistory.customerNameLabel'],
            field: 'customerName',
            resizable: true
          },
          {
            headerName: translatedMessages['pw.gepHistory.gepValueLabel'],
            field: 'netAmount',
            resizable: true,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.gepHistory.statusLabel'],
            field: 'status',
            resizable: true,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.gepHistory.createdByLabel'],
            field: 'createdBy',
            resizable: true,
            suppressMovable: true,
            suppressSizeToFit: true
          }
        ];
      });
  }

  dateFormat(date) {
    return moment(date);
  }

  viewAnchorRenderer(params) {
    return `<a class="pw-anchor-underline pw-fourth-color">${params.value}</a>`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gepHistory']) {
      this.rowData = this.gepHistory;
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  onCellClicked(event) {
    if (event && event.column && event.column.getColId() === 'docNo') {
      if (event && event.data) {
        this.selectedGEP.emit(event.data);
      } else if (!event || (event && !event.data)) {
        this.selectedGEP.emit(null);
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
      this.currentRowInfo = this.dateFormatterService.format(moment(this.currentRowInfo));
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
