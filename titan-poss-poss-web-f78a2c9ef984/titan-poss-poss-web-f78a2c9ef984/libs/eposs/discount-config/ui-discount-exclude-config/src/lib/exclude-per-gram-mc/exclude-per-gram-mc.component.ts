import {
  Component,
  OnInit,
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
import {
  CurrencyFormatterService,
  CurrencySymbolService
} from '@poss-web/shared/components/ui-formatters';

@Component({
  selector: 'poss-web-exclude-per-gram-mc',
  templateUrl: './exclude-per-gram-mc.component.html',
  styleUrls: ['./exclude-per-gram-mc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExcludePerGramMcConfigComponent
  implements OnChanges, OnDestroy, OnInit {
  @Input() excludeMC: DiscountExcludeConfig[] = [];
  @Input() currencyCode: string;
  @Input() selectedTab;
  @Input() discountDetails;
  @Output() deleteExcludeMC = new EventEmitter<any>();

  @Output() saveExcludeMC = new EventEmitter<SaveDiscountExcludeConfig>();
  @Output() activateExcludeType = new EventEmitter<any>();
  component: ExcludePerGramMcConfigComponent = this;
  selectedRowIndex = 0;

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
  isRowSelected = false;

  constructor(
    private translate: TranslateService,
    private fieldValidatorService: FieldValidatorsService,
    private dialog: MatDialog,
    private currencySymbolService: CurrencySymbolService,
    private currencyFormatterService: CurrencyFormatterService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.translate
      .get([
        'pw.discountMCExculdeConfig.toPercentageLabel',
        'pw.discountMCExculdeConfig.fromPercentageLabel',
        'pw.discountMCExculdeConfig.fromLabel',
        'pw.discountMCExculdeConfig.toLabel',
        'pw.discountMCExculdeConfig.errorMessageForNull',
        'pw.discountMCExculdeConfig.errorMessageForCurrentRangeFromValueLessThanPreviousRangeTo',
        'pw.discountMCExculdeConfig.errorMessageForRangeToLessThanRangeFrom',
        'pw.discountMCExculdeConfig.errorMessageForcurrentRangeToValueGreaterThanNextRangeFrom'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.fromLabel = this.replaceCurrencyCode(
          translatedMessages['pw.discountMCExculdeConfig.fromPercentageLabel']
        );
        this.toLabel = this.replaceCurrencyCode(
          translatedMessages['pw.discountMCExculdeConfig.toPercentageLabel']
        );
        this.errorMessageForNull = this.replaceCurrencyCode(
          translatedMessages['pw.discountMCExculdeConfig.errorMessageForNull']
        );
        this.errorMessageForCurrentRangeFromValueLessThanPreviousRangeTo = this.replaceCurrencyCode(
          translatedMessages[
            'pw.discountMCExculdeConfig.errorMessageForCurrentRangeFromValueLessThanPreviousRangeTo'
          ]
        );
        this.errorMessageForRangeToLessThanRangeFrom = this.replaceCurrencyCode(
          translatedMessages[
            'pw.discountMCExculdeConfig.errorMessageForRangeToLessThanRangeFrom'
          ]
        );
        this.errorMessageForcurrentRangeToValueGreaterThanNextRangeFrom = this.replaceCurrencyCode(
          translatedMessages[
            'pw.discountMCExculdeConfig.errorMessageForcurrentRangeToValueGreaterThanNextRangeFrom'
          ]
        );
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
            headerName: this.replaceCurrencyCode(
              translatedMessages[
                'pw.discountMCExculdeConfig.fromPercentageLabel'
              ]
            ),
            field: 'fromValue',
            editable: true,
            isAmount: true,
            cellEditor: 'inputValidator',
            resizable: true,
            width: 200,
            suppressMovable: true,
            suppressSizeToFit: true,
            cellRendererFramework: EditItemComponent,

            valueFormatter: params => {
              const amount =
                typeof params.data.fromValue === 'object'
                  ? params.data.fromValue.value
                  : params.data.fromValue;

              if (amount === '' || isNaN(amount)) {
                return ' ';
              }
              return this.currencyFormatterService.format(
                amount,
                this.currencyCode,
                false
              );
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
            headerName: this.replaceCurrencyCode(
              translatedMessages['pw.discountMCExculdeConfig.toPercentageLabel']
            ),
            field: 'toValue',
            isAmount: true,
            editable: true,
            suppressMovable: true,
            resizable: true,
            width: 200,
            suppressSizeToFit: true,
            cellEditor: 'inputValidator',
            cellRendererFramework: EditItemComponent,

            valueFormatter: params => {
              const amount =
                typeof params.data.toValue === 'object'
                  ? params.data.toValue.value
                  : params.data.toValue;

              if (amount === '' || isNaN(amount)) {
                return ' ';
              }
              return this.currencyFormatterService.format(
                amount,
                this.currencyCode,
                false
              );
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
    if (changes['excludeMC']) {
      this.isRowSelected = false;
      if (this.excludeMC.length) {
        this.rowData = [];
        for (const item of this.excludeMC) {
          this.createForm(item);
        }
      } else {
        this.createForm();
      }
    }
  }

  createForm(excludeComplexity?: DiscountExcludeConfig) {
    if (excludeComplexity) {
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
          this.fieldValidatorService.minAmount(
            1,
            this.fromLabel,
            this.currencyCode
          )
        ],
        toValue: [
          this.fieldValidatorService.requiredField(this.toLabel),
          this.fieldValidatorService.minAmount(
            1,
            this.toLabel,
            this.currencyCode
          )
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
        this.deleteExcludeMC.emit({
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
        this.saveExcludeMC.emit(this.prepareResponse(array));
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

  replaceCurrencyCode(msg: string) {
    return msg.replace(
      /{{currency}}/g,
      this.currencySymbolService.get(this.currencyCode)
    );
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
