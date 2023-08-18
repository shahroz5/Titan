import { LoadStoneListingSuccessPayload } from '@poss-web/shared/models';
import { StoneDetails } from '@poss-web/shared/models';
export class StoneAdaptor {
  static stoneDetailsListing: LoadStoneListingSuccessPayload;

  static getStoneDetailsListing(data: any): LoadStoneListingSuccessPayload {
    const stoneDetailsListing: StoneDetails[] = [];

    for (const listItem of data.results) {
      stoneDetailsListing.push({
        stoneCode: listItem.stoneCode,
        stoneTypeCode: listItem.stoneTypeCode,
        stdWeight: listItem.stdWeight,
        color: listItem.color,
        stdValue: listItem.stdValue,
        quality: listItem.quality,
        configDetails: listItem.configDetails
          ? listItem.configDetails.data.StoneTEPDiscount
          : '',
        ratePerCarat: listItem.ratePerCarat,
        isActive: listItem.isActive
      });
    }
    this.stoneDetailsListing = {
      stoneListing: stoneDetailsListing,
      totalElements: data.totalElements
    };
    return this.stoneDetailsListing;
  }

  static getStoneDetailsSearch(data: any): StoneDetails[] {
    const stoneDetails: StoneDetails[] = [];
    for (const listItem of data.results) {
      stoneDetails.push({
        stoneCode: listItem.stoneCode,
        stoneTypeCode: listItem.stoneTypeCode,
        stdWeight: listItem.stdWeight,
        color: listItem.color,
        stdValue: listItem.stdValue,
        quality: listItem.quality,
        isActive: listItem.isActive,
        configDetails: listItem.configDetails
          ? listItem.configDetails.data.StoneTEPDiscount
            ? listItem.configDetails.data.StoneTEPDiscount
            : ''
          : '',
        ratePerCarat: listItem.ratePerCarat
      });
    }

    return stoneDetails;
  }
}
