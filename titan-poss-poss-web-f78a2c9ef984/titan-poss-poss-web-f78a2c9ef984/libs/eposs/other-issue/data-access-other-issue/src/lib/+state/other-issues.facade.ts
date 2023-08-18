import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { otherIssuesSelector } from './other-issues.selector';
import * as OtherIssuesActions from './other-issues.actions';

import {
  OtherIssuesItem,
  Filter,
  Column,
  OtherIssueLoadListItemsPayload,
  OtherIssueSearchPendingPayload,
  OtherIssueLoadSelectedPayload,
  CreateOtherStockIssueItemsPayload,
  LoadOtherIssuesItemPayload,
  ConfirmOtherStockIssuePayload,
  OtherIssuesCreateStockResponsePayload,
  LoadAllOtherIssuePayload,
  LoadOtherIssueCreateItemsTotalCountPayload,
  CreateOtherIssueStockRequestItemsPayload,
  RemoveOtherIssueStockRequestItemsPayload,
  UpdateStockRequestItemPayload,
  UpdateStockRequestPayload,
  AdjustmentSearchItemPayload,
  CreateStockRequestAdjustmentPayload,
  UpdateCartItemAdjustmentPayload,
  RemoveCartItemAdjustmentPayload,
  PSVSearchItemPayload,
  CreateStockRequestPSVPayload,
  UpdateCartItemPSVPayload,
  RemoveCartItemPSVPayload,
  PrintOtherIssuePayload,
  CancelOtherRequestPayload,
  LoadOtherIssueHistoryPayload,
  LoadOtherIssueHistoryItemsPayload,
  OtherReceiptsIssuesAdvanceFilterPayload
} from '@poss-web/shared/models';
import { OtherIssuesState } from './other-issues.state';

@Injectable()
export class OtherIssuesFacade {
  private hasError$ = this.store.select(otherIssuesSelector.selectHasError);

  private isLoading$ = this.store.select(otherIssuesSelector.selectIsLoading);

  private otherIssuesSTNCount$ = this.store.select(
    otherIssuesSelector.selectOtherIssuesSTNCount
  );

  private issuesList$ = this.store.select(
    otherIssuesSelector.selectPendingIssuesList
  );
  private issuesLoanList$ = this.store.select(
    otherIssuesSelector.selectPendingIssuesLoanList
  );

  private isLoadingOtherIssuesSTN$ = this.store.select(
    otherIssuesSelector.selectIsLoadingOtherIssuesSTN
  );

  private searchOtherIssueStockResults$ = this.store.select(
    otherIssuesSelector.selectOtherIssueStockResults
  );

  private otherIssuesDropDown$ = this.store.select(
    otherIssuesSelector.selectOtherIssuesDropDown
  );
  private getSelectedIssueDropDownvalue$ = this.store.select(
    otherIssuesSelector.selectOtherissuesSelectedDropDown
  );
  private selectedIssue$ = this.store.select(
    otherIssuesSelector.selectSelectedIssue
  );
  private selectTotalIssueCount$ = this.store.select(
    otherIssuesSelector.selectTotalIssueCount
  );
  private isSearchingStocks$ = this.store.select(
    otherIssuesSelector.selectIsSearchingStocks
  );
  private hasSearchStockResults$ = this.store.select(
    otherIssuesSelector.selectHasSearchStockResults
  );
  private nonVerifiedOtherIssueItems$ = this.store.select(
    otherIssuesSelector.selectNonVerifiedOtherIssueItems
  );
  private isLoadingSelectedIssueStock$ = this.store.select(
    otherIssuesSelector.selectIsLoadingSelectedIssueStock
  );
  private hasSearchedOtherIssueItems$ = this.store.select(
    otherIssuesSelector.selectHasSearchedOtherIssueItems
  );
  private isSearchingOtherIssueItems$ = this.store.select(
    otherIssuesSelector.selectIsSearchingOtherIssueItems
  );
  private createOtherIssueStockRequestResponse$ = this.store.select(
    otherIssuesSelector.createOtherIssueStockRequestResponse
  );
  private allOtherIssueCreateItems$ = this.store.select(
    otherIssuesSelector.selectAllOtherIssuesCreateItems
  );
  private selectedOtherIssueCreateItems$ = this.store.select(
    otherIssuesSelector.selectSelectedOtherIssuesCreateItems
  );
  private allOtherIssueCreateItemsTotalCount$ = this.store.select(
    otherIssuesSelector.selectAllOtherIssueCreateItemsTotalCount
  );
  private selectedOtherIssueCreateTotalCount$ = this.store.select(
    otherIssuesSelector.selectSelectedOtherIssueCreateTotalCount
  );

