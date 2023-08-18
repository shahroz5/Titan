import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  ElementRef
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StockIssueFacade } from '@poss-web/eposs/stock-issue/data-access-stock-issue';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import {
  CustomErrors,
  ProductGroup,
  ProductCategory,
  RequestList,
  OverlayNotificationServiceAbstraction,
  StockRequestNote,
  IssueItemToUpdate,
  IssueInventoryItem,
  ItemToleranceValidate,
  StoreUser,
  Command,
  ShortcutServiceAbstraction,
  printTransactionTypesEnum,
  printDocTypeEnum,
  SelectDropDownOption,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  StockIssueTypesEnum,
  StockIssueStatusTypesEnum,
  StockIssueDetailsTabEnum,
  StockIssueAPIIssueTypesEnum,
  StockIssueAPIRequestTypesEnum,
  StockIssueeCarrierTypesEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  StockIssueItem
} from '@poss-web/shared/models';

import { Router, ActivatedRoute } from '@angular/router';
import { take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import {
  ItemSearchResponse,
  ItemSearchComponent
} from '@poss-web/shared/item/ui-item-search';
import {
  Column,
  SortDialogService
} from '@poss-web/shared/components/ui-sort-dialog';

import {
  FilterService,
  Filter,
  FilterActions
} from '@poss-web/shared/components/ui-filter-dialog';

import { ErrorEnums } from '@poss-web/shared/util-error';
import { TranslateService } from '@ngx-translate/core';
import { OutOfStockPopupComponent } from '@poss-web/eposs/shared/ui-out-of-stock-popup';
import { CourierDetailsPopupComponent } from '@poss-web/eposs/shared/ui-courier-details-popup';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ErrorItemListService } from '@poss-web/shared/item/ui-error-item-list-popup';

import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { PrintingService } from '@poss-web/shared/printing/feature-printing';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import {
  getStockIssueRouteUrl,
  get404Url
} from '@poss-web/shared/util-site-routes';
import { SelectDropdownComponent } from '@poss-web/shared/components/ui-form-field-controls';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
const sort_Data = [
  {
    id: 0,
    sortByColumnName: 'Requested Weight',
    sortAscOrder: false
  },
  {
    id: 1,
    sortByColumnName: 'Approved Quantity',
    sortAscOrder: false
  }
];

const back = 'StockIssueDetailsComponent.BACK';
const searchShortcutKeyF2 = 'StockIssueDetailsComponent.MAIN_SEARCH';
const filterShortcutKeyF8 = 'StockIssueDetailsComponent.FILTER';
const sortShortcutKeyF9 = 'StockIssueDetailsComponent.SORT';

const carrierDropDownTS = 'StockIsuueDetailsComponent.PRIMARY_DROPDOWN';
const courierDropDownTD = 'StockIsuueDetailsComponent.SECONDARY_DROPDOWN';
const stockIssueSelectAllKeyTA = 'StockIssueDetailsComponent.SELECT_ALL';
const stockIssueSelectCurrentPageKeyTP =
  'StockIssueDetailsComponent.SELECT_CURRENT_PAGE';
