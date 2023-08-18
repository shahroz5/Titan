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
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-clubbing-discount-grid',
  templateUrl: './clubbing-discount-grid.component.html'
})
export class ClubbingDiscountGridComponent implements OnInit, OnChanges {
  @Input() clubbedDiscountsList;
  @Input() count = 0;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Output() delete = new EventEmitter<any>();
  @Output() paginator = new EventEmitter<PageEvent>();
  destroy$: Subject<null> = new Subject<null>();
  api: GridApi;
  columnApi: ColumnApi;
  columnDefs = [];
  defaultColDef = {
    enableCellTextSelection: true
  };
  animateRows = true;
  domLayout = 'autoHeight';
  rowHeight = 35;
  rowData;
  context = this;
  component: ClubbingDiscountGridComponent = this;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadColumnDefs();
  }
  loadColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Type 1',
        field: 'type1DiscountCode',
        tooltipField: 'type1DiscountCode'
      },
      {
        headerName: 'Type 2',
        field: 'type2DiscountCode',
        tooltipField: 'type2DiscountCode'
      },
      {
        headerName: 'Type 3',
        field: 'type3DiscountCode',
        tooltipField: 'type3DiscountCode'
      },
      {
        celId: 'delete',
        suppressMovable: true,
        cellRendererFramework: DeleteRowComponent,
        width: 21,
        minWidth: 21,
        maxWidth: 21,
        cellClass: 'pw-delete-icon-width'
      }
    ];
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['clubbedDiscountsList']) {

      console.log(this.clubbedDiscountsList, 'clubbedDiscountsList');

      this.rowData = this.clubbedDiscountsList;
    }
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }
  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }
  openConfirmDialogForDelete(row) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.clubbingDiscounts.deleteRuleMsg'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.delete.emit(row);
        }
      });
  }
  getContext() {
    return {
      componentParent: this.component
    };
  }

  onCellKeyPress(event) {
    const keyPressed = event.event.key;
    if (keyPressed === 'Enter' && event.colDef.celId === 'delete') {
      this.openConfirmDialogForDelete(event.data);
    }
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


}