  private selectIsAllOtherIssueCreateItemsLoading$ = this.store.select(
    otherIssuesSelector.selectIsAllOtherIssueCreateItemsLoading
  );
  private selectIsSelectedOtherIssueItemsLoading$ = this.store.select(
    otherIssuesSelector.selectIsSelectedOtherIssueItemsLoading
  );

  private selectIsOtherIssueCreateTotalCountLoaded$ = this.store.select(
    otherIssuesSelector.selectIsOtherIssueCreateTotalCountLoaded
  );
  private selectIsOtherIssueCreateTotalCountLoading$ = this.store.select(
    otherIssuesSelector.selectIsOtherIssueCreateTotalCountLoading
  );

  private hasSearchedOtherIssueCreateItems$ = this.store.select(
    otherIssuesSelector.selectHasSearchedOtherIssueCreateItems
  );
  private isSearchingOtherIssueCreateItems$ = this.store.select(
    otherIssuesSelector.selectIsSearchingOtherIssueCreateItems
  );
  private createStockRequestItemsResponse$ = this.store.select(
    otherIssuesSelector.selectCreateStockRequestItemsResponse
  );
  private removeOtherIssueStockRequestItemsResponse$ = this.store.select(
    otherIssuesSelector.selectRemoveOtherIssueStockRequestItemsResponse
  );
  private updateStockRequestResponse$ = this.store.select(
    otherIssuesSelector.selectupdateStockRequestResponse
  );
  private createOtherStockIssueItemsResponse$ = this.store.select(
    otherIssuesSelector.selectCreateOtherStockIssueItemsResponse
  );
  private confirmOtherStockIssueResponse$ = this.store.select(
    otherIssuesSelector.selectConfirmOtherStockIssueResponse
  );
  private isLoadingOtherIssueDetails$ = this.store.select(
    otherIssuesSelector.selectisLoadingOtherIssueDetails
  );
  private searchedAdjustmentItems$ = this.store.select(
    otherIssuesSelector.selectSearchedAdjustmentItems
  );
  private adjustmentItemsInCarts$ = this.store.select(
    otherIssuesSelector.selectAdjustmentItemsInCart
  );
  private issuesADJList$ = this.store.select(
    otherIssuesSelector.selectPendingIssuesADJList
  );
  private issuesLossList$ = this.store.select(
    otherIssuesSelector.selectPendingIssuesLossList
  );
  private issuesPSVList$ = this.store.select(
    otherIssuesSelector.selectPendingIssuesPSVList
  );
  private createStockRequestAdjustmentResponse$ = this.store.select(
    otherIssuesSelector.selectcreateStockRequestAdjustmentResponse
  );
  private selectAdjustmentItemsInCartsSearch$ = this.store.select(
    otherIssuesSelector.selectAdjustmentItemsInCartsSearch
  );
  private isSearchingAdjustment$ = this.store.select(
    otherIssuesSelector.selectIsSearchingAdjustment
  );
  private hasSearchedItemAdjustment$ = this.store.select(
    otherIssuesSelector.selectHasSearchedItemAdjustment
  );
  private IsLoadingAdjustment$ = this.store.select(
    otherIssuesSelector.selectIsLoadingAdjustment
  );
  private hasSearchItemInCartSearch$ = this.store.select(
    otherIssuesSelector.selectHasSearchItemInCartSearch
  );
  //psv
  private searchedPSVItems$ = this.store.select(
    otherIssuesSelector.selectSearchedPSVItems
  );
  private psvItemsInCarts$ = this.store.select(
    otherIssuesSelector.selectPSVItemsInCart
  );
  private createStockRequestPSVResponse$ = this.store.select(
    otherIssuesSelector.selectcreateStockRequestPSVResponse
  );
  private selectPSVItemsInCartsSearch$ = this.store.select(
    otherIssuesSelector.selectPSVItemsInCartsSearch
  );
  private isSearchingPSV$ = this.store.select(
    otherIssuesSelector.selectIsSearchingPSV
  );
  private hasSearchedItemPSV$ = this.store.select(
    otherIssuesSelector.selectHasSearchedItemPSV
  );
  private isLoadingPSV$ = this.store.select(
    otherIssuesSelector.selectIsLoadingPSV
  );
  private hasSearchItemInCartSearchPSV$ = this.store.select(
    otherIssuesSelector.selectHasSearchItemInCartSearchPSV
  );
  private error$ = this.store.select(otherIssuesSelector.selectError);

