import {
  LocationSetup,
  LocationListing,
  CurrencyTypes,
  AdvanceStepTwo,
  GhsStepOne,
  PrintStepOne,
  GrnIBTInventoryStepOne,
  Loyality,
  LocationListResult,
  Rtgs,
  ConfigDetailsLoc,
  AdvanceStepOne,
  AdvanceCustomOrderConfiguration,
  AdvanceCustomOrderTabTwoFoccheckBoxes,
  Foc,
  LocationPriceMapping,
  AdvanceCustomOrderStepOneCheckBox,
  AdvanceCustomOrderTabTwoRtgscheckBoxes,
  OtpConfigurations,
  AdvanceStepThree,
  ConfigurePaymentMode,
  ConfigurePaymentModeConfigurePaymentModeCheckBoxes,
  ConfigurePaymentModeCheckBoxesConfigurePaymentModeCheckBoxes,
  AdvanceCustomOrderTabThreecheckBoxes,
  DayDetails,
  GhsStepTwo,
  GhsIbtCheckBox,
  LocationCFAType
} from '@poss-web/shared/models';

export class LocationAdpator {
  static getLocationTypes(data: any): { id: string; name: string }[] {
    const locationType: { id: string; name: string }[] = [];
    for (const locationdata of data.values) {
      if (locationdata.isActive) {
        locationType.push({
          id: locationdata.code,
          name: locationdata.value
        });
      }
    }

    return locationType;
  }

  static getLocationStates(
    data: any
  ): { id: string; name: string; countryCode: number }[] {
    const stateType: { id: string; name: string; countryCode: number }[] = [];
    for (const locationdata of data.results) {
      stateType.push({
        id: locationdata.stateId,
        name: locationdata.description,
        countryCode: locationdata.countryCode
      });
    }

    return stateType;
  }

  static getLocationCFAList(data: any): LocationCFAType[] {
    const cfaList: LocationCFAType[] = [];
    for (const locationdata of data.results) {
      let name = '';
      if (locationdata.description) {
        name = locationdata.locationCode + ' - ' + locationdata.description;
      } else {
        name = locationdata.locationCode;
      }
      cfaList.push({
        id: locationdata.locationCode,
        name
        // locationFormat: locationdata.locationFormat
      });
    }
    return cfaList;
  }

  static getLocationTowns(data: any): { id: string; name: string }[] {
    const townType: { id: string; name: string; state_id: string }[] = [];
    for (const locationdata of data.results) {
      townType.push({
        id: locationdata.townId,
        name: locationdata.description,
        state_id: locationdata.stateId
      });
    }
    return townType;
  }

  static getBaseCurrency(data: any): { id: string; name: string }[] {
    const baseCurrencyType: { id: string; name: string }[] = [];
    for (const baseCurrency of data.results) {
      baseCurrencyType.push({
        id: baseCurrency.countryCode,
        name: baseCurrency.currencyCode
      });
    }
    return baseCurrencyType;
  }

  static getCurrency(data: any): CurrencyTypes[] {
    const currencyType: { id: string; name: string }[] = [];
    for (const currency of data.results) {
      currencyType.push({
        id: currency.currencyCode,
        name: currency.currencySymbol
      });
    }
    return currencyType;
  }

  static getLocationFormat(data: any): { id: string; name: string }[] {
    const ownerType: { id: string; name: string }[] = [];

    for (const locationdata of data) {
      if (locationdata.isActive) {
        ownerType.push({
          id: locationdata.code,
          name: locationdata.value
        });
      }
    }
    return ownerType;
  }

  static getLocationRegions(
    data: any
  ): { id: string; name: string; regionCode_id: string }[] {
    const regions: { id: string; name: string; regionCode_id: string }[] = [];
    for (const locationdata of data.results) {
      regions.push({
        id: locationdata.regionCode,
        name: locationdata.description,
        regionCode_id: locationdata.parentRegionCode
      });
    }
    return regions;
  }

  static getBrands(
    data: any
  ): { id: string; name: string; brandName_id: string }[] {
    const barnds: { id: string; name: string; brandName_id: string }[] = [];

    for (const locationdata of data.results) {
      barnds.push({
        id: locationdata.brandCode,
        name: locationdata.description,
        brandName_id: locationdata.parentBrandCode
      });
    }
    return barnds;
  }

  static getMarketList(data: any): { id: string; name: string }[] {
    const markts: { id: string; name: string }[] = [];

    for (const mrkt of data.results) {
      markts.push({
        id: mrkt.marketCode,
        name: mrkt.marketCode + ' - ' + mrkt.description
      });
    }
    return markts;
  }

  static getCountry(data: any): { id: string; name: string }[] {
    const countryType: { id: string; name: string }[] = [];
    for (const countryData of data.results) {
      countryType.push({
        id: countryData.countryCode,
        name: countryData.description
      });
    }
    return countryType;
  }

