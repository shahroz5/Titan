import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  TemplateRef,
  ElementRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, take, withLatestFrom } from 'rxjs/operators';

import {
  CustomErrors,
  ProductCategory,
  ProductGroup,
  LocationSummaryDetails,
  StockIssueTEPGEPTabTypesEnum,
  StockIssueTEPGEPStatusesEnum,
  StockIssueTEPGEPTypesEnum,
  StockIssueTEPGEPRadioButtonTypesEnum,
  StockIssueTEPGEPCarrierTypesEnum,
  CreateStockIssueResponse,
  StockIssueItem,
  ItemSelection,
  ItemSelectionAll,
  Column,
  Filter,
  OverlayNotificationServiceAbstraction,
  StoreUser,
  ShortcutServiceAbstraction,
  StockIssueTEPGEPCourierRBTypesEnum,
  printTransactionTypesEnum,
  printDocTypeEnum,
  PrintingServiceAbstraction,
  OverlayNotificationEventRef,
  OverlayNotificationType,
  OverlayNotificationEventType,
  Command,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum
} from '@poss-web/shared/models';
import {
  getStockIssueL1L2RouteUrl,
  getStockIssueL3RouteUrl
} from '@poss-web/shared/util-site-routes';
import {
  ItemSearchComponent,
  ItemSearchResponse
} from '@poss-web/shared/item/ui-item-search';
import { SortDialogService } from '@poss-web/shared/components/ui-sort-dialog';
import {
  FilterService,
  FilterActions
} from '@poss-web/shared/components/ui-filter-dialog';
import { IssueTEPFacade } from '@poss-web/eposs/stock-issue-tep-gep/data-access-stock-issue-tep-gep';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { CourierDetailsPopupComponent } from '@poss-web/eposs/shared/ui-courier-details-popup';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { SelectDropdownComponent } from '@poss-web/shared/components/ui-form-field-controls';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

const searchShortcutKey = 'StockIssueTEPComponent.MAIN_SEARCH';
const sortShortcutKey = 'StockIssueTEPComponent.SORT';
const filterShortcutKey = 'StockIssueTEPComponent.FILTER';
const selectAllShortcutKey = 'StockIssueTEPComponent.SELECT_ALL';
const clearAllShortcutKey = 'StockIssueTEPComponent.CLEAR_ALL';
const selectCurrentPageShortcutKey =
  'StockIssueTEPComponent.SELECT_CURRENT_PAGE';
const backShortcutKey = 'StockIssueTEPComponent.BACK';
const selectionBoxShortcutKey = 'StockIssueTEPComponent.PRIMARY_DROPDOWN';
const tab1ShortcutKey = 'Common.TAB_1';
const tab2ShortcutKey = 'Common.TAB_2';
const componentName = 'StockIssueTEPComponent';
const courierDropdownShortcutKey = 'StockIssueTEPComponent.SECONDARY_DROPDOWN';

@Component({
  selector: 'poss-web-stock-issue-tep-gep',
  templateUrl: './stock-issue-tep-gep.component.html',
  styleUrls: ['./stock-issue-tep-gep.component.scss']
})
export class StockIssueTEPComponent implements OnInit, OnDestroy {
  createStockIssueResponse$: Observable<CreateStockIssueResponse>;
  updateStockIssueResponse$: Observable<CreateStockIssueResponse>;
  selectedStockIssueResponse$: Observable<CreateStockIssueResponse>;
  getItems$: Observable<StockIssueItem[]>;
  getStockIssueItems$: Observable<StockIssueItem[]>;
  createStockIssueItemsResponse$: Observable<boolean>;
  updateAllStockIssueItemsResponse$: Observable<boolean>;
  factoryAddressResponse$: Observable<LocationSummaryDetails>;
  cfaAddressResponse$: Observable<LocationSummaryDetails>;
  courierDetailsResponse$: Observable<string[]>;
  locationCodeResponse$: Observable<string[]>;
  employeeDetailsResponse$: Observable<StoreUser[]>;
  employeeCodesResponse$: Observable<string[]>;
  isLoading$: Observable<boolean>;
  sortDataItems: Observable<Column[]>;
  sortDataStockIssueItems: Observable<Column[]>;
  filterDataItems: Observable<{ [key: string]: Filter[] }>;
  filterDataStockIssueItems: Observable<{ [key: string]: Filter[] }>;
  isCourierDetailsLoading$: Observable<boolean>;
  isFactoryAddressLoading$: Observable<boolean>;
  isEmployeeCodesLoading$: Observable<boolean>;
  isProductCategoriesLoading$: Observable<boolean>;
  isProductGroupsLoading$: Observable<boolean>;

  stockIssueTEPGEPTabTypesEnumRef = StockIssueTEPGEPTabTypesEnum;
  stockIssueTEPGEPTypesEnumRef = StockIssueTEPGEPTypesEnum;
  stockIssueTEPGEPCarrierTypesEnumRef = StockIssueTEPGEPCarrierTypesEnum;
  stockIssueTEPGEPCourierRBTypesEnumRef = StockIssueTEPGEPCourierRBTypesEnum;

  itemForm: FormGroup;
  form: FormGroup;
  LocationCodeform: FormGroup;
  formList: FormArray;
  formListLocationCode: FormArray;
  selectedFormName: string;

  selectedProductsTabType: StockIssueTEPGEPTabTypesEnum;
  itemIdsLength: number;
  issueId: number;
  transferType: string;
  issueType: string;
  locationCode: string;
  storeType: string;
  factoryAddress: LocationSummaryDetails;
  cfaAddress: LocationSummaryDetails;
  itemIds = [];
  selectedItemIds = [];
  hasNotification = false;
  totalItemsCount = 0;
  totalStockIssueItemsCount = 0;
  totalItemsCountDisplay = 0;
  totalStockIssueItemsCountDisplay = 0;
  pageItemsCount = 0;
  pageStockIssueItemsCount = 0;
  productToBeSavedCount = 0;
  srcDocNo: number;
  sortBy: string;
  sortOrder: string;
  sortData: Column[] = [];
  sortDataItemsTab: Column[] = [];
  sortDataStockIssueItemsTab: Column[] = [];
  filterData: { [key: string]: Filter[] } = {};
  filterDataItemsTab: { [key: string]: Filter[] } = {};
  filterDataStockIssueItemsTab: { [key: string]: Filter[] } = {};

