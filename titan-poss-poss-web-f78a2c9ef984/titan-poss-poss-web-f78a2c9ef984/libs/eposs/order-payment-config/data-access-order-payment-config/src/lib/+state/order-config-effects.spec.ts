import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from "@nrwl/angular";
import { ProductGroupDataService } from "@poss-web/shared/masters/data-access-masters";
import { POSS_WEB_API_URL, POSS_WEB_CACHING_STRATEGY } from "@poss-web/shared/util-config";
import { Observable } from "rxjs"
import { hot, cold } from 'jasmine-marbles';
import { OrderPaymentConfigService } from "../order-payment-config.service";
import{ OrderPaymentConfigEffect } from "./order-config.effects";
import { LoadOrderPaymentsConfigList, LoadOrderPaymentsConfigListFailure, LoadOrderPaymentsConfigListSuccess, LoadProductGroupMapping, LoadProductGroupMappingFailure, LoadProductGroupMappingSuccess, LoadSelectedConfigDetails, LoadSelectedConfigDetailsFailure, LoadSelectedConfigDetailsSuccess, SaveOderPaymentConfig, SaveOderPaymentConfigSuccess, SaveOderPaymentConfigFailure, SearchConfigDetailsByConfigName, SearchConfigDetailsByConfigNameFailure, SearchConfigDetailsByConfigNameSuccess, UpdateConfigIsActive, UpdateConfigIsActiveFailure, UpdateConfigIsActiveSuccess } from "./order-config.actions";
import { OrderPaymentConfigList, OrderPaymentConfigPayload, OrderPaymentConfigReqPayload, OrderpyamentRulesResponse, ProductGroup, SaveOrderPaymentsPayload, UpdateOrderPaymentConfigPayload } from "@poss-web/shared/models";
import { CustomErrorAdaptor } from "@poss-web/shared/util-adaptors";

const loadOrderPaymentPayload: OrderPaymentConfigList = {
  configList: [{}],
  totalElements: 10
}
const orderPaymentConfigReqPayload: OrderPaymentConfigReqPayload = {
  pageIndex: 0,
  pageSize: 10,
  length: 8
}
const saveOrderPaymentPayload: SaveOrderPaymentsPayload = {
  configDetail: {
    description: 'Des',
    isActive: false
  },
  orderPaymentConfigRequest: {}
}

