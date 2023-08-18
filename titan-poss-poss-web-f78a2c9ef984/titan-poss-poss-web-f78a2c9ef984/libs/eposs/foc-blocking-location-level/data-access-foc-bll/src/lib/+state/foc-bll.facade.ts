import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { FOCBLLState } from './foc-bll.state';
import * as FOCBLLActions from './foc-bll.actions';
import { FOCBLLSelectors } from './foc-bll.selectors';
import {
  FOCBlockingLocationLevelListPayload,
  FOCBlockingLocationLevelSavePayload
} from '@poss-web/shared/models';

@Injectable()
export class FOCBLLFacade {
  constructor(private store: Store<FOCBLLState>) {}

  private error$ = this.store.select(FOCBLLSelectors.selectError);
  private isLoading$ = this.store.select(FOCBLLSelectors.selectIsLoading);
  private hasSaved$ = this.store.select(FOCBLLSelectors.selectHasSaved);

  private schemeId$ = this.store.select(FOCBLLSelectors.selectFOCSchemeId);
  private focBlockingDetails$ = this.store.select(
    FOCBLLSelectors.selectFOCBlockingDetails
  );
  private totalElements$ = this.store.select(
    FOCBLLSelectors.selectTotalElements
  );
  private selectedLocatons$ = this.store.select(
    FOCBLLSelectors.selectSelectedLocations
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
  getFOCSchemeId() {
    return this.schemeId$;
  }
  getFocBlockingDetails() {
    return this.focBlockingDetails$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getSelectedLocations() {
    return this.selectedLocatons$;
  }
  saveFOCBLLDetails(savePayload: FOCBlockingLocationLevelSavePayload) {
    this.store.dispatch(new FOCBLLActions.SaveFOCBLLDetails(savePayload));
  }
  searchLocationCode(searchPayload: {
    schemeId: string;
    locationCode: string;
  }) {
    this.store.dispatch(new FOCBLLActions.SearchLocation(searchPayload));
  }
  loadFOCBLLDetails(listPayload: FOCBlockingLocationLevelListPayload) {
    this.store.dispatch(new FOCBLLActions.LoadFOCBLLDetails(listPayload));
  }
  loadFOCSchemes(schemeName: string) {
    this.store.dispatch(new FOCBLLActions.LoadFOCSchemes(schemeName));
  }
  resetFOCBLLDetails() {
    this.store.dispatch(new FOCBLLActions.ResetFocBllDetails());
  }
  loadSelectedLocations(payload: FOCBlockingLocationLevelListPayload) {
    this.store.dispatch(new FOCBLLActions.LoadSelectedLocations(payload));
  }
}
