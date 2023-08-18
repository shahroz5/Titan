import {
  PayerBankDetails,
  PayerBankMasterResponse,
  FileResponse
} from '@poss-web/shared/models';

export class PayerBankAdaptor {
  static getPayerBanks(data: any): PayerBankMasterResponse {
    let payerBanksResponse: PayerBankMasterResponse = null;
    const payerBanksList: PayerBankDetails[] = [];
    for (const listItem of data.results) {
      payerBanksList.push({
        bankName: listItem.bankName,
        isActive: listItem.isActive
      });
    }
    payerBanksResponse = {
      payerBanks: payerBanksList,
      totalElements: data.totalElements
    };

    return payerBanksResponse;
  }
  static getSearchResult(data: any): PayerBankDetails[] {
    const payerBanksList: PayerBankDetails[] = [];
    for (const listItem of data.results) {
      payerBanksList.push({
        bankName: listItem.bankName,
        isActive: listItem.isActive
      });
    }

    return payerBanksList;
  }
  static getFileResponse(data: any): FileResponse {
    const fileResponse: FileResponse = {
      totalCount: data.records?.totalCount,
      successCount: data.records?.successCount,
      failureCount: data.records?.failureCount,
      errorLogId: data.fileId,
      hasError: data.fileValidationError,
      message: data.message,
      records: data.records,
      errors: data?.errors,
      uploadType: data.uploadType
    };

    return fileResponse;
  }
}