describe('Order Payment Effects Testing Suite', () => {
let actions$: Observable<any>;
let effect: OrderPaymentConfigEffect;
const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
  'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let orderPaymentService = jasmine.createSpyObj<OrderPaymentConfigService>(
    'OrderPaymentConfigService',
    [
      'getOrderPaymentConfigList',
      'updateIsActive',
      'getSelectedConfigDetails',
      'searchConfigDetailsByconfigName',
      'saveOrderPaymentsConfig',
      'removeConfig',
      'updateConfig',
      'getSelectedConfigPaymentDetails',
      'uniqueConfigNameCheck'
    ]
  );
  let productGroupDataService = jasmine.createSpyObj<ProductGroupDataService>(
    'ProductGroupDataService',
    ['getProductGroups']
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderPaymentConfigEffect,
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
          provide: OrderPaymentConfigService,
          useValue: {
            getOrderPaymentConfigList: jasmine.createSpy(),
            updateIsActive: jasmine.createSpy(),
            getSelectedConfigDetails: jasmine.createSpy(),
            searchConfigDetailsByconfigName: jasmine.createSpy(),
            saveOrderPaymentsConfig: jasmine.createSpy(),
            removeConfig: jasmine.createSpy(),
            updateConfig: jasmine.createSpy(),
            getSelectedConfigPaymentDetails: jasmine.createSpy(),
            uniqueConfigNameCheck: jasmine.createSpy(),
          }
        },
        {
          provide: ProductGroupDataService,
          useValue: {
            getProductGroups: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(OrderPaymentConfigEffect);
    orderPaymentService = TestBed.inject<any>(OrderPaymentConfigService);
    productGroupDataService = TestBed.inject(ProductGroupDataService) as jasmine.SpyObj<
    ProductGroupDataService
    >;
  });

  describe('loadOrderPaymentConfig', () => {
    it('should return loadOrderPaymentConfig response', () => {
      const action = new LoadOrderPaymentsConfigList(orderPaymentConfigReqPayload);
      const outcome = new LoadOrderPaymentsConfigListSuccess(loadOrderPaymentPayload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: loadOrderPaymentPayload
      });
      orderPaymentService.getOrderPaymentConfigList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadOrderPaymentConfig$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const action = new LoadOrderPaymentsConfigList(orderPaymentConfigReqPayload);
      const error = new Error('some error');
      const outcome = new LoadOrderPaymentsConfigListFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      orderPaymentService.getOrderPaymentConfigList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadOrderPaymentConfig$).toBeObservable(expected);
    });
  })
  describe('updateIsActive', () => {
    it('should return updateIsActive response', () => {
      const payload: UpdateOrderPaymentConfigPayload = {
        id: 'id',
        data: null
      }
      const action = new UpdateConfigIsActive(payload);
      const outcome = new UpdateConfigIsActiveSuccess('');

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: ''
      });
      orderPaymentService.updateIsActive.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.updateIsActive$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const payload: UpdateOrderPaymentConfigPayload = {
        id: 'id',
        data: null
      }
      const action = new UpdateConfigIsActive(payload);
      const error = new Error('some error');
      const outcome = new UpdateConfigIsActiveFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      orderPaymentService.updateIsActive.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateIsActive$).toBeObservable(expected);
    });
  })

  describe('loadSelectedConfigDetails', () => {
    it('should return loadSelectedConfigDetails response', () => {
      const payload: OrderPaymentConfigPayload = {}

      const action = new LoadSelectedConfigDetails('');
      const outcome = new LoadSelectedConfigDetailsSuccess(payload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: payload
      });
      orderPaymentService.getSelectedConfigDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadSelectedConfigDetails$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const action = new LoadSelectedConfigDetails('');
      const error = new Error('some error');
      const outcome = new LoadSelectedConfigDetailsFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      orderPaymentService.getSelectedConfigDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedConfigDetails$).toBeObservable(expected);
    });
  })

  describe('SearchConfigDetailsByConfigName', () => {
    it('should return SearchConfigDetailsByConfigName response', () => {
      const action = new SearchConfigDetailsByConfigName('');
      const outcome = new SearchConfigDetailsByConfigNameSuccess(loadOrderPaymentPayload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: loadOrderPaymentPayload
      });
      orderPaymentService.searchConfigDetailsByconfigName.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.SearchConfigDetailsByConfigName$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const action = new SearchConfigDetailsByConfigName('');
      const error = new Error('some error');
      const outcome = new SearchConfigDetailsByConfigNameFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      orderPaymentService.searchConfigDetailsByconfigName.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.SearchConfigDetailsByConfigName$).toBeObservable(expected);
    });
  })

  describe('loadProductGroups', () => {
    it('should return loadProductGroups response', () => {
      const payload: ProductGroup[] = [{
        description: 'des',
        productGroupCode: 'prodGroup'
      }]
      const action = new LoadProductGroupMapping();
      const outcome = new LoadProductGroupMappingSuccess(payload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: payload
      });
      productGroupDataService.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const action = new LoadProductGroupMapping();
      const error = new Error('some error');
      const outcome = new LoadProductGroupMappingFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      productGroupDataService.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected);
    });
  })

  describe('saveOrderpaymentConfig', () => {
    it('should return saveOrderpaymentConfig response', () => {
      const action = new SaveOderPaymentConfig(saveOrderPaymentPayload);
      const outcome = new SaveOderPaymentConfigSuccess('configId');

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: 'configId'
      });
      orderPaymentService.saveOrderPaymentsConfig.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.saveOrderpaymentConfig$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const action = new SaveOderPaymentConfig(saveOrderPaymentPayload);
      const error = new Error('some error');
      const outcome = new SaveOderPaymentConfigFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      orderPaymentService.saveOrderPaymentsConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveOrderpaymentConfig$).toBeObservable(expected);
    });
  })
})
