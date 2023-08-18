import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { OtherReceiptsSelector } from './other-receipts.selector';
import * as OtherReceiptsActions from './other-receipts.actions';

import {
  AdjustmentItem,
  Filter,
  Column,
  OtherReceiptSearchPendingPayload,
  OtherReceiptLoadListItemsPayload,
  OtherReceiptStockPayLoad,
  OtherReceiptLoadItemsTotalCountPayload,
  OtherReceiptLoadItemsPayload,
  OtherReceiptUpdateItemPayload,
  OtherReceiptUpdateAllItemsPayload,
  ConfirmStockReceivePayload,
  OtherReceiptAdjustmentSearchPayload,
  OtherReceiptConfirmAdjustmentItemsPayload,
  OtherReceiptSearchCartItemAdjustmentPayload,
  OtherReceiptUpdateAdjustementItemPayload,
  OtherReceiptItemValidate,
  LoadOtherReceiptsHistoryPayload,
  LoadOtherReceiptsHistoryItemsPayload,
  ImageReqPayload,
  PrintOtherReceivePayload
} from '@poss-web/shared/models';
import { OtherReceiptState } from './other-receipts.state';

@Injectable()
export class OtherReceiptsFacade {
  private hasError$ = this.store.select(OtherReceiptsSelector.selectHasError);

  private isLoading$ = this.store.select(OtherReceiptsSelector.selectIsLoading);

  private otherReceiptsSTNCount$ = this.store.select(
    OtherReceiptsSelector.selectOtherReceiptsSTNCount
  );

  private receiptList$ = this.store.select(
    OtherReceiptsSelector.selectPendingReceiptList
  );
  private receiptLoanList$ = this.store.select(
    OtherReceiptsSelector.selectPendingReceiptLoanList
  );

  private isLoadingOtherReceiptsSTN$ = this.store.select(
    OtherReceiptsSelector.selectIsLoadingOtherReceiptsSTN
  );
  private isSearchingStocks$ = this.store.select(
    OtherReceiptsSelector.selectIsSearchingStocks
  );
  private hasSearchStockResults$ = this.store.select(
    OtherReceiptsSelector.selectHasSearchStockResults
  );

  private searchStockResults$ = this.store.select(
    OtherReceiptsSelector.selectSearchStockResults
  );
  private nonVerifiedItems$ = this.store.select(
    OtherReceiptsSelector.selectNonVerifiedItems
  );

  private verifiedItems$ = this.store.select(
    OtherReceiptsSelector.selectVerifiedItems
  );

  private isNonVerifiedItemsLoading$ = this.store.select(
    OtherReceiptsSelector.selectIsNonVerifiedItemsLoading
  );

  private isVerifiedItemsLoading$ = this.store.select(
    OtherReceiptsSelector.selectIsVerifiedItemsLoading
  );

  private itemsTotalCountLoaded$ = this.store.select(
    OtherReceiptsSelector.selectIsItemsTotalCountLoaded
  );

  private isItemsTotalCountLoading$ = this.store.select(
    OtherReceiptsSelector.selectIsItemsTotalCountLoading
  );

  private isSearchingItems$ = this.store.select(
    OtherReceiptsSelector.selectIsSearchingItems
  );

  private hasSearchedItems$ = this.store.select(
    OtherReceiptsSelector.selectHasSearchedItems
  );

  private binCodes$ = this.store.select(OtherReceiptsSelector.selectBinCodes);
  private remarks$ = this.store.select(OtherReceiptsSelector.selectRemarks);

  private selectedStock$ = this.store.select(
    OtherReceiptsSelector.selectSelectedStock
  );

  private nonVerifiedItemsTotalCount$ = this.store.select(
    OtherReceiptsSelector.selectNonVerifiedItemsTotalCount
  );

  private verifiedItemsTotalCount$ = this.store.select(
    OtherReceiptsSelector.selectVerifiedItemsTotalCount
  );

  private isVerifyingAllItemSuccess$ = this.store.select(
    OtherReceiptsSelector.selectIsVerifyingAllItemSuccess
  );

