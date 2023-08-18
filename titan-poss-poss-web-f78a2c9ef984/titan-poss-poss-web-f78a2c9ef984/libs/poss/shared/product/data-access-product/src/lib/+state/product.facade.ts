import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ProductState } from './product.state';
import { productSelectors } from './product.selectors';
import {
  ProductDetailsPayload,
  SearchProductPayload,
  ValidateProductAndPriceDetailsPayload,
  CashMemoItemValidate,
  TaxDetailsPayload,
  CashMemoItemDetailsRequestPayload,
  CashMemoDetailsResponse,
  CNDetailsRequestPayload,
  CashMemoDetailsRequestPayload,
  COItemDetailsRequestPayload
} from '@poss-web/shared/models';
import * as ProductActions from './product.actions';

@Injectable()
export class ProductFacade {
  constructor(private store: Store<ProductState>) {}

  private hasError$ = this.store.select(productSelectors.selectHasError);

  private isLoading$ = this.store.select(productSelectors.selectIsLoading);

  private isPriceLoading$ = this.store.select(
    productSelectors.selectIsPriceLoading
  );
  private isTaxLoading$ = this.store.select(
    productSelectors.selectIsTaxLoading
  );
  private isItemLoading$ = this.store.select(
    productSelectors.selectIsItemLoading
  );
  private isCoinLoading$ = this.store.select(
    productSelectors.selectIsCoinLoading
  );

  private searchProductList$ = this.store.select(
    productSelectors.selectSearchProductList
  );

  private searchProductListCount$ = this.store.select(
    productSelectors.selectSearchProductListCount
  );

  private productDetails$ = this.store.select(
    productSelectors.selectProductDetails
  );

  private productDetailsCount$ = this.store.select(
    productSelectors.selectProductDetailsCount
  );

  private RSODetails$ = this.store.select(productSelectors.selectRSODetails);

  private reasons$ = this.store.select(productSelectors.selectReasons);

  private validateProductAndPriceDetails$ = this.store.select(
    productSelectors.selectValidateProductAndPriceDetails
  );

  private taxDetails$ = this.store.select(productSelectors.selectTaxDetails);

  private deleteItemFromCashMemoResponse$ = this.store.select(
    productSelectors.selectDeleteItemFromCashMemoResponse
  );

  private validateWeightResponse$ = this.store.select(
    productSelectors.selectValidateWeight
  );

  private itemDetails$ = this.store.select(productSelectors.selectItemDetails);
  private abItemDetails$ = this.store.select(
    productSelectors.selectAbItemDetails
  );

  private lotNumberDetails$ = this.store.select(
    productSelectors.selectCurrentSelectedLotNumber
  );

  private coinDetails$ = this.store.select(productSelectors.selectCoinDetails);

  private priceDetails$ = this.store.select(
    productSelectors.selectPriceDetails
  );

  private itemIDList$ = this.store.select(productSelectors.selectItemIDList);

  private clearProductGrid$ = this.store.select(
    productSelectors.selectClearProductGrid
  );

  private gridSearchEnable$ = this.store.select(
    productSelectors.selectGridSearchEnable
  );

  private standardPrice$ = this.store.select(
    productSelectors.selectStandardPrice
  );

  private metalRate$ = this.store.select(productSelectors.selectMetalRate);

  private createOrder$ = this.store.select(productSelectors.selectCreateOrder);

  private selectedItemDetails$ = this.store.select(
    productSelectors.selectCurrentSelectedItem
  );

  private discoutSelected$ = this.store.select(
    productSelectors.selectDiscountSelected
  );

  private isABDiscountsSelected$ = this.store.select(
    productSelectors.selectABDiscounts
  );
  private itemDetailsOperation$ = this.store.select(
    productSelectors.selectItemDetailsOperation
  );

  private isABInvokedFirstTime$ = this.store.select(
    productSelectors.selectIsABInvokedFirstTime
  );

  private specificItemId$ = this.store.select(
    productSelectors.selectSpecificItemId
  );

  private validCoinDetails$ = this.store.select(
    productSelectors.selectValidCoinDetails
  );

  private CNDetails$ = this.store.select(productSelectors.selectCNDetails);

  private partialUpdateCashMemoResponse$ = this.store.select(
    productSelectors.selectPartialUpdateCashMemoResponse
  );

  // CO

  private coItemDetails$ = this.store.select(
    productSelectors.selectCOItemDetails
  );

  private deleteItemFromCORes$ = this.store.select(
    productSelectors.selectDeleteItemFromCOResponse
  );

  private specificCOItemId$ = this.store.select(
    productSelectors.selectSpecificCOItemId
  );

  private clearCOProductGrid$ = this.store.select(
    productSelectors.selectClearCOProductGrid
  );

  private selectItemLevelDiscounts$ = key =>
    this.store.select(productSelectors.selectItemLevelDiscounts(key));

  loadSearchProduct(searchProductPayload: SearchProductPayload) {
    this.store.dispatch(new ProductActions.SearchProduct(searchProductPayload));
  }

