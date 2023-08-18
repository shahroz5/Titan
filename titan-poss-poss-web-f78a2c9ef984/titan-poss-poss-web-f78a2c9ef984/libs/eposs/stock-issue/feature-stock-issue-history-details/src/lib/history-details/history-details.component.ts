import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  StockIssueDetailsTabEnum,
  StockIssueTypesEnum,
  StockIssueeCarrierTypesEnum,
  CustomErrors,
  IssueInventoryItem,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  LoadStockIssueHistoryItemsPayload,
  LocationSummaryDetails,
  Command,
  ShortcutServiceAbstraction,
  printTransactionTypesEnum,
  printDocTypeEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  RegenerateFileResponse
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import {
  Column,
  SortDialogService
} from '@poss-web/shared/components/ui-sort-dialog';

import {
  FilterService,
  Filter
} from '@poss-web/shared/components/ui-filter-dialog';
import { StockIssueFacade } from '@poss-web/eposs/stock-issue/data-access-stock-issue';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { takeUntil, filter, withLatestFrom, take } from 'rxjs/operators';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  ItemSearchResponse,
  ItemSearchComponent
} from '@poss-web/shared/item/ui-item-search';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { CourierDetailsPopupComponent } from '@poss-web/eposs/shared/ui-courier-details-popup';
import { IssueTEPFacade } from '@poss-web/eposs/stock-issue-tep-gep/data-access-stock-issue-tep-gep';
import { StockReturnFacade } from '@poss-web/eposs/stock-return/data-access-stock-return';
import { PrintingService } from '@poss-web/shared/printing/feature-printing';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