  private isAssigningBinToAllItemsSuccess$ = this.store.select(
    OtherReceiptsSelector.selectIsAssigningBinToAllItemsSuccess
  );

  private confirmedStock$ = this.store.select(
    OtherReceiptsSelector.selectConfirmedStock
  );

  private confirmStockReceiveErrors$ = this.store.select(
    OtherReceiptsSelector.selectConfirmStockReceiveErrors
  );

  private selectedStockLoadError$ = this.store.select(
    OtherReceiptsSelector.selectSelectedStockLoadError
  );

  private isAssigningBinToAllItems$ = this.store.select(
    OtherReceiptsSelector.selectIsAssigningBinToAllItems
  );
  private otherReceiptsDropDown$ = this.store.select(
    OtherReceiptsSelector.selectOtherReceiptsDropDown
  );
  private getSelectedDropDownvalue$ = this.store.select(
    OtherReceiptsSelector.selectOtherReceiptsSelectedDropDown
  );
  private selectTotalReceiptCount$ = this.store.select(
    OtherReceiptsSelector.selectTotalReceiptsCount
  );

  private error$ = this.store.select(OtherReceiptsSelector.selectError);

  private isLoadingBinGroups$ = this.store.select(
    OtherReceiptsSelector.selectIsLoadingBinGroups
  );

  private isLoadingRemarks$ = this.store.select(
    OtherReceiptsSelector.selectIsLoadingRemarks
  );

  private isLoadingSelectedStock$ = this.store.select(
    OtherReceiptsSelector.selectIsLoadingSelectedStock
  );

  private updateItemSuccess$ = this.store.select(
    OtherReceiptsSelector.selectUpdateItemSuccess
  );
  private adjustmentSearchedItems$ = this.store.select(
    OtherReceiptsSelector.selectAdjustmentSearchedItems
  );
  private printDataResponse$ = this.store.select(
    OtherReceiptsSelector.selectprintDataResponse
  );

  private itemsInCart$ = this.store.select(
    OtherReceiptsSelector.selectItemsInCart
  );
  private adjustmentItemsSearchCount$ = this.store.select(
    OtherReceiptsSelector.selectAdjustmentItemsSearchCount
  );
  private cartItemsIds = this.store.select(
    OtherReceiptsSelector.selectCartItemIds
  );
  private confirmAdjustementItemsResponse = this.store.select(
    OtherReceiptsSelector.selectConfirmAdjustementItemsResponse
  );
  private receiptADJList$ = this.store.select(
    OtherReceiptsSelector.selectPendingReceiptADJList
  );
  private isSearchingAdjustment$ = this.store.select(
    OtherReceiptsSelector.selectIsSearchingAdjustment
  );
  private hasSearchedItemAdjustment$ = this.store.select(
    OtherReceiptsSelector.selectHasSearchedItemAdjustment
  );
  private IsLoadingAdjustment$ = this.store.select(
    OtherReceiptsSelector.selectIsLoadingAdjustment
  );
  private hasSearchItemInCartSearchAdjustment$ = this.store.select(
    OtherReceiptsSelector.selectHasSearchItemInCartSearch
  );
  //psv
  private psvSearchedItems$ = this.store.select(
    OtherReceiptsSelector.selectPSVSearchedItems
  );

  private itemsInCartPSV$ = this.store.select(
    OtherReceiptsSelector.selectItemsInCartPSV
  );
  private psvItemsSearchCount$ = this.store.select(
    OtherReceiptsSelector.selectPSVItemsSearchCount
  );
  private confirmPSVItemsResponse = this.store.select(
    OtherReceiptsSelector.selectConfirmPSVItemsResponse
  );
  private isSearchingPSV$ = this.store.select(
    OtherReceiptsSelector.selectIsSearchingPSV
  );
  private hasSearchedItemPSV$ = this.store.select(
    OtherReceiptsSelector.selectHasSearchedItemPSV
  );
  private IsLoadingPSV$ = this.store.select(
    OtherReceiptsSelector.selectIsLoadingPSV
  );
  private hasSearchItemInCartSearchPSV$ = this.store.select(
    OtherReceiptsSelector.selectHasSearchItemInCartSearchPSV
  );
  private productCategories$ = this.store.select(
    OtherReceiptsSelector.selectProductCategories
  );

