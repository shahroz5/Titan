import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as StockReceiveActions from './stock-receive.actions';
import { StockReceiveSelectors } from './stock-receive.selectors';
import { StockReceiveState } from './stock-receive.state';
import {
  StockReceiveItemValidate,
  StockReceiveLoadPendingPayload,
  StockReceiveSearchPendingPayload,
  StockReceiveLoadItemsTotalCountPayload,
  StockReceiveLoadItemsPayload,
  StockReceiveUpdateItemPayload,
  StockReceiveConfirmStockReceivePayload,
  StockReceiveUpdateAllItemsPayload,
  StockReceiveHistoryPayload,
  StockReceiveHistoryItemsPayload,
  AdvanceFilterPayload,
  StockReceiveAPITypesEnum,
  StockReceiveTotalMeasuredWeightPayload,
  ImageReqPayload
} from '@poss-web/shared/models';

/**
 * Stock Receive Facade for accesing Stock-Receive-State
 * */
@Injectable()
export class StockReceiveFacade {
  private pendingFactorySTN$ = this.store.select(
    StockReceiveSelectors.selectPendingFactorySTN
  );
  private pendingBoutiqueSTN$ = this.store.select(
    StockReceiveSelectors.selectPendingBoutiqueSTN
  );

  private pendingMerchandiseSTN$ = this.store.select(
    StockReceiveSelectors.selectPendingMerchandiseSTN
  );

  private pendingCFAInvoice$ = this.store.select(
    StockReceiveSelectors.selectPendingCFAInvoice
  );
  private selectedStock$ = this.store.select(
    StockReceiveSelectors.selectSelectedStock
  );
  private selectedInvoice$ = this.store.select(
    StockReceiveSelectors.selectSelectedInvoice
  );

  private error$ = this.store.select(StockReceiveSelectors.selectError);

  private isLoadingPendingFactorySTN$ = this.store.select(
    StockReceiveSelectors.selectIsLoadingPendingFactorySTN
  );
  private isLoadingPendingBoutiqueSTN$ = this.store.select(
    StockReceiveSelectors.selectIsLoadingPendingBoutiqueSTN
  );

  private isLoadingPendingMerchandiseSTN$ = this.store.select(
    StockReceiveSelectors.selectIsLoadingPendingMerchandiseSTN
  );

  private isLoadingPendingCFAInvoice$ = this.store.select(
    StockReceiveSelectors.selectIsLoadingPendingCFAInvoice
  );

  private isSearchingStocks$ = this.store.select(
    StockReceiveSelectors.selectIsSearchingStocks
  );
  private hasSearchStockResults$ = this.store.select(
    StockReceiveSelectors.selectHasSearchStockResults
  );
  private isSearchingInvoices$ = this.store.select(
    StockReceiveSelectors.selectIsSearchingInvoices
  );
  private hasSearchInvoiceResults$ = this.store.select(
    StockReceiveSelectors.selectHasSearchInvoiceResults
  );

  private searchStockResults$ = this.store.select(
    StockReceiveSelectors.selectSearchStockResults
  );
  private searchInvoiceResults$ = this.store.select(
    StockReceiveSelectors.selectSearchInvoiceResults
  );
  private totalCounts$ = this.store.select(
    StockReceiveSelectors.selectTotalCounts
  );
  private isItemsTotalCountLoading$ = this.store.select(
    StockReceiveSelectors.selectIsItemsTotalCountLoading
  );
  private isLoadingSelectedStock$ = this.store.select(
    StockReceiveSelectors.selectIsLoadingSelectedStock
  );
  private itemsTotalCountLoaded$ = this.store.select(
    StockReceiveSelectors.selectisItemsTotalCountLoaded
  );
  private items$ = this.store.select(StockReceiveSelectors.selectItems);
  private itemsLoading$ = this.store.select(
    StockReceiveSelectors.selectIsItemsLoading
  );

  private confirmedStock$ = this.store.select(
    StockReceiveSelectors.selectConfirmedStock
  );

