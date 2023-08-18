import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as CFAProductCodeActions from './cfa-product-code.actions';
import { CFAProductCodeSelectors } from './cfa-product-code.selectors';
import { CFAProductCodeState } from './cfa-product-code.state';
import {
  LoadCFAProductCodeListingPayload,
  UpdateCFAProductsPayload
} from '@poss-web/shared/models';
@Injectable()
export class CFAProductCodeFacade {
  constructor(private store: Store<CFAProductCodeState>) {}
  private CFAProductCodeListing$ = this.store.select(
    CFAProductCodeSelectors.selectCFAProductCodeListing
  );
  private totalElements$ = this.store.select(
    CFAProductCodeSelectors.selectTotalElements
  );
  private CFAProductCode$ = this.store.select(
    CFAProductCodeSelectors.selectCFAProductCode
  );
  private isLoading$ = this.store.select(
    CFAProductCodeSelectors.selectIsLoading
  );

  private hasSaved$ = this.store.select(CFAProductCodeSelectors.selectHasSaved);
  private hasUpdated$ = this.store.select(
    CFAProductCodeSelectors.selectHasUpdated
  );
  private hasError$ = this.store.select(CFAProductCodeSelectors.selectHasError);
  private productTypes$ = this.store.select(
    CFAProductCodeSelectors.selectProductTypes
  );
  private itemTypes$ = this.store.select(
    CFAProductCodeSelectors.selectItemTypes
  );
  private plainStuddedTypes$ = this.store.select(
    CFAProductCodeSelectors.selectPlainStuddedType
  );
  private hallmarkingExcludeKaratType$ = this.store.select(
    CFAProductCodeSelectors.selecthallmarkingExcludeKaratType
  );
  private pricingType$ = this.store.select(
    CFAProductCodeSelectors.selectPricingType
  );
  getCFAProductCodeListing() {
    return this.CFAProductCodeListing$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getCFAProductCodeBasedOnProductGroup() {
    return this.CFAProductCode$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getHasError() {
    return this.hasError$;
  }
  getProductTypes() {
    return this.productTypes$;
  }
  getItemTypes() {
    return this.itemTypes$;
  }
  getPlainStuddedType() {
    return this.plainStuddedTypes$;
  }
  gethallmarkingExcludeKaratType(){
    return this.hallmarkingExcludeKaratType$;
  }
  getPricingType() {
    return this.pricingType$;
  }
  loadCFAProductCodeListing(
    loadCFAProductCodePayload: LoadCFAProductCodeListingPayload
  ) {
    this.store.dispatch(
      new CFAProductCodeActions.LoadCFAProducts(loadCFAProductCodePayload)
    );
  }
  loadCFAProductCode(productGroupCode: string) {
    this.store.dispatch(
      new CFAProductCodeActions.LoadCFAProductsBasedOnProductGroupCode(
        productGroupCode
      )
    );
  }
  saveCFAProducts(data: any) {
    this.store.dispatch(new CFAProductCodeActions.SaveCFAProducts(data));
  }
  resetCFAProducts() {
    this.store.dispatch(new CFAProductCodeActions.ResetCFAProducts());
  }
  updateCFAProducts(updateCFAProductsPayload: UpdateCFAProductsPayload) {
    this.store.dispatch(
      new CFAProductCodeActions.UpdateCFAProducts(updateCFAProductsPayload)
    );
  }
  searchCFAProdcut(prodcutGroupCode: string) {
    this.store.dispatch(
      new CFAProductCodeActions.SearchCFAproduct(prodcutGroupCode)
    );
  }
  loadProdcutTypes() {
    this.store.dispatch(new CFAProductCodeActions.LoadProductTypes());
  }
  loadItemTypes() {
    this.store.dispatch(new CFAProductCodeActions.LoadItemTypes());
  }
  loadPlainStuddedTypes(type: string) {
    this.store.dispatch(new CFAProductCodeActions.LoadPlainStuddedType(type));
  }
  loadhallmarkingExcludeKaratTypes(type: string) {
    this.store.dispatch(new CFAProductCodeActions.LoadhallmarkingExcludeKaratType(type));
  }
  loadPricingType(type: string) {
    this.store.dispatch(new CFAProductCodeActions.LoadPricingType(type));
  }
}
