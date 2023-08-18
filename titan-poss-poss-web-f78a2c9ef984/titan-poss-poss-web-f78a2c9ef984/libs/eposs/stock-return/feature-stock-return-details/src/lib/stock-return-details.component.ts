import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  ElementRef
} from '@angular/core';
import { CourierDetailsPopupComponent } from '@poss-web/eposs/shared/ui-courier-details-popup';
import {
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  StockIssueTEPGEPCarrierTypesEnum,
  printTransactionTypesEnum,
  printDocTypeEnum,
  StockIssueHistoryAPITypes,
  StockReturnItem,
  InvoiceItems,
  CfaDetails,
  CFAMaster,
  CFAddress,
  CustomErrors,
  ReturnInvoiceCFATabEnum,
  ReturnInvoiceToCFACarrierTypesEnum,
  OverlayNotificationServiceAbstraction,
  ProductGroup,
  StoreUser,
  Command,
  ShortcutServiceAbstraction,
  StockIssueTEPGEPCourierRBTypesEnum,
  PrintingServiceAbstraction,
  StockIssueTEPGEPTabTypesEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  LocationSummaryList
} from '@poss-web/shared/models';
import {
  getStockIssueDirectIssueRouteUrl,
  getStockIssueL1L2RouteUrl,
  getStockIssueRouteUrl,
  getStockReturnHomeDefaultRouteUrl,
  getStockReturnHomeRouteUrl
} from '@poss-web/shared/util-site-routes';
import { combineLatest, Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { StockReturnFacade } from '@poss-web/eposs/stock-return/data-access-stock-return';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import {
  ItemSearchComponent,
  ItemSearchResponse
} from '@poss-web/shared/item/ui-item-search';
import {
  SortDialogService,
  Column
} from '@poss-web/shared/components/ui-sort-dialog';

import {
  FilterService,
  Filter
} from '@poss-web/shared/components/ui-filter-dialog';
import { TranslateService } from '@ngx-translate/core';
import { ItemSearchListComponent } from '@poss-web/shared/item/ui-item-search';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { Router } from '@angular/router';
import { SelectDropdownComponent } from '@poss-web/shared/components/ui-form-field-controls';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { CreditNoteTransferFacade } from '@poss-web/poss/cn-transfer/data-access-cn-transfer';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';

const SEARCH_SHORTCUT_KEY_F2 = 'StockReturnDetailsComponent.MAIN_SEARCH';
const SECONDARY_SEARCH_SHORTCUT_KEY =
  'StockReturnDetailsComponent.SECONDARY_SEARCH';
const FILTER_SHORTCUT_KEY_F8 = 'StockReturnDetailsComponent.FILTER';
const SORT_SHORTCUT_KEY_F9 = 'StockReturnDetailsComponent.SORT';
const CLEAR_ALL_SHORTCUT_KEY = 'StockReturnDetailsComponent.CLEAR_ALL';
const SELECT_ALL_SHORTCUT_KEY = 'StockReturnDetailsComponent.SELECT_ALL';
const SELECT_CURRENT_PAGE_SHORTCUT_KEY =
  'StockReturnDetailsComponent.SELECT_CURRENT_PAGE';
const SELECT_BACK_BUTTON_SHORTCUT_KEY = 'StockReturnDetailsComponent.BACK';
const BOX_DETAILS_SHORTCUT_KEY = 'StockReturnDetailsComponent.PRIMARY_DROPDOWN';
const componentName = 'StockReturnDetailsComponent';
const COURIER_DROPDOWN_SHORTCUT_KEY =
  'StockReturnDetailsComponent.SECONDARY_DROPDOWN';

const SORT_DATA = [
  {
    id: 0,
    sortByColumnName: 'Item Weight',
    sortAscOrder: false
  },
  {
    id: 1,
    sortByColumnName: 'Item Quantity',
    sortAscOrder: false
  }
];
@Component({
  selector: 'poss-web-stock-return-details',
  templateUrl: './stock-return-details.component.html',
  styleUrls: ['./stock-return-details.component.scss']
})
export class StockReturnDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(ItemSearchListComponent, { static: true })
  searchListRef: ItemSearchListComponent;
  @ViewChild(ItemSearchComponent, { static: true })
  searchRef: ItemSearchComponent;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  boxDetails_count = 0;
  boxDetails_values: any;
  returnInvoiceCFATabRef = ReturnInvoiceCFATabEnum;
  ReturnInvoiceToCFACarrierTypesEnumRef = ReturnInvoiceToCFACarrierTypesEnum;
  initailPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  issuedItemsPageEvent: PageEvent = this.initailPageEvent;
  courierDetailsResponse: { value: string; description: string }[];
  sortData: Column[] = [];
  type: string;
  stockId: number;
  select: boolean;
  storeType: string;
  invoiceNumber: number;
  selectedProductsSearchCount: number;
  hasNotification = false;
  selected = 'select cfa';
  searchedItems$: Observable<StockReturnItem[]>;
  searchResult: StockReturnItem[] = [];
  isLoading$: Observable<boolean>;
  selectedLocationDetails: SelectionDailogOption;
  CFAItems: StockReturnItem[] = [];
  CFAItems$: Observable<StockReturnItem[]>;
  isItems: boolean;
  items: StockReturnItem[] = [];
  cfaCode$: Observable<CfaDetails>;
  totalItemsCount$: Observable<number>;
  id: number;
  totalCount: number;
  cartItemIds$: Observable<number[] | string[]>;
  itemsInCart$: Observable<StockReturnItem[]>;
  invoiceItems: InvoiceItems[] = [];
  stockItems: InvoiceItems[] = [];
  hasSearchedItem$: Observable<boolean>;
  hasIssueItemSuccess$: Observable<boolean>;
  hasCartProducts$: Observable<boolean>;
  hasLoaded$: Observable<boolean>;
  error$: Observable<CustomErrors>;
  searchValue = null;
  cartCount = 0;
  isSearchingItems$: Observable<boolean>;
  hasSearchedItems$: Observable<boolean>;
  hasSelectedProductsSearchedItems$: Observable<boolean>;
  totalItemsCount = 0;
  cfaMasterDetails: CFAMaster[] = [];
  isRemoving: boolean;
  selectedItemsTotalCount = 0;
  sortBy: string;
  sortOrder: string;
  itemId = null;
  lotNumber = null;
  onSearchFlag: boolean;
  selectForm = this.fb.group({
    selectRadioButton: ['']
  });
  removeLineItem = [];
  locationCode: string;
  selectionAll: boolean;
  selectionAllSubscription: any;
  totalRows: number;
  selectionAllSubject: Subject<any> = new Subject<any>();
  selectionAllObservable = this.selectionAllSubject.asObservable();
  itemIds: number[] = [];
  ids: number[] = [];
  rowNumber = 0;
  searchCount: number;
  hasSelectedProductsSearch: boolean;
  filterData: { [key: string]: Filter[] } = {};
  filter: { key: string; value: any[] }[] = [];
  searchForm: FormGroup;
  maxSortLimit: number;
  maxFilterLimit: number;
  CFAddress: any;
  pageSizeOptions: number[] = [];
  minPageSize;
  isLoadingFilterOptions$: Observable<boolean>;
  form: FormGroup;
  formList: FormArray;
  selectedFormName: string = StockIssueTEPGEPCourierRBTypesEnum.COURIER;
  headerLevelDetails: any;
  isBoxWeightValid: boolean;
  totalBoxWeight: number;
  employeeCodes: string[];
  isReadOnly: boolean;
  employeeDetailsResponse$: Observable<StoreUser[]>;
  employeeCodesResponse$: Observable<string[]>;
  PRODUCT_CATEGORIES: { [key: string]: Filter[] } = {};
  PRODUCT_GROUP: { [key: string]: Filter[] } = {};
  courierDocketNumberLabel: string;
  courierRoadPermitNumberLabel: string;
  sourceLocationLabel: string;
  searchLocationLabel: string;
  employeeIDLabel: string;
  employeeNameLabel: string;
  employeeMobileNumberLabel: string;
  productCategories: { [key: string]: Filter[] } = {};
  productGroups: { [key: string]: Filter[] } = {};
  private destroy$ = new Subject<null>();
  productCategoryFilterLable: string;
  productGroupFilterLable: string;
  issueType: string;
  printErrorText: string;
  stockIssueTEPGEPCourierRBTypesEnumRef = StockIssueTEPGEPCourierRBTypesEnum;
  isShowNotification = null;
  courierName: string;
  stockIssueTEPGEPTabTypesEnumRef = StockIssueTEPGEPTabTypesEnum;
  @ViewChild('typeDropdown', { static: true, read: ElementRef })
  typeDropdown: ElementRef;
  @ViewChild(SelectDropdownComponent)
  selectDropdownRef: SelectDropdownComponent;

  noDataFoundMessage: string;
  boxDetails: any;
  measuredWeight: any;
  weightUnit: any;
  totalMeasuredQuantity: any;
  selectedProductsTabType: StockIssueTEPGEPTabTypesEnum;
  weightlable: any;
  currencyCode: any;
  isLoadImageUrl: boolean;
  isLoadSearchedImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  cfaToAddress = [];
  isL1L2Store: boolean;
  isL3Store: boolean;
  locationForSelection: any;
  LocationCodeform: FormGroup;
  Locationcode = [];
  constructor(
    private stockReturnFacade: StockReturnFacade,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private fb: FormBuilder,
    private selectionDialog: SelectionDialogService,
    private sortService: SortDialogService,
    private filterService: FilterService,
    private shortcutService: ShortcutServiceAbstraction,
    private appsettingFacade: AppsettingFacade,
    private authFacade: AuthFacade,
    public dialog: MatDialog,
    private cnTransferFacade: CreditNoteTransferFacade,
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private printingService: PrintingServiceAbstraction,
    private commonFacade: CommonFacade,
    private profiledatafacade: ProfileDataFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    this.stockReturnFacade.createRequestToCfa();
    this.stockReturnFacade.loadCFAddress();
    this.translate
      .get(['pw.entity.invoiceTocfaEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.invoiceTocfaEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });
    this.translateService
      .get([
        'pw.returnInvoiceCFA.courierDocketNumberText',
        'pw.returnInvoiceCFA.courierPermitNumber',
        'pw.returnInvoiceCFA.employeeNameText',
        'pw.returnInvoiceCFA.mobileNoText',
        'pw.returnInvoiceCFA.productCategoryFilterLable',
        'pw.returnInvoiceCFA.productGroupFilterLable',
        'pw.creditNote.searchByLocationPlaceHolder',
        'pw.creditNote.srcLocationText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.courierDocketNumberLabel =
          translatedLabels['pw.returnInvoiceCFA.courierDocketNumberText'];
        this.courierRoadPermitNumberLabel =
          translatedLabels['pw.returnInvoiceCFA.courierPermitNumber'];
        this.employeeNameLabel =
          translatedLabels['pw.returnInvoiceCFA.employeeNameText'];
        this.employeeMobileNumberLabel =
          translatedLabels['pw.returnInvoiceCFA.mobileNoText'];
        this.productCategoryFilterLable =
          translatedLabels['pw.returnInvoiceCFA.productCategoryFilterLable'];
        this.productGroupFilterLable =
          translatedLabels['pw.returnInvoiceCFA.productGroupFilterLable'];
        this.searchLocationLabel =
          translatedLabels['pw.creditNote.searchByLocationPlaceHolder'];
        this.sourceLocationLabel =
          translatedLabels['pw.creditNote.srcLocationText'];
      });
    this.searchForm = new FormGroup({
      searchValue: new FormControl('')
    });
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
    this.form = this.fb.group({
      formCollection: this.fb.array([this.createcourierForm()])
    });
    this.formList = this.form.get('formCollection') as FormArray;
    this.sortService.DataSource = SORT_DATA;
  }
  ngOnInit() {
    this.cnTransferFacade.loadLocationCodes();
    combineLatest([
      this.profiledatafacade.getBoutiqueType(),
      this.profiledatafacade.isL1Boutique(),
      this.profiledatafacade.isL2Boutique(),
      this.profiledatafacade.isL3Boutique()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([val, val1, val2, val3]) => {
        this.storeType = val;
        this.isL1L2Store = val1 || val2;
        this.isL3Store = val3;
      });
    this.stockReturnFacade.loadStuddedProductGroups();
    this.stockReturnFacade.loadProductCategories();
    this.stockReturnFacade.loadProductGroups();
    this.stockReturnFacade.resetError();
    this.stockReturnFacade
      .getNewRequestId()
      .pipe(takeUntil(this.destroy$))
      .subscribe((id: number) => {
        if (id) {
          this.stockId = id;
          this.stockReturnFacade.loadHeaderLevelDetails(this.stockId);
          this.getCFAItems();
        }
      });
    this.componentInit();
    this.stockReturnFacade.loadEmployeeCodes();
    this.LocationCodeform = this.fb.group({
      locationCodes: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.sourceLocationLabel)
      ])
    });

    this.authFacade
      .getLocationCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationCode = data;
      });
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.initailPageEvent.pageSize = pageSize;
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
      });
    this.appsettingFacade
      .getMaxFilterLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxFilterLimit = data;
      });
    this.appsettingFacade
      .getMaxSortLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxSortLimit = data;
      });

    this.stockReturnFacade
      .getProductCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(productCategories => {
        this.productCategories = this.mapToFilterOptions(
          this.productCategoryFilterLable,
          productCategories.map(productCategory => ({
            id: productCategory.productCategoryCode,
            description: productCategory.description,
            selected: false
          }))
        );
      });
    this.stockReturnFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroups: ProductGroup[]) => {
        this.productGroups = this.mapToFilterOptions(
          this.productGroupFilterLable,
          productGroups.map((productGroup: ProductGroup) => ({
            id: productGroup.productGroupCode,
            description: productGroup.description,
            selected: false
          }))
        );
      });
    this.form.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.showNotification();
    });
    this.stockReturnFacade.loadCourierDetails();
    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.cnTransferFacade
      .getLocationCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: LocationSummaryList[]) => {
        if (locations.length !== 0) {
          this.locationForSelection = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description,
            additionalProperty: location.isMigrated
          }));
        }
      });
  }

  print() {
    if (this.isL3Store) {
      this.printingService.loadPrintData({
        printType: StockIssueHistoryAPITypes.BTQ_CFA,
        transacionId: this.stockId,
        transacionType: printTransactionTypesEnum.RETURN_INVOICE,
        doctype: printDocTypeEnum.STOCK_PRINT
      });
    } else if (this.isL1L2Store) {
      this.printingService.loadPrintData({
        printType: 'BTQ_BTQ',
        transacionId: this.stockId,
        transacionType: this.isL3Store
          ? printTransactionTypesEnum.RETURN_INVOICE
          : printTransactionTypesEnum.STOCK_TRANSFER,
        doctype: printDocTypeEnum.STOCK_PRINT
      });
    }
  }

  shortcutEventHandler(command: Command): void {
    switch (command.name) {
      case SEARCH_SHORTCUT_KEY_F2: {
        if (this.searchListRef) {
          this.dialog.closeAll();
          this.searchListRef.focus();
        }
        break;
      }
      case SECONDARY_SEARCH_SHORTCUT_KEY: {
        if (this.searchRef) {
          this.dialog.closeAll();
          this.searchRef.focus();
        }
        break;
      }
      case FILTER_SHORTCUT_KEY_F8: {
        this.openFilter();
        break;
      }
      case SORT_SHORTCUT_KEY_F9: {
        this.openSortDailog();
        break;
      }
      case CLEAR_ALL_SHORTCUT_KEY: {
        this.dialog.closeAll();
        this.clearAll();
        break;
      }
      case SELECT_ALL_SHORTCUT_KEY: {
        this.dialog.closeAll();
        this.selectAll();
        this.selectForm.patchValue({
          selectRadioButton: '1'
        });
        break;
      }
      case SELECT_CURRENT_PAGE_SHORTCUT_KEY: {
        this.dialog.closeAll();
        this.selectPagewise();
        this.selectForm.patchValue({
          selectRadioButton: '2'
        });
        break;
      }
      case SELECT_BACK_BUTTON_SHORTCUT_KEY: {
        this.back();
        break;
      }
      case BOX_DETAILS_SHORTCUT_KEY: {
        if (
          this.selectedFormName !== ReturnInvoiceToCFACarrierTypesEnum.HandCarry
        ) {
          this.dialog.closeAll();
          this.boxDetailsPopup();
        }
        break;
      }

      case COURIER_DROPDOWN_SHORTCUT_KEY: {
        if (this.selectDropdownRef) this.selectDropdownRef.focus();
        break;
      }
    }
  }

  private mapToFilterOptions(
    key: string,
    options: Filter[]
  ): { [key: string]: Filter[] } {
    return {
      [key]: options
    };
  }

  openLocationCodes() {
    this.dialog.closeAll();
    let titleLabel = '';
    let placeHolderLabel = '';
    this.translate
      .get([this.sourceLocationLabel, this.searchLocationLabel])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        (titleLabel = translatedMsg[this.sourceLocationLabel])(
          (placeHolderLabel = translatedMsg[this.searchLocationLabel])
        );
      });

    this.selectionDialog
      .open({
        title: titleLabel,
        placeholder: placeHolderLabel,
        options: this.locationForSelection.filter(
          location => location.id !== this.locationCode
        )
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedLocationDetails = selectedOption;
          this.LocationCodeform.get(['locationCodes']).patchValue(
            selectedOption.id
          );
        }
      });
  }

  search(searchData: ItemSearchResponse) {
    if (searchData.isValid) {
      this.issuedItemsPageEvent = this.initailPageEvent;
      this.itemId = searchData.searchValue;
      this.lotNumber = searchData.lotNumber;
      this.isLoadImageUrl = true;
      this.stockReturnFacade.selectedProductsSearch({
        id: this.stockId,
        pageIndex: this.issuedItemsPageEvent.pageIndex,
        pageSize: this.issuedItemsPageEvent.pageSize,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        itemId: this.itemId,
        lotNumber: this.lotNumber,
        filter: this.filter
      });
    } else {
      this.stockReturnFacade.resetStockReturnItems();
    }
  }
  onSearchClear(): void {
    this.stockReturnFacade.clearSearch();
    this.clearSearchItems();
  }

  componentInit() {
    this.isLoading$ = this.stockReturnFacade.getIsloading();
    this.isSearchingItems$ = this.stockReturnFacade.getHasSearched();
    this.CFAItems$ = this.stockReturnFacade.getCFAItems();
    this.searchedItems$ = this.stockReturnFacade.getSearchedItems();
    this.hasSearchedItems$ = this.stockReturnFacade.getHasSearchResult();
    this.hasSelectedProductsSearchedItems$ = this.stockReturnFacade.getHasSelectedProductsSearch();
    this.stockReturnFacade
      .getCourierDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((courierNames: string[]) => {
        if (courierNames) {
          this.courierDetailsResponse = [];
          courierNames.forEach(courierName => {
            this.courierDetailsResponse.push({
              value: courierName,
              description: courierName
            });
          });
        }
      });
    this.employeeCodesResponse$ = this.stockReturnFacade.getEmployeeCodes();
    this.employeeDetailsResponse$ = this.stockReturnFacade.getEmployeeDetails();

    this.stockReturnFacade
      .getCFACode()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cfaAddress: CFAddress) => {
        if (cfaAddress) {
          this.CFAddress = cfaAddress;
        }
      });
    this.stockReturnFacade
      .getCFACode()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.cfaToAddress = data?.cfaStoreDetails;
          //console.log(this.cfaToAddress[0],'cfainside')
        }
      });

    this.employeeCodesResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          this.employeeCodes = data;
        }
      });
    this.employeeDetailsResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          this.formList.controls[0].patchValue(
            {
              employeeName: data[0].empName,
              employeeMobileNumber: data[0].mobileNo
            },
            { eventEmit: false }
          );
        }
      });
    this.stockReturnFacade
      .getSelectedProductsSearchCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedProductsSearchCount => {
        this.selectedProductsSearchCount = selectedProductsSearchCount;
      });

    this.stockReturnFacade
      .getSearchCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.searchCount = count;
      });
    this.searchedItems$
      .pipe(
        withLatestFrom(
          this.commonFacade.getCommonFacadeAttributes(
            CommomStateAttributeTypeEnum.INVENTORY,
            CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([items, imageCatalogueDetails]) => {
        if (this.isL3Store && items.length === 1) {
          this.invoiceItems = [];
          this.invoiceItems.push({
            inventoryId: items[0].id
          });
          this.issueItems();
        } else if (this.isL1L2Store && items.length === 1) {
          this.stockItems = [];
          this.stockItems.push({
            inventoryId: items[0].id
          });
          this.directissueItems();
        }
        if (items.length !== 0) {
          if (
            this.isLoadSearchedImageUrl &&
            items.length > 0 &&
            imageCatalogueDetails
          )
            this.loadImage(items, imageCatalogueDetails, true);
        }
      });

    this.CFAItems$.pipe(
      withLatestFrom(
        this.commonFacade.getCommonFacadeAttributes(
          CommomStateAttributeTypeEnum.INVENTORY,
          CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe(([data, imageCatalogueDetails]) => {
      if (data.length !== 0) {
        if (this.isLoadImageUrl && data.length > 0 && imageCatalogueDetails)
          this.loadImage(data, imageCatalogueDetails, false);
      }
      if (data.length > 0) {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();
      }
      this.ids = [];
      this.itemIds = [];
      if (this.selectForm.value.selectRadioButton === '1') {
        this.selectionAllSubject.next({
          selectCheckbox: true,
          enableCheckbox: false
        });
      } else if (this.selectForm.value.selectRadioButton === '2') {
        this.selectionAllSubject.next({
          selectCheckbox: false,
          enableCheckbox: true
        });
        this.selectForm.patchValue({
          selectRadioButton: null
        });
      }
      data.forEach(element => {
        this.ids.push(element.id);
      });
      if (this.hasSelectedProductsSearch) {
        this.selectionAllSubject.next({
          selectCheckbox: true,
          enableCheckbox: true
        });
        this.itemIds = this.ids;
      }

      this.showNotification();
    });

    this.stockReturnFacade
      .getHasRemovedMultipleItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasRemovedMultipleItems => {
        if (hasRemovedMultipleItems) {
          this.clearAll();
          this.clearSearchItems();
          this.getCFAItems();
          if (this.stockId) {
            this.stockReturnFacade.loadHeaderLevelDetails(this.stockId);
          }
        }
      });
    this.stockReturnFacade
      .getTotalItemsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalItemsCount => {
        this.totalItemsCount = totalItemsCount;
        this.showNotification();
      });

    this.stockReturnFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.stockReturnFacade
      .getHasItemsIssued()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasIssued => {
        if (hasIssued) {
          this.searchListRef.reset();
          this.getCFAItems();
          if (this.stockId) {
            this.stockReturnFacade.loadHeaderLevelDetails(this.stockId);
          }
        }
      });

    this.stockReturnFacade
      .getconfirmedReturnInvoiceCfa()
      .pipe(takeUntil(this.destroy$))
      .subscribe((invoiceNumber: number) => {
        this.invoiceNumber = invoiceNumber;

        if (this.invoiceNumber !== null) {
          this.showConfirmIssueSuccessNotification();
        }
      });
    this.stockReturnFacade
      .getHeaderLevelDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(headerLevelDetails => {
        if (headerLevelDetails) {
          this.headerLevelDetails = headerLevelDetails;
          (this.measuredWeight = this.headerLevelDetails.measuredWeight),
            (this.weightUnit = this.headerLevelDetails.measuredValue),
            (this.totalMeasuredQuantity = this.headerLevelDetails.measuredQuantity),
            (this.weightlable = this.headerLevelDetails.weightUnit),
            (this.currencyCode = this.headerLevelDetails.currencyCode);
          console.log(this.headerLevelDetails, 'header');
        }
      });
  }
  loadForm(event): void {
    this.formList.clear();
    this.selectedFormName = event.value;
    if (event.value !== StockIssueTEPGEPCourierRBTypesEnum.HANDCARRY) {
      this.formList.push(this.createcourierForm());
    } else {
      this.formList.push(this.createEmployeeForm());
    }
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
  employeeIDSelected(event: any, employeeCode: string) {
    if (event.isUserInput) {
      this.isReadOnly = true;
      if (this.employeeCodes.includes(employeeCode)) {
        this.formList.controls[0].patchValue({
          employeeID: employeeCode
        });
        this.stockReturnFacade.loadEmployeeDetails(employeeCode);
      }
    }
  }

  employeeIDChange(value) {
    const employeeInput = value;
    if (this.employeeCodes.includes(employeeInput)) {
      this.isReadOnly = true;
      this.stockReturnFacade.loadEmployeeDetails(employeeInput);
    } else {
      this.isReadOnly = false;
      this.formList.controls[0].patchValue({
        employeeName: '',
        employeeMobileNumber: ''
      });
    }
  }
  boxDetailsPopup() {
    this.overlayNotification.close();
    if (!this.boxDetails_values) {
      this.boxDetails_values = [];
    }
    const dialogRef = this.dialog.open(CourierDetailsPopupComponent, {
      width: '60vw',
      data: {
        boxDetails: this.boxDetails_values,
        measuredWeight: this.headerLevelDetails.measuredWeight,
        weightUnit: this.headerLevelDetails.weightUnit
      },
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.boxDetails_count = res.count;
          this.boxDetails_values = res.value;
          this.isBoxWeightValid = res.isBoxWeightValid;
          this.totalBoxWeight = res.totalBoxWeight;
        }
        this.showNotification();
      });
  }
  createcourierForm(): FormGroup {
    return this.fb.group({
      courierName: new FormControl(null),
      courierDocketNumber: [
        '',
        [
          this.fieldValidatorsService.requiredField(
            this.courierDocketNumberLabel
          ),
          this.fieldValidatorsService.courierDocNoField(
            this.courierDocketNumberLabel
          ),
          this.fieldValidatorsService.maxLength(
            30,
            this.courierDocketNumberLabel
          )
        ]
      ],
      courierRoadPermitNumber: [
        '',
        [
          // this.fieldValidatorsService.requiredField(
          //   this.courierRoadPermitNumberLabel
          // ),
          this.fieldValidatorsService.courierRoadPermitNoField(
            this.courierRoadPermitNumberLabel
          )
        ]
      ]
    });
  }

  createEmployeeForm(): FormGroup {
    return this.fb.group({
      employeeID: [
        '',
        [
          this.fieldValidatorsService.requiredField('Employee ID'),
          this.fieldValidatorsService.alphaNumericField('Employee ID')
        ]
      ],
      employeeName: [
        '',
        [
          this.fieldValidatorsService.nameWithSpaceField(
            this.employeeNameLabel
          ),
          this.fieldValidatorsService.requiredField(this.employeeNameLabel)
        ]
      ],
      employeeMobileNumber: [
        '',
        [
          this.fieldValidatorsService.mobileField(
            this.employeeMobileNumberLabel
          ),
          this.fieldValidatorsService.requiredField(
            this.employeeMobileNumberLabel
          )
        ]
      ],

      permitNumber: [
        '',
        [
          // this.fieldValidatorsService.requiredField(
          //   this.courierRoadPermitNumberLabel
          // ),
          this.fieldValidatorsService.courierRoadPermitNoField(
            this.courierRoadPermitNumberLabel
          )
        ]
      ]
    });
  }
  selectionChange(courierName) {
    this.courierName = courierName.value;
  }

  showNotification() {
    // if (this.form.invalid) {
    //   this.messageNotification(
    //     'pw.returnInvoiceCFA.enterCarrierDetailsMessage'
    //   );
    // } else
    if (
      this.form.valid &&
      this.boxDetails_count < 1 &&
      this.selectedFormName !== StockIssueTEPGEPCourierRBTypesEnum.HANDCARRY
    ) {
      this.messageNotification('pw.returnInvoiceCFA.enterBoxDetailsMesage');
    } else if (
      this.form.valid &&
      this.headerLevelDetails.totalMeasuredWeight > this.totalBoxWeight &&
      this.selectedFormName !== StockIssueTEPGEPCourierRBTypesEnum.HANDCARRY
    ) {
      this.messageNotification('pw.returnInvoiceCFA.boxWeightErrorMsg');
    } else if (
      this.form.valid &&
      this.totalItemsCount > 0 &&
      this.selectedProductsSearchCount === null &&
      this.CFAddress.locationCode
    ) {
      this.showConfirmIssueNotifications();
    } else if (this.form.valid && this.CFAddress.locationCode) {
      this.noCFAConfiguredNotification();
    } else this.overlayNotification.close();
    if (
      this.form.valid &&
      this.selectForm.value.selectRadioButton === '1' &&
      this.totalItemsCount > 0
    ) {
      this.removeProductsOverlay(
        '',
        'pw.returnInvoiceCFA.allItemsSelectionNotificationMsg'
      );
    } else if (
      this.form.valid &&
      this.selectForm.value.selectRadioButton === '2' &&
      this.itemIds.length > 0
    ) {
      this.removeProductsOverlay(
        '',
        'pw.returnInvoiceCFA.currentPageSelectionNotificationMsg'
      );
    } else if (
      this.form.valid &&
      this.itemIds.length > 0 &&
      this.totalItemsCount > 0
    ) {
      this.removeProductsOverlay(
        this.itemIds.length,
        'pw.returnInvoiceCFA.productsSelectedText'
      );
    }
    if (this.totalItemsCount === 0) this.overlayNotification.close();
  }

  messageNotification(key: string): void {
    this.hasNotification = true;
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          message: translatedMessage,
          hasClose: true
        });
      });
  }

  noCFAConfiguredNotification() {
    const key = 'pw.returnInvoiceCFA.noCFAConfiguredMessage';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message: translatedMessage
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
          });
      });
  }
  removeProductsOverlay(count, msg: any) {
    this.translate
      .get(msg)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: 'Remove Products',
            message: count + ' ' + translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.stockReturnFacade.removeSelectedItems({
                requestId: this.stockId,
                itemIds: this.itemIds
              });
              this.ids = [];
            }
          });
      });
  }
  /**
   * Searhes the items by Variant Code
   */
  onSearch(searchResponse: ItemSearchResponse) {
    this.onSearchFlag = true;
    if (searchResponse.isValid) {
      //this.isLoadSearchedImageUrl = true;
      this.stockReturnFacade.searchItems({
        id: this.stockId,
        variantCode: searchResponse.searchValue,
        lotNumber: searchResponse.lotNumber
      });
    }
    //this.showNotification();
  }

  getCFAItems() {
    if (this.stockId) {
      this.isLoadImageUrl = true;
      this.stockReturnFacade.loadItemCFA({
        id: this.stockId,
        pageIndex: this.issuedItemsPageEvent.pageIndex,
        pageSize: this.issuedItemsPageEvent.pageSize,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        itemId: this.itemId,
        filter: this.filter
      });
    }
  }

  addToCart(items: StockReturnItem[]) {
    this.invoiceItems = [];
    this.stockItems = [];
    items.forEach(item => {
      if (this.isL3Store) {
        this.invoiceItems.push({
          inventoryId: item.id
        });
      } else if (this.isL1L2Store) {
        this.stockItems.push({
          inventoryId: item.id
        });
      }
    });
    if (this.isL3Store) {
      this.issueItems();
    }
    if (this.isL1L2Store) {
      this.directissueItems();
    }
    this.searchCount = null;
    this.stockReturnFacade.clearSearchItems();
    // this.showNotification();
  }

  clearSearchedItems() {
    this.stockReturnFacade.clearSearchItems();
  }

  issueItems() {
    this.stockReturnFacade.createIssueItems({
      id: this.stockId,
      invoiceItems: this.invoiceItems
    });
  }

  directissueItems() {
    this.stockReturnFacade.createIssueItems({
      id: this.stockId,
      stockItems: this.stockItems
    });
  }
  /**
   *
   * Handler for overlay notification
   */
  openSortDailog() {
    this.dialog.closeAll();
    this.sortService
      .openDialog(this.maxSortLimit, this.sortData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        // TODO : Enum
        if (sortResult.actionfrom === 'apply') {
          const sortData = sortResult.data;
          if (sortData == null || sortData.length === 0) {
            this.sortData = [];
            this.sortOrder = null;
            this.sortBy = null;
          } else {
            this.sortData = sortData;
            if (sortData.length > 0) {
              if (sortData[0].id === 0) {
                this.sortBy = 'availableWeight';
              } else if (sortData[0].id === 1) {
                this.sortBy = 'availableQuantity';
              }
              this.sortOrder = sortData[0].sortAscOrder ? 'asc' : 'desc';
            }
          }
          this.issuedItemsPageEvent = this.initailPageEvent;
          this.getCFAItems();
        }
      });
  }
  openFilter() {
    this.filterService.DataSource = {
      ...this.productCategories,
      ...this.productGroups
    };
    this.dialog.closeAll();
    this.filterService
      .openDialog(this.maxFilterLimit, this.filterData)
      .pipe(take(1))
      .subscribe(
        (filterResult: {
          data: { [key: string]: Filter[] };
          actionfrom: string;
        }) => {
          if (filterResult.actionfrom === 'apply') {
            const filterData = filterResult.data;
            if (filterData == null) {
              this.filterData = {};
            } else {
              this.filterData = filterData;
            }
            this.filter = [];
            if (filterData) {
              let filterValues = [];
              if (filterData[this.productGroupFilterLable]) {
                filterData[this.productGroupFilterLable].forEach(value => {
                  filterValues.push(value.id);
                });
                if (filterValues.length > 0) {
                  this.filter.push({
                    key: 'productGroup',
                    value: filterValues
                  });
                }
              }
              filterValues = [];
              if (filterData[this.productCategoryFilterLable]) {
                filterData[this.productCategoryFilterLable].forEach(value => {
                  filterValues.push(value.id);
                });
                if (filterValues.length > 0) {
                  this.filter.push({
                    key: 'productCategory',
                    value: filterValues
                  });
                }
              }
            }

            this.issuedItemsPageEvent = this.initailPageEvent;
            this.getCFAItems();
          }
        }
      );
  }

  showConfirmIssueNotifications() {
    this.isShowNotification = true;
    const key = 'pw.returnInvoiceCFA.confirmIssueMessage';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message:
              this.totalItemsCount +
              ' ' +
              translatedMessage +
              ' ' +
              this.stockId,
            buttonText: 'CONFIRM ISSUE',
            hasRemarks: true,
            isRemarksMandatory: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.showProgressNotification();
              if (
                this.selectedFormName ===
                StockIssueTEPGEPCourierRBTypesEnum.HANDCARRY
              ) {
                this.stockReturnFacade.confirmIssue({
                  id: this.stockId,
                  confirmIssue: {
                    carrierDetails: {
                      type: ReturnInvoiceToCFACarrierTypesEnum.employee,
                      data: {
                        employeeId: this.form.value.formCollection[0]
                          .employeeID,
                        employeeName: this.form.value.formCollection[0]
                          .employeeName,
                        designation: '',
                        emailId: '',
                        mobileNo: this.form.value.formCollection[0]
                          .employeeMobileNumber,
                        brand: '',
                        roadPermitNumber: this.form.value.formCollection[0]
                          .permitNumber,
                        numberOfBoxes: 0,
                        boxDetails: []
                      }
                    },
                    cfaLocationCode: this.CFAddress.cfaDetails.locationCode,
                    remarks: event.data,
                    destinationLocationCode: this.LocationCodeform.get(
                      'locationCodes'
                    ).value
                  }
                });
              } else {
                this.stockReturnFacade.confirmIssue({
                  id: this.stockId,
                  confirmIssue: {
                    carrierDetails: {
                      type: StockIssueTEPGEPCarrierTypesEnum.COURIER,
                      data: {
                        companyName: this.courierName,
                        docketNumber: this.form.value.formCollection[0]
                          .courierDocketNumber,
                        roadPermitNumber: this.form.value.formCollection[0]
                          .courierRoadPermitNumber,
                        numberOfBoxes: this.boxDetails_count,
                        boxDetails: this.boxDetails_values
                      }
                    },
                    cfaLocationCode: this.CFAddress.cfaDetails.locationCode,
                    remarks: event.data,
                    destinationLocationCode: this.LocationCodeform.get(
                      'locationCodes'
                    ).value
                  }
                });
              }
            }
          });
      });
  }

  showConfirmIssueSuccessNotification() {
    this.isShowNotification = false;
    const key = 'pw.returnInvoiceCFA.confirmIssueSuccessMessage';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            hasBackdrop: true,
            hasClose: true,
            message: translatedMessage + ' ' + this.invoiceNumber,
            template: this.confirmSuccessNotificationTemplate
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.stockReturnFacade.clearSearch();
              if (this.isL3Store) {
                this.router.navigate([
                  getStockIssueRouteUrl(getStockReturnHomeDefaultRouteUrl())
                ]);
              } else if (this.isL1L2Store) {
                this.router.navigate([getStockIssueDirectIssueRouteUrl()]);
              }
            }
          });
      });
  }

  showSelectCFANotifcation() {
    const key = 'pw.returnInvoiceCFA.errorMessageForSelect';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true
          })
          .events.subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.showNotification();
            }
          });
      });
  }

  showProgressNotification() {
    const key = 'pw.returnInvoiceCFA.progressMessage';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.PROGRESS,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.hasNotification = false;
          });
      });
  }

  /**
   * Removes the item from cart
   * @param item :item to remove
   */
  removeItem(item: StockReturnItem) {
    this.removeLineItem = [];
    this.removeLineItem.push(item.id);
    this.stockReturnFacade.removeSelectedItems({
      requestId: this.stockId,
      itemIds: this.removeLineItem
    });

    // this.showNotification();
  }

  change(event) {
    this.select = true;
    this.selected = event.value;
    //this.showNotification();
  }
  CFAPaginatedItems(event: PageEvent) {
    this.issuedItemsPageEvent = event;
    if (this.itemId) {
      this.stockReturnFacade.selectedProductsSearch({
        id: this.stockId,
        pageIndex: this.issuedItemsPageEvent.pageIndex,
        pageSize: this.issuedItemsPageEvent.pageSize,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        itemId: this.itemId,
        filter: this.filter
      });
    } else this.getCFAItems();
  }

  back() {
    this.dialog.closeAll();
    this.stockReturnFacade.clearSearch();
    if (this.isL3Store) {
      this.router.navigate([
        getStockIssueRouteUrl(getStockReturnHomeDefaultRouteUrl())
      ]);
    } else {
      this.router.navigate([getStockIssueDirectIssueRouteUrl()]);
    }
  }

  selectAll() {
    this.itemIds = [];
    this.selectionAllSubject.next({
      selectCheckbox: true,
      enableCheckbox: false
    });

    this.showNotification();
    (this.measuredWeight = this.headerLevelDetails.measuredWeight),
      (this.weightUnit = this.headerLevelDetails.measuredValue),
      (this.totalMeasuredQuantity = this.headerLevelDetails.measuredQuantity);
  }
  selectPagewise() {
    this.itemIds = [];
    this.selectionAllSubject.next({
      selectCheckbox: true,
      enableCheckbox: true
    });

    this.itemIds = this.ids;
    this.showNotification();
    (this.measuredWeight = this.headerLevelDetails.measuredWeight),
      (this.weightUnit = this.headerLevelDetails.measuredValue),
      (this.totalMeasuredQuantity = this.headerLevelDetails.measuredQuantity);
  }
  selectionEmit(selection: { selected: boolean; id: number }) {
    this.selectForm.patchValue({
      selectRadioButton: null
    });
    if (selection.selected) {
      const index = this.itemIds.indexOf(selection.id);
      if (index === -1) this.itemIds.push(selection.id);
    } else {
      const index = this.itemIds.indexOf(selection.id);
      if (index !== -1) this.itemIds.splice(index, 1);
    }
    this.showNotification();
  }
  selectChange() {
    if (this.selectForm.value.selectRadioButton === '1') {
      this.selectAll();
    } else if (this.selectForm.value.selectRadioButton === '2') {
      this.selectPagewise();
    }
  }
  resetRadiobutton() {
    this.selectForm.patchValue({
      selectRadioButton: null
    });
  }
  clearAll() {
    this.itemIds = [];
    this.selectForm.patchValue({
      selectRadioButton: null
    });
    this.selectionAllSubject.next({
      selectCheckbox: false,
      enableCheckbox: true
    });
    if (this.searchRef) {
      this.searchRef.reset();
    }
    if(this.isL3Store){
      this.overlayNotification.close();
    }
    // this.showNotification();
  }
  clearSearchItems() {
    this.itemId = null;
    this.lotNumber = null;
    this.getCFAItems();
    this.clearAll();
    this.stockReturnFacade.clearSearch();
  }
  errorNaviagtion(msg: string) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: msg,
        hasClose: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate([getStockReturnHomeRouteUrl()]);
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          if (this.isShowNotification) this.showNotification();
          else if (this.isShowNotification === false) {
            this.showConfirmIssueSuccessNotification();
          }
        });
    }
  }
  printError() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.TIMER,
        message: this.printErrorText,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.showConfirmIssueSuccessNotification();
      });
  }

  // Image
  loadImage(
    itemList: StockReturnItem[],
    imageCatalogueDetails,
    isSearchedItem
  ) {
    if (this.isLoadImageUrl) this.isLoadImageUrl = false;
    if (this.isLoadSearchedImageUrl) this.isLoadSearchedImageUrl = false;
    itemList.forEach(item => {
      if (item.imageURL !== null && item.imageURL !== undefined) {
        this.stockReturnFacade.loadThumbnailImageUrl({
          id: item.id.toString(),
          imageUrl: item.imageURL,
          imageCatalogueDetails: imageCatalogueDetails,
          isSearchedItem: isSearchedItem
        });
      }
    });
  }

  loadImageUrl(event, isSearchedItem) {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.INVENTORY,
        CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
      )
      .pipe(take(1))
      .subscribe(imageCatalogueDetails => {
        if (event.imageUrl !== null && event.imageUrl !== undefined) {
          this.stockReturnFacade.loadImageUrl({
            id: event.id,
            imageUrl: event.imageUrl,
            imageCatalogueDetails: imageCatalogueDetails,
            isSearchedItem: isSearchedItem
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
