import {
  CashMemoDetails,
  Location,
  LocationSummary,
  LocationSummaryList
} from '@poss-web/shared/models';
export class LocationDataAdaptor {
  static locationDataFromJson(data: any): Location[] {
    const locationData: Location[] = [];
    for (const location of data.results) {
      locationData.push({
        address: location.address,
        brandCode: location.brandCode,
        isActive: location.isActive,
        locationCode: location.locationCode,
        locationTypeCode: location.locationTypeCode,
        regionCode: location.regionCode,
        stateCode: location.stateId,
        townCode: location.townId,

        cfaCodeValue: location.cfaCodeValue,
        configDetails: location.configDetails,
        contactNo: location.contactNo,
        countryCode: location.countryCode,
        description: location.description,
        factoryCodeValue: location.factoryCodeValue,
        fax: location.fax,
        locationEmail: location.locationEmail,
        locationFormat: location.locationFormat,
        ownerTypeCode: location.ownerTypeCode,
        phoneNo: location.phoneNo,
        pincode: location.pincode,
        registrationNo: location.registrationNo
      });
    }
    return locationData;
  }

  static locationFromJson(data: any): Location {
    if (!data) {
      return null;
    }

    const location: Location = {
      address: data.address,
      brandCode: data.brandCode,
      isActive: data.isActive,
      locationCode: data.locationCode,
      locationTypeCode: data.locationTypeCode,
      regionCode: data.regionCode,
      stateCode: data.stateId,
      townCode: data.townId,
      cfaCodeValue: data.cfaCodeValue,
      configDetails: data.configDetails,
      contactNo: data.contactNo,
      countryCode: data.countryCode,
      description: data.description,
      factoryCodeValue: data.factoryCodeValue,
      fax: data.fax,
      locationEmail: data.locationEmail,
      locationFormat: data.locationFormat,
      ownerTypeCode: data.ownerTypeCode,
      phoneNo: data.phoneNo,
      pincode: data.pincode,
      registrationNo: data.registrationNo
    };
    return location;
  }

  static locationSummaryFromJson(data: any): LocationSummary {
    return {
      address: data.address,
      brandCode: data.brandCode,
      cfaCodeValue: data.cfaCodeValue,
      cfaDetails: data.cfaDetails,
      cfaStoreDetails: data?.cfaStoreDetails
        ? data?.cfaStoreDetails?.data?.addressLines
        : null,
      configDetails: data.configDetails,
      contactNo: data.contactNo,
      countryCode: data.countryCode,
      description: data.description,
      factoryCodeValue: data.factoryCodeValue,
      factoryDetails: data.factoryDetails,
      fax: data.fax,
      isActive: data.isActive,
      locationCode: data.locationCode,
      locationEmail: data.locationEmail,
      locationFormat: data.locationFormat,
      locationTypeCode: data.locationTypeCode,
      ownerTypeCode: data.ownerTypeCode,
      phoneNo: data.phoneNo,
      pincode: data.pincode,
      regionCode: data.regionCode,
      registrationNo: data.registrationNo,
      stateCode: data.stateId,
      townCode: data.townId,
      baseCurrency: data.baseCurrency,
      stockCurrency: data.stockCurrency,
      masterCurrency: data.masterCurrency,
      paymentCurrencies: data.paymentCurrencies,
      companyName: data.companyName,
      cmDetails: {
        type: data.cmDetails.type,
        data: this.cashMemoDetailsFromJson(data.cmDetails.data)
      }
    };
  }

  static locationSummaryListFromJson(data: any): LocationSummaryList[] {
    const locationData: LocationSummaryList[] = [];
    for (const location of data.results) {
      locationData.push({
        description: location.description,
        locationCode: location.locationCode
      });
    }
    return locationData;
  }

  static cashMemoDetailsFromJson(data: any): CashMemoDetails {
    return {
      isBillCancelApprovalRequired: data.isBillCancelApprovalRequired,
      isMobileAndEmail: data.isMobileAndEmail,
      isEditWeightAllowed: data.isEditWeightAllowed,
      title: data.title,
      maxNoOfHoursForBillCancel: data.maxNoOfHoursForBillCancel,
      cmHoldTimeInMinutes: data.cmHoldTimeInMinutes
    };
  }
}
