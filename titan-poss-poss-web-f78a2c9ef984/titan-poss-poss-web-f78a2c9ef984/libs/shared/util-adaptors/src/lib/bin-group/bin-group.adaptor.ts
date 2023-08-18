import { LoadBinGroupDetailsListingSuccessPayload, SearchBinGroupListingSuccessPayload, BinGroupDetails } from '@poss-web/shared/models';


export class BinGroupAdaptor {
  static binGroupDetailsListing: LoadBinGroupDetailsListingSuccessPayload;
  static searchElement: SearchBinGroupListingSuccessPayload;

  static getBinGroupDetailsListing(
    data: any
  ): LoadBinGroupDetailsListingSuccessPayload {
    const binGroupDetailsListing: BinGroupDetails[] = [];
    for (const listItem of data.results) {
      binGroupDetailsListing.push({
        binGroupCode: listItem.binGroupCode,
        description: listItem.description,
        isActive: listItem.isActive
      });
    }
    this.binGroupDetailsListing = {
      binGroupDetailsListing: binGroupDetailsListing,
      totalElements: data.totalElements
    };
    return this.binGroupDetailsListing;
  }


  static getSearchDetailsListing(
    data: any
  ): LoadBinGroupDetailsListingSuccessPayload {
    let searchList: LoadBinGroupDetailsListingSuccessPayload;
    const binGroupDetailsListing: BinGroupDetails[] = [];
      binGroupDetailsListing.push({
        binGroupCode: data.binGroupCode,
        description: data.description,
        isActive: data.isActive
      });

    let totalElements;
    if (data) {
      totalElements = 1;
    } else {
      totalElements = 0;
    }
    searchList = {
      binGroupDetailsListing: binGroupDetailsListing,
      totalElements: totalElements
    };
    return searchList;
  }

}
