import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { findPriceSelectors } from './find-price.selectors';
import { FindPriceState } from './find-price.state';
import * as FindPriceActions from './find-price.actions';
import { FindPricePayload, TaxPayload } from '@poss-web/shared/models';

@Injectable()
export class FindPriceFacade {
    
  constructor(private store: Store<FindPriceState>) {}

  private hasError$ = this.store.select(findPriceSelectors.selectHasError);

  private isLoading$ = this.store.select(findPriceSelectors.selectIsLoading);
  
  private isViewPricing$ = this.store.select(findPriceSelectors.selectIsViewPricing);

  private priceDetails$ = this.store.select(findPriceSelectors.selectPriceDetails);
  
  private standardPrice$ = this.store.select(findPriceSelectors.selectStandardMetalPriceDetails);

  private taxDetails$ = this.store.select(findPriceSelectors.selectTaxDetails);

  private itemCode$ = this.store.select(findPriceSelectors.selectItemCode);

  setItemCode(itemCode: string) {
    this.store.dispatch(new FindPriceActions.SetItemCode(itemCode));
  }

  resetItemCode() {
    this.store.dispatch(new FindPriceActions.ResetItemCode());
  }

  loadStandardPrice() {
    this.store.dispatch(new FindPriceActions.LoadStandardMetalPriceDetails());
  }

  findPrice(pricePayload: FindPricePayload) {
    this.store.dispatch(new FindPriceActions.FindPrice(pricePayload));
  }

  loadTaxDetails(taxPayload: TaxPayload) {
    this.store.dispatch(new FindPriceActions.LoadTaxDetails(taxPayload));
  }

  resetValues() {
    this.store.dispatch(new FindPriceActions.ResetValues());
  }

  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getIsViewPricing() {
    return this.isViewPricing$;
  }

  getStandardPrice(){
    return this.standardPrice$;
  }

  getPriceDetails() {
    return this.priceDetails$;
  }
  
  getTaxDetails() {
    return this.taxDetails$;
  }

  getItemCode() {
    return this.itemCode$;
  }
}