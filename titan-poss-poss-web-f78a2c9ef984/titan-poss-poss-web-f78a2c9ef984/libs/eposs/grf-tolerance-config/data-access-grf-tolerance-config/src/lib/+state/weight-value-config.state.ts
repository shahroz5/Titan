import {
    CustomErrors,
    WeightValueConfigDetails
} from '@poss-web/shared/models';

export interface WeightValueConfigState {
    weightValueConfigListing: WeightValueConfigDetails[];
    weightValueConfigDetails: WeightValueConfigDetails,
    weightValueConfigDetailsSaved: WeightValueConfigDetails,
    weightValueConfigDetailsEdited: WeightValueConfigDetails,
    totalWeightValueConfig: number,
    error: CustomErrors;
    isLoading: boolean;
}
