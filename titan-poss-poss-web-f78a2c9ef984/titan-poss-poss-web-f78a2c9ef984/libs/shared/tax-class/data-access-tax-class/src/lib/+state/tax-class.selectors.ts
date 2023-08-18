import { createSelector } from '@ngrx/store';
import { selectTaxClassState } from './tax-class.reducer';


const selectTaxClassListing = createSelector(
    selectTaxClassState,
    state => state.taxClassListing
);

const selectTotalTaxClassDetailsCount = createSelector(
    selectTaxClassState,
    state => state.totalTaxClassDetails
);


const selectIsLoading = createSelector(
    selectTaxClassState,
    state => state.isLoading
);


const selectError = createSelector(
    selectTaxClassState,
    state => state.error
);

const selectTaxClassDetailsByTaxClassCode = createSelector(
    selectTaxClassState,
    state => state.taxClassDetails
);

const selectSaveTaxClassFormResponse = createSelector(
    selectTaxClassState,
    state => state.saveTaxClassResponses
);

const selectEditTaxClassFormResponse = createSelector(
    selectTaxClassState,
    state => state.editTaxClassResponses
);



export const TaxClassSelectors = {
    selectTaxClassListing,
    selectTotalTaxClassDetailsCount,
    selectIsLoading,
    selectError,
    selectTaxClassDetailsByTaxClassCode,
    selectSaveTaxClassFormResponse,
    selectEditTaxClassFormResponse
};
