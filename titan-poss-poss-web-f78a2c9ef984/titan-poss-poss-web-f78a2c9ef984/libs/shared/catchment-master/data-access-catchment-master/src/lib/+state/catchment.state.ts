import { CatchmentDetails, CustomErrors } from '@poss-web/shared/models';



export interface CatchmentState {
    error: CustomErrors;
    catchmentListing: CatchmentDetails[];
    catchmentDetails: CatchmentDetails;
    saveCatchmentResponses: CatchmentDetails;
    editCatchmentResponses: CatchmentDetails;
    totalCatchmentDetails: number;
    isLoading: boolean;

}
