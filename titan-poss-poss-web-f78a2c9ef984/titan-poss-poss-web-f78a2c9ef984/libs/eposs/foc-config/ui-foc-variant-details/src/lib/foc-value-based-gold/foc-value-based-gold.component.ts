import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { FormGroup, FormControl } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  ToggleButtonCellComponent,
  ProductMappingCountComponent,
  InputValidatorComponent,
  CheckboxGridCellComponent,
  EditItemComponent,
  DeleteRowComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  ValueBasedVariantDetails,
  SaveVariantDetailsPayload,
  focSchemeBasedEnums,
  AddSchemeDetails,
  UpdateSchemeDetails,
  LoadVariantDetailsPayload,
  ProductGroupMappingServiceAbstraction,
  SaveProductGroup,
  LoadProductGroupPayload,
  GoldStdRowData,
  GoldSlabRowData,
  ProductGroupMappingOption,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  SelectDropDownOption,
  SchemeDetails,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  FocTypeState,
  FocTypeRequestPaylaod,
  tabTypeEnums
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'poss-web-foc-value-based-gold',
  templateUrl: './foc-value-based-gold.component.html',
  styleUrls: ['./foc-value-based-gold.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FocValueBasedGoldComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() varinatDetails: ValueBasedVariantDetails[];
  @Input() category: string;
  @Input() itemType: string;
  @Input() prodouctGroupLoadingError: boolean;
  @Input() selectedGroups: Observable<any>;
  @Input() selectedSlabProductGroups: ProductGroupMappingOption[];
  @Input() schemeDetails: SchemeDetails;
  @Input() focTypeDetails: FocTypeState;
  @Output() loadFocTypeState = new EventEmitter<FocTypeRequestPaylaod>();
  @Output() saveVariantDetails = new EventEmitter<SaveVariantDetailsPayload>();
  @Output() mapProductGroup = new EventEmitter<SaveProductGroup>();
  @Output() loadVariantDetails = new EventEmitter<LoadVariantDetailsPayload>();
  @Output() loadProductGroups = new EventEmitter<LoadProductGroupPayload>();
  @Output() deleteSchemes = new EventEmitter<SaveVariantDetailsPayload>();

  focValueBasedGoldComponent: FocValueBasedGoldComponent = this;
  offerType = focSchemeBasedEnums.STANDARD;
  selectedRowIndex = 0;
  isLoading = false;
  i = 1;

  isSingle = false;
  getRowHeight = 35;
  hasError: boolean;
  inValidTotalFocWeight = false;
  inValidKaratage = false;
  errorMessageForNull: string;
  errorMessageForCurrentStdValueLessThanPrevious: string;
  errorMessageForCurrentStdValueGreaterThanNext: string;
  errorMessageForCurrentSlabFromValueLessThanPreviousSlabTo: string;
  errorMessageForSlabToLessThanSlabFrom: string;
  errorMessageForcurrentSlabToValueGreaterThanNextSlabFrom: string;

  alldeleted: boolean;
  valueEmpty = false;
  currentStdValueLessThanPrevious = false;
  currentStdValueGreaterThanNext = false;

  currentSlabFromValueLessThanPreviousSlabTo = false;
  slabToLessThanSlabFrom = false;
  currentSlabToValueGreaterThanNextSlabFrom = false;

  errorDialogReference;
  isAbove = undefined;
  isBelow = undefined;

  valueBasedGoldStdColdefs;
  valueBasedGoldSlabColdefs;

  configId: string;
  hasSelectionChange: boolean;
  dropDownForm: FormGroup;
  destroy$ = new Subject<null>();
  selectedTab = 0;
  selectedRadioOptions = 'gold';
  selectedDiscountType: string;
  valueBasedGoldStdGridApi: GridApi;
  valueBasedGoldSlabGridApi: GridApi;
  domLayout = 'autoHeight';
  colDefs = [];
  valueBasedGoldStdRowData: GoldStdRowData[] = [];
  valueBasedGoldSlabRowData: GoldSlabRowData[] = [];
  deleteSchemeDetails = [];
  disableValueBasedButton = true;
  editMode = false;
  addRowData = false;
  discountType = focSchemeBasedEnums.STANDARD;

  popUpOpen = false;
  params: any;
  rowIndex: string;
  mappedProductGroups: ProductGroupMappingOption[] = [];
  enableButton = true;

  focEligibility = 'PRE_DISCOUNT_TAX';
  duplicateStdValueError = false;
  errorStdValue: string;
  duplicateSlabValueError: boolean;
  errorSlabValue: string;
  duplicateStdValueErrorMsg: string;
  focEligibilityEmptyError: boolean;
  focEligibilityEmptyErrorMessg: string;
  productMappingError = false;
  productMappingErrorMessage: string;

  focTypeArray: SelectDropDownOption[] = [];
  focEligibilityArray: SelectDropDownOption[] = [];
  alertPopUpOpen = false;
  isMultipleLabel: any;
  weightValidationError = false;
  weightValidationErrorMessage: string;
  openPGPopupFlag = false;
  constructor(
    private productGroupMappingServiceAbstraction: ProductGroupMappingServiceAbstraction,
    private translate: TranslateService,
    private fieldValidatorService: FieldValidatorsService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.cdr.markForCheck();
    this.selectedGroups.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.mappedProductGroups = data;
      if (this.offerType === focSchemeBasedEnums.STANDARD) {
        if (this.popUpOpen === false) {
          this.popUpOpen = true;
          this.openStandardProductGroupPopup(this.params, this.rowIndex);
        } else if (this.isLoading) {
          this.isLoading = false;
        }
      }
      if (this.openPGPopupFlag) {
        this.openPGPopup();
        this.openPGPopupFlag = false;
      }
    });
    this.discountType = this.focTypeDetails.valueBasedGoldCoin;
    this.offerType = this.focTypeDetails.valueBasedGoldCoin;
    this.dropDownForm = new FormGroup({
      discountType: new FormControl(this.focTypeDetails.valueBasedGoldCoin),
      focEligibility: new FormControl(focSchemeBasedEnums.PRE_DISCOUNT_TAX)
    });
    this.isSingle = this.varinatDetails[0]?.isSingle
      ? this.varinatDetails[0]?.isSingle
      : false;

    this.translate
      .get([
        'pw.focConfiguration.stdValue',
        'pw.focConfiguration.isMultiple',
        'pw.focConfiguration.karatage',
        'pw.focConfiguration.totalFocWt',
        'pw.focConfiguration.isSingle',
        'pw.focConfiguration.productGroupMap',
        'pw.focConfiguration.isActive',
        'pw.focConfiguration.errorMessageForNull',
        'pw.focConfiguration.errorMessageForCurrentStdValueLessThanPrevious',
        'pw.focConfiguration.errorMessageForCurrentStdValueGreaterThanNext',
        'pw.focConfiguration.errorMessageForCurrentSlabFromValueLessThanPreviousSlabTo',
        'pw.focConfiguration.errorMessageForSlabToLessThanSlabFrom',
        'pw.focConfiguration.errorMessageForcurrentSlabToValueGreaterThanNextSlabFrom',
        'pw.focConfiguration.duplicateStdValueErrorMsg',
        'pw.focConfiguration.focEligibilityEmptyErrorMessg',
        'pw.focConfiguration.productMappingErrorMessage',
        'pw.focConfiguration.standardLabel',
        'pw.focConfiguration.slabLabel',
        'pw.focConfiguration.preDicountWithTax',
        'pw.focConfiguration.preDiscountWithoutTax',
        'pw.focConfiguration.postDicountWithTax',
        'pw.focConfiguration.postDiscountWithoutTax',

        'pw.focConfiguration.weightValidationErrorMessage'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.weightValidationErrorMessage =
          translatedMessages[
            'pw.focConfiguration.weightValidationErrorMessage'
          ];
        this.isMultipleLabel =
          translatedMessages['pw.focConfiguration.isMultiple'];

        this.focTypeArray.push(
          {
            value: focSchemeBasedEnums.STANDARD,
            description: translatedMessages['pw.focConfiguration.standardLabel']
          },

          {
            value: focSchemeBasedEnums.SLAB,
            description: translatedMessages['pw.focConfiguration.slabLabel']
          }
        );

        this.focEligibilityArray.push(
          {
            value: focSchemeBasedEnums.PRE_DISCOUNT_TAX,
            description:
              translatedMessages['pw.focConfiguration.preDicountWithTax']
          },

          {
            value: focSchemeBasedEnums.PRE_DISCOUNT_WITHOUT_TAX,
            description:
              translatedMessages['pw.focConfiguration.preDiscountWithoutTax']
          },
          {
            value: focSchemeBasedEnums.POST_DISCOUNT_TAX,
            description:
              translatedMessages['pw.focConfiguration.postDicountWithTax']
          },

          {
            value: focSchemeBasedEnums.POST_DISCOUNT_WITHOUT_TAX,
            description:
              translatedMessages['pw.focConfiguration.postDiscountWithoutTax']
          }
        );

        this.productMappingErrorMessage =
          translatedMessages['pw.focConfiguration.productMappingErrorMessage'];

        this.duplicateStdValueErrorMsg =
          translatedMessages['pw.focConfiguration.duplicateStdValueErrorMsg'];
        this.errorMessageForNull =
          translatedMessages['pw.focConfiguration.errorMessageForNull'];
        this.errorMessageForCurrentStdValueLessThanPrevious =
          translatedMessages[
            'pw.focConfiguration.errorMessageForCurrentStdValueLessThanPrevious'
          ];
        this.errorMessageForCurrentStdValueGreaterThanNext =
          translatedMessages[
            'pw.focConfiguration.errorMessageForCurrentStdValueGreaterThanNext'
          ];
        this.errorMessageForCurrentSlabFromValueLessThanPreviousSlabTo =
          translatedMessages[
            'pw.focConfiguration.errorMessageForCurrentSlabFromValueLessThanPreviousSlabTo'
          ];
        this.errorMessageForSlabToLessThanSlabFrom =
          translatedMessages[
            'pw.focConfiguration.errorMessageForSlabToLessThanSlabFrom'
          ];
        this.errorMessageForcurrentSlabToValueGreaterThanNextSlabFrom =
          translatedMessages[
            'pw.focConfiguration.errorMessageForcurrentSlabToValueGreaterThanNextSlabFrom'
          ];
        this.focEligibilityEmptyErrorMessg =
          translatedMessages[
            'pw.focConfiguration.focEligibilityEmptyErrorMessg'
          ];
        this.valueBasedGoldStdColdefs = [
          {
            headerName: translatedMessages['pw.focConfiguration.stdValue'],
            field: 'stdValue',
            width: 120,
            minWidth: 120,
            editable: true,

            suppressMovable: true,
            cellEditor: 'inputValidator',

            isAmount: true,
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
            }
          },
          {
            headerName: translatedMessages['pw.focConfiguration.isMultiple'],
            field: 'isMultiple',
            cellRendererFramework: CheckboxGridCellComponent,
            suppressMovable: true,

            width: 80,
            minWidth: 80
          },
          {
            headerName: translatedMessages['pw.focConfiguration.karatage'],
            field: 'karatage',
            width: 120,
            minWidth: 120,
            editable: true,

            suppressMovable: true,
            cellEditor: 'inputValidator',
            cellRendererFramework: EditItemComponent,
            cellClassRules: {
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                if (params.value.isValid) {
                  this.inValidKaratage = false;
                }
                return params.value.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                if (params.value.isValid === false) {
                  this.inValidKaratage = true;
                }
                return (
                  params.value.isValid === false && params.value.value !== ''
                );
              }
            },

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
            }
          },
          {
            headerName: translatedMessages['pw.focConfiguration.totalFocWt'],
            field: 'totalFocWt',
            width: 120,
            minWidth: 120,
            editable: true,

            suppressMovable: true,
            isWeight: true,
            cellRendererFramework: EditItemComponent,
            cellEditor: 'inputValidator',
            cellClassRules: {
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                if (params.value.isValid) {
                  this.inValidTotalFocWeight = false;
                }
                return params.value.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                if (params.value.isValid === false) {
                  this.inValidTotalFocWeight = true;
                }
                return (
                  params.value.isValid === false && params.value.value !== ''
                );
              }
            },

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
            }

            // cellRendererFramework: EditItemComponent,
          },
          {
            headerName: translatedMessages['pw.focConfiguration.isSingle'],
            field: 'isSingle',
            width: 80,
            minWidth: 80,

            suppressMovable: true,
            cellRendererFramework: CheckboxGridCellComponent
          },
          {
            headerName:
              translatedMessages['pw.focConfiguration.productGroupMap'],
            field: 'productGroupMap',
            width: 150,
            minWidth: 150,

            suppressMovable: true,
            cellRendererFramework: ProductMappingCountComponent
          },
          {
            headerName: translatedMessages['pw.focConfiguration.isActive'],
            field: 'isActive',
            suppressMovable: true,

            cellRendererFramework: ToggleButtonCellComponent,
            width: 100,
            minWidth: 100,
            flex: 1
          },

          {
            headerName: '',
            suppressMovable: true,
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            cellRendererFramework: DeleteRowComponent,
            suppressRowClickSelection: true
          }
        ];
      });

    this.translate
      .get([
        'pw.focConfiguration.slabFrom',
        'pw.focConfiguration.slabTo',
        'pw.focConfiguration.multiplyingValue',
        'pw.focConfiguration.karatage',
        'pw.focConfiguration.totalFocWt',
        'pw.focConfiguration.isActive'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.valueBasedGoldSlabColdefs = [
          {
            checkboxSelection: params => params.data.isActive,
            width: 40,
            minWidth: 40,
            pinned: 'left'
          },
          {
            headerName: translatedMessages['pw.focConfiguration.slabFrom'],
            field: 'slabFrom',
            editable: true,
            isAmount: true,
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
            width: 120,
            minWidth: 120
          },
          {
            headerName: translatedMessages['pw.focConfiguration.slabTo'],
            field: 'slabTo',
            editable: true,
            isAmount: true,
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
            width: 120,
            minWidth: 120
          },
          {
            headerName:
              translatedMessages['pw.focConfiguration.multiplyingValue'],
            field: 'multiplyingValue',
            editable: true,
            isAmount: true,
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
            width: 120,
            minWidth: 120
          },
          {
            headerName: translatedMessages['pw.focConfiguration.karatage'],
            field: 'karatage',
            editable: true,
            width: 120,
            minWidth: 120,
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
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                if (params?.value?.isValid) {
                  this.inValidKaratage = false;
                }
                return params?.value?.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                if (params?.value?.isValid === false) {
                  this.inValidKaratage = true;
                }
                return (
                  params?.value?.isValid === false &&
                  params?.value?.value !== ''
                );
              }
            },
            cellEditor: 'inputValidator'
          },
          {
            headerName: translatedMessages['pw.focConfiguration.totalFocWt'],
            field: 'totalFocWt',
            width: 120,
            minWidth: 120,
            editable: true,
            isWeight: true,
            cellEditor: 'inputValidator',
            cellClassRules: {
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                if (params?.value?.isValid) {
                  this.inValidTotalFocWeight = false;
                }
                return params?.value?.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                if (params?.value?.isValid === false) {
                  this.inValidTotalFocWeight = true;
                }
                return (
                  params?.value?.isValid === false &&
                  params?.value?.value !== ''
                );
              }
            },
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
            }
          },
          {
            headerName: translatedMessages['pw.focConfiguration.isActive'],
            field: 'isActive',
            width: 120,
            minWidth: 120,
            cellRendererFramework: ToggleButtonCellComponent,
            flex: 1
          },
          {
            headerName: '',
            suppressMovable: true,
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            cellRendererFramework: DeleteRowComponent,
            suppressRowClickSelection: true
          }
        ];
      });

    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.prodouctGroupLoadingError === true) {
      this.isLoading = false;
    }

    if (
      this.varinatDetails[0]?.focEligibility ===
      focSchemeBasedEnums.PRE_DISCOUNT_TAX
    ) {
      this.focEligibility = this.varinatDetails[0]?.focEligibility;
    } else if (
      this.varinatDetails[0]?.focEligibility ===
      focSchemeBasedEnums.PRE_DISCOUNT_WITHOUT_TAX
    ) {
      this.focEligibility = this.varinatDetails[0]?.focEligibility;
    } else if (
      this.varinatDetails[0]?.focEligibility ===
      focSchemeBasedEnums.POST_DISCOUNT_TAX
    ) {
      this.focEligibility = this.varinatDetails[0]?.focEligibility;
    } else if (
      this.varinatDetails[0]?.focEligibility ===
      focSchemeBasedEnums.POST_DISCOUNT_WITHOUT_TAX
    ) {
      this.focEligibility = this.varinatDetails[0]?.focEligibility;
    } else {
      this.focEligibility = null;
    }
    this.dropDownForm?.get('focEligibility').patchValue(this.focEligibility);
    this.deleteSchemeDetails = [];

    if (this.varinatDetails.length) {
      this.enableButton = false;
      this.valueBasedGoldStdRowData = [];
      this.valueBasedGoldSlabRowData = [];
      for (const varinatDetailsItem of this.varinatDetails) {
        this.createvalueBasedStdGoldRowData(varinatDetailsItem);
        this.createvalueBasedSlabGoldRowData(varinatDetailsItem);
      }
      this.isSingle = this.varinatDetails[0]?.isSingle
        ? this.varinatDetails[0]?.isSingle
        : false;
      if (
        this.getAllActiveRowsFromGrid().length === 0 &&
        this.offerType === focSchemeBasedEnums.SLAB
      ) {
        this.valueBasedGoldSlabRowData.push({
          id: '',
          slabTo: '',
          slabFrom: '',
          karatage: '22',
          multiplyingValue: '',
          rowId: '',
          totalFocWt: '',
          isActive: true
        });
        this.valueBasedGoldSlabGridApi.redrawRows();
      }
    } else {
      this.createvalueBasedStdGoldRowData();
      this.createvalueBasedSlabGoldRowData();
    }
    this.cdr.markForCheck();
  }
  createvalueBasedSlabGoldRowData(varinatDetails?: ValueBasedVariantDetails) {
    if (varinatDetails) {
      this.valueBasedGoldSlabRowData.push({
        id: varinatDetails.id ? varinatDetails.id : '',
        slabFrom: varinatDetails.slabFrom ? varinatDetails.slabFrom : '',
        slabTo: varinatDetails.slabTo ? varinatDetails.slabTo : '',
        karatage: varinatDetails.karatage ? varinatDetails.karatage : '',
        totalFocWt: varinatDetails.totalFocWt ? varinatDetails.totalFocWt : '',
        multiplyingValue: varinatDetails.multiplyingValue
          ? varinatDetails.multiplyingValue
          : '',
        rowId: varinatDetails.rowId ? varinatDetails.rowId : '',
        isActive: varinatDetails.isActive ? varinatDetails.isActive : false,
        productGroupCount: varinatDetails.productGroupCount
          ? varinatDetails.productGroupCount
          : 0
      });
    } else {
      this.valueBasedGoldSlabRowData = [];
      this.valueBasedGoldSlabRowData.push({
        id: '',
        slabFrom: '',
        slabTo: '',
        karatage: '22',
        rowId: '',
        totalFocWt: '',
        multiplyingValue: '',
        isActive: true,
        productGroupCount: 0
      });
    }
    this.cdr.markForCheck();
  }

  createvalueBasedStdGoldRowData(varinatDetails?: ValueBasedVariantDetails) {
    if (varinatDetails) {
      this.valueBasedGoldStdRowData.push({
        id: varinatDetails.id ? varinatDetails.id : '',
        stdValue: varinatDetails.stdValue ? varinatDetails.stdValue : '',
        karatage: varinatDetails.karatage ? varinatDetails.karatage : '',
        formGroup: new FormGroup({
          isMultiple: new FormControl(
            varinatDetails.isMultiple ? varinatDetails.isMultiple : ''
          ),
          isSingle: new FormControl(
            varinatDetails.isSingle ? varinatDetails.isSingle : ''
          )
        }),
        productGroupCount: varinatDetails.productGroupCount
          ? varinatDetails.productGroupCount
          : 0,
        totalFocWt: varinatDetails.totalFocWt ? varinatDetails.totalFocWt : '',
        rowId: varinatDetails.rowId ? varinatDetails.rowId : '',
        productGroup: this.selectedSlabProductGroups,
        isActive: varinatDetails.isActive ? varinatDetails.isActive : false
      });
    } else {
      this.valueBasedGoldStdRowData = [];
      this.valueBasedGoldStdRowData.push({
        id: '',
        stdValue: '',
        karatage: '22',
        formGroup: new FormGroup({
          isMultiple: new FormControl(''),
          isSingle: new FormControl('')
        }),
        productGroup: [],
        rowId: '',
        totalFocWt: '',
        isActive: true,
        productGroupCount: 0
      });
    }
  }

  addAbove() {
    if (
      !this.schemeDetails?.isActive &&
      this.schemeDetails?.description !== ''
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.isAbove = true;
      this.isBelow = false;

      if (this.editMode) {
        this.editMode = false;

        this.valueBasedGoldSlabGridApi.stopEditing();
      } else {
        this.checkSlabValidation(this.valueBasedGoldSlabRowData);
        this.addData(this.valueBasedGoldSlabGridApi);
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
      !this.schemeDetails?.isActive &&
      this.schemeDetails?.description !== ''
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.isBelow = true;
      this.isAbove = false;
      if (this.editMode) {
        this.editMode = false;
        this.valueBasedGoldSlabGridApi.stopEditing();
      } else {
        this.checkSlabValidation(this.valueBasedGoldSlabRowData);
        this.addData(this.valueBasedGoldSlabGridApi);
      }
    }
  }
  addRow() {
    if (
      !this.schemeDetails?.isActive &&
      this.schemeDetails?.description !== ''
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.addRowData = true;
      if (this.editMode) {
        this.editMode = false;
        this.valueBasedGoldStdGridApi.stopEditing();
      } else {
        this.checkStandardValidation(this.valueBasedGoldStdRowData);

        this.selectedRowIndex = this.getAllRows().length;
        this.addData(this.valueBasedGoldStdGridApi);
      }
    }
  }

  checkStandardValidation(rowData) {
    if (!this.alldeleted) {
      //null check
      if (this.offerType === focSchemeBasedEnums.STANDARD) {
        for (const data of rowData) {
          if (
            data?.stdValue?.value === '' ||
            data?.karatage?.value === '' ||
            data?.totalFocWt?.value === '' ||
            data?.stdValue === '' ||
            data?.karatage === '' ||
            data?.totalFocWt === ''
          ) {
            this.valueEmpty = true;
            break;
          } else {
            this.valueEmpty = false;
          }

          if (
            data?.karatage?.isValid === true ||
            data?.karatage?.isValid === undefined
          ) {
            this.inValidKaratage = false;
          } else if (data?.karatage?.isValid === false) {
            this.inValidKaratage = true;
            break;
          }

          if (
            data?.totalFocWt?.isValid === true ||
            data?.totalFocWt?.isValid === undefined
          ) {
            this.inValidTotalFocWeight = false;
          } else if (data?.totalFocWt?.isValid === false) {
            this.inValidTotalFocWeight = true;
            break;
          }
          if (data?.id !== '') {
            if (data?.productGroupCount === 0) {
              this.productMappingError = true;
              break;
            } else {
              this.productMappingError = false;
            }
          } else {
            this.productMappingError = false;
          }
        }
      }

      this.duplicateStdValueError = false;
      this.errorStdValue = null;
      const stdValueMap = new Map<string, string>();
      let value;
      for (const data of rowData) {
        if (typeof data?.stdValue === 'object') {
          if (
            data?.stdValue?.value?.split('.')[1] === '00' ||
            data?.stdValue?.value?.split('.')[1] === '0'
          ) {
            value = data?.stdValue?.value?.split('.')[0];
          } else {
            value = data?.stdValue?.value;
          }
        } else {
          if (
            data?.stdValue?.value?.split('.')[1] === '00' ||
            data?.stdValue?.value?.split('.')[1] === '0'
          ) {
            value = data?.stdValue?.split('.')[0];
          } else {
            value = data?.stdValue;
          }
        }
        if (stdValueMap.has(value)) {
          this.duplicateStdValueError = true;
          this.errorStdValue =
            typeof data?.stdValue === 'object'
              ? data?.stdValue.value
              : data?.stdValue;
          break;
        } else {
          stdValueMap.set(
            value,

            value
          );
        }

        if (
          data?.stdValue?.value < 0.01 ||
          data?.stdValue < 0.01 ||
          data?.totalFocWt?.value < 0.01 ||
          data?.totalFocWt < 0.01
        ) {
          this.weightValidationError = true;
          break;
        } else {
          this.weightValidationError = false;
        }
      }
    }

    this.showErrorPopUp();
  }

  checkSlabValidation(rowData) {
    let currentRowData;
    let prevRowData;
    let nextRowData;
    currentRowData = rowData[this.selectedRowIndex];
    prevRowData =
      this.selectedRowIndex > 0 &&
      this.getParticularRow(rowData, this.selectedRowIndex - 1, 'prev')
        ? this.getParticularRow(rowData, this.selectedRowIndex - 1, 'prev')
        : null;
    nextRowData =
      this.selectedRowIndex < rowData.length - 1 &&
      this.getParticularRow(rowData, this.selectedRowIndex + 1, 'next')
        ? this.getParticularRow(rowData, this.selectedRowIndex + 1, 'next')
        : null;
    // prevRowData = rowData[this.selectedRowIndex - 1];
    // nextRowData = rowData[this.selectedRowIndex + 1];

    //null check

    if (this.offerType === focSchemeBasedEnums.SLAB) {
      for (const data of rowData) {
        if (
          data?.slabFrom?.value === '' ||
          data?.slabTo?.value === '' ||
          data?.stdValue?.value === '' ||
          data?.karatage?.value === '' ||
          data?.totalFocWt?.value === '' ||
          data?.karatage === '' ||
          data?.totalFocWt === '' ||
          data?.slabFrom === '' ||
          data?.slabTo === '' ||
          data?.stdValue === ''
        ) {
          this.valueEmpty = true;
          break;
        } else {
          this.valueEmpty = false;
        }
        if (
          data?.karatage?.isValid === true ||
          data?.karatage?.isValid === undefined
        ) {
          this.inValidKaratage = false;
        } else if (data?.karatage?.isValid === false) {
          this.inValidKaratage = true;
          break;
        }

        if (data?.id !== '') {
          if (
            this.selectedSlabProductGroups &&
            this.selectedSlabProductGroups.length === 0
          ) {
            this.productMappingError = true;
            break;
          } else {
            this.productMappingError = false;
          }
        } else {
          this.productMappingError = false;
        }

        if (
          data?.totalFocWt?.isValid === true ||
          data?.totalFocWt?.isValid === undefined
        ) {
          this.inValidTotalFocWeight = false;
        } else if (data?.totalFocWt?.isValid === false) {
          this.inValidTotalFocWeight = true;
          break;
        }

        if (data?.totalFocWt?.value < 0.01 || data?.totalFocWt < 0.01) {
          this.weightValidationError = true;
        } else {
          this.weightValidationError = false;
        }
      }
    }

    if (!this.valueEmpty) {
      if (
        Number(
          typeof currentRowData?.slabTo === 'object'
            ? currentRowData?.slabTo.value
            : currentRowData?.slabTo
        ) <=
        Number(
          typeof currentRowData?.slabFrom === 'object'
            ? currentRowData?.slabFrom.value
            : currentRowData?.slabFrom
        )
      ) {
        this.slabToLessThanSlabFrom = true;
      } else {
        this.slabToLessThanSlabFrom = false;
      }
    }
    // current row data less than previous standard value
    if (!this.valueEmpty) {
      if (
        Number(
          typeof currentRowData?.slabFrom === 'object'
            ? currentRowData?.slabFrom?.value
            : currentRowData?.slabFrom
        ) <=
        Number(
          typeof prevRowData?.slabTo === 'object'
            ? prevRowData?.slabTo?.value
            : prevRowData?.slabTo
        )
      ) {
        this.currentSlabFromValueLessThanPreviousSlabTo = true;
      } else {
        this.currentSlabFromValueLessThanPreviousSlabTo = false;
      }
    }

    // greater than next standard value

    if (!this.valueEmpty) {
      if (
        Number(
          typeof currentRowData?.slabTo === 'object'
            ? currentRowData?.slabTo?.value
            : currentRowData?.slabTo
        ) >=
        Number(
          typeof nextRowData?.slabFrom === 'object'
            ? nextRowData?.slabFrom?.value
            : nextRowData?.slabFrom
        )
      ) {
        this.currentSlabToValueGreaterThanNextSlabFrom = true;
      } else {
        this.currentSlabToValueGreaterThanNextSlabFrom = false;
      }
    }
    this.showErrorPopUp();
  }

  showErrorPopUp() {
    if (
      this.inValidKaratage ||
      this.inValidTotalFocWeight ||
      this.valueEmpty ||
      this.currentStdValueGreaterThanNext ||
      this.currentStdValueLessThanPrevious ||
      this.currentSlabFromValueLessThanPreviousSlabTo ||
      this.currentSlabToValueGreaterThanNextSlabFrom ||
      this.duplicateStdValueError ||
      this.slabToLessThanSlabFrom ||
      this.productMappingError ||
      this.weightValidationError
    ) {
      this.hasError = true;
      let errorMessage;

      if (
        this.valueEmpty ||
        this.inValidTotalFocWeight ||
        this.inValidKaratage
      ) {
        errorMessage = this.errorMessageForNull;
      } else if (this.currentStdValueGreaterThanNext) {
        errorMessage = this.errorMessageForCurrentStdValueGreaterThanNext;
      } else if (this.currentStdValueLessThanPrevious) {
        errorMessage = this.errorMessageForCurrentStdValueLessThanPrevious;
      } else if (this.currentSlabFromValueLessThanPreviousSlabTo) {
        errorMessage = this
          .errorMessageForCurrentSlabFromValueLessThanPreviousSlabTo;
      } else if (this.currentSlabToValueGreaterThanNextSlabFrom) {
        errorMessage = this
          .errorMessageForcurrentSlabToValueGreaterThanNextSlabFrom;
      } else if (this.slabToLessThanSlabFrom) {
        errorMessage = this.errorMessageForSlabToLessThanSlabFrom;
      } else if (this.duplicateStdValueError) {
        errorMessage =
          this.duplicateStdValueErrorMsg + ' ' + this.errorStdValue;
      } else if (this.productMappingError) {
        errorMessage = this.productMappingErrorMessage;
      } else if (this.weightValidationError) {
        errorMessage = this.weightValidationErrorMessage;
      }
      if (this.alertPopUpOpen === false) {
        this.alertPopUpOpen = true;
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.ERROR,
            message: errorMessage
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            this.alertPopUpOpen = false;
            this.isAbove = false;
            this.isBelow = false;
          });
      }
    } else {
      this.hasError = false;
    }
  }
  rowEditingStarted(event) {
    this.editMode = true;
  }
  addData(api) {
    if (this.offerType === focSchemeBasedEnums.STANDARD) {
      if (this.addRowData === true) {
        if (
          this.valueEmpty === false &&
          this.inValidKaratage === false &&
          this.inValidTotalFocWeight === false &&
          this.duplicateStdValueError === false &&
          this.productMappingError === false &&
          this.weightValidationError === false
        ) {
          this.valueBasedGoldStdRowData.splice(this.selectedRowIndex + 1, 0, {
            id: '',
            stdValue: '',
            karatage: '22',
            formGroup: new FormGroup({
              isMultiple: new FormControl(''),
              isSingle: new FormControl('')
            }),
            productGroup: [],
            rowId: '',
            totalFocWt: '',
            isActive: true,
            productGroupCount: 0
          });

          this.valueBasedGoldStdGridApi.setRowData(
            this.valueBasedGoldStdRowData
          );
          this.addRowData = false;
        }
      }
    } else if (this.offerType === focSchemeBasedEnums.SLAB) {
      if (this.isAbove === true) {
        if (this.valueBasedGoldSlabRowData.length > 1) {
          if (
            this.valueEmpty === false &&
            this.inValidKaratage === false &&
            this.inValidTotalFocWeight === false &&
            this.currentSlabFromValueLessThanPreviousSlabTo === false &&
            this.currentSlabToValueGreaterThanNextSlabFrom === false &&
            this.slabToLessThanSlabFrom === false &&
            this.productMappingError === false &&
            this.weightValidationError === false
          ) {
            this.valueBasedGoldSlabRowData.splice(this.selectedRowIndex, 0, {
              id: '',
              slabFrom: '',
              slabTo: '',
              karatage: '22',
              multiplyingValue: '',
              rowId: '',
              totalFocWt: '',
              isActive: true,
              productGroupCount: 0
            });

            this.valueBasedGoldSlabGridApi.setRowData(
              this.valueBasedGoldSlabRowData
            );
            this.disableValueBasedButton = true;
          }
        } else if (this.valueBasedGoldSlabRowData.length === 1) {
          if (
            this.valueEmpty === false &&
            this.slabToLessThanSlabFrom === false &&
            this.inValidKaratage === false &&
            this.inValidTotalFocWeight === false &&
            this.productMappingError === false &&
            this.weightValidationError === false
          ) {
            this.valueBasedGoldSlabRowData.splice(this.selectedRowIndex, 0, {
              id: '',
              slabFrom: '',
              slabTo: '',
              karatage: '22',

              multiplyingValue: '',
              rowId: '',
              totalFocWt: '',
              isActive: true,
              productGroupCount: 0
            });

            this.valueBasedGoldSlabGridApi.setRowData(
              this.valueBasedGoldSlabRowData
            );
            this.disableValueBasedButton = true;
          }
        }
        this.isAbove = false;
      } else if (this.isBelow === true) {
        if (this.valueBasedGoldSlabRowData.length > 1) {
          if (
            this.inValidKaratage === false &&
            this.inValidTotalFocWeight === false &&
            this.valueEmpty === false &&
            this.currentSlabFromValueLessThanPreviousSlabTo === false &&
            this.currentSlabToValueGreaterThanNextSlabFrom === false &&
            this.slabToLessThanSlabFrom === false &&
            this.productMappingError === false &&
            this.weightValidationError === false
          ) {
            this.valueBasedGoldSlabRowData.splice(
              this.selectedRowIndex + 1,
              0,
              {
                id: '',
                slabFrom: '',
                slabTo: '',
                karatage: '22',
                multiplyingValue: '',
                rowId: '',
                totalFocWt: '',
                isActive: true,
                productGroupCount: 0
              }
            );

            this.valueBasedGoldSlabGridApi.setRowData(
              this.valueBasedGoldSlabRowData
            );
            this.disableValueBasedButton = true;
          }
        } else if (this.valueBasedGoldSlabRowData.length === 1) {
          if (
            this.inValidKaratage === false &&
            this.inValidTotalFocWeight === false &&
            this.valueEmpty === false &&
            this.slabToLessThanSlabFrom === false &&
            this.productMappingError === false &&
            this.weightValidationError === false
          ) {
            this.valueBasedGoldSlabRowData.splice(
              this.selectedRowIndex + 1,
              0,
              {
                id: '',
                slabFrom: '',
                slabTo: '',
                karatage: '22',

                multiplyingValue: '',
                rowId: '',
                totalFocWt: '',
                isActive: true,
                productGroupCount: 0
              }
            );

            this.valueBasedGoldSlabGridApi.setRowData(
              this.valueBasedGoldSlabRowData
            );
            this.disableValueBasedButton = true;
          }
        }
        this.isBelow = false;
      }
    }
    this.cdr.markForCheck();
  }
  onSelectionChanged(event) {
    this.alldeleted = false;
    if (this.valueBasedGoldStdGridApi === event.api) {
      if (this.valueBasedGoldStdGridApi.getSelectedNodes().length) {
        this.disableValueBasedButton = false;
        this.selectedRowIndex = this.valueBasedGoldStdGridApi.getSelectedNodes()[0].rowIndex;
      } else {
        this.disableValueBasedButton = true;
      }
    }
    if (this.valueBasedGoldSlabGridApi === event.api) {
      if (this.valueBasedGoldSlabGridApi.getSelectedNodes().length) {
        this.disableValueBasedButton = false;
        this.selectedRowIndex = this.valueBasedGoldSlabGridApi.getSelectedNodes()[0].rowIndex;
      } else {
        this.disableValueBasedButton = true;
      }
    }
  }

  onDropDownChange(event) {
    this.weightValidationError = false;
    this.discountType = event.value;
    if (event.value === focSchemeBasedEnums.STANDARD) {
      this.offerType = focSchemeBasedEnums.STANDARD;
    } else {
      this.offerType = focSchemeBasedEnums.SLAB;
      this.isSingle = this.varinatDetails[0]?.isSingle
        ? this.varinatDetails[0]?.isSingle
        : false;
    }
    this.loadFocTypeState.emit({
      tabName: tabTypeEnums.VALUE_BASED_GOLD_COIN,
      focType: event.value
    });
    this.loadVariantDetails.emit({
      category: this.category,
      itemType: this.itemType,
      offerType: this.offerType
    });
    this.deleteSchemeDetails = [];
    this.cdr.markForCheck();
  }
  onFocEligibilityDropDownChange(event) {
    this.dropDownForm.get('focEligibility').patchValue(event.value);
    this.focEligibility = event.value;
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent
    };
  }

  valueBasedGoldStdGridReady(params: GridReadyEvent) {
    this.valueBasedGoldStdGridApi = params.api;
    this.valueBasedGoldStdGridApi.setRowData(this.valueBasedGoldStdRowData);
  }

  valueBasedGoldSlabGridReday(params: GridReadyEvent) {
    this.valueBasedGoldSlabGridApi = params.api;
    this.valueBasedGoldSlabGridApi.setRowData(this.valueBasedGoldSlabRowData);
  }

  getStdContext() {
    return {
      validators: {
        stdValue: [],
        karatage: [this.fieldValidatorService.karatField('Karatage')],
        totalFocWt: []
      },
      componentParent: this.focValueBasedGoldComponent,
      focusOn: 'stdValue'
    };
  }

  getSlabContext() {
    return {
      validators: {
        stdValue: [],
        karatage: [this.fieldValidatorService.karatField('Karatage')],
        totalFocWt: []
      },
      componentParent: this.focValueBasedGoldComponent,
      focusOn: 'slabFrom'
    };
  }
  rowValueChanged(changeEvent) {
    if (this.offerType === focSchemeBasedEnums.STANDARD) {
      this.checkStandardValidation(this.valueBasedGoldStdRowData);
      this.addData(this.valueBasedGoldStdGridApi);
    } else if (this.offerType === focSchemeBasedEnums.SLAB) {
      this.checkSlabValidation(this.valueBasedGoldSlabRowData);
      this.addData(this.valueBasedGoldSlabRowData);
    }
    this.editMode = false;
  }

  getAllRows() {
    const rowData = [];
    if (this.offerType === focSchemeBasedEnums.STANDARD) {
      this.valueBasedGoldStdGridApi.forEachNode(node =>
        rowData.push(node.data)
      );
    } else if (this.offerType === focSchemeBasedEnums.SLAB) {
      this.valueBasedGoldSlabGridApi.forEachNode(node =>
        rowData.push(node.data)
      );
    }

    return rowData;
  }

  getAllActiveRows() {
    const rowData = [];
    this.valueBasedGoldSlabGridApi?.forEachNode(node => {
      if (node.data.isActive) {
        rowData.push(node.data);
      }
    });
    return rowData;
  }

  getAllActiveRowsFromGrid() {
    const rowData = [];
    this.varinatDetails.forEach(element => {
      if (element.isActive) rowData.push(element);
    });
    return rowData;
  }

  getSpecificRowData(index) {
    const rowData = [];
    this.valueBasedGoldSlabGridApi.forEachNode(node => {
      if (node.rowIndex === index) {
        rowData.push(node.data);
      }
    });
    return rowData;
  }

  openConfirmDialogForDelete(params) {
    if (
      !this.schemeDetails?.isActive &&
      this.schemeDetails?.description !== ''
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.clubbingDiscounts.deleteRuleMsg'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.disableValueBasedButton = true;
            this.editMode = false;
            this.i = 1;
            if (this.offerType === focSchemeBasedEnums.STANDARD) {
              if (params.id !== '') {
                this.deleteSchemes.emit({
                  addSchemeDetails: [],
                  updateSchemeDetails: [],
                  deleteSchemeDetails: [params.id]
                });
              } else {
                this.valueBasedGoldStdGridApi.applyTransaction({
                  remove: [
                    this.valueBasedGoldStdGridApi.getRowNode(params.rowIndex)
                      .data
                  ]
                });
                this.valueBasedGoldStdGridApi.redrawRows();
              }

              if (this.getAllRows().length === 0) {
                this.alldeleted = true;

                this.valueBasedGoldStdRowData = [
                  {
                    id: '',
                    stdValue: '',
                    karatage: '22',
                    formGroup: new FormGroup({
                      isMultiple: new FormControl(''),
                      isSingle: new FormControl('')
                    }),
                    productGroup: [],
                    rowId: '',
                    totalFocWt: '',
                    isActive: true,
                    productGroupCount: 0
                  }
                ];

                this.valueBasedGoldStdGridApi.redrawRows();
              } else {
                this.selectedRowIndex = 0;
                this.valueBasedGoldStdRowData = this.getAllRows().map(ob => ({
                  ...ob,
                  rowId: (this.i++).toString()
                }));
              }
            } else if (this.offerType === focSchemeBasedEnums.SLAB) {
              if (params.id !== '') {
                if (
                  this.selectedSlabProductGroups &&
                  this.selectedSlabProductGroups.length === 0
                ) {
                  this.deleteSchemes.emit({
                    addSchemeDetails: [],
                    updateSchemeDetails: [],
                    deleteSchemeDetails: [params.id]
                  });
                } else {
                  this.showErrorPopUp();
                }
              } else {
                const specificRowData = this.getSpecificRowData(
                  params.rowIndex
                )[0];
                console.log('weightBasedGoldSlabGridApi', specificRowData);
                this.valueBasedGoldSlabGridApi.applyTransaction({
                  remove: [
                    this.valueBasedGoldSlabGridApi.getRowNode(params.rowIndex)
                      ?.data
                      ? this.valueBasedGoldSlabGridApi.getRowNode(
                          params.rowIndex
                        )?.data
                      : specificRowData
                      ? specificRowData
                      : {}
                  ]
                });
                this.valueBasedGoldSlabGridApi.redrawRows();
              }
              if (this.getAllRows().length === 0) {
                this.alldeleted = true;
              }
              if (this.getAllActiveRows().length === 0) {
                const resAdd = this.valueBasedGoldSlabGridApi.applyTransaction({
                  add: [
                    {
                      id: '',
                      slabTo: '',
                      slabFrom: '',
                      karatage: '22',
                      multiplyingValue: '',
                      rowId: '',
                      totalFocWt: '',
                      isActive: true,
                      productGroupCount: 0
                    }
                  ]
                });
                this.valueBasedGoldSlabGridApi.redrawRows({
                  rowNodes: resAdd.add
                });
              } else {
                this.selectedRowIndex = 0;
                this.valueBasedGoldSlabRowData = this.getAllRows().map(ob => ({
                  ...ob,
                  rowId: (this.i++).toString()
                }));
              }
            } else {
              this.valueBasedGoldSlabGridApi.applyTransaction({
                remove: [
                  this.valueBasedGoldSlabGridApi.getRowNode(params.rowIndex)
                    .data
                ]
              });
              this.valueBasedGoldStdGridApi.redrawRows();
            }
            if (this.getAllRows().length === 0) {
              this.alldeleted = true;

              this.valueBasedGoldSlabRowData = [
                {
                  id: '',
                  slabTo: '',
                  slabFrom: '',
                  karatage: '22',
                  multiplyingValue: '',
                  rowId: '',
                  totalFocWt: '',
                  isActive: true,
                  productGroupCount: 0
                }
              ];

              this.valueBasedGoldSlabGridApi.redrawRows();
            } else {
              this.selectedRowIndex = 0;
              this.valueBasedGoldSlabRowData = this.getAllRows().map(ob => ({
                ...ob,
                rowId: (this.i++).toString()
              }));
            }
          }
        });
    }
  }

  productGroupMapping(params, rowIndex) {
    this.rowIndex = rowIndex;
    this.params = params;

    this.isLoading = true;
    if (this.offerType === focSchemeBasedEnums.STANDARD) {
      this.loadProductGroups.emit({
        category: this.category,
        schemeDetailsId: params.id,

        masterId: this.configId
      });
    } else if (this.offerType === focSchemeBasedEnums.SLAB) {
      this.loadProductGroups.emit({
        masterId: this.configId,
        itemType: this.itemType,
        category: this.category
      });
    }
  }

  openStandardProductGroupPopup(params, rowIndex) {
    if (
      !this.schemeDetails?.isActive &&
      this.schemeDetails?.description !== ''
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.cdr.markForCheck();

      this.isLoading = false;

      const addedProductGroups = [];
      const removeProductGroups = [];

      this.productGroupMappingServiceAbstraction
        .open({
          selectedProductGroup:
            this.mappedProductGroups !== null ? this.mappedProductGroups : []
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.popUpOpen = false;
          if (res) {
            if (res.type === 'apply') {
              for (const removed of res.data.removeProductGroups) {
                if (removed?.uuid) removeProductGroups.push(removed.uuid);
              }

              res.data.selectedProductGroups.forEach(productGroups => {
                if (
                  this.mappedProductGroups
                    .map(data => data.id)
                    .indexOf(productGroups.id) === -1
                ) {
                  addedProductGroups.push(productGroups.id);
                }
              });
              this.mappedProductGroups = res.data.selectedProductGroups;

              if (this.offerType === focSchemeBasedEnums.STANDARD) {
                if (rowIndex !== null) {
                  const rowNode = this.valueBasedGoldStdGridApi.getRowNode(
                    rowIndex
                  );

                  rowNode.data.productGroup = this.mappedProductGroups;
                  rowNode.data.productGroupCount = this.mappedProductGroups.length;
                  const res1 = this.valueBasedGoldStdGridApi.applyTransaction({
                    update: [rowNode.data]
                  });
                  this.valueBasedGoldStdGridApi.redrawRows({
                    rowNodes: res1.update
                  });
                }
              }
              const saveProductGroup = {
                masterId: this.configId,
                schemeDetailsId: params.id,
                category: this.category,
                itemType: this.itemType,
                addProducts: addedProductGroups,
                removeProducts: removeProductGroups,
                catergory: this.category
              };
              if (
                saveProductGroup.addProducts.length > 0 ||
                saveProductGroup.removeProducts.length > 0
              ) {
                this.mapProductGroup.emit(saveProductGroup);
              }
            }
          }
        });
    }
  }
  openSlabProductGroupMapping() {
    if (
      !this.schemeDetails?.isActive &&
      this.schemeDetails?.description !== ''
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.loadProductGroups.emit({
        masterId: this.configId,
        itemType: this.itemType,
        category: this.category
      });
      this.openPGPopupFlag = true;
    }
  }

  @HostListener('keydown', ['$event'])
  private onKeydown(event: KeyboardEvent): void {
    const focusedCell = this.valueBasedGoldStdGridApi?.getFocusedCell();
    const field = focusedCell?.column?.getColDef()?.field;
    const rowIndex = focusedCell?.rowIndex;
    const rowNode = this.valueBasedGoldStdGridApi?.getRowNode(
      rowIndex?.toString()
    );

    if (event.code === 'Space') {
      if (field === 'isMultiple') {
        rowNode.data.formGroup
          .get('isMultiple')
          .patchValue(!rowNode.data.formGroup.get('isMultiple').value);
      }
      if (field === 'isSingle') {
        rowNode.data.formGroup
          .get('isSingle')
          .patchValue(!rowNode.data.formGroup.get('isSingle').value);
      }
    }
  }
  showFocEligibilityErrorPopUp() {
    if (this.focEligibilityEmptyError) {
      let errorMessage;
      if (this.focEligibilityEmptyError) {
        errorMessage = this.focEligibilityEmptyErrorMessg;
      }

      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.ERROR,
          message: errorMessage
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          this.focEligibilityEmptyError = false;
        });
    }
  }
  save() {
    if (
      !this.schemeDetails?.isActive &&
      this.schemeDetails?.description !== ''
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.i = 1;

      if (this.offerType === focSchemeBasedEnums.STANDARD) {
        this.addRowData = false;
        this.valueBasedGoldStdGridApi.stopEditing();
        this.checkStandardValidation(this.valueBasedGoldStdRowData);
      } else if (this.offerType === focSchemeBasedEnums.SLAB) {
        this.valueBasedGoldSlabGridApi.stopEditing();
        this.checkSlabValidation(this.valueBasedGoldSlabRowData);
      }
      if (!this.hasError) {
        if (this.focEligibility === null || this.focEligibility === undefined) {
          this.focEligibilityEmptyError = true;
          this.showFocEligibilityErrorPopUp();
        } else {
          this.focEligibilityEmptyError = false;
          const array = this.getAllRows().map(ob => ({
            ...ob,
            rowId: (this.i++).toString()
          }));
          this.saveVariantDetails.emit(this.prepareResponse(array));
        }
      }
    }
  }
  prepareResponse(array: any[]) {
    const newData = array.filter(data => data.id === '');
    const updatedData = array.filter(data => data.id !== '');
    const addSchemeDetails: AddSchemeDetails[] = [];
    const updateSchemeDetails: UpdateSchemeDetails[] = [];
    if (this.offerType === focSchemeBasedEnums.SLAB) {
      for (const value of newData) {
        addSchemeDetails.push({
          category: this.category,
          focEligibility: this.focEligibility,
          fromSaleValue:
            typeof value.slabFrom === 'object'
              ? value.slabFrom?.value
              : value?.slabFrom,
          toSaleValue:
            typeof value.slabTo === 'object'
              ? value.slabTo?.value
              : value?.slabTo,
          isActive: value.isActive ? value.isActive : false,
          isMultiple:
            value?.formGroup?.get('isMultiple').value !== ''
              ? value?.formGroup?.get('isMultiple').value
              : false,
          isSingle: this.isSingle,
          itemCode:
            typeof value?.itemCode === 'object'
              ? value?.itemCode?.value
              : value?.itemCode,
          itemType: this.itemType,
          karat:
            typeof value.karatage === 'object'
              ? value.karatage.value
              : value.karatage,
          offerType: this.offerType,
          quantity: value?.qty?.value
            ? value?.qty?.value
            : value?.qty
            ? value.qty
            : 0,
          rowId: value.rowId ? value.rowId : '',
          stdSaleValue:
            typeof value?.multiplyingValue === 'object'
              ? value?.multiplyingValue?.value
              : value?.multiplyingValue,
          weight:
            typeof value.totalFocWt === 'object'
              ? value.totalFocWt?.value
              : value.totalFocWt
        });
      }

      for (const value of updatedData) {
        updateSchemeDetails.push({
          category: this.category,
          focEligibility: this.focEligibility,
          fromSaleValue:
            typeof value.slabFrom === 'object'
              ? value.slabFrom?.value
              : value?.slabFrom,
          toSaleValue:
            typeof value.slabTo === 'object'
              ? value.slabTo?.value
              : value?.slabTo,
          isActive: value.isActive ? value.isActive : false,
          isMultiple:
            value?.formGroup?.get('isMultiple').value !== ''
              ? value?.formGroup?.get('isMultiple').value
              : false,
          isSingle: this.isSingle,
          itemCode:
            typeof value?.itemCode === 'object'
              ? value?.itemCode?.value
              : value?.itemCode,
          itemType: this.itemType,
          karat:
            typeof value.karatage === 'object'
              ? value.karatage?.value
              : value.karatage,
          offerType: this.offerType,
          quantity: value?.qty?.value
            ? value?.qty?.value
            : value?.qty
            ? value.qty
            : 0,
          rowId: value.rowId ? value.rowId : '',
          stdSaleValue:
            typeof value?.multiplyingValue === 'object'
              ? value?.multiplyingValue?.value
              : value?.multiplyingValue,
          weight:
            typeof value.totalFocWt === 'object'
              ? value.totalFocWt?.value
              : value.totalFocWt,
          schemDetailsId: value.id ? value.id : ''
        });
      }

      return {
        addSchemeDetails: this.alldeleted ? [] : addSchemeDetails,
        updateSchemeDetails: this.alldeleted ? [] : updateSchemeDetails,
        deleteSchemeDetails: [],
        discountType: this.offerType
      };
    } else {
      for (const value of newData) {
        addSchemeDetails.push({
          category: this.category,
          focEligibility: this.focEligibility,
          fromSaleValue:
            typeof value.slabFrom === 'object'
              ? value.slabFrom?.value
              : value?.slabFrom,
          toSaleValue:
            typeof value.slabTo === 'object'
              ? value.slabTo?.value
              : value?.slabTo,
          isActive: value.isActive ? value.isActive : false,
          isMultiple:
            value?.formGroup?.get('isMultiple').value !== ''
              ? value?.formGroup?.get('isMultiple').value
              : false,
          isSingle:
            value?.formGroup?.get('isSingle').value !== ''
              ? value?.formGroup?.get('isSingle').value
              : false,
          itemCode:
            typeof value?.itemCode === 'object'
              ? value?.itemCode?.value
              : value?.itemCode,
          itemType: this.itemType,
          karat:
            typeof value.karatage === 'object'
              ? value.karatage.value
              : value.karatage,
          offerType: this.offerType,
          quantity: value?.qty?.value
            ? value?.qty?.value
            : value?.qty
            ? value.qty
            : 0,
          rowId: value.rowId ? value.rowId : '',
          stdSaleValue:
            typeof value?.stdValue === 'object'
              ? value?.stdValue?.value
              : value?.stdValue,

          weight:
            typeof value.totalFocWt === 'object'
              ? value.totalFocWt?.value
              : value.totalFocWt
        });
      }

      for (const value of updatedData) {
        updateSchemeDetails.push({
          category: this.category,
          focEligibility: this.focEligibility,
          fromSaleValue:
            typeof value.slabFrom === 'object'
              ? value.slabFrom?.value
              : value.slabFrom,
          toSaleValue:
            typeof value.slabTo === 'object'
              ? value.slabTo?.value
              : value.slabTo,
          isActive: value.isActive ? value.isActive : false,
          isMultiple:
            value?.formGroup?.get('isMultiple').value !== ''
              ? value?.formGroup?.get('isMultiple').value
              : false,
          isSingle:
            value?.formGroup?.get('isSingle').value !== ''
              ? value?.formGroup?.get('isSingle').value
              : false,
          itemCode:
            typeof value.itemCode === 'object'
              ? value.itemCode?.value
              : value.itemCode,
          itemType: this.itemType,
          karat:
            typeof value.karatage === 'object'
              ? value.karatage?.value
              : value.karatage,
          offerType: this.offerType,
          quantity: value?.qty?.value
            ? value?.qty?.value
            : value?.qty
            ? value.qty
            : 0,
          rowId: value.rowId ? value.rowId : '',
          stdSaleValue:
            typeof value?.stdValue === 'object'
              ? value?.stdValue?.value
              : value?.stdValue,

          weight:
            typeof value.totalFocWt === 'object'
              ? value.totalFocWt?.value
              : value.totalFocWt,
          schemDetailsId: value.id ? value.id : ''
        });
      }
      return {
        addSchemeDetails: this.alldeleted ? [] : addSchemeDetails,
        updateSchemeDetails: this.alldeleted ? [] : updateSchemeDetails,
        deleteSchemeDetails: [],
        discountType: this.offerType
      };
    }
  }
  changeEvent(checked) {
    this.isSingle = checked;
  }

  onGridStdSizeChanged() {
    if (window.innerWidth >= 991) {
      this.valueBasedGoldStdGridApi.sizeColumnsToFit();
    }
  }
  onGridSlabSizeChanged() {
    if (window.innerWidth >= 991) {
      this.valueBasedGoldSlabGridApi.sizeColumnsToFit();
    }
  }

  // open product group popup after data load
  openPGPopup() {
    const addedProductGroups = [];
    const removeProductGroups = [];

    this.productGroupMappingServiceAbstraction
      .open({
        selectedProductGroup:
          this.mappedProductGroups !== null ? this.mappedProductGroups : []
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          if (res.type === 'apply') {
            if (
              !(
                res.data.addedProductGroups.length === 0 &&
                res.data.removeProductGroups.length === 0
              )
            ) {
              this.selectedSlabProductGroups = this.selectedSlabProductGroups.concat(
                res.data.addedProductGroups
              );

              for (const added of res.data.addedProductGroups) {
                addedProductGroups.push(added.id);
              }
              for (const removed of res.data.removeProductGroups) {
                if (removed?.uuid) removeProductGroups.push(removed.uuid);
              }
            }

            const saveProductGroup = {
              masterId: this.configId,
              category: this.category,
              itemType: this.itemType,
              addProducts: addedProductGroups,
              removeProducts: removeProductGroups,
              catergory: this.category
            };
            this.mapProductGroup.emit(saveProductGroup);
          }
        }
      });
  }

  // get active previous and next rowa for slab validation
  getParticularRow(rowData, index, mode) {
    console.log('rowId', rowData, index, mode);
    let totalNoOfRows = rowData.length;
    if (index >= 0 && index <= totalNoOfRows - 1 && rowData[index].isActive) {
      return rowData[index];
    } else {
      if (index >= 0 && index <= totalNoOfRows - 1) {
        if (mode === 'next') {
          this.getParticularRow(rowData, index + 1, mode);
        } else if (mode === 'prev') {
          this.getParticularRow(rowData, index - 1, mode);
        }
      }
    }
    return null;
  }

  // refreshing grid for active inactive changes
  selectionChange(id, checked, rowData) {
    if (this.offerType === focSchemeBasedEnums.SLAB) {
      let specificRowData = [];
      if (id) {
        specificRowData = this.valueBasedGoldSlabRowData.filter(
          data => data.id === id
        );
      } else {
        specificRowData = this.valueBasedGoldSlabRowData.filter(
          data =>
            JSON.stringify(data.slabFrom) === JSON.stringify(rowData.slabFrom)
        );
      }
      specificRowData[0].isActive = checked;
      this.valueBasedGoldSlabGridApi.redrawRows();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.popUpOpen = false;
    this.dropDownForm.reset();
  }
}