  private productGroups$ = this.store.select(
    OtherReceiptsSelector.selectProductGroups
  );

  private filterDataNonVerifiedProducts$ = this.store.select(
    OtherReceiptsSelector.selectFilterDataNonVerifiedProducts
  );
  private filterDataVerifiedProducts$ = this.store.select(
    OtherReceiptsSelector.selectFilterDataVerifiedProducts
  );
  private sortDataNonVerifiedProducts$ = this.store.select(
    OtherReceiptsSelector.selectSortNonVerifiedProducts
  );

  private sortDataVerifiedProducts$ = this.store.select(
    OtherReceiptsSelector.selectSortDataVerifiedProducts
  );
  private itemsCountNonVerified$ = this.store.select(
    OtherReceiptsSelector.selectItemsCountNonVerified
  );
  private itemsCountVerified$ = this.store.select(
    OtherReceiptsSelector.selectItemsCountVerified
  );
  private selectIsNonVerifiedItemsLoaded$ = this.store.select(
    OtherReceiptsSelector.selectIsNonVerifiedItemsLoaded
  );
  private selectIsVerifiedItemsLoaded$ = this.store.select(
    OtherReceiptsSelector.selectIsVerifiedItemsLoaded
  );
  private selectVerifyItemSuccess$ = this.store.select(
    OtherReceiptsSelector.selectVerifyItemSuccess
  );
  //HISTORY
  private otherReceiptsHistory$ = this.store.select(
    OtherReceiptsSelector.selectOtherReceiptsHistory
  );
  private isLoadingOtherReceiptsHistory$ = this.store.select(
    OtherReceiptsSelector.selectIsLoadingOtherReceiptsHistory
  );
  private otherReceiptsHistoryCount$ = this.store.select(
    OtherReceiptsSelector.selectOtherReceiptsHistoryCount
  );
  private isLoadingSelectedHistory$ = this.store.select(
    OtherReceiptsSelector.selectIsLoadingSelectedHistory
  );
  private hasSelectedHistory$ = this.store.select(
    OtherReceiptsSelector.selectHasSelectedHistory
  );
  private selectedHistory$ = this.store.select(
    OtherReceiptsSelector.selectSelectedHistory
  );
  private historyItemsCount$ = this.store.select(
    OtherReceiptsSelector.selectHistoryItemsCount
  );
  private historyItems$ = this.store.select(
    OtherReceiptsSelector.selectHistoryItems
  );
  private isLoadingHistoryItems$ = this.store.select(
    OtherReceiptsSelector.selectIsLoadingHistoryItems
  );
  private isHistoryItemsLoaded$ = this.store.select(
    OtherReceiptsSelector.selectIsHistoryItemsLoaded
  );
  private isLoadingHistoryItemsTotalCount$ = this.store.select(
    OtherReceiptsSelector.selectIsLoadingHistoryItemsTotalCount
  );
  private isHistoryItemsTotalCountLoaded$ = this.store.select(
    OtherReceiptsSelector.selectIsHistoryItemsTotalCountLoaded
  );
  private historyItemsTotalCount$ = this.store.select(
    OtherReceiptsSelector.selectHistoryItemsTotalCount
  );

  // Image
  private isLoadingImage$ = this.store.select(
    OtherReceiptsSelector.selectIsLoadingImage
  );

  resetOtherReceiptListData() {
    this.store.dispatch(new OtherReceiptsActions.ResetReceiptsListData());
  }
  searchPendingReceiptsStocks(
    searchPendingpayload: OtherReceiptSearchPendingPayload
  ) {
    this.store.dispatch(
      new OtherReceiptsActions.SearchPendingReceipts(searchPendingpayload)
    );
  }

  searchClear() {
    this.store.dispatch(new OtherReceiptsActions.SearchClear());
  }

  loadOtherReceiptsCount() {
    this.store.dispatch(new OtherReceiptsActions.LoadReceiptsSTNCount());
  }

