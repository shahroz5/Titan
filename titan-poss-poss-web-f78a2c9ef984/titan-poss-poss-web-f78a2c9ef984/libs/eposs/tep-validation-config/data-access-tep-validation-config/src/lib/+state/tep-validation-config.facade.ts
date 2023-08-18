import { Injectable } from '@angular/core';
import * as TepValidationConfigActions from './tep-validation-config.actons';
import {
  TEPValidationConfigListingPayload,
  TEPValidationConfigResult
} from '@poss-web/shared/models';

import { Store } from '@ngrx/store';
import { TepValidationConfigState } from './tep-validation-config.state';
import { tepValidationConfigSelectors } from './tep-validation-config.selectors';

@Injectable()
export class TepValidationConfigFacade {
  constructor(private store: Store<TepValidationConfigState>) {}

  private tepValidationConfiglist$ = this.store.select(
    tepValidationConfigSelectors.selectTepValidationConfiglist
  );
  private tepValidationConfigDetails$ = this.store.select(
    tepValidationConfigSelectors.selectTepValidationConfigDetails
  );
  private totalElements$ = this.store.select(
    tepValidationConfigSelectors.selectTotalElements
  );
  private hasSaved$ = this.store.select(
    tepValidationConfigSelectors.selectHasSaved
  );
  private hasUpdated$ = this.store.select(
    tepValidationConfigSelectors.selectHasUpdated
  );
  private hasError$ = this.store.select(
    tepValidationConfigSelectors.selectError
  );
  private isLoading$ = this.store.select(
    tepValidationConfigSelectors.selectIsLoading
  );

  getTepValidationConfigList() {
    return this.tepValidationConfiglist$;
  }

  getTotalElements() {
    return this.totalElements$;
  }

  getTepValidationConfigDetails() {
    return this.tepValidationConfigDetails$;
  }

  getHasSaved() {
    return this.hasSaved$;
  }

  getHasUpdated() {
    return this.hasUpdated$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  getError() {
    return this.hasError$;
  }

  loadTepValidationConfigList(
    tepExceptionConfigPayload: TEPValidationConfigListingPayload
  ) {
    this.store.dispatch(
      new TepValidationConfigActions.LoadTepValidationConfigListing(
        tepExceptionConfigPayload
      )
    );
  }

  searchTepValidationConfig(filter: string) {
    this.store.dispatch(
      new TepValidationConfigActions.SearchTepValidationConfigDetails(filter)
    );
  }

  loadTepValidationConfigDetails(condigId: string) {
    this.store.dispatch(
      new TepValidationConfigActions.LoadTepValidationConfigDetails(condigId)
    );
  }

  saveTepValidationConfigDetails(
    saveTEPValidationConfigPayload: TEPValidationConfigResult
  ) {
    this.store.dispatch(
      new TepValidationConfigActions.SaveTepValidationConfigDetails(
        saveTEPValidationConfigPayload
      )
    );
  }
  updateTepValidationConfigDetails(
    updateTEPValidationConfigPayload: Partial<TEPValidationConfigResult>
  ) {
    this.store.dispatch(
      new TepValidationConfigActions.UpdateTepValidationConfigDetails(
        updateTEPValidationConfigPayload
      )
    );
  }
}