  private isConfirmStockReceiveSuccess$ = this.store.select(
    StockReceiveSelectors.selectIsConfirmStockReceiveSuccess
  );
  private isConfirmingStockReceive$ = this.store.select(
    StockReceiveSelectors.selectIsConfirmingStockReceive
  );

  private verifyItemSuccess$ = this.store.select(
    StockReceiveSelectors.selectVerifyItemSuccess
  );

  private updateItemSuccess$ = this.store.select(
    StockReceiveSelectors.selectUpdateItemSuccess
  );

  private isItemsLoaded$ = this.store.select(
    StockReceiveSelectors.selectIsItemsLoaded
  );

  private itemsCount$ = this.store.select(
    StockReceiveSelectors.selectItemsCount
  );

  private isVerifyingAllItem$ = this.store.select(
    StockReceiveSelectors.selectIsVerifyingAllItem
  );

  private isVerifyingAllItemSuccess$ = this.store.select(
    StockReceiveSelectors.selectIsVerifyingAllItemSuccess
  );

  private isAssigningBinToAllItems$ = this.store.select(
    StockReceiveSelectors.selectIsAssigningBinToAllItems
  );

  private isAssigningBinToAllItemsSuccess$ = this.store.select(
    StockReceiveSelectors.selectIsAssigningBinToAllItemsSuccess
  );

  private binCodes$ = this.store.select(StockReceiveSelectors.selectBinCodes);
  private remarks$ = this.store.select(StockReceiveSelectors.selectRemarks);

  private isLoadingBinGroups$ = this.store.select(
    StockReceiveSelectors.selectIsLoadingBinGroups
  );
  private isLoadingRemarks$ = this.store.select(
    StockReceiveSelectors.selectIsLoadingRemarks
  );

  private productGroups$ = this.store.select(
    StockReceiveSelectors.selectProductGroups
  );

  private isLoadingProductGroups$ = this.store.select(
    StockReceiveSelectors.selectIsLoadingProductGroups
  );

  private productCategories$ = this.store.select(
    StockReceiveSelectors.selectProductCategories
  );

  private isLoadingProductCategories$ = this.store.select(
    StockReceiveSelectors.selectIsLoadingProductCategories
  );

  private searchReset$ = this.store.select(
    StockReceiveSelectors.selectSearchReset
  );
  private stockReceiveHistory$ = this.store.select(
    StockReceiveSelectors.selectStockReceiveHistory
  );
  private isLoadingHistory$ = this.store.select(
    StockReceiveSelectors.selectIsLoadingStockReceiveHistory
  );
  private historyTotalElements$ = this.store.select(
    StockReceiveSelectors.selectHistoryTotalElements
  );
  private historyType$ = this.store.select(
    StockReceiveSelectors.selectHistoryType
  );
  private advancedFilter$ = this.store.select(
    StockReceiveSelectors.selectAdvancedFilterData
  );

  private oracleFetchInfo$ = this.store.select(
    StockReceiveSelectors.selectOracleFetchInfo
  );

  private totalMeasuredWeight$ = this.store.select(
    StockReceiveSelectors.selectTotalMeasuredWeight
  );

  // Image
  private isLoadingImage$ = this.store.select(
    StockReceiveSelectors.selectIsLoadingImage
  );

  constructor(private store: Store<StockReceiveState>) {}

  /**
   * Access for the State selectors
   */

  getOracleFetchInfo() {
    return this.oracleFetchInfo$;
  }

  getPendingFactorySTN() {
    return this.pendingFactorySTN$;
  }

  getPendingBoutiqueSTN() {
    return this.pendingBoutiqueSTN$;
  }

  getPendingMerchandiseSTN() {
    return this.pendingMerchandiseSTN$;
  }

  getPendingCFAInvoice() {
    return this.pendingCFAInvoice$;
  }

  getSearchStockResults() {
    return this.searchStockResults$;
  }

  getSearchInvoiceResults() {
    return this.searchInvoiceResults$;
  }

