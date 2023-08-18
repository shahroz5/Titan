import { Observable } from 'rxjs';
import { CashPaymentConfigurationEffect } from './cash-payment-configuration.effect';
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
import { CashPaymentConfigurationService } from '../cash-payment-configuration.service';
import {
  CashPaymentConfiguration
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CASHPAYMENTCONFIGURATION_FEATURE_KEY } from './cash-payment-configuration.reducer';
import { AddNewCashPaymentConfiguration, AddNewCashPaymentConfigurationFailure, AddNewCashPaymentConfigurationSuccess, EditCashPaymentConfiguration, EditCashPaymentConfigurationFailure, EditCashPaymentConfigurationSuccess, LoadCashPaymentConfiguration, LoadCashPaymentConfigurationFailure, LoadCashPaymentConfigurationSuccess } from './cash-payment-configuration.actions';

describe('Product Category Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CashPaymentConfigurationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const cashPaymentConfigurationServiceSpy = jasmine.createSpyObj<
    CashPaymentConfigurationService
  >([
    'getCashPaymentConfigurationDetails',
    'addNewCashPaymentConfigurationDetails',
    'editCashPaymentConfigurationDetails'
  ]);


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CashPaymentConfigurationEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [CASHPAYMENTCONFIGURATION_FEATURE_KEY]: initialState
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
          provide: CashPaymentConfigurationService,
          useValue: cashPaymentConfigurationServiceSpy
        }
      ]
    });

    effect = TestBed.inject(CashPaymentConfigurationEffect);
  });

  describe('LoadCashPaymentConfiguration', () => {
    it('should return CashPaymentConfiguration', () => {

      const payload: CashPaymentConfiguration = {
        description: 'Desc',
        isActive: true,
        ruleDetails: null,
        ruleId: 1,
        ruleType: 'T'
      };

      const action = new LoadCashPaymentConfiguration(1);
      const outcome = new LoadCashPaymentConfigurationSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      cashPaymentConfigurationServiceSpy.getCashPaymentConfigurationDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCashPaymentConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {

      const action = new LoadCashPaymentConfiguration(1);
      const error = new Error('some error');
      const outcome = new LoadCashPaymentConfigurationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashPaymentConfigurationServiceSpy.getCashPaymentConfigurationDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCashPaymentConfiguration$).toBeObservable(expected);
    });
  });

  describe('LoadProductCategory Details', () => {
    it('should return a details of product category for LoadProductCategoryByProductCategoryCode', () => {

      const payload: CashPaymentConfiguration = {
        description: 'Desc',
        isActive: true,
        ruleDetails: null,
        ruleId: 1,
        ruleType: 'T'
      };

      const action = new AddNewCashPaymentConfiguration(payload);
      const outcome = new AddNewCashPaymentConfigurationSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      cashPaymentConfigurationServiceSpy.addNewCashPaymentConfigurationDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.addNewCashPaymentConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadProductCategoryByProductCategoryCode', () => {

      const payload: CashPaymentConfiguration = {
        description: 'Desc',
        isActive: true,
        ruleDetails: null,
        ruleId: 1,
        ruleType: 'T'
      };

      const action = new AddNewCashPaymentConfiguration(payload);
      const error = new Error('some error');
      const outcome = new AddNewCashPaymentConfigurationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashPaymentConfigurationServiceSpy.addNewCashPaymentConfigurationDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addNewCashPaymentConfiguration$).toBeObservable(expected);
    });
  });

  describe('saveProductCategoryFormDetails Details', () => {
    it('should return a details of product category for saveProductCategoryFormDetails', () => {

      const payload: { ruleId: number; cashPaymentConfigurationForm: CashPaymentConfiguration } = {
        ruleId: 1,
        cashPaymentConfigurationForm: {
          description: 'Desc',
          isActive: true,
          ruleDetails: null,
          ruleId: 1,
          ruleType: 'T'
        }
      };

      const action = new EditCashPaymentConfiguration(payload);
      const outcome = new EditCashPaymentConfigurationSuccess(payload.cashPaymentConfigurationForm);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload.cashPaymentConfigurationForm
      });
      cashPaymentConfigurationServiceSpy.editCashPaymentConfigurationDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editCashPaymentConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for saveProductCategoryFormDetails', () => {
      const payload: { ruleId: number; cashPaymentConfigurationForm: CashPaymentConfiguration } = {
        ruleId: 1,
        cashPaymentConfigurationForm: {
          description: 'Desc',
          isActive: true,
          ruleDetails: null,
          ruleId: 1,
          ruleType: 'T'
        }
      };

      const action = new EditCashPaymentConfiguration(payload);
      const error = new Error('some error');
      const outcome = new EditCashPaymentConfigurationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashPaymentConfigurationServiceSpy.editCashPaymentConfigurationDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editCashPaymentConfiguration$).toBeObservable(expected);
    });
  });


});
