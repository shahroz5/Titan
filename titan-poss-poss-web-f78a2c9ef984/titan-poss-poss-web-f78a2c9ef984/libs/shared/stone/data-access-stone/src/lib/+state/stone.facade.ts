import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as stoneActions from './stone.actions';
import { StoneState } from './stone.state';
import { StoneSelectors } from './stone.selectors';
import {
  StoneFilter
} from '@poss-web/shared/models';

@Injectable()
export class StoneFacade {
  constructor(private store: Store<StoneState>) {}

  private stoneListing$ = this.store.select(
    StoneSelectors.selectStoneDetailsListing
  );

  private isLoading$ = this.store.select(StoneSelectors.selectIsLoading);

  private totalStoneDetails$ = this.store.select(
    StoneSelectors.selectTotalStoneDetailsCount
  );
  private stoneFilter$ = this.store.select(StoneSelectors.selectStoneFilter);

  private hasError$ = this.store.select(StoneSelectors.selectError);

  getisLoading() {
    return this.isLoading$;
  }
  getTotalStoneDetails() {
    return this.totalStoneDetails$;
  }
  getStoneDetailsListing() {
    return this.stoneListing$;
  }
  getError() {
    return this.hasError$;
  }

  getStoneFilter() {
    return this.stoneFilter$;
  }

  loadFilteredStoneList(FilterStoneListPayload: StoneFilter) {
    this.store.dispatch(new stoneActions.FilterStone(FilterStoneListPayload));
  }
  loadResetFilter() {
    this.store.dispatch(new stoneActions.ResetFilter());
  }
}