  sortDataItemsByMap = new Map();
  filterDataItemsByMap = new Map();
  sortDataStockIssueItemsByMap = new Map();
  filterDataStockIssueItemsByMap = new Map();
  maxFilterLimit: number;
  maxSortLimit: number;
  PRODUCT_CATEGORIES: { [key: string]: Filter[] } = {};
  PRODUCT_GROUP: { [key: string]: Filter[] } = {};
  itemCode = null;
  lotNumber = null;
  employeeCodes: string[];
  isReadOnly: boolean;
  SORT_DATA: Column[];
  isBoxWeightValid: boolean;
  weightUnit: string;

  intialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  itemsPageEvent: PageEvent = this.intialPageEvent;
  stockIssueItemsPageEvent: PageEvent = this.intialPageEvent;

  @ViewChild(ItemSearchComponent, { static: true })
  searchRef: ItemSearchComponent;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild('typeDropdown', { static: true, read: ElementRef })
  typeDropdown: ElementRef;
  @ViewChild(SelectDropdownComponent)
  selectDropdownRef: SelectDropdownComponent;

  destroy$: Subject<null> = new Subject<null>();
  selectionAllSubject: Subject<ItemSelectionAll> = new Subject<
    ItemSelectionAll
  >();
  selectionAllObservable = this.selectionAllSubject.asObservable();

