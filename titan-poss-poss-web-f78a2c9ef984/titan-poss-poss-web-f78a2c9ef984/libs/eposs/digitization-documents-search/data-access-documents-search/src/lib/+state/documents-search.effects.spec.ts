import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { DocumentsSearchEffect } from './documents-search.effects';
import { DocumentsSearchService } from '../documents-search.service';
import { InvoiceListResponse } from '@poss-web/shared/models';
import {
  DownloadDocument,
  DownloadDocumentFailure,
  DownloadDocumentSuccess,
  LoadInvoiceList,
  LoadInvoiceListFailure,
  LoadInvoiceListSuccess
} from './documents-search.actions';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';

describe('Documents Search Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: DocumentsSearchEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const documentsSearchServiceSpy = jasmine.createSpyObj<
    DocumentsSearchService
  >('DigitalSignatureService', [
    'getInvoiceList',
    'getDocumentDownloadResponse'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentsSearchEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: DocumentsSearchService,
          useValue: documentsSearchServiceSpy
        }
      ]
    });
    effect = TestBed.inject(DocumentsSearchEffect);
  });

  describe('documentsSearchService$ effects', () => {
    it('should Load Invoice List', () => {
      const action = new LoadInvoiceList(
        {
          docNo: 123
        },
        'CM',
        1,
        10
      );
      const payload: InvoiceListResponse = {
        pageNumber: 1,
        pageSize: 10,
        results: [
          {
            customerId: 123,
            docDate: '123456789',
            docNo: 123,
            documentId: '456-abc',
            documentName: 'CM.pdf',
            fiscalYear: 2021,
            locationCode: 'CPD',
            status: 'CONFIRMED',
            subTxnType: 'NEW_CM',
            transactionId: 'xyz-123-abc-456',
            txnType: 'CM'
          }
        ],
        totalElements: 20,
        totalPages: 2
      };
      const outCome = new LoadInvoiceListSuccess(payload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: payload });
      documentsSearchServiceSpy.getInvoiceList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.documentsSearchService$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadInvoiceList(
        {
          docNo: 123
        },
        'CM',
        1,
        10
      );
      const error = new Error('some error');
      const outCome = new LoadInvoiceListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      documentsSearchServiceSpy.getInvoiceList.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.documentsSearchService$).toBeObservable(expected);
    });
  });

  describe('DownloadDocument$ effects', () => {
    it('should Load Invoice List', () => {
      const action = new DownloadDocument({
        id: '123',
        locationCode: 'CPD'
      });
      const outCome = new DownloadDocumentSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: true });
      documentsSearchServiceSpy.getDocumentDownloadResponse.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.DownloadDocument).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new DownloadDocument({
        id: '123',
        locationCode: 'CPD'
      });
      const error = new Error('some error');
      const outCome = new DownloadDocumentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      documentsSearchServiceSpy.getDocumentDownloadResponse.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.DownloadDocument).toBeObservable(expected);
    });
  });
});
