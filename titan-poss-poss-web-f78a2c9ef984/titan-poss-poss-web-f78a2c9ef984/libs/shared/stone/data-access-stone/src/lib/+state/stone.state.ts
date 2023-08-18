import { StoneDetails, StoneFilter,CustomErrors } from '@poss-web/shared/models';

export interface StoneState {
  error: CustomErrors;
  stoneListing: StoneDetails[];
  totalStoneDetails: number;
  isLoading: boolean;
  stonefilter: StoneFilter;
}
