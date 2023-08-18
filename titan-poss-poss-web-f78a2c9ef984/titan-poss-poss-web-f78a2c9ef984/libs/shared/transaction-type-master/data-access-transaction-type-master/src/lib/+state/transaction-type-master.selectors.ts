import { createSelector } from '@ngrx/store';
import { selectTransactionTypeMasterState } from './transaction-type-master.reducer';


const selectTransactionTypeMasterListing = createSelector(
    selectTransactionTypeMasterState,
    state => state.transactionTypeMasterListing
);

const selectTotalTransactionTypeMasterDetailsCount = createSelector(
    selectTransactionTypeMasterState,
    state => state.totalTransactionTypeMasterDetails
);


const selectIsLoading = createSelector(
    selectTransactionTypeMasterState,
    state => state.isLoading
);


const selectError = createSelector(
    selectTransactionTypeMasterState,
    state => state.error
);

const selectTransactionTypeMasterDetails = createSelector(
    selectTransactionTypeMasterState,
    state => state.transactionTypeMasterDetails
);

const selectSaveResponse = createSelector(
    selectTransactionTypeMasterState,
    state => state.saveResponses
);

const selectEditResponse = createSelector(
    selectTransactionTypeMasterState,
    state => state.editResponses
);



export const TransactionTypeMasterSelectors = {
    selectTransactionTypeMasterListing,
    selectTotalTransactionTypeMasterDetailsCount,
    selectIsLoading,
    selectError,
    selectTransactionTypeMasterDetails,
    selectSaveResponse,
    selectEditResponse
};
