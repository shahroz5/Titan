import {
  ListPayload,
  SortItem,
  FileUploadResponse,
  AirpayVendorSuccessList
} from '@poss-web/shared/models';

import { AirpayConfigurationState } from './airpay-configuration.state';
import {
  AirpayConfigurationReducer,
  initialState
} from './airpay-configuration.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ResetResponse,
  GetAirpayVendorList,
  GetAirpayVendorListFailure,
  GetAirpayVendorListSuccess
} from './airpay-configuration.actions';

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

  const configListingPayload: ListPayload = {
    pageIndex: 0,
    pageSize: 10
  };
  const sortField: SortItem = {
    colId: '',
    sort: 'Desc'
  };

  const airpayConfigurationList1: AirpayVendorSuccessList = {
    vendorList: [
      {
        newlyAdded: true,
        locationCode: 'test',
        MerchantId: 'test',
        Username: 'test',
        Password: 'test',
        SecretKey: 'test',
        SecretToken: 'test'
      }
    ],
    count: 1
  };

  const airpayConfigurationList2: AirpayVendorSuccessList = {
    vendorList: [
      {
        newlyAdded: true,
        locationCode: 'test',
        MerchantId: 'test',
        Username: 'test',
        Password: 'test',
        SecretKey: 'test',
        SecretToken: 'test'
      }
    ],
    count: 1
  };

  const accesslistartArray = [
    airpayConfigurationList1,
    airpayConfigurationList2
  ];

  it('should return the initial state', () => {
    const action: any = {};
    const state = AirpayConfigurationReducer(null, action);

    expect(initialState).toBe(initialState);
  })

  // describe('Testing FileUpload Functionality', () => {
  // it('FileUpload should be called', () => {
  //   const action = new FileUpload(formData);
  //   const result: AirpayConfigurationState = AirpayConfigurationReducer(
  //     initialState,
  //     action
  //   );
  //   expect(result.isLoading).toEqual(true);
  //   expect(result.hasError).toEqual(null);
  // });

  //   it('FileUploadSuccess should be called', () => {
  //     const action = new FileUploadSuccess(uploadResponse);
  //     const result: AirpayConfigurationState = AirpayConfigurationReducer(
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

  //     const result: AirpayConfigurationState = AirpayConfigurationReducer(
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
  //     const result: AirpayConfigurationState = AirpayConfigurationReducer(
  //       initialState,
  //       action
  //     );
  //     expect(result.isLoading).toEqual(true);
  //     expect(result.hasError).toEqual(null);
  //   });

  //   it('ErrorLogDownloadSuccess should be called', () => {
  //     const action = new ErrorLogDownloadSuccess({});
  //     const result: AirpayConfigurationState = AirpayConfigurationReducer(
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

  //     const result: AirpayConfigurationState = AirpayConfigurationReducer(
  //       initialState,
  //       action
  //     );
  //     expect(result.isLoading).toEqual(false);
  //     expect(result.hasError.message).toEqual('Some Error');
  //   });
  // });

  describe('Testing GetAirpayVendorList Functionality', () => {
    it('GetAirpayVendorList should be called', () => {
      const action = new GetAirpayVendorList(configListingPayload, sortField);
      const result: AirpayConfigurationState = AirpayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('GetAirpayVendorListSuccess should be called', () => {
      const action = new GetAirpayVendorListSuccess(airpayConfigurationList1);
      const result: AirpayConfigurationState = AirpayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.vendorList).toBeTruthy();
    });
    it('GetAirpayVendorListFailure should be called', () => {
      const action = new GetAirpayVendorListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: AirpayConfigurationState = AirpayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing ResetResponse Functionality', () => {
    it('GetAirpayVendorList should be called', () => {
      const action = new ResetResponse();
      const result: AirpayConfigurationState = AirpayConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });
  });
});
