import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AdvancedFilterData,
  BinToBinFileUploadItemsBulkTransferRequest,
  BinToBinTransferChangeSelectionPayload,
  BinToBinTransferConfirmTransferAllItemsRequest,
  BinToBinTransferConfirmTransferItemsRequest,
  BinToBinTransferItem,
  BinToBinTransferLoadFileUploadItemsRequest,
  BinToBinTransferLoadHistoryItemsPayload,
  BinToBinTransferLoadItemGroupsPayload,
  BinToBinTransferLoadItemsPayload,
  BinToBinTransferUpdateDestinationBinPayload,
  ImageReqPayload,
  LoadBinToBinTransferHistoryPayload,
  LoadSelectedBinToBinHeaderInfoPayload
} from '@poss-web/shared/models';
import * as BinToBinTransferActions from './bin-to-bin-transfer-actions';
import { binToBinTransferSelectors } from './bin-to-bin-transfer.selectors';
import { BinToBinTransferState } from './bin-to-bin-transfer.state';

@Injectable()
export class BinToBinTransferFacade {
  private error$ = this.store.select(binToBinTransferSelectors.selectError);

  private sourceBins$ = this.store.select(
    binToBinTransferSelectors.selectSourceBins
  );

  private sourceBinsTotalCount$ = this.store.select(
    binToBinTransferSelectors.selectSourceBinsTotalCount
  );

  private productCategory$ = this.store.select(
    binToBinTransferSelectors.selectProductCategory
  );

  private productCategoryTotalCount$ = this.store.select(
    binToBinTransferSelectors.selectProductCategoryTotalCount
  );

  private productGroups$ = this.store.select(
    binToBinTransferSelectors.selectProductGroups
  );

  private productGroupsTotalCount$ = this.store.select(
    binToBinTransferSelectors.selectProductGroupsTotalCount
  );

  private searchedItemListGroups$ = this.store.select(
    binToBinTransferSelectors.selectSearchedItemListGroups
  );

  private searchedItemListGroupsTotalCount$ = this.store.select(
    binToBinTransferSelectors.selectSearchedItemListGroupsTotalCount
  );

  private isLoadingItemListGroup$ = this.store.select(
    binToBinTransferSelectors.selectIsLoadingItemListGroup
  );

  private selectedItemListGroup$ = this.store.select(
    binToBinTransferSelectors.selectSelectedItemListGroup
  );
  private isLoadingSelectedItemListGroupSuccess$ = this.store.select(
    binToBinTransferSelectors.selectIsLoadingSelectedItemListGroupSuccess
  );

  private searchedItemList$ = this.store.select(
    binToBinTransferSelectors.selectSearchedItemList
  );

  private isSearchingItems$ = this.store.select(
    binToBinTransferSelectors.selectIsSearchingItems
  );

  private hasSearchedItems$ = this.store.select(
    binToBinTransferSelectors.selectHasSearchedItems
  );

  private itemList$ = this.store.select(
    binToBinTransferSelectors.selectItemList
  );

  private isLoadingItems$ = this.store.select(
    binToBinTransferSelectors.selectIsLoadingItems
  );

  private itemsTotalCount$ = this.store.select(
    binToBinTransferSelectors.selectItemsTotalCount
  );

  private isLoadingItemsSuccess$ = this.store.select(
    binToBinTransferSelectors.selectIsLoadingItemsSuccess
  );

  private confirmTransferResponse$ = this.store.select(
    binToBinTransferSelectors.selectConfirmTransferResponse
  );

  private bins$ = this.store.select(binToBinTransferSelectors.selectBins);

  private isLoadingBins$ = this.store.select(
    binToBinTransferSelectors.selectIsLoadingBins
  );

  private productGroupOptions$ = this.store.select(
    binToBinTransferSelectors.selectProductGroupOptions
  );

  private isLoadingProductGroupOptions$ = this.store.select(
    binToBinTransferSelectors.selectIsLoadingProductGroupOptions
  );

  private productCategoryOptions$ = this.store.select(
    binToBinTransferSelectors.selectProductCategoryOptions
  );

  private isLoadingProductCategoryOptions$ = this.store.select(
    binToBinTransferSelectors.selectIsLoadingProductCategoryOptions
  );
  private soruceBinOptions$ = this.store.select(
    binToBinTransferSelectors.selectSoruceBinOptions
  );

