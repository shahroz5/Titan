import { Moment } from 'moment';

export interface LocationSetup {
  address?: string;
  baseCurrency?: string;
  brandCode?: string;
  cfaCodeValue?: string;
  companyName?: string;
  configDetails?: ConfigDetailsLoc;
  contactNo?: string;
  countryCode?: string;
  description?: string;
  factoryCodeValue?: string;
  fax?: string;
  isActive?: boolean;
  locationCode?: string;
  locationEmail?: string;
  locationFormat?: string;
  locationTypeCode?: string;
  marketCode?: string;
  masterCurrency?: string;
  ownerTypeCode?: string;
  paymentCurrencies?: string;
  phoneNo?: string;
  pincode?: string;
  regionCode?: string;
  registrationNo?: string;
  stateId?: number;
  stockCurrency?: string;
  subBrandCode?: string;
  subRegionCode?: string;
  townId?: number;
  cfaDetails?: LocationSettingsCfaDetails;
  factoryDetails?: LocationSettingsFactoryDetails;
  paymentDetails?: LocationSettingsPaymentDetails;
  abDetails?: any;
}

export interface LocationSettingsCfaDetails {
  address: string;
  brandCode: string;
  companyName: string;
  contactNo: string;
  description: string;
  isActive: boolean;
  locationCode: string;
  locationTypeCode: string;
  marketCode: string;
  phoneNo: string;
  regionCode: string;
  stateId: number;
  townId: number;
}

export interface LocationSettingsFactoryDetails {
  address: string;
  brandCode: string;
  companyName: string;
  contactNo: string;
  description: string;
  isActive: boolean;
  locationCode: string;
  locationTypeCode: string;
  marketCode: string;
  phoneNo: string;
  regionCode: string;
  stateId: number;
  townId: number;
}

export interface ConfigDetailsLoc {
  advanceStepOne?: AdvanceStepOne;
  advanceStepTwo?: AdvanceStepTwo;
  advanceStepThree?: AdvanceStepThree;
  ghsStepOne?: GhsStepOne;
  ghsStepTwo?: GhsStepTwo;
  grnIBTInventoryStepOne?: GrnIBTInventoryStepOne;
  grnIBTInventoryStepTwo?: GrnIBTInventoryStepTwo;
  locationStepOne?: LocationStepOne;
  locationStepTwo?: LocationStepTwo;
  locationStepThree?: LocationStepThree;
  loyalityStepOne?: LoyalityStepOne;
  loyalityStepTwo?: LoyalityStepTwo;
  loyalityStepThree?: LoyalityStepThree;
  printStepOne?: PrintStepOne;
}

export interface AdvanceStepOne {
  advanceCustomOrderConfiguration: AdvanceCustomOrderConfiguration;
}

export interface AdvanceCustomOrderConfiguration {
  advanceCustomOrderStepOneCheckBox: AdvanceCustomOrderStepOneCheckBox;
  goldRateAttempts: string;
  manualBillWeightDeviation: number;
  servicewtToleranceforStockItem: number;
  sparewtToleranceforStockItem: number;
  validityDaysforActivateInAdvanceBooking: number;
  validityDaysforActivateInCustomerOrder: number;
  validityDaysforAutoClosureInAdvanceBooking: number;
  validityDaysforAutoClosureInCustomerOrder: number;
  validityDaysforReleaseInvInAdvancebooking: number;
  validitydaysforReleaseInvInCustomerOrder: number;
}

export interface AdvanceCustomOrderStepOneCheckBox {
  activateAllowedforAdvanceBooking: boolean;
  activateAllowedforCustomerOrder: boolean;
  cancellationAllowedforAdvanceBooking: boolean;
  cancellationAllowedforCustomerOrder: boolean;
  printMandatoryFieldsInReport: boolean;
}

export interface AdvanceStepThree {
  configurePaymentMode: ConfigurePaymentMode;
  locationPriceMapping: LocationPriceMapping;
  otpConfigurations: OtpConfigurations;
}

export interface ConfigurePaymentMode {
  configurePaymentModeCheckBoxes: ConfigurePaymentModeConfigurePaymentModeCheckBoxes;
  paymentCode: string;
}

export interface ConfigurePaymentModeConfigurePaymentModeCheckBoxes {
  configurePaymentModeCheckBoxes: ConfigurePaymentModeCheckBoxesConfigurePaymentModeCheckBoxes;
}

export interface ConfigurePaymentModeCheckBoxesConfigurePaymentModeCheckBoxes {
  isApplicableforLocation: boolean;
  isApplicableforReversal: boolean;
}

export interface LocationPriceMapping {
  priceGroupCode: string;
  priceGroupTypeCode: string;
}

export interface OtpConfigurations {
  advanceCustomOrderTabThreecheckBoxes: AdvanceCustomOrderTabThreecheckBoxes;
}

