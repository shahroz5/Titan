import * as actions from './razorpay-access-mapping.actions';
import { RazorpayConfigurationState } from './razorpay-access-mapping.state';
import {
  initialState as istate,
  razorpayConfigurationReducer
} from './razorpay-access-mapping.reducers';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ConfigListingPayload,
  RazorpayVendorSuccessList,
  SortItem,
  UnipayConfigurationList,
  UploadResponse
} from '@poss-web/shared/models';
import { FileUpload, FileUploadFailure, FileUploadSuccess } from './razorpay-access-mapping.actions';

const formData: FormData = new FormData();
  const uploadResponse: UploadResponse = {
    fileId: 'test123',
    hasError: false,
    message: 'uploaded',
    records: {
      errorLogId: 'abc123',
      failureCount: 0,
      successCount: 1,
      totalCount: 1
    }
  };

describe('GRN Interboutique config Reducer Testing Suite', () => {
  const initialState: RazorpayConfigurationState = { ...istate };

  describe('Testing ErrorLogDownload Functionality', () => {
    it('ErrorLogDownload should be called', () => {
      const payload = '';
      const action = new actions.ErrorLogDownload(payload);

      const result: RazorpayConfigurationState = razorpayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
    });
    it('ErrorLogDownloadSuccess should return details', () => {
      const payload = '';

      const action = new actions.ErrorLogDownloadSuccess(payload);
      const result: RazorpayConfigurationState = razorpayConfigurationReducer(
        initialState,
        action
      );

      expect(result.errorLog).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('ErrorLogDownloadFailure should return error', () => {
      const action = new actions.ErrorLogDownloadFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: RazorpayConfigurationState = razorpayConfigurationReducer(
        initialState,
        action
      );

      expect(result.hasError.message).toEqual('some error');
    });
  });

  describe('Testing GetAccessList Functionality', () => {
    it('GetAccessList should be called', () => {
      const payload: ConfigListingPayload = {
        pageIndex: 0,
        pageSize: 1
      };
      const sortField: SortItem = {
        colId: '0',
        sort: '1'
      };
      const locationCode: string = '';
      const action = new actions.GetAccessList(
        payload,
        sortField,
        locationCode
      );

      const result: RazorpayConfigurationState = razorpayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
    });
    it('GetAccessListSuccess should return details', () => {
      const payload: UnipayConfigurationList = {
        count: 0,
        accessList: [
          {
            deviceId: '1',
            hostName: 'Host Name',
            id: '1',
            isActive: true,
            locationCode: 'Code',
            newlyAdded: true,
            paymentCode: 'Code'
          }
        ]
      };

      const action = new actions.GetAccessListSuccess(payload);
      const result: RazorpayConfigurationState = razorpayConfigurationReducer(
        initialState,
        action
      );

      expect(result.accessList).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('GetAccessListFailure should return error', () => {
      const action = new actions.GetAccessListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: RazorpayConfigurationState = razorpayConfigurationReducer(
        initialState,
        action
      );

      expect(result.hasError.message).toEqual('some error');
    });
  });

  describe('Testing ResetResponse Functionality', () => {
    it('ResetResponse should be called', () => {
      const action = new actions.ResetResponse();

      const result: RazorpayConfigurationState = razorpayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing FileUpload Functionality', () => {
    it('FileUpload should be called', () => {
      const action = new FileUpload(formData);
      const result: RazorpayConfigurationState = razorpayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
      expect(result.updatedAccessList.length).toBe(0);
    });

    it('FileUploadSuccess should be called', () => {
      const action = new FileUploadSuccess(uploadResponse);
      const result: RazorpayConfigurationState = razorpayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });
    it('FileUploadFailure should be called', () => {
      const action = new FileUploadFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: RazorpayConfigurationState = razorpayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });
});
