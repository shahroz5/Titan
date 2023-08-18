import { Observable } from 'rxjs';
import { TransactionTypeMasterEffect } from './transaction-type-master.effect';
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
import { TransactionTypeMasterService } from '../transaction-type-master.service';
import {
  CashPaymentConfiguration, LoadTransactionTypeMasterListingPayload, LoadTransactionTypeMasterListingSuccessPayload, TransactionTypeMasterDetails
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { TRANSACTION_TYPE_MASTER_FEATURE_KEY } from './transaction-type-master.reducer';
import { EditTransactionTypeMasterFormDetails, EditTransactionTypeMasterFormDetailsFailure, EditTransactionTypeMasterFormDetailsSuccess, LoadTransactionTypeMasterByCode, LoadTransactionTypeMasterByCodeFailure, LoadTransactionTypeMasterByCodeSuccess, LoadTransactionTypeMasterListing, LoadTransactionTypeMasterListingFailure, LoadTransactionTypeMasterListingSuccess, SaveTransactionTypeMasterFormDetails, SaveTransactionTypeMasterFormDetailsFailure, SaveTransactionTypeMasterFormDetailsSuccess, SearchTransactionTypeMasterCode, SearchTransactionTypeMasterCodeFailure, SearchTransactionTypeMasterCodeSuccess } from './transaction-type-master.actions';

describe('Transaction Type Master Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: TransactionTypeMasterEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const transactionTypeMasterServiceSpy = jasmine.createSpyObj<
    TransactionTypeMasterService
  >([
    'getTransactionTypeMasterList',
    'getTransactionTypeMasterByCode',
    'editCashPaymentConfigurationDetails',
    'saveTransactionTypeMasterFormDetails',
    'editTransactionTypeMasterFormDetails',
    'getTransactionTypeMasterSearch'
  ]);


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionTypeMasterEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [TRANSACTION_TYPE_MASTER_FEATURE_KEY]: initialState
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
          provide: TransactionTypeMasterService,
          useValue: transactionTypeMasterServiceSpy
        }
      ]
    });

    effect = TestBed.inject(TransactionTypeMasterEffect);
  });

  describe('LoadTransactionTypeMasterListing', () => {
    it('should return LoadTransactionTypeMasterListing', () => {

      const payload: LoadTransactionTypeMasterListingPayload = {
        pageIndex: 1,
        pageSize: 8
      };

      const payload2: LoadTransactionTypeMasterListingSuccessPayload = {
        transactionTypeMasterListing: [],
        totalElements: 2
      }

      const action = new LoadTransactionTypeMasterListing(payload);
      const outcome = new LoadTransactionTypeMasterListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      transactionTypeMasterServiceSpy.getTransactionTypeMasterList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTransactionTypeMasterListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {

      const payload: LoadTransactionTypeMasterListingPayload = {
        pageIndex: 1,
        pageSize: 8
      };


      const action = new LoadTransactionTypeMasterListing(payload);
      const error = new Error('some error');
      const outcome = new LoadTransactionTypeMasterListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      transactionTypeMasterServiceSpy.getTransactionTypeMasterList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTransactionTypeMasterListing$).toBeObservable(expected);
    });
  });

  describe('LoadProductCategory Details', () => {
    it('should return a details of product category for LoadProductCategoryByProductCategoryCode', () => {

      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new LoadTransactionTypeMasterByCode('1');
      const outcome = new LoadTransactionTypeMasterByCodeSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      transactionTypeMasterServiceSpy.getTransactionTypeMasterByCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTaxClassDetailsByTaxClassCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadProductCategoryByProductCategoryCode', () => {

      const action = new LoadTransactionTypeMasterByCode('1');
      const error = new Error('some error');
      const outcome = new LoadTransactionTypeMasterByCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      transactionTypeMasterServiceSpy.getTransactionTypeMasterByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTaxClassDetailsByTaxClassCode$).toBeObservable(expected);
    });
  });

/* 
  describe('SaveTransactionTypeMasterFormDetails Details', () => {
    it('should return a details of product category for SaveTransactionTypeMasterFormDetails', () => {

      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new SaveTransactionTypeMasterFormDetails(payload);
      const outcome = new SaveTransactionTypeMasterFormDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      transactionTypeMasterServiceSpy.saveTransactionTypeMasterFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SaveTransactionTypeMasterFormDetails', () => {

      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new SaveTransactionTypeMasterFormDetails(payload);
      const error = new Error('some error');
      const outcome = new SaveTransactionTypeMasterFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      transactionTypeMasterServiceSpy.saveTransactionTypeMasterFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveFormDetails$).toBeObservable(expected);
    });
  });


  describe('EditTransactionTypeMasterFormDetails Details', () => {
    it('should return a details of product category for EditTransactionTypeMasterFormDetails', () => {

      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new EditTransactionTypeMasterFormDetails(payload);
      const outcome = new EditTransactionTypeMasterFormDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      transactionTypeMasterServiceSpy.editTransactionTypeMasterFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for EditTransactionTypeMasterFormDetails', () => {

      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new EditTransactionTypeMasterFormDetails(payload);
      const error = new Error('some error');
      const outcome = new EditTransactionTypeMasterFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      transactionTypeMasterServiceSpy.editTransactionTypeMasterFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editFormDetails$).toBeObservable(expected);
    });
  });
 */

  describe('SearchTransactionTypeMasterCode Details', () => {
    it('should return a details of product category for SearchTransactionTypeMasterCode', () => {

      const payload: LoadTransactionTypeMasterListingSuccessPayload = {
        transactionTypeMasterListing: [],
        totalElements: 2
      }

      const action = new SearchTransactionTypeMasterCode('src');
      const outcome = new SearchTransactionTypeMasterCodeSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      transactionTypeMasterServiceSpy.getTransactionTypeMasterSearch.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SearchTransactionTypeMasterCode', () => {

      const action = new SearchTransactionTypeMasterCode('src');
      const error = new Error('some error');
      const outcome = new SearchTransactionTypeMasterCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      transactionTypeMasterServiceSpy.getTransactionTypeMasterSearch.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchDetails$).toBeObservable(expected);
    });
  });


});
