import {
  LoadCountryListingSuccessPayload,
  CountryDetails,
  CountryMaster,
  CountryNameData,
  CurrencyCodeData
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { StateAdaptor } from '../state/state.adaptor';

export class CountryAdaptor {
  static countryDetailsListing: LoadCountryListingSuccessPayload;

  static getCountryDetailsListing(data: any): LoadCountryListingSuccessPayload {
    const countryDetailsListing: CountryDetails[] = [];
    for (const listItem of data.results) {
      countryDetailsListing.push({
        countryCode: listItem.countryCode ? listItem.countryCode : '',
        description: listItem.description ? listItem.description : '',
        isdCode: listItem.isdCode ? listItem.isdCode : '',
        dateFormat: listItem.dateFormat ? listItem.dateFormat : '',
        isActive: listItem.isActive,
        lastModifiedDate: moment(listItem.lastModifiedDate)
      });
    }

    this.countryDetailsListing = {
      countryListing: countryDetailsListing,
      totalElements: data.totalElements
    };
    return this.countryDetailsListing;
  }
  static getCountryDetailsSearch(data: any): CountryDetails[] {
    console.log(data, 'in adap');

    const countryDetails: CountryDetails[] = [];
    for (const listItem of data.results) {
      countryDetails.push({
        countryCode: listItem.countryCode ? listItem.countryCode : '',
        description: listItem.description ? listItem.description : '',
        dateFormat: listItem.dateFormat ? listItem.dateFormat : '',
        isdCode: listItem.isdCode ? listItem.isdCode : '',
        isActive: listItem.isActive,
        lastModifiedDate: moment(listItem.lastModifiedDate)
      });
    }
    console.log(countryDetails, 'adap');

    return countryDetails;
  }
  static getCountryDetailsBasedOnCode(data: any): CountryMaster {
    const CountryMasterListing: CountryMaster = {
      countryCode: data.countryCode,
      currencyCode: data.currencyCode,
      description: data.description,
      isdCode: data.isdCode,
      dateFormat: data.dateFormat,
      fiscalYearStart: data.fiscalYearStart,
      phoneLength: data.phoneLength,
      locale: data.locale,
      timeFormat: data.timeFormat,
      fiscalYear: data.fiscalYear,
      weightUnit: data.weightUnit,
      stoneWeightUnit: data.stoneWeightUnit,
      isActive: data.isActive
    };
    return CountryMasterListing;
  }
  static getCountryName(data: any): CountryNameData[] {
    const countryCodes: CountryNameData[] = [];
    for (const countryCode of data.results) {
      countryCodes.push({
        id: countryCode.currencyCode,
        name: countryCode.currencyCode
      });
    }
    return countryCodes;
  }

  static getCurrencyCode(Data: any): CurrencyCodeData[] {
    const CurrencyCode: CurrencyCodeData[] = [];
    for (const currencyCode of Data.results) {
      CurrencyCode.push({
        id: currencyCode.currencyCode,

        name: currencyCode.currencyCode
      });
    }
    return CurrencyCode;
  }
}
