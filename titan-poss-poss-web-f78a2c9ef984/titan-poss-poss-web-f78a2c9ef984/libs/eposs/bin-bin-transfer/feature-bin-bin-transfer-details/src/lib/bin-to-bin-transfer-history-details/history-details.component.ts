import { getBintoBinTransferRouteUrl } from '@poss-web/shared/util-site-routes';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { BinToBinTransferFacade } from '@poss-web/eposs/bin-bin-transfer/data-access-bin-bin-transfer';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { takeUntil, take, withLatestFrom } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ProductGroup,
  BinToBinTransferItem,
  BinToBinTransferTypeEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  ProductCategory,
  BinToBinTransferHistoryItemHeader,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  Command,
  ShortcutServiceAbstraction,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum
} from '@poss-web/shared/models';
import {
  Filter,
  FilterService
} from '@poss-web/shared/components/ui-filter-dialog';
import {
  Column,
  SortDialogService
} from '@poss-web/shared/components/ui-sort-dialog';
import {
  ItemSearchResponse,
  ItemSearchComponent
} from '@poss-web/shared/item/ui-item-search';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

export const searchShortcutKey = 'BinToBinHistoryDetailsComponent.MAIN_SEARCH';
export const backShortcutKey = 'BinToBinHistoryDetailsComponent.BACK';
export const filterShortcutKey = 'BinToBinHistoryDetailsComponent.FILTER';
export const sortShortcutKey = 'BinToBinHistoryDetailsComponent.SORT';
const componentName = 'BinToBinHistoryDetailsComponent';

