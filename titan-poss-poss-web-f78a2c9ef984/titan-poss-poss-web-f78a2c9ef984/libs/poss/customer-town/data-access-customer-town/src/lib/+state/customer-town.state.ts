import {
  CustomErrors,
  // RegionDetails,
  CustomerTown,
  StateSummary
} from '@poss-web/shared/models';
// import { CustomerTownEntity } from './customer-town.entity';

export interface CustomerTownState {
  customerTownDetailsListing: CustomerTown[];
  totalCustomerTownDetails: number;
  error: CustomErrors;
  stateDetails: StateSummary[];
  // regionDetails: RegionDetails[];
  isCustomerTownLoading: boolean;
  townDetailsByTownCode: CustomerTown;
  saveTownDetailsResponses: CustomerTown;
  editTownDetailsResponses: CustomerTown;
  isSearchElements: boolean;
}
