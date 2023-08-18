import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { InStockSelector } from './in-stock.selectors';
import * as inStockActions from './in-stock.action';
import { InStockState } from './in-stock.state';
import { BinRequestDto, HistoryFiltersData } from '@poss-web/shared/models';

@Injectable()
export class InStockFacade {
  private binCodes$ = this.store.select(InStockSelector.selectBinCodes);

  private binHistory$ = this.store.select(InStockSelector.selectBinHistory);
  private binHistoryCount$ = this.store.select(
    InStockSelector.selectbinHistoryCount
  );

  private historyFilterData$ = this.store.select(
    InStockSelector.selectHistoryFilterData
  );

  private hasError$ = this.store.select(InStockSelector.selectHasError);
  private binHistoryError$ = this.store.select(
    InStockSelector.selectHistoryError
  );
  private historyLoading$ = this.store.select(
    InStockSelector.selectIsHistoryLoading
  );
  private isLoaded$ = this.store.select(InStockSelector.selectIsLoaded);
  private isBinCodeReset$ = this.store.select(
    InStockSelector.selectIsBinCodeReset
  );
  private isDocNoReset$ = this.store.select(InStockSelector.selectIsDocNoReset);
  private isLoading$ = this.store.select(InStockSelector.selectIsLoading);
  private binCodesCount$ = this.store.select(
    InStockSelector.selectbinCodesCount
  );
  private isRequestingBin$ = this.store.select(
    InStockSelector.selectIsRequestingBin
  );
  private isRequestBinSuccess$ = this.store.select(
    InStockSelector.selectIsRequestedBinSuccess
  );

  private requestedBin$ = this.store.select(
    InStockSelector.selectRequestBinSuccess
  );

  constructor(private store: Store<InStockState>) {}

  loadBinCodes() {
    this.store.dispatch(new inStockActions.LoadBinCodes());
  }

  loadBinHistory(binRequestDto: inStockActions.LoadBinHistoryPayload) {
    this.store.dispatch(new inStockActions.LoadBinHistory(binRequestDto));
  }

  loadHistoryFilterData(date: HistoryFiltersData) {
    this.store.dispatch(new inStockActions.LoadHistoryFilterData(date));
  }
  getHistoryFilterData() {
    return this.historyFilterData$;
  }

  resetBinCodes() {
    this.store.dispatch(new inStockActions.ResetBinCodes());
  }

  resetDocNo() {
    this.store.dispatch(new inStockActions.ResetDocNo());
  }

  resetHistory() {
    this.store.dispatch(new inStockActions.RESETBINHISTORY());
  }
  resetFilter(businessDay: number) {
    this.store.dispatch(new inStockActions.RESETFILTER(businessDay));
  }

  loadbinCodesCount() {
    this.store.dispatch(new inStockActions.LoadCount());
  }

  requestedBin(requestBin: BinRequestDto) {
    this.store.dispatch(new inStockActions.RequestedBin(requestBin));
  }

  getBinCodes() {
    return this.binCodes$;
  }
  getError() {
    return this.hasError$;
  }
  getBinHistory() {
    return this.binHistory$;
  }
  getBinHistoryCount() {
    return this.binHistoryCount$;
  }
  getHistoryError() {
    return this.binHistoryError$;
  }
  getHistoryLoading() {
    return this.historyLoading$;
  }
  getHistoryCount() {
    return this.binHistoryCount$;
  }

  getIsBinCodeReset() {
    return this.isBinCodeReset$;
  }

  getIsDocNoReset() {
    return this.isDocNoReset$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getIsLoaded() {
    return this.isLoaded$;
  }

  getbinCodesCount() {
    return this.binCodesCount$;
  }

  getRequestBin() {
    return this.requestedBin$;
  }

  getIsRequestBinSuccess() {
    return this.isRequestBinSuccess$;
  }

  getIsRequestingBin() {
    return this.isRequestingBin$;
  }
}
