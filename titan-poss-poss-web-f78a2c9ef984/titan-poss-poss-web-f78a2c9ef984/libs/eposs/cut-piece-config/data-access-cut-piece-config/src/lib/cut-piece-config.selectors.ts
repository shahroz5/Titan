import { createSelector } from '@ngrx/store';
import { selectCutPieceConfigState } from './cut-piece-config.reducer';

const selectError = createSelector(
  selectCutPieceConfigState,
  state => state.error
);

const selectIsLoading = createSelector(
  selectCutPieceConfigState,
  state => state.isLoading
);

const selectConfigId = createSelector(
  selectCutPieceConfigState,
  state => state.configId
);

const selectHasSaved = createSelector(
  selectCutPieceConfigState,
  state => state.hasSaved
);

const selectTotalElements = createSelector(
  selectCutPieceConfigState,
  state => state.totalElements
);
const selectCutPieceConfigList = createSelector(
  selectCutPieceConfigState,
  state => state.cutPieceConfigList
);

const selectProductCategories = createSelector(
  selectCutPieceConfigState,
  state => state.productCategories
);
const selectAllSelectedPcs = createSelector(
  selectCutPieceConfigState,
  state => state.allSelectedCategories
);
export const CutPieceConfigSelectors = {
  selectError,
  selectIsLoading,
  selectConfigId,
  selectHasSaved,
  selectTotalElements,
  selectCutPieceConfigList,
  selectProductCategories,
  selectAllSelectedPcs
};
