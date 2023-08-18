import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  PIFSeriesPayload,
  SavePIFSeriesPayload
} from '@poss-web/shared/models';
import { PIFSeriesState } from './pif-series.state';
import * as PIFSeriesActions from './pif-series.actions';
import { PIFSeriesSelectors } from './pif-series.selectors';

@Injectable()
export class PIFSeriesFacade {
  constructor(private store: Store<PIFSeriesState>) {}
  private totalElements$ = this.store.select(
    PIFSeriesSelectors.selectTotalElements
  );
  private pifSeriess$ = this.store.select(PIFSeriesSelectors.selectPIFSeries);
  private isLoading$ = this.store.select(PIFSeriesSelectors.selectIsLoading);
  private hasSaved$ = this.store.select(PIFSeriesSelectors.selectHasSaved);
  private error$ = this.store.select(PIFSeriesSelectors.selectError);
  getTotalElements() {
    return this.totalElements$;
  }
  getPIFSeries() {
    return this.pifSeriess$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getError() {
    return this.error$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  loadPIFSeries(payload: PIFSeriesPayload) {
    this.store.dispatch(new PIFSeriesActions.LoadPIFSeries(payload));
  }
  resetPIFSeries() {
    this.store.dispatch(new PIFSeriesActions.ResetPIFSeries());
  }
  savePIFSeries(savePayload: SavePIFSeriesPayload[]) {
    this.store.dispatch(new PIFSeriesActions.SavePIFSeries(savePayload));
  }
}
