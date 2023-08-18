// import { GrnIbtInventoryOne } from './grn-ibt-inventory-one.model';

export interface Configdetails {
  locationIbtCheckBox: { id: string; name: string; checked?: boolean }[];
}

export interface GHSStepOne {
  marketCode?: string;
  baseCurrency?: string;
  suspendingCNs?: string;
  transferredCNs?: string;
  activatedCNs?: string;
  DDvalidityDays?: string;
  consolidateAttempts?: string;
  reversalDays?: string;
  realisationDays?: string;
  validityDays?: string;
}

export interface GHSSteptwo {
  ghsIbtCheckBox: { id: string; name: string; checked?: boolean }[];
}

export interface PrintStepOne {
  makingChargesorWastageHeading: string;
  printCheckbox1: { id: string; name: string; checked?: boolean }[];
  printCheckbox2: { id: string; name: string; checked?: boolean }[];
}

export interface PrintStepTwo {
  freeTextForGrams: string;
  noOfInvoicecopiesforRegularOrQuickCM: string;
  CINNumber: string;
  corporateAddress: string;
}

export interface Configdetails {
  ghsStepOne?: GHSStepOne;
  ghsStepTwo?: GHSSteptwo;
  printStepOne?: PrintStepOne;
  printStepTwo?: PrintStepTwo;
  locationIbtCheckBox: { id: string; name: string; checked?: boolean }[];
  grnIbtCheckBox: { id: string; name: string; checked?: boolean }[];
  noofdaysGRNallowed: string;
  maximumnoofdaysforapprovedGRN: string;
  noofdaystoprotectgoldrateforGRN: string;
  minimumUtilization: string;
  maxnoofdaysforphysicalreceiptdate: string;
  configurationamountforStuddedsplit: string;
  maxnoofdaysforSTNcancellation: string;
  numbersofdays: string;
  numbersofdaysTodisplay: string;
  nooftimesrequestedincurrentmonth: string;
  totalvaluerequestedincurrentmonth: string;
  noofitemsrequestedincurrentmonth: string;
  loyalityCheckbox: { id: string; name: string; checked?: boolean }[];
  GEPpuregoldpurity: string;
  GEPpuresilverpurity: string;
  GEPpureplatinumpurity: string;
  GEPStandaredDeductiongold: string;
  GEPStandaredDeductionsilver: string;
  GEPStandaredDeductionplatinum: string;
  noofdaysforFVTpassword: string;
  rtgsMaximumamount: string;
  rtgsMinimunamount: string;
  multiplevalues: string;
  advanceCustomCheckbox: { id: string; name: string; checked?: boolean }[];
  maxWeightforFOC: string;
  maxValueforFOC: string;
  GEPPureGoldPurity: string;
  giftCardmaximumamount: string;
  giftCardsminimunamount: string;
  minOTPCNValue: string;
  maxnoofOFCN: string;
  maxnoofdaysforPOlikelydate: string;
  serviceTaxGSTRegistrationNumber: string;
}

export interface LocationMaster {
  address: string;
  brandCode: string;
  configDetails?: Configdetails;
  contactNo: string;
  currencyCode: string;
  description: string;
  factoryCodeValue: string;
  fax: string;
  isActive: true;
  locationCode: string;
  locationEmail: string;
  locationFormat: string;
  locationTypeCode: string;
  oldFactoryCode: string;
  ownerTypeCode: string;
  phoneNo: string;
  pincode: number;
  regionCode: string;
  registrationNo: string;
  stateCode: number;
  townCode: number;
  baseCurrency: string;
  masterCurrency: string;
  paymentCurrencies: string;
  stockCurrency: string;
}

export interface LocationModel {
  locationCode: string;
  description: string;
  address: string;
  pincode: number;
  phoneNo: string;
  contactNo: number;
  fax: number;
  locationEmail: string;
  locationTypeCode: string;
  registrationNo: number;
  townCode: number;
  stateCode: number;
  regionCode: string;
  subRegionCode: string;
  oldFactoryCode: string;
  ownerTypeCode: string;
  factoryCodeValue: string;
  locationFormat: number;
  brandCode: string;
  subBrandCode: string;
  configDetails: {};
  currencyCode: number;
  legalEntity: string;
  locationGroup: string;
  isActive: boolean;
  locationShortName: string;
}

