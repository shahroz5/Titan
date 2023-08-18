import { StockReceiveFacade } from '@poss-web/eposs/stock-receive/data-access-stock-receive';
import {
  SortDialogService,
  Column
} from '@poss-web/shared/components/ui-sort-dialog';
import {
  FilterService,
  Filter
} from '@poss-web/shared/components/ui-filter-dialog';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { SelectionDailogOption } from '@poss-web/shared/components/ui-selection-dialog';
import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  ItemSearchComponent,
  ItemSearchResponse
} from '@poss-web/shared/item/ui-item-search';
import { getStockReceiveRouteUrl } from '@poss-web/shared/util-site-routes';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  StockReceiveCarrierTypesEnum,
  StockReceiveTabEnum,
  StockReceiveTypesEnum,
  CustomErrors,
  StockReceiveStock,
  StockReceiveItem,
  OverlayNotificationServiceAbstraction,
  StockReceiveAPITypesEnum,
  StockReceiveHistoryTypesEnum,
  StockStatusEnum,
  OverlayNotificationType,
  OverlayNotificationEventType,
  OverlayNotificationEventRef,
  Command,
  ShortcutServiceAbstraction,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum
} from '@poss-web/shared/models';

import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { takeUntil, take, filter, withLatestFrom } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

export const searchShortcutKey =
  'StockReceiveHistoryDetailsComponent.MAIN_SEARCH';
export const filterShortcutKey = 'StockReceiveHistoryDetailsComponent.FILTER';
export const sortShortcutKey = 'StockReceiveHistoryDetailsComponent.SORT';
export const backShortcutKey = 'StockReceiveHistoryDetailsComponent.BACK';
const componentName = 'StockReceiveHistoryDetailsComponent';

@Component({
  selector: 'poss-web-stock-receive-history-details',
  templateUrl: './stock-receive-history-details.component.html',
  styleUrls: ['./stock-receive-history-details.component.scss']
})
export class StockReceiveHistoryDetailsComponent implements OnInit, OnDestroy {
  selectedStock: StockReceiveStock;
  stockReceiveTabEnumRef = StockReceiveTabEnum;
  stockReceiveTabTypesEnumRef = StockReceiveTypesEnum;
  stockReceiveCarrierTypesEnumRef = StockReceiveCarrierTypesEnum;
  initailPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  itemsPageEvent: PageEvent;

  itemsTotalCountLoaded$: Observable<boolean>;
  itemsTotalCountLoading$: Observable<boolean>;
  items$: Observable<StockReceiveItem[]>;

  requestType: string;
  stockId: string;
  storeType: string;
  error$: Observable<CustomErrors>;
  isLoadingSelectedStock$: Observable<boolean>;

  isItemsLoading$: Observable<boolean>;
  isItemsLoaded$: Observable<boolean>;
  itemsCount = 0;
  hasNotification = false;
  itemCode: string;
  lotNumber: string;
  isL1L2Store: boolean;
  isL3Store: boolean;
  @ViewChild(ItemSearchComponent, { static: true })
  searchRef: ItemSearchComponent;

  maxFilterLimit: number;
  maxSortLimit: number;
  filter: { key: string; value: any[] }[] = [];
  filterData: { [key: string]: Filter[] } = {};

  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;

  isShowingErrorNotifcation = false;
  destroy$: Subject<null> = new Subject<null>();

  productCategories: { [key: string]: Filter[] } = {};
  productGroups: { [key: string]: Filter[] } = {};
  productCategoryFilterLable: string;
  productGroupFilterLable: string;

