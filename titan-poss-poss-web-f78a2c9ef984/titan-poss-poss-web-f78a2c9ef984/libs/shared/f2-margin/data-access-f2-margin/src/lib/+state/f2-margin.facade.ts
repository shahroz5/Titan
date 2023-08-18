import { Injectable } from '@angular/core';
import { F2MarginState } from './f2-margin.state';
import { f2MarginSelectors } from './f2-margin.selector';
import * as F2MarginActions from './f2-margin.action';

import { Store } from '@ngrx/store';
import { F2MarginListPayload } from '@poss-web/shared/models';

@Injectable()
export class F2MarginFacade {
  constructor(private store: Store<F2MarginState>) {}
  private f2MarginList$ = this.store.select(
    f2MarginSelectors.selectf2MarginList
  );
  private error$ = this.store.select(f2MarginSelectors.selectError);

  private isLoading$ = this.store.select(f2MarginSelectors.selectIsLoading);

  private totalElements$ = this.store.select(
    f2MarginSelectors.selectTotalElements
  );

  getF2MarginList() {
    return this.f2MarginList$;
  }

  getError() {
    return this.error$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  getTotalElements() {
    return this.totalElements$;
  }
  loadF2MarginList(f2MarginListPayload: F2MarginListPayload) {
    this.store.dispatch(
      new F2MarginActions.LoadF2MarginList(f2MarginListPayload)
    );
  }

  loadReset() {
    this.store.dispatch(new F2MarginActions.LoadReset());
  }
}