  //FOC
  private searchedFOCItems$ = this.store.select(
    otherIssuesSelector.selectSearchedFOCItems
  );
  private focItemsInCarts$ = this.store.select(
    otherIssuesSelector.selectFOCItemsInCart
  );
  private createStockRequestFOCResponse$ = this.store.select(
    otherIssuesSelector.selectcreateStockRequestFOCResponse
  );
  private selectFOCItemsInCartsSearch$ = this.store.select(
    otherIssuesSelector.selectFOCItemsInCartsSearch
  );

  private issuesFOCList$ = this.store.select(
    otherIssuesSelector.selectPendingIssuesFOCList
  );
  private isSearchingFOC$ = this.store.select(
    otherIssuesSelector.selectIsSearchingFOC
  );
  private hasSearchedItemFOC$ = this.store.select(
    otherIssuesSelector.selectHasSearchedItemFOC
  );
  private isLoadingFOC$ = this.store.select(
    otherIssuesSelector.selectIsLoadingFOC
  );
  private hasSearchItemInCartSearchFOC$ = this.store.select(
    otherIssuesSelector.selectHasSearchItemInCartSearchFOC
  );

  private isLoadingCancelStockRequestResponse$ = this.store.select(
    otherIssuesSelector.selectIsLoadingCancelStockRequestResponse
  );
  private cancelOtherStockRequestResponse$ = this.store.select(
    otherIssuesSelector.selectCancelOtherStockRequestResponse
  );
  private printDataResponse$ = this.store.select(
    otherIssuesSelector.selectprintDataResponse
  );

  private productCategories$ = this.store.select(
    otherIssuesSelector.selectProductCategories
  );

  private productGroups$ = this.store.select(
    otherIssuesSelector.selectProductGroups
  );
  private filterDataAllProducts$ = this.store.select(
    otherIssuesSelector.selectfilterDataAllProducts
  );

  private filterDataSelectedProducts$ = this.store.select(
    otherIssuesSelector.selectfilterDataSelectedProducts
  );
  private sortDataAllProducts$ = this.store.select(
    otherIssuesSelector.selectSortDataAllProducts
  );

  private sortDataSelectedProducts$ = this.store.select(
    otherIssuesSelector.selectSortDataSelectedProducts
  );

  private filterDataOtherIssue$ = this.store.select(
    otherIssuesSelector.selectfilterDataOtherIssue
  );
  private sortDataOtherIssue$ = this.store.select(
    otherIssuesSelector.selectSortDataOtherIssue
  );
  //HISTORY
  private otherIssueHistory$ = this.store.select(
    otherIssuesSelector.selectOtherIssueHistory
  );
  private isLoadingOtherIssueHistory$ = this.store.select(
    otherIssuesSelector.selectIsLoadingOtherIssueHistory
  );
  private otherIssueHistoryCount$ = this.store.select(
    otherIssuesSelector.selectOtherIssueHistoryCount
  );
  private isLoadingSelectedHistory$ = this.store.select(
    otherIssuesSelector.selectIsLoadingSelectedHistory
  );
  private hasSelectedHistory$ = this.store.select(
    otherIssuesSelector.selectHasSelectedHistory
  );
  private selectedHistory$ = this.store.select(
    otherIssuesSelector.selectSelectedHistory
  );
  private historyItemsCount$ = this.store.select(
    otherIssuesSelector.selectHistoryItemsCount
  );
  private historyItems$ = this.store.select(
    otherIssuesSelector.selectHistoryItems
  );
  private isLoadingHistoryItems$ = this.store.select(
    otherIssuesSelector.selectIsLoadingHistoryItems
  );
  private isHistoryItemsLoaded$ = this.store.select(
    otherIssuesSelector.selectIsHistoryItemsLoaded
  );
  private isLoadingHistoryItemsTotalCount$ = this.store.select(
    otherIssuesSelector.selectIsLoadingHistoryItemsTotalCount
  );
  private isHistoryItemsTotalCountLoaded$ = this.store.select(
    otherIssuesSelector.selectIsHistoryItemsTotalCountLoaded
  );
  private historyItemsTotalCount$ = this.store.select(
    otherIssuesSelector.selectHistoryItemsTotalCount
  );
  private advancedFilterData$ = this.store.select(
    otherIssuesSelector.selectAdvancedFilterData
  );

