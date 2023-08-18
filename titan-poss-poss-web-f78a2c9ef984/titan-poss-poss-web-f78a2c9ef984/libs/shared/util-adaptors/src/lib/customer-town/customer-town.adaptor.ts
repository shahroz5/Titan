import {
  LoadCustomerTownListingSuccessPayload,
  LoadStateListingSuccessPayload,
  LoadRegionDetailsListingSuccessPayload
} from '@poss-web/shared/models';
import {
  CustomerTown,
  CustomerStateDetails
  // RegionDetails
} from '@poss-web/shared/models';

export class CustomerTownAdaptor {
  static customerTownDetailsListing: LoadCustomerTownListingSuccessPayload;
  static stateDetailsListing: LoadStateListingSuccessPayload;
  // static regionDetailsListing: LoadRegionDetailsListingSuccessPayload;

  static getCustomerTownDetailsListing(
    data: any
  ): LoadCustomerTownListingSuccessPayload {
    const customerTownDetailsListing: CustomerTown[] = [];
    for (const listItem of data.results) {
      customerTownDetailsListing.push({
        townCode: listItem.townCode,
        description: listItem.description,
        stateName: listItem.stateName,
        isActive: listItem.isActive
      });
    }
    this.customerTownDetailsListing = {
      customerTownDetailsListing: customerTownDetailsListing,
      totalElements: data.totalElements
    };
    return this.customerTownDetailsListing;
  }

  static getStateDetailsListing(data: any): LoadStateListingSuccessPayload {
    const stateDetailsListing: CustomerStateDetails[] = [];
    for (const listItem of data.results) {
      stateDetailsListing.push({
        description: listItem.description,
        stateId: listItem.description
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

  // static getSearchDetailsListing(
  //   data: any
  // ): LoadCustomerTownListingSuccessPayload {
  //   let searchList: LoadCustomerTownListingSuccessPayload;
  //   const customerTownListing: CustomerTown[] = [];
  //   for (const listItem of data.results) {
  //     customerTownListing.push({
  //       townCode: listItem.townCode,
  //       stateId: listItem.stateId,
  //       description: listItem.description,
  //       stateName: listItem.stateName
  //     });
  //   }

  //   let totalElements;
  //   if (data) {
  //     totalElements = 1;
  //   } else {
  //     totalElements = 0;
  //   }
  //   searchList = {
  //     customerTownDetailsListing: customerTownListing,
  //     totalElements: totalElements
  //   };
  //   return searchList;
  // }
}
