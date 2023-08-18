import { createSelector } from '@ngrx/store';
import { selectBinGroupState } from './bin-group.reducer';
import { binGroupSelector } from './bin-group.entity';

export const selectBinGroupDetailsListing = createSelector(
  selectBinGroupState,
  state => state.binGroupDetailsListing
);

export const selectLoadedBinGroupListing = createSelector(
  selectBinGroupDetailsListing,
  binGroupSelector.selectAll
);

const selectTotalBinGroupDetailsCount = createSelector(
  selectBinGroupState,
  state => state.totalBinGroupDetails
);

const selectbinGroupDetailsByBinGroupCode = createSelector(
  selectBinGroupState,
  state => state.binGroupDetails
);

const selectIsLoading = createSelector(
  selectBinGroupState,
  state => state.isLoading
);

const selectSaveBinGroupFormResponse = createSelector(
  selectBinGroupState,
  state => state.saveBinGroupResponses
);

const selectEditBinGroupFormResponse = createSelector(
  selectBinGroupState,
  state => state.editBinGroupResponses
);

const selectError = createSelector(selectBinGroupState, state => state.error);

const selectIssearchElements = createSelector(
  selectBinGroupState,
  state => state.isSearchElements
);

// const selectSearchElements=createSelector(
//   selectBinGroupState,
//   state=>state.binGroupState.searchBinGroup
// )

// const hasSearchedElements=createSelector(
//   selectBinGroupState,
//   state=>state.binGroupState.searchBinGroup
// )

export const BinGroupSelectors = {
  //selectBinGroupDetailsListing,
  selectLoadedBinGroupListing,
  selectbinGroupDetailsByBinGroupCode,
  selectIsLoading,
  selectError,
  selectSaveBinGroupFormResponse,
  selectEditBinGroupFormResponse,
  selectTotalBinGroupDetailsCount,
  selectIssearchElements
  // selectSearchElements,
  // hasSearchedElements
};
