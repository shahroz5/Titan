import {
  RazorpayUploadResponse,
  RazorpayConfigurationList,
  RazorpayUpdatedAccessList,
  RazorpayPaymentHosts,
  RazorpayAccessList
} from '@poss-web/shared/models';
import * as moment from 'moment';
export class RazorpayAccessMappingAdaptor {
  static razorpayUploadFileResponse(data: any): RazorpayUploadResponse {
    let fileResponse: RazorpayUploadResponse;
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

  static razorpayAccessList(data: any): RazorpayConfigurationList {
    const accessList: RazorpayAccessList[] = [];

    if (!data) {
      return null;
    }

    data.results.forEach(element => {
      accessList.push({
        deviceId: element.deviceId,
        hostName: element.hostName,
        newlyAdded:
          moment().diff(moment(element.createdDate), 'seconds') < 60
            ? true
            : false,

        id: element.id,

        isActive: element.isActive,
        locationCode: element.locationCode,
        paymentCode: element.paymentCode
      });
    });
    //  isActive:{ checked: element.isActive, text: element.isActive?'Active':'In-Active'},
    return { accessList: accessList, count: data.totalElements };
  }

  static updateAccessList(data: any): RazorpayUpdatedAccessList {
    const paymentHosts: RazorpayPaymentHosts[] = [];
    if (!data) {
      return null;
    } else {
      data.paymentHostnamesDetails.forEach(element => {
        paymentHosts.push({
          id: element.id,
          isActive: element.isActive,
          deviceId: element.deviceId
        });
      });
      return {
        paymentHostnamesDetails: paymentHosts
      };
    }
  }
}
