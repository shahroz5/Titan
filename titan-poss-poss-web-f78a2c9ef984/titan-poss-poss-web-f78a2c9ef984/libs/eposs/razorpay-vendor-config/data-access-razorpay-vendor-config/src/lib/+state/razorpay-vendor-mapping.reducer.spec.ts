import * as actions from './razorpay-vendor-mapping.actions';
import { RazorpayVendorConfigurationState } from './razorpay-vendor-mapping.state';
import {
  initialState as istate,
  razorpayVendorConfigurationReducer
} from './razorpay-vendor-mapping.reducers';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ConfigListingPayload,
  RazorpayVendorSuccessList,
  SortItem,
  UploadResponse
} from '@poss-web/shared/models';
import { FileUpload, FileUploadFailure, FileUploadSuccess } from './razorpay-vendor-mapping.actions';

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
  const initialState: RazorpayVendorConfigurationState = { ...istate };

  describe('Testing ErrorLogDownload Functionality', () => {
    it('ErrorLogDownload should be called', () => {
      const payload = '';
      const action = new actions.ErrorLogDownload(payload);

      const result: RazorpayVendorConfigurationState = razorpayVendorConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
    });
    it('ErrorLogDownloadSuccess should return details', () => {
      const payload = '';

      const action = new actions.ErrorLogDownloadSuccess(payload);
      const result: RazorpayVendorConfigurationState = razorpayVendorConfigurationReducer(
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

      const result: RazorpayVendorConfigurationState = razorpayVendorConfigurationReducer(
        initialState,
        action
      );

      expect(result.hasError.message).toEqual('some error');
    });
  });

  describe('Testing GetVendorList Functionality', () => {
    it('GetVendorList should be called', () => {
      const payload: ConfigListingPayload = {
        pageIndex: 0,
        pageSize: 1
      };
      const sortField: SortItem = {
        colId: '0',
        sort: '1'
      };
      const locationCode: string = '';
      const action = new actions.GetVendorList(
        payload,
        sortField,
        locationCode
      );

      const result: RazorpayVendorConfigurationState = razorpayVendorConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
    });
    it('GetVendorListSuccess should return details', () => {
      const payload: RazorpayVendorSuccessList = {
        count: 0,
        vendorList: [
          {
            accountId: '1',
            locationCode: 'A',
            newlyAdded: true
          }
        ]
      };

      const action = new actions.GetVendorListSuccess(payload);
      const result: RazorpayVendorConfigurationState = razorpayVendorConfigurationReducer(
        initialState,
        action
      );

      expect(result.vendorList).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('GetVendorListFailure should return error', () => {
      const action = new actions.GetVendorListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: RazorpayVendorConfigurationState = razorpayVendorConfigurationReducer(
        initialState,
        action
      );

      expect(result.hasError.message).toEqual('some error');
    });
  });

  describe('Testing ResetResponse Functionality', () => {
    it('ResetResponse should be called', () => {
      const action = new actions.ResetResponse();

      const result: RazorpayVendorConfigurationState = razorpayVendorConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing FileUpload Functionality', () => {
    it('FileUpload should be called', () => {
      const action = new FileUpload(formData);
      const result: RazorpayVendorConfigurationState = razorpayVendorConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
      expect(result.updatedVendorList.length).toBe(0);
    });

    it('FileUploadSuccess should be called', () => {
      const action = new FileUploadSuccess(uploadResponse);
      const result: RazorpayVendorConfigurationState = razorpayVendorConfigurationReducer(
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

      const result: RazorpayVendorConfigurationState = razorpayVendorConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

});