  getIsLoadingPendingFactorySTN() {
    return this.isLoadingPendingFactorySTN$;
  }

  getIsLoadingPendingBoutiqueSTN() {
    return this.isLoadingPendingBoutiqueSTN$;
  }

  getILoadingPendingMerchandiseSTN() {
    return this.isLoadingPendingMerchandiseSTN$;
  }

  getIsLoadingPendingCFAInvoice() {
    return this.isLoadingPendingCFAInvoice$;
  }

  getIsSearchingStocks() {
    return this.isSearchingStocks$;
  }
  getHasSearchStockResults() {
    return this.hasSearchStockResults$;
  }
  getIsSearchingInvoices() {
    return this.isSearchingInvoices$;
  }
  getHasSearchInvoiceResults() {
    return this.hasSearchInvoiceResults$;
  }

  getError() {
    return this.error$;
  }

  getIsLoadingSelectedStock() {
    return this.isLoadingSelectedStock$;
  }

  getSelectedStock() {
    return this.selectedStock$;
  }

  getSelectedInvoice() {
    return this.selectedInvoice$;
  }

  getTotalCounts() {
    return this.totalCounts$;
  }

  getIsItemsTotalCountLoading() {
    return this.isItemsTotalCountLoading$;
  }

  getItemsTotalCountLoaded() {
    return this.itemsTotalCountLoaded$;
  }

  getItems() {
    return this.items$;
  }

  getIsItemsLoading() {
    return this.itemsLoading$;
  }

  getVerifyItemSuccess() {
    return this.verifyItemSuccess$;
  }
  getUpdateItemSuccess() {
    return this.updateItemSuccess$;
  }

  getItemsCount() {
    return this.itemsCount$;
  }

  getBinCodes() {
    return this.binCodes$;
  }

  getRemarks() {
    return this.remarks$;
  }

  getIsItemsLoaded() {
    return this.isItemsLoaded$;
  }

  getIsLoadingBinGroups() {
    return this.isLoadingBinGroups$;
  }

  getIsLoadingRemarks() {
    return this.isLoadingRemarks$;
  }

  getProductGroups() {
    return this.productGroups$;
  }
  getIsLoadingProductGroups() {
    return this.isLoadingProductGroups$;
  }

  getProductCategories() {
    return this.productCategories$;
  }
  getIsLoadingProductCategories() {
    return this.isLoadingProductCategories$;
  }

  getConfirmedStock() {
    return this.confirmedStock$;
  }

  getIsConfirmStockReceiveSuccess() {
    return this.isConfirmStockReceiveSuccess$;
  }

  getIsConfirmingStockReceive() {
    return this.isConfirmingStockReceive$;
  }

  getIsVerifyingAllItem() {
    return this.isVerifyingAllItem$;
  }

  getIsVerifyingAllItemSuccess() {
    return this.isVerifyingAllItemSuccess$;
  }

  getIsAssigningBinToAllItems() {
    return this.isAssigningBinToAllItems$;
  }

  getIsAssigningBinToAllItemsSuccess() {
    return this.isAssigningBinToAllItemsSuccess$;
  }

  getSearchReset() {
    return this.searchReset$;
  }
  //history
  getStockReceiveHistory() {
    return this.stockReceiveHistory$;
  }
  getIsLoadingHistory() {
    return this.isLoadingHistory$;
  }
  getHistoryTotalElements() {
    return this.historyTotalElements$;
  }
  getHistoryType() {
    return this.historyType$;
  }
  getAdvancedFilter() {
    return this.advancedFilter$;
  }
  getTotalMeasuredWeight() {
    return this.totalMeasuredWeight$;
  }
  // Image
  getIsLoadingImage() {
    return this.isLoadingImage$;
  }

  /**
   * Dispatch Action for loading STN from Factory (L1/L2)
   * @param loadPendingSTNPayload payload with transfer type , pageIndex and pageSize
   */
  loadPendingFactorySTN(loadPendingPayload: StockReceiveLoadPendingPayload) {
    this.store.dispatch(
      new StockReceiveActions.LoadPendingFactorySTN(loadPendingPayload)
    );
  }