  static getOnlyAdvanceCustom(data: any): AdvanceStepTwo {
    if (data) {
      const advanceCustomOrderData = data.configDetails
        ? data.configDetails
        : {};
      const advanceStepTwoFoc = advanceCustomOrderData.advanceStepTwo
        ? advanceCustomOrderData.advanceStepTwo.foc
          ? advanceCustomOrderData.advanceStepTwo.foc
          : {}
        : {};

      const advanceStepTwoRtgs = advanceCustomOrderData.advanceStepTwo
        ? advanceCustomOrderData.advanceStepTwo.rtgs
          ? advanceCustomOrderData.advanceStepTwo.rtgs
          : {}
        : {};

      const advanceStepThreeotpConfigurations = advanceCustomOrderData.advanceStepThree
        ? advanceCustomOrderData.advanceStepThree.otpConfigurations
          ? advanceCustomOrderData.advanceStepThree.otpConfigurations
          : {}
        : {};

      const configurePaymentModeCheckBoxes = advanceCustomOrderData.advanceStepThree
        ? advanceCustomOrderData.advanceStepThree.configurePaymentMode
          ? advanceCustomOrderData.advanceStepThree.configurePaymentMode
          : {}
        : {};
      const advanceStepOneAdvanceCustomOrderConfiguration = advanceCustomOrderData.advanceStepOne
        ? advanceCustomOrderData.advanceStepOne.advanceCustomOrderConfiguration
          ? advanceCustomOrderData.advanceStepOne
              .advanceCustomOrderConfiguration
          : {}
        : {};

      let advanceCustomOrder = null;
      advanceCustomOrder = {
        configurePaymentModeCheckBoxes: configurePaymentModeCheckBoxes,
        paymentCode: advanceCustomOrderData.advanceStepThree
          ? advanceCustomOrderData.advanceStepThree.configurePaymentMode
            ? advanceCustomOrderData.advanceStepThree.configurePaymentMode
                .paymentCode
            : null
          : null,
        priceGroupTypeCode: advanceCustomOrderData.advanceStepThree
          ? advanceCustomOrderData.advanceStepThree.locationPriceMapping
            ? advanceCustomOrderData.advanceStepThree.locationPriceMapping
                .priceGroupTypeCode
            : null
          : null,
        priceGroupCode: advanceCustomOrderData.advanceStepThree
          ? advanceCustomOrderData.advanceStepThree.locationPriceMapping
            ? advanceCustomOrderData.advanceStepThree.locationPriceMapping
                .priceGroupCode
            : null
          : null,
        advanceCustomOrderTabTwoFoccheckBoxes: advanceStepTwoFoc.advanceCustomOrderTabTwoFoccheckBoxes
          ? advanceStepTwoFoc.advanceCustomOrderTabTwoFoccheckBoxes
          : {},

        advanceCustomOrderTabTwoRtgscheckBoxes: advanceStepTwoRtgs.advanceCustomOrderTabTwoRtgscheckBoxes
          ? advanceStepTwoRtgs.advanceCustomOrderTabTwoRtgscheckBoxes
          : {},

        maxWeightforFOC: advanceStepTwoFoc.maxWeightforFOC
          ? advanceStepTwoFoc.maxWeightforFOC
          : '',
        maxValueforFOC: advanceStepTwoFoc.maxValueforFOC
          ? advanceStepTwoFoc.maxValueforFOC
          : '',
        GEPPureGoldPurity: advanceStepTwoRtgs.GEPPureGoldPurity
          ? advanceStepTwoRtgs.GEPPureGoldPurity
          : '',
        maximumamount: advanceStepTwoRtgs.maximumamount
          ? advanceStepTwoRtgs.maximumamount
          : '',
        minimunamount: advanceStepTwoRtgs.minimunamount
          ? advanceStepTwoRtgs.minimunamount
          : '',
        minOTPCNValue: advanceStepTwoRtgs.minOTPCNValue
          ? advanceStepTwoRtgs.minOTPCNValue
          : '',
        OTPHelpdeskEmailId: advanceStepTwoRtgs.otpHelpdeskEmailId
          ? advanceStepTwoRtgs.otpHelpdeskEmailId
          : '',
        maxNoofCN: advanceStepTwoRtgs.maxNoofCN
          ? advanceStepTwoRtgs.maxNoofCN
          : '',
        maxNoofdaysforPOLikelyDate: advanceStepTwoRtgs.maxNoofdaysforPOLikelyDate
          ? advanceStepTwoRtgs.maxNoofdaysforPOLikelyDate
          : '',
        serviceTaxGSTRegistrationno: advanceStepTwoRtgs.serviceTaxGSTRegistrationno
          ? advanceStepTwoRtgs.serviceTaxGSTRegistrationno
          : '',
        advanceStepThreeotpConfigurations: advanceStepThreeotpConfigurations,
        advanceCustomOrderStepOneCheckBox: advanceStepOneAdvanceCustomOrderConfiguration.advanceCustomOrderStepOneCheckBox
          ? advanceStepOneAdvanceCustomOrderConfiguration.advanceCustomOrderStepOneCheckBox
          : '',
        validityDaysforAutoClosureInAdvanceBooking: advanceStepOneAdvanceCustomOrderConfiguration.validityDaysforAutoClosureInAdvanceBooking
          ? advanceStepOneAdvanceCustomOrderConfiguration.validityDaysforAutoClosureInAdvanceBooking
          : '',
        validityDaysforActivateInAdvanceBooking: advanceStepOneAdvanceCustomOrderConfiguration.validityDaysforActivateInAdvanceBooking
          ? advanceStepOneAdvanceCustomOrderConfiguration.validityDaysforActivateInAdvanceBooking
          : '',
        validityDaysforReleaseInvInAdvancebooking: advanceStepOneAdvanceCustomOrderConfiguration.validityDaysforReleaseInvInAdvancebooking
          ? advanceStepOneAdvanceCustomOrderConfiguration.validityDaysforReleaseInvInAdvancebooking
          : '',
        validityDaysforAutoClosureInCustomerOrder: advanceStepOneAdvanceCustomOrderConfiguration.validityDaysforAutoClosureInCustomerOrder
          ? advanceStepOneAdvanceCustomOrderConfiguration.validityDaysforAutoClosureInCustomerOrder
          : '',
        validityDaysforActivateInCustomerOrder: advanceStepOneAdvanceCustomOrderConfiguration.validityDaysforActivateInCustomerOrder
          ? advanceStepOneAdvanceCustomOrderConfiguration.validityDaysforActivateInCustomerOrder
          : '',
        validitydaysforReleaseInvInCustomerOrder: advanceStepOneAdvanceCustomOrderConfiguration.validitydaysforReleaseInvInCustomerOrder
          ? advanceStepOneAdvanceCustomOrderConfiguration.validitydaysforReleaseInvInCustomerOrder
          : '',
        goldRateAttempts: advanceStepOneAdvanceCustomOrderConfiguration.goldRateAttempts
          ? advanceStepOneAdvanceCustomOrderConfiguration.goldRateAttempts
          : '',
        manualBillWeightDeviation: advanceStepOneAdvanceCustomOrderConfiguration.manualBillWeightDeviation
          ? advanceStepOneAdvanceCustomOrderConfiguration.manualBillWeightDeviation
          : '',
        sparewtToleranceforStockItem: advanceStepOneAdvanceCustomOrderConfiguration.sparewtToleranceforStockItem
          ? advanceStepOneAdvanceCustomOrderConfiguration.sparewtToleranceforStockItem
          : '',
        servicewtToleranceforStockItem: advanceStepOneAdvanceCustomOrderConfiguration.servicewtToleranceforStockItem
          ? advanceStepOneAdvanceCustomOrderConfiguration.servicewtToleranceforStockItem
          : ''
      };

      // console.log(advanceCustomOrder)
      return advanceCustomOrder;
      // }
    }
  }
  static getAllLocationDetailsByloactionCode(data: any): LocationSetup {
    let locationBylocationCode: LocationSetup;
    let configDetailsResponse: ConfigDetailsLoc;
    let advanceStepOneResponse: AdvanceStepOne;
    let AdvanceCustomOrderConfigurationResponse: AdvanceCustomOrderConfiguration;
    let AdvanceCustomOrderStepOneCheckBoxResponse: AdvanceCustomOrderStepOneCheckBox;
    let advanceStepTwoResponse: AdvanceStepTwo;
    let advanceStepThreeResponse: AdvanceStepThree;
    let configurePaymentModeResponse: ConfigurePaymentMode;
    let configurePaymentModeConfigurePaymentModeCheckBoxesResponse: ConfigurePaymentModeConfigurePaymentModeCheckBoxes;
    let configurePaymentModeCheckBoxesConfigurePaymentModeCheckBoxesResponse: ConfigurePaymentModeCheckBoxesConfigurePaymentModeCheckBoxes;
    let locationPriceMappingResponse: LocationPriceMapping;
    let otpConfigurationsResponse: OtpConfigurations;
    let advanceCustomOrderTabThreecheckBoxesResponse: AdvanceCustomOrderTabThreecheckBoxes;
    let ghsStepOneResponse: GhsStepOne;
    let dayDetailsResponse: DayDetails;
    let ghsStepTwoResponse: GhsStepTwo;
    let ghsIbtCheckBoxResponse: GhsIbtCheckBox;

    if (data) {
      AdvanceCustomOrderStepOneCheckBoxResponse = {
        activateAllowedforAdvanceBooking: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration
                  .AdvanceCustomOrderStepOneCheckBox
                ? data.configDetails.advanceStepOne
                    .advanceCustomOrderConfiguration
                    .AdvanceCustomOrderStepOneCheckBox
                  ? data.configDetails.advanceStepOne
                      .advanceCustomOrderConfiguration
                      .activateAllowedforAdvanceBooking
                  : ''
                : ''
              : ''
            : ''
          : '',
        activateAllowedforCustomerOrder: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration
                  .AdvanceCustomOrderStepOneCheckBox
                ? data.configDetails.advanceStepOne
                    .advanceCustomOrderConfiguration
                    .AdvanceCustomOrderStepOneCheckBox
                  ? data.configDetails.advanceStepOne
                      .advanceCustomOrderConfiguration
                      .activateAllowedforCustomerOrder
                  : false
                : false
              : false
            : false
          : false,
        cancellationAllowedforAdvanceBooking: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration
                  .AdvanceCustomOrderStepOneCheckBox
                ? data.configDetails.advanceStepOne
                    .advanceCustomOrderConfiguration
                    .AdvanceCustomOrderStepOneCheckBox
                  ? data.configDetails.advanceStepOne
                      .advanceCustomOrderConfiguration
                      .cancellationAllowedforAdvanceBooking
                  : false
                : false
              : false
            : false
          : false,
        cancellationAllowedforCustomerOrder: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration
                  .AdvanceCustomOrderStepOneCheckBox
                ? data.configDetails.advanceStepOne
                    .advanceCustomOrderConfiguration
                    .AdvanceCustomOrderStepOneCheckBox
                  ? data.configDetails.advanceStepOne
                      .advanceCustomOrderConfiguration
                      .cancellationAllowedforCustomerOrder
                  : false
                : false
              : false
            : false
          : false,
        printMandatoryFieldsInReport: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration
                  .AdvanceCustomOrderStepOneCheckBox
                ? data.configDetails.advanceStepOne
                    .advanceCustomOrderConfiguration
                    .AdvanceCustomOrderStepOneCheckBox
                  ? data.configDetails.advanceStepOne
                      .advanceCustomOrderConfiguration
                      .printMandatoryFieldsInReport
                  : false
                : false
              : false
            : false
          : false
      };

      AdvanceCustomOrderConfigurationResponse = {
        advanceCustomOrderStepOneCheckBox: AdvanceCustomOrderStepOneCheckBoxResponse,
        goldRateAttempts: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration.goldRateAttempts
              : ''
            : ''
          : '',
        manualBillWeightDeviation: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration.manualBillWeightDeviation
              : 0
            : 0
          : 0,
        servicewtToleranceforStockItem: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration
                  .servicewtToleranceforStockItem
              : 0
            : 0
          : 0,
        sparewtToleranceforStockItem: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration.sparewtToleranceforStockItem
              : 0
            : 0
          : 0,
        validityDaysforActivateInAdvanceBooking: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration
                  .validityDaysforActivateInAdvanceBooking
              : 0
            : 0
          : 0,
        validityDaysforActivateInCustomerOrder: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration
                  .validityDaysforActivateInCustomerOrder
              : 0
            : 0
          : 0,
        validityDaysforAutoClosureInAdvanceBooking: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration
                  .validityDaysforAutoClosureInAdvanceBooking
              : 0
            : 0
          : 0,
        validityDaysforAutoClosureInCustomerOrder: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration
                  .validityDaysforAutoClosureInCustomerOrder
              : 0
            : 0
          : 0,
        validityDaysforReleaseInvInAdvancebooking: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration
                  .validityDaysforReleaseInvInAdvancebooking
              : 0
            : 0
          : 0,
        validitydaysforReleaseInvInCustomerOrder: data.configDetails
          ? data.configDetails.AdvanceStepOne
            ? data.configDetails.advanceStepOne.advanceCustomOrderConfiguration
              ? data.configDetails.advanceStepOne
                  .advanceCustomOrderConfiguration
                  .validitydaysforReleaseInvInCustomerOrder
              : 0
            : 0
          : 0
      };

      advanceStepOneResponse = {
        advanceCustomOrderConfiguration: AdvanceCustomOrderConfigurationResponse
      };

      const AdvanceCustomOrderTabTwoFoccheckBoxesResponse: AdvanceCustomOrderTabTwoFoccheckBoxes = {
        bintobintransferallowedforFOCitems: data.configDetails
          ? data.configDetails.advanceStepTwo
            ? data.configDetails.advanceStepTwo.foc
              ? data.configDetails.advanceStepTwo.foc
                  .advanceCustomOrderTabTwoFoccheckBoxes
                ? data.configDetails.advanceStepTwo.foc
                    .advanceCustomOrderTabTwoFoccheckBoxes
                    .bintobintransferallowedforFOCitems
                : 0
              : 0
            : 0
          : 0,
        isFOCitemssaleable: data.configDetails
          ? data.configDetails.advanceStepTwo
            ? data.configDetails.advanceStepTwo.foc
              ? data.configDetails.advanceStepTwo.foc
                  .advanceCustomOrderTabTwoFoccheckBoxes
                ? data.configDetails.advanceStepTwo.foc
                    .advanceCustomOrderTabTwoFoccheckBoxes.isFOCitemssaleable
                : 0
              : 0
            : 0
          : 0,
        isTEPallowedforFOCitems: data.configDetails
          ? data.configDetails.advanceStepTwo
            ? data.configDetails.advanceStepTwo.foc
              ? data.configDetails.advanceStepTwo.foc
                  .advanceCustomOrderTabTwoFoccheckBoxes
                ? data.configDetails.advanceStepTwo.foc
                    .advanceCustomOrderTabTwoFoccheckBoxes
                    .isTEPallowedforFOCitems
                : 0
              : 0
            : 0
          : 0,
        isTEPsaleableitemsallowedforFOC: data.configDetails
          ? data.configDetails.advanceStepTwo
            ? data.configDetails.advanceStepTwo.foc
              ? data.configDetails.advanceStepTwo.foc
                  .advanceCustomOrderTabTwoFoccheckBoxes
                ? data.configDetails.advanceStepTwo.foc
                    .advanceCustomOrderTabTwoFoccheckBoxes
                    .isTEPsaleableitemsallowedforFOC
                : 0
              : 0
            : 0
          : 0
      };

      const focResponse: Foc = {
        advanceCustomOrderTabTwoFoccheckBoxes: AdvanceCustomOrderTabTwoFoccheckBoxesResponse,
        maxValueforFOC: data.configDetails
          ? data.configDetails.advanceStepTwo
            ? data.configDetails.advanceStepTwo.foc
              ? data.configDetails.advanceStepTwo.foc.maxValueforFOC
              : 0
            : 0
          : 0,
        maxWeightforFOC: data.configDetails
          ? data.configDetails.advanceStepTwo
            ? data.configDetails.advanceStepTwo.foc
              ? data.configDetails.advanceStepTwo.foc.maxWeightforFOC
              : 0
            : 0
          : 0
      };

      const AdvanceCustomOrderTabTwoRtgscheckBoxesResponse: AdvanceCustomOrderTabTwoRtgscheckBoxes = {
        enableRTGSPayment: data.configDetails
          ? data.configDetails.advanceStepTwo
            ? data.configDetails.advanceStepTwo.rtgs
              ? data.configDetails.advanceStepTwo.rtgs
                  .advanceCustomOrderTabTwoRtgscheckBoxes
                ? data.configDetails.advanceStepTwo.rtgs
                    .advanceCustomOrderTabTwoRtgscheckBoxes.enableRTGSPayment
                : false
              : false
            : false
          : false
      };

      const rtgsResponse: Rtgs = {
        advanceCustomOrderTabTwoRtgscheckBoxes: AdvanceCustomOrderTabTwoRtgscheckBoxesResponse,
        maxNoofCN: data.configDetails
          ? data.configDetails.advanceStepTwo
            ? data.configDetails.advanceStepTwo.rtgs
              ? data.configDetails.advanceStepTwo.rtgs.maxNoofCN
              : ''
            : ''
          : '',
        maxNoofdaysforPOLikelyDate: data.configDetails
          ? data.configDetails.advanceStepTwo
            ? data.configDetails.advanceStepTwo.rtgs
              ? data.configDetails.advanceStepTwo.rtgs
                  .maxNoofdaysforPOLikelyDate
              : ''
            : ''
          : '',
        minOTPCNValue: data.configDetails
          ? data.configDetails.advanceStepTwo
            ? data.configDetails.advanceStepTwo.rtgs
              ? data.configDetails.advanceStepTwo.rtgs.minOTPCNValue
              : ''
            : ''
          : '',
        otpHelpdeskEmailId: data.configDetails
          ? data.configDetails.advanceStepTwo
            ? data.configDetails.advanceStepTwo.rtgs
              ? data.configDetails.advanceStepTwo.rtgs.otpHelpdeskEmailId
              : ''
            : ''
          : '',
        serviceTaxGSTRegistrationno: data.configDetails
          ? data.configDetails.advanceStepTwo
            ? data.configDetails.advanceStepTwo.rtgs
              ? data.configDetails.advanceStepTwo.rtgs
                  .serviceTaxGSTRegistrationno
              : ''
            : ''
          : ''
      };

      advanceStepTwoResponse = {
        foc: focResponse,
        rtgs: rtgsResponse
      };

      configurePaymentModeCheckBoxesConfigurePaymentModeCheckBoxesResponse = {
        isApplicableforLocation: data.configDetails
          ? data.configDetails.AdvanceStepThree
            ? data.configDetails.AdvanceStepThree.configurePaymentMode
              ? data.configDetails.AdvanceStepThree.configurePaymentMode
                  .configurePaymentModeCheckBoxes
                ? data.configDetails.AdvanceStepThree.configurePaymentMode
                    .configurePaymentModeCheckBoxes
                    .configurePaymentModeCheckBoxes
                  ? data.configDetails.AdvanceStepThree.configurePaymentMode
                      .configurePaymentModeCheckBoxes
                      .configurePaymentModeCheckBoxes.isApplicableforLocation
                  : ''
                : ''
              : ''
            : ''
          : '',
        isApplicableforReversal: data.configDetails
          ? data.configDetails.AdvanceStepThree
            ? data.configDetails.AdvanceStepThree.configurePaymentMode
              ? data.configDetails.AdvanceStepThree.configurePaymentMode
                  .configurePaymentModeCheckBoxes
                ? data.configDetails.AdvanceStepThree.configurePaymentMode
                    .configurePaymentModeCheckBoxes
                    .configurePaymentModeCheckBoxes
                  ? data.configDetails.AdvanceStepThree.configurePaymentMode
                      .configurePaymentModeCheckBoxes
                      .configurePaymentModeCheckBoxes.isApplicableforReversal
                  : ''
                : ''
              : ''
            : ''
          : ''
      };

      configurePaymentModeConfigurePaymentModeCheckBoxesResponse = {
        configurePaymentModeCheckBoxes: configurePaymentModeCheckBoxesConfigurePaymentModeCheckBoxesResponse
      };

      configurePaymentModeResponse = {
        configurePaymentModeCheckBoxes: configurePaymentModeConfigurePaymentModeCheckBoxesResponse,
        paymentCode: data.configDetails
          ? data.configDetails.advanceStepThree
            ? data.configDetails.advanceStepThree.configurePaymentMode
              ? data.configDetails.advanceStepThree.configurePaymentMode
                  .paymentCode
              : ''
            : ''
          : ''
      };

      locationPriceMappingResponse = {
        priceGroupCode: data.configDetails
          ? data.configDetails.advanceStepThree
            ? data.configDetails.advanceStepThree.locationPriceMapping
              ? data.configDetails.advanceStepThree.locationPriceMapping
                  .priceGroupCode
              : ''
            : ''
          : '',
        priceGroupTypeCode: data.configDetails
          ? data.configDetails.advanceStepThree
            ? data.configDetails.advanceStepThree.locationPriceMapping
              ? data.configDetails.advanceStepThree.locationPriceMapping
                  .priceGroupTypeCode
              : ''
            : ''
          : ''
      };

      advanceCustomOrderTabThreecheckBoxesResponse = {
        isOTPallowedAB: data.configDetails
          ? data.configDetails.advanceStepThree
            ? data.configDetails.advanceStepThree.otpConfigurations
              ? data.configDetails.advanceStepThree.otpConfigurations
                  .advanceCustomOrderTabThreecheckBoxes
                ? data.configDetails.advanceStepThree.otpConfigurations
                    .advanceCustomOrderTabThreecheckBoxes.isOTPallowedAB
                : ''
              : ''
            : ''
          : '',
        isOTPallowedASSM: data.configDetails
          ? data.configDetails.advanceStepThree
            ? data.configDetails.advanceStepThree.otpConfigurations
              ? data.configDetails.advanceStepThree.otpConfigurations
                  .advanceCustomOrderTabThreecheckBoxes
                ? data.configDetails.advanceStepThree.otpConfigurations
                    .advanceCustomOrderTabThreecheckBoxes.isOTPallowedASSM
                : ''
              : ''
            : ''
          : '',
        isOTPallowedAdvance: data.configDetails
          ? data.configDetails.advanceStepThree
            ? data.configDetails.advanceStepThree.otpConfigurations
              ? data.configDetails.advanceStepThree.otpConfigurations
                  .advanceCustomOrderTabThreecheckBoxes
                ? data.configDetails.advanceStepThree.otpConfigurations
                    .advanceCustomOrderTabThreecheckBoxes.isOTPallowedAdvance
                : ''
              : ''
            : ''
          : '',
        isOTPallowedCM: data.configDetails
          ? data.configDetails.advanceStepThree
            ? data.configDetails.advanceStepThree.otpConfigurations
              ? data.configDetails.advanceStepThree.otpConfigurations
                  .advanceCustomOrderTabThreecheckBoxes
                ? data.configDetails.advanceStepThree.otpConfigurations
                    .advanceCustomOrderTabThreecheckBoxes.isOTPallowedCM
                : ''
              : ''
            : ''
          : '',
        isOTPallowedCO: data.configDetails
          ? data.configDetails.advanceStepThree
            ? data.configDetails.advanceStepThree.otpConfigurations
              ? data.configDetails.advanceStepThree.otpConfigurations
                  .advanceCustomOrderTabThreecheckBoxes
                ? data.configDetails.advanceStepThree.otpConfigurations
                    .advanceCustomOrderTabThreecheckBoxes.isOTPallowedCO
                : ''
              : ''
            : ''
          : '',
        isOTPallowedGHS: data.configDetails
          ? data.configDetails.advanceStepThree
            ? data.configDetails.advanceStepThree.otpConfigurations
              ? data.configDetails.advanceStepThree.otpConfigurations
                  .advanceCustomOrderTabThreecheckBoxes
                ? data.configDetails.advanceStepThree.otpConfigurations
                    .advanceCustomOrderTabThreecheckBoxes.isOTPallowedGHS
                : ''
              : ''
            : ''
          : '',
        isOTPrequiredforGC: data.configDetails
          ? data.configDetails.advanceStepThree
            ? data.configDetails.advanceStepThree.otpConfigurations
              ? data.configDetails.advanceStepThree.otpConfigurations
                  .advanceCustomOrderTabThreecheckBoxes
                ? data.configDetails.advanceStepThree.otpConfigurations
                    .advanceCustomOrderTabThreecheckBoxes.isOTPrequiredforGC
                : ''
              : ''
            : ''
          : ''
      };

      otpConfigurationsResponse = {
        advanceCustomOrderTabThreecheckBoxes: advanceCustomOrderTabThreecheckBoxesResponse
      };

      advanceStepThreeResponse = {
        configurePaymentMode: configurePaymentModeResponse,
        locationPriceMapping: locationPriceMappingResponse,
        otpConfigurations: otpConfigurationsResponse
      };

      dayDetailsResponse = {
        activatedCNs: data.configDetails
          ? data.configDetails.ghsStepOne
            ? data.configDetails.ghsStepOne.dayDetails
              ? data.configDetails.ghsStepOne.dayDetails.activatedCNs
              : 0
            : 0
          : 0,
        baseCurrency: data.configDetails
          ? data.configDetails.ghsStepOne
            ? data.configDetails.ghsStepOne.dayDetails
              ? data.configDetails.ghsStepOne.dayDetails.baseCurrency
              : ''
            : ''
          : '',
        consolidateAttempts: data.configDetails
          ? data.configDetails.ghsStepOne
            ? data.configDetails.ghsStepOne.dayDetails
              ? data.configDetails.ghsStepOne.dayDetails.consolidateAttempts
              : 0
            : 0
          : 0,
        ddValidityDays: data.configDetails
          ? data.configDetails.ghsStepOne
            ? data.configDetails.ghsStepOne.dayDetails
              ? data.configDetails.ghsStepOne.dayDetails.ddValidityDays
              : 0
            : 0
          : 0,
        realisationDays: data.configDetails
          ? data.configDetails.ghsStepOne
            ? data.configDetails.ghsStepOne.dayDetails
              ? data.configDetails.ghsStepOne.dayDetails.realisationDays
              : 0
            : 0
          : 0,
        suspendingCNs: data.configDetails
          ? data.configDetails.ghsStepOne
            ? data.configDetails.ghsStepOne.dayDetails
              ? data.configDetails.ghsStepOne.dayDetails.suspendingCNs
              : 0
            : 0
          : 0,
        transferredCNs: data.configDetails
          ? data.configDetails.ghsStepOne
            ? data.configDetails.ghsStepOne.dayDetails
              ? data.configDetails.ghsStepOne.dayDetails.transferredCNs
              : 0
            : 0
          : 0,
        validityDays: data.configDetails
          ? data.configDetails.ghsStepOne
            ? data.configDetails.ghsStepOne.dayDetails
              ? data.configDetails.ghsStepOne.dayDetails.validityDays
              : 0
            : 0
          : 0
      };

      ghsStepOneResponse = {
        dayDetails: dayDetailsResponse
      };

      ghsIbtCheckBoxResponse = {
        eghsredemption: data.configDetails
          ? data.configDetails.ghsStepTwo
            ? data.configDetails.ghsStepTwo.ghsIbtCheckBox
              ? data.configDetails.ghsStepTwo.ghsIbtCheckBox.eghsredemption
              : null
            : null
          : null,
        eghsrevenue: data.configDetails
          ? data.configDetails.ghsStepTwo
            ? data.configDetails.ghsStepTwo.ghsIbtCheckBox
              ? data.configDetails.ghsStepTwo.ghsIbtCheckBox.eghsrevenue
              : null
            : null
          : null,
        isClubbingGHSMandatory: data.configDetails
          ? data.configDetails.ghsStepTwo
            ? data.configDetails.ghsStepTwo.ghsIbtCheckBox
              ? data.configDetails.ghsStepTwo.ghsIbtCheckBox
                  .isClubbingGHSMandatory
              : null
            : null
          : null,
        isConsentLetterUploadMandatory: data.configDetails
          ? data.configDetails.ghsStepTwo
            ? data.configDetails.ghsStepTwo.ghsIbtCheckBox
              ? data.configDetails.ghsStepTwo.ghsIbtCheckBox
                  .isConsentLetterUploadMandatory
              : null
            : null
          : null
      };

      ghsStepTwoResponse = {
        ghsIbtCheckBox: ghsIbtCheckBoxResponse
      };

      configDetailsResponse = {
        advanceStepOne: advanceStepOneResponse,
        advanceStepTwo: advanceStepTwoResponse,
        advanceStepThree: advanceStepThreeResponse,
        ghsStepOne: ghsStepOneResponse,
        ghsStepTwo: ghsStepTwoResponse,
        grnIBTInventoryStepOne: data.configDetails.grnIBTInventoryStepOne,
        grnIBTInventoryStepTwo: data.configDetails.grnIBTInventoryStepTwo,
        locationStepOne: data.configDetails.locationStepOne,
        locationStepTwo: data.configDetails.locationStepTwo,
        locationStepThree: data.configDetails.locationStepThree,
        loyalityStepOne: data.configDetails.loyalityStepOne,
        loyalityStepTwo: data.configDetails.loyalityStepTwo,
        loyalityStepThree: data.configDetails.loyalityStepThree,
        printStepOne: data.configDetails.printStepOne
      };

      locationBylocationCode = {
        locationCode: data.locationCode ? data.locationCode : '',
        companyName: data.companyName ? data.companyName : '',
        description: data.description ? data.description : '',
        address: data.address ? data.address : '',
        pincode: data.pincode ? data.pincode : '',
        phoneNo: data.phoneNo ? data.phoneNo : '',
        contactNo: data.contactNo ? data.contactNo : '',
        fax: data.fax ? data.fax : '',
        locationEmail: data.locationEmail ? data.locationEmail : '',
        locationTypeCode: data.locationTypeCode ? data.locationTypeCode : '',
        registrationNo: data.registrationNo ? data.registrationNo : '',
        cfaCodeValue: data.cfaCodeValue ? data.cfaCodeValue : '',
        countryCode: data.countryCode ? data.countryCode : '',
        townId: data.townId ? data.townId : '',
        stateId: data.stateId ? data.stateId : '',
        regionCode: data.regionCode ? data.regionCode : '',
        subRegionCode: data.subRegionCode ? data.subRegionCode : '',
        ownerTypeCode: data.ownerTypeCode ? data.ownerTypeCode : '',
        factoryCodeValue: data.factoryCodeValue ? data.factoryCodeValue : '',
        locationFormat: data.locationFormat ? data.locationFormat : '',
        brandCode: data.brandCode ? data.brandCode : '',
        subBrandCode: data.subBrandCode ? data.subBrandCode : '',
        isActive: data.isActive ? data.isActive : '',
        marketCode: data.marketCode ? data.marketCode : '',
        baseCurrency: data.baseCurrency ? data.baseCurrency : '',
        stockCurrency: data.stockCurrency ? data.stockCurrency : '',
        masterCurrency: data.masterCurrency ? data.masterCurrency : '',
        paymentCurrencies: data.paymentCurrencies ? data.paymentCurrencies : '',
        configDetails: configDetailsResponse
      };
    } else {
      locationBylocationCode = {
        locationCode: '',
        companyName: '',
        description: '',
        address: '',
        pincode: '',
        phoneNo: '',
        contactNo: '',
        fax: '',
        locationEmail: '',
        locationTypeCode: '',
        registrationNo: '',
        cfaCodeValue: '',
        countryCode: '',
        townId: 0,
        stateId: 0,
        regionCode: '',
        subRegionCode: '',
        ownerTypeCode: '',
        factoryCodeValue: '',
        locationFormat: '',
        brandCode: '',
        subBrandCode: '',
        isActive: false,
        marketCode: '',
        baseCurrency: '',
        stockCurrency: '',
        masterCurrency: '',
        paymentCurrencies: '',
        configDetails: null,
        cfaDetails: null,
        factoryDetails: null
      };
    }

    return locationBylocationCode;
  }

