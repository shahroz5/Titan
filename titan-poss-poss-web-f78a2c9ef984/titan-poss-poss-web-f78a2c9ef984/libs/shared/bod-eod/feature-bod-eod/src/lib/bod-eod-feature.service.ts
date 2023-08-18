import { Injectable } from '@angular/core';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { CustomErrors } from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BodEodFeatureService {
  constructor(private bodEodFacade: SharedBodEodFacade) {}

  // Actions Below
  loadCurrentDayBodStatus() {
    this.bodEodFacade.loadCurrentDayBodStatus();
  }
  loadMetalRatesForBusinessDay(businessDate: number) {
    this.bodEodFacade.loadMetalRatesForBusinessDay(businessDate);
  }
  loadLatestBusinessDay() {
    this.bodEodFacade.loadLatestBusinessDay();
  }

  // Selector Methods Below
  getBusinessDayDate(): Observable<number> {
    return this.bodEodFacade.getBusinessDayDate();
  }
  getBusinessDayDateForGuard(): Observable<number> {
    return this.bodEodFacade.getBusinessDayDateForGuard();
  }
  getGoldRateAvailablityStatus(): Observable<boolean> {
    return this.bodEodFacade.getGoldRateAvailablityStatus();
  }
  getGoldRate(): Observable<number> {
    return this.bodEodFacade.getGoldRate();
  }
  getCurrentDayBodStatus(): Observable<string> {
    return this.bodEodFacade.getCurrentDayBodStatus();
  }
  getIsLoading(): Observable<boolean> {
    return this.bodEodFacade.getIsLoading();
  }
  getError(): Observable<CustomErrors> {
    return this.bodEodFacade.getError();
  }
  getBodEodStatus(): Observable<string> {
    return this.bodEodFacade.getBodEodStatus();
  }
  getFiscalYear(): Observable<number> {
    return this.bodEodFacade.getFiscalYear();
  }

  getEodBusinessDate(): Observable<number> {
    this.bodEodFacade.loadEodBusinessDate();
    return this.bodEodFacade.getEodBusinessDate().pipe(
      filter(date => date !== -1),
      take(1)
    );
  }
  getLatestBusinessDate(): Observable<number> {
    this.bodEodFacade.loadLatestBusinessDay();
    return this.bodEodFacade.getLatestBusinessDate().pipe(
      filter(date => date !== -1),
      take(1)
    );
  }
}
