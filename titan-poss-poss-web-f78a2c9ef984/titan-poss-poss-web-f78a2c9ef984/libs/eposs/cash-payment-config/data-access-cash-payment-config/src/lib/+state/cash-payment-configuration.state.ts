import { CustomErrors, CashPaymentConfiguration } from '@poss-web/shared/models';



export interface CashPaymentConfigurationState {
    error: CustomErrors;
    cashPaymentConfigurationDetails: CashPaymentConfiguration;
    isLoading: boolean;
    editCashPaymentConfigurationResponses: CashPaymentConfiguration;
}