  // static getsavedLocationDetails(data: any): SaveLocationDetailsPayload {

  //   this.saveLocationDetails = {
  //     cfaCodeValue: data.locationCode,
  //     address: data.address,
  //     brandCode: data.brandCode,
  //     subBrandCode: data.subBrandCode,
  //     configDetails: data.configDetails,
  //     contactNo: data.contactNo,
  //     countryCode: data.countryCode,
  //     //currencyCode: data.currencyCode,
  //     description: data.description,
  //     factoryCodeValue: data.factoryCodeValue,
  //     //fax: data.fax,
  //     isActive: data.isActive,
  //     locationCode: data.locationCode,
  //     locationEmail: data.locationEmail,
  //     locationFormat: data.locationFormat,
  //     locationTypeCode: data.locationTypeCode,
  //     ownerTypeCode: data.ownerTypeCode,
  //     phoneNo: data.phoneNo,
  //     pincode: data.pincode,
  //     regionCode: data.regionCode,
  //     subRegionCode: data.subRegionCode,
  //     registrationNo: data.registrationNo,
  //     stateCode: data.stateCode,
  //     townId: data.townCode
  //   };
  //   return this.saveLocationDetails;
  // }

  static getLocationListingDetails(data: any): LocationListing {
    const locationListResult: LocationListResult[] = [];
    for (const listItem of data.results) {
      locationListResult.push({
        address: listItem.address,
        brandCode: listItem.brandCode,
        contactNo: listItem.contactNo,
        description: listItem.description,
        isActive: listItem.isActive,
        locationCode: listItem.locationCode,
        locationTypeCode: listItem.locationTypeCode,
        phoneNo: listItem.phoneNo,
        regionCode: listItem.regionCode,
        stateId: listItem.stateId,
        townId: listItem.townId,
        companyName: listItem.companyName,
        marketCode: listItem.marketCode
      });
    }

    const locationList: LocationListing = {
      results: locationListResult,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
      totalElements: data.totalElements
    };

    return locationList;
  }

