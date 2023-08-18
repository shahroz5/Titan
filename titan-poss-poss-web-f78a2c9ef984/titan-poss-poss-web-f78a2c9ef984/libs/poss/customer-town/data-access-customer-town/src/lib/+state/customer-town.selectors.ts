import { createSelector } from '@ngrx/store';
// import { customerTownSelector } from './customer-town.entity';
import { selectCustomerTown } from './customer-town.reducer';

const selectCustomerTownDetailsListing = createSelector(
  selectCustomerTown,
  state => state.customerTownDetailsListing
);

// const selectLoadedCustomerListing = createSelector(
//   selectCustomerTownDetailsListing,
//   customerTownSelector.selectAll
// );

const selectTotalCustomerTownDetailsCount = createSelector(
  selectCustomerTown,
  state => state.totalCustomerTownDetails
);

const selectStateDetails = createSelector(
  selectCustomerTown,
  state => state.stateDetails
);

// const selectRegionDetails = createSelector(
//   selectCustomerTown,
//   state => state.regionDetails
// );

const selectIsCustomerTownListingLoading = createSelector(
  selectCustomerTown,
  state => state.isCustomerTownLoading
);

const selectTownDetailsByTownCode = createSelector(
  selectCustomerTown,
  state => state.townDetailsByTownCode
);

const selectSaveTownDetailsFormResponse = createSelector(
  selectCustomerTown,
  state => state.saveTownDetailsResponses
);

const selectEditTownDetailsFormResponse = createSelector(
  selectCustomerTown,
  state => state.editTownDetailsResponses
);

const selectError = createSelector(selectCustomerTown, state => state.error);

const selectIssearchElements = createSelector(
  selectCustomerTown,
  state => state.isSearchElements
);

export const CustomerTownSelectors = {
  // selectLoadedCustomerListing,
  selectCustomerTownDetailsListing,
  selectTotalCustomerTownDetailsCount,
  selectStateDetails,
  selectIsCustomerTownListingLoading,
  selectTownDetailsByTownCode,
  selectSaveTownDetailsFormResponse,
  selectEditTownDetailsFormResponse,
  selectError,
  // selectRegionDetails,
  selectIssearchElements
};
