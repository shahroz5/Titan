import { createFeatureSelector, createSelector } from '@ngrx/store';
import { productFeatureKey } from './product.reducer';
import { ProductState } from './product.state';
import {
  productDetailsSelector,
  itemDetailsSelector,
  COItemDetailsSelector
} from './product.entity';

export const selectProductState = createFeatureSelector<ProductState>(
  productFeatureKey
);

const selectHasError = createSelector(
  selectProductState,
  state => state.hasError
);

const selectPartialUpdateCashMemoResponse = createSelector(
  selectProductState,
  state => state.partialUpdateCashMemoResponse
);

const selectIsLoading = createSelector(
  selectProductState,
  state => state.isLoading
);

const selectIsPriceLoading = createSelector(
  selectProductState,
  state => state.isPriceLoading
);

const selectIsTaxLoading = createSelector(
  selectProductState,
  state => state.isTaxLoading
);

const selectIsItemLoading = createSelector(
  selectProductState,
  state => state.isItemLoading
);

const selectIsCoinLoading = createSelector(
  selectProductState,
  state => state.isCoinLoading
);

const selectSearchProductList = createSelector(
  selectProductState,
  state => state.searchProductList
);

const selectSearchProductListCount = createSelector(
  selectProductState,
  state => state.searchProductListCount
);

export const productDetails = createSelector(
  selectProductState,
  state => state.productDetails
);

const selectProductDetails = createSelector(
  productDetails,
  productDetailsSelector.selectAll
);

const selectProductDetailsCount = createSelector(
  selectProductState,
  state => state.productDetailsCount
);

const selectRSODetails = createSelector(
  selectProductState,
  state => state.RSODetails
);

const selectReasons = createSelector(
  selectProductState,
  state => state.reasons
);

const selectValidateProductAndPriceDetails = createSelector(
  selectProductState,
  state => state.validateProductAndPriceDetails
);

const selectTaxDetails = createSelector(
  selectProductState,
  state => state.taxDetails
);

const selectDeleteItemFromCashMemoResponse = createSelector(
  selectProductState,
  state => state.deleteItemFromCashMemoResponse
);

const selectValidateWeight = createSelector(
  selectProductState,
  state => state.validateWeight
);

const allProductDetails = createSelector(
  selectProductState,
  state => state.allProductDetails
);

const selectLotNumberEntities = createSelector(
  allProductDetails,
  productDetailsSelector.selectEntities
);

const getSelectedLotNumberId = createSelector(
  selectProductState,
  state => state.selectedLotNumber
);

const selectCurrentSelectedLotNumber = createSelector(
  selectLotNumberEntities,
  getSelectedLotNumberId,
  (lotNumberEntities, selectedLotNumberId) =>
    lotNumberEntities[selectedLotNumberId]
);

export const itemDetails = createSelector(
  selectProductState,
  state => state.itemDetails
);

const selectItemDetails = createSelector(
  itemDetails,
  itemDetailsSelector.selectAll
);

const selectItemLevelDiscounts = (Key: string) =>
  createSelector(selectItemDetails, data => {
    return data
      .map(discount => discount.discountDetails)
      .map(
        discountDetails =>
          discountDetails.filter(discount => discount.discountType === Key)
            .length > 0
      );
  });

const selectABDiscounts = createSelector(selectItemDetails, data => {
  return data
    .map(discount => discount.discountDetails)
    .map(
      discountDetails =>
        discountDetails?.filter(discount => discount.referenceId !== null)
          .length > 0
    );
});

const selectCoinDetails = createSelector(
  selectProductState,
  state => state.coinDetails
);

const selectPriceDetails = createSelector(
  selectProductState,
  state => state.priceDetails
);

const selectItemIDList = createSelector(
  selectProductState,
  state => state.itemIDList
);

const selectClearProductGrid = createSelector(
  selectProductState,
  state => state.clearProductGrid
);

const selectGridSearchEnable = createSelector(
  selectProductState,
  state => state.gridSearchEnable
);

const selectStandardPrice = createSelector(
  selectProductState,
  state => state.standardPrice
);

const selectMetalRate = createSelector(
  selectProductState,
  state => state.metalRate
);

const selectCreateOrder = createSelector(
  selectProductState,
  state => state.createOrder
);

export const abItemDetails = createSelector(
  selectProductState,
  state => state.abItemDetails
);

const selectAbItemDetails = createSelector(
  abItemDetails,
  itemDetailsSelector.selectAll
);

const selectItemEntities = createSelector(
  itemDetails,
  itemDetailsSelector.selectEntities
);

const getSelectedItemId = createSelector(
  selectProductState,
  state => state.selectedItemId
);

const selectCurrentSelectedItem = createSelector(
  selectItemEntities,
  getSelectedItemId,
  (itemEntities, selectedItemd) => itemEntities[selectedItemd]
);

const selectDiscountSelected = createSelector(
  selectProductState,
  state => state.discountSelected
);

const selectIsABInvokedFirstTime = createSelector(
  selectProductState,
  state => state.isABInvokedFirstTime
);

const selectSpecificItemId = createSelector(
  selectProductState,
  state => state.specificItemDetails
);
const selectItemDetailsOperation = createSelector(
  selectProductState,
  state => state.itemDetailsOperation
);

const selectValidCoinDetails = createSelector(
  selectProductState,
  state => state.validCoinDetails
);

const selectCNDetails = createSelector(
  selectProductState,
  state => state.cnDetailsList
);

// CO

export const coItemDetails = createSelector(
  selectProductState,
  state => state.coItemDetails
);

const selectCOItemDetails = createSelector(
  coItemDetails,
  COItemDetailsSelector.selectAll
);

const selectDeleteItemFromCOResponse = createSelector(
  selectProductState,
  state => state.deleteItemFromCORes
);

const selectSpecificCOItemId = createSelector(
  selectProductState,
  state => state.specificCOItemDetails
);

const selectClearCOProductGrid = createSelector(
  selectProductState,
  state => state.clearCOProductGrid
);

export const productSelectors = {
  selectHasError,
  selectIsLoading,
  selectIsPriceLoading,
  selectIsTaxLoading,
  selectIsItemLoading,
  selectIsCoinLoading,
  selectSearchProductList,
  selectSearchProductListCount,
  selectProductDetails,
  selectProductDetailsCount,
  selectRSODetails,
  selectReasons,
  selectValidateProductAndPriceDetails,
  selectTaxDetails,
  selectDeleteItemFromCashMemoResponse,
  selectValidateWeight,
  selectItemDetails,
  selectCurrentSelectedLotNumber,
  selectCoinDetails,
  selectPriceDetails,
  selectItemIDList,
  selectClearProductGrid,
  selectGridSearchEnable,
  selectStandardPrice,
  selectMetalRate,
  selectCreateOrder,
  selectAbItemDetails,
  selectCurrentSelectedItem,
  selectDiscountSelected,
  selectItemLevelDiscounts,
  selectIsABInvokedFirstTime,
  selectSpecificItemId,
  selectValidCoinDetails,
  selectCNDetails,
  selectItemDetailsOperation,
  selectABDiscounts,
  selectPartialUpdateCashMemoResponse,
  selectCOItemDetails,
  selectDeleteItemFromCOResponse,
  selectSpecificCOItemId,
  selectClearCOProductGrid
};