  static getSearchResult(data: any): LocationListing {
    let locationList: LocationListing;
    const locationListResult: LocationListResult[] = [];
    const listItem = data;
    locationListResult.push({
      address: listItem.address,
      brandCode: listItem.brandCode,
      contactNo: listItem.contactNo,
      description: listItem.description,
      isActive: listItem.isActive,
      locationCode: listItem.locationCode,
      locationTypeCode: listItem.locationTypeCode,
      phoneNo: listItem.phoneNo,
      regionCode: listItem.regionCode,
      stateId: listItem.stateId,
      townId: listItem.townId,
      companyName: listItem.companyName,
      marketCode: listItem.marketCode
    });
    let totalElements;
    if (data) {
      totalElements = 1;
    } else {
      totalElements = 0;
    }
    locationList = {
      results: locationListResult,
      pageNumber: 0,
      pageSize: 1,
      totalPages: 1,
      totalElements: totalElements
    };

    return locationList;
  }

  static getOnlyLocationDetails(data: any): LocationSetup {
    if (data === undefined) {
      data = null;
    }
    let locationBylocationCode = null;

    if (data) {
      locationBylocationCode = {
        locationCode: data.locationCode ? data.locationCode : '',
        companyName: data.companyName ? data.companyName : '',
        description: data.description ? data.description : '',
        address: data.address ? data.address : '',
        pincode: data.pincode ? data.pincode : '',
        phoneNo: data.phoneNo ? data.phoneNo : '',
        contactNo: data.contactNo ? data.contactNo : '',
        fax: data.fax ? data.fax : '',
        locationEmail: data.locationEmail ? data.locationEmail : '',
        locationTypeCode: data.locationTypeCode ? data.locationTypeCode : '',
        registrationNo: data.registrationNo ? data.registrationNo : '',
        countryCode: data.countryCode ? data.countryCode : '',
        townCode: data.townCode ? data.townCode : '',
        stateCode: data.stateCode ? data.stateCode : '',
        regionCode: data.regionCode ? data.regionCode : '',
        subRegionCode: data.subRegionCode ? data.subRegionCode : '',
        ownerTypeCode: data.ownerTypeCode ? data.ownerTypeCode : '',
        factoryCodeValue: data.factoryCodeValue ? data.factoryCodeValue : '',
        locationFormat: data.locationFormat ? data.locationFormat : '',
        brandCode: data.brandCode ? data.brandCode : '',
        subBrandCode: data.subBrandCode ? data.subBrandCode : '',
        configDetails: data.configDetails ? data.configDetails : {},
        currencyCode: data.currencyCode ? data.currencyCode : '',
        baseCurrency: data.baseCurrency ? data.baseCurrency : '',
        stockCurrency: data.stockCurrency ? data.stockCurrency : '',
        masterCurrency: data.masterCurrency ? data.masterCurrency : '',
        paymentCurrencies: data.paymentCurrencies ? data.paymentCurrencies : '',
        marketCode: data.marketCode ? data.marketCode : '',
        isActive: data.isActive ? data.isActive : ''
      };
    }

    return locationBylocationCode;
  }

