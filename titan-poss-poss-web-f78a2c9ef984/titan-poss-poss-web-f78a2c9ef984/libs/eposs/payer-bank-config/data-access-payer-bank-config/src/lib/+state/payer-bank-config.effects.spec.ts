import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import { PayerBankConfigService } from '../payer-bank-config.service';
import { PayerBankConfigEffect } from './payer-bank-config.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { hot, cold } from 'jasmine-marbles';
import {
  PayerBankConfigDetails,
  PayerBankConfigListingPayload,
  PayerBankConfigListingSuccessPaylod,
  PayerBankConfiguration,
  PayerBankMaster,
  PaymentModeResponse,
  SavePayerBankConfigDetailsPayload,
  ToggleButtonPayload,
  UpdatePayerBankConfigPayload
} from '@poss-web/shared/models';
import {
  LoadPayerBankConfigurations,
  LoadPayerBankConfigurationsFailure,
  LoadPayerBankConfigurationsSuccess,
  LoadPayerBanks,
  LoadPayerBanksFailure,
  LoadPayerBanksSuccess,
  LoadPaymentModes,
  LoadPaymentModesFailure,
  LoadPaymentModesSuccess,
  PayerBankDetailsByConfigName,
  PayerBankDetailsByConfigNameFailure,
  PayerBankDetailsByConfigNameSuccess,
  SavePayerBankConfigDetails,
  SavePayerBankConfigDetailsFailure,
  SavePayerBankConfigDetailsSuccess,
  SearchConfigName,
  SearchConfigNameFailure,
  SearchConfigNameSuccess,
  SearchPayerBank,
  SearchPayerBankFailure,
  SearchPayerBankSuccess,
  UpdatePayerBankConfigDetails,
  UpdatePayerBankConfigDetailsFailure,
  UpdatePayerBankConfigDetailsSuccess,
  UpdateToggleButton,
  UpdateToggleButtonFailure,
  UpdateToggleButtonSuccess
} from './payer-bank-config.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
describe('PayerBankConfig Effects Testing Suite', () => {
  const payerBankConfigSpy = jasmine.createSpyObj<PayerBankConfigService>([
    'getPayerBankConfigListing',
    'searchConfigName',
    'searchPayerBanks',
    'savePayerBankDetails',
    'payerBankDetailsById',
    'updatePayerBankConfigDetails',
    'updateToggleButton',
    'loadPaymentModes',
    'loadPayerBanks'
  ]);
  let actions$: Observable<any>;
  let effect: PayerBankConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const initialState = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PayerBankConfigEffect,
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
          provide: PayerBankConfigService,
          useValue: payerBankConfigSpy
        }
      ]
    });
    effect = TestBed.inject(PayerBankConfigEffect);
  });
  const updatePayload: UpdatePayerBankConfigPayload = {
    id: 'abc123',
    configPayload: {
      description: 'Configuration',
      paymentCode: 'cc',
      paymentDetails: {},
      isActive: true
    },
    banksPayload: {
      addBankName: ['AXIS'],
      removeBankName: []
    }
  };
  const payerBankConfiguration: PayerBankConfiguration[] = [
    {
      id: 'abc123',
      description: 'Configuration',
      paymentCode: 'cc',
      isActive: true
    }
  ];

  const payerBankConfigResponse: PayerBankConfigListingSuccessPaylod = {
    payerBankListing: payerBankConfiguration,
    totalElements: 1
  };
  const payerBankConfigDetails: PayerBankConfigDetails = {
    configDetails: {
      description: 'Configuration',
      paymentCode: 'cc',
      paymentDetails: {},
      isActive: true
    },
    selectedBanks: [
      {
        id: 'abc123',
        configId: 'abc123',
        bankName: 'Axis'
      }
    ]
  };
  const paymentModes: PaymentModeResponse[] = [
    {
      value: 'abc123',
      description: 'cc'
    }
  ];
  const savePayload: SavePayerBankConfigDetailsPayload = {
    configPayload: {
      description: 'Configuration',
      paymentCode: 'cc',
      paymentDetails: {},
      isActive: true
    },
    banksPayload: {
      addBankName: ['AXIS'],
      removeBankName: []
    }
  };
  const payerBanks: PayerBankMaster[] = [
    {
      bankName: 'Axis',
      isActive: true
    }
  ];

  describe('loadPayerBankConfigurations', () => {
    const parameters: PayerBankConfigListingPayload = {
      pageIndex: 0,
      pageSize: 100
    };
    it('should return a stream with LoadPayerBankConfigurations', () => {
      const action = new LoadPayerBankConfigurations(parameters);
      const outcome = new LoadPayerBankConfigurationsSuccess(
        payerBankConfigResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payerBankConfigResponse });
      payerBankConfigSpy.getPayerBankConfigListing.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPayerBankConfigurations$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadPayerBankConfigurations(parameters);
      const error = new Error('some error');
      const outcome = new LoadPayerBankConfigurationsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payerBankConfigSpy.getPayerBankConfigListing.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPayerBankConfigurations$).toBeObservable(expected);
    });
  });

  describe('SavePayerBankConfigDetails', () => {
    it('should return a stream with SavePayerBankConfigDetails', () => {
      const action = new SavePayerBankConfigDetails(savePayload);
      const outcome = new SavePayerBankConfigDetailsSuccess('abc123');
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: 'abc123' });
      payerBankConfigSpy.savePayerBankDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.savePayerBankConfigDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SavePayerBankConfigDetails(savePayload);
      const error = new Error('some error');
      const outcome = new SavePayerBankConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payerBankConfigSpy.savePayerBankDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.savePayerBankConfigDetails$).toBeObservable(expected);
    });
  });
  describe('PayerBankDetailsByConfigName', () => {
    it('should return a stream with PayerBankDetailsByConfigName', () => {
      const action = new PayerBankDetailsByConfigName('abc123');
      const outcome = new PayerBankDetailsByConfigNameSuccess(
        payerBankConfigDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payerBankConfigDetails });
      payerBankConfigSpy.payerBankDetailsById.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.payerBankConfigDetailsById$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new PayerBankDetailsByConfigName('abc123');
      const error = new Error('some error');
      const outcome = new PayerBankDetailsByConfigNameFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payerBankConfigSpy.payerBankDetailsById.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.payerBankConfigDetailsById$).toBeObservable(expected);
    });
  });
  describe('UpdatePayerBankConfigDetails', () => {
    it('should return a stream with UpdatePayerBankConfigDetails', () => {
      const action = new UpdatePayerBankConfigDetails(updatePayload);
      const outcome = new UpdatePayerBankConfigDetailsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: null });
      payerBankConfigSpy.updatePayerBankConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updatePayerBankConfigDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new UpdatePayerBankConfigDetails(updatePayload);
      const error = new Error('some error');
      const outcome = new UpdatePayerBankConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payerBankConfigSpy.updatePayerBankConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updatePayerBankConfigDetails$).toBeObservable(expected);
    });
  });

  describe('SearchConfigName', () => {
    it('should return a stream with SearchConfigName', () => {
      const action = new SearchConfigName('Configuration');
      const outcome = new SearchConfigNameSuccess(payerBankConfiguration);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payerBankConfiguration });
      payerBankConfigSpy.searchConfigName.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchConfigName$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SearchConfigName('Configuration');
      const error = new Error('some error');
      const outcome = new SearchConfigNameFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payerBankConfigSpy.searchConfigName.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchConfigName$).toBeObservable(expected);
    });
  });

  describe('LoadPayerBanks', () => {
    const payload = {
      pageIndex: 0,
      pageSize: 10
    };
    it('should return a stream with LoadPayerBanks', () => {
      const action = new LoadPayerBanks(payload);
      const outcome = new LoadPayerBanksSuccess({
        payerBanks: payerBanks,
        totalElements: 1
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          payerBanks: payerBanks,
          totalElements: 1
        }
      });
      payerBankConfigSpy.loadPayerBanks.and.returnValue(response$);

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
      payerBankConfigSpy.loadPayerBanks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPayerBanks$).toBeObservable(expected);
    });
  });

  describe('UpdateToggleButton', () => {
    const updateToggleBbuttonPayload: ToggleButtonPayload = {
      isActive: true,
      id: 'abc123'
    };
    it('should return a stream with UpdateToggleButton', () => {
      const action = new UpdateToggleButton(updateToggleBbuttonPayload);
      const outcome = new UpdateToggleButtonSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: null
      });
      payerBankConfigSpy.updateToggleButton.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateToggleButton$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new UpdateToggleButton(updateToggleBbuttonPayload);
      const error = new Error('some error');
      const outcome = new UpdateToggleButtonFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payerBankConfigSpy.updateToggleButton.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateToggleButton$).toBeObservable(expected);
    });
  });

  describe('LoadPaymentModes', () => {
    it('should return a stream with LoadPaymentModes', () => {
      const action = new LoadPaymentModes();
      const outcome = new LoadPaymentModesSuccess(paymentModes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: paymentModes
      });
      payerBankConfigSpy.loadPaymentModes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPaymentModes$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadPaymentModes();
      const error = new Error('some error');
      const outcome = new LoadPaymentModesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payerBankConfigSpy.loadPaymentModes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPaymentModes$).toBeObservable(expected);
    });
  });

  describe('SearchPayerBank', () => {
    it('should return a stream with SearchPayerBank', () => {
      const action = new SearchPayerBank('Axis');
      const outcome = new SearchPayerBankSuccess(payerBanks);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payerBanks
      });
      payerBankConfigSpy.searchPayerBanks.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchPayerBank$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SearchPayerBank('Axis');
      const error = new Error('some error');
      const outcome = new SearchPayerBankFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payerBankConfigSpy.searchPayerBanks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchPayerBank$).toBeObservable(expected);
    });
  });
});