  loadReceiptList(loadReceiptListPayload: OtherReceiptLoadListItemsPayload) {
    this.store.dispatch(
      new OtherReceiptsActions.LoadRecieptList(loadReceiptListPayload)
    );
  }
  loadReceiptLoanList(
    loadReceiptListPayload: OtherReceiptLoadListItemsPayload
  ) {
    this.store.dispatch(
      new OtherReceiptsActions.LoadRecieptLoanList(loadReceiptListPayload)
    );
  }

  loadBinCodes(binGroupCode: string) {
    this.store.dispatch(new OtherReceiptsActions.LoadBinCodes(binGroupCode));
  }

  loadRemarks() {
    this.store.dispatch(new OtherReceiptsActions.LoadRemarks());
  }

  loadSelectedStock(otherReceiptStockPayLoad: OtherReceiptStockPayLoad) {
    this.store.dispatch(
      new OtherReceiptsActions.LoadSelectedStock(otherReceiptStockPayLoad)
    );
  }

  loadItemsTotalCount(
    loadItemsTotalCountPayload: OtherReceiptLoadItemsTotalCountPayload
  ) {
    this.store.dispatch(
      new OtherReceiptsActions.LoadItemsTotalCount(loadItemsTotalCountPayload)
    );
  }

  setSelectedDropDownForReceipts(selectedDropdownValue: string) {
    this.store.dispatch(
      new OtherReceiptsActions.DropDownvalueForReceipts(selectedDropdownValue)
    );
  }

  loadNonVerifiedItems(loadItemsPayload: OtherReceiptLoadItemsPayload) {
    this.store.dispatch(
      new OtherReceiptsActions.LoadNonVerifiedItems(loadItemsPayload)
    );
  }

  loadVerifiedItems(loadItemsPayload: OtherReceiptLoadItemsPayload) {
    this.store.dispatch(
      new OtherReceiptsActions.LoadVerifiedItems(loadItemsPayload)
    );
  }

  verifyItem(updateItemPayload: OtherReceiptUpdateItemPayload) {
    this.store.dispatch(new OtherReceiptsActions.VerifyItem(updateItemPayload));
  }

  updateItem(updateItemPayload: OtherReceiptUpdateItemPayload) {
    this.store.dispatch(new OtherReceiptsActions.UpdateItem(updateItemPayload));
  }

  verifyAllItems(updateAllItemsPayload: OtherReceiptUpdateAllItemsPayload) {
    this.store.dispatch(
      new OtherReceiptsActions.VerifyAllItems(updateAllItemsPayload)
    );
  }
  loadStuddedProductGroups() {
    this.store.dispatch(new OtherReceiptsActions.LoadStuddedProductGroups());
  }

