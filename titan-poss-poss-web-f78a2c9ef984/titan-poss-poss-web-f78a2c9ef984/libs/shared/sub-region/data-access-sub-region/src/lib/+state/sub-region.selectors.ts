import { createSelector } from '@ngrx/store';
import { subRegionSelector } from './sub-region.entity';
import { selectSubRegionsState } from './sub-region.reducer';

export const selectRegionDetailsListing = createSelector(
  selectSubRegionsState,
  state => state.regionDetailsListing
);

export const selectLoadedRegionListing = createSelector(
  selectRegionDetailsListing,
  subRegionSelector.selectAll
);

export const selectSubRegionDetailsListing = createSelector(
  selectSubRegionsState,
  state => state.subRegionDetailsListing
);

export const selectLoadedSubRegionListing = createSelector(
  selectSubRegionDetailsListing,
  subRegionSelector.selectAll
);

export const selectTotalSubRegionDetailsCount = createSelector(
  selectSubRegionsState,
  state => state.totalSubRegionDetails
);

export const selectIsSubRegionListingLoading = createSelector(
  selectSubRegionsState,
  state => state.isLoading
);

export const selectSubRegionByRegionCode = createSelector(
  selectSubRegionsState,
  state => state.subRegionDetailsBySubRegionCode
);

export const selectSaveSubRegionDetailsResponse = createSelector(
  selectSubRegionsState,
  state => state.saveSubRegionDetailsResponse
);

export const selectEditSubRegionDetailsResponse = createSelector(
  selectSubRegionsState,
  state => state.editSubRegionDetailsResponse
);

const selectError = createSelector(selectSubRegionsState, state => state.error);

export const selectIssearchElements = createSelector(
  selectSubRegionsState,
  state => state.isSearchElements
);

export const SubRegionSelectors = {
  selectRegionDetailsListing,
  selectLoadedRegionListing,
  selectLoadedSubRegionListing,
  selectSubRegionDetailsListing,
  selectTotalSubRegionDetailsCount,
  selectIsSubRegionListingLoading,
  selectSubRegionByRegionCode,
  selectSaveSubRegionDetailsResponse,
  selectEditSubRegionDetailsResponse,
  selectError,
  selectIssearchElements
};