export interface AdvanceCustomOrderTabThreecheckBoxes {
  isOTPallowedAB: boolean;
  isOTPallowedASSM: boolean;
  isOTPallowedAdvance: boolean;
  isOTPallowedCM: boolean;
  isOTPallowedCO: boolean;
  isOTPallowedGHS: boolean;
  isOTPrequiredforGC: boolean;
}

export interface AdvanceStepTwo {
  foc: Foc;
  rtgs: Rtgs;
}

export interface Foc {
  advanceCustomOrderTabTwoFoccheckBoxes: AdvanceCustomOrderTabTwoFoccheckBoxes;
  maxValueforFOC: number;
  maxWeightforFOC: number;
}

export interface AdvanceCustomOrderTabTwoFoccheckBoxes {
  bintobintransferallowedforFOCitems: boolean;
  isFOCitemssaleable: boolean;
  isTEPallowedforFOCitems: boolean;
  isTEPsaleableitemsallowedforFOC: boolean;
}

export interface Rtgs {
  advanceCustomOrderTabTwoRtgscheckBoxes: AdvanceCustomOrderTabTwoRtgscheckBoxes;
  maxNoofCN: number;
  maxNoofdaysforPOLikelyDate: number;
  minOTPCNValue: string;
  otpHelpdeskEmailId: string;
  serviceTaxGSTRegistrationno: string;
}

export interface AdvanceCustomOrderTabTwoRtgscheckBoxes {
  enableRTGSPayment: boolean;
}

export interface GhsStepOne {
  dayDetails: DayDetails;
}

export interface DayDetails {
  activatedCNs: number;
  baseCurrency: string;
  consolidateAttempts: number;
  ddValidityDays: number;
  realisationDays: number;
  suspendingCNs: number;
  transferredCNs: number;
  validityDays: number;
}

export interface GhsStepTwo {
  ghsIbtCheckBox: GhsIbtCheckBox;
}

export interface GhsIbtCheckBox {
  eghsredemption: boolean;
  eghsrevenue: boolean;
  isClubbingGHSMandatory: boolean;
  isConsentLetterUploadMandatory: boolean;
}

export interface GrnIBTInventoryStepOne {
  grnGrfConfiguration: GrnGrfConfiguration;
  inventory: Inventory;
  walkins: Walkins;
}

export interface GrnGrfConfiguration {
  grnGrfCheckBoxes: GrnGrfCheckBoxes;
  maximumNoOfDaysForApprovedGRN: number;
  minimumUtilization: string;
  noOfDaysGRNAllowed: number;
  noOfDaysToProtectGoldRateForGRN: number;
}

export interface GrnGrfCheckBoxes {
  isGRFAllowed: boolean;
  isGRFAllowedInAdavnceBooking: boolean;
  isGRFAllowedInCM: boolean;
  isGRFAllowedInCustomerOrder: boolean;
  isInterBoutiqueGRNAllowed: boolean;
}

export interface Inventory {
  configurationAmountForStuddedSplit: string;
  inventoryCheckBoxes: InventoryCheckBoxes;
  maximumNoOfDaysForPhysicalReceiptDate: number;
  maximumNoOfDaysForSTNCancellation: number;
}

export interface InventoryCheckBoxes {
  isAcceptTepGepDisputeStocks: boolean;
  isConversionRestricted: boolean;
  isSTNcancellationAllowed: boolean;
  isStockTransferForBoutique: boolean;
}

export interface Walkins {
  isWaliknsDetailsMandatory: boolean;
  noOfDays: number;
  numberOfDaysToDisplay: number;
}

export interface GrnIBTInventoryStepTwo {
  ibtConfiguration: IbtConfigurationLoc;
  kycConfiguration: KycConfiguration;
  ulpConfiguration: UlpConfiguration;
}

export interface IbtConfigurationLoc {
  noOfItemsRequestedInCurrentMonth: number;
  noOfTimesrequestedInCurrentMonth: number;
  totalValueRequestedInCurrentMonth: number;
}

export interface KycConfiguration {
  isDownloadDocumentAllowed: boolean;
  isUploadDocumentAllowed: boolean;
}
export interface RtgsSettings {
  enableRtgsPayment: boolean;
  isRRNumberValidation: boolean;
  maximumAmount: number;
  minimumAmount: number;
  ddDate: Moment;
  isEnableUnipayForIntegration: boolean;
  isROApprovedByWorkflow: boolean;
  isEnableAirpayForIntegration: boolean;
}
export interface PaymentDetailsData {
  checkValidityDays: number;
  ddValidityDays: number;
  realisationDays: number;
  isUlpAllowed: boolean;
  enableCNTarnsferForGVpayment: boolean;
  enableCNCancellationForGVPayment: boolean;
  isMultipleGVAllowed: boolean;
  roRequestDeletion: number;
  activeROPayment: number;
  rtgs: RtgsSettings;
}

export interface LocationSettingsPaymentDetails {
  type: string;
  data: PaymentDetailsData;
}
export interface UlpConfiguration {
  isEncirclePaymentAllowed: boolean;
}

export interface LocationStepOne {
  personalDetails: LocationStepOnePersonalDetails;
}

