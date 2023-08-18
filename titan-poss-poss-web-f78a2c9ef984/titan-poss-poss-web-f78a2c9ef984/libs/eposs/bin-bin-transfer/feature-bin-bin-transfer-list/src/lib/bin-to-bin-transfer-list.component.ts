import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { MatDialog } from '@angular/material/dialog';
import {
  getInStockHomeRouteUrl,
  getBintoBinTransferRouteUrl,
  get404Url
} from '@poss-web/shared/util-site-routes';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { BinToBinTransferFacade } from '@poss-web/eposs/bin-bin-transfer/data-access-bin-bin-transfer';

import {
  BinToBinTransferItem,
  BinToBinTransferTypeEnum,
  BinToBinTransBinsferEnum,
  BinToBinTransferConfirmTransferItemsRequest,
  BinToBinTransferItemListGroup,
  BinToBinTransferConfirmTransferResponse,
  CustomErrors,
  StoreBin,
  OverlayNotificationServiceAbstraction,
  ProductGroup,
  ProductCategory,
  BinToBinTransferHistoryItemHeader,
  AdvancedFilterData,
  LocationSettingAttributesEnum,
  SharedBodEodFeatureServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  Command,
  ShortcutServiceAbstraction,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  FileNamesEnum,
  FilePathEnum,
  Lov,
  SelectDropDownOption,
  StockItemBinGroupCodeEnum,
  BinToBinFileUploadItemsBulkTransferRequest,
  BinToBinTransferLoadFileUploadItemsRequest
} from '@poss-web/shared/models';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  Inject,
  TemplateRef
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject, fromEvent, of, combineLatest } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  takeUntil,
  filter,
  take,
  withLatestFrom,
  debounceTime
} from 'rxjs/operators';

import {
  Filter,
  FilterService
} from '@poss-web/shared/components/ui-filter-dialog';
import {
  Column,
  SortDialogService
} from '@poss-web/shared/components/ui-sort-dialog';
import {
  ItemSearchListComponent,
  ItemSearchComponent,
  ItemSearchResponse
} from '@poss-web/shared/item/ui-item-search';
import { CardListComponent } from '@poss-web/shared/components/ui-card-list';

import * as moment from 'moment';
import { HistoryAdvancedSearchPopupComponent } from '@poss-web/eposs/bin-bin-transfer/ui-bin-bin-transfer-popup';

import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { SelectionDialogGridService } from '@poss-web/shared/components/ui-selection-dialog-grid';
import { SelectDropdownComponent } from '@poss-web/shared/components/ui-form-field-controls';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { POSS_WEB_EMP_LOAN_CONFIG_FILE_SIZE } from '@poss-web/shared/util-config';
import { PageEvent } from '@angular/material/paginator';
export const searchListShortcutKey =
  'BinToBinTransferListComponent.MAIN_SEARCH';
export const cardListShortcutKey = 'BinToBinTransferListComponent.CARD_LIST';
export const dropDownShortcutKey =
  'BinToBinTransferListComponent.PRIMARY_DROPDOWN';
export const backShortcutKey = 'BinToBinTransferListComponent.BACK';
export const searchItemShortcutKey =
  'BinToBinTransferListComponent.SECONDARY_SEARCH';
export const filterShortcutKey = 'BinToBinTransferListComponent.FILTER';
export const sortShortcutKey = 'BinToBinTransferListComponent.SORT';
export const selectAllShortcutKey = 'BinToBinTransferListComponent.SELECT_ALL';
export const clearAllShortcutKey = 'BinToBinTransferListComponent.CLEAR_ALL';
export const binSelectionShortcutKey =
  'BinToBinTransferListComponent.SECONDARY_DROPDOWN';
const tab1ShortcutKey = 'Common.TAB_1';
const tab2ShortcutKey = 'Common.TAB_2';
const componentName = 'BinToBinTransferListComponent';
const csvExtn = 'csv';
const reqfileKey = 'reqFile';

