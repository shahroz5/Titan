import {
  ConfigListingPayload,
  CustomErrors,
  RazorpayVendorSuccessList,
  SortItem,
  UploadResponse
} from '@poss-web/shared/models';
import {
  ErrorLogDownload,
  ErrorLogDownloadFailure,
  ErrorLogDownloadSuccess,
  FileUpload,
  FileUploadFailure,
  FileUploadSuccess,
  GetVendorList,
  GetVendorListFailure,
  GetVendorListSuccess,
  RazorpayVendorMappingActionTypes,
  ResetResponse
} from './razorpay-vendor-mapping.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

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

describe('Razorpay Vendor Action Testing Suite', () => {
  describe('ErrorLogDownload Action Test Cases', () => {
    it('should check correct type is used for ErrorLogDownload action', () => {
      const payload = '';
      const action = new ErrorLogDownload(payload);
      expect({ ...action }).toEqual({
        type: RazorpayVendorMappingActionTypes.ERROR_LOG_DOWNLOAD,
        payload
      });
    });

    it('should check correct type is used for ErrorLogDownloadSuccess action', () => {
      const payload = '';

      const action = new ErrorLogDownloadSuccess(payload);
      expect({ ...action }).toEqual({
        type: RazorpayVendorMappingActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for ErrorLogDownloadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ErrorLogDownloadFailure(payload);

      expect({ ...action }).toEqual({
        type: RazorpayVendorMappingActionTypes.ERROR_LOG_DOWNLOAD_FAILURE,
        payload
      });
    });
  });

  describe('GetVendorList Action Test Cases', () => {
    it('should check correct type is used for ErrorLogDownload action', () => {
      const payload: ConfigListingPayload = {
        pageIndex: 0,
        pageSize: 1
      };
      const sortField: SortItem = {
        colId: '0',
        sort: '1'
      };
      const locationCode: string = '';
      const action = new GetVendorList(payload, sortField, locationCode);
      expect({ ...action }).toEqual({
        type: RazorpayVendorMappingActionTypes.GET_VENDOR_LIST,
        payload,
        sortField,
        locationCode
      });
    });

    it('should check correct type is used for GetVendorListSuccess action', () => {
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

      const action = new GetVendorListSuccess(payload);
      expect({ ...action }).toEqual({
        type: RazorpayVendorMappingActionTypes.GET_VENDOR_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for GetVendorListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetVendorListFailure(payload);

      expect({ ...action }).toEqual({
        type: RazorpayVendorMappingActionTypes.GET_VENDOR_LIST_FAILURE,
        payload
      });
    });
  });

  describe('ResetResponse Action Test Cases', () => {
    it('should check correct type is used for ResetResponse action', () => {
      const action = new ResetResponse();
      expect({ ...action }).toEqual({
        type: RazorpayVendorMappingActionTypes.RESET_RESPONSE
      });
    });
  });

  describe('FileUpload Action Test Cases', () => {
    it('should check correct type is used for  FileUpload action ', () => {
      const action = new FileUpload(formData);

      expect(action.type).toEqual(RazorpayVendorMappingActionTypes.FILE_UPLOAD);

      expect(action.payload).toEqual(formData);
    });
    it('should check correct type is used for FileUploadSuccess action ', () => {
      const action = new FileUploadSuccess(uploadResponse);

      expect(action.type).toEqual(
        RazorpayVendorMappingActionTypes.FILE_UPLOAD_SUCCESS
      );
      expect(action.payload).toEqual(uploadResponse);
    });
    it('should check correct type is used for FileUploadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FileUploadFailure(payload);

      expect(action.type).toEqual(
        RazorpayVendorMappingActionTypes.FILE_UPLOAD_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
