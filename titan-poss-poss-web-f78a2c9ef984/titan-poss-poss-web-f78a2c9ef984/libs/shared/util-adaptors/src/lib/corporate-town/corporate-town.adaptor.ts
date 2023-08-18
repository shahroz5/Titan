import {
  LoadCorporateTownListingSuccessPayload,
  LoadStateListingSuccessPayload,
  LoadRegionDetailsListingSuccessPayload,
  LoadCountryCode
} from '@poss-web/shared/models';
import {
  CorporateTown,
  StateDetails
  // RegionDetails
} from '@poss-web/shared/models';

export class CorporateTownAdaptor {
  static corporateTownDetailsListing: LoadCorporateTownListingSuccessPayload;
  static stateDetailsListing: LoadStateListingSuccessPayload;
  static regionDetailsListing: LoadRegionDetailsListingSuccessPayload;

  static getCorporateTownDetailsListing(
    data: any
  ): LoadCorporateTownListingSuccessPayload {
    const corporateTownDetailsListing: CorporateTown[] = [];
    for (const listItem of data.results) {
      corporateTownDetailsListing.push({
        townCode: listItem.townId,
        stateId: listItem.stateId,
        description: listItem.description,
        stateName: listItem.stateName,
        isActive: listItem.isActive,
        eghsRefTownId: listItem.eghsRefTownId
      });
    }
    this.corporateTownDetailsListing = {
      corporateTownDetailsListing: corporateTownDetailsListing,
      totalElements: data.totalElements
    };
    return this.corporateTownDetailsListing;
  }

  static getStateDetailsListing(data: any): LoadStateListingSuccessPayload {
    const stateDetailsListing: StateDetails[] = [];
    for (const listItem of data.results) {
      stateDetailsListing.push({
        description: listItem.description,
        stateId: listItem.stateId
      });
    }
    this.stateDetailsListing = {
      stateDetailsListing: stateDetailsListing,
      totalElements: data.totalElements
    };
    return this.stateDetailsListing;
  }

  // static getRegionDetailsListing(
  //   data: any
  // ): LoadRegionDetailsListingSuccessPayload {
  //   const regionDetailsListing: RegionDetails[] = [];
  //   for (const listItem of data.results) {
  //     regionDetailsListing.push({
  //       description: listItem.description,
  //       isActive: listItem.isActive,
  //       parentRegionCode: listItem.parentRegionCode,
  //       regionCode: listItem.regionCode
  //     });
  //   }
  //   this.regionDetailsListing = {
  //     regionDetailsListing: regionDetailsListing,
  //     totalElements: data.totalElements
  //   };
  //   return this.regionDetailsListing;
  // }

  static getSearchDetailsListing(
    data: any
  ): LoadCorporateTownListingSuccessPayload {
    let searchList: LoadCorporateTownListingSuccessPayload;
    const corporateTownListing: CorporateTown[] = [];
    for (const listItem of data.results) {
      corporateTownListing.push({
        townCode: listItem.townId,
        stateId: listItem.stateId,
        description: listItem.description,
        stateName: listItem.stateName,
        isActive: listItem.isActive,
        eghsRefTownId: listItem.eghsRefTownId
      });
    }

    let totalElements;
    if (data) {
      totalElements = 1;
    } else {
      totalElements = 0;
    }
    searchList = {
      corporateTownDetailsListing: corporateTownListing,
      totalElements: totalElements
    };
    return searchList;
  }

  // static getCountryCode(Data: any): LoadCountryCode[] {
  //   console.log(Data);
  //   const countryData: LoadCountryCode[] = [];
  //   for (const country of Data.results) {
  //     countryData.push({
  //       countryCode: country.countryCode,
  //       descriprtion: country.descriprtion
  //     });
  //   }
  //   console.log(countryData);
  //   return countryData;
  // }
}
