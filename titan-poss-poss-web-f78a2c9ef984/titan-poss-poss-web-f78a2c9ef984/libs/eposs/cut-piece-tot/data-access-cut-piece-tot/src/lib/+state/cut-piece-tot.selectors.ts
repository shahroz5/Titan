import { createSelector } from '@ngrx/store';
import { selectCutPieceTotState } from './cut-piece-tot.reducer';

const selectCutPieceTotDetails = createSelector(
  selectCutPieceTotState,
  state => state.cutPieceTotDetails
);

const selectIsLoading = createSelector(
  selectCutPieceTotState,
  state => state.isLoading
);

const selectUpdateCutPieceTotResponses = createSelector(
  selectCutPieceTotState,
  state => state.updateCutPieceTot
);

const selectError = createSelector(
  selectCutPieceTotState,
  state => state.error
);

export const CutPieceTotSelectors = {
  selectCutPieceTotDetails,
  selectUpdateCutPieceTotResponses,
  selectIsLoading,
  selectError
};
