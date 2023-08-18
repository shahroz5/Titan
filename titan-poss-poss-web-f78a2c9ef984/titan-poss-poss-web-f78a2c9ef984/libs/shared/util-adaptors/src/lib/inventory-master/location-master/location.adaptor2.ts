import { LocationSetup, LocationListing } from '@poss-web/shared/models';

// import {
//   LocationListing,
//   SaveLocationDetailsPayload,
//   currencyTypes
// } from '../+state/location-master.actions';

// import { Observable, of } from 'rxjs';
// import {
//   LocationMaster,
//   Ghs,
//   AdvanceCustomOrder,
//   Location,
//   Print,
//   LoyalityGEPGCTEP,
//   GRNIBTInventory
// } from '../models/locatonmodel';

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

  // static getLocationOwnerTypes(data: any): { id: string; name: string }[] {
  //   const ownerType: { id: string; name: string }[] = [];

  //   for (const locationdata of data.values) {
  //     ownerType.push({
  //       id: locationdata.code,
  //       name: locationdata.value
  //     });
  //   }
  //   return ownerType;
  // } // Duplicate, getLocationFormat

  static getLocationFormat(data: any): { id: string; name: string }[] {
    const ownerType: { id: string; name: string }[] = [];

    for (const locationdata of data.values) {
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
        name: mrkt.marketCode
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

  static getOnlyAdvanceCustom(data: any): AdvanceCustomOrder {
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
      // if (data) {
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

        configDetails: data.configDetails ? data.configDetails : ''
      };
    } else {
      locationBylocationCode = {
        locationCode: data.locationCode ? data.locationCode : '',
        description: data.description ? data.description : '',
        companyName: data.companyName ? data.companyName : '',
        address: data.address ? data.address : '',
        pincode: data.pincode ? data.pincode : 0,
        phoneNo: data.phoneNo ? data.phoneNo : '',
        contactNo: data.contactNo ? data.contactNo : '',
        fax: data.fax ? data.fax : '',
        locationEmail: data.locationEmail ? data.locationEmail : '',
        locationTypeCode: data.locationTypeCode ? data.locationTypeCode : '',
        registrationNo: data.registrationNo ? data.registrationNo : '',
        countryCode: data.countryCode ? data.countryCode : '',
        townId: data.townId ? data.townId : '',
        stateId: data.stateId ? data.stateId : '',
        regionCode: data.regionCode ? data.regionCode : '',
        subRegionCode: data.subRegionCode ? data.subRegionCode : '',
        ownerTypeCode: data.ownerTypeCode ? data.ownerTypeCode : '',
        factoryCodeValue: data.factoryCodeValue ? data.factoryCodeValue : '',
        locationFormat: data.locationFormat ? data.locationFormat : '',
        brandCode: data.brandCode ? data.brandCode : '',
        isActive: data.isActive ? data.isActive : '',
        marketCode: data.marketCode ? data.marketCode : '',
        baseCurrency: data.baseCurrency ? data.baseCurrency : '',
        stockCurrency: data.stockCurrency ? data.stockCurrency : '',
        masterCurrency: data.masterCurrency ? data.masterCurrency : '',
        paymentCurrencies: data.paymentCurrencies ? data.paymentCurrencies : '',
        configDetails: null
      };
    }

    return locationBylocationCode;
  }
  static getsavedLocationDetails(data: any): SaveLocationDetailsPayload {

    this.saveLocationDetails = {
      cfaCodeValue: data.locationCode,
      address: data.address,
      brandCode: data.brandCode,
      subBrandCode: data.subBrandCode,
      configDetails: data.configDetails,
      contactNo: data.contactNo,
      countryCode: data.countryCode,
      //currencyCode: data.currencyCode,
      description: data.description,
      factoryCodeValue: data.factoryCodeValue,
      //fax: data.fax,
      isActive: data.isActive,
      locationCode: data.locationCode,
      locationEmail: data.locationEmail,
      locationFormat: data.locationFormat,
      locationTypeCode: data.locationTypeCode,
      ownerTypeCode: data.ownerTypeCode,
      phoneNo: data.phoneNo,
      pincode: data.pincode,
      regionCode: data.regionCode,
      subRegionCode: data.subRegionCode,
      registrationNo: data.registrationNo,
      stateCode: data.stateCode,
      townId: data.townCode
    };
    return this.saveLocationDetails;
  }

  static getLocationListingDetails(data: any): LocationListing {

    const locationListResult: LocationMasterList[] = [];
    for (const listItem of data.results) {
      locationListResult.push({
        address: listItem.address,
        brandCode: listItem.brandCode,
        configDetails: listItem.configDetails,
        contactNo: listItem.contactNo,
        currencyCode: listItem.currencyCode,
        description: listItem.description,
        factoryCodeValue: listItem.factoryCodeValue,
        fax: listItem.fax,
        isActive: listItem.isActive,
        locationCode: listItem.locationCode,
        locationEmail: listItem.locationEmail,
        locationFormat: listItem.locationFormat,
        locationTypeCode: listItem.locationTypeCode,
        oldFactoryCode: listItem.oldFactoryCode,
        ownerTypeCode: listItem.ownerTypeCode,
        phoneNo: listItem.phoneNo,
        pincode: listItem.pincode,
        regionCode: listItem.regionCode,
        registrationNo: listItem.registrationNo,
        stateCode: listItem.stateId,
        townCode: listItem.townId,
        baseCurrency: listItem.baseCurrency,
        masterCurrency: listItem.masterCurrency,
        paymentCurrencies: listItem.paymentCurrencies,
        stockCurrency: listItem.stockCurrency
      });
    }
    this.locationList = {
      results: locationListResult,
      totalElements: data.totalElements
    };

    return this.locationList;
  }

  static getSearchResult(data: any): LocationListing {

    let locationList: LocationListing;
    const locationListResult: LocationMaster[] = [];
    const listItem = data;
    locationListResult.push({
      address: listItem.address,
      brandCode: listItem.brandCode,
      configDetails: listItem.configDetails,
      contactNo: listItem.contactNo,
      currencyCode: listItem.currencyCode,
      description: listItem.description,
      factoryCodeValue: listItem.factoryCodeValue,
      fax: listItem.fax,
      isActive: listItem.isActive,
      locationCode: listItem.locationCode,
      locationEmail: listItem.locationEmail,
      locationFormat: listItem.locationFormat,
      locationTypeCode: listItem.locationTypeCode,
      oldFactoryCode: listItem.oldFactoryCode,
      ownerTypeCode: listItem.ownerTypeCode,
      phoneNo: listItem.phoneNo,
      pincode: listItem.pincode,
      regionCode: listItem.regionCode,
      registrationNo: listItem.registrationNo,
      stateCode: listItem.stateId,
      townCode: listItem.townId,
      baseCurrency: listItem.baseCurrency,
      masterCurrency: listItem.masterCurrency,
      paymentCurrencies: listItem.paymentCurrencies,
      stockCurrency: listItem.stockCurrency
    });
    let totalElements;
    if (data) {
      totalElements = 1;
    } else {
      totalElements = 0;
    }
    locationList = {
      results: locationListResult,
      totalElements: totalElements
    };

    return locationList;
  }

  static getOnlyLocationDetails(data: any): Location {

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

  static getOnlyGHSDetails(data: any): Ghs {
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

  static getOnlyPrintDetails(data: any): Print {
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

  static getOnlyGRNIBTDetails(data: any): GRNIBTInventory {
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

  static getOnlyLoyalityDetails(data: any): LoyalityGEPGCTEP {
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
