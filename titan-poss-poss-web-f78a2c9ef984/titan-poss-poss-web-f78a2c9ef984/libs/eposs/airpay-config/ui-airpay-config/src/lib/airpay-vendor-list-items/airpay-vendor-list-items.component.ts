import {
  Component,
  OnInit,
  Output,
  SimpleChanges,
  Input,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { GridReadyEvent, GridApi } from 'ag-grid-community';
import { PageEvent } from '@angular/material/paginator';

import { InputCellComponent } from '@poss-web/shared/components/ui-ag-grid';
import { FormGroup, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-airpay-vendor-list-items',
  templateUrl: './airpay-vendor-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirpayVendorListItemsComponent
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

  locationField: string;
  locationHeader: string;
  merchantIdField: string;
  merchantIdHeader: string;
  userNameField: string;
  userNameHeader: string;
  passwordField: string;
  passwordHeader: string;
  secretKeyField: string;
  secretKeyHeader: string;
  secretTokenField: string;
  secretTokenHeader: string;
  component: AirpayVendorListItemsComponent = this;
  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(private translate: TranslateService) {
    this.translate
      .get([
        'pw.airpayConfiguration.locationFieldText',
        'pw.airpayConfiguration.locationHeaderText',
        'pw.airpayConfiguration.merchantIdFieldText',
        'pw.airpayConfiguration.merchantIdHeaderText',
        'pw.airpayConfiguration.userNameFieldText',
        'pw.airpayConfiguration.userNameHeaderText',
        'pw.airpayConfiguration.passwordFieldText',
        'pw.airpayConfiguration.passwordHeaderText',
        'pw.airpayConfiguration.secretKeyFieldText',
        'pw.airpayConfiguration.secretKeyHeaderText',
        'pw.airpayConfiguration.secretTokenFieldText',
        'pw.airpayConfiguration.secretTokenHeaderText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.locationField =
          translatedMessages['pw.airpayConfiguration.locationFieldText'];
        this.locationHeader =
          translatedMessages['pw.airpayConfiguration.locationHeaderText'];
        this.merchantIdField =
          translatedMessages['pw.airpayConfiguration.merchantIdFieldText'];
        this.merchantIdHeader =
          translatedMessages['pw.airpayConfiguration.merchantIdHeaderText'];
        this.userNameField =
          translatedMessages['pw.airpayConfiguration.userNameFieldText'];
        this.userNameHeader =
          translatedMessages['pw.airpayConfiguration.userNameHeaderText'];
        this.passwordField =
          translatedMessages['pw.airpayConfiguration.passwordFieldText'];
        this.passwordHeader =
          translatedMessages['pw.airpayConfiguration.passwordHeaderText'];
        this.secretKeyField =
          translatedMessages['pw.airpayConfiguration.secretKeyFieldText'];
        this.secretKeyHeader =
          translatedMessages['pw.airpayConfiguration.secretKeyHeaderText'];
        this.secretTokenField =
          translatedMessages['pw.airpayConfiguration.secretTokenFieldText'];
        this.secretTokenHeader =
          translatedMessages['pw.airpayConfiguration.secretTokenHeaderText'];
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
          MerchantId: data.MerchantId,
          Username: data.Username,
          formGroup: new FormGroup({
            Password: new FormControl(data.Password),
            SecretKey: new FormControl(data.SecretKey),
            SecretToken: new FormControl(data.SecretToken)
          })
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
        field: this.locationField,
        headerName: this.locationHeader,
        sortable: true,
        width: 208
      },
      {
        field: this.merchantIdField,
        headerName: this.merchantIdHeader,
        width: 208
      },
      {
        field: this.userNameField,
        headerName: this.userNameHeader,
        width: 208
      },
      {
        field: this.passwordField,
        headerName: this.passwordHeader,
        cellRendererFramework: InputCellComponent,
        width: 220
      },
      {
        field: this.secretKeyField,
        headerName: this.secretKeyHeader,
        cellRendererFramework: InputCellComponent,
        width: 220
      },
      {
        field: this.secretTokenField,
        headerName: this.secretTokenHeader,
        cellRendererFramework: InputCellComponent,
        width: 220
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
    this.currentRowInfo = this.rowData[this.currentRowIndex][this.currentRowField];
    if (this.currentRowField === this.passwordField || this.currentRowField === this.secretKeyField || this.currentRowField === this.secretTokenField)
      this.currentRowInfo = this.rowData[this.currentRowIndex]
      .formGroup.controls[this.currentRowField].value.replace(/./g, '*');
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