  boxDetails_count = 0;
  boxDetails_values: any;
  totalMeasuredWeight: number;
  totalBoxWeight: number;
  totalQuantity: number;
  pageSize = 0;
  pageSizeOptions: number[];
  dateFormat$: Observable<string>;
  isFilterOpen = false;
  isSortOpen = false;
  isL1L2Store: boolean;
  isL3Store: boolean;
  courierDocketNumberLabel: string;
  courierRoadPermitNumberLabel: string;
  employeeIDLabel: string;
  employeeNameLabel: string;
  employeeMobileNumberLabel: string;
  currencyCode: string;
  totalMeasuredValue: number;
  noDataFoundMessage: string;
  courierDetails = [];
  PrintErrorText: string;
  isLoadImageUrl: boolean;
  isLoadSearchedImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  Locationcode = [];
  loadTepGepItemList: boolean=false;
  constructor(
    private issueTEPFacade: IssueTEPFacade,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private authFacade: AuthFacade,
    private router: Router,
    private sortDialogService: SortDialogService,
    private filterService: FilterService,
    public dialog: MatDialog,
    private appsetttingFacade: AppsettingFacade,
    private profiledatafacade: ProfileDataFacade,
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private service: ShortcutServiceAbstraction,
    public printingService: PrintingServiceAbstraction,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    this.translate
      .get(['pw.entity.productEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(
            [
              'pw.global.noDataFoundMessage',
              'pw.otherReceiptsIssues.printError'
            ],
            {
              entityName: entity['pw.entity.productEntity']
            }
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
            this.PrintErrorText =
              translatedMsg['pw.otherReceiptsIssues.printError'];
          });
      });
    this.translate
      .get([
        'pw.stockIssueTepGep.totalWeightSortLabel',
        'pw.stockIssueTepGep.availableQuantitySortLabel',
        'pw.stockIssueTepGep.inwardDateLabel',
        'pw.stockIssue.courierDocketNumberText',
        'pw.stockIssue.courierPermitNumber',
        'pw.stockIssue.employeeNameText',
        'pw.stockIssue.mobileNoText',
        'pw.global.noDataFoundMessage'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.SORT_DATA = [
          {
            id: 0,
            sortByColumnName:
              translatedMessages['pw.stockIssueTepGep.totalWeightSortLabel'],
            sortAscOrder: false
          },
          {
            id: 1,
            sortByColumnName:
              translatedMessages[
                'pw.stockIssueTepGep.availableQuantitySortLabel'
              ],
            sortAscOrder: false
          },
          {
            id: 2,
            sortByColumnName:
              translatedMessages['pw.stockIssueTepGep.inwardDateLabel'],
            sortAscOrder: false
          }
        ];
        this.courierDocketNumberLabel =
          translatedMessages['pw.stockIssue.courierDocketNumberText'];
        this.courierRoadPermitNumberLabel =
          translatedMessages['pw.stockIssue.courierPermitNumber'];
        this.employeeNameLabel =
          translatedMessages['pw.stockIssue.employeeNameText'];
        this.employeeMobileNumberLabel =
          translatedMessages['pw.stockIssue.mobileNoText'];
      });
    this.form = this.formBuilder.group({
      formCollection: this.formBuilder.array([this.createcourierForm()])
    });
    this.formList = this.form.get('formCollection') as FormArray;
    this.itemForm = this.formBuilder.group({
      selectRadioButton: null
    });
    this.dateFormat$ = this.appsettingFacade.getDateFormat();
    combineLatest([
      this.profiledatafacade.isL1Boutique().pipe(takeUntil(this.destroy$)),
      this.profiledatafacade.isL2Boutique().pipe(takeUntil(this.destroy$)),
      this.profiledatafacade.isL3Boutique().pipe(takeUntil(this.destroy$))
    ]).subscribe(([val1, val2, val3]) => {
      this.isL1L2Store = val1 || val2;
      this.isL3Store = val3;
    });
  }

  ngOnInit(): void {
    this.isLoadingImage$ = this.issueTEPFacade.getIsLoadingImage();
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.issueTEPFacade.resetAll();
        this.transferType = param['transferType'];
        this.ngOnInitCall();
      });
  }

  ngOnInitCall() {
    this.issueTEPFacade.loadProductCategories();
    this.issueTEPFacade.loadProductGroups();
    this.issueTEPFacade.loadStuddedProductGroups();
    this.profiledatafacade
      .getBoutiqueType()
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.storeType = val;
      });

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => (this.intialPageEvent.pageSize = resp));

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

    this.authFacade
      .getLocationCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationCode = data;
      });

    this.issueTEPFacade
      .getProductCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ProductCategory[]) => {
        if (data !== null) {
          const PRODUCT_CATEGORIES: { [key: string]: Filter[] } = {
            'Product Category': data.map(productCategory => ({
              id: productCategory.productCategoryCode,
              description: productCategory.description,
              selected: false
            }))
          };
          this.PRODUCT_CATEGORIES = PRODUCT_CATEGORIES;
        }
      });

    this.issueTEPFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ProductGroup[]) => {
        if (data !== null) {
          const PRODUCT_GROUP: { [key: string]: Filter[] } = {
            'Product Group': data.map(productGroup => ({
              id: productGroup.productGroupCode,
              description: productGroup.description,
              selected: false
            }))
          };
          this.PRODUCT_GROUP = PRODUCT_GROUP;
        }
      });

    this.issueTEPFacade.loadCourierDetails(this.locationCode);
    if (this.transferType === 'btq-cfa') {
      this.issueTEPFacade.loadLocationCode();
    }
    this.issueTEPFacade.loadFactoryAddress();
    this.issueTEPFacade.loadCFAAddress();
    this.issueTEPFacade.loadEmployeeCodes();
    this.service.componentNames = [componentName];
    this.service.commands.pipe(takeUntil(this.destroy$)).subscribe(command => {
      this.shortcutEventHandler(command);
    });
    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.issueTEPFacade.createStockIssue({
      transferType: this.transferType.toUpperCase().replace(/-/gi, '_'),
      storeType: this.storeType
    });

    this.createStockIssueResponse$ = this.issueTEPFacade.getCreateStockIssueResponse();
    this.createStockIssueResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.issueId = data.id;
        if (data.id) {
          this.changeProductsTab(StockIssueTEPGEPTabTypesEnum.ALLPRODUCTS);
          // this.getTotalCount();
        }
      });

    this.selectedStockIssueResponse$ = this.issueTEPFacade.getSelectedStockIssueResponse();
    this.selectedStockIssueResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.totalMeasuredWeight = data.totalMeasuredWeight;
        this.weightUnit = data.weightUnit;
        this.totalMeasuredValue = data.totalMeasuredValue;
        this.totalQuantity = data.totalMeasuredQuantity;
        this.currencyCode = data.currencyCode;
      });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (
        this.selectedProductsTabType ===
          StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS &&
        this.selectedItemIds.length === 0 &&
        this.itemForm.value.selectRadioButton === null
      ) {
        this.showNotifications(0);
      } else if (
        this.selectedProductsTabType ===
        StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS
      ) {
        this.showNotifications(this.selectedItemIds.length);
      }
    });

    this.sortDataItems = this.issueTEPFacade.getSortDataItems();
    this.sortDataItems.pipe(takeUntil(this.destroy$)).subscribe(sortValue => {
      this.sortDataItemsTab = sortValue;
    });
    this.sortDataStockIssueItems = this.issueTEPFacade.getSortDataStockIssueItems();
    this.sortDataStockIssueItems
      .pipe(takeUntil(this.destroy$))
      .subscribe(sortValue => {
        this.sortDataStockIssueItemsTab = sortValue;
      });

    this.filterDataItems = this.issueTEPFacade.getfilterDataItems();
    this.filterDataItems
      .pipe(takeUntil(this.destroy$))
      .subscribe(filterValue => {
        this.filterDataItemsTab = filterValue;
      });
    this.filterDataStockIssueItems = this.issueTEPFacade.getfilterDataStockIssueItems();
    this.filterDataStockIssueItems
      .pipe(takeUntil(this.destroy$))
      .subscribe(filterValue => {
        this.filterDataStockIssueItemsTab = filterValue;
      });

    this.componentInit();
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case searchShortcutKey: {
        if (this.searchRef) {
          this.dialog.closeAll();
          this.searchRef.focus();
        }
        break;
      }
      case sortShortcutKey: {
        this.openSort();
        break;
      }
      case filterShortcutKey: {
        this.openFilter();
        break;
      }
      case selectAllShortcutKey: {
        this.dialog.closeAll();
        this.itemForm.patchValue({
          selectRadioButton: StockIssueTEPGEPRadioButtonTypesEnum.ALLPRODUCTS
        });
        this.selectAll();
        break;
      }
      case selectCurrentPageShortcutKey: {
        this.dialog.closeAll();
        this.itemForm.patchValue({
          selectRadioButton:
            StockIssueTEPGEPRadioButtonTypesEnum.CURRENTPAGEPRODUCTS
        });
        this.selectPagewise();
        break;
      }
      case clearAllShortcutKey: {
        this.dialog.closeAll();
        this.clearAll();
        break;
      }
      case backShortcutKey: {
        this.back();
        break;
      }

      case selectionBoxShortcutKey: {
        if (
          this.selectedFormName !== StockIssueTEPGEPCourierRBTypesEnum.HANDCARRY
        ) {
          this.boxDetailsPopup();
        }

        break;
      }

      case tab1ShortcutKey: {
        this.changeProductsTab(StockIssueTEPGEPTabTypesEnum.ALLPRODUCTS);
        break;
      }

      case tab2ShortcutKey: {
        this.changeProductsTab(StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS);
        break;
      }

      case courierDropdownShortcutKey: {
        if (this.selectDropdownRef) this.selectDropdownRef.focus();
        break;
      }
    }
  }

  componentInit(): void {
    this.getItems$ = this.issueTEPFacade.getItems();
    this.getStockIssueItems$ = this.issueTEPFacade.getStockIssueItems();
    this.updateStockIssueResponse$ = this.issueTEPFacade.getUpdateStockIssueResponse();
    this.createStockIssueItemsResponse$ = this.issueTEPFacade.getCreateStockIssueItemsResponse();
    this.updateAllStockIssueItemsResponse$ = this.issueTEPFacade.getUpdateAllStockIssueItemsResponse();
    this.isLoading$ = this.issueTEPFacade.getIsLoading();
    this.factoryAddressResponse$ = this.issueTEPFacade.getFactoryAddress();
    this.cfaAddressResponse$ = this.issueTEPFacade.getcfaAddress();
    this.courierDetailsResponse$ = this.issueTEPFacade.getCourierDetails();
    this.locationCodeResponse$ = this.issueTEPFacade.getLocationCode();
    this.employeeCodesResponse$ = this.issueTEPFacade.getEmployeeCodes();
    this.employeeDetailsResponse$ = this.issueTEPFacade.getEmployeeDetails();
    this.isCourierDetailsLoading$ = this.issueTEPFacade.getIsCourierDetailsLoading();
    this.isFactoryAddressLoading$ = this.issueTEPFacade.getIsFactoryAddressLoading();
    this.isEmployeeCodesLoading$ = this.issueTEPFacade.getIsEmployeeCodesLoading();
    this.isProductCategoriesLoading$ = this.issueTEPFacade.getIsProductCategoriesLoading();
    this.isProductGroupsLoading$ = this.issueTEPFacade.getIsProductGroupsLoading();
    this.issueTEPFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.issueTEPFacade
      .getTotalItemsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.totalItemsCountDisplay = data;
      });

    this.issueTEPFacade
      .getTotalStockIssueItemsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.totalStockIssueItemsCountDisplay = data;
      });

    this.getItems$
      .pipe(
        withLatestFrom(
          this.commonFacade.getCommonFacadeAttributes(
            CommomStateAttributeTypeEnum.INVENTORY,
            CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([data, imageCatalogueDetails]) => {
        this.pageItemsCount = data.length;
        this.totalItemsCount = data.length;

        if (data.length !== 0) {
          this.totalItemsCount = data[0].totalElements;
          this.itemIds = data.concat();
          this.itemIdsLength = this.itemIds.length;
          if (
            this.itemForm.value.selectRadioButton ===
            StockIssueTEPGEPRadioButtonTypesEnum.ALLPRODUCTS
          ) {
            this.selectionAllSubject.next({
              selectCheckbox: true,
              enableCheckbox: false
            });
            this.showNotifications(this.totalItemsCount);
          } else if (
            this.itemForm.value.selectRadioButton ===
            StockIssueTEPGEPRadioButtonTypesEnum.CURRENTPAGEPRODUCTS
          ) {
            this.selectionAllSubject.next({
              selectCheckbox: false,
              enableCheckbox: true
            });
            this.itemForm.patchValue({
              selectRadioButton: null
            });
          } else if (this.itemCode !== null) {
            if (data.length === 1) {
              this.itemForm.patchValue({
                selectRadioButton:
                  StockIssueTEPGEPRadioButtonTypesEnum.CURRENTPAGEPRODUCTS
              });
              this.selectPagewise();
            }
          }
          if (data.length !== 0) {
            if (this.isLoadImageUrl && data.length > 0 && imageCatalogueDetails)
              this.loadImage(data, imageCatalogueDetails, false);
          }
          this.loadTepGepItemList=true
        } else {
          this.loadTepGepItemList=false
          this.overlayNotification.close();
        }
      });

    this.getStockIssueItems$
      .pipe(
        withLatestFrom(
          this.commonFacade.getCommonFacadeAttributes(
            CommomStateAttributeTypeEnum.INVENTORY,
            CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([data, imageCatalogueDetails]) => {
        this.pageStockIssueItemsCount = data.length;
        this.totalStockIssueItemsCount = data.length;
        if (data.length !== 0) {
          this.totalStockIssueItemsCount = data[0].totalElements;
          this.itemIds = data.concat();
          this.itemIdsLength = this.itemIds.length;
          this.showNotifications(0);
          if (
            this.itemForm.value.selectRadioButton ===
            StockIssueTEPGEPRadioButtonTypesEnum.ALLPRODUCTS
          ) {
            this.selectionAllSubject.next({
              selectCheckbox: true,
              enableCheckbox: false
            });
            this.showNotifications(this.totalStockIssueItemsCount);
          } else if (
            this.itemForm.value.selectRadioButton ===
            StockIssueTEPGEPRadioButtonTypesEnum.CURRENTPAGEPRODUCTS
          ) {
            this.selectionAllSubject.next({
              selectCheckbox: false,
              enableCheckbox: true
            });
            this.itemForm.patchValue({
              selectRadioButton: null
            });
            this.showNotifications(0);
          } else if (this.itemCode !== null) {
            if (data.length === 1) {
              this.itemForm.patchValue({
                selectRadioButton:
                  StockIssueTEPGEPRadioButtonTypesEnum.CURRENTPAGEPRODUCTS
              });
              this.selectPagewise();
            }
          }
          if (data.length !== 0) {
            if (
              this.isLoadSearchedImageUrl &&
              data.length > 0 &&
              imageCatalogueDetails
            )
              this.loadImage(data, imageCatalogueDetails, true);
          }
        } else {
          this.overlayNotification.close();
        }
      });

    this.createStockIssueItemsResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.loadStockIssueItems(data);
      });

    this.updateStockIssueResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.srcDocNo) {
          this.srcDocNo = data.srcDocNo;
          this.showConfirmIssueSuccessNotification(data.srcDocNo);
        }
      });

    this.updateAllStockIssueItemsResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.loadStockIssueItems(data);
      });

    this.factoryAddressResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          this.factoryAddress = data;
        }
      });

    this.cfaAddressResponse$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.LocationCodeform = this.formBuilder.group({
        locationCodes: new FormControl()
      });
      if (data !== null) {
        this.cfaAddress = data.locationCode;
        this.LocationCodeform = this.formBuilder.group({
          locationCodes: new FormControl(this.cfaAddress)
        });
        this.getTotalCount()
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

    this.appsetttingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => (this.pageSize = resp));

    this.appsetttingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => (this.pageSizeOptions = resp));

    this.courierDetailsResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.length !== 0) {
          this.courierDetails = [];
          data.forEach(element => {
            this.courierDetails.push({
              value: element,
              description: element
            });
          });
        }
      });

    this.locationCodeResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.length !== 0) {
          this.Locationcode = [];
          data.forEach(element => {
            this.Locationcode.push({
              value: element,
              description: element
            });
          });
        }
      });
      
  }

  loadStockIssueItems(data: boolean) {
    if (data === true) {
      this.issueTEPFacade.createStockIssue({
        transferType: this.transferType.toUpperCase().replace(/-/gi, '_'),
        storeType: this.storeType
      });
      this.clearSearch();
      this.getTotalCount();
    }
  }

  back(): void {
    this.dialog.closeAll();

    if (this.isL1L2Store) {
      this.router.navigate([getStockIssueL1L2RouteUrl()]);
    } else {
      this.router.navigate([getStockIssueL3RouteUrl()]);
    }
  }

  showSelectProductsNotification(count: number, key: string): void {
    const buttonKey =
      'pw.stockIssueNotificationMessages.btnText-SelectProducts';
    this.translate
      .get([key, buttonKey])
      .pipe(take(1))
      .subscribe((translatedMessages: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: translatedMessages[buttonKey],
            message: count + ' ' + translatedMessages[key]
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            this.showProgressNotification();
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.resetList();
              if (
                this.itemForm.value.selectRadioButton ===
                StockIssueTEPGEPRadioButtonTypesEnum.ALLPRODUCTS
              ) {
                this.issueTEPFacade.createStockIssueItems({
                  id: this.issueId,
                  transferType: this.transferType
                    .toUpperCase()
                    .replace(/-/gi, '_'),
                  storeType: this.storeType,
                  itemIds: []
                });
                this.itemForm.patchValue({ selectRadioButton: null });
              } else if (
                this.itemForm.value.selectRadioButton ===
                  StockIssueTEPGEPRadioButtonTypesEnum.CURRENTPAGEPRODUCTS ||
                (this.itemForm.value.selectRadioButton === null &&
                  this.selectedItemIds.length !== 0)
              ) {
                const itemArray = [];
                this.selectedItemIds.forEach(element => {
                  itemArray.push({
                    inventoryId: element.inventoryId
                  });
                });
                this.issueTEPFacade.createStockIssueItems({
                  id: this.issueId,
                  transferType: this.transferType
                    .toUpperCase()
                    .replace(/-/gi, '_'),
                  storeType: this.storeType,
                  itemIds: itemArray
                });
                this.itemForm.patchValue({ selectRadioButton: null });
              }
            }
          });
      });
  }

  showRemoveProductsNotification(count: number, key: string): void {
    const buttonKey =
      'pw.stockIssueNotificationMessages.btnText-RemoveProducts';
    this.translate
      .get([key, buttonKey])
      .pipe(take(1))
      .subscribe((translatedMessages: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: translatedMessages[buttonKey],
            message: count + ' ' + translatedMessages[key]
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            this.showProgressNotification();
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.resetList();
              if (
                this.itemForm.value.selectRadioButton ===
                StockIssueTEPGEPRadioButtonTypesEnum.ALLPRODUCTS
              ) {
                this.issueTEPFacade.updateAllStockIssueItems({
                  id: this.issueId,
                  transferType: this.transferType
                    .toUpperCase()
                    .replace(/-/gi, '_'),
                  storeType: this.storeType,
                  itemIds: []
                });
                this.itemForm.patchValue({ selectRadioButton: null });
              } else if (
                this.itemForm.value.selectRadioButton ===
                  StockIssueTEPGEPRadioButtonTypesEnum.CURRENTPAGEPRODUCTS ||
                (this.itemForm.value.selectRadioButton === null &&
                  this.selectedItemIds.length !== 0)
              ) {
                const itemArray = [];
                this.selectedItemIds.forEach(element => {
                  itemArray.push(element.id);
                });
                this.issueTEPFacade.updateAllStockIssueItems({
                  id: this.issueId,
                  transferType: this.transferType
                    .toUpperCase()
                    .replace(/-/gi, '_'),
                  storeType: this.storeType,
                  itemIds: itemArray
                });
                this.itemForm.patchValue({ selectRadioButton: null });
              }
            }
          });
      });
  }

  showConfirmIssueNotification(key: string): void {
    const buttonKey = 'pw.stockIssueNotificationMessages.btnText-ConfirmIssue';
    this.translate
      .get([key, buttonKey])
      .pipe(take(1))
      .subscribe((translatedMessages: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: translatedMessages[buttonKey],
            hasRemarks: true,
            isRemarksMandatory: true,
            message: translatedMessages[key]
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            this.showProgressNotification();
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              if (
                this.selectedFormName ===
                StockIssueTEPGEPCourierRBTypesEnum.HANDCARRY
              ) {
                this.issueTEPFacade.updateStockIssue({
                  id: this.issueId,
                  transferType: this.transferType
                    .toUpperCase()
                    .replace(/-/gi, '_'),
                  storeType: this.storeType,
                  remarks: event.data,
                  carrierDetails: {
                    type: StockIssueTEPGEPCarrierTypesEnum.EMPLOYEE,
                    data: {
                      employeeId: this.form.value.formCollection[0].employeeID,
                      employeeName: this.form.value.formCollection[0]
                        .employeeName,
                      designation: '',
                      emailId: '',
                      mobileNo: this.form.value.formCollection[0]
                        .employeeMobileNumber,
                      brand: '',
                      numberOfBoxes: 0,
                      boxDetails: []
                    }
                  },
                  destinationLocationCode:
                    this.transferType === 'btq-cfa'
                      ? this.LocationCodeform.get('locationCodes').value
                      : this.factoryAddress.locationCode
                });
              } else {
                this.issueTEPFacade.updateStockIssue({
                  id: this.issueId,
                  transferType: this.transferType
                    .toUpperCase()
                    .replace(/-/gi, '_'),
                  storeType: this.storeType,
                  remarks: event.data,
                  carrierDetails: {
                    type: StockIssueTEPGEPCarrierTypesEnum.COURIER,
                    data: {
                      companyName: this.form.value.formCollection[0]
                        .courierName,
                      docketNumber: this.form.value.formCollection[0]
                        .courierDocketNumber,
                      roadPermitNumber: this.form.value.formCollection[0]
                        .courierRoadPermitNumber,
                      numberOfBoxes: this.boxDetails_count,
                      boxDetails: this.boxDetails_values
                    }
                  },
                  destinationLocationCode:
                    this.transferType === 'btq-cfa'
                      ? this.LocationCodeform.get('locationCodes').value
                      : this.factoryAddress.locationCode
                });
              }
            }
          });
      });
  }

  showConfirmIssueSuccessNotification(srcDocNo: number): void {
    const key = 'pw.stockIssueNotificationMessages.confirmSuccessMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: translatedMessage + srcDocNo,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmSuccessNotificationTemplate
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.back();
            }
          });
      });
  }

  showDetailsNotification(key: string): void {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
          });
      });
  }

  showProgressNotification(): void {
    const key = 'pw.stockReceiveNotificationMessages.progressMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.PROGRESS,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
          });
      });
  }

  selectAll(): void {
    this.selectedItemIds = this.itemIds.concat();
    this.selectionAllSubject.next({
      selectCheckbox: true,
      enableCheckbox: false
    });

    if (
      this.selectedProductsTabType === StockIssueTEPGEPTabTypesEnum.ALLPRODUCTS
    ) {
      this.productToBeSavedCount = this.totalItemsCount;
    }
    if (
      this.selectedProductsTabType ===
      StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS
    ) {
      this.productToBeSavedCount = this.totalStockIssueItemsCount;
    }
    if (this.productToBeSavedCount !== 0) {
      this.showNotifications(this.productToBeSavedCount);
    }
  }

  selectPagewise(): void {
    this.selectedItemIds = this.itemIds.concat();
    this.selectionAllSubject.next({
      selectCheckbox: true,
      enableCheckbox: true
    });
    if (
      this.selectedProductsTabType === StockIssueTEPGEPTabTypesEnum.ALLPRODUCTS
    ) {
      this.productToBeSavedCount = this.pageItemsCount;
    }
    if (
      this.selectedProductsTabType ===
      StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS
    ) {
      this.productToBeSavedCount = this.pageStockIssueItemsCount;
    }
    if (this.productToBeSavedCount !== 0) {
      this.showNotifications(this.productToBeSavedCount);
    }
  }

  onSelectionEmit(event: ItemSelection): void {
    if (event.isSelected === false) {
      this.itemForm.patchValue({
        selectRadioButton: null
      });
      this.productToBeSavedCount = 0;
      const itemToRemove = event.item;
      this.selectedItemIds.splice(
        this.selectedItemIds.indexOf(itemToRemove),
        1
      );
    } else if (event.isSelected === true) {
      this.selectedItemIds.push(event.item);
      if (this.selectedItemIds.length === this.itemIdsLength) {
        this.itemForm.patchValue({
          selectRadioButton:
            StockIssueTEPGEPRadioButtonTypesEnum.CURRENTPAGEPRODUCTS
        });
      }
    }
    this.productToBeSavedCount = this.selectedItemIds.length;
    if (this.productToBeSavedCount !== 0) {
      this.showNotifications(this.productToBeSavedCount);
    } else {
      if (
        this.selectedProductsTabType ===
        StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS
      ) {
        this.showNotifications(0);
      } else {
        this.overlayNotification.close();
      }
    }
  }

  resetList(): void {
    this.issueTEPFacade.resetList();
    this.issueTEPFacade.resetResponse();
  }

  resetValue(): void {
    this.itemIds = [];
    this.selectedItemIds = [];
    this.itemIdsLength = 0;
    this.productToBeSavedCount = 0;
  }

  changeProductsTab(newProductsTabType: StockIssueTEPGEPTabTypesEnum): void {
    if (this.selectedProductsTabType !== newProductsTabType) {
      this.itemForm.patchValue({ selectRadioButton: null });
      this.selectedProductsTabType = newProductsTabType;
      if (
        this.selectedProductsTabType ===
        StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS
      ) {
        this.issueTEPFacade.loadSelectedStockIssue({
          transferType: this.transferType.toUpperCase().replace(/-/gi, '_'),
          storeType: this.storeType,
          id: this.issueId
        });
      }
      this.clearSearch();
    }
  }

  showNotifications(count: number): void {
    this.overlayNotification.close();
    if (
      this.selectedProductsTabType ===
        StockIssueTEPGEPTabTypesEnum.ALLPRODUCTS &&
      count !== 0
    ) {
      this.showSelectProductsNotification(
        count,
        'pw.stockIssueNotificationMessages.productsSelectedOverlayMessage'
      );
    } else if (
      this.selectedProductsTabType ===
      StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS
    ) {
      if (
        this.itemForm.value.selectRadioButton === null &&
        this.selectedItemIds.length === 0 &&
        this.totalStockIssueItemsCount !== 0
      ) {
        if (this.form.invalid || this.factoryAddress.locationCode === null) {
          this.showDetailsNotification(
            'pw.stockIssueNotificationMessages.enterCarrierDetailsMessage'
          );
        } else if (
          this.boxDetails_count < 1 &&
          this.selectedFormName !== StockIssueTEPGEPCourierRBTypesEnum.HANDCARRY
        ) {
          this.showDetailsNotification(
            'pw.stockIssueNotificationMessages.enterBoxDetailsMesage'
          );
        } else if (
          this.transferType === 'btq-cfa' &&
          this.LocationCodeform.invalid
        ) {
          this.showDetailsNotification(
            'pw.stockIssueNotificationMessages.locationCodeLable'
          );
        } else if (
          this.totalMeasuredWeight > this.totalBoxWeight &&
          this.selectedFormName !== StockIssueTEPGEPCourierRBTypesEnum.HANDCARRY
        ) {
          this.showDetailsNotification(
            'pw.stockIssueNotificationMessages.boxWeightErrorMsg'
          );
        } else {
          this.showConfirmIssueNotification(
            'pw.stockIssueNotificationMessages.confirmOverlayMessage'
          );
        }
      } else if (this.totalStockIssueItemsCount !== 0) {
        this.showRemoveProductsNotification(
          count,
          'pw.stockIssueNotificationMessages.productsSelectedOverlayMessage'
        );
      }
    }
  }

  loadProducts(): void {
    this.resetValue();
    this.clearAll();
    if (this.sortBy === null) {
      this.sortDataItemsByMap.set('sort', 'inwardDate, ASC');
    }
    if (
      this.selectedProductsTabType === StockIssueTEPGEPTabTypesEnum.ALLPRODUCTS
    ) {
      this.isLoadImageUrl = true;
      this.issueTEPFacade.loadItems({
        id: this.issueId,
        itemCode: this.itemCode,
        lotNumber: this.lotNumber,
        transferType: this.transferType.toUpperCase().replace(/-/gi, '_'),
        storeType: this.storeType,
        status: StockIssueTEPGEPStatusesEnum.OPEN,
        pageIndex: this.itemsPageEvent.pageIndex,
        pageSize: this.itemsPageEvent.pageSize,
        sort: this.sortDataItemsByMap,
        filter: this.filterDataItemsByMap,
        cfaLocationCode:
        this.transferType === StockIssueTEPGEPTypesEnum.BTQ_CFA
          ? this.LocationCodeform.get('locationCodes').value
          : null
      });
    } else if (
      this.selectedProductsTabType ===
      StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS
    ) {
      this.isLoadSearchedImageUrl = true;
      this.issueTEPFacade.loadStockIssueItems({
        id: this.issueId,
        itemCode: this.itemCode,
        lotNumber: this.lotNumber,
        transferType: this.transferType.toUpperCase().replace(/-/gi, '_'),
        storeType: this.storeType,
        status: StockIssueTEPGEPStatusesEnum.SELECTED,
        pageIndex: this.stockIssueItemsPageEvent.pageIndex,
        pageSize: this.stockIssueItemsPageEvent.pageSize,
        sort: this.sortDataStockIssueItemsByMap,
        filter: this.filterDataStockIssueItemsByMap,
        cfaLocationCode:
        this.transferType === StockIssueTEPGEPTypesEnum.BTQ_CFA
          ? this.LocationCodeform.get('locationCodes').value
          : null
      });
    }
  }

  itemsListPaginate(event: PageEvent): void {
    this.overlayNotification.close();
    this.itemsPageEvent = event;
    this.loadProducts();
  }

  stockIssueItemsListPaginate(event: PageEvent): void {
    this.overlayNotification.close();
    this.stockIssueItemsPageEvent = event;
    this.loadProducts();
  }

  selectRadioButtonChange(): void {
    if (
      this.itemForm.value.selectRadioButton ===
      StockIssueTEPGEPRadioButtonTypesEnum.ALLPRODUCTS
    ) {
      this.selectAll();
    } else if (
      this.itemForm.value.selectRadioButton ===
      StockIssueTEPGEPRadioButtonTypesEnum.CURRENTPAGEPRODUCTS
    ) {
      this.selectPagewise();
    }
  }

  /**
   * Search searchItems based on variant code
   */
  searchItems(searchData: ItemSearchResponse) {
    this.itemCode = searchData.searchValue;
    this.lotNumber = searchData.lotNumber;
    this.itemsPageEvent = this.intialPageEvent;
    this.stockIssueItemsPageEvent = this.intialPageEvent;
    if (searchData.isValid) {
      this.loadProducts();
    } else {
      this.issueTEPFacade.resetList();
    }
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    this.hasNotification = true;
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true, // optional
          error: error
        })
        .events.pipe(take(1))
        .subscribe((event: OverlayNotificationEventRef) => {
          this.hasNotification = false;
          if (event.eventType === OverlayNotificationEventType.CLOSE) {
            this.back();
          }
        });
    }
  }

  printError() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.TIMER,
        message: this.PrintErrorText,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.showConfirmIssueSuccessNotification(this.srcDocNo);
      });
  }

  print() {
    this.printingService.loadPrintData({
      printType: this.transferType.toUpperCase().replace(/-/gi, '_'),
      transacionId: this.issueId,
      transacionType: this.isL3Store
        ? printTransactionTypesEnum.RETURN_INVOICE
        : printTransactionTypesEnum.STOCK_TRANSFER,
      doctype: printDocTypeEnum.STOCK_PRINT
    });
  }

  getTotalCount(): void {
    this.issueTEPFacade.loadTotalItemsCount({
      id: this.issueId ? this.issueId : null,
      transferType: this.transferType
        ? this.transferType.toUpperCase().replace(/-/gi, '_')
        : null,
      storeType: this.storeType ? this.storeType : null,
      status: StockIssueTEPGEPStatusesEnum.OPEN,
      cfaLocationCode:
        this.transferType === StockIssueTEPGEPTypesEnum.BTQ_CFA
          ? this.LocationCodeform.get('locationCodes').value
          : null
    });
    this.issueTEPFacade.loadTotalStockIssueItemsCount({
      id: this.issueId ? this.issueId : null,
      transferType: this.transferType
        ? this.transferType.toUpperCase().replace(/-/gi, '_')
        : null,
      storeType: this.storeType ? this.storeType : null,
      status: StockIssueTEPGEPStatusesEnum.SELECTED,
      cfaLocationCode:
        this.transferType === StockIssueTEPGEPTypesEnum.BTQ_CFA
          ? this.LocationCodeform.get('locationCodes').value
          : null
    });
  }

  onLocationChanged(event): void {
    this.LocationCodeform.get('locationCodes').patchValue(event.value);
    // this.getTotalCount();
    this.loadProducts();
  }

  loadForm(event): void {
    this.formList.clear();
    this.selectedFormName = event.value;
    if (event.value !== StockIssueTEPGEPCourierRBTypesEnum.HANDCARRY) {
      this.formList.push(this.createcourierForm());
    } else {
      this.formList.push(this.createemployeeForm());
    }
  }

  createcourierForm(): FormGroup {
    return this.formBuilder.group({
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
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[A-Z]{2}/[0-9]{2}/ ?[A-Z]{1,2}/[0-9]{4}$')
        // ])
      ]
    });
  }

  // createLocationCodeForm(): FormGroup {
  //   return this.formBuilder.group({
  //     locationCodes : new FormControl(''),
  //   });
  // }

  createemployeeForm(): FormGroup {
    return this.formBuilder.group({
      employeeID: [
        '',
        [
          this.fieldValidatorsService.requiredField('Employee ID'),
          this.fieldValidatorsService.alphaNumericField('Employee ID')
        ]
        // Validators.compose([
        //   Validators.required,
        //   Validators.maxLength(30),
        //   Validators.pattern('^[a-zA-Z0-9]+$')
        // ])
      ],
      employeeName: [
        '',
        [
          this.fieldValidatorsService.nameWithSpaceField(
            this.employeeNameLabel
          ),
          this.fieldValidatorsService.requiredField(this.employeeNameLabel)
          // this.fieldValidatorsService.maxLength(30, this.employeeNameLabel)
        ]
        // Validators.compose([
        //   Validators.required,
        //   Validators.maxLength(30),
        //   Validators.pattern('^[a-zA-Z0-9 ]+$')
        // ])
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
        // Validators.compose([
        //   Validators.required,
        //   Validators.maxLength(10),
        //   Validators.minLength(10),
        //   Validators.pattern('[0-9]+')
        // ])
      ]
    });
  }

  openSort(): void {
    this.dialog.closeAll();
    this.sortDialogService.DataSource = this.SORT_DATA;
    if (
      this.selectedProductsTabType === StockIssueTEPGEPTabTypesEnum.ALLPRODUCTS
    ) {
      this.sortData = this.sortDataItemsTab;
    } else if (
      this.selectedProductsTabType ===
      StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS
    ) {
      this.sortData = this.sortDataStockIssueItemsTab;
    }
    this.sortDialogService
      .openDialog(this.maxSortLimit, this.sortData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        if (sortResult.actionfrom === FilterActions.APPLY) {
          if (
            this.selectedProductsTabType ===
            StockIssueTEPGEPTabTypesEnum.ALLPRODUCTS
          ) {
            this.issueTEPFacade.setSortDataItems(sortResult.data);
            this.sortDataItemsByMap.clear();
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
                } else if (sortData[0].id === 2) {
                  this.sortBy = 'inwardDate';
                }
                this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
              }
            }
            if (this.sortBy !== null && this.sortOrder !== null) {
              this.sortDataItemsByMap.set(
                'sort',
                this.sortBy + ',' + this.sortOrder
              );
            }
            this.itemsPageEvent = this.intialPageEvent;
            this.loadProducts();
          } else if (
            this.selectedProductsTabType ===
            StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS
          ) {
            this.issueTEPFacade.setSortDataStockIssueItems(sortResult.data);
            this.sortDataStockIssueItemsByMap.clear();
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
                } else if (sortData[0].id === 2) {
                  this.sortBy = 'inwardDate';
                }
                this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
              }
            }
            if (this.sortBy !== null && this.sortOrder !== null) {
              this.sortDataStockIssueItemsByMap.set(
                'sort',
                this.sortBy + ',' + this.sortOrder
              );
            }
            this.stockIssueItemsPageEvent = this.intialPageEvent;
            this.loadProducts();
            
          }
        }
      });
  }

  openFilter(): void {
    this.dialog.closeAll();
    this.filterService.DataSource = {
      ...this.PRODUCT_CATEGORIES,
      ...this.PRODUCT_GROUP
    };
    if (
      this.selectedProductsTabType === StockIssueTEPGEPTabTypesEnum.ALLPRODUCTS
    ) {
      this.filterData = this.filterDataItemsTab;
    } else if (
      this.selectedProductsTabType ===
      StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS
    ) {
      this.filterData = this.filterDataStockIssueItemsTab;
    }
    this.isFilterOpen = true;
    const productCategory = [];
    const productGroup = [];
    this.filterService
      .openDialog(this.maxFilterLimit, this.filterData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (filterResult: {
          data: { [key: string]: Filter[] };
          actionfrom: string;
        }) => {
          this.isFilterOpen = false;
          if (filterResult.actionfrom === FilterActions.APPLY) {
            if (
              this.selectedProductsTabType ===
              StockIssueTEPGEPTabTypesEnum.ALLPRODUCTS
            ) {
              this.issueTEPFacade.setFilterDataItems(filterResult.data);
              this.filterDataItemsByMap.clear();
              const filterData = filterResult.data;
              if (filterData == null) {
                this.filterData = {};
              } else {
                this.filterData = filterData;
              }
              filterData['Product Category'].forEach(value => {
                productCategory.push(value.id);
              });
              filterData['Product Group'].forEach(value => {
                productGroup.push(value.id);
              });
              if (productCategory.length !== 0) {
                this.filterDataItemsByMap.set(
                  'productCategory',
                  productCategory
                );
              }
              if (productGroup.length !== 0) {
                this.filterDataItemsByMap.set('productGroup', productGroup);
              }
              this.itemsPageEvent = this.intialPageEvent;
              this.loadProducts();
            } else if (
              this.selectedProductsTabType ===
              StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS
            ) {
              this.issueTEPFacade.setFilterDataStockIssueItems(
                filterResult.data
              );
              this.filterDataStockIssueItemsByMap.clear();
              const filterData = filterResult.data;
              if (filterData == null) {
                this.filterData = {};
              } else {
                this.filterData = filterData;
              }
              filterData['Product Category'].forEach(value => {
                productCategory.push(value.id);
              });
              filterData['Product Group'].forEach(value => {
                productGroup.push(value.id);
              });
              if (productCategory.length !== 0) {
                this.filterDataStockIssueItemsByMap.set(
                  'productCategory',
                  productCategory
                );
              }
              if (productGroup.length !== 0) {
                this.filterDataStockIssueItemsByMap.set(
                  'productGroup',
                  productGroup
                );
              }
              this.stockIssueItemsPageEvent = this.intialPageEvent;
              this.loadProducts();
            }
          }
        }
      );
  }

  clearSearch(): void {
    this.itemCode = null;
    this.lotNumber = null;
    if (this.searchRef) {
      this.searchRef.reset();
    }
    this.issueTEPFacade.searchClear();
    this.overlayNotification.close();
    this.loadProducts();
  }

  clearAll(): void {
    this.itemForm.patchValue({
      selectRadioButton: null
    });
    this.selectionAllSubject.next({
      selectCheckbox: false,
      enableCheckbox: true
    });
    this.selectedItemIds = [];
    if (
      this.selectedProductsTabType ===
        StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS &&
      this.itemIds.length !== 0
    ) {
      this.showNotifications(0);
    } else {
      this.overlayNotification.close();
    }
  }

  employeeIDSelected(event: any, employeeCode: string) {
    if (event.isUserInput) {
      this.isReadOnly = true;
      if (this.employeeCodes.includes(employeeCode)) {
        this.formList.controls[0].patchValue({
          employeeID: employeeCode
        });
        this.issueTEPFacade.loadEmployeeDetails(employeeCode);
      }
    }
  }

  employeeIDChange(value) {
    const employeeInput = value;
    if (this.employeeCodes.includes(employeeInput)) {
      this.isReadOnly = true;
      this.issueTEPFacade.loadEmployeeDetails(employeeInput);
    } else {
      this.isReadOnly = false;
      this.formList.controls[0].patchValue({
        employeeName: '',
        employeeMobileNumber: ''
      });
    }
  }
  boxDetailsPopup() {
    if (!this.boxDetails_values) {
      this.boxDetails_values = [];
    }
    const dialogRef = this.dialog.open(CourierDetailsPopupComponent, {
      width: '60vw',
      data: {
        boxDetails: this.boxDetails_values,
        measuredWeight: this.totalMeasuredWeight,
        weightUnit: this.weightUnit
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
        if (
          this.selectedProductsTabType ===
          StockIssueTEPGEPTabTypesEnum.SELECTEDPRODUCTS
        ) {
          this.showNotifications(this.totalStockIssueItemsCount);
        }
      });
  }

  // Image
  loadImage(itemList: StockIssueItem[], imageCatalogueDetails, isSearchedItem) {
    if (this.isLoadImageUrl) {
      this.isLoadImageUrl = false;
    }
    if (this.isLoadSearchedImageUrl) {
      this.isLoadSearchedImageUrl = false;
    }
    itemList.forEach(item => {
      if (item.imageURL !== null && item.imageURL !== undefined) {
        this.issueTEPFacade.loadThumbnailImageUrl({
          id: item.id ? item.id.toString() : item.inventoryId,
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
          this.issueTEPFacade.loadImageUrl({
            id: event.id,
            imageUrl: event.imageUrl,
            imageCatalogueDetails: imageCatalogueDetails,
            itemCode: event.itemCode,
            isSearchedItem: isSearchedItem
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.printingService.resetPrint();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
