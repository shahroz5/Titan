import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { RegionSelectors } from './region.selectors';
import * as RegionActions from './region.actions';
import { RegionsState } from './region.state';
import {
  LoadRegionListingPayload,
  SaveRegionDetailsPayload,
  EditRegionDetailsPayload
} from '@poss-web/shared/models';

@Injectable()
export class RegionFacade {
  constructor(private store: Store<RegionsState>) {}

  private regionListing$ = this.store.select(
    RegionSelectors.selectLoadedRegionListing
  );
  private totalRegionDetails$ = this.store.select(
    RegionSelectors.selectTotalRegionDetailsCount
  );

  private isRegionLoading$ = this.store.select(
    RegionSelectors.selectIsRegionListingLoading
  );

  private regionDetailsByRegionCode$ = this.store.select(
    RegionSelectors.selectRegionByRegionCode
  );

  private isRegionDetailsSaved$ = this.store.select(
    RegionSelectors.selectSaveRegionDetailsResponse
  );

  private isRegionDetailsEdited$ = this.store.select(
    RegionSelectors.selectEditRegionDetailsResponse
  );

  private regionError$ = this.store.select(RegionSelectors.selectError);

  // private isSearchElements$ = this.store.select(
  //   RegionSelectors.selectIssearchElements
  // );
  getIsRegionListingLoading() {
    return this.isRegionLoading$;
  }
  getError() {
    return this.regionError$;
  }

  getTotalRegionDetails() {
    return this.totalRegionDetails$;
  }

  getRegionDetailsListing() {
    return this.regionListing$;
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

  // getIsSerchElements() {
  //   return this.isSearchElements$;
  // }
  resetRegionDialogData() {
    this.store.dispatch(new RegionActions.ResetRegionDialog());
  }
  loadRegionDetailsListing(regionListingPayload: LoadRegionListingPayload) {
    this.store.dispatch(
      new RegionActions.LoadRegionDetails(regionListingPayload)
    );
  }

  loadRegionByRegionCode(regionCode: string) {
    this.store.dispatch(new RegionActions.LoadRegionByCode(regionCode));
  }

  saveRegionFormDetails(saveFormDetails: SaveRegionDetailsPayload) {
    this.store.dispatch(
      new RegionActions.SaveRegionFormDetails(saveFormDetails)
    );
  }

  editRegionFormDetails(editFormDetails: EditRegionDetailsPayload) {
    this.store.dispatch(new RegionActions.EditRegionDetails(editFormDetails));
  }

  searchRegion(regionCode: string) {
    this.store.dispatch(new RegionActions.SearchRegion(regionCode));
  }
}
