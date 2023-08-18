export interface LocationMasterDropdownList {
  id: string;
  name: string;
}

export interface LocationListingPage {
  pageIndex: number;
  pageSize: number;
}

export interface LocationListingPayload {
  pageNumber: number;
  pageSize: number;
  results: LocationListingData[];
  totalElements: number;
  totalPages: number;
}

export interface LocationListingData {
  locationCode: string;
  brandCode: string;
  townId: string;
  townName: string;
  stateId: string;
  stateName: string;
  regionCode: string;
  locationTypeCode: string;
  locationFormat: string;
  isActive: boolean;
  description: string;
  marketCode: string;
  fax: string;
  countryCode: string;
  ownerTypeCode: string;
  factoryCodeValue: string;
  cfaCodeValue: string;
  subRegionCode: string;
  subBrandCode: string;
  remarks: string;
  baseCurrency: string;
  stockCurrency: string;
  masterCurrency: string;
  paymentCurrencies: string;
}

// -------------------- Location Details

export interface LocationMasterDetails {
  abDetails?: AbDetails;
  bankingDetails?: BankingDetails;
  baseCurrency?: string;
  brandCode?: string;
  cfaCodeValue?: string;
  cfaDetails?: LocationCfaDetails;
  cmDetails?: CMDetails;
  cnDetails?: CNDetails;
  coDetails?: CoDetails;
  country?: LocationCountry;
  countryCode?: string;
  customerDetails?: LocationCustomerDetails;
  description?: string;
  factoryCodeValue?: string;
  factoryDetails?: LocationFactoryDetails;
  gcDetails?: GcDetails;
  gepDetails?: LocationGepDetails;
  ghsDetails?: GhsDetails;
  grfDetails?: GrfDetails;
  grnDetails?: GrnDetails;
  inventoryDetails?: InventoryDetails;
  isActive?: boolean;
  locationCode: string;
  locationFormat?: string;
  locationTypeCode?: string;
  marketCode?: string;
  masterCurrency?: string;
  offerDetails?: LocationOfferDetails;
  otpDetails?: LocationOtpDetails;
  ownerTypeCode?: string;
  paymentCurrencies?: string;
  paymentDetails?: LocationPaymentDetails;
  printDetails?: PrintDetails;
  regionCode?: string;
  remarks?: string;
  stateId?: string;
  stockCurrency?: string;
  storeDetails?: StoreDetails;
  subBrandCode?: string;
  subRegionCode?: string;
  taxDetails?: LocationTaxDetails;
  tepDetails?: LocationTepDetails;
  digigoldDetails?: LocationDigigoldDetails;
  tcsDetails?: LocationTcsDetails;
  serviceDetails?: LocationServiceDetails;
  townId?: string;
  isOffline?: boolean;
  isAutostn?: boolean;
}

export interface LocationTcsDetails {
  type: string;
  data: LocationTcsDetailsData;
}

export interface LocationTcsDetailsData {
  isTcsApplicable: boolean;
  locationPanNumber: string;
  isApplicableLocations: boolean;
  tcsStartDate: string;
  tcsApplicableDate: string;
}

export interface LocationServiceDetails {
  type: string;
  data: {
    isServiceMandatory: boolean;
  };
}

export interface LocationTepDetails {
  data: {
    tepHoldTime: number;
    tepPartialCNCancellation?: boolean;
  };
  type: string;
}
export interface LocationFactoryDetails {
  baseCurrency: string;
  brandCode: string;
  cfaCodeValue: string;
  countryCode: string;
  description: string;
  factoryCodeValue: string;
  fax: string;
  isActive: boolean;
  locationCode: string;
  locationFormat: string;
  locationTypeCode: string;
  marketCode: string;
  masterCurrency: string;
  ownerTypeCode: string;
  paymentCurrencies: string;
  regionCode: string;
  remarks: string;
  stateId: string;
  stateName: string;
  stockCurrency: string;
  subBrandCode: string;
  subRegionCode: string;
  townId: string;
  townName: string;
}
export interface LocationCountry {
  countryCode: string;
  currencyCode: string;
  dateFormat: string;
  description: string;
  fiscalYear: number;
  fiscalYearEnd: string;
  fiscalYearStart: string;
  isActive: true;
  isdCode: string;
  lastModifiedDate: string;
  locale: string;
  phoneLength: number;
  timeFormat: string;
  weightUnit?: string;
  stoneWeightUnit?: string;
}

