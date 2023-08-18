import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { FOCBCLSelectors } from './foc-bcl.selectors';
import { FOCBCLState } from './foc-bcl.state';
import * as FOCBCLActions from './foc-bcl.actions';
import { FOCBCLListingPayload } from '@poss-web/shared/models';
@Injectable()
export class FOCBCLFacade {
  constructor(private store: Store<FOCBCLState>) {}
  private error$ = this.store.select(FOCBCLSelectors.selectError);
  private isLoading$ = this.store.select(FOCBCLSelectors.selectIsLoading);
  private hasSaved$ = this.store.select(FOCBCLSelectors.selectHasSaved);
  private schemeId$ = this.store.select(FOCBCLSelectors.selectSchemeId);

  private totalElements$ = this.store.select(
    FOCBCLSelectors.selectTotalElements
  );
  private FOCBCLDetails$ = this.store.select(
    FOCBCLSelectors.selectFOCBCLDetails
  );
  private selectedLocatons$ = this.store.select(
    FOCBCLSelectors.selectSelectedLocations
  );
  getError() {
    return this.error$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getFOCBCLDetails() {
    return this.FOCBCLDetails$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getSchemeId() {
    return this.schemeId$;
  }
  getSelectedLocations() {
    return this.selectedLocatons$;
  }

  saveFOCBCLDetails(savePayload: any) {
    this.store.dispatch(new FOCBCLActions.SaveFOCBCLDetails(savePayload));
  }
  searchLocationCode(searchPayload: {
    schemeId: string;
    locationCode: string;
  }) {
    this.store.dispatch(new FOCBCLActions.SearchLocation(searchPayload));
  }
  loadFOCBCLDetails(listPayload: FOCBCLListingPayload) {
    this.store.dispatch(new FOCBCLActions.LoadFOCBCLDetails(listPayload));
  }
  loadFOCSchemes(schemeName: string) {
    this.store.dispatch(new FOCBCLActions.LoadFOCSchemes(schemeName));
  }
  resetFOCBCLDetails() {
    this.store.dispatch(new FOCBCLActions.ResetFocBclDetails());
  }
  loadSelectedLocations(payload: FOCBCLListingPayload) {
    this.store.dispatch(new FOCBCLActions.LoadSelectedLocations(payload));
  }
}