export interface Ghs {
  ghsIbtCheckBox: { id: string; name: string; checked?: boolean }[];
  marketCode: string;
  baseCurrency: string;
  suspendingCNs: number;
  transferredCNs: number;
  activatedCNs: number;
  ddValidityDays: number;
  consolidateAttempts: number;
  reversalDays: number;
  realisationDays: number;
  validityDays: number;
}
export interface Print {
  makingChargesorWastageHeading: number;
  printCheckbox1: { id: string; name: string; checked?: boolean }[];
  printCheckbox2: { id: string; name: string; checked?: boolean }[];
  freeTextForGrams: string;
  noOfInvoicecopiesforRegularOrQuickCM: number;
  CINNumber: number;
  corporateAddress: string;
}
export interface GRNIBTInventory {
  noOfDaysGRNAllowed: string;
  maximumNoOfDaysForApprovedGRN: string;
  noOfDaysToProtectGoldrateforGRN: string;
  minimumUtilization: string;
  isInterBoutiqueGRNAllowed: boolean;
  maximummNoOfDaysForPhysicalReceiptDate: string;
  configurationAmountForStuddedSplit: string;
  maxNoOfDaysForSTNCancellation: string;
  numbersofdays: string;
  numberOfdaysTodisplay: string;
  nooftimesrequestedincurrentmonth: string;
  totalvaluerequestedincurrentmonth: string;
  noofitemsrequestedincurrentmonth: string;
  inventoryCheckBoxes: any;
  KYCConfigurationCheckBoxes: KYCConfiguration;
  ULPConfigurationCheckBoxes: ULPConfiguration;
}
export interface Inventory {
  acceptTEPOrGEPOrDisputeStocks: boolean;
  isStockTransferForBoutique?: boolean;
  isCoversionRestricted?: boolean;
  isSTNCancellationAllowed?: boolean;
}
export interface KYCConfiguration {
  isUploadDocumentAllowed?: boolean;
  isDownloadDocumentAllowed?: boolean;
}
export interface ULPConfiguration {
  acceptTEPOrGEPOrDisputeStocks: boolean;
  isStockTransferForBoutique?: boolean;
}

export interface LoyalityGEPGCTEP {
  loyalityCheckBoxes: {};
  GVPaymentCheckBoxes: {};
  GEPPureGoldPurity: string;
  GEPPureSilverPurity: string;
  GEPPurePlatinumPurity: string;
  GEPStandardDeductionGold: string;
  GEPStandardDeductionSilver: string;
  GEPStandardDeductionPlatinum: string;
  enableGEPSale: boolean;
  CCPaymentCheckBoxes: {};
  employeeDiscountCheckBoxes: {};
  maximumAmount: string;
  minimumAmount: string;
  multiplesValue: string;
  giftCardConfigurationCheckBoxes: {};
  noOfDaysForFVTPassword: string;
  enableRTGSrefund: boolean;
}
export interface AdvanceCustomOrder {
  advanceCustomOrderTabOneFoccheckBoxes: {
    id: string;
    name: string;
    checked?: boolean;
  }[];
  advanceCustomOrderTabOneRtgscheckBoxes: {
    id: string;
    name: string;
    checked?: boolean;
  }[];
  maxWeightforFOC: string;
  maxValueforFOC: string;
  GEPPureGoldPurity: string;
  maximumamount: string;
  minimunamount: string;
  minOTPCNValue: string;
  maxnoofOFCN: string;
  maxnoofdaysforPOlikelydate: string;
  serviceTaxGSTRegistrationNumber: string;
}

// From adaptors
export interface SaveLocationDetailsPayload {
  cfaCodeValue: string;
  address: string;
  countryCode: number;
  brandCode: string;
  subBrandCode: string;
  configDetails: any;
  contactNo: string;
  // currencyCode:string;
  description: string;
  factoryCodeValue: string;
  //fax: string;
  isActive: boolean;
  locationCode: string;
  locationEmail: string;
  locationFormat: string;
  locationTypeCode: string;
  ownerTypeCode: string;
  phoneNo: string;
  pincode: number;
  regionCode: string;
  subRegionCode: string;
  registrationNo: string;
  stateCode?: number;
  stateId?: number;
  townId: number;
}

export interface LocationListing {
  results: LocationMaster[];
  totalElements: number;
}

export interface CurrencyTypes {
  id: string;
  name: string;
}

export interface EmitCopyLocationCodePayload {
  oldLocationCode: string;
  newLocationCode: string;
}

export interface Towns {
  id: string;
  name: string;
  state_id: string;
}

export interface CopyDetailsPayload {
  oldLocationCode: string;
  newLocationCode: string;
}
export interface LocationListPayload {
  pageIndex: number;
  pageSize: number;
}

export interface LocationListingResult {
  address: string;
  brandCode: string;
  configDetails: {};
  contactNo: string;
  currencyCode: string;
  description: string;
  factoryCodeValue: string;
  fax: string;
  isActive: boolean;
  locationCode: string;
  locationEmail: string;
  locationFormat: string;
  locationTypeCode: string;
  oldFactoryCode: string;
  ownerTypeCode: string;
  phoneNo: string;
  pincode: number;
  regionCode: string;
  registrationNo: string;
  stateCode: number;
  townCode: number;
}
export interface SaveFormDetailsPayload {
  locationCode: string;
  data: any;
}

export interface StateTypes {
  id: string;
  name: string;
}

export interface LocationTypes {
  code: string;
  value: string;
}

export interface MarketCodeTypes {
  id: string;
  name: string;
}

export interface OwnerTypes {
  id: string;
  name: string;
}
export interface CountryAcn {
  id: string;
  name: string;
}

export interface PaymentMode {
  id: string;
  name: string;
}

export interface PriceGroup {
  id: string;
  name: string;
}

export interface LocationFormat {
  id: string;
  name: string;
}

export interface Regions {
  id?: string;
  name?: string;
  regionCode: string;
  description: string;
  configDetails: number;
  isActive: boolean;
  regionCode_id?: string;
}

export interface BrandName {
  id: string;
  name: string;
  brandName_id: string;
}
export interface BaseCurrencyTypes {
  id: string;
  name: string;
}

export interface LoadCourierDetailsListingPayload {
  pageIndex: number;
  pageSize: number;
}
