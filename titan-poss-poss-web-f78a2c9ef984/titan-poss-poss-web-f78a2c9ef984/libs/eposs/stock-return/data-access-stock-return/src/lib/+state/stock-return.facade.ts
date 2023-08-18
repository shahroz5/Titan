import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StockReturnState } from './stock-return.state';
import * as StockReturnAction from './stock-return.actions';
import {
  SearchItemPayload,
  CreateIssueItemsPayload,
  RemoveSelectedItemsPayload,
  LoadStockReturnItemsPayload,
  ConfirmStockReturnPayload,
  LoadStockIssueInvoiceHistoryPayload,
  HistoryAdvancedFilterPayload,
  LoadStockIssueItemsPayloadCfa,
  ImageReqPayload
} from '@poss-web/shared/models';
import { StockReturnSelectors } from './stock-return.selectors';

/**
 * Return Invoice Facade for accesing Return-Invoice-State
 * */
@Injectable()
export class StockReturnFacade {
  constructor(private store: Store<StockReturnState>) {}

  private newRequestId$ = this.store.select(
    StockReturnSelectors.selectNewRequestId
  );
  private confirmedReturnInvoiceCfa$ = this.store.select(
    StockReturnSelectors.selectConfirmedReturnInvoiceCfa
  );

  private error$ = this.store.select(StockReturnSelectors.selectError);

  private isLoading$ = this.store.select(StockReturnSelectors.selectisLoading);
  private hasSearcheResult$ = this.store.select(
    StockReturnSelectors.selectHasSearchResult
  );
  private searchedItems$ = this.store.select(
    StockReturnSelectors.selectSearchedItems
  );
  private issueItemSuccess$ = this.store.select(
    StockReturnSelectors.selectHasIssued
  );

  private cfaCode$ = this.store.select(StockReturnSelectors.selectCFA);

  private selectCFAItems$ = this.store.select(
    StockReturnSelectors.selectCFAItems
  );

  private selectCFAItem$ = this.store.select(
    StockReturnSelectors.selectCFAItem
  );

  private selectTotalItemsCount$ = this.store.select(
    StockReturnSelectors.selectTotalItemCount
  );

  private hasRemovedMultipleItems$ = this.store.select(
    StockReturnSelectors.selectHasRemovedMultipleItes
  );
  private hasSelectedProductsSearch$ = this.store.select(
    StockReturnSelectors.selecteHasSelectedProductsSearch
  );
  private selectedProductsSearchCount$ = this.store.select(
    StockReturnSelectors.selectSelectedProductsSearchCount
  );
  private selectSearchCount$ = this.store.select(
    StockReturnSelectors.selectSearchCount
  );

  private courierDetails$ = this.store.select(
    StockReturnSelectors.selectCourierDetails
  );
  private headerLevelDetails$ = this.store.select(
    StockReturnSelectors.selectHeaderLevelDetails
  );
  private productCategories$ = this.store.select(
    StockReturnSelectors.selectProductCategories
  );

  private productGroups$ = this.store.select(
    StockReturnSelectors.selectProductGroups
  );
  private employeeCodes$ = this.store.select(
    StockReturnSelectors.selectEmployeeCodes
  );

  private employeeDetails$ = this.store.select(
    StockReturnSelectors.selectEmployeeDetails
  );
  private issueInvoiceHistory$ = this.store.select(
    StockReturnSelectors.selectInvoiceHistory
  );
  private issueInvoiceHistoryCount$ = this.store.select(
    StockReturnSelectors.selectTotalInvoiceHistoryCount
  );
  private isLoadingHistory$ = this.store.select(
    StockReturnSelectors.selectIsLoadingHistory
  );
  private historyType$ = this.store.select(
    StockReturnSelectors.selectHistoryType
  );
  private advancedFilter$ = this.store.select(
    StockReturnSelectors.selectAdvancedFilterData
  );
  private hasSearched$ = this.store.select(
    StockReturnSelectors.selectHasSearched
  );
  // Image
  private isLoadingImage$ = this.store.select(
    StockReturnSelectors.selectIsLoadingImage
  );

  /**
   * Access for state selectors
   */

  getNewRequestId() {
    return this.newRequestId$;
  }
  getSelectedProductsSearchCount() {
    return this.selectedProductsSearchCount$;
  }
  getHasSelectedProductsSearch() {
    return this.hasSelectedProductsSearch$;
  }
  getHasRemovedMultipleItems() {
    return this.hasRemovedMultipleItems$;
  }
  getHasSearched() {
    return this.hasSearched$;
  }

  getCFAItems() {
    return this.selectCFAItems$;
  }
  getCFAItem() {
    return this.selectCFAItem$;
  }
  getTotalItemsCount() {
    return this.selectTotalItemsCount$;
  }
  getCFACode() {
    return this.cfaCode$;
  }

  getconfirmedReturnInvoiceCfa() {
    return this.confirmedReturnInvoiceCfa$;
  }

