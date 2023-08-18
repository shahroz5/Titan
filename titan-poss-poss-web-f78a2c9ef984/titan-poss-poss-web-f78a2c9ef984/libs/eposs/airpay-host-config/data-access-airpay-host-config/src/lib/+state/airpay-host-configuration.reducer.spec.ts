import {
  AirpayHostSuccessList,
  ConfigListingPayload,
  SortItem,
  FileUploadResponse
} from '@poss-web/shared/models';

import { AirpayHostConfigurationState } from './airpay-host-configuration.state';
import {
  AirpayHostConfigurationReducer,
  initialState
} from './airpay-host-configuration.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  // FileUpload,
  // FileUploadSuccess,
  // FileUploadFailure,
  ResetResponse,
  GetHostNameList,
  GetHostNameListFailure,
  GetHostNameListSuccess
  // ErrorLogDownload,
  // ErrorLogDownloadSuccess,
  // ErrorLogDownloadFailure
} from './airpay-host-configuration.actions';

describe('Unipay Access Mapping Reducer Testing Suite', () => {
  const formData: FormData = new FormData();
  const uploadResponse: FileUploadResponse = {
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

  const airpayHostConfigurationList1: AirpayHostSuccessList = {
    hostList: [
      {
        hostName: 'airpay',
        id: '123',
        isActive: true,
        locationCode: '123',
        newlyAdded: true,
        paymentCode: 'airpay'
      }
    ],
    count: 1
  };

  const airpayHostConfigurationList2: AirpayHostSuccessList = {
    hostList: [
      {
        hostName: 'airpay',
        id: '456',
        isActive: true,
        locationCode: '123',
        newlyAdded: true,
        paymentCode: 'airpay'
      }
    ],
    count: 1
  };

  const accesslistartArray = [
    airpayHostConfigurationList1,
    airpayHostConfigurationList2
  ];

  it('should return the initial state', () => {
    const action: any = {};
    const state = AirpayHostConfigurationReducer(null, action);

    expect(initialState).toBe(initialState);
  })

  // describe('Testing FileUpload Functionality', () => {
  //   it('FileUpload should be called', () => {
  //     const action = new FileUpload(formData);
  //     const result: AirpayHostConfigurationState = AirpayHostConfigurationReducer(
  //       initialState,
  //       action
  //     );
  //     expect(result.isLoading).toEqual(true);
  //     expect(result.hasError).toEqual(null);
  //     expect(result.updatedHostNameList.length).toBe(0);
  //   });

  //   it('FileUploadSuccess should be called', () => {
  //     const action = new FileUploadSuccess(uploadResponse);
  //     const result: AirpayHostConfigurationState = AirpayHostConfigurationReducer(
  //       initialState,
  //       action
  //     );
  //     expect(result.isLoading).toEqual(false);
  //     expect(result.hasError).toEqual(null);
  //   });
  //   it('FileUploadFailure should be called', () => {
  //     const action = new FileUploadFailure(
  //       CustomErrorAdaptor.fromJson(Error('Some Error'))
  //     );

  //     const result: AirpayHostConfigurationState = AirpayHostConfigurationReducer(
  //       initialState,
  //       action
  //     );
  //     expect(result.isLoading).toEqual(false);
  //     expect(result.hasError.message).toEqual('Some Error');
  //   });
  // });

  // describe('Testing ErrorLogDownload Functionality', () => {
  //   it('ErrorLogDownload should be called', () => {
  //     const action = new ErrorLogDownload('');
  //     const result: AirpayHostConfigurationState = AirpayHostConfigurationReducer(
  //       initialState,
  //       action
  //     );
  //     expect(result.isLoading).toEqual(true);
  //     expect(result.hasError).toEqual(null);
  //     expect(result.updatedHostNameList.length).toBe(0);
  //   });

  //   it('ErrorLogDownloadSuccess should be called', () => {
  //     const action = new ErrorLogDownloadSuccess({});
  //     const result: AirpayHostConfigurationState = AirpayHostConfigurationReducer(
  //       initialState,
  //       action
  //     );
  //     expect(result.isLoading).toEqual(false);
  //     expect(result.hasError).toEqual(null);
  //     expect(result.errorLog).toBeTruthy(0);
  //   });
  //   it('ErrorLogDownloadFailure should be called', () => {
  //     const action = new ErrorLogDownloadFailure(
  //       CustomErrorAdaptor.fromJson(Error('Some Error'))
  //     );

  //     const result: AirpayHostConfigurationState = AirpayHostConfigurationReducer(
  //       initialState,
  //       action
  //     );
  //     expect(result.isLoading).toEqual(false);
  //     expect(result.hasError.message).toEqual('Some Error');
  //   });
  // });

  describe('Testing GetHostNameList Functionality', () => {
    it('GetHostNameList should be called', () => {
      const action = new GetHostNameList(configListingPayload, sortField);
      const result: AirpayHostConfigurationState = AirpayHostConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('GetHostNameListSuccess should be called', () => {
      const action = new GetHostNameListSuccess(airpayHostConfigurationList1);
      const result: AirpayHostConfigurationState = AirpayHostConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.hostNameList).toBeTruthy();
    });
    it('GetHostNameListFailure should be called', () => {
      const action = new GetHostNameListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: AirpayHostConfigurationState = AirpayHostConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing ResetResponse Functionality', () => {
    it('GetHostNameList should be called', () => {
      const action = new ResetResponse();
      const result: AirpayHostConfigurationState = AirpayHostConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });
  });
});
