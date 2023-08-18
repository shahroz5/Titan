import { StateEntity } from './state.entity';
import {
  StateData,
  CustomErrors,
} from '@poss-web/shared/models';

export interface StatesState {
  stateDetailsListing: StateEntity;
  countryDetailsListing: StateEntity;
  totalStateDetails: number;
  error: CustomErrors;
  isLoading: boolean;
  stateDetailsByStateCode: StateData;
  stateTaxDetails: StateEntity;
  saveStateDetailsResponse: StateData;
  editStateDetailsResponse: StateData;
  isSearchElements: boolean;
  isActiveUpdated: boolean;
}
