import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RangeState } from './range.state';
import * as RangeActions from './range.actions';
import { RangeSelectors } from './range.selector';
@Injectable()
export class RangeFacade {
  constructor(private store: Store<RangeState>) {}
  private ranges$ = this.store.select(RangeSelectors.selectRanges);
  private hasSaved$ = this.store.select(RangeSelectors.selectHasSaved);
  private isLoading$ = this.store.select(RangeSelectors.selectIsLoading);
  private error$ = this.store.select(RangeSelectors.selectError);
  private rangeTypes$ = this.store.select(RangeSelectors.selectRangeTypes);
  getHasSaved() {
    return this.hasSaved$;
  }
  getRanges() {
    return this.ranges$;
  }

  getIsLoading() {
    return this.isLoading$;
  }
  getError() {
    return this.error$;
  }
  getRangeTypes() {
    return this.rangeTypes$;
  }
  loadRanges(rangeType: string) {
    this.store.dispatch(new RangeActions.LoadRanges(rangeType));
  }
  saveRanges(savePayload: { rangeType: string; savePayload: any }) {
    this.store.dispatch(new RangeActions.SaveRanges(savePayload));
  }
  loadRangeTypes(type: string) {
    this.store.dispatch(new RangeActions.LoadRangeTypes(type));
  }
  resetRanges() {
    this.store.dispatch(new RangeActions.ResetRanges());
  }
}
