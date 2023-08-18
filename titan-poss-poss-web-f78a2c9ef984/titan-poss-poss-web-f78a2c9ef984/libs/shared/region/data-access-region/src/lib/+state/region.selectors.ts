import { createSelector } from '@ngrx/store';
import { regionSelector } from './region.entity';
import { selectRegionsState } from './region.reducer';

export const selectRegionDetailsListing = createSelector(
  selectRegionsState,
  state => state.regionDetailsListing
);

export const selectLoadedRegionListing = createSelector(
  selectRegionDetailsListing,
  regionSelector.selectAll
);

export const selectTotalRegionDetailsCount = createSelector(
  selectRegionsState,
  state => state.totalRegionDetails
);

export const selectIsRegionListingLoading = createSelector(
  selectRegionsState,
  state => state.isLoading
);

export const selectRegionByRegionCode = createSelector(
  selectRegionsState,
  state => state.regionDetailsByRegionCode
);

export const selectSaveRegionDetailsResponse = createSelector(
  selectRegionsState,
  state => state.saveRegionDetailsResponse
);

export const selectEditRegionDetailsResponse = createSelector(
  selectRegionsState,
  state => state.editRegionDetailsResponse
);

export const selectError = createSelector(
  selectRegionsState,
  state => state.error
);

// const selectIssearchElements=createSelector(
//   selectRegionsState,
//   state=>state.isSearchElements
// )

export const RegionSelectors = {
  selectLoadedRegionListing,
  selectTotalRegionDetailsCount,
  selectIsRegionListingLoading,
  selectRegionByRegionCode,
  selectSaveRegionDetailsResponse,
  selectEditRegionDetailsResponse,
  selectError
  // selectIssearchElements
};
