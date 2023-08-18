import {
  getNotFoundRouteUrl,
  getBintoBinTransferRouteUrl
} from '@poss-web/shared/util-site-routes';
import { SelectionDialogGridService } from '@poss-web/shared/components/ui-selection-dialog-grid';
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
  BinToBinTransProductGroupCodeEnum,
  BinToBinTransProductCategoryCodeEnum,
  BinToBinTransBinsferEnum,
  BinToBinTransferConfirmTransferResponse,
  BinToBinTransferItemListGroup,
  BinToBinTransferItem,
  BinToBinTransferConfirmTransferItemsRequest,
  BinToBinTransferTypeEnum,
  StoreBin,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  ProductCategory,
  Command,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  ShortcutServiceAbstraction,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  Lov,
  SelectDropDownOption,
  StockItemBinGroupCodeEnum
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

export const searchShortcutKey = 'BinToBinTransferDetailsComponent.MAIN_SEARCH';
export const binSelectionShortcutKey =
  'BinToBinTransferDetailsComponent.PRIMARY_DROPDOWN';
export const backShortcutKey = 'BinToBinTransferDetailsComponent.BACK';
export const filterShortcutKey = 'BinToBinTransferDetailsComponent.FILTER';
export const sortShortcutKey = 'BinToBinTransferDetailsComponent.SORT';
export const selectAllShortcutKey =
  'BinToBinTransferDetailsComponent.SELECT_ALL';
export const selectCurrentPageShortcutKey =
  'BinToBinTransferDetailsComponent.SELECT_CURRENT_PAGE';
export const clearAllShortcutKey = 'BinToBinTransferDetailsComponent.CLEAR_ALL';
const componentName = 'BinToBinTransferDetailsComponent';

