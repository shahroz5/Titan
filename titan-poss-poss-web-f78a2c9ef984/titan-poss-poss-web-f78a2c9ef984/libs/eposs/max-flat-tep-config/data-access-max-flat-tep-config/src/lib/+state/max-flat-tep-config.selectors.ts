import { createSelector } from '@ngrx/store';
import { selectMaxFlatTepConfigState } from './max-flat-tep-config.reducer';

const selectError = createSelector(
  selectMaxFlatTepConfigState,
  state => state.errors
);

const selectIsLoading = createSelector(
  selectMaxFlatTepConfigState,
  state => state.isLoading
);

const selectMaxFlatTepConfigDetails = createSelector(
  selectMaxFlatTepConfigState,
  state => state.maxFlatTepConfigDetails
);

const selectUpdateMaxFlatTepConfigResponse = createSelector(
  selectMaxFlatTepConfigState,
  state => state.updateMaxFlatTepConfigResponse
);

export const MaxFlatTepConfigSelectors = {
  selectError,
  selectIsLoading,
  selectMaxFlatTepConfigDetails,
  selectUpdateMaxFlatTepConfigResponse
};
