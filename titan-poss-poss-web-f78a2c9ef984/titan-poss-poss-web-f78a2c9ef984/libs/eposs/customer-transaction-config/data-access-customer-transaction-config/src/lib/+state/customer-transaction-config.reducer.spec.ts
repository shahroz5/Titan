import {
  CheckBoxHeader,
  CustomerConfigDetails,
  CustomerTransactionConfigListPayload,
  CustomerTransactionConfigListResponse,
  SaveCustomerTranConfigDetails,
  UpdateStatus
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './customer-transaction-config.actions';
import {
  CustomerTransactionConfigReducer,
  initialState
} from './customer-transaction-config.reducer';
import { CustomerTransactionConfigState } from './customer-transaction-config.state';
describe('CustomerTransactionConfig Reducer Testing Suite', () => {
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
  const customerResponse: CheckBoxHeader[] = [
    {
      title: 'customer',
      key: 'customer'
    }
  ];
  describe('Testing LoadCustomerTransactionConfigList', () => {
    it('LoadCustomerTransactionConfigList should return proper state', () => {
      const action = new actions.LoadCustomerTransactionConfigList(listPayload);

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadCustomerTransactionConfigListSuccess should return success response', () => {
      const action = new actions.LoadCustomerTransactionConfigListSuccess(
        configListResponse
      );

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.configList).toBe(configListResponse.configList);
      expect(result.totalElements).toBe(configListResponse.totalElements);
    });
    it('LoadCFAProductCodeFailure should return error', () => {
      const action = new actions.LoadCustomerTransactionConfigListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing SearchConfigName', () => {
    it('SearchConfigName should return proper state', () => {
      const action = new actions.SearchConfigName('configuration');

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSearched).toBe(false);
    });
    it('SearchConfigNameSuccess should return proper state', () => {
      const action = new actions.SearchConfigNameSuccess(
        configListResponse.configList
      );

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSearched).toBe(true);
      expect(result.configList).toBe(configListResponse.configList);
      expect(result.totalElements).toBe(0);
    });
    it('SearchConfigNameFailure should return error', () => {
      const action = new actions.SearchConfigNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSearched).toEqual(false);
    });
  });
  describe('UpdateConfigStatus TestCases', () => {
    it('UpdateConfigStatus should return proper state', () => {
      const action = new actions.UpdateConfigStatus(updateStatusPayload);

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasStatusUpdated).toBe(false);
    });
    it('UpdateConfigStatusSuccess should return proper state', () => {
      const action = new actions.UpdateConfigStatusSucceess();

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasStatusUpdated).toBe(true);
    });
    it('UpdateConfigStatusFailure should return error', () => {
      const action = new actions.UpdateConfigStatusFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasStatusUpdated).toEqual(false);
    });
  });
  describe('LoadTransactionTypes TestCases', () => {
    it('LoadTransactionTypes should return proper state', () => {
      const action = new actions.LoadTransactionTypes('TRANSACTION_TYPE');

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadTransactionTypesSuccess should return proper state', () => {
      const action = new actions.LoadTransactionTypesSuccess(
        transactionResponse
      );

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.transactionTypes).toBe(transactionResponse);
    });
    it('LoadTransactionTypesFailure should return error', () => {
      const action = new actions.LoadTransactionTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('LoadCustomers TestCases', () => {
    it('LoadCustomers should return proper state', () => {
      const action = new actions.LoadCustomers();

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadCustomersSuccess should return proper state', () => {
      const action = new actions.LoadCustomersSuccess(customerResponse);

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.customers).toBe(customerResponse);
    });
    it('LoadCustomersFailure should return error', () => {
      const action = new actions.LoadCustomersFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('SaveCustomerTransactionConfigDetails TestCases', () => {
    it('SaveCustomerTransactionConfigDetails should return proper state', () => {
      const action = new actions.SaveCustomerTransactionConfigDetails(
        savePayload
      );

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
    });
    it('SaveCustomerTransactionConfigDetailsSuccess should return proper state', () => {
      const action = new actions.SaveCustomerTransactionConfigDetailsSuccess(
        'abc123'
      );

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
      expect(result.configId).toBe('abc123');
    });
    it('SaveCustomerTransactionConfigDetailsFailure should return error', () => {
      const action = new actions.SaveCustomerTransactionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSaved).toEqual(false);
    });
  });
  describe('UpdateCustomerTransactionConfigDetails TestCases', () => {
    it('UpdateCustomerTransactionConfigDetails should return proper state', () => {
      const action = new actions.UpdateCustomerTransactionConfigDetails(
        savePayload
      );

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateCustomerTransactionConfigDetailsSuccess should return proper state', () => {
      const action = new actions.UpdateCustomerTransactionConfigDetailsSuccess();

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateCustomerTransactionConfigDetailsFailure should return error', () => {
      const action = new actions.UpdateCustomerTransactionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasUpdated).toEqual(false);
    });
  });
  describe('GetCustomerTransactionConfigDetails TestCases', () => {
    it('GetCustomerTransactionConfigDetails should return proper state', () => {
      const action = new actions.GetCustomerTransactionConfigDetails('abc123');

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });
    it('GetCustomerTransactionConfigDetailsSuccess should return proper state', () => {
      const action = new actions.GetCustomerTransactionConfigDetailsSuccess(
        customerConfigDetails
      );

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.customerTranConfigDetails).toBe(customerConfigDetails);
    });
    it('GetCustomerTransactionConfigDetailsFailure should return error', () => {
      const action = new actions.GetCustomerTransactionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('ResetCustomerConfigs TestCases', () => {
    it('ResetCustomerConfigs should return proper state', () => {
      const action = new actions.ResetCustomerConfigs();

      const result: CustomerTransactionConfigState = CustomerTransactionConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.configId).toBe(null);
      expect(result.hasSaved).toBe(false);
      expect(result.hasUpdated).toBe(false);
      expect(result.error).toBe(null);
      expect(result.hasStatusUpdated).toBe(false);
      expect(result.customerTranConfigDetails).toBe(null);
    });
  });
});
