import {
  LoadStoneTypeListingSuccessPayload,
  SaveStoneTypeFormDetailsPayload
} from '@poss-web/shared/models';
import { StoneTypeDetails } from '@poss-web/shared/models';

export class StoneTypeAdaptor {
  static stoneTypeDetailsListing: LoadStoneTypeListingSuccessPayload;

  static getStoneTypeDetailsListing(
    data: any
  ): LoadStoneTypeListingSuccessPayload {
    const stoneTypeDetailsListing: StoneTypeDetails[] = [];
    for (const listItem of data.results) {
      stoneTypeDetailsListing.push({
        stoneTypeCode: listItem.stoneTypeCode ? listItem.stoneTypeCode : '',
        description: listItem.description ? listItem.description : '',
        configDetails: listItem.configDetails ? listItem.configDetails : '',
        isActive: listItem.isActive
      });
    }

    this.stoneTypeDetailsListing = {
      stoneTypeListing: stoneTypeDetailsListing,
      totalElements: data.totalElements
    };
    return this.stoneTypeDetailsListing;
  }

  static getStoneTypeDetailsSearch(data: any): StoneTypeDetails[] {
    const stoneTypeDetails: StoneTypeDetails[] = [];
    stoneTypeDetails.push({
      description: data.description ? data.description : '',
      stoneTypeCode: data.stoneTypeCode ? data.stoneTypeCode : '',
      configDetails: data.configDetails ? data.configDetails : '',
      isActive: data.isActive
    });

    return stoneTypeDetails;
  }
}
