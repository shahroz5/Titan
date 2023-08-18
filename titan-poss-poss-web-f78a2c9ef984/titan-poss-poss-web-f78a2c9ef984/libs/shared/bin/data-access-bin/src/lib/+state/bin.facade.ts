import { Injectable } from '@angular/core';
import * as BinActions from './bin.actions';
import { BinState } from './bin.state';
import { BinSelectors } from './bin.selectors';
import {
  SaveBinCodeFormPayload,
  BinCodeEditedFormPayload,
  LocationsByBinGroupAndBinCodePayload,
  LocationMappingPostPayload,
  LoadBinGroupDetailsListingPayload,
  BinCodeListingPayload,
  SearchBinCodePayload
} from '@poss-web/shared/models';

import { Store } from '@ngrx/store';
@Injectable()
export class BinFacade {
  constructor(private store: Store<BinState>) {}

  private isBinCodeLoading$ = this.store.select(
    BinSelectors.selectIsBinCodeLoading
  );

  private isBinCodeNewSaved$ = this.store.select(
    BinSelectors.selectBinCodeNewFormResponse
  );

  private isBinCodeEditSaved$ = this.store.select(
    BinSelectors.selectBinCodeEditFormResponse
  );

  private isLocationMappingSaved$ = this.store.select(
    BinSelectors.selectLocationMappingResponse
  );

  private binCodeDetailsListing$ = this.store.select(
    BinSelectors.selectBinCodeDetailsListing
  );

  private totalBinCodeDetails$ = this.store.select(
    BinSelectors.selectTotalBinCodeDetailsCount
  );

  private binCodesByBinGroupCode$ = this.store.select(
    BinSelectors.selectbinCodesByBinGroupCode
  );

  private locationsByBinCodesAndBinGroup$ = this.store.select(
    BinSelectors.selectLocationsByBinCodesAndBinGroup
  );

  private binCodeError$ = this.store.select(BinSelectors.selectError);

  private isSearchElements$ = this.store.select(
    BinSelectors.selectIssearchElements
  );

  getBinCodeIsLoading() {
    return this.isBinCodeLoading$;
  }

  getBinCodeNewSaveResponse() {
    return this.isBinCodeNewSaved$;
  }

  getBinCodeEditSaveResponse() {
    return this.isBinCodeEditSaved$;
  }

  getTotalBinCodeDetails() {
    return this.totalBinCodeDetails$;
  }

  getBinCodeDetailsListing() {
    return this.binCodeDetailsListing$;
  }

  getBinCodesByBinGroup() {
    return this.binCodesByBinGroupCode$;
  }

  getLocationsByBinCodesAndBinGroup() {
    return this.locationsByBinCodesAndBinGroup$;
  }

  getError() {
    return this.binCodeError$;
  }

  getIsSerchElements() {
    return this.isSearchElements$;
  }

  getLocationMappingResponse() {
    return this.isLocationMappingSaved$;
  }

  loadBinCodeDetailsListing(
    loadbinCodeDetailsListingPayload: LoadBinGroupDetailsListingPayload
  ) {
    this.store.dispatch(
      new BinActions.LoadBinCodeDetails(loadbinCodeDetailsListingPayload)
    );
  }

  loadBinCodesByBinGroupCode(payload: BinCodeListingPayload) {
    this.store.dispatch(new BinActions.LoadBinCodesByBinGroupCode(payload));
  }

  resetBinCodeDialogData() {
    this.store.dispatch(new BinActions.ResetBinCodeDialog());
  }

  saveBinCodeNewFormDetails(saveFormDetails: SaveBinCodeFormPayload) {
    this.store.dispatch(
      new BinActions.SaveBinCodeNewFormDetails(saveFormDetails)
    );
  }

  saveBinCodeEditedFormDetails(saveFormDetails: BinCodeEditedFormPayload) {
    this.store.dispatch(new BinActions.EditBinCodeFormDetails(saveFormDetails));
  }

  searchBinName(payload: SearchBinCodePayload) {
    this.store.dispatch(new BinActions.SearchBinName(payload));
  }

  loadLocationsByBinCodesAndBinGroup(
    location: LocationsByBinGroupAndBinCodePayload
  ) {
    this.store.dispatch(
      new BinActions.LoadLocationsByBinGroupAndBinCode(location)
    );
  }

  saveLocationMappingDetails(saveMappings: LocationMappingPostPayload) {
    this.store.dispatch(
      new BinActions.SaveLocationMappingDetails(saveMappings)
    );
  }
}
