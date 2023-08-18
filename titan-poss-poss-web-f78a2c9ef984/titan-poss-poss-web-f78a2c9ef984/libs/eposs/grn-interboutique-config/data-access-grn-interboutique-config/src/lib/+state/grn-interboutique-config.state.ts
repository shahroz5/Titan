import { CustomErrors, GrnInterboutiqueConfig } from '@poss-web/shared/models';



export interface GrnInterboutiqueConfigState {
    error: CustomErrors;
    grnInterboutiqueConfigDetails: GrnInterboutiqueConfig;
    isLoading: boolean;
    editGrnInterboutiqueConfigResponses: GrnInterboutiqueConfig;
}
