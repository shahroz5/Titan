import {
  AfterViewInit, ChangeDetectionStrategy,
  ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DeleteRowComponent, ProductMappingCountComponent, ToggleButtonCellComponent } from '@poss-web/shared/components/ui-ag-grid';
import {
  AlertPopupServiceAbstraction, AlertPopupTypeEnum, EligibilityConfigurationActionEnum, EligibilityConfigurationEnum, LoadProductGroupsPayload, 
  ProductGroupMappingOption, ProductGroupMappingServiceAbstraction, RivaahConfiguration, RivaahEligibilityConfig, RivaahEligibilityConfigRequest, SaveProductGroups, SelectDropDownOption
} from '@poss-web/shared/models';
import {
  fieldValidation, FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { SetLimitTabComponent } from '../set-limit-tab/set-limit-tab.component';
import { POSS_WEB_MAX_FILTER_OPTION_SELECTION } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-rivaah-eligibility-config',
  templateUrl: './rivaah-eligibility-config.component.html',
  styleUrls: ['./rivaah-eligibility-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RivaahEligibilityConfigComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() rivaahEligibilityConfig: RivaahEligibilityConfig[] = [];
  @Input() pageEvent: PageEvent;
  @Input() totalCount: number;
  @Input() pageSizeOptions: number[];
  @Input() occasion;
  @Input() eleventhDigit;
  @Input() mappedProductCategories: SelectionDailogOption[];
  @Input() allProductCategories: SelectionDailogOption[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() responseEvent = new EventEmitter<{
    configRequest: RivaahEligibilityConfigRequest;
    configAction : string;
  }>();
  @Output() clearProductGroupSearch = new EventEmitter<any>();
  @Output() searchProductGroup = new EventEmitter<{
    searchBy: any;
    searchValue: any;
  }>();
  @Output() mapProductGroup = new EventEmitter<SaveProductGroups>();
  @Output() loadProductGroups = new EventEmitter<LoadProductGroupsPayload>();
  @Input() selectedGroups: Observable<any>;

  ruleId = '1';
  prevData = [];
  gridApi: GridApi;

  mappedProductGroups: ProductGroupMappingOption[] = [];

  configId: string;
  columnDefs = [];
  destroy$: Subject<null> = new Subject<null>();
  disableButton = true;

  rangeIdLabel: string;
  toleranceLabel: string;
  productGroupCodeLabel: string;

  formGroup: FormGroup = new FormGroup({});
  parentForm: FormArray = new FormArray([]);
  rivaahConfigFormGroup: FormGroup;

  isActive = true;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    productCodeField: new FormControl()
  });
  pageSizeOption = [];

  minPageSize: number;
  rivaahEligibilityConfigComponent: RivaahEligibilityConfigComponent = this;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;
  productGroups = [];
  productCategory = [];
  enableProductCategory = true;
  unsavedGridData = [];
  savedGridData = [];
  emptyValue = true;

  selectedProductGroup: SelectionDailogOption;
  productGroupCode: string;
  productGroupDes: string;

  selectedProdCategory: SelectionDailogOption;
  productCategoryCode = '';
  productCategoryDes = '';
  selectedConfigs: any[] = [];
  searchByArray: SelectDropDownOption[];
  searchByFormControl = new FormControl(EligibilityConfigurationEnum.PRODUCTCATEGORYCODE);
  searchBy;
  popUpOpen = false;
  params: any;
  rowIndex: string;
  
  productMappingError = false;
  productMappingErrorMessage: string;

  constructor(
    private translate: TranslateService,
    private productGroupMappingServiceAbstraction: ProductGroupMappingServiceAbstraction,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private fieldValidatorsService: FieldValidatorsService,
    private productCategoryDialog: SelectionDialogService,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_MAX_FILTER_OPTION_SELECTION)
    public maxFilterOptionsSelection
  ) {
    this.rivaahConfigFormGroup = new FormGroup({
      eleventhDigit: new FormControl('', this.fieldValidatorsService.requiredField('Eleventh Digit')),
      grammage: new FormControl('', this.fieldValidatorsService.requiredField('Grammage')),
      occasion: new FormControl('', this.fieldValidatorsService.requiredField('Occasion')),
      isActive: new FormControl(true),
    });
   }

  ngOnInit() {
    this.searchBy = this.searchByFormControl.value;
    this.pageSizeOption = this.pageSizeOptions;
    this.minPageSize = this.pageSizeOption.reduce((a: number, b: number) =>
      a < b ? a : b
    );
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
        this.cdr.markForCheck();
      });
    this.translate
      .get([
        'pw.rivaahEligibilityConfig.productGroupCode',
        'pw.rivaahEligibilityConfig.productCategoryCode',
        'pw.rivaahEligibilityConfig.11thDigit',
        'pw.rivaahEligibilityConfig.grammage',
        'pw.rivaahEligibilityConfig.occasion',
        'pw.rivaahEligibilityConfig.isActive',
        'pw.rivaahEligibilityConfig.productGroup',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 40,
            maxWidth: 40,
          },
          {
            headerName:
              translatedMessages['pw.rivaahEligibilityConfig.productCategoryCode'],
            field: EligibilityConfigurationEnum.PRODUCTCATEGORYCODE,
            editable: false,
            width: 150,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.rivaahEligibilityConfig.productGroup'],
            field: EligibilityConfigurationEnum.PRODUCTGROUPCODE,
            width: 150,
            suppressMovable: true,
            cellRendererFramework: ProductMappingCountComponent
          },
          {
            headerName:
              translatedMessages['pw.rivaahEligibilityConfig.11thDigit'],
            suppressMovable: true,
            field: EligibilityConfigurationEnum.ELEVENTHDIGIT,
            resizable: true,
            width: 150,
            suppressSizeToFit: true
          },
          {
            headerName:
              translatedMessages['pw.rivaahEligibilityConfig.grammage'],
            field: EligibilityConfigurationEnum.GRAMMAGE,
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          },

          {
            headerName:
              translatedMessages['pw.rivaahEligibilityConfig.occasion'],
            field: EligibilityConfigurationEnum.OCCASION,
            resizable: true,
            width: 200,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName:
              translatedMessages['pw.rivaahEligibilityConfig.isActive'],
            field: EligibilityConfigurationEnum.ISACTIVE,
            suppressMovable: true,

            cellRendererFramework: ToggleButtonCellComponent,
            width: 100,
            minWidth: 100,
            flex: 1
          }
        ];

        this.searchByArray = [
          {
            value: EligibilityConfigurationEnum.PRODUCTCATEGORYCODE,
            description: translatedMessages['pw.rivaahEligibilityConfig.productCategoryCode']
          },
          {
            value: EligibilityConfigurationEnum.PRODUCTGROUPCODE,
            description: translatedMessages['pw.rivaahEligibilityConfig.productGroupCode']
          }
        ]
      });
      this.selectedGroups.pipe(takeUntil(this.destroy$)).subscribe(data => {
        this.mappedProductGroups = data;

        if (this.popUpOpen === false) {
          this.popUpOpen = true;
          this.openProductGroupsPopup(this.params, this.rowIndex, data);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rivaahEligibilityConfig']) {
      if (this.gridApi) {
        this.gridApi.setRowData(this.rivaahEligibilityConfig);
      }
    }

    if (changes['occasion']) {
      this.occasion = this.occasion?.map(data1 => ({
        value: data1.value,
        description: data1.value
      }));
    }
    
    if (changes['eleventhDigit']) {
      this.eleventhDigit = this.eleventhDigit?.map(data1 => (data1.value));
    }
  }

  getLableWithSelectedOptionsCount(
    formControlName: string,
    placeholder: string
  ): string {
    if (
      this.rivaahConfigFormGroup &&
      this.rivaahConfigFormGroup.get(formControlName) &&
      this.rivaahConfigFormGroup.get(formControlName).value &&
      this.rivaahConfigFormGroup.get(formControlName).value.length
    ) {
      return (
        placeholder +
        ' (' +
        this.rivaahConfigFormGroup.get(formControlName).value.length +
        ')'
      );
    } 
    else {
      return placeholder;
    }
  }
  productGroupMapping(params, rowIndex) {
    this.rowIndex = rowIndex;
    this.params = params;

    this.loadProductGroups.emit({
      productId: this.params.id,
      ruleId: this.ruleId,
      ruleType: RivaahConfiguration.RIVAAH_CARD_ELIGIBILITY,
    });
  }

  openProductGroupsPopup(params, rowIndex, mappedData) {
    const addedProductGroups = [];
    const removeProductGroups = [];

    this.productGroupMappingServiceAbstraction
      .open({
        selectedProductGroup: mappedData !== null ? mappedData : []
      })
      .subscribe(res => {
        this.popUpOpen = false;
        if (res) {
          if (res.type === 'apply') {
            for (const removed of res.data.removeProductGroups) {
              if (removed?.uuid) removeProductGroups.push(removed.uuid);
            }

            res.data.selectedProductGroups.forEach(productGroups => {
              if (
                mappedData.map(data => data.id).indexOf(productGroups.id) ===
                -1
              ) {
                addedProductGroups.push(productGroups.id);
              }
            });
            mappedData = res.data.selectedProductGroups;

            if (rowIndex !== null) {
              const rowNode = this.gridApi.getRowNode(
                rowIndex
              );

              rowNode.data.productGroup = mappedData;
              rowNode.data.productGroupCount = mappedData.length;
              const res1 = this.gridApi.applyTransaction({
                update: [rowNode.data]
              });
              this.gridApi.redrawRows({
                rowNodes: res1.update
              });
            }
            const saveProductGroup = {
              productId: params.id,
              ruleId: this.ruleId,
              ruleType: RivaahConfiguration.RIVAAH_CARD_ELIGIBILITY,
              addProducts: addedProductGroups,
              removeProducts: removeProductGroups,
            };
            if (
              saveProductGroup.addProducts.length > 0 ||
              saveProductGroup.removeProducts.length > 0
            ) {
              this.mapProductGroup.emit(saveProductGroup);
            }
          }
          this.cdr.markForCheck();
        }
      });
  }

  getAllRows() {
    const rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  clearProductGroup() {
    this.productGroupCode = '';
    this.productGroupDes = '';
  }

  getprodCategoryForSelection()
  {
    let prodCategoryForSelection = [];
    prodCategoryForSelection = this.allProductCategories.filter(obj=> {
      return !this.mappedProductCategories.find(data=> {
        return obj.id === data.id
      })
    })
    return prodCategoryForSelection;
  }

  openProductCategoryPopup(){
    this.dialog.closeAll();
    this.productCategoryDialog
      .open({
        title: "Select Product Category",
        placeholder: 'Select Product Category',
        options: this.allProductCategories //getprodCategoryForSelection()
      })
      .pipe(take(1))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedProdCategory = selectedOption;
          this.productCategoryCode = this.selectedProdCategory.id;
          this.productCategoryDes = this.selectedProdCategory.description;
        }
        this.cdr.detectChanges();
      });
  }

  clearProductCategory() {
    this.selectedProdCategory = null;
    this.productCategoryCode = '';
    this.productCategoryDes = '';
  }

  resetRivaahConfigFormGroup(){
    this.rivaahConfigFormGroup.controls['eleventhDigit'].reset();
    this.rivaahConfigFormGroup.controls['grammage'].reset();
    this.rivaahConfigFormGroup.controls['occasion'].reset();
  }

  createConfig(){
    const data = this.rivaahConfigFormGroup.getRawValue();

    const addProducts = [];
    addProducts.push({
      productCategoryCode: this.productCategoryCode,
      ruleDetails: {
        data: {
          grammage: data.grammage,
          eleventhDigit: data.eleventhDigit,
          occasion: data.occasion,
          isActive: data.isActive
        },
        type: RivaahConfiguration.RIVAAH_CARD_ELIGIBILITY
      }
    });
    this.responseEvent.emit({
      configRequest : {
        ruleId: this.ruleId,
        addProducts: addProducts,
        updateProducts: [],
        removeProducts: []
      },
      configAction : EligibilityConfigurationActionEnum.CREATE
    });
    this.resetRivaahConfigFormGroup();
    this.productCategoryCode = null;
  }

  updateSelectedData(res) {
    const updateProducts = [];
    
    this.selectedConfigs.forEach(data => {
      updateProducts.push({
        id: res.id ? res.id : data.id,
        productCategoryCode: res.productCategoryCode ? res.productCategoryCode : data.productCategoryCode, 
        productGroupCode: res.productGroupCode ? res.productGroupCode : data.productGroupCode,
        ruleDetails: {
          data: {
            grammage: res.grammage ? res.grammage : data.grammage,
            eleventhDigit: 
              res.eleventhDigit !== 'ALL'
                ? res.eleventhDigit
                : data.eleventhDigit,
            occasion: 
              res.occasion ? res.occasion : data.occasion,
            isActive: 
              res.isActive ? res.isActive : data.isActive 
          },
          type: RivaahConfiguration.RIVAAH_CARD_ELIGIBILITY
        }
      });
    });

    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.responseEvent.emit({
            configRequest : {
              ruleId: this.ruleId,
            addProducts: [],
            updateProducts: updateProducts,
            removeProducts: []
            },
            configAction : EligibilityConfigurationActionEnum.UPDATE
          });
          this.disableButton = true;
        }
      });
  }

  updateConfig() {
    let eleventhDigit;
    let grammage;
    let occasion;
    
    if (this.selectedConfigs.length === 1) {
      eleventhDigit = this.selectedConfigs[0].eleventhDigit;
      grammage = this.selectedConfigs[0].grammage;
      occasion = this.selectedConfigs[0].occasion;
    }
    const dialogRef = this.dialog.open(SetLimitTabComponent, {
      width: '500px',
      height: 'auto',
      data: {
        eleventhDigitLov: this.eleventhDigit,
        occasionLov: this.occasion,
        eleventhDigit: eleventhDigit,
        grammage: grammage,
        occasion: occasion
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.updateSelectedData(res.data);
        this.searchForm.reset();
      }
    });
  }

  removeconfig() {
    const removeProducts = [];

    this.selectedConfigs.forEach(data => {
      removeProducts.push( data.id );
    });
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.removeConfirmation' 
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.responseEvent.emit({
            configRequest : {
              ruleId: this.ruleId,
              addProducts: [],
              updateProducts: [],
              removeProducts: removeProducts
            },
            configAction : EligibilityConfigurationActionEnum.DELETE
          });
          this.disableButton = true;
        }
      });
  }

  search(searchValue) {
    this.searchProductGroup.emit({
      searchBy: this.searchBy,
      searchValue: searchValue
    });
  }

  clearSearch() {
    this.searchForm.reset();
    this.gridApi.setRowData(
      this.unsavedGridData
        .concat(this.savedGridData)
        .sort((productGroup1, productGroup2) =>
          productGroup1.productGroupCode.toLocaleLowerCase() >
            productGroup2.productGroupCode.toLocaleLowerCase()
            ? 1
            : -1
        )
    );
    this.clearProductGroupSearch.emit();
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.redrawRows();
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }

  getContext() {
    return {
      componentParent: this.rivaahEligibilityConfigComponent
    };
  }

  selectionChange(id, status) {
    const updateProducts = [];
    this.gridApi.forEachNode(rowNode => {
      if(rowNode.data.id === id)
      {
        updateProducts.push({
          id: rowNode.data.id,
          productCategoryCode: rowNode.data.productCategoryCode, 
          productGroupCode: rowNode.data.productGroupCode,
          ruleDetails: {
            data: {
              grammage: rowNode.data.grammage,
              eleventhDigit: rowNode.data.eleventhDigit,
              occasion: rowNode.data.occasion,
              isActive: status
            },
            type: RivaahConfiguration.RIVAAH_CARD_ELIGIBILITY
          }
        });
      }
    })
    this.responseEvent.emit({
      configRequest : {
        ruleId: this.ruleId,
        addProducts: [],
        updateProducts: updateProducts,
        removeProducts: []
      },
      configAction : status.toString()
    });
  }

  onSelectionChanged(event) {
    if (this.gridApi.getSelectedNodes().length) {
      this.disableButton = false;
      this.selectedConfigs = event.api.getSelectedRows();
    } else {
      this.disableButton = true;
      this.selectedConfigs = [];
    }
  }

  onSearchByChanged(event) {
    if (this.searchBy !== this.searchByFormControl.value) {
      this.searchBy = this.searchByFormControl.value;
    }
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    const node = this.gridApi.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.gridApi.getValue(this.currentRowField, node);
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.productCodeField;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.popUpOpen = false;
  }
}