export interface LocationCfaDetails {
  baseCurrency: string;
  brandCode: string;
  cfaCodeValue: string;
  countryCode: string;
  description: string;
  factoryCodeValue: string;
  fax: string;
  isActive: boolean;
  locationCode: string;
  locationFormat: string;
  locationTypeCode: string;
  marketCode: string;
  masterCurrency: string;
  ownerTypeCode: string;
  paymentCurrencies: string;
  regionCode: string;
  remarks: string;
  stateId: string;
  stateName: string;
  stockCurrency: string;
  subBrandCode: string;
  subRegionCode: string;
  townId: string;
  townName: string;
}
export interface AbDetails {
  type: string;
  data: AbDetailsData;
}

export interface AbDetailsData {
  cancellationAllowedforAdvanceBooking: boolean;
  activateAllowedforAdvanceBooking: boolean;
  validityDaysforAutoClosureInAdvanceBooking: string;
  validityDaysforActivateInAdvanceBooking: string;
  validityDaysforReleaseInvInAdvancebooking: string;
  minPercentToBePaidForFrozenOrder: string;
  minPercentToBePaidForNonFrozenOrder: string;
  requestApprovalForNonFrozenOrderCancel: boolean;
  noOfHoursForOpenTaskDeletion: string;
  abHoldTime: string;
  isSmsAndEmailCommunicationEnable: boolean;
}

export interface BankingDetails {
  type: string;
  data: BankingDetailsData;
}

export interface BankingDetailsData {
  isBankingMandatory: boolean;
  isPasswordMandatory: boolean;
  enableCashDeposit: boolean;
  enableChequeDeposit: boolean;
  remarksForPassword: string;
  sapCode: string;
  paymentMode: string;
}

// Generated by https://quicktype.io

export interface CMDetails {
  type: string;
  data: CMDetailsData;
}

export interface CMDetailsData {
  isBillCancelApprovalRequired: boolean;
  isMobileAndEmail: boolean;
  isMobileAndEmailMandatoryForCorrection: boolean;
  isEditWeightAllowed: boolean;
  isTitle: boolean;
  maxNoOfHoursForBillCancel: string;
  noOfHoursForOpenTaskDeletionCM: string;
  cmHoldTimeInMinutes: string;
}

export interface CNDetails {
  type: string;
  data: CNDetailsData;
}

export interface CNDetailsData {
  suspendingCNs: string;
  transferredCNs: string;
  activatedCNs: string;
  maxNoOfCN: string;
  otpForMinCN: string;
  isEmployeeLoanCNCancel: boolean;
  isEmployeeLoanCNTransfer: boolean;
  isEVoucherCnCancellationAllowed: boolean;
  isEVoucherCnTransferAllowed: boolean;
  isQcgcCnCancellationAllowed: boolean;
  isQcgcCnTransferAllowed: boolean;
  isGvCnCancellationAllowed: boolean;
  isGvCnTransferAllowed: boolean;
  isGhsCnCancellationAllowed: boolean;
  isGhsCnTransferAllowed: boolean;
  // TODO: field name may change as per API
  isUploadMandatoryforThirdPartyCNWithoutOTP: boolean;
}

// export interface CNDetails {
//     type: string;
//     data: CNDetailsData;
// }

// export interface CNDetailsData {
//     transferredCNs: string;
//     activatedCNs: string;
//     maxNoOfCN: string;
//     otpForMinCN: string;
//     maxNoOfTimesCNinEGHS: string;
//     isEmployeeLoanCNCancel: boolean;
//     isEmployeeLoanCNTransfer: boolean;
// }

export interface CoDetails {
  type: string;
  data: CoDetailsData;
}