  getError() {
    return this.error$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  getHasSearchResult() {
    return this.hasSearcheResult$;
  }

  getSearchedItems() {
    return this.searchedItems$;
  }

  getHasItemsIssued() {
    return this.issueItemSuccess$;
  }

  getSearchCount() {
    return this.selectSearchCount$;
  }

  getCourierDetails() {
    return this.courierDetails$;
  }
  getHeaderLevelDetails() {
    return this.headerLevelDetails$;
  }
  getProductCategories() {
    return this.productCategories$;
  }
  getProductGroups() {
    return this.productGroups$;
  }
  getEmployeeCodes() {
    return this.employeeCodes$;
  }
  getEmployeeDetails() {
    return this.employeeDetails$;
  }
  getIsLoadingHistory() {
    return this.isLoadingHistory$;
  }
  getIssueInvoiceHistory() {
    return this.issueInvoiceHistory$;
  }
  getIssueInvoiceHistoryCount() {
    return this.issueInvoiceHistoryCount$;
  }
  getHistoryType() {
    return this.historyType$;
  }
  getAdvancedFilter() {
    return this.advancedFilter$;
  }
  // Image
  getIsLoadingImage() {
    return this.isLoadingImage$;
  }
  /**
 *Dispatch an action for remove cart Item
 @param item: payload of item to remove
 */

  selectedProductsSearch(loadedItemsPayload: LoadStockReturnItemsPayload) {
    this.store.dispatch(
      new StockReturnAction.SelectedProductsSearch(loadedItemsPayload)
    );
  }

  /**
   * Dispatch an Action for update cart Item
   * @param updateItemPayload : payload to update
   */

  /**
   * Dispatch an Action to Load CFA
   */
  loadCFAddress() {
    this.store.dispatch(new StockReturnAction.LoadCFALocationCode());
  }

  loadItemCFA(loadItem: LoadStockReturnItemsPayload) {
    this.store.dispatch(new StockReturnAction.LoadItems(loadItem));
  }
  loadCFA(loadItem: LoadStockIssueItemsPayloadCfa) {
    this.store.dispatch(new StockReturnAction.LoadItemsCfa(loadItem));
  }
  /**
   * Dispatch an Action to additems to cart
   * @param items :Payload of items
   */
  // addItemsToCart(items: StockReturnItem[]) {
  //   this.store.dispatch(new StockReturnAction.AddItemsToCart(items));
  // }

  /**
   * Dispatch an Action to Create Request
   */
  createRequestToCfa() {
    this.store.dispatch(new StockReturnAction.CreateRequestToCfa());
  }

  /**
   *Dispatch an Action to Confirm Issue
   * @param confirmIssuePayload :Payload of confirm issue
   */
  confirmIssue(confirmIssuePayload: ConfirmStockReturnPayload) {
    this.store.dispatch(
      new StockReturnAction.ConfirmIssue(confirmIssuePayload)
    );
  }

  /**
   * Dispatch an Action for searching Items
   * @param searchItemPayload:Payload for serach item
   */
  searchItems(searchItemPayload: SearchItemPayload) {
    this.store.dispatch(new StockReturnAction.SearchItem(searchItemPayload));
  }
  removeSelectedItems(removeItems: RemoveSelectedItemsPayload) {
    this.store.dispatch(new StockReturnAction.RemoveSelectedItems(removeItems));
  }
  /**
   * Dispatch an Action for creating itms to issue
   * @param createIssueItems :payload issue items
   */
  createIssueItems(createIssueItems: CreateIssueItemsPayload) {
    this.store.dispatch(
      new StockReturnAction.CreateIssueItems(createIssueItems)
    );
  }

  /**
   * Dispacth an Action for clearing search
   */
  clearSearch() {
    this.store.dispatch(new StockReturnAction.ClearSearch());
  }

  clearSearchItems() {
    this.store.dispatch(new StockReturnAction.ClearSearchItems());
  }

  loadCourierDetails() {
    this.store.dispatch(new StockReturnAction.LoadCourierDetails());
  }
  loadHeaderLevelDetails(requestId: number) {
    this.store.dispatch(
      new StockReturnAction.LoadHeaderLevelDetails(requestId)
    );
  }
  loadProductGroups() {
    this.store.dispatch(new StockReturnAction.LoadProductGroups());
  }
  loadProductCategories() {
    this.store.dispatch(new StockReturnAction.LoadProductCategories());
  }
  loadEmployeeDetails(employeeCode: string) {
    this.store.dispatch(
      new StockReturnAction.LoadEmployeeDetails(employeeCode)
    );
  }
  loadStuddedProductGroups() {
    this.store.dispatch(new StockReturnAction.LoadStuddedProductGroups());
  }
  loadEmployeeCodes() {
    this.store.dispatch(new StockReturnAction.LoadEmployeeCodes());
  }
  loadIssueInvoiceHistory(historyPayload: LoadStockIssueInvoiceHistoryPayload) {
    this.store.dispatch(
      new StockReturnAction.LoadIssueInvoiceHistory(historyPayload)
    );
  }
  storeHistoryType(historyType: string) {
    this.store.dispatch(new StockReturnAction.StoreHistoryType(historyType));
  }
  storeAdvancedFilterData(advancedFilter: HistoryAdvancedFilterPayload) {
    this.store.dispatch(
      new StockReturnAction.StoreAdvancedFilterData(advancedFilter)
    );
  }
  resetStockReturnHistory() {
    this.store.dispatch(new StockReturnAction.ResetStockReturnHistory());
  }
  resetStockReturnItems() {
    this.store.dispatch(new StockReturnAction.ResetStockReturnItems());
  }
  resetAdvanceFilter(businessDay: number) {
    this.store.dispatch(new StockReturnAction.ResetAdavanceFilter(businessDay));
  }
  resetError() {
    this.store.dispatch(new StockReturnAction.ResetError());
  }
  // Image
  loadThumbnailImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(
      new  StockReturnAction.LoadThumbnailImageUrl(payload)
    );
  }
  loadImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(new  StockReturnAction.LoadImageUrl(payload));
  }
}
