import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as glBoutiqueLocationActions from './gl-botique.action';
import { GlBoutiqueLocationState } from './gl-boutique.state';
import { GlBoutiqueLocationSelectors } from './gl-boutique.selectors';
import {
  GlBoutiqueLocationListingPayload,
  GlBoutiqueLocationList
} from '@poss-web/shared/models';

@Injectable()
export class GlBoutiqueLocationFacade {
  constructor(private store: Store<GlBoutiqueLocationState>) {}

  private isLoading$ = this.store.select(
    GlBoutiqueLocationSelectors.selectIsLoading
  );

  private hasError$ = this.store.select(
    GlBoutiqueLocationSelectors.selectError
  );

  private glBoutiqueListing$ = this.store.select(
    GlBoutiqueLocationSelectors.selectGlBoutiqueLocationListing
  );

  private glBoutiqueLocationByLocationCode$ = this.store.select(
    GlBoutiqueLocationSelectors.selectGlBoutiqueLocationByLocationCode
  );
  private totalGlBoutiqueLocation$ = this.store.select(
    GlBoutiqueLocationSelectors.selectTotalGlBoutiqueLocationCount
  );
  private isSaved$ = this.store.select(
    GlBoutiqueLocationSelectors.selectIsSaved
  );

  private isEdited$ = this.store.select(
    GlBoutiqueLocationSelectors.selectIsEdited
  );

  getIsLoading() {
    return this.isLoading$;
  }
  getIsSaved() {
    return this.isSaved$;
  }
  getIsEdited() {
    return this.isEdited$;
  }
  getError() {
    return this.hasError$;
  }
  getGlBoutiqueLocationSaveResponse() {
    return this.isSaved$;
  }
  getGlBoutiqueLocationEditResponse() {
    return this.isEdited$;
  }

  getTotalglBoutiqueLocation() {
    return this.totalGlBoutiqueLocation$;
  }

  getGlBoutiqueListingListing() {
    return this.glBoutiqueListing$;
  }

  getGlBoutiqueLocationByLocationCode() {
    return this.glBoutiqueLocationByLocationCode$;
  }

  loadGlBoutiqueLocationByLocationCode(stoneType: string) {
    this.store.dispatch(
      new glBoutiqueLocationActions.LoadGlBoutiqueListByLocationCode(stoneType)
    );
  }

  loadGlBoutiqueLocationListing(
    listingPayload: GlBoutiqueLocationListingPayload
  ) {
    this.store.dispatch(
      new glBoutiqueLocationActions.LoadGlBoutiqueList(listingPayload)
    );
  }

  editGlBoutiqueLocationDetails(payload: GlBoutiqueLocationList) {
    this.store.dispatch(
      new glBoutiqueLocationActions.EditGlBoutqueLocationDetails(payload)
    );
  }

  saveGlBoutiqueLocationDetails(payload: GlBoutiqueLocationList) {
    this.store.dispatch(
      new glBoutiqueLocationActions.SaveGlBoutqueLocationDetails(payload)
    );
  }
  searchGlBoutiqueLocation(locationCode: string) {
    this.store.dispatch(
      new glBoutiqueLocationActions.SearchByLocationCode(locationCode)
    );
  }
  resetGlBoutiqueDetails() {
    this.store.dispatch(new glBoutiqueLocationActions.ResetGlBoutiqueDetails());
  }
}
