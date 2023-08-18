import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MetalRateUpdateRequestPayload } from '@poss-web/shared/models';

import * as MetalRatesActions from './metal-rates.actions';
import { metalRatesSelectors } from './metal-rates.selectors';
import { MetalRatesState } from './metal-rates.state';

@Injectable()
export class MetalRatesFacade {
  constructor(private store: Store<MetalRatesState>) {}
  /*Select from store*/
  private error$ = this.store.select(metalRatesSelectors.selectError);
  private isLoading$ = this.store.select(metalRatesSelectors.selectIsLoading);
  private goldRateAvailableForBusinessDay$ = this.store.select(
    metalRatesSelectors.selectIsGoldRateAvailableForBusinessDay
  );
  private bodBusinessDate$ = this.store.select(
    metalRatesSelectors.selectBodBusinessDate
  );
  private eodBusinessDate$ = this.store.select(
    metalRatesSelectors.selectEodBusinessDate
  );

  private isMetalRatesUpdatedInBoutique$ = this.store.select(
    metalRatesSelectors.selectIsMetalRatesUpdatedInBoutique
  );

  /*Dispatching Actions*/
  saveMetalRates(metalRates: MetalRateUpdateRequestPayload) {
    this.store.dispatch(new MetalRatesActions.SaveMetalRates(metalRates));
  }
  ResetState() {
    this.store.dispatch(new MetalRatesActions.ResetState());
  }
  loadAvailableMetalRates(businessDay: number) {
    this.store.dispatch(
      new MetalRatesActions.LoadAvailableMetalRates(businessDay)
    );
  }
  loadBodBusinessDate() {
    this.store.dispatch(new MetalRatesActions.LoadBodBusinessDate());
  }
  loadEodBusinessDate() {
    this.store.dispatch(new MetalRatesActions.LoadEodBusinessDate());
  }
  /*Selector Methods */
  getError() {
    return this.error$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  isGoldRateAvailableForBusinessDay() {
    return this.goldRateAvailableForBusinessDay$;
  }
  getBodBusinessDate() {
    return this.bodBusinessDate$;
  }
  getEodBusinessDate() {
    return this.eodBusinessDate$;
  }
  isMetalRatesUpdatedInBoutique() {
    return this.isMetalRatesUpdatedInBoutique$;
  }
}
