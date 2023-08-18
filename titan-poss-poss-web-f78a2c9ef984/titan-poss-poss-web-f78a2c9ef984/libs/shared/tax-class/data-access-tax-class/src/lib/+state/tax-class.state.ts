import { CustomErrors, TaxClassDetails } from '@poss-web/shared/models';



export interface TaxClassState {
    error: CustomErrors;
    taxClassListing: TaxClassDetails[];
    taxClassDetails: TaxClassDetails;
    totalTaxClassDetails: number;
    isLoading: boolean;
    saveTaxClassResponses: TaxClassDetails;
    editTaxClassResponses: TaxClassDetails;

}