  /**
   * Dispatch Action for loading STN from other Boutiques (L1/L2)
   * @param loadPendingSTNPayload payload with transfer type , pageIndex and pageSize
   */
  loadPendingBoutiqueSTN(loadPendingPayload: StockReceiveLoadPendingPayload) {
    this.store.dispatch(
      new StockReceiveActions.LoadPendingBoutiqueSTN(loadPendingPayload)
    );
  }

  loadPendingMerchandiseSTN(
    loadPendingPayload: StockReceiveLoadPendingPayload
  ) {
    this.store.dispatch(
      new StockReceiveActions.LoadPendingMerchandiseSTN(loadPendingPayload)
    );
  }

  /**
   * Dispatch Action for loading invoice from cfa (L3)
   * @param loadPendingSTNPayload payload with transfer type , pageIndex and pageSize
   */
  loadPendingCFAInvoice(loadPendingPayload: StockReceiveLoadPendingPayload) {
    this.store.dispatch(
      new StockReceiveActions.LoadPendingCFAInvoice(loadPendingPayload)
    );
  }

  /**
   * Dispatch Action for search based on srcDoc number and transfer type (L1/L2)
   * @param searchPendingpayload payload with srcDoc number and transfer type
   */
  searchPendingStocks(searchPendingpayload: StockReceiveSearchPendingPayload) {
    this.store.dispatch(
      new StockReceiveActions.SearchPendingStocks(searchPendingpayload)
    );
  }

  fetchSTNFromOracle(stn: number, type: StockReceiveAPITypesEnum) {
    this.store.dispatch(
      new StockReceiveActions.FetchSTNFromOracle({ stn, type })
    );
  }

  fetchInvoiceFromOracle(invoiceNo: number, type: StockReceiveAPITypesEnum) {
    this.store.dispatch(
      new StockReceiveActions.FetchInvoiceFromOracle({ invoiceNo, type })
    );
  }

  /**
   * Dispatch Action for search based on srcDoc number and transfer type (L3)
   * @param searchPendingpayload payload with srcDoc number and transfer type
   */
  searchPendingInvoices(
    searchPendingpayload: StockReceiveSearchPendingPayload
  ) {
    this.store.dispatch(
      new StockReceiveActions.SearchPendingInvoices(searchPendingpayload)
    );
  }

  /**
   * Dispatch Action for Clearing search results
   */
  searchClear() {
    this.store.dispatch(new StockReceiveActions.SearchClear());
  }

  clearSearchResult() {
    this.store.dispatch(new StockReceiveActions.ClearSearchResult());
  }

  /**
   * Dispatch Action for getting selected Stocks  (L1/L2)
   */
  loadSelectedStock(data: {
    id: string;
    type: string;
    historyAPIType?: string;
  }) {
    this.store.dispatch(new StockReceiveActions.LoadSelectedStock(data));
  }

  /**
   * Dispatch Action for getting selected Invoice (L3)
   */
  loadSelectedInvoice(data: {
    id: string;
    type: string;
    historyAPIType?: string;
  }) {
    this.store.dispatch(new StockReceiveActions.LoadSelectedInvoice(data));
  }

  // get total measured weight
  loadTotalMeasuredWeight(payload: StockReceiveTotalMeasuredWeightPayload) {
    this.store.dispatch(new StockReceiveActions.GetTotalMeasuredWeight(payload));
  }
  // for verify items

  loadItemsTotalCount(
    loadItemsTotalCountPayload: StockReceiveLoadItemsTotalCountPayload
  ) {
    this.store.dispatch(
      new StockReceiveActions.LoadItemsTotalCount(loadItemsTotalCountPayload)
    );
  }

  loadItems(loadItemsPayload: StockReceiveLoadItemsPayload) {
    this.store.dispatch(new StockReceiveActions.LoadItems(loadItemsPayload));
  }

