import {
  CustomErrors,
  FileResponse,
  PayerBankMasterResponse,
  PayerBanksPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ErrorLogDownload,
  ErrorLogDownloadFailure,
  ErrorLogDownloadSuccess,
  FileUpload,
  FileUploadFailure,
  FileUploadSuccess,
  LoadPayerBanks,
  LoadPayerBanksFailure,
  LoadPayerBanksSuccess,
  PayerBankActionTypes,
  ResetFileData,
  SearchPayerBank,
  SearchPayerBankFailure,
  SearchPayerBankSuccess
} from './payer-bank.actions';

describe('PayerBankFacade Testing Suite', () => {
  const payerBanksListing: PayerBankMasterResponse = {
    payerBanks: [
      {
        bankName: 'AXIS',
        isActive: true
      }
    ],
    totalElements: 1
  };
  const fileResponse: FileResponse = {
    totalCount: 2,
    successCount: 2,
    failureCount: 2,
    errorLogId: 12,
    hasError: true
  };
  describe('PayerBankListing Actions Test Cases', () => {
    it('should check correct type is used for  LoadPayerBanks action ', () => {
      const payload: PayerBanksPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPayerBanks(payload);

      expect(action.type).toEqual(PayerBankActionTypes.LOAD_PAYER_BANKS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadPayerBanksSuccess action ', () => {
      const action = new LoadPayerBanksSuccess(payerBanksListing);

      expect(action.type).toEqual(
        PayerBankActionTypes.LOAD_PAYER_BANKS_SUCCESS
      );
      expect(action.payload).toEqual(payerBanksListing);
    });
    it('should check correct type is used for  LoadPayerBanksFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPayerBanksFailure(payload);

      expect(action.type).toEqual(
        PayerBankActionTypes.LOAD_PAYER_BANKS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SearchPayerBank Action Test Cases', () => {
    it('should check correct type is used for  SearchPayerBank action ', () => {
      const action = new SearchPayerBank('Axis');
      expect(action.type).toEqual(PayerBankActionTypes.SEARCH_PAYER_BANK);
      expect(action.payload).toEqual('Axis');
    });
    it('should check correct type is used for  SearchPayerBankSuccess action ', () => {
      const action = new SearchPayerBankSuccess(payerBanksListing.payerBanks);
      expect(action.type).toEqual(
        PayerBankActionTypes.SEARCH_PAYER_BANK_SUCCESS
      );
      expect(action.payload).toEqual(payerBanksListing.payerBanks);
    });
    it('should check correct type is used for  SearchPayerBankFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchPayerBankFailure(payload);

      expect(action.type).toEqual(
        PayerBankActionTypes.SEARCH_PAYER_BANK_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ResetPayerBank Action Testcase', () => {
    it('should check correct type is used for  ResetFileData action ', () => {
      const action = new ResetFileData();
      expect(action.type).toEqual(PayerBankActionTypes.RESET_FILE_DATA);
    });
  });
  describe('FileUpload Action Test Cases', () => {
    it('should check correct type is used for  FileUpload action ', () => {
      const action = new FileUpload(null);
      expect(action.type).toEqual(PayerBankActionTypes.FILE_UPLOAD);
      expect(action.payload).toEqual(null);
    });
    it('should check correct type is used for  FileUploadSuccess action ', () => {
      const action = new FileUploadSuccess(fileResponse);
      expect(action.type).toEqual(PayerBankActionTypes.FILE_UPLOAD_SUCCESS);
      expect(action.payload).toEqual(fileResponse);
    });
    it('should check correct type is used for  FileUploadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FileUploadFailure(payload);

      expect(action.type).toEqual(PayerBankActionTypes.FILE_UPLOAD_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ErrorLog Actions Test Cases', () => {
    it('should check correct type is used for ErrorLogDownload action ', () => {
      const action = new ErrorLogDownload('123');
      expect(action.type).toEqual(PayerBankActionTypes.ERROR_LOG_DOWNLOAD);
      expect(action.payload).toEqual('123');
    });
    it('should check correct type is used for ErrorLogDownloadSuccess action ', () => {
      const action = new ErrorLogDownloadSuccess({});
      expect(action.type).toEqual(
        PayerBankActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS
      );
      expect(action.payload).toEqual({});
    });
    it('should check correct type is used for  ErrorLogDownloadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ErrorLogDownloadFailure(payload);

      expect(action.type).toEqual(
        PayerBankActionTypes.ERROR_LOG_DOWNLOAD_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
