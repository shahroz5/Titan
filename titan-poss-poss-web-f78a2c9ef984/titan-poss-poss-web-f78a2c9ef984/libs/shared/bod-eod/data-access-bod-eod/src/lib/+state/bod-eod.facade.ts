import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as BodEodActions from './bod-eod.actions';
import { bodEodSelectors } from './bod-eod.selectors';
import { BodEodState } from './bod-eod.state';

@Injectable()
export class SharedBodEodFacade {
  constructor(private store: Store<BodEodState>) {}

  /*Select from store*/
  private error$ = this.store.select(bodEodSelectors.selectError);
  private isLoading$ = this.store.select(bodEodSelectors.selectIsLoading);

  private currentDayBodStatus$ = this.store.select(
    bodEodSelectors.selectCurrentDayBodStatus
  );
  private openBusinessDate$ = this.store.select(
    bodEodSelectors.selectOpenBusinessDate
  );
  private openBusinessDateForGuard$ = this.store.select(
    bodEodSelectors.selectOpenBusinessDateForGuard
  );
  private goldRate$ = this.store.select(bodEodSelectors.selectGoldRate);
  private isGoldRateAvailable$ = this.store.select(
    bodEodSelectors.selectIsGoldRateAvailable
  );
  private eodBusinessDate$ = this.store.select(
    bodEodSelectors.selectEodBusinessDate
  );
  private latestBusinessDate$ = this.store.select(
    bodEodSelectors.selectLatestBusinessDate
  );
  private bodEodStatus$ = this.store.select(bodEodSelectors.selectBodEodStatus);
  private fiscalYear$ = this.store.select(bodEodSelectors.selectFiscalYear);

  loadCurrentDayBodStatus() {
    this.store.dispatch(new BodEodActions.LoadOpenBusinessDate());
  }
  loadMetalRatesForBusinessDay(businessDate: number) {
    this.store.dispatch(
      new BodEodActions.LoadMetalRatesForBusinessDay(businessDate)
    );
  }
  loadEodBusinessDate() {
    this.store.dispatch(new BodEodActions.LoadEodBusinessDate());
  }
  loadLatestBusinessDay() {
    this.store.dispatch(new BodEodActions.LatestBusinessDay());
  }

  resetState() {
    this.store.dispatch(new BodEodActions.Reset());
  }

  /*Facade Methods Exposed */
  getError() {
    return this.error$;
  }
  getIsLoading() {
    return this.isLoading$;
  }

  getCurrentDayBodStatus() {
    return this.currentDayBodStatus$;
  }
  getBusinessDayDate() {
    return this.openBusinessDate$;
  }
  getBusinessDayDateForGuard() {
    return this.openBusinessDateForGuard$;
  }
  getGoldRate() {
    return this.goldRate$;
  }
  getGoldRateAvailablityStatus() {
    return this.isGoldRateAvailable$;
  }
  getEodBusinessDate() {
    return this.eodBusinessDate$;
  }
  getLatestBusinessDate() {
    return this.latestBusinessDate$;
  }
  getBodEodStatus() {
    return this.bodEodStatus$;
  }
  getFiscalYear() {
    return this.fiscalYear$;
  }
}
