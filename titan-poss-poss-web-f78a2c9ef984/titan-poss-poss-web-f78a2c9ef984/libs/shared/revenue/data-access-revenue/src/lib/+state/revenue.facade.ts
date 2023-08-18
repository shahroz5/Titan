import * as RevenueActions from './revenue.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RevenueState } from './revenue.state';
import { RevenueSelectors } from './revenue.selectors';
import { GHSRevenuePayload, PaginatePayload, RevenueRequest, ServiceRevenuePayload } from '@poss-web/shared/models';

@Injectable()
export class RevenueFacade {
  private isLoading$ = this.store.select(RevenueSelectors.selectIsLoading);

  private dayWiseRevenueList$ = this.store.select(
    RevenueSelectors.selectDayWiseRevenueList
  );

  private todayRevenueList$ = this.store.select(
    RevenueSelectors.selectTodayRevenueList
  );

  private ghsRevenueList$ = this.store.select(
    RevenueSelectors.selectGhsRevenueList
  );

  private serviceRevenueList$ = this.store.select(
    RevenueSelectors.selectServiceRevenueList
  );

  private error$ = this.store.select(RevenueSelectors.selectError);

  constructor(private store: Store<RevenueState>) {}

  getError() {
    return this.error$;
  }

  getDayWiseRevenueList() {
    return this.dayWiseRevenueList$;
  }

  getTodayRevenueList() {
    return this.todayRevenueList$;
  }

  getGhsRevenueList() {
    return this.ghsRevenueList$;
  }

  getServiceRevenueList() {
    return this.serviceRevenueList$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  loadDayWiseReveune = (paginateData: PaginatePayload, data: RevenueRequest) =>
    this.store.dispatch(new RevenueActions.LoadRevenueList(paginateData, data));

  loadTodayReveune = (locationCode: string) =>
    this.store.dispatch(new RevenueActions.GetTodayRevenueList(locationCode));

  loadGhsReveune = (payload: GHSRevenuePayload) =>
    this.store.dispatch(new RevenueActions.GetGhsRevenueList(payload));
    
  loadServiceReveune = (payload: ServiceRevenuePayload) =>
    this.store.dispatch(new RevenueActions.GetServiceRevenueList(payload));

  resetError() {
    this.store.dispatch(new RevenueActions.ResetError());
  }
}
