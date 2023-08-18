import { Injectable } from '@angular/core';
import * as BinGroupActions from './bin-group.actions';
import { BinGroupState } from './bin-group.state';
import {
  LoadBinGroupDetailsListingPayload,
  SaveBinGroupFormDetailsPayload
} from '@poss-web/shared/models';
import { BinGroupSelectors } from './bin-group.selectors';

import { Store } from '@ngrx/store';


@Injectable()
export class BinGroupFacade {

  constructor(private store: Store<BinGroupState>) { }

  private binGroupDetailsListing$ = this.store.select(BinGroupSelectors.selectLoadedBinGroupListing);

  private binGroupDetailsByBinGroupCode$ = this.store.select(BinGroupSelectors.selectbinGroupDetailsByBinGroupCode);

  private isLoading$ = this.store.select(BinGroupSelectors.selectIsLoading);

  private isBinGroupSaved$ = this.store.select(BinGroupSelectors.selectSaveBinGroupFormResponse);

  private isBinGroupEdited$ = this.store.select(BinGroupSelectors.selectEditBinGroupFormResponse);

  private totalBinGroupDetails$ = this.store.select(BinGroupSelectors.selectTotalBinGroupDetailsCount);

  private binGroupError$ = this.store.select(BinGroupSelectors.selectError);

  private isSearchElements$ = this.store.select(BinGroupSelectors.selectIssearchElements);




  getBinGroupSaveResponse() {
    return this.isBinGroupSaved$;
  }

  getBinGroupEditResponse() {
    return this.isBinGroupEdited$;
  }

  getisLoading() {
    return this.isLoading$;
  }

  getTotalBinGroupDetails() {
    return this.totalBinGroupDetails$;
  }

  getBinGroupDetailsListing() {
    return this.binGroupDetailsListing$;
  }

  getBinGroupDetailsByBinGroupCode() {
    return this.binGroupDetailsByBinGroupCode$;
  }

  getError() {
    return this.binGroupError$;
  }

  getIsSerchElements() {
    return this.isSearchElements$;
  }

  loadBinGroupDetailsByBinGroupCode(binGroup: string) {
    this.store.dispatch(new BinGroupActions.LoadBinGroupByBinGroupCode(binGroup));
  }

  loadBinGroupDetailsListing(loadbinGroupDetailsListingPayload: LoadBinGroupDetailsListingPayload) {
    this.store.dispatch(new BinGroupActions.LoadBinGroupDetails(loadbinGroupDetailsListingPayload));
  }

  resetBinGroupDialogData() {
    this.store.dispatch(new BinGroupActions.ResetBinGroupDialog());
  }

  searchBinGroup(binGroupCode: string) {
    this.store.dispatch(new BinGroupActions.SearchByBinGroupCode(binGroupCode));
  }

  clearSearch() {
    this.store.dispatch(new BinGroupActions.SearchClear());
  }

  editBinGroupFormDetails(editFormDetails: SaveBinGroupFormDetailsPayload) {
    this.store.dispatch(new BinGroupActions.EditBinGroupFormDetails(editFormDetails));
  }

  saveBinGroupFormDetails(saveFormDetails: SaveBinGroupFormDetailsPayload) {
    this.store.dispatch(new BinGroupActions.SaveBinGroupFormDetails(saveFormDetails));
  }
}
