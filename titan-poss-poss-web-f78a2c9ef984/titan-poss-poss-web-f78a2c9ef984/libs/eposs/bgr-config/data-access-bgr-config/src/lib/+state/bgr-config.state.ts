import { CustomErrors, BgrConfigDetails } from '@poss-web/shared/models';

export interface BgrConfigState {
  bgrConfigListing: BgrConfigDetails[];
  bgrConfigDetails: BgrConfigDetails;
  bgrConfigDetailsSaved: BgrConfigDetails;
  bgrConfigDetailsEdited: BgrConfigDetails;
  bgrTotalConfig: number;
  error: CustomErrors;
  isLoading: boolean;
}