@Component({
  selector: 'poss-web-history-details',
  templateUrl: './history-details.component.html',
  styleUrls: ['./history-details.component.scss']
})
export class HistoryDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(ItemSearchComponent, { static: true })
  private searchRef: ItemSearchComponent;
  binToBinTransferForm: FormGroup;

  isLoadingItems$: Observable<boolean>;
  isLoadingSelectedHistory$: Observable<boolean>;
  isLoadingItemsSuccess$: Observable<boolean>;
  itemsTotalCount: number;
  value: string;
  itemCode: string;
  lotNumber: string;
  sortBy: string;
  sortOrder: string;
  filter: { key: string; value: any[] }[] = [];

  initailPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  itemListPageEvent: PageEvent = this.initailPageEvent;
  hasNotification = false;
  item: BinToBinTransferHistoryItemHeader;
  itemList$: Observable<BinToBinTransferItem[]>;
  pageSizeOptions: number[] = [];
  binToBinTransferTypeEnumRef = BinToBinTransferTypeEnum;
  productCategoryFilterLable: string;
  productGroupFilterLable: string;
  sourceBinFilterLable: string;
  noDataFoundMessageProducts;
  isLoadImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;

  private maxSortLimit: number;
  private maxFilterLimit: number;
  private productCategories: { [key: string]: Filter[] } = {};
  private productGroups: { [key: string]: Filter[] } = {};

  private filterData: { [key: string]: Filter[] } = {};
  private sortData: Column[] = [];
  private destroy$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private binToBinTransferFacade: BinToBinTransferFacade,
    private activatedRoute: ActivatedRoute,
    private filterService: FilterService,
    private sortService: SortDialogService,
    private appSettingFacade: AppsettingFacade,
    private shortcutService: ShortcutServiceAbstraction,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    this.value = this.activatedRoute.snapshot.params['_value'];

    const itemWeightSortLable = 'pw.binToBinTransfer.itemWeightLableText';
    const itemQuantityLable = 'pw.binToBinTransfer.quantityLableText';
    const productCategoryFilterLable =
      'pw.binToBinTransfer.productCategoryFilterLable';
    const productGroupFilterLable =
      'pw.binToBinTransfer.productGroupFilterLable';

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
            this.noDataFoundMessageProducts =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });

    this.translate
      .get([
        itemWeightSortLable,
        itemQuantityLable,
        productCategoryFilterLable,
        productGroupFilterLable
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.productCategoryFilterLable =
          translatedMessages[productCategoryFilterLable];
        this.productGroupFilterLable =
          translatedMessages[productGroupFilterLable];

        this.sortService.DataSource = [
          {
            id: 0,
            sortByColumnName: translatedMessages[itemWeightSortLable],
            sortAscOrder: false
          },
          {
            id: 1,
            sortByColumnName: translatedMessages[itemQuantityLable],
            sortAscOrder: false
          }
        ];
      });

    this.binToBinTransferForm = this.formBuilder.group({
      selectItems: ['']
    });
  }

  ngOnInit() {
    this.binToBinTransferFacade.loadStuddedProductGroups();
    this.binToBinTransferFacade.loadProductGroupOptions();
    this.binToBinTransferFacade.loadProductCategoryOptions();

    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe((command: Command) => {
        console.log(command, 'subsc');
        this.shortcutEventHandler(command);
      });

    this.binToBinTransferFacade
      .getProductGroupOptions()
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

    this.binToBinTransferFacade
      .getProductCategoryOptions()
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

    this.appSettingFacade
      .getPageSize()
      .pipe(
        withLatestFrom(
          this.appSettingFacade.getMaxFilterLimit(),
          this.appSettingFacade.getPageSizeOptions(),
          this.appSettingFacade.getMaxSortLimit()
        ),
        take(1)
      )
      .subscribe(([val, val1, val2, val3]) => {
        this.initailPageEvent.pageSize = val;
        this.maxFilterLimit = val1;
        this.maxSortLimit = val3;
        this.pageSizeOptions = val2;
        this.componentInit();
      });
  }

  back() {
    this.router.navigate(
      [getBintoBinTransferRouteUrl(BinToBinTransferTypeEnum.HISTORY)],
      { state: { clearFilter: false } }
    );
  }

  onSearchClear(): void {
    this.itemCode = null;
    this.lotNumber = null;
    this.itemListPageEvent = this.initailPageEvent;
    this.loadHistoryItems();
  }

  openFilter() {
    this.filterService.DataSource = {
      ...this.productCategories,
      ...this.productGroups
    };

    this.dialog.closeAll();

    this.filterService
      .openDialog(this.maxFilterLimit, this.filterData)
      .pipe(takeUntil(this.destroy$))
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

            this.itemListPageEvent = this.initailPageEvent;
            this.loadHistoryItems();
          }
        }
      );
  }

  openSortDailog() {
    this.dialog.closeAll();
    this.sortService
      .openDialog(this.maxSortLimit, this.sortData)
      .pipe(takeUntil(this.destroy$))
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
              this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
            }
          }
          this.itemListPageEvent = this.initailPageEvent;
          this.loadHistoryItems();
        }
      });
  }

  paginate(pageEvent: PageEvent) {
    this.itemListPageEvent = pageEvent;
    this.loadHistoryItems();
  }

  search(searchData: ItemSearchResponse) {
    this.itemCode = searchData.searchValue;
    this.lotNumber = searchData.lotNumber;
    this.itemListPageEvent = this.initailPageEvent;
    if (searchData.isValid) {
      this.loadHistoryItems();
    } else {
      this.binToBinTransferFacade.clearItems();
    }
  }

  private componentInit() {
    this.binToBinTransferFacade.clearItems();
    this.itemList$ = this.binToBinTransferFacade.getItemList();
    this.isLoadingItems$ = this.binToBinTransferFacade.getIsLoadingItems();
    this.isLoadingItemsSuccess$ = this.binToBinTransferFacade.getIsLoadingItemsSuccess();
    this.isLoadingSelectedHistory$ = this.binToBinTransferFacade.getIsLoadingSelectedHistory();
    this.isLoadingImage$ = this.binToBinTransferFacade.getIsLoadingImage();

    this.binToBinTransferFacade
      .getItemsTotalCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemsTotalCount: number) => {
        this.itemsTotalCount = itemsTotalCount;
      });

    this.binToBinTransferFacade.loadSelectedHistory({
      id: this.activatedRoute.snapshot.params['_value']
    });

    this.binToBinTransferFacade
      .getSelectedHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((item: BinToBinTransferHistoryItemHeader) => {
        if (item) {
          this.item = item;
        }
      });

    this.binToBinTransferFacade
      .getHasSelectedHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasData: boolean) => {
        if (hasData === true) {
          this.loadHistoryItems();
        }
      });

    this.binToBinTransferFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.itemList$
      .pipe(
        withLatestFrom( this.commonFacade.getCommonFacadeAttributes(
          CommomStateAttributeTypeEnum.INVENTORY,
          CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
        )),
        takeUntil(this.destroy$)
      )
      .subscribe(([itemList, imageCatalogueDetails]) => {
        if (itemList) {
          if (this.isLoadImageUrl && itemList.length > 0 && imageCatalogueDetails)
            this.loadImage(itemList, imageCatalogueDetails);
        }
      });
  }

  private errorHandler(error: CustomErrors) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
      });
  }

  private loadHistoryItems() {
    let filterProductGroups = [null];
    let filterProductCategories = [null];
    let filterBinCodes = [null];
    if (this.filter && this.filter.length > 0) {
      for (let i = 0; i < this.filter.length; i++) {
        if (this.filter[i].key === 'productCategory') {
          filterProductCategories = this.filter[i].value;
        } else if (this.filter[i].key === 'productGroup') {
          filterProductGroups = this.filter[i].value;
        } else if (this.filter[i].key === 'binCode') {
          filterBinCodes = this.filter[i].value;
        }
      }
    }
    this.isLoadImageUrl = true;
    this.binToBinTransferFacade.loadHistoryItems({
      historyItemsData: {
        binCodes: filterBinCodes,
        binGroupCode: null,
        itemCode: this.itemCode ? this.itemCode : null,
        lotNumber: this.lotNumber ? this.lotNumber : null,
        productCategories: filterProductCategories,
        productGroups: filterProductGroups
      },
      pageIndex: this.itemListPageEvent.pageIndex,
      pageSize: this.itemListPageEvent.pageSize,
      sortBy: this.sortBy ? this.sortBy : null,
      sortOrder: this.sortOrder ? this.sortOrder : null,
      value: this.value
    });
  }

  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */
  private mapToFilterOptions(
    key: string,
    options: Filter[]
  ): { [key: string]: Filter[] } {
    return {
      [key]: options.map((option: Filter) => ({
        id: option.id,
        description: option.description,
        selected: false
      }))
    };
  }

  private shortcutEventHandler(command: Command): void {
    console.log(command, 'command his dets');
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

      case backShortcutKey: {
        this.dialog.closeAll();
        this.back();
        break;
      }
    }
  }

  // Image
  loadImage(itemList: BinToBinTransferItem[], imageCatalogueDetails) {
    this.isLoadImageUrl = false;
    itemList.forEach(item => {
      this.binToBinTransferFacade.loadThumbnailImageUrl({
        id: item.id,
        imageUrl: item.imageURL,
        imageCatalogueDetails: imageCatalogueDetails
      });
    });
  }

  loadImageUrl(event) {
    this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.INVENTORY,
      CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
    )
      .pipe(take(1))
      .subscribe(imageCatalogueDetails => {
        this.binToBinTransferFacade.loadImageUrl({
          id: event.id,
          imageUrl: event.imageUrl,
          imageCatalogueDetails: imageCatalogueDetails
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
