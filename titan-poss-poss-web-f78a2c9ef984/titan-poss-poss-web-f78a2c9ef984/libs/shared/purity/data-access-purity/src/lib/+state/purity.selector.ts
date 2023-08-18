import { createSelector } from '@ngrx/store';

import { puritySelector } from './purity.entity';
import { selectPurityState } from './purity.reducers';

export const purityList = createSelector(
  selectPurityState,
  state => state.purityList
);
const selectPurityList = createSelector(purityList, puritySelector.selectAll);
const selectTotalElements = createSelector(
  selectPurityState,
  state => state.totalElements
);

const selectIsloading = createSelector(
  selectPurityState,
  state => state.isLoading
);
const selectError = createSelector(selectPurityState, state => state.error);

const selectMetalType = createSelector(
  selectPurityState,
  state => state.metalType
);
const selectPurity = createSelector(selectPurityState, state => state.purity);

const selectHasSaved = createSelector(
  selectPurityState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectPurityState,
  state => state.hasUpdated
);
const selectisActiveUpdated = createSelector(
  selectPurityState,
  state => state.isActiveUpdated
);
export const PuritySelectors = {
  selectPurityList,
  selectTotalElements,
  selectIsloading,
  selectError,
  selectMetalType,
  selectPurity,
  selectHasSaved,
  selectHasUpdated,
  selectisActiveUpdated
};
