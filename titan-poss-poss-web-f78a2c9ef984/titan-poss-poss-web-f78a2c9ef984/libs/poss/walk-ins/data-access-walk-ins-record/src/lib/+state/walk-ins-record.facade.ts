import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as WalkInsRecordActions from './walk-ins-record.actions';
import { WalkInsRecordSelectors } from './walk-ins-record.selectors';
import { WalkInsRecordState } from './walk-ins-record.state';
import {
  CustomErrors,
  SaveWalkInDetailsRequestPayload,
  WalkInsDetails,
  WalkInsCountRequestPayload
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class WalkInsRecordFacade {
  constructor(private store: Store<WalkInsRecordState>) {}

  private error$ = this.store.select(WalkInsRecordSelectors.selectError);

  private isLoading$ = this.store.select(
    WalkInsRecordSelectors.selectIsLoading
  );

  private walkInsCount$ = this.store.select(
    WalkInsRecordSelectors.selectWalkInsCount
  );

  private numberOfInvoices$ = this.store.select(
    WalkInsRecordSelectors.selectNumberOfInvoicesCount
  );

  private purchasersCount$ = this.store.select(
    WalkInsRecordSelectors.selectPurchasersCount
  );

  private saveWalkInDetailsResponse$ = this.store.select(
    WalkInsRecordSelectors.selectSaveWalkInDetailsResponse
  );

  private walkInsDate$ = this.store.select(
    WalkInsRecordSelectors.selectWalkInsDate
  );
  private walkInsHistoryData$ = this.store.select(
    WalkInsRecordSelectors.selectWalkInsHistoryData
  );

  setWalksInCount(walkIns: number) {
    this.store.dispatch(new WalkInsRecordActions.SetWalkInsCount(walkIns));
  }

  loadWalkInDetails(walkInDetailsRequestPayload: WalkInsCountRequestPayload) {
    this.store.dispatch(
      new WalkInsRecordActions.LoadWalkInDetailsForBusinessDay(
        walkInDetailsRequestPayload
      )
    );
  }

  loadWalkInsHistoryDate() {
    this.store.dispatch(new WalkInsRecordActions.LoadWalkInsHistoryData());
  }

  saveWalkInDetails(
    saveWalkInDetailsRequestPayload: SaveWalkInDetailsRequestPayload
  ) {
    this.store.dispatch(
      new WalkInsRecordActions.LoadSaveWalkInDetails(
        saveWalkInDetailsRequestPayload
      )
    );
  }
  clearWalkInDetails() {
    this.store.dispatch(new WalkInsRecordActions.ClearValues());
  }
  resetWalkInDetails() {
    this.store.dispatch(new WalkInsRecordActions.ResetValues());
  }

  getWalksInCount(): Observable<number> {
    return this.walkInsCount$;
  }

  getNumberOfInvoices(): Observable<number> {
    return this.numberOfInvoices$;
  }

  getPurchasersCount(): Observable<number> {
    return this.purchasersCount$;
  }

  getSaveWalkInDetailsResponse(): Observable<WalkInsDetails> {
    return this.saveWalkInDetailsResponse$;
  }

  getWalkInsDate() {
    return this.walkInsDate$;
  }
  getWalkInsHistoryData() {
    return this.walkInsHistoryData$;
  }
  getIsLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  getError(): Observable<CustomErrors> {
    return this.error$;
  }
}
