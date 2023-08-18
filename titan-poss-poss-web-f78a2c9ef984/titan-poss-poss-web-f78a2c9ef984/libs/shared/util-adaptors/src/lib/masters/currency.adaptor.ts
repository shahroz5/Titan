import {
  LoadCurrencyListingSuccessPayload,
  CurrencyDetails
  // CountryDropDownData,
  // CurrencySymbolData,
  // UnicodeData,
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class CurrencyAdaptor {
  static currencyDetailsListing: LoadCurrencyListingSuccessPayload;

  static getCurrencyDetailsListing(
    data: any
  ): LoadCurrencyListingSuccessPayload {
    const currencyDetailsListing: CurrencyDetails[] = [];
    for (const listItem of data.results) {
      currencyDetailsListing.push({
        currencyCode: listItem.currencyCode ? listItem.currencyCode : '',
        currencySymbol: listItem.currencySymbol ? listItem.currencySymbol : '',
        description: listItem.description ? listItem.description : '',
        unicode: listItem.unicode ? listItem.unicode : '',
        lastModifiedDate: moment(listItem.lastModifiedDate),
        isActive: listItem.isActive
      });
    }

    this.currencyDetailsListing = {
      currencyListing: currencyDetailsListing,
      totalElements: data.totalElements
    };
    return this.currencyDetailsListing;
  }
  static getCurrencyDetailsSearch(data: any): CurrencyDetails[] {
    const currencyDetails: CurrencyDetails[] = [];
    currencyDetails.push({
      currencyCode: data.currencyCode ? data.currencyCode : '',
      currencySymbol: data.currencySymbol ? data.currencySymbol : '',
      description: data.description ? data.description : '',
      unicode: data.unicode ? data.unicode : '',
      lastModifiedDate: moment(data.lastModifiedDate),
      isActive: data.isActive
    });

    return currencyDetails;
  }
  static getCurrencyDetailsBasedOnCode(data: any): CurrencyDetails {
    const currencyDetailsListing: CurrencyDetails = {
      currencyCode: data.currencyCode,
      currencySymbol: data.currencySymbol,
      description: data.description,
      unicode: data.unicode,
      lastModifiedDate: moment(data.lastModifiedDate),
      isActive: data.isActive
    };
    return currencyDetailsListing;
  }

  // static getCountryData(data:any):CountryDropDownData[] {
  //   console.log(data)
  //   const currencyCodes: CountryDropDownData[]=[];
  //   for(const currencyCode of data.results){
  //     currencyCodes.push({
  //       id:currencyCode.currencyCode,
  //       name:currencyCode.currencyCode
  //     })
  //   }
  //   console.log(currencyCodes)
  //   return currencyCodes;
  // }

  // static getUnicode(Data:any):UnicodeData[] {

  //   const Unicodes: UnicodeData[]=[];
  //   for(const Unicode of Data.results){
  //     Unicodes.push({
  //       id:Unicode.unicode,
  //       name:Unicode.unicode
  //     })
  //   }
  //   console.log(Unicodes)
  //   return Unicodes;
  // }

  // static getCurrencySymbol(data:any):CurrencySymbolData[] {
  //   console.log(data)
  //   const currencySymbols: CurrencySymbolData[]=[];
  //   for(const currencyCode of data.results){
  //     currencySymbols.push({
  //       id:currencyCode.currencySymbol,
  //       name:currencyCode.currencySymbol
  //     })
  //   }
  //   console.log(currencySymbols)
  //   return currencySymbols;
  // }
}
