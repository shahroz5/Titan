import {
  CheckBoxHeader,
  CustomerConfigDetails,
  CustomErrors,
  CustomerTransactionConfig,
  CustomerTransactionConfigListPayload,
  CustomerTransactionConfigListResponse,
  SaveCustomerTranConfigDetails,
  UpdateStatus
} from '@poss-web/shared/models';
import {
  CustomerTransactionConfigActionTypes,
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
  ResetCustomerConfigs,
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
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('CustomerTransactionFacade Testing Suite', () => {
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
  const transactionPayload: CheckBoxHeader[] = [
    {
      title: 'transaction',
      key: 'transaction'
    }
  ];
  const customerPayload: CheckBoxHeader[] = [
    {
      title: 'customer',
      key: 'customer'
    }
  ];

  describe('LoadCustomerTransactionConfigList Action Test Cases', () => {
    it('should check correct type is used for  LoadCFAProducts action ', () => {
      const action = new LoadCustomerTransactionConfigList(listPayload);

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST
      );
      expect(action.payload).toEqual(listPayload);
    });
    it('should check correct type is used for LoadCustomerTransactionConfigListSuccess action ', () => {
      const action = new LoadCustomerTransactionConfigListSuccess(
        configListResponse
      );

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST_SUCCESS
      );
      expect(action.payload).toEqual(configListResponse);
    });
    it('should check correct type is used for  LoadCustomerTransactionConfigListFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCustomerTransactionConfigListFailure(errorPayload);

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('SearchConfigName Action Test Cases', () => {
    it('should check correct type is used for SearchConfigName action ', () => {
      const action = new SearchConfigName('ConfigName');

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.SEARCH_CONFIG_NAME
      );
      expect(action.payload).toEqual('ConfigName');
    });
    it('should check correct type is used for SearchConfigNameSuccess action ', () => {
      const action = new SearchConfigNameSuccess(configListResponse.configList);

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.SEARCH_CONFIG_NAME_SUCCESS
      );
      expect(action.payload).toEqual(configListResponse.configList);
    });
    it('should check correct type is used for SearchConfigNameFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchConfigNameFailure(errorPayload);

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.SEARCH_CONFIG_NAME_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('UpdateConfigStatus Action Test Cases', () => {
    it('should check correct type is used for UpdateConfigStatus action ', () => {
      const action = new UpdateConfigStatus(updateStatusPayload);

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.UPDATE_CONFIG_STATUS
      );
      expect(action.payload).toEqual(updateStatusPayload);
    });
    it('should check correct type is used for UpdateConfigStatusSuccess action ', () => {
      const action = new UpdateConfigStatusSucceess();

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.UPDATE_CONFIG_STATUS_SUCCESS
      );
    });
    it('should check correct type is used for UpdateConfigStatusFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateConfigStatusFailure(errorPayload);

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.UPDATE_CONFIG_STATUS_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('LoadTransactionTypes Action TestCases', () => {
    it('should check correct type is used for LoadTransactionTypes action ', () => {
      const action = new LoadTransactionTypes('TRANSACTION_TYPE');

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.LOAD_TRANSACTIONTYPES
      );
    });
    it('should check correct type is used for LoadTransactionTypesSuccess action ', () => {
      const action = new LoadTransactionTypesSuccess(transactionPayload);

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.LOAD_TRANSACTIONTYPES_SUCCESS
      );
      expect(action.payload).toEqual(transactionPayload);
    });
    it('should check correct type is used for LoadTransactionTypesFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTransactionTypesFailure(errorPayload);

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.LOAD_TRANSACTIONTYPES_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('LoadCustomers Action TestCases', () => {
    it('should check correct type is used for LoadCustomers action ', () => {
      const action = new LoadCustomers();

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.LOAD_CUSTOMERS
      );
    });
    it('should check correct type is used for LoadCustomersSuccess action ', () => {
      const action = new LoadCustomersSuccess(customerPayload);

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.LOAD_CUSTOMERS_SUCCESS
      );
      expect(action.payload).toEqual(customerPayload);
    });
    it('should check correct type is used for LoadCustomersFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCustomersFailure(errorPayload);

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.LOAD_CUSTOMERS_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('SaveCustomerTransactionConfigDetails Action TestCases', () => {
    it('should check correct type is used for SaveCustomerTransactionConfigDetails action ', () => {
      const action = new SaveCustomerTransactionConfigDetails(savePayload);

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS
      );
      expect(action.payload).toEqual(savePayload);
    });
    it('should check correct type is used for SaveCustomerTransactionConfigDetailsSuccess action ', () => {
      const action = new SaveCustomerTransactionConfigDetailsSuccess('abc123');

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for SaveCustomerTransactionConfigDetailsFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCustomerTransactionConfigDetailsFailure(
        errorPayload
      );

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('UpdateCustomerTransactionConfigDetails Action TestCases', () => {
    it('should check correct type is used for UpdateCustomerTransactionConfigDetails action ', () => {
      const action = new UpdateCustomerTransactionConfigDetails(savePayload);

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS
      );
      expect(action.payload).toEqual(savePayload);
    });
    it('should check correct type is used for UpdateCustomerTransactionConfigDetailsSuccess action ', () => {
      const action = new UpdateCustomerTransactionConfigDetailsSuccess();

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_SUCCESS
      );
    });
    it('should check correct type is used for UpdateCustomerTransactionConfigDetailsFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCustomerTransactionConfigDetailsFailure(
        errorPayload
      );

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('GetCustomerTransactionConfigDetails Action TestCases', () => {
    it('should check correct type is used for GetCustomerTransactionConfigDetails action ', () => {
      const action = new GetCustomerTransactionConfigDetails('abc123');

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS
      );
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for GetCustomerTransactionConfigDetailsSuccess action ', () => {
      const action = new GetCustomerTransactionConfigDetailsSuccess(
        customerConfigDetails
      );

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(customerConfigDetails);
    });
    it('should check correct type is used for GetCustomerTransactionConfigDetailsFailure action ', () => {
      const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetCustomerTransactionConfigDetailsFailure(
        errorPayload
      );

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(errorPayload);
    });
  });
  describe('ResetCustomerConfigs Action TestCases', () => {
    it('should check correct type is used for ResetCustomerConfigs action ', () => {
      const action = new ResetCustomerConfigs();

      expect(action.type).toEqual(
        CustomerTransactionConfigActionTypes.RESET_CUSTOMER_CONFIGS
      );
    });
  });
});
