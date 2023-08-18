import { StockReceiveReasonForDelayPopupComponent } from '@poss-web/eposs/stock-receive/ui-stock-receive-popup';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { StockReceiveFacade } from '@poss-web/eposs/stock-receive/data-access-stock-receive';
import {
  SortDialogService,
  Column
} from '@poss-web/shared/components/ui-sort-dialog';
import {
  FilterService,
  Filter
} from '@poss-web/shared/components/ui-filter-dialog';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  ItemSearchComponent,
  ItemSearchResponse
} from '@poss-web/shared/item/ui-item-search';
import {
  getStockReceiveRouteUrl
} from '@poss-web/shared/util-site-routes';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  StockReceiveLoadItemsTotalCountPayload,
  StockItemBinGroupCodeEnum,
  StockReceiveCarrierTypesEnum,
  StockReceiveItemStatusEnum,
  StockReceiveTabEnum,
  StockStatusEnum,
  StockReceiveTypesEnum,
  StockReceiveAPITypesEnum,
  CustomErrors,
  Lov,
  BinCode,
  StockReceiveStock,
  StockReceiveItem,
  StockReceiveItemToUpdate,
  StockReceiveConfirmReceive,
  StockReceiveItemValidate,
  StockReceiveLoadItemsPayload,
  OverlayNotificationServiceAbstraction,
  ProductGroup,
  ProductCategory,
  OverlayNotificationType,
  OverlayNotificationEventType,
  OverlayNotificationEventRef,
  Command,
  ShortcutServiceAbstraction,
  SharedBodEodFeatureServiceAbstraction,
  StockReceiveTotalMeasuredWeightPayload,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum
} from '@poss-web/shared/models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { takeUntil, filter, take, withLatestFrom } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { Moment } from 'moment';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

export const searchShortcutKey = 'StockReceiveDetailsComponent.MAIN_SEARCH';
export const filterShortcutKey = 'StockReceiveDetailsComponent.FILTER';
export const sortShortcutKey = 'StockReceiveDetailsComponent.SORT';
export const binSelectionShortcutKey =
  'StockReceiveDetailsComponent.PRIMARY_DROPDOWN';
export const backShortcutKey = 'StockReceiveDetailsComponent.BACK';
const componentName = 'StockReceiveDetailsComponent';
const tab1ShortcutKey = 'Common.TAB_1';
const tab2ShortcutKey = 'Common.TAB_2';

