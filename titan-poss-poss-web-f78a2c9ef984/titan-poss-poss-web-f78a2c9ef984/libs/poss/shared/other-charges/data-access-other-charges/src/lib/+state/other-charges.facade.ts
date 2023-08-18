import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { OtherChargesState } from './other-charges.state';
import { OtherChargesSelectors } from './other-charges.selectors';
import {
  CashMemoDetailsRequestPayload,
  TaxDetailsPayload
} from '@poss-web/shared/models';
import * as OtherChargesActions from './other-charges.actions';

@Injectable()
export class OtherChargesFacade {
  constructor(private store: Store<OtherChargesState>) {}

  private hasError$ = this.store.select(OtherChargesSelectors.selectHasError);
  private reasons$ = this.store.select(OtherChargesSelectors.selectReasons);

  private isLoading$ = this.store.select(OtherChargesSelectors.selectIsLoading);
  private taxDetails$ = this.store.select(
    OtherChargesSelectors.selectTaxDetails
  );

  private partialUpdateCashMemoResponse$ = this.store.select(
    OtherChargesSelectors.selectPartialUpdateCashMemoResponse
  );

  getHasError() {
    return this.hasError$;
  }
  getPartialUpdateCashMemoResponse() {
    return this.partialUpdateCashMemoResponse$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getTaxDetails() {
    return this.taxDetails$;
  }

  getReasons() {
    return this.reasons$;
  }

  loadReasons(reasonLov: string) {
    this.store.dispatch(new OtherChargesActions.LoadReasons(reasonLov));
  }

  partialUpdateCashMemo(
    partialUpdateCashMemoPayload: CashMemoDetailsRequestPayload
  ) {
    this.store.dispatch(
      new OtherChargesActions.PartialUpdateCashMemo(
        partialUpdateCashMemoPayload
      )
    );
  }

  loadTaxDetails(taxDetailsPayload: TaxDetailsPayload) {
    this.store.dispatch(
      new OtherChargesActions.LoadTaxDetails(taxDetailsPayload)
    );
  }
}