const SEARCH_SHORTCUT_KEY = 'StockIssueHistoryDetailsComponent.MAIN_SEARCH';
const FILTER_SHORTCUT_KEY = 'StockIssueHistoryDetailsComponent.FILTER';
const SORT_SHORTCUT_KEY = 'StockIssueHistoryDetailsComponent.SORT';
const BACK_SHORTCUT_KEY = 'StockIssueHistoryDetailsComponent.BACK';
const componentName = 'StockIssueHistoryDetailsComponent';
@Component({
  selector: 'poss-web-history-details',
  templateUrl: './history-details.component.html'
})
export class HistoryDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(ItemSearchComponent, { static: true })
  searchRef: ItemSearchComponent;

  selected: any;
  tab: StockIssueDetailsTabEnum;

  status: string;
  statusColor: string;
  address: LocationSummaryDetails;
  pageSizeOptions: number[] = [];
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  issueItemsPageEvent: PageEvent = this.initialPageEvent;

  hasSearchItems: boolean;
  approvedItemsTotalCount = 0;

  type: string;
  requestType: string;
  id: number;
  storeType: string;

  error$: Observable<CustomErrors>;

  isLoading$: Observable<boolean>;

  isItemsLoading$: Observable<boolean>;
  isItemsLoaded$: Observable<boolean>;
  isFileLoading$: Observable<boolean>;
  items$: Observable<IssueInventoryItem[]>;
  itemsCount$: Observable<number>;

  isLoadingSelectedHistory$: Observable<boolean>;
  hasSelectedHistory: Observable<boolean>;

  itemsTotalCount$: Observable<number>;
  isLoadingItemsTotalCount$: Observable<boolean>;

  itemCode = null;
  lotNumber = null;

  destroy$: Subject<null> = new Subject<null>();

  hasNotification = false;

  issueType: string;

  maxFilterLimit: number;
  maxSortLimit: number;
  filter: { key: string; value: any[] }[] = [];
  filterData: { [key: string]: Filter[] } = {};

  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;

  PRODUCT_CATEGORIES: { [key: string]: Filter[] } = {};
  PRODUCT_GROUP: { [key: string]: Filter[] } = {};
  isShowingErrorNotifcation = false;
  dateFormat: string;
  hasDataGlobal: boolean;
  isItemsLoaded: boolean;

  stockIssueTypesEnumRef = StockIssueTypesEnum;
  stockIsuueDetailsTabEnumRef = StockIssueDetailsTabEnum;
  stockIssueeCarrierTypesEnumRef = StockIssueeCarrierTypesEnum;

  productCategoryFilterLable: string;
  productGroupFilterLable: string;

  carrierType: string;

  isL1L2Store: boolean;
  isL3Store: boolean;
  PrintErrorText: string;
  regenrateFileSuccess: string;
  isLoadImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  constructor(
    private stockIssueFacade: StockIssueFacade,
    private appSettingFacade: AppsettingFacade,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    public dialog: MatDialog,
    private shortcutService: ShortcutServiceAbstraction,
    private sortService: SortDialogService,
    private filterService: FilterService,
    private profileDataFacade: ProfileDataFacade,
    private authFacade: AuthFacade,
    private issueTEPFacade: IssueTEPFacade,
    private stockReturnFacade: StockReturnFacade,
    public printingService: PrintingService,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    this.translate
      .get([
        'pw.otherReceiptsIssues.printError',
        'pw.stockIssue.regenerateSuccesMsg'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.PrintErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
        this.regenrateFileSuccess =
          translatedMessages['pw.stockIssue.regenerateSuccesMsg'];
      });
  }

  ngOnInit() {
    this.stockIssueFacade.resetError();
    this.isLoadingImage$ = this.stockIssueFacade.getIsLoadingImage();
    this.stockIssueFacade.loadProductGroups();
    this.stockIssueFacade.loadProductCategories();
    this.tab = StockIssueDetailsTabEnum.APPROVED_PRODUCTS_TAB;
    this.translate
      .get([
        'pw.stockReceive.productCategoryFilterLable',
        'pw.stockReceive.productGroupFilterLable',
        'pw.stockIssue.issuedQuanitySortLabelText',
        'pw.stockIssue.issuedWeightSortLabelText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.productCategoryFilterLable =
          translatedMessages['pw.stockReceive.productCategoryFilterLable'];
        this.productGroupFilterLable =
          translatedMessages['pw.stockReceive.productGroupFilterLable'];
        this.sortService.DataSource = [
          {
            id: 0,
            sortByColumnName:
              translatedMessages['pw.stockIssue.issuedQuanitySortLabelText'],
            sortAscOrder: false
          },
          {
            id: 1,
            sortByColumnName:
              translatedMessages['pw.stockIssue.issuedWeightSortLabelText'],
            sortAscOrder: false
          }
        ];
      });

    this.type = this.activatedRoute.snapshot.params['type'];
    this.requestType = this.activatedRoute.snapshot.params['requestType'];
    this.id = this.activatedRoute.snapshot.params['_reqDocNo'];
    if (
      this.requestType === 'tep-plain' ||
      this.requestType === 'tep-studded' ||
      this.requestType === 'tep-gold-coin'
    ) {
      this.issueTEPFacade.loadFactoryAddress();
    } else if (this.requestType === 'invoiceToCFA') {
      this.stockReturnFacade.loadCFAddress();
    }
    this.issueTEPFacade
      .getFactoryAddress()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          this.address = data;
        }
      });
    this.stockReturnFacade
      .getCFACode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.address = data;
        }
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

    this.appSettingFacade
      .getMaxSortLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxSortLimit = data;
      });
    this.stockIssueFacade
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

    this.stockIssueFacade
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
    this.profileDataFacade
      .getBoutiqueType()
      .pipe(
        filter((val: string) => !!val),
        withLatestFrom(
          this.profileDataFacade.isL1Boutique(),
          this.profileDataFacade.isL2Boutique(),
          this.profileDataFacade.isL3Boutique(),
          this.appSettingFacade.getPageSize()
        ),
        take(1)
      )
      .subscribe(([val, val1, val2, val3, val4]) => {
        this.storeType = val;
        this.isL1L2Store = val1 || val2;
        this.isL3Store = val3;

        this.initialPageEvent.pageSize = val4;
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
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => this.shortcutEventHandler(command));

    // this.printingService
    // .getIsPrintingSuccess()
    // .pipe(takeUntil(this.destroy$))
    // .subscribe((isPrintingSuccess: boolean) => {
    //   if (isPrintingSuccess) {
    //     this.printGRN();
    //   }
    // });
  }
  componentInit() {
    this.stockIssueFacade.clearSortAndFilter();
    this.stockIssueFacade.loadStuddedProductGroups();
    this.isLoadingSelectedHistory$ = this.stockIssueFacade.getIsLoadingSelectedHistory();
    this.items$ = this.stockIssueFacade.getHistoryItems();
    this.isItemsLoading$ = this.stockIssueFacade.getIsLoadingHistoryItems();
    this.isFileLoading$ = this.stockIssueFacade.getIsFileLoading();
    this.isItemsLoaded$ = this.stockIssueFacade.getIsHistoryItemsLoaded();
    this.isLoadingItemsTotalCount$ = this.stockIssueFacade.getIsLoadingHistoryItemsTotalCount();
    this.itemsTotalCount$ = this.stockIssueFacade.getHistoryItemsTotalCount();
    this.itemsCount$ = this.stockIssueFacade.getHistoryCount();

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

    this.stockIssueFacade.loadSelectedHistory({
      actionType: 'ISSUE',
      id: this.id,
      type: this.getTransferType(this.requestType),
      isL1L2Store: this.isL1L2Store,
      isL3Store: this.isL3Store
    });
    this.stockIssueFacade
      .getSelectedHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.selected = data;
          if (
            this.selected &&
            this.selected.carrierDetails &&
            this.selected.carrierDetails.type
          ) {
            this.carrierType = this.selected.carrierDetails.type.toUpperCase();
          }
          if (this.selected.status !== 'CANCELLED') this.messageNotification();
          this.stockIssueFacade.loadHistoryItemstotalCount(
            this.createItemTotalCountPayload()
          );
          this.loadItems();
        } else {
          // navigaet 404
        }
      });

    this.stockIssueFacade
      .getRegenerateFileRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: RegenerateFileResponse) => {
        if (data) {
          this.msgNotifications(this.regenrateFileSuccess);
        }
      });

    this.stockIssueFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  loadItems() {
    this.isLoadImageUrl = true;
    this.stockIssueFacade.loadHistoryItems(this.creatItemLoadPayload());
  }
  creatItemLoadPayload(): LoadStockIssueHistoryItemsPayload {
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
      payload: {
        binCodes: [null],
        binGroupCode: null,
        itemCode: this.itemCode,
        lotNumber: this.lotNumber,
        productCategories: filterProductCategories,
        productGroups: filterProductGroups,
        statuses: []
      },
      actionType: 'ISSUE',
      id: this.id,
      page: this.issueItemsPageEvent.pageIndex,
      size: this.issueItemsPageEvent.pageSize,
      sort: this.sortBy ? [this.sortBy + ',' + this.sortOrder] : null,
      transferType: this.getTransferType(this.requestType),
      isL1L2Store: this.isL1L2Store,
      isL3Store: this.isL3Store
    };
  }
  createItemTotalCountPayload() {
    return {
      payload: {
        binCodes: [null],
        binGroupCode: null,
        itemCode: null,
        lotNumber: null,
        productCategories: [null],
        productGroups: [null],
        statuses: []
      },
      actionType: 'ISSUE',
      id: this.id,
      page: 0,
      size: 1,
      sort: null,
      transferType: this.getTransferType(this.requestType),
      isL1L2Store: this.isL1L2Store,
      isL3Store: this.isL3Store
    };
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
        this.back();
        this.dialog.closeAll();
        break;
      }
    }
  }

  back() {
    this.dialog.closeAll();
    if (this.isL1L2Store) {
      this.router.navigate(
        [
          '/inventory/stockissue',
          this.type,
          this.requestType.toLowerCase().replace(/_/gi, '-')
        ],
        { state: { clearFilter: false } }
      );
    } else {
      this.router.navigate(
        ['/inventory/stockissue/invoice/history', this.requestType],
        { state: { clearFilter: false } }
      );
    }
  }
  boxDetailsPopUp() {
    if (
      this.carrierType === 'COURIER' &&
      this.selected &&
      this.selected.carrierDetails &&
      this.selected.carrierDetails.data &&
      this.selected.carrierDetails.data.boxDetails
    ) {
      this.overlayNotification.close();
      const dialogRef = this.dialog.open(CourierDetailsPopupComponent, {
        width: '60vw',
        data: {
          boxDetails: this.selected.carrierDetails.data.boxDetails,
          measuredWeight: this.selected.totalMeasuredWeight,
          weightUnit: this.selected.weightUnit,
          type: 'history'
        },
        disableClose: true
      });

      dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe();
    }
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
              // this.back();
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
        // this.notificationOverlay();
      });
  }
  /**
   * Search searchItems based on varient code
   */
  searchItems(searchData: ItemSearchResponse) {
    this.itemCode = searchData.searchValue;
    this.lotNumber = searchData.lotNumber;
    this.issueItemsPageEvent = this.initialPageEvent;
    if (searchData.isValid) {
      this.loadItems();
    } else {
      this.stockIssueFacade.clearHistoryItems();
    }
  }
  paginateItems(event: PageEvent) {
    this.issueItemsPageEvent = event;
    this.loadItems();
  }
  regenrateFile() {
    let payload = {
      id: this.id,
      invoiceType: this.getTransferType(this.requestType)
    };
    this.stockIssueFacade.regenerateFile(payload);
  }
  clearSearchItems() {
    this.itemCode = null;
    this.lotNumber = null;
    if (this.searchRef) {
      this.searchRef.reset();
    }
    this.issueItemsPageEvent = this.initialPageEvent;
    this.loadItems();
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

            this.issueItemsPageEvent = this.initialPageEvent;
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
              if (sortData[0].id === 0) {
                this.sortBy = 'issuedQuantity';
              } else if (sortData[0].id === 1) {
                this.sortBy = 'issuedWeight';
              }
              this.sortOrder = sortData[0].sortAscOrder ? 'asc' : 'DESC';
            }
          }
          this.issueItemsPageEvent = this.initialPageEvent;
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
  paginateIssueItems(event: PageEvent) {
    this.issueItemsPageEvent = event;
    this.loadItems();
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
  getTransferType(value) {
    switch (value.toUpperCase()) {
      case 'FAC':
        return 'BTQ_FAC';
      case 'BTQ':
        return 'BTQ_BTQ';
      case 'MER':
        return 'MER_BTQ';
      case 'TEP-PLAIN':
        return 'TEP_PLAIN';
      case 'TEP-STUDDED':
        return 'TEP_STUDDED';
      case 'GEP':
        return 'GEP';
      case 'TEP-GOLD-COIN':
        return 'TEP_GOLD_COIN';
      case 'INVOICETOCFA':
        return 'BTQ_CFA';
      case 'BTQ-CFA':
        return 'BTQ_CFA';
      case 'DEFECTIVE':
        return 'DEFECTIVE';
      case 'DIRECT-ISSUE':
        return 'BTQ_BTQ';
    }
  }
  getPrintTransactonType(value) {
    switch (value.toUpperCase()) {
      case 'FAC':
      case 'BTQ':
      case 'MER':
      case 'DIRECT-ISSUE':
        return printTransactionTypesEnum.STOCK_ISSUE;

      case 'TEP-PLAIN':
      case 'TEP-STUDDED':
      case 'TEP-GOLD-COIN':
      case 'GEP':
      case 'BTQ-CFA':
      case 'DEFECTIVE':
        return printTransactionTypesEnum.STOCK_TRANSFER;
    }
  }
  print() {
    this.printingService.loadPrintData({
      printType: this.getTransferType(this.requestType),
      transacionId: this.id,
      transacionType: this.isL3Store
        ? printTransactionTypesEnum.RETURN_INVOICE
        : this.getPrintTransactonType(this.requestType),
      doctype: printDocTypeEnum.STOCK_PRINT,
      reprint: true
    });
    if (this.isL3Store && this.requestType === 'invoiceToCFA') {
      this.printGRN();
    }
  }
  printGRN() {
    this.printingService.loadPrintData({
      printType: 'BTQ_CFA_GRN',
      transacionId: this.id,
      transacionType: this.isL3Store
        ? printTransactionTypesEnum.RETURN_INVOICE
        : this.getPrintTransactonType(this.requestType),
      doctype: printDocTypeEnum.STOCK_PRINT,
      reprint: true
    });
  }
  messageNotification() {
    this.hasNotification = true;
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

  msgNotifications(messageKey: string) {
    const key = messageKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              if (this.selected.status !== 'CANCELLED') {
                this.messageNotification();
              }
            }
          });
      });
  }

  // Image
  loadImage(itemList: IssueInventoryItem[], imageCatalogueDetails) {
    this.isLoadImageUrl = false;
    itemList.forEach(item => {
      if (item.imageURL !== null && item.imageURL !== undefined) {
        this.stockIssueFacade.loadThumbnailImageUrl({
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
          this.stockIssueFacade.loadImageUrl({
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
