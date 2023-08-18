import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { UnipayConfigurationEffect } from './unipay-access-mapping.effects';
import { UnipayConfigurationService } from '../unipay-config.service';
import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import {
  ConfigListingPayload,
  SortItem,
  UploadResponse,
  UnipayConfigurationList
} from '@poss-web/shared/models';
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
import { unipayConfigurationKey } from './unipay-access-mapping.reducers';
import { FileDownloadService } from '@poss-web/shared/util-common';

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

describe('Unipay Access Mapping Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: UnipayConfigurationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let unipayConfigurationService = jasmine.createSpyObj<
    UnipayConfigurationService
  >('UnipayConfigurationService', ['FileUpload', 'accessList']);
  const fileDownloadService = jasmine.createSpyObj<FileDownloadService>(
    'FileDownloadService',
    ['getErrorResponse']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnipayConfigurationEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [unipayConfigurationKey]: initialState
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
          provide: UnipayConfigurationService,
          useValue: {
            FileUpload: jasmine.createSpy(),
            accessList: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(UnipayConfigurationEffect);
    unipayConfigurationService = TestBed.inject<any>(
      UnipayConfigurationService
    );
  });
  describe('FileUpload', () => {
    it('should return a stream of FileUpload ', () => {
      const action = new FileUpload(formData);
      const outcome = new FileUploadSuccess(uploadResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: uploadResponse
      });
      unipayConfigurationService.FileUpload.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.FileUpload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FileUpload(formData);
      const error = new Error('some error');
      const outcome = new FileUploadFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      unipayConfigurationService.FileUpload.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.FileUpload$).toBeObservable(expected);
    });
  });

  describe('ErrorLogDownload', () => {
    it('should return a stream of ErrorLogDownload ', () => {
      const action = new ErrorLogDownload('');
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
      const action = new ErrorLogDownload('');
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

  describe('GetAccessList', () => {
    it('should return a stream of GetAccessList ', () => {
      const action = new GetAccessList(configListingPayload, sortField);
      const outcome = new GetAccessListSuccess(unipayConfigurationList);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: unipayConfigurationList
      });
      unipayConfigurationService.accessList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.GetAccessList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetAccessList(configListingPayload, sortField);
      const error = new Error('some error');
      const outcome = new GetAccessListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      unipayConfigurationService.accessList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.GetAccessList$).toBeObservable(expected);
    });
  });
});
