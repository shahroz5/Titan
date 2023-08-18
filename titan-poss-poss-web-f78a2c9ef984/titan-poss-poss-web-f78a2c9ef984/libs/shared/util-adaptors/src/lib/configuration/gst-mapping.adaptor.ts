import {
  GSTMappingDetails,
  Tax,
  FileUploadResponse
} from '@poss-web/shared/models';

export class GSTMappingAdaptor {
  static getGSTMappingDetails(data: any): GSTMappingDetails {
    return {
      isActive: data.isActive,
      applicableTax: data.applicableTax,
      customerTaxType: data.customerTaxType,
      destLocationApplicableTax: data.destLocationApplicableTax,
      destLocationTaxType: data.destLocationTaxType,
      isSameState: data.isSameState,
      srcLocationApplicableTax: data.srcLocationApplicableTax,
      srcLocationTaxType: data.srcLocationTaxType,
      srcTaxApplicable: data.srcTaxApplicable,
      txnType: data.txnType,
      id: data.id
    };
  }

  static getTaxDetails(data: any): Tax {
    return {
      taxCode: data.taxCode,
      description: data.taxCode
    };
  }

  static getFileUploadResponse(data: any) {
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
}
