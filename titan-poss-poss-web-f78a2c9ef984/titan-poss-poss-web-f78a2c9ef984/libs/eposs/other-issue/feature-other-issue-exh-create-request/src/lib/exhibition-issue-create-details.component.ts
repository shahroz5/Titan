import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';

import { takeUntil, filter } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

import {
  OtherIssuesItem,
  OtherReceiptsIssuesEnum,
  Filter,
  Column,
  CustomErrors,
  ProductCategory,
  ProductGroup,
  JsonTypeEnum,
  OtherIssuesFilterOption,
  OverlayNotificationServiceAbstraction,
  OtherIssueModel,
  sortFilterData,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  Command,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { OtherIssuesFacade } from '@poss-web/eposs/other-issue/data-access-other-issue';
import {
  ItemSearchComponent,
  ItemSearchResponse
} from '@poss-web/shared/item/ui-item-search';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  FilterService,
  FilterActions
} from '@poss-web/shared/components/ui-filter-dialog';
import { SortDialogService } from '@poss-web/shared/components/ui-sort-dialog';
import {
  getOtherIssuesReceiptUrl,
  getOtherIssuesDefaultUrl
} from '@poss-web/shared/util-site-routes';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';

const mainSearchShortCutKey =
  'ExhibitionIssueCreateDetailsComponent.MAIN_SEARCH';
const filterShortCutKey = 'ExhibitionIssueCreateDetailsComponent.FILTER';
const sortShortCutKey = 'ExhibitionIssueCreateDetailsComponent.SORT';
const backShortCutKey = 'ExhibitionIssueCreateDetailsComponent.BACK';
const clearAllShortCutKey = 'ExhibitionIssueCreateDetailsComponent.CLEAR_ALL';
const selectAllShortCutKey = 'ExhibitionIssueCreateDetailsComponent.SELECT_ALL';
const currentPageShortCutKey =
  'ExhibitionIssueCreateDetailsComponent.SELECT_CURRENT_PAGE';
