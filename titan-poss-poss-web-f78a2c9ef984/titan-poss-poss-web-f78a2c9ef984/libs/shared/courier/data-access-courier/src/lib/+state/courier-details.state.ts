import {
  CourierMaster,
  CustomErrors,
  CountrySuccessPayload,
  StatesSuccessPayload,
  CourierDetailsListing,
  CourierSelectedLocations
} from '@poss-web/shared/models';
export interface CourierDetailsState {
  courierDetailsListing: CourierDetailsListing[];
  courierDetails: CourierMaster;
  totalCourierDetails: number;
  error: CustomErrors;
  isSaving: boolean;
  hasSaved: boolean;
  hasUpdated: boolean;
  hasSearched: boolean;
  selectedLocations: CourierSelectedLocations[];
  hasLocationsUpdated: boolean;
  country: CountrySuccessPayload[];
  states: StatesSuccessPayload[];
  isLoading: boolean;
}
