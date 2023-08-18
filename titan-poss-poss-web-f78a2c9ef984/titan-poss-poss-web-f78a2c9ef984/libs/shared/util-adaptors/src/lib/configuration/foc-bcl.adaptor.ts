import {
  FOCBlockingCustomerLevel,
  FOCBlockingCustomerLevelListResponse
} from '@poss-web/shared/models';

export class FOCBlockingAtCustomerLevelAdaptor {
  static FocBlockingCustomerLevelList(
    data: any
  ): FOCBlockingCustomerLevelListResponse {
    let focBlockingLocationList: FOCBlockingCustomerLevelListResponse;
    const focBlockingList: FOCBlockingCustomerLevel[] = [];
    for (const locationList of data.results) {
      focBlockingList.push({
        locationCode: locationList?.locationCode,
        description: locationList?.description,
        fromDate: locationList?.startDate,
        toDate: locationList?.endDate,
        approvedBy: locationList?.configDetails?.data.approvedBy,
        isCMMandatory: locationList?.configDetails?.data.isCMNumber,
        remarks: locationList?.configDetails?.data.remarks,
        isActive: locationList.status,
        mobileNumber: locationList.mobileNo,
        id: locationList.id,
        focItemCode: locationList?.configDetails?.data.focItemCode,
        quantity: locationList?.configDetails?.data.quantity
      });
    }
    focBlockingLocationList = {
      response: focBlockingList,
      totalElements: data.totalElements
    };
    return focBlockingLocationList;
  }

  static SearchLocationCode(data: any): FOCBlockingCustomerLevel[] {
    const focBlockingList: FOCBlockingCustomerLevel[] = [];
    for (const locationList of data.results) {
      console.log('locations', locationList);
      focBlockingList.push({
        locationCode: locationList.locationCode,
        description: locationList.description,
        fromDate: locationList.startDate,
        toDate: locationList.endDate,
        approvedBy: locationList?.configDetails?.data.approvedBy,
        isCMMandatory: locationList?.configDetails?.data.isCMNumber,
        remarks: locationList?.configDetails?.data.remarks,
        isActive: locationList.status,
        mobileNumber: locationList.mobileNo,
        id: locationList.id,
        focItemCode: locationList?.configDetails?.data.focItemCode,
        quantity: locationList?.configDetails?.data.quantity
      });
    }
    return focBlockingList;
  }
}
