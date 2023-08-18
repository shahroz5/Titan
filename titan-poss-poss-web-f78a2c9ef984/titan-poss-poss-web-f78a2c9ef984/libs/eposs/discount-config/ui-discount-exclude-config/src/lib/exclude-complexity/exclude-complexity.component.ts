import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  InputValidatorComponent,
  DeleteRowComponent,
  EditItemComponent,
  ToggleButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { MatDialog } from '@angular/material/dialog';
import {
  AlertPopupServiceAbstraction,
  DiscountExcludeConfig,
  AlertPopupTypeEnum,
  SaveDiscountExcludeConfig,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-exclude-complexity',
  templateUrl: './exclude-complexity.component.html',
  styleUrls: ['./exclude-complexity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExcludeComplexityComponent
  implements OnChanges, OnDestroy {
  @Input() excludeComplexity: DiscountExcludeConfig[] = [];
  @Input() selectedTab;
  @Input() discountDetails;
  @Output() deleteExcludeComplexity = new EventEmitter<any>();

  @Output() saveExcludeComplexity = new EventEmitter<
    SaveDiscountExcludeConfig
  >();
  @Output() activateExcludeType = new EventEmitter<any>();
  component: ExcludeComplexityComponent = this;
  selectedRowIndex = 0;
  isRowSelected = false;

  index = 1;
  hasError: boolean;

  errorMessageForNull: string;
  errorMessageForCurrentRangeFromValueLessThanPreviousRangeTo: string;
  errorMessageForRangeToLessThanRangeFrom: string;
  errorMessageForcurrentRangeToValueGreaterThanNextRangeFrom: string;

  alldeleted: boolean;
  invalidValueError: boolean;

  currentRangeFromValueLessThanPreviousRangeTo: boolean;
  rangeToLessThanRangeFrom: boolean;
  currentRangeToValueGreaterThanNextRangeFrom: boolean;

  errorDialogReference;
  isAbove = undefined;
  isBelow = undefined;

  destroy$ = new Subject<null>();
  gridApi: GridApi;
  domLayout = 'autoHeight';
  colDef = [];
  rowData: DiscountExcludeConfig[] = [];
  editMode;

  fromLabel: string;
  toLabel: string;

  defaultColDef = {
    suppressMovable: true
  };

  constructor(
    private translate: TranslateService,
    private fieldValidatorService: FieldValidatorsService,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.discountComplexityExculdeConfig.toPercentageLabel',
        'pw.discountComplexityExculdeConfig.fromPercentageLabel',
        'pw.discountComplexityExculdeConfig.fromLabel',
        'pw.discountComplexityExculdeConfig.toLabel',
        'pw.discountComplexityExculdeConfig.errorMessageForNull',
        'pw.discountComplexityExculdeConfig.errorMessageForCurrentRangeFromValueLessThanPreviousRangeTo',
        'pw.discountComplexityExculdeConfig.errorMessageForRangeToLessThanRangeFrom',
        'pw.discountComplexityExculdeConfig.errorMessageForcurrentRangeToValueGreaterThanNextRangeFrom'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.fromLabel =
          translatedMessages[
            'pw.discountComplexityExculdeConfig.fromPercentageLabel'
          ];
        this.toLabel =
          translatedMessages[
            'pw.discountComplexityExculdeConfig.toPercentageLabel'
          ];
        this.errorMessageForNull =
          translatedMessages[
            'pw.discountComplexityExculdeConfig.errorMessageForNull'
          ];
        this.errorMessageForCurrentRangeFromValueLessThanPreviousRangeTo =
          translatedMessages[
            'pw.discountComplexityExculdeConfig.errorMessageForCurrentRangeFromValueLessThanPreviousRangeTo'
          ];
        this.errorMessageForRangeToLessThanRangeFrom =
          translatedMessages[
            'pw.discountComplexityExculdeConfig.errorMessageForRangeToLessThanRangeFrom'
          ];
        this.errorMessageForcurrentRangeToValueGreaterThanNextRangeFrom =
          translatedMessages[
            'pw.discountComplexityExculdeConfig.errorMessageForcurrentRangeToValueGreaterThanNextRangeFrom'
          ];
        this.colDef = [
          {
            checkboxSelection: true,
            width: 40,
            minWidth: 40,
            suppressMovable: true,
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName:
              translatedMessages[
                'pw.discountComplexityExculdeConfig.fromPercentageLabel'
              ],
            field: 'fromValue',
            editable: true,
            cellEditor: 'inputValidator',
            resizable: true,
            width: 200,
            suppressMovable: true,
            suppressSizeToFit: true,
            cellRendererFramework: EditItemComponent,
            valueFormatter: (params: { value: { value: any } }) => {
              if (typeof params.value === 'object') {
                if (params.value.value) {
                  return params.value.value;
                } else {
                  return ' ';
                }
              } else {
                return params.value;
              }
            },
            cellClassRules: {
              'pw-gray-border': params => {
                return params.value.isValid === true;
              },
              'pw-error-border': params => {
                return params.value.isValid === false;
              }
            }
          },
          {
            headerName:
              translatedMessages[
                'pw.discountComplexityExculdeConfig.toPercentageLabel'
              ],
            field: 'toValue',
            editable: true,
            suppressMovable: true,
            resizable: true,
            width: 200,
            suppressSizeToFit: true,
            cellEditor: 'inputValidator',
            cellRendererFramework: EditItemComponent,
            valueFormatter: (params: { value: { value: any } }) => {
              if (typeof params.value === 'object') {
                if (params.value.value) {
                  return params.value.value;
                } else {
                  return ' ';
                }
              } else {
                return params.value;
              }
            },
            cellClassRules: {
              'pw-gray-border': params => {
                return params.value.isValid === true;
              },
              'pw-error-border': params => {
                return params.value.isValid === false;
              }
            }
          },
          {
            headerName: '',
            flex: 1
          },
          {
            headerName: 'Is Active',
            field: 'isActive',
            cellRendererFramework: ToggleButtonCellComponent,
            width: 120
          },
          {
            headerName: '',
            suppressMovable: true,
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            cellRendererFramework: DeleteRowComponent,
            suppressRowClickSelection: 'true',
            onCellClicked: this.remove.bind(this)
          }
        ];
      });
  }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['excludeComplexity']) {
      this.isRowSelected = false;
      if (this.excludeComplexity.length) {
        this.rowData = [];
        for (const item of this.excludeComplexity) {
          this.createForm(item);
        }
      } else {
        this.createForm();
      }
    }
  }

  createForm(excludeComplexity?: DiscountExcludeConfig) {
    if (excludeComplexity) {
      // this.disableButtons = false;
      this.rowData.push({
        id: excludeComplexity.id ? excludeComplexity.id : '',
        fromValue: excludeComplexity.fromValue
          ? excludeComplexity.fromValue
          : '',
        toValue: excludeComplexity.toValue ? excludeComplexity.toValue : '',
        isActive: excludeComplexity.isActive
          ? excludeComplexity.isActive
          : false
      });
    } else {
      // this.disableButtons = true;
      this.rowData = [];
      this.rowData.push({
        id: '',
        fromValue: '',
        toValue: '',
        isActive: true
      });
    }
  }

  addAbove() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.isAbove = true;
      this.isBelow = false;
      if (this.editMode) {
        this.editMode = false;
        this.gridApi.stopEditing();
      } else {
        this.checkValidation(this.rowData);
        this.addData();
      }
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

  addBelow() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.isBelow = true;
      this.isAbove = false;

      if (this.editMode) {
        this.editMode = false;
        this.gridApi.stopEditing();
      } else {
        this.checkValidation(this.rowData);
        this.addData();
      }
    }
  }

  checkValidation(rowData) {
    let currentRowData;
    let prevRowData;
    let nextRowData;
    currentRowData = rowData[this.selectedRowIndex];
    prevRowData = rowData[this.selectedRowIndex - 1];
    nextRowData = rowData[this.selectedRowIndex + 1];

    if (!this.alldeleted) {
      for (const data of rowData) {
        if (data?.fromValue?.value === '' || data?.toValue?.value === '') {
          this.invalidValueError = true;
          break;
        } else if (
          data?.toValue?.isValid === false ||
          data?.fromValue?.isValid === false
        ) {
          this.invalidValueError = true;
          break;
        } else {
          this.invalidValueError = false;
        }
      }

      if (!this.invalidValueError) {
        if (
          Number(
            typeof currentRowData?.toValue === 'object'
              ? currentRowData?.toValue?.value
              : currentRowData?.toValue
          ) <
          Number(
            typeof currentRowData?.fromValue === 'object'
              ? currentRowData?.fromValue?.value
              : currentRowData?.fromValue
          )
        ) {
          this.rangeToLessThanRangeFrom = true;
        } else {
          this.rangeToLessThanRangeFrom = false;
        }
      }
      // current row data less than previous standard value
      if (!this.invalidValueError) {
        if (
          Number(
            typeof currentRowData?.fromValue === 'object'
              ? currentRowData?.fromValue?.value
              : currentRowData?.fromValue
          ) <=
          Number(
            typeof prevRowData?.toValue === 'object'
              ? prevRowData?.toValue?.value
              : prevRowData?.toValue
          )
        ) {
          this.currentRangeFromValueLessThanPreviousRangeTo = true;
        } else {
          this.currentRangeFromValueLessThanPreviousRangeTo = false;
        }
      }

      // greater than next standard value

      if (!this.invalidValueError) {
        if (
          Number(
            typeof currentRowData?.toValue === 'object'
              ? currentRowData?.toValue?.value
              : currentRowData?.toValue
          ) >=
          Number(
            typeof nextRowData?.fromValue === 'object'
              ? nextRowData?.fromValue?.value
              : nextRowData?.fromValue
          )
        ) {
          this.currentRangeToValueGreaterThanNextRangeFrom = true;
        } else {
          this.currentRangeToValueGreaterThanNextRangeFrom = false;
        }
      }

      this.showErrorPopUp();
    }
  }

  showErrorPopUp() {
    if (
      this.invalidValueError ||
      this.currentRangeFromValueLessThanPreviousRangeTo ||
      this.currentRangeToValueGreaterThanNextRangeFrom ||
      this.rangeToLessThanRangeFrom
    ) {
      this.hasError = true;
      let errorMessage;
      if (this.invalidValueError) {
        errorMessage = this.errorMessageForNull;
      } else if (this.currentRangeFromValueLessThanPreviousRangeTo) {
        errorMessage = this
          .errorMessageForCurrentRangeFromValueLessThanPreviousRangeTo;
      } else if (this.currentRangeToValueGreaterThanNextRangeFrom) {
        errorMessage = this
          .errorMessageForcurrentRangeToValueGreaterThanNextRangeFrom;
      } else if (this.rangeToLessThanRangeFrom) {
        errorMessage = this.errorMessageForRangeToLessThanRangeFrom;
      }
      this.dialog.closeAll();

      if (
        this.dialog.openDialogs.filter(ref => ref === this.errorDialogReference)
          .length === 0
      ) {
        this.errorDialogReference = this.alertPopupService.open({
          type: AlertPopupTypeEnum.ERROR,
          message: errorMessage
        });

        this.errorDialogReference
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
              this.isAbove = false;
              this.invalidValueError = false;
              this.currentRangeToValueGreaterThanNextRangeFrom = false;
              this.currentRangeFromValueLessThanPreviousRangeTo = false;
              this.rangeToLessThanRangeFrom = false;
            }
          });
      }
    } else {
      this.hasError = false;
    }
  }
  rowEditingStarted(change) {
    this.editMode = true;
  }

  addData() {
    if (this.isAbove === true) {
      if (this.rowData.length > 1) {
        if (
          this.invalidValueError === false &&
          this.currentRangeFromValueLessThanPreviousRangeTo === false &&
          this.currentRangeToValueGreaterThanNextRangeFrom === false &&
          this.rangeToLessThanRangeFrom === false
        ) {
          this.rowData.splice(this.selectedRowIndex, 0, {
            id: '',
            fromValue: '',
            toValue: '',
            isActive: true
          });

          this.gridApi.setRowData(this.rowData);
        }
      } else if (this.rowData.length === 1) {
        if (
          this.invalidValueError === false &&
          this.rangeToLessThanRangeFrom === false
        ) {
          this.rowData.splice(this.selectedRowIndex, 0, {
            id: '',
            fromValue: '',
            toValue: '',
            isActive: true
          });

          this.gridApi.setRowData(this.rowData);
        }
      }
      this.isAbove = false;
    } else if (this.isBelow === true) {
      if (this.rowData.length > 1) {
        if (
          this.invalidValueError === false &&
          this.currentRangeFromValueLessThanPreviousRangeTo === false &&
          this.currentRangeToValueGreaterThanNextRangeFrom === false &&
          this.rangeToLessThanRangeFrom === false
        ) {
          this.rowData.splice(this.selectedRowIndex + 1, 0, {
            id: '',
            fromValue: '',
            toValue: '',
            isActive: true
          });

          this.gridApi.setRowData(this.rowData);
        }
      } else if (this.rowData.length === 1) {
        if (
          this.invalidValueError === false &&
          this.rangeToLessThanRangeFrom === false
        ) {
          this.rowData.splice(this.selectedRowIndex + 1, 0, {
            id: '',
            fromValue: '',
            toValue: '',
            isActive: true
          });

          this.gridApi.setRowData(this.rowData);
        }
      }
      this.isBelow = false;
    }
  }
  onSelectionChanged() {
    this.alldeleted = false;
    this.isRowSelected = false;
    if (this.gridApi.getSelectedNodes().length) {
      this.isRowSelected = true;
      this.selectedRowIndex = this.gridApi.getSelectedNodes()[0].rowIndex;
    }
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent
    };
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.rowData);
  }

  getContext() {
    return {
      validators: {
        fromValue: [
          this.fieldValidatorService.requiredField(this.fromLabel),
          this.fieldValidatorService.percentageField(this.fromLabel),
          this.fieldValidatorService.min(0.01, this.fromLabel),
          this.fieldValidatorService.max(100, this.fromLabel)
        ],
        toValue: [
          this.fieldValidatorService.requiredField(this.toLabel),
          this.fieldValidatorService.percentageField(this.toLabel),
          this.fieldValidatorService.min(0.01, this.toLabel),
          this.fieldValidatorService.max(100, this.toLabel)
        ]
      },
      componentParent: this.component,
      focusOn: 'fromValue'
    };
  }

  rowValueChanged() {
    this.checkValidation(this.rowData);
    this.addData();
    this.editMode = false;
  }

  getAllRows() {
    const rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  remove(params) {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (params.data.id !== '') {
        this.deleteExcludeComplexity.emit({
          removeValues: [params.data.id],
          excludeType: this.selectedTab
        });
      }
      this.editMode = false;
      this.index = 1;
      if (this.getAllRows().length === 1) {
        this.alldeleted = true;

        this.rowData = [
          {
            id: '',
            toValue: '',
            fromValue: '',
            isActive: true
          }
        ];

        this.gridApi.redrawRows();
      } else {
        this.selectedRowIndex = 0;
        this.gridApi.applyTransaction({
          remove: [params.data]
        });

        this.rowData = this.getAllRows().map(ob => ({
          ...ob,
          rowId: (this.index++).toString()
        }));
      }
    }
  }


  save() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.index = 1;

      this.gridApi.stopEditing();
      this.checkValidation(this.rowData);

      if (!this.hasError) {
        const array = this.getAllRows().map(ob => ({
          ...ob,
          rowId: (this.index++).toString()
        }));
        this.saveExcludeComplexity.emit(this.prepareResponse(array));
      }
    }
  }

  prepareResponse(array: any[]) {
    const newData = array.filter(data => data.id === '');
    const updatedData = array.filter(data => data.id !== '');

    const add: any[] = [];
    const update: DiscountExcludeConfig[] = [];
    for (const value of newData) {
      add.push({
        fromValue:
          typeof value.fromValue === 'object'
            ? value.fromValue?.value
            : value?.fromValue,
        toValue:
          typeof value.toValue === 'object'
            ? value.toValue?.value
            : value?.toValue
      });
    }

    for (const value of updatedData) {
      update.push({
        fromValue:
          typeof value.fromValue === 'object'
            ? value.fromValue?.value
            : value?.fromValue,
        toValue:
          typeof value.toValue === 'object'
            ? value.toValue?.value
            : value?.toValue,
        id: value.id,
        isActive: value.isActive
      });
    }

    return {
      addValues: this.alldeleted ? [] : add,
      updateValue: this.alldeleted ? [] : update,
      removeValues: [],
      excludeType: this.selectedTab
    };
  }
  selectionChange(id, status) {
    console.log(id, status, 'chevk selection change');
    if (id === '' || id === null) {
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.discountConfig.enterExcludeRangesErrorMsg'
      });
    } else {
      this.activateExcludeType.emit({
        id: id,
        status: status,
        excludeType: this.selectedTab
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
