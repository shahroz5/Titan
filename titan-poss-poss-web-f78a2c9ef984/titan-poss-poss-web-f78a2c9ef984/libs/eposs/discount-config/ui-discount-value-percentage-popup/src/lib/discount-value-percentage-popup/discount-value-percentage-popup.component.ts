import {
  DiscountChargeTypeEnum,
  ValuePercentageData,
  ValuePercentagePopupData,
  DiscountValuePerFielsEnum,
  ValuePercentageConfig
} from '@poss-web/shared/models';
import {
  Component,
  OnDestroy,
  Inject,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  EditItemComponent,
  InputValidatorComponent,
  ValuePercentageComponent,
  ValuePercentageToggleComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  CurrencyFormatterService,
  CurrencySymbolService,
  PercentageFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-discount-value-percentage-popup',
  templateUrl: './discount-value-percentage-popup.component.html'
})
export class DiscountValuePercentagePopupComponent implements OnDestroy {
  configForm: FormGroup;

  columnDefs = [];
  rowSelection = 'multiple';
  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;
  api: GridApi;
  defaultColDef = {
    resizable: true,
    suppressMovable: true,
    suppressSizeToFit: true,
    singleClickEdit: true
  };
  component: any = this;

  rowData: ValuePercentageData[] = [];
  destroy$: Subject<null> = new Subject<null>();

  valueLabel = 'Value';
  showInvalidError = false;
  showMinValueError = false;
  checkPreviewAndRegularIsValid = true;
  errorInPreviewAndRegularRow = null;
  minValueErrorData = [];

  typesHeaderName: string;
  chargesHeadername: string;
  regularHeaderName: string;
  previewHeaderName: string;
  coHeaaderName: string;
  abHeaderName: string;
  rivaHeaderName: string;
  focusApply = false;
  @ViewChild('applyButton') inputElement: ElementRef;

