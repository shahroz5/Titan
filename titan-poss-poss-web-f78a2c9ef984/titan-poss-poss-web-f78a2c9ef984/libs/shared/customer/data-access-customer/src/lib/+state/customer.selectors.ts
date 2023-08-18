import { createSelector, createFeatureSelector } from '@ngrx/store';
import { selectcustomerState } from './customer.reducer';
import {
  countrySelector,
  stateSelector,
  zoneSelector
} from './customer.entity';
import { CustomerState, customerFetureKey } from './customer.state';

export const selectCustomerState = createFeatureSelector<CustomerState>(
  customerFetureKey
);

export const selectCountries = createSelector(
  selectcustomerState,
  state => state.countries
);

export const selectIsLoading = createSelector(
  selectcustomerState,
  state => state.isLoading
);

export const selectAllowedTransactionTypes = createSelector(
  selectcustomerState,
  state => state.allowedTransactionTypes
);

export const fetchCountries = createSelector(
  selectCountries,
  countrySelector.selectAll
);

export const selectClearUpdatedCustomer = createSelector(
  selectCustomerState,
  state => state.updatedCustomerStatus
);

export const CountryEntities = createSelector(
  selectCountries,
  countrySelector.selectEntities
);

export const selectStates = createSelector(
  selectcustomerState,
  state => state.states
);

const fetchStates = createSelector(selectStates, stateSelector.selectAll);

const StateEntities = createSelector(
  selectStates,
  stateSelector.selectEntities
);

export const selectTowns = createSelector(
  selectcustomerState,
  state => state.city
);

export const selectCatchmentArea = createSelector(
  selectcustomerState,
  state => state.catchmentList
);

export const selectPincode = createSelector(
  selectcustomerState,
  state => state.pincode
);

export const selectBrandDetail = createSelector(
  selectcustomerState,
  state => state.brandDetails
);

export const selectIsUniqueMobile = createSelector(
  selectcustomerState,
  state => state.isUniqueCustomer
);

export const selectIsUniquePan = createSelector(
  selectcustomerState,
  state => state.isUniquePan
);

export const selectPanVerificationStatus = createSelector(
  selectcustomerState,
  state => state.panVerificationResponse
);

export const selectGstVerificationStatus = createSelector(
  selectcustomerState,
  state => state.gstVerificationResponse
);

export const selectEmailValidationStatus = createSelector(
  selectCustomerState,
  state => state.emailValidationResponse
);

export const selectIsUniquePassport = createSelector(
  selectcustomerState,
  state => state.isUniquePassport
);

export const selectIsUniqueGst = createSelector(
  selectcustomerState,
  state => state.isUniqueGst
);

export const selectCountryCode = createSelector(
  selectcustomerState,
  state => state.countryCode
);

export const selectIsUniqueEmail = createSelector(
  selectcustomerState,
  state => state.isUniqueEmail
);

export const selectSalutations = createSelector(
  selectcustomerState,
  state => state.salutations
);

export const selectIdProofs = createSelector(
  selectcustomerState,
  state => state.idProofList
);

export const selectError = createSelector(
  selectcustomerState,
  state => state.error
);

export const selectIsSearchingCustomer = createSelector(
  selectcustomerState,
  state => state.isSearchingCustomer
);

export const selectIsCustomerSaving = createSelector(
  selectcustomerState,
  state => state.isCustomerSaving
);

export const selectHasCustomerResult = createSelector(
  selectcustomerState,
  state => state.hasCustomerResult
);

export const selectCreatedCustomerStatus = createSelector(
  selectCustomerState,
  state => {
    return state.createdCustomerStatus;
  }
);

export const selectUpdatedCustomerStatus = createSelector(
  selectCustomerState,
  state => {
    return state.updatedCustomerStatus;
  }
);

export const selectSearchCustomerResult = createSelector(
  selectcustomerState,
  state => state.searchCustomerResult
);

export const selectSearchOneTimeCustomer = createSelector(
  selectcustomerState,
  state => state.searchOneTimeCustomer
);

export const selectSearchError = createSelector(
  selectcustomerState,
  state => state.searchError
);

export const selectSelectedCustomer = createSelector(
  selectcustomerState,
  state => state.selectedCustomer
);

export const selectCustomerEncirclePoints = createSelector(
  selectSelectedCustomer,
  data => (data && data.pointBalance ? data.pointBalance : 0)
);

export const selectCustomerUlpID = createSelector(
  selectSelectedCustomer,
  data => (data && data.ulpId ? data.ulpId : null)
);

export const selectIsCustomerSelected = createSelector(
  selectSelectedCustomer,
  data => !!data
);

export const selectedCustomerDetail = createSelector(
  selectcustomerState,
  state => state.selectedCustomerDetail
);

export const selectedCustomerLoyaltyDetail = createSelector(
  selectcustomerState,
  state => state.selectedCustomerDetail?.loyaltyDetails
);

export const selectEnableClear = createSelector(
  selectcustomerState,
  state => state.enableClear
);

export const selectEnableEdit = createSelector(
  selectcustomerState,
  state => state.enableEdit
);

export const selectEnableCreate = createSelector(
  selectcustomerState,
  state => state.enableCreate
);
export const selectGetCustomerDetails = createSelector(
  selectcustomerState,
  state => state.customerDetails
);

export const selectRivaahCouponDetails = createSelector(
  selectcustomerState,
  state => state.rivaahCouponDetail
);

export const selectVerifyPanDetailsResponse = createSelector(
  selectcustomerState,
  state => state.verifyPanDetailsResponse
);

export const zones = createSelector(selectcustomerState, state => state.zones);

const selectZones = createSelector(zones, zoneSelector.selectAll);
export const CustomerSelectors = {
  selectEnableEdit,
  selectTowns,
  selectError,
  fetchCountries,
  fetchStates,
  selectSalutations,
  selectSearchError,
  selectIsSearchingCustomer,
  selectHasCustomerResult,
  selectSearchCustomerResult,
  selectSearchOneTimeCustomer,
  selectPincode,
  selectSelectedCustomer,
  selectZones,
  selectedCustomerDetail,
  selectIsUniqueMobile,
  selectIsUniqueEmail,
  selectIsUniquePan,
  selectIsUniqueGst,
  selectCountryCode,
  selectIsCustomerSaving,
  selectCustomerEncirclePoints,
  selectCustomerUlpID,
  selectIsCustomerSelected,
  selectCreatedCustomerStatus,
  selectIsUniquePassport,
  selectEnableClear,
  selectAllowedTransactionTypes,
  selectIdProofs,
  selectUpdatedCustomerStatus,
  selectBrandDetail,
  selectClearUpdatedCustomer,
  selectEnableCreate,
  selectGetCustomerDetails,
  selectedCustomerLoyaltyDetail,
  selectPanVerificationStatus,
  selectIsLoading,
  selectGstVerificationStatus,
  selectCatchmentArea,
  selectRivaahCouponDetails,
  selectVerifyPanDetailsResponse,
  selectEmailValidationStatus
};
