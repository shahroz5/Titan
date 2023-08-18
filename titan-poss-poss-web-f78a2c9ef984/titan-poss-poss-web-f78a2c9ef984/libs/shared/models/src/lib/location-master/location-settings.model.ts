export interface LocationSettingsCfaDetails {
  address: 'string';
  brandCode: 'string';
  companyName: 'string';
  contactNo: 'string';
  description: 'string';
  isActive: true;
  locationCode: 'string';
  locationTypeCode: 'string';
  marketCode: 'string';
  phoneNo: 'string';
  regionCode: 'string';
  stateId: 0;
  townId: 0;
}

export interface AdvanceCustomOrderStepOneCheckBox {
  activateAllowedforAdvanceBooking: true;
  activateAllowedforCustomerOrder: true;
  cancellationAllowedforAdvanceBooking: true;
  cancellationAllowedforCustomerOrder: true;
  printMandatoryFieldsInReport: true;
}

export interface AdvanceCustomOrderConfiguration {
  advanceCustomOrderStepOneCheckBox: AdvanceCustomOrderStepOneCheckBox;
  goldRateAttempts: 'string';
  manualBillWeightDeviation: 0;
  servicewtToleranceforStockItem: 0;
  sparewtToleranceforStockItem: 0;
  validityDaysforActivateInAdvanceBooking: 0;
  validityDaysforActivateInCustomerOrder: 0;
  validityDaysforAutoClosureInAdvanceBooking: 0;
  validityDaysforAutoClosureInCustomerOrder: 0;
  validityDaysforReleaseInvInAdvancebooking: 0;
  validitydaysforReleaseInvInCustomerOrder: 0;
}

export interface AdvanceStepOne {
  advanceCustomOrderConfiguration: AdvanceCustomOrderConfiguration;
}

export interface ConfigurePaymentMode {
  configurePaymentModeCheckBoxes: {
    configurePaymentModeCheckBoxes: {
      isApplicableforLocation: true;
      isApplicableforReversal: true;
    };
  };
  paymentCode: 'string';
}

export interface LocationPriceMapping {
  priceGroupCode: 'string';
  priceGroupTypeCode: 'string';
}

export interface AdvanceCustomOrderTabThreecheckBoxes {
  isOTPallowedAB: true;
  isOTPallowedASSM: true;
  isOTPallowedAdvance: true;
  isOTPallowedCM: true;
  isOTPallowedCO: true;
  isOTPallowedGHS: true;
  isOTPrequiredforGC: true;
}

export interface OtpConfigurations {
  advanceCustomOrderTabThreecheckBoxes: AdvanceCustomOrderTabThreecheckBoxes;
}

export interface AdvanceStepThree {
  configurePaymentMode: ConfigurePaymentMode;
  locationPriceMapping: LocationPriceMapping;
  otpConfigurations: OtpConfigurations;
}

export interface AdvanceCustomOrderTabTwoFoccheckBoxes {
  bintobintransferallowedforFOCitems: true;
  isFOCitemssaleable: true;
  isTEPallowedforFOCitems: true;
  isTEPsaleableitemsallowedforFOC: true;
}

export interface AdvanceCustomOrderTabTwoRtgscheckBoxes {
  enableRTGSPayment: true;
}

export interface AdvanceStepTwo {
  foc: {
    advanceCustomOrderTabTwoFoccheckBoxes: AdvanceCustomOrderTabTwoFoccheckBoxes;
    maxValueforFOC: 0;
    maxWeightforFOC: 0;
  };
  rtgs: {
    advanceCustomOrderTabTwoRtgscheckBoxes: AdvanceCustomOrderTabTwoRtgscheckBoxes;
    maxNoofCN: 0;
    maxNoofdaysforPOLikelyDate: 0;
    minOTPCNValue: 'string';
    otpHelpdeskEmailId: 'string';
    serviceTaxGSTRegistrationno: 'string';
  };
}

export interface GhsStepOne {
  dayDetails: {
    activatedCNs: 0;
    baseCurrency: 'string';
    consolidateAttempts: 0;
    ddValidityDays: 0;
    realisationDays: 0;
    suspendingCNs: 0;
    transferredCNs: 0;
    validityDays: 0;
  };
}

export interface GhsStepTwo {
  ghsIbtCheckBox: {
    eghsredemption: true;
    eghsrevenue: true;
    isClubbingGHSMandatory: true;
    isConsentLetterUploadMandatory: true;
  };
}

export interface GrnGrfCheckBoxes {
  isGRFAllowed: true;
  isGRFAllowedInAdavnceBooking: true;
  isGRFAllowedInCM: true;
  isGRFAllowedInCustomerOrder: true;
  isInterBoutiqueGRNAllowed: true;
}

export interface GrnGrfConfiguration {
  grnGrfCheckBoxes: GrnGrfCheckBoxes;
  maximumNoOfDaysForApprovedGRN: 0;
  minimumUtilization: 'string';
  noOfDaysGRNAllowed: 0;
  noOfDaysToProtectGoldRateForGRN: 0;
}

export interface InventoryCheckBoxes {
  isAcceptTepGepDisputeStocks: true;
  isConversionRestricted: true;
  isSTNcancellationAllowed: true;
  isStockTransferForBoutique: true;
}

export interface Walkins {
  isWaliknsDetailsMandatory: true;
  noOfDays: 0;
  numberOfDaysToDisplay: 0;
}

export interface GrnIBTInventoryStepOne {
  grnGrfConfiguration: GrnGrfConfiguration;
  inventory: {
    configurationAmountForStuddedSplit: 'string';
    inventoryCheckBoxes: InventoryCheckBoxes;
    maximumNoOfDaysForPhysicalReceiptDate: 0;
    maximumNoOfDaysForSTNCancellation: 0;
  };
  walkins: Walkins;
}