const tab1ShortcutKey = 'Common.TAB_1';
const tab2ShortcutKey = 'Common.TAB_2';
const componentName = 'ExhibitionIssueCreateDetailsComponent';
@Component({
  selector: 'poss-web-exhibition-issue-create-details',
  templateUrl: './exhibition-issue-create-details.component.html',
  styleUrls: ['./exhibition-issue-create-details.component.scss']
})
export class ExhibitionIssueCreateDetailsComponent
  implements OnInit, OnDestroy {
  transferType: string;
  reqType: string;
  tab: string;
  destroy$: Subject<null> = new Subject<null>();
  requestId: number;
  pageSize = 0;
  pageIndex = 0;
  initialPageEvent: PageEvent = {
    pageIndex: this.pageIndex,
    pageSize: this.pageSize,
    length: 0
  };
  allOtherIssueItemsPageEvent: PageEvent = this.initialPageEvent;
  selectedOtherIssueItemsPageEvent: PageEvent = this.initialPageEvent;
  allOtherIssueCreateItems$: Observable<OtherIssuesItem[]>;
  selectedOtherIssueCreateItems$: Observable<OtherIssuesItem[]>;
  otherIssuesTabEnumRef = OtherReceiptsIssuesEnum;
  itemForm: FormGroup;
  searchForm: FormGroup;
  allOtherIssuesCreateCount = 0;
  selectedOtherIssuesCreateCount = 0;
  @ViewChild(ItemSearchComponent, { static: true })
  searchRef: ItemSearchComponent;

  isAllOtherIssueCreateItemsLoading$: Observable<boolean>;
  isSelectedOtherIssueCreateItemsLoading$: Observable<boolean>;
  isOtherIssueCreateItemsTotalCountLoaded$: Observable<boolean>;
  isOtherIssueCreateItemsTotalCountLoading$: Observable<boolean>;

  searchedOtherIssueCreateItems$: Observable<OtherIssuesItem[]>;
  isSearchingOtherIssueCreateItems$: Observable<boolean>;
  hasSearchedOtherIssueCreateItems$: Observable<boolean>;

  hasNotification = false;
  selectionAllSubject = new Subject();
  selectionAllObaservable = this.selectionAllSubject.asObservable();
  allOtherIssueIds: OtherIssuesItem[] = [];
  allOtherIssueIdslength: number;
  allOtherIssuesPageCount: number;

  selectedtabOtherIssueIds = [];
  selectedtabOtherIssueIdslength: number;
  selectedtabOtherIssuesPageCount: number;

  selectedAll = false;
  selectedPagewise = false;
  productToBeSavedCount = 0;

  selectedItemids: OtherIssuesItem[] = [];
  itemIdsLength: number;
  addressForm: FormGroup;
  employeeForm: FormGroup;
  lossForm: FormGroup;
  createOtherIssueStockRequestItemsResponse$: Observable<any>;
  removeOtherIssueStockRequestItemsResponse$: Observable<any>;
  updateStockRequestResponse$: Observable<OtherIssueModel>;
  searchItemsCount: number;
  itemCode: string;
  lotNumber: string;
  productCategory: { [key: string]: Filter[] };
  productGroup: { [key: string]: Filter[] };
  maxFilterLimit: number;
  maxSortLimit: number;
  sortMapAllProducts = new Map();
  sortMapSelectedProducts = new Map();
  filterMapAllProducts = new Map();
  filterMapSelectedProducts = new Map();
  filterData: { [key: string]: Filter[] } = {};
  sortBy: string;
  sortOrder: string;
  sortData: Column[] = [];
  filterDataAllProducts: Observable<{ [key: string]: Filter[] }>;
  filterDataSelectedProducts: Observable<{ [key: string]: Filter[] }>;
  filterTabDataAllProducts: { [key: string]: Filter[] };
  filterTabDataSelectedProducts: { [key: string]: Filter[] };
  sortDataAllProducts: Observable<Column[]>;
  sortDataSelectedProducts: Observable<Column[]>;
  sortTabDataAllProducts: Column[];
  sortTabDataSelectedProducts: Column[];
  filterAllProducts: { key: string; value: any[] }[] = [];
  filterSelectedProducts: { key: string; value: any[] }[] = [];
  selectedTabTotalCountforPagination: number;
  allProdctsTabTotalCountforPagination: number;
  noDataFoundMessage = '';
  dateFormat: string;
  pageSizeOptions: number[] = [];
  isLoggedIn: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private otherIssueFacade: OtherIssuesFacade,
    private router: Router,
    private fb: FormBuilder,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private shortcutService: ShortcutServiceAbstraction,
    private filterService: FilterService,
    private sortDialogService: SortDialogService,
    private dialog: MatDialog,
    private fieldValidatorsService: FieldValidatorsService,
    private authFacade: AuthFacade
  ) {
    this.sortDialogService.DataSource = sortFilterData;
    this.searchForm = this.fb.group({
      searchValue: []
    });
    this.itemForm = this.createForm();
    this.addressForm = this.fb.group({
      address1: [
        '',
        //  Validators.required
        [
          this.fieldValidatorsService.addressField('Address 1'),
          this.fieldValidatorsService.requiredField('Address 1')
        ]
      ],
      address2: [
        '',
        //  Validators.required
        [
          this.fieldValidatorsService.addressField('Address 2'),
          this.fieldValidatorsService.requiredField('Address 2')
        ]
      ],
      approvalCode: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[a-zA-Z0-9-/]*$')
        // ])
        [
          this.fieldValidatorsService.approvalCodeField('Approval Code'),
          this.fieldValidatorsService.requiredField('Approval Code')
        ]
      ],
      state: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[a-zA-Z_ ]*$')
        // ])
        [
          this.fieldValidatorsService.stateField('State'),
          this.fieldValidatorsService.requiredField('State')
        ]
      ],
      city: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[a-zA-Z_ ]*$')
        // ])
        [
          this.fieldValidatorsService.cityField('City'),
          this.fieldValidatorsService.requiredField('City')
        ]
      ],
      pinCode: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[0-9]{6}')
        // ])
        [
          this.fieldValidatorsService.pincodeField('Pin Code'),
          this.fieldValidatorsService.requiredField('Pin Code')
        ]
      ],
      approvedBy: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^([A-Za-z]([_]|[ ])?)+')
        // ])
        [
          this.fieldValidatorsService.nameWithSpaceField('Approved By'),
          this.fieldValidatorsService.requiredField('Approved By')
        ]
      ]
    });
    this.employeeForm = this.fb.group({
      employeeId: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[a-zA-Z0-9]*$')
        // ])
        [
          this.fieldValidatorsService.alphaNumericField('Employee Id'),
          this.fieldValidatorsService.requiredField('Employee Id')
        ]
      ],
      employeeName: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[a-zA-Z_ ]*$')
        // ])
        [
          this.fieldValidatorsService.nameWithSpaceField('Employee Name'),
          this.fieldValidatorsService.requiredField('Employee Name')
        ]
      ],
      designation: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[a-zA-Z_ ]*$')
        // ])
        [
          this.fieldValidatorsService.designationField('Designation'),
          this.fieldValidatorsService.requiredField('Designation')
        ]
      ],
      emailId: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,3}$')
        // ])
        [
          this.fieldValidatorsService.emailField('Email ID'),
          this.fieldValidatorsService.requiredField('Email ID')
        ]
      ],
      mobileNo: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[6-9]{1}[0-9]{9}$')
        // ])
        [
          this.fieldValidatorsService.mobileField('Mobile No'),
          this.fieldValidatorsService.requiredField('Mobile No')
        ]
      ],
      brand: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[a-zA-Z_ ]*$')
        // ])
        [
          this.fieldValidatorsService.nameWithSpaceField('Brand'),
          this.fieldValidatorsService.requiredField('Brand')
        ]
      ],
      approvedBy: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^([A-Za-z]([_]|[ ])?)+')
        // ])
        // ])
        [
          this.fieldValidatorsService.nameWithSpaceField('Approved By'),
          this.fieldValidatorsService.requiredField('Approved By')
        ]
      ],
      approvalCode: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[a-zA-Z0-9-/]*$')
        // ])
        [
          this.fieldValidatorsService.approvalCodeField('Approval Code'),
          this.fieldValidatorsService.requiredField('Approval Code')
        ]
      ]
    });
    this.lossForm = this.fb.group({
      approvedBy: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^([A-Za-z]([_]|[ ])?)+')
        // ])
        [
          this.fieldValidatorsService.nameWithSpaceField('Approved By'),
          this.fieldValidatorsService.requiredField('Approved By')
        ]
      ],
      approvalCode: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[a-zA-Z0-9-/]*$')
        // ])
        [
          this.fieldValidatorsService.approvalCodeField('Approval Code'),
          this.fieldValidatorsService.requiredField('Approval Code')
        ]
      ]
    });

    this.translate
      .get(['pw.entity.otherIssueEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.otherIssueEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd && this.isLoggedIn),
        takeUntil(this.destroy$)
      )
      .subscribe(events => {
        const tab = this.activatedRoute.snapshot.params['tab'];
        this.changeTab(tab);
        this.showNotifications(0);
      });

    this.otherIssueFacade.loadStuddedProductGroups();
    this.resetOtherIssueCreateList();

    this.overlayNotification.close();

    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.showNotifications(0);
      });

    this.transferType = this.activatedRoute.snapshot.params['transferType'];
    this.tab = this.activatedRoute.snapshot.params['tab'];

    this.initialLoading();


  }
  initialLoading() {
    if (this.transferType === OtherReceiptsIssuesEnum.EXHIBITION) {
      this.reqType = OtherReceiptsIssuesEnum.EXHIBITION_TYPE;
    } else if (this.transferType === OtherReceiptsIssuesEnum.LOAN_TYPE) {
      this.reqType = OtherReceiptsIssuesEnum.LOAN;
    } else if (this.transferType === OtherReceiptsIssuesEnum.LOSS) {
      this.reqType = OtherReceiptsIssuesEnum.LOSS_TYPE;
    }
    this.otherIssueFacade.createOtherIssuesStockRequest({
      reqtype: this.reqType
    });
    this.getAppSettingsData();
    this.createOtherIssueStockRequestItemsResponse$ = this.otherIssueFacade.getCreateStockRequestItemsResponse();
    this.createOtherIssueStockRequestItemsResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data === null) {
          this.initialLoad();
        }
      });
    this.otherIssueFacade
      .getOtherIssuesStockRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe((responseData: any) => {
        if (responseData) {
          this.requestId = responseData.id;
          this.componentInit();
        }
      });
      this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => this.shortcutEventHandler(command));
  }
  getAppSettingsData() {
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        resp => (this.initialPageEvent.pageSize = JSON.parse(resp.toString()))
      );

    this.appSettingFacade
      .getMaxFilterLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxFilterLimit = data;
      });

    this.appSettingFacade
      .getMaxSortLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxSortLimit = data;
      });
    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((format: string) => {
        this.dateFormat = format;
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
      });
  }
  componentInit() {
    this.otherIssueFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.allOtherIssueCreateItems$ = this.otherIssueFacade.getAllOtherIssuesCreateItems();
    this.allOtherIssueCreateItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.allOtherIssueIds = data.concat();
        this.itemForm.controls.selectRadioButton.enable();
        this.allOtherIssueIdslength = this.allOtherIssueIds.length;
        this.itemIdsLength = this.allOtherIssueIdslength;
        if (data.length !== 0) {
          this.allProdctsTabTotalCountforPagination = data[0].totalElements;
          this.allOtherIssuesPageCount = data.length;
          if (
            (this.itemCode && this.itemCode !== '') ||
            (this.lotNumber && this.lotNumber !== '')
          ) {
            this.itemForm.patchValue({
              selectRadioButton: '2'
            });
            //this.selectChange();
          }
          if (this.itemForm.value.selectRadioButton === '1') {
            this.selectionAllSubject.next({
              selectCheckbox: true,
              enableCheckbox: false
            });
            this.showNotifications(data[0].totalElements);
          } else if (this.itemForm.value.selectRadioButton === '2') {
            this.selectionAllSubject.next({
              selectCheckbox: false,
              enableCheckbox: true
            });
            this.itemForm.patchValue({
              selectRadioButton: null
            });
            this.showNotifications(0);
          }
        }
      });
    this.selectedOtherIssueCreateItems$ = this.otherIssueFacade.getSelecetedIssuesCreateItems();
    this.selectedOtherIssueCreateItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.selectedtabOtherIssueIds = data.concat();
        this.itemForm.controls.selectRadioButton.enable();
        this.selectedtabOtherIssueIdslength = this.selectedtabOtherIssueIds.length;
        this.itemIdsLength = this.selectedtabOtherIssueIdslength;
        if (data.length !== 0) {
          this.selectedtabOtherIssuesPageCount = data.length;
          this.selectedTabTotalCountforPagination = data[0].totalElements;
          if (this.tab === OtherReceiptsIssuesEnum.SELECTED_PRODUCTS) {
            this.showNotifications(data[0].totalElements);
            if (
              (this.itemCode && this.itemCode !== '') ||
              (this.lotNumber && this.lotNumber !== '')
            ) {
              this.itemForm.patchValue({
                selectRadioButton: '2'
              });
              this.selectChange();
            }
            if (this.itemForm.value.selectRadioButton === '1') {
              this.selectionAllSubject.next({
                selectCheckbox: true,
                enableCheckbox: false
              });
              this.showNotifications(data[0].totalElements);
            } else if (this.itemForm.value.selectRadioButton === '2') {
              this.selectionAllSubject.next({
                selectCheckbox: false,
                enableCheckbox: true
              });
              this.itemForm.patchValue({
                selectRadioButton: null
              });
              this.selectedItemids = [];
              this.showNotifications(0);
            }
          }
        }
      });

    this.updateStockRequestResponse$ = this.otherIssueFacade.getupdateStockRequestResponse();
    this.updateStockRequestResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.reqDocNo) {
          const key = 'pw.otherReceiptsIssues.OtherIssueConfirmSuccessMessage';
          this.translate
            .get(key)
            .pipe(takeUntil(this.destroy$))
            .subscribe((translatedMessage: string) => {
              this.selectInfoCloseOverlay(
                translatedMessage.replace('{0}', data.reqDocNo.toString())
              );
            });
        }
      });
    this.isAllOtherIssueCreateItemsLoading$ = this.otherIssueFacade.getIsAllOtherIssueCreateItemsLoading();
    this.isSelectedOtherIssueCreateItemsLoading$ = this.otherIssueFacade.getselectIsSelectedOtherIssueItemsLoading();
    this.isOtherIssueCreateItemsTotalCountLoaded$ = this.otherIssueFacade.getselectIsOtherIssueCreateTotalCountLoaded();
    this.isOtherIssueCreateItemsTotalCountLoading$ = this.otherIssueFacade.getselectIsOtherIssueCreateTotalCountLoading();
    this.isSearchingOtherIssueCreateItems$ = this.otherIssueFacade.getisSearchingOtherIssueCreateItems();
    this.hasSearchedOtherIssueCreateItems$ = this.otherIssueFacade.gethasSearchedOtherIssueCreateItems();
    this.initialLoad();

    this.otherIssueFacade
      .getallOtherIssueCreateItemsTotalCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        this.allOtherIssuesCreateCount = count;
      });

    this.otherIssueFacade
      .getSelectedOtherIssueCreateTotalCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        this.selectedOtherIssuesCreateCount = count;
      });

    this.removeOtherIssueStockRequestItemsResponse$ = this.otherIssueFacade.getRemoveOtherIssueStockRequestItemsResponse();
    this.removeOtherIssueStockRequestItemsResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data === null) {
          this.selectInfoOverlay('Removed successfully');
          this.initialLoad();
        }
      });
    this.getFilterAndSortData();
  }
  getFilterAndSortData() {
    this.otherIssueFacade.loadProductCategories();
    this.otherIssueFacade.loadProductGroups(null);
    this.otherIssueFacade
      .getProductCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productCategories: ProductCategory[]) => {
        if (productCategories !== null) {
          this.productCategory = this.mapToFilterOptions(
            'Product Category',
            productCategories.map(productCategory => ({
              id: productCategory.productCategoryCode,
              description: productCategory.description
            }))
          );
        }
      });

    this.otherIssueFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroups: ProductGroup[]) => {
        if (productGroups !== null) {
          this.productGroup = this.mapToFilterOptions(
            'Product Group',
            productGroups.map(productGroup => ({
              id: productGroup.productGroupCode,
              description: productGroup.description
            }))
          );
        }
      });
    this.filterDataAllProducts = this.otherIssueFacade.getfilterDataAllProducts();
    this.filterDataAllProducts
      .pipe(takeUntil(this.destroy$))
      .subscribe(filterValue => {
        this.filterTabDataAllProducts = filterValue;
      });
    this.filterDataSelectedProducts = this.otherIssueFacade.getfilterDataSelectedProducts();
    this.filterDataSelectedProducts
      .pipe(takeUntil(this.destroy$))
      .subscribe(filterValue => {
        this.filterTabDataSelectedProducts = filterValue;
      });

    this.sortDataAllProducts = this.otherIssueFacade.getSortDataAllProducts();
    this.sortDataAllProducts
      .pipe(takeUntil(this.destroy$))
      .subscribe(sortValue => {
        this.sortTabDataAllProducts = sortValue;
      });
    this.sortDataSelectedProducts = this.otherIssueFacade.getSortDataSelectedProducts();
    this.sortDataSelectedProducts
      .pipe(takeUntil(this.destroy$))
      .subscribe(sortValue => {
        this.sortTabDataSelectedProducts = sortValue;
      });
  }
  initialLoad() {
    this.resetValue();
    this.getTotalCount();
    this.loadAllProducts();
    this.loadSelectedProducts();
  }
  conditionalLoad() {
    if (this.tab === OtherReceiptsIssuesEnum.ALL) {
      this.loadAllProducts();
    } else {
      this.loadSelectedProducts();
    }
  }
  getTotalCount() {
    this.otherIssueFacade.loadOtherIssueItemsCreateTotalCount({
      reqtype: this.reqType,
      id: this.requestId
    });
  }
  loadAllProducts() {
    if (this.requestId) {
      this.otherIssueFacade.loadAllOtherIssueCreateItems({
        id: this.requestId,
        pageIndex: this.allOtherIssueItemsPageEvent.pageIndex,
        pageSize: this.allOtherIssueItemsPageEvent.pageSize,
        reqtype: this.reqType,
        itemCode: this.itemCode,
        lotNumber: this.lotNumber,
        sort: this.sortMapAllProducts,
        filter: this.filterAllProducts
      });
      if (this.itemForm.value.selectRadioButton === '1') {
        this.showNotifications(this.allOtherIssuesCreateCount);
      }
    }
  }
  loadSelectedProducts() {
    if (this.requestId) {
      this.otherIssueFacade.loadSelectedOtherIssueCreateItems({
        id: this.requestId,
        pageIndex: this.selectedOtherIssueItemsPageEvent.pageIndex,
        pageSize: this.selectedOtherIssueItemsPageEvent.pageSize,
        reqtype: this.reqType,
        itemCode: this.itemCode,
        lotNumber: this.lotNumber,
        sort: this.sortMapSelectedProducts,
        filter: this.filterSelectedProducts
      });
    }
  }
  paginateAllOtherIssueCreateItems(event: PageEvent) {
    this.overlayNotification.close();
    this.allOtherIssueItemsPageEvent = event;
    this.loadAllProducts();
  }

  paginateSelectedOtherIssueCreateItems(event: PageEvent) {
    this.overlayNotification.close();
    this.selectedOtherIssueItemsPageEvent = event;
    this.loadSelectedProducts();
  }

  // changeTab(newTab: OtherReceiptsIssuesEnum) {
  //   this.itemForm.patchValue({ selectRadioButton: null });
  //   if (this.tab !== newTab) {
  //     this.tab = newTab;
  //     this.router.navigate(['..', this.tab], {
  //       relativeTo: this.activatedRoute
  //     });

  //     this.resetValue();
  //   } else {
  //     this.clearSearchItems();
  //   }
  // }

  changeTab(newTab: OtherReceiptsIssuesEnum) {
    this.itemForm.patchValue({ selectRadioButton: null });
    if (this.tab !== newTab) {
      this.tab = newTab;
      this.clearSearchItems();
      this.router
        .navigate(['..', this.tab], {
          relativeTo: this.activatedRoute
        })
        .then(() => {
          this.showNotifications(0);
        });
      this.resetValue();
    }
  }

  selectChange() {
    if (this.itemForm.value.selectRadioButton === '1') {
      this.selectAll();
    } else if (this.itemForm.value.selectRadioButton === '2') {
      this.selectPagewise();
    }
  }
  createForm(): FormGroup {
    return new FormGroup({
      selectRadioButton: new FormControl(null)
    });
  }

  searchItems(searchData: ItemSearchResponse) {
    this.itemCode = searchData.searchValue;
    this.lotNumber = searchData.lotNumber;
    if (!searchData.isValid) {
      this.otherIssueFacade.clearItems();
    } else {
      if (
        (this.tab === OtherReceiptsIssuesEnum.ALL &&
          this.allOtherIssuesCreateCount !== 0) ||
        (this.tab === OtherReceiptsIssuesEnum.SELECTED_PRODUCTS &&
          this.selectedOtherIssuesCreateCount !== 0)
      ) {
        this.overlayNotification.close();
        this.selectedItemids = [];
        this.itemForm.patchValue({
          selectRadioButton: null
        });
        this.selectionAllSubject.next({
          selectCheckbox: false,
          enableCheckbox: true
        });
        this.conditionalLoad();
      }
    }
  }
  clearSearchItems() {
    this.itemCode = null;
    this.lotNumber = null;
    if (this.searchRef) {
      this.searchRef.reset();
    }
    this.selectedItemids = [];
    this.itemForm.controls.selectRadioButton.disable();
    this.itemForm.patchValue({ selectRadioButton: null });

    this.overlayNotification.close();
    this.conditionalLoad();
  }
  clearAll() {
    this.itemForm.patchValue({
      selectRadioButton: null
    });
    this.selectionAllSubject.next({
      selectCheckbox: false,
      enableCheckbox: true
    });
    this.selectedItemids = [];

    this.overlayNotification.close();
    this.showNotifications(this.selectedItemids.length);
  }

  selectItemsOverlay(count: number, key: any) {
    this.hasNotification = true;
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: 'SELECT PRODUCTS',
            message: count + ' ' + translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.hasNotification = true;
              if (this.itemForm.value.selectRadioButton === '1') {
                this.otherIssueFacade.createOtherIssueStockRequestItems({
                  id: this.requestId,
                  data: [],
                  requestType: this.reqType
                });
                this.clearSearchItems();
                this.resetValue();
                this.itemForm.patchValue({ selectRadioButton: null });
              } else if (this.itemForm.value.selectRadioButton === '2') {
                const itemArray = [];
                this.allOtherIssueIds.forEach(itemList => {
                  itemArray.push({
                    inventoryId: itemList.inventoryId,
                    measuredWeight: itemList.availableWeight,
                    quantity: itemList.availableQuantity
                  });
                });
                this.clearSearchItems();
                this.resetValue();
                this.otherIssueFacade.createOtherIssueStockRequestItems({
                  id: this.requestId,
                  data: itemArray,
                  requestType: this.reqType
                });
              } else if (
                this.itemForm.value.selectRadioButton === null &&
                this.selectedItemids.length !== 0
              ) {
                const itemArray = [];
                this.selectedItemids.forEach(selectedItemList => {
                  itemArray.push({
                    inventoryId: selectedItemList.inventoryId,
                    measuredWeight: selectedItemList.availableWeight,
                    quantity: selectedItemList.availableQuantity
                  });
                });
                this.clearSearchItems();
                this.resetValue();
                this.otherIssueFacade.createOtherIssueStockRequestItems({
                  id: this.requestId,
                  data: itemArray,
                  requestType: this.reqType
                });
              }
            }
          });
      });
  }
  confirmOverlay(key: string) {
    this.hasNotification = true;
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: 'GET APPROVAL',
            hasRemarks: true,
            isRemarksMandatory: true,
            message: translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              if (this.transferType === OtherReceiptsIssuesEnum.EXHIBITION) {
                if (this.addressForm.invalid) {
                  this.hasNotification = true;
                  this.confirmOverlay(
                    'pw.otherReceiptsIssues.enterAddressDetailsNotificationMessage'
                  );
                } else {
                  this.hasNotification = true;
                  this.showProgressNotification();
                  this.otherIssueFacade.updateStockRequest({
                    id: this.requestId,
                    reqType: this.reqType,
                    approvalDetails: {
                      data: {
                        approvalCode: this.addressForm.value.approvalCode,
                        approvedBy: this.addressForm.value.approvedBy
                      },
                      type: JsonTypeEnum.APPROVAL_TYPE
                    },
                    carrierDetails: {
                      type: JsonTypeEnum.ADDRESS_TYPE,
                      data: {
                        address1: this.addressForm.value.address1,
                        address2: this.addressForm.value.address2,
                        city: this.addressForm.value.city,
                        town: this.addressForm.value.state,
                        pincode: this.addressForm.value.pinCode
                      }
                    },
                    remarks: event.data,
                    status: OtherReceiptsIssuesEnum.APVL_PENDING_STATUS
                  });
                }
              } else if (
                this.transferType === OtherReceiptsIssuesEnum.LOAN_TYPE
              ) {
                if (this.employeeForm.invalid) {
                  this.hasNotification = true;
                  this.confirmOverlay(
                    'pw.otherReceiptsIssues.enterEmployeeDetailsNotificationMessage'
                  );
                } else {
                  this.hasNotification = true;
                  this.showProgressNotification();
                  this.otherIssueFacade.updateStockRequest({
                    id: this.requestId,
                    reqType: this.reqType,
                    approvalDetails: {
                      data: {
                        approvalCode: this.employeeForm.value.approvalCode,
                        approvedBy: this.employeeForm.value.approvedBy
                      },
                      type: JsonTypeEnum.APPROVAL_TYPE
                    },
                    carrierDetails: {
                      type: JsonTypeEnum.LOAN_TYPE,
                      data: {
                        employeeId: this.employeeForm.value.employeeId,
                        employeeName: this.employeeForm.value.employeeName,
                        designation: this.employeeForm.value.designation,
                        emailId: this.employeeForm.value.emailId,
                        mobileNo: this.employeeForm.value.mobileNo,
                        brand: this.employeeForm.value.brand
                      }
                    },
                    remarks: event.data,
                    status: OtherReceiptsIssuesEnum.APVL_PENDING_STATUS
                  });
                }
              } else if (this.transferType === OtherReceiptsIssuesEnum.LOSS) {
                if (this.lossForm.invalid) {
                  this.hasNotification = true;
                  this.confirmOverlay(
                    'pw.otherReceiptsIssues.enterApprovalDetailsNotificationMessage'
                  );
                } else {
                  this.hasNotification = true;
                  this.showProgressNotification();
                  this.otherIssueFacade.updateStockRequest({
                    id: this.requestId,
                    reqType: this.reqType,
                    approvalDetails: {
                      data: {
                        approvalCode: this.lossForm.value.approvalCode,
                        approvedBy: this.lossForm.value.approvedBy
                      },
                      type: JsonTypeEnum.APPROVAL_TYPE
                    },
                    carrierDetails: null,
                    remarks: event.data,
                    status: OtherReceiptsIssuesEnum.APVL_PENDING_STATUS
                  });
                }
              }
            }
          });
      });
  }
  selectAll() {
    if (this.tab === OtherReceiptsIssuesEnum.ALL) {
      this.selectedItemids = this.allOtherIssueIds.concat();
      this.productToBeSavedCount = this.allOtherIssuesCreateCount;
      this.itemIdsLength = this.allOtherIssueIdslength;
    } else if (this.tab === OtherReceiptsIssuesEnum.SELECTED_PRODUCTS) {
      this.selectedItemids = this.selectedtabOtherIssueIds.concat();
      this.productToBeSavedCount = this.selectedOtherIssuesCreateCount;
      this.itemIdsLength = this.selectedtabOtherIssueIdslength;
    }
    this.selectionAllSubject.next({
      selectCheckbox: true,
      enableCheckbox: false
    });
    this.showNotifications(this.productToBeSavedCount);
  }
  selectPagewise() {
    if (this.tab === OtherReceiptsIssuesEnum.ALL) {
      this.selectedItemids = this.allOtherIssueIds.concat();
      this.productToBeSavedCount = this.allOtherIssuesPageCount;
      this.itemIdsLength = this.allOtherIssueIdslength;
    } else if (this.tab === OtherReceiptsIssuesEnum.SELECTED_PRODUCTS) {
      this.selectedItemids = this.selectedtabOtherIssueIds.concat();
      this.productToBeSavedCount = this.selectedtabOtherIssuesPageCount;
      this.itemIdsLength = this.selectedtabOtherIssueIdslength;
    }
    this.selectionAllSubject.next({
      selectCheckbox: true,
      enableCheckbox: true
    });
    this.showNotifications(this.productToBeSavedCount);
  }
  selectionEmit(event) {
    if (event.selected === false) {
      this.itemForm.patchValue({
        selectRadioButton: null
      });
      this.productToBeSavedCount = 0;
      const itemToRemove = event.item;
      this.selectedItemids.splice(
        this.selectedItemids.indexOf(itemToRemove),
        1
      );
    } else if (event.selected === true) {
      this.selectedItemids.push(event.item);
      if (
        this.tab === OtherReceiptsIssuesEnum.ALL &&
        this.selectedItemids.length === this.allOtherIssueIdslength
      ) {
        this.itemForm.patchValue({
          selectRadioButton: '2'
        });
      }
      if (
        this.tab === OtherReceiptsIssuesEnum.SELECTED_PRODUCTS &&
        this.selectedItemids.length === this.selectedtabOtherIssueIdslength
      ) {
        this.itemForm.patchValue({
          selectRadioButton: '2'
        });
      }
    }
    this.productToBeSavedCount = this.selectedItemids.length;
    this.showNotifications(this.productToBeSavedCount);
  }
  showNotifications(count) {
    this.overlayNotification.close();
    if (
      this.tab === OtherReceiptsIssuesEnum.ALL &&
      this.allOtherIssueIdslength !== 0
    ) {
      if (count) {
        this.selectItemsOverlay(
          count,
          'pw.otherReceiptsIssues.productsSelectedNotificationMessage'
        );
      } else {
        this.overlayNotification.close();
      }
    } else if (
      this.tab === OtherReceiptsIssuesEnum.SELECTED_PRODUCTS &&
      this.selectedtabOtherIssueIdslength !== 0
    ) {
      if (this.itemForm.value.selectRadioButton === null) {
        if (
          this.selectedItemids.length === 0 &&
          this.filterSelectedProducts.length === 0
        ) {
          this.confirmOverlay(
            'pw.otherReceiptsIssues.issueAllProductsNotificationMessage'
          );
        } else if (this.selectedItemids.length !== 0) {
          this.deleteItemsOverlay(count, ' Products to be removed');
        }
      } else {
        this.deleteItemsOverlay(count, ' Products to be removed');
      }
    }
  }
  deleteItemsOverlay(count: number, key: string) {
    this.hasNotification = true;
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: 'REMOVE PRODUCTS',
            message: count + ' ' + translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.hasNotification = true;
              if (this.itemForm.value.selectRadioButton === '1') {
                this.otherIssueFacade.removeOtherIssueStockRequestItems({
                  id: this.requestId,
                  data: [],
                  requestType: this.reqType
                });
                this.clearSearchItems();
                this.resetValue();
                this.itemForm.patchValue({ selectRadioButton: null });
              }
              if (this.itemForm.value.selectRadioButton === '2') {
                const itemIds = [];
                this.selectedtabOtherIssueIds.forEach(element => {
                  itemIds.push(element.id);
                });
                this.clearSearchItems();
                this.resetValue();
                this.otherIssueFacade.removeOtherIssueStockRequestItems({
                  id: this.requestId,
                  data: itemIds,
                  requestType: this.reqType
                });
              } else if (
                this.itemForm.value.selectRadioButton === null &&
                this.selectedItemids.length !== 0
              ) {
                const itemIds = [];
                this.selectedItemids.forEach(element => {
                  itemIds.push(element.id);
                });
                this.clearSearchItems();
                this.resetValue();
                this.otherIssueFacade.removeOtherIssueStockRequestItems({
                  id: this.requestId,
                  data: itemIds,
                  requestType: this.reqType
                });
              }
              this.getTotalCount();
            }
          });
      });
  }
  quantity(event) {
    this.otherIssueFacade.updateStockRequestCreateItem({
      id: this.requestId,
      itemid: event.itemId,
      reqType: this.reqType,
      value: {
        inventoryId: event.inventoryId,
        measuredWeight: event.measuredWeight,
        quantity: event.quantity,
        status: event.status
      }
    });
  }
  resetValue() {
    this.allOtherIssueIds = [];
    this.selectedItemids = [];
    this.itemIdsLength = 0;
    this.productToBeSavedCount = 0;
    this.selectedtabOtherIssueIds = [];
  }
  resetOtherIssueCreateList() {
    this.otherIssueFacade.resetOtherIssueCreateListItems();
    this.otherIssueFacade.resetOtherIssueCreateResponse();
    this.sortMapAllProducts.clear();
    this.sortMapSelectedProducts.clear();
    this.filterMapAllProducts.clear();
    this.filterMapSelectedProducts.clear();
  }
  selectInfoOverlay(msg: any) {
    this.hasNotification = true;
    this.overlayNotification.show({
      type: OverlayNotificationType.SIMPLE,
      message: msg
    });
  }
  showProgressNotification() {
    const key = 'pw.stockReceiveNotificationMessages.progressMessage';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.PROGRESS,
          message: translatedMsg,
          hasBackdrop: true
        });
      });
  }
  selectInfoCloseOverlay(msg: string) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: msg,
        hasBackdrop: true,
        hasClose: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          const url = getOtherIssuesReceiptUrl(
            OtherReceiptsIssuesEnum.OTHER_ISSUES,
            this.transferType
          );
          /* '/inventory/instock/other-receipts-issues-list/otherissues/' +
            this.transferType; */
          this.router.navigateByUrl(url);
        }
      });
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }
  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case mainSearchShortCutKey: {
        if (this.searchRef) {
          this.dialog.closeAll();
          this.searchRef.focus();
        }
        break;
      }
      case filterShortCutKey: {
        this.openFilter();
        break;
      }
      case sortShortCutKey: {
        this.openSort();
        break;
      }
      case backShortCutKey: {
        this.back();
        this.dialog.closeAll();
        break;
      }
      case clearAllShortCutKey: {
        this.dialog.closeAll();
        this.clearAll();
        break;
      }
      case tab1ShortcutKey: {
        this.changeTab(OtherReceiptsIssuesEnum.ALL);
        break;
      }
      case tab2ShortcutKey: {
        this.changeTab(OtherReceiptsIssuesEnum.SELECTED_PRODUCTS);
        break;
      }
      case selectAllShortCutKey: {
        this.dialog.closeAll();
        this.itemForm.patchValue({
          selectRadioButton: '1'
        });
        this.selectAll();
        break;
      }
      case currentPageShortCutKey: {
        this.dialog.closeAll();
        this.itemForm.patchValue({
          selectRadioButton: '2'
        });
        this.selectPagewise();
        break;
      }
    }
  }

  openFilter(): void {
    this.filterService.DataSource = {
      ...this.productCategory,
      ...this.productGroup
    };
    this.dialog.closeAll();
    let filterTabData: { [key: string]: Filter[] } = {};
    if (this.tab === OtherReceiptsIssuesEnum.ALL) {
      filterTabData = this.filterTabDataAllProducts;
    } else if (this.tab === OtherReceiptsIssuesEnum.SELECTED_PRODUCTS) {
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
            if (this.tab === OtherReceiptsIssuesEnum.ALL) {
              this.otherIssueFacade.setOtherIssueAllProductsFilter(
                filterResult.data
              );
              const filterData = filterResult.data;
              if (filterData == null) {
                this.filterData = {};
              } else {
                this.filterData = filterData;
              }
              this.filterAllProducts = [];
              if (filterData) {
                let filterValues = [];
                if (filterData['Product Group']) {
                  filterData['Product Group'].forEach(value => {
                    filterValues.push(value.id);
                  });
                  if (filterValues.length > 0) {
                    this.filterAllProducts.push({
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
                    this.filterAllProducts.push({
                      key: 'productCategory',
                      value: filterValues
                    });
                  }
                }
              }
              this.allOtherIssueItemsPageEvent = this.initialPageEvent;
            } else if (this.tab === OtherReceiptsIssuesEnum.SELECTED_PRODUCTS) {
              this.otherIssueFacade.setOtherIssueSelectedProductsFilter(
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
              this.selectedOtherIssueItemsPageEvent = this.initialPageEvent;
            }
            this.conditionalLoad();
            this.clearAll();
          }
        }
      );
  }
  openSort(): void {
    this.dialog.closeAll();
    let sortTabData: Column[] = [];
    if (this.tab === OtherReceiptsIssuesEnum.ALL) {
      sortTabData = this.sortTabDataAllProducts;
    } else if (this.tab === OtherReceiptsIssuesEnum.SELECTED_PRODUCTS) {
      sortTabData = this.sortTabDataSelectedProducts;
    }
    this.sortDialogService
      .openDialog(this.maxSortLimit, sortTabData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        if (sortResult.actionfrom === FilterActions.APPLY) {
          if (this.tab === OtherReceiptsIssuesEnum.ALL) {
            this.otherIssueFacade.setOtherIssueAllProductsSort(sortResult.data);
            this.sortMapAllProducts.clear();
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
                this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
              }
            }
            if (this.sortBy !== null && this.sortOrder !== null) {
              this.sortMapAllProducts.set(
                'sort',
                this.sortBy + ',' + this.sortOrder
              );
            }
            this.allOtherIssueItemsPageEvent = this.initialPageEvent;
          } else if (this.tab === OtherReceiptsIssuesEnum.SELECTED_PRODUCTS) {
            this.otherIssueFacade.setOtherIssueSelectedProductsSort(
              sortResult.data
            );
            this.sortMapSelectedProducts.clear();
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
                this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
              }
            }
            if (this.sortBy !== null && this.sortOrder !== null) {
              this.sortMapSelectedProducts.set(
                'sort',
                this.sortBy + ',' + this.sortOrder
              );
            }
            this.selectedOtherIssueItemsPageEvent = this.initialPageEvent;
          }
          this.conditionalLoad();
          this.clearAll();
        }
      });
  }
  mapToFilterOptions(
    key: string,
    options: OtherIssuesFilterOption[]
  ): { [key: string]: Filter[] } {
    return {
      [key]: options.map(option => ({
        id: option.id,
        description: option.description,
        selected: false
      }))
    };
  }
  back() {

    this.router.navigate([getOtherIssuesDefaultUrl()]);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.overlayNotification.close();
  }
}