  confirmStock(confirmStockReceivePayload: ConfirmStockReceivePayload) {
    this.store.dispatch(
      new OtherReceiptsActions.ConfirmStockReceive(confirmStockReceivePayload)
    );
  }
  adjustmentItemSearch(
    adjustmentSearchPayload: OtherReceiptAdjustmentSearchPayload
  ) {
    this.store.dispatch(
      new OtherReceiptsActions.AdjustmentSearch(adjustmentSearchPayload)
    );
  }
  printOtherIssue(printOtherIssuePayload: PrintOtherReceivePayload) {
    this.store.dispatch(
      new OtherReceiptsActions.PrintOtherReceives(printOtherIssuePayload)
    );
  }
  getPrintDataResponse() {
    return this.printDataResponse$;
  }
  clearItems() {
    this.store.dispatch(new OtherReceiptsActions.ClearItems());
  }
  addItemsToCart(item: AdjustmentItem[]) {
    this.store.dispatch(new OtherReceiptsActions.AddItemsToCart(item));
  }
  confirmAdjustementItems(
    confirmAdjustementItems: OtherReceiptConfirmAdjustmentItemsPayload
  ) {
    this.store.dispatch(
      new OtherReceiptsActions.ConfirmAdjustementItems(confirmAdjustementItems)
    );
  }
  removeAdjustementItem(item: AdjustmentItem) {
    this.store.dispatch(new OtherReceiptsActions.RemoveAdjustementItem(item));
  }
  updateAdjustementItem(
    updateAdjustementItem: OtherReceiptUpdateAdjustementItemPayload
  ) {
    this.store.dispatch(
      new OtherReceiptsActions.UpdateAdjustementItem(updateAdjustementItem)
    );
  }
  removeMultipleAdjustementItems(itemIds: string[]) {
    this.store.dispatch(
      new OtherReceiptsActions.RemoveMultipleAdjustementItems(itemIds)
    );
  }
  SearchAdjustmentCartItems(
    searchItems: OtherReceiptSearchCartItemAdjustmentPayload
  ) {
    this.store.dispatch(
      new OtherReceiptsActions.SearchCartItemsAdjustment(searchItems)
    );
  }
  clearSearchCartItemAdjustment() {
    this.store.dispatch(
      new OtherReceiptsActions.ClearSearchCartItemAdjustment()
    );
  }
  loadReceiptADJList(loadReceiptListPayload: OtherReceiptLoadListItemsPayload) {
    this.store.dispatch(
      new OtherReceiptsActions.LoadReceiptsADJList(loadReceiptListPayload)
    );
  }
  clearSearchInventoryItemAdjustment() {
    this.store.dispatch(
      new OtherReceiptsActions.ClearSearchInventoryItemAdjustment()
    );
  }
  psvItemSearch(psvSearchPayload: OtherReceiptAdjustmentSearchPayload) {
    this.store.dispatch(new OtherReceiptsActions.PSVSearch(psvSearchPayload));
  }
  addItemsToCartPSV(item: AdjustmentItem[]) {
    this.store.dispatch(new OtherReceiptsActions.AddItemsToCartPSV(item));
  }
  confirmPSVItems(confirmPSVItems: OtherReceiptConfirmAdjustmentItemsPayload) {
    this.store.dispatch(
      new OtherReceiptsActions.ConfirmPSVItems(confirmPSVItems)
    );
  }
  removePSVItem(item: AdjustmentItem) {
    this.store.dispatch(new OtherReceiptsActions.RemovePSVItem(item));
  }
  updatePSVItem(updatePSVItem: OtherReceiptUpdateAdjustementItemPayload) {
    this.store.dispatch(new OtherReceiptsActions.UpdatePSVItem(updatePSVItem));
  }
  removeMultiplePSVItems(itemIds: string[]) {
    this.store.dispatch(
      new OtherReceiptsActions.RemoveMultiplePSVItems(itemIds)
    );
  }
  SearchPSVCartItems(searchItems: OtherReceiptSearchCartItemAdjustmentPayload) {
    this.store.dispatch(
      new OtherReceiptsActions.SearchCartItemsPSV(searchItems)
    );
  }
  clearSearchCartItemPSV() {
    this.store.dispatch(new OtherReceiptsActions.ClearSearchCartItemPSV());
  }
  resetPSVReceiptData() {
    this.store.dispatch(new OtherReceiptsActions.ResetPSVReceiptData());
  }
  clearSearchInventoryItemPSV() {
    this.store.dispatch(new OtherReceiptsActions.ClearSearchInventoryItemPSV());
  }
  resetAdjustmentReceiptData() {
    this.store.dispatch(new OtherReceiptsActions.ResetAdjustmentReceiptData());
  }
  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getOtherReceiptsSTNCount() {
    return this.otherReceiptsSTNCount$;
  }

  getOtherReceiptList() {
    return this.receiptList$;
  }
  getOtherReceiptLoanList() {
    return this.receiptLoanList$;
  }

  getIsLoadingOtherReceiptSTN() {
    return this.isLoadingOtherReceiptsSTN$;
  }

  getIsSearchingStocks() {
    return this.isSearchingStocks$;
  }

  getHasSearchStockResults() {
    return this.hasSearchStockResults$;
  }

  getSearchStockResults() {
    return this.searchStockResults$;
  }

  assignBinToAllItems(
    updateAllItemsPayload: OtherReceiptUpdateAllItemsPayload
  ) {
    this.store.dispatch(
      new OtherReceiptsActions.AssignBinToAllItems(updateAllItemsPayload)
    );
  }

