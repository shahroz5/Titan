import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { AirpayConfigurationEffect } from './airpay-configuration.effects';
import { AirpayConfigurationService } from '../airpay-configuration.service';
import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { airpayConfigurationKey } from './airpay-configuration.reducer';
import { FileDownloadService } from '@poss-web/shared/util-common';
import {
  GetAirpayVendorList,
  GetAirpayVendorListFailure,
  GetAirpayVendorListSuccess
  // ErrorLogDownload,
  // ErrorLogDownloadSuccess,
  // ErrorLogDownloadFailure
} from './airpay-configuration.actions';
import {
  AirpayVendorSuccessList,
  ListPayload,
  SortItem,
  FileUploadResponse
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

const configListingPayload: ListPayload = {
  pageIndex: 0,
  pageSize: 10
};
const sortField: SortItem = {
  colId: '',
  sort: 'Desc'
};

const airpayConfigList: AirpayVendorSuccessList = {
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

describe('Unipay Access Mapping Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: AirpayConfigurationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let airpayHostConfigurationService = jasmine.createSpyObj<
    AirpayConfigurationService
  >('AirpayConfigurationService', ['vendorList']);
  const fileDownloadService = jasmine.createSpyObj<FileDownloadService>(
    'FileDownloadService',
    ['getErrorResponse']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AirpayConfigurationEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [airpayConfigurationKey]: initialState
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
        // {
        //   provide: FileDownloadService,
        //   useValue: fileDownloadService
        // },
        {
          provide: AirpayConfigurationService,
          useValue: {
            // FileUpload: jasmine.createSpy(),
            vendorList: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(AirpayConfigurationEffect);
    airpayHostConfigurationService = TestBed.inject<any>(
      AirpayConfigurationService
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

  describe('GetAirpayVendorList', () => {
    it('should return a stream of GetAirpayVendorList ', () => {
      const action = new GetAirpayVendorList(configListingPayload, sortField);
      const outcome = new GetAirpayVendorListSuccess(airpayConfigList);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: airpayConfigList
      });
      airpayHostConfigurationService.vendorList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.GetVendorList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetAirpayVendorList(configListingPayload, sortField);
      const error = new Error('some error');
      const outcome = new GetAirpayVendorListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      airpayHostConfigurationService.vendorList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.GetVendorList$).toBeObservable(expected);
    });
  });
});