  constructor(
    private currencyFormatterService: CurrencyFormatterService,
    private currencySymbolService: CurrencySymbolService,
    private translate: TranslateService,
    private fieldValidatorService: FieldValidatorsService,
    private percentageFormatterService: PercentageFormatterService,
    public dialogRef: MatDialogRef<DiscountValuePercentagePopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      config: ValuePercentagePopupData;
      currencyCode: string;
      isABOfferApplicable: true;
      isCOOfferApplicable: true;
      isPreviewApplicable: true;
      isRiva: true;
      isEdit?: boolean;
    }
  ) {
    if (data.config) {
      this.rowData.push({
        charge: 'Metal Charges',
        type: DiscountChargeTypeEnum.GC,
        id: DiscountChargeTypeEnum.MC,
        regular: {
          value: this.getValuePercent('regular', 'goldCharges').value,
          isPercent: this.getValuePercent('regular', 'goldCharges').isPercent
        },
        preview: {
          value: this.getValuePercent('preview', 'goldCharges').value,
          isPercent: this.getValuePercent('preview', 'goldCharges').isPercent
        },
        ab: {
          value: this.getValuePercent('ab', 'goldCharges').value,
          isPercent: this.getValuePercent('ab', 'goldCharges').isPercent
        },
        co: {
          value: this.getValuePercent('co', 'goldCharges').value,
          isPercent: this.getValuePercent('co', 'goldCharges').isPercent
        },
        riva: {
          value: this.getValuePercent('riva', 'goldCharges').value,
          isPercent: this.getValuePercent('riva', 'goldCharges').isPercent
        },
        hasPercent: true
      });

      this.rowData.push({
        charge: 'Making Charges',
        type: DiscountChargeTypeEnum.MC,
        id: DiscountChargeTypeEnum.MC,
        regular: {
          value: this.getValuePercent('regular', 'mcCharges').value,
          isPercent: this.getValuePercent('regular', 'mcCharges').isPercent
        },
        preview: {
          value: this.getValuePercent('preview', 'mcCharges').value,
          isPercent: this.getValuePercent('preview', 'mcCharges').isPercent
        },
        ab: {
          value: this.getValuePercent('ab', 'mcCharges').value,
          isPercent: this.getValuePercent('ab', 'mcCharges').isPercent
        },
        co: {
          value: this.getValuePercent('co', 'mcCharges').value,
          isPercent: this.getValuePercent('co', 'mcCharges').isPercent
        },
        riva: {
          value: this.getValuePercent('riva', 'mcCharges').value,
          isPercent: this.getValuePercent('riva', 'mcCharges').isPercent
        },
        hasPercent: true
      });

      this.rowData.push({
        charge: 'Stone Charges',
        type: DiscountChargeTypeEnum.SC,
        id: DiscountChargeTypeEnum.MC,
        regular: {
          value: this.getValuePercent('regular', 'stoneCharges').value,
          isPercent: this.getValuePercent('regular', 'stoneCharges').isPercent
        },
        preview: {
          value: this.getValuePercent('preview', 'stoneCharges').value,
          isPercent: this.getValuePercent('preview', 'stoneCharges').isPercent
        },
        ab: {
          value: this.getValuePercent('ab', 'stoneCharges').value,
          isPercent: this.getValuePercent('ab', 'stoneCharges').isPercent
        },
        co: {
          value: this.getValuePercent('co', 'stoneCharges').value,
          isPercent: this.getValuePercent('co', 'stoneCharges').isPercent
        },
        riva: {
          value: this.getValuePercent('riva', 'stoneCharges').value,
          isPercent: this.getValuePercent('riva', 'stoneCharges').isPercent
        },
        hasPercent: true
      });

      this.rowData.push({
        charge: 'UCP',
        type: DiscountChargeTypeEnum.UCP,
        id: DiscountChargeTypeEnum.UCP,
        regular: {
          value: this.getValuePercent('regular', 'ucp').value,
          isPercent: this.getValuePercent('regular', 'ucp').isPercent
        },
        preview: {
          value: this.getValuePercent('preview', 'ucp').value,
          isPercent: this.getValuePercent('preview', 'ucp').isPercent
        },
        ab: {
          value: this.getValuePercent('ab', 'ucp').value,
          isPercent: this.getValuePercent('ab', 'ucp').isPercent
        },
        co: {
          value: this.getValuePercent('co', 'ucp').value,
          isPercent: this.getValuePercent('co', 'ucp').isPercent
        },
        riva: {
          value: this.getValuePercent('riva', 'ucp').value,
          isPercent: this.getValuePercent('riva', 'ucp').isPercent
        },
        hasPercent: true
      });

      this.rowData.push({
        charge: 'Value per gms',
        type: DiscountChargeTypeEnum.VALUE_PER_GRAM,
        id: DiscountChargeTypeEnum.MC,
        regular: {
          value: this.getValuePercent('regular', 'rsPerGram').value,
          isPercent: this.getValuePercent('regular', 'rsPerGram').isPercent
        },
        preview: {
          value: this.getValuePercent('preview', 'rsPerGram').value,
          isPercent: this.getValuePercent('preview', 'rsPerGram').isPercent
        },
        ab: {
          value: this.getValuePercent('ab', 'rsPerGram').value,
          isPercent: this.getValuePercent('ab', 'rsPerGram').isPercent
        },
        co: {
          value: this.getValuePercent('co', 'rsPerGram').value,
          isPercent: this.getValuePercent('co', 'rsPerGram').isPercent
        },
        riva: {
          value: this.getValuePercent('riva', 'rsPerGram').value,
          isPercent: this.getValuePercent('riva', 'rsPerGram').isPercent
        },

        hasPercent: false
      });
    }
    this.translate
      .get([
        'pw.discValuePerPopup.typesHeaderName',
        'pw.discValuePerPopup.chargesHeadername',
        'pw.discValuePerPopup.regularHeaderName',
        'pw.discValuePerPopup.previewHeaderName',
        'pw.discValuePerPopup.coHeaaderName',
        'pw.discValuePerPopup.abHeaderName',
        'pw.discValuePerPopup.rivaHeaderName'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.rivaHeaderName =
          translatedMessages['pw.discValuePerPopup.rivaHeaderName'];
        this.typesHeaderName =
          translatedMessages['pw.discValuePerPopup.typesHeaderName'];
        this.chargesHeadername =
          translatedMessages['pw.discValuePerPopup.chargesHeadername'];
        this.regularHeaderName =
          translatedMessages['pw.discValuePerPopup.regularHeaderName'];
        this.previewHeaderName =
          translatedMessages['pw.discValuePerPopup.previewHeaderName'];
        this.coHeaaderName =
          translatedMessages['pw.discValuePerPopup.coHeaaderName'];
        this.abHeaderName =
          translatedMessages['pw.discValuePerPopup.abHeaderName'];
      });

    this.columnDefs = [
      {
        headerName: 'Types',
        children: [
          {
            headerName: this.chargesHeadername,
            field: DiscountValuePerFielsEnum.CHARGE,
            minWidth: 120,
            flex: 1
          }
        ]
      },
      {
        headerName: this.regularHeaderName,
        children: [
          {
            headerName: '',
            field: DiscountValuePerFielsEnum.REGULAR,
            width: 140,
            editable: true,
            isAmount: true,
            cellEditor: 'valuePercentageComponent',
            cellRendererFramework: EditItemComponent,
            valueFormatter: params => this.valueFormatter(params),
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            cellClassRules: {
              'pw-gray-border': params => {
                return params.value.isValid === true;
              },
              'pw-error-border': params => {
                return !this.checkValue({
                  value: params?.value?.value,
                  isValid: params?.value?.isValid,
                  isPercent: params?.value?.isPercent
                });
              }
            }
          },
          {
            headerName: '',
            width: 90,
            field: DiscountValuePerFielsEnum.REGULAR,
            cellClass: 'justify-content-center',
            cellRenderer: 'valuePercentageToggleComponent'
          }
        ]
      }
    ];

    if (this.data.isPreviewApplicable) {
      this.columnDefs.push({
        headerName: this.previewHeaderName,
        children: [
          {
            headerName: '',
            field: DiscountValuePerFielsEnum.PREVIEW,
            width: 140,
            editable: true,
            isAmount: true,
            cellEditor: 'valuePercentageComponent',
            cellRendererFramework: EditItemComponent,
            valueFormatter: params => this.valueFormatter(params),
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            cellClassRules: {
              'pw-gray-border': params => {
                return params.value.isValid === true;
              },
              'pw-error-border': params => {
                return !this.checkValue({
                  value: params?.value?.value,
                  isValid: params?.value?.isValid,
                  isPercent: params?.value?.isPercent
                });
              }
            }
          },
          {
            headerName: '',
            width: 90,
            field: DiscountValuePerFielsEnum.PREVIEW,
            cellClass: 'justify-content-center',
            cellRenderer: 'valuePercentageToggleComponent'
          }
        ]
      });
    }

    if (this.data.isABOfferApplicable) {
      this.columnDefs.push({
        headerName: this.abHeaderName,
        children: [
          {
            headerName: '',
            field: DiscountValuePerFielsEnum.AB,
            width: 140,
            editable: true,
            isAmount: true,
            cellEditor: 'valuePercentageComponent',
            cellRendererFramework: EditItemComponent,
            valueFormatter: params => this.valueFormatter(params),
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            cellClassRules: {
              'pw-gray-border': params => {
                return params.value.isValid === true;
              },
              'pw-error-border': params => {
                return !this.checkValue({
                  value: params?.value?.value,
                  isValid: params?.value?.isValid,
                  isPercent: params?.value?.isPercent
                });
              }
            }
          },
          {
            headerName: '',
            width: 90,
            field: DiscountValuePerFielsEnum.AB,
            cellClass: 'justify-content-center',
            cellRenderer: 'valuePercentageToggleComponent'
          }
        ]
      });
    }

    if (this.data.isCOOfferApplicable) {
      this.columnDefs.push({
        headerName: this.coHeaaderName,
        children: [
          {
            headerName: '',
            field: DiscountValuePerFielsEnum.CO,
            width: 140,
            editable: true,
            isAmount: true,
            cellEditor: 'valuePercentageComponent',
            cellRendererFramework: EditItemComponent,

            valueFormatter: params => this.valueFormatter(params),
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            cellClassRules: {
              'pw-gray-border': params => {
                return params.value.isValid === true;
              },
              'pw-error-border': params => {
                return !this.checkValue({
                  value: params?.value?.value,
                  isValid: params?.value?.isValid,
                  isPercent: params?.value?.isPercent
                });
              }
            }
          },
          {
            headerName: '',
            width: 90,
            field: DiscountValuePerFielsEnum.CO,
            cellClass: 'justify-content-center',
            cellRenderer: 'valuePercentageToggleComponent'
          }
        ]
      });
    }

    if (this.data.isRiva) {
      this.columnDefs.push({
        headerName: this.rivaHeaderName,
        children: [
          {
            headerName: '',
            field: DiscountValuePerFielsEnum.RIVA,
            width: 140,
            editable: true,
            isAmount: true,
            cellEditor: 'valuePercentageComponent',
            cellRendererFramework: EditItemComponent,

            valueFormatter: params => this.valueFormatter(params),
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            cellClassRules: {
              'pw-gray-border': params => {
                return params?.value?.isValid === true;
              },
              'pw-error-border': params => {
                return !this.checkValue({
                  value: params?.value?.value,
                  isValid: params?.value?.isValid,
                  isPercent: params?.value?.isPercent
                });
              }
            }
          },
          {
            headerName: '',
            width: 90,
            field: DiscountValuePerFielsEnum.RIVA,
            cellClass: 'justify-content-center',
            cellRenderer: 'valuePercentageToggleComponent'
          }
        ]
      });
      console.log(this.columnDefs);
    }
  }

  getValuePercent = (field1, field2) => {
    console.log(this.data.config);
    return {
      isPercent: this.data.config[field1][field2].isPercent,
      value: this.data.config[field1][field2].value
    };
  };

  valueSymbol(params, field) {
    const isPercent = !!params.data[field].isPercent;
    if (isPercent) {
      return '%';
    } else {
      return this.currencySymbolService.get(this.data.currencyCode);
    }
  }

  validValueCheck(value, numberCheck): boolean {
    if (numberCheck) {
      if (value == null || value === '') {
        return true;
      } else {
        if (!isNaN(value)) return Number.parseFloat(value) >= 0;
        else return false;
      }
    } else {
      return !(value == null || value === '' || isNaN(value));
    }
  }

  valueFormatter(params) {
    console.log(params);
    const value = params.value.value;
    const isPercent = !!params.value.isPercent;
    if (!this.validValueCheck(value, false)) {
      return ' ';
    }
    if (isPercent) {
      return this.percentageFormatterService.format(value, false);
    } else {
      return this.currencyFormatterService.format(
        value,
        this.data.currencyCode,
        false
      );
    }
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent,
      valuePercentageComponent: ValuePercentageComponent,
      valuePercentageToggleComponent: ValuePercentageToggleComponent
    };
  }

  getContext() {
    return {
      validators: {
        amount: [
          this.fieldValidatorService.amountField(this.valueLabel),
          this.fieldValidatorService.minAmount(
            0,
            this.valueLabel,
            this.data.currencyCode
          )
        ],
        percentage: [
          this.fieldValidatorService.percentageField(this.valueLabel),
          this.fieldValidatorService.min(0, this.valueLabel)
        ]
      },
      componentParent: this.component,
      currencyCode: this.data?.currencyCode
    };
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.api.setFocusedCell(0, 'regular');
  }

  close() {
    this.dialogRef.close({ resultData: null, loadDetails: true });
  }

  rowEdit() {
    this.showInvalidError = false;
    this.showMinValueError = false;
    this.minValueErrorData = [];
    this.checkPreviewAndRegularIsValid = true;
    this.errorInPreviewAndRegularRow = null;
  }

  apply() {
    this.api.stopEditing();
    this.showInvalidError = false;
    this.showMinValueError = false;
    this.minValueErrorData = [];
    this.checkPreviewAndRegularIsValid = true;
    this.errorInPreviewAndRegularRow = null;
    const validatedData = this.createDataAndValidate();
    if (validatedData.isValid && this.checkPreviewAndRegularIsValid) {
      this.dialogRef.close({
        resultData: validatedData.data,
        loadDetails: false
      });
    }
  }

  createDataAndValidate() {
    const data = this.createData(this.rowData);
    const isValid = this.checkValidation(data);
    return { data: data, isValid: isValid };
  }

  createData(data: ValuePercentageData[]): ValuePercentagePopupData {
    const res = this.data.config;
    const arrayToObject = {};

    for (const row of data) {
      arrayToObject[row.type] = row;
    }
    res.regular = this.getCharges(arrayToObject, 'regular');
    res.preview = this.getCharges(arrayToObject, 'preview');
    res.ab = this.getCharges(arrayToObject, 'ab');
    res.co = this.getCharges(arrayToObject, 'co');
    res.riva = this.getCharges(arrayToObject, 'riva');
    console.log(res);
    return res;
  }

  getCharges(arrayToObject, type) {
    return {
      ucp: arrayToObject[DiscountChargeTypeEnum.UCP][type],
      mcCharges: arrayToObject[DiscountChargeTypeEnum.MC][type],
      goldCharges: arrayToObject[DiscountChargeTypeEnum.GC][type],
      stoneCharges: arrayToObject[DiscountChargeTypeEnum.SC][type],
      rsPerGram: arrayToObject[DiscountChargeTypeEnum.VALUE_PER_GRAM][type]
    };
  }

  checkValidation(data: ValuePercentagePopupData) {
    const isRegularValid = this.checkDiscountComponent(
      data?.regular,
      this.regularHeaderName
    );
    const isPreviewValid =
      !this.data.isPreviewApplicable ||
      this.checkDiscountComponent(data?.preview, this.previewHeaderName);
    const isCoValid =
      !this.data.isCOOfferApplicable ||
      this.checkDiscountComponent(data?.co, this.coHeaaderName);
    const isABValid =
      !this.data.isABOfferApplicable ||
      this.checkDiscountComponent(data?.ab, this.abHeaderName);
    const isRivaValid =
      !this.data.isRiva ||
      this.checkDiscountComponent(data?.riva, this.rivaHeaderName);
    this.checkPreviewAndRegularIsValid = this.previewValueIsValid(data);
    return (
      isRegularValid && isPreviewValid && isCoValid && isABValid && isRivaValid
    );
  }

  checkDiscountComponent(data: ValuePercentageConfig, name) {
    const isValid =
      this.checkValue(data?.ucp) &&
      this.checkValue(data?.mcCharges) &&
      this.checkValue(data?.goldCharges) &&
      this.checkValue(data?.stoneCharges) &&
      this.checkValue(data?.rsPerGram);
    const isFilled = this.isFilled(
      data?.ucp.value,
      data?.mcCharges.value,
      data?.goldCharges.value,
      data?.stoneCharges.value,
      data?.rsPerGram.value
    );

    if (!this.showInvalidError && !isValid) {
      this.showInvalidError = true;
    }

    if (!isFilled) {
      this.showMinValueError = true;
      this.minValueErrorData.push(name);
    }

    return isValid && isFilled;
  }

  isFilled(
    ucp,
    mcCharges,
    goldCharges,
    stoneCharges,
    rsPerGram
  ): boolean {
    return (
      this.checkGreaterThanZero(ucp) ||
      this.checkGreaterThanZero(mcCharges) ||
      this.checkGreaterThanZero(goldCharges) ||
      this.checkGreaterThanZero(stoneCharges) ||
      this.checkGreaterThanZero(rsPerGram)
    );
  }

  checkGreaterThanZero(value): boolean {
    return Number.parseFloat(value) > 0;
  }

  checkValue(data: { value; isPercent; isValid? }) {
    if (data.isValid === false) {
      return false;
    } else {
      return this.validValueCheck(data.value, true);
    }
  }

  onCellFocused(event) {
    if (
      (this.data.isCOOfferApplicable &&
        this.data.isABOfferApplicable &&
        this.data.isPreviewApplicable &&
        this.data.isRiva) ||
      (this.data.isABOfferApplicable && this.data.isRiva) ||
      (this.data.isPreviewApplicable && this.data.isRiva) ||
      (this.data.isCOOfferApplicable && this.data.isRiva) ||
      (this.data.isABOfferApplicable &&
        this.data.isRiva &&
        this.data.isPreviewApplicable) ||
      (this.data.isCOOfferApplicable &&
        this.data.isRiva &&
        this.data.isABOfferApplicable) ||
      this.data.isRiva
    ) {
      if (
        event.rowIndex === 4 &&
        event.column.colId === 'riva' &&
        event.forceBrowserFocus === false
      ) {
        this.focusApply = true;
      }
    } else if (
      (this.data.isABOfferApplicable &&
        this.data.isCOOfferApplicable &&
        this.data.isPreviewApplicable) ||
      (this.data.isABOfferApplicable && this.data.isCOOfferApplicable) ||
      (this.data.isPreviewApplicable && this.data.isCOOfferApplicable) ||
      this.data.isCOOfferApplicable
    ) {
      if (
        event.rowIndex === 4 &&
        event.column.colId === 'co' &&
        event.forceBrowserFocus === false
      ) {
        this.focusApply = true;
      }
    } else if (
      (this.data.isABOfferApplicable && this.data.isPreviewApplicable) ||
      this.data.isABOfferApplicable
    ) {
      if (
        event.rowIndex === 4 &&
        event.column.colId === 'ab' &&
        event.forceBrowserFocus === false
      ) {
        this.focusApply = true;
      }
    } else if (this.data.isPreviewApplicable) {
      if (
        event.rowIndex === 4 &&
        event.column.colId === 'preview' &&
        event.forceBrowserFocus === false
      ) {
        this.focusApply = true;
      }
    } else {
      if (
        event.rowIndex === 4 &&
        event.column.colId === 'regular' &&
        event.forceBrowserFocus === false
      ) {
        this.focusApply = true;
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab' && this.focusApply) {
      event.preventDefault();
      this.inputElement.nativeElement.focus();
      this.focusApply = false;
    }
  }

  //  To check regular and preview value for all the price components, preview should be greater than or equal to regular
  previewValueIsValid(data) {
    if (
      data.regular.goldCharges.isPercent === data.preview.goldCharges.isPercent
    ) {
      if (
        data.regular.goldCharges.value &&
        data.regular.goldCharges.value !== '' &&
        Number(data.regular.goldCharges.value) !== 0 &&
        data.preview.goldCharges.value &&
        data.preview.goldCharges.value !== '' &&
        Number(data.preview.goldCharges.value) !== 0
      ) {
        if (
          Number(data.regular.goldCharges.value) >=
          Number(data.preview.goldCharges.value)
        ) {
          this.errorInPreviewAndRegularRow =
            'pw.discValuePerPopup.metalChargesLabel';
          return false;
        }
      }
    }

    if (data.regular.mcCharges.isPercent === data.preview.mcCharges.isPercent) {
      if (
        data.regular.mcCharges.value &&
        data.regular.mcCharges.value !== '' &&
        Number(data.regular.mcCharges.value) !== 0 &&
        data.preview.mcCharges.value &&
        data.preview.mcCharges.value !== '' &&
        Number(data.preview.mcCharges.value) !== 0
      ) {
        if (
          Number(data.regular.mcCharges.value) >=
          Number(data.preview.mcCharges.value)
        ) {
          this.errorInPreviewAndRegularRow =
            'pw.discValuePerPopup.makingChargesLabel';
          return false;
        }
      }
    }

    if (
      data.regular.stoneCharges.isPercent ===
      data.preview.stoneCharges.isPercent
    ) {
      if (
        data.regular.stoneCharges.value &&
        data.regular.stoneCharges.value !== '' &&
        Number(data.regular.stoneCharges.value) !== 0 &&
        data.preview.stoneCharges.value &&
        data.preview.stoneCharges.value !== '' &&
        Number(data.preview.stoneCharges.value) !== 0
      ) {
        if (
          Number(data.regular.stoneCharges.value) >=
          Number(data.preview.stoneCharges.value)
        ) {
          this.errorInPreviewAndRegularRow =
            'pw.discValuePerPopup.stoneChargesLabel';
          return false;
        }
      }
    }

    if (data.regular.ucp.isPercent === data.preview.ucp.isPercent) {
      if (
        data.regular.ucp.value &&
        data.regular.ucp.value !== '' &&
        Number(data.regular.ucp.value) !== 0 &&
        data.preview.ucp.value &&
        data.preview.ucp.value !== '' &&
        Number(data.preview.ucp.value) !== 0
      ) {
        if (Number(data.regular.ucp.value) >= Number(data.preview.ucp.value)) {
          this.errorInPreviewAndRegularRow = 'pw.discValuePerPopup.ucpLabel';
          return false;
        }
      }
    }

    if (data.regular.rsPerGram.isPercent === data.preview.rsPerGram.isPercent) {
      if (
        data.regular.rsPerGram.value &&
        data.regular.rsPerGram.value !== '' &&
        Number(data.regular.rsPerGram.value) !== 0 &&
        data.preview.rsPerGram.value &&
        data.preview.rsPerGram.value !== '' &&
        Number(data.preview.rsPerGram.value) !== 0
      ) {
        if (
          Number(data.regular.rsPerGram.value) >
          Number(data.preview.rsPerGram.value)
        ) {
          this.errorInPreviewAndRegularRow =
            'pw.discValuePerPopup.valuePerGmsLabel';
          return false;
        }
      }
    }

    return true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
