import { createSelector } from '@ngrx/store';
import { tepExceptionConfigSelector } from './tep-exception-config.entity';
import { selectTepExceptionConfig } from './tep-exception-config.reducer';

export const tepExceptionConfigList = createSelector(
  selectTepExceptionConfig,
  state => state.tepExceptionConfiglist
);

const selectTepExceptionConfigList = createSelector(
  tepExceptionConfigList,
  tepExceptionConfigSelector.selectAll
);

const selectTotalElements = createSelector(
  selectTepExceptionConfig,
  state => state.totalElements
);

const selectMaxFlatTepExchangeValue = createSelector(
  selectTepExceptionConfig,
  state => state.maxFlatTepExchangeValue
);
const selectTepExceptionConfigDetails = createSelector(
  selectTepExceptionConfig,
  state => state.tepExceptionConfigDetails
);
const selectIsLoading = createSelector(
  selectTepExceptionConfig,
  state => state.isLoading
);
const selectError = createSelector(
  selectTepExceptionConfig,
  state => state.error
);
const selectHasSaved = createSelector(
  selectTepExceptionConfig,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectTepExceptionConfig,
  state => state.hasUpdated
);

export const tepExceptionConfigSelectors = {
  selectTepExceptionConfigList,
  selectTotalElements,
  selectMaxFlatTepExchangeValue,
  selectTepExceptionConfigDetails,
  selectError,
  selectIsLoading,
  selectHasSaved,
  selectHasUpdated
};