  private isLoadingSoruceBinOptionsOptions$ = this.store.select(
    binToBinTransferSelectors.selectIsLoadingSoruceBinOptionsOptions
  );

  private binToBinHistory$ = this.store.select(
    binToBinTransferSelectors.selectbinToBinHistory
  );
  private isLoadingHistory$ = this.store.select(
    binToBinTransferSelectors.selectIsLoadingBinToBinHistory
  );
  private binToBinHistoryCount$ = this.store.select(
    binToBinTransferSelectors.selectBinToBinHistoryCount
  );
  private isLoadingSelectedHistory$ = this.store.select(
    binToBinTransferSelectors.selectIsLoadingSelectedHistory
  );
  private selectedHistory$ = this.store.select(
    binToBinTransferSelectors.selectSelectedHistory
  );
  private hasSelectedHistory$ = this.store.select(
    binToBinTransferSelectors.selectHasSelectedHistory
  );
  private historyFilterData$ = this.store.select(
    binToBinTransferSelectors.selectHistoryFilterData
  );

  private itemsTotalValue$ = this.store.select(
    binToBinTransferSelectors.selectItemsTotalValue
  );
  private itemsTotalQuantity$ = this.store.select(
    binToBinTransferSelectors.selectItemsTotalQuantity
  );

  private binToBinAllowedtotalQuantity$ = this.store.select(
    binToBinTransferSelectors.selectBinToBinAllowedtotalQuantity
  );

  private binToBinAllowedItems$ = this.store.select(
    binToBinTransferSelectors.selectBinToBinAllowedtotalItems
  );

  private binToBinAllowedtotalValue$ = this.store.select(
    binToBinTransferSelectors.selectBinToBinAllowedtotalValue
  );

  private isLoadingImage$ = this.store.select(
    binToBinTransferSelectors.selectIsLoadingImage
  );

  private invalidItems$ = this.store.select(
    binToBinTransferSelectors.selectInvalidItems
  );

  private notInStockItems$ = this.store.select(
    binToBinTransferSelectors.selectNotInStockItems
  );

  private defectTypeList$ = this.store.select(
    binToBinTransferSelectors.selectDefectTypeList
  );

  private defectCodeList$ = this.store.select(
    binToBinTransferSelectors.selectDefectCodeList
  );

  constructor(private store: Store<BinToBinTransferState>) {}

  getBins() {
    return this.bins$;
  }
  getIsLoadingBins() {
    return this.isLoadingBins$;
  }

  getError() {
    return this.error$;
  }

  getSourceBins() {
    return this.sourceBins$;
  }

  getSourceBinsTotalCount() {
    return this.sourceBinsTotalCount$;
  }

  getProductCategory() {
    return this.productCategory$;
  }

  getProductCategoryTotalCount() {
    return this.productCategoryTotalCount$;
  }

  getProductGroups() {
    return this.productGroups$;
  }

  getProductGroupsTotalCount() {
    return this.productGroupsTotalCount$;
  }

  getSelectedItemListGroup() {
    return this.selectedItemListGroup$;
  }

  getIsLoadingSelectedItemListGroupSuccess() {
    return this.isLoadingSelectedItemListGroupSuccess$;
  }

  getSearchedItemListGroups() {
    return this.searchedItemListGroups$;
  }

  getSearchedItemListGroupsTotalCount() {
    return this.searchedItemListGroupsTotalCount$;
  }

  getIsLoadingItemListGroup() {
    return this.isLoadingItemListGroup$;
  }

  getItemList() {
    return this.itemList$;
  }

  getIsLoadingItemsSuccess() {
    return this.isLoadingItemsSuccess$;
  }

  getSearchedItemList() {
    return this.searchedItemList$;
  }
  getIsSearchingItems() {
    return this.isSearchingItems$;
  }

  getHasSearchedItems() {
    return this.hasSearchedItems$;
  }

  getIsLoadingItems() {
    return this.isLoadingItems$;
  }

  getItemsTotalCount() {
    return this.itemsTotalCount$;
  }

  getConfirmTransferResponse() {
    return this.confirmTransferResponse$;
  }
  getProductGroupOptions() {
    return this.productGroupOptions$;
  }
  getIsLoadingProductGroupOptions() {
    return this.isLoadingProductGroupOptions$;
  }
  getProductCategoryOptions() {
    return this.productCategoryOptions$;
  }
  getIsLoadingProductCategoryOptions() {
    return this.isLoadingProductCategoryOptions$;
  }