  loadProductDetails(productDetailsPayload: ProductDetailsPayload) {
    this.store.dispatch(
      new ProductActions.LoadProductDetails(productDetailsPayload)
    );
  }

  loadRSODetails(roleCodes: string, locationCodes?: string) {
    this.store.dispatch(
      new ProductActions.LoadRSODetails(roleCodes, locationCodes)
    );
  }

  loadReasons(reasonLov: string) {
    this.store.dispatch(new ProductActions.LoadReasons(reasonLov));
  }

  loadValidateProductAndPriceDetails(
    validateProductAndPriceDetailsPayload: ValidateProductAndPriceDetailsPayload
  ) {
    this.store.dispatch(
      new ProductActions.ValidateProductAndPriceDetails(
        validateProductAndPriceDetailsPayload
      )
    );
  }

  loadTaxDetails(taxDetailsPayload: TaxDetailsPayload) {
    this.store.dispatch(new ProductActions.LoadTaxDetails(taxDetailsPayload));
  }

  loadCoinDetails(itemCode: { itemCode: string; withSaleableCheck: boolean }) {
    this.store.dispatch(new ProductActions.LoadCoinDetails(itemCode));
  }

  loadPriceDetails(pricePayload) {
    this.store.dispatch(new ProductActions.LoadPriceDetails(pricePayload));
  }

  addItemToCashMemo(data: CashMemoItemDetailsRequestPayload) {
    this.store.dispatch(new ProductActions.AddItemtoCashMemo(data));
  }

  getItemFromCashMemo(data: CashMemoItemDetailsRequestPayload) {
    this.store.dispatch(new ProductActions.GetItemfromCashMemo(data));
  }

  loadAbItemDetails(data: CashMemoItemDetailsRequestPayload) {
    this.store.dispatch(new ProductActions.GetItemDetails(data));
  }

  partialUpdateItemInCashMemo(data: CashMemoItemDetailsRequestPayload) {
    this.store.dispatch(new ProductActions.PartialUpdateIteminCashMemo(data));
  }

  updateItemInCashMemo(data: CashMemoItemDetailsRequestPayload) {
    this.store.dispatch(new ProductActions.UpdateIteminCashMemo(data));
  }

  deleteItemFromCashMemo(data: CashMemoItemDetailsRequestPayload) {
    this.store.dispatch(new ProductActions.DeleteItemfromCashMemo(data));
  }

  deleteItemDetails(data: CashMemoItemDetailsRequestPayload) {
    this.store.dispatch(new ProductActions.DeleteItemDetails(data));
  }

  validateItem(itemValidate: CashMemoItemValidate) {
    this.store.dispatch(new ProductActions.ValidateItem(itemValidate));
  }

  loadLotNumber(lotNumber: string) {
    this.store.dispatch(
      new ProductActions.LoadSelectedLotNumberDetails(lotNumber)
    );
  }

  loadItemDetails(itemId: string) {
    this.store.dispatch(new ProductActions.LoadSelectedItemDetails(itemId));
  }

  setItemIDList(item: {
    item: CashMemoDetailsResponse;
    isUpdate: boolean;
    isGetHeaderDetails?: boolean;
    loadAutoDiscounts?: boolean;
  }) {
    this.store.dispatch(new ProductActions.SetItemIDList(item));
  }

  setStandardPrice(price: any) {
    this.store.dispatch(new ProductActions.SetStandardPrice(price));
  }

  setMetalRate(rate: any) {
    this.store.dispatch(new ProductActions.SetMetalRate(rate));
  }

  setCreateOrder(isCreate: boolean) {
    this.store.dispatch(new ProductActions.SetCreateOrder(isCreate));
  }

  setDiscountSelected(disSelected: boolean) {
    this.store.dispatch(new ProductActions.SetDiscountSelected(disSelected));
  }

  resetValues() {
    this.store.dispatch(new ProductActions.ResetValues());
  }

  resetItemIdValues() {
    this.store.dispatch(new ProductActions.ResetItemIdValues());
  }

  resetItemIdList() {
    this.store.dispatch(new ProductActions.ResetItemIdList());
  }

  resetLotNumberValues() {
    this.store.dispatch(new ProductActions.ResetLotNumberValues());
  }

  resetProductValues() {
    this.store.dispatch(new ProductActions.ResetProductValues());
  }

  resetCoinValues() {
    this.store.dispatch(new ProductActions.ResetCoinValues());
  }

  clearSearchProductList() {
    this.store.dispatch(new ProductActions.ClearSearchProductList());
  }

  clearProductList() {
    this.store.dispatch(new ProductActions.ClearProductList());
  }

  clearProductRelatedDetails() {
    this.store.dispatch(new ProductActions.ClearProductRelatedDetails());
  }

  clearValidateItem() {
    this.store.dispatch(new ProductActions.ClearValidateItem());
  }

  clearProductGrid() {
    this.store.dispatch(new ProductActions.ClearProductGrid());
  }

  setGridSearchEnable(searchEnable: boolean) {
    this.store.dispatch(new ProductActions.SetGridSearchEnable(searchEnable));
  }