  static getOnlyGHSDetails(data: any): GhsStepOne {
    if (data === undefined) {
      data = null;
    }

    let dataset = null;
    if (data) {
      const configDetails = data.configDetails ? data.configDetails : {};
      const ghsStepOne = configDetails.ghsStepOne
        ? configDetails.ghsStepOne
        : {};

      const dayDetails = ghsStepOne.dayDetails ? ghsStepOne.dayDetails : {};

      const ghsStepTwo = configDetails.ghsStepTwo
        ? configDetails.ghsStepTwo
        : {};

      dataset = {
        baseCurrency: dayDetails.baseCurrency ? dayDetails.baseCurrency : '',
        suspendingCNs: dayDetails.suspendingCNs ? dayDetails.suspendingCNs : '',
        transferredCNs: dayDetails.transferredCNs
          ? dayDetails.transferredCNs
          : '',
        activatedCNs: dayDetails.activatedCNs ? dayDetails.activatedCNs : '',
        ddValidityDays: dayDetails.ddValidityDays
          ? dayDetails.ddValidityDays
          : '',
        consolidateAttempts: dayDetails.consolidateAttempts
          ? dayDetails.consolidateAttempts
          : '',

        realisationDays: dayDetails.realisationDays
          ? dayDetails.realisationDays
          : '',
        validityDays: dayDetails.validityDays ? dayDetails.validityDays : '',
        ghsIbtCheckBox: ghsStepTwo.ghsIbtCheckBox
          ? ghsStepTwo.ghsIbtCheckBox
          : {}
      };
      return dataset;
    }
  }

