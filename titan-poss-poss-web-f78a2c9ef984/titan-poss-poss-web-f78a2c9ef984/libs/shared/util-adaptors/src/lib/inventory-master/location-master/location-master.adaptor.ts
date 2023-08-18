import {
  LocationListingData,
  LocationListingPayload,
  LocationMasterDetails,
  LocationMasterDropdownList
} from '@poss-web/shared/models';

export class LocationMasterAdpator {
  static getLocationListingDetails(data: any): LocationListingPayload {
    const locationListResult: LocationListingData[] = [];
    for (const listItem of data.results) {
      locationListResult.push({
        brandCode: listItem.brandCode,
        description: listItem.description,
        isActive: listItem.isActive,
        locationCode: listItem.locationCode,
        locationTypeCode: listItem.locationTypeCode,
        regionCode: listItem.regionCode,
        stateId: listItem.stateId,
        stateName: listItem.stateName,
        townId: listItem.townId,
        townName: listItem.townName,
        marketCode: listItem.marketCode,
        baseCurrency: listItem.baseCurrency,
        cfaCodeValue: listItem.cfaCodeValue,
        countryCode: listItem.countryCode,
        factoryCodeValue: listItem.factoryCodeValue,
        fax: listItem.fax,
        locationFormat: listItem.locationFormat,
        masterCurrency: listItem.masterCurrency,
        ownerTypeCode: listItem.ownerTypeCode,
        paymentCurrencies: listItem.paymentCurrencies,
        remarks: listItem.remarks,
        stockCurrency: listItem.stockCurrency,
        subBrandCode: listItem.subBrandCode,
        subRegionCode: listItem.subRegionCode
      });
    }

    const locationList: LocationListingPayload = {
      results: locationListResult,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
      totalElements: data.totalElements
    };

    return locationList;
  }