@Component({
  selector: 'poss-web-stock-receive-details',
  templateUrl: './stock-receive-details.component.html',
  styleUrls: ['./stock-receive-details.component.scss']
})
export class StockReceiveDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  private confirmSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild(ItemSearchComponent, { static: true })
  private searchRef: ItemSearchComponent;

  selectedStock: StockReceiveStock;
  tab: StockReceiveTabEnum;
  stockReceiveTabEnumRef = StockReceiveTabEnum;
  initailPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  itemsPageEvent: PageEvent;
  nonVerifiedItemsTotalCount = 0;
  verifiedItemsTotalCount = 0;
  itemsTotalCountLoaded$: Observable<boolean>;
  itemsTotalCountLoading$: Observable<boolean>;
  items$: Observable<StockReceiveItem[]>;
  binCodes: BinCode[] = [];
  remarks$: Observable<Lov[]>;
  type: string;
  stockId: string;
  storeType: string;
  error$: Observable<CustomErrors>;
  isLoadingSelectedStock$: Observable<boolean>;
  isLoadingBinGroups$: Observable<boolean>;
  isLoadingRemarks$: Observable<boolean>;
  isItemsLoading$: Observable<boolean>;
  isItemsLoaded$: Observable<boolean>;
  itemsCount = 0;
  isAssigningBinToAllItems$: Observable<boolean>;
  hasNotification = false;
  isverifiedCountShownOnce = false;
  itemCode: string;
  lotNumber: string;
  binGroupCode: string;
  isL1L2Store: boolean;
  isL3Store: boolean;
  maxHoursOfDelay = 48;
  stockForm: FormGroup;
  maxFilterLimit: number;
  maxSortLimit: number;
  filter: { key: string; value: any[] }[] = [];
  filterData: { [key: string]: Filter[] } = {};
  nonVerifiedFilterData: { [key: string]: Filter[] } = {};
  nonVerifiedFilter: { key: string; value: any[] }[] = [];
  verifiedFilterData: { [key: string]: Filter[] } = {};
  verifiedFilter: { key: string; value: any[] }[] = [];
  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;
  nonVerifiedSortData: Column[] = [];
  nonVerifiedSortBy: string;
  nonVerifiedSortOrder: string;
  verifiedSortData: Column[] = [];
  verifiedSortBy: string;
  verifiedSortOrder: string;
  nonVerifieditemCode: string;
  nonVerifiedlotNumber: string;
  verifieditemCode: string;
  verifiedlotNumber: string;
  isParentFormDirty = false;
  stockReceiveCarrierTypesEnumRef = StockReceiveCarrierTypesEnum;
  isShowingErrorNotifcation = false;
  destDocNo = 0;
  productCategories: { [key: string]: Filter[] } = {};
  productGroups: { [key: string]: Filter[] } = {};
  productCategoryFilterLable: string;
  productGroupFilterLable: string;
  binsForSelection: SelectionDailogOption[] = [];
  selectedBinCode: string;
  searchBinCodeLable: string;
  selectBinCodeLable: string;
  isItemLoadedOnce = false;
  stockReceiveEnumRef = StockReceiveTypesEnum;
  pageSizeOptions: number[] = [];
  showEmptyResultMsg = false;
  isloadingItems = false;
  businessDate: Moment;
  totalMeasuredWeight: number;

  private moveToVerfified = true;
  private destroy$: Subject<null> = new Subject<null>();

  isLoggedIn: boolean;
  noDataFoundMessage;
  isLoadImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private stockReceiveFacade: StockReceiveFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private shortcutService: ShortcutServiceAbstraction,
    private filterService: FilterService,
    private sortService: SortDialogService,
    private selectionDialog: SelectionDialogService,
    private dialog: MatDialog,
    private profiledatafacade: ProfileDataFacade,
    private authFacade: AuthFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
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

    this.translate
      .get([
        'pw.stockReceive.productCategoryFilterLable',
        'pw.stockReceive.productGroupFilterLable',
        'pw.stockReceive.itemWeightSortLable',
        'pw.stockReceive.itemQuantityLable',
        'pw.stockReceive.searchBinCodeLable',
        'pw.stockReceive.selectBinCodeLable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.searchBinCodeLable =
          translatedMessages['pw.stockReceive.searchBinCodeLable'];
        this.selectBinCodeLable =
          translatedMessages['pw.stockReceive.selectBinCodeLable'];

        this.productCategoryFilterLable =
          translatedMessages['pw.stockReceive.productCategoryFilterLable'];
        this.productGroupFilterLable =
          translatedMessages['pw.stockReceive.productGroupFilterLable'];
        this.sortService.DataSource = [
          {
            id: 0,
            sortByColumnName:
              translatedMessages['pw.stockReceive.itemWeightSortLable'],
            sortAscOrder: false
          },
          {
            id: 1,
            sortByColumnName:
              translatedMessages['pw.stockReceive.itemQuantityLable'],
            sortAscOrder: false
          }
        ];
      });
    this.stockForm = new FormGroup({
      courierReceivedDate: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
    this.stockReceiveFacade.resetError();
    this.isLoadingImage$ = this.stockReceiveFacade.getIsLoadingImage();
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessDate => {
        this.businessDate = moment(businessDate);
        this.stockForm.patchValue({ courierReceivedDate: this.businessDate });
      });

    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.router.events
      .pipe(
        filter(
          (event: Event) => event instanceof NavigationEnd && this.isLoggedIn
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const tab = this.activatedRoute.snapshot.params['tab'];
        this.changeTab(tab);
        this.showNotifications();
      });

    this.stockId = this.activatedRoute.snapshot.params['_id'];
    this.type = this.activatedRoute.snapshot.params['type'];
    this.tab = this.activatedRoute.snapshot.params['tab'];

    this.stockReceiveFacade.loadStuddedProductGroups();
    this.stockReceiveFacade.loadProductGroups();
    this.stockReceiveFacade.loadProductCategories();

    this.stockReceiveFacade
      .getSearchReset()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: { reset: boolean }) => {
        if (data && data.reset) {
          this.clearSearchItems();
        }
      });

    this.stockReceiveFacade
      .getIsItemsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isloadingItems => {
        this.isloadingItems = isloadingItems;
      });

    this.stockReceiveFacade
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

    this.stockReceiveFacade
      .getProductCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productCategories: ProductCategory[]) => {
        this.productCategories = this.mapToFilterOptions(
          this.productCategoryFilterLable,
          productCategories.map((productCategory: ProductCategory) => ({
            id: productCategory.productCategoryCode,
            description: productCategory.description,
            selected: false
          }))
        );
      });

    this.profiledatafacade
      .getBoutiqueType()
      .pipe(
        filter((val: string) => !!val),
        withLatestFrom(
          this.profiledatafacade.isL1Boutique(),
          this.profiledatafacade.isL2Boutique(),
          this.profiledatafacade.isL3Boutique(),
          this.appSettingFacade.getPageSize(),
          this.appSettingFacade.getMaxFilterLimit(),
          this.appSettingFacade.getPageSizeOptions(),
          this.appSettingFacade.getMaxSortLimit()
        ),
        take(1)
      )
      .subscribe(([val, val1, val2, val3, val4, val5, val6, val7]) => {
        this.storeType = val;
        this.isL1L2Store = val1 || val2;
        this.isL3Store = val3;
        this.binGroupCode = this.isL1L2Store
          ? StockItemBinGroupCodeEnum.STN
          : StockItemBinGroupCodeEnum.PURCFA;

        this.initailPageEvent.pageSize = val4;
        this.itemsPageEvent = this.initailPageEvent;
        this.maxFilterLimit = val5;
        this.pageSizeOptions = val6;
        this.maxSortLimit = val7;

        this.componentInit();
      });
      this.shortcutService.componentNames = [componentName]; 
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe((command: Command) => this.shortcutEventHandler(command));
  }

  back(event = null) {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate([getStockReceiveRouteUrl(this.type)]);
  }

  changeTab(newTab: StockReceiveTabEnum) {
    if (this.tab !== newTab) {
      this.isShowingErrorNotifcation = false;
      this.tab = newTab;

      switch (this.tab) {
        case StockReceiveTabEnum.NON_VERIFIED: {
          this.nonVerifiedFilterData = this.filterData;
          this.nonVerifiedFilter = this.filter;
          this.filterData = this.verifiedFilterData;
          this.filter = this.verifiedFilter;

          this.nonVerifiedSortData = this.sortData;
          this.nonVerifiedSortBy = this.sortBy;
          this.nonVerifiedSortOrder = this.sortOrder;
          this.sortData = this.verifiedSortData;
          this.sortBy = this.verifiedSortBy;
          this.sortOrder = this.verifiedSortOrder;

          this.nonVerifieditemCode = this.itemCode;
          this.nonVerifiedlotNumber = this.lotNumber;
          break;
        }
        case StockReceiveTabEnum.VERIFIED: {
          this.verifiedFilterData = this.filterData;
          this.verifiedFilter = this.filter;
          this.filterData = this.nonVerifiedFilterData;
          this.filter = this.nonVerifiedFilter;

          this.verifiedSortData = this.sortData;
          this.verifiedSortBy = this.sortBy;
          this.verifiedSortOrder = this.sortOrder;
          this.sortData = this.nonVerifiedSortData;
          this.sortBy = this.nonVerifiedSortBy;
          this.sortOrder = this.nonVerifiedSortOrder;

          this.verifieditemCode = this.itemCode;
          this.verifiedlotNumber = this.lotNumber;
          break;
        }
      }

      this.stockReceiveFacade.clearItems();
      this.itemCode = null;
      this.lotNumber = null;

      if (this.searchRef) {
        this.searchRef.reset();
      }

      this.hasNotification = false;

      this.router
        .navigate(['..', this.tab], {
          relativeTo: this.activatedRoute
        })
        .then(_ => {
          this.itemsPageEvent = this.initailPageEvent;
          this.stockReceiveFacade.loadItemsTotalCount(
            this.createLoadCountPayLoad()
          );
          this.loadItems();
        });
    }
  }

  /**
   * clears the search result
   */
  clearSearchItems() {
    this.itemCode = null;
    this.lotNumber = null;
    if (this.searchRef) {
      this.searchRef.reset();
    }
    this.itemsPageEvent = this.initailPageEvent;
    this.loadItems();
  }

  paginate(event: PageEvent) {
    this.itemsPageEvent = event;
    this.initailPageEvent.pageSize = event.pageSize;
    this.loadItems();
  }

  onParentFormDirty(isDirty) {
    this.isParentFormDirty = isDirty;
    this.showNotifications();
  }

  openBinSelectionPopup(event = null) {
    if (event) {
      event.stopPropagation();
    }
    this.selectionDialog
      .open({
        title: this.selectBinCodeLable,
        placeholder: this.searchBinCodeLable,
        options: this.binsForSelection
      })
      .pipe(take(1))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedBinCode = selectedOption.id;
          this.showProgressNotification();
          this.stockReceiveFacade.assignBinToAllItems({
            storeType: this.storeType,
            type: this.selectedStock.type,
            id: this.selectedStock.id,
            data: {
              binCode: selectedOption.id
            }
          });
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

            this.itemsPageEvent = this.initailPageEvent;
            this.selectedBinCode = null;
            this.loadItems();
          }
        }
      );
  }

  openSortDailog() {
    this.dialog.closeAll();
    this.sortService
      .openDialog(this.maxSortLimit, this.sortData)
      .pipe(take(1))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
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
                this.sortBy = 'issuedWeight';
              } else if (sortData[0].id === 1) {
                this.sortBy = 'issuedQuantity';
              }
              this.sortOrder = sortData[0].sortAscOrder ? 'asc' : 'DESC';
            }
          }
          this.itemsPageEvent = this.initailPageEvent;
          this.loadItems();
        }
      });
  }

  updateItem(itemToUpdate: StockReceiveItemToUpdate) {
    this.selectedBinCode = null;
    this.stockReceiveFacade.updateItem({
      storeType: this.storeType,
      type: this.selectedStock.type,
      id: this.selectedStock.id,
      itemId: itemToUpdate.id,
      newUpdate: itemToUpdate.newUpdate,
      actualDetails: itemToUpdate.actualDetails
    });
  }

  validateItem(data: StockReceiveItemValidate) {
    this.stockReceiveFacade.validateItem(data);
  }

  verifyItem(itemToUpdate: StockReceiveItemToUpdate) {
    this.stockReceiveFacade.verifyItem({
      storeType: this.storeType,
      type: this.selectedStock.type,
      id: this.selectedStock.id,
      itemId: itemToUpdate.id,
      newUpdate: itemToUpdate.newUpdate,
      actualDetails: itemToUpdate.actualDetails,
      loadItemsPayload: this.creatItemLoadPayload(true),
      loadTemsCountPayload: this.createLoadCountPayLoad()
    });
  }

  /**
   * Search searchItems based on varient code
   */
  searchItems(searchData: ItemSearchResponse) {
    this.selectedBinCode = null;
    this.itemCode = searchData.searchValue;
    this.lotNumber = searchData.lotNumber;
    this.itemsPageEvent = this.initailPageEvent;
    if (searchData.isValid) {
      this.loadItems();
    } else {
      this.stockReceiveFacade.clearItems();
    }
  }

  private checkForDelay(): { hasDelay: boolean; delay: number } {
    const to = this.businessDate;
    const from =
      this.selectedStock && this.selectedStock.srcDocDate
        ? this.selectedStock.srcDocDate
        : null;
    const dateDiff = moment.duration(to.diff(from)).asHours();

    return { hasDelay: dateDiff > this.maxHoursOfDelay, delay: dateDiff };
  }

  private createLoadCountPayLoad(): StockReceiveLoadItemsTotalCountPayload | StockReceiveTotalMeasuredWeightPayload{
    return {
      storeType: this.storeType,
      id: this.selectedStock.id,
      type: this.selectedStock.type
    };
  }

  private confirmReceive(remarks: string, reason?: string) {
    this.showProgressNotification();
    let confirmReceiveData: StockReceiveConfirmReceive;
    const courierReceivedDate = (this.stockForm.get('courierReceivedDate')
      .value as moment.Moment).format();

    if (this.isL1L2Store) {
      confirmReceiveData = {
        courierReceivedDate,
        reasonForDelay: reason ? reason : null,
        remarks
      };
    } else if (this.isL3Store) {
      confirmReceiveData = {
        receivedDate: courierReceivedDate,
        remarks
      };
    }
    this.stockReceiveFacade.confirmStock({
      storeType: this.storeType,
      type: this.selectedStock.type,
      id: this.selectedStock.id,
      confirmReceive: confirmReceiveData
    });
  }

  private creatItemLoadPayload(
    checkForSearchReset = false
  ): StockReceiveLoadItemsPayload {
    return {
      storeType: this.storeType,
      type: this.selectedStock.type,
      id: this.selectedStock.id,
      status:
        this.tab === StockReceiveTabEnum.NON_VERIFIED
          ? StockReceiveItemStatusEnum.ISSUED
          : StockReceiveItemStatusEnum.VERIFIED,
      itemCode: this.itemCode,
      lotNumber: this.lotNumber,
      pageIndex: this.itemsPageEvent.pageIndex,
      pageSize: this.itemsPageEvent.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      filter: this.filter,
      isSearchReset:
        checkForSearchReset && this.itemsCount === 1 && !!this.itemCode
    };
  }

  private componentInit() {
    this.isLoadingSelectedStock$ = this.stockReceiveFacade.getIsLoadingSelectedStock();
    this.isLoadingBinGroups$ = this.stockReceiveFacade.getIsLoadingBinGroups();
    this.isLoadingRemarks$ = this.stockReceiveFacade.getIsLoadingRemarks();
    this.items$ = this.stockReceiveFacade.getItems();
    this.isItemsLoading$ = this.stockReceiveFacade.getIsItemsLoading();
    this.isItemsLoaded$ = this.stockReceiveFacade.getIsItemsLoaded();
    this.stockReceiveFacade
      .getItemsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        this.itemsCount = count;
      });
    this.itemsTotalCountLoaded$ = this.stockReceiveFacade.getItemsTotalCountLoaded();
    this.itemsTotalCountLoading$ = this.stockReceiveFacade.getIsItemsTotalCountLoading();
    this.remarks$ = this.stockReceiveFacade.getRemarks();
    this.stockReceiveFacade.loadBinCodes(this.binGroupCode);
    this.stockReceiveFacade.loadRemarks();

    this.isItemsLoaded$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoaded: boolean) => {
        if (!this.isItemLoadedOnce && isLoaded) {
          this.isItemLoadedOnce = true;
          this.showNotifications();
        }
      });

    this.stockReceiveFacade
      .getBinCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((bincodes: BinCode[]) => {
        this.binCodes = bincodes;
        this.binsForSelection = bincodes.map((bincode: BinCode) => ({
          id: bincode.binCode,
          description: bincode.binCode
        }));
      });

    this.items$
      .pipe(
        withLatestFrom( this.commonFacade.getCommonFacadeAttributes(
          CommomStateAttributeTypeEnum.INVENTORY,
          CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
        )),
        takeUntil(this.destroy$)
      )
      .subscribe(([itemList, imageCatalogueDetails]) => {
        if (itemList.length !== 0) {
          if (this.isLoadImageUrl && itemList.length > 0 && imageCatalogueDetails)
            this.loadImage(itemList, imageCatalogueDetails);
        }
      this.showNotifications();
    });

    this.stockReceiveFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    if (this.isL1L2Store) {
      let stockType: string;

      switch (this.type) {
        case StockReceiveTypesEnum.FAC_BTQ: {
          stockType = StockReceiveAPITypesEnum.FAC_BTQ;
          break;
        }
        case StockReceiveTypesEnum.BTQ_BTQ: {
          stockType = StockReceiveAPITypesEnum.BTQ_BTQ;
          break;
        }
        case StockReceiveTypesEnum.MER_BTQ: {
          stockType = StockReceiveAPITypesEnum.MER_BTQ;
          break;
        }
      }

      if (stockType) {
        this.stockReceiveFacade.loadSelectedStock({
          id: this.stockId,
          type: stockType
        });
        this.stockReceiveFacade
          .getSelectedStock()
          .pipe(takeUntil(this.destroy$))
          .subscribe((stockTransferNote: StockReceiveStock) => {
            if (stockTransferNote) {
              if (
                stockTransferNote.status.toLowerCase() !==
                StockStatusEnum.ISSUED.toLowerCase()
              ) {
                this.back();
              } else {
                this.selectedStock = stockTransferNote;
                this.initialLoad();
              }
            }
          });
      }
    } else if (this.isL3Store) {
      let stockType: string;
      if (this.type === StockReceiveTypesEnum.CFA_BTQ) {
        stockType = StockReceiveAPITypesEnum.CFA_BTQ;
      }
      if (stockType) {
        this.stockReceiveFacade.loadSelectedInvoice({
          id: this.stockId,
          type: stockType
        });
        this.stockReceiveFacade
          .getSelectedInvoice()
          .pipe(takeUntil(this.destroy$))
          .subscribe((invoice: StockReceiveStock) => {
            if (invoice) {
              if (
                invoice.status.toLowerCase() !==
                StockReceiveItemStatusEnum.ISSUED.toLowerCase()
              ) {
                this.back();
              } else {
                this.selectedStock = invoice;
                this.initialLoad();
              }
            }
          });
      }
    }

    this.stockReceiveFacade
      .getIsVerifyingAllItemSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.changeTab(StockReceiveTabEnum.VERIFIED);
        }
      });

    this.isAssigningBinToAllItems$ = this.stockReceiveFacade.getIsAssigningBinToAllItems();

    this.stockReceiveFacade
      .getIsAssigningBinToAllItemsSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.loadItems();
        } else if (isSuccess === false) {
          this.selectedBinCode = null;
        }
      });

    this.stockReceiveFacade
      .getConfirmedStock()
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmedStock: any) => {
        if (confirmedStock) {
          this.destDocNo = confirmedStock.destDocNo;
          this.showConfirmReceiveSuccessNotification(confirmedStock.destDocNo);
        }
      });

    this.stockReceiveFacade
      .getTotalCounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.nonVerifiedItemsTotalCount = data.nonVerifiedItemsTotalCount;
        this.verifiedItemsTotalCount = data.verifiedItemsTotalCount;
        if (
          this.moveToVerfified &&
          data.isLoaded &&
          data.nonVerifiedItemsTotalCount === 0
        ) {
          this.changeTab(StockReceiveTabEnum.VERIFIED);
          this.moveToVerfified = false;
        }
        this.showNotifications();
      });
  }

  private errorHandler(error: CustomErrors) {
    this.hasNotification = true;
    this.isShowingErrorNotifcation = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error,
        hasBackdrop: error.code === ErrorEnums.ERR_INV_029
      })
      .events.pipe(take(1))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        this.isShowingErrorNotifcation = false;
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          if (error.code === ErrorEnums.ERR_INV_029) {
            this.back();
          } else {
            this.showNotifications();
          }
        }
      });
  }

  private initialLoad() {
    this.stockReceiveFacade.loadTotalMeasuredWeight(this.createLoadCountPayLoad());
    this.stockReceiveFacade.getTotalMeasuredWeight().subscribe(weight => {
      this.totalMeasuredWeight = weight;
    })
    this.stockReceiveFacade.loadItemsTotalCount(this.createLoadCountPayLoad());
    this.loadItems();
  }

  private loadItems() {
    if (this.storeType && this.selectedStock) {
      this.isloadingItems = true;
      this.isLoadImageUrl = true;
      this.stockReceiveFacade.loadItems(this.creatItemLoadPayload());
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

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  private shortcutEventHandler(command: Command) {
    switch (command.name) {
      case searchShortcutKey: {
        if (this.searchRef) {
          this.dialog.closeAll();
          this.searchRef.focus();
        }
        break;
      }
      case filterShortcutKey: {
        this.openFilter();
        break;
      }
      case sortShortcutKey: {
        this.openSortDailog();
        break;
      }

      case binSelectionShortcutKey: {
        if (
          this.nonVerifiedItemsTotalCount === 0 &&
          this.verifiedItemsTotalCount !== 0 &&
          this.tab === StockReceiveTabEnum.VERIFIED &&
          !(this.filter.length > 0 || this.itemCode)
        ) {
          this.dialog.closeAll();
          this.openBinSelectionPopup();
        }
        break;
      }

      case backShortcutKey: {
        this.back();
        this.dialog.closeAll();
        break;
      }

      case tab1ShortcutKey: {
        this.changeTab(StockReceiveTabEnum.NON_VERIFIED);
        break;
      }

      case tab2ShortcutKey: {
        this.changeTab(StockReceiveTabEnum.VERIFIED);
        break;
      }
    }
  }

  private openReasonForDelayPopup(remarks: string) {
    const dialogRef = this.dialog.open(
      StockReceiveReasonForDelayPopupComponent,
      {
        autoFocus: false,
        width: '400px',
        data: {
          date: this.selectedStock.srcDocDate
        },
        disableClose: true
      }
    );
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((response: any) => {
        if (response && response.type === 'confirm') {
          this.confirmReceive(remarks, response.data);
        } else {
          this.showNotifications();
        }
      });
  }

  private showNotifications() {
    if (!this.isShowingErrorNotifcation) {
      this.overlayNotification.close();

      if (
        this.isItemLoadedOnce &&
        !this.isloadingItems &&
        (this.itemCode === null || this.itemCode === undefined) &&
        this.filter.length === 0
      ) {
        if (
          !this.isParentFormDirty &&
          this.nonVerifiedItemsTotalCount !== 0 &&
          this.tab === StockReceiveTabEnum.NON_VERIFIED
        ) {
          this.showVerifyAllNotification(this.nonVerifiedItemsTotalCount);
        }
        if (
          this.verifiedItemsTotalCount !== 0 &&
          this.tab === StockReceiveTabEnum.VERIFIED
        ) {
          if (this.nonVerifiedItemsTotalCount === 0) {
            this.showConfirmReceiveNotificationTranslator();
          } else if (!this.isverifiedCountShownOnce) {
            this.showVerifiedItemCountNotification(
              this.verifiedItemsTotalCount
            );
          }
        }
      }
    }
  }

  private showConfirmReceiveNotificationTranslator(
    key: string = 'pw.stockReceiveNotificationMessages.confirmReceiveMessage'
  ) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.showConfirmReceiveNotification(translatedMessage);
      });
  }

  private showConfirmReceiveNotification(message: string) {
    const key = 'pw.stockReceiveNotificationMessages.confirmReceiveButtonText';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message: message,
            buttonText: translatedMessage,
            hasRemarks: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              if (this.stockForm.get('courierReceivedDate').valid) {
                if (!(this.isL1L2Store && this.checkForDelay().hasDelay)) {
                  this.confirmReceive(event.data);
                } else {
                  this.openReasonForDelayPopup(event.data);
                }
              } else {
                this.stockForm.get('courierReceivedDate').markAsTouched();
                this.showConfirmReceiveNotificationTranslator(
                  'pw.stockReceiveNotificationMessages.invalidReceivingDateMessage'
                );
              }
            }
          });
      });
  }

  private showVerifyAllNotification(count: number = 0) {
    const key =
      'pw.stockReceiveNotificationMessages.nonVerifiedProductsCountMessage';
    const buttonTextKey =
      'pw.stockReceiveNotificationMessages.verifyAllButtonText';
    this.translate
      .get([key, buttonTextKey])
      .pipe(take(1))
      .subscribe((translatedMessages: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message: count + ' ' + translatedMessages[key],
            buttonText: translatedMessages[buttonTextKey]
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.showProgressNotification();
              this.stockReceiveFacade.verifyAllItems({
                storeType: this.storeType,
                type: this.selectedStock.type,
                id: this.selectedStock.id,
                data: {
                  status: StockReceiveItemStatusEnum.VERIFIED
                }
              });
            }
          });
      });
  }

  private showVerifiedItemCountNotification(count: number) {
    const key =
      'pw.stockReceiveNotificationMessages.verifiedProductsCountMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: count + ' ' + translatedMessage,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.isverifiedCountShownOnce = true;
            }
          });
      });
  }

  private showProgressNotification() {
    const key = 'pw.stockReceiveNotificationMessages.progressMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.PROGRESS,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe(() => {
            this.hasNotification = false;
          });
      });
  }

  private showConfirmReceiveSuccessNotification(documentNumber: number) {
    const key =
      'pw.stockReceiveNotificationMessages.confirmReceiveSuccessMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: translatedMsg + ' ' + documentNumber,
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

  // Image
  loadImage(itemList: StockReceiveItem[], imageCatalogueDetails) {
    this.isLoadImageUrl = false;
    itemList.forEach(item => {
      if(item.imageURL !== null && item.imageURL !== undefined){
        this.stockReceiveFacade.loadThumbnailImageUrl({
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
          this.stockReceiveFacade.loadImageUrl({
            id: event.id,
            imageUrl: event.imageUrl,
            imageCatalogueDetails: imageCatalogueDetails
          });
        }
      });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
