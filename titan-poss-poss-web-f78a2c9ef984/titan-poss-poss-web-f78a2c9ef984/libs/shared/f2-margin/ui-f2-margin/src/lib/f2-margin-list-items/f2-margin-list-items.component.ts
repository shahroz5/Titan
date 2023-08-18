import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  Input,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { GridReadyEvent, GridApi } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import {
  CurrencyFormatterService
} from '@poss-web/shared/components/ui-formatters';

import { F2MarginList } from '@poss-web/shared/models';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-f2-margin-list-items',
  templateUrl: './f2-margin-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F2MarginListItemsComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() f2MarginList: F2MarginList[];
  @Input() count: number;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;

  @Output() paginator = new EventEmitter<PageEvent>();

  api: GridApi;
  rowData = [];
  columnDefs = [];

  context = this;
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  rowSelection = 'multiple';
  defaultColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    suppressMovable: true
  };
  destroy$: Subject<null> = new Subject<null>();

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  f1From;
  stoneBandTo;
  stoneBandFrom;
  cfa;
  margin;
  f1To;
  activeText;
  inActiveText;

  constructor(
    private translate: TranslateService,
    private currencyFormatterService: CurrencyFormatterService,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode
  ) {}
  ngOnInit() {
    this.translate
      .get([
        'pw.f2Margin.cfa',
        'pw.f2Margin.stoneBandFrom',
        'pw.f2Margin.stoneBandTo',
        'pw.f2Margin.f1From',
        'pw.f2Margin.f1To',
        'pw.f2Margin.margin'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.f1From = translatedMessages['pw.f2Margin.f1From'];
        this.stoneBandTo = translatedMessages['pw.f2Margin.stoneBandTo'];
        this.stoneBandFrom = translatedMessages['pw.f2Margin.stoneBandFrom'];
        this.cfa = translatedMessages['pw.f2Margin.cfa'];
        this.margin = translatedMessages['pw.f2Margin.margin'];
        this.f1To = translatedMessages['pw.f2Margin.f1To'];

        this.columnDefs = [
          {
            minWidth: 5,
            width: 5,
            pinned: 'left',
            lockPinned: true,
            cellStyle: params => {
              if (params.data.newlyAdded) {
                return { backgroundColor: '#1eb496', padding: '0px' };
              }
            }
          },
          {
            headerName: this.cfa,
            field: 'cfa',
            width: 890.5,
            resizable: true,
            editable: false
          },
          {
            headerName: this.stoneBandFrom,
            field: 'stoneBandFrom',
            resizable: true,
            suppressSizeToFit: true,
            editable: false
          },
          {
            headerName: this.stoneBandTo,
            field: 'stoneBandTo',
            resizable: true,
            suppressSizeToFit: true,
            editable: false
          },
          {
            headerName: this.f1From,
            field: 'f1From',
            resizable: true,
            suppressSizeToFit: true,
            editable: false,
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                this.defaultCurrencyCode,
                false
              );
            }
          },
          {
            headerName: this.f1To,
            field: 'f1To',
            resizable: true,
            suppressSizeToFit: true,
            editable: false,
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                this.defaultCurrencyCode,
                false
              );
            }
          },
          {
            headerName: this.margin,
            field: 'margin',
            resizable: true,
            suppressSizeToFit: true,
            editable: false
          }
        ];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['f2MarginList']) {
      this.rowData = this.f2MarginList?.length ? this.f2MarginList : [];
    }
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if (this.currentRowField === 'f1From' || this.currentRowField === 'f1To')
      this.currentRowInfo = this.currencyFormatterService.format(this.currentRowInfo, this.defaultCurrencyCode, false)
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
