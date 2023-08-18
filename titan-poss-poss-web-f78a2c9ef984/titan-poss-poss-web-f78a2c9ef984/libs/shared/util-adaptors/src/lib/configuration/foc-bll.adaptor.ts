import {
  CourierSelectedLocations,
  FOCBlockingLocaionLevelListResponse,
  FOCBlockingLocationLevel
} from '@poss-web/shared/models';

export class FOCBlockingLocationLevelAdaptor {
  static FocBlockingLocationLevelList(
    data: any
  ): FOCBlockingLocaionLevelListResponse {
    let focBlockingLocationList: FOCBlockingLocaionLevelListResponse;
    const focBlockingList: FOCBlockingLocationLevel[] = [];
    for (const locationList of data.results) {
      focBlockingList.push({
        locationCode: locationList.locationCode,
        description: locationList.description,
        fromDate: locationList.startDate,
        toDate: locationList.endDate,
        approvedBy: locationList?.configDetails?.data.approvedBy,
        isCMMandatory: locationList?.configDetails?.data.isCMNumber,
        remarks: locationList?.configDetails?.data.remarks,
        isActive: locationList.status,
        id: locationList.id
      });
    }
    focBlockingLocationList = {
      response: focBlockingList,
      totalElements: data.totalElements
    };
    return focBlockingLocationList;
  }
  static getSchemeId(data: any): string {
    return data.id;
  }

  static SearchLocationCode(data: any): FOCBlockingLocationLevel[] {
    const focBlockingList: FOCBlockingLocationLevel[] = [];
    for (const locationList of data.results) {
      focBlockingList.push({
        locationCode: locationList.locationCode,
        description: locationList.description,
        fromDate: locationList.startDate,
        toDate: locationList.endDate,
        approvedBy: locationList?.configDetails?.data.approvedBy,
        isCMMandatory: locationList?.configDetails?.data.isCMNumber,
        remarks: locationList?.configDetails?.data.remarks,
        isActive: locationList.status,
        id: locationList.id
      });
    }
    return focBlockingList;
  }

  static SelectedLocations(data: any): CourierSelectedLocations[] {
    const mappedLocations: CourierSelectedLocations[] = [];
    for (const locationList of data.results) {
      mappedLocations.push({
        id: locationList.locationCode,
        description: locationList.description
      });
    }
    return mappedLocations;
  }
}
