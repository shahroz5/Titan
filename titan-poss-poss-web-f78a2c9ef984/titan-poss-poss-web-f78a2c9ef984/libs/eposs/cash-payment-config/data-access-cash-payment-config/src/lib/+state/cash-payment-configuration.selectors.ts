import { createSelector } from '@ngrx/store';
import { selectCashPaymentConfigurationState } from './cash-payment-configuration.reducer';


const selectCashPaymentConfigurationDetails = createSelector(
    selectCashPaymentConfigurationState,
    state => state.cashPaymentConfigurationDetails
);

const selectIsLoading = createSelector(
    selectCashPaymentConfigurationState,
    state => state.isLoading
);

const selectEditCashPaymentConfigurationResponses = createSelector(
    selectCashPaymentConfigurationState,
    state => state.editCashPaymentConfigurationResponses
);

const selectError = createSelector(
    selectCashPaymentConfigurationState,
    state => state.error
);


export const CashPaymentConfigurationSelectors = {
    selectCashPaymentConfigurationDetails,
    selectEditCashPaymentConfigurationResponses,
    selectIsLoading,
    selectError
};
