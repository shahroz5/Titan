import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as ViewTcsActions from './view-tcs.actions';
import { ViewTcsState } from './view-tcs.state';
import { ViewTcsSelectors } from './view-tcs.selectors';
import {} from '@poss-web/shared/models';

@Injectable()
export class ViewTcsFacade {
  private tcsDetails$ = this.store.select(ViewTcsSelectors.selectTcsDetails);

  private isLoading$ = this.store.select(ViewTcsSelectors.selectIsLoading);

  private error$ = this.store.select(ViewTcsSelectors.selectError);

  constructor(private store: Store<ViewTcsState>) {}

  getTcsDetails() {
    return this.tcsDetails$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getError() {
    return this.error$;
  }

  loadTcsDetails(reqestParam) {
    this.store.dispatch(new ViewTcsActions.LoadTcsDetails(reqestParam));
  }
}
