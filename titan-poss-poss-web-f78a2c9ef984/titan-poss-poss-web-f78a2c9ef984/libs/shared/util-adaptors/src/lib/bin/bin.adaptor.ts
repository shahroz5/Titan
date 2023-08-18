import { BinCodesByBinGroup, LocationList, LoadBinCodeDetailsListingSuccessPayload, BinCodeList, LoadSearchBinCodeDetails  } from '@poss-web/shared/models';



export class BinAdaptor {
  static binCodeDetailsListing: LoadBinCodeDetailsListingSuccessPayload;
  // static binCodesByBinGroupCode: BinCodesByBinGroup[];
  static searchElement: LoadSearchBinCodeDetails;
  static binCodByBinGroupListing: LoadSearchBinCodeDetails;


  static getBinCodeDetailsListing(
    data: any
  ): LoadBinCodeDetailsListingSuccessPayload {
    const binCodeDetailsListing: BinCodeList[] = [];
    for (const listItem of data.results) {
      binCodeDetailsListing.push({
        locationCode: listItem.locationCode,
        brandCode: listItem.brandCode,
        regionCode: listItem.regionCode,
        isActive: listItem.isActive,
      });
    }
    this.binCodeDetailsListing = {
      binCodeDetailsListing: binCodeDetailsListing,
      totalElements: data.totalElements
    };
    return this.binCodeDetailsListing;
  }

 static binCodesByBinGroup(
    data: any
  ): LoadSearchBinCodeDetails {
    const binCodesByBinGroupCode: BinCodesByBinGroup[] = [];
    for (const listItem of data.results) {
      binCodesByBinGroupCode.push({
        binCode: listItem.binCode,
        description: listItem.description,
        isActive: listItem.isActive,
      });
    }

    this.binCodByBinGroupListing = {
      binCodeSearchListing: binCodesByBinGroupCode,
      totalElements: data.totalElements
    }
    return this.binCodByBinGroupListing;
  }

static getBinDetailsByBinNameUrl(data: any): BinCodesByBinGroup[] {
  const binDetailsByBinName: BinCodesByBinGroup[] = [];

  binDetailsByBinName.push({
  binCode: data.binCode,
  description: data.binGroups.descritpion,
  isActive: data.binGroups.isActive
  });

  return binDetailsByBinName;
}


static locationsByBinGroupAndCode (data: any): LocationList[]{
     const locationList: LocationList[] = [];
     for (const listItem of data.results) {
      locationList.push({
       id: listItem.locationCode,
       description: listItem.locationCode
      });
    }
    return locationList;
}

static getSearchDetailsListing(
  data: any
): LoadSearchBinCodeDetails {
  //let searchList: LoadSearchBinCodeDetails;
  const binGroupDetailsListing: BinCodesByBinGroup[] = [];
    binGroupDetailsListing.push({
      binCode: data.binCode,
      description: data.description,
      isActive: data.binGroups[0].isActive
    });

  let totalElements;
  if (data) {
    totalElements = 1;
  } else {
    totalElements = 0;
  }
  this.searchElement = {
    binCodeSearchListing: binGroupDetailsListing,
    totalElements: totalElements
  };
  return this.searchElement;
}
}
