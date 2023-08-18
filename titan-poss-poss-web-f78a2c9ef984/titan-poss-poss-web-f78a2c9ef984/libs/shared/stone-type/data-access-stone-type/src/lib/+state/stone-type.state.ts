import { CustomErrors } from '@poss-web/shared/models';
import { StoneTypeDetails } from '@poss-web/shared/models';

export interface StoneTypeState {
  error: CustomErrors;
  stoneTypeListing: StoneTypeDetails[];
  stoneTypeDetails: StoneTypeDetails;
  totalStoneTypeDetails: number;
  isLoading: boolean;
  saveStoneTypeResponses: StoneTypeDetails;
  editStoneTypeResponses: StoneTypeDetails;
}
