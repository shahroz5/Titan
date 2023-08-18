import { initialState, OrderPaymentReducer } from './order-config.reducer';
import { OrderPaymentConfigState } from './order-config.state';
import * as actions from './order-config.actions';
import {
  CustomErrors,
  OrderPayementRulesRequest,
  OrderPaymentConfigList,
  OrderPaymentConfigPayload,
  OrderPaymentConfigReqPayload,
  OrderpyamentRulesResponse,
  ProductGroup,
  SaveOrderPaymentsPayload,
  UpdateOrderPaymentConfigPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('weightToleranceReducer reducer Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadConfigList ', () => {
    beforeEach(() => {});
    it('Load LoadConfigList should set proper values in state', () => {
      const payload: OrderPaymentConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        length: 10
      };

      const action = new actions.LoadOrderPaymentsConfigList(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('Load LoadOrderPaymentsConfigListSuccess should set proper values in state', () => {
      const payload: OrderPaymentConfigList = {
        configList: [
          {
            ruleId: 1,
            description: 'test config'
          }
        ],
        totalElements: 10
      };

      const action = new actions.LoadOrderPaymentsConfigListSuccess(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.totalElements).toBe(10);
      expect(result.orderConfigList).toBeTruthy();
    });
    it('Load LoadOrderPaymentsConfigListFailure should set proper values in state', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadOrderPaymentsConfigListFailure(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('Testing LoadSelectedConfigDetails ', () => {
    beforeEach(() => {});
    it('Load LoadSelectedConfigDetails should proper values in state', () => {
      const payload = '111111';

      const action = new actions.LoadSelectedConfigDetails(payload);
      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('Load LoadSelectedConfigDetailsSuccess should set proper values in state', () => {
      const payload: OrderPaymentConfigPayload = {
        description: 'test config',
        isActive: true,
        ruleDetails: null,
        ruleId: 1222,
        ruleType: 'AB-_ORDER_PAYMENT_CONFIG'
      };

      const action = new actions.LoadSelectedConfigDetailsSuccess(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.orderConfig).toBeTruthy();
    });
    it('Load LoadSelectedConfigDetailsFailure should set proper values in state', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadSelectedConfigDetailsFailure(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('Testing SearchConfigDetailsByConfigName ', () => {
    beforeEach(() => {});
    it('Load SearchConfigDetailsByConfigName should proper values in state', () => {
      const payload = 'config tests';

      const action = new actions.SearchConfigDetailsByConfigName(payload);
      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('Load SearchConfigDetailsByConfigNameSuccess should set proper values in state', () => {
      const payload: OrderPaymentConfigList = {
        configList: [
          {
            ruleId: 1,
            description: 'test config'
          }
        ],
        totalElements: 10
      };

      const action = new actions.SearchConfigDetailsByConfigNameSuccess(
        payload
      );

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.orderConfigList).toBeTruthy();
      expect(result.totalElements).toBe(10);
    });
    it('Load SearchConfigDetailsByConfigNameFailure should set proper values in state', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.SearchConfigDetailsByConfigNameFailure(
        payload
      );

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toBe('Some Error');
    });
  });

  describe('Testing UpdateConfigIsActive ', () => {
    beforeEach(() => {});
    it('Load UpdateConfigIsActive should proper values in state', () => {
      const payload: UpdateOrderPaymentConfigPayload = {
        data: null,
        id: '111111'
      };

      const action = new actions.UpdateConfigIsActive(payload);
      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.IsUpdated).toBe(false);
    });
    it('Load UpdateConfigIsActiveSuccess should set proper values in state', () => {
      const payload = {
        description: 'test config',
        isActive: true,
        ruleDetails: null,
        ruleId: 1222,
        ruleType: 'AB-_ORDER_PAYMENT_CONFIG'
      };

      const action = new actions.UpdateConfigIsActiveSuccess(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.IsUpdated).toBe(true);
    });
    it('Load UpdateConfigIsActiveFailure should set proper values in state', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdateConfigIsActiveFailure(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(null);
      expect(result.IsUpdated).toBe(null);
      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('Testing LoadProductGroupMapping ', () => {
    beforeEach(() => {});
    it('Load LoadProductGroupMapping should proper values in state', () => {
      const action = new actions.LoadProductGroupMapping();
      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('Load LoadProductGroupMappingSuccess should set proper values in state', () => {
      const payload: ProductGroup[] = [
        {
          description: 'PLAIN GOLD',
          productGroupCode: '71'
        }
      ];

      const action = new actions.LoadProductGroupMappingSuccess(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.productGroups).toBeTruthy();
    });
    it('Load LoadProductGroupMappingFailure should set proper values in state', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadProductGroupMappingFailure(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('Load LoadReset should proper values in state', () => {
      const action = new actions.LoadReset();
      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );

      expect(result.IsUpdated).toBe(null);
      expect(result.hasSaved).toBe(null);
      expect(result.orderConfigList.length).toBe(0);
      expect(result.orderConfig).toBe(null);
      expect(result.error).toBe(null);
      expect(result.configId).toBe(null);
      expect(result.productGroups.length).toBe(0);
      expect(result.orderPaymentConfigDetails.length).toBe(0);
      expect(result.allOrderPaymentConfigDetails.length).toBe(0);
      expect(result.ruleDetailsCount).toBe(0);
    });
  });
  describe('Testing SaveOderPaymentConfig ', () => {
    beforeEach(() => {});
    it('Load SaveOderPaymentConfig should proper values in state', () => {
      const payload: SaveOrderPaymentsPayload = {
        configDetail: {
          description: 'config test',
          isActive: true,
          ruleDetails: null
        },
        orderPaymentConfigRequest: null
      };

      const action = new actions.SaveOderPaymentConfig(payload);
      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('Load SaveOderPaymentConfigSuccess should set proper values in state', () => {
      const payload = '1111';
      const action = new actions.SaveOderPaymentConfigSuccess(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.configId).toBe(payload);
    });
    it('Load SaveOderPaymentConfigFailure should set proper values in state', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.SaveOderPaymentConfigFailure(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('Testing UpdateOrderPaymentConfig ', () => {
    beforeEach(() => {});
    it('Load UpdateOrderPaymentConfig should proper values in state', () => {
      const payload: UpdateOrderPaymentConfigPayload = {
        id: '1111111',
        data: null
      };

      const action = new actions.UpdateOrderPaymentConfig(payload);
      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.IsUpdated).toBe(false);
    });
    it('Load UpdateOrderPaymentConfigSuccess should set proper values in state', () => {
      const payload = {
        description: 'test config',
        isActive: true,
        ruleDetails: null,
        ruleId: 1222,
        ruleType: 'AB-_ORDER_PAYMENT_CONFIG'
      };
      const action = new actions.UpdateOrderPaymentConfigSuccess(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.IsUpdated).toBe(true);
    });
    it('Load UpdateOrderPaymentConfigFailure should set proper values in state', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdateOrderPaymentConfigFailure(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.IsUpdated).toBe(null);
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('Testing RemoveOrderPaymentConfig ', () => {
    beforeEach(() => {});
    it('Load RemoveOrderPaymentConfig should proper values in state', () => {
      const payload: UpdateOrderPaymentConfigPayload = {
        id: '1111111',
        data: null
      };

      const action = new actions.RemoveOrderPaymentConfig(payload);
      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.isCleared).toBe(false);
    });
    it('Load RemoveOrderPaymentConfigSuccess should set proper values in state', () => {
      const payload = {
        description: 'test config',
        isActive: true,
        ruleDetails: null,
        ruleId: 1222,
        ruleType: 'AB-_ORDER_PAYMENT_CONFIG'
      };
      const action = new actions.RemoveOrderPaymentConfigSuccess(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.isCleared).toBe(true);
    });
    it('Load RemoveOrderPaymentConfigFailure should set proper values in state', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.RemoveOrderPaymentConfigFailure(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isCleared).toBe(null);
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('Testing LoadOrderConfigByConfigId ', () => {
    beforeEach(() => {});
    it('Load LoadOrderConfigByConfigId should proper values in state', () => {
      const payload: OrderPayementRulesRequest = {
        configId: '1111',
        pageIndex: 0,
        pageSize: 10
      };

      const action = new actions.LoadOrderConfigByConfigId(payload);
      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('Load LoadOrderConfigByConfigIdSuccess should set proper values in state', () => {
      const payload: OrderpyamentRulesResponse = {
        totalElements: 10,
        response: [
          {
            id: '1111',
            productGroupCode: '51',
            ruleDetails: null,
            description: 'description',
            bestRatePercent: '10',
            metalRateFrozenPercent: '10',
            metalRateNonFrozenPercent: '22',
            productCategoryCode: null,
            rangeId: '11111111'
          }
        ]
      };
      const action = new actions.LoadOrderConfigByConfigIdSuccess(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.ruleDetailsCount).toBe(10);
      expect(result.orderPaymentConfigDetails).toBeTruthy();
    });
    it('Load LoadOrderConfigByConfigIdFailure should set proper values in state', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadOrderConfigByConfigIdFailure(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.orderPaymentConfigDetails.length).toBe(0);
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('Testing LoadAllConfigRules ', () => {
    beforeEach(() => {});
    it('Load LoadAllConfigRules should proper values in state', () => {
      const payload: OrderPayementRulesRequest = {
        configId: '1111',
        isPageable: false
      };
      const action = new actions.LoadAllConfigRules(payload);
      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('Load LoadAllConfigRulesSuccess should set proper values in state', () => {
      const payload: OrderpyamentRulesResponse = {
        totalElements: 10,
        response: [
          {
            id: '1111',
            productGroupCode: '51',
            ruleDetails: null,
            description: 'description',
            bestRatePercent: '10',
            metalRateFrozenPercent: '10',
            metalRateNonFrozenPercent: '22',
            productCategoryCode: null,
            rangeId: '11111111'
          }
        ]
      };
      const action = new actions.LoadAllConfigRulesSuccess(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.allOrderPaymentConfigDetails).toBeTruthy();
    });
    it('Load LoadAllConfigRulesFailure should set proper values in state', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadAllConfigRulesFailure(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.allOrderPaymentConfigDetails.length).toBe(0);
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toBe('Some Error');
    });
  });
  describe('Testing UpdateOrderPaymentConfig ', () => {
    beforeEach(() => {});
    it('Load UpdateOrderPaymentConfig should proper values in state', () => {
      const payload: UpdateOrderPaymentConfigPayload = {
        id: '1111111',
        data: null
      };
      const action = new actions.UpdateOrderPaymentConfig(payload);
      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('Load UpdateOrderPaymentConfigSuccess should set proper values in state', () => {
      const payload: OrderpyamentRulesResponse = {
        totalElements: 10,
        response: [
          {
            id: '1111',
            productGroupCode: '51',
            ruleDetails: null,
            description: 'description',
            bestRatePercent: '10',
            metalRateFrozenPercent: '10',
            metalRateNonFrozenPercent: '22',
            productCategoryCode: null,
            rangeId: '11111111'
          }
        ]
      };
      const action = new actions.UpdateOrderPaymentConfigSuccess(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.allOrderPaymentConfigDetails).toBeTruthy();
    });
    it('Load UpdateOrderPaymentConfigFailure should set proper values in state', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdateOrderPaymentConfigFailure(payload);

      const result: OrderPaymentConfigState = OrderPaymentReducer(
        testState,
        action
      );
      expect(result.allOrderPaymentConfigDetails.length).toBe(0);
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toBe('Some Error');
    });
  });
});
