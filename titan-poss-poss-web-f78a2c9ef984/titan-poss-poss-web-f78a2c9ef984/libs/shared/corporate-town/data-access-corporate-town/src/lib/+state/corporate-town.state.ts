import {
  CustomErrors,
  // RegionDetails,
  CorporateTown,
  StateSummary,
  CountryList
} from '@poss-web/shared/models';
import { CorporateTownEntity } from './corporate-town.entity';

export interface CorporateTownState {
  corporateTownDetailsListing: CorporateTownEntity;
  totalCorporateTownDetails: number;
  error: CustomErrors;
  stateDetails: StateSummary[];
  // regionDetails: RegionDetails[];
  isCorporateTownLoading: boolean;
  townDetailsByTownCode: CorporateTown;
  saveTownDetailsResponses: CorporateTown;
  editTownDetailsResponses: CorporateTown;
  isSearchElements: boolean;
  countryData: CountryList[];
}
