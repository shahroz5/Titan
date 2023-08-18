export interface Location {
  address: string;
  brandCode: string;
  description: string;
  isActive: boolean;
  locationCode: string;
  locationTypeCode: string;
  phoneNo: string;
  regionCode: string;
  stateCode: number;
  townCode: number;
  cfaCodeValue: string;
  configDetails: {};
  contactNo: string;
  countryCode: number;
  factoryCodeValue: string;
  fax: string;
  locationEmail: string;
  locationFormat: string;
  ownerTypeCode: string;
  pincode: number;
  registrationNo: string;
}
export interface LocationSummary {
  address: string;
  brandCode: string;
  cfaCodeValue: string;
  cfaDetails: LocationSummaryDetails;
  cfaStoreDetails:any;
  configDetails: {};
  contactNo: string;
  countryCode: number;
  description: string;
  factoryCodeValue: string;
  factoryDetails: LocationSummaryDetails;
  fax: string;
  isActive: boolean;
  locationCode: string;
  locationEmail: string;
  locationFormat: string;
  locationTypeCode: string;
  ownerTypeCode: string;
  phoneNo: string;
  pincode: number;
  regionCode: string;
  registrationNo: string;
  stateCode: number;
  townCode: number;
  baseCurrency: string;
  stockCurrency: string;
  masterCurrency: string;
  paymentCurrencies: string;
  companyName: string;
  cmDetails?: {
    type: string;
    data: CashMemoDetails;
  };
}
export interface LocationSummaryDetails {
  address: string;
  brandCode: string;
  description: string;
  isActive: boolean;
  locationCode: any;
  locationTypeCode: string;
  phoneNo: string;
  regionCode: string;
  stateCode: number;
  townCode: number;
}
export interface LocationSummaryList {
  description: string;
  locationCode: string;
  isMigrated?: boolean;
}

export interface CountryList {
  description: string;
  countryCode: string;
}

export interface CurrencyList {
  description: string;
  currencyCode: string;
}

export interface CashMemoDetails {
  isBillCancelApprovalRequired: boolean;
  isMobileAndEmail: boolean;
  isEditWeightAllowed: boolean;
  title: string;
  maxNoOfHoursForBillCancel: number;
  cmHoldTimeInMinutes: number;
}
