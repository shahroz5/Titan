import {
  CatchmentDetails,
  LoadCatchmentListingSuccessPayload
} from '@poss-web/shared/models';

export class CatchmentAdaptor {
  static getCatchmentListing(data: any): LoadCatchmentListingSuccessPayload {
    const catchmentDetails: CatchmentDetails[] = [];
    for (const listItem of data.results) {
      catchmentDetails.push({
        catchmentCode: listItem.catchmentCode,
        description: listItem.description,
        isActive: listItem.isActive
      });
    }

    const catchmentListing: LoadCatchmentListingSuccessPayload = {
      catchmentListing: catchmentDetails,
      totalElements: data.totalElements
    };

    return catchmentListing;
  }
  static getCatchmentDetails(data: any): CatchmentDetails {
    const catchmentDetails: CatchmentDetails = {
      catchmentCode: data.catchmentCode,
      description: data.description,
      isActive: data.isActive,
      isEditable: data.isEditable
    };

    return catchmentDetails;
  }
}
