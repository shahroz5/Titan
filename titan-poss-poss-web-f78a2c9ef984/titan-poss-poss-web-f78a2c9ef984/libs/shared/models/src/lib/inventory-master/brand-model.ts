export interface BrandMaster {
  brandCode: string;
  description: string;
  parentBrandCode?: string;
  configDetails?: ConfigdetailsBrand;
  orgCode?: string;
  isActive: boolean;
}

export interface Currency {
  inventoryCurrency: string;
  masterCurrency: string;
  STNCurrency: string;
  currencyCheckbox: any;
}
export interface CMSMSConfiguration {
  SMSUserName: string;
  SMSPassword: string;
  centralS3BucketName: string;
  centralS3AccessKey: string;
  centralS3SecretKey: string;
  centralS3RegionEndPoint: string;
  centralWebAPIURL: string;
  EPOSSServiceURL: string;
}

export interface PancardConfiguration {
  configurationAmountForCashMemo: string;
  configurationAmountForAdvance: string;
  pancardCheckkbox: any;
}
export interface ResidualAmount {
  residualAmountForeGHSTransfer: string;
}

export interface ConfigdetailsBrand {
  brandConfigDetails?: any;
  currency?: Currency;
  pancardConfiguration?: PancardConfiguration;
  CMSMSConfiguration?: CMSMSConfiguration;
  residualAmount?: ResidualAmount;
  subBrandConfig?: any;
}

export interface BrandListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface BrandListing {
  results: BrandMaster[];
  totalElements: number;
}

export interface SaveBrandMasterDetailsPayload {
  brandCode: string;
  description: string;
  parentBrandCode: string;
  orgCode: string;
  isActive: boolean;
}

export interface UpadateIsActivePayload {
  brandCode: string;
  isActive: boolean;
}
export interface UpdateBrandMasterDetailsPayload {
  brandCode: string;
  data: any;
}

export interface BrandMasterListing {
  results: BrandMasterDetails[];
  totalElements: number;
}

export interface BrandMasterDetails {
  brandCode?: string;
  description?: string;
  isActive?: boolean;
  orgCode?: string;
  parentBrandCode?: string;
  cmDetails?: BrandCMDetails;
  configDetails?: BrandConfigDetails;
  customerDetails?: BrandCustomerDetails;
  panCardDetails?: BrandPanCardDetails;
  taxDetails?: BrandTaxDetails;
  brandTcsDetails?: BrandTCSDetails;
}

export interface BrandConfigDetails {
  type: string;
  data: BrandConfigDetailsData;
}

export interface BrandConfigDetailsData {
  isInterbrandTEPAllowed: boolean;
  minUtilizationPercentageforGRN: string;
  minUtilizationPercentageforGRF: string;
  // dummyMobNo: string;
  referCashPaymentConfig: boolean;
  numberOfPrintsAllowed: string;
  passwordConfigForCashDeposit: string;
  airpayPaymentExpiry: string;
  razorpayPaymentExpiry: string;
  isCustomerMandatoryForDigiGold: boolean;
}

export interface BrandPanCardDetails {
  type: string;
  data: BrandPanCardDetailsData;
}

export interface BrandPanCardDetailsData {
  isPanCardMandatoryforAdvance: boolean;
  isPanCardMandatoryforCashMemo: boolean;
  isPanCardMandatoryforGHS: boolean;
  isPanCardMandatoryforGEP: boolean;
  isPanCardMandatoryforCO: boolean;
  isPanCardMandatoryforTEP: boolean;
  isPanCardMandatoryforAcceptAdvance: boolean;
  isPanCardMandatoryforGiftCard: boolean;
  isPanCardMandatoryforGRF: boolean;
  isPanCardOnSingleInvoice: boolean;
  isPanCardOnCumulativeInvoice: boolean;
  configurationAmountForCashMemo: string;
  configurationAmountForAdvance: string;
  configurationAmountForGHS: string;
  configurationAmountForGEP: string;
  configurationAmountForTEP: string;
  configurationAmountForCO: string;
  configurationAmountForAcceptAdvance: string;
  configurationAmountForGRF: string;
  configurationAmountForGiftCard: string;
  editPanDetailsNumber: number;
}

export interface BrandCMDetails {
  type: string;
  data: BrandCMDetailsData;
}

export interface BrandCMDetailsData {
  smsUserName: string;
  smsPassword: string;
  residualAmountForeGHSTransfer: string;
}

export interface BrandTaxDetails {
  type: string;
  data: BrandTaxDetailsData; // Old TCS details
}
export interface BrandTCSDetails {
  type: string;
  data: BrandTCSDetailsData; // Old TCS details
}

// TCS Details
export interface BrandTCSDetailsData {
  b2c: B2C;
  b2b: B2B;
}

export interface B2B {
  tcsApplicableRates: B2BTcsApplicableRate[];
  tcsApplicableAmount: string;
}

export interface B2BTcsApplicableRate {
  type: string;
  percent: string;
}

export interface B2C {
  tcsBasedOnUlpNumber: boolean;
  tcsBasedOnMobileNumber: boolean;
  tcsApplicableRates: B2CTcsApplicableRate[];
  tcsApplicableAmount: string;
  grnConfig: GrnConfig;
}

export interface GrnConfig {
  tcsReverseInCaseOfGRN: boolean;
  tcsReverseForInterboutiqueGRN: boolean;
  tcsReverseForGRnDate: TcsReverseForGRnDate;
}

export interface TcsReverseForGRnDate {
  sameMonth: boolean;
  afterCalanderMonth: boolean;
}

export interface B2CTcsApplicableRate {
  type: string;
  isPanAvailable: boolean;
  isForm60Available: boolean;
  percent: string;
}

/// TCS Details Ends

export interface BrandTaxDetailsData {
  isAdvancedCNAllowed: boolean;
  isGhsAllowed: boolean;
  isOnSingleInvoice: boolean;
  jewellery: Jewellery;
  form60: Form60;
  bullion: Bullion;
  silverPlatinumConfig: SilverPlatinumConfig;
}

export interface Bullion {
  cashAmount: string;
  netInvoiceAmount: string;
  unitWeight: string;
}

export interface Form60 {
  indianCustomerPercent: string;
  nonIndianCustomerPercent: string;
  isNetInvoice: string;
}

export interface Jewellery {
  cashAmount: string;
  netInvoiceAmount: string;
  panCardPercent: string;
}

export interface SilverPlatinumConfig {
  isSilverAllowed: boolean;
  isPlatinumAllowed: boolean;
}

export interface BrandCustomerDetails {
  type: string;
  data: DataBrandCustomerDetailsData;
}

export interface DataBrandCustomerDetailsData {
  regularMobileNoStartsWith: number[];
  internationalMobileNoStartsWith: number[];
  institutionalMobileNoStartsWith: number[];
  oneTimeMobileNoStartsWith: number[];
}

export enum NetInvoiceEnum {
  NET_INVOICE_AMOUNT = 'NET_INVOICE_AMOUNT',
  CASH_COLLECTED_AMOUNT = 'new'
}

export enum BrandEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}
