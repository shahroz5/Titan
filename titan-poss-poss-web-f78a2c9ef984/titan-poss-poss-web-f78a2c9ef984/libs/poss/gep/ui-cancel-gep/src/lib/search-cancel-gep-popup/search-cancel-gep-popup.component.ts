import {
  Component,
  OnInit,
  Inject,
  OnDestroy
} from '@angular/core';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
interface ColumnDef {
  headerCheckboxSelection?: boolean;
  checkboxSelection?: boolean;
  field?: string;
  headerName?: string;
  cellRendererFramework?: any;
  cellEditorFramework?: any;
  resizable?: boolean;
  pinned?: string;
  suppressMovable: boolean;
  minWidth?: number;
  maxWidth?: number;
  singleClickEdit?: boolean;
  suppressSizeToFit?: boolean;
  type?: any;
  cellClass?: any;
  valueGetter?: Function;
  valueFormatter?: Function;
  celId?: string;
  editable?: any;
  width?: number;
  lockPinned?: boolean;
  valueSetter?: Function;
  cellEditorSelector?: any;
  cellRenderer?: any;
  filter?: any;
  filterParams?: any;
  enableCellChangeFlash?: boolean;
  sortable?: boolean;
  isWeight?: boolean;
}

@Component({
  selector: 'poss-web-search-cancel-gep-popup',
  templateUrl: './search-cancel-gep-popup.component.html',
  styleUrls: []
})
export class SearchCancelGepPopupComponent implements OnInit, OnDestroy {
  productGrid;
  count;

  pageSizeOptions: number[];
  minPageSize = 0;
  pageSize = 10;
  currentDate = moment();
  colDef: ColumnDef[] = [];
  // context = this;
  defaultColDef = {
    resizable: true
  };
  domLayout = 'autoHeight';
  api: GridApi;
  columnApi: ColumnApi;

  destroy$: Subject<null> = new Subject<null>();
  gepForm: FormGroup;

  disable = true;
  display = false;
  load = new Subject<any>();
  dateFormat: string;
  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private dateFormatterService: DateFormatterService,

    public dialogRef: MatDialogRef<SearchCancelGepPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.pageSize = 10;
    this.minPageSize = 10;
    this.pageSizeOptions = [10, 20, 50];
    this.dateFormat = data.dateFormat;
  }

  ngOnInit(): void {
    console.log(this.productGrid, this.load, 'product');
    if (this.data.gep) {
      this.data.gep.pipe(takeUntil(this.destroy$)).subscribe(options => {
        console.log(options);
        this.productGrid = options;
      });
    }
    if (this.data.count) {
      this.data.count.pipe(takeUntil(this.destroy$)).subscribe(options => {
        console.log(options);
        this.count = options;
      });
    }

    this.colDef = [
      {
        field: 'refDocNo',
        headerName: 'GEP No',
        cellRenderer: headerName =>
          `<a class="pw-anchor-underline"> ${headerName.value}</a>`,
        suppressMovable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },
        enableCellChangeFlash: true,
        minWidth: 150
      },

      {
        field: 'refDocDate',
        headerName: 'Date',
        sortable: true,
        enableCellChangeFlash: true,
        minWidth: 140,
        suppressMovable: true,
        
        valueFormatter: params => {
          return this.dateFormatterService.format(params.value);
        },
      },
      {
        field: 'customerName',
        headerName: 'Customer Name',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },
        enableCellChangeFlash: true,
        minWidth: 140,

        suppressMovable: true
      },
      {
        field: 'totalValue',
        headerName: 'GEP Amount',
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },
        enableCellChangeFlash: true,
        minWidth: 140,

        suppressMovable: true
      }
    ];
  }

  gridReady(params: GridReadyEvent) {
    console.log('grid');
    this.api = params.api;
    this.api.setRowData(this.productGrid);
    params.api.sizeColumnsToFit();
    console.log(params);

    // params.api.setVirtualRowCount(200);
    // const dataSource = {
    //   rowCount: null,
    //   getRows: function (params) {
    //     console.log('asking for ' + params.startRow + ' to ' + params.endRow);

    //     params.successCallback(null, 20);
    //   }
    // };

    // params.api.setDatasource(dataSource);
  }
  // console.log(this.addGrid)
  // if(this.addGrid)
  // this.onAddRow();

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }

    // this.api.sizeColumnsToFit();
  }

  onCellClicked(clickEvent) {
    console.log(clickEvent.colDef.field);
    if (clickEvent.colDef.field === 'refDocNo') {
      console.log(clickEvent.data);

      this.dialogRef.close(clickEvent.data);

      //   } else if (clickEvent.colDef.cellRendererFramework === DeleteRowComponent) {
      //     this.openConfirmDialogForDelete(clickEvent.data);
      //   } else if (clickEvent.colDef.field === 'melted') {
      //     console.log(clickEvent.data.melted);

      //     this.openPreDetails(clickEvent.data);
    }
  }

  change(event: any) {
    console.log(event);
    this.api.paginationSetPageSize(event.pageSize);
    this.api.paginationGoToPage(event.pageIndex);
    console.log(event.pageSize, event.pageIndex);

    this.load.next({
      size: event.pageSize,
      page: event.pageIndex
    });
  }

  close() {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next();
    this.destroy$.complete();
  }
}
