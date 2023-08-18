import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UpdateHallmarkSelector } from './update-hallmark.selectors';
import * as UpdateHallmarkActions from './update-hallmark.action';
import { UpdateHallmarkState } from './update-hallmark.state';
import { BinRequestDto, HistoryFiltersData, UpdateHallmarkDetails } from '@poss-web/shared/models';

@Injectable()
export class UpdateHallmarkFacade {
  private isHallmarkDetailsUpdated$ = this.store.select(UpdateHallmarkSelector.selectIsHallmarkDetailsUpdated);

  private hasError$ = this.store.select(UpdateHallmarkSelector.selectHasError);

  private isLoading$ = this.store.select(UpdateHallmarkSelector.selectIsLoading);

  constructor(private store: Store<UpdateHallmarkState>) {}

  updateHallmarkDetails(payload: UpdateHallmarkDetails) {
    this.store.dispatch(new UpdateHallmarkActions.UpdateItemHallmarkDetails(payload));
  }

  resetError() {
    this.store.dispatch(new UpdateHallmarkActions.ResetError());
  }

  getError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getIsHallmarkDetailsUpdated() {
    return this.isHallmarkDetailsUpdated$;
  }
}