export interface CoDetailsData {
  cancellationAllowedforCustomerOrder: boolean;
  activateAllowedforCustomerOrder: boolean;
  requestApprovalforNonFrozenOrderCancellation: boolean;
  validityDaysforAutoClosureInCustomerOrder: string;
  validityDaysforActivateInCustomerOrder: string;
  numberOfDaysforAutoApproval: string;
  numberOfDaysforReturnAutoApproval: string;
  coHoldTime: string;
  isSmsAndEmailCommunicationEnable: boolean;
}

export interface LocationCustomerDetails {
  type: string;
  data: CustomerDetailsData;
}

export interface CustomerDetailsData {
  isDownloadDocumentAllowed: boolean;
  isUploadDocumentAllowed: boolean;
  isDocumentDisplayForCC: boolean;
  isEmailForEncircleCustomer: boolean;
  isMobileNoForOneTimeCustomer: boolean;
  isEmailForOneTimeCustomer: boolean;
  isEmailForInstitutionalCustomer: boolean;
  isMobileNoForInstitutionalCustomer: boolean;
  isEmailForInternationalCustomer: boolean;
  isMobileNoForInternationalCustomer: boolean;
}

// Generated by https://quicktype.io

export interface GcDetails {
  type: string;
  data: GcDetailsData;
}

export interface GcDetailsData {
  maximumAmount: string;
  minimumAmount: string;
  multiplesValue: string;
  isCardCancellationAllowed: boolean;
  // isCardInwardingAllowed: boolean;
  isCardActivationAllowed: boolean;
}

// export interface GcDetails {
//     type: string;
//     data: GcDetailsData;
// }

// export interface GcDetailsData {
//     maximumAmount: string;
//     minimumAmount: string;
//     multiplesValue: string;
//     isCardCancellationAllowed: boolean;
//     isCardInwardingAllowed: boolean;
//     isCardActivationAllowed: boolean;
// }

export interface LocationGepDetails {
  type: string;
  data: GepDetailsData;
}

export interface GepDetailsData {
  enableGEPSale: boolean;
  gepStandardDeductionGold: string;
  gepStandardDeductionPlatinum: string;
  gepStandardDeductionSilver: string;
  noOfDaysGepCancel: string;
  karatAcceptedForGEP: string;
  isPreMeltingDetailsMandatory: boolean;
  gepHoldTime: string;
}

export interface GhsDetails {
  type: string;
  data: GhsDetailsData;
}

export interface GhsDetailsData {
  isEghsMandatory: boolean;
  isConsentLetterUploadMandatory: boolean;
  isClubbingGHSAccRestricted: boolean;
  grammageCNTransfer: boolean;
  // isOtpRequired: boolean;
  isGHSRedemptionAllowed: boolean;
  noOfDaysForSuspendingGhs: string;
  consolidateAttempts: string;
  gracePeriodAfterSuspenededGhs: string;
  noOfDaysToBlockCustomerConfig: string;
  noOfDaysToBlockAdvanceBooking: string;
  isAllowedToClubRivahGhsAndGhs: boolean;
  isAllowedToClubRivahGhsAndGrammage: boolean;
  isAllowedToClubAccountsOfSameScheme: boolean;
  isAlowedToClubAccountsOfDiffCategory: boolean;
  // TODO: field name may change as per API
  isUploadMandatoryforGHSWithoutOTP: boolean;
}

export interface GrfDetails {
  type: string;
  data: GrfDetailsData;
}

export interface GrfDetailsData {
  minimumUtilization: string;
  isGRFAllowed: boolean;
  isGRFAllowedInCM: boolean;
  isGRFAllowedInAdvanceBooking: boolean;
  isGRFAllowedInCustomerOrder: boolean;
  isMergeCNAllowed: boolean;
  currentOwner: boolean;
  thirdPerson: boolean;
}

// export interface GrfDetails {
//     type: string;
//     data: GrfDetailsData;
// }

// export interface GrfDetailsData {
//     minimumUtilization: string;
//     isGRFAllowed: boolean;
//     isInterBoutiqueGRNAllowed: boolean;
//     isGRFAllowedInCM: boolean;
//     isGRFAllowedInAdavnceBooking: boolean;
//     isGRFAllowedInCustomerOrder: boolean;
//     isMergeCNAllowed: boolean;
//     currentOwner: boolean;
//     thirdPerson: boolean;
// }

