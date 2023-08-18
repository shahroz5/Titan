import {
  ConfigListingPayload,
  CustomErrors,
  SortItem,
  UnipayConfigurationList,
  UploadResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
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

const unipayConfigurationList: UnipayConfigurationList = {
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

describe('Unipay Acees Mapping Action Testing Suite', () => {
  describe('FileUpload Action Test Cases', () => {
    it('should check correct type is used for  FileUpload action ', () => {
      const action = new FileUpload(formData);

      expect(action.type).toEqual(UnipayConfigurationActionTypes.FILE_UPLOAD);

      expect(action.payload).toEqual(formData);
    });
    it('should check correct type is used for FileUploadSuccess action ', () => {
      const action = new FileUploadSuccess(uploadResponse);

      expect(action.type).toEqual(
        UnipayConfigurationActionTypes.FILE_UPLOAD_SUCCESS
      );
      expect(action.payload).toEqual(uploadResponse);
    });
    it('should check correct type is used for FileUploadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FileUploadFailure(payload);

      expect(action.type).toEqual(
        UnipayConfigurationActionTypes.FILE_UPLOAD_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('GetAccessList Action Test Cases', () => {
    it('should check correct type is used for  GetAccessList action ', () => {
      const action = new GetAccessList(configListingPayload, sortField);

      expect(action.type).toEqual(
        UnipayConfigurationActionTypes.GET_ACCESS_LIST
      );

      expect(action.payload).toEqual(configListingPayload, sortField);
    });

    it('should check correct type is used for GetAccessListSuccess action ', () => {
      const action = new GetAccessListSuccess(unipayConfigurationList);

      expect(action.type).toEqual(
        UnipayConfigurationActionTypes.GET_ACCESS_LIST_SUCCESS
      );
      expect(action.payload).toEqual(unipayConfigurationList);
    });
    it('should check correct type is used for GetAccessListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetAccessListFailure(payload);

      expect(action.type).toEqual(
        UnipayConfigurationActionTypes.GET_ACCESS_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ErrorLogDownload Action Test Cases', () => {
    it('should check correct type is used for  ErrorLogDownload action ', () => {
      const action = new ErrorLogDownload('');

      expect(action.type).toEqual(
        UnipayConfigurationActionTypes.ERROR_LOG_DOWNLOAD
      );

      expect(action.payload).toEqual('');
    });

    it('should check correct type is used for ErrorLogDownloadSuccess action ', () => {
      const action = new ErrorLogDownloadSuccess({});

      expect(action.type).toEqual(
        UnipayConfigurationActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS
      );
      expect(action.payload).toEqual({});
    });
    it('should check correct type is used for ErrorLogDownloadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ErrorLogDownloadFailure(payload);

      expect(action.type).toEqual(
        UnipayConfigurationActionTypes.ERROR_LOG_DOWNLOAD_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ResetResponse Action Test Cases', () => {
    it('should check correct type is used for  ResetResponse action ', () => {
      const action = new ResetResponse();

      expect(action.type).toEqual(
        UnipayConfigurationActionTypes.RESET_RESPONSE
      );
    });
  });
});
