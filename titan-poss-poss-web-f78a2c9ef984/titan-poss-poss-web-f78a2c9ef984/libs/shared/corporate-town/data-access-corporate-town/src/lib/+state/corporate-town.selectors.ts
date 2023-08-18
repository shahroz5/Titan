import { createSelector } from '@ngrx/store';
import { corporateTownSelector } from './corporate-town.entity';
import { selectCorporateTown } from './corporate-town.reducer';

const selectCorporateTownDetailsListing = createSelector(
  selectCorporateTown,
  state => state.corporateTownDetailsListing
);

const selectLoadedCorporateListing = createSelector(
  selectCorporateTownDetailsListing,
  corporateTownSelector.selectAll
);

const selectTotalCorporateTownDetailsCount = createSelector(
  selectCorporateTown,
  state => state.totalCorporateTownDetails
);

const selectStateDetails = createSelector(
  selectCorporateTown,
  state => state.stateDetails
);

// const selectRegionDetails = createSelector(
//   selectCorporateTown,
//   state => state.regionDetails
// );

const selectIsCorporateTownListingLoading = createSelector(
  selectCorporateTown,
  state => state.isCorporateTownLoading
);

const selectTownDetailsByTownCode = createSelector(
  selectCorporateTown,
  state => state.townDetailsByTownCode
);

const selectSaveTownDetailsFormResponse = createSelector(
  selectCorporateTown,
  state => state.saveTownDetailsResponses
);

const selectEditTownDetailsFormResponse = createSelector(
  selectCorporateTown,
  state => state.editTownDetailsResponses
);

const selectError = createSelector(selectCorporateTown, state => state.error);

const selectIssearchElements = createSelector(
  selectCorporateTown,
  state => state.isSearchElements
);
// const selectCountryCode = createSelector(
//   selectCorporateTown,
//   state => state.countryData
// );
export const CorporateTownSelectors = {
  selectLoadedCorporateListing,
  selectTotalCorporateTownDetailsCount,
  selectStateDetails,
  selectIsCorporateTownListingLoading,
  selectTownDetailsByTownCode,
  selectSaveTownDetailsFormResponse,
  selectEditTownDetailsFormResponse,
  selectError,
  // selectRegionDetails,
  selectIssearchElements
  // selectCountryCode
};