  setIsABInvokedFirstTime(invokePayload: boolean) {
    this.store.dispatch(
      new ProductActions.SetABInvokedFirstTime(invokePayload)
    );
  }
  setItemDetailsOperation(operation: string) {
    this.store.dispatch(new ProductActions.SetItemDetailsOperation(operation));
  }

  loadValidCoinDetails(itemCode: {
    itemCode: string;
    withSaleableCheck: boolean;
  }) {
    this.store.dispatch(new ProductActions.LoadValidCoinDetails(itemCode));
  }

  loadCreditNoteDetailsByCNType(
    creditNoteDetailsRequest: CNDetailsRequestPayload
  ) {
    this.store.dispatch(
      new ProductActions.LoadCreditNoteDetails(creditNoteDetailsRequest)
    );
  }

  partialUpdateCashMemo(
    partialUpdateCashMemoPayload: CashMemoDetailsRequestPayload
  ) {
    this.store.dispatch(
      new ProductActions.PartialUpdateCashMemo(partialUpdateCashMemoPayload)
    );
  }

  // CO

  addItemToCO(data: COItemDetailsRequestPayload) {
    this.store.dispatch(new ProductActions.AddItemtoCO(data));
  }

  getItemFromCO(data: COItemDetailsRequestPayload) {
    this.store.dispatch(new ProductActions.GetItemfromCO(data));
  }

  partialUpdateItemInCO(data: COItemDetailsRequestPayload) {
    this.store.dispatch(new ProductActions.PartialUpdateIteminCO(data));
  }

  updateItemInCO(data: COItemDetailsRequestPayload) {
    this.store.dispatch(new ProductActions.UpdateIteminCO(data));
  }

  deleteItemFromCO(data: COItemDetailsRequestPayload) {
    this.store.dispatch(new ProductActions.DeleteItemfromCO(data));
  }

  clearCOProductGrid(isClear: boolean) {
    this.store.dispatch(new ProductActions.ClearCOProductGrid(isClear));
  }

  resetCOValues() {
    this.store.dispatch(new ProductActions.ResetCOValues());
  }

  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getIsPriceLoading() {
    return this.isPriceLoading$;
  }

  getIsTaxLoading() {
    return this.isTaxLoading$;
  }

  getIsItemLoading() {
    return this.isItemLoading$;
  }

  getIsCoinLoading() {
    return this.isCoinLoading$;
  }

  getSearchProductList() {
    return this.searchProductList$;
  }

  getSearchProductListCount() {
    return this.searchProductListCount$;
  }

  getProductDetails() {
    return this.productDetails$;
  }

  getPartialUpdateCashMemoResponse() {
    return this.partialUpdateCashMemoResponse$;
  }

  getProductDetailsCount() {
    return this.productDetailsCount$;
  }

  getItemlevelDiscountbyKey(key: string) {
    return this.selectItemLevelDiscounts$(key);
  }

  getRSODetails() {
    return this.RSODetails$;
  }

  getReasons() {
    return this.reasons$;
  }

  getValidateProductAndPriceDetails() {
    return this.validateProductAndPriceDetails$;
  }

  getTaxDetails() {
    return this.taxDetails$;
  }

  getDeleteItemFromCashMemoResponse() {
    return this.deleteItemFromCashMemoResponse$;
  }

  getValidateWeight() {
    return this.validateWeightResponse$;
  }

  getItemDetails() {
    return this.itemDetails$;
  }

  getAbItemDetails() {
    return this.abItemDetails$;
  }

  getLotNumberDetails() {
    return this.lotNumberDetails$;
  }

  getCoinDetails() {
    return this.coinDetails$;
  }

  getPriceDetails() {
    return this.priceDetails$;
  }

  getItemIDList() {
    return this.itemIDList$;
  }

  getClearProductGrid() {
    return this.clearProductGrid$;
  }

  getGridSearchEnable() {
    return this.gridSearchEnable$;
  }

  getStandardPrice() {
    return this.standardPrice$;
  }

  getMetalRate() {
    return this.metalRate$;
  }

  getCreateOrder() {
    return this.createOrder$;
  }

  getSelectedItemDetails() {
    return this.selectedItemDetails$;
  }

  getDiscountSelected() {
    return this.discoutSelected$;
  }

  getIsABInvokedFirstTime() {
    return this.isABInvokedFirstTime$;
  }
  getSpecificItemId() {
    return this.specificItemId$;
  }
  getValidCoinDetails() {
    return this.validCoinDetails$;
  }
  getCNDetailsByCNType() {
    return this.CNDetails$;
  }
  getItemDetailsOperation() {
    return this.itemDetailsOperation$;
  }
  getIsABDiscountsSelected() {
    return this.isABDiscountsSelected$;
  }

  // CO

  getCOItemDetails() {
    return this.coItemDetails$;
  }

  getDeleteItemFromCOResponse() {
    return this.deleteItemFromCORes$;
  }

  getSpecificCOItemId() {
    return this.specificCOItemId$;
  }

  getClearCOProductGrid() {
    return this.clearCOProductGrid$;
  }
}
