import { createSelector } from '@ngrx/store';

import {
  tepStoneConfigDetailsSelector,
  tepStoneConfigSelector
} from './tep-stone-config.entity';
import { selectTepStoneConfig } from './tep-stone-config.reducer';

const tepStoneConfigList = createSelector(
  selectTepStoneConfig,
  state => state.tepStoneConfiglist
);

const selectTepStoneConfigList = createSelector(
  tepStoneConfigList,
  tepStoneConfigSelector.selectAll
);

const tepStoneConfigDetailslist = createSelector(
  selectTepStoneConfig,
  state => state.tepStoneConfigDetailslist
);

const selectTepStoneConfigDetailslist = createSelector(
  tepStoneConfigDetailslist,
  tepStoneConfigDetailsSelector.selectAll
);

const selectTotalElements = createSelector(
  selectTepStoneConfig,
  state => state.totalElements
);
const selectTotalDetailsElements = createSelector(
  selectTepStoneConfig,
  state => state.totalDetailsElements
);

const selectTepStoneConfigDetails = createSelector(
  selectTepStoneConfig,
  state => state.tepStoneConfigDetails
);
const selectIsLoading = createSelector(
  selectTepStoneConfig,
  state => state.isLoading
);
const selectError = createSelector(selectTepStoneConfig, state => state.error);
const selectHasSaved = createSelector(
  selectTepStoneConfig,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectTepStoneConfig,
  state => state.hasUpdated
);
const selectTepStoneConfigStoneType = createSelector(
  selectTepStoneConfig,
  state => state.tepStoneConfigStoneType
);
const selectTepStoneConfigQualities = createSelector(
  selectTepStoneConfig,
  state => state.tepStoneConfigQualities
);
const selectTepStoneConfigRange = createSelector(
  selectTepStoneConfig,
  state => state.tepStoneConfigRange
);

export const tepStoneConfigSelectors = {
  selectTepStoneConfigList,
  selectTotalElements,
  selectTepStoneConfigDetailslist,
  selectTotalDetailsElements,
  selectTepStoneConfigDetails,
  selectError,
  selectIsLoading,
  selectHasSaved,
  selectHasUpdated,
  selectTepStoneConfigStoneType,
  selectTepStoneConfigQualities,
  selectTepStoneConfigRange
};
