import { Observable } from 'rxjs';
import { TaxClassEffect } from './tax-class.effect';
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
import { TaxClassService } from '../tax-class.service';
import {
  LoadTaxClassListingPayload,
  LoadTaxClassListingSuccessPayload,
  TaxClassDetails} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { TAX_CLASS_FEATURE_KEY } from './tax-class.reducer';
import { EditTaxClassFormDetails, EditTaxClassFormDetailsFailure, EditTaxClassFormDetailsSuccess, LoadTaxClassDetailsByTaxClassCode, LoadTaxClassDetailsByTaxClassCodeFailure, LoadTaxClassDetailsByTaxClassCodeSuccess, LoadTaxClassListing, LoadTaxClassListingFailure, LoadTaxClassListingSuccess, SaveTaxClassFormDetails, SaveTaxClassFormDetailsFailure, SaveTaxClassFormDetailsSuccess, SearchTaxClassCode, SearchTaxClassCodeFailure, SearchTaxClassCodeSuccess } from './tax-class.actions';

describe('Tax Class Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: TaxClassEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const taxClassServiceServiceSpy = jasmine.createSpyObj<
    TaxClassService
  >([
    'getTaxClassList',
    'getTaxClassDetailsByTaxClassCode',
    'saveTaxClassFormDetails',
    'editTaxClassFormDetails',
  ]);


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaxClassEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [TAX_CLASS_FEATURE_KEY]: initialState
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
          provide: TaxClassService,
          useValue: taxClassServiceServiceSpy
        }
      ]
    });

    effect = TestBed.inject(TaxClassEffect);
  });

  describe('LoadTaxClassListing', () => {
    it('should return LoadTaxClassListing', () => {

      const payload: LoadTaxClassListingPayload = {
        pageIndex: 0,
        pageSize: 8
      };

      const payload2: LoadTaxClassListingSuccessPayload = {
        taxClassListing: [{
          description: 'desc',
          isActive: true,
          taxClassCode: 'code'
        }],
        totalElements: 1
      }

      const action = new LoadTaxClassListing(payload);
      const outcome = new LoadTaxClassListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      taxClassServiceServiceSpy.getTaxClassList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTaxClassListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {

      const payload: LoadTaxClassListingPayload = {
        pageIndex: 0,
        pageSize: 8
      };

      const action = new LoadTaxClassListing(payload);
      const error = new Error('some error');
      const outcome = new LoadTaxClassListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      taxClassServiceServiceSpy.getTaxClassList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTaxClassListing$).toBeObservable(expected);
    });
  });

  describe('LoadTaxClassDetailsByTaxClassCode Details', () => {
    it('should return a details of product category for LoadTaxClassDetailsByTaxClassCode', () => {

      const payload: TaxClassDetails = {
        description: 'Desc',
        isActive: true,
        taxClassCode: 'code'
      };

      const action = new LoadTaxClassDetailsByTaxClassCode('tax');
      const outcome = new LoadTaxClassDetailsByTaxClassCodeSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      taxClassServiceServiceSpy.getTaxClassDetailsByTaxClassCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTaxClassDetailsByTaxClassCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadTaxClassDetailsByTaxClassCodeFailure', () => {

      const action = new LoadTaxClassDetailsByTaxClassCode('');
      const error = new Error('some error');
      const outcome = new LoadTaxClassDetailsByTaxClassCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      taxClassServiceServiceSpy.getTaxClassDetailsByTaxClassCode.and.returnValue(response$);

      const expected = cold('--b', { b: outcome });
      expect(effect.loadTaxClassDetailsByTaxClassCode$).toBeObservable(expected);
    });
  });

  describe('SaveTaxClassFormDetails Details', () => {
    it('should return a details of product category for SaveTaxClassFormDetails', () => {

      const payload: TaxClassDetails = {
        description: 'Desc',
        isActive: true,
        taxClassCode: 'code'
      };

      const action = new SaveTaxClassFormDetails(payload);
      const outcome = new SaveTaxClassFormDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      taxClassServiceServiceSpy.saveTaxClassFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveTaxClassFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SaveTaxClassFormDetails', () => {
      const payload: TaxClassDetails = {
        description: 'Desc',
        isActive: true,
        taxClassCode: 'code'
      };

      const action = new SaveTaxClassFormDetails(payload);
      const error = new Error('some error');
      const outcome = new SaveTaxClassFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      taxClassServiceServiceSpy.saveTaxClassFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveTaxClassFormDetails$).toBeObservable(expected);
    });
  });

  describe('EditTaxClassFormDetails Details', () => {
    const payload: TaxClassDetails = {
      description: 'Desc',
      isActive: true,
      taxClassCode: 'code'
    };
    it('should return a details of product category for EditTaxClassFormDetails', () => {

      const action = new EditTaxClassFormDetails(payload);
      const outcome = new EditTaxClassFormDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      taxClassServiceServiceSpy.editTaxClassFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editTaxClassFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for EditTaxClassFormDetails', () => {
      const action = new EditTaxClassFormDetails(payload);
      const error = new Error('some error');
      const outcome = new EditTaxClassFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      taxClassServiceServiceSpy.editTaxClassFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editTaxClassFormDetails$).toBeObservable(expected);
    });
  });

  describe('SearchTaxClassCode Details', () => {
    const payload: TaxClassDetails = {
      description: 'Desc',
      isActive: true,
      taxClassCode: 'code'
    };
    it('should return a details of product category for SearchTaxClassCode', () => {


      const action = new SearchTaxClassCode('');
      const outcome = new SearchTaxClassCodeSuccess([payload]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      taxClassServiceServiceSpy.getTaxClassDetailsByTaxClassCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchTaxClassDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SearchTaxClassCode', () => {
      const action = new SearchTaxClassCode('');
      const error = new Error('some error');
      const outcome = new SearchTaxClassCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      taxClassServiceServiceSpy.getTaxClassDetailsByTaxClassCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchTaxClassDetails$).toBeObservable(expected);
    });
  });


});
