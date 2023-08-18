import { Observable } from 'rxjs';
import { TaxMasterEffect } from './tax-master.effect';
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
import { TaxMasterService } from '../tax-master.service';
import {
  LoadTaxMasterListingPayload,
  LoadTaxMasterListingSuccessPayload,
  TaxMasterDetails
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { TAX_MASTER_FEATURE_KEY } from './tax-master.reducer';
import { EditTaxMasterFormDetails, EditTaxMasterFormDetailsFailure, EditTaxMasterFormDetailsSuccess, LoadTaxMasterDetailsByTaxCode, LoadTaxMasterDetailsByTaxCodeFailure, LoadTaxMasterDetailsByTaxCodeSuccess, LoadTaxMasterListing, LoadTaxMasterListingFailure, LoadTaxMasterListingSuccess, SaveTaxMasterFormDetails, SaveTaxMasterFormDetailsFailure, SaveTaxMasterFormDetailsSuccess, SearchTaxMasterCode, SearchTaxMasterCodeFailure, SearchTaxMasterCodeSuccess } from './tax-master.actions';

describe('Product Category Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: TaxMasterEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const taxMasterServiceServiceSpy = jasmine.createSpyObj<
    TaxMasterService
  >([
    'getTaxMasterList',
    'getTaxMasterDetailsByTaxMasterCode',
    'saveTaxMasterFormDetails',
    'editTaxMasterFormDetails',
  ]);


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaxMasterEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [TAX_MASTER_FEATURE_KEY]: initialState
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
          provide: TaxMasterService,
          useValue: taxMasterServiceServiceSpy
        }
      ]
    });

    effect = TestBed.inject(TaxMasterEffect);
  });

  describe('LoadTaxMasterListing', () => {
    it('should return LoadTaxMasterListing', () => {

      const payload: LoadTaxMasterListingPayload = {
        pageIndex: 0,
        pageSize: 8
      };

      const payload2: LoadTaxMasterListingSuccessPayload = {
        taxMasterListing: [{
          description: 'desc',
          isActive: true,
          taxCode: 'code',
          taxSystem: 'VAT'
        }],
        totalElements: 1
      }

      const action = new LoadTaxMasterListing(payload);
      const outcome = new LoadTaxMasterListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      taxMasterServiceServiceSpy.getTaxMasterList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTaxMasterListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {

      const payload: LoadTaxMasterListingPayload = {
        pageIndex: 0,
        pageSize: 8
      };

      const action = new LoadTaxMasterListing(payload);
      const error = new Error('some error');
      const outcome = new LoadTaxMasterListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      taxMasterServiceServiceSpy.getTaxMasterList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTaxMasterListing$).toBeObservable(expected);
    });
  });

  describe('LoadTaxMasterDetailsByTaxCode Details', () => {
    it('should return a details of product category for LoadTaxMasterDetailsByTaxCode', () => {

      const payload: TaxMasterDetails = {
        description: 'Desc',
        isActive: true,
        taxCode: '',
        taxSystem: '',
      };

      const action = new LoadTaxMasterDetailsByTaxCode('tax');
      const outcome = new LoadTaxMasterDetailsByTaxCodeSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      taxMasterServiceServiceSpy.getTaxMasterDetailsByTaxMasterCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTaxMasterDetailsByTaxCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadTaxMasterDetailsByTaxCodeFailure', () => {

      const action = new LoadTaxMasterDetailsByTaxCode('');
      const error = new Error('some error');
      const outcome = new LoadTaxMasterDetailsByTaxCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      taxMasterServiceServiceSpy.getTaxMasterDetailsByTaxMasterCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTaxMasterDetailsByTaxCode$).toBeObservable(expected);
    });
  });

  describe('SaveTaxMasterFormDetails Details', () => {
    it('should return a details of product category for SaveTaxMasterFormDetails', () => {

      const payload: TaxMasterDetails = {
        description: 'Desc',
        isActive: true,
        taxCode: '',
        taxSystem: '',
      };

      const action = new SaveTaxMasterFormDetails(payload);
      const outcome = new SaveTaxMasterFormDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      taxMasterServiceServiceSpy.saveTaxMasterFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveTaxMasterFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SaveTaxMasterFormDetails', () => {
      const payload: TaxMasterDetails = {
        description: 'Desc',
        isActive: true,
        taxCode: '',
        taxSystem: '',
      };

      const action = new SaveTaxMasterFormDetails(payload);
      const error = new Error('some error');
      const outcome = new SaveTaxMasterFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      taxMasterServiceServiceSpy.saveTaxMasterFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveTaxMasterFormDetails$).toBeObservable(expected);
    });
  });

  describe('EditTaxMasterFormDetails Details', () => {
    it('should return a details of product category for EditTaxMasterFormDetails', () => {

      const payload: TaxMasterDetails = {
        description: 'Desc',
        isActive: true,
        taxCode: '',
        taxSystem: '',
      };

      const action = new EditTaxMasterFormDetails(payload);
      const outcome = new EditTaxMasterFormDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      taxMasterServiceServiceSpy.editTaxMasterFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editTaxMasterFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for EditTaxMasterFormDetails', () => {
      const payload: TaxMasterDetails = {
        description: 'Desc',
        isActive: true,
        taxCode: '',
        taxSystem: '',
      };

      const action = new EditTaxMasterFormDetails(payload);
      const error = new Error('some error');
      const outcome = new EditTaxMasterFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      taxMasterServiceServiceSpy.editTaxMasterFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editTaxMasterFormDetails$).toBeObservable(expected);
    });
  });

  describe('SearchTaxMasterCode Details', () => {
    it('should return a details of product category for SearchTaxMasterCode', () => {

      const payload: TaxMasterDetails = {
        description: 'Desc',
        isActive: true,
        taxCode: '',
        taxSystem: '',
      };

      const action = new SearchTaxMasterCode('');
      const outcome = new SearchTaxMasterCodeSuccess([payload]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      taxMasterServiceServiceSpy.getTaxMasterDetailsByTaxMasterCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchTaxMasterDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SearchTaxMasterCode', () => {
      const action = new SearchTaxMasterCode('');
      const error = new Error('some error');
      const outcome = new SearchTaxMasterCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      taxMasterServiceServiceSpy.getTaxMasterDetailsByTaxMasterCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchTaxMasterDetails$).toBeObservable(expected);
    });
  });


});