  getSoruceBinOptions() {
    return this.soruceBinOptions$;
  }
  getIsLoadingSoruceBinOptionsOptions() {
    return this.isLoadingSoruceBinOptionsOptions$;
  }
  getBinToBinHistory() {
    return this.binToBinHistory$;
  }
  getIsBinToBinHistoryLoading() {
    return this.isLoadingHistory$;
  }
  getBinToBinHistoryCount() {
    return this.binToBinHistoryCount$;
  }
  getSelectedHistory() {
    return this.selectedHistory$;
  }
  getIsLoadingSelectedHistory() {
    return this.isLoadingSelectedHistory$;
  }
  getHasSelectedHistory() {
    return this.hasSelectedHistory$;
  }
  getItemsTotalValue() {
    return this.itemsTotalValue$;
  }
  getItemsTotalQuantity() {
    return this.itemsTotalQuantity$;
  }
  getBinToBinAllowedtotalQuantity() {
    return this.binToBinAllowedtotalQuantity$;
  }
  getBinToBinAllowedItems() {
    return this.binToBinAllowedItems$;
  }
  getBinToBinAllowedtotalValue() {
    return this.binToBinAllowedtotalValue$;
  }
  // Image
  getIsLoadingImage() {
    return this.isLoadingImage$;
  }

  getInvalidItems() {
    return this.invalidItems$;
  }

  getNotInStockItems() {
    return this.notInStockItems$;
  }

  getDefectTypeDescriptionList() {
    return this.defectTypeList$;
  }

  getDefectCodeDescriptionList() {
    return this.defectCodeList$;
  }

  loadHistoryFilterData(data: AdvancedFilterData) {
    this.store.dispatch(
      new BinToBinTransferActions.LoadHistoryFilterData(data)
    );
  }
  getHistoryFilterData() {
    return this.historyFilterData$;
  }
  loadBins() {
    this.store.dispatch(new BinToBinTransferActions.LoadBins());
  }

  addToItemList(items: BinToBinTransferItem[]) {
    this.store.dispatch(new BinToBinTransferActions.AddToItemList(items));
  }

  updateItemList(item: BinToBinTransferItem) {
    this.store.dispatch(new BinToBinTransferActions.UpdateItemList(item));
  }

  deleteFromItemList(itemId: string) {
    this.store.dispatch(new BinToBinTransferActions.DeleteFromItemList(itemId));
  }

  changeSelectionOfAllItems(
    changeSelectionPayload: BinToBinTransferChangeSelectionPayload
  ) {
    this.store.dispatch(
      new BinToBinTransferActions.ChangeSelectionOfAllItems(
        changeSelectionPayload
      )
    );
  }
  updateDestinationBinForSelectedItems(
    updateDestinationBinPayload: BinToBinTransferUpdateDestinationBinPayload
  ) {
    this.store.dispatch(
      new BinToBinTransferActions.UpdateDestinationBinForSelectedItems(
        updateDestinationBinPayload
      )
    );
  }
  deleteSelectedItems(idList: string[]) {
    this.store.dispatch(
      new BinToBinTransferActions.DeleteSelectedItems(idList)
    );
  }

  loadSourceBins(loadItemGroupsPayload: BinToBinTransferLoadItemGroupsPayload) {
    this.store.dispatch(
      new BinToBinTransferActions.LoadSourceBins(loadItemGroupsPayload)
    );
  }
  loadStuddedProductGroups() {
    this.store.dispatch(new BinToBinTransferActions.LoadStuddedProductGroups());
  }

  loadProductsCategory(
    loadItemGroupsPayload: BinToBinTransferLoadItemGroupsPayload
  ) {
    this.store.dispatch(
      new BinToBinTransferActions.LoadProductsCategory(loadItemGroupsPayload)
    );
  }

  loadProductsGroups(
    loadItemGroupsPayload: BinToBinTransferLoadItemGroupsPayload
  ) {
    this.store.dispatch(
      new BinToBinTransferActions.LoadProductsGroups(loadItemGroupsPayload)
    );
  }

  clearItemsGroups() {
    this.store.dispatch(new BinToBinTransferActions.ClearItemsGroups());
  }

  loadItemGroup(loadItemGroupsPayload: BinToBinTransferLoadItemGroupsPayload) {
    this.store.dispatch(
      new BinToBinTransferActions.LoadItemGroup(loadItemGroupsPayload)
    );
  }

