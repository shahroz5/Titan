import {
  CheckBoxHeader,
  CustomerConfigDetails,
  CustomErrors,
  CustomerTransactionConfig,
  CustomerTransactionConfigListPayload,
  SaveCustomerTranConfigDetails
} from '@poss-web/shared/models';
import { initialState } from './customer-transaction-config.reducer';
import { CustomerTransactionConfigSelectors } from './customer-transaction-config.selector';
import { CustomerTransactionConfigState } from './customer-transaction-config.state';

describe('CustomerTransacation Selector Testing Suite', () => {
  const listPayload: CustomerTransactionConfigListPayload = {
    pageIndex: 0,
    pageSize: 100,
    length: 0
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
  it('Should return the error ', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: CustomerTransactionConfigState = {
      ...initialState,
      error: error
    };
    expect(
      CustomerTransactionConfigSelectors.selectError.projector(state)
    ).toEqual(error);
  });
  it('Should return the config-list ', () => {
    const listResponse: CustomerTransactionConfig[] = [
      {
        configId: 'abc123',
        description: 'Configuration',
        isActive: true
      }
    ];
    const state: CustomerTransactionConfigState = {
      ...initialState,
      configList: listResponse
    };
    expect(
      CustomerTransactionConfigSelectors.selectCustomerTransactionConfigList.projector(
        state
      )
    ).toEqual(listResponse);
  });
  it('Should return the totalelements', () => {
    const state: CustomerTransactionConfigState = {
      ...initialState,
      totalElements: 1
    };
    expect(
      CustomerTransactionConfigSelectors.selectTotalElements.projector(state)
    ).toEqual(1);
  });
  it('Should return the isloading', () => {
    const state: CustomerTransactionConfigState = {
      ...initialState,
      isLoading: true
    };
    expect(
      CustomerTransactionConfigSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });
  it('Should return the hassearched', () => {
    const state: CustomerTransactionConfigState = {
      ...initialState,
      hasSearched: true
    };
    expect(
      CustomerTransactionConfigSelectors.selectHasSearched.projector(state)
    ).toEqual(true);
  });
  it('Should return the hasstatusupdated', () => {
    const state: CustomerTransactionConfigState = {
      ...initialState,
      hasStatusUpdated: true
    };
    expect(
      CustomerTransactionConfigSelectors.selectHasStatusUpdated.projector(state)
    ).toEqual(true);
  });
  it('Should return the transaction types', () => {
    const payload: CheckBoxHeader[] = [
      {
        title: 'transaction',
        key: 'transaction'
      }
    ];
    const state: CustomerTransactionConfigState = {
      ...initialState,
      transactionTypes: payload
    };
    expect(
      CustomerTransactionConfigSelectors.selectTransactionTypes.projector(state)
    ).toEqual(payload);
  });
  it('Should return the customer types', () => {
    const payload: CheckBoxHeader[] = [
      {
        title: 'customer',
        key: 'customer'
      }
    ];
    const state: CustomerTransactionConfigState = {
      ...initialState,
      customers: payload
    };
    expect(
      CustomerTransactionConfigSelectors.selectCustomers.projector(state)
    ).toEqual(payload);
  });
  it('Should return the hasaved', () => {
    const state: CustomerTransactionConfigState = {
      ...initialState,
      hasSaved: true
    };
    expect(
      CustomerTransactionConfigSelectors.selectHasSaved.projector(state)
    ).toEqual(true);
  });
  it('Should return the hasupdated', () => {
    const state: CustomerTransactionConfigState = {
      ...initialState,
      hasUpdated: true
    };
    expect(
      CustomerTransactionConfigSelectors.selectHasUpdated.projector(state)
    ).toEqual(true);
  });
  it('Should return the configid', () => {
    const state: CustomerTransactionConfigState = {
      ...initialState,
      configId: 'abc123'
    };
    expect(
      CustomerTransactionConfigSelectors.selectConfigId.projector(state)
    ).toEqual('abc123');
  });
  it('Should return the customerTranConfigDetails', () => {
    const payload: CustomerConfigDetails = {
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
    const state: CustomerTransactionConfigState = {
      ...initialState,
      customerTranConfigDetails: payload
    };
    expect(
      CustomerTransactionConfigSelectors.selectConfigDetailsById.projector(
        state
      )
    ).toEqual(payload);
  });
});