  getNonVerifiedItems() {
    return this.nonVerifiedItems$;
  }

  getVerifiedItems() {
    return this.verifiedItems$;
  }

  getIsNonVerifiedItemsLoading() {
    return this.isNonVerifiedItemsLoading$;
  }

  getIsVerifiedItemsLoading() {
    return this.isVerifiedItemsLoading$;
  }

  getItemsTotalCountLoaded() {
    return this.itemsTotalCountLoaded$;
  }

  getIsItemsTotalCountLoading() {
    return this.isItemsTotalCountLoading$;
  }

  getIsSearchingItems() {
    return this.isSearchingItems$;
  }

  getHasSearchedItems() {
    return this.hasSearchedItems$;
  }

  getBinCodes() {
    return this.binCodes$;
  }

  getRemarks() {
    return this.remarks$;
  }

  getSelectedStock() {
    return this.selectedStock$;
  }

  getNonVerifiedItemsTotalCount() {
    return this.nonVerifiedItemsTotalCount$;
  }

  getVerifiedItemsTotalCount() {
    return this.verifiedItemsTotalCount$;
  }

  getIsVerifyingAllItemSuccess() {
    return this.isVerifyingAllItemSuccess$;
  }

  getIsAssigningBinToAllItemsSuccess() {
    return this.isAssigningBinToAllItemsSuccess$;
  }

  getConfirmedStock() {
    return this.confirmedStock$;
  }

  getConfirmStockReceiveErrors() {
    return this.confirmStockReceiveErrors$;
  }

  getselectedStockLoadError() {
    return this.selectedStockLoadError$;
  }

  getIsAssigningBinToAllItems() {
    return this.isAssigningBinToAllItems$;
  }
  getOtherReceiptsDropdown() {
    return this.otherReceiptsDropDown$;
  }

  getSelectedDropDownvalue() {
    return this.getSelectedDropDownvalue$;
  }

  getTotalReceiptsElementCount() {
    return this.selectTotalReceiptCount$;
  }

  getError() {
    return this.error$;
  }

  getIsLoadingBinGroups() {
    return this.isLoadingBinGroups$;
  }

  getIsLoadingRemarks() {
    return this.isLoadingRemarks$;
  }

  getIsLoadingSelectedStock() {
    return this.isLoadingSelectedStock$;
  }

  getUpdateItemSuccess() {
    return this.updateItemSuccess$;
  }
  getAdjustmentSearchedItems() {
    return this.adjustmentSearchedItems$;
  }
  getItemsInCart() {
    return this.itemsInCart$;
  }
  getAdjustmentItemsSearchCount() {
    return this.adjustmentItemsSearchCount$;
  }
  getCartItemIds() {
    return this.cartItemsIds;
  }
  getConfirmAdjustementItemsResponse() {
    return this.confirmAdjustementItemsResponse;
  }
  getReceiptADJList() {
    return this.receiptADJList$;
  }

