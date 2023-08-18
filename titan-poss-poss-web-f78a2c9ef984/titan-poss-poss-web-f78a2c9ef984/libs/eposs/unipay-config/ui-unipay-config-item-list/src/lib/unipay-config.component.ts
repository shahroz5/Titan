import {
  Component,
  Output,
  EventEmitter,
  SimpleChanges,
  Input,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject } from 'rxjs';

import { GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { MatToggleRender } from '@poss-web/shared/components/ui-ag-grid';
import { PageEvent } from '@angular/material/paginator';
import { AccessList, GVConfiguration } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-unipay-configuration',
  templateUrl: './unipay-config.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnipayConfigurationComponent
  implements OnChanges, OnDestroy {
  api: GridApi;
  @Input() unipayConfiguration: GVConfiguration[];

  @Input() disable: boolean;
  @Input() count = 0;
  @Output() activate = new EventEmitter<AccessList>();
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<any>();
  gridData: string[] = [];
  rowData: GVConfiguration[] = [];
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  rowSelection = 'multiple';
  context = this;
  columnDefs = [];
  private gridOptions: GridOptions;
  destroy$: Subject<null> = new Subject<null>();
  defaultColDef = {
    flex: 1,
    sortable: true,
    suppressMovable: true,
    resizable: true
  };

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(private translate: TranslateService) {
    this.translate
      .get([
        'pw.unipayConfiguration.hostFieldName',
        'pw.unipayConfiguration.hostHeaderName',
        'pw.unipayConfiguration.locationFieldName',
        'pw.unipayConfiguration.locationHeaderName',
        'pw.unipayConfiguration.deviceFieldName',
        'pw.unipayConfiguration.deviceHeaderName',
        'pw.unipayConfiguration.StatusFieldName',
        'pw.unipayConfiguration.StatusheaderName',
        'pw.unipayConfiguration.Active',
        'pw.unipayConfiguration.InActive'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
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
            field: translatedMessages['pw.unipayConfiguration.hostFieldName'],
            headerName:
              translatedMessages['pw.unipayConfiguration.hostHeaderName']
          },
          {
            field:
              translatedMessages['pw.unipayConfiguration.locationFieldName'],
            headerName:
              translatedMessages['pw.unipayConfiguration.locationHeaderName']
          },
          {
            field: translatedMessages['pw.unipayConfiguration.deviceFieldName'],
            headerName:
              translatedMessages['pw.unipayConfiguration.deviceHeaderName']
          },
          {
            field: translatedMessages['pw.unipayConfiguration.StatusFieldName'],
            headerName:
              translatedMessages['pw.unipayConfiguration.StatusheaderName'],
            cellRenderer: params => {
              if (params.value) {
                return translatedMessages['pw.unipayConfiguration.Active'];
              } else {
                return translatedMessages['pw.unipayConfiguration.InActive'];
              }
            }
          }
        ];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['unipayConfiguration']) {
      this.rowData = this.unipayConfiguration;
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }

    // this.api.sizeColumnsToFit();
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

  getComponents() {
    return {
      checkBoxRowRenderer: MatToggleRender
    };
  }

  selectionChange(data: AccessList) {
    this.activate.emit(data);
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
