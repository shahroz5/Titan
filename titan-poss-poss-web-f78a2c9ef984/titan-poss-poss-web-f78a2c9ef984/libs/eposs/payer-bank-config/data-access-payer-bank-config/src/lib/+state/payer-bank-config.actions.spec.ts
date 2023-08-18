import {
  CustomErrors,
  PayerBankConfigDetails,
  PayerBankConfigListingPayload,
  PayerBankConfigListingSuccessPaylod,
  PayerBankConfiguration,
  PayerBankMaster,
  PaymentModeResponse,
  SavePayerBankConfigDetailsPayload,
  UpdatePayerBankConfigPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
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
  PayerBankConfigActionTypes,
  PayerBankDetailsByConfigName,
  PayerBankDetailsByConfigNameFailure,
  PayerBankDetailsByConfigNameSuccess,
  ResetPayerBankConfigDetails,
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

describe('PayerBankConfig Action TestCases', () => {
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
  const payerBankConfigListResponse: PayerBankConfigListingSuccessPaylod = {
    payerBankListing: payerBankConfiguration,
    totalElements: 1
  };
  describe('LoadPayerBankConfigurations Action TestCases', () => {
    it('should check correct type is used for LoadPayerBankConfigurations action ', () => {
      const payload: PayerBankConfigListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPayerBankConfigurations(payload);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.LOAD_PAYER_BANK_CONFIGURATIONS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadPayerBankConfigurationsSuccess action ', () => {
      const payload: PayerBankConfigListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPayerBankConfigurationsSuccess(
        payerBankConfigListResponse
      );

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.LOAD_PAYER_BANK_CONFIGURATIONS_SUCCESS
      );
      expect(action.payload).toEqual(payerBankConfigListResponse);
    });
    it('should check correct type is used for LoadPayerBankConfigurationsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPayerBankConfigurationsFailure(payload);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.LOAD_PAYER_BANK_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SavePayerBankConfigDetails Action TestCases', () => {
    it('should check correct type is used for SavePayerBankConfigDetails action ', () => {
      const action = new SavePayerBankConfigDetails(savePayload);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.SAVE_PAYER_BANK_CONFIG_DETAILS
      );
      expect(action.payload).toEqual(savePayload);
    });
    it('should check correct type is used for SavePayerBankConfigDetailsSuccess action ', () => {
      const action = new SavePayerBankConfigDetailsSuccess('abc123');

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.SAVE_PAYER_BANK_CONFIG_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual('abc123');
    });

    it('should check correct type is used for SavePayerBankConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SavePayerBankConfigDetailsFailure(payload);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.SAVE_PAYER_BANK_CONFIG_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('PayerBankDetailsByConfigName TestCases', () => {
    it('should check correct type is used for PayerBankDetailsByConfigName action ', () => {
      const action = new PayerBankDetailsByConfigName('abc123');

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME
      );
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for PayerBankDetailsByConfigNameSuccess action ', () => {
      const action = new PayerBankDetailsByConfigNameSuccess(
        payerBankConfigDetails
      );

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME_SUCCESS
      );
      expect(action.payload).toEqual(payerBankConfigDetails);
    });

    it('should check correct type is used for PayerBankDetailsByConfigNameFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PayerBankDetailsByConfigNameFailure(payload);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('UpdatePayerBankConfigDetails Action TestCases', () => {
    it('should check correct type is used for UpdatePayerBankConfigDetails action ', () => {
      const action = new UpdatePayerBankConfigDetails(updatePayload);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.UPDATE_PAYER_BANK_CONFIG_DETAILS
      );
      expect(action.payload).toEqual(updatePayload);
    });
    it('should check correct type is used for UpdatePayerBankConfigDetailsSuccess action ', () => {
      const action = new UpdatePayerBankConfigDetailsSuccess();

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.UPDATE_PAYER_BANK_CONFIG_DETAILS_SUCCESS
      );
    });

    it('should check correct type is used for UpdatePayerBankConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdatePayerBankConfigDetailsFailure(payload);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.UPDATE_PAYER_BANK_CONFIG_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SearchConfigName Action TestCases', () => {
    it('should check correct type is used for SearchConfigName action ', () => {
      const action = new SearchConfigName('configuration');

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.SEARCH_CONFIG_NAME
      );
      expect(action.payload).toEqual('configuration');
    });
    it('should check correct type is used for SearchConfigNameSuccess action ', () => {
      const action = new SearchConfigNameSuccess(
        payerBankConfigListResponse.payerBankListing
      );

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.SEARCH_CONFIG_NAME_SUCCESS
      );
      expect(action.payload).toEqual(
        payerBankConfigListResponse.payerBankListing
      );
    });
    it('should check correct type is used for SearchConfigNameFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchConfigNameFailure(payload);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.SEARCH_CONFIG_NAME_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadPayerBanks Action TestCases', () => {
    it('should check correct type is used for LoadPayerBanks action ', () => {
      const action = new LoadPayerBanks({ pageIndex: 0, pageSize: 10 });

      expect(action.type).toEqual(PayerBankConfigActionTypes.LOAD_PAYER_BANKS);
      expect(action.payload).toEqual({ pageIndex: 0, pageSize: 10 });
    });
    it('should check correct type is used for LoadPayerBanksSuccess action ', () => {
      const action = new LoadPayerBanksSuccess({
        payerBanks: payerBanks,
        totalElements: 1
      });

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.LOAD_PAYER_BANKS_SUCCESS
      );
      expect(action.payload).toEqual({
        payerBanks: payerBanks,
        totalElements: 1
      });
    });

    it('should check correct type is used for LoadPayerBanksFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPayerBanksFailure(payload);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.LOAD_PAYER_BANKS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('UpdateToggleButton Action TestCases', () => {
    it('should check correct type is used for UpdateToggleButton action ', () => {
      const action = new UpdateToggleButton({ isActive: true, id: 'abc123' });

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.UPDATE_TOGGLE_BUTTON
      );
      expect(action.payload).toEqual({ isActive: true, id: 'abc123' });
    });

    it('should check correct type is used for UpdateToggleButtonSuccess action ', () => {
      const action = new UpdateToggleButtonSuccess();

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.UPDATE_TOGGLE_BUTTON_SUCCESS
      );
    });

    it('should check correct type is used for UpdateToggleButtonFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateToggleButtonFailure(payload);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.UPDATE_TOGGLE_BUTTON_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ResetPayerBankConfigDetails Action TestCases', () => {
    it('should check correct type is used for ResetPayerBankConfigDetails action ', () => {
      const action = new ResetPayerBankConfigDetails();

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.RESET_PAYER_BANK_CONFIG_DETAILS
      );
    });
  });
  describe('LoadPaymentModes Action TestCases', () => {
    it('should check correct type is used for LoadPaymentModes action ', () => {
      const action = new LoadPaymentModes();

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.LOAD_PAYMENT_MODES
      );
    });

    it('should check correct type is used for LoadPaymentModesSuccess action ', () => {
      const action = new LoadPaymentModesSuccess(paymentModes);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.LOAD_PAYMENT_MODES_SUCCESS
      );
      expect(action.payload).toEqual(paymentModes);
    });

    it('should check correct type is used for LoadPaymentModesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPaymentModesFailure(payload);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.LOAD_PAYMENT_MODES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SearchPayerBank Action TestCases', () => {
    it('should check correct type is used for SearchPayerBank action ', () => {
      const action = new SearchPayerBank('Axis');

      expect(action.type).toEqual(PayerBankConfigActionTypes.SEARCH_PAYER_BANK);
      expect(action.payload).toEqual('Axis');
    });
    it('should check correct type is used for SearchPayerBankSuccess action ', () => {
      const action = new SearchPayerBankSuccess(payerBanks);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.SEARCH_PAYER_BANK_SUCCESS
      );
      expect(action.payload).toEqual(payerBanks);
    });

    it('should check correct type is used for SearchPayerBankFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchPayerBankFailure(payload);

      expect(action.type).toEqual(
        PayerBankConfigActionTypes.SEARCH_PAYER_BANK_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