@Component({
  selector: 'poss-web-bin-to-bin-transfer-details',
  templateUrl: './bin-to-bin-transfer-details.component.html',
  styleUrls: ['./bin-to-bin-transfer-details.component.scss']
})
export class BinToBinTransferDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(ItemSearchComponent, { static: true })
  private searchRef: ItemSearchComponent;

  selectByOptions: { code: string; translationKey: string }[] = [
    {
      code: BinToBinTransferTypeEnum.VARIANT_CODE,
      translationKey: 'pw.binToBinTransfer.variantCodeLable'
    },
    {
      code: BinToBinTransferTypeEnum.BIN_CODE,
      translationKey: 'pw.binToBinTransfer.sourceBinLable'
    },
    {
      code: BinToBinTransferTypeEnum.PRODUCT_GROUP,
      translationKey: 'pw.binToBinTransfer.productGroupLable'
    },
    {
      code: BinToBinTransferTypeEnum.PRODUCT_CATEGORY,
      translationKey: 'pw.binToBinTransfer.productCategoryLable'
    }
  ];

  selectByKeyMap: Map<string, string> = new Map();
  binToBinTransferForm: FormGroup;
  binsForSelection: StoreBin[] = [];
  selectedBin: { binCode: string; binGroupCode: string };
  isLoadingItemListGroup$: Observable<boolean>;
  isLoadingBins$: Observable<boolean>;
  isLoadingItems$: Observable<boolean>;
  isLoadingItemsSuccess$: Observable<boolean>;
  isLoadingImage$: Observable<boolean>;
  itemsTotalCount: number;
  type: string;
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
  confirmTransferResponse: BinToBinTransferConfirmTransferResponse;
  hasNotification = false;
  itemGroup: BinToBinTransferItemListGroup;
  showSourceBin = true;
  itemList: BinToBinTransferItem[] = [];
  selectedItems: BinToBinTransferItem[] = [];
  selectedQuantity = 0;
  previousSelectedQuantity = 0;
  previousItemGroupQuantity = 0;
  selectedValue = 0;
  selectDestinationBinLableText: string;
  searchDestinationBinLableText: string;
  isItemsLoadedOnce = false;
  pageSizeOptions: number[] = [];
  binToBinTransferTypeEnumRef = BinToBinTransferTypeEnum;
  productCategoryFilterLable: string;
  productGroupFilterLable: string;
  sourceBinFilterLable: string;
  noDataFoundMessageItems;
  transferQtyMsgLabel: string;
  isLoadImageUrl: boolean;
  defectTypeDescriptionList: SelectDropDownOption[];
  defectCodeDescriptionList: SelectDropDownOption[];

  private productCategories: { [key: string]: Filter[] } = {};
  private productGroups: { [key: string]: Filter[] } = {};
  private sourceBins: { [key: string]: Filter[] } = {};
  private maxFilterLimit: number;
  private maxSortLimit: number;
  private allItemsId: string[] = [];
  private filterData: { [key: string]: Filter[] } = {};
  private sortData: Column[] = [];
  private sendSelectCurrentEvent = true;
  isSelectAll = false;
  private destroy$ = new Subject();
  itemsTotalValue: number;
  binToBinAllowedTotalItems = 0;

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
    private selectionDialog: SelectionDialogGridService,
    private shortcutService: ShortcutServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    this.selectByOptions.forEach(option =>
      this.selectByKeyMap.set(option.code, option.translationKey)
    );

    this.type = this.activatedRoute.snapshot.params['type'];
    this.value = this.activatedRoute.snapshot.params['_value'];

    if (this.type === BinToBinTransferTypeEnum.BIN_CODE) {
      this.showSourceBin = false;
    }
    if (
      this.type !== BinToBinTransferTypeEnum.BIN_CODE &&
      this.type !== BinToBinTransferTypeEnum.PRODUCT_GROUP &&
      this.type !== BinToBinTransferTypeEnum.PRODUCT_CATEGORY
    ) {
      this.router.navigate([getNotFoundRouteUrl()]);
      return;
    }

    const selectLable = 'pw.binToBinTransfer.selectDestinationBinLableText';
    const searchLable = 'pw.binToBinTransfer.searchDestinationBinLableText';
    const itemWeightSortLable = 'pw.binToBinTransfer.itemWeightLableText';
    const itemQuantityLable = 'pw.binToBinTransfer.quantityLableText';
    const productCategoryFilterLable =
      'pw.binToBinTransfer.productCategoryFilterLable';
    const productGroupFilterLable =
      'pw.binToBinTransfer.productGroupFilterLable';
    const sourceBinFilterLable = 'pw.binToBinTransfer.sourceBinFilterLable';
    const transferQtyMsgLabel = 'pw.binToBinTransfer.transferQtyMsgLabel';
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
            this.noDataFoundMessageItems =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });

    this.translate
      .get([
        selectLable,
        searchLable,
        itemWeightSortLable,
        itemQuantityLable,
        productCategoryFilterLable,
        productGroupFilterLable,
        sourceBinFilterLable,
        transferQtyMsgLabel
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.selectDestinationBinLableText = translatedMessages[selectLable];
        this.searchDestinationBinLableText = translatedMessages[searchLable];
        this.productCategoryFilterLable =
          translatedMessages[productCategoryFilterLable];
        this.productGroupFilterLable =
          translatedMessages[productGroupFilterLable];
        this.sourceBinFilterLable = translatedMessages[sourceBinFilterLable];
        this.transferQtyMsgLabel = translatedMessages[transferQtyMsgLabel];

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

    this.binToBinTransferForm
      .get('selectItems')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((type: string) => {
        switch (type) {
          case 'selectAll': {
            this.isSelectAll = true;
            this.binToBinTransferFacade.changeSelectionOfAllItems({
              idList: this.allItemsId,
              select: true,
              disable: true,
              resetBin: false
            });
            break;
          }
          case 'selectCurrentPage': {
            if (this.sendSelectCurrentEvent) {
              this.isSelectAll = false;
              this.binToBinTransferFacade.changeSelectionOfAllItems({
                idList: this.allItemsId,
                select: true,
                disable: false,
                resetBin: false
              });
            }
            break;
          }
        }

        this.sendSelectCurrentEvent = true;
      });
  }

  ngOnInit() {
    this.binToBinTransferFacade.loadDefectCodeDescription();
    this.binToBinTransferFacade.loadDefectTypeDescription();
    this.binToBinTransferFacade.loadStuddedProductGroups();
    this.binToBinTransferFacade.loadProductGroupOptions();
    this.binToBinTransferFacade.loadProductCategoryOptions();
    this.binToBinTransferFacade.loadSourceBinOptions();
    this.binToBinTransferFacade.loadBins();

    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe((command: Command) => {
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
      .getDefectTypeDescriptionList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((listItems: Lov[]) => {
        if (listItems?.length > 0) {
          this.defectTypeDescriptionList = listItems
            .map(item => ({
              id: item.code,
              description: item.code
            }))
            .sort((item1, item2) =>
              item1.description.toLocaleLowerCase() >
              item2.description.toLocaleLowerCase()
                ? 1
                : -1
            );
        }
      })
    this.binToBinTransferFacade
    .getDefectCodeDescriptionList()
    .pipe(takeUntil(this.destroy$))
    .subscribe((listItems: Lov[]) => {
      if (listItems?.length > 0) {
        this.defectCodeDescriptionList = listItems
        .map(item => ({
          id: item.code,
          description: item.code
        }))
        .sort((item1, item2) =>
          item1.description.toLocaleLowerCase() >
          item2.description.toLocaleLowerCase()
            ? 1
            : -1
        );
      }
    })
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

    this.binToBinTransferFacade
      .getSoruceBinOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe((sourceBins: string[]) => {
        this.sourceBins = this.mapToFilterOptions(
          this.sourceBinFilterLable,
          sourceBins.map((bin: string) => ({
            id: bin,
            description: bin,
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
    this.router.navigate([getBintoBinTransferRouteUrl(this.type)]);
  }

  onSearchClear(): void {
    this.itemCode = null;
    this.lotNumber = null;
    this.isSelectAll = false;
    this.itemListPageEvent = this.initailPageEvent;
    this.loadItems();
  }

  openFilter() {
    this.filterService.DataSource = {
      ...(this.type !== BinToBinTransferTypeEnum.PRODUCT_CATEGORY
        ? this.productCategories
        : null),
      ...(this.type !== BinToBinTransferTypeEnum.BIN_CODE
        ? this.sourceBins
        : null),
      ...(this.type !== BinToBinTransferTypeEnum.PRODUCT_GROUP
        ? this.productGroups
        : null)
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
              if (filterData[this.sourceBinFilterLable]) {
                filterData[this.sourceBinFilterLable].forEach(value => {
                  filterValues.push(value.id);
                });
                if (filterValues.length > 0) {
                  this.filter.push({
                    key: 'binCode',
                    value: filterValues
                  });
                }
              }
              filterValues = [];
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

            this.isSelectAll = false;
            this.itemListPageEvent = this.initailPageEvent;
            this.loadItems();
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
                this.sortBy = 'totalWeight';
              } else if (sortData[0].id === 1) {
                this.sortBy = 'totalQuantity';
              }
              this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
            }
          }
          this.isSelectAll = false;
          this.itemListPageEvent = this.initailPageEvent;
          this.loadItems();
        }
      });
  }

  onUpdateItem(item: BinToBinTransferItem) {
    this.binToBinTransferFacade.updateItemList(item);
  }

  openBinSelectionPopup() {
    this.dialog.closeAll();
    this.selectionDialog
      .open({
        title: this.selectDestinationBinLableText,
        placeholder: this.searchDestinationBinLableText,
        options: this.binsForSelection,
        columnDefs: [
          {
            field: 'binCode',
            headerName: 'Bin Code'
          },
          {
            field: 'binGroupCode',
            headerName: 'Bin Group Code'
          }
        ],
        width: 500,
        searchBy: 'binCode'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: StoreBin) => {
        if (selectedOption) {
          this.selectedBin = {
            binCode: selectedOption.binCode,
            binGroupCode: selectedOption.binGroupCode
          };
          this.showNotification();
        }
      });
  }

  paginate(pageEvent: PageEvent) {
    this.itemListPageEvent = pageEvent;
    this.loadItems();
  }

  resetSelection() {
    this.isSelectAll = false;
    this.binToBinTransferForm.get('selectItems').reset();
    this.binToBinTransferFacade.changeSelectionOfAllItems({
      idList: this.allItemsId,
      select: false,
      disable: false,
      resetBin: false
    });
  }

  search(searchData: ItemSearchResponse) {
    this.itemCode = searchData.searchValue;
    this.lotNumber = searchData.lotNumber;
    this.isSelectAll = false;
    this.itemListPageEvent = this.initailPageEvent;
    if (searchData.isValid) {
      this.loadItems();
    } else {
      this.binToBinTransferFacade.clearItems();
    }
  }

  private calculateSelectedItemsData() {
    if (this.itemGroup) {
      if (this.isSelectAll) {
        this.binToBinTransferFacade
          .getBinToBinAllowedtotalQuantity()
          .pipe(takeUntil(this.destroy$))
          .subscribe(x => {
            x ? this.selectedQuantity = x : 0;
          });
        this.binToBinTransferFacade
        .getBinToBinAllowedtotalValue()
        .pipe(takeUntil(this.destroy$))
        .subscribe(x => {
          x ? this.selectedValue = x : 0;
        });
        this.binToBinTransferFacade
        .getBinToBinAllowedItems()
        .pipe(takeUntil(this.destroy$))
        .subscribe(x => {
          x ? this.binToBinAllowedTotalItems = x : 0;
        });
      } else {
        const caluculatedData = this.selectedItems.filter(x => x.isBinToBinAllowed)
          .map((item: BinToBinTransferItem) => ({
            availableQuantity: item.transferQuantity,
            availableValue: item.stdValue * item.transferQuantity
          }))
          .reduce(
            (item1: BinToBinTransferItem, item2: BinToBinTransferItem) => ({
              availableQuantity:
                item1.availableQuantity + item2.availableQuantity,
              availableValue: item1.availableValue + item2.availableValue
            }),
            {
              availableQuantity: 0,
              availableValue: 0
            }
          );

        this.selectedQuantity = caluculatedData.availableQuantity;
        this.selectedValue = caluculatedData.availableValue;
      }
    }
  }

  private checkAndSetSelectAll() {
    if (
      !this.isSelectAll &&
      this.selectedItems.length !== 0 &&
      this.selectedItems.length === this.itemList.length
    ) {
      this.sendSelectCurrentEvent = false;
      this.binToBinTransferForm.patchValue({
        selectItems: 'selectCurrentPage'
      });
    } else if (!this.isSelectAll) {
      this.binToBinTransferForm.get('selectItems').reset();
    }
  }

  private componentInit() {
    this.binToBinTransferFacade
      .getBins()
      .pipe(takeUntil(this.destroy$))
      .subscribe((bins: StoreBin[]) => {
        if (bins) {
          if (this.type === BinToBinTransferTypeEnum.BIN_CODE) {
            bins = bins.filter(
              (bin: StoreBin) =>
                bin.binCode.toLowerCase() !== this.value.toLowerCase()
            );
          }
          if (
            !(
              (this.type === BinToBinTransferTypeEnum.PRODUCT_GROUP &&
                (this.value.toUpperCase() ===
                  BinToBinTransProductGroupCodeEnum.GOLD_COIN ||
                  this.value.toUpperCase() ===
                    BinToBinTransProductGroupCodeEnum.SILVER_COIN)) ||
              (this.type === BinToBinTransferTypeEnum.PRODUCT_CATEGORY &&
                this.value.toUpperCase() ===
                  BinToBinTransProductCategoryCodeEnum.COIN)
            )
          ) {
            bins = bins.filter(
              (bin: StoreBin) =>
                bin.binGroupCode.toUpperCase() !==
                BinToBinTransBinsferEnum.TEP_SALE
            );
          }
          this.binsForSelection = bins;
        }
      });

    this.isLoadingBins$ = this.binToBinTransferFacade.getIsLoadingBins();
    this.isLoadingItemListGroup$ = this.binToBinTransferFacade.getIsLoadingItemListGroup();

    this.binToBinTransferFacade.clearItems();
    this.binToBinTransferFacade.clearConfirmTransferResponse();
    this.binToBinTransferFacade.clearSelectedItemGroup();

    this.binToBinTransferFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.binToBinTransferFacade.loadItemGroup({
      type: this.type,
      value: this.value
    });

    this.binToBinTransferFacade
      .getSelectedItemListGroup()
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemGroup: BinToBinTransferItemListGroup) => {
        if (itemGroup) {
          this.itemGroup = itemGroup;
        }
      });

    this.binToBinTransferFacade
      .getIsLoadingSelectedItemListGroupSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoaded: boolean) => {
        if (isLoaded === false && !this.isSelectAll) {
          this.back();
        } else if (isLoaded) {
          this.resetSelection();
          this.loadItems();
        }
      });

    this.binToBinTransferFacade
      .getItemList()
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
        if (itemList) {
          if (!this.isItemsLoadedOnce && itemList.length > 0) {
            this.isItemsLoadedOnce = true;
          }
          this.itemList = itemList;
          this.allItemsId = this.itemList.map(
            (item: BinToBinTransferItem) => item.id
          );
          this.selectedItems = this.itemList.filter(
            (item: BinToBinTransferItem) => item.isSelected
          );

          this.checkAndSetSelectAll();
          this.calculateSelectedItemsData();
          this.showNotification();

          if (
            this.isLoadImageUrl &&
            itemList.length > 0 &&
            imageCatalogueDetails
          )
            this.loadImage(itemList, imageCatalogueDetails);
        }
      });

    this.isLoadingItems$ = this.binToBinTransferFacade.getIsLoadingItems();
    this.isLoadingImage$ = this.binToBinTransferFacade.getIsLoadingImage();

    this.binToBinTransferFacade
      .getItemsTotalCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemsTotalCount: number) => {
        this.itemsTotalCount = itemsTotalCount;
      });

    this.binToBinTransferFacade
      .getItemsTotalValue()
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemsTotalValue: number) => {
        this.itemsTotalValue = itemsTotalValue;
      });

    this.binToBinTransferFacade
      .getConfirmTransferResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (confirmTransferResponse: BinToBinTransferConfirmTransferResponse) => {
          this.confirmTransferResponse = confirmTransferResponse;

          if (this.confirmTransferResponse) {
            this.previousSelectedQuantity = this.selectedQuantity;
            this.previousItemGroupQuantity = this.itemGroup.products;
            if (
              this.type !== BinToBinTransferTypeEnum.BIN_CODE ||
              this.previousItemGroupQuantity > this.previousSelectedQuantity
            ) {
              this.binToBinTransferFacade.loadItemGroup({
                type: this.type,
                value: this.value
              });
            }
          }
          this.showNotification();
        }
      );

    this.isLoadingItemsSuccess$ = this.binToBinTransferFacade.getIsLoadingItemsSuccess();

    this.isLoadingItemsSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          if (this.isSelectAll) {
            this.binToBinTransferFacade.changeSelectionOfAllItems({
              idList: this.allItemsId,
              select: true,
              disable: true,
              resetBin: false
            });
          } else {
            this.resetSelection();
          }
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
        this.showNotification();
      });
  }

  private loadItems() {
    this.isLoadImageUrl = true;
    this.binToBinTransferFacade.loadItems({
      type: this.type,
      value: this.value,
      itemCode: this.itemCode,
      lotNumber: this.lotNumber,
      pageIndex: this.itemListPageEvent.pageIndex,
      pageSize: this.itemListPageEvent.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      filter: this.filter
    });
  }

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

  private showNotification() {
    if (this.confirmTransferResponse) {
      this.showConfirmReceiveSuccessNotification(
        this.confirmTransferResponse.transferId
      );
    } else {
      if ((this.selectedItems.length > 0 && this.selectedItems.filter(x => x.isBinToBinAllowed).length > 0)
      || (this.isSelectAll && this.selectedQuantity > 0)) {
        if (this.selectedBin && this.selectedBin.binCode) {
          if (
            this.selectedItems.some(x => x.binCode === this.selectedBin.binCode)
          ) {
            this.showAssignDestinationBinNotification(
              'pw.binToBinTransferNotificationMessages.sameDestSourceBinMessage',
              this.isSelectAll
                ? this.binToBinAllowedTotalItems ? this.binToBinAllowedTotalItems : 0
                : this.selectedItems.filter(x => x.isBinToBinAllowed).length
            );
          } else if(!this.isSelectAll && this.selectedItems.some(x => this.selectedBin.binGroupCode === StockItemBinGroupCodeEnum.DEFECTIVE && (!x.defectCodeDesc || !x.defectTypeDesc))) {
            this.showAssignDestinationBinNotification(
              'pw.binToBinTransferNotificationMessages.defectiveDescriptionMessage',
              this.isSelectAll
                ? this.binToBinAllowedTotalItems ? this.binToBinAllowedTotalItems : 0
                : this.selectedItems.filter(x => x.isBinToBinAllowed).length);
          } else {
            this.showConfirmTransferNotification(
              this.isSelectAll
                ? this.binToBinAllowedTotalItems ? this.binToBinAllowedTotalItems : 0
                : this.selectedItems.length
            );
          }
        } else {
          this.showAssignDestinationBinNotification(
            'pw.binToBinTransferNotificationMessages.assignDestinationBulkBinMessage',
            this.isSelectAll ? this.binToBinAllowedTotalItems ? this.binToBinAllowedTotalItems : 0 : this.selectedItems.filter(x => x.isBinToBinAllowed).length
          );
        }
      } else if (this.selectedItems.length > 0 || this.isSelectAll) {
        this.showProductSelectNotification('pw.binToBinTransferNotificationMessages.noProductSelectMessage', '0');
      } else if (this.itemList.length > 0) {
        this.showProductSelectNotification('pw.binToBinTransferNotificationMessages.productSelectMessage');
      } else {
        this.overlayNotification.close();
        this.hasNotification = false;
      }
    }
  }
  private showProductSelectNotification(key: string, count: string = '') {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        let errorMsg =  count + ' ' + translatedMessage;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: errorMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.hasNotification = false;
          });
      });
  }

  private showAssignDestinationBinNotification(key: string, count: number = 0) {
    // const key =
    //   'pw.binToBinTransferNotificationMessages.assignDestinationBulkBinMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: count + ' ' + translatedMessage
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
          });
      });
  }

  private showConfirmTransferNotification(count: number = 0) {
    const key =
      'pw.binToBinTransferNotificationMessages.confirmTransferMessage';
    const buttonKey =
      'pw.binToBinTransferNotificationMessages.confirmTransferButtonText';
    this.translate
      .get([key, buttonKey])
      .pipe(take(1))
      .subscribe((translatedMessages: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message: count + ' ' + translatedMessages[key],
            buttonText: translatedMessages[buttonKey]
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.showProgressNotification();
              if (this.isSelectAll) {
                this.binToBinTransferFacade.confirmTransferAllItems({
                  type: this.type,
                  value: this.value,
                  destinationBinCode: this.selectedBin.binCode,
                  destinationBinGroupCode: this.selectedBin.binGroupCode
                });
              } else {
                if (
                  this.selectedItems.every(x => x.transferQuantity) &&
                  this.selectedItems.every(
                    x =>
                      x.transferQuantity <= x.availableQuantity &&
                      x.transferQuantity > 0
                  )
                ) {
                  const confirmTransferRequest: BinToBinTransferConfirmTransferItemsRequest = {
                    request: {
                      binItems: this.selectedItems.filter(x => x.isBinToBinAllowed).map(
                        (item: BinToBinTransferItem) => ({
                          inventoryId: item.id,
                          binGroupCode: this.selectedBin.binGroupCode,
                          binCode: this.selectedBin.binCode,
                          quantity: item.transferQuantity,
                          defectCodeDesc: item.defectCodeDesc,
                          defectTypeDesc: item.defectTypeDesc
                        })
                      )
                    },
                    remove: false
                  };
                  this.binToBinTransferFacade.confirmTransferItems(
                    confirmTransferRequest
                  );
                } else {
                  this.showErrorPopUp(this.transferQtyMsgLabel);
                }
              }
            }
          });
      });
  }

  private showConfirmReceiveSuccessNotification(transferNumber: number) {
    const key =
      'pw.binToBinTransferNotificationMessages.confirmTransferSuccessMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            message: translatedMsg + ' ' + transferNumber,
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            this.binToBinTransferFacade.clearConfirmTransferResponse();
            if (
              this.type === BinToBinTransferTypeEnum.BIN_CODE &&
              (this.isSelectAll ||
                !(
                  this.previousItemGroupQuantity > this.previousSelectedQuantity
                ))
            ) {
              this.back();
            }
          });
      });
  }

  private showProgressNotification() {
    const key = 'pw.binToBinTransferNotificationMessages.progressMessage';
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
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
          });
      });
  }

  private shortcutEventHandler(command: Command): void {
    switch (command.name) {
      case searchShortcutKey: {
        if (this.searchRef) {
          this.dialog.closeAll();
          this.searchRef.focus();
        }
        break;
      }
      case binSelectionShortcutKey: {
        this.openBinSelectionPopup();
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

      case selectAllShortcutKey: {
        if (!(this.filter.length > 0 || this.itemCode)) {
          this.dialog.closeAll();
          this.binToBinTransferForm.patchValue({
            selectItems: 'selectAll'
          });
        }
        break;
      }

      case selectCurrentPageShortcutKey: {
        this.dialog.closeAll();
        this.binToBinTransferForm.patchValue({
          selectItems: 'selectCurrentPage'
        });
        break;
      }

      case clearAllShortcutKey: {
        this.dialog.closeAll();
        this.resetSelection();
        break;
      }

      case backShortcutKey: {
        this.dialog.closeAll();
        this.back();
        break;
      }
    }
  }

  showErrorPopUp(translatedMessage: string) {
    this.overlayNotification.close();
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.ERROR,
      message: translatedMessage
    });
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
    this.commonFacade
      .getCommonFacadeAttributes(
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
