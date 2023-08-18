import { Injectable } from '@angular/core';
import * as TepProductGroupConfigActions from './tep-product-group-config.actons';
import {
  AddTEPProductGroupsMapping,
  TEPProductGroupConfigDetails,
  TEPProductGroupConfigListingPayload,
  TEPProductGroupMappingListingPayload
} from '@poss-web/shared/models';

import { Store } from '@ngrx/store';
import { TepProductGroupConfigState } from './tep-product-group-config.state';
import { tepProductGroupConfigSelectors } from './tep-product-group-config.selectors';

@Injectable()
export class TepProductGroupConfigFacade {
  constructor(private store: Store<TepProductGroupConfigState>) {}

  private tepProductGroupConfiglist$ = this.store.select(
    tepProductGroupConfigSelectors.selectTepProductGroupConfiglist
  );
  private tepProductGroupConfigDetails$ = this.store.select(
    tepProductGroupConfigSelectors.selectTepProductGroupConfigDetails
  );
  private totalElements$ = this.store.select(
    tepProductGroupConfigSelectors.selectTotalElements
  );
  private tepProductGroupMappinglist$ = this.store.select(
    tepProductGroupConfigSelectors.selectTepProductGroupMappinglist
  );
  private totalMappingElements$ = this.store.select(
    tepProductGroupConfigSelectors.selectTotalMappingElements
  );
  private hasSaved$ = this.store.select(
    tepProductGroupConfigSelectors.selectHasSaved
  );
  private hasUpdated$ = this.store.select(
    tepProductGroupConfigSelectors.selectHasUpdated
  );
  private hasError$ = this.store.select(
    tepProductGroupConfigSelectors.selectError
  );
  private isLoading$ = this.store.select(
    tepProductGroupConfigSelectors.selectIsLoading
  );

  getTepProductGroupConfigList() {
    return this.tepProductGroupConfiglist$;
  }

  getTotalElements() {
    return this.totalElements$;
  }

  getTepProductGroupConfigDetails() {
    return this.tepProductGroupConfigDetails$;
  }

  getTepProductGroupMappingList() {
    return this.tepProductGroupMappinglist$;
  }

  getTotalMappingElements() {
    return this.totalMappingElements$;
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

  loadTepProductGroupConfigList(
    tepExceptionConfigPayload: TEPProductGroupConfigListingPayload
  ) {
    this.store.dispatch(
      new TepProductGroupConfigActions.LoadTepProductGroupConfigListing(
        tepExceptionConfigPayload
      )
    );
  }

  searchTepProductGroupConfig(filter: string) {
    this.store.dispatch(
      new TepProductGroupConfigActions.SearchTepProductConfigDetails(filter)
    );
  }

  loadTepProductGroupConfigDetails(condigId: string) {
    this.store.dispatch(
      new TepProductGroupConfigActions.LoadTepProductGroupConfigDetails(
        condigId
      )
    );
  }

  saveTepProductGroupConfigDetails(
    saveTEPProductGroupConfigPayload: TEPProductGroupConfigDetails
  ) {
    this.store.dispatch(
      new TepProductGroupConfigActions.SaveTepProductGroupConfigDetails(
        saveTEPProductGroupConfigPayload
      )
    );
  }
  updateTepProductGroupConfigDetails(
    updateTEPProductGroupConfigPayload: Partial<TEPProductGroupConfigDetails>
  ) {
    this.store.dispatch(
      new TepProductGroupConfigActions.UpdateTepProductGroupConfigDetails(
        updateTEPProductGroupConfigPayload
      )
    );
  }

  loadTepProductGroupMappingList(
    tepExceptionMappingPayload: TEPProductGroupMappingListingPayload
  ) {
    this.store.dispatch(
      new TepProductGroupConfigActions.LoadTepProductGroupMappintListing(
        tepExceptionMappingPayload
      )
    );
  }

  searchTepProductGroupMapping(configId: string, filter: string) {
    this.store.dispatch(
      new TepProductGroupConfigActions.SearchTepProductGroupMappintListing({
        configId,
        filter
      })
    );
  }

  saveTepProductGroupMappingDetails(
    configId: string,
    addTEPProductGroupsMapping: AddTEPProductGroupsMapping
  ) {
    this.store.dispatch(
      new TepProductGroupConfigActions.SaveTepProductGroupMapping({
        configId,
        addTEPProductGroupsMapping
      })
    );
  }
  // searchTepExceptionConfig(configId: string) {
  //   this.store.dispatch(
  //     new TepExceptionConfigActions.SearchTepExceptionConfigDetails(configId)
  //   );
  // }
}