export interface LocationStepOnePersonalDetails {
  adressTwo: string;
  name: string;
  phoneNumberTwo: string;
}

export interface LocationStepThree {
  remarks: Remarks;
}

export interface Remarks {
  paymentModeForRefund: string;
  remarksVal: string;
  sapCode: string;
}

export interface LocationStepTwo {
  configurationDetails: ConfigurationDetails;
  otherDetails: OtherDetailsLoc;
}

export interface ConfigurationDetails {
  checkBoxes: CheckBoxes;
}

export interface CheckBoxes {
  digitalSignatureEnable: boolean;
  enableCashDeposit: boolean;
  enableChequeDeposit: boolean;
  ifeedbackAllowedForCM: boolean;
  isFeedbackAllowedForAssm: boolean;
  isPasswordMandatory: boolean;
  isStuddedSplitAllowed: boolean;
}

export interface OtherDetailsLoc {
  cinNumber: string;
  corporateAddress: string;
  marketCode: string;
  regdOffice: string;
}

export interface LoyalityStepOne {
  gvPayment: GvPayment;
  loyality: Loyality;
  personalDetails: LoyalityStepOnePersonalDetails;
}

export interface GvPayment {
  enableCNCancellationForGVPayment: boolean;
  enableCNTarnsferForGVpayment: boolean;
}

export interface Loyality {
  isBankingMandatory: boolean;
  isSynchronised: boolean;
}

export interface LoyalityStepOnePersonalDetails {
  enableGEPSale: boolean;
  gepPureGoldPurity: string;
  gepPurePlatinumPurity: string;
  gepPureSilverPurity: string;
  gepStandardDeductionGold: string;
  gepStandardDeductionPlatinum: string;
  gepStandardDeductionSilver: string;
}

export interface LoyalityStepThree {
  tep: Tep;
}

export interface Tep {
  enableRTGSrefund: boolean;
  noOfDaysForFVTPassword: number;
}

export interface LoyalityStepTwo {
  ccPayment: CcPayment;
  employeeDiscount: EmployeeDiscount;
  giftCardConfiguration: GiftCardConfiguration;
}

export interface CcPayment {
  enableUniPay: boolean;
}

export interface EmployeeDiscount {
  enableEmployeeDiscount: boolean;
}

export interface GiftCardConfiguration {
  giftCardConfigurationCheckBoxes: GiftCardConfigurationCheckBoxes;
  maximumAmount: number;
  minimumAmount: number;
  multiplesValue: number;
}

export interface GiftCardConfigurationCheckBoxes {
  isCardActivationAllowed: boolean;
  isCardCancellationAllowed: boolean;
  // isCardInwardingAllowed: boolean;
  isCardReedemAlowed: boolean;
}

export interface PrintStepOne {
  checkItOut1: CheckItOut1;
  checkItOut2: CheckItOut2;
  makingWastageCharge: number;
}

export interface CheckItOut1 {
  printMakingCharges: boolean;
  printPrice: boolean;
  printStoneValue: boolean;
  printWastageCharge: boolean;
  printWastageComponent: boolean;
  printWastagePercent: boolean;
}

export interface CheckItOut2 {
  freeTextForGrams: string;
  noOfInvoicecopiesforRegularOrQuickCM: number;
  printCashMemo: boolean;
  printCustomerNumberinReport: boolean;
  printGoldValue: boolean;
  printGuaranteeCard: boolean;
  printImage: boolean;
  printOtherStoneWeightinAnnexure: boolean;
  printOtherStoneWtinGuaranteeCard: boolean;
}

// Extras
export interface LocationListing {
  pageNumber: number;
  pageSize: number;
  results: LocationListResult[];
  totalElements: number;
  totalPages: number;
}

export interface LocationListResult {
  address: string;
  brandCode: string;
  companyName: string;
  contactNo: string;
  description: string;
  isActive: boolean;
  locationCode: string;
  locationTypeCode: string;
  marketCode: string;
  phoneNo: string;
  regionCode: string;
  stateId: number;
  townId: number;
}

export interface CurrencyTypes {
  id: string;
  name: string;
  checked?: boolean;
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

export interface PaymentMode {
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

export interface Towns {
  id: string;
  name: string;
  state_id: string;
}

export interface EmitCopyLocationCodePayload2 {
  oldLocationCode: string;
  newLocationCode: string;
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

export interface CountryAcn {
  id: string;
  name: string;
}

export interface OwnerTypes {
  id: string;
  name: string;
}

export interface LocationCFAType {
  // locationCode: string;
  // description: string;
  // locationFormat: string;

  id: string;
  name: string;
}

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

export interface SaveFormDetailsPayload {
  locationCode: string;
  data: LocationSetup;
}

export interface CopyDetailsPayload {
  oldLocationCode: string;
  newLocationCode: string;
}

export interface LocationListPayload {
  pageIndex: number;
  pageSize: number;
}

export interface StateTypes {
  id: string;
  name: string;
}
