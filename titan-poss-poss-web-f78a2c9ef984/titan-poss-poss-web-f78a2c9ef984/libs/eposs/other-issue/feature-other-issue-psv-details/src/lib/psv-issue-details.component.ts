import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {
  OtherReceiptsIssuesEnum,
  OtherIssuesItem,
  Filter,
  Column,
  CustomErrors,
  ProductCategory,
  ProductGroup,
  PSVItemToUpdate,
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
import {
  ItemSearchListComponent,
  ItemSearchComponent,
  ItemSearchResponse
} from '@poss-web/shared/item/ui-item-search';
import { OtherIssuesFacade } from '@poss-web/eposs/other-issue/data-access-other-issue';
import { SortDialogService } from '@poss-web/shared/components/ui-sort-dialog';
import {
  FilterService,
  FilterActions
} from '@poss-web/shared/components/ui-filter-dialog';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { MatDialog } from '@angular/material/dialog';
import { getOtherIssuesDefaultUrl } from '@poss-web/shared/util-site-routes';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

const filterShortCutKey = 'PsvIssueDetailsComponent.FILTER';
const sortShortCutKey = 'PsvIssueDetailsComponent.SORT';
const backShortCutKey = 'PsvIssueDetailsComponent.BACK';
const mainSearchShortCutKey = 'PsvIssueDetailsComponent.MAIN_SEARCH';
const secondarySearchShortCutKey = 'PsvIssueDetailsComponent.SECONADARY_SEARCH';
const clearAllShortCutKey = 'PsvIssueDetailsComponent.CLEAR_ALL';
const selectAllShortCutKey = 'PsvIssueDetailsComponent.SELECT_ALL';
const componentName = 'PsvIssueDetailsComponent';
@Component({
  selector: 'poss-web-psv-issue-details',
  templateUrl: './psv-issue-details.component.html',
  styleUrls: ['./psv-issue-details.component.scss']
})
export class PsvIssueDetailsComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  otherIssuesTabEnumRef = OtherReceiptsIssuesEnum;
  onSearchFlag: boolean;
  cartCount = 0;
  searchCount: any;
  noDataFoundMessage = '';
  searchedPSVItems$: Observable<OtherIssuesItem[]>;
  selectionAllSubject = new Subject();
  selectionAllObaservable = this.selectionAllSubject.asObservable();
  searchResult: OtherIssuesItem[] = [];
  items: OtherIssuesItem[] = [];
  itemsInCart$: Observable<OtherIssuesItem[]>;
  @ViewChild(ItemSearchListComponent, { static: true })
  searchListRef: ItemSearchListComponent;
  totalItemCount: number;
  hasNotification = false;
  itemsToConfirm = [];
  @ViewChild('searchBox') searchBox: ElementRef;
  searchForm: FormGroup;
  selectForm: FormGroup;
  itemIds = [];
  allItemIds = [];
  createStockRequestPSVResponse$: Observable<OtherIssueModel>;
  searchedPSVItemsInCart$: Observable<OtherIssuesItem[]>;
  searchedPSVItemsInCartResults: OtherIssuesItem[];
  PSVForm: FormGroup;
  isSearchingPSVItem$: Observable<boolean>;
  hasSearchedPSVItem$: Observable<boolean>;
  isloadingPSV$: Observable<boolean>;
  hasSearchItemInCartSearchPSV$: Observable<boolean>;
  isItemsInCart = false;
  hideSearchResults = false;
  allItemsInCart: OtherIssuesItem[];
  itemCode: string;
  lotNumber: string;
  sortBy: any;
  sortOrder: string;
  itemList: OtherIssuesItem[];
  sortData: Column[] = [];
  productCategory: { [key: string]: Filter[] };
  productGroup: { [key: string]: Filter[] };
  maxFilterLimit: number;
  filterData: { [key: string]: Filter[] };
  filter: { key: string; value: any[] }[] = [];
  maxSortLimit: number;
  maxProductInList: any;
  @ViewChild(ItemSearchComponent, { static: true })
  searchRef: ItemSearchComponent;
  dateFormat: string;
  plainProductGroups: ProductGroup[] = [
    {
      description: 'Gold Studded',
      productGroupCode: '72'
    }
  ];
  constructor(
    private otherIssueFacade: OtherIssuesFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private sortService: SortDialogService,
    private filterService: FilterService,
    private appsettingFacade: AppsettingFacade,
    private shortcutService: ShortcutServiceAbstraction,
    private dialog: MatDialog,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.searchForm = new FormGroup({
      searchValue: new FormControl('')
    });
    this.selectForm = this.fb.group({
      selectRadioButton: ['']
    });
    this.PSVForm = this.fb.group({
      approvedBy: [
        '',
        // Validators.compose([
        //   Validators.required,
        //   Validators.pattern('^[a-zA-Z_ ]*$')
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
    this.otherIssueFacade.loadStuddedProductGroups();
    this.resetData();
    this.componentInit();
  }
  componentInit() {
    this.searchedPSVItemsInCartResults = [];
    this.isSearchingPSVItem$ = this.otherIssueFacade.getIsSearchingPSV();
    this.hasSearchedPSVItem$ = this.otherIssueFacade.gethasSearchedItemPSV();
    this.isloadingPSV$ = this.otherIssueFacade.getIsLoadingPSV();
    this.hasSearchItemInCartSearchPSV$ = this.otherIssueFacade.getHasSearchItemInCartSearchPSV();
    this.otherIssueFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.searchedPSVItems$ = this.otherIssueFacade.getSearchedPSVItems();
    this.searchedPSVItems$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.isItemsInCart = false;
      this.searchResult = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].totalQuantity !== 0) {
          this.searchResult.push(items[i]);
        }
      }
      if (this.searchResult.length === 1) {
        this.isItemsInCart = true;
        this.addToCart(this.searchResult);
      }
    });

    this.itemsInCart$ = this.otherIssueFacade.getPSVItemsInCarts();
    this.itemsInCart$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      if (items) {
        this.allItemsInCart = items;
        this.allItemIds = [];
        this.itemsToConfirm = [];
        this.totalItemCount = items.length;
        items.forEach(element => {
          this.itemsToConfirm.push({
            itemCode: element.itemCode,
            inventoryId: element.id,
            lotNumber: element.lotNumber,
            quantity: element.measuredQuantity,
            measuredWeight: Number(
              element.measuredWeight * element.measuredQuantity
            ).toFixed(3),
            itemDetails: {
              data: {},
              type: ''
            }
          });
          this.allItemIds.push(element.id);
        });
        this.loadItemCart();
        this.showNotification();
      }
    });
    this.createStockRequestPSVResponse$ = this.otherIssueFacade.getCreateStockRequestPSVResponse();
    this.createStockRequestPSVResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.reqDocNo) {
          const key = 'pw.otherReceiptsIssues.OtherIssueConfirmSuccessMessage';
          this.translate
            .get(key)
            .pipe(takeUntil(this.destroy$))
            .subscribe((translatedMessage: string) => {
              this.showSuccessMessageNotification(
                translatedMessage.replace('{0}', data.reqDocNo.toString())
              );
            });
        }
      });

    this.PSVForm.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.showNotification();
    });
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
    this.appsettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((format: string) => {
        this.dateFormat = format;
      });
    this.otherIssueFacade.loadProductCategories();
    this.otherIssueFacade.loadProductGroups('S');
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
          // this.plainProductGroups = productGroups;
          this.productGroup = this.mapToFilterOptions(
            'Product Group',
            productGroups.map(productGroup => ({
              id: productGroup.productGroupCode,
              description: productGroup.description
            }))
          );
        }
      });
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => this.shortcutEventHandler(command));
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
        this.selectAll();
        break;
      }
    }
  }

  /**
   * Searhes the items by Variant Code
   */
  onSearch(searchResponse: ItemSearchResponse) {
    this.onSearchFlag = true;
    if (this.allItemsInCart.length < this.maxProductInList) {
      this.otherIssueFacade.searchPSVItems({
        variantCode: searchResponse.searchValue,
        lotNumber: searchResponse.lotNumber,
        productGroups: this.plainProductGroups,
        binType:'PSV',
      });
    }
  }
  addToCart(items: OtherIssuesItem[]) {
    this.clearInventorySearch();
    if (
      this.allItemsInCart.length + items.length < this.maxProductInList &&
      this.onSearchFlag === true
    ) {
      this.searchListRef.reset();
      this.otherIssueFacade.addPSVItemsToCart(items);
    }
  }
  showConfirmIssueNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
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
            buttonText: 'GET APPROVAL',
            hasRemarks: true,
            isRemarksMandatory: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              if (this.PSVForm.invalid) {
                this.hasNotification = true;
                this.showConfirmIssueNotifications(
                  'pw.otherReceiptsIssues.approvalDetailsNotificationMessage'
                );
              } else {
                this.hasNotification = true;
                this.otherIssueFacade.createStockRequestPSV({
                  reqType: OtherReceiptsIssuesEnum.PSV,
                  approvalDetails: {
                    data: {
                      approvalCode: this.PSVForm.value.approvalCode,
                      approvedBy: this.PSVForm.value.approvedBy
                    },
                    type: 'approval'
                  },
                  items: this.itemsToConfirm,
                  remarks: event.data
                });
              }
            }
          });
      });
  }
  showNotification() {
    if (
      this.totalItemCount > 0 &&
      this.selectForm.value.selectRadioButton !== '1' &&
      this.filter.length === 0 &&
      !this.itemCode
    ) {
      if (this.PSVForm.invalid) {
        this.showInfoNotifications(
          'pw.otherReceiptsIssues.enterApprovalDetailsMessage'
        );
      } else {
        this.showConfirmIssueNotifications(
          'pw.otherReceiptsIssues.confirmIssueNotificationMessage'
        );
      }
    } else if (
      this.totalItemCount === 50 &&
      this.selectForm.value.selectRadioButton !== '1'
    ) {
      if (this.PSVForm.invalid) {
        this.showInfoNotifications(
          'pw.otherReceiptsIssues.enterApprovalDetailsMessage'
        );
      } else {
        this.showConfirmIssueNotifications(
          'pw.otherReceiptsIssues.confirmIssueNotificationCartFullMessage'
        );
      }
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
  updateItem(itemToUpdate: PSVItemToUpdate) {
    this.otherIssueFacade.updatePSVCartItem({
      id: itemToUpdate.id,
      quantity: itemToUpdate.newUpdate.quantity,
      weight: itemToUpdate.newUpdate.weight
    });
  }
  selectChange() {
    if (this.selectForm.value.selectRadioButton === '1') {
      this.selectAll();
    }
  }
  selectAll() {
    this.itemIds = [];
    this.selectionAllSubject.next({
      selectCheckbox: true,
      enableCheckbox: false
    });
    this.showNotification();
  }
  selectionEmit(selection: { selected: boolean; id: number }) {
    this.selectForm.patchValue({
      selectRadioButton: null
    });
    switch (selection.selected) {
      case false: {
        this.selectForm.patchValue({
          selectRadioButton: null
        });
        const itemToRemove = selection.id;
        this.itemIds.splice(this.itemIds.indexOf(itemToRemove), 1);
        break;
      }
      case true: {
        this.itemIds.push(selection.id);
        if (this.itemIds.length === this.allItemIds.length) {
          this.selectForm.patchValue({
            selectRadioButton: '1'
          });
        }
      }
    }
    this.overlayNotification.close();
    this.showNotification();
  }
  RemoveProductsOverlay(count: number, key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: 'REMOVE',
            message: translatedMessage.replace('{0}', count.toString())
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.otherIssueFacade.removeSelectedPSVItems({
                ids:
                  this.selectForm.value.selectRadioButton === '1'
                    ? this.allItemIds
                    : this.itemIds
              });
              this.overlayNotification.close();
              this.itemIds = [];
              this.showNotification();
              this.selectForm.patchValue({
                selectRadioButton: null
              });
              this.clearSearchItems();
            }
          });
      });
  }
  showSuccessMessageNotification(msg: any) {
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
          this.router.navigate([getOtherIssuesDefaultUrl()]);
        }
      });
  }
  back() {
    this.router.navigate([getOtherIssuesDefaultUrl()]);
  }
  resetData() {
    this.otherIssueFacade.resetPSVIssueData();
  }
  clearSearchItems() {
    this.itemCode = null;
    this.lotNumber = null;
    this.loadItemCart();
    this.overlayNotification.close();
    this.showNotification();
    this.clearAll();
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
    this.otherIssueFacade.clearSearchCartItemPSV();
    this.overlayNotification.close();
    this.showNotification();
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.showNotification();
        }
      });
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
    this.otherIssueFacade.clearSearchInventoryItemPSV();
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
          hasClose: true
        });
      });
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
  loadItemCart() {
    this.itemList = this.allItemsInCart;
    if (this.itemCode) {
      this.itemList = this.itemList.filter(
        (item: OtherIssuesItem) =>
          item.itemCode.toLowerCase() === this.itemCode.toLowerCase() &&
          (this.lotNumber
            ? this.lotNumber.toLowerCase() === item.lotNumber.toLowerCase()
            : true)
      );
    }
    if (this.filter.length > 0) {
      for (let i = 0; i < this.filter.length; i++) {
        this.itemList = this.itemList.filter((item: OtherIssuesItem) => {
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
        (item1: OtherIssuesItem, item2: OtherIssuesItem) => {
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
    this.showNotification();
  }
  searchInCart(searchData: ItemSearchResponse) {
    this.itemCode = searchData.searchValue;
    this.lotNumber = searchData.lotNumber;
    this.loadItemCart();
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlayNotification.close();
  }
}
