import {
  RegionsData,
  LoadRegionDetailsListingSuccessPayload
} from '@poss-web/shared/models';

export class RegionsAdaptor {
  static regionDetailsListing: LoadRegionDetailsListingSuccessPayload;

  static getRegionDetailsListing(
    data: any
  ): LoadRegionDetailsListingSuccessPayload {
    const regionDetailsListing: RegionsData[] = [];
    for (const listItem of data.results) {
      regionDetailsListing.push({
        regionCode: listItem.regionCode,
        description: listItem.description,
        configDetails: listItem.configDetails,
        parentRegionCode: listItem.parentRegionCode,
        orgCode: listItem.orgCode,
        isActive: listItem.isActive
      });
    }
    this.regionDetailsListing = {
      regionDetailsListing: regionDetailsListing,
      totalElements: data.totalElements
    };
    return this.regionDetailsListing;
  }

  static getSearchDetailsListing(
    data: any
  ): LoadRegionDetailsListingSuccessPayload {
    let searchList: LoadRegionDetailsListingSuccessPayload;
    const regionSearchListing: RegionsData[] = [];

    regionSearchListing.push({
      regionCode: data.regionCode,
      description: data.description,
      configDetails: data.configDetails,
      parentRegionCode: data.parentRegionCode,
      orgCode: data.orgCode,
      isActive: data.isActive
    });

    let totalElements;
    if (data) {
      totalElements = 1;
    } else {
      totalElements = 0;
    }

    searchList = {
      regionDetailsListing: regionSearchListing,
      totalElements: totalElements
    };

    return searchList;
  }
}
