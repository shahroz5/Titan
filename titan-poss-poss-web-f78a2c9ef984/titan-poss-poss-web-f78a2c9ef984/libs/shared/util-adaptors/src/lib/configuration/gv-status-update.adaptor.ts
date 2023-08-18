import {
  UploadResponse,
  UpdatedAccessList,
  PaymentHosts,
  GVStatusUpdateList,
  GvStatusList,
  FileUploadResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
export class GVStatusUpdateAdaptor {
  static gvStatusUploadFileResponse(data: any): UploadResponse {
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

  static gvStatusUpdateList(data: any): GVStatusUpdateList {
    const gvStatusList: GvStatusList[] = [];

    if (!data) {
      return null;
    }

    data.results.forEach(element => {
      gvStatusList.push({
        activationDate: element.activationDate,
        denomination: element.denomination,
        newlyAdded:
          moment().diff(moment(element.lastModifiedDate), 'seconds') < 60
            ? true
            : false,

        excludes: element.excludes ? element.excludes : [],
        extendCount: element.extendCount,
        giftCode: element.giftCode,
        giftDetails: element.giftDetails,
        indentNo: element.indentNo,
        mfgDate: element.mfgDate,
        quantity: element.quantity,
        regionCode: element.regionCode,
        remarks: element.remarks,
        serialNo: element.serialNo,
        status: element.status,
        totalValue: element.totalValue,
        validFrom: element.validFrom ? moment(element.validFrom) : null,
        validTill: element.validTill ? moment(element.validTill) : null,
        validityDays: element.validityDays,
        locationCode: element.locationCode
      });
    });
    //  isActive:{ checked: element.isActive, text: element.isActive?'Active':'In-Active'},
    return { gvStatusList: gvStatusList, count: data.totalElements };
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
