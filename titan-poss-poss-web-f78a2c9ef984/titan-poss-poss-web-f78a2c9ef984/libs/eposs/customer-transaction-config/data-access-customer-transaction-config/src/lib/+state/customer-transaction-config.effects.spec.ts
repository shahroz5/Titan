import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  CheckBoxHeader,
  CustomerConfigDetails,
  CustomerTransactionConfigListPayload,
  CustomerTransactionConfigListResponse,
  SaveCustomerTranConfigDetails,
  UpdateStatus
} from '@poss-web/shared/models';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { Observable } from 'rxjs';
import { CustomerTransactionConfigService } from '../customer-transaction-config.service';
import {
  GetCustomerTransactionConfigDetails,
  GetCustomerTransactionConfigDetailsFailure,
  GetCustomerTransactionConfigDetailsSuccess,
  LoadCustomers,
  LoadCustomersFailure,
  LoadCustomersSuccess,
  LoadCustomerTransactionConfigList,
  LoadCustomerTransactionConfigListFailure,
  LoadCustomerTransactionConfigListSuccess,
  LoadTransactionTypes,
  LoadTransactionTypesFailure,
  LoadTransactionTypesSuccess,
  SaveCustomerTransactionConfigDetails,
  SaveCustomerTransactionConfigDetailsFailure,
  SaveCustomerTransactionConfigDetailsSuccess,
  SearchConfigName,
  SearchConfigNameFailure,
  SearchConfigNameSuccess,
  UpdateConfigStatus,
  UpdateConfigStatusFailure,
  UpdateConfigStatusSucceess,
  UpdateCustomerTransactionConfigDetails,
  UpdateCustomerTransactionConfigDetailsFailure,
  UpdateCustomerTransactionConfigDetailsSuccess
} from './customer-transaction-config.actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { CustomerTransactionConfigEffects } from './customer-transaction-config.effects';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
describe('CustomerTransactionConfigEffects Testing Suite', () => {
  const customerTransactionServiceSpy = jasmine.createSpyObj<
    CustomerTransactionConfigService
  >([
    'loadConfigList',
    'searchConfigName',
    'updateStatus',
    'loadCustomers',
    'saveCustomerTranConfigDetails',
    'updateCustomerTranConfigDetails',
    'getCustomerTranConfigDetails'
  ]);
  const lovDataServiceSpy = jasmine.createSpyObj<LovDataService>([
    'getSalesLovs'
  ]);
  const customerConfigDetails: CustomerConfigDetails = {
    createConfig: {
      configId: '123',
      description: 'Configuration',
      isActive: true
    },
    configDetails: [
      {
        id: '123',
        rowHeaderKey: 'customer',
        columnHeaderKey: 'transaction'
      }
    ]
  };
  const listPayload: CustomerTransactionConfigListPayload = {
    pageIndex: 0,
    pageSize: 100,
    length: 0
  };
  const configListResponse: CustomerTransactionConfigListResponse = {
    configList: [
      {
        configId: '123',
        description: 'Configuration',
        isActive: true
      }
    ],
    totalElements: 1
  };
  const savePayload: SaveCustomerTranConfigDetails = {
    createConfig: {
      description: 'Configuration',
      isActive: true,
      configType: 'CUSTOMER_CONFIG'
    },
    configDetails: {
      addConfigs: [
        {
          customerType: 'AB',
          transactionType: 'TC'
        }
      ],
      removeConfigs: []
    }
  };
  const updateStatusPayload: UpdateStatus = {
    configId: 'ABC123',
    isActive: true,
    configType: 'CUSTOMER_CONFIG'
  };
  const transactionResponse: CheckBoxHeader[] = [
    {
      title: 'transaction',
      key: 'transaction'
    }
  ];
  const customersResponse: CheckBoxHeader[] = [
    {
      title: 'customer',
      key: 'customer'
    }
  ];
  let actions$: Observable<any>;
  let effect: CustomerTransactionConfigEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const initialState = {};
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomerTransactionConfigEffects,
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
          provide: CustomerTransactionConfigService,
          useValue: customerTransactionServiceSpy
        },
        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(CustomerTransactionConfigEffects);
  });
  describe('LoadCustomerTransactionConfigList', () => {
    it('should return a stream with loadCustomerTransactionConfigList', () => {
      const action = new LoadCustomerTransactionConfigList(listPayload);
      const outcome = new LoadCustomerTransactionConfigListSuccess(
        configListResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: configListResponse });
      customerTransactionServiceSpy.loadConfigList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCustomerTransactionConfigList$).toBeObservable(
        expected$
      );
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadCustomerTransactionConfigList(listPayload);
      const error = new Error('some error');
      const outcome = new LoadCustomerTransactionConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerTransactionServiceSpy.loadConfigList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCustomerTransactionConfigList$).toBeObservable(
        expected
      );
    });
  });
  describe('SearchConfigName', () => {
    it('should return a stream with searchConfigName', () => {
      const action = new SearchConfigName('abc123');
      const outcome = new SearchConfigNameSuccess(
        configListResponse.configList
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: configListResponse.configList });
      customerTransactionServiceSpy.searchConfigName.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchConfigName$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SearchConfigName('abc123');
      const error = new Error('some error');
      const outcome = new SearchConfigNameFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerTransactionServiceSpy.searchConfigName.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchConfigName$).toBeObservable(expected);
    });
  });

  describe('UpdateConfigStatus', () => {
    it('should return a stream with updateConfigStatus', () => {
      const action = new UpdateConfigStatus(updateStatusPayload);
      const outcome = new UpdateConfigStatusSucceess();
      actions$ = hot('-a', { a: action });

      // customerTransactionServiceSpy.updateStatus.and.returnValue(response$);

      // const expected$ = cold('--b', { b: outcome });
      // expect(effect.searchConfigName$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new UpdateConfigStatus(updateStatusPayload);
      const error = new Error('some error');
      const outcome = new UpdateConfigStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerTransactionServiceSpy.updateStatus.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateConfigStatus$).toBeObservable(expected);
    });
  });
  xdescribe('LoadTransactionTypes', () => {
    it('should return a stream with LoadTransactionTypes', () => {
      const action = new LoadTransactionTypes('TRANSACTION_TYPE');
      const outcome = new LoadTransactionTypesSuccess(transactionResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: transactionResponse });
      lovDataServiceSpy.getSalesLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTransactionTypes$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadTransactionTypes('TRANSACTION_TYPE');
      const error = new Error('some error');
      const outcome = new LoadTransactionTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataServiceSpy.getSalesLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTransactionTypes$).toBeObservable(expected);
    });
  });
  describe('LoadCustomerTypes', () => {
    it('should return a stream with LoadCustomerTypes', () => {
      const action = new LoadCustomers();
      const outcome = new LoadCustomersSuccess(customersResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: customersResponse });
      customerTransactionServiceSpy.loadCustomers.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCustomers$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadCustomers();
      const error = new Error('some error');
      const outcome = new LoadCustomersFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerTransactionServiceSpy.loadCustomers.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCustomers$).toBeObservable(expected);
    });
  });
  describe('SaveCustomerTransactionConfigDetails', () => {
    it('should return a stream with SaveCustomerTransactionConfigDetails', () => {
      const action = new SaveCustomerTransactionConfigDetails(savePayload);
      const outcome = new SaveCustomerTransactionConfigDetailsSuccess('abc123');
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: 'abc123' });
      customerTransactionServiceSpy.saveCustomerTranConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveCustomerTransConfigDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveCustomerTransactionConfigDetails(savePayload);
      const error = new Error('some error');
      const outcome = new SaveCustomerTransactionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerTransactionServiceSpy.saveCustomerTranConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveCustomerTransConfigDetails$).toBeObservable(expected);
    });
  });
  describe('UpdateCustomerTransactionConfigDetails', () => {
    it('should return a stream with UpdateCustomerTransactionConfigDetails', () => {
      const action = new UpdateCustomerTransactionConfigDetails(savePayload);
      const outcome = new UpdateCustomerTransactionConfigDetailsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: savePayload });
      customerTransactionServiceSpy.updateCustomerTranConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateCustomerTransConfigDetails$).toBeObservable(
        expected$
      );
    });
    it('should fail and return an action with the error', () => {
      const action = new UpdateCustomerTransactionConfigDetails(savePayload);
      const error = new Error('some error');
      const outcome = new UpdateCustomerTransactionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerTransactionServiceSpy.updateCustomerTranConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateCustomerTransConfigDetails$).toBeObservable(expected);
    });
  });
  describe('GetCustomerTransactionConfigDetails', () => {
    it('should return a stream with GetCustomerTransactionConfigDetails', () => {
      const action = new GetCustomerTransactionConfigDetails('abc123');
      const outcome = new GetCustomerTransactionConfigDetailsSuccess(
        customerConfigDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: customerConfigDetails });
      customerTransactionServiceSpy.getCustomerTranConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.getCustomerTransConfigDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new GetCustomerTransactionConfigDetails('abc123');
      const error = new Error('some error');
      const outcome = new GetCustomerTransactionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerTransactionServiceSpy.getCustomerTranConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.getCustomerTransConfigDetails$).toBeObservable(expected);
    });
  });
});
