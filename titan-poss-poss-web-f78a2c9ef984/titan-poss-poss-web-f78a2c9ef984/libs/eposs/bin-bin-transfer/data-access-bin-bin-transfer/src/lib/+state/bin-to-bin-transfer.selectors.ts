import {
  itemSelector,
  itemListGroupSelector,
  binToBinHistorySelector
} from './bin-to-bin-transfer.entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import {
  BinToBinTransferState,
  binToBinTransferFeatureKey
} from './bin-to-bin-transfer.state';
import { state } from '@angular/animations';

export const selectBinToBinTransferState = createFeatureSelector<
  BinToBinTransferState
>(binToBinTransferFeatureKey);

export const selectError = createSelector(
  selectBinToBinTransferState,
  state => state.error
);

export const sourceBins = createSelector(
  selectBinToBinTransferState,
  state => state.sourceBins
);

export const selectSourceBins = createSelector(
  sourceBins,
  itemListGroupSelector.selectAll
);

export const selectSourceBinsTotalCount = createSelector(
  selectBinToBinTransferState,
  state => state.sourceBinsTotalCount
);

export const productCategory = createSelector(
  selectBinToBinTransferState,
  state => state.productCategory
);

export const selectProductCategory = createSelector(
  productCategory,
  itemListGroupSelector.selectAll
);

export const selectProductCategoryTotalCount = createSelector(
  selectBinToBinTransferState,
  state => state.productCategoryTotalCount
);

export const productGroups = createSelector(
  selectBinToBinTransferState,
  state => state.productGroups
);

export const selectProductGroups = createSelector(
  productGroups,
  itemListGroupSelector.selectAll
);

export const selectProductGroupsTotalCount = createSelector(
  selectBinToBinTransferState,
  state => state.productGroupsTotalCount
);

export const selectProductGroupOptions = createSelector(
  selectBinToBinTransferState,
  state => state.productGroupOptions
);

export const selectIsLoadingProductGroupOptions = createSelector(
  selectBinToBinTransferState,
  state => state.isLoadingProductGroupOptions
);

export const selectProductCategoryOptions = createSelector(
  selectBinToBinTransferState,
  state => state.productCategoryOptions
);

export const selectIsLoadingProductCategoryOptions = createSelector(
  selectBinToBinTransferState,
  state => state.isLoadingProductCategoryOptions
);

export const selectSoruceBinOptions = createSelector(
  selectBinToBinTransferState,
  state => state.soruceBinOptions
);

export const selectIsLoadingSoruceBinOptionsOptions = createSelector(
  selectBinToBinTransferState,
  state => state.isLoadingSoruceBinOptionsOptions
);

export const searchedItemListGroups = createSelector(
  selectBinToBinTransferState,
  state => state.searchedItemListGroups
);

export const selectSearchedItemListGroups = createSelector(
  searchedItemListGroups,
  itemListGroupSelector.selectAll
);

export const selectSearchedItemListGroupsTotalCount = createSelector(
  selectBinToBinTransferState,
  state => state.searchedItemListGroupsTotalCount
);

export const selectSelectedItemListGroup = createSelector(
  selectBinToBinTransferState,
  state => state.selectedItemListGroup
);
export const selectIsLoadingSelectedItemListGroupSuccess = createSelector(
  selectBinToBinTransferState,
  state => state.isLoadingSelectedItemListGroupSuccess
);

export const selectIsLoadingItemListGroup = createSelector(
  selectBinToBinTransferState,
  state => state.isLoadingItemListGroup
);

export const itemList = createSelector(
  selectBinToBinTransferState,
  state => state.itemList
);

export const selectItemList = createSelector(itemList, itemSelector.selectAll);
export const selectIsLoadingItemsSuccess = createSelector(
  selectBinToBinTransferState,
  state => state.isLoadingItemsSuccess
);

export const selectIsLoadingItems = createSelector(
  selectBinToBinTransferState,
  state => state.isLoadingItems
);

export const searchedItemList = createSelector(
  selectBinToBinTransferState,
  state => state.searchedItemList
);

export const selectSearchedItemList = createSelector(
  searchedItemList,
  itemSelector.selectAll
);

export const selectIsSearchingItems = createSelector(
  selectBinToBinTransferState,
  state => state.isSearchingItems
);

export const selectHasSearchedItems = createSelector(
  selectBinToBinTransferState,
  state => state.hasSearchedItems
);

