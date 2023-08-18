import {
  SubRegion,
  LoadSubRegionListingSuccessPayload,
  LoadRegionDetailsListingSuccessPayload,
  RegionsData
} from '@poss-web/shared/models';

export class SubRegionAdaptor {
  static subRegionDetailsListing: LoadSubRegionListingSuccessPayload;
  static regionDetailsListing: LoadRegionDetailsListingSuccessPayload;

  static getRegionDetailsListing(
    data: any
  ): LoadRegionDetailsListingSuccessPayload {
    const regionDetailsListing: any[] = [];
    for (const listItem of data.results) {
      regionDetailsListing.push({
        regionCode: listItem.regionCode,
        description: listItem.description
      });
    }
    this.regionDetailsListing = {
      regionDetailsListing: regionDetailsListing,
      totalElements: data.totalElements
    };
    return this.regionDetailsListing;
  }

  static getSubRegionDetailsListing(
    data: any
  ): LoadSubRegionListingSuccessPayload {
    const subRegionDetailsListing: SubRegion[] = [];
    for (const listItem of data.results) {
      subRegionDetailsListing.push({
        regionCode: listItem.regionCode,
        description: listItem.description,
        configDetails: listItem.configDetails,
        parentRegionCode: listItem.parentRegionCode,
        orgCode: listItem.orgCode,
        isActive: listItem.isActive
      });
    }
    this.subRegionDetailsListing = {
      subRegionDetailsListing: subRegionDetailsListing,
      totalElements: data.totalElements
    };
    return this.subRegionDetailsListing;
  }

  static getSearchDetailsListing(
    data: any
  ): LoadSubRegionListingSuccessPayload {
    let searchList: LoadSubRegionListingSuccessPayload;
    const subRegionSearchListing: SubRegion[] = [];

    if (data.parentRegionCode !== '') {
      subRegionSearchListing.push({
        regionCode: data.regionCode,
        description: data.description,
        configDetails: data.configDetails,
        parentRegionCode: data.parentRegionCode,
        orgCode: data.orgCode,
        isActive: data.isActive
      });
    }

    let totalElements;
    if (data) {
      totalElements = 1;
    } else {
      totalElements = 0;
    }
    searchList = {
      subRegionDetailsListing: subRegionSearchListing,
      totalElements: totalElements
    };
    return searchList;
  }
}
