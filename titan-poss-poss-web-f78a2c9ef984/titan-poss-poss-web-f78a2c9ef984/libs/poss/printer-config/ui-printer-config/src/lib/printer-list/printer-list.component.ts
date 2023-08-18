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
import {
  DeleteRowComponent,
  EditItemComponent,
  InputValidatorComponent,
  ItemDetailsComponent,
  LotNumberAndQuantityComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import {
  AccessList,
  PrinterConfigDetails
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePrinterPopupComponent } from '../update-printer-popup/update-printer-popup.component';
@Component({
  selector: 'poss-web-printer-list',
  templateUrl: './printer-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrinterListComponent implements OnChanges, OnDestroy {
  api: GridApi;
  @Input() PrinterList: PrinterConfigDetails[];
  @Input() printerNames: [];

  @Input() disable: boolean;
  @Input() count = 0;
  @Output() activate = new EventEmitter<AccessList>();
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<any>();
  @Output() deletePrinterEvent = new EventEmitter<PrinterConfigDetails>();
  gridData: string[] = [];
  rowData: PrinterConfigDetails[] = [];
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

  constructor(private translate: TranslateService, private dialog: MatDialog) {
    this.translate
      .get([
        'pw.printerConfiguration.hostFieldName',
        'pw.printerConfiguration.hostHeaderName',
        'pw.printerConfiguration.locationFieldName',
        'pw.printerConfiguration.locationHeaderName',
        'pw.printerConfiguration.docTypeFieldName',
        'pw.printerConfiguration.docTypeHeaderName',
        'pw.printerConfiguration.printerFieldName',
        'pw.printerConfiguration.printerheaderName',
        'pw.printerConfiguration.Active',
        'pw.printerConfiguration.InActive'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            field:
              translatedMessages['pw.printerConfiguration.locationFieldName'],
            headerName:
              translatedMessages['pw.printerConfiguration.locationHeaderName']
          },
          {
            field: translatedMessages['pw.printerConfiguration.hostFieldName'],
            headerName:
              translatedMessages['pw.printerConfiguration.hostHeaderName']
          },

          {
            field:
              translatedMessages['pw.printerConfiguration.docTypeFieldName'],
            headerName:
              translatedMessages['pw.printerConfiguration.docTypeHeaderName']
          },
          {
            field:
              translatedMessages['pw.printerConfiguration.printerFieldName'],
            headerName:
              translatedMessages['pw.printerConfiguration.printerheaderName']
          },

          {
            celId: 'edit',

            cellRenderer: () =>
              ` <span class="pw-i-16 pw-pencil-icon-16"></span`,
            width: 30
          }
        ];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['PrinterList']) {
      this.rowData = this.PrinterList;
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
      itemDetailsRenderer: ItemDetailsComponent,

      deleteRowRenderer: DeleteRowComponent,

      editItemRenderer: EditItemComponent,
      inputValidatorEditor: InputValidatorComponent,
      lotNumberAndQuantityRenderer: LotNumberAndQuantityComponent
    };
  }
  onCellClicked(event) {
    if (event.colDef.celId === 'edit') {
      this.deletePrinter(event.data);
    }
  }

  deletePrinter(printer: PrinterConfigDetails) {
    this.dialog
      .open(UpdatePrinterPopupComponent, {
        width: '500px',
        data: {
          printer: printer,
          printerNames: this.printerNames
        }
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.deletePrinterEvent.emit(result);
        }
      });
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