export const selectItemsTotalCount = createSelector(
  selectBinToBinTransferState,
  state => state.itemsTotalCount
);
export const selectItemsTotalValue = createSelector(
  selectBinToBinTransferState,
  state => state.itemsTotalValue
);
export const selectItemsTotalQuantity = createSelector(
  selectBinToBinTransferState,
  state => state.itemsTotalQuantity
);

export const selectBinToBinAllowedtotalQuantity = createSelector(
  selectBinToBinTransferState,
  state => state.binToBinAllowedtotalQuantity
);

export const selectBinToBinAllowedtotalItems = createSelector(
  selectBinToBinTransferState,
  state => state.binToBinAllowedtotalItems
);

export const selectBinToBinAllowedtotalValue = createSelector(
  selectBinToBinTransferState,
  state => state.binToBinAllowedtotalValue
);

export const selectConfirmTransferResponse = createSelector(
  selectBinToBinTransferState,
  state => state.confirmTransferResponse
);

export const selectIsLoadingBins = createSelector(
  selectBinToBinTransferState,
  state => state.isLoadingBins
);

export const selectBins = createSelector(
  selectBinToBinTransferState,
  state => state.bins
);
export const binToBinHistory = createSelector(
  selectBinToBinTransferState,
  state => state.binToBinHistory
);
export const selectbinToBinHistory = createSelector(
  binToBinHistory,
  binToBinHistorySelector.selectAll
);
export const selectIsLoadingBinToBinHistory = createSelector(
  selectBinToBinTransferState,
  state => state.isLoadingHistory
);
export const selectBinToBinHistoryCount = createSelector(
  selectBinToBinTransferState,
  state => state.binToBinHistoryCount
);
export const selectSelectedHistory = createSelector(
  selectBinToBinTransferState,
  state => state.selectedHistory
);
export const selectIsLoadingSelectedHistory = createSelector(
  selectBinToBinTransferState,
  state => state.isLoadingSelectedHistory
);
export const selectHasSelectedHistory = createSelector(
  selectBinToBinTransferState,
  state => state.hasSelectedHistory
);
export const selectHistoryFilterData = createSelector(
  selectBinToBinTransferState,
  state => state.advancedFilter
);
// Image
export const selectIsLoadingImage = createSelector(
  selectBinToBinTransferState,
  state => state.isLoadingImage
);

export const selectInvalidItems = createSelector(
  selectBinToBinTransferState,
  state => state.invalidItems
);

export const selectNotInStockItems = createSelector(
  selectBinToBinTransferState,
  state => state.notInStock
);

export const selectDefectTypeList = createSelector(
  selectBinToBinTransferState,
  state => state.defectTypeList
);

export const selectDefectCodeList = createSelector(
  selectBinToBinTransferState,
  state => state.defectCodeList
);

export const binToBinTransferSelectors = {
  selectError,
  selectSearchedItemList,
  selectIsSearchingItems,
  selectHasSearchedItems,
  selectSourceBinsTotalCount,
  selectSourceBins,
  selectProductCategory,
  selectProductCategoryTotalCount,
  selectProductGroups,
  selectProductGroupsTotalCount,
  selectSearchedItemListGroups,
  selectSearchedItemListGroupsTotalCount,
  selectIsLoadingItemListGroup,
  selectItemList,
  selectIsLoadingItemsSuccess,
  selectIsLoadingItems,
  selectItemsTotalCount,
  selectConfirmTransferResponse,
  selectSelectedItemListGroup,
  selectIsLoadingSelectedItemListGroupSuccess,
  selectBins,
  selectIsLoadingBins,
  selectProductGroupOptions,
  selectIsLoadingProductGroupOptions,
  selectProductCategoryOptions,
  selectIsLoadingProductCategoryOptions,
  selectSoruceBinOptions,
  selectIsLoadingSoruceBinOptionsOptions,
  selectbinToBinHistory,
  selectIsLoadingBinToBinHistory,
  selectBinToBinHistoryCount,
  selectSelectedHistory,
  selectIsLoadingSelectedHistory,
  selectHasSelectedHistory,
  selectHistoryFilterData,
  selectItemsTotalValue,
  selectItemsTotalQuantity,
  selectIsLoadingImage,
  selectBinToBinAllowedtotalQuantity,
  selectBinToBinAllowedtotalValue,
  selectBinToBinAllowedtotalItems,
  selectInvalidItems,
  selectNotInStockItems,
  selectDefectTypeList,
  selectDefectCodeList
};
