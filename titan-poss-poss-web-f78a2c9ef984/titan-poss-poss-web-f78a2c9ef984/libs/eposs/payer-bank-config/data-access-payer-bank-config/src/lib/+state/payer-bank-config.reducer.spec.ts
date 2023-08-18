import {
  PayerBankConfigDetails,
  PayerBankConfigListingPayload,
  PayerBankConfiguration,
  PayerBankMaster,
  PaymentModeResponse,
  SavePayerBankConfigDetailsPayload,
  UpdatePayerBankConfigPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './payer-bank-config.actions';
import {
  initialState,
  PayerBankConfigurationReducer
} from './payer-bank-config.reducer';
import { PayerBankConfigState } from './payer-bank-config.state';

describe('PayerBankConfigReducer Testing Suite', () => {
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
  describe('Testing LoadPayerBankConfigurations', () => {
    it('LoadPayerBankConfigurations should return proper state', () => {
      const payload: PayerBankConfigListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new actions.LoadPayerBankConfigurations(payload);

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadPayerBankConfigurationsSuccess should return proper state', () => {
      const action = new actions.LoadPayerBankConfigurationsSuccess({
        payerBankListing: payerBankConfiguration,
        totalElements: 1
      });

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.payerBankConfigListing).toBe(payerBankConfiguration);
      expect(result.totalElements).toBe(1);
    });

    it('LoadPayerBankConfigurationsFailure should return error', () => {
      const action = new actions.LoadPayerBankConfigurationsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing SavePayerBankConfigDetails', () => {
    it('SavePayerBankConfigDetails should return proper state', () => {
      const action = new actions.SavePayerBankConfigDetails(savePayload);

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
    });
    it('SavePayerBankConfigDetailsSuccess should return proper state', () => {
      const action = new actions.SavePayerBankConfigDetailsSuccess('abc123');

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
      expect(result.configId).toBe('abc123');
    });
    it('SavePayerBankConfigDetailsFailure should return error', () => {
      const action = new actions.SavePayerBankConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSaved).toEqual(false);
    });
  });
  describe('Testing PayerBankDetailsByConfigName', () => {
    it('PayerBankDetailsByConfigName should return proper state', () => {
      const action = new actions.PayerBankDetailsByConfigName('abc123');

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('PayerBankDetailsByConfigNameSuccess should return proper state', () => {
      const action = new actions.PayerBankDetailsByConfigNameSuccess(
        payerBankConfigDetails
      );

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.payerBanksConfigDetails).toBe(payerBankConfigDetails);
    });

    it('PayerBankDetailsByConfigNameFailure should return error', () => {
      const action = new actions.PayerBankDetailsByConfigNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing UpdatePayerBankConfigDetails', () => {
    it('UpdatePayerBankConfigDetails should return proper state', () => {
      const action = new actions.UpdatePayerBankConfigDetails(updatePayload);

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });

    it('UpdatePayerBankConfigDetailsSuccess should return proper state', () => {
      const action = new actions.UpdatePayerBankConfigDetailsSuccess();

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
    });

    it('UpdatePayerBankConfigDetailsFailure should return error', () => {
      const action = new actions.UpdatePayerBankConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasUpdated).toEqual(false);
    });
  });
  describe('SearchConfigName Testting', () => {
    it('SearchConfigName should return proper state', () => {
      const action = new actions.SearchConfigName('Configuration');

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSearched).toBe(false);
    });

    it('SearchConfigNameSuccess should return proper state', () => {
      const action = new actions.SearchConfigNameSuccess(
        payerBankConfiguration
      );

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSearched).toBe(true);
      expect(result.payerBankConfigListing).toBe(payerBankConfiguration);
      expect(result.totalElements).toBe(0);
    });

    it('SearchConfigNameFailure should return error', () => {
      const action = new actions.SearchConfigNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSearched).toEqual(false);
    });
  });
  describe('LoadPayerBanks Testing', () => {
    it('LoadPayerBanks should return proper state', () => {
      const action = new actions.LoadPayerBanks({
        pageIndex: 0,
        pageSize: 10
      });

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadPayerBanksSuccess should return proper state', () => {
      const payerBankResponse = {
        payerBanks: payerBanks,
        totalElements: 0
      };
      const action = new actions.LoadPayerBanksSuccess(payerBankResponse);

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.banksCount).toBe(payerBankResponse.totalElements);
      expect(result.payerBanks).toBe(payerBankResponse.payerBanks);
    });

    it('LoadPayerBanksFailure should return error', () => {
      const action = new actions.LoadPayerBanksFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('UpdateToggleButton Testing', () => {
    it('UpdateToggleButton should return proper state', () => {
      const updateTogglePayload = {
        isActive: true,
        id: 'abc123'
      };
      const action = new actions.UpdateToggleButton(updateTogglePayload);

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateToggleButtonSuccess should return proper state', () => {
      const action = new actions.UpdateToggleButtonSuccess();

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateToggleButtonFailure should return error', () => {
      const action = new actions.UpdateToggleButtonFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasUpdated).toEqual(false);
    });
  });
  describe('Testing ResetPayerBankConfigDetails', () => {
    it('ResetPayerBankConfigDetails should return proper state', () => {
      const updateTogglePayload = {
        isActive: true,
        id: 'abc123'
      };
      const action = new actions.ResetPayerBankConfigDetails();

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(false);
      expect(result.hasSaved).toBe(false);
      expect(result.error).toBe(null);
      expect(result.configId).toBe(null);
      expect(result.payerBanksConfigDetails).toBe(null);
    });
  });
  describe('LoadPaymentModes Testing', () => {
    it('LoadPaymentModes should return proper state', () => {
      const action = new actions.LoadPaymentModes();

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadPaymentModesSuccess should return proper state', () => {
      const action = new actions.LoadPaymentModesSuccess(paymentModes);

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.paymentModes).toBe(paymentModes);
    });
    it('LoadPaymentModesFailure should return error', () => {
      const action = new actions.LoadPaymentModesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing SearchPayerBank', () => {
    it('SearchPayerBank should return proper state', () => {
      const action = new actions.SearchPayerBank('Axis');

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('SearchPayerBankSuccess should return proper state', () => {
      const action = new actions.SearchPayerBankSuccess(payerBanks);

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.payerBanks).toBe(payerBanks);
    });
    it('SearchPayerBankFailure should return error', () => {
      const action = new actions.SearchPayerBankFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PayerBankConfigState = PayerBankConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
});
