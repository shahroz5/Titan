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
  LocationSummaryDetails,
  Command,
  ShortcutServiceAbstraction,
  StockIssueAPIRequestTypesEnum,
  LoadCancelIssuetemsPayload,
  StockRequestNote,
  LocationSettingAttributesEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum
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
import {
  getStockIssueCancelRouteUrl,
  getStockIssueRouteUrl
} from '@poss-web/shared/util-site-routes';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

const SEARCH_SHORTCUT_KEY = 'StockIssueHistoryDetailsComponent.MAIN_SEARCH';
const FILTER_SHORTCUT_KEY = 'StockIssueHistoryDetailsComponent.FILTER';
const SORT_SHORTCUT_KEY = 'StockIssueHistoryDetailsComponent.SORT';
const BACK_SHORTCUT_KEY = 'StockIssueHistoryDetailsComponent.BACK';
const componentName = 'StockIssueHistoryDetailsComponent';

@Component({
  selector: 'poss-web-stock-issue-cancel-details',
  templateUrl: './stock-issue-cancel-details.component.html',
})
export class StockIssueCancelDetailsComponent implements OnInit, OnDestroy {
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

  type: string;
  requestType: string;
  id: number;
  storeType: string;

  error$: Observable<CustomErrors>;

  isLoading$: Observable<boolean>;

  items$: Observable<IssueInventoryItem[]>;

  itemsTotalCount$: Observable<number>;

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

  stockIssueTypesEnumRef = StockIssueTypesEnum;
  stockIsuueDetailsTabEnumRef = StockIssueDetailsTabEnum;
  stockIssueeCarrierTypesEnumRef = StockIssueeCarrierTypesEnum;

  productCategoryFilterLable: string;
  productGroupFilterLable: string;

  carrierType: string;

  isL1L2Store: boolean;
  isL3Store: boolean;
  isCancellationAllowed: boolean;
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
    private locationSettingsFacade: LocationSettingsFacade,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
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

    this.type = StockIssueTypesEnum.CANCEL;
    this.requestType = this.activatedRoute.snapshot.params['requestType'];
    this.id = this.activatedRoute.snapshot.params['_reqDocNo'];

    if (
      this.requestType === 'tep-plain' ||
      this.requestType === 'tep-studded'
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

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.INV_IS_STN_CANCELLATION_ALLOWED
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isCancellationAllowed: string) => {
        this.isCancellationAllowed =
          isCancellationAllowed === 'true' ? true : false;
        if (this.isCancellationAllowed) {
          this.router.navigate(
            [
              getStockIssueCancelRouteUrl(StockIssueTypesEnum.BOUTIQUE, this.id)
            ],
            {
              relativeTo: this.activatedRoute
            }
          );
        } else {
          this.router.navigate([
            getStockIssueRouteUrl(StockIssueTypesEnum.FACTORY)
          ]);
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

    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => this.shortcutEventHandler(command));
  }
  componentInit() {
    this.stockIssueFacade.clearSortAndFilter();
    this.stockIssueFacade.loadStuddedProductGroups();
    this.isLoading$ = this.stockIssueFacade.getisLoadingIssueToBoutiqueCancelSTN();
    this.items$ = this.stockIssueFacade.getCancelIssueItems();
    this.itemsTotalCount$ = this.stockIssueFacade.getCancelIssueItemsCount();

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
      });

    this.stockIssueFacade.loadCancelIssueSTNDetails({
      transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ,
      id: this.id
    });

    this.stockIssueFacade
      .getCancelIssueSTNDetails()
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
          this.messageNotification();
          this.stockIssueFacade.loadCancelIssueItemsCount(
            this.createItemTotalCountPayload()
          );
          this.loadItems();
        } else {
          this.selected = null;
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

    this.stockIssueFacade
      .getCancelIssueSTNRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: StockRequestNote) => {
        if (res) {
          this.cancelStatusNotifications();
        }
      });
  }
  loadItems() {
    this.isLoadImageUrl = true;
    this.stockIssueFacade.loadCancelIssueItems(this.creatItemLoadPayload());
  }
  creatItemLoadPayload(): LoadCancelIssuetemsPayload {
    console.log('called');
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
      page: this.issueItemsPageEvent.pageIndex,
      size: this.issueItemsPageEvent.pageSize,
      sort: this.sortBy ? [this.sortBy + ',' + this.sortOrder] : null,
      transferType: 'BTQ_BTQ',
      binCodes: [null],
      binGroupCode: null,
      itemCode: this.itemCode,
      lotNumber: this.lotNumber,
      productCategories: filterProductCategories,
      productGroups: filterProductGroups
    };
  }
  createItemTotalCountPayload() {
    return {
      transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ,
      id: this.id
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
    this.router.navigate([getStockIssueRouteUrl('cancel')]);
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
          measuredWeight: this.selected.totalAvailableWeight,
          weightUnit: this.selected.weightUnit,
          type: 'history'
        },
        disableClose: true
      });

      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.messageNotification();
        });
    }
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
            // this.back();
          } else {
            this.messageNotification();
          }
        }
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

  messageNotification() {
    this.hasNotification = true;
    const buttonKey = 'pw.stockIssue.cancelButtonTxt';
    this.translate
      .get(buttonKey)
      .pipe(take(1))
      .subscribe((translatedButtonKey: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: translatedButtonKey,
            hasRemarks: true,
            isRemarksMandatory: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.cancel(event);
            }
          });
      });
  }

  cancel(event) {
    this.stockIssueFacade.cancelIssueSTN({
      id: this.id,
      transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ,
      payload: {
        cancelRemarks: event.data
      }
    });
  }

  /**
   * Notification overlay for status
   * @param status: status of request
   */
  cancelStatusNotifications() {
    const key1 = 'pw.stockIssue.cancelSTNSuccessMsg';


    this.translate
      .get([key1])
      .pipe(take(1))
      .subscribe((translatedMessages: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            message: translatedMessages[key1],
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.back();
          });
      });
  }

  // Image
  loadImage(itemList: IssueInventoryItem[], imageCatalogueDetails) {
    this.isLoadImageUrl = false;
    itemList.forEach(item => {
      if(item.imageURL !== null && item.imageURL !== undefined){
        this.stockIssueFacade.loadThumbnailImageUrl({
          id: item.id,
          imageUrl: item.imageURL,
          imageCatalogueDetails: imageCatalogueDetails,
          isCancelItems: true
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
            imageCatalogueDetails: imageCatalogueDetails,
            isCancelItems: true
          });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