  binsForSelection: SelectionDailogOption[] = [];
  searchBinCodeLable: string;
  selectBinCodeLable: string;
  isItemLoadedOnce = false;
  stockReceiveEnumRef = StockReceiveTypesEnum;
  pageSizeOptions: number[] = [];
  historyAPIType: string;
  noDataFoundMessage;
  stockStatusEnumRef = StockStatusEnum;
  isLoadImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  StockReceiveAPITypesEnumRef = StockReceiveAPITypesEnum;

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
    private profiledatafacade: ProfileDataFacade,
    private dialog: MatDialog,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
  }

  ngOnInit() {
    this.stockReceiveFacade.resetError();
    this.isLoadingImage$ = this.stockReceiveFacade.getIsLoadingImage();
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

    this.stockId = this.activatedRoute.snapshot.params['_id'];
    this.requestType = this.activatedRoute.snapshot.params['requestType'];
    this.historyAPIType = this.getAPIType(this.requestType);

    this.stockReceiveFacade.loadStuddedProductGroups();
    this.stockReceiveFacade.loadProductGroups();
    this.stockReceiveFacade.loadProductCategories();

    this.stockReceiveFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(productGroups => {
        this.productGroups = this.mapToFilterOptions(
          this.productGroupFilterLable,
          productGroups.map(productGroup => ({
            id: productGroup.productGroupCode,
            description: productGroup.description,
            selected: false
          }))
        );
      });

    this.stockReceiveFacade
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
      .subscribe(command => this.shortcutEventHandler(command));
  }

  mapToFilterOptions(
    key: string,
    options: Filter[]
  ): { [key: string]: Filter[] } {
    return {
      [key]: options
    };
  }
  getAPIType(transfterType: string) {
    switch (transfterType) {
      case StockReceiveHistoryTypesEnum.factory: {
        return StockReceiveAPITypesEnum.FAC_BTQ;
      }
      case StockReceiveHistoryTypesEnum.boutique: {
        return StockReceiveAPITypesEnum.BTQ_BTQ;
      }
      case StockReceiveHistoryTypesEnum.merchandise: {
        return StockReceiveAPITypesEnum.MER_BTQ;
      }
      case StockReceiveHistoryTypesEnum.cfa: {
        return StockReceiveAPITypesEnum.CFA_BTQ;
      }
    }
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case searchShortcutKey: {
        if (this.searchRef) {
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

      case backShortcutKey: {
        this.back();
        this.dialog.closeAll();
        break;
      }
    }
  }

  componentInit() {
    this.isLoadingSelectedStock$ = this.stockReceiveFacade.getIsLoadingSelectedStock();
    this.items$ = this.stockReceiveFacade.getItems();
    this.isItemsLoading$ = this.stockReceiveFacade.getIsItemsLoading();
    this.isItemsLoaded$ = this.stockReceiveFacade.getIsItemsLoaded();

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

    if (this.isL1L2Store) {
      this.stockReceiveFacade.loadSelectedStock({
        id: this.stockId,
        type: StockReceiveTypesEnum.HISTORY,
        historyAPIType: this.historyAPIType
      });
      this.stockReceiveFacade
        .getSelectedStock()
        .pipe(takeUntil(this.destroy$))
        .subscribe((stockTransferNote: StockReceiveStock) => {
          if (stockTransferNote) {
            this.selectedStock = stockTransferNote;
            this.loadItems();
          }
        });
    } else if (this.isL3Store) {
      this.stockReceiveFacade.loadSelectedInvoice({
        id: this.stockId,
        type: StockReceiveTypesEnum.HISTORY,
        historyAPIType: this.historyAPIType
      });
      this.stockReceiveFacade
        .getSelectedInvoice()
        .pipe(takeUntil(this.destroy$))
        .subscribe((stockTransferInvoiceNote: StockReceiveStock) => {
          if (stockTransferInvoiceNote) {
            this.selectedStock = stockTransferInvoiceNote;
            this.loadItems();
          }
        });
    }

    this.stockReceiveFacade
      .getItemsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.itemsCount = count;
      });

    this.stockReceiveFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  back() {
    this.router.navigate(
      [
        getStockReceiveRouteUrl(StockReceiveTypesEnum.HISTORY),
        this.requestType
      ],
      { state: { clearFilter: false } }
    );
  }

  /**
   * Search searchItems based on varient code
   */
  searchItems(searchData: ItemSearchResponse) {
    if (searchData.isValid) {
      this.itemCode = searchData.searchValue;
      this.lotNumber = searchData.lotNumber;
      this.itemsPageEvent = this.initailPageEvent;
      this.loadItems();
    } else {
      this.stockReceiveFacade.clearItems();
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

  loadItems() {
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
    this.isLoadImageUrl = true;
    this.stockReceiveFacade.loadStockReceiveHistoryItems({
      StockReceiveHistoryItem: {
        binCodes: [null],
        binGroupCode: null,
        itemCode: this.itemCode,
        lotNumber: this.lotNumber,
        productCategories: filterProductCategories,
        productGroups: filterProductGroups,
        statuses: [null]
      },
      pageIndex: this.itemsPageEvent.pageIndex,
      pageSize: this.itemsPageEvent.pageSize,
      id: this.stockId,
      isL1L2Store: this.isL1L2Store,
      isL3Store: this.isL3Store,
      sort: this.sortBy ? [this.sortBy + ',' + this.sortOrder] : null,
      sortOrder: this.sortOrder ? this.sortOrder : null,
      historyAPIType: this.historyAPIType
    });
  }

  paginate(event: PageEvent) {
    this.itemsPageEvent = event;
    this.initailPageEvent.pageSize = event.pageSize;
    this.loadItems();
  }

  errorHandler(error: CustomErrors) {
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
          }
        }
      });
  }

  // Image
  loadImage(itemList: StockReceiveItem[], imageCatalogueDetails) {
    this.isLoadImageUrl = false;
    itemList.forEach(item => {
      if (item.imageURL !== null && item.imageURL !== undefined) {
        this.stockReceiveFacade.loadThumbnailImageUrl({
          id: item.id,
          imageUrl: item.imageURL,
          imageCatalogueDetails: imageCatalogueDetails
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
