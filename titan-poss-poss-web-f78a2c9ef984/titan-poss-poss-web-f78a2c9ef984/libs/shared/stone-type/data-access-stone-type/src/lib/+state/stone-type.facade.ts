import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  LoadStoneTypeListingPayload,
  SaveStoneTypeFormDetailsPayload
} from '@poss-web/shared/models';

import * as stoneTypeActions from './stone-type.actions';
import { StoneTypeState } from './stone-type.state';
import { StoneTypeSelectors } from './stone-type.selectors';

@Injectable()
export class StoneTypeFacade {
  constructor(private store: Store<StoneTypeState>) {}

  private stoneTypeListing$ = this.store.select(
    StoneTypeSelectors.selectStoneTypeDetailsListing
  );

  private StoneTypeDetailsByStoneTypeCode$ = this.store.select(
    StoneTypeSelectors.selectStoneTypeDetailsByStoneTypeCode
  );

  private isLoading$ = this.store.select(StoneTypeSelectors.selectIsLoading);

  private isstoneTypeSaved$ = this.store.select(
    StoneTypeSelectors.selectSavestoneTypeFormResponse
  );

  private isstoneTypeEdited$ = this.store.select(
    StoneTypeSelectors.selectEditstoneTypeFormResponse
  );

  private totalstoneTypeDetails$ = this.store.select(
    StoneTypeSelectors.selectTotalStoneTypeDetailsCount
  );

  private hasError$ = this.store.select(StoneTypeSelectors.selectError);

  getstoneTypeSaveResponse() {
    return this.isstoneTypeSaved$;
  }

  getstoneTypeEditResponse() {
    return this.isstoneTypeEdited$;
  }

  getisLoading() {
    return this.isLoading$;
  }

  getTotalstoneTypeDetails() {
    return this.totalstoneTypeDetails$;
  }

  getstoneTypeDetailsListing() {
    return this.stoneTypeListing$;
  }

  getstoneTypeDetailsBystoneTypeCode() {
    return this.StoneTypeDetailsByStoneTypeCode$;
  }

  getError() {
    return this.hasError$;
  }

  loadStoneTypeDetailsBystoneTypeCode(stoneType: string) {
    this.store.dispatch(
      new stoneTypeActions.LoadStoneTypeByStoneTypeCode(stoneType)
    );
  }

  loadStoneTypeDetailsListing(
    loadStoneTypeDetailsListingPayload: LoadStoneTypeListingPayload
  ) {
    this.store.dispatch(
      new stoneTypeActions.LoadStoneTypeDetails(
        loadStoneTypeDetailsListingPayload
      )
    );
  }

  resetstoneTypeDialogData() {
    this.store.dispatch(new stoneTypeActions.ResetStoneTypeDialog());
  }

  editstoneTypeFormDetails(editFormDetails: SaveStoneTypeFormDetailsPayload) {
    this.store.dispatch(
      new stoneTypeActions.EditStoneTypeFormDetails(editFormDetails)
    );
  }

  savestoneTypeFormDetails(saveFormDetails: SaveStoneTypeFormDetailsPayload) {
    this.store.dispatch(
      new stoneTypeActions.SaveStoneTypeFormDetails(saveFormDetails)
    );
  }

  searchStoneType(stoneTypeCode: string) {
    this.store.dispatch(
      new stoneTypeActions.SearchStoneTypeCode(stoneTypeCode)
    );
  }
}