  loadBinCodes(binGroupCode: string) {
    this.store.dispatch(new StockReceiveActions.LoadBinCodes(binGroupCode));
  }

  loadRemarks() {
    this.store.dispatch(new StockReceiveActions.LoadRemarks());
  }

  verifyItem(updateItemPayload: StockReceiveUpdateItemPayload) {
    this.store.dispatch(new StockReceiveActions.VerifyItem(updateItemPayload));
  }

  updateItem(updateItemPayload: StockReceiveUpdateItemPayload) {
    this.store.dispatch(new StockReceiveActions.UpdateItem(updateItemPayload));
  }

  validateItem(itemValidate: StockReceiveItemValidate) {
    this.store.dispatch(new StockReceiveActions.ValidateItem(itemValidate));
  }

  resetError() {
    this.store.dispatch(new StockReceiveActions.ResetError());
  }

  clearStocks() {
    this.store.dispatch(new StockReceiveActions.ClearStocks());
  }

  confirmStock(
    confirmStockReceivePayload: StockReceiveConfirmStockReceivePayload
  ) {
    this.store.dispatch(
      new StockReceiveActions.ConfirmStockReceive(confirmStockReceivePayload)
    );
  }

  verifyAllItems(updateAllItemsPayload: StockReceiveUpdateAllItemsPayload) {
    this.store.dispatch(
      new StockReceiveActions.VerifyAllItems(updateAllItemsPayload)
    );
  }

  assignBinToAllItems(
    updateAllItemsPayload: StockReceiveUpdateAllItemsPayload
  ) {
    this.store.dispatch(
      new StockReceiveActions.AssignBinToAllItems(updateAllItemsPayload)
    );
  }

  loadProductGroups() {
    this.store.dispatch(new StockReceiveActions.LoadProductGroups());
  }

  loadStuddedProductGroups() {
    this.store.dispatch(new StockReceiveActions.LoadStuddedProductGroups());
  }

  loadProductCategories() {
    this.store.dispatch(new StockReceiveActions.LoadProductCategories());
  }

  clearItems() {
    this.store.dispatch(new StockReceiveActions.ClearItems());
  }
  //history
  loadStockReceiveHistory(
    stockReceiveHistoryPayload: StockReceiveHistoryPayload
  ) {
    this.store.dispatch(
      new StockReceiveActions.LoadStockReceiveHistory(
        stockReceiveHistoryPayload
      )
    );
  }
  loadStockReceiveInvoiceHistory(
    stockReceiveInvoiceHistoryPayload: StockReceiveHistoryPayload
  ) {
    this.store.dispatch(
      new StockReceiveActions.LoadStockReceiveInvoiceHistory(
        stockReceiveInvoiceHistoryPayload
      )
    );
  }
  loadStockReceiveHistoryItems(
    stockReceiveInvoiceHistoryPayload: StockReceiveHistoryItemsPayload
  ) {
    this.store.dispatch(
      new StockReceiveActions.LoadStockReceiveHistoryItems(
        stockReceiveInvoiceHistoryPayload
      )
    );
  }
  resetStockReceiveHistory() {
    this.store.dispatch(new StockReceiveActions.ResetStockReceiveHistory());
  }
  storeHistoryType(historyType?: string) {
    this.store.dispatch(new StockReceiveActions.StoreHistoryType(historyType));
  }
  storeAdvancedFilterData(advancedFilter: AdvanceFilterPayload) {
    this.store.dispatch(
      new StockReceiveActions.StoreAdvancedFilterData(advancedFilter)
    );
  }
  resetAdvanceFilter(businessDate) {
    this.store.dispatch(
      new StockReceiveActions.ResetAdvanceFilter(businessDate)
    );
  }
  // Image
  loadThumbnailImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(
      new  StockReceiveActions.LoadThumbnailImageUrl(payload)
    );
  }
  loadImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(new  StockReceiveActions.LoadImageUrl(payload));
  }
}
