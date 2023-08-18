import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { AirpayHostConfigurationEffect } from './airpay-host-configuration.effects';
import { AirpayHostConfigurationService } from '../airpay-host-configuration.service';
import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  // FileUpload,
  // FileUploadSuccess,
  // FileUploadFailure,
  GetHostNameList,
  GetHostNameListFailure,
  GetHostNameListSuccess
  // ErrorLogDownload,
  // ErrorLogDownloadSuccess,
  // ErrorLogDownloadFailure
} from './airpay-host-configuration.actions';
import { HttpClient } from '@angular/common/http';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { airpayHostConfigurationKey } from './airpay-host-configuration.reducer';
import { FileDownloadService } from '@poss-web/shared/util-common';
import {
  AirpayHostSuccessList,
  FileUploadResponse,
  ListingPayload,
  SortItem
} from '@poss-web/shared/models';
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

const configListingPayload: ListingPayload = {
  pageIndex: 0,
  pageSize: 10
};
const sortField: SortItem = {
  colId: '',
  sort: 'Desc'
};

const airpayHostList: AirpayHostSuccessList = {
  hostList: [
    {
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
  let effect: AirpayHostConfigurationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let airpayHostConfigurationService = jasmine.createSpyObj<
    AirpayHostConfigurationService
  >('AirpayHostConfigurationService', [
    // 'FileUpload',
    'hostnameList'
  ]);
  const fileDownloadService = jasmine.createSpyObj<FileDownloadService>(
    'FileDownloadService',
    ['getErrorResponse']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AirpayHostConfigurationEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [airpayHostConfigurationKey]: initialState
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
          provide: AirpayHostConfigurationService,
          useValue: {
            FileUpload: jasmine.createSpy(),
            hostnameList: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(AirpayHostConfigurationEffect);
    airpayHostConfigurationService = TestBed.inject<any>(
      AirpayHostConfigurationService
    );
  });
  // describe('FileUpload', () => {
  //   it('should return a stream of FileUpload ', () => {
  //     const action = new FileUpload(formData);
  //     const outcome = new FileUploadSuccess(uploadResponse);

  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-b|', {
  //       b: uploadResponse
  //     });
  //     airpayHostConfigurationService.FileUpload.and.returnValue(response$);

  //     const expected$ = cold('--c', { c: outcome });
  //     expect(effect.FileUpload$).toBeObservable(expected$);
  //   });

  //   it('should fail and return an action with the error', () => {
  //     const action = new FileUpload(formData);
  //     const error = new Error('some error');
  //     const outcome = new FileUploadFailure(CustomErrorAdaptor.fromJson(error));
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#', {}, error);
  //     airpayHostConfigurationService.FileUpload.and.returnValue(response$);
  //     const expected = cold('--b', { b: outcome });
  //     expect(effect.FileUpload$).toBeObservable(expected);
  //   });
  // });

  // describe('ErrorLogDownload', () => {
  //   it('should return a stream of ErrorLogDownload ', () => {
  //     const action = new ErrorLogDownload('');
  //     const outcome = new ErrorLogDownloadSuccess([]);

  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-b|', {
  //       b: []
  //     });
  //     fileDownloadService.getErrorResponse.and.returnValue(response$);

  //     const expected$ = cold('--c', { c: outcome });
  //     expect(effect.ErrorLogDownload$).toBeObservable(expected$);
  //   });

  //   it('should fail and return an action with the error', () => {
  //     const action = new ErrorLogDownload('');
  //     const error = new Error('some error');
  //     const outcome = new ErrorLogDownloadFailure(
  //       CustomErrorAdaptor.fromJson(error)
  //     );
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#', {}, error);
  //     fileDownloadService.getErrorResponse.and.returnValue(response$);
  //     const expected = cold('--b', { b: outcome });
  //     expect(effect.ErrorLogDownload$).toBeObservable(expected);
  //   });
  // });

  describe('GetHostNameList', () => {
    it('should return a stream of GetHostNameList ', () => {
      const action = new GetHostNameList(configListingPayload, sortField);
      const outcome = new GetHostNameListSuccess(airpayHostList);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: airpayHostList
      });
      airpayHostConfigurationService.hostnameList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.GetHostList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetHostNameList(configListingPayload, sortField);
      const error = new Error('some error');
      const outcome = new GetHostNameListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      airpayHostConfigurationService.hostnameList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.GetHostList$).toBeObservable(expected);
    });
  });
});