@Component({
  selector: 'poss-web-bin-to-bin-transfer-list',
  templateUrl: './bin-to-bin-transfer-list.component.html',
  styleUrls: ['./bin-to-bin-transfer-list.component.scss']
})
export class BinToBinTransferListComponent
  implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild(ItemSearchListComponent)
  private searchListRef: ItemSearchListComponent;
  @ViewChild(ItemSearchComponent)
  private searchRef: ItemSearchComponent;
  @ViewChild(CardListComponent)
  private cardListComponentRef: CardListComponent;
  @ViewChild('typeDropdown')
  typeDropdown: SelectDropdownComponent;

  pageSize = 4;
  initialPageSize = 8;
  selectByOptions: { value: string; description: string }[] = [];
  storeType: string;
  isL1L2Store: boolean;
  isL3Store: boolean;
  selectByKeyMap: Map<string, string> = new Map();
  itemList: BinToBinTransferItem[] = [];
  allItemList: BinToBinTransferItem[] = [];
  searchedItemList: BinToBinTransferItem[] = [];
  isSearchingItems$: Observable<boolean>;
  isLoadingItems$: Observable<boolean>;
  hasSearchedItems$: Observable<boolean>;
  selectedItems: BinToBinTransferItem[] = [];
  sendSelectAllEvent = true;
  hasNotification = false;
  isLoadingBins$: Observable<boolean>;
  bins: StoreBin[] = [];
  binsForSelection: StoreBin[] = [];
  selectedBin: { binCode: string; binGroupCode: string };
  hasResults = null;
  sourceBins$: Observable<BinToBinTransferItemListGroup[]>;
  sourceBinsTotalCount$: Observable<number>;
  productGroups$: Observable<BinToBinTransferItemListGroup[]>;
  productGroupsTotalCount$: Observable<number>;
  productCategory$: Observable<BinToBinTransferItemListGroup[]>;
  productCategoryTotalCount$: Observable<number>;
  searchedItemListGroups$: Observable<BinToBinTransferItemListGroup[]>;
  searchedItemListGroupsTotalCount$: Observable<number>;
  itemGroups$: Observable<BinToBinTransferItemListGroup[]>;
  itemGroupsTotalCount$: Observable<number>;
  isLoadingItemListGroup$: Observable<boolean>;
  confirmTransferResponse: BinToBinTransferConfirmTransferResponse;
  isSourceBinsLoadedOnce = false;
  isProducCategoryLoadedOnce = false;
  isProductGroupsLoadedOnce = false;
  hasReachedMaxLimit = false;
  isAddedToCart = false;
  itemCode: string;
  lotNumber: string;
  sortBy: string;
  sortOrder: string;
  filter: { key: string; value: any[] }[] = [];
  itemListId: string[] = [];
  allItemsId: string[] = [];
  selectedItemsId: string[] = [];
  binToBinTransferForm: FormGroup;
  filterData: { [key: string]: Filter[] } = {};
  sortData: Column[] = [];
  selectDestinationBinLableText: string;
  searchDestinationBinLableText: string;
  binToBinTransferTypeEnumRef = BinToBinTransferTypeEnum;
  binTobinTransferType: BinToBinTransferTypeEnum;
  type: BinToBinTransferTypeEnum;
  binToBinHistory$: Observable<BinToBinTransferHistoryItemHeader[]>;
  binToBinHistoryTotalCount$: Observable<number>;
  isLoadingHistory: boolean;
  isHistoryLoadedOnce = false;
  historyForm: FormGroup;
  currentDate = moment();
  status: string;
  statusColor: string;
  historyFormData: any;
  pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };
  pageSizeOptions: number[] = [];
  count = 0;
  minPageSize: number;

  @ViewChild('fileInput') fileInput;

  @ViewChild('tabRef') tabRef: ElementRef;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;

  @ViewChild('stockInformationNotificationTemplate', { static: true })
  stockInformationNotificationTemplate: TemplateRef<any>;

  historySearchFormControl = new FormControl();
  searchValue = 0;

  productCategoryFilterLable: string;
  productGroupFilterLable: string;
  sourceBinFilterLable: string;
  private productCategories: { [key: string]: Filter[] } = {};
  private productGroups: { [key: string]: Filter[] } = {};
  private sourceBins: { [key: string]: Filter[] } = {};
  private maxFilterLimit: number;
  private maxSortLimit: number;
  private maxProductInList: number;
  private destroy$: Subject<null> = new Subject<null>();
  currentFiscalYear: string;

  //element-ACL
  permissions$: Observable<any[]>;
  BIN_TO_BIN_TRANSFER_TAB = 'Inventory BTB Transfer - Bin to Bin transfer Tab';
  BIN_TO_BIN_TRANSFER_HISTORY_TAB = 'Inventory BTB Transfer - History Tab';
  isFilterApplied = false;
  //
  isLoggedIn: boolean;

  noDataFoundMessageSoruceBin;
  noDataFoundMessageProductCategory;
  noDataFoundMessageProductGroup;
  noDataFoundMessageProducts;
  bussinessDay = null;
  isLoadImageUrl: boolean;
  isLoadSearchImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  defectTypeDescriptionList: SelectDropDownOption[];
  defectCodeDescriptionList: SelectDropDownOption[];
  invalidStockItems: string;
  notAllowedItems: string;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private binToBinTransferFacade: BinToBinTransferFacade,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private sortService: SortDialogService,
    private filterService: FilterService,
    private selectionDialog: SelectionDialogGridService,
    private shortcutService: ShortcutServiceAbstraction,
    private appSettingFacade: AppsettingFacade,
    private fileDownloadService: FileDownloadService,
    private dialog: MatDialog,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    private permissionService: PermissionService,
    private authFacade: AuthFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private commonFacade: CommonFacade,
    @Inject(POSS_WEB_EMP_LOAN_CONFIG_FILE_SIZE) public fileSize
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    this.type = this.activatedRoute.snapshot.params['type'];
    this.binToBinTransferForm = this.formBuilder.group({
      type: [
        this.type !== BinToBinTransferTypeEnum.HISTORY
          ? this.type
          : BinToBinTransferTypeEnum.BTB_TRANSFER_TAB
      ],
      selectItems: ['']
    });

    const selectLable = 'pw.binToBinTransfer.selectDestinationBinLableText';
    const searchLable = 'pw.binToBinTransfer.searchDestinationBinLableText';
    const itemWeightSortLable = 'pw.binToBinTransfer.itemWeightLableText';
    const itemQuantityLable = 'pw.binToBinTransfer.quantityLableText';
    const productCategoryFilterLable =
      'pw.binToBinTransfer.productCategoryFilterLable';
    const productGroupFilterLable =
      'pw.binToBinTransfer.productGroupFilterLable';
    const sourceBinFilterLable = 'pw.binToBinTransfer.sourceBinFilterLable';
    this.translate
      .get(['pw.entity.sourceBinEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.sourceBinEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageSoruceBin =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });

    this.translate
      .get(['pw.entity.productCategoryEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.productCategoryEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageProductCategory =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });

    this.translate
      .get(['pw.entity.productGroupsEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.productGroupsEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageProductGroup =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
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
            this.noDataFoundMessageProducts =
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
        'pw.binToBinTransfer.variantCodeLable',
        'pw.binToBinTransfer.sourceBinLable',
        'pw.binToBinTransfer.productGroupLable',
        'pw.binToBinTransfer.productCategoryLable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.selectByOptions = [
          {
            value: BinToBinTransferTypeEnum.VARIANT_CODE,
            description:
              translatedMessages['pw.binToBinTransfer.variantCodeLable']
          },
          {
            value: BinToBinTransferTypeEnum.BIN_CODE,
            description:
              translatedMessages['pw.binToBinTransfer.sourceBinLable']
          },
          {
            value: BinToBinTransferTypeEnum.PRODUCT_GROUP,
            description:
              translatedMessages['pw.binToBinTransfer.productGroupLable']
          },
          {
            value: BinToBinTransferTypeEnum.PRODUCT_CATEGORY,
            description:
              translatedMessages['pw.binToBinTransfer.productCategoryLable']
          }
        ];

        this.selectByOptions.forEach(option =>
          this.selectByKeyMap.set(option.value, option.description)
        );

        this.selectDestinationBinLableText = translatedMessages[selectLable];
        this.searchDestinationBinLableText = translatedMessages[searchLable];
        this.productCategoryFilterLable =
          translatedMessages[productCategoryFilterLable];
        this.productGroupFilterLable =
          translatedMessages[productGroupFilterLable];
        this.sourceBinFilterLable = translatedMessages[sourceBinFilterLable];

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
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });

    // TODO : change logic. Route state
    this.router.events
      .pipe(
        filter(
          (event: Event) => event instanceof NavigationEnd && this.isLoggedIn
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const type = this.activatedRoute.snapshot.params['type'];
        if (
          type !== BinToBinTransferTypeEnum.VARIANT_CODE &&
          type !== BinToBinTransferTypeEnum.BIN_CODE &&
          type !== BinToBinTransferTypeEnum.PRODUCT_GROUP &&
          type !== BinToBinTransferTypeEnum.PRODUCT_CATEGORY &&
          type !== BinToBinTransferTypeEnum.HISTORY
        ) {
          this.router.navigate([get404Url()]);
          return;
        } else {
          if (this.type !== type) {
            this.type = type;
            if (type === BinToBinTransferTypeEnum.HISTORY) {
              this.loadHistory();
            } else if (this.binToBinTransferForm.get('type').value !== type) {
              this.binToBinTransferForm.patchValue({ type });
            }
            this.binToBinTransferFacade.clearSearchedItems();
          }
        }
      });
    if (
      !this.router.getCurrentNavigation() &&
      !this.router.getCurrentNavigation()?.extras.state &&
      !this.router.getCurrentNavigation()?.extras.state.clearFilter === false
    ) {
      this.binToBinTransferFacade.resetAdvanceFilter(this.bussinessDay);
    }
  }

  ngOnInit() {
    this.binToBinTransferFacade.loadDefectCodeDescription();
    this.binToBinTransferFacade.loadDefectTypeDescription();
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.binToBinTransferFacade.resetLoadedHistory();
    this.binToBinTransferFacade.clearItems();
    this.binToBinTransferFacade.clearSearchedItems();
    this.binToBinTransferFacade.clearConfirmTransferResponse();
    this.binToBinTransferFacade.clearItemsGroups();
    this.binToBinTransferFacade.loadStuddedProductGroups();
    this.binToBinTransferFacade.loadProductGroupOptions();
    this.binToBinTransferFacade.loadProductCategoryOptions();

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOpts => {
        this.pageSizeOptions = pageSizeOpts;
        const pageSizeOptions = this.pageSizeOptions;
        this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        this.currentFiscalYear = fiscalYear;
      });
    this.bodEodFeatureService
      .getLatestBusinessDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.bussinessDay = data;
          console.log('data123', data);
          this.binToBinTransferFacade.loadHistoryFilterData({
            startDate: this.historyFormData.startDate
              ? this.historyFormData.startDate
              : this.bussinessDay,
            endDate: this.historyFormData.endDate
              ? this.historyFormData.endDate
              : this.bussinessDay,
            fiscalYear: this.historyFormData?.fiscalYear
              ? this.historyFormData.fiscalYear
              : null
          });
          if (this.type === BinToBinTransferTypeEnum.HISTORY)
            this.loadHistory();
        }
      });
    this.elementPermission
      .loadPermission(this.BIN_TO_BIN_TRANSFER_TAB, this.permissions$)
      .pipe(
        filter(data => !!data.transactionCodes),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        const availableTransactionCodes = data.transactionCodes;
        const hasRequestPermission = availableTransactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );
        if (hasRequestPermission) {
          this.binToBinTransferFacade.loadSourceBinOptions();
        }
      });

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
      });
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
      .getMaxFilterLimit()
      .pipe(
        withLatestFrom(
          this.appSettingFacade.getMaxProductInList(),
          this.appSettingFacade.getMaxSortLimit()
        ),
        take(1)
      )
      .subscribe(([maxFilterLimit, maxProductInList, maxSortLimit]) => {
        this.maxFilterLimit = maxFilterLimit;
        this.maxSortLimit = maxSortLimit;
        this.maxProductInList = maxProductInList;
      });

    this.binToBinTransferFacade
      .getBins()
      .pipe(takeUntil(this.destroy$))
      .subscribe((bins: StoreBin[]) => {
        if (bins) {
          this.bins = bins;
          this.binsForSelection = bins.filter(
            (bin: StoreBin) =>
              bin.binGroupCode.toUpperCase() !==
              BinToBinTransBinsferEnum.TEP_SALE
          );
        }
      });

    this.isLoadingBins$ = this.binToBinTransferFacade.getIsLoadingBins();
    this.isLoadingImage$ = this.binToBinTransferFacade.getIsLoadingImage();
    this.binToBinTransferFacade
      .getSearchedItemList()
      .pipe(
        withLatestFrom(
          this.commonFacade.getCommonFacadeAttributes(
            CommomStateAttributeTypeEnum.INVENTORY,
            CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([items, imageCatalogueDetails]) => {
        this.isAddedToCart = false;
        if (items.length > 0) {
          if (items.length === 1 && items[0].isBinToBinAllowed) {
            if (this.searchListRef) {
              this.searchListRef.reset();
            }
            this.addToItemList(items);

            this.isAddedToCart = true;
          } else {
            this.searchedItemList = items;
            if (
              this.isLoadSearchImageUrl &&
              items.length > 0 &&
              imageCatalogueDetails
            )
              this.loadImage(items, imageCatalogueDetails, true);
          }
        } else {
          this.searchedItemList = [];
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
          this.allItemList = itemList;

          if (this.allItemList.length != 0 && !this.isSelectByVariantCode()) {
            this.setSelectByVariantCode();
          }
          this.allItemsId = this.allItemList.map(
            (item: BinToBinTransferItem) => item.id
          );
          this.selectedItems = this.allItemList.filter(
            (item: BinToBinTransferItem) => item.isSelected
          );

          this.selectedItemsId = this.selectedItems.map(
            (item: BinToBinTransferItem) => item.id
          );
          this.loadItemCart();
          this.checkAndSetSelectAll();
          this.showNotification();

          if (
            this.isLoadImageUrl &&
            itemList.length > 0 &&
            imageCatalogueDetails
          )
            this.loadImage(itemList, imageCatalogueDetails, false);
        }
      });
    combineLatest([
      this.binToBinTransferFacade.getInvalidItems(),
      this.binToBinTransferFacade.getNotInStockItems()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(invalidItemsToTransfer => {
        if (
          invalidItemsToTransfer[0].length > 0 ||
          invalidItemsToTransfer[1].length > 0
        ) {
          this.notAllowedItems = invalidItemsToTransfer[0].toString();
          this.invalidStockItems = invalidItemsToTransfer[1].toString();
          this.showInfoNotification();
        }
        // this.failureNotification('pw.binToBinTransfer.invalidItemsLabel', invalidItemsToTransfer[0].toString(), invalidItemsToTransfer[1].toString(), true);
      });
    this.binToBinTransferFacade
      .getIsBinToBinHistoryLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoadingHistory = isLoading;
      });

    this.binToBinHistoryTotalCount$ = this.binToBinTransferFacade.getBinToBinHistoryCount();
    this.binToBinHistory$ = this.binToBinTransferFacade.getBinToBinHistory();
    this.binToBinHistory$
      .pipe(takeUntil(this.destroy$))
      .subscribe((history: BinToBinTransferHistoryItemHeader[]) => {
        if (history && history.length !== 0 && !this.isHistoryLoadedOnce) {
          this.isHistoryLoadedOnce = true;
        }
      });
    this.binToBinTransferFacade
      .getHistoryFilterData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((filterData: AdvancedFilterData) => {
        if (filterData) {
          this.filterCheck();
          this.historyFormData = filterData;
        }
      });

    this.isSearchingItems$ = this.binToBinTransferFacade.getIsSearchingItems();

    this.isLoadingItems$ = this.binToBinTransferFacade.getIsLoadingItems();

    this.hasSearchedItems$ = this.binToBinTransferFacade.getHasSearchedItems();

    this.isLoadingItemListGroup$ = this.binToBinTransferFacade.getIsLoadingItemListGroup();

    this.searchedItemListGroups$ = this.binToBinTransferFacade.getSearchedItemListGroups();

    this.searchedItemListGroupsTotalCount$ = this.binToBinTransferFacade.getSearchedItemListGroupsTotalCount();

    this.sourceBins$ = this.binToBinTransferFacade.getSourceBins();
    this.sourceBins$
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemGroup: BinToBinTransferItemListGroup[]) => {
        if (
          itemGroup &&
          itemGroup.length !== 0 &&
          !this.isSourceBinsLoadedOnce
        ) {
          this.isSourceBinsLoadedOnce = true;
        }
      });
    this.sourceBinsTotalCount$ = this.binToBinTransferFacade.getSourceBinsTotalCount();

    this.productGroups$ = this.binToBinTransferFacade.getProductGroups();
    this.productGroups$
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemGroup: BinToBinTransferItemListGroup[]) => {
        if (
          itemGroup &&
          itemGroup.length !== 0 &&
          !this.isProductGroupsLoadedOnce
        ) {
          this.isProductGroupsLoadedOnce = true;
        }
      });
    this.productGroupsTotalCount$ = this.binToBinTransferFacade.getProductGroupsTotalCount();

    this.productCategory$ = this.binToBinTransferFacade.getProductCategory();

    this.productCategory$
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemGroup: BinToBinTransferItemListGroup[]) => {
        if (
          itemGroup &&
          itemGroup.length !== 0 &&
          !this.isProducCategoryLoadedOnce
        ) {
          this.isProducCategoryLoadedOnce = true;
        }
      });
    this.productCategoryTotalCount$ = this.binToBinTransferFacade.getProductCategoryTotalCount();

    this.binToBinTransferForm
      .get('type')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(mode => {
        this.dialog.closeAll();
        if (this.cardListComponentRef) {
          this.cardListComponentRef.resetFocus();
        }
        this.type = mode;
        this.initialize();
        this.router.navigate(['..', mode], { relativeTo: this.activatedRoute });
        if (this.searchListRef) {
          this.searchListRef.reset();
        }
      });

    this.binToBinTransferForm
      .get('selectItems')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((type: string) => {
        if (
          (type === 'selectCurrentPage' || type === 'selectAll') &&
          this.sendSelectAllEvent
        ) {
          this.selectedBin = null;
          this.binToBinTransferFacade.changeSelectionOfAllItems({
            idList: this.itemListId,
            select: true,
            disable: false,
            resetBin: false
          });
        }
        this.sendSelectAllEvent = true;
      });

    this.binToBinTransferFacade
      .getConfirmTransferResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (confirmTransferResponse: BinToBinTransferConfirmTransferResponse) => {
          this.confirmTransferResponse = confirmTransferResponse;
          this.showNotification();
          if (this.confirmTransferResponse) {
            this.binToBinTransferFacade.clearItemsGroups();
            this.isSourceBinsLoadedOnce = false;
            this.isProducCategoryLoadedOnce = false;
            this.isProductGroupsLoadedOnce = false;
          }
        }
      );

    this.binToBinTransferFacade
      .getItemsTotalCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalCount: number) => {
        if (totalCount) {
          this.count = totalCount;
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

    if (this.type !== BinToBinTransferTypeEnum.HISTORY) {
      this.initialize();
    } else {
      this.loadHistory();
    }
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
  ngAfterViewInit(): void {
    /**
     * Event Handler for search Box input with debounce
     */
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const searchValue = this.historySearchFormControl.value;
        this.binToBinTransferFacade.resetLoadedHistory();
        if (searchValue !== '') {
          if (this.validateHistorySearch(searchValue)) {
            this.searchValue = searchValue;
            this.isHistoryLoadedOnce = false;
            this.loadList(0);
          } else this.binToBinTransferFacade.resetLoadedHistory();
        } else this.clearHistorySearch();
      });
  }
  filterCheck() {
    if (
      !(
        (this.historyFormData?.startDate === null ||
          this.historyFormData?.startDate === '') &&
        (this.historyFormData?.endDate === null ||
          this.historyFormData?.endDate === '') &&
        (this.historyFormData?.fiscalYear === null ||
          this.historyFormData?.fiscalYear === '')
      )
    ) {
      this.isFilterApplied = true;
    }
  }
  validateHistorySearch(searchValue: string): boolean {
    return fieldValidation.requestNumberField.pattern.test(searchValue);
  }
  numberCheck($event: KeyboardEvent) {
    const pattern = fieldValidation.numbersField.pattern;
    return pattern.test($event.key);
  }
  clearHistorySearch() {
    this.historySearchFormControl.reset();
    this.binToBinTransferFacade.resetLoadedHistory();
    this.searchValue = 0;
    this.isHistoryLoadedOnce = false;
    this.loadList(0);
  }

  back() {
    this.router.navigate([getInStockHomeRouteUrl()]);
  }

  clearSearchofCart(): void {
    this.itemCode = null;
    this.lotNumber = null;
    this.resetSelection();
    this.loadItemCart();
  }

  clearAll() {
    this.itemCode = null;
    this.lotNumber = null;
    this.sortBy = null;
    this.sortOrder = null;
    this.sortData = [];
    this.filter = [];
    this.filterData = {};
    this.selectedBin = null;
    if (this.searchRef) {
      this.searchRef.reset();
    }
    this.loadItemCart();
  }

  deleteSelectedItems() {
    this.selectedBin = null;
    this.binToBinTransferFacade.deleteSelectedItems(this.selectedItemsId);
  }

  loadItemCart() {
    this.itemList = this.allItemList;
    if (this.itemCode) {
      this.itemList = this.searchInItems(
        this.itemList,
        this.itemCode,
        this.lotNumber
      );
    }
    if (this.filter.length > 0) {
      this.itemList = this.filterItems(this.itemList, this.filter);
    }
    if (this.sortBy) {
      this.itemList = [
        ...this.sortItems(this.itemList, this.sortBy, this.sortOrder)
      ];
    }

    this.itemListId = this.itemList.map(
      (item: BinToBinTransferItem) => item.id
    );
  }

  searchInItems(
    items: BinToBinTransferItem[],
    itemCode: string,
    lotNumber: string
  ): BinToBinTransferItem[] {
    return items.filter(
      (item: BinToBinTransferItem) =>
        item.itemCode.toLowerCase() === itemCode.toLowerCase() &&
        (lotNumber
          ? lotNumber.toLowerCase() === item.lotNumber.toLowerCase()
          : true)
    );
  }

  filterItems(
    items: BinToBinTransferItem[],
    filterData: { key: string; value: any[] }[]
  ): BinToBinTransferItem[] {
    for (let i = 0; i < filterData.length; i++) {
      items = items.filter((item: BinToBinTransferItem) => {
        return filterData[i].value.includes(item[filterData[i].key]);
      });
    }
    return items;
  }

  sortItems(
    items: BinToBinTransferItem[],
    sortBy: string,
    sortOrder: string
  ): BinToBinTransferItem[] {
    return items.sort(
      (item1: BinToBinTransferItem, item2: BinToBinTransferItem) => {
        if (item1[sortBy] === item2[sortBy]) {
          return 0;
        }
        return item1[sortBy] < item2[sortBy]
          ? sortOrder === 'ASC'
            ? -1
            : 1
          : sortOrder === 'ASC'
          ? 1
          : -1;
      }
    );
  }

  loadList(pageIndex: number): void {
    if (this.type === BinToBinTransferTypeEnum.HISTORY) {
      this.binToBinTransferFacade.loadBinToBinHistory({
        historyData: {
          actionType: 'ISSUE',
          dateRangeType: 'CUSTOM',
          endDate: this.historyFormData.endDate
            ? this.historyFormData.endDate
            : moment(this.bussinessDay).endOf('day').valueOf(),
          issueDocNo: this.searchValue
            ? this.searchValue
            : this.historyFormData.issueDocNo
            ? this.historyFormData.issueDocNo
            : null,
          issueFiscalYear: this.historyFormData
            ? this.historyFormData.fiscalYear
            : null,
          receiveDocNo: null,
          receiveFiscalYear: null,
          startDate: this.historyFormData?.startDate
            ? this.historyFormData.startDate
            : moment(this.bussinessDay).startOf('day').valueOf(),
          statuses: []
        },
        page: pageIndex,
        size: this.isHistoryLoadedOnce ? this.pageSize : this.initialPageSize,
        transactionType: 'BIN_TO_BIN'
      });
    } else {
      if (
        this.binToBinTransferForm.get('type').value ===
        BinToBinTransferTypeEnum.BIN_CODE
      ) {
        this.binToBinTransferFacade.loadSourceBins({
          type: BinToBinTransferTypeEnum.BIN_CODE,
          pageIndex: pageIndex,
          pageSize: this.isSourceBinsLoadedOnce
            ? this.pageSize
            : this.initialPageSize
        });
      } else if (
        this.binToBinTransferForm.get('type').value ===
        BinToBinTransferTypeEnum.PRODUCT_CATEGORY
      ) {
        this.binToBinTransferFacade.loadProductsCategory({
          type: BinToBinTransferTypeEnum.PRODUCT_CATEGORY,

          pageIndex: pageIndex,
          pageSize: this.isProducCategoryLoadedOnce
            ? this.pageSize
            : this.initialPageSize
        });
      } else if (
        this.binToBinTransferForm.get('type').value ===
        BinToBinTransferTypeEnum.PRODUCT_GROUP
      ) {
        this.binToBinTransferFacade.loadProductsGroups({
          type: BinToBinTransferTypeEnum.PRODUCT_GROUP,

          pageIndex: pageIndex,
          pageSize: this.isProductGroupsLoadedOnce
            ? this.pageSize
            : this.initialPageSize
        });
      }
    }
  }

  isSelectByVariantCode(): boolean {
    return (
      this.binToBinTransferForm.get('type').value ===
      BinToBinTransferTypeEnum.VARIANT_CODE
    );
  }

  setSelectByVariantCode() {
    this.binToBinTransferForm
      .get('type')
      .setValue(BinToBinTransferTypeEnum.VARIANT_CODE);
  }

  isSelectByGroup(): boolean {
    return (
      this.binToBinTransferForm.get('type').value ===
        BinToBinTransferTypeEnum.PRODUCT_CATEGORY ||
      this.binToBinTransferForm.get('type').value ===
        BinToBinTransferTypeEnum.PRODUCT_GROUP ||
      this.binToBinTransferForm.get('type').value ===
        BinToBinTransferTypeEnum.BIN_CODE
    );
  }

  getNoDataFoundMsg() {
    switch (this.binToBinTransferForm.get('type').value) {
      case BinToBinTransferTypeEnum.BIN_CODE: {
        return this.noDataFoundMessageSoruceBin;
      }
      case BinToBinTransferTypeEnum.PRODUCT_GROUP: {
        return this.noDataFoundMessageProductGroup;
      }
      case BinToBinTransferTypeEnum.PRODUCT_CATEGORY: {
        return this.noDataFoundMessageProductCategory;
      }
    }
  }

  onSearchClear() {
    if (this.isSelectByGroup()) {
      if (this.cardListComponentRef) {
        this.cardListComponentRef.resetFocus();
      }
      this.initialize();
    } else {
      this.binToBinTransferFacade.clearSearchedItems();
    }
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
          this.binToBinTransferFacade.updateDestinationBinForSelectedItems({
            idList: this.selectedItemsId,
            destinationBinCode: this.selectedBin.binCode,
            destinationBinGroupCode: this.selectedBin.binGroupCode
          });
        }
      });
  }

  openFilter() {
    this.dialog.closeAll();
    this.filterService.DataSource = {
      ...this.productCategories,
      ...this.sourceBins,
      ...this.productGroups
    };
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

            this.resetSelection();
            this.loadItemCart();
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
                this.sortBy = 'availableWeight';
              } else if (sortData[0].id === 1) {
                this.sortBy = 'availableQuantity';
              }
              this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
            }
          }
          this.loadItemCart();
        }
      });
  }

  onSearchItemsSelected(items: BinToBinTransferItem[]) {
    if (this.allItemList.length + items.length <= this.maxProductInList) {
      this.addToItemList(items);
    } else {
      if (this.searchListRef) {
        this.searchListRef.reset();
      }
      this.hasReachedMaxLimit = true;
      this.showNotification();
    }
  }

  onSelected(data: any): void {
    if (this.type !== BinToBinTransferTypeEnum.HISTORY) {
      this.router.navigate([data.name], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate([data.id], {
        relativeTo: this.activatedRoute
      });
    }
  }

  onDelete(itemId: string) {
    this.selectedBin = null;
    this.binToBinTransferFacade.deleteFromItemList(itemId);
  }

  onUpdateItem(item: BinToBinTransferItem) {
    this.selectedBin = null;
    this.binToBinTransferFacade.updateItemList(item);
  }

  resetSelection() {
    this.selectedBin = null;
    this.binToBinTransferForm.get('selectItems').reset();
    this.binToBinTransferFacade.changeSelectionOfAllItems({
      idList: this.itemListId,
      select: false,
      disable: false,
      resetBin: true
    });
  }

  search(searchData: ItemSearchResponse) {
    if (
      this.binToBinTransferForm.get('type').value ===
      BinToBinTransferTypeEnum.VARIANT_CODE
    ) {
      if (this.allItemList.length < this.maxProductInList) {
        this.isLoadSearchImageUrl = true;
        this.isLoadImageUrl = true;
        this.binToBinTransferFacade.searchItems({
          itemCode: searchData.searchValue,
          lotNumber: searchData.lotNumber
        });
      } else {
        if (this.searchListRef) {
          this.searchListRef.reset();
        }
        this.hasReachedMaxLimit = true;
        this.showNotification();
      }
    } else {
      const searchValue = searchData.searchValue.toUpperCase();
      if (this.validateSearch(searchValue)) {
        if (this.cardListComponentRef) {
          this.cardListComponentRef.resetFocus();
        }
        this.binToBinTransferFacade.searchItemGroups({
          type: this.binToBinTransferForm.get('type').value,
          pageIndex: 0,
          pageSize: this.pageSize,
          value: searchValue
        });
        this.itemGroups$ = this.searchedItemListGroups$;
        this.itemGroupsTotalCount$ = this.searchedItemListGroupsTotalCount$;
      } else {
        this.itemGroups$ = of([]);
        this.itemGroupsTotalCount$ = of(0);
      }
    }
  }

  validateSearch(searchValue: string): boolean {
    let pattern: RegExp;
    const mode = this.binToBinTransferForm.get('type').value;
    switch (mode) {
      case BinToBinTransferTypeEnum.BIN_CODE: {
        pattern = fieldValidation.binCodeField.pattern;
        break;
      }
      case BinToBinTransferTypeEnum.PRODUCT_GROUP: {
        pattern = fieldValidation.cfaProductCodeField.pattern;
        break;
      }
      case BinToBinTransferTypeEnum.PRODUCT_CATEGORY: {
        pattern = fieldValidation.productCategoryField.pattern;
        break;
      }
    }
    return pattern.test(searchValue);
  }

  searchInCart(searchData: ItemSearchResponse) {
    this.itemCode = searchData.searchValue;
    this.lotNumber = searchData.lotNumber;
    this.resetSelection();
    this.loadItemCart();
  }

  private addToItemList(items: BinToBinTransferItem[]) {
    let clearSelection = false;

    if (this.itemCode != null || this.filter.length > 0) {
      clearSelection = true;
    }

    this.binToBinTransferForm.get('selectItems').reset();

    this.clearAll();

    this.binToBinTransferFacade.addToItemList(items);

    if (clearSelection) {
      this.resetSelection();
    }
  }

  private allAssignedWithBins(): boolean {
    return (
      this.selectedItems.filter(
        item =>
          item.destinationBinCode == null ||
          item.binCode === item.destinationBinCode
      ).length === 0
    );
  }

  private isDefectiveDescriptionDetails(): boolean {
    return this.selectedItems.some(
      x =>
        x.destinationBinGroupCode === StockItemBinGroupCodeEnum.DEFECTIVE &&
        (!x.defectCodeDesc || !x.defectTypeDesc)
    );
  }

  private checkSameBinError(): boolean {
    return (
      this.selectedItems.filter(
        item => item.binCode === item.destinationBinCode
      ).length > 0
    );
  }

  private checkAndSetSelectAll() {
    if (
      this.selectedItems.length !== 0 &&
      this.selectedItems.length === this.itemList.length
    ) {
      this.sendSelectAllEvent = false;
      if (this.binToBinTransferForm.get('selectItems').value !== 'selectAll') {
        this.binToBinTransferForm.patchValue({
          selectItems: 'selectCurrentPage'
        });
      }
    } else if (
      this.binToBinTransferForm.get('selectItems').value === 'selectAll'
    ) {
      this.binToBinTransferForm.patchValue({
        selectItems: 'selectAll'
      });
    } else {
      this.binToBinTransferForm.get('selectItems').reset();
    }
  }

  private initialize() {
    const mode = this.binToBinTransferForm.get('type').value;
    switch (mode) {
      case BinToBinTransferTypeEnum.VARIANT_CODE: {
        this.resetSelection();
        if (this.searchListRef) {
          this.searchListRef.focus();
        }
        break;
      }
      case BinToBinTransferTypeEnum.BIN_CODE: {
        this.itemGroups$ = this.sourceBins$;
        this.itemGroupsTotalCount$ = this.sourceBinsTotalCount$;
        break;
      }
      case BinToBinTransferTypeEnum.PRODUCT_GROUP: {
        this.itemGroups$ = this.productGroups$;
        this.itemGroupsTotalCount$ = this.productGroupsTotalCount$;
        break;
      }
      case BinToBinTransferTypeEnum.PRODUCT_CATEGORY: {
        this.itemGroups$ = this.productCategory$;
        this.itemGroupsTotalCount$ = this.productCategoryTotalCount$;
        break;
      }
    }

    if (
      (mode === BinToBinTransferTypeEnum.BIN_CODE &&
        !this.isSourceBinsLoadedOnce) ||
      (mode === BinToBinTransferTypeEnum.PRODUCT_CATEGORY &&
        !this.isProducCategoryLoadedOnce) ||
      (mode === BinToBinTransferTypeEnum.PRODUCT_GROUP &&
        !this.isProductGroupsLoadedOnce)
    ) {
      this.loadList(0);
    }
  }

  loadHistory() {
    this.binToBinTransferFacade.resetLoadedHistory();
    this.isHistoryLoadedOnce = false;
    this.loadList(0);
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
   * Method to handle shortcut commands
   * @param command: shortcut command
   */

  private shortcutEventHandler(command: Command) {
    let isTab = false;
    const tabCount = Number(command.name?.split('_').pop());
    if (
      (command.name === tab1ShortcutKey || command.name === tab2ShortcutKey) &&
      !isNaN(tabCount) &&
      tabCount <= this.tabRef.nativeElement.children.length
    ) {
      switch (this.tabRef.nativeElement.children[tabCount - 1].id) {
        case 'binToBin': {
          this.changeBinToBinTransferType(
            BinToBinTransferTypeEnum.VARIANT_CODE
          );
          isTab = true;
          break;
        }
        case 'history': {
          this.changeBinToBinTransferType(BinToBinTransferTypeEnum.HISTORY);
          isTab = true;
          break;
        }
      }
    }

    if (!isTab) {
      switch (command.name) {
        case searchListShortcutKey: {
          if (this.type === BinToBinTransferTypeEnum.HISTORY) {
            if (this.searchBox) {
              this.searchBox.nativeElement.focus();
            }
          } else {
            if (this.searchListRef) {
              this.searchListRef.focus();
            }
          }
          break;
        }
        case cardListShortcutKey: {
          if (this.cardListComponentRef) {
            this.cardListComponentRef.focus();
          }
          break;
        }
        case dropDownShortcutKey: {
          if (this.typeDropdown && this.typeDropdown.focus) {
            this.typeDropdown.focus();
          }
          break;
        }
        case searchItemShortcutKey: {
          if (
            this.isSelectByVariantCode() &&
            this.allItemList.length !== 0 &&
            this.searchRef
          ) {
            this.searchRef.focus();
          }
          break;
        }

        case filterShortcutKey: {
          if (this.type === BinToBinTransferTypeEnum.HISTORY) {
            this.advancedFilter();
          } else {
            if (this.isSelectByVariantCode() && this.allItemList.length !== 0) {
              this.openFilter();
            }
          }

          break;
        }

        case sortShortcutKey: {
          if (this.isSelectByVariantCode() && this.allItemList.length !== 0) {
            this.openSortDailog();
          }
          break;
        }

        case binSelectionShortcutKey: {
          if (
            this.isSelectByVariantCode() &&
            this.allItemList.length !== 0 &&
            this.selectedItems.length !== 0
          ) {
            this.openBinSelectionPopup();
          }
          break;
        }
        case selectAllShortcutKey: {
          if (this.isSelectByVariantCode() && this.allItemList.length !== 0) {
            this.binToBinTransferForm.patchValue({
              selectItems: 'selectCurrentPage'
            });
          }
          break;
        }

        case clearAllShortcutKey: {
          if (this.isSelectByVariantCode() && this.allItemList.length !== 0) {
            this.resetSelection();
          }
          break;
        }

        case backShortcutKey: {
          this.dialog.closeAll();
          this.back();
          break;
        }
      }
    }
  }

  private showNotification() {
    if (this.confirmTransferResponse) {
      this.showConfirmReceiveSuccessNotification(
        this.confirmTransferResponse.transferId
      );
    } else if (this.hasReachedMaxLimit) {
      this.showMaximumProductsPerRequestLimitNotification();
    } else {
      if (this.selectedItems.length > 0) {
        if (
          this.allAssignedWithBins() &&
          !this.isDefectiveDescriptionDetails()
        ) {
          this.showConfirmTransferNotification(this.selectedItems.length);
        } else if (this.checkSameBinError()) {
          this.showSameDestinationBinErrorNotification();
        } else if (
          this.binToBinTransferForm.get('selectItems').value !== 'selectAll' &&
          this.isDefectiveDescriptionDetails()
        ) {
          this.showAssignDestinationBinNotification(
            this.selectedItems.length,
            'pw.binToBinTransferNotificationMessages.defectiveDescriptionMessage'
          );
        } else {
          this.showAssignDestinationBinNotification(
            this.binToBinTransferForm.get('selectItems').value === 'selectAll'
              ? this.count
              : this.selectedItems.length,
            'pw.binToBinTransferNotificationMessages.assignDestinationBinMessage'
          );
        }
      } else if (this.itemList.length > 0) {
        this.showProductSelectNotification();
      } else {
        this.overlayNotification.close();
        this.hasNotification = false;
      }
    }
  }

  private showConfirmTransferNotification(count: number = 0) {
    const key =
      'pw.binToBinTransferNotificationMessages.confirmTransferMessage';
    const buttonKey1 =
      'pw.binToBinTransferNotificationMessages.confirmTransferButtonText';
    const buttonKey2 =
      'pw.binToBinTransferNotificationMessages.removeButtonText';
    this.translate
      .get([key, buttonKey1, buttonKey2])
      .pipe(take(1))
      .subscribe((translatedMessages: any) => {
        this.hasNotification = true;
        let isUploadedItems = this.isUploadedItemsList();
        const buttons = [
          {
            id: 1,
            text: translatedMessages[buttonKey1],
            css: 'pw-accent-btn'
          }
        ];

        if (!isUploadedItems) {
          buttons.push({
            id: 2,
            text: translatedMessages[buttonKey2],
            css: 'pw-primary-btn'
          });
        }

        this.overlayNotification
          .show({
            type: OverlayNotificationType.MULTI_ACTION,
            message: count + ' ' + translatedMessages[key],
            buttons: buttons
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.selectedId === 1) {
              this.showProgressNotification();

              if (
                isUploadedItems &&
                this.binToBinTransferForm.get('selectItems').value ===
                  'selectAll'
              ) {
                const bulkTransferPayload: BinToBinFileUploadItemsBulkTransferRequest = {
                  fileId: this.allItemList.find(x => x.fileId).fileId,
                  destinationBincode: this.selectedBin.binCode,
                  destinationBinGroup: this.selectedBin.binGroupCode
                };
                this.binToBinTransferFacade.confirmFileUploadItemsBulkTransfer(
                  bulkTransferPayload
                );
              } else {
                const confirmTransferRequest: BinToBinTransferConfirmTransferItemsRequest = {
                  request: {
                    binItems: this.selectedItems.map(
                      (item: BinToBinTransferItem) => ({
                        inventoryId: item.id,
                        binGroupCode: item.destinationBinGroupCode,
                        binCode: item.destinationBinCode,
                        quantity: item.transferQuantity,
                        defectCodeDesc: item.defectCodeDesc,
                        defectTypeDesc: item.defectTypeDesc
                      })
                    )
                  },
                  remove: true,
                  fileId: this.selectedItems?.find(x => x.fileId)?.fileId
                };
                this.binToBinTransferFacade.confirmTransferItems(
                  confirmTransferRequest
                );
              }
            } else if (event.selectedId === 2) {
              this.deleteSelectedItems();
            }
          });
      });
  }

  private showSameDestinationBinErrorNotification() {
    const key = 'pw.errorMessages.ERR-BTB-SAME-BIN';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.hasNotification = false;
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
          .subscribe(() => {
            this.hasNotification = false;
            this.binToBinTransferFacade.clearConfirmTransferResponse();
            let isUploadedItems = this.isUploadedItemsList();
            if (this.allItemList.length > 0 && isUploadedItems) {
              this.pageEvent = {
                pageIndex: 0,
                pageSize: 10,
                length: 0
              };
              this.paginate(this.pageEvent);
            }
          });
      });
  }

  private showMaximumProductsPerRequestLimitNotification() {
    const key =
      'pw.binToBinTransferNotificationMessages.maximumProductsLimitMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMessage.replace(
              '{0}',
              '' + this.maxProductInList
            )
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.hasNotification = false;
            this.hasReachedMaxLimit = false;
            this.showNotification();
          });
      });
  }

  private showProductSelectNotification() {
    const key = 'pw.binToBinTransferNotificationMessages.productSelectMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.hasNotification = false;
          });
      });
  }

  private showAssignDestinationBinNotification(
    count: number | string,
    key: string
  ) {
    let buttonKey = '';
    let isUploadeditems = this.isUploadedItemsList();
    if (isUploadeditems) {
      buttonKey = 'pw.binToBinTransferNotificationMessages.closeButtonText';
    } else {
      buttonKey = 'pw.binToBinTransferNotificationMessages.removeButtonText';
    }
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
            let isUploadeditems = this.isUploadedItemsList();
            if (
              event.eventType === OverlayNotificationEventType.TRUE &&
              !isUploadeditems
            ) {
              this.deleteSelectedItems();
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
          .subscribe(() => {
            this.hasNotification = false;
          });
      });
  }

  errorHandler(error: CustomErrors) {
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
  /**
   * Switch Between different types of transfer list
   * @param newType : new Bin To Bin Transfer Type
   */
  changeBinToBinTransferType(newType: BinToBinTransferTypeEnum): void {
    if (newType !== this.type) {
      this.type = newType;

      if (this.type !== BinToBinTransferTypeEnum.HISTORY) {
        this.initialize();
      } else {
        this.loadHistory();
      }
      this.router.navigate([getBintoBinTransferRouteUrl(newType)]);
    }
  }
  advancedFilter() {
    const emitData = {
      formData: this.historyFormData ? this.historyFormData : {},
      currentFiscalYear: this.currentFiscalYear,
      bussinessDay: moment(this.bussinessDay)
    };
    this.overlayNotification.close();
    const dialogRef = this.dialog.open(HistoryAdvancedSearchPopupComponent, {
      width: '30vw',
      data: emitData,
      disableClose: true
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.binToBinTransferFacade.loadHistoryFilterData(res);
          this.historyFormData = res;
          this.loadHistory();
        }
      });
  }

  // Image
  loadImage(
    itemList: BinToBinTransferItem[],
    imageCatalogueDetails,
    isSearchedItem: boolean
  ) {
    this.isLoadImageUrl = false;
    this.isLoadSearchImageUrl = false;
    itemList.forEach(item => {
      this.binToBinTransferFacade.loadThumbnailImageUrl({
        id: item.id,
        imageUrl: item.imageURL,
        imageCatalogueDetails: imageCatalogueDetails,
        isSearchedItem: isSearchedItem
      });
    });
  }

  loadImageUrl(event, isSearchedItem: boolean) {
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
          imageCatalogueDetails: imageCatalogueDetails,
          isSearchedItem: isSearchedItem
        });
      });
  }

  downLoadFormatFn() {
    this.fileDownloadService.download(
      FileNamesEnum.BINTOBINTRANSFER,
      FilePathEnum.BINTOBINTRANSFER
    );
  }

  uploadConfigDetails(event) {
    const data = { event: event, fileInput: this.fileInput };
    this.overlayNotification.close();
    const fileList: FileList = data.event.target.files;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: any = fileList[0];
      if (file.size > this.fileSize) {
        const errorKey = 'pw.fileUpload.maximumFileSizeErrorMessage3';
        this.failureNotification(errorKey);
      }
      const extn = file.name.split('.').pop();

      if (extn !== csvExtn) {
        const errorKey = 'pw.fileUpload.CSVFileTypeErrorMessage';
        this.failureNotification(errorKey);
      }

      const type = file.name.substring(0, 3);

      formData.append(reqfileKey, file);
      if (extn === csvExtn && file.size < this.fileSize) {
        if (type) {
          formData.set(reqfileKey, file, file.name);
          this.binToBinTransferFacade.loadFileUploadItems(formData);
          data.fileInput.nativeElement.value = '';
        }
      }
    }
  }

  isUploadedItemsList(): boolean {
    return (
      this.allItemList.length > 0 &&
      this.allItemList.some(x => x.fileId !== undefined)
    );
  }

  private failureNotification(
    key: string,
    field1?: string,
    field2?: string,
    isProducttSelectNotification?: boolean
  ) {
    this.translate
      .get(key, {
        fieldName1: field1,
        fieldName2: field2
      })
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.hasNotification = false;
            if (isProducttSelectNotification) {
              this.showProductSelectNotification();
            }
          });
      });
  }

  private showInfoNotification(isProducttSelectNotification?: boolean) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: '',
        hasClose: true,
        hasBackdrop: true,
        template: this.stockInformationNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.hasNotification = false;
        if (this.allItemList.length > 0) {
          this.showProductSelectNotification();
        }
      });
  }

  paginate(event: PageEvent) {
    this.pageEvent = event;
    let payload: BinToBinTransferLoadFileUploadItemsRequest = {
      fileId: this.allItemList.find(x => x.fileId).fileId,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    };
    this.binToBinTransferFacade.loadFileUploadItemsList(payload);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
