import { Injectable } from '@angular/core';
import * as TepExceptionConfigActions from './tep-exception-config.actons';
import {
  TEPExceptionConfig,
  TEPExceptionConfigFilter,
  TEPExceptionConfigListingPayload
} from '@poss-web/shared/models';

import { Store } from '@ngrx/store';
import { TepExceptionConfigState } from './tep-exception-config.state';
import { tepExceptionConfigSelectors } from './tep-exception-config.selectors';

@Injectable()
export class TepExceptionConfigFacade {
  constructor(private store: Store<TepExceptionConfigState>) {}

  private tepExceptionConfigList$ = this.store.select(
    tepExceptionConfigSelectors.selectTepExceptionConfigList
  );
  private tepExceptionConfigDetails$ = this.store.select(
    tepExceptionConfigSelectors.selectTepExceptionConfigDetails
  );
  private totalElements$ = this.store.select(
    tepExceptionConfigSelectors.selectTotalElements
  );
  private maxFlatTepExchangeValue$ = this.store.select(
    tepExceptionConfigSelectors.selectMaxFlatTepExchangeValue
  );
  private hasSaved$ = this.store.select(
    tepExceptionConfigSelectors.selectHasSaved
  );
  private hasUpdated$ = this.store.select(
    tepExceptionConfigSelectors.selectHasUpdated
  );
  private hasError$ = this.store.select(
    tepExceptionConfigSelectors.selectError
  );
  private isLoading$ = this.store.select(
    tepExceptionConfigSelectors.selectIsLoading
  );

  getTepExceptionConfigList() {
    return this.tepExceptionConfigList$;
  }

  getTepExceptionConfigDetails() {
    return this.tepExceptionConfigDetails$;
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

  getTotalElements() {
    return this.totalElements$;
  }

  getMaxFlatTepExchangeValue() {
    return this.maxFlatTepExchangeValue$;
  }

  loadTepExceptionConfigList(
    tepExceptionConfigPayload: TEPExceptionConfigListingPayload
  ) {
    this.store.dispatch(
      new TepExceptionConfigActions.LoadTepExceptionConfigListing(
        tepExceptionConfigPayload
      )
    );
  }
  searchTepExceptionConfig(filter: TEPExceptionConfigFilter) {
    this.store.dispatch(
      new TepExceptionConfigActions.SearchTepExceptionConfigDetails(filter)
    );
  }
  saveTepExceptionConfigDetails(
    saveTEPExceptionConfigPayload: TEPExceptionConfig
  ) {
    this.store.dispatch(
      new TepExceptionConfigActions.SaveTepExceptionConfigDetails(
        saveTEPExceptionConfigPayload
      )
    );
  }
  updateTepExceptionConfigDetails(
    updateTEPExceptionConfigPayload: TEPExceptionConfig
  ) {
    this.store.dispatch(
      new TepExceptionConfigActions.UpdateTepExceptionConfigDetails(
        updateTEPExceptionConfigPayload
      )
    );
  }

  loadTepExceptionConfigDetails(brandCode: string) {
    this.store.dispatch(
      new TepExceptionConfigActions.LoadTepExceptionConfigDetails(brandCode)
    );
  }

  loadMaxFlatTepExchangeValue() {
    this.store.dispatch(
      new TepExceptionConfigActions.LoadTepGlobalConfigListing()
    );
  }
}
