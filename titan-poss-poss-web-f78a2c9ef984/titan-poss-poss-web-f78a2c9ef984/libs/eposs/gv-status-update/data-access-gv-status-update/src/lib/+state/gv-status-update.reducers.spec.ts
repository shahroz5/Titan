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

import { GVStatusUpdateState } from './gv-status-update.state';
import {
  gvStatusUpdateReducer,
  initialState
} from './gv-status-update.reducers';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
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
import * as moment from 'moment';

describe('GV Status Update Reducer Testing Suite', () => {
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

  describe('Testing FileUpload Functionality', () => {
    it('FileUpload should be called', () => {
      const action = new FileUpload(formData, '');
      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('FileUploadSuccess should be called', () => {
      const action = new FileUploadSuccess(uploadResponse);
      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.fileUploadResponse).toBeTruthy();
    });
    it('FileUploadFailure should be called', () => {
      const action = new FileUploadFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing ErrorLogDownload Functionality', () => {
    it('ErrorLogDownload should be called', () => {
      const action = new ErrorLogDownload('test1', 'test2');
      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
      expect(result.updatedList).toBe(null);
    });

    it('ErrorLogDownloadSuccess should be called', () => {
      const action = new ErrorLogDownloadSuccess({});
      const result: GVStatusUpdateState = gvStatusUpdateReducer(
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

      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing GetGVStatusList Functionality', () => {
    it('GetGVStatusList should be called', () => {
      const action = new GetGVStatusList(gvStatusListingPayload, sortField);
      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('GetGVStatusList should be called', () => {
      const action = new GetGVStatusListSuccess(gvStatusUpdateList);
      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });
    it('GetAccessListFailure should be called', () => {
      const action = new GetGVStatusListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: GVStatusUpdateState = gvStatusUpdateReducer(
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
      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });
  });

  describe('Testing ExtendGVStatus Functionality', () => {
    it('ExtendGVStatus should be called', () => {
      const action = new ExtendGVStatus(gvExtendValidity);
      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('ExtendGVStatusSuccess should be called', () => {
      const action = new ExtendGVStatusSuccess(gvStatusUpdateList);
      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.gvStatusUpdateList).toBeTruthy();
    });
    it('ExtendGVStatusFailure should be called', () => {
      const action = new ExtendGVStatusFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing ChangeGVStatus Functionality', () => {
    it('ChangeGVStatus should be called', () => {
      const action = new ChangeGVStatus(gvStatusChange);
      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('ChangeGVStatus should be called', () => {
      const action = new ChangeGVStatusSuccess(gvStatusUpdateList);
      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.gvStatusUpdateList).toBeTruthy();
    });
    it('ExtendGVStatusFailure should be called', () => {
      const action = new ChangeGVStatusFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: GVStatusUpdateState = gvStatusUpdateReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });
});
