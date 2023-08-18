import {
  CourierSelectedLocations,
  CustomErrors,
  FOCBlockingCustomerLevel
} from '@poss-web/shared/models';

export interface FOCBCLState {
  error: CustomErrors;
  isLoading: boolean;
  hasSaved: boolean;
  schemeId: string;
  focBlockingCustomerLevel: FOCBlockingCustomerLevel[];
  totalElements: number;
  selectedLocations: CourierSelectedLocations[];
}
