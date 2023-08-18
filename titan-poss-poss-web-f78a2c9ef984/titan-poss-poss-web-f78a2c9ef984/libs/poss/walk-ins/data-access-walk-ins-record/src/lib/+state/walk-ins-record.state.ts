import {
  CustomErrors,
  WalkInsDetails,
  WalkInsDetailsHistoryResponse
} from '@poss-web/shared/models';

export const walkInRecordFeatureKey = 'walk-ins';

export class WalkInsRecordState {
  errors?: CustomErrors;
  isLoading?: boolean;
  walkInsCount: number;
  numberOfInvoices: number;
  purchasersCount: number;
  saveWalkInDetailsResponse: WalkInsDetails;
  walkInsDate: number;
  walkInsHistoryData: WalkInsDetailsHistoryResponse[];
}
