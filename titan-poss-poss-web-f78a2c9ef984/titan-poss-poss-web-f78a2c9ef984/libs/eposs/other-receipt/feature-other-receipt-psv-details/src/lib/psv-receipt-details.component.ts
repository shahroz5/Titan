import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable, combineLatest } from 'rxjs';
import {
  ItemSummary,
  AdjustmentItem,
  ConfirmAdjustementItem,
  OtherReceiptsIssuesEnum,
  Filter,
  Column,
  BinCode,
  CustomErrors,
  ProductCategory,
  ProductGroup,
  OtherReceiptStockItemBinGroupCodeEnum,
  OtherReceiptUpdateAdjustementItemPayload,
  OtherReceiptFilterOption,
  OverlayNotificationServiceAbstraction,
  sortFilterData,
  Command,
  ShortcutServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  PrintingServiceAbstraction,
  printTransactionTypesEnum,
  printDocTypeEnum
} from '@poss-web/shared/models';
import {
  ItemSearchListComponent,
  ItemSearchComponent,
  ItemSearchResponse
} from '@poss-web/shared/item/ui-item-search';
import { OtherReceiptsFacade } from '@poss-web/eposs/other-receipt/data-access-other-receipt';
import { SortDialogService } from '@poss-web/shared/components/ui-sort-dialog';
import {
  FilterService,
  FilterActions
} from '@poss-web/shared/components/ui-filter-dialog';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {
  getOtherIssuesReceiptUrl,
  getOtherReceiptsDefaultUrl
} from '@poss-web/shared/util-site-routes';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { ErrorEnums } from '@poss-web/shared/util-error';

const filterShortCutKey = 'PsvReceiptDetailsComponent.FILTER';
const sortShortCutKey = 'PsvReceiptDetailsComponent.SORT';
const backShortCutKey = 'PsvReceiptDetailsComponent.BACK';
const mainSearchShortCutKey = 'PsvReceiptDetailsComponent.MAIN_SEARCH';
const secondarySearchShortCutKey =
  'PsvReceiptDetailsComponent.SECONDARY_SEARCH';