  static getOnlyPrintDetails(data: any): PrintStepOne {
    if (data === undefined) {
      data = null;
    }
    let printDataset = null;
    if (data) {
      const configDetails = data.configDetails ? data.configDetails : {};
      const printStepOne = configDetails.printStepOne
        ? configDetails.printStepOne
        : {};

      const check1 = printStepOne.checkItOut1 ? printStepOne.checkItOut1 : {};
      const check2 = printStepOne.checkItOut2 ? printStepOne.checkItOut2 : {};

      printDataset = {
        printCheckbox1: check1 ? check1 : {},

        printCheckbox2: check2 ? check2 : {},

        makingChargesorWastageHeading: printStepOne.makingWastageCharge
          ? printStepOne.makingWastageCharge
          : '',

        freeTextForGrams: check2.freeTextForGrams
          ? check2.freeTextForGrams
          : '',
        noOfInvoicecopiesforRegularOrQuickCM: check2.noOfInvoicecopiesforRegularOrQuickCM
          ? check2.noOfInvoicecopiesforRegularOrQuickCM
          : ''
      };
      return printDataset;
    }
  }

  static getOnlyGRNIBTDetails(data: any): GrnIBTInventoryStepOne {
    if (data === undefined) data = null;
    let GRNIBTDataset = null;
    if (data) {
      const configDetails = data.configDetails ? data.configDetails : {};
      const grnIBTInventoryStepOne = configDetails.grnIBTInventoryStepOne
        ? configDetails.grnIBTInventoryStepOne
        : {};
      const grnIBTInventoryStepTwo = configDetails.grnIBTInventoryStepTwo
        ? configDetails.grnIBTInventoryStepTwo
        : {};
      const grnGrfConfiguration = grnIBTInventoryStepOne.grnGrfConfiguration
        ? grnIBTInventoryStepOne.grnGrfConfiguration
        : {};
      const inventory = grnIBTInventoryStepOne.inventory
        ? grnIBTInventoryStepOne.inventory
        : {};

      GRNIBTDataset = {
        grnGrfConfiguration: grnGrfConfiguration,
        grnGrfCheckBoxes: grnGrfConfiguration.grnGrfCheckBoxes
          ? grnGrfConfiguration.grnGrfCheckBoxes
          : {},
        inventory: inventory,
        inventoryCheckBoxes: inventory.inventoryCheckBoxes
          ? inventory.inventoryCheckBoxes
          : {},
        walkins: grnIBTInventoryStepOne.walkins
          ? grnIBTInventoryStepOne.walkins
          : {},
        ibtConfiguration: grnIBTInventoryStepTwo.ibtConfiguration
          ? grnIBTInventoryStepTwo.ibtConfiguration
          : {},
        kycConfiguration: grnIBTInventoryStepTwo.kycConfiguration
          ? grnIBTInventoryStepTwo.kycConfiguration
          : {},
        ulpConfiguration: grnIBTInventoryStepTwo.ulpConfiguration
          ? grnIBTInventoryStepTwo.ulpConfiguration
          : {}
      };

      return GRNIBTDataset;
    }
  }

