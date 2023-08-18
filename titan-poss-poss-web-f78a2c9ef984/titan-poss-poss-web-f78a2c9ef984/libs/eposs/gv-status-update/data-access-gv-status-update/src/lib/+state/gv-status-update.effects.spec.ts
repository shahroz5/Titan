import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { GVStatusUpdateEffect } from './gv-status-update.effects';

import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';

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
import { HttpClient } from '@angular/common/http';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ProductCategoryDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import { gvStatusUpdateKey } from './gv-status-update.reducers';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { GvStatusUpdateService } from '../gv-status-update.service';

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
describe('GV STATUS Update  Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: GVStatusUpdateEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let gvStatusUpdateService = jasmine.createSpyObj<GvStatusUpdateService>(
    'GvStatusUpdateService',
    ['FileUpload', 'gvStatusList', 'extendValidity', 'changeStatus']
  );
  const fileDownloadService = jasmine.createSpyObj<FileDownloadService>(
    'FileDownloadService',
    ['getErrorResponse']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GVStatusUpdateEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [gvStatusUpdateKey]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },

        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: FileDownloadService,
          useValue: fileDownloadService
        },
        {
          provide: GvStatusUpdateService,
          useValue: {
            FileUpload: jasmine.createSpy(),
            gvStatusList: jasmine.createSpy(),
            extendValidity: jasmine.createSpy(),
            changeStatus: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(GVStatusUpdateEffect);
    gvStatusUpdateService = TestBed.inject<any>(GvStatusUpdateService);
  });
  describe('FileUpload', () => {
    it('should return a stream of FileUpload ', () => {
      const action = new FileUpload(formData, '');
      const outcome = new FileUploadSuccess(uploadResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: uploadResponse
      });
      gvStatusUpdateService.FileUpload.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.FileUpload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FileUpload(formData, '');
      const error = new Error('some error');
      const outcome = new FileUploadFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      gvStatusUpdateService.FileUpload.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.FileUpload$).toBeObservable(expected);
    });
  });

  describe('ErrorLogDownload', () => {
    it('should return a stream of ErrorLogDownload ', () => {
      const action = new ErrorLogDownload('test1', 'test2');
      const outcome = new ErrorLogDownloadSuccess([]);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: []
      });
      fileDownloadService.getErrorResponse.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.ErrorLogDownload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ErrorLogDownload('test1', 'test2');
      const error = new Error('some error');
      const outcome = new ErrorLogDownloadFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      fileDownloadService.getErrorResponse.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.ErrorLogDownload$).toBeObservable(expected);
    });
  });

  describe('GetGVStatusList', () => {
    it('should return a stream of GetGVStatusList ', () => {
      const action = new GetGVStatusList(gvStatusListingPayload, sortField);
      const outcome = new GetGVStatusListSuccess(gvStatusUpdateList);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: gvStatusUpdateList
      });
      gvStatusUpdateService.gvStatusList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.GetAccessList$).toBeObservable(expected$);
    });

    it('should fail and return  action with the error', () => {
      const action = new GetGVStatusList(gvStatusListingPayload, sortField);
      const error = new Error('some error');
      const outcome = new GetGVStatusListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      gvStatusUpdateService.gvStatusList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.GetAccessList$).toBeObservable(expected);
    });
  });

  describe('extendValidity', () => {
    it('should return a stream of extendValidity ', () => {
      const action = new ExtendGVStatus(gvExtendValidity);
      const outcome = new ExtendGVStatusSuccess(gvStatusUpdateList);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: gvStatusUpdateList
      });
      gvStatusUpdateService.extendValidity.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.ExtendGVStatus$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ExtendGVStatus(gvExtendValidity);
      const error = new Error('some error');
      const outcome = new ExtendGVStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      gvStatusUpdateService.extendValidity.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.ExtendGVStatus$).toBeObservable(expected);
    });
  });

  describe('ChangeGVStatus', () => {
    it('should return a stream of ChangeGVStatus ', () => {
      const action = new ChangeGVStatus(gvStatusChange);
      const outcome = new ChangeGVStatusSuccess(gvStatusUpdateList);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: gvStatusUpdateList
      });
      gvStatusUpdateService.changeStatus.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.ChangeGVStatus$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ChangeGVStatus(gvStatusChange);
      const error = new Error('some error');
      const outcome = new ChangeGVStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      gvStatusUpdateService.changeStatus.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.ChangeGVStatus$).toBeObservable(expected);
    });
  });
});