  resetOtherIssueListData() {
    this.store.dispatch(new OtherIssuesActions.ResetIssueListData());
  }
  searchPendingIssuesStocks(
    searchPendingpayload: OtherIssueSearchPendingPayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.SearchPendingIssue(searchPendingpayload)
    );
  }
  loadStuddedProductGroups() {
    this.store.dispatch(new OtherIssuesActions.LoadStuddedProductGroups());
  }
  loadOtherIssuesCount() {
    this.store.dispatch(new OtherIssuesActions.LoadIssuesSTNCount());
  }
  loadIssueList(loadIssueListPayload: OtherIssueLoadListItemsPayload) {
    this.store.dispatch(
      new OtherIssuesActions.LoadIssueList(loadIssueListPayload)
    );
  }
  loadIssueLoanList(loadIssueListPayload: OtherIssueLoadListItemsPayload) {
    this.store.dispatch(
      new OtherIssuesActions.LoadIssueLoanList(loadIssueListPayload)
    );
  }
  setSelectedDropDownForIssues(selectedDropdownValue: string) {
    this.store.dispatch(
      new OtherIssuesActions.DropDownvalueForIssues(selectedDropdownValue)
    );
  }
  searchIssueClear() {
    this.store.dispatch(new OtherIssuesActions.SearchClearIssue());
  }
  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getOtherIssuesSTNCount() {
    return this.otherIssuesSTNCount$;
  }

  getOtherIssueList() {
    return this.issuesList$;
  }
  getOtherIssueLoanList() {
    return this.issuesLoanList$;
  }

  getIsLoadingOtherIssuesSTN() {
    return this.isLoadingOtherIssuesSTN$;
  }
  getOtherIssueSearchStockResults() {
    return this.searchOtherIssueStockResults$;
  }
  getOtherIssuesDropdown() {
    return this.otherIssuesDropDown$;
  }
  getSelectedIssueDropDownValue() {
    return this.getSelectedIssueDropDownvalue$;
  }
  getSelectedIssue() {
    return this.selectedIssue$;
  }
  clearItems() {
    this.store.dispatch(new OtherIssuesActions.ClearItems());
  }
  loadSelectedIssue(loadSelectedIssuePayload: OtherIssueLoadSelectedPayload) {
    this.store.dispatch(
      new OtherIssuesActions.LoadSelectedIssue(loadSelectedIssuePayload)
    );
  }
  getTotalIssueElementCount() {
    return this.selectTotalIssueCount$;
  }
  getIsSearchingStocks() {
    return this.isSearchingStocks$;
  }

  getHasSearchStockResults() {
    return this.hasSearchStockResults$;
  }
  getNonVerifiedOtherissueItems() {
    return this.nonVerifiedOtherIssueItems$;
  }
  loadNonVerifiedItems(loadItemsPayload: LoadOtherIssuesItemPayload) {
    this.store.dispatch(
      new OtherIssuesActions.LoadNonVerifiedOtherIssueItems(loadItemsPayload)
    );
  }
  getisLoadingSelectedIssueStock() {
    return this.isLoadingSelectedIssueStock$;
  }

  getHasSearchedOtherIssueItems() {
    return this.hasSearchedOtherIssueItems$;
  }

  getIsSearchingOtherIssueItems() {
    return this.isSearchingOtherIssueItems$;
  }

  createOtherStockIssueItems(
    createOtherStockIssueItemsPayload: CreateOtherStockIssueItemsPayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.CreateOtherStockIssueItems(
        createOtherStockIssueItemsPayload
      )
    );
  }
  getCreateOtherStockIssueItemsResponse() {
    return this.createOtherStockIssueItemsResponse$;
  }
  removeInitialLoadOtherIssue() {
    this.store.dispatch(new OtherIssuesActions.RemoveInitialLoadOtherIssue());
  }

  confirmOtherStockIssue(
    confirmOtherStockIssuePayload: ConfirmOtherStockIssuePayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.ConfirmOtherStockIssue(
        confirmOtherStockIssuePayload
      )
    );
  }
  getConfirmOtherStockIssueResponse() {
    return this.confirmOtherStockIssueResponse$;
  }
  getisLoadingOtherIssueDetails() {
    return this.isLoadingOtherIssueDetails$;
  }
  resetConfirmOtherIssueResponse() {
    this.store.dispatch(
      new OtherIssuesActions.ResetConfirmOtherIssueResponse()
    );
  }
  // create page
  createOtherIssuesStockRequest(
    createresponsePayload: OtherIssuesCreateStockResponsePayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.CreateOtherIssueStockRequest(createresponsePayload)
    );
  }
  getOtherIssuesStockRequest() {
    return this.createOtherIssueStockRequestResponse$;
  }

  loadAllOtherIssueCreateItems(loadItemsPayload: LoadAllOtherIssuePayload) {
    this.store.dispatch(
      new OtherIssuesActions.LoadAllOtherIssueCreateItems(loadItemsPayload)
    );
  }

  loadSelectedOtherIssueCreateItems(
    loadItemsPayload: LoadAllOtherIssuePayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.LoadSelectedOtherIssueCreateItems(loadItemsPayload)
    );
  }
  getAllOtherIssuesCreateItems() {
    return this.allOtherIssueCreateItems$;
  }
  getSelecetedIssuesCreateItems() {
    return this.selectedOtherIssueCreateItems$;
  }

  loadOtherIssueItemsCreateTotalCount(
    loadIssueItemsTotalCountPayload: LoadOtherIssueCreateItemsTotalCountPayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.LoadIssueItemsCreateTotalCount(
        loadIssueItemsTotalCountPayload
      )
    );
  }
  getallOtherIssueCreateItemsTotalCount() {
    return this.allOtherIssueCreateItemsTotalCount$;
  }
  getSelectedOtherIssueCreateTotalCount() {
    return this.selectedOtherIssueCreateTotalCount$;
  }

  getIsAllOtherIssueCreateItemsLoading() {
    return this.selectIsAllOtherIssueCreateItemsLoading$;
  }
  getselectIsSelectedOtherIssueItemsLoading() {
    return this.selectIsSelectedOtherIssueItemsLoading$;
  }
  getselectIsOtherIssueCreateTotalCountLoaded() {
    return this.selectIsOtherIssueCreateTotalCountLoaded$;
  }
  getselectIsOtherIssueCreateTotalCountLoading() {
    return this.selectIsOtherIssueCreateTotalCountLoading$;
  }

  gethasSearchedOtherIssueCreateItems() {
    return this.hasSearchedOtherIssueCreateItems$;
  }
  getisSearchingOtherIssueCreateItems() {
    return this.isSearchingOtherIssueCreateItems$;
  }

  createOtherIssueStockRequestItems(
    createStockIssueItemsPayload: CreateOtherIssueStockRequestItemsPayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.CreateOtherIssueStockRequestItems(
        createStockIssueItemsPayload
      )
    );
  }
  removeOtherIssueStockRequestItems(
    createStockIssueItemsPayload: RemoveOtherIssueStockRequestItemsPayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.RemoveOtherIssueStockRequestItems(
        createStockIssueItemsPayload
      )
    );
  }
  updateStockRequestCreateItem(
    updateStockIssueItemPayload: UpdateStockRequestItemPayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.UpdateStockRequestCreateItem(
        updateStockIssueItemPayload
      )
    );
  }
  getCreateStockRequestItemsResponse() {
    return this.createStockRequestItemsResponse$;
  }
  resetOtherIssueCreateListItems() {
    this.store.dispatch(
      new OtherIssuesActions.ResetOtherIssueCreateListItems()
    );
  }
  resetOtherIssueCreateResponse() {
    this.store.dispatch(new OtherIssuesActions.ResetOtherIssueCreateResponse());
  }
  getRemoveOtherIssueStockRequestItemsResponse() {
    return this.removeOtherIssueStockRequestItemsResponse$;
  }
  getupdateStockRequestResponse() {
    return this.updateStockRequestResponse$;
  }
  updateStockRequest(updateStockRequestPayload: UpdateStockRequestPayload) {
    this.store.dispatch(
      new OtherIssuesActions.UpdateStockRequest(updateStockRequestPayload)
    );
  }
  /**
   * Dispatch an Action for searching Items
   * @param searchItemPayload:Payload for serach item
   */
  searchAdjustmentItems(searchItemPayload: AdjustmentSearchItemPayload) {
    this.store.dispatch(
      new OtherIssuesActions.SearchAdjustment(searchItemPayload)
    );
  }
  getSearchedAdjustmentItems() {
    return this.searchedAdjustmentItems$;
  }
  getpAdjustmentItemsInCarts() {
    return this.adjustmentItemsInCarts$;
  }
  /**
   * Dispatch an Action to additems to cart
   * @param items :Payload of items
   */
  addItemsToCart(items: OtherIssuesItem[]) {
    this.store.dispatch(new OtherIssuesActions.AddItemsToCart(items));
  }
  createStockRequestAdjustment(
    createStockRequestAdjustmentPayload: CreateStockRequestAdjustmentPayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.CreateStockRequestAdjustment(
        createStockRequestAdjustmentPayload
      )
    );
  }
  /**
   * Dispatch an Action for update cart Item
   * @param updateItemPayload : payload to update
   */
  updateCartItem(updateCartItemPayload: UpdateCartItemAdjustmentPayload) {
    this.store.dispatch(
      new OtherIssuesActions.UpdateCartItemsAdjustment(updateCartItemPayload)
    );
  }
  removeSelectedItems(removeItems: RemoveCartItemAdjustmentPayload) {
    this.store.dispatch(
      new OtherIssuesActions.RemoveCartItemsAdjustment(removeItems)
    );
  }
  loadIssueADJList(loadIssueListPayload: OtherIssueLoadListItemsPayload) {
    this.store.dispatch(
      new OtherIssuesActions.LoadIssueADJList(loadIssueListPayload)
    );
  }
  loadIssueLossList(loadIssueListPayload: OtherIssueLoadListItemsPayload) {
    this.store.dispatch(
      new OtherIssuesActions.LoadIssueLossList(loadIssueListPayload)
    );
  }
  loadIssuePSVList(loadIssueListPayload: OtherIssueLoadListItemsPayload) {
    this.store.dispatch(
      new OtherIssuesActions.LoadIssuePSVList(loadIssueListPayload)
    );
  }
  clearSearchCartItemAdjustment() {
    this.store.dispatch(new OtherIssuesActions.ClearSearchCartItemAdjustment());
  }
  clearSearchInventoryItemAdjustment() {
    this.store.dispatch(
      new OtherIssuesActions.ClearSearchInventoryItemAdjustment()
    );
  }
  getOtherIssueADJList() {
    return this.issuesADJList$;
  }
  getOtherIssueLossList() {
    return this.issuesLossList$;
  }
  getOtherIssuePSVList() {
    return this.issuesPSVList$;
  }
  getCreateStockRequestAdjustmentResponse() {
    return this.createStockRequestAdjustmentResponse$;
  }
  resetAdjustmentIssueData() {
    this.store.dispatch(new OtherIssuesActions.ResetAdjustmentIssueData());
  }
  getAdjustmentItemsInCartsSearch() {
    return this.selectAdjustmentItemsInCartsSearch$;
  }
  getIsSearchingAdjustment() {
    return this.isSearchingAdjustment$;
  }
  gethasSearchedItemAdjustment() {
    return this.hasSearchedItemAdjustment$;
  }
  getIsLoadingAdjustment() {
    return this.IsLoadingAdjustment$;
  }
  getHasSearchItemInCartSearch() {
    return this.hasSearchItemInCartSearch$;
  }
  //psv
  /**
   * Dispatch an Action for searching Items
   * @param searchItemPayload:Payload for serach item
   */
  searchPSVItems(searchItemPayload: PSVSearchItemPayload) {
    this.store.dispatch(new OtherIssuesActions.SearchPSV(searchItemPayload));
  }
  getSearchedPSVItems() {
    return this.searchedPSVItems$;
  }
  getPSVItemsInCarts() {
    return this.psvItemsInCarts$;
  }
  /**
   * Dispatch an Action to additems to cart
   * @param items :Payload of items
   */
  addPSVItemsToCart(items: OtherIssuesItem[]) {
    this.store.dispatch(new OtherIssuesActions.AddPSVItemsToCart(items));
  }
  createStockRequestPSV(
    createStockRequestPSVPayload: CreateStockRequestPSVPayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.CreateStockRequestPSV(createStockRequestPSVPayload)
    );
  }
  /**
   * Dispatch an Action for update cart Item
   * @param updateItemPayload : payload to update
   */
  updatePSVCartItem(updateCartItemPayload: UpdateCartItemPSVPayload) {
    this.store.dispatch(
      new OtherIssuesActions.UpdateCartItemsPSV(updateCartItemPayload)
    );
  }
  removeSelectedPSVItems(removeItems: RemoveCartItemPSVPayload) {
    this.store.dispatch(new OtherIssuesActions.RemoveCartItemsPSV(removeItems));
  }
  clearSearchCartItemPSV() {
    this.store.dispatch(new OtherIssuesActions.ClearSearchCartItemPSV());
  }
  getCreateStockRequestPSVResponse() {
    return this.createStockRequestPSVResponse$;
  }
  resetPSVIssueData() {
    this.store.dispatch(new OtherIssuesActions.ResetPSVIssueData());
  }
  getPSVItemsInCartsSearch() {
    return this.selectPSVItemsInCartsSearch$;
  }
  getError() {
    return this.error$;
  }
  getIsSearchingPSV() {
    return this.isSearchingPSV$;
  }
  gethasSearchedItemPSV() {
    return this.hasSearchedItemPSV$;
  }
  getIsLoadingPSV() {
    return this.isLoadingPSV$;
  }
  getHasSearchItemInCartSearchPSV() {
    return this.hasSearchItemInCartSearchPSV$;
  }
  clearSearchInventoryItemPSV() {
    this.store.dispatch(new OtherIssuesActions.ClearSearchInventoryItemPSV());
  }
  //FOC
  /**
   * Dispatch an Action for searching Items
   * @param searchItemPayload:Payload for serach item
   */
  searchFOCItems(searchItemPayload: PSVSearchItemPayload) {
    this.store.dispatch(new OtherIssuesActions.SearchFOC(searchItemPayload));
  }
  getSearchedFOCItems() {
    return this.searchedFOCItems$;
  }
  getFOCItemsInCarts() {
    return this.focItemsInCarts$;
  }
  /**
   * Dispatch an Action to additems to cart
   * @param items :Payload of items
   */
  addFOCItemsToCart(items: OtherIssuesItem[]) {
    this.store.dispatch(new OtherIssuesActions.AddFOCItemsToCart(items));
  }
  createStockRequestFOC(
    createStockRequestFOCPayload: CreateStockRequestPSVPayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.CreateStockRequestFOC(createStockRequestFOCPayload)
    );
  }
  /**
   * Dispatch an Action for update cart Item
   * @param updateItemPayload : payload to update
   */
  updateFOCCartItem(updateCartItemPayload: UpdateCartItemPSVPayload) {
    this.store.dispatch(
      new OtherIssuesActions.UpdateCartItemsFOC(updateCartItemPayload)
    );
  }
  removeSelectedFOCItems(removeItems: RemoveCartItemPSVPayload) {
    this.store.dispatch(new OtherIssuesActions.RemoveCartItemsFOC(removeItems));
  }
  clearSearchCartItemFOC() {
    this.store.dispatch(new OtherIssuesActions.ClearSearchCartItemFOC());
  }
  getCreateStockRequestFOCResponse() {
    return this.createStockRequestFOCResponse$;
  }
  resetFOCIssueData() {
    this.store.dispatch(new OtherIssuesActions.ResetFOCIssueData());
  }
  getFOCItemsInCartsSearch() {
    return this.selectFOCItemsInCartsSearch$;
  }
  getOtherIssueFOCList() {
    return this.issuesFOCList$;
  }
  loadIssueFOCList(loadIssueListPayload: OtherIssueLoadListItemsPayload) {
    this.store.dispatch(
      new OtherIssuesActions.LoadIssueFOCList(loadIssueListPayload)
    );
  }
  getIsSearchingFOC() {
    return this.isSearchingFOC$;
  }
  gethasSearchedItemFOC() {
    return this.hasSearchedItemFOC$;
  }
  getIsLoadingFOC() {
    return this.isLoadingFOC$;
  }
  getHasSearchItemInCartSearchFOC() {
    return this.hasSearchItemInCartSearchFOC$;
  }
  clearSearchInventoryItemFOC() {
    this.store.dispatch(new OtherIssuesActions.ClearSearchInventoryItemFOC());
  }
  getIsLoadingCancelStockRequestResponse() {
    return this.isLoadingCancelStockRequestResponse$;
  }
  getCancelOtherStockRequestResponse() {
    return this.cancelOtherStockRequestResponse$;
  }
  cancelOtherStockRequestResponse(
    cancelOtherRequestPayload: CancelOtherRequestPayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.CancelStockRequest(cancelOtherRequestPayload)
    );
  }
  printOtherIssue(printOtherIssuePayload: PrintOtherIssuePayload) {
    this.store.dispatch(
      new OtherIssuesActions.PrintOtherIssues(printOtherIssuePayload)
    );
  }
  getPrintDataResponse() {
    return this.printDataResponse$;
  }
  loadProductCategories() {
    this.store.dispatch(new OtherIssuesActions.LoadProductCategories());
  }

  getProductCategories() {
    return this.productCategories$;
  }

  loadProductGroups(productType: string) {
    this.store.dispatch(new OtherIssuesActions.LoadProductGroups(productType));
  }

  getProductGroups() {
    return this.productGroups$;
  }
  setOtherIssueAllProductsFilter(filterData: { [key: string]: Filter[] }) {
    this.store.dispatch(
      new OtherIssuesActions.SetFilterDataAllProducts(filterData)
    );
  }
  setOtherIssueSelectedProductsFilter(filterData: { [key: string]: Filter[] }) {
    this.store.dispatch(
      new OtherIssuesActions.SetFilterDataSelectedProducts(filterData)
    );
  }
  getfilterDataAllProducts() {
    return this.filterDataAllProducts$;
  }
  getfilterDataSelectedProducts() {
    return this.filterDataSelectedProducts$;
  }
  setOtherIssueAllProductsSort(sortData: Column[]) {
    this.store.dispatch(
      new OtherIssuesActions.SetSortDataAllProducts(sortData)
    );
  }
  setOtherIssueSelectedProductsSort(sortData: Column[]) {
    this.store.dispatch(
      new OtherIssuesActions.SetSortDataSelectedProducts(sortData)
    );
  }

  getSortDataAllProducts() {
    return this.sortDataAllProducts$;
  }
  getSortDataSelectedProducts() {
    return this.sortDataSelectedProducts$;
  }

  setOtherIssueFilter(filterData: { [key: string]: Filter[] }) {
    this.store.dispatch(
      new OtherIssuesActions.SetFilterDataOtherIssue(filterData)
    );
  }
  setOtherIssueSort(sortData: Column[]) {
    this.store.dispatch(new OtherIssuesActions.SetSortDataOtherIssue(sortData));
  }

  getFilterDataOtherIssue() {
    return this.filterDataOtherIssue$;
  }
  getSortDataOtherIssue() {
    return this.sortDataOtherIssue$;
  }

  //HISTORY
  getOtherIssueHistory() {
    return this.otherIssueHistory$;
  }
  getIsLoadingIssueHistory() {
    return this.isLoadingOtherIssueHistory$;
  }
  getOtherIssueHistoryCount() {
    return this.otherIssueHistoryCount$;
  }
  getIsLoadingSelectedHistory() {
    return this.isLoadingSelectedHistory$;
  }
  getHasSelectedHistory() {
    return this.hasSelectedHistory$;
  }
  getSelectedHistory() {
    return this.selectedHistory$;
  }
  getHistoryItemsCount() {
    return this.historyItemsCount$;
  }
  getHistoryItems() {
    return this.historyItems$;
  }
  getIsLoadingHistoryItems() {
    return this.isLoadingHistoryItems$;
  }
  getIsHistoryItemsLoaded() {
    return this.isHistoryItemsLoaded$;
  }
  getHistoryItemsTotalCount() {
    return this.historyItemsTotalCount$;
  }
  getIsLoadingHistoryItemsTotalCount() {
    return this.isLoadingHistoryItemsTotalCount$;
  }
  getIsHistoryItemsTotalCountLoaded() {
    return this.isHistoryItemsTotalCountLoaded$;
  }
  loadOtherIssueHistory(payload: LoadOtherIssueHistoryPayload) {
    this.store.dispatch(new OtherIssuesActions.LoadOtherIssueHistory(payload));
  }
  resetOtherIssueHistory() {
    this.store.dispatch(new OtherIssuesActions.ResetOtherIssueHistory());
  }

  loadSelectedHistory(
    type: any,
    actionType: string,
    id: number,
    transactionType: string
  ) {
    this.store.dispatch(
      new OtherIssuesActions.LoadSelectedHistory({
        type,
        actionType,
        id,
        transactionType
      })
    );
  }
  loadSelectedHistoryItems(payload: LoadOtherIssueHistoryItemsPayload) {
    this.store.dispatch(
      new OtherIssuesActions.LoadSelectedHistoryItems(payload)
    );
  }
  clearSelectedHistoryItems() {
    this.store.dispatch(new OtherIssuesActions.ClearSelectedHistoryItems());
  }
  loadSelectedHistoryItemsTotalCount(
    payload: LoadOtherIssueHistoryItemsPayload
  ) {
    this.store.dispatch(
      new OtherIssuesActions.LoadSelectedHistoryItemsTotalCount(payload)
    );
  }
  setAdvancedFilterData(filterData: OtherReceiptsIssuesAdvanceFilterPayload) {
    this.store.dispatch(
      new OtherIssuesActions.SetOtherReceiptsIssueFilterData(filterData)
    );
  }
  getAdvancedFilterData() {
    return this.advancedFilterData$;
  }
  clearAdvancedFilterData(businessDate: number) {
    this.store.dispatch(
      new OtherIssuesActions.ClearOtherReceiptsIssueFilterData(businessDate)
    );
  }
  constructor(private store: Store<OtherIssuesState>) {}
}
