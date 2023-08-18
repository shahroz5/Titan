import { createSelector } from '@ngrx/store';
import { selectglBtqLocationState } from './gl-boutique.reducer';

const selectGlBoutiqueLocationListing = createSelector(
  selectglBtqLocationState,
  state => state.glBoutiqueLocationList
);

const selectTotalGlBoutiqueLocationCount = createSelector(
  selectglBtqLocationState,
  state => state.totalGlBoutiqueLocation
);

const selectGlBoutiqueLocationByLocationCode = createSelector(
  selectglBtqLocationState,
  state => state.glBoutiqueLocationDetails
);

const selectIsLoading = createSelector(
  selectglBtqLocationState,
  state => state.isLoading
);
const selectIsSaved = createSelector(
  selectglBtqLocationState,
  state => state.hasSaved
);
const selectIsEdited = createSelector(
  selectglBtqLocationState,
  state => state.hasUpdated
);

const selectError = createSelector(
  selectglBtqLocationState,
  state => state.error
);

const selectSaveGlBoutiqueLocationResponse = createSelector(
  selectglBtqLocationState,
  state => state.saveGlBoutiqueLocation
);

const selectEditGlBoutiqueLocationResponse = createSelector(
  selectglBtqLocationState,
  state => state.editGlBoutiqueLocation
);

export const GlBoutiqueLocationSelectors = {
  selectGlBoutiqueLocationListing,
  selectGlBoutiqueLocationByLocationCode,
  selectIsLoading,
  selectIsSaved,
  selectIsEdited,
  selectError,
  selectTotalGlBoutiqueLocationCount,
  selectSaveGlBoutiqueLocationResponse,
  selectEditGlBoutiqueLocationResponse
};
