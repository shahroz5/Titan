import {
  UploadResponse,
  AccessList,
  UpdatedAccessList,
  PaymentHosts,
  UnipayConfigurationList,
  FileUploadResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
export class UnipayAccessMappingAdaptor {
  static unipayUploadFileResponse(data: any): FileUploadResponse {

      let fileResponse: FileUploadResponse;
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

  static unipayAccessList(data: any): UnipayConfigurationList {
    const accessList: AccessList[] = [];

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

  static updateAccessList(data: any): UpdatedAccessList {
    const paymentHosts: PaymentHosts[] = [];
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
