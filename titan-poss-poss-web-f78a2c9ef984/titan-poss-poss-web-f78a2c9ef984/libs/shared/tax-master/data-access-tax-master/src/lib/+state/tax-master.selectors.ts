import { createSelector } from '@ngrx/store';
import { selectTaxMasterState } from './tax-master.reducer';


const selectTaxMasterListing = createSelector(
    selectTaxMasterState,
    state => state.taxMasterListing
);

const selectTotalTaxMasterDetailsCount = createSelector(
    selectTaxMasterState,
    state => state.totalTaxMasterDetails
);


const selectIsLoading = createSelector(
    selectTaxMasterState,
    state => state.isLoading
);


const selectError = createSelector(
    selectTaxMasterState,
    state => state.error
);

const selectTaxMasterDetailsByTaxMasterCode = createSelector(
    selectTaxMasterState,
    state => state.taxMasterDetails
);

const selectSaveTaxMasterFormResponse = createSelector(
    selectTaxMasterState,
    state => state.saveTaxMasterResponses
);

const selectEditTaxMasterFormResponse = createSelector(
    selectTaxMasterState,
    state => state.editTaxMasterResponses
);



export const TaxMasterSelectors = {
    selectTaxMasterListing,
    selectTotalTaxMasterDetailsCount,
    selectIsLoading,
    selectError,
    selectTaxMasterDetailsByTaxMasterCode,
    selectSaveTaxMasterFormResponse,
    selectEditTaxMasterFormResponse
};
