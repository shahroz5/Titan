import { Injectable } from '@angular/core';
import * as TepStoneConfigActions from './tep-stone-config.actons';
import {
  TEPStoneConfig,
  TEPStoneConfigListingPayload,
  TEPStoneDetailsModify
} from '@poss-web/shared/models';

import { Store } from '@ngrx/store';
import { tepStoneConfigSelectors } from './tep-stone-config.selectors';
import { TepStoneConfigState } from './tep-stone-config.state';

@Injectable()
export class TepStoneConfigFacade {
  constructor(private store: Store<TepStoneConfigState>) {}

  private tepStoneConfigList$ = this.store.select(
    tepStoneConfigSelectors.selectTepStoneConfigList
  );
  private tepStoneConfigDetails$ = this.store.select(
    tepStoneConfigSelectors.selectTepStoneConfigDetails
  );
  private tepStoneConfigDetailslist$ = this.store.select(
    tepStoneConfigSelectors.selectTepStoneConfigDetailslist
  );
  private totalElements$ = this.store.select(
    tepStoneConfigSelectors.selectTotalElements
  );

  private hasSaved$ = this.store.select(tepStoneConfigSelectors.selectHasSaved);
  private hasUpdated$ = this.store.select(
    tepStoneConfigSelectors.selectHasUpdated
  );
  private hasError$ = this.store.select(tepStoneConfigSelectors.selectError);
  private isLoading$ = this.store.select(
    tepStoneConfigSelectors.selectIsLoading
  );

  private tepStoneConfigStoneType$ = this.store.select(
    tepStoneConfigSelectors.selectTepStoneConfigStoneType
  );
  private tepStoneConfigQualities$ = this.store.select(
    tepStoneConfigSelectors.selectTepStoneConfigQualities
  );
  private tepStoneConfigRange$ = this.store.select(
    tepStoneConfigSelectors.selectTepStoneConfigRange
  );

  getTepStoneConfigList() {
    return this.tepStoneConfigList$;
  }

  getTepStoneConfigDetailsList() {
    return this.tepStoneConfigDetailslist$;
  }

  getTepStoneConfigDetails() {
    return this.tepStoneConfigDetails$;
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
  getTepStoneConfigStoneType() {
    return this.tepStoneConfigStoneType$;
  }
  getTepStoneConfigQualities() {
    return this.tepStoneConfigQualities$;
  }
  getTepStoneConfigRange() {
    return this.tepStoneConfigRange$;
  }

  loadTepStoneConfigList(tepStoneConfigPayload: TEPStoneConfigListingPayload) {
    this.store.dispatch(
      new TepStoneConfigActions.LoadTepStoneConfigListing(tepStoneConfigPayload)
    );
  }

  loadTepStoneConfigDetails(configId: string) {
    this.store.dispatch(
      new TepStoneConfigActions.LoadTepStoneConfigDetails(configId)
    );
  }

  loadTepStoneConfigDetailsList(configId: string) {
    this.store.dispatch(
      new TepStoneConfigActions.LoadTepStoneConfigDataListing(configId)
    );
  }
  LoadTepStoneTypesListing() {
    this.store.dispatch(new TepStoneConfigActions.LoadTepStoneTypesListing());
  }
  LoadTepStoneQualitiesListing() {
    this.store.dispatch(
      new TepStoneConfigActions.LoadTepStoneQualitiesListing()
    );
  }
  LoadTepStoneRangeListing() {
    this.store.dispatch(new TepStoneConfigActions.LoadTepStoneRangeListing());
  }

  saveTepStoneConfigDetails(
    configId: string,
    tepStoneDetails: TEPStoneDetailsModify
  ) {
    this.store.dispatch(
      new TepStoneConfigActions.SaveTepStoneConfigDataDetails({
        configId,
        tepStoneDetails
      })
    );
  }
  editTepStoneConfigDetails(
    configId: string,
    tepStoneDetails: TEPStoneDetailsModify
  ) {
    this.store.dispatch(
      new TepStoneConfigActions.EditTepStoneConfigDataDetails({
        configId,
        tepStoneDetails
      })
    );
  }
  removeTepStoneConfigDetails(
    configId: string,
    tepStoneDetails: TEPStoneDetailsModify
  ) {
    this.store.dispatch(
      new TepStoneConfigActions.RemoveTepStoneConfigDataDetails({
        configId,
        tepStoneDetails
      })
    );
  }

  saveTepStoneConfig(formData: TEPStoneConfig) {
    this.store.dispatch(new TepStoneConfigActions.SaveTepStoneConfig(formData));
  }

  updateTepStoneConfigDetails(formData: TEPStoneConfig) {
    this.store.dispatch(
      new TepStoneConfigActions.UpdateTepStoneConfigDetails(formData)
    );
  }

  searchTepStoneConfig(filter: string) {
    this.store.dispatch(
      new TepStoneConfigActions.SearchTepStoneConfigDetails(filter)
    );
  }

  
  searchTepStoneConfigDetails(configId: string, filter: string) {
    this.store.dispatch(
      new TepStoneConfigActions.SearchTepStoneConfigDataListing({
        configId,
        filter
      })
    );
  }
}
