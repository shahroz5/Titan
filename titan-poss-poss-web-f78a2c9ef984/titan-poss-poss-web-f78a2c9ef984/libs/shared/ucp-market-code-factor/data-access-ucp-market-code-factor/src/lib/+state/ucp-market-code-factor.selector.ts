import { createSelector } from '@ngrx/store';

import { selectUcpMarketCodeFactorState } from './ucp-market-code-factor.reducer';

const selectUcpMarketCodeFactorList = createSelector(
  selectUcpMarketCodeFactorState,
  state => state.ucpMarketCodeList
);

const selectTotalElements = createSelector(
  selectUcpMarketCodeFactorState,
  state => state.totalElements
);
const selectIsloading = createSelector(
  selectUcpMarketCodeFactorState,
  state => state.isLoading
);

const selectError = createSelector(
  selectUcpMarketCodeFactorState,
  state => state.error
);

const selectUcpMarketCodeFactor = createSelector(
  selectUcpMarketCodeFactorState,
  state => state.ucpMarketCode
);
const selectHasSaved = createSelector(
  selectUcpMarketCodeFactorState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectUcpMarketCodeFactorState,
  state => state.hasUpdated
);

const selectMarketCode = createSelector(
  selectUcpMarketCodeFactorState,
  state => state.marketCode
);
const selectUcpProductGroup = createSelector(
  selectUcpMarketCodeFactorState,
  state => state.ucpProductGroup
);

export const upcMarketCodeFactorSelector = {
  selectUcpMarketCodeFactorList,
  selectUcpMarketCodeFactor,
  selectTotalElements,
  selectIsloading,
  selectError,
  selectHasSaved,
  selectHasUpdated,
  selectMarketCode,
  selectUcpProductGroup
};
