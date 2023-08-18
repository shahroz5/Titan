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
  ValueBasedVariantDetails,
  SaveVariantDetailsPayload,
  focSchemeBasedEnums,
  AddSchemeDetails,
  UpdateSchemeDetails,
  LoadVariantDetailsPayload,
  ProductGroupMappingServiceAbstraction,
  SaveProductGroup,
  LoadProductGroupPayload,
  OthersSlabRowData,
  OthersStdRowData,
  FOCItemCodes,
  ProductGroupMappingOption,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  SelectDropDownOption,
  SchemeDetails,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  tabTypeEnums,
  FocTypeState,
  FocTypeRequestPaylaod
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'poss-web-foc-value-based-others',
  templateUrl: './foc-value-based-others.component.html',
  styleUrls: ['./foc-value-based-others.component.scss']
})
export class FocValueBasedOthersComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() varinatDetails: ValueBasedVariantDetails[];
  @Input() category: string;
  @Input() itemType: string;
  @Input() selectedSlabProductGroups: ProductGroupMappingOption[];
  @Input() selectedGroups: Observable<any>;
  @Input() focItemCodes: FOCItemCodes[];
  @Input() schemeDetails: SchemeDetails;
  @Input() focTypeDetails: FocTypeState;
  @Output() loadFocTypeState = new EventEmitter<FocTypeRequestPaylaod>();
  @Output() loadProductGroups = new EventEmitter<LoadProductGroupPayload>();
  @Output() saveVariantDetails = new EventEmitter<SaveVariantDetailsPayload>();
  @Output() mapProductGroup = new EventEmitter<SaveProductGroup>();
  @Output() loadVariantDetails = new EventEmitter<LoadVariantDetailsPayload>();
  @Output() deleteSchemes = new EventEmitter<SaveVariantDetailsPayload>();

  itemCodes: FOCItemCodes[];
  mappedProducts: ProductGroupMappingOption[] = [];

  focValueBasedOthersComponent: FocValueBasedOthersComponent = this;
  offerType = focSchemeBasedEnums.STANDARD;
  selectedRowIndex = 0;
  hasError: boolean;
  inValidTotalFocW = false;
  inValidQuantity = false;
  i = 1;
  isSingle = false;
  configId: string;
  deleteSchemeDetails = [];

  errorMessageForNull: string;
  errorMessageForCurrentStdValueLessThanPrevious: string;
  errorMessageForCurrentStdValueGreaterThanNext: string;
  errorMessageForCurrentSlabFromValueLessThanPreviousSlabTo: string;
  errorMessageForSlabToLessThanSlabFrom: string;
  errorMessageForcurrentSlabToValueGreaterThanNextSlabFrom: string;
  addRowData = false;
  alldeleted: boolean;
  valueEmpty = false;
  currentStdValueLessThanPrevious = false;
  currentStdValueGreaterThanNext = false;

  currentSlabFromValueLessThanPreviousSlabTo = false;
  slabToLessThanSlabFrom = false;
  currentSlabToValueGreaterThanNextSlabFrom = false;

  errorDialogReference;
  isAbove: boolean;
  isBelow;

  valueBasedOthersStdColdefs;
  valueBasedOthersSlabColdefs;

  hasSelectionChange: boolean;
  dropDownForm: FormGroup;
  destroy$ = new Subject<null>();
  selectedTab = 0;
  selectedRadioOptions = 'gold';
  selectedDiscountType: string;
  valueBasedOthersStdGridApi: GridApi;
  valueBasedOthersSlabGridApi: GridApi;
  domLayout = 'autoHeight';
  colDefs = [];
  valueBasedOthersStdRowData: OthersStdRowData[] = [];
  valueBasedOthersSlabRowData: OthersSlabRowData[] = [];
  disableValueBasedButton = true;
  editMode;
  params: any;
  rowIndex: string;

  popUpOpen = false;
  isLoading = false;
  mappedProductGroups: ProductGroupMappingOption[] = [];
  enableButton = true;
  focEligibility = 'PRE_DISCOUNT_TAX';
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
  errorMessageToMapFocItemCode: any;
  openPGPopupFlag = false;
  constructor(
    private productGroupMappingServiceAbstraction: ProductGroupMappingServiceAbstraction,
    private translate: TranslateService,
    private fieldValidatorService: FieldValidatorsService,
    private dialog: MatDialog,
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
    this.offerType = this.focTypeDetails.valueBasedOthers;
    this.dropDownForm = new FormGroup({
      discountType: new FormControl(this.focTypeDetails.valueBasedOthers),
      focEligibility: new FormControl(focSchemeBasedEnums.PRE_DISCOUNT_TAX)
    });

    this.isSingle = this.varinatDetails[0]?.isSingle
      ? this.varinatDetails[0]?.isSingle
      : false;

    this.translate
      .get([
        'pw.focConfiguration.stdValue',
        'pw.focConfiguration.focItemCode',
        'pw.focConfiguration.isMultiple',
        'pw.focConfiguration.qty',
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
        'pw.focConfiguration.errorMessageToMapFocItemCode'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.errorMessageToMapFocItemCode =
          translatedMessages[
            'pw.focConfiguration.errorMessageToMapFocItemCode'
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
        this.valueBasedOthersStdColdefs = [
          {
            headerName: translatedMessages['pw.focConfiguration.stdValue'],
            field: 'stdValue',
            editable: true,
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
            },
            cellEditor: 'inputValidator',
            width: 120,
            minWidth: 120,
            suppressSizeToFit: true,
            flex: 1
          },
          {
            editable: true,
            headerName: translatedMessages['pw.focConfiguration.focItemCode'],
            field: 'itemCode',
            suppressMovable: true,

            cellEditorSelector: params => {
              return {
                component: 'agSelectCellEditor',
                params: {
                  values: this.itemCodes.map(data => data.itemCode)
                }
              };
            },
            width: 150,
            minWidth: 150,
            suppressSizeToFit: true,
            flex: 1
          },
          {
            headerName: translatedMessages['pw.focConfiguration.isMultiple'],
            field: 'isMultiple',
            cellRendererFramework: CheckboxGridCellComponent,

            width: 80,
            minWidth: 80,
            suppressMovable: true
          },
          {
            suppressMovable: true,
            headerName: translatedMessages['pw.focConfiguration.qty'],
            field: 'qty',
            editable: true,
            width: 120,
            minWidth: 120,
            suppressSizeToFit: true,
            flex: 1,
            cellClassRules: {
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                if (params?.value?.isValid) {
                  this.inValidQuantity = false;
                }
                return params?.value?.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                if (params?.value?.isValid === false) {
                  this.inValidQuantity = true;
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
            },

            cellEditor: 'inputValidator'
          },
          {
            suppressMovable: true,
            headerName: translatedMessages['pw.focConfiguration.isSingle'],
            field: 'isSingle',
            width: 80,
            minWidth: 80,
            cellRendererFramework: CheckboxGridCellComponent
          },
          {
            headerName:
              translatedMessages['pw.focConfiguration.productGroupMap'],
            field: 'productGroupMap',
            width: 150,
            minWidth: 150,
            suppressSizeToFit: true,
            flex: 1,
            suppressMovable: true,
            cellRendererFramework: ProductMappingCountComponent
          },
          {
            headerName: translatedMessages['pw.focConfiguration.isActive'],
            field: 'isActive',
            suppressMovable: true,
            cellRendererFramework: ToggleButtonCellComponent,
            width: 120,
            minWidth: 120,
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

        'pw.focConfiguration.focItemCode',
        'pw.focConfiguration.multiplyingValue',
        'pw.focConfiguration.qty',
        'pw.focConfiguration.isActive'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.valueBasedOthersSlabColdefs = [
          {
            checkboxSelection: params => params.data.isActive,
            width: 40,
            minWidth: 40,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.focConfiguration.slabFrom'],
            field: 'slabFrom',
            isAmount: true,
            cellRendererFramework: EditItemComponent,
            cellEditor: 'inputValidator',
            suppressMovable: true,
            editable: true,
            width: 120,
            minWidth: 120,
            flex: 1,
            suppressSizeToFit: true,
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
            isAmount: true,
            editable: true,
            cellRendererFramework: EditItemComponent,
            cellEditor: 'inputValidator',
            suppressMovable: true,
            width: 120,
            minWidth: 120,
            flex: 1,
            suppressSizeToFit: true,
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
            headerName: translatedMessages['pw.focConfiguration.focItemCode'],
            field: 'itemCode',
            suppressMovable: true,
            editable: true,
            width: 150,
            minWidth: 150,
            suppressSizeToFit: true,
            flex: 1,
            cellEditorSelector: params => {
              return {
                component: 'agSelectCellEditor',
                params: {
                  values: this.itemCodes.map(data => data.itemCode)
                }
              };
            }
          },
          {
            headerName:
              translatedMessages['pw.focConfiguration.multiplyingValue'],
            field: 'multiplyingValue',
            editable: true,
            width: 120,
            minWidth: 120,
            flex: 1,
            suppressSizeToFit: true,
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
            suppressMovable: true,
            headerName: translatedMessages['pw.focConfiguration.qty'],
            field: 'qty',
            editable: true,
            width: 120,
            minWidth: 120,
            suppressSizeToFit: true,
            flex: 1,
            cellClassRules: {
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                if (params?.value?.isValid) {
                  this.inValidQuantity = false;
                }
                return params?.value?.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                if (params?.value?.isValid === false) {
                  this.inValidQuantity = true;
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
            },

            cellEditor: 'inputValidator'
          },
          {
            headerName: translatedMessages['pw.focConfiguration.isActive'],
            field: 'isActive',
            suppressMovable: true,
            cellRendererFramework: ToggleButtonCellComponent,
            width: 120,
            minWidth: 120,
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
    console.log(this.errorMessageToMapFocItemCode);
    this.deleteSchemeDetails = [];
    if (changes['focItemCodes']) {
      this.itemCodes = this.focItemCodes;
      if (this.itemCodes.length === 0) {
        //  this.showAlertPopToMapFOCItemCode()
      }
    }
    // this.focEligibility = this.varinatDetails[0]?.focEligibility
    //   ? this.varinatDetails[0]?.focEligibility
    //   : null;
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

    if (this.varinatDetails.length) {
      this.enableButton = false;
      this.valueBasedOthersStdRowData = [];
      this.valueBasedOthersSlabRowData = [];
      for (const varinatDetailsItem of this.varinatDetails) {
        this.createvalueBasedStdOthersData(varinatDetailsItem);
        this.createvalueBasedSlabOthersData(varinatDetailsItem);
      }
      this.isSingle = this.varinatDetails[0]?.isSingle
      ? this.varinatDetails[0]?.isSingle
      : false;
      if (
        this.getAllActiveRowsFromGrid().length === 0 &&
        this.offerType === focSchemeBasedEnums.SLAB
      ) {
        this.valueBasedOthersSlabRowData.push({
          id: '',
          slabFrom: '',
          slabTo: '',
          itemCode: '',
          rowId: '',
          qty: '',
          multiplyingValue: '',
          isActive: true
        });
        this.valueBasedOthersSlabGridApi.redrawRows();
      }
    } else {
      this.createvalueBasedStdOthersData();
      this.createvalueBasedSlabOthersData();
    }
  }
  createvalueBasedSlabOthersData(varinatDetails?: ValueBasedVariantDetails) {
    if (varinatDetails) {
      this.valueBasedOthersSlabRowData.push({
        id: varinatDetails.id ? varinatDetails.id : '',
        slabFrom:
          varinatDetails.slabFrom !== null ? varinatDetails.slabFrom : '',
        slabTo: varinatDetails.slabTo !== null ? varinatDetails.slabTo : '',
        qty: varinatDetails.quantity !== null ? varinatDetails.quantity : '',
        itemCode: varinatDetails.itemCode ? varinatDetails.itemCode : '',
        multiplyingValue:
          varinatDetails.multiplyingValue !== null
            ? varinatDetails.multiplyingValue
            : '',
        rowId: varinatDetails.rowId ? varinatDetails.rowId : '',
        isActive: varinatDetails.isActive ? varinatDetails.isActive : false
      });
    } else {
      this.valueBasedOthersSlabRowData = [];
      this.valueBasedOthersSlabRowData.push({
        id: '',
        slabFrom: '',
        slabTo: '',
        itemCode: '',
        rowId: '',
        qty: '',
        multiplyingValue: '',
        isActive: true
      });
    }
  }

  createvalueBasedStdOthersData(varinatDetails?: ValueBasedVariantDetails) {
    if (varinatDetails) {
      this.valueBasedOthersStdRowData.push({
        id: varinatDetails.id ? varinatDetails.id : '',
        stdValue:
          varinatDetails.stdValue !== null ? varinatDetails.stdValue : '',
        itemCode: varinatDetails.itemCode ? varinatDetails.itemCode : '',
        qty: varinatDetails.quantity !== null ? varinatDetails.quantity : '',
        formGroup: new FormGroup({
          isMultiple: new FormControl(
            varinatDetails.isMultiple ? varinatDetails.isMultiple : ''
          ),
          isSingle: new FormControl(
            varinatDetails.isSingle ? varinatDetails.isSingle : ''
          )
        }),

        rowId: varinatDetails.rowId ? varinatDetails.rowId : '',
        productGroup: this.selectedSlabProductGroups,
        isActive: varinatDetails.isActive ? varinatDetails.isActive : false,
        productGroupCount: varinatDetails.productGroupCount
          ? varinatDetails.productGroupCount
          : 0
      });
    } else {
      this.valueBasedOthersStdRowData = [];
      this.valueBasedOthersStdRowData.push({
        id: '',
        stdValue: '',
        itemCode: '',
        qty: '',
        formGroup: new FormGroup({
          isMultiple: new FormControl(''),
          isSingle: new FormControl('')
        }),
        productGroup: [],
        rowId: '',

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
        this.valueBasedOthersSlabGridApi.stopEditing();
      } else {
        this.checkSlabValidation(this.valueBasedOthersSlabRowData);
        this.addData(this.valueBasedOthersSlabGridApi);
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
        this.valueBasedOthersSlabGridApi.stopEditing();
      } else {
        this.checkSlabValidation(this.valueBasedOthersSlabRowData);
        this.addData(this.valueBasedOthersSlabGridApi);
      }
    }
  }

  checkStandardValidation(rowData) {
    if (this.offerType === focSchemeBasedEnums.STANDARD) {
      for (const data of rowData) {
        if (
          data?.stdValue?.value === '' ||
          data?.itemCode?.value === '' ||
          data?.qty?.value === '' ||
          data?.stdValue === '' ||
          data?.itemCode === '' ||
          data?.itemCode === undefined ||
          data?.qty === ''
        ) {
          this.valueEmpty = true;
          break;
        } else {
          this.valueEmpty = false;
        }

        if (data?.qty?.isValid === true || data?.qty?.isValid === undefined) {
          this.inValidQuantity = false;
        } else if (data?.qty?.isValid === false) {
          this.inValidQuantity = true;
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
          data?.qty?.value === '' ||
          data?.itemCode?.value === '' ||
          data?.itemCode === undefined ||
          data?.qty === '' ||
          data?.itemCode === '' ||
          data?.slabFrom === '' ||
          data?.slabTo === '' ||
          data?.stdValue === ''
        ) {
          this.valueEmpty = true;
          break;
        } else {
          this.valueEmpty = false;
        }

        if (data?.qty?.isValid === true || data?.qty?.isValid === undefined) {
          this.inValidQuantity = false;
        } else if (data?.qty?.isValid === false) {
          this.inValidQuantity = true;
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
            ? currentRowData?.slabTo.value
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
      this.inValidQuantity ||
      this.valueEmpty ||
      this.currentStdValueGreaterThanNext ||
      this.currentStdValueLessThanPrevious ||
      this.currentSlabFromValueLessThanPreviousSlabTo ||
      this.currentSlabToValueGreaterThanNextSlabFrom ||
      this.slabToLessThanSlabFrom ||
      this.duplicateStdValueError ||
      this.productMappingError
    ) {
      this.hasError = true;
      let errorMessage;

      if (this.valueEmpty || this.inValidQuantity) {
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
      this.disableValueBasedButton = true;
    }
  }

  productGroupMapping(params, rowIndex, flag) {
    this.rowIndex = rowIndex;
    this.params = params;

    this.isLoading = true;
    if (this.offerType === focSchemeBasedEnums.STANDARD) {
      this.loadProductGroups.emit({
        schemeDetailsId: params.id,
        masterId: this.configId,
        category: this.category
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
                  const rowNode = this.valueBasedOthersStdGridApi.getRowNode(
                    rowIndex
                  );

                  rowNode.data.productGroup = this.mappedProductGroups;
                  rowNode.data.productGroupCount = this.mappedProductGroups.length;
                  const res1 = this.valueBasedOthersStdGridApi.applyTransaction(
                    {
                      update: [rowNode.data]
                    }
                  );
                  this.valueBasedOthersStdGridApi.redrawRows({
                    rowNodes: res1.update
                  });
                }
              }
              const saveProductGroup = {
                masterId: this.configId,
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
        itemType: this.itemType,
        category: this.category
      });
      this.openPGPopupFlag = true;
    }
  }
  rowEditingStarted(event) {
    this.editMode = true;
  }

  addData(api) {
    if (this.addRowData) {
      if (
        this.inValidQuantity === false &&
        this.valueEmpty === false &&
        this.duplicateStdValueError === false &&
        this.productMappingError === false
      ) {
        this.valueBasedOthersStdRowData.splice(this.selectedRowIndex + 1, 0, {
          id: '',
          stdValue: '',
          itemCode: '',
          qty: '',
          formGroup: new FormGroup({
            isMultiple: new FormControl(''),
            isSingle: new FormControl('')
          }),
          productGroup: [],
          rowId: '',
          productGroupCount: 0,
          isActive: true
        });

        this.valueBasedOthersStdGridApi.setRowData(
          this.valueBasedOthersStdRowData
        );
        this.addRowData = false;
      }
    } else if (this.offerType === focSchemeBasedEnums.SLAB) {
      if (this.isAbove === true) {
        if (this.valueBasedOthersSlabRowData.length > 1) {
          if (
            this.valueEmpty === false &&
            this.inValidQuantity === false &&
            this.currentSlabFromValueLessThanPreviousSlabTo === false &&
            this.currentSlabToValueGreaterThanNextSlabFrom === false &&
            this.slabToLessThanSlabFrom === false &&
            this.productMappingError === false
          ) {
            this.valueBasedOthersSlabRowData.splice(this.selectedRowIndex, 0, {
              id: '',
              slabFrom: '',
              slabTo: '',
              itemCode: '',
              qty: '',
              rowId: '',
              multiplyingValue: '',
              isActive: true
            });

            this.valueBasedOthersSlabGridApi.setRowData(
              this.valueBasedOthersSlabRowData
            );
          }
        } else if (this.valueBasedOthersSlabRowData.length === 1) {
          if (
            this.valueEmpty === false &&
            this.slabToLessThanSlabFrom === false &&
            this.inValidQuantity === false &&
            this.productMappingError === false
          ) {
            this.valueBasedOthersSlabRowData.splice(this.selectedRowIndex, 0, {
              id: '',
              slabFrom: '',
              slabTo: '',
              itemCode: '',
              multiplyingValue: '',
              rowId: '',
              qty: '',
              isActive: true
            });

            this.valueBasedOthersSlabGridApi.setRowData(
              this.valueBasedOthersSlabRowData
            );
          }
        }
        this.isAbove = false;
      } else if (this.isBelow === true) {
        if (this.valueBasedOthersSlabRowData.length > 1) {
          if (
            this.inValidQuantity === false &&
            this.valueEmpty === false &&
            this.currentSlabFromValueLessThanPreviousSlabTo === false &&
            this.currentSlabToValueGreaterThanNextSlabFrom === false &&
            this.slabToLessThanSlabFrom === false &&
            this.productMappingError === false
          ) {
            this.valueBasedOthersSlabRowData.splice(
              this.selectedRowIndex + 1,
              0,
              {
                id: '',
                slabFrom: '',
                slabTo: '',
                itemCode: '',
                qty: '',
                multiplyingValue: '',
                rowId: '',

                isActive: true
              }
            );

            this.valueBasedOthersSlabGridApi.setRowData(
              this.valueBasedOthersSlabRowData
            );
          }
        } else if (this.valueBasedOthersSlabRowData.length === 1) {
          if (
            this.inValidQuantity === false &&
            this.valueEmpty === false &&
            this.slabToLessThanSlabFrom === false &&
            this.productMappingError === false
          ) {
            this.valueBasedOthersSlabRowData.splice(
              this.selectedRowIndex + 1,
              0,
              {
                id: '',
                slabFrom: '',
                slabTo: '',
                itemCode: '',

                multiplyingValue: '',
                rowId: '',
                qty: '',
                isActive: true
              }
            );

            this.valueBasedOthersSlabGridApi.setRowData(
              this.valueBasedOthersSlabRowData
            );
          }
        }
        this.isBelow = false;
      }
    }
  }

  onSelectionChanged(event) {
    this.alldeleted = false;
    if (this.valueBasedOthersStdGridApi === event.api) {
      if (this.valueBasedOthersStdGridApi.getSelectedNodes().length) {
        this.disableValueBasedButton = false;
        this.selectedRowIndex = this.valueBasedOthersStdGridApi.getSelectedNodes()[0].rowIndex;
      } else {
        this.disableValueBasedButton = true;
      }
    }
    if (this.valueBasedOthersSlabGridApi === event.api) {
      if (this.valueBasedOthersSlabGridApi.getSelectedNodes().length) {
        this.disableValueBasedButton = false;
        this.selectedRowIndex = this.valueBasedOthersSlabGridApi.getSelectedNodes()[0].rowIndex;
      } else {
        this.disableValueBasedButton = true;
      }
    }
  }

  onDropDownChange(event) {
    this.deleteSchemeDetails = [];
    this.disableValueBasedButton = true;
    if (event.value === focSchemeBasedEnums.STANDARD) {
      this.offerType = focSchemeBasedEnums.STANDARD;

      this.loadVariantDetails.emit({
        category: this.category,
        itemType: this.itemType,
        offerType: this.offerType
      });
    } else if (event.value === focSchemeBasedEnums.SLAB) {
      this.offerType = focSchemeBasedEnums.SLAB;

      this.loadVariantDetails.emit({
        category: this.category,
        itemType: this.itemType,
        offerType: this.offerType
      });
    }

    this.loadFocTypeState.emit({
      tabName: tabTypeEnums.VALUE_BASED_OTHERS,
      focType: event.value
    });
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

  valueBasedOthersStdGridReady(params: GridReadyEvent) {
    this.valueBasedOthersStdGridApi = params.api;
    this.valueBasedOthersStdGridApi.setRowData(this.valueBasedOthersStdRowData);
  }

  valueBasedOthersSlabGridReday(params: GridReadyEvent) {
    this.valueBasedOthersSlabGridApi = params.api;
    this.valueBasedOthersSlabGridApi.setRowData(
      this.valueBasedOthersSlabRowData
    );
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
        this.valueBasedOthersStdGridApi.stopEditing();
      } else {
        this.checkStandardValidation(this.valueBasedOthersStdRowData);
        this.selectedRowIndex = this.getAllRows().length;
        this.addData(this.valueBasedOthersStdGridApi);
      }
    }
  }

  getContext() {
    return {};
  }

  getStdContext() {
    return {
      validators: {
        stdValue: [],
        qty: [this.fieldValidatorService.quantityField('Quantity')],
        slabFrom: [],
        slabTo: []
      },
      componentParent: this.focValueBasedOthersComponent,
      focusOn: 'stdValue'
    };
  }

  getSlabContext() {
    return {
      validators: {
        stdValue: [],
        qty: [this.fieldValidatorService.quantityField('Quantity')],
        slabFrom: [],
        slabTo: []
      },
      componentParent: this.focValueBasedOthersComponent,
      focusOn: 'slabFrom'
    };
  }

  rowValueChanged(changeEvent) {
    if (this.offerType === focSchemeBasedEnums.STANDARD) {
      this.checkStandardValidation(this.valueBasedOthersStdRowData);
      this.addData(this.valueBasedOthersStdGridApi);
    } else if (this.offerType === focSchemeBasedEnums.SLAB) {
      this.checkSlabValidation(this.valueBasedOthersSlabRowData);
      this.addData(this.valueBasedOthersSlabRowData);
    }
    this.editMode = false;
  }
  getAllRows() {
    const rowData = [];
    if (this.offerType === focSchemeBasedEnums.STANDARD) {
      this.valueBasedOthersStdGridApi.forEachNode(node =>
        rowData.push(node.data)
      );
    } else if (this.offerType === focSchemeBasedEnums.SLAB) {
      this.valueBasedOthersSlabGridApi.forEachNode(node =>
        rowData.push(node.data)
      );
    }

    return rowData;
  }

  getAllActiveRows() {
    const rowData = [];
    this.valueBasedOthersSlabGridApi?.forEachNode(node => {
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
    this.valueBasedOthersSlabGridApi.forEachNode(node => {
      if (node.rowIndex === index) {
        rowData.push(node.data);
      }
    });
    return rowData;
  }

  changeEvent(checked) {
    this.isSingle = checked;
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
        this.valueBasedOthersStdGridApi.stopEditing();
        this.checkStandardValidation(this.valueBasedOthersStdRowData);
      } else if (this.offerType === focSchemeBasedEnums.SLAB) {
        this.valueBasedOthersSlabGridApi.stopEditing();
        this.checkSlabValidation(this.valueBasedOthersSlabRowData);
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
              ? value.stdValue?.value
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
  // showAlertPopToMapFOCItemCode() {
  //   console.log('errorMessageToMapFocItemCode',this.errorMessageToMapFocItemCode)
  //   this.alertPopupService
  //     .open({
  //       type: AlertPopupTypeEnum.ERROR,
  //       message: this.errorMessageToMapFocItemCode
  //     })
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((res: boolean) => {});
  // }
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
                this.valueBasedOthersStdGridApi.applyTransaction({
                  remove: [
                    this.valueBasedOthersStdGridApi.getRowNode(params.rowIndex)
                      .data
                  ]
                });
                this.valueBasedOthersStdGridApi.redrawRows();
              }

              if (this.getAllRows().length === 0) {
                this.alldeleted = true;

                this.valueBasedOthersStdRowData = [
                  {
                    id: '',
                    stdValue: '',

                    formGroup: new FormGroup({
                      isMultiple: new FormControl(''),
                      isSingle: new FormControl('')
                    }),
                    productGroup: [],
                    rowId: '',
                    itemCode: null,
                    qty: '',
                    isActive: true
                  }
                ];

                this.valueBasedOthersStdGridApi.redrawRows();
              } else {
                this.selectedRowIndex = 0;
                this.valueBasedOthersStdRowData = this.getAllRows().map(ob => ({
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
                this.valueBasedOthersSlabGridApi.applyTransaction({
                  remove: [
                    this.valueBasedOthersSlabGridApi.getRowNode(params.rowIndex)
                      ?.data
                      ? this.valueBasedOthersSlabGridApi.getRowNode(
                          params.rowIndex
                        )?.data
                      : specificRowData
                      ? specificRowData
                      : {}
                  ]
                });
                this.valueBasedOthersSlabGridApi.redrawRows();
              }

              if (this.getAllActiveRows().length === 0) {
                this.alldeleted = true;
                const resAdd = this.valueBasedOthersSlabGridApi.applyTransaction(
                  {
                    add: [
                      {
                        id: '',
                        slabFrom: '',
                        slabTo: '',
                        multiplyingValue: '',
                        rowId: '',
                        itemCode: '',
                        qty: '',
                        isActive: true
                      }
                    ]
                  }
                );
                this.valueBasedOthersSlabGridApi.redrawRows({
                  rowNodes: resAdd.add
                });
              }
              if (this.getAllRows().length === 0) {
                this.alldeleted = true;
              } else {
                this.selectedRowIndex = 0;
                this.valueBasedOthersSlabRowData = this.getAllRows().map(
                  ob => ({
                    ...ob,
                    rowId: (this.i++).toString()
                  })
                );
              }
            }
          }
        });
    }
  }

  @HostListener('keydown', ['$event'])
  private onKeydown(event: KeyboardEvent): void {
    const focusedCell = this.valueBasedOthersStdGridApi?.getFocusedCell();
    const field = focusedCell?.column?.getColDef()?.field;
    const rowIndex = focusedCell?.rowIndex;
    const rowNode = this.valueBasedOthersStdGridApi?.getRowNode(
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onGridStdSizeChanged() {
    if (window.innerWidth >= 991) {
      this.valueBasedOthersStdGridApi.sizeColumnsToFit();
    }
  }
  onGridSlabSizeChanged() {
    if (window.innerWidth >= 991) {
      this.valueBasedOthersSlabGridApi.sizeColumnsToFit();
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
      if(id){
        specificRowData = this.valueBasedOthersSlabRowData.filter(
          data => data.id === id
        );
      } else {
        specificRowData = this.valueBasedOthersSlabRowData.filter(
          data => JSON.stringify(data.slabFrom) === JSON.stringify(rowData.slabFrom)
        );
      }
      specificRowData[0].isActive = checked;
      this.valueBasedOthersSlabGridApi.redrawRows();
    }
  }
}
