import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { Observable, Subject } from 'rxjs';
import * as moment from 'moment';

import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import { FormGroup, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
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

@Component({
  selector: 'poss-web-ui-bill-cancellation-requests',
  templateUrl: './ui-bill-cancellation-requests.component.html',
  styleUrls: ['./ui-bill-cancellation-requests.component.scss']
})
export class UiBillCancellationRequestsComponent implements OnInit, OnChanges {
  @Input() productGrid;
  @Input() count;
  @Input() minPageSize;
  @Input() pageSizeOptions;
  @Input() locations;
  @Output() formSubmit = new EventEmitter<any>();
  pageIndex = 0;
  pageSize = 10;
  status = '';
  currentDate = moment();
  colDef: ColumnDef[] = [];
  // context = this;
  defaultColDef = {
    resizable: true
  };
  domLayout = 'autoHeight';
  api: GridApi;
  columnApi: ColumnApi;
  filteredOptions: Observable<string[]>;
  destroy$: Subject<null> = new Subject<null>();
  billCancellationForm: FormGroup;
  @Output() txnId = new EventEmitter<any>();
  @Output() cancelListEmit = new EventEmitter<any>();

  totalElements: number;
  options: string[] = [];

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private currencyFormatterService: CurrencyFormatterService
  ) {
    this.createForm();
    // for (let i = 0; i < this.locations.length; i++) {

    //   this.options.push(this.locations[i]);
    // }
  }

  ngOnInit(): void {
    console.log(this.productGrid, 'product');
    this.componentInit();
    this.colDef = [
      {
        field: 'docNo',
        headerName: 'Req. No.',
        cellRenderer: headerName =>
          `<a class="pw-anchor-underline"> ${headerName.value}</a>`,
        suppressMovable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },
        minWidth: 100,
        enableCellChangeFlash: true
      },
      {
        field: 'invoiceNo',
        headerName: 'CM No.',

        suppressMovable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },
        minWidth: 100,
        enableCellChangeFlash: true
      },
      {
        field: 'totalAmount',
        headerName: 'CM Amount',
        suppressMovable: true,
        valueFormatter: params => {
          if (params.value) {
            return this.currencyFormatterService.format(
              params.value,
              'INR',
              false
            );
          } else {
            return null;
          }
        },

        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },
        minWidth: 140,
        enableCellChangeFlash: true
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
        field: 'requestorRemarks',
        headerName: 'Reason',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },
        enableCellChangeFlash: true,
        minWidth: 140,
        maxWidth: 250,
        suppressMovable: true
      },
      {
        field: 'locationCode',
        headerName: 'Location',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          applyButton: true,
          resetButton: true
        },
        enableCellChangeFlash: true,
        minWidth: 140,
        maxWidth: 140,
        suppressMovable: true
      }
    ];
  }
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['productGrid'] &&
      changes['productGrid'].currentValue !== null
    ) {
      if (this.productGrid.length !== 0) {
        this.totalElements = this.productGrid.length;
      }
    }
    if (changes['locations']) {
      this.options = [];
      this.locations.forEach(element => {
        this.options.push(element.locationCode);
      });
    }
  }
  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }
  componentInit() {
    this.filteredOptions = this.billCancellationForm.controls[
      'location'
    ].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  createForm() {
    this.billCancellationForm = new FormGroup({
      docNo: new FormControl(null, [
        this.fieldValidatorsService.numbersField('Req. Number')
      ]),
      cmNo: new FormControl(null, [
        this.fieldValidatorsService.numbersField('Invoice Number')
      ]),
      mobileNo: new FormControl(null, [
        this.fieldValidatorsService.mobileField('Mobile Number')
      ]),
      location: new FormControl(
        null,
        this.fieldValidatorsService.alphabetsField('Location')
      )
    });
  }

  onSubmit(event) {
    this.status = 'NO RECORDS FOUND';
    let valid = {};
    let docNo = {};
    const controls = this.billCancellationForm.controls;
    for (const name in controls) {
      if (controls[name].valid && controls[name].value) {
        if (name === 'mobileNo') {
          valid = {
            ...valid,
            mobileNumber: this.billCancellationForm.get('mobileNo').value
          };
        } else if (name === 'location') {
          valid = {
            ...valid,
            locationCode: this.billCancellationForm
              .get('location')
              .value.toUpperCase()
          };
        } else if (name === 'cmNo')
          valid = {
            ...valid,
            invoiceNo: this.billCancellationForm.get('cmNo').value
          };
        else if (name === 'docNo')
          docNo = {
            ...docNo,
            docNo: Number(this.billCancellationForm.get('docNo').value)
          };
      }
    }

    console.log(valid, docNo);

    this.formSubmit.emit({
      no: docNo,
      filterParams: {
        valid
      }
    });
  }

  change(event: any) {
    let valid = {};
    let docNo = {};
    const controls = this.billCancellationForm.controls;
    for (const name in controls) {
      if (controls[name].valid && controls[name].value) {
        if (name === 'mobileNo') {
          valid = {
            ...valid,
            mobileNumber: this.billCancellationForm.get('mobileNo').value
          };
        } else if (name === 'location') {
          valid = {
            ...valid,
            locationCode: this.billCancellationForm
              .get('location')
              .value.toUpperCase()
          };
        } else if (name === 'cmNo')
          valid = {
            ...valid,
            invoiceNo: this.billCancellationForm.get('cmNo').value
          };
        else if (name === 'docNo')
          docNo = {
            ...docNo,
            docNo: Number(this.billCancellationForm.get('docNo').value)
          };
      }
    }

    console.log(valid, docNo);

    this.api.paginationSetPageSize(event.pageSize);
    this.api.paginationGoToPage(event.pageIndex);
    this.cancelListEmit.emit({
      no: docNo,
      filterParams: {
        valid
      },

      page: event.pageIndex,
      size: event.pageSize
    });
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

  onGridSizeChanged(params) {
    this.api.sizeColumnsToFit();
  }

  onCellClicked(clickEvent) {
    console.log(clickEvent.colDef.field);
    if (clickEvent.colDef.field === 'docNo') {
      console.log(clickEvent.data);
      this.txnId.emit(clickEvent.data);
    }
  }

  reset() {
    this.billCancellationForm.reset();
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if (this.currentRowField === 'totalAmount')
     this.currentRowInfo = this.currencyFormatterService.format(this.currentRowInfo, 'INR', false)
  }

  focusOut(event) {
    this.isFocusing = false;
  }
}
