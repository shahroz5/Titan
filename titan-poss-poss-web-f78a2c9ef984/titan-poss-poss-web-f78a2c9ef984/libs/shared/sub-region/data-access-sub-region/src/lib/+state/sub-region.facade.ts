import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as SubRegionActions from './sub-region.actions';
import { SubRegionSelectors } from './sub-region.selectors';
import { SubRegionState } from './sub-region.state';
import {
  LoadSubRegionDetailsListingPayload,
  SaveSubRegionDetailsPayload,
  EditSubRegionDetailsPayload,
  SearchSubRegionPayload
} from '@poss-web/shared/models';

@Injectable()
export class SubRegionFacade {
  constructor(private store: Store<SubRegionState>) {}

  private regionListing$ = this.store.select(
    SubRegionSelectors.selectLoadedRegionListing
  );

  private subRegionListing$ = this.store.select(
    SubRegionSelectors.selectLoadedSubRegionListing
  );
  private totalRegionDetails$ = this.store.select(
    SubRegionSelectors.selectTotalSubRegionDetailsCount
  );

  private isRegionLoading$ = this.store.select(
    SubRegionSelectors.selectIsSubRegionListingLoading
  );

  private regionDetailsByRegionCode$ = this.store.select(
    SubRegionSelectors.selectSubRegionByRegionCode
  );

  private isRegionDetailsSaved$ = this.store.select(
    SubRegionSelectors.selectSaveSubRegionDetailsResponse
  );

  private isRegionDetailsEdited$ = this.store.select(
    SubRegionSelectors.selectEditSubRegionDetailsResponse
  );

  private regionError$ = this.store.select(SubRegionSelectors.selectError);

  private isSearchElements$ = this.store.select(
    SubRegionSelectors.selectIssearchElements
  );

  getRegionDetailsListing() {
    return this.regionListing$;
  }

  getSubRegionDetailsListing() {
    return this.subRegionListing$;
  }

  getTotalRegionDetails() {
    return this.totalRegionDetails$;
  }

  getIsRegionListingLoading() {
    return this.isRegionLoading$;
  }

  getRegionByRegionCode() {
    return this.regionDetailsByRegionCode$;
  }

  getRegionDetailsSaveResponse() {
    return this.isRegionDetailsSaved$;
  }

  getRegionDetailsEditResponse() {
    return this.isRegionDetailsEdited$;
  }

  getError() {
    return this.regionError$;
  }

  getIsSerchElements() {
    return this.isSearchElements$;
  }

  resetRegionDialogData() {
    this.store.dispatch(new SubRegionActions.ResetSubRegionDialog());
  }

  loadRegionDetailsListing() {
    this.store.dispatch(new SubRegionActions.LoadRegionDetails());
  }

  loadSubRegionDetailsListing(pageListing: LoadSubRegionDetailsListingPayload) {
    this.store.dispatch(new SubRegionActions.LoadSubRegionDetails(pageListing));
  }

  loadRegionByRegionCode(regionCode: string) {
    this.store.dispatch(new SubRegionActions.LoadSubRegionByCode(regionCode));
  }

  saveRegionFormDetails(saveFormDetails: SaveSubRegionDetailsPayload) {
    this.store.dispatch(
      new SubRegionActions.SaveSubRegionFormDetails(saveFormDetails)
    );
  }

  editRegionFormDetails(editFormDetails: EditSubRegionDetailsPayload) {
    this.store.dispatch(
      new SubRegionActions.EditSubRegionDetails(editFormDetails)
    );
  }

  searchSubRegion(payload: SearchSubRegionPayload) {
    this.store.dispatch(new SubRegionActions.SearchSubRegion(payload));
  }
}
