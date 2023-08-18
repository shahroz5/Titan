import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GSTMappingState } from './gst-mapping.state';
import * as GSTMappingActions from './gst-mapping.action';
import {
  LoadGSTMappingListPayload,
  GSTMappingPayload
} from '@poss-web/shared/models';
import { GSTMappingSelectors } from './gst-mapping.selector';

@Injectable()
export class GSTMappingFacade {
  private totalElements$ = this.store.select(
    GSTMappingSelectors.selectTotalElements
  );
  private gstMappingList$ = this.store.select(
    GSTMappingSelectors.selectGSTMappingList
  );
  private isLoading$ = this.store.select(GSTMappingSelectors.selectIsLoading);
  private error$ = this.store.select(GSTMappingSelectors.selectError);

  private txnTypes$ = this.store.select(GSTMappingSelectors.selectTxnTypes);

  private taxes$ = this.store.select(GSTMappingSelectors.selectTaxes);
  private reloadStatus$ = this.store.select(
    GSTMappingSelectors.selectReloadStatus
  );

  constructor(private store: Store<GSTMappingState>) {}

  getReloadStatus() {
    return this.reloadStatus$;
  }

  getTxnTypes() {
    return this.txnTypes$;
  }

  getTaxes() {
    return this.taxes$;
  }

  getIsLoading() {
    return this.isLoading$;
  }
  getError() {
    return this.error$;
  }
  getGSTMappingList() {
    return this.gstMappingList$;
  }

  getTotalElements() {
    return this.totalElements$;
  }

  loadGSTMappingList(payload: LoadGSTMappingListPayload) {
    this.store.dispatch(new GSTMappingActions.LoadGSTMappingList(payload));
  }

  addGSTMapping(payload: GSTMappingPayload) {
    this.store.dispatch(new GSTMappingActions.AddGSTMapping(payload));
  }

  editGSTMapping(payload: { configId: string; data: GSTMappingPayload }) {
    this.store.dispatch(new GSTMappingActions.EditGSTMapping(payload));
  }

  loadTransactionTypes() {
    this.store.dispatch(new GSTMappingActions.LoadTransactionTypes());
  }

  loadTaxes() {
    this.store.dispatch(new GSTMappingActions.LoadTaxes());
  }

  resetData() {
    this.store.dispatch(new GSTMappingActions.ResetData());
  }
}