export interface GrnDetails {
  type: string;
  data: GrnDetailsData;
}

export interface GrnDetailsData {
  minUtilizationPercentForGRN: string;
  noOfDaysGRNAllowed: string;
  maximumNoOfDaysForApprovedGRN: string;
  noOfDaysToProtectGoldRateForGRN: string;
  isInterBoutiqueGRNAllowed: boolean;
  isGrnAllowedInCm: boolean;
  isGrnAllowedInAdvanceBooking: boolean;
  isGrnAllowedInCustomerOrder: boolean;
}

export interface InventoryDetails {
  type: string;
  data: InventoryDetailsData;
}

export interface InventoryDetailsData {
  isIssueToFactory: boolean;
  isIssueToMerchandise: boolean;
  isIssueToOtherBoutique: boolean;
  isIssueToTEP: boolean;
  isIssueToGEP: boolean;
  isIssueDefective: boolean;
  isIssueOthers: boolean;
  maximumNoOfDaysForPhysicalReceiptDate: string;
  maximumNoOfDaysForSTNCancellation: string;
  isSTNcancellationAllowed: boolean;
  isConversionRestricted: boolean;
  isStuddedSplitAllowed: boolean;
  sparewtToleranceforStockItem: string;
  servicewtToleranceforStockItem: string;
  isUECLocationStockNotVisibleForIBTTransfer: boolean;
  conversionwtToleranceforBangle: string;
}

export interface LocationOfferDetails {
  type: string;
  data: OfferDetailsData;
}

export interface OfferDetailsData {
  maxWeightforFOC: string;
  maxValueforFOC: string;
  bintobintransferallowedforFOCitems: boolean;
  isTEPsaleableitemsallowedforFOC: boolean;
  isTEPallowedforFOCitems: boolean;
  isFOCitemssaleable: boolean;
  isEmployeeDiscount: boolean;
}

export interface LocationDigigoldDetails {
  type: string;
  data: LocationDigigoldDetailsData;
}

export interface LocationDigigoldDetailsData {
  digiGoldDiscountPercent: string;
  isCNPartialRedemptionAllowedForDigiGold: boolean;
  isCNCancelAllowedForDigiGold: boolean;
  isCNCancelAllowedForNonDigiGold: boolean;
  isCNTransferAllowedForDigiGold: boolean;
  isCNTransferAllowedForNonDigiGold: boolean;
}

export interface LocationOtpDetails {
  type: string;
  data: LocationOtpDetailsData;
}

export interface LocationOtpDetailsData {
  isOTPallowedASSM: boolean;
  isOTPallowedCM: boolean;
  isOTPallowedAdvance: boolean;
  isOTPallowedAB: boolean;
  isOTPallowedGHS: boolean;
  isOTPallowedCO: boolean;
  isOTPrequiredforGHSRedemption: boolean;
  isOTPrequiredforGC: boolean;
  otpHelpDeskEmailId: string;
}

export interface LocationPaymentDetails {
  type: string;
  data: LocationPaymentDetailsData;
}

export interface LocationPaymentDetailsData {
  isRazorPayEnabled: boolean;
  chequeValidityDays: string;
  ddValidityDays: string;
  realisationDays: string;
  isUlpAllowed: boolean;
  enableCNTarnsferForGVpayment: boolean;
  enableCNCancellationForGVPayment: boolean;
  isMultipleGVAllowed: boolean;
  pendingRORequestDeletion: string;
  approvedRORequestDeletion: string;
  rtgs: LocationRtgs;
}

export interface LocationRtgs {
  enableRtgsPayment: boolean;
  isRRNumberValidation: boolean;
  maximumAmount: string;
  minimumAmount: string;
  noOfDaysForChequeOrDDAcceptance: string;
  isEnableUnipayForIntegration: boolean;
  isROApprovedByWorkflow: boolean;
  isEnableAirpayForIntegration: boolean;
}

