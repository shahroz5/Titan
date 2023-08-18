import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { GlLocationPaymentPopupComponent } from '@poss-web/eposs/gl-location-payment/ui-gl-location-payment-popup';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-gl-location-payment-list-item',
  templateUrl: './gl-location-payment-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlLocationPaymentListItemComponent implements OnInit, OnChanges {
  @Input() glLocationList;
  @Input() count = 0;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Input() paymentCodes;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() updateData = new EventEmitter<any>();
  @Output() saveDetails = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  destroy$: Subject<null> = new Subject<null>();
  api: GridApi;
  columnApi: ColumnApi;
  columnDefs = [];
  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true
  };
  rowSelection = 'multiple';
  animateRows = true;
  domLayout = 'autoHeight';
  rowHeight = 35;
  rowData;

  selectedRowName: string;
  data: any[];
  addLocations: any;
  addPaymentCodes: any;
  removeLocations: any;
  removePaymentCodes: any[];
  disableEdit: boolean;
  component: any = this;
  descriptionFieldLabel = '';
  descriptionHeaderLabel = '';
  locationCodeFieldLabel = '';
  locationCodeHeaderLabel = '';
  paymentCodeFieldLabel = '';
  paymentCodeHeaderLabel = '';
  glCodeHeaderLabel = '';
  glCodeFieldLabel = '';
  deleteLabel = '';

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.glLocationPayment.locationCodeHeaderLabel',
        'pw.glLocationPayment.locationCodeFieldLabel',
        'pw.glLocationPayment.descriptionHeaderLabel',
        'pw.glLocationPayment.descriptionFieldLabel',
        'pw.glLocationPayment.paymentCodeHeaderLabel',
        'pw.glLocationPayment.paymentCodeFieldLabel',
        'pw.glLocationPayment.glCodeHeaderLabel',
        'pw.glLocationPayment.glCodeFieldLabel',
        'pw.glLocationPayment.deleteLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.descriptionFieldLabel =
          translatedMessages['pw.glLocationPayment.descriptionFieldLabel'];
        this.descriptionHeaderLabel =
          translatedMessages['pw.glLocationPayment.descriptionHeaderLabel'];
        this.locationCodeFieldLabel =
          translatedMessages['pw.glLocationPayment.locationCodeFieldLabel'];
        this.locationCodeHeaderLabel =
          translatedMessages['pw.glLocationPayment.locationCodeHeaderLabel'];
        this.paymentCodeFieldLabel =
          translatedMessages['pw.glLocationPayment.paymentCodeFieldLabel'];
        this.paymentCodeHeaderLabel =
          translatedMessages['pw.glLocationPayment.paymentCodeHeaderLabel'];
        this.glCodeHeaderLabel =
          translatedMessages['pw.glLocationPayment.glCodeHeaderLabel'];
        this.glCodeFieldLabel =
          translatedMessages['pw.glLocationPayment.glCodeFieldLabel'];
        this.deleteLabel =
          translatedMessages['pw.glLocationPayment.deleteLabel'];
      });
  }

  ngOnInit() {
    this.loadColumnDefs();
  }
  loadColumnDefs() {
    this.columnDefs = [
      {
        minWidth: 4,
        width: 4,
        pinned: 'left',
        lockPinned: true,
        cellStyle: params => {
          console.log(params.data, 'check');

          if (params.data.lastModified) {
            return { backgroundColor: '#1eb496', padding: '0px' };
          }
        }
      },
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        minWidth: 30,
        width: 30,
        lockPinned: true
      },
      {
        headerName: this.locationCodeHeaderLabel,
        field: this.locationCodeFieldLabel
      },
      {
        headerName: 'Location Name',
        field: 'description'
      },
      {
        headerName: this.paymentCodeHeaderLabel,
        field: this.paymentCodeFieldLabel
      },
      {
        headerName: this.glCodeHeaderLabel,
        field: this.glCodeFieldLabel
      },
      {
        celId: this.deleteLabel,
        suppressMovable: true,
        cellRendererFramework: DeleteRowComponent,
        width: 21,
        minWidth: 21,
        maxWidth: 21,
        cellClass: 'pw-delete-icon-width',
        headerClass: 'pw-delete-icon-width'
      }
    ];
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['glLocationList']) {
      this.disableEdit = true;
      console.log(this.glLocationList, 'this.glLocationList');

      this.rowData = this.glLocationList;
    }
  }
  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }


  }
  /**
   * Unique identifier for each row
   * @param data : data of each row
   */
  getRowNodeId(data: any) {
    return data.id;
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }
  getContext() {
    return {
      componentParent: this.component
    };
  }

  edit() {
    console.log('edit');
    console.log(this.paymentCodes, 'out codes');
    const selectedNode = this.api.getSelectedNodes();
    const selectedData = selectedNode.map(node => node.data);
    console.log(selectedData, 'data');

    const data = {
      paymentCode: selectedData[0].paymentCode,
      glCode: selectedData[0].glCode
    };
    this.dialog
      .open(GlLocationPaymentPopupComponent, {
        autoFocus: false,
        width: '450px',
        data: {
          popupData: selectedNode.length === 1 ? data : null,
          paymentCodes: this.paymentCodes
        }
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.addPaymentCodes = [];

          this.data = [];
          this.addLocations = [];
          this.removePaymentCodes = [];
          this.api.getSelectedRows().forEach(row => {
            this.addLocations.push(row.locationCode);
            if (res.paymentCode) {
              this.removePaymentCodes.push(row.paymentCode);
            } else this.paymentCodes = [];

            this.data.push({
              id: row.id,
              glCode: res.glCode ? res.glCode : row.glCode,
              paymentCode: res.paymentCode ? res.paymentCode : row.paymentCode
            });
          });
          this.addPaymentCodes.push({
            glCode: res.glCode,
            paymentCode: res.paymentCode
          });
        }
        this.updateData.emit(this.data);
      });
  }

  openConfirmDialogForDelete(row) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.payeeBank.deleteRowConfirmationMessage'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.delete.emit(row);
        }
      });


  }
  onCellKeyPress(event) {
    const keyPressed = event.event.key;
    if (keyPressed === 'Enter' && event.colDef.celId === 'delete') {
      this.openConfirmDialogForDelete(event.data);
    }
  }

  onSelectionChanged(event) {
    if (this.api.getSelectedNodes().length) {
      this.disableEdit = false;
    } else {
      this.disableEdit = true;
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
