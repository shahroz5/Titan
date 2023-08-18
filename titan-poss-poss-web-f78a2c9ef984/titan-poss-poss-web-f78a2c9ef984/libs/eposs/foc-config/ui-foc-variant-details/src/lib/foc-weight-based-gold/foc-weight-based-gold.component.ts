import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy,
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
  DeleteRowComponent,
  EditItemComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  SaveVariantDetailsPayload,
  focSchemeBasedEnums,
  AddSchemeDetails,
  UpdateSchemeDetails,
  LoadVariantDetailsPayload,
  ProductGroupMappingServiceAbstraction,
  SaveProductGroup,
  LoadProductGroupPayload,
  WeightBasedVariantDetails,
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
  selector: 'poss-web-foc-weight-based-gold',
  templateUrl: './foc-weight-based-gold.component.html',
  styleUrls: ['./foc-weight-based-gold.component.scss']
})
export class FocWeightBasedGoldComponent
  implements OnChanges, OnDestroy, OnInit {
  @Input() varinatDetails: WeightBasedVariantDetails[];
  @Input() category: string;
  @Input() itemType: string;
  @Input() selectedSlabProductGroups: ProductGroupMappingOption[];
  @Input() focTypeDetails: FocTypeState;
  @Output() loadFocTypeState = new EventEmitter<FocTypeRequestPaylaod>();
  @Output() loadProductGroups = new EventEmitter<LoadProductGroupPayload>();
  @Output() saveVariantDetails = new EventEmitter<SaveVariantDetailsPayload>();
  @Output() mapProductGroup = new EventEmitter<SaveProductGroup>();
  @Output() loadVariantDetails = new EventEmitter<LoadVariantDetailsPayload>();
  @Output() deleteSchemes = new EventEmitter<SaveVariantDetailsPayload>();
  @Input() selectedGroups: Observable<any>;
  @Input() schemeDetails: SchemeDetails;
  focWeightBasedGoldComponent: FocWeightBasedGoldComponent = this;
  offerType = focSchemeBasedEnums.STANDARD;
  selectedRowIndex = 0;
  addRowData = false;
  mappedProducts: ProductGroupMappingOption[] = [];
  i = 1;
  configId: string;

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

  weightBasedGoldStdColDefs;
  weightBasedGoldSlabColDefs;

  hasSelectionChange: boolean;
  dropDownForm: FormGroup;
  destroy$ = new Subject<null>();
  selectedTab = 0;
  selectedRadioOptions = 'gold';
  selectedDiscountType: string;
  weightBasedGoldStdGridApi: GridApi;
  weightBasedGoldSlabGridApi: GridApi;
  domLayout = 'autoHeight';
  colDefs = [];
  weightBasedGoldStdRowData: GoldStdRowData[] = [];
  weightBasedGoldSlabRowData: GoldSlabRowData[] = [];
  disableweightBasedButton = true;
  editMode;
  deleteSchemeDetails = [];
  params: any;
  rowIndex: string;

  popUpOpen = false;
  isLoading = false;
  mappedProductGroups: ProductGroupMappingOption[] = [];
  enableButton = true;
  focEligibility = 'GROSS_WEIGHT';
  duplicateStdValueError = false;
  errorStdValue: any;
  duplicateStdValueErrorMsg: any;
  focEligibilityEmptyError: boolean;
  focEligibilityEmptyErrorMessg: string;
  productMappingError = false;
  productMappingErrorMessage: string;

  focTypeArray: SelectDropDownOption[] = [];
  focEligibilityArray: SelectDropDownOption[] = [];
  alertPopUpOpen = false;
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
    this.offerType = this.focTypeDetails.weightBasedGoldCoin;
    this.dropDownForm = new FormGroup({
      discountType: new FormControl(this.focTypeDetails.weightBasedGoldCoin),
      focEligibility: new FormControl(focSchemeBasedEnums.GROSS_WEIGHT)
    });
    this.isSingle = this.varinatDetails[0]?.isSingle
      ? this.varinatDetails[0]?.isSingle
      : false;
    this.translate
      .get([
        'pw.focConfiguration.stdWeight',
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
        'pw.focConfiguration.grossWeight',
        'pw.focConfiguration.NetWeight',

        'pw.focConfiguration.weightValidationErrorMessage'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.weightValidationErrorMessage =
          translatedMessages[
            'pw.focConfiguration.weightValidationErrorMessage'
          ];
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
            value: focSchemeBasedEnums.GROSS_WEIGHT,
            description: translatedMessages['pw.focConfiguration.grossWeight']
          },

          {
            value: focSchemeBasedEnums.NET_WEIGHT,
            description: translatedMessages['pw.focConfiguration.NetWeight']
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
        this.weightBasedGoldStdColDefs = [
          {
            headerName: translatedMessages['pw.focConfiguration.stdWeight'],
            field: 'stdValue',
            width: 120,
            minWidth: 120,
            flex: 1,

            suppressMovable: true,
            suppressSizeToFit: true,
            editable: true,
            cellEditor: 'inputValidator',
            isWeight: true,
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
            flex: 1,

            suppressMovable: true,
            suppressSizeToFit: true,
            editable: true,
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
            flex: 1,

            suppressMovable: true,
            suppressSizeToFit: true,
            editable: true,
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

            suppressSizeToFit: true,
            suppressMovable: true,
            cellRendererFramework: CheckboxGridCellComponent
          },
          {
            headerName:
              translatedMessages['pw.focConfiguration.productGroupMap'],
            field: 'productGroupMap',
            width: 150,
            minWidth: 150,
            flex: 1,

            suppressMovable: true,
            suppressSizeToFit: true,
            cellRendererFramework: ProductMappingCountComponent
          },
          {
            headerName: translatedMessages['pw.focConfiguration.isActive'],
            field: 'isActive',
            suppressMovable: true,
            cellRendererFramework: ToggleButtonCellComponent,
            width: 100,
            minWidth: 100,

            suppressSizeToFit: true,
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
            suppressRowClickSelection: 'true'
          }
        ];
      });

    this.translate
      .get([
        'pw.focConfiguration.slabFrom',
        'pw.focConfiguration.slabTo',
        'pw.focConfiguration.multiplyingWeight',
        'pw.focConfiguration.karatage',
        'pw.focConfiguration.totalFocWt',
        'pw.focConfiguration.isActive'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.weightBasedGoldSlabColDefs = [
          {
            checkboxSelection: params => params.data.isActive,
            width: 40,
            minWidth: 40,
            suppressMovable: true,
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName: translatedMessages['pw.focConfiguration.slabFrom'],
            field: 'slabFrom',
            editable: true,
            isWeight: true,
            cellEditor: 'inputValidator',

            width: 120,
            minWidth: 120,
            flex: 1,
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
            }
          },
          {
            headerName: translatedMessages['pw.focConfiguration.slabTo'],
            field: 'slabTo',
            editable: true,
            isWeight: true,
            suppressMovable: true,

            width: 120,
            minWidth: 120,
            flex: 1,
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
            }
          },
          {
            headerName:
              translatedMessages['pw.focConfiguration.multiplyingWeight'],
            field: 'multiplyingValue',
            editable: true,
            isAmount: true,
            suppressMovable: true,

            width: 120,
            minWidth: 120,
            flex: 1,
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
            }
          },
          {
            headerName: translatedMessages['pw.focConfiguration.karatage'],
            field: 'karatage',
            editable: true,

            width: 120,
            minWidth: 120,
            flex: 1,
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
            flex: 1,
            editable: true,
            isWeight: true,

            suppressMovable: true,
            suppressSizeToFit: true,
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
            flex: 1,
            suppressSizeToFit: true,
            suppressMovable: true,

            cellRendererFramework: ToggleButtonCellComponent
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
            suppressRowClickSelection: 'true'
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
    if (
      this.varinatDetails[0]?.focEligibility ===
      focSchemeBasedEnums.GROSS_WEIGHT
    ) {
      this.focEligibility = this.varinatDetails[0]?.focEligibility;
    } else if (
      this.varinatDetails[0]?.focEligibility === focSchemeBasedEnums.NET_WEIGHT
    ) {
      this.focEligibility = this.varinatDetails[0]?.focEligibility;
    } else {
      this.focEligibility = null;
    }

    this.dropDownForm?.get('focEligibility').patchValue(this.focEligibility);

    this.deleteSchemeDetails = [];
    if (this.varinatDetails.length) {
      this.enableButton = false;
      this.weightBasedGoldStdRowData = [];
      this.weightBasedGoldSlabRowData = [];
      for (const varinatDetailsItem of this.varinatDetails) {
        this.createweightBasedStdGoldForm(varinatDetailsItem);
        this.createweightBasedSlabGoldForm(varinatDetailsItem);
      }
      this.isSingle = this.varinatDetails[0]?.isSingle
        ? this.varinatDetails[0]?.isSingle
        : false;
      if (
        this.getAllActiveRowsFromGrid().length === 0 &&
        this.offerType === focSchemeBasedEnums.SLAB
      ) {
        this.weightBasedGoldSlabRowData.push({
          id: '',
          slabTo: '',
          slabFrom: '',
          karatage: '22',
          multiplyingValue: '',
          rowId: '',
          totalFocWt: '',
          isActive: true
        });
        this.weightBasedGoldSlabGridApi.redrawRows();
      }
    } else {
      this.createweightBasedStdGoldForm();
      this.createweightBasedSlabGoldForm();
    }
  }

  createweightBasedSlabGoldForm(varinatDetails?: WeightBasedVariantDetails) {
    if (varinatDetails) {
      this.weightBasedGoldSlabRowData.push({
        id: varinatDetails.id ? varinatDetails.id : '',
        slabFrom:
          varinatDetails.slabFrom !== null ? varinatDetails.slabFrom : '',
        slabTo: varinatDetails.slabTo !== null ? varinatDetails.slabTo : '',
        karatage: varinatDetails.karatage ? varinatDetails.karatage : '',
        totalFocWt:
          varinatDetails.totalFocWt !== null ? varinatDetails.totalFocWt : '',
        multiplyingValue:
          varinatDetails.multiplyingValue !== null
            ? varinatDetails.multiplyingValue
            : '',
        rowId: varinatDetails.rowId ? varinatDetails.rowId : '',
        isActive: varinatDetails.isActive ? varinatDetails.isActive : false
      });
    } else {
      this.weightBasedGoldSlabRowData = [];
      this.weightBasedGoldSlabRowData.push({
        id: '',
        slabFrom: '',
        slabTo: '',
        karatage: '22',
        rowId: '',
        totalFocWt: '',
        multiplyingValue: '',
        isActive: true
      });
    }
  }

  createweightBasedStdGoldForm(varinatDetails?: WeightBasedVariantDetails) {
    if (varinatDetails) {
      this.weightBasedGoldStdRowData.push({
        id: varinatDetails.id ? varinatDetails.id : '',
        stdValue:
          varinatDetails.stdValue !== null ? varinatDetails.stdValue : '',
        karatage: varinatDetails.karatage ? varinatDetails.karatage : '',
        formGroup: new FormGroup({
          isMultiple: new FormControl(
            varinatDetails.isMultiple ? varinatDetails.isMultiple : ''
          ),
          isSingle: new FormControl(
            varinatDetails.isSingle ? varinatDetails.isSingle : ''
          )
        }),

        totalFocWt:
          varinatDetails.totalFocWt !== null ? varinatDetails.totalFocWt : '',
        rowId: varinatDetails.rowId ? varinatDetails.rowId : '',
        productGroup: this.selectedSlabProductGroups,
        isActive: varinatDetails.isActive ? varinatDetails.isActive : false,
        productGroupCount: varinatDetails.productGroupCount
          ? varinatDetails.productGroupCount
          : 0
      });
      this.isSingle = varinatDetails?.isSingle
        ? varinatDetails.isSingle
        : false;
    } else {
      this.weightBasedGoldStdRowData = [];
      this.weightBasedGoldStdRowData.push({
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
      if (
        this.dropDownForm.get('discountType').value ===
        focSchemeBasedEnums.STANDARD
      ) {
        if (this.editMode) {
          this.editMode = false;
          this.weightBasedGoldStdGridApi.stopEditing();
        } else {
          this.checkSlabValidation(this.weightBasedGoldStdRowData);
          this.addData(this.weightBasedGoldStdGridApi);
        }
      } else if (
        this.dropDownForm.get('discountType').value === focSchemeBasedEnums.SLAB
      ) {
        if (this.editMode) {
          this.editMode = false;
          this.weightBasedGoldSlabGridApi.stopEditing();
        } else {
          this.checkSlabValidation(this.weightBasedGoldSlabRowData);
          this.addData(this.weightBasedGoldSlabGridApi);
        }
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

      if (
        this.dropDownForm.get('discountType').value ===
        focSchemeBasedEnums.STANDARD
      ) {
        if (this.editMode) {
          this.editMode = false;
          this.weightBasedGoldStdGridApi.stopEditing();
        } else {
          this.checkSlabValidation(this.weightBasedGoldStdRowData);
          this.addData(this.weightBasedGoldStdGridApi);
        }
      } else if (
        this.dropDownForm.get('discountType').value === focSchemeBasedEnums.SLAB
      ) {
        if (this.editMode) {
          this.editMode = false;
          this.weightBasedGoldSlabGridApi.stopEditing();
        } else {
          this.checkSlabValidation(this.weightBasedGoldSlabRowData);
          this.addData(this.weightBasedGoldSlabGridApi);
        }
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

      this.duplicateStdValueError = false;
      this.errorStdValue = null;
      const stdValueMap = new Map<string, string>();
      let value;
      for (const data of rowData) {
        if (typeof data?.stdValue === 'object') {
          if (
            data?.stdValue?.value?.split('.')[1] === '000' ||
            data?.stdValue?.value?.split('.')[1] === '00' ||
            data?.stdValue?.value?.split('.')[1] === '0'
          ) {
            value = data?.stdValue?.value?.split('.')[0];
          } else {
            value = data?.stdValue.value;
          }
        } else {
          if (
            data?.stdValue?.value?.split('.')[1] === '000' ||
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
          data?.totalFocWt?.isValid === true ||
          data?.totalFocWt?.isValid === undefined
        ) {
          this.inValidTotalFocWeight = false;
        } else if (data?.totalFocWt?.isValid === false) {
          this.inValidTotalFocWeight = true;
          break;
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
        if (data?.totalFocWt?.value < 0.01 || data?.totalFocWt < 0.01) {
          this.weightValidationError = true;
        } else {
          this.weightValidationError = false;
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
      }
    }

    if (!this.valueEmpty) {
      if (
        Number(
          typeof currentRowData?.slabTo === 'object'
            ? currentRowData?.slabTo?.value
            : currentRowData?.slabTo
        ) <=
        Number(
          typeof currentRowData?.slabFrom === 'object'
            ? currentRowData?.slabFrom?.value
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
      this.slabToLessThanSlabFrom ||
      this.duplicateStdValueError ||
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
        errorMessage = this.duplicateStdValueErrorMsg + this.errorStdValue;
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
          });
      }
    } else {
      this.hasError = false;
    }
  }
  rowEditingStarted(event) {
    this.editMode = true;
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
        this.weightBasedGoldStdGridApi.stopEditing();
      } else {
        this.checkStandardValidation(this.weightBasedGoldStdRowData);
        this.selectedRowIndex = this.getAllRows().length;
        this.addData(this.weightBasedGoldStdGridApi);
      }
    }
  }
  changeEvent(checked) {
    this.isSingle = checked;
  }
  addData(api) {
    if (this.addRowData) {
      if (
        this.valueEmpty === false &&
        this.inValidKaratage === false &&
        this.inValidTotalFocWeight === false &&
        this.addRowData &&
        this.duplicateStdValueError === false &&
        this.productMappingError === false &&
        this.weightValidationError === false
      ) {
        this.weightBasedGoldStdRowData.splice(this.selectedRowIndex + 1, 0, {
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
          productGroupCount: 0,
          isActive: true
        });

        this.weightBasedGoldStdGridApi.setRowData(
          this.weightBasedGoldStdRowData
        );
        this.addRowData = false;
      }
    } else if (this.offerType === focSchemeBasedEnums.SLAB) {
      if (this.isAbove === true) {
        if (this.weightBasedGoldSlabRowData.length > 1) {
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
            this.weightBasedGoldSlabRowData.splice(this.selectedRowIndex, 0, {
              id: '',
              slabFrom: '',
              slabTo: '',
              karatage: '22',
              multiplyingValue: '',
              rowId: '',
              totalFocWt: '',
              isActive: true
            });

            this.weightBasedGoldSlabGridApi.setRowData(
              this.weightBasedGoldSlabRowData
            );
            this.disableweightBasedButton = true;
          }
        } else if (this.weightBasedGoldSlabRowData.length === 1) {
          if (
            this.valueEmpty === false &&
            this.slabToLessThanSlabFrom === false &&
            this.inValidKaratage === false &&
            this.inValidTotalFocWeight === false &&
            this.productMappingError === false &&
            this.weightValidationError === false
          ) {
            this.weightBasedGoldSlabRowData.splice(this.selectedRowIndex, 0, {
              id: '',
              slabFrom: '',
              slabTo: '',
              karatage: '22',

              multiplyingValue: '',
              rowId: '',
              totalFocWt: '',
              isActive: true
            });

            this.weightBasedGoldSlabGridApi.setRowData(
              this.weightBasedGoldSlabRowData
            );
            this.disableweightBasedButton = true;
          }
        }
        this.isAbove = false;
      } else if (this.isBelow === true) {
        if (this.weightBasedGoldSlabRowData.length > 1) {
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
            this.weightBasedGoldSlabRowData.splice(
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
                isActive: true
              }
            );

            this.weightBasedGoldSlabGridApi.setRowData(
              this.weightBasedGoldSlabRowData
            );
            this.disableweightBasedButton = true;
          }
        } else if (this.weightBasedGoldSlabRowData.length === 1) {
          if (
            this.inValidKaratage === false &&
            this.inValidTotalFocWeight === false &&
            this.valueEmpty === false &&
            this.slabToLessThanSlabFrom === false &&
            this.productMappingError === false &&
            this.weightValidationError === false
          ) {
            this.weightBasedGoldSlabRowData.splice(
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
                isActive: true
              }
            );

            this.weightBasedGoldSlabGridApi.setRowData(
              this.weightBasedGoldSlabRowData
            );
            this.disableweightBasedButton = true;
          }
        }
        this.isBelow = false;
      }
    }
  }
  onSelectionChanged(event) {
    this.alldeleted = false;
    if (this.weightBasedGoldStdGridApi === event.api) {
      if (this.weightBasedGoldStdGridApi.getSelectedNodes().length) {
        this.disableweightBasedButton = false;
        this.selectedRowIndex = this.weightBasedGoldStdGridApi.getSelectedNodes()[0].rowIndex;
      } else {
        this.disableweightBasedButton = true;
      }
    }
    if (this.weightBasedGoldSlabGridApi === event.api) {
      if (this.weightBasedGoldSlabGridApi.getSelectedNodes().length) {
        this.disableweightBasedButton = false;
        this.selectedRowIndex = this.weightBasedGoldSlabGridApi.getSelectedNodes()[0].rowIndex;
      } else {
        this.disableweightBasedButton = true;
      }
    }
  }

  onDropDownChange(event) {
    this.disableweightBasedButton = true;
    this.weightValidationError = false;
    if (event.value === focSchemeBasedEnums.STANDARD) {
      this.offerType = focSchemeBasedEnums.STANDARD;
    } else {
      this.offerType = focSchemeBasedEnums.SLAB;
    }
    this.loadFocTypeState.emit({
      tabName: tabTypeEnums.WEIGHT_BASED_GOLD_COIN,
      focType: event.value
    });
    this.loadVariantDetails.emit({
      category: this.category,
      itemType: this.itemType,
      offerType: this.offerType
    });
    this.deleteSchemeDetails = [];
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

  weightBasedGoldStdGridReady(params: GridReadyEvent) {
    this.weightBasedGoldStdGridApi = params.api;
    this.weightBasedGoldStdGridApi.setRowData(this.weightBasedGoldStdRowData);
  }

  weightBasedGoldSlabGridReady(params: GridReadyEvent) {
    this.weightBasedGoldSlabGridApi = params.api;
    this.weightBasedGoldSlabGridApi.setRowData(this.weightBasedGoldSlabRowData);
  }

  getStdContext() {
    return {
      validators: {
        stdValue: [],
        karatage: [this.fieldValidatorService.karatField('Karatage')],
        totalFocWt: []
      },
      componentParent: this.focWeightBasedGoldComponent,
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
      componentParent: this.focWeightBasedGoldComponent,
      focusOn: 'slabFrom'
    };
  }

  rowValueChanged(changeEvent) {
    if (this.offerType === focSchemeBasedEnums.STANDARD) {
      this.checkStandardValidation(this.weightBasedGoldStdRowData);
      this.addData(this.weightBasedGoldStdGridApi);
    } else if (this.offerType === focSchemeBasedEnums.SLAB) {
      this.checkSlabValidation(this.weightBasedGoldSlabRowData);
      this.addData(this.weightBasedGoldSlabRowData);
    }
    this.editMode = false;
  }

  getAllRows() {
    const rowData = [];
    if (this.offerType === focSchemeBasedEnums.STANDARD) {
      this.weightBasedGoldStdGridApi.forEachNode(node =>
        rowData.push(node.data)
      );
    } else if (this.offerType === focSchemeBasedEnums.SLAB) {
      this.weightBasedGoldSlabGridApi.forEachNode(node =>
        rowData.push(node.data)
      );
    }
    return rowData;
  }

  getAllActiveRows() {
    const rowData = [];
    this.weightBasedGoldSlabGridApi?.forEachNode(node => {
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
    this.weightBasedGoldSlabGridApi.forEachNode(node => {
      if (node.rowIndex === index) {
        rowData.push(node.data);
      }
    });
    return rowData;
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
        this.weightBasedGoldStdGridApi.stopEditing();
        this.checkStandardValidation(this.weightBasedGoldStdRowData);
      } else if (this.offerType === focSchemeBasedEnums.SLAB) {
        this.weightBasedGoldSlabGridApi.stopEditing();
        this.checkSlabValidation(this.weightBasedGoldSlabRowData);
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
          this.offerType =
            this.dropDownForm.get('discountType').value ===
            focSchemeBasedEnums.STANDARD
              ? focSchemeBasedEnums.STANDARD
              : focSchemeBasedEnums.SLAB;

          if (this.dropDownForm.valid) {
            this.saveVariantDetails.emit(this.prepareResponse(array));
          }
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
          isSingle: value?.formGroup?.get('isSingle').value
            ? value?.formGroup?.get('isSingle').value
            : false,
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
            typeof value.stdValue === 'object'
              ? value.stdValue?.value
              : value.stdValue,
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

  productGroupMapping(params, rowIndex, flag) {
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
        category: this.category,
        itemType: this.itemType
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
                  const rowNode = this.weightBasedGoldStdGridApi.getRowNode(
                    rowIndex
                  );

                  rowNode.data.productGroup = this.mappedProductGroups;
                  rowNode.data.productGroupCount = this.mappedProductGroups.length;
                  const res1 = this.weightBasedGoldStdGridApi.applyTransaction({
                    update: [rowNode.data]
                  });
                  this.weightBasedGoldStdGridApi.redrawRows({
                    rowNodes: res1.update
                  });
                }
              }
              const saveProductGroup = {
                masterId: this.configId,
                catergory: this.category,
                schemeDetailsId: params.id,
                addProducts: addedProductGroups,
                removeProducts: removeProductGroups,
                category: this.category,
                itemType: this.itemType
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
        category: this.category,
        itemType: this.itemType
      });
      this.openPGPopupFlag = true;
    }
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
            this.disableweightBasedButton = true;
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
                this.weightBasedGoldStdGridApi.applyTransaction({
                  remove: [
                    this.weightBasedGoldStdGridApi.getRowNode(params.rowIndex)
                      .data
                  ]
                });
                this.weightBasedGoldStdGridApi.redrawRows();
              }

              if (this.getAllRows().length === 0) {
                this.alldeleted = true;

                this.weightBasedGoldStdRowData = [
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
                    productGroupCount: 0,
                    isActive: true
                  }
                ];

                this.weightBasedGoldStdGridApi.redrawRows();
              } else {
                this.selectedRowIndex = 0;
                this.weightBasedGoldStdRowData = this.getAllRows().map(ob => ({
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
                this.weightBasedGoldSlabGridApi.applyTransaction({
                  remove: [
                    this.weightBasedGoldSlabGridApi.getRowNode(params.rowIndex)
                      ?.data
                      ? this.weightBasedGoldSlabGridApi.getRowNode(
                          params.rowIndex
                        )?.data
                      : specificRowData
                      ? specificRowData
                      : {}
                  ]
                });
                this.weightBasedGoldSlabGridApi.redrawRows();
              }

              if (this.getAllActiveRows().length === 0) {
                const resAdd = this.weightBasedGoldSlabGridApi.applyTransaction(
                  {
                    add: [
                      {
                        id: '',
                        slabTo: '',
                        slabFrom: '',
                        karatage: '22',
                        multiplyingValue: '',
                        rowId: '',
                        totalFocWt: '',
                        isActive: true
                      }
                    ]
                  }
                );
                this.weightBasedGoldSlabGridApi.redrawRows({
                  rowNodes: resAdd.add
                });
              }

              if (this.getAllRows().length === 0) {
                this.alldeleted = true;
              } else {
                this.selectedRowIndex = 0;
                this.weightBasedGoldSlabRowData = this.getAllRows().map(ob => ({
                  ...ob,
                  rowId: (this.i++).toString()
                }));
              }
            }
          }
        });
    }
  }

  @HostListener('keydown', ['$event'])
  private onKeydown(event: KeyboardEvent): void {
    const focusedCell = this.weightBasedGoldStdGridApi?.getFocusedCell();
    const field = focusedCell?.column?.getColDef()?.field;
    const rowIndex = focusedCell?.rowIndex;
    const rowNode = this.weightBasedGoldStdGridApi?.getRowNode(
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

  onGridStdSizeChanged() {
    if (window.innerWidth >= 991) {
      this.weightBasedGoldStdGridApi.sizeColumnsToFit();
    }
  }
  onGridSlabSizeChanged() {
    if (window.innerWidth >= 991) {
      this.weightBasedGoldSlabGridApi.sizeColumnsToFit();
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

            const saveProductGroup: SaveProductGroup = {
              masterId: this.configId,
              addProducts: addedProductGroups,
              removeProducts: removeProductGroups,
              category: this.category,
              itemType: this.itemType
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
        specificRowData = this.weightBasedGoldSlabRowData.filter(
          data => data.id === id
        );
      } else {
        specificRowData = this.weightBasedGoldSlabRowData.filter(
          data =>
            JSON.stringify(data.slabFrom) === JSON.stringify(rowData.slabFrom)
        );
      }
      specificRowData[0].isActive = checked;
      this.weightBasedGoldSlabGridApi.redrawRows();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.dropDownForm.reset();
  }
}