export interface LocationSettingsIbtConfiguration {
  noOfItemsRequestedInCurrentMonth: 0;
  noOfTimesrequestedInCurrentMonth: 0;
  totalValueRequestedInCurrentMonth: 0;
}

export interface KycConfiguration {
  isDownloadDocumentAllowed: true;
  isUploadDocumentAllowed: true;
}

export interface UlpConfiguration {
  isEncirclePaymentAllowed: true;
}

export interface GrnIBTInventoryStepTwo {
  ibtConfiguration: LocationSettingsIbtConfiguration;
  kycConfiguration: KycConfiguration;
  ulpConfiguration: UlpConfiguration;
}

export interface LocationStepOne {
  personalDetails: {
    adressTwo: 'string';
    name: 'string';
    phoneNumberTwo: 'string';
  };
}

export interface LocationStepThree {
  remarks: {
    paymentModeForRefund: 'string';
    remarksVal: 'string';
    sapCode: 'string';
  };
}

export interface ConfigurationDetails {
  checkBoxes: {
    digitalSignatureEnable: true;
    enableCashDeposit: true;
    enableChequeDeposit: true;
    ifeedbackAllowedForCM: true;
    isFeedbackAllowedForAssm: true;
    isPasswordMandatory: true;
    isStuddedSplitAllowed: true;
  };
}

export interface LocationStepTwo {
  configurationDetails: ConfigurationDetails;
  otherDetails: {
    cinNumber: 'string';
    corporateAddress: 'string';
    marketCode: 'string';
    regdOffice: 'string';
  };
}

export interface LoyalityStepOne {
  gvPayment: {
    enableCNCancellationForGVPayment: true;
    enableCNTarnsferForGVpayment: true;
  };
  loyality: {
    isBankingMandatory: true;
    isSynchronised: true;
  };
  personalDetails: {
    enableGEPSale: true;
    gepPureGoldPurity: 'string';
    gepPurePlatinumPurity: 'string';
    gepPureSilverPurity: 'string';
    gepStandardDeductionGold: 'string';
    gepStandardDeductionPlatinum: 'string';
    gepStandardDeductionSilver: 'string';
  };
}

export interface LoyalityStepThree {
  tep: {
    enableRTGSrefund: true;
    noOfDaysForFVTPassword: 0;
  };
}

export interface LoyalityStepTwo {
  ccPayment: {
    enableUniPay: true;
  };
  employeeDiscount: {
    enableEmployeeDiscount: true;
  };
  giftCardConfiguration: {
    giftCardConfigurationCheckBoxes: {
      isCardActivationAllowed: true;
      isCardCancellationAllowed: true;
      // isCardInwardingAllowed: true;
      isCardReedemAlowed: true;
    };
    maximumAmount: 0;
    minimumAmount: 0;
    multiplesValue: 0;
  };
}

export interface LocationSettingsPrintStepOne {
  checkItOut1: {
    printMakingCharges: true;
    printPrice: true;
    printStoneValue: true;
    printWastageCharge: true;
    printWastageComponent: true;
    printWastagePercent: true;
  };
  checkItOut2: {
    freeTextForGrams: 'string';
    noOfInvoicecopiesforRegularOrQuickCM: 0;
    printCashMemo: true;
    printCustomerNumberinReport: true;
    printGoldValue: true;
    printGuaranteeCard: true;
    printImage: true;
    printOtherStoneWeightinAnnexure: true;
    printOtherStoneWtinGuaranteeCard: true;
  };
  makingWastageCharge: 0;
}

export interface LocationSettingsConfigDetails {
  advanceStepOne: AdvanceStepOne;
  advanceStepThree: AdvanceStepThree;
  advanceStepTwo: AdvanceStepTwo;
  ghsStepOne: GhsStepOne;
  ghsStepTwo: GhsStepTwo;
  grnIBTInventoryStepOne: GrnIBTInventoryStepOne;
  grnIBTInventoryStepTwo: GrnIBTInventoryStepTwo;
  locationStepOne: LocationStepOne;
  locationStepThree: LocationStepThree;
  locationStepTwo: LocationStepTwo;
  loyalityStepOne: LoyalityStepOne;
  loyalityStepThree: LoyalityStepThree;
  loyalityStepTwo: LoyalityStepTwo;
  printStepOne: LocationSettingsPrintStepOne;
}

export interface FactoryDetailsSettings {
  address: 'string';
  brandCode: 'string';
  companyName: 'string';
  contactNo: 'string';
  description: 'string';
  isActive: true;
  locationCode: 'string';
  locationTypeCode: 'string';
  marketCode: 'string';
  phoneNo: 'string';
  regionCode: 'string';
  stateId: 0;
  townId: 0;
}

export interface LocationSettings {
  address: 'string';
  baseCurrency: 'string';
  brandCode: 'string';
  cfaCodeValue: 'string';
  cfaDetails: LocationSettingsCfaDetails;
  companyName: 'string';
  configDetails: LocationSettingsConfigDetails;
  contactNo: 'string';
  countryCode: 'string';
  description: 'string';
  factoryCodeValue: 'string';
  factoryDetails: FactoryDetailsSettings;
  fax: 'string';
  isActive: true;
  locationCode: 'string';
  locationEmail: 'string';
  locationFormat: 'string';
  locationTypeCode: 'string';
  marketCode: 'string';
  masterCurrency: 'string';
  ownerTypeCode: 'string';
  paymentCurrencies: 'string';
  phoneNo: 'string';
  pincode: 0;
  regionCode: 'string';
  registrationNo: 'string';
  stateId: 0;
  stockCurrency: 'string';
  subBrandCode: 'string';
  subRegionCode: 'string';
  townId: 0;
}
