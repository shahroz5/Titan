import { createSelector } from '@ngrx/store';
import { selectPayeeBankState } from './payee-bank.reducer';
import { payeeGlDetailsSelector } from './payee-bank.entity';

const selectPayeeBankDetailsListing = createSelector(
  selectPayeeBankState,
  state => state.payeeBankListing
);

const selectTotalPayeeBankDetailsCount = createSelector(
  selectPayeeBankState,
  state => state.totalPayeeBankDetails
);

const selectPayeeBankDetailsByBankName = createSelector(
  selectPayeeBankState,
  state => state.payeeBankDetails
);

const selectIsLoading = createSelector(
  selectPayeeBankState,
  state => state.isLoading
);
const selectIsSaveBankDetailsSuccess = createSelector(
  selectPayeeBankState,
  state => state.saveBankDetailsSuccess
);
const selectIsEditBankDetailsSuccess = createSelector(
  selectPayeeBankState,
  state => state.editBankDetailsSuccess
);

const selectError = createSelector(selectPayeeBankState, state => state.error);

const selectSavePayeeBankFormResponse = createSelector(
  selectPayeeBankState,
  state => state.savePayeeBankResponses
);

const selectEditPayeeBankFormResponse = createSelector(
  selectPayeeBankState,
  state => state.editPayeeBankResponses
);

const selectGlCodeDetails = createSelector(selectPayeeBankState, state =>
  state.glCodeDetail ? state.glCodeDetail : null
);
const selectGlCodeDetailsLList = createSelector(
  selectGlCodeDetails,
  payeeGlDetailsSelector.selectAll
);
const selectSaveGlCodeDetails = createSelector(
  selectPayeeBankState,
  state => state.saveGlCodeDetail
);
const selectRadioMappingType = createSelector(
  selectPayeeBankState,
  state => state.mappingType
);
const selectEditGlCodeDetailsSuccess = createSelector(
  selectPayeeBankState,
  state => state.saveGlCodeDetailSuccess
);
const selectLocationCodes = createSelector(
  selectPayeeBankState,
  state => state.locationCodes
);
const selectGlCodeDefaults = createSelector(
  selectPayeeBankState,
  state => state.glCodeDefaults
);
const selectGlCodeCount = createSelector(
  selectPayeeBankState,
  state => state.totalCount
);
const selectMappedLocations = createSelector(
  selectPayeeBankState,
  state => state.mappedLocations
);
const selectTowns = createSelector(
  selectPayeeBankState,
  state => state.townsData
);

const selectStates = createSelector(
  selectPayeeBankState,
  state => state.statesData
);
export const PayeeBankSelectors = {
  selectPayeeBankDetailsListing,
  selectPayeeBankDetailsByBankName,
  selectIsLoading,
  selectIsSaveBankDetailsSuccess,
  selectIsEditBankDetailsSuccess,
  selectError,
  selectTotalPayeeBankDetailsCount,
  selectSavePayeeBankFormResponse,
  selectEditPayeeBankFormResponse,
  selectGlCodeDetails,
  selectSaveGlCodeDetails,
  selectRadioMappingType,
  selectEditGlCodeDetailsSuccess,
  selectLocationCodes,
  selectGlCodeDefaults,
  selectGlCodeCount,
  selectMappedLocations,
  selectGlCodeDetailsLList,
  selectTowns,
  selectStates
};