  getPSVSearchedItems() {
    return this.psvSearchedItems$;
  }
  getItemsInCartPSV() {
    return this.itemsInCartPSV$;
  }
  getPSVItemsSearchCount() {
    return this.psvItemsSearchCount$;
  }
  getConfirmPSVItemsResponse() {
    return this.confirmPSVItemsResponse;
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
  getHasSearchItemInCartSearchAdjustment() {
    return this.hasSearchItemInCartSearchAdjustment$;
  }
  getIsSearchingPSV() {
    return this.isSearchingPSV$;
  }
  gethasSearchedItemPSV() {
    return this.hasSearchedItemPSV$;
  }
  getIsLoadingPSV() {
    return this.IsLoadingPSV$;
  }
  getHasSearchItemInCartSearchPSV() {
    return this.hasSearchItemInCartSearchPSV$;
  }

  loadProductGroups() {
    this.store.dispatch(new OtherReceiptsActions.LoadProductGroups());
  }
  getProductGroups() {
    return this.productGroups$;
  }

  loadProductCategories() {
    this.store.dispatch(new OtherReceiptsActions.LoadProductCategories());
  }

  getProductCategories() {
    return this.productCategories$;
  }

  // Image
  getIsLoadingImage() {
    return this.isLoadingImage$;
  }

  setOtherReciptNonVerifiedFilter(filterData: { [key: string]: Filter[] }) {
    this.store.dispatch(
      new OtherReceiptsActions.SetFilterDataNonVerifiedProducts(filterData)
    );
  }
  setOtherReciptVerifiedFilter(filterData: { [key: string]: Filter[] }) {
    this.store.dispatch(
      new OtherReceiptsActions.SetFilterDataVerifiedProducts(filterData)
    );
  }
  getfilterDataNonVerifiedProducts() {
    return this.filterDataNonVerifiedProducts$;
  }
  getfilterDataVerifiedProducts() {
    return this.filterDataVerifiedProducts$;
  }

  setOtherReceiptNonVerifiedProductsSort(sortData: Column[]) {
    this.store.dispatch(
      new OtherReceiptsActions.SetSortDataNonVerifiedProducts(sortData)
    );
  }
  setOtherReceiptVerifiedProductsSort(sortData: Column[]) {
    this.store.dispatch(
      new OtherReceiptsActions.SetSortDataVerifiedProducts(sortData)
    );
  }

  getSortDataNonVerifiedProducts() {
    return this.sortDataNonVerifiedProducts$;
  }
  getSortDataVerifiedProducts() {
    return this.sortDataVerifiedProducts$;
  }
  getItemsCountNonVerified() {
    return this.itemsCountNonVerified$;
  }
  getItemsCountVerified() {
    return this.itemsCountVerified$;
  }
  getIsNonVerifiedItemsLoaded() {
    return this.selectIsNonVerifiedItemsLoaded$;
  }
  getIsVerifiedItemsLoaded() {
    return this.selectIsVerifiedItemsLoaded$;
  }
  getVerifyItemSuccess() {
    return this.selectVerifyItemSuccess$;
  }
  validateNonVerifiedItem(itemValidate: OtherReceiptItemValidate) {
    this.store.dispatch(
      new OtherReceiptsActions.ValidateNonVerifiedItem(itemValidate)
    );
  }
  validateVerifiedItem(itemValidate: OtherReceiptItemValidate) {
    this.store.dispatch(
      new OtherReceiptsActions.ValidateVerifiedItem(itemValidate)
    );
  }

  //HISTORY
  getOtherReceiptsHistory() {
    return this.otherReceiptsHistory$;
  }
  getIsLoadingReceiptsHistory() {
    return this.isLoadingOtherReceiptsHistory$;
  }
  getOtherReceiptsHistoryCount() {
    return this.otherReceiptsHistoryCount$;
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

  loadOtherReceiptsHistory(payload: LoadOtherReceiptsHistoryPayload) {
    this.store.dispatch(
      new OtherReceiptsActions.LoadOtherReceiptsHistory(payload)
    );
  }
  resetOtherReceiptHistory() {
    this.store.dispatch(new OtherReceiptsActions.ResetOtherReceiptsHistory());
  }
  loadSelectedHistory(id: number, transactionType: string) {
    this.store.dispatch(
      new OtherReceiptsActions.LoadSelectedHistory({
        id: id,
        transactionType: transactionType
      })
    );
  }
  loadSelectedHistoryItems(payload: LoadOtherReceiptsHistoryItemsPayload) {
    this.store.dispatch(
      new OtherReceiptsActions.LoadSelectedHistoryItems(payload)
    );
  }
  clearHistoryItems() {
    this.store.dispatch(new OtherReceiptsActions.ClearHistoryItems());
  }
  loadSelectedHistoryItemsTotalCount(
    payload: LoadOtherReceiptsHistoryItemsPayload
  ) {
    this.store.dispatch(
      new OtherReceiptsActions.LoadSelectedHistoryItemsTotalCount(payload)
    );
  }

  // Image
  loadThumbnailImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(
      new OtherReceiptsActions.LoadThumbnailImageUrl(payload)
    );
  }
  loadImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(new OtherReceiptsActions.LoadImageUrl(payload));
  }

  constructor(private store: Store<OtherReceiptState>) {}
}
