import {
  Component,
  OnInit,
  Output,
  SimpleChanges,
  Input,
  OnChanges,
  OnDestroy,
  EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { GridReadyEvent, GridApi } from 'ag-grid-community';
import { PageEvent } from '@angular/material/paginator';

import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-razor-vendor-list-items',
  templateUrl: './razor-vendor-list-items.component.html'
})
export class RazorVendorListItemsComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() configList;
  @Input() count = 0;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<any>();
  api: GridApi;
  rowData = [];
  columnDefs = [];

  context = this;

  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  rowSelection = 'multiple';
  defaultColDef = {

    resizable: true,

    suppressMovable: true
  };
  destroy$: Subject<null> = new Subject<null>();

  locationHeader: string;
  accountIdHeader: string;
  component: RazorVendorListItemsComponent = this;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(private translate: TranslateService) {
    this.translate
      .get([
        'pw.razorpayVendorConfiguration.locationCode',
        'pw.razorpayVendorConfiguration.accountId'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.locationHeader =
          translatedMessages['pw.razorpayVendorConfiguration.locationCode'];
        this.accountIdHeader =
          translatedMessages['pw.razorpayVendorConfiguration.accountId'];
      });
  }

  ngOnInit() {
    this.loadColumns();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['configList']) {

      this.rowData = [];

      this.configList.forEach(data => {
        this.rowData.push({
          locationCode: data.locationCode,
          accountId: data.accountId
        });
      });
    }
  }

  loadColumns() {
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
        field: 'locationCode',
        headerName: this.locationHeader,
        sortable: true,
        width: 208
      },
      {
        field: 'accountId',
        headerName: this.accountIdHeader,
        width: 208
      }
    ];
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }


  }

  printSortStateToConsole(event) {
    const sortState = this.api.getSortModel();
    if (sortState.length === 0) {
      this.sort.emit();
    } else {
      for (let i = 0; i < sortState.length; i++) {
        const item = sortState[i];
        item.sort = item.sort[0].toUpperCase() + item.sort.slice(1);
        this.sort.emit(item);
      }
    }
  }
  getContext() {
    return {
      componentParent: this.component,
      disableInput: true
    };
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