export interface PrintDetails {
  type: string;
  data: PrintDetailsData;
}

export interface PrintDetailsData {
  printWastagePercent: boolean;
  printWastageComponent: boolean;
  printWastageCharge: boolean;
  printStoneValue: boolean;
  printGoldValue: boolean;
  printPrice: boolean;
  freeTextForGrams: string;
  mcOrWastageExpense: string;
  isMCAndWastage: boolean;
  isDisplayWastagePercent: boolean;
  isVariablePrice: boolean;
  printMakingCharges: boolean;
  printCustomerNumberinReport: boolean;
  printCashMemo: boolean;
  printGuaranteeCard: boolean;
  printOtherStoneWtinGuaranteeCard: boolean;
  printOtherStoneWeightinAnnexure: boolean;
  noOfInvoicecopiesforRegularOrQuickCM: string;
  invoiceType: string;
  printImage: boolean;
}

export interface StoreDetails {
  type: string;
  data: StoreDetailsData;
}

export interface StoreDetailsData {
  cinNumber: string;
  corporateAddress: string;
  companyName: string;
  regdOffice: string;
  isWalkInsDetailsMandatory: boolean;
  numberOfDaysToDisplay: string;
  noOfDays: string;
  addressLines: Array<null | string>;
  phoneNumber1: string;
  phoneNumber2: string;
  contactNumber: string;
  pincode: string;
  boutiqueEmailId: string;
  maxRateRetryAttempt: string;
  isEinvoiceEnabled: boolean;
  isDial: boolean;
  isHallmarkingEnabled: boolean;
  hallmarkRegistrationNumber: string;
  hallmarkGSTPercentage: string;
  reviewLinkURL: string;
  isPanCardVerifyIntegrationEnabled: boolean;
}

export interface LocationTaxDetails {
  type: string;
  data: TaxDetailsData;
}

export interface TaxDetailsData {
  isGST: boolean;
  gstRegisterationNo: string;
  gstValidFrom: string;
  gstPrintValidFrom: string;
}

export interface EmitCopyLocationCodePayload {
  oldLocationCode: string;
  newLocationCode: string;
}

export enum OwnerTypeList {
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3'
}
export enum LocationTypeLists {
  ENTP = 'ENTP',
  VENDOR = 'VENDOR',
  BTQ = 'BTQ',
  REGOFF = 'REGOFF',
  CFA = 'CFA',
  FACTORY = 'FACTORY'
}

export enum LocationApiKeyEnum {
  BANKING_DETAILS = 'BANKING_DETAILS',
  CUSTOMER_DETAILS = 'CUSTOMER_DETAILS',
  OFFER_DETAILS = 'OFFER_DETAILS',
  GHS_DETAILS = 'GHS_DETAILS',
  INVENTORY_DETAILS = 'INVENTORY_DETAILS',
  STORE_DETAILS = 'STORE_DETAILS',
  OTP_DETAILS = 'OTP_DETAILS',
  DIGIGOLD_DETAILS = 'DIGIGOLD_DETAILS',
  LOCATION_TCS_DETAILS = 'LOCATION_TCS_DETAILS',
  PAYMENT_DETAILS = 'PAYMENT_DETAILS',
  PRINT_DETAILS = 'PRINT_DETAILS',
  CREDIT_NOTES = 'CREDIT_NOTES',
  TAX_DETAILS = 'TAX_DETAILS',
  CM_DETAILS = 'CM_DETAILS',
  GRN_DETAILS = 'GRN_DETAILS',
  GRF_DETAILS = 'GRF_DETAILS',
  GEP_DETAILS = 'GEP_DETAILS',
  GIFT_CARD_DETAILS = 'GIFT_CARD_DETAILS',
  ADVANCE_BOOKING_DETAILS = 'ADVANCE_BOOKING_DETAILS',
  CUSTOMER_ORDER_DETAILS = 'CUSTOMER_ORDER_DETAILS',
  TEP_DETAILS = 'TEP_DETAILS',
  SERVICE_POSS_DETAILS = 'SERVICE_DETAILS'
}
