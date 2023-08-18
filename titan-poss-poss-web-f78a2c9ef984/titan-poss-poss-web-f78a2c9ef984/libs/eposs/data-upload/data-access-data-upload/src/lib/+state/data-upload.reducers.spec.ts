import { CustomErrors, NewFileUploadResponse } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { initialState, dataUploadReducer } from './data-upload.reducers';
import * as actions from './data-upload.actions';
import { DataUploadState } from './data-upload.state';

describe('Data Upload Reducer Testing Suite', () => {
  let testState = initialState;

  describe('Actions should update state properly', () => {
    const file = new FormData();

    const fileUploadResponse: NewFileUploadResponse = {
      fileId: '37ac5682-87ae-4766-a72d-172c59e3eaf7',
      message: 'SUCCESS',
      uploadType: 'async',
      hasError: false
    };

    const responseSuccess: boolean = true;

    it('should return the initial state', () => {
      const action: any = {};
      const state: DataUploadState = dataUploadReducer(undefined, action);
      expect(state).toBe(testState);
    });

    it('FIRFileUpload action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.FIRFileUpload(file);
      const result: DataUploadState = dataUploadReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('FIRFileUploadSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        FIRFileUploadResponse: fileUploadResponse
      };
      const action = new actions.FIRFileUploadSuccess(fileUploadResponse);
      const result: DataUploadState = dataUploadReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.FIRFileUploadResponse).toBe(fileUploadResponse);
    });

    it('FIRFileUploadFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.FIRFileUploadFailure(payload);

      const result: DataUploadState = dataUploadReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('MERFileUpload action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.MERFileUpload(file);
      const result: DataUploadState = dataUploadReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('MERFileUploadSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        MERFileUploadResponse: fileUploadResponse
      };
      const action = new actions.MERFileUploadSuccess(fileUploadResponse);
      const result: DataUploadState = dataUploadReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.MERFileUploadResponse).toBe(fileUploadResponse);
    });

    it('MERFileUploadFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.MERFileUploadFailure(payload);

      const result: DataUploadState = dataUploadReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('InvoiceUpload action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.InvoiceUpload();
      const result: DataUploadState = dataUploadReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('InvoiceUploadSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        invoiceUploadResponse: responseSuccess
      };
      const action = new actions.InvoiceUploadSuccess(responseSuccess);
      const result: DataUploadState = dataUploadReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.invoiceUploadResponse).toBe(responseSuccess);
    });

    it('InvoiceUploadFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.InvoiceUploadFailure(payload);

      const result: DataUploadState = dataUploadReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('STNUpload action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.STNUpload();
      const result: DataUploadState = dataUploadReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('STNUploadSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        STNUploadResponse: responseSuccess
      };
      const action = new actions.STNUploadSuccess(responseSuccess);
      const result: DataUploadState = dataUploadReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.STNUploadResponse).toBe(responseSuccess);
    });

    it('STNUploadFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.STNUploadFailure(payload);

      const result: DataUploadState = dataUploadReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('ResetResponse', () => {
      const action = new actions.ResetResponse();
      const newState = {
        ...testState,
        FIRFileUploadResponse: fileUploadResponse,
        MERFileUploadResponse: fileUploadResponse,
        invoiceUploadResponse: true,
        STNUploadResponse: true,
        hasError: null,
        isLoading: true
      };
      const result: DataUploadState = dataUploadReducer(newState, action);
      expect(result.FIRFileUploadResponse).toEqual(null);
      expect(result.MERFileUploadResponse).toEqual(null);
      expect(result.invoiceUploadResponse).toEqual(false);
      expect(result.STNUploadResponse).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.isLoading).toEqual(false);
    });
  });
});
