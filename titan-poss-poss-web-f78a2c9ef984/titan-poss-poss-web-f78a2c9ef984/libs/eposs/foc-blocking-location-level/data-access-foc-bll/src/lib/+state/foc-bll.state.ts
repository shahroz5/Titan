import {
  CourierSelectedLocations,
  CustomErrors,
  FOCBlockingLocationLevel
} from '@poss-web/shared/models';
export interface FOCBLLState {
  error: CustomErrors;
  hasSaved: boolean;
  isLoading: boolean;
  schemeId: string;
  focBlockingDetails: FOCBlockingLocationLevel[];
  totalElements: number;
  selectedLocations: CourierSelectedLocations[];
}