  static getOnlyLoyalityDetails(data: any): Loyality {
    if (data === undefined) data = null;

    let loyalityDataset = null;
    if (data) {
      const configDetails = data.configDetails ? data.configDetails : {};
      const loyalityStepOne = configDetails.loyalityStepOne
        ? data.configDetails.loyalityStepOne
        : {};
      const loyalityStepTwo = configDetails.loyalityStepTwo
        ? data.configDetails.loyalityStepTwo
        : {};
      const loyalityStepThree = configDetails.loyalityStepThree
        ? data.configDetails.loyalityStepThree
        : {};
      const giftCardConfiguration = loyalityStepTwo.giftCardConfiguration
        ? loyalityStepTwo.giftCardConfiguration
        : {};
      loyalityDataset = {
        loyality: loyalityStepOne.loyality ? loyalityStepOne.loyality : {},
        gvPayment: loyalityStepOne.gvPayment ? loyalityStepOne.gvPayment : {},
        personalDetails: loyalityStepOne.personalDetails
          ? loyalityStepOne.personalDetails
          : {},
        ccPayment: loyalityStepTwo.ccPayment ? loyalityStepTwo.ccPayment : {},
        employeeDiscount: loyalityStepTwo.employeeDiscount
          ? loyalityStepTwo.employeeDiscount
          : {},
        giftCardConfiguration: giftCardConfiguration,
        giftCardConfigurationCheckBoxes: giftCardConfiguration.giftCardConfigurationCheckBoxes
          ? giftCardConfiguration.giftCardConfigurationCheckBoxes
          : '',
        tep: loyalityStepThree.tep ? loyalityStepThree.tep : {}
      };
      return loyalityDataset;
    }
  }
}
