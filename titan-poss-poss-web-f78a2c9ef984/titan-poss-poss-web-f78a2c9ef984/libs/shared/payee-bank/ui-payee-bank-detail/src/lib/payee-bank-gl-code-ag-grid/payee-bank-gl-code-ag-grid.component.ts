import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  EventEmitter,
  OnChanges,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';

import {
  PayeeBankGLCodeDetailsRow,
  PayeeLocations,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  PaymentModeEnum,
  PayeeBankDetails,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { PayeeBankGlCodePopupComponent } from '@poss-web/shared/payee-bank/ui-payee-bank-gl-code-pop-up';

import {
  InputValidatorComponent,
  DeleteRowComponent,
  CheckboxCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-payee-bank-gl-code-ag-grid',
  templateUrl: './payee-bank-gl-code-ag-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayeeBankGlCodeAgGridComponent implements OnInit, OnChanges {
  @Input() glCodeData: PayeeBankGLCodeDetailsRow[];
  @Input() unmappedGlCodeData: PayeeLocations[];
  @Input() paymentCode;
  @Input() count;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Input() bankDetails$: Observable<PayeeBankDetails>;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Input() searchValue;
  @Output() editMappedGlcodeDetails = new EventEmitter<any>();
  @Output() updateGlcodeDetails = new EventEmitter<any>();
  @Output() addGlcodeDetails = new EventEmitter<any>();
  destroy$: Subject<null> = new Subject<null>();
  @Output() delete = new EventEmitter<any>();
  bankDetails: PayeeBankDetails;

  //ag-gridspecific
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

  //save
  popupResponse;
  newItems = {};
  mappedLocData = [];
  updatedData = [];
  addLocations = [];
  addPaymentCodes = [];
  removeLocations = [];
  removePaymentCodes = [];

  unmappedLocData: any[];
  finalrowdata: any[];
  prevData: any[];
  rowData: any[];
  updateData: any[];
  ids: any[];
  disableEdit: boolean;
  component: PayeeBankGlCodeAgGridComponent = this;
  result: any;
  chequeGLHeader: any;
  ddGLHeader: any;
  gLHeader: any;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.payeeBank.locationCodeHeaderName',
        'pw.payeeBank.locationCodeFieldName',
        'pw.payeeBank.locationName',
        'pw.payeeBank.descriptionFieldName',
        'pw.payeeBank.isDefaultHeaderName',
        'pw.payeeBank.isDefaultFieldName',
        'pw.payeeBank.glCodeHeaderName',
        'pw.payeeBank.glCodeFieldName',
        'pw.payeeBank.chequeGlCodeHeaderName',
        'pw.payeeBank.ddGlCodeHeaderName',
        'pw.payeeBank.ddGlCodeFieldName'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.gLHeader = translatedMessages['pw.payeeBank.glCodeHeaderName'];
        this.chequeGLHeader =
          translatedMessages['pw.payeeBank.chequeGlCodeHeaderName'];
        this.ddGLHeader = translatedMessages['pw.payeeBank.ddGlCodeHeaderName'];

        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            minWidth: 35,
            width: 40,
            pinned: 'left',
            lockPinned: true
          },
          {
            headerName:
              translatedMessages['pw.payeeBank.locationCodeHeaderName'],
            field: translatedMessages['pw.payeeBank.locationCodeFieldName'],
            width: 80,
            minWidth: 80
          },
          {
            headerName: translatedMessages['pw.payeeBank.locationName'],
            field: translatedMessages['pw.payeeBank.descriptionFieldName']
          },
          {
            headerName: translatedMessages['pw.payeeBank.glCodeHeaderName'],
            field: translatedMessages['pw.payeeBank.glCodeFieldName'],
            editable: false
          },
          {
            headerName:
              translatedMessages['pw.payeeBank.chequeGlCodeHeaderName'],
            field: translatedMessages['pw.payeeBank.glCodeFieldName'],
            editable: false
          },
          {
            headerName: translatedMessages['pw.payeeBank.ddGlCodeHeaderName'],
            field: translatedMessages['pw.payeeBank.ddGlCodeFieldName'],
            editable: false
          },
          {
            headerName: translatedMessages['pw.payeeBank.isDefaultHeaderName'],
            field: translatedMessages['pw.payeeBank.isDefaultFieldName'],
            suppressSizeToFit: true,
            editable: false,
            cellRendererFramework: CheckboxCellComponent
          },

          {
            celId: 'delete',
            suppressMovable: true,
            cellRendererFramework: DeleteRowComponent,
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width'
          }
        ];
      });
  }

  ngOnInit() {
    this.bankDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bankDetails: PayeeBankDetails) => {
        if (bankDetails) {
          this.bankDetails = bankDetails;
        }
      });
  }

  openConfirmDialogForDelete(row) {
    if (!this.bankDetails.isActive && this.bankDetails.bankCode !== '') {
      this.showMessage('pw.global.masterDeactiveMsg');
    } else {
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
  }
  onCellKeyPress(event) {
    const keyPressed = event.event.key;
    if (keyPressed === 'Enter' && event.colDef.celId === 'delete') {
      this.openConfirmDialogForDelete(event.data);
    }
  }
  onCellClicked(event) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['paymentCode'] && this.columnApi) {
      this.paymentCode = this.paymentCode;

      const glCodeColumn = this.columnApi
        .getAllColumns()
        .find(x => x.getColDef().headerName === this.gLHeader);
      const chequeColumn = this.columnApi
        .getAllColumns()
        .find(x => x.getColDef().headerName === this.chequeGLHeader);
      const ddColumn = this.columnApi
        .getAllColumns()
        .find(x => x.getColDef().headerName === this.ddGLHeader);
      if (this.paymentCode === PaymentModeEnum.CHEQUE) {
        this.columnApi.setColumnsVisible([glCodeColumn], false);
        this.columnApi.setColumnsVisible([chequeColumn, ddColumn], true);
      } else if (this.paymentCode !== PaymentModeEnum.CHEQUE) {
        this.columnApi.setColumnsVisible([glCodeColumn], true);
        this.columnApi.setColumnsVisible([chequeColumn, ddColumn], false);
      }
    }

    if (changes['glCodeData']) {
      this.disableEdit = true;
      this.mappedLocData = [];
      const glCodeDetail = [];
      const ddGlCodeDetail = [];
      this.result = [];
      this.glCodeData.forEach(data => {
        if (
          data.paymentCode !== PaymentModeEnum.CHEQUE &&
          data.paymentCode !== PaymentModeEnum.DD
        ) {
          this.mappedLocData.push({
            id: data.id,
            rowKey: data.locationCode,
            description: data.description,
            glCode: data.glCode,
            isDefault: data.isDefault
          });
        } else {
          if (data.paymentCode === PaymentModeEnum.CHEQUE) {
            glCodeDetail.push({
              id: data.id,
              rowKey: data.locationCode,
              description: data.description,
              paymentCode: data.paymentCode,
              glCode: data.glCode,
              isDefault: data.isDefault
            });
          }
          if (data.paymentCode === PaymentModeEnum.DD) {
            ddGlCodeDetail.push({
              ddId: data.id,
              rowKey: data.locationCode,
              ddPaymentCode: data.paymentCode,
              ddGlCode: data.glCode
            });
          }
          const mergeById = (array1, array2) =>
            array1.map(itm => ({
              ...array2.find(item => item.rowKey === itm.rowKey && item),
              ...itm
            }));
          this.result = mergeById(glCodeDetail, ddGlCodeDetail);
        }
      });
    }

    this.rowData = this.result.length > 0 ? this.result : this.mappedLocData;
  }
  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }
  onSelectionChanged(event) {
    if (this.api.getSelectedNodes().length) {
      this.disableEdit = false;
    } else {
      this.disableEdit = true;
    }
  }
  selectionChange(isChecked, rowKey, columnHeaderKey) {
    // console.log(rowKey, 'rowKey');
    // console.log(columnHeaderKey, 'aaaa');
  }
  /**
   * Unique identifier for each row
   * @param data : data of each row
   */
  getRowNodeId(data: any) {
    return data.rowKey;
  }
  getComponents() {
    return {
      inputValidator: InputValidatorComponent
    };
  }
  getContext() {
    return {
      validators: {
        cashGlCode: [this.fieldValidatorsService.requiredField('GL Code')]
      },
      componentParent: this.component,
      disableCheckBox: true
    };
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    const glCodeColumn = this.columnApi
      .getAllColumns()
      .find(x => x.getColDef().headerName === this.gLHeader);
    const chequeColumn = this.columnApi
      .getAllColumns()
      .find(x => x.getColDef().headerName === this.chequeGLHeader);
    const ddColumn = this.columnApi
      .getAllColumns()
      .find(x => x.getColDef().headerName === this.ddGLHeader);
    if (this.paymentCode === PaymentModeEnum.CHEQUE) {
      this.columnApi.setColumnsVisible([glCodeColumn], false);
      this.columnApi.setColumnsVisible([chequeColumn, ddColumn], true);
    } else if (this.paymentCode !== PaymentModeEnum.CHEQUE) {
      this.columnApi.setColumnsVisible([glCodeColumn], true);
      this.columnApi.setColumnsVisible([chequeColumn, ddColumn], false);
    }
  }

  updateMappedGridData(popupData) {
    const updateData = [];
    this.api.getSelectedRows().forEach(row => {
      const rownode = this.api.getRowNode(row.rowKey);
      popupData.forEach(val => {
        if (val) {
          rownode.setDataValue('glCode', val.glCode.value);
          rownode.setDataValue('isDefault', val.isDefault.value);
        }
      });
    });
  }
  applyGlCode() {
    if (!this.bankDetails.isActive && this.bankDetails.bankCode !== '') {
      this.showMessage('pw.global.masterDeactiveMsg');
    } else {
      const selectedNode = this.api.getSelectedNodes();
      const selectedData = selectedNode.map(node => node.data);

      const data = {
        glCode: selectedData[0].glCode,
        isDefault: selectedData[0].isDefault
      };

      this.dialog
        .open(PayeeBankGlCodePopupComponent, {
          autoFocus: false,
          disableClose: true,
          width: '437px',
          data: selectedNode.length === 1 ? data : null
        })
        .afterClosed()
        .subscribe(res => {
          if (res) {
            this.updateData = [];
            this.addLocations = [];
            this.ids = [];
            this.addPaymentCodes = [];
            this.api.getSelectedRows().forEach(row => {
              this.ids.push(row.id);
              this.addLocations.push(row.rowKey);
              if (this.paymentCode === PaymentModeEnum.CHEQUE) {
                this.updateData.push({
                  id: row.id,
                  glCode: res.glCode ? res.glCode : row.glCode,

                  isDefault:
                    selectedNode.length === 1
                      ? res.isDefault
                      : res.isDefault
                      ? res.isDefault
                      : row.formGroup.controls['isDefault'].value
                });
                this.updateData.push({
                  id: row.ddId,
                  glCode: res.glCode ? res.glCode : row.glCode,

                  isDefault:
                    selectedNode.length === 1
                      ? res.isDefault
                      : res.isDefault
                      ? res.isDefault
                      : row.formGroup.controls['isDefault'].value
                });
              } else {
                this.updateData.push({
                  id: row.id,
                  glCode: res.glCode ? res.glCode : row.glCode,

                  isDefault:
                    selectedNode.length === 1
                      ? res.isDefault
                      : res.isDefault
                      ? res.isDefault
                      : row.formGroup.controls['isDefault'].value
                });
              }
            });
            this.addPaymentCodes.push({
              glCode: res.glCode,
              isDefault: res.isDefault ? res.isDefault : false,
              paymentCode: this.paymentCode.toUpperCase()
            });

            this.editMappedGlcodeDetails.emit({
              addLocations: this.addLocations,
              addPaymentCodes: this.addPaymentCodes,
              removeLocations: [],
              removePaymentCodes: [this.paymentCode.toUpperCase()],
              updateConfigs: this.updateData
            });
          }
        });
    }
  }
  showMessage(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
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
