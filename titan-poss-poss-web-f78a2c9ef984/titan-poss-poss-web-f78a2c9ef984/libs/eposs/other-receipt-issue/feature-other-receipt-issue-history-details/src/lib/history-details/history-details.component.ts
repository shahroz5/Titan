import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import {
  OtherReceiptsIssuesEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventType,
  OverlayNotificationEventRef,
  LoadOtherReceiptsHistoryItemsPayload,
  LoadOtherIssueHistoryItemsPayload,
  printDocTypeEnum,
  printTransactionTypesEnum,
  ShortcutServiceAbstraction,
  Command,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  OtherReceiptItem,
  PrintingServiceAbstraction
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  FilterService,
  Filter
} from '@poss-web/shared/components/ui-filter-dialog';
import {
  SortDialogService,
  Column
} from '@poss-web/shared/components/ui-sort-dialog';
import {
  ItemSearchResponse,
  ItemSearchComponent
} from '@poss-web/shared/item/ui-item-search';
import { OtherReceiptsFacade } from '@poss-web/eposs/other-receipt/data-access-other-receipt';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';

import { OtherIssuesFacade } from '@poss-web/eposs/other-issue/data-access-other-issue';
import { takeUntil, filter, withLatestFrom, take } from 'rxjs/operators';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { getOtherReceiptsIssuesHistoryListRouteUrl } from '@poss-web/shared/util-site-routes';
import { PrintingService } from '@poss-web/shared/printing/feature-printing';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

const issue_Sort_Data = [
  {
    id: 0,
    sortByColumnName: 'Issued Quantity',
    sortAscOrder: false
  },
  {
    id: 1,
    sortByColumnName: 'Issued Weight',
    sortAscOrder: false
  }
];
const receipt_Sort_Data = [
  {
    id: 0,
    sortByColumnName: 'Received Quantity',
    sortAscOrder: false
  },
  {
    id: 1,
    sortByColumnName: 'Received Weight',
    sortAscOrder: false
  }
];
const SEARCH_SHORTCUT_KEY = 'OtherReceiptIssueHistoryDetails.MAIN_SEARCH';
const FILTER_SHORTCUT_KEY = 'OtherReceiptIssueHistoryDetails.FILTER';
const SORT_SHORTCUT_KEY = 'OtherReceiptIssueHistoryDetails.SORT';
const BACK_SHORTCUT_KEY = 'OtherReceiptIssueHistoryDetails.BACK';
const componentName = 'OtherReceiptIssueHistoryDetails';

