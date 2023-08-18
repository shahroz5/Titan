import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import {
  EditItemComponent,
  InputValidatorComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  PIFSeries,
  SavePIFSeriesPayload
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-pif-series-items',
  templateUrl: './pif-series-items.component.html'
})
export class PifSeriesItemsComponent implements OnChanges {
  @Input() pifSeries: PIFSeries[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() savePIFSeriesPayload = new EventEmitter<SavePIFSeriesPayload[]>();
  rowHeight = 35;
  isValid = false;
  destroy$ = new Subject();
  domLayout = 'autoHeight';
  api: GridApi;
  animateRows = true;
  savePayload: SavePIFSeriesPayload[];
  pifSeriesFormGroup: FormGroup;
  columnDefs = [];
  fromValidators: any = [];
  toValidators: any = [];
  defaultColDef = {
    suppressMovable: true
  };
  isFromGreateThanTo = false;
  isCardValidation = false;
  isChequeValidation = false;
  isValidation = true;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private dialog: MatDialog,
    private transalte: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.transalte
      .get([
        'pw.pifSeries.bankNameLabel',
        'pw.pifSeries.homeBankLabel',
        'pw.pifSeries.PaymentTypeLabel',
        'pw.pifSeries.fromLabel',
        'pw.pifSeries.toLabel',
        'pw.pifSeries.lastUsedNoLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerName: translatedMessages['pw.pifSeries.bankNameLabel'],
            field: 'bankName',
            resizable: true,
            width: 227,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.pifSeries.PaymentTypeLabel'],
            field: 'paymentCode',
            width: 227,
            resizable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.pifSeries.fromLabel'],
            field: 'fromNo',
            editable: true,
            width: 228,
            resizable: true,
            suppressSizeToFit: true,
            cellEditor: 'inputValidator',
            cellRendererFramework: EditItemComponent,
            singleClickEdit: true,
            valueFormatter: params => {
              if (typeof params.value === 'object') {
                if (params.value.value) {
                  return params.value.value;
                } else return '0';
              } else {
                return params.value;
              }
            },
            cellClassRules: {
              'pw-gray-border': params => {
                return params.value.isValid === true;
              },
              'pw-error-border': params => {
                this.isValid = false;
                return (
                  params.value.isValid === false && params.value.value !== ''
                );
              }
            }
          },
          {
            headerName: translatedMessages['pw.pifSeries.toLabel'],
            field: 'toNo',
            editable: true,
            width: 228,
            resizable: true,
            suppressSizeToFit: true,
            singleClickEdit: true,
            cellEditor: 'inputValidator',
            cellRendererFramework: EditItemComponent,
            valueFormatter: params => {
              if (typeof params.value === 'object') {
                if (params.value.value) {
                  return params.value.value;
                } else return '0';
              } else {
                return params.value;
              }
            },
            cellClassRules: {
              'pw-gray-border': params => {
                return params.value.isValid === true;
              },
              'pw-error-border': params => {
                return (
                  params.value.isValid === false && params.value.value !== ''
                );
              }
            }
          },
          {
            headerName: translatedMessages['pw.pifSeries.lastUsedNoLabel'],
            field: 'currentSeqNo',
            width: 228,
            resizable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.pifSeries.homeBankLabel'],
            field: 'isHomeBank',
            resizable: true,
            width: 227,
            suppressSizeToFit: true,
            valueFormatter: params => {
              if (params.value === true) {
                  return "Home Bank";
              } else if(params.value === false){
                return "Non Home Bank";
              } else{
                return '-';
              }
            },
          }
        ];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pifSeries']) {
      this.createForm();
    }
  }


  createForm() {
    this.pifSeriesFormGroup = new FormGroup({});
    this.pifSeries.forEach(series => {
      this.pifSeriesFormGroup.addControl(
        series.id,
        new FormGroup({
          fromNo: new FormControl(series ? series?.fromNo : ''),
          toNo: new FormControl(series ? series?.toNo : '')
        })
      );
    });
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent
    };
  }

  onCellValueChanged(changeEvent) {
    if (
      changeEvent.newValue.value !== '' &&
      changeEvent.newValue.value &&
      changeEvent.newValue.isValid
    ) {
      this.isValid = changeEvent.value.isValid;
      switch (changeEvent.colDef.field) {
        case 'fromNo': {
          this.api.stopEditing();
          this.pifSeriesFormGroup.controls[changeEvent.data?.id].patchValue({
            fromNo: changeEvent.value?.value
          });
          break;
        }
        case 'toNo': {
          this.api.stopEditing();
          this.pifSeriesFormGroup.controls[changeEvent.data?.id].patchValue({
            toNo: changeEvent.value?.value
          });
          break;
        }
      }
    }
  }
  callAlertPopup(key: string) {
    this.api.stopEditing();
    this.dialog.closeAll();
    this.transalte
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.ERROR,
            message: translatedMsg
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
              this.dialog.closeAll();
              this.isCardValidation = false;
              this.isChequeValidation = false;
              this.isFromGreateThanTo = false;
              this.isValid = true;
            }
          });
      });
  }

  getContext() {
    return {
      validators: {
        fromNo: [this.fieldValidatorsService.numbersField('FromNo')],
        toNo: [this.fieldValidatorsService.numbersField('ToNo')]
      }
    };
  }

  save() {
    this.api.stopEditing();
    const save = this.checkValidation();
    if (save) {
      this.savePayload = [];
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.alertPopup.saveConfirmation'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            Object.entries(this.pifSeriesFormGroup.value).forEach(
              (val: any) => {
                this.savePayload.push({
                  fromNo: val[1].fromNo,
                  toNo: val[1].toNo,
                  id: val[0]
                });
              }
            );
            this.savePIFSeriesPayload.emit(this.savePayload);
          }
        });
    }
  }
  checkValidation() {
    const rowData = this.getAllRows();
    const pattern = /^[0-9]*$/;
    for (const data of rowData) {
      if (
        (typeof data.fromNo === 'object'
          ? pattern.test(data.fromNo.value)
          : pattern.test(data.fromNo)) &&
        (typeof data.toNo === 'object'
          ? pattern.test(data.toNo.value)
          : pattern.test(data.toNo))
      ) {
        this.isValid = true;
      } else {
        this.isValid = false;
        break;
      }
    }
    if (this.isValid) {
      for (const data of rowData) {
        if (
          (typeof data.fromNo === 'object'
            ? Number(data.fromNo.value)
            : Number(data.fromNo)) >=
          (typeof data.toNo === 'object'
            ? Number(data.toNo.value)
            : Number(data.toNo))
        ) {
          this.isFromGreateThanTo = true;
          break;
        } else {
          this.isFromGreateThanTo = false;
        }
      }
    }
    if (this.isFromGreateThanTo === false && this.isValid) {
      for (const data of rowData) {
        if (
          data.paymentCode.toUpperCase() === 'CARD' ||
          data.paymentCode.toUpperCase() === 'CASH'
        ) {
          if (
            (typeof data.toNo === 'object'
              ? Number(data.toNo.value)
              : Number(data.toNo)) > 9999 &&
            (data.paymentCode.toUpperCase() === 'CARD' ||
              data.paymentCode.toUpperCase() === 'CASH')
          ) {
            this.isCardValidation = true;
            break;
          } else {
            this.isCardValidation = false;
          }
        } else if (
          data.paymentCode.toUpperCase() === 'CHEQUE' ||
          data.paymentCode.toUpperCase() === 'DD'
        ) {
          if (
            (typeof data.toNo === 'object'
              ? Number(data.toNo.value)
              : Number(data.toNo)) > 999999 &&
            (data.paymentCode.toUpperCase() === 'CHEQUE' ||
              data.paymentCode.toUpperCase() === 'DD')
          ) {
            this.isChequeValidation = true;
            break;
          } else {
            this.isChequeValidation = false;
          }
        }
      }
    }
    if (!this.isValid) {
      this.callAlertPopup('Please Enter Valid PIF Series');
    } else if (this.isFromGreateThanTo === true) {
      this.callAlertPopup('pw.pifSeries.errorMessageLabel');
    } else if (this.isCardValidation === true) {
      this.callAlertPopup('pw.pifSeries.cardValidationMsg');
    } else if (this.isChequeValidation === true) {
      this.callAlertPopup('pw.pifSeries.chequeValidationMsg');
    }

    if (
      this.isFromGreateThanTo === false &&
      this.isCardValidation === false &&
      this.isChequeValidation === false &&
      this.isValid
    ) {
      return true;
    }
  }
  getAllRows() {
    const rowData = [];
    this.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }
  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }
  onCellEditingStarted(event) {
    this.mapValue(event);
  }
  onCellFocused(event) {
    this.mapValue(event);
  }
  mapValue(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    var data = this.api.getValue(this.currentRowField, node);
    this.currentRowInfo = typeof data === 'object' ? data.value : data;
  }
  focusOut(event) {
    this.isFocusing = false;
  }

}
