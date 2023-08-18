import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  FileResponse,
  PayerBankMasterResponse,
  PayerBanksPayload
} from '@poss-web/shared/models';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { Observable } from 'rxjs';
import { PayerBankService } from '../payer-bank.service';
import { PayerBankEffects } from './payer-bank.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  ErrorLogDownload,
  ErrorLogDownloadFailure,
  ErrorLogDownloadSuccess,
  FileUpload,
  FileUploadFailure,
  FileUploadSuccess,
  LoadPayerBanks,
  LoadPayerBanksFailure,
  LoadPayerBanksSuccess,
  SearchPayerBank,
  SearchPayerBankFailure,
  SearchPayerBankSuccess
} from './payer-bank.actions';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { HttpClient } from '@angular/common/http';
import { FileDownloadService } from '@poss-web/shared/util-common';

describe('payerBankEffects Testing Suite', () => {
  const payerBankServiceSpy = jasmine.createSpyObj<PayerBankService>([
    'fileUpload',
    'loadPayerBanks',
    'searchPayerBanks'
  ]);
  const fileDownloadServiceSpy = jasmine.createSpyObj<FileDownloadService>([
    'getErrorResponse'
  ]);
  let actions$: Observable<any>;
  let effect: PayerBankEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const payerBanksListing: PayerBankMasterResponse = {
    payerBanks: [
      {
        bankName: 'AXIS',
        isActive: true
      }
    ],
    totalElements: 1
  };
  const fileResponse: FileResponse = {
    totalCount: 2,
    successCount: 2,
    failureCount: 2,
    errorLogId: 12,
    hasError: true
  };
  const payload: PayerBanksPayload = {
    pageIndex: 10,
    pageSize: 10
  };

  const initialState = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PayerBankEffects,
        DataPersistence,
        provideMockStore({ initialState }),
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
          provide: PayerBankService,
          useValue: payerBankServiceSpy
        },
        {
          provide: FileDownloadService,
          useValue: fileDownloadServiceSpy
        }
      ]
    });
    effect = TestBed.inject(PayerBankEffects);
  });
  describe('FileUpload TestCases', () => {
    it('should return a stream with courierDetailsListing', () => {
      const action = new FileUpload(null);
      const outcome = new FileUploadSuccess(fileResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: fileResponse });
      payerBankServiceSpy.fileUpload.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.fileUpload$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new FileUpload(null);
      const error = new Error('some error');
      const outcome = new FileUploadFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payerBankServiceSpy.fileUpload.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.fileUpload$).toBeObservable(expected);
    });
  });
  describe('LoadPayerBanks TestCaases', () => {
    it('should return a stream with loadpayerbanks', () => {
      const action = new LoadPayerBanks(payload);
      const outcome = new LoadPayerBanksSuccess(payerBanksListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payerBanksListing });
      payerBankServiceSpy.loadPayerBanks.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPayerBanks$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadPayerBanks(payload);
      const error = new Error('some error');
      const outcome = new LoadPayerBanksFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payerBankServiceSpy.loadPayerBanks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPayerBanks$).toBeObservable(expected);
    });
  });
  describe('SearchPayerBank TestCases', () => {
    it('should return a stream with search payerbank', () => {
      const action = new SearchPayerBank('Axis');
      const outcome = new SearchPayerBankSuccess(payerBanksListing.payerBanks);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payerBanksListing.payerBanks });
      payerBankServiceSpy.searchPayerBanks.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchPayerBank$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SearchPayerBank('AXIS');
      const error = new Error('some error');
      const outcome = new SearchPayerBankFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payerBankServiceSpy.searchPayerBanks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchPayerBank$).toBeObservable(expected);
    });
  });
  describe('ErrorLogDownload TestCases', () => {
    it('should return a stream with search payerbank', () => {
      const action = new ErrorLogDownload('10');
      const outcome = new ErrorLogDownloadSuccess(null);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: null });
      fileDownloadServiceSpy.getErrorResponse.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.errorLogDownload$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new ErrorLogDownload('10');
      const error = new Error('some error');
      const outcome = new ErrorLogDownloadFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      fileDownloadServiceSpy.getErrorResponse.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.errorLogDownload$).toBeObservable(expected);
    });
  });
});
