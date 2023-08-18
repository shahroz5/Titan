import {
  CustomErrors,
  CountryDetails,
  CountryMaster,
  CountryNameData,
  Lov,
  CurrencyList
} from '@poss-web/shared/models';

export interface CountryState {
  error: CustomErrors;
  countryListing: CountryDetails[];
  countryDetails: CountryDetails;
  totalCountryDetails: number;
  isLoading: boolean;
  saveCountryResponses: CountryMaster;
  editCountryResponses: CountryDetails;
  countryName: CountryNameData[];
  currencyCode: CurrencyList[];
  timeFormats: Lov[];
  dateFormats: Lov[];
}
