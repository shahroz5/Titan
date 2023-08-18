import {
  CustomErrors,
  WeightValueConfigDetails
} from '@poss-web/shared/models';

export interface GRNWeightValueConfigState {
  weightValueConfigListing: WeightValueConfigDetails[];
  weightValueConfigDetails: WeightValueConfigDetails;
  weightValueConfigDetailsSaved: WeightValueConfigDetails;
  weightValueConfigDetailsEdited: WeightValueConfigDetails;
  totalWeightValueConfig: number;
  error: CustomErrors;
  isLoading: boolean;
  mappedLocationsCount: number;
}
