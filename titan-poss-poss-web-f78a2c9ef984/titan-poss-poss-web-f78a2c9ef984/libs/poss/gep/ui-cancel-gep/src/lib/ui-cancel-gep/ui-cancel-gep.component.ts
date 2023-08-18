import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { OverlayNotificationServiceAbstraction } from '@poss-web/shared/models';
import { FormGroup, FormControl } from '@angular/forms';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
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

const filterParams = {
  comparator: function (filterLocalDateAtMidnight, cellValue) {
    let dateAsString = cellValue;
    if (dateAsString == null) return -1;
    dateAsString = dateAsString.replace(/[a-zA-Z]/g, '');
    console.log(dateAsString);
    const dateParts = dateAsString.split(/[' ,]+/);
    console.log(dateParts);
    const cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[0]) - 1,
      Number(dateParts[1])
    );
    console.log(cellDate);
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
  },
  browserDatePicker: true,
  applyButton: true,
  resetButton: true,
  suppressAndOrCondition: true
};

@Component({
  selector: 'poss-web-ui-cancel-gep',
  templateUrl: './ui-cancel-gep.component.html',
  styleUrls: []
})
export class UiCancelGepComponent implements OnInit {
  @Input() productGrid;
  @Input() dateFormat;
  @Input() count;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageSize = 10;
  @Input() currentFiscalYear;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() componentEmit = new EventEmitter<any>();

  utcOffset = moment().startOf('day').utcOffset();

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
  @Output() txnId = new EventEmitter<any>();
  @Output() cancelListEmit = new EventEmitter<any>();

  display = false;
  year: any;

  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private currencyFormatterService: CurrencyFormatterService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    // this.gepForm.get('fiscalYear').updateValueAndValidity();
    // this.gepForm.get('fiscalYear').valueChanges.subscribe(fyear => {
    //   if (
    //     !(fyear === '' || fyear == null) &&
    //     this.gepForm.get('fiscalYear').errors === null
    //   ) {
    //     const fromDate = moment(this.gepForm.get('fiscalYear').value).startOf(
    //       'day'
    //     );
    //     this.year = this.gepForm.get('fiscalYear').value;
    //     ++this.year;

    //     this.gepForm.patchValue({
    //       docDate: fromDate
    //     });
    //   } else {
    //     this.gepForm.patchValue({
    //       docDate: this.currentDate
    //     });
    //   }
    // });

    console.log(this.productGrid, 'product');
    this.componentInit();
  }

  componentInit() {
    this.componentEmit.emit('listing');
  }

  createForm() {
    this.gepForm = new FormGroup({
      gepNo: new FormControl(null, [
        this.fieldValidatorsService.numbersField('GEP Number')
      ]),
      mobileNo: new FormControl(null, [
        this.fieldValidatorsService.mobileField('Mobile Number')
      ]),
      fiscalYear: new FormControl(null),
      docDate: new FormControl(null)
    });
  }

  onSubmit(event) {
    console.log(event);

    this.formSubmit.emit({
      customerMobileNo: event.target[1].value,
      docDate: event.target[3].value
        ? moment(event.target[3].value)
            .startOf('days')
            .add(this.utcOffset, 'm')
            .valueOf()
        : null,
      refDocNo: event.target[0].value,
      fiscalYear: event.target[2].value
    });
    this.display = true;
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

  onCellValueChanged(changeEvent) {
    switch (
      changeEvent.colDef.field
      //   case 'totalValue': {
      //     if (changeEvent.newValue) {
      //       this.gridItem.emit(true);
      //       this.calculateTotalValue();
      //     }
      //   }
      // }
    ) {
    }
  }

  onCellClicked(clickEvent) {
    console.log(clickEvent.colDef.field);
    if (clickEvent.colDef.field === 'refDocNo') {
      console.log(clickEvent.data);
      this.txnId.emit(clickEvent.data.refTxnId);
      //   } else if (clickEvent.colDef.cellRendererFramework === DeleteRowComponent) {
      //     this.openConfirmDialogForDelete(clickEvent.data);
      //   } else if (clickEvent.colDef.field === 'melted') {
      //     console.log(clickEvent.data.melted);

      //     this.openPreDetails(clickEvent.data);
    }
  }
}
