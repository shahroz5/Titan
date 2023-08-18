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
import {
  LoadAllConfigRules,
  LoadAllConfigRulesFailure,
  LoadAllConfigRulesSuccess,
  LoadOrderConfigByConfigId,
  LoadOrderConfigByConfigIdFailure,
  LoadOrderConfigByConfigIdSuccess,
  LoadOrderPaymentsConfigList,
  LoadOrderPaymentsConfigListFailure,
  LoadOrderPaymentsConfigListSuccess,
  LoadProductGroupMapping,
  LoadProductGroupMappingFailure,
  LoadProductGroupMappingSuccess,
  LoadReset,
  LoadSelectedConfigDetails,
  LoadSelectedConfigDetailsFailure,
  LoadSelectedConfigDetailsSuccess,
  OrderPaymentConfigActionTypes,
  RemoveOrderPaymentConfig,
  RemoveOrderPaymentConfigFailure,
  RemoveOrderPaymentConfigSuccess,
  SaveOderPaymentConfig,
  SaveOderPaymentConfigFailure,
  SaveOderPaymentConfigSuccess,
  SearchConfigDetailsByConfigName,
  SearchConfigDetailsByConfigNameFailure,
  SearchConfigDetailsByConfigNameSuccess,
  UpdateConfigIsActive,
  UpdateConfigIsActiveFailure,
  UpdateConfigIsActiveSuccess,
  UpdateOrderPaymentConfig,
  UpdateOrderPaymentConfigFailure,
  UpdateOrderPaymentConfigSuccess
} from './order-config.actions';
describe('WeightTolerance  Action Testing Suite', () => {
  describe('LoadConfigList Action Test Cases', () => {
    it('should check correct type is used for  LoadConfigList action ', () => {
      const payload: OrderPaymentConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        length: 10
      };

      const action = new LoadOrderPaymentsConfigList(payload);
      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadOrderPaymentsConfigListSuccess action ', () => {
      const payload: OrderPaymentConfigList = {
        configList: [
          {
            ruleId: 1,
            description: 'test config'
          }
        ],
        totalElements: 10
      };

      const action = new LoadOrderPaymentsConfigListSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadOrderPaymentsConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOrderPaymentsConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedConfigDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedConfigDetails action ', () => {
      const payload = '111111';

      const action = new LoadSelectedConfigDetails(payload);
      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.LOAD_SELECTED_ORDER_PAYMENT_CONFIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadOrderPaymentsConfigListSuccess action ', () => {
      const payload: OrderPaymentConfigPayload = {
        description: 'test config',
        isActive: true,
        ruleDetails: null,
        ruleId: 1222,
        ruleType: 'AB-_ORDER_PAYMENT_CONFIG'
      };

      const action = new LoadSelectedConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.LOAD_SELECTED_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESSS,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.LOAD_SELECTED_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SearchConfigDetailsByConfigName Action Test Cases', () => {
    it('should check correct type is used for  SearchConfigDetailsByConfigName action ', () => {
      const payload = 'config tests';

      const action = new SearchConfigDetailsByConfigName(payload);
      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.SEARCH_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME,
        payload
      });
    });
    it('should check correct type is used for  SearchConfigDetailsByConfigNameSuccess action ', () => {
      const payload: OrderPaymentConfigList = {
        configList: [
          {
            ruleId: 1,
            description: 'test config'
          }
        ],
        totalElements: 10
      };

      const action = new SearchConfigDetailsByConfigNameSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.SEARCH_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchConfigDetailsByConfigNameFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchConfigDetailsByConfigNameFailure(payload);

      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.SEARCH_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_FAILURE,
        payload
      });
    });
  });
  describe('UpdateConfigIsActive Action Test Cases', () => {
    it('should check correct type is used for  UpdateConfigIsActive action ', () => {
      const payload: UpdateOrderPaymentConfigPayload = {
        data: null,
        id: '111111'
      };
      const action = new UpdateConfigIsActive(payload);
      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.UPDATE_ORDER_PAYMENT_CONFIG_IS_ACTIVE,
        payload
      });
    });
    it('should check correct type is used for  UpdateConfigIsActiveSuccess action ', () => {
      const payload = {
        description: 'test config',
        isActive: true,
        ruleDetails: null,
        ruleId: 1222,
        ruleType: 'AB-_ORDER_PAYMENT_CONFIG'
      };

      const action = new UpdateConfigIsActiveSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.UPDATE_ORDER_PAYMENT_CONFIG_IS_ACTIVE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateConfigIsActiveFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateConfigIsActiveFailure(payload);

      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.UPDATE_ORDER_PAYMENT_CONFIG_IS_ACTIVE_FAILURE,
        payload
      });
    });
  });
  describe('LoadProductGroupMapping Action Test Cases', () => {
    it('should check correct type is used for  LoadProductGroupMapping action ', () => {
      const action = new LoadProductGroupMapping();
      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS
      });
    });
    it('should check correct type is used for  LoadProductGroupMappingSuccess action ', () => {
      const payload: ProductGroup[] = [
        {
          description: 'PLAIN GOLD',
          productGroupCode: '71'
        }
      ];

      const action = new LoadProductGroupMappingSuccess(payload);
      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadProductGroupMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupMappingFailure(payload);
      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS_FAILURE,
        payload
      });
    });
  });
  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.LOAD_RESET
      });
    });
  });
  describe('SaveOderPaymentConfig Action Test Cases', () => {
    it('should check correct type is used for  SaveOderPaymentConfig action ', () => {
      const payload: SaveOrderPaymentsPayload = {
        configDetail: {
          description: 'config test',
          isActive: true,
          ruleDetails: null
        },
        orderPaymentConfigRequest: null
      };
      const action = new SaveOderPaymentConfig(payload);
      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.SAVE_ORDER_PAYMENT_CONFIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveOderPaymentConfigSuccess action ', () => {
      const payload = '1111';

      const action = new SaveOderPaymentConfigSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.SAVE_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateConfigIsActiveFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveOderPaymentConfigFailure(payload);

      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.SAVE_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('UpdateOrderPaymentConfig Action Test Cases', () => {
    it('should check correct type is used for  UpdateOrderPaymentConfig action ', () => {
      const payload: UpdateOrderPaymentConfigPayload = {
        id: '1111111',
        data: null
      };
      const action = new UpdateOrderPaymentConfig(payload);
      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.UPADTE_ORDER_PAYMENT_CONFIG,
        payload
      });
    });
    it('should check correct type is used for UpdateOrderPaymentConfigSuccess action ', () => {
      const payload = {
        description: 'test config',
        isActive: true,
        ruleDetails: null,
        ruleId: 1222,
        ruleType: 'AB-_ORDER_PAYMENT_CONFIG'
      };

      const action = new UpdateOrderPaymentConfigSuccess(payload);
      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.UPADTE_ORDER_PAYMENT_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateOrderPaymentConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateOrderPaymentConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.UPADTE_ORDER_PAYMENT_CONFIG_FAILURE,
        payload
      });
    });
  });
  describe('RemoveOrderPaymentConfig Action Test Cases', () => {
    it('should check correct type is used for  RemoveOrderPaymentConfig action ', () => {
      const payload: UpdateOrderPaymentConfigPayload = {
        id: '1111111',
        data: null
      };
      const action = new RemoveOrderPaymentConfig(payload);
      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.REMOVE_ORDER_PAYMENT_CONFIG,
        payload
      });
    });
    it('should check correct type is used for RemoveOrderPaymentConfigSuccess action ', () => {
      const payload = {
        description: 'test config',
        isActive: true,
        ruleDetails: null,
        ruleId: 1222,
        ruleType: 'AB-_ORDER_PAYMENT_CONFIG'
      };

      const action = new RemoveOrderPaymentConfigSuccess(payload);
      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.REMOVE_ORDER_PAYMENT_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  RemoveOrderPaymentConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RemoveOrderPaymentConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.REMOVE_ORDER_PAYMENT_CONFIG_FAILURE,
        payload
      });
    });
  });
  describe('LoadOrderConfigByConfigId Action Test Cases', () => {
    it('should check correct type is used for  LoadOrderConfigByConfigId action ', () => {
      const payload: OrderPayementRulesRequest = {
        configId: '1111',
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadOrderConfigByConfigId(payload);
      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for LoadOrderConfigByConfigIdSuccess action ', () => {
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

      const action = new LoadOrderConfigByConfigIdSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_BY_CONFIG_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadOrderConfigByConfigIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOrderConfigByConfigIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          OrderPaymentConfigActionTypes.LOAD_ORDER_PAYMENT_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });
  describe('LoadAllConfigRules Action Test Cases', () => {
    it('should check correct type is used for  LoadAllConfigRules action ', () => {
      const payload: OrderPayementRulesRequest = {
        configId: '1111',
        isPageable: false
      };
      const action = new LoadAllConfigRules(payload);
      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES,
        payload
      });
    });
    it('should check correct type is used for LoadAllConfigRulesSuccess action ', () => {
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

      const action = new LoadAllConfigRulesSuccess(payload);
      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadAllConfigRulesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllConfigRulesFailure(payload);

      expect({ ...action }).toEqual({
        type: OrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES_FAILURE,
        payload
      });
    });
  });
});
