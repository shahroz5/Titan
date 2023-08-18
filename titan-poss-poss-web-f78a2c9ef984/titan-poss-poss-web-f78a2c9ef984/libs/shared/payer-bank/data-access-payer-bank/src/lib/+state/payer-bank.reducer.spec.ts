import {
  FileResponse,
  PayerBankMasterResponse,
  PayerBanksPayload
} from '@poss-web/shared/models';
import { PayerBankState } from './payer-bank.state';
import * as actions from './payer-bank.actions';
import { PayerBankReducer } from './payer-bank.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
describe('PayerBankReducer Testing Suite', () => {
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
  const initialState: PayerBankState = {
    error: null,
    bankDetails: [],
    isLoading: false,
    totalElements: 0,
    fileResponse: null,
    errorLog: null
  };
  describe('Testing LoadPayerBanks', () => {
    beforeEach(() => {});
    it('LoadPayerBanks should return proper state', () => {
      const payload: PayerBanksPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadPayerBanks(payload);
      const result: PayerBankState = PayerBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadPayerBanksSuccess should return success response', () => {
      const action = new actions.LoadPayerBanksSuccess(payerBanksListing);

      const result: PayerBankState = PayerBankReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.bankDetails).toBe(payerBanksListing.payerBanks);
      expect(result.totalElements).toBe(payerBanksListing.totalElements);
    });
    it('LoadPayerBanksFailure should return error', () => {
      const action = new actions.LoadPayerBanksFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PayerBankState = PayerBankReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing FileUpload', () => {
    it('FileUpload should return proper state', () => {
      const action = new actions.FileUpload(null);
      const result: PayerBankState = PayerBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('FileUploadSuccess should return proper state', () => {
      const action = new actions.FileUploadSuccess(fileResponse);
      const result: PayerBankState = PayerBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.fileResponse).toBe(fileResponse);
    });
    it('FileUploadFailure should return error', () => {
      const action = new actions.FileUploadFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PayerBankState = PayerBankReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing SearchPayerBank', () => {
    it('SearchPayerBank should return proper state', () => {
      const action = new actions.SearchPayerBank('Axis');
      const result: PayerBankState = PayerBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('SearchPayerBankSuccess should return proper state', () => {
      const action = new actions.SearchPayerBankSuccess(
        payerBanksListing.payerBanks
      );
      const result: PayerBankState = PayerBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.bankDetails).toBe(payerBanksListing.payerBanks);
    });
    it('SearchPayerBankFailure should return error', () => {
      const action = new actions.SearchPayerBankFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PayerBankState = PayerBankReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing ResetFileData', () => {
    it('ResetFileData should return proper state', () => {
      const action = new actions.ResetFileData();
      const result: PayerBankState = PayerBankReducer(initialState, action);
      expect(result.error).toBe(null);
      expect(result.fileResponse).toBe(null);
      //expect(result.bankDetails).toBe([]);
    });
  });
  describe('Testing ErrorLogDownload', () => {
    it('ErrorLogDownload should return proper state', () => {
      const action = new actions.ErrorLogDownload('123');
      const result: PayerBankState = PayerBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('ErrorLogDownloadSuccess should return proper state', () => {
      const action = new actions.ErrorLogDownloadSuccess(null);
      const result: PayerBankState = PayerBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.errorLog).toBe(null);
    });
    it('ErrorLogDownloadFailure should return error', () => {
      const action = new actions.ErrorLogDownloadFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PayerBankState = PayerBankReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
});
