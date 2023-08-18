import { ABDetailsEntity } from './ab-requests.entity';
import { CustomErrors } from '@poss-web/shared/models';

export interface AbRequestsState {
  abRequests: ABDetailsEntity;
  abRequestsDetail: any;
  abRequestsCount: any;
  hasError?: CustomErrors;
  isLoading?: boolean;
  locations: any[];

}
