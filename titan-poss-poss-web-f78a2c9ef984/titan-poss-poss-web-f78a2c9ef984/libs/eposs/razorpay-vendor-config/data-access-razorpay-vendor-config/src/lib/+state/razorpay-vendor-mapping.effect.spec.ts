import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import {
  ConfigListingPayload,
  LoadStateTaxConfigurationListingPayload,
  RazorpayVendorSuccessList,
  SortItem,
  UploadResponse
} from '@poss-web/shared/models';

import { RazorpayVendorConfigurationService } from '../razorpay-vendor-config.service';
import { RazorpayVendorConfigurationEffect } from './razorpay-vendor-mapping.effects';
import { razorpayVendorConfigurationKey } from './razorpay-vendor-mapping.reducers';

import {
  ErrorLogDownload,
  ErrorLogDownloadFailure,
  ErrorLogDownloadSuccess,
  FileUpload,
  FileUploadFailure,
  FileUploadSuccess,
  GetVendorList,
  GetVendorListFailure,
  GetVendorListSuccess
} from './razorpay-vendor-mapping.actions';
import { FileDownloadService } from '@poss-web/shared/util-common';
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

describe('Razorpay vendor Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: RazorpayVendorConfigurationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const razorpayVendorConfigurationServiceSpy = jasmine.createSpyObj<
    RazorpayVendorConfigurationService
  >(['FileUpload', 'vendorList']);
  const fileDownloadServiceSpy = jasmine.createSpyObj<FileDownloadService>([
    'getErrorResponse'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RazorpayVendorConfigurationEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [razorpayVendorConfigurationKey]: initialState
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
          provide: RazorpayVendorConfigurationService,
          useValue: razorpayVendorConfigurationServiceSpy
        },
        {
          provide: FileDownloadService,
          useValue: fileDownloadServiceSpy
        }
      ]
    });

    effect = TestBed.inject(RazorpayVendorConfigurationEffect);
  });

  describe('ErrorLogDownload', () => {
    const payload = '';
    it('should return ErrorLogDownloadSuccess', () => {
      const action = new ErrorLogDownload(payload);

      const outcome = new ErrorLogDownloadSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      fileDownloadServiceSpy.getErrorResponse.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.ErrorLogDownload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error ErrorLogDownloadFailure', () => {
      const action = new ErrorLogDownload(payload);
      const error = new Error('some error');
      const outcome = new ErrorLogDownloadFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      fileDownloadServiceSpy.getErrorResponse.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.ErrorLogDownload$).toBeObservable(expected$);
    });
  });

  describe('GetVendorList', () => {
    const payload: ConfigListingPayload = {
      pageIndex: 0,
      pageSize: 1
    };
    const sortField: SortItem = {
      colId: '0',
      sort: '1'
    };
    const locationCode: string = '';
    it('should return GetVendorListSuccess', () => {
      const action = new GetVendorList(payload, sortField, locationCode);

      const payload2: RazorpayVendorSuccessList = {
        count: 0,
        vendorList: [
          {
            accountId: '1',
            locationCode: 'A',
            newlyAdded: true
          }
        ]
      };

      const outcome = new GetVendorListSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      razorpayVendorConfigurationServiceSpy.vendorList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.GetVendorList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error GetVendorListFailure', () => {
      const action = new GetVendorList(payload, sortField, locationCode);
      const error = new Error('some error');
      const outcome = new GetVendorListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      razorpayVendorConfigurationServiceSpy.vendorList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.GetVendorList$).toBeObservable(expected$);
    });
  });

  describe('FileUpload', () => {
    it('should return a stream of FileUpload ', () => {
      const action = new FileUpload(formData);
      const outcome = new FileUploadSuccess(uploadResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: uploadResponse
      });
      razorpayVendorConfigurationServiceSpy.FileUpload.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.FileUpload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FileUpload(formData);
      const error = new Error('some error');
      const outcome = new FileUploadFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      razorpayVendorConfigurationServiceSpy.FileUpload.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.FileUpload$).toBeObservable(expected);
    });
  });
});
