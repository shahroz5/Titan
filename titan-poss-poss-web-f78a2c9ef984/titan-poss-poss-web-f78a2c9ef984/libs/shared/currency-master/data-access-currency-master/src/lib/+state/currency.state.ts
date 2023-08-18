import {
  CustomErrors,
  CurrencyDetails,
  CurrencyFormDetails
} from '@poss-web/shared/models';

export interface CurrencyState {
  error: CustomErrors;
  currencyListing: CurrencyDetails[];
  currencyDetails: CurrencyFormDetails;
  totalCurrencyDetails: number;
  isLoading: boolean;
  saveCurrency: CurrencyDetails;
  editCurrency: CurrencyDetails;
  // country: CountryDropDownData[];
  // currencySymbol: CurrencySymbolData[];
  // unicode : UnicodeData[];
}
