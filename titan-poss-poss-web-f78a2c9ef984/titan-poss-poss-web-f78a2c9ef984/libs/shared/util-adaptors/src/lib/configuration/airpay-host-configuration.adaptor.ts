import {
  HostNameList,
  AirpayHostSuccessList,
  UpdatedHostList,
  HostNames,
  HostFileUploadResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
export class AirpayHostConfigurationAdaptor {
  static getFileUploadResponse(data: any) {
    let fileResponse: HostFileUploadResponse;
    fileResponse = {
      fileId: data.fileId,
      hasError: data.fileValidationError,
      message: data.message,
      records: {
        errorLogId: data.fileId,
        failureCount: data.records?.failureCount,
        successCount: data.records?.successCount,
        totalCount: data.records?.totalCount
      }
    };
    return fileResponse;
  }

  static airpayHostNameList(data: any): AirpayHostSuccessList {
    const hostList: HostNameList[] = [];

    if (!data) {
      return null;
    } else {
      data.results.forEach(element => {
        if (element) {
          hostList.push({
            hostName: element.hostName,
            id: element.id,
            isActive: element.isActive,
            locationCode: element.locationCode,
            paymentCode: element.paymentCode,
            newlyAdded:
              moment().diff(moment(element.createdDate), 'seconds') < 60
                ? true
                : false
          });
        }
      });
      return { hostList: hostList, count: data.totalElements };
    }
  }

  static updateHostNameList(data: any): UpdatedHostList {
    const hostnames: HostNames[] = [];
    if (!data) {
      return null;
    } else {
      data.paymentHostnamesDetails.forEach(element => {
        hostnames.push({
          id: element.id,
          isActive: element.isActive
        });
      });
      return { paymentHostnamesDetails: hostnames };
    }
  }
}
