import {
  ConfigListingPayload,
  SortItem,
  UnipayConfigurationList,
  UploadResponse
} from '@poss-web/shared/models';

import { UnipayConfigurationState } from './unipay-access-mapping.state';
import {
  unipayConfigurationReducer,
  initialState
} from './unipay-access-mapping.reducers';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  FileUpload,
  FileUploadSuccess,
  FileUploadFailure,
  ResetResponse,
  GetAccessList,
  GetAccessListFailure,
  GetAccessListSuccess,
  ErrorLogDownload,
  ErrorLogDownloadSuccess,
  ErrorLogDownloadFailure,
  UnipayConfigurationActionTypes
} from './unipay-access-mapping.actions';

describe('Unipay Access Mapping Reducer Testing Suite', () => {
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

  const configListingPayload: ConfigListingPayload = {
    pageIndex: 0,
    pageSize: 10
  };
  const sortField: SortItem = {
    colId: '',
    sort: 'Desc'
  };

  const unipayConfigurationList1: UnipayConfigurationList = {
    accessList: [
      {
        deviceId: '123',
        hostName: 'unipay',
        id: '123',
        isActive: true,
        locationCode: '123',
        newlyAdded: true,
        paymentCode: 'unipay'
      }
    ],
    count: 1
  };

  const unipayConfigurationList2: UnipayConfigurationList = {
    accessList: [
      {
        deviceId: '456',
        hostName: 'unipay',
        id: '456',
        isActive: true,
        locationCode: '123',
        newlyAdded: true,
        paymentCode: 'unipay'
      }
    ],
    count: 1
  };

  const accesslistartArray = [
    unipayConfigurationList1,
    unipayConfigurationList2
  ];

  describe('Testing FileUpload Functionality', () => {
    it('FileUpload should be called', () => {
      const action = new FileUpload(formData);
      const result: UnipayConfigurationState = unipayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
      expect(result.updatedAccessList.length).toBe(0);
    });

    it('FileUploadSuccess should be called', () => {
      const action = new FileUploadSuccess(uploadResponse);
      const result: UnipayConfigurationState = unipayConfigurationReducer(
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

      const result: UnipayConfigurationState = unipayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing ErrorLogDownload Functionality', () => {
    it('ErrorLogDownload should be called', () => {
      const action = new ErrorLogDownload('');
      const result: UnipayConfigurationState = unipayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
      expect(result.updatedAccessList.length).toBe(0);
    });

    it('ErrorLogDownloadSuccess should be called', () => {
      const action = new ErrorLogDownloadSuccess({});
      const result: UnipayConfigurationState = unipayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.errorLog).toBeTruthy(0);
    });
    it('ErrorLogDownloadFailure should be called', () => {
      const action = new ErrorLogDownloadFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: UnipayConfigurationState = unipayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing GetAccessList Functionality', () => {
    it('GetAccessList should be called', () => {
      const action = new GetAccessList(configListingPayload, sortField);
      const result: UnipayConfigurationState = unipayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('GetAccessListSuccess should be called', () => {
      const action = new GetAccessListSuccess(unipayConfigurationList1);
      const result: UnipayConfigurationState = unipayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.accessList).toBeTruthy();
    });
    it('GetAccessListFailure should be called', () => {
      const action = new GetAccessListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: UnipayConfigurationState = unipayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing ResetResponse Functionality', () => {
    it('GetAccessList should be called', () => {
      const action = new ResetResponse();
      const result: UnipayConfigurationState = unipayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });
  });
});