const stockIssueClearAllTR = 'StockIssueDetailsComponent.CLEAR_ALL';
const tab1ShortcutKey = 'Common.TAB_1';
const tab2ShortcutKey = 'Common.TAB_2';
const componentName = 'StockIssueDetailsComponent';
@Component({
  selector: 'poss-web-stock-issue-details',
  templateUrl: './stock-issue-details.component.html',
  styleUrls: ['./stock-issue-details.component.scss']
})
export class StockIssueDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(ItemSearchComponent, { static: true })
  searchRef: ItemSearchComponent;

  @ViewChild('carrierTypeDropdown', { static: true, read: ElementRef })
  carrierTypeDropdownRef: ElementRef;

  @ViewChild(SelectDropdownComponent)
  selectDropdownRef: SelectDropdownComponent;

  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;

  selected: any;
  tab: StockIssueDetailsTabEnum;

  pageSizeOptions: number[] = [];
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  issueItemsPageEvent: PageEvent = this.initialPageEvent;

  hasSearchItems: boolean;
  approvedItemsTotalCount = 0;
  selectedItemsTotalCount = 0;

  // selectedItemsIds$: Observable<any>;

  type: string;
  reqDocNumber: number;
  storeType: string;

  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  isItemsLoading$: Observable<boolean>;
  isItemsLoaded$: Observable<boolean>;
  items$: Observable<IssueInventoryItem[]>;
  itemsCount$: Observable<number>;

  isLoadingSelectedIssue$: Observable<boolean>;
  itemsTotalCountLoading$: Observable<boolean>;

  itemCode = '';
  lotNumber = '';

  destroy$: Subject<null> = new Subject<null>();

  confirmationSrcDocNo: number;


  issueType: string;
  requestType: string;

  selectionAllSubscription: any;
  selectionAllSubject = new Subject();
  selectionAllObservable = this.selectionAllSubject.asObservable();
  isDirty = true;
  isFormValid = false;
  itemIds: string[] = [];
  selectedIds: string[] = [];

  form: FormGroup;
  formList: FormArray;
  selectedFormName = StockIssueeCarrierTypesEnum.COURIER;
  carrierData: any;

  isItemUpdating = false;
  isItemUpdating$: Observable<boolean>;

  locationCode: string;
  courierDetails: any;

  sortBy: string;
  sortOrder: string;
  sortData: Column[] = [];
  maxSortLimit: number;
  sortByMap = new Map();

  productCategories: { [key: string]: Filter[] } = {};
  productGroup: { [key: string]: Filter[] } = {};

  maxFilterLimit: number;
  filterData: { [key: string]: Filter[] } = {};
  filterByMap = new Map();

  sortMapApprovedProducts = new Map();
  sortMapSelectedProducts = new Map();

  sortTabDataApprovedProducts: Column[];
  sortTabDataSelectedProducts: Column[];

  filterTabDataApprovedProducts: { [key: string]: Filter[] };
  filterTabDataSelectedProducts: { [key: string]: Filter[] };

  filterApprovedProducts: { key: string; value: any[] }[] = [];
  filterSelectedProducts: { key: string; value: any[] }[] = [];

  boxDetails_count = 0;
  boxDetails_values: any;
  isBoxWeightValid: boolean;
  totalBoxWeight = 0;

  isReadOnly: boolean;
  employeeCodes: string[];
  employeeDetailsResponse$: Observable<StoreUser[]>;
  employeeCodesResponse$: Observable<string[]>;


  dateFormat: string;
  hasDataGlobal: boolean;
  isItemsLoaded: boolean;

  updateItemListStatusResponse$: Observable<RequestList>;

  stockIssueTypesEnumRef = StockIssueTypesEnum;
  stockIsuueDetailsTabEnumRef = StockIssueDetailsTabEnum;
  stockIssueeCarrierTypesEnumRef = StockIssueeCarrierTypesEnum;

  totalMeasuredValue$: Observable<number>;
  totalMeasuredWeight: number;

  status: string;
  statusColor: string;

  selectedCarrierType: string;

  selectForm = this.fb.group({
    selectRadioButton: ['']
  });
  courierDocketNumberLabel: string;
  courierRoadPermitNumberLabel: string;
  employeeIDLabel: string;
  employeeNameLabel: string;
  employeeMobileNumberLabel: string;

  canBeSelected = false;

  permissions$: Observable<any[]>;
  noDataFoundMessage;


  PrintErrorText: string;

  courierArray: SelectDropDownOption[] = [];
  confirmedIssue: StockRequestNote;
  isLoadImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  constructor(
    private stockIssueFacade: StockIssueFacade,
    private appSettingFacade: AppsettingFacade,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    public dialog: MatDialog,
    private shortcutService: ShortcutServiceAbstraction,
    private sortDialogService: SortDialogService,
    private filterService: FilterService,
    private authFacade: AuthFacade,
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade,
    private errorItemListService: ErrorItemListService,
    private printingService: PrintingService,
    private profiledatafacade: ProfileDataFacade,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.PrintErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });
    this.translate
      .get(['pw.entity.productEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.productEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
    this.translateService
      .get([
        'pw.stockIssue.courierDocketNumberText',
        'pw.stockIssue.courierPermitNumber',
        'pw.stockIssue.employeeNameText',
        'pw.stockIssue.mobileNoText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.courierDocketNumberLabel =
          translatedLabels['pw.stockIssue.courierDocketNumberText'];
        this.courierRoadPermitNumberLabel =
          translatedLabels['pw.stockIssue.courierPermitNumber'];
        this.employeeNameLabel =
          translatedLabels['pw.stockIssue.employeeNameText'];
        this.employeeMobileNumberLabel =
          translatedLabels['pw.stockIssue.mobileNoText'];
      });
    this.form = this.fb.group({
      formCollection: this.fb.array([this.createcourierForm()])
    });
    this.formList = this.form.get('formCollection') as FormArray;
  }

  ngOnInit() {
    this.isLoadingImage$ = this.stockIssueFacade.getIsLoadingImage();
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    // this.form = this.fb.group({
    //   carrierType: [''],
    //   formCollection: this.fb.array([this.createcourierForm()])
    // });
    // this.formList = this.form.get('formCollection') as FormArray;

    this.tab = StockIssueDetailsTabEnum.APPROVED_PRODUCTS_TAB;

    this.stockIssueFacade.resetError();

    this.reqDocNumber = this.activatedRoute.snapshot.params['_reqDocNo'];

    this.type = this.activatedRoute.snapshot.params['type'];

    if (this.type === StockIssueTypesEnum.FACTORY) {
      this.issueType = StockIssueAPIIssueTypesEnum.BTQ_FAC;
      this.requestType = StockIssueAPIRequestTypesEnum.FAC;
    } else if (this.type === StockIssueTypesEnum.BOUTIQUE) {
      this.issueType = StockIssueAPIIssueTypesEnum.BTQ_BTQ;
      this.requestType = StockIssueAPIRequestTypesEnum.BTQ;
    } else if (this.type === StockIssueTypesEnum.MERCHANDISE) {
      this.issueType = StockIssueAPIIssueTypesEnum.MER_BTQ;
      this.requestType = StockIssueAPIRequestTypesEnum.MER;
    } else {
      this.router.navigate([get404Url()]);
    }
    this.authFacade
      .getLocationCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationCode = data;
      });
    this.profiledatafacade
      .getBoutiqueType()
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.storeType = val;
      });

    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((format: string) => {
        this.dateFormat = format;
      });
    this.appSettingFacade
      .getMaxSortLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxSortLimit = data;
      });
    this.appSettingFacade
      .getMaxFilterLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxFilterLimit = data;
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
      });
    this.form.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.showNotification();
    });
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => this.shortcutEventHandler(command));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.initialPageEvent.pageSize = pageSize;
        this.issueItemsPageEvent = this.initialPageEvent;
        this.componentInit();
      });
    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */

  componentInit() {
    this.stockIssueFacade.loadCourierDetails(this.locationCode);
    this.stockIssueFacade.loadProductCategories();
    this.stockIssueFacade.loadProductGroups();
    this.stockIssueFacade.loadStuddedProductGroups();
    this.sortDialogService.DataSource = sort_Data;

    this.stockIssueFacade.loadEmployeeCodes();

    this.itemIds = [];
    this.stockIssueFacade.clearSortAndFilter();
    this.isLoadingSelectedIssue$ = this.stockIssueFacade.getIsLoadingSelectedIssue();
    this.items$ = this.stockIssueFacade.getItems();
    this.isItemsLoading$ = this.stockIssueFacade.getIsItemsLoading();
    this.isItemsLoaded$ = this.stockIssueFacade.getIsItemsLoaded();
    this.itemsCount$ = this.stockIssueFacade.getItemsCount();

    this.employeeCodesResponse$ = this.stockIssueFacade.getEmployeeCodes();
    this.employeeDetailsResponse$ = this.stockIssueFacade.getEmployeeDetails();

    this.totalMeasuredValue$ = this.stockIssueFacade.getTotalMeasuredValue();

    this.stockIssueFacade
      .getTotalMeasuredWeight()
      .pipe(takeUntil(this.destroy$))
      .subscribe((weight: number) => {
        this.totalMeasuredWeight = weight;
        this.showNotification();
      });
    this.hasDataGlobal = false;

    this.stockIssueFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.stockIssueFacade
      .getCourierDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.courierDetails = data;
        this.courierArray = [];
        if (this.courierDetails && this.courierDetails.length) {
          for (const carrier of this.courierDetails) {
            this.courierArray.push({
              value: carrier,
              description: carrier
            });
          }
        }
      });

    this.items$
      .pipe(
        withLatestFrom( this.commonFacade.getCommonFacadeAttributes(
          CommomStateAttributeTypeEnum.INVENTORY,
          CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
        )),
        takeUntil(this.destroy$)
      )
      .subscribe(([items, imageCatalogueDetails]) => {
        this.canBeSelected = false;
        this.selectedIds = [];
        if (this.itemCode !== '') {
          this.selectionAllSubject.next({
            selectCheckbox: true,
            enableCheckbox: true
          });
        } else if (this.selectForm.value.selectRadioButton === '1') {
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
        // items.forEach(item => {
        for (const item of items) {
          if (!this.canBeSelected) {
            if (item.availableQuantity > 0) {
              this.canBeSelected = true;
            }
          }
          const index = this.selectedIds.indexOf(item.id);
          if (index === -1) {
            this.selectedIds.push(item.id);
          }
        }
        // });
        if (this.itemCode !== '') {
          this.itemIds = [...this.selectedIds];
        }
        if (items.length !== 0) {
          if (this.isLoadImageUrl && items.length > 0 && imageCatalogueDetails)
            this.loadImage(items, imageCatalogueDetails);
        }
        this.showNotification();
    });

    this.initialLoad();
    this.stockIssueFacade
      .getIsItemUpdating()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isUpdating: any) => {
        this.isItemUpdating = isUpdating;
        this.showNotification();
      });

    this.stockIssueFacade
      .getApprovedItemsTotalCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        this.approvedItemsTotalCount = count;
      });
    this.stockIssueFacade
      .getSelectedItemsTotalCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        this.selectedItemsTotalCount = count;
        this.showNotification();
      });
    this.stockIssueFacade
      .getIssueItemsTotalCountLoaded()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoaded: boolean) => {
        if (isLoaded) {
          this.showNotification();
        }
      });

    this.stockIssueFacade
      .getfilterDataApprovedProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(filterValue => {
        this.filterTabDataApprovedProducts = filterValue;
      });
    this.stockIssueFacade
      .getfilterDataSelectedProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(filterValue => {
        this.filterTabDataSelectedProducts = filterValue;
      });

    this.stockIssueFacade
      .getSortDataApprovedProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(sortValue => {
        this.sortTabDataApprovedProducts = sortValue;
      });
    this.stockIssueFacade
      .getSortDataSelectedProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(sortValue => {
        this.sortTabDataSelectedProducts = sortValue;
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

    this.stockIssueFacade
      .getProductCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productCategories: ProductCategory[]) => {
        if (productCategories !== null) {
          this.productCategories = this.mapToFilterOptions(
            'Product Category',
            productCategories.map(productCategory => ({
              id: productCategory.productCategoryCode,
              description: productCategory.description,
              selected: false
            }))
          );
        }
      });

    this.stockIssueFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroups: ProductGroup[]) => {
        if (productGroups !== null) {
          this.productGroup = this.mapToFilterOptions(
            'Product Group',
            productGroups.map(productGroup => ({
              id: productGroup.productGroupCode,
              description: productGroup.description,
              selected: false
            }))
          );
        }
      });
    this.updateItemListStatusResponse$ = this.stockIssueFacade.updateSelectedRequestProductListStatusResponse();
    this.updateItemListStatusResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          if (data.status) {
            this.cancelStatusNotifications(data);
          }
        }
      });
  }
  // shortcutEventHandler(command: Command) {
  //   if (command.name === searchShortcutKeyF2) {
  //     if (this.searchRef) {
  //       this.dialog.closeAll();
  //       this.searchRef.focus();
  //     }
  //   } else if (command.name === stockIssueSelectAllKey) {
  //     this.dialog.closeAll();
  //     this.selectForm.patchValue({
  //       selectRadioButton: '1'
  //     });
  //     this.selectAll();
  //   } else if (command.name === stockIssueSelectCurrentPageKey) {
  //     this.dialog.closeAll();
  //     this.selectForm.patchValue({
  //       selectRadioButton: '2'
  //     });
  //     this.selectPagewise();
  //   } else if (command.name === stockIssueClearAll) {
  //     this.dialog.closeAll();
  //     this.clearAll();
  //   } else if (command.name === carrierDropDownF7) {
  //     if (this.selectedFormName !== StockIssueeCarrierTypesEnum.HANDCARRY) {
  //       this.dialog.closeAll();
  //       this.boxDetailsPopUp();
  //     }
  //   } else if (command.name === sortShortcutKeyF9) {
  //     this.openSort();
  //   } else if (command.name === filterShortcutKeyF8) {
  //     this.openFilter();
  //   } else if (command.name === back) {
  //     this.back();
  //   }
  // }
  shortcutEventHandler(command: Command) {
    if (command.name === searchShortcutKeyF2) {
      if (this.searchRef) {
        this.dialog.closeAll();
        this.searchRef.focus();
      }
    } else if (command.name === stockIssueSelectAllKeyTA) {
      this.dialog.closeAll();
      this.selectForm.patchValue({
        selectRadioButton: '1'
      });
      this.selectAll();
    } else if (command.name === stockIssueSelectCurrentPageKeyTP) {
      this.dialog.closeAll();
      this.selectForm.patchValue({
        selectRadioButton: '2'
      });
      this.selectPagewise();
    } else if (command.name === stockIssueClearAllTR) {
      this.dialog.closeAll();
      this.clearAll();
    } else if (command.name === carrierDropDownTS) {
      if (this.selectedFormName !== StockIssueeCarrierTypesEnum.HANDCARRY) {
        if (this.tab === StockIssueDetailsTabEnum.SELECTED_PRODUCTS_TAB) {
          this.dialog.closeAll();
          this.boxDetailsPopUp();
        }
      }
    } else if (command.name === courierDropDownTD) {
      if (this.selectDropdownRef) this.selectDropdownRef.focus();
    } else if (command.name === sortShortcutKeyF9) {
      this.openSort();
    } else if (command.name === filterShortcutKeyF8) {
      this.openFilter();
    } else if (command.name === back) {
      this.back();
    } else if (command.name === tab1ShortcutKey) {
      this.changeType(0);
    } else if (command.name === tab2ShortcutKey) {
      this.changeType(1);
    }
  }

  initialLoad() {
    this.clearSearchItems();
    this.clearAll();
    this.resetFilterSort();
    this.selected = null;

    this.stockIssueFacade.loadSelectedIssue({
      id: this.reqDocNumber,
      requestType: this.requestType
    });
    this.stockIssueFacade
      .getSelectedIssue()
      .pipe(takeUntil(this.destroy$))
      .subscribe((requestStockTransferNote: StockRequestNote) => {
        if (requestStockTransferNote) {
          this.selected = requestStockTransferNote;
        } else {
          //todo error url navigation
          // this.router.navigate([get404Url()]);
        }
      });
    this.stockIssueFacade.loadMeasuredWeightAndValue({
      id: this.reqDocNumber,
      requestType: this.requestType
    });

    if (!this.hasDataGlobal) {
      this.hasDataGlobal = true;
      this.stockIssueFacade
        .getHasSelectedIssue()
        .pipe(takeUntil(this.destroy$))
        .subscribe((hasData: boolean) => {
          this.loadProducts(hasData);
        });
    }
    //todo error url navigation
    // } else {

    //   this.router.navigate([get404Url()]);
    // }
  }

  /**
   * Method to load Total Count of items
   */
  loadTotalItemsCount() {
    this.stockIssueFacade.loadItemsTotalCount({
      id: this.selected.id,
      requestType: this.selected.requestType,
      storeType: this.storeType
    });
  }
  /**
   * Method to search items with itemCode and lotNumber
   *  @param status: Search Response
   */
  searchItems(searchData: ItemSearchResponse) {
    this.resetRadiobutton();
    this.itemCode = searchData.searchValue;
    this.lotNumber = searchData.lotNumber;
    this.overlayNotification.close();
    this.issueItemsPageEvent = this.initialPageEvent;
    if (searchData.isValid) {
      this.loadProducts(true);
    } else {
      this.stockIssueFacade.clearItems();
    }
  }
  /**
   * Method to clear Search and searched items
   */
  clearSearchItems() {
    if (this.itemCode !== '') {
      this.itemIds = [];
      this.selectedIds = [];
      this.itemCode = '';
      this.lotNumber = '';
      this.selectionAllSubject.next({
        selectCheckbox: false,
        enableCheckbox: true
      });
      if (this.searchRef) {
        this.searchRef.reset();
      }
      this.loadProducts(true);
      this.showNotification();
    }
  }
  /**
   * Method to change type of of requests
   * @param newTab: new Tab name
   */
  changeType(newTab: StockIssueDetailsTabEnum) {
    if (this.tab !== newTab) {
      // this.isShowingErrorNotifcation = false;
      //todo uncomment
      // this.hasNotification = false;
      this.selectedIds = [];
      this.itemIds = [];
      this.clearSearchItems();
      this.tab = newTab;
      this.clearAll();
      this.loadProducts(true);
      this.issueItemsPageEvent = this.initialPageEvent;
    }
  }
  /**
   * Method for item level update
   * @param itemToUpdate: IssueItemToUpdate payload
   */
  updateItem(itemToUpdate: IssueItemToUpdate) {
    this.clearAll();
    this.stockIssueFacade.updateItem({
      requestType: this.requestType,
      storeType: this.storeType,
      id: this.selected.id,
      itemId: itemToUpdate.id,
      newUpdate: itemToUpdate.newUpdate,
      actualDetails: itemToUpdate.actualDetails
    });
    this.showNotification();
  }

  back() {
    this.dialog.closeAll();

    this.router.navigate([getStockIssueRouteUrl(this.type)]);
  }
  /**
   * Method for pagination of items loaded
   * @param event:page index and size
   */
  paginateIssueItems(event: PageEvent) {
    this.itemIds = [];
    this.issueItemsPageEvent = event;
    this.loadProducts(true);
  }
  /**
   * Method to display overlay notifications
   */
  showNotification() {
    this.overlayNotification.close();
    if (this.tab === StockIssueDetailsTabEnum.APPROVED_PRODUCTS_TAB) {
      if (
        (this.selectForm.value.selectRadioButton === '1' ||
          this.selectForm.value.selectRadioButton === '2') &&
        this.approvedItemsTotalCount <= this.issueItemsPageEvent.pageSize &&
        !this.canBeSelected
      ) {
        this.messageNotification(
          'pw.stockIssueNotificationMessages.outOfStockOverlayMessage'
        );
      } else if (
        this.selectForm.value.selectRadioButton === '1' &&
        this.approvedItemsTotalCount > 0
      ) {
        this.saveProductsOverlay(
          '',
          'pw.stockIssueNotificationMessages.allItemsSelectionNotificationMsg'
        );
      } else if (
        this.selectForm.value.selectRadioButton === '2' &&
        this.itemIds.length > 0
      ) {
        this.saveProductsOverlay(
          '',
          'pw.stockIssueNotificationMessages.currentPageSelectionNotificationMsg'
        );
      } else if (this.itemIds.length > 0) {
        this.saveProductsOverlay(
          this.itemIds.length,
          'pw.stockIssueNotificationMessages.productsSelectedOverlayMessage'
        );
      } else {
        if (this.type === StockIssueTypesEnum.BOUTIQUE) {
          this.cancelRequestOverlay();
        }
      }
    } else if (this.tab === StockIssueDetailsTabEnum.SELECTED_PRODUCTS_TAB) {
      if (this.selectedItemsTotalCount !== 0) {
        if (
          this.selectForm.value.selectRadioButton === '1' &&
          this.selectedItemsTotalCount > 0
        ) {
          this.deSelectProductsOverlay(
            this.selectedItemsTotalCount,
            'pw.stockIssueNotificationMessages.productsSelectedOverlayMessage'
          );
        } else if (
          this.selectForm.value.selectRadioButton === '2' ||
          this.itemIds.length > 0
        ) {
          this.deSelectProductsOverlay(
            this.itemIds.length,
            'pw.stockIssueNotificationMessages.productsSelectedOverlayMessage'
          );
        } else if (
          this.form.invalid ||
          ((this.selectedFormName === undefined ||
            this.selectedFormName === null) &&
            this.itemIds.length !== 0 &&
            !(
              this.selectForm.value.selectRadioButton === '1' ||
              this.selectForm.value.selectRadioButton === '2'
            ))
        ) {
          this.messageNotification(
            'pw.stockIssueNotificationMessages.enterCarrierDetailsMessage'
          );
        } else if (
          this.boxDetails_count < 1 &&
          this.selectedFormName !== StockIssueeCarrierTypesEnum.HANDCARRY
        ) {
          this.messageNotification(
            'pw.stockIssueNotificationMessages.enterBoxDetailsMesage'
          );
        } else if (
          this.totalMeasuredWeight >= this.totalBoxWeight &&
          this.selectedFormName !== StockIssueeCarrierTypesEnum.HANDCARRY
        ) {
          this.messageNotification(
            'pw.stockIssueNotificationMessages.boxWeightErrorMsg'
          );
        } else if (this.itemCode !== '') {
          this.overlayNotification.close();
        } else if (this.itemCode === '') {
          if (
            this.itemIds.length === 0 &&
            this.form.valid &&
            !this.isItemUpdating
          ) {
            this.confirmOverlay(
              'pw.stockIssueNotificationMessages.confirmOverlayMessage'
            );
          }
        }
      }
    }
    // }
  }
  /**
   * Method to maintain the array of seleceted items
   * @param selection: {selected item id and status}
   */
  selectionEmit(selection: { selected: boolean; id: string }) {
    if (selection.selected) {
      const index = this.itemIds.indexOf(selection.id);
      if (index === -1) {
        this.itemIds.push(selection.id);
      }
      if (this.selectedIds.length === this.itemIds.length) {
        this.selectForm.patchValue({
          selectRadioButton: '2'
        });
      }
    } else {
      const index = this.itemIds.indexOf(selection.id);
      if (index !== -1) {
        this.itemIds.splice(index, 1);
      }
      this.selectForm.patchValue({
        selectRadioButton: null
      });
    }

    this.showNotification();
  }
  /**
   * Method to switch between the select all and select pagewise radiobuttons
   */
  selectChange() {
    // this.isShowingErrorNotifcation = false;
    if (this.selectForm.value.selectRadioButton === '1') {
      this.selectAll();
    } else if (this.selectForm.value.selectRadioButton === '2') {
      this.selectPagewise();
    } else {
      this.clearAll();
    }
  }
  /**
   * Method to select all items
   */
  selectAll() {
    this.itemIds = [];
    this.selectionAllSubject.next({
      selectCheckbox: this.canBeSelected === true ? true : false,
      enableCheckbox: false
    });
    this.showNotification();
  }
  /**
   * Method to select items in the current page
   */
  selectPagewise() {
    this.itemIds = [];
    this.selectionAllSubject.next({
      selectCheckbox: this.canBeSelected === true ? true : false,
      enableCheckbox: true
    });
    this.itemIds = [...this.selectedIds];
    this.showNotification();
  }
  /**
   * Method to reset the radio button selections
   */
  resetRadiobutton() {
    this.selectForm.patchValue({
      selectRadioButton: null
    });
  }
  /**
   * Method to clear all selections
   */
  clearAll() {
    //todo umcomment
    // this.hasNotification = false;
    this.itemIds = [];
    this.selectForm.patchValue({
      selectRadioButton: null
    });
    this.selectionAllSubject.next({
      selectCheckbox: false
    });
    this.showNotification();
  }
  /**
   * Method to check if the parent form is dirty or not
   */
  onParentFormDirty(isDirty) {
    this.isDirty = isDirty;
    if (isDirty) {
      this.overlayNotification.close();
    }
    this.showNotification();
  }
  /**
   * Error handler method
   * @param error:error Object
   */
  errorHandler(error: any) {
    this.clearAll();
    // this.isShowingErrorNotifcation = true;
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else if (error.code === ErrorEnums.ERR_INV_017) {
      this.overlayNotification.close();
      this.errorItemListService
        .open({
          title: 'Confirm Failed',
          subTitle:
            'Following Items have measured quantity more than available quantity',
          columnDefs: [
            {
              field: 'itemCode',
              headerName: 'Item Code'
            },
            {
              field: 'lotNumber',
              headerName: 'Lot Number'
            },
            {
              field: 'availableQuantity',
              headerName: 'Available Qty'
            },
            {
              field: 'selectedQuantity',
              headerName: 'Selected Qty'
            }
          ],
          rowData: error.error.error.errorCause,
          buttonText: 'Remove Products'
        })
        .subscribe(result => {
          this.errorPopupConfirmation(result, error);
        });
    } else if (error.code === ErrorEnums.ERR_INV_037) {
      this.overlayNotification.close();
      this.errorItemListService
        .open({
          title: 'Confirm Failed',
          subTitle: 'Invalid BinGroups for Issue',
          columnDefs: [
            {
              field: 'itemCode',
              headerName: 'Item Code'
            },
            {
              field: 'lotNumber',
              headerName: 'Lot Number'
            },
            {
              field: 'previousBinGroup',
              headerName: 'Previous Bin Group'
            },
            {
              field: 'currentBinGroup',
              headerName: 'Current Bin Group'
            }
          ],
          rowData: error.error.error.errorCause,
          buttonText: 'Remove Products'
        })
        .subscribe(result => {
          this.errorPopupConfirmation(result, error);
        });
    } else if (
      error.code === ErrorEnums.ERR_INV_013 ||
      error.code === ErrorEnums.ERR_INV_029
    ) {
      this.overlayNotification.close();
      const cancelStatusErrorMessageKey =
        'pw.interBoutiqueTransferNotifications.cancelStatusMessage1';
      this.translate
        .get(cancelStatusErrorMessageKey)
        .pipe(takeUntil(this.destroy$))
        .subscribe((translatedMessage: string) => {
          this.overlayNotification
            .show({
              type: OverlayNotificationType.SIMPLE,
              hasClose: true,
              message: translatedMessage,
              hasBackdrop: true
            })
            .events.pipe(takeUntil(this.destroy$))
            .subscribe((event: OverlayNotificationEventRef) => {
              this.navigateOnClose(event);
            });
        });
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          //todo uncomment
          // this.hasNotification = false;
          // this.isShowingErrorNotifcation = false;
          this.showNotification();
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
        this.notificationOverlay();
      });
  }
  errorPopupConfirmation(result, error: CustomErrors) {
    if (result) {
      this.removeItems(error);
    }
    // this.isShowingErrorNotifcation = false;
    this.showNotification();
  }
  /**
   * method to display save products overlay
   * @param count: number of items
   * @param msg: msg to be translated and displayed
   */
  saveProductsOverlay(count: any, msg: any) {
    this.translate
      .get(msg)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        // this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: 'SELECT PRODUCTS',
            message: count + ' ' + translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.showProgressNotification();

              this.stockIssueFacade.UpdateAllItems({
                requestType: this.requestType,
                storeType: this.storeType,
                id: this.selected.id,
                itemId: this.itemIds,
                status: StockIssueStatusTypesEnum.SELECTED
              });
              this.stockIssueFacade
                .getselectIsUpdateAllItemsSuccess()
                .pipe(takeUntil(this.destroy$))
                .subscribe((isSuccess: boolean) => {
                  this.onSuccessReloadComponent(isSuccess);
                });
            }
          });
      });
  }
  /**
   * method to display remove products overlay
   * @param count: number of items
   * @param msg: msg to be translated and displayed
   */
  deSelectProductsOverlay(count: number, msg: string) {
    this.translate
      .get(msg)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        // this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: 'REMOVE PRODUCTS',
            message: count + ' ' + translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.showProgressNotification();

              this.stockIssueFacade.UpdateAllItems({
                requestType: this.requestType,
                storeType: this.storeType,
                id: this.selected.id,
                itemId: this.itemIds,
                status: StockIssueStatusTypesEnum.APPROVED
              });
              this.stockIssueFacade
                .getselectIsUpdateAllItemsSuccess()
                .pipe(takeUntil(this.destroy$))
                .subscribe((isSuccess: boolean) => {
                  this.onSuccessReloadComponent(isSuccess);
                });
            }
          });
      });
  }
  /**
   * method to display confirm transaction overlay
   * @param msg: msg to be translated and displayed
   */
  confirmOverlay(msg: any) {
    this.overlayNotification.close();
    this.translate
      .get(msg)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        // this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: 'CONFIRM ISSUE',
            hasRemarks: true,
            isRemarksMandatory: true,
            message: translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.showProgressNotification();
              if (
                this.selectedFormName === StockIssueeCarrierTypesEnum.HANDCARRY
              ) {
                this.stockIssueFacade.confirmIssue({
                  requestType: this.requestType,
                  id: this.selected.id,
                  data: {
                    carrierDetails: {
                      data: {
                        employeeId: this.form.value.formCollection[0]
                          .employeeID,
                        employeeName: this.form.value.formCollection[0]
                          .employeeName,
                        designation: null,
                        emailId: null,
                        mobileNo: this.form.value.formCollection[0]
                          .employeeMobileNumber,
                        brand: '',
                        numberOfBoxes: '0',
                        boxDetails: []
                      },
                      type: StockIssueeCarrierTypesEnum.EMPLOYEE
                    },
                    remarks: event.data
                  }
                });
              } else {
                this.stockIssueFacade.confirmIssue({
                  requestType: this.requestType,
                  id: this.selected.id,
                  data: {
                    carrierDetails: {
                      data: {
                        companyName: this.form.value.formCollection[0]
                          .courierName,
                        docketNumber: this.form.value.formCollection[0]
                          .courierDocketNumber,
                        roadPermitNumber: this.form.value.formCollection[0]
                          .courierRoadPermitNumber,
                        numberOfBoxes: this.boxDetails_count,
                        boxDetails: this.boxDetails_values
                      },
                      type: StockIssueeCarrierTypesEnum.COURIER
                    },
                    remarks: event.data
                  }
                });
              }
            }
          });
      });
    this.stockIssueFacade
      .getIssueConfirmStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSuccess: boolean) => {
        // this.hasNotification = false;
        if (isSuccess === true) {
          this.stockIssueFacade
            .getConfirmationSrcDocNo()
            .subscribe((data: any) => {
              this.confirmationSrcDocNo = data;
              this.notificationOverlay();
            });

          this.stockIssueFacade.getIssueConfirm().subscribe((data: any) => {
            this.confirmedIssue = data;
          });
        }
      });
  }
  /**
   * method to display different msgs overlay
   * @param msg: msg to be translated and displayed
   */
  messageNotification(msg: any) {
    this.translate
      .get(msg)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        // this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            // hasClose: true,
            message: translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            // this.hasNotification = false;
            // if (event.eventType === OverlayNotificationEventType.CLOSE) {
            //   this.clearAll();
            // }
          });
      });
  }
  /**
   * method to display success notficstion overlay
   */
  notificationOverlay() {
    // this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasClose: true,
        hasBackdrop: true,
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        // this.hasNotification = false;
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.back();
        }
      });
  }
  showProgressNotification() {
    const key = 'pw.stockReceiveNotificationMessages.progressMessage';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        // this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.PROGRESS,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            // this.hasNotification = false;
          });
      });
  }
  /**
   * method to load carrier form
   */
  loadForm(event) {
    this.formList.clear();
    this.selectedFormName = event.value;
    if (event.value !== StockIssueeCarrierTypesEnum.HANDCARRY) {
      this.formList.push(this.createcourierForm());
    } else {
      this.formList.push(this.createemployeeForm());
    }
  }
  /**
   * method to create courier form
   */
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
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[a-zA-Z0-9]+$'),
        //   Validators.maxLength(30)
        // ])
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
  /**
   * method to create employee form
   */
  createemployeeForm(): FormGroup {
    return this.fb.group({
      employeeID: [
        '',
        [
          this.fieldValidatorsService.requiredField('Employee ID'),
          this.fieldValidatorsService.alphaNumericField('Employee ID'),
          this.fieldValidatorsService.maxLength(30, 'Employee ID')
        ]
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[a-zA-Z0-9]+$'),
        //   Validators.maxLength(30)
        // ])
      ],
      employeeName: [
        '',
        [
          this.fieldValidatorsService.nameWithSpaceField(
            this.employeeNameLabel
          ),
          this.fieldValidatorsService.requiredField(this.employeeNameLabel),
          this.fieldValidatorsService.maxLength(30, this.employeeNameLabel)
        ]
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[a-zA-Z0-9 ]+$'),
        //   Validators.maxLength(30)
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
  /**
   * method to open error popup
   */
  openErrorPopup(error: any) {
    this.overlayNotification.close();
    const dialogRef = this.dialog.open(OutOfStockPopupComponent, {
      width: '75vw',
      data: error
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.removeItems(error);
        }
        // this.isShowingErrorNotifcation = false;
        this.showNotification();
      });
  }
  /**
   * method to change status of selected items
   */
  removeItems(error: any) {
    this.showProgressNotification();
    this.itemIds = [];
    for (const item of error.error.error.errorCause) {
      this.itemIds.push(item.itemId);
    }
    this.stockIssueFacade.UpdateAllItems({
      requestType: this.requestType,
      storeType: this.storeType,
      id: this.selected.id,
      itemId: this.itemIds,
      status: StockIssueStatusTypesEnum.APPROVED
    });
    this.stockIssueFacade
      .getselectIsUpdateAllItemsSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSuccess: boolean) => {
        this.onSuccessReloadComponent(isSuccess);
      });
  }
  /**
   * method to load Products
   */
  loadProducts(load: boolean) {
    if (load) {
      this.overlayNotification.close();
      this.itemIds = [];
      this.loadTotalItemsCount();

      if (this.storeType && this.selected) {
        this.isLoadImageUrl = true;
        if (this.tab === StockIssueDetailsTabEnum.APPROVED_PRODUCTS_TAB) {
          this.stockIssueFacade.loadItems({
            id: this.selected.id,
            itemCode: this.itemCode,
            lotNumber: this.lotNumber,
            requestType: this.selected.requestType,
            storeType: this.storeType,
            status: StockIssueStatusTypesEnum.APPROVED,
            pageIndex: this.issueItemsPageEvent.pageIndex,
            pageSize: this.issueItemsPageEvent.pageSize,
            sort: this.sortMapApprovedProducts,
            filter: this.filterApprovedProducts
          });
        } else {
          this.stockIssueFacade.loadItems({
            id: this.selected.id,
            itemCode: this.itemCode,
            lotNumber: this.lotNumber,
            requestType: this.selected.requestType,
            storeType: this.storeType,
            status: StockIssueStatusTypesEnum.SELECTED,
            pageIndex: this.issueItemsPageEvent.pageIndex,
            pageSize: this.issueItemsPageEvent.pageSize,
            sort: this.sortMapSelectedProducts,
            filter: this.filterSelectedProducts
          });
        }

        this.showNotification();
      }
    }
  }
  /**
   * method to open sort popup
   */
  openSort(): void {
    this.dialog.closeAll();
    let sortTabData: Column[] = [];
    if (this.tab === StockIssueDetailsTabEnum.APPROVED_PRODUCTS_TAB) {
      sortTabData = this.sortTabDataApprovedProducts;
    } else if (this.tab === StockIssueDetailsTabEnum.SELECTED_PRODUCTS_TAB) {
      sortTabData = this.sortTabDataSelectedProducts;
    }
    this.sortDialogService
      .openDialog(this.maxSortLimit, sortTabData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        if (sortResult.actionfrom === FilterActions.APPLY) {
          if (this.tab === StockIssueDetailsTabEnum.APPROVED_PRODUCTS_TAB) {
            this.stockIssueFacade.setIssueApprovedProductsSort(sortResult.data);
            this.sortMapApprovedProducts.clear();
            const sortData = sortResult.data;
            if (sortData === null || sortData.length === 0) {
              this.sortData = [];
              this.sortOrder = null;
              this.sortBy = null;
            } else {
              this.sortData = sortData;
              if (sortData.length > 0) {
                if (sortData[0].id === 0) {
                  this.sortBy = 'requestedWeight';
                } else if (sortData[0].id === 1) {
                  this.sortBy = 'approvedQuantity';
                }
                this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
              }
            }
            if (this.sortBy != null && this.sortOrder !== null) {
              this.sortMapApprovedProducts.set(
                'sort',
                this.sortBy + ',' + this.sortOrder
              );
            }
            this.issueItemsPageEvent = this.initialPageEvent;
          } else if (
            this.tab === StockIssueDetailsTabEnum.SELECTED_PRODUCTS_TAB
          ) {
            this.stockIssueFacade.setIssueSelectedProductsSort(sortResult.data);
            this.sortMapSelectedProducts.clear();
            const sortData = sortResult.data;
            if (sortData == null || sortData.length === 0) {
              this.sortData = [];
              this.sortOrder = null;
              this.sortByMap = null;
            } else {
              this.sortData = sortData;
              if (sortData.length > 0) {
                if (sortData[0].id === 0) {
                  this.sortBy = 'requestedWeight';
                } else if (sortData[0].id === 1) {
                  this.sortBy = 'approvedQuantity';
                }
                this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
              }
            }
            if (this.sortBy !== null && this.sortOrder != null) {
              this.sortMapSelectedProducts.set(
                'sort',
                this.sortBy + ',' + this.sortOrder
              );
            }
            this.issueItemsPageEvent = this.initialPageEvent;
          }

          this.loadProducts(true);
          // todo clear all
        }
      });
  }
  /**
   * method to open filter popup
   */
  openFilter(): void {
    this.dialog.closeAll();
    this.filterService.DataSource = {
      ...this.productCategories,
      ...this.productGroup
    };
    let filterTabData: { [key: string]: Filter[] } = {};
    if (this.tab === StockIssueDetailsTabEnum.APPROVED_PRODUCTS_TAB) {
      filterTabData = this.filterTabDataApprovedProducts;
    } else if (this.tab === StockIssueDetailsTabEnum.SELECTED_PRODUCTS_TAB) {
      filterTabData = this.filterTabDataSelectedProducts;
    }
    this.filterService
      .openDialog(this.maxFilterLimit, filterTabData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (filterResult: {
          data: { [key: string]: Filter[] };
          actionfrom: string;
        }) => {
          if (filterResult.actionfrom === FilterActions.APPLY) {
            if (this.tab === StockIssueDetailsTabEnum.APPROVED_PRODUCTS_TAB) {
              this.stockIssueFacade.setIssueAppovedProductsFilter(
                filterResult.data
              );
              const filterData = filterResult.data;
              if (filterData == null) {
                this.filterData = {};
              } else {
                this.filterData = filterData;
              }
              this.filterApprovedProducts = [];
              if (filterData) {
                let filterValues = [];
                if (filterData['Product Group']) {
                  filterData['Product Group'].forEach(value => {
                    filterValues.push(value.id);
                  });
                  if (filterValues.length > 0) {
                    this.filterApprovedProducts.push({
                      key: 'productGroup',
                      value: filterValues
                    });
                  }
                }
                filterValues = [];
                if (filterData['Product Category']) {
                  filterData['Product Category'].forEach(value => {
                    filterValues.push(value.id);
                  });
                  if (filterValues.length > 0) {
                    this.filterApprovedProducts.push({
                      key: 'productCategory',
                      value: filterValues
                    });
                  }
                }
              }
              this.issueItemsPageEvent = this.initialPageEvent;
            } else if (
              this.tab === StockIssueDetailsTabEnum.SELECTED_PRODUCTS_TAB
            ) {
              this.stockIssueFacade.setIssueSelectedProductsFilter(
                filterResult.data
              );
              const filterData = filterResult.data;
              if (filterData == null) {
                this.filterData = {};
              } else {
                this.filterData = filterData;
              }
              this.filterSelectedProducts = [];
              if (filterData) {
                let filterValues = [];
                if (filterData['Product Group']) {
                  filterData['Product Group'].forEach(value => {
                    filterValues.push(value.id);
                  });
                  if (filterValues.length > 0) {
                    this.filterSelectedProducts.push({
                      key: 'productGroup',
                      value: filterValues
                    });
                  }
                }
                filterValues = [];
                if (filterData['Product Category']) {
                  filterData['Product Category'].forEach(value => {
                    filterValues.push(value.id);
                  });
                  if (filterValues.length > 0) {
                    this.filterSelectedProducts.push({
                      key: 'productCategory',
                      value: filterValues
                    });
                  }
                }
              }
              this.issueItemsPageEvent = this.initialPageEvent;
            }
            this.loadProducts(true);
          }
        }
      );
  }
  /**
   * method to reset filter and sort
   */
  resetFilterSort() {
    this.filterByMap.clear();
    this.sortByMap.clear();
  }
  /**
   * method to relaod component
   */
  onSuccessReloadComponent(isSuccess: boolean) {
    this.overlayNotification.close();
    if (isSuccess) {
      this.initialLoad();
    } else {
      this.showNotification();
    }
  }
  boxDetailsPopUp() {
    this.overlayNotification.close();
    if (!this.boxDetails_values) {
      this.boxDetails_values = [];
    }
    const dialogRef = this.dialog.open(CourierDetailsPopupComponent, {
      width: '60vw',
      data: {
        boxDetails: this.boxDetails_values,
        measuredWeight: this.totalMeasuredWeight,
        weightUnit: this.selected.weightUnit
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
    this.showNotification();
  }

  employeeIDSelected(event: any, employeeCode: string) {
    if (event.isUserInput) {
      this.isReadOnly = true;
      if (this.employeeCodes.includes(employeeCode)) {
        this.formList.controls[0].patchValue({
          employeeID: employeeCode
        });
        this.stockIssueFacade.loadEmployeeDetails(employeeCode);
      }
    }
  }

  employeeIDChange(value) {
    const employeeInput = value;
    if (this.employeeCodes.includes(employeeInput)) {
      this.isReadOnly = true;
      this.stockIssueFacade.loadEmployeeDetails(employeeInput);
    } else {
      this.isReadOnly = false;
      this.formList.controls[0].patchValue({
        employeeName: '',
        employeeMobileNumber: ''
      });
    }
  }
  validateItem(data: ItemToleranceValidate) {
    this.stockIssueFacade.validateItem(data);
  }

  cancelRequestOverlay() {
    const buttonKey = 'pw.interboutiqueTransfer.cancelRequestButtonText';
    this.translate
      .get(buttonKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedButtonKey: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: translatedButtonKey,
            hasRemarks: true,
            isRemarksMandatory: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.showProgressNotification();

              const cancelRequest = {
                type: StockIssueStatusTypesEnum.ISSUE_REJECTED,
                id: this.selected.id,
                requestGroup: StockIssueStatusTypesEnum.RECEIVED,
                itemIds: [],
                remarks: event.data
              };
              this.stockIssueFacade.updateItemListStatus(cancelRequest);
            }
          });
      });
  }

  /**
   * Notification overlay for status
   * @param status: status of request
   */
  cancelStatusNotifications(request: RequestList) {
    // this.hasNotification = true;
    const key1 =
      'pw.interBoutiqueTransferNotifications.requestNotificationMesssage1';
    const key3 =
      'pw.interBoutiqueTransferNotifications.requestNotificationMesssage3';
    const key4 =
      'pw.interBoutiqueTransferNotifications.requestNotificationMesssage4';
    let statusKey = {
      status: '',
      statusColor: ''
    };
    if (commonTranslateKeyMap.has(request.status)) {
      statusKey = commonTranslateKeyMap.get(request.status);
    }

    this.translate
      .get([key1, key3, key4, statusKey.status])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            message:
              translatedMessages[key1] +
              request.reqDocNo +
              translatedMessages[key3] +
              request.destLocationCode +
              translatedMessages[key4] +
              translatedMessages[statusKey.status],
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.navigateOnClose(event);
          });
      });
  }
  mapToFilterOptions(
    key: string,
    options: Filter[]
  ): { [key: string]: Filter[] } {
    return {
      [key]: options.map((option, index) => ({
        id: option.id,
        description: option.description,
        selected: false
      }))
    };
  }
  loadHeader(loadData: boolean) {
    if (loadData) {
      this.stockIssueFacade.loadMeasuredWeightAndValue({
        id: this.reqDocNumber,
        requestType: this.requestType
      });
    }
  }
  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */
  getStatus(status?: string) {
    let key = {
      status: '',
      statusColor: ''
    };
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.status = translatedMessages[key.status];
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }
  navigateOnClose(event) {
    if (event.eventType === OverlayNotificationEventType.CLOSE) {
      this.back();
    }
  }
  print() {
    this.printingService.loadPrintData({
      printType: this.issueType,
      transacionId: this.confirmedIssue.id,
      transacionType: printTransactionTypesEnum.STOCK_ISSUE,
      doctype: printDocTypeEnum.STOCK_PRINT
    });
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

    // Image
  loadImage(itemList: IssueInventoryItem[], imageCatalogueDetails) {
    this.isLoadImageUrl = false;
    itemList.forEach(item => {
      if(item.imageURL !== null && item.imageURL !== undefined){
        this.stockIssueFacade.loadThumbnailImageUrl({
          id: item.id,
          imageUrl: item.imageURL,
          imageCatalogueDetails: imageCatalogueDetails
        });
      }
    });
  }

  loadImageUrl(event) {
    this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.INVENTORY,
      CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
    )
      .pipe(take(1))
      .subscribe(imageCatalogueDetails => {
        if(event.imageUrl !== null && event.imageUrl !== undefined){
          this.stockIssueFacade.loadImageUrl({
            id: event.id,
            imageUrl: event.imageUrl,
            imageCatalogueDetails: imageCatalogueDetails
          });
        }
      });
  }

  ngOnDestroy() {
    this.overlayNotification.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.printingService.resetPrint();
  }
}
