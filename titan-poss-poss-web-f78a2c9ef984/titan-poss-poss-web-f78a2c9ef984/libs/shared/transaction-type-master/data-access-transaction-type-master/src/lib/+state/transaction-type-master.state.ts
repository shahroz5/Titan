import { CustomErrors, TransactionTypeMasterDetails } from '@poss-web/shared/models';



export interface TransactionTypeMasterState {
    error: CustomErrors;
    transactionTypeMasterListing: TransactionTypeMasterDetails[];
    transactionTypeMasterDetails: TransactionTypeMasterDetails;
    totalTransactionTypeMasterDetails: number;
    isLoading: boolean;
    saveResponses: TransactionTypeMasterDetails;
    editResponses: TransactionTypeMasterDetails;

}
