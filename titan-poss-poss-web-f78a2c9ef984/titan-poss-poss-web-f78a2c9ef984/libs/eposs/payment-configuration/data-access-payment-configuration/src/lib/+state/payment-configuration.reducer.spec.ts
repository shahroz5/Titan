//you should simply assert that you get the right state given the provided inputs.

import * as actions from './payment-configuration.actions';

import {
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
import {
  paymentConfigurationReducer,
  initialState
} from './payment-configuration.reducer';
import { PaymentConfigurationState } from './payment-configuration.state';
import { paymentModeAdaptor } from './payment-configuration.entity';

describe('paymentConfigurationReducer reducer Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadPaymentConfigurationList ', () => {
    beforeEach(() => {});
    it('Load LoadPaymentConfigurationList should set the isLoading to true', () => {
      const payload: PaymentConfigurationListPayLoad = {
        pageSize: 10,
        pageIndex: 1
      };

      const action = new actions.LoadPaymentConfigurationList(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadPaymentConfigurationListSuccess should return list of payment config list', () => {
      const payload: PaymentConfigurationList = {
        paymentConfigurationList: [
          {
            paymentName: 'cash',
            configId: '1',
            isActive: true
          }
        ],
        totalElements: 10
      };

      const action = new actions.LoadPaymentConfigurationListSuccess(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.paymentConfigurationlist.length).toBe(1);
    });
    it('LoadPaymentConfigurationListFailure should return error', () => {
      const action = new actions.LoadPaymentConfigurationListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchPaymentConfigurationList ', () => {
    beforeEach(() => {});
    it('Load SearchPaymentConfigurationList should set the isLoading to true', () => {
      const payload = 'cash';

      const action = new actions.SearchPaymentConfigurationList(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SearchPaymentConfigurationListSuccess should return list of payment config ', () => {
      const payload: PaymentConfigurationList = {
        paymentConfigurationList: [
          {
            paymentName: 'cash',
            configId: '1',
            isActive: true
          }
        ],
        totalElements: 10
      };

      const action = new actions.SearchPaymentConfigurationListSuccess(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.paymentConfigurationlist.length).toBe(1);
    });
    it('SearchPaymentConfigurationListFailure should return error', () => {
      const action = new actions.SearchPaymentConfigurationListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing CheckUniquePaymentName ', () => {
    beforeEach(() => {});
    it('Load CheckUniquePaymentName should set the isLoading to true', () => {
      const payload = 'cash';

      const action = new actions.CheckUniquePaymentName(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(null);
    });
    it('CheckUniquePaymentNameSuccess should return list of payment config ', () => {
      const payload: PaymentConfigurationList = {
        paymentConfigurationList: [
          {
            paymentName: 'cash',
            configId: '1',
            isActive: true
          }
        ],
        totalElements: 10
      };

      const action = new actions.CheckUniquePaymentNameSuccess(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.paymentConfigurationlist.length).toBe(1);
    });
    it('CheckUniquePaymentNameFailure should return error', () => {
      const action = new actions.CheckUniquePaymentNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadPaymentModesandTransactionTypes ', () => {
    beforeEach(() => {});
    it('Load LoadPaymentModesandTransactionTypes should set the isLoading to true', () => {
      const payload = '1';

      const action = new actions.LoadPaymentModesandTransactionTypes(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadPaymentModesandTransactionTypesSuccess should return list of payment modes and transaction types ', () => {
      const payload = {
        transactioncode: ['CM'],
        paymentMode: ['CASH']
      };

      const action = new actions.LoadPaymentModesandTransactionTypesSuccess(
        payload
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.paymentModes.ids.length).toBe(1);
      expect(result.transctionTypes.length).toBe(1);
    });
    it('LoadPaymentModesandTransactionTypesFailure should return error', () => {
      const action = new actions.LoadPaymentModesandTransactionTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SavePaymentConfiguration ', () => {
    beforeEach(() => {});
    it('Load SavePaymentConfiguration should set the isLoading to true', () => {
      const payload: SavePaymentConfigurationPayload = {
        paymentConfiguration: {
          description: 'cash'
        },
        saveData: ''
      };
      const action = new actions.SavePaymentConfiguration(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
    });
    it('SavePaymentConfigurationSuccess should return config id ', () => {
      const payload = '1';

      const action = new actions.SavePaymentConfigurationSuccess(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
      expect(result.configId).toEqual('1');
    });
    it('SavePaymentConfigurationSuccessFailure should return error', () => {
      const action = new actions.SavePaymentConfigurationSuccessFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdatePaymentConfiguration ', () => {
    beforeEach(() => {});
    it('Load UpdatePaymentConfiguration should set the hasUpdated to false', () => {
      const payload: UpdatePaymentConfigurationPayload = {
        configId: '1',
        data: {
          isActive: false
        }
      };
      const action = new actions.UpdatePaymentConfiguration(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });
    it('UpdatePaymentConfigurationSuccess should set hasUpdated to true ', () => {
      const action = new actions.UpdatePaymentConfigurationSuccess();

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
    });
    it('UpdatePaymentConfigurationFailure should return error', () => {
      const action = new actions.UpdatePaymentConfigurationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadPaymentConfigurationByConfigId ', () => {
    beforeEach(() => {});
    it('Load LoadPaymentConfigurationByConfigId should set the isloading  to true', () => {
      const payload = '1';
      const action = new actions.LoadPaymentConfigurationByConfigId(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadPaymentConfigurationByConfigIdSuccess should return payment configuration ', () => {
      const payload: PaymentConfiguration = {
        paymentName: 'cash',
        isActive: true,
        configId: '1'
      };
      const action = new actions.LoadPaymentConfigurationByConfigIdSuccess(
        payload
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.paymentConfiguration).toEqual(payload);
    });
    it('LoadPaymentConfigurationByConfigIdFailure should return error', () => {
      const action = new actions.LoadPaymentConfigurationByConfigIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadMappedCount ', () => {
    beforeEach(() => {});
    it('Load LoadMappedCount should set the isLoading  to true', () => {
      const payload = '1';
      const action = new actions.LoadMappedCount(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadMappedCountSuccess should return count ', () => {
      const payload: MappedCount[] = [
        {
          paymentName: 'cash',
          count: 10
        }
      ];
      const action = new actions.LoadMappedCountSuccess(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
    });
    it('LoadMappedCountFailure should return error', () => {
      const action = new actions.LoadMappedCountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateCount ', () => {
    beforeEach(() => {});
    it('Load UpdateCount should set the isLoading  to true', () => {
      const payload: { count: number; id: string } = {
        count: 10,
        id: '1'
      };

      const action = new actions.UpdateCount(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(null);
    });
  });

  describe('Testing LoadSelectedPaymentConfigurationDetailsByConfigId ', () => {
    beforeEach(() => {});
    it('Load LoadSelectedPaymentConfigurationDetailsByConfigId should set the isloading  to true', () => {
      const payload: LoadSelectedConfigById = {
        configId: '1',
        paymentName: 'cash'
      };
      const action = new actions.LoadSelectedPaymentConfigurationDetailsByConfigId(
        payload
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadSelectedPaymentConfigurationDetailsByConfigIdSuccess should return selected options ', () => {
      const payload: SelectedOptionsData = {
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
      const action = new actions.LoadSelectedPaymentConfigurationDetailsByConfigIdSuccess(
        payload
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.selectedOptions).toEqual(payload);
    });
    it('LoadSelectedPaymentConfigurationDetailsByConfigIdFailure should return error', () => {
      const action = new actions.LoadSelectedPaymentConfigurationDetailsByConfigIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateSelectedPaymentConfigurationDetailsByConfigId ', () => {
    beforeEach(() => {});
    it('Load UpdateSelectedPaymentConfigurationDetailsByConfigId should set the isloading  to true', () => {
      const payload: UpdatePaymentConfigurationDetailsPayload = {
        configId: '1',
        data: {
          isActive: true
        }
      };

      const action = new actions.UpdateSelectedPaymentConfigurationDetailsByConfigId(
        payload
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateSelectedPaymentConfigurationDetailsByConfigIdSuccess should return selected options ', () => {
      const action = new actions.UpdateSelectedPaymentConfigurationDetailsByConfigIdSuccess();

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateSelectedPaymentConfigurationDetailsByConfigIdFailure should return error', () => {
      const action = new actions.UpdateSelectedPaymentConfigurationDetailsByConfigIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadPaymentModeCount ', () => {
    beforeEach(() => {});
    it('Load LoadPaymentModeCount should set the isloading  to true', () => {
      const action = new actions.LoadPaymentModeCount();

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadPaymentModeCountSuccess should return payment mode count ', () => {
      const payload = 10;
      const action = new actions.LoadPaymentModeCountSuccess(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.paymentModeCount).toBe(payload);
    });
    it('LoadPaymentModeCountFailure should return error', () => {
      const action = new actions.LoadPaymentModeCountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadTCSPaymentMode ', () => {
    beforeEach(() => {});
    it('Load LoadTCSPaymentMode should set the isloading  to true', () => {
      const action = new actions.LoadTCSPaymentMode('AIRPAY');

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadTCSPaymentModeSuccess should return  Tcs payment modes ', () => {
      const payload = [
        {
          code: 'AIRPAY',
          id: '1',
          checked: true
        }
      ];
      const action = new actions.LoadTCSPaymentModeSuccess(payload);

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.tcsPaymentModes).toBe(payload);
    });
    it('LoadTCSPaymentModeFailure should return error', () => {
      const action = new actions.LoadTCSPaymentModeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('Load LoadReset should reset the state', () => {
      const action = new actions.LoadReset();

      const result: PaymentConfigurationState = paymentConfigurationReducer(
        testState,
        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