  clearSelectedItemGroup() {
    this.store.dispatch(new BinToBinTransferActions.ClearSelectedItemGroup());
  }

  searchItemGroups(
    loadItemGroupsPayload: BinToBinTransferLoadItemGroupsPayload
  ) {
    this.store.dispatch(
      new BinToBinTransferActions.SearchItemGroups(loadItemGroupsPayload)
    );
  }

  loadItems(loadItemsPayload: BinToBinTransferLoadItemsPayload) {
    this.store.dispatch(
      new BinToBinTransferActions.LoadItems(loadItemsPayload)
    );
  }

  loadFileUploadItems(payload: FormData) {
    this.store.dispatch(
      new BinToBinTransferActions.LoadFileUploadId(payload)
    );
  }

  loadFileUploadItemsList(payload: BinToBinTransferLoadFileUploadItemsRequest) {
    this.store.dispatch(
      new BinToBinTransferActions.LoadFileUploadItems(payload)
    );
  }

  searchItems(loadItemsPayload: BinToBinTransferLoadItemsPayload) {
    this.store.dispatch(
      new BinToBinTransferActions.SearchItems(loadItemsPayload)
    );
  }

  loadProductGroupOptions() {
    this.store.dispatch(new BinToBinTransferActions.LoadProductGroupOptions());
  }

  loadProductCategoryOptions() {
    this.store.dispatch(
      new BinToBinTransferActions.LoadProductCategoryOptions()
    );
  }

  loadSourceBinOptions() {
    this.store.dispatch(new BinToBinTransferActions.LoadSourceBinOptions());
  }

  confirmTransferItems(
    confirmTransferItemsRequest: BinToBinTransferConfirmTransferItemsRequest
  ) {
    this.store.dispatch(
      new BinToBinTransferActions.ConfirmTransferItems(
        confirmTransferItemsRequest
      )
    );
  }

  confirmFileUploadItemsBulkTransfer(payload: BinToBinFileUploadItemsBulkTransferRequest) {
    this.store.dispatch(
      new BinToBinTransferActions.ConfirmFileUploadItemsBulkTransfer(
        payload
      )
    );
  }

  confirmTransferAllItems(
    confirmTransferAllItemsRequest: BinToBinTransferConfirmTransferAllItemsRequest
  ) {
    this.store.dispatch(
      new BinToBinTransferActions.ConfirmTransferAllItems(
        confirmTransferAllItemsRequest
      )
    );
  }

  clearConfirmTransferResponse() {
    this.store.dispatch(
      new BinToBinTransferActions.ClearConfirmTransferResponse()
    );
  }

  clearSearchedItems() {
    this.store.dispatch(new BinToBinTransferActions.ClearSearchedItems());
  }

  clearItems() {
    this.store.dispatch(new BinToBinTransferActions.ClearItems());
  }

  loadBinToBinHistory(historyPayload: LoadBinToBinTransferHistoryPayload) {
    this.store.dispatch(
      new BinToBinTransferActions.LoadBinToBinHistory(historyPayload)
    );
  }
  resetLoadedHistory() {
    this.store.dispatch(new BinToBinTransferActions.ResetLoadedHistory());
  }
  loadSelectedHistory(payload: LoadSelectedBinToBinHeaderInfoPayload) {
    this.store.dispatch(
      new BinToBinTransferActions.LoadSelectedHistory(payload)
    );
  }
  loadHistoryItems(loadItemsPayload: BinToBinTransferLoadHistoryItemsPayload) {
    this.store.dispatch(
      new BinToBinTransferActions.LoadHistoryItems(loadItemsPayload)
    );
  }
  resetAdvanceFilter(businessDay: number) {
    this.store.dispatch(
      new BinToBinTransferActions.ResetHstoryFilter(businessDay)
    );
  }
  // Image
  loadThumbnailImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(
      new BinToBinTransferActions.LoadThumbnailImageUrl(payload)
    );
  }
  loadImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(new BinToBinTransferActions.LoadImageUrl(payload));
  }

  loadDefectTypeDescription(payload?: string) {
    this.store.dispatch(new BinToBinTransferActions.LoadDefectType(payload));
  }

  loadDefectCodeDescription(payload?: string) {
    this.store.dispatch(new BinToBinTransferActions.LoadDefectCode(payload));
  }
}
