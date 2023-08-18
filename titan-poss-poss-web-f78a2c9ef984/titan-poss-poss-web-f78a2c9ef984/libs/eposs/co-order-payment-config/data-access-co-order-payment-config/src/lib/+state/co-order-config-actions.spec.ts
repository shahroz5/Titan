import {
  CustomErrors,
  CoOrderPayementRulesRequest,
  CoOrderPaymentConfigList,
  CoOrderPaymentConfigPayload,
  CoOrderPaymentConfigReqPayload,
  CoOrderpyamentRulesResponse,
  ProductGroup,
  SaveCoOrderPaymentsPayload,
  UpdateCoOrderPaymentConfigPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadAllConfigRules,
  LoadAllConfigRulesFailure,
  LoadAllConfigRulesSuccess,
  LoadCoOrderConfigByConfigId,
  LoadCoOrderConfigByConfigIdFailure,
  LoadCoOrderConfigByConfigIdSuccess,
  LoadCoOrderPaymentsConfigList,
  LoadCoOrderPaymentsConfigListFailure,
  LoadCoOrderPaymentsConfigListSuccess,
  LoadProductGroupMapping,
  LoadProductGroupMappingFailure,
  LoadProductGroupMappingSuccess,
  LoadReset,
  LoadSelectedConfigDetails,
  LoadSelectedConfigDetailsFailure,
  LoadSelectedConfigDetailsSuccess,
  CoOrderPaymentConfigActionTypes,
  RemoveCoOrderPaymentConfig,
  RemoveCoOrderPaymentConfigFailure,
  RemoveCoOrderPaymentConfigSuccess,
  SaveOderPaymentConfig,
  SaveOderPaymentConfigFailure,
  SaveOderPaymentConfigSuccess,
  SearchConfigDetailsByConfigName,
  SearchConfigDetailsByConfigNameFailure,
  SearchConfigDetailsByConfigNameSuccess,
  UpdateConfigIsActive,
  UpdateConfigIsActiveFailure,
  UpdateConfigIsActiveSuccess,
  UpdateCoOrderPaymentConfig,
  UpdateCoOrderPaymentConfigFailure,
  UpdateCoOrderPaymentConfigSuccess
} from './co-order-config.actions';
describe('WeightTolerance  Action Testing Suite', () => {
  describe('LoadConfigList Action Test Cases', () => {
    it('should check correct type is used for  LoadConfigList action ', () => {
      const payload: CoOrderPaymentConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        length: 10
      };

      const action = new LoadCoOrderPaymentsConfigList(payload);
      expect({ ...action }).toEqual({
        type: CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadCoOrderPaymentsConfigListSuccess action ', () => {
      const payload: CoOrderPaymentConfigList = {
        configList: [
          {
            ruleId: 1,
            description: 'test config'
          }
        ],
        totalElements: 10
      };

      const action = new LoadCoOrderPaymentsConfigListSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCoOrderPaymentsConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCoOrderPaymentsConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_CONFIG_LIST_FAILURE,
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
          CoOrderPaymentConfigActionTypes.LOAD_SELECTED_CO_ORDER_PAYMENT_CONFIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadCoOrderPaymentsConfigListSuccess action ', () => {
      const payload: CoOrderPaymentConfigPayload = {
        description: 'test config',
        isActive: true,
        ruleDetails: null,
        ruleId: 1222,
        ruleType: 'AB-_CO_ORDER_PAYMENT_CONFIG'
      };

      const action = new LoadSelectedConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.LOAD_SELECTED_CO_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESSS,
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
          CoOrderPaymentConfigActionTypes.LOAD_SELECTED_CO_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE,
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
          CoOrderPaymentConfigActionTypes.SEARCH_CO_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME,
        payload
      });
    });
    it('should check correct type is used for  SearchConfigDetailsByConfigNameSuccess action ', () => {
      const payload: CoOrderPaymentConfigList = {
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
          CoOrderPaymentConfigActionTypes.SEARCH_CO_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_SUCCESS,
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
          CoOrderPaymentConfigActionTypes.SEARCH_CO_ORDER_PAYMENT_CONFIG_DETAILS_BY_CONFIG_NAME_FAILURE,
        payload
      });
    });
  });
  describe('UpdateConfigIsActive Action Test Cases', () => {
    it('should check correct type is used for  UpdateConfigIsActive action ', () => {
      const payload: UpdateCoOrderPaymentConfigPayload = {
        data: null,
        id: '111111'
      };
      const action = new UpdateConfigIsActive(payload);
      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.UPDATE_CO_ORDER_PAYMENT_CONFIG_IS_ACTIVE,
        payload
      });
    });
    it('should check correct type is used for  UpdateConfigIsActiveSuccess action ', () => {
      const payload = {
        description: 'test config',
        isActive: true,
        ruleDetails: null,
        ruleId: 1222,
        ruleType: 'AB-_CO_ORDER_PAYMENT_CONFIG'
      };

      const action = new UpdateConfigIsActiveSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.UPDATE_CO_ORDER_PAYMENT_CONFIG_IS_ACTIVE_SUCCESS,
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
          CoOrderPaymentConfigActionTypes.UPDATE_CO_ORDER_PAYMENT_CONFIG_IS_ACTIVE_FAILURE,
        payload
      });
    });
  });
  describe('LoadProductGroupMapping Action Test Cases', () => {
    it('should check correct type is used for  LoadProductGroupMapping action ', () => {
      const action = new LoadProductGroupMapping();
      expect({ ...action }).toEqual({
        type: CoOrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS
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
        type: CoOrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadProductGroupMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupMappingFailure(payload);
      expect({ ...action }).toEqual({
        type: CoOrderPaymentConfigActionTypes.LOAD_PRODUCT_GROUPS_FAILURE,
        payload
      });
    });
  });
  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: CoOrderPaymentConfigActionTypes.LOAD_RESET
      });
    });
  });
  describe('SaveOderPaymentConfig Action Test Cases', () => {
    it('should check correct type is used for  SaveOderPaymentConfig action ', () => {
      const payload: SaveCoOrderPaymentsPayload = {
        configDetail: {
          description: 'config test',
          isActive: true,
          ruleDetails: null
        },
        orderPaymentConfigRequest: null
      };
      const action = new SaveOderPaymentConfig(payload);
      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.SAVE_CO_ORDER_PAYMENT_CONFIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveOderPaymentConfigSuccess action ', () => {
      const payload = '1111';

      const action = new SaveOderPaymentConfigSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.SAVE_CO_ORDER_PAYMENT_CONFIG_DETAILS_SUCCESS,
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
          CoOrderPaymentConfigActionTypes.SAVE_CO_ORDER_PAYMENT_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('UpdateCoOrderPaymentConfig Action Test Cases', () => {
    it('should check correct type is used for  UpdateCoOrderPaymentConfig action ', () => {
      const payload: UpdateCoOrderPaymentConfigPayload = {
        id: '1111111',
        data: null
      };
      const action = new UpdateCoOrderPaymentConfig(payload);
      expect({ ...action }).toEqual({
        type: CoOrderPaymentConfigActionTypes.UPADTE_CO_ORDER_PAYMENT_CONFIG,
        payload
      });
    });
    it('should check correct type is used for UpdateCoOrderPaymentConfigSuccess action ', () => {
      const payload = {
        description: 'test config',
        isActive: true,
        ruleDetails: null,
        ruleId: 1222,
        ruleType: 'AB-_CO_ORDER_PAYMENT_CONFIG'
      };

      const action = new UpdateCoOrderPaymentConfigSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.UPADTE_CO_ORDER_PAYMENT_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateCoOrderPaymentConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCoOrderPaymentConfigFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.UPADTE_CO_ORDER_PAYMENT_CONFIG_FAILURE,
        payload
      });
    });
  });
  describe('RemoveCoOrderPaymentConfig Action Test Cases', () => {
    it('should check correct type is used for  RemoveCoOrderPaymentConfig action ', () => {
      const payload: UpdateCoOrderPaymentConfigPayload = {
        id: '1111111',
        data: null
      };
      const action = new RemoveCoOrderPaymentConfig(payload);
      expect({ ...action }).toEqual({
        type: CoOrderPaymentConfigActionTypes.REMOVE_CO_ORDER_PAYMENT_CONFIG,
        payload
      });
    });
    it('should check correct type is used for RemoveCoOrderPaymentConfigSuccess action ', () => {
      const payload = {
        description: 'test config',
        isActive: true,
        ruleDetails: null,
        ruleId: 1222,
        ruleType: 'AB-_CO_ORDER_PAYMENT_CONFIG'
      };

      const action = new RemoveCoOrderPaymentConfigSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.REMOVE_CO_ORDER_PAYMENT_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  RemoveCoOrderPaymentConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RemoveCoOrderPaymentConfigFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.REMOVE_CO_ORDER_PAYMENT_CONFIG_FAILURE,
        payload
      });
    });
  });
  describe('LoadCoOrderConfigByConfigId Action Test Cases', () => {
    it('should check correct type is used for  LoadCoOrderConfigByConfigId action ', () => {
      const payload: CoOrderPayementRulesRequest = {
        configId: '1111',
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadCoOrderConfigByConfigId(payload);
      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for LoadCoOrderConfigByConfigIdSuccess action ', () => {
      const payload: CoOrderpyamentRulesResponse = {
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

      const action = new LoadCoOrderConfigByConfigIdSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_BY_CONFIG_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCoOrderConfigByConfigIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCoOrderConfigByConfigIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CoOrderPaymentConfigActionTypes.LOAD_CO_ORDER_PAYMENT_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });
  describe('LoadAllConfigRules Action Test Cases', () => {
    it('should check correct type is used for  LoadAllConfigRules action ', () => {
      const payload: CoOrderPayementRulesRequest = {
        configId: '1111',
        isPageable: false
      };
      const action = new LoadAllConfigRules(payload);
      expect({ ...action }).toEqual({
        type: CoOrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES,
        payload
      });
    });
    it('should check correct type is used for LoadAllConfigRulesSuccess action ', () => {
      const payload: CoOrderpyamentRulesResponse = {
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
        type: CoOrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadAllConfigRulesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllConfigRulesFailure(payload);

      expect({ ...action }).toEqual({
        type: CoOrderPaymentConfigActionTypes.LOAD_ALL_CONFIG_RULES_FAILURE,
        payload
      });
    });
  });
});
