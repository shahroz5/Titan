import { CustomErrors, TaxMasterDetails } from '@poss-web/shared/models';



export interface TaxMasterState {
    error: CustomErrors;
    taxMasterListing: TaxMasterDetails[];
    taxMasterDetails: TaxMasterDetails;
    totalTaxMasterDetails: number;
    isLoading: boolean;
    saveTaxMasterResponses: TaxMasterDetails;
    editTaxMasterResponses: TaxMasterDetails;

}