@Component({
  selector: 'poss-web-history-details',
  templateUrl: './history-details.component.html',
  styleUrls: ['./history-details.component.scss']
})
export class HistoryDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(ItemSearchComponent, { static: true })
  searchRef: ItemSearchComponent;

  selected: any;
  tabType: string;
  type: string;
  id: number;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  itemsPageEvent: PageEvent;
  itemsCountLoading$: Observable<boolean>;
  items$: Observable<any>;
  transferType: string;
  isItemsLoading$: Observable<any>;
  isItemsLoaded$: Observable<boolean>;
  isLoadingSelectedStock$: Observable<boolean>;
  itemsCount$: Observable<number>;

  isItemsTotalCountLoaded$: Observable<boolean>;
  isLoadingItemsTotalCount$: Observable<boolean>;
  itemsTotalCount$: Observable<number>;

  error$: Observable<CustomErrors>;
  hasNotification = false;
  storeType: string;
  isL1L2Store: boolean;
  isL3Store: boolean;

  isLoading$: Observable<boolean>;

  maxFilterLimit: number;
  maxSortLimit: number;
  filter: { key: string; value: any[] }[] = [];
  filterData: { [key: string]: Filter[] } = {};

  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;

  PRODUCT_CATEGORIES: { [key: string]: Filter[] } = {};
  PRODUCT_GROUP: { [key: string]: Filter[] } = {};
  productCategoryFilterLable: string;
  productGroupFilterLable: string;

  isShowingErrorNotifcation = false;

  pageSizeOptions: number[] = [];
  searchBinCodeLable: string;

  itemCode: string;
  lotNumber: string;

  enumRef = OtherReceiptsIssuesEnum;
  statusColor: string;
  status: string;

  //TODO check
  sortMapAllProducts = new Map();
  filterTabDataAllProducts: { key: string; value: any[] }[] = [];

  destroy$: Subject<null> = new Subject<null>();
  PrintErrorText: string;
  isLoadImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private filterService: FilterService,
    private sortService: SortDialogService,
    private otherIssueFacade: OtherIssuesFacade,
    private otherReceiptsFacade: OtherReceiptsFacade,
    private appSettingFacade: AppsettingFacade,
    private profiledatafacade: ProfileDataFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    public printingService: PrintingServiceAbstraction,
    private shortcutService: ShortcutServiceAbstraction,
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
  }

  ngOnInit() {
    this.isLoadingImage$ = this.otherReceiptsFacade.getIsLoadingImage();
    //  this.otherReceiptsFacade.reseterror();
    // this.otherIssueFacade.resetError();
    this.translate
      .get([
        'pw.stockReceive.productCategoryFilterLable',
        'pw.stockReceive.productGroupFilterLable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.productCategoryFilterLable =
          translatedMessages['pw.stockReceive.productCategoryFilterLable'];
        this.productGroupFilterLable =
          translatedMessages['pw.stockReceive.productGroupFilterLable'];
      });
    this.id = this.activatedRoute.snapshot.params['_id'];
    this.type = this.activatedRoute.snapshot.params['type'];
    this.tabType = this.activatedRoute.snapshot.params['tabType'];
    this.otherIssueFacade.loadProductGroups(null);
    this.otherIssueFacade.loadProductCategories();
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
    this.appSettingFacade
      .getMaxSortLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxSortLimit = data;
      });
    this.otherIssueFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(productGroups => {
        if (productGroups) {
          this.PRODUCT_GROUP = this.mapToFilterOptions(
            this.productGroupFilterLable,
            productGroups.map(productGroup => ({
              id: productGroup.productGroupCode,
              description: productGroup.description,
              selected: false
            }))
          );
        }
      });

    this.otherIssueFacade
      .getProductCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(productCategories => {
        if (productCategories) {
          this.PRODUCT_CATEGORIES = this.mapToFilterOptions(
            this.productCategoryFilterLable,
            productCategories.map(productCategory => ({
              id: productCategory.productCategoryCode,
              description: productCategory.description,
              selected: false
            }))
          );
        }
      });
    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.profiledatafacade
      .getBoutiqueType()
      .pipe(
        filter((val: string) => !!val),
        withLatestFrom(
          this.profiledatafacade.isL1Boutique(),
          this.profiledatafacade.isL2Boutique(),
          this.profiledatafacade.isL3Boutique(),
          this.appSettingFacade.getPageSize()
        ),
        take(1)
      )
      .subscribe(([val, val1, val2, val3, val4]) => {
        this.storeType = val;
        this.isL1L2Store = val1 || val2;
        this.isL3Store = val3;
        this.initialPageEvent.pageSize = val4;
        this.itemsPageEvent = this.initialPageEvent;
        this.componentInit();
      });
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => this.shortcutEventHandler(command));
  }
  componentInit() {
    // reset sort and filter
    this.isLoading$ = this.otherIssueFacade.getIsLoading();
    if (this.tabType === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) {
      this.otherReceiptsFacade.loadStuddedProductGroups();
      this.isLoadingSelectedStock$ = this.otherReceiptsFacade.getIsLoadingSelectedHistory();
      this.isItemsLoading$ = this.otherReceiptsFacade.getIsLoadingHistoryItems();
      this.items$ = this.otherReceiptsFacade.getHistoryItems();
      this.isItemsLoaded$ = this.otherReceiptsFacade.getIsHistoryItemsLoaded();
      this.itemsCount$ = this.otherReceiptsFacade.getHistoryItemsCount();
      this.isLoadingItemsTotalCount$ = this.otherReceiptsFacade.getIsLoadingHistoryItemsTotalCount();
      this.isItemsTotalCountLoaded$ = this.otherReceiptsFacade.getIsHistoryItemsTotalCountLoaded();
      this.itemsTotalCount$ = this.otherReceiptsFacade.getHistoryItemsTotalCount();
      this.sortService.DataSource = receipt_Sort_Data;

      this.items$
        .pipe(
          withLatestFrom(
            this.commonFacade.getCommonFacadeAttributes(
              CommomStateAttributeTypeEnum.INVENTORY,
              CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
            )
          ),
          takeUntil(this.destroy$)
        )
        .subscribe(([itemList, imageCatalogueDetails]) => {
          if (itemList.length !== 0) {
            if (
              this.isLoadImageUrl &&
              itemList.length > 0 &&
              imageCatalogueDetails
            )
              this.loadImage(itemList, imageCatalogueDetails);
          }
        });

      this.otherReceiptsFacade.loadSelectedHistory(
        this.id,
        this.getTransferType()
      );
      this.otherReceiptsFacade
        .getSelectedHistory()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.loadItemsConditionCheck(data);
        });
    } else if (
      this.tabType === OtherReceiptsIssuesEnum.OTHER_ISSUES ||
      this.tabType === OtherReceiptsIssuesEnum.OTHER_ISSUES_REQUESTS
    ) {
      const actionType = 'ISSUE';
      this.otherIssueFacade.loadStuddedProductGroups();
      this.items$ = this.otherIssueFacade.getHistoryItems();
      this.isItemsLoading$ = this.otherIssueFacade.getIsLoadingHistoryItems();
      this.isLoadingSelectedStock$ = this.otherIssueFacade.getIsLoadingSelectedHistory();
      this.isItemsLoaded$ = this.otherIssueFacade.getIsHistoryItemsLoaded();
      this.itemsCount$ = this.otherIssueFacade.getHistoryItemsCount();
      this.isLoadingItemsTotalCount$ = this.otherIssueFacade.getIsLoadingHistoryItemsTotalCount();
      this.isItemsTotalCountLoaded$ = this.otherIssueFacade.getIsHistoryItemsTotalCountLoaded();
      this.itemsTotalCount$ = this.otherIssueFacade.getHistoryItemsTotalCount();
      this.sortService.DataSource = issue_Sort_Data;
      this.isLoadImageUrl = true;
      this.otherIssueFacade.loadSelectedHistory(
        this.tabType,
        actionType,
        this.id,
        this.getTransferType()
      );
      this.otherIssueFacade
        .getSelectedHistory()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.loadItemsConditionCheck(data);
        });
    }
  }
  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case SEARCH_SHORTCUT_KEY: {
        if (this.searchRef) {
          this.searchRef.focus();
        }
        break;
      }
      case FILTER_SHORTCUT_KEY: {
        this.openFilter();
        break;
      }
      case SORT_SHORTCUT_KEY: {
        this.openSort();
        break;
      }

      case BACK_SHORTCUT_KEY: {
        this.back(null);
        this.dialog.closeAll();
        break;
      }
    }
  }

  loadItemsConditionCheck(data: any) {
    if (data) {
      this.selected = data;
      this.loadItems();
      this.messageNotification();
    }
  }
  loadItems() {
    this.isLoadImageUrl = true;
    if (this.tabType === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) {
      this.otherReceiptsFacade.loadSelectedHistoryItemsTotalCount(
        this.loadItemsTotalCountPayload()
      );
      this.otherReceiptsFacade.loadSelectedHistoryItems(
        this.createOtherReceiptsHistoryItemsPaylaod()
      );
    } else if (
      this.tabType === OtherReceiptsIssuesEnum.OTHER_ISSUES ||
      this.tabType === OtherReceiptsIssuesEnum.OTHER_ISSUES_REQUESTS
    ) {
      this.otherIssueFacade.loadSelectedHistoryItemsTotalCount(
        this.loadItemsTotalCountPayload()
      );
      this.otherIssueFacade.loadSelectedHistoryItems(
        this.createOtherIssuesHistoryItemsPaylaod()
      );
    }
  }

  createOtherReceiptsHistoryItemsPaylaod(): LoadOtherReceiptsHistoryItemsPayload {
    let filterProductGroups = [null];
    let filterProductCategories = [null];
    if (this.filter && this.filter.length > 0) {
      for (let i = 0; i < this.filter.length; i++) {
        if (this.filter[i].key === 'productCategory') {
          filterProductCategories = this.filter[i].value;
        } else if (this.filter[i].key === 'productGroup') {
          filterProductGroups = this.filter[i].value;
        }
      }
    }

    return {
      id: this.id,
      page: this.itemsPageEvent.pageIndex,
      size: this.itemsPageEvent.pageSize,
      sort: this.sortBy ? [this.sortBy + ',' + this.sortOrder] : null,
      payload: {
        binCodes: [null],
        binGroupCode: null,
        itemCode: this.itemCode,
        lotNumber: this.lotNumber,
        productCategories: filterProductCategories,
        productGroups: filterProductGroups
      },
      transactionType: this.getTransferType()
    };
  }
  createOtherIssuesHistoryItemsPaylaod(): LoadOtherIssueHistoryItemsPayload {
    let filterProductGroups = [null];
    let filterProductCategories = [null];
    if (this.filter && this.filter.length > 0) {
      for (let i = 0; i < this.filter.length; i++) {
        if (this.filter[i].key === 'productCategory') {
          filterProductCategories = this.filter[i].value;
        } else if (this.filter[i].key === 'productGroup') {
          filterProductGroups = this.filter[i].value;
        }
      }
    }

    return {
      type: this.tabType,
      actionType: 'ISSUE',
      id: this.id,
      page: this.itemsPageEvent.pageIndex,
      size: this.itemsPageEvent.pageSize,
      sort: this.sortBy ? [this.sortBy + ',' + this.sortOrder] : null,
      payload: {
        binCodes: [null],
        binGroupCode: null,
        itemCode: this.itemCode,
        lotNumber: this.lotNumber,
        productCategories: filterProductCategories,
        productGroups: filterProductGroups
      },
      transactionType: this.getTransferType()
    };
  }
  loadItemsTotalCountPayload() {
    return {
      type: this.tabType,
      actionType: 'ISSUE',
      id: this.id,
      page: 0,
      size: 1,
      sort: null,
      payload: {
        binCodes: [null],
        binGroupCode: null,
        itemCode: null,
        lotNumber: null,
        productCategories: [null],
        productGroups: [null]
      },
      transactionType: this.getTransferType()
    };
  }
  /**
   * Search searchItems based on varient code
   */
  searchItems(searchData: ItemSearchResponse) {
    this.itemCode = searchData.searchValue;
    this.lotNumber = searchData.lotNumber;
    this.itemsPageEvent = this.initialPageEvent;
    if (searchData.isValid) {
      this.loadItems();
    } else {
      this.otherIssueFacade.clearSelectedHistoryItems();
      this.otherReceiptsFacade.clearHistoryItems();
    }
  }
  clearSearchItems() {
    this.itemCode = null;
    this.lotNumber = null;
    if (this.searchRef) {
      this.searchRef.reset();
    }
    this.itemsPageEvent = this.initialPageEvent;
    this.loadItems();
  }

  back(event) {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(
      [getOtherReceiptsIssuesHistoryListRouteUrl(this.tabType, this.type)],
      { state: { clearFilter: false } }
    );
  }
  openFilter() {
    this.filterService.DataSource = {
      ...this.PRODUCT_CATEGORIES,
      ...this.PRODUCT_GROUP
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

            this.itemsPageEvent = this.initialPageEvent;
            this.loadItems();
          }
        }
      );
  }
  openSort() {
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
              if (this.tabType === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) {
                if (sortData[0].id === 0) {
                  this.sortBy = 'receivedQuantity';
                } else if (sortData[0].id === 1) {
                  this.sortBy = 'receivedQuantity';
                }
              } else if (
                this.tabType === OtherReceiptsIssuesEnum.OTHER_ISSUES
              ) {
                if (sortData[0].id === 0) {
                  this.sortBy = 'issuedQuantity';
                } else if (sortData[0].id === 1) {
                  this.sortBy = 'issuedWeight';
                }
              }

              this.sortOrder = sortData[0].sortAscOrder ? 'asc' : 'DESC';
            }
          }
          this.itemsPageEvent = this.initialPageEvent;
          this.loadItems();
        }
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
  paginate(event: PageEvent) {
    this.itemsPageEvent = event;
    this.loadItems();
  }

  errorHandler(error: CustomErrors) {
    this.hasNotification = true;
    this.isShowingErrorNotifcation = true;
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else {
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
              this.back(null);
            } else {
              this.messageNotification();
            }
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
        this.messageNotification();
      });
  }

  getTransferType(): OtherReceiptsIssuesEnum {
    switch (this.activatedRoute.snapshot.params['type']) {
      case OtherReceiptsIssuesEnum.EXHIBITION:
        return OtherReceiptsIssuesEnum.EXHIBITION_TYPE;
      case OtherReceiptsIssuesEnum.LOAN_TYPE:
        return OtherReceiptsIssuesEnum.LOAN;
      case OtherReceiptsIssuesEnum.ADJUSTMENT:
        return OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE;
      case OtherReceiptsIssuesEnum.LOSS:
        return OtherReceiptsIssuesEnum.LOSS_TYPE;
      case OtherReceiptsIssuesEnum.PSV:
        return OtherReceiptsIssuesEnum.PSV;
      case OtherReceiptsIssuesEnum.FOC:
        return OtherReceiptsIssuesEnum.FOC;
    }
  }
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
  print() {
    this.printingService.loadPrintData({
      printType: this.getTransferType(),
      transacionId: this.id,
      transacionType:
        this.tabType === OtherReceiptsIssuesEnum.OTHER_RECEIPTS
          ? printTransactionTypesEnum.OTHER_RECEIVE
          : printTransactionTypesEnum.OTHER_ISSUE,
      doctype: printDocTypeEnum.STOCK_PRINT
    });
  }
  messageNotification() {
    if (this.tabType === OtherReceiptsIssuesEnum.OTHER_ISSUES) {
      this.hasNotification = true;
      // this.translate
      //   .get(buttonKey)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe((translatedButtonKey: string) => {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ACTION,
          buttonText: 'PRINT',
          message: 'Print Document'
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          if (event.eventType === OverlayNotificationEventType.TRUE) {
            this.print();
          }
        });
    }
    if (this.tabType === OtherReceiptsIssuesEnum.OTHER_RECEIPTS) {
      this.hasNotification = true;
      // this.translate
      //   .get(buttonKey)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe((translatedButtonKey: string) => {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ACTION,
          buttonText: 'PRINT',
          message: 'Print Document'
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          if (event.eventType === OverlayNotificationEventType.TRUE) {
            this.print();
          }
        });
    }
  }
  // Image
  loadImage(itemList: OtherReceiptItem[], imageCatalogueDetails) {
    this.isLoadImageUrl = false;
    itemList.forEach(item => {
      if (item.imageURL !== null && item.imageURL !== undefined) {
        this.otherReceiptsFacade.loadThumbnailImageUrl({
          id: item.id,
          imageUrl: item.imageURL,
          imageCatalogueDetails: imageCatalogueDetails,
          isHistoryItems: true
        });
      }
    });
  }

  loadImageUrl(event) {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.INVENTORY,
        CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
      )
      .pipe(take(1))
      .subscribe(imageCatalogueDetails => {
        if (event.imageUrl !== null && event.imageUrl !== undefined) {
          this.otherReceiptsFacade.loadImageUrl({
            id: event.id,
            imageUrl: event.imageUrl,
            imageCatalogueDetails: imageCatalogueDetails,
            isHistoryItems: true
          });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.printingService.resetPrint();
  }
}