  static getSearchResult(data: any): LocationListingPayload {
    let locationList: LocationListingPayload;
    const locationListResult: LocationListingData[] = [];
    const listItem = data;
    locationListResult.push({
      brandCode: listItem.brandCode,
      description: listItem.description,
      isActive: listItem.isActive,
      locationCode: listItem.locationCode,
      locationTypeCode: listItem.locationTypeCode,
      regionCode: listItem.regionCode,
      stateId: listItem.stateId,
      stateName: listItem.stateName,
      townId: listItem.townId,
      townName: listItem.townName,
      marketCode: listItem.marketCode,
      baseCurrency: listItem.baseCurrency,
      cfaCodeValue: listItem.cfaCodeValue,
      countryCode: listItem.countryCode,
      factoryCodeValue: listItem.factoryCodeValue,
      fax: listItem.fax,
      locationFormat: listItem.locationFormat,
      masterCurrency: listItem.masterCurrency,
      ownerTypeCode: listItem.ownerTypeCode,
      paymentCurrencies: listItem.paymentCurrencies,
      remarks: listItem.remarks,
      stockCurrency: listItem.stockCurrency,
      subBrandCode: listItem.subBrandCode,
      subRegionCode: listItem.subRegionCode
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

  static getLocationMasterDetails(data: any): LocationMasterDetails {
    // #TODO: saparete internal object.
    const locationMasterDetails: LocationMasterDetails = {
      locationCode: data.locationCode,
      description: data.description,
      locationTypeCode: data.locationTypeCode,
      townId: data.townId,
      stateId: data.stateId,
      countryCode: data.countryCode,
      regionCode: data.regionCode,
      ownerTypeCode: data.ownerTypeCode,
      factoryCodeValue: data.factoryCodeValue,
      cfaCodeValue: data.cfaCodeValue,
      locationFormat: data.locationFormat,
      brandCode: data.brandCode,
      isActive: data.isActive,
      isOffline: data.isOffline,
      isAutostn: data.isAutostn,
      marketCode: data.marketCode,
      subRegionCode: data.subRegionCode,
      subBrandCode: data.subBrandCode,
      remarks: data.remarks,
      baseCurrency: data.baseCurrency,
      stockCurrency: data.stockCurrency,
      masterCurrency: data.masterCurrency,
      paymentCurrencies: data.paymentCurrencies,
      storeDetails: data.storeDetails,
      printDetails: data.printDetails,
      cnDetails: data.cnDetails,
      taxDetails: data.taxDetails,
      cmDetails: data.cmDetails,
      grnDetails: data.grnDetails,
      grfDetails: data.grfDetails,
      gepDetails: data.gepDetails,
      gcDetails: data.gcDetails,
      abDetails: data.abDetails,
      coDetails: data.coDetails,
      ghsDetails: data.ghsDetails,
      inventoryDetails: data.inventoryDetails,
      bankingDetails: data.bankingDetails,
      otpDetails: data.otpDetails,
      customerDetails: data.customerDetails,
      paymentDetails: data.paymentDetails,
      offerDetails: data.offerDetails,
      tepDetails: data.tepDetails,
      digigoldDetails: data.digigoldDetails,
      tcsDetails: data.tcsDetails,
      serviceDetails: data.serviceDetails
    };

    return locationMasterDetails;
  }

  static getNewLocationMasterDetails(): LocationMasterDetails {
    // #TODO: saparete internal object.
    const locationMasterDetails: LocationMasterDetails = {
      locationCode: '',
      description: '',
      locationTypeCode: '',
      townId: '',
      stateId: '',
      countryCode: '',
      regionCode: '',
      ownerTypeCode: '',
      factoryCodeValue: '',
      cfaCodeValue: '',
      locationFormat: '',
      brandCode: '',
      isActive: false,
      isOffline: false,
      isAutostn: false,
      marketCode: '',
      subRegionCode: '',
      subBrandCode: '',
      remarks: '',
      baseCurrency: '',
      stockCurrency: '',
      masterCurrency: '',
      paymentCurrencies: '',
      storeDetails: {
        type: 'STORE_DETAILS',
        data: {
          addressLines: [''],
          contactNumber: '',
          corporateAddress: '',
          isWalkInsDetailsMandatory: false,
          cinNumber: '',
          phoneNumber1: '',
          phoneNumber2: '',
          pincode: '',
          boutiqueEmailId: '',
          noOfDays: '',
          numberOfDaysToDisplay: '1',
          regdOffice: '',
          companyName: '',
          maxRateRetryAttempt: '',
          isEinvoiceEnabled: false,
          isPanCardVerifyIntegrationEnabled: false,
          isDial: false,
          isHallmarkingEnabled: false,
          hallmarkRegistrationNumber: '',
          hallmarkGSTPercentage: '',
          reviewLinkURL: ''
        }
      },
      printDetails: null,
      cnDetails: null,
      taxDetails: null,
      cmDetails: null,
      grnDetails: null,
      grfDetails: null,
      gepDetails: null,
      gcDetails: null,
      abDetails: null,
      coDetails: null,
      ghsDetails: null,
      inventoryDetails: null,
      bankingDetails: null,
      otpDetails: null,
      customerDetails: null,
      paymentDetails: null,
      offerDetails: null,
      tepDetails: null,
      digigoldDetails: null,
      tcsDetails: null,
      serviceDetails: null
    };

    return locationMasterDetails;
  }

  static getRegionList(data: any): LocationMasterDropdownList[] {
    const list: LocationMasterDropdownList[] = [];
    for (const listItem of data) {
      list.push({
        id: listItem.regionCode,
        name: listItem.description
      });
    }
    return list;
  }

  static getBrandList(data: any): LocationMasterDropdownList[] {
    const list: LocationMasterDropdownList[] = [];
    for (const listItem of data) {
      list.push({
        id: listItem.brandCode,
        name: listItem.description
      });
    }
    return list;
  }
}
