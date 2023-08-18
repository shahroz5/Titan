import { createSelector } from '@ngrx/store';
import { selectConversionConfigState } from './conversion-config.reducer';

const selectConversionConfigList = createSelector(
  selectConversionConfigState,
  state => state.conversionConfigList
);
const selectIsLoading = createSelector(
  selectConversionConfigState,
  state => state.isLoading
);
const selectError = createSelector(
  selectConversionConfigState,
  state => state.error
);
const selectTotalElements = createSelector(
  selectConversionConfigState,
  state => state.totalElements
);
const selectHasSaved = createSelector(
  selectConversionConfigState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectConversionConfigState,
  state => state.hasUpdated
);
const selectConversionConfigDetailsById = createSelector(
  selectConversionConfigState,
  state => state.configDetailsById
);
const selectProductGroups = createSelector(
  selectConversionConfigState,
  state => state.productGroups
);
const selectProductCategories = createSelector(
  selectConversionConfigState,
  state => state.productCategories
);
const selectSaveSuccessPayload = createSelector(
  selectConversionConfigState,
  state => state.saveSuccessPayload
);

const selectHasSearched = createSelector(
  selectConversionConfigState,
  state => state.hasSearched
);

export const ConversionConfigSelectors = {
  selectConversionConfigList,
  selectIsLoading,
  selectError,
  selectTotalElements,
  selectHasSaved,
  selectHasUpdated,
  selectConversionConfigDetailsById,
  selectProductGroups,
  selectProductCategories,
  selectSaveSuccessPayload,
  selectHasSearched
};
