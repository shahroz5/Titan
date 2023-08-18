import {
  CustomErrors,
  AirpayHostSuccessList,
  ListingPayload,
  SortItem,
  HostFileUploadResponse
} from '@poss-web/shared/models';
import {
  AirpayHostConfigurationActionTypes,
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
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
const formData: FormData = new FormData();
const uploadResponse: HostFileUploadResponse = {
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

const configListingPayload: ListingPayload = {
  pageIndex: 0,
  pageSize: 10
};
const sortField: SortItem = {
  colId: '',
  sort: 'Desc'
};

const unipayConfigurationList: AirpayHostSuccessList = {
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

describe('Aipay Host Action Testing Suite', () => {
  // describe('FileUpload Action Test Cases', () => {
  //   it('should check correct type is used for  FileUpload action ', () => {
  //     const action = new FileUpload(formData);

  //     expect(action.type).toEqual(
  //       AirpayHostConfigurationActionTypes.FILE_UPLOAD
  //     );

  //     expect(action.payload).toEqual(formData);
  //   });
  //   it('should check correct type is used for FileUploadSuccess action ', () => {
  //     const action = new FileUploadSuccess(uploadResponse);

  //     expect(action.type).toEqual(
  //       AirpayHostConfigurationActionTypes.FILE_UPLOAD_SUCCESS
  //     );
  //     expect(action.payload).toEqual(uploadResponse);
  //   });
  //   it('should check correct type is used for FileUploadFailure action ', () => {
  //     const payload: CustomErrors = CustomErrorAdaptor.fromJson(
  //       Error('Some Error')
  //     );
  //     const action = new FileUploadFailure(payload);

  //     expect(action.type).toEqual(
  //       AirpayHostConfigurationActionTypes.FILE_UPLOAD_FAILURE
  //     );
  //     expect(action.payload).toEqual(payload);
  //   });
  // });

  describe('GetHostNameList Action Test Cases', () => {
    it('should check correct type is used for  GetHostNameList action ', () => {
      const action = new GetHostNameList(configListingPayload, sortField);

      expect(action.type).toEqual(
        AirpayHostConfigurationActionTypes.GET_HOSTNAME_LIST
      );

      expect(action.payload).toEqual(configListingPayload, sortField);
    });

    it('should check correct type is used for GetHostNameListSuccess action ', () => {
      const action = new GetHostNameListSuccess(unipayConfigurationList);

      expect(action.type).toEqual(
        AirpayHostConfigurationActionTypes.GET_HOSTNAME_LIST_SUCCESS
      );
      expect(action.payload).toEqual(unipayConfigurationList);
    });
    it('should check correct type is used for GetHostNameListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetHostNameListFailure(payload);

      expect(action.type).toEqual(
        AirpayHostConfigurationActionTypes.GET_HOSTNAME_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  // describe('ErrorLogDownload Action Test Cases', () => {
  //   it('should check correct type is used for  ErrorLogDownload action ', () => {
  //     const action = new ErrorLogDownload('');

  //     expect(action.type).toEqual(
  //       AirpayHostConfigurationActionTypes.ERROR_LOG_DOWNLOAD
  //     );

  //     expect(action.payload).toEqual('');
  //   });

  //   it('should check correct type is used for ErrorLogDownloadSuccess action ', () => {
  //     const action = new ErrorLogDownloadSuccess({});

  //     expect(action.type).toEqual(
  //       AirpayHostConfigurationActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS
  //     );
  //     expect(action.payload).toEqual({});
  //   });
  //   it('should check correct type is used for ErrorLogDownloadFailure action ', () => {
  //     const payload: CustomErrors = CustomErrorAdaptor.fromJson(
  //       Error('Some Error')
  //     );
  //     const action = new ErrorLogDownloadFailure(payload);

  //     expect(action.type).toEqual(
  //       AirpayHostConfigurationActionTypes.ERROR_LOG_DOWNLOAD_FAILURE
  //     );
  //     expect(action.payload).toEqual(payload);
  //   });
  // });

  describe('ResetResponse Action Test Cases', () => {
    it('should check correct type is used for  ResetResponse action ', () => {
      const action = new ResetResponse();

      expect(action.type).toEqual(
        AirpayHostConfigurationActionTypes.RESET_RESPONSE
      );
    });
  });
});
