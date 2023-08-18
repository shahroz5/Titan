//you here need to assert a reactive result as well as trigger an effect.
//To assert that an effect returns the right observable stream, we can use
// Rx Marbles.
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import {
  SearchMarketCodePayload,
  PaymentConfigurationListPayLoad,
  PaymentConfigurationList,
  SavePaymentConfigurationPayload,
  UpdatePaymentConfigurationPayload,
  PaymentConfiguration,
  MappedCount,
  LoadSelectedConfigById,
  SelectedOptionsData,
  UpdatePaymentConfigurationDetailsPayload
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { PaymentConfigurationEffect } from './payment-configuration.effect';
import { PaymentConfigurationService } from '../payment-configuration.service';
import {
  LoadPaymentModeCountSuccess,
  LoadPaymentModeCountFailure,
  LoadPaymentModeCount,
  LoadPaymentConfigurationListSuccess,
  LoadPaymentConfigurationListFailure,
  LoadPaymentConfigurationList,
  SearchPaymentConfigurationListSuccess,
  SearchPaymentConfigurationListFailure,
  SearchPaymentConfigurationList,
  CheckUniquePaymentNameSuccess,
  CheckUniquePaymentNameFailure,
  CheckUniquePaymentName,
  SavePaymentConfigurationSuccessFailure,
  SavePaymentConfiguration,
  SavePaymentConfigurationSuccess,
  UpdatePaymentConfigurationSuccess,
  UpdatePaymentConfigurationFailure,
  UpdatePaymentConfiguration,
  LoadPaymentConfigurationByConfigIdSuccess,
  LoadPaymentConfigurationByConfigIdFailure,
  LoadPaymentConfigurationByConfigId,
  LoadMappedCountSuccess,
  LoadMappedCount,
  LoadMappedCountFailure,
  LoadSelectedPaymentConfigurationDetailsByConfigIdSuccess,
  LoadSelectedPaymentConfigurationDetailsByConfigIdFailure,
  LoadSelectedPaymentConfigurationDetailsByConfigId,
  UpdateSelectedPaymentConfigurationDetailsByConfigIdSuccess,
  UpdateSelectedPaymentConfigurationDetailsByConfigIdFailure,
  UpdateSelectedPaymentConfigurationDetailsByConfigId,
  LoadTCSPaymentMode,
  LoadTCSPaymentModeSuccess,
  LoadTCSPaymentModeFailure
} from './payment-configuration.actions';

describe('PaymentConfigurationEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: PaymentConfigurationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let paymentConfigurationService = jasmine.createSpyObj<
    PaymentConfigurationService
  >('PaymentConfigurationService', [
    'getPaymentModeCount',
    'getPaymentConfigurationList',
    'searchPaymentConfigurationList',
    'getPaymentModes',
    'savePaymentConfiguration',
    'updatePaymentConfiguration',
    'getPaymentConfigurationByConfigId',
    'getSelectedPaymentConfigurationDetailsByConfigId',
    'getMappedCount',
    'updateSelectedPaymentConfigurationDetailsByConfigId',
    'getTcsPaymentMode'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentConfigurationEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },

        {
          provide: HttpClient,
          useValue: httpClientSpy
        },

        {
          provide: PaymentConfigurationService,
          useValue: {
            getPaymentModeCount: jasmine.createSpy(),
            getPaymentConfigurationList: jasmine.createSpy(),
            searchPaymentConfigurationList: jasmine.createSpy(),
            getPaymentModes: jasmine.createSpy(),
            savePaymentConfiguration: jasmine.createSpy(),
            updatePaymentConfiguration: jasmine.createSpy(),
            getPaymentConfigurationByConfigId: jasmine.createSpy(),
            getSelectedPaymentConfigurationDetailsByConfigId: jasmine.createSpy(),
            getMappedCount: jasmine.createSpy(),
            updateSelectedPaymentConfigurationDetailsByConfigId: jasmine.createSpy(),
            getTcsPaymentMode: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(PaymentConfigurationEffect);
    paymentConfigurationService = TestBed.inject<any>(
      PaymentConfigurationService
    );
  });

  describe('loadTcsPaymentMode', () => {
    const payload = 'AIRPAY';
    it('should return a stream with tcs payment modes', () => {
      const res = [
        {
          code: 'AIRPAY',
          id: '1',
          checked: true
        }
      ];

      const action = new LoadTCSPaymentMode(payload);
      const outcome = new LoadTCSPaymentModeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      paymentConfigurationService.getTcsPaymentMode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTcsPaymentMode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadTCSPaymentMode(payload);
      const error = new Error('some error');
      const outcome = new LoadTCSPaymentModeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentConfigurationService.getTcsPaymentMode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTcsPaymentMode$).toBeObservable(expected);
    });
  });
  describe('loadPaymentModeCount', () => {
    it('should return a stream with count', () => {
      const res = 10;

      const action = new LoadPaymentModeCount();
      const outcome = new LoadPaymentModeCountSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      paymentConfigurationService.getPaymentModeCount.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPaymentModeCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SearchMarketCodePayload = {
        data: {
          materialCode: 'J',
          marketCode: 'KA'
        },
        selectedStock: ''
      };

      const action = new LoadPaymentModeCount();
      const error = new Error('some error');
      const outcome = new LoadPaymentModeCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentConfigurationService.getPaymentModeCount.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPaymentModeCount$).toBeObservable(expected);
    });
  });

  describe('loadPaymentConfigurationList', () => {
    it('should return a stream with payment config list', () => {
      const payload: PaymentConfigurationListPayLoad = {
        pageSize: 10,
        pageIndex: 1
      };

      const res: PaymentConfigurationList = {
        paymentConfigurationList: [
          {
            paymentName: 'cash',
            configId: '1',
            isActive: true
          }
        ],
        totalElements: 10
      };

      const action = new LoadPaymentConfigurationList(payload);
      const outcome = new LoadPaymentConfigurationListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      paymentConfigurationService.getPaymentConfigurationList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPaymentConfigurationList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaymentConfigurationListPayLoad = {
        pageSize: 10,
        pageIndex: 1
      };

      const action = new LoadPaymentConfigurationList(payload);
      const error = new Error('some error');
      const outcome = new LoadPaymentConfigurationListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentConfigurationService.getPaymentConfigurationList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPaymentConfigurationList$).toBeObservable(expected);
    });
  });

  describe('searchPaymentConfigurationList', () => {
    it('should return a stream with payment config ', () => {
      const payload = 'cash';

      const res: PaymentConfigurationList = {
        paymentConfigurationList: [
          {
            paymentName: 'cash',
            configId: '1',
            isActive: true
          }
        ],
        totalElements: 10
      };

      const action = new SearchPaymentConfigurationList(payload);
      const outcome = new SearchPaymentConfigurationListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      paymentConfigurationService.searchPaymentConfigurationList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchPaymentConfigurationList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'cash';

      const action = new SearchPaymentConfigurationList(payload);
      const error = new Error('some error');
      const outcome = new SearchPaymentConfigurationListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentConfigurationService.searchPaymentConfigurationList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchPaymentConfigurationList$).toBeObservable(expected);
    });
  });

  describe('checkUniquePaymentName', () => {
    it('should return a stream with payment config ', () => {
      const payload = 'cash';

      const res: PaymentConfigurationList = {
        paymentConfigurationList: [
          {
            paymentName: 'cash',
            configId: '1',
            isActive: true
          }
        ],
        totalElements: 10
      };

      const action = new CheckUniquePaymentName(payload);
      const outcome = new CheckUniquePaymentNameSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      paymentConfigurationService.searchPaymentConfigurationList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.checkUniquePaymentName$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'cash';

      const action = new CheckUniquePaymentName(payload);
      const error = new Error('some error');
      const outcome = new CheckUniquePaymentNameFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentConfigurationService.searchPaymentConfigurationList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.checkUniquePaymentName$).toBeObservable(expected);
    });
  });

  describe('SavePaymentConfiguration', () => {
    it('should return a stream with config id ', () => {
      const payload: SavePaymentConfigurationPayload = {
        paymentConfiguration: {
          description: 'cash'
        },
        saveData: ''
      };

      const res = '1';

      const action = new SavePaymentConfiguration(payload);
      const outcome = new SavePaymentConfigurationSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      paymentConfigurationService.savePaymentConfiguration.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.SavePaymentConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SavePaymentConfigurationPayload = {
        paymentConfiguration: {
          description: 'cash'
        },
        saveData: ''
      };
      const action = new SavePaymentConfiguration(payload);
      const error = new Error('some error');
      const outcome = new SavePaymentConfigurationSuccessFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentConfigurationService.savePaymentConfiguration.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.SavePaymentConfiguration$).toBeObservable(expected);
    });
  });

  describe('updatePaymentConfiguration', () => {
    it('should return a stream UpdatePaymentConfigurationSuccess', () => {
      const payload: UpdatePaymentConfigurationPayload = {
        configId: '1',
        data: {
          isActive: false
        }
      };

      const action = new UpdatePaymentConfiguration(payload);
      const outcome = new UpdatePaymentConfigurationSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      paymentConfigurationService.updatePaymentConfiguration.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updatePaymentConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: UpdatePaymentConfigurationPayload = {
        configId: '1',
        data: {
          isActive: false
        }
      };
      const action = new UpdatePaymentConfiguration(payload);
      const error = new Error('some error');
      const outcome = new UpdatePaymentConfigurationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentConfigurationService.updatePaymentConfiguration.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updatePaymentConfiguration$).toBeObservable(expected);
    });
  });

  describe('loadPaymentConfigurationByConfigId', () => {
    it('should return a stream with payment config ', () => {
      const payload = '1';
      const res: PaymentConfiguration = {
        paymentName: 'cash',
        isActive: true,
        configId: '1'
      };
      const action = new LoadPaymentConfigurationByConfigId(payload);
      const outcome = new LoadPaymentConfigurationByConfigIdSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      paymentConfigurationService.getPaymentConfigurationByConfigId.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPaymentConfigurationByConfigId$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadPaymentConfigurationByConfigId(payload);
      const error = new Error('some error');
      const outcome = new LoadPaymentConfigurationByConfigIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentConfigurationService.getPaymentConfigurationByConfigId.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPaymentConfigurationByConfigId$).toBeObservable(
        expected
      );
    });
  });

  describe('loadMappedCount', () => {
    it('should return a stream with count', () => {
      const payload = '1';
      const res: MappedCount[] = [
        {
          paymentName: 'cash',
          count: 10
        }
      ];
      const action = new LoadMappedCount(payload);
      const outcome = new LoadMappedCountSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      paymentConfigurationService.getMappedCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMappedCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadMappedCount(payload);
      const error = new Error('some error');
      const outcome = new LoadMappedCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentConfigurationService.getMappedCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMappedCount$).toBeObservable(expected);
    });
  });

  describe('loadSelectedPaymentConfigurationByConfigId', () => {
    it('should return a stream with payment config', () => {
      const payload: LoadSelectedConfigById = {
        configId: '1',
        paymentName: 'cash'
      };
      const res: SelectedOptionsData = {
        selectedResponse: [
          {
            id: '1',
            rowHeaderKey: 'cm',
            columnHeaderKey: 'cash',
            configDetails: {}
          }
        ],
        selectedMap: null,
        count: 10,
        id: '1'
      };
      const action = new LoadSelectedPaymentConfigurationDetailsByConfigId(
        payload
      );
      const outcome = new LoadSelectedPaymentConfigurationDetailsByConfigIdSuccess(
        res
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      paymentConfigurationService.getSelectedPaymentConfigurationDetailsByConfigId.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedPaymentConfigurationByConfigId$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadSelectedConfigById = {
        configId: '1',
        paymentName: 'cash'
      };
      const action = new LoadSelectedPaymentConfigurationDetailsByConfigId(
        payload
      );
      const error = new Error('some error');
      const outcome = new LoadSelectedPaymentConfigurationDetailsByConfigIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentConfigurationService.getSelectedPaymentConfigurationDetailsByConfigId.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedPaymentConfigurationByConfigId$).toBeObservable(
        expected
      );
    });
  });

  describe('updateSelectedPaymentConfigurationByConfigId', () => {
    it('should return a stream with UpdateSelectedPaymentConfigurationDetailsByConfigIdSuccess', () => {
      const payload: UpdatePaymentConfigurationDetailsPayload = {
        configId: '1',
        data: {
          isActive: true
        }
      };

      const action = new UpdateSelectedPaymentConfigurationDetailsByConfigId(
        payload
      );
      const outcome = new UpdateSelectedPaymentConfigurationDetailsByConfigIdSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      paymentConfigurationService.updateSelectedPaymentConfigurationDetailsByConfigId.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(
        effect.updateSelectedPaymentConfigurationByConfigId$
      ).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: UpdatePaymentConfigurationDetailsPayload = {
        configId: '1',
        data: {
          isActive: true
        }
      };
      const action = new UpdateSelectedPaymentConfigurationDetailsByConfigId(
        payload
      );
      const error = new Error('some error');
      const outcome = new UpdateSelectedPaymentConfigurationDetailsByConfigIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      paymentConfigurationService.updateSelectedPaymentConfigurationDetailsByConfigId.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(
        effect.updateSelectedPaymentConfigurationByConfigId$
      ).toBeObservable(expected);
    });
  });
});
