import {
  ConfigListingPayload,
  CustomErrors,
  SortItem,
  GvStatusList,
  UploadResponse,
  GVStatusListingPayload,
  GVStatusUpdateList,
  GVExtendValidity,
  GVStatusChange
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import {
  FileUpload,
  FileUploadSuccess,
  FileUploadFailure,
  ResetResponse,
  GetGVStatusList,
  GetGVStatusListFailure,
  ExtendGVStatus,
  ExtendGVStatusSuccess,
  ExtendGVStatusFailure,
  GetGVStatusListSuccess,
  ChangeGVStatus,
  ChangeGVStatusSuccess,
  ChangeGVStatusFailure,
  ErrorLogDownload,
  ErrorLogDownloadSuccess,
  ErrorLogDownloadFailure,
  GVStatusUpdateActionTypes
} from './gv-status-update.actions';

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

const gvStatusListingPayload: GVStatusListingPayload = {
  length: 0,
  pageIndex: 0,
  pageSize: 10,
  serialNo: '123',
  status: 'CLOSED'
};
const gvStatusList: GvStatusList = {
  activationDate: 12,
  denomination: 1,
  excludes: [],
  extendCount: 1,
  giftCode: '',
  giftDetails: {
    customerName: '',
    customerType: '',
    discount: '',
    discountPercentage: '',
    issuedTo: ''
  },
  indentNo: 1,
  locationCode: 123,
  mfgDate: 1,
  newlyAdded: true,
  quantity: 1,
  regionCode: '',
  remarks: '',
  serialNo: 1,
  status: '',
  totalValue: 12,
  validFrom: moment(),
  validTill: moment(),
  validityDays: 1
};
const gvStatusUpdateList: GVStatusUpdateList = {
  count: 1,
  gvStatusList: [gvStatusList]
};

const gvExtendValidity: GVExtendValidity = {
  giftValidity: [{ serialNo: 2, validTill: '' }],
  remarks: ''
};

const gvStatusChange: GVStatusChange = {
  giftVoucherStatus: [{ serialNo: 2, status: '' }],
  remarks: ''
};

describe('GV STATUS Update Action Testing Suite', () => {
  describe('FileUpload Action Test Cases', () => {
    it('should check correct type is used for  FileUpload action ', () => {
      const action = new FileUpload(formData, '');

      expect(action.type).toEqual(GVStatusUpdateActionTypes.FILE_UPLOAD);

      expect(action.payload).toEqual(formData);
    });
    it('should check correct type is used for FileUploadSuccess action ', () => {
      const action = new FileUploadSuccess(uploadResponse);

      expect(action.type).toEqual(
        GVStatusUpdateActionTypes.FILE_UPLOAD_SUCCESS
      );
      expect(action.payload).toEqual(uploadResponse);
    });
    it('should check correct type is used for FileUploadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FileUploadFailure(payload);

      expect(action.type).toEqual(
        GVStatusUpdateActionTypes.FILE_UPLOAD_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('GetGVStatusList Action Test Cases', () => {
    it('should check correct type is used for  GetGVStatusList action ', () => {
      const action = new GetGVStatusList(gvStatusListingPayload, sortField);

      expect(action.type).toEqual(GVStatusUpdateActionTypes.GET_GV_STATUS_LIST);

      expect(action.payload).toEqual(gvStatusListingPayload, sortField);
    });

    it('should check correct type is used for GetGVStatusListSuccess action ', () => {
      const action = new GetGVStatusListSuccess(gvStatusUpdateList);

      expect(action.type).toEqual(
        GVStatusUpdateActionTypes.GET_GV_STATUS_LIST_SUCCESS
      );
      expect(action.payload).toEqual(gvStatusUpdateList);
    });
    it('should check correct type is used for GetGVStatusListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetGVStatusListFailure(payload);

      expect(action.type).toEqual(
        GVStatusUpdateActionTypes.GET_GV_STATUS_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ErrorLogDownload Action Test Cases', () => {
    it('should check correct type is used for  ErrorLogDownload action ', () => {
      const action = new ErrorLogDownload('test1', 'test2');

      expect(action.type).toEqual(GVStatusUpdateActionTypes.ERROR_LOG_DOWNLOAD);

      expect(action.payload).toEqual('test1', 'test2');
    });

    it('should check correct type is used for ErrorLogDownloadSuccess action ', () => {
      const action = new ErrorLogDownloadSuccess({});

      expect(action.type).toEqual(
        GVStatusUpdateActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS
      );
      expect(action.payload).toEqual({});
    });
    it('should check correct type is used for ErrorLogDownloadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ErrorLogDownloadFailure(payload);

      expect(action.type).toEqual(
        GVStatusUpdateActionTypes.ERROR_LOG_DOWNLOAD_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ResetResponse Action Test Cases', () => {
    it('should check correct type is used for  ResetResponse action ', () => {
      const action = new ResetResponse();

      expect(action.type).toEqual(GVStatusUpdateActionTypes.RESET_RESPONSE);
    });
  });

  describe('ExtendGVStatus Action Test Cases', () => {
    it('should check correct type is used for  ExtendGVStatus action ', () => {
      const action = new ExtendGVStatus(gvExtendValidity);

      expect(action.type).toEqual(GVStatusUpdateActionTypes.EXTEND_GV_STATUS);

      expect(action.payload).toEqual(gvExtendValidity);
    });

    it('should check correct type is used for ExtendGVStatusSuccess action ', () => {
      const action = new ExtendGVStatusSuccess(gvStatusUpdateList);

      expect(action.type).toEqual(
        GVStatusUpdateActionTypes.EXTEND_GV_STATUS_SUCCESS
      );
      expect(action.payload).toEqual(gvStatusUpdateList);
    });
    it('should check correct type is used for ExtendGVStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ExtendGVStatusFailure(payload);

      expect(action.type).toEqual(
        GVStatusUpdateActionTypes.EXTEND_GV_STATUS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ChangeGVStatus Action Test Cases', () => {
    it('should check correct type is used for  ChangeGVStatus action ', () => {
      const action = new ChangeGVStatus(gvStatusChange);

      expect(action.type).toEqual(GVStatusUpdateActionTypes.CHANGE_GV_STATUS);

      expect(action.payload).toEqual(gvStatusChange);
    });

    it('should check correct type is used for ChangeGVStatusSuccess action ', () => {
      const action = new ChangeGVStatusSuccess(gvStatusUpdateList);

      expect(action.type).toEqual(
        GVStatusUpdateActionTypes.CHANGE_GV_STATUS_SUCCESS
      );
      expect(action.payload).toEqual(gvStatusUpdateList);
    });
    it('should check correct type is used for ChangeGVStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ChangeGVStatusFailure(payload);

      expect(action.type).toEqual(
        GVStatusUpdateActionTypes.CHANGE_GV_STATUS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