const clearAllShortCutKey = 'PsvReceiptDetailsComponent.CLEAR_ALL';
const selectAllShortCutKey = 'PsvReceiptDetailsComponent.SELECT_ALL';
const componentName = 'PsvReceiptDetailsComponent';
@Component({
  selector: 'poss-web-psv-receipt-details',
  templateUrl: './psv-receipt-details.component.html',
  styleUrls: ['./psv-receipt-details.component.scss']
})
export class PsvReceiptDetailsComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  hasNotification = false;
  psvSearchedItems$: Observable<ItemSummary>;
  itemsInCart$: Observable<AdjustmentItem[]>;
  psvSearchedItemsCount$: Observable<number>;
  confirmAdjustementItemsResponse$: Observable<AdjustmentItem>;
  cartItemsCount = 0;
  itemIds = [];
  @ViewChild(ItemSearchListComponent, { static: true })
  searchListRef: ItemSearchListComponent;
  selectForm = this.fb.group({
    selectRadioButton: ['']
  });
  selectionAllSubscription: any;
  selectionAllSubject = new Subject();
  selectionAllObaservable = this.selectionAllSubject.asObservable();
  confirmItems: ConfirmAdjustementItem[] = [];
  selectAll = false;
  destDocNumber = null;
  totalItemCount: number;
  allItemIds: any[];
  searchForm: FormGroup;
  @ViewChild('searchBox') searchBox: ElementRef;
  searchedPSVItemsInCartResults: AdjustmentItem[];
  otherIssuesTabEnumRef = OtherReceiptsIssuesEnum;
  isSearchingPSVItem$: Observable<boolean>;
  hasSearchedPSVItem$: Observable<boolean>;
  isloadingPSV$: Observable<boolean>;
  hasSearchItemInCartSearchPSV$: Observable<boolean>;
  isItemsInCart: boolean;
  hideSearchResults = false;
  allItemsInCart: AdjustmentItem[];
  productCategory: { [key: string]: Filter[] };
  productGroup: { [key: string]: Filter[] };
  maxProductInList: any;
  maxSortLimit: any;
  maxFilterLimit: any;
  filterData: { [key: string]: Filter[] };
  filter: { key: string; value: any[] }[] = [];
  sortData: Column[] = [];
  sortOrder: any;
  sortBy: any;
  itemList: AdjustmentItem[];
  itemCode: string;
  lotNumber: string;
  @ViewChild(ItemSearchComponent, { static: true })
  searchRef: ItemSearchComponent;
  storeType: string;
  isL1L2Store: boolean;
  isL3Store: boolean;
  noDataFoundMessage: '';
  binGroupCode: string;
  transactionNumber: string;
  binCodes: BinCode[] = [];
  itemData: AdjustmentItem[] = [];
  requiredError = true;
  printdata$: Observable<any>;
  PrintErrorText: string;
  itemcount = 0;
  isLoadImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  constructor(
    private router: Router,
    private otherReceiptsFacade: OtherReceiptsFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private fb: FormBuilder,
    public printingService: PrintingServiceAbstraction,
    private translate: TranslateService,
    private sortService: SortDialogService,
    private filterService: FilterService,
    private appsettingFacade: AppsettingFacade,
    private shortcutService: ShortcutServiceAbstraction,
    private profiledatafacade: ProfileDataFacade,
    private dialog: MatDialog,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    this.searchForm = new FormGroup({
      searchValue: new FormControl('')
    });
    this.translate
      .get(['pw.entity.otherReceiptEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.otherReceiptEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
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
    this.otherReceiptsFacade.loadStuddedProductGroups();
    combineLatest([
      this.profiledatafacade.getBoutiqueType().pipe(takeUntil(this.destroy$)),
      this.profiledatafacade.isL1Boutique().pipe(takeUntil(this.destroy$)),
      this.profiledatafacade.isL2Boutique().pipe(takeUntil(this.destroy$)),
      this.profiledatafacade.isL3Boutique().pipe(takeUntil(this.destroy$))
    ]).subscribe(([val, val1, val2, val3]) => {
      this.storeType = val;
      this.isL1L2Store = val1 || val2;
      this.isL3Store = val3;
      this.binGroupCode = this.isL1L2Store
        ? OtherReceiptStockItemBinGroupCodeEnum.STN
        : OtherReceiptStockItemBinGroupCodeEnum.PURCFA;
      this.componentInit();
    });
  }

  componentInit() {
    this.resetData();
    this.otherReceiptsFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.searchedPSVItemsInCartResults = [];
    this.isSearchingPSVItem$ = this.otherReceiptsFacade.getIsSearchingPSV();
    this.hasSearchedPSVItem$ = this.otherReceiptsFacade.gethasSearchedItemPSV();
    this.isloadingPSV$ = this.otherReceiptsFacade.getIsLoadingPSV();
    this.hasSearchItemInCartSearchPSV$ = this.otherReceiptsFacade.getHasSearchItemInCartSearchPSV();
    this.hasNotification = true;
    this.psvSearchedItems$ = this.otherReceiptsFacade.getPSVSearchedItems();
    this.psvSearchedItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(searchedItems => {
        if (searchedItems) {
          this.isItemsInCart = true;
          this.addToCart(searchedItems);
        }
      });
    this.itemsInCart$ = this.otherReceiptsFacade.getItemsInCartPSV();
    this.itemsInCart$
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
    this.printdata$ = this.otherReceiptsFacade.getPrintDataResponse();
    this.printdata$
      .pipe(
        filter(data => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        const printData = [
          {
            type: 'pixel',
            format: 'html',
            flavor: 'plain',
            data: data
          }
        ];
      });
    this.otherReceiptsFacade
      .getConfirmPSVItemsResponse()
      .subscribe((confirmPSVItemsResponse: AdjustmentItem) => {
        if (confirmPSVItemsResponse) {
          this.destDocNumber = confirmPSVItemsResponse.destDocNo;
          this.transactionNumber = confirmPSVItemsResponse.id;
          this.showSuccessMessageNotification();
          // this.showConfirmPSVItemsSuccessNotification();
        }
      });
    this.otherReceiptsFacade
      .getPSVItemsSearchCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.otherReceiptsFacade
      .getItemsInCartPSV()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.itemcount = 0;
        this.allItemsInCart = items;
        this.allItemIds = [];
        this.confirmItems = [];
        this.totalItemCount = items.length;
        items.forEach(item => {
          this.confirmItems.push({
            binCode: item.binCode,
            binGroupCode: item.binGroupCode,
            itemCode: item.itemCode,
            measuredWeight: item.measuredWeight,
            value: item.stdValue,
            quantity: item.measuredQuantity,
            isHallmarked: item.isHallmarked
          });
          this.allItemIds.push(item.itemCode);
        });
        this.confirmItems.forEach(item => {
          if (
            item.binGroupCode === null ||
            item.itemCode === null ||
            item.measuredWeight === null ||
            item.value === null ||
            item.binCode === null ||
            item.quantity === null ||
            item.quantity === 0
          ) {
            this.itemcount++;
            this.requiredError = true;
          }
        });
        if (this.itemcount === 0) {
          this.requiredError = false;
        }
        this.loadItemCart();
        this.showNotifications();
      });
    this.getFilterAndSortData();
    this.getAppSettingsData();
    this.otherReceiptsFacade.loadBinCodes(this.binGroupCode);
    this.otherReceiptsFacade
      .getBinCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((bincodes: BinCode[]) => {
        this.binCodes = bincodes;
      });
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => this.shortcutEventHandler(command));
  }

  getAppSettingsData() {
    this.appsettingFacade
      .getMaxFilterLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxFilterLimit = data;
      });

    this.appsettingFacade
      .getMaxSortLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxSortLimit = data;
      });

    this.appsettingFacade
      .getMaxProductInList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxProductInList = data;
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
  getFilterAndSortData() {
    this.otherReceiptsFacade.loadProductCategories();
    this.otherReceiptsFacade.loadProductGroups();
    this.otherReceiptsFacade
      .getProductCategories()
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

    this.otherReceiptsFacade
      .getProductGroups()
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
  }
  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case mainSearchShortCutKey: {
        if (this.searchListRef) {
          this.dialog.closeAll();
          this.searchListRef.focus();
        }
        break;
      }
      case secondarySearchShortCutKey: {
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
      case selectAllShortCutKey: {
        this.dialog.closeAll();
        this.selectForm.patchValue({
          selectRadioButton: '1'
        });
        this.selectAllItems();
        break;
      }
    }
  }

  onSearch(searchResponse: ItemSearchResponse) {
    if (this.allItemsInCart.length < this.maxProductInList) {
      this.otherReceiptsFacade.psvItemSearch({
        variantCode: searchResponse.searchValue,
        lotNumber: searchResponse.lotNumber
      });
    }
  }
  addToCart(item: ItemSummary) {
    this.clearInventorySearch();
    if (this.allItemsInCart.length + 1 < this.maxProductInList) {
      this.itemData.push({
        binCode: null,
        binGroupCode: null,
        itemCode: item.itemCode,
        id: item?.id,
        measuredQuantity: null,
        measuredWeight: null,
        productCategory: item.productCategoryDesc,
        productCategoryId: item.productCategoryCode,
        productGroup: item.productGroupDesc,
        productGroupId: item.productGroupCode,
        stdValue: item.stdValue,
        destDocNo: null,
        imageURL: item?.imageURL,
        thumbnailImageURL: item?.thumbnailImageURL,
        isStudded: item.isStudded,
        taxDetails: item?.taxDetails ? item.taxDetails : null,
        isLoadingImage: false,
        isLoadingThumbnailImage: false,
        isHallmarked: item.isHallmarked
      });
      this.searchListRef.reset();
      this.isLoadImageUrl = true;
      this.otherReceiptsFacade.addItemsToCartPSV(this.itemData);
      this.itemData = [];
    }
    this.showNotifications();
  }
  selectChange() {
    if (this.selectForm.value.selectRadioButton === '1') {
      this.selectAllItems();
    }

    this.selectionAllSubject.next({
      selectCheckbox: true,
      enableCheckbox: true
    });
    this.selectAll = true;
    this.showNotifications();
  }
  selectAllItems() {
    this.itemIds = [];
    this.selectionAllSubject.next({
      selectCheckbox: true,
      enableCheckbox: false
    });
    this.showNotifications();
  }
  selectionEmit(selection: { selected: boolean; id: string }) {
    this.selectForm.patchValue({
      selectRadioButton: null
    });
    if (selection.selected === false) {
      this.selectForm.patchValue({
        selectRadioButton: null
      });
      const itemToRemove = selection.id;
      this.itemIds.splice(this.itemIds.indexOf(itemToRemove), 1);
    } else if (selection.selected === true) {
      this.itemIds.push(selection.id);
      if (this.itemIds.length === this.allItemIds.length) {
        this.selectForm.patchValue({
          selectRadioButton: '1'
        });
      }
    }
    this.selectAll = false;
    this.overlayNotification.close();
    this.showNotifications();
  }
  showNotifications() {
    if (
      this.totalItemCount > 0 &&
      this.selectForm.value.selectRadioButton !== '1' &&
      this.filter.length === 0 &&
      !this.itemCode
    ) {
      if (this.requiredError) {
        this.showInfoNotifications(
          'pw.otherReceiptsIssues.RequiredFieldsNotificationMessage'
        );
      } else {
        this.showConfirmNotification(
          'pw.otherReceiptsIssues.confirmReceiptsNotificationMessage'
        );
      }
    } else if (
      this.totalItemCount === 50 &&
      this.selectForm.value.selectRadioButton !== '1'
    ) {
      this.showConfirmNotification(
        'pw.otherReceiptsIssues.confirmReceiptsNotificationCartFullMessage'
      );
    }

    if (this.selectForm.value.selectRadioButton === '1') {
      this.RemoveProductsOverlay(
        this.allItemIds.length,
        'pw.otherReceiptsIssues.removeProductNotifictionMessage'
      );
    }
    if (this.itemIds.length > 0) {
      this.RemoveProductsOverlay(
        this.itemIds.length,
        'pw.otherReceiptsIssues.removeProductNotifictionMessage'
      );
    }
    if (this.totalItemCount === 0) {
      this.overlayNotification.close();
    }
  }
  showConfirmPSVItemsSuccessNotification() {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasBackdrop: true,
        hasClose: true,
        message: 'Document Number is' + ' ' + this.destDocNumber
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.router.navigate([getOtherReceiptsDefaultUrl()]);
        }
      });
  }
  RemoveProductsOverlay(count: number, key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: 'Remove',
            message: translatedMessage.replace('{0}', count.toString())
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.otherReceiptsFacade.removeMultiplePSVItems(
                this.selectForm.value.selectRadioButton === '1'
                  ? this.allItemIds
                  : this.itemIds
              );
              this.selectAll = false;
              this.itemIds = [];
              this.overlayNotification.close();
              this.showNotifications();
              this.selectForm.patchValue({
                selectRadioButton: null
              });
              this.clearSearchItems();
            }
          });
      });
  }
  showConfirmNotification(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message:
              this.totalItemCount === 50
                ? translatedMessage.replace(
                    '{0}',
                    this.totalItemCount.toString()
                  )
                : translatedMessage,
            buttonText: 'CONFIRM',
            hasRemarks: true,
            isRemarksMandatory: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.otherReceiptsFacade.confirmPSVItems({
                items: this.confirmItems,
                remarks: event.data,
                type: OtherReceiptsIssuesEnum.PSV
              });
            }
          });
      });
  }
  clearAll() {
    this.itemIds = [];
    this.selectForm.patchValue({
      selectRadioButton: null
    });
    this.selectionAllSubject.next({
      selectCheckbox: false,
      enableCheckbox: true
    });
    this.overlayNotification.close();
    this.showNotifications();
  }

  back() {
    this.router.navigate([getOtherReceiptsDefaultUrl()]);
  }
  updateItems(updateAdjustementItem: OtherReceiptUpdateAdjustementItemPayload) {
    this.otherReceiptsFacade.updatePSVItem({
      itemId: updateAdjustementItem.itemId,
      items: updateAdjustementItem.items
    });
  }
  removeItem(item: AdjustmentItem) {
    this.otherReceiptsFacade.removePSVItem(item);
    this.selectAll = false;
  }
  clearSearchItems() {
    this.itemCode = null;
    this.lotNumber = null;
    this.loadItemCart();
    this.overlayNotification.close();
    this.showNotifications();
  }
  resetData() {
    this.otherReceiptsFacade.resetPSVReceiptData();
  }
  clearInventorySearch() {
    this.itemCode = null;
    this.lotNumber = null;
    this.sortBy = null;
    this.sortOrder = null;
    this.sortData = [];
    this.filter = [];
    this.filterData = {};
    if (this.searchListRef) {
      this.searchListRef.reset();
    }
    if (this.searchRef) {
      this.searchRef.reset();
    }
    this.loadItemCart();
    this.otherReceiptsFacade.clearSearchInventoryItemPSV();
  }
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          if (event.eventType === OverlayNotificationEventType.CLOSE) {
            this.showNotifications();
          }
        });
    }
  }
  openFilter() {
    this.filterService.DataSource = {
      ...this.productCategory,
      ...this.productGroup
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
          if (filterResult.actionfrom === FilterActions.APPLY) {
            const filterData = filterResult.data;
            if (filterData == null) {
              this.filterData = {};
            } else {
              this.filterData = filterData;
            }
            this.filter = [];
            if (filterData) {
              let filterValues = [];
              if (filterData['Product Group']) {
                filterData['Product Group'].forEach(value => {
                  filterValues.push(value.description.toLowerCase());
                });
                if (filterValues.length > 0) {
                  this.filter.push({
                    key: 'productGroup',
                    value: filterValues
                  });
                }
              }
              filterValues = [];
              if (filterData['Product Category']) {
                filterData['Product Category'].forEach(value => {
                  filterValues.push(value.description.toLowerCase());
                });
                if (filterValues.length > 0) {
                  this.filter.push({
                    key: 'productCategory',
                    value: filterValues
                  });
                }
              }
            }

            this.loadItemCart();
          }
        }
      );
  }
  openSort() {
    this.dialog.closeAll();
    this.sortService.DataSource = sortFilterData;
    this.sortService
      .openDialog(this.maxSortLimit, this.sortData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        if (sortResult.actionfrom === FilterActions.APPLY) {
          const sortData = sortResult.data;
          if (sortData == null || sortData.length === 0) {
            this.sortData = [];
            this.sortOrder = null;
            this.sortBy = null;
          } else {
            this.sortData = sortData;
            if (sortData.length > 0) {
              if (sortData[0].id === 0) {
                this.sortBy = 'measuredWeight';
              } else if (sortData[0].id === 1) {
                this.sortBy = 'measuredQuantity';
              }
              this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
            }
          }
          this.loadItemCart();
        }
      });
  }
  loadItemCart() {
    this.itemList = this.allItemsInCart;
    if (this.itemCode) {
      this.itemList = this.itemList.filter(
        (item: AdjustmentItem) =>
          item.itemCode.toLowerCase() === this.itemCode.toLowerCase()
      );
    }
    if (this.filter.length > 0) {
      for (let i = 0; i < this.filter.length; i++) {
        this.itemList = this.itemList.filter((item: AdjustmentItem) => {
          return this.filter[i].value.includes(
            typeof item[this.filter[i].key] === 'string'
              ? item[this.filter[i].key].toLowerCase()
              : item[this.filter[i].key]
          );
        });
      }
    }
    if (this.sortBy) {
      const issueItemsSort = [...this.itemList].sort(
        (item1: AdjustmentItem, item2: AdjustmentItem) => {
          if (item1[this.sortBy] === item2[this.sortBy]) {
            return 0;
          }
          return item1[this.sortBy] < item2[this.sortBy]
            ? this.sortOrder === 'ASC'
              ? -1
              : 1
            : this.sortOrder === 'ASC'
            ? 1
            : -1;
        }
      );
      this.itemList = issueItemsSort;
    }

    this.clearAll();
    this.overlayNotification.close();
    this.showNotifications();
  }
  searchInCart(searchData: ItemSearchResponse) {
    this.itemCode = searchData.searchValue;
    this.lotNumber = searchData.lotNumber;
    this.loadItemCart();
  }
  mapToFilterOptions(
    key: string,
    options: OtherReceiptFilterOption[]
  ): { [key: string]: Filter[] } {
    return {
      [key]: options.map((option, index) => ({
        id: option.id,
        description: option.description,
        selected: false
      }))
    };
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
        this.showSuccessMessageNotification();
      });
  }
  print() {
    this.printingService.loadPrintData({
      printType: OtherReceiptsIssuesEnum.PSV,
      transacionId: this.transactionNumber,
      transacionType: printTransactionTypesEnum.OTHER_RECEIVE,
      doctype: printDocTypeEnum.STOCK_PRINT
    });
  }
  showSuccessMessageNotification() {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: '',
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.successCancelCloseOperation(event);
      });
  }
  successCancelCloseOperation(event: OverlayNotificationEventRef) {
    if (event.eventType === OverlayNotificationEventType.CLOSE) {
      this.router.navigateByUrl(
        getOtherIssuesReceiptUrl(
          OtherReceiptsIssuesEnum.OTHER_RECEIPTS,
          OtherReceiptsIssuesEnum.EXHIBITION
        )
      );
    }
  }

  showInfoNotifications(key: any) {
    this.hasNotification = true;
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          message: translatedMsg,
          hasClose: false
        });
      });
  }
  // Image
  loadImage(itemList: AdjustmentItem[], imageCatalogueDetails) {
    this.isLoadImageUrl = false;
    itemList.forEach(item => {
      this.otherReceiptsFacade.loadThumbnailImageUrl({
        id: item.itemCode,
        imageUrl: item.imageURL,
        itemCode: item.itemCode,
        imageCatalogueDetails: imageCatalogueDetails,
        isPSVItems: true
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
        this.otherReceiptsFacade.loadImageUrl({
          id: event.id,
          imageUrl: event.imageUrl,
          itemCode: event.itemCode,
          imageCatalogueDetails: imageCatalogueDetails,
          isPSVItems: true
        });
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.printingService.resetPrint();
    this.overlayNotification.close();
  }
}
