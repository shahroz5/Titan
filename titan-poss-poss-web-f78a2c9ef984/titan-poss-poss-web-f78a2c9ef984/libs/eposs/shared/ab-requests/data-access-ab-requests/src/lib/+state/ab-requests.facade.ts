import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ABRequestsSelector } from './ab-requests.selector';
import * as actions from './ab-requests.actions';
import { AbRequestsState } from './ab-requests.state';

@Injectable()
export class ABRequestsFacade {
  constructor(private store: Store<AbRequestsState>) {}
  private ABRequest$ = this.store.select(ABRequestsSelector.selectabRequests);

  private isLoading$ = this.store.select(ABRequestsSelector.selectLoading);

  private hasError$ = this.store.select(ABRequestsSelector.selecthasError);

  private ABDetail$ = this.store.select(
    ABRequestsSelector.selectApprovedDetail
  );
  private abCancelCount$ = this.store.select(
    ABRequestsSelector.selectabRequestCount
  );

  private location$ = this.store.select(ABRequestsSelector.selectLocation);
  getLocations() {
    return this.location$;
  }

  getABRequest() {
    return this.ABRequest$;
  }

  getisLoading() {
    return this.isLoading$;
  }

  hasError() {
    return this.hasError$;
  }

  getABDetail() {
    return this.ABDetail$;
  }

  getabCancelCount() {
    return this.abCancelCount$;
  }
  reset() {
    this.store.dispatch(new actions.Reset());
  }
  loadABRequests(data: actions.AbRequestsListPayload) {
    this.store.dispatch(new actions.LoadABRequests(data));
  }

  approveABRequests(data: actions.ApprovePayload) {
    this.store.dispatch(new actions.ApproveABRequests(data));
  }

  loadLocations() {
    this.store.dispatch(new actions.LoadLocation());
  }
}
