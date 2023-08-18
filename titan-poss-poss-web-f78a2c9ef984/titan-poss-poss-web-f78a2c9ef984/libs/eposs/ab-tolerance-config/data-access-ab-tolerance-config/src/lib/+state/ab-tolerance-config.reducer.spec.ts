import {
  AbToleranceConfigDetailsReqPayload,
  AbToleranceConfigDetailsResPayload,
  AbToleranceConfigMetalType,
  AbToleranceConfigResponse,
  AbToleranceRangeMappingResponse,
  ABToleranceUpdateRangeMappingPayload,
  AbToleranceWeightRange,
  CustomErrors,
  LoadAbToleranceConfigReqPayload,
  SaveAbTolerancePayload
} from '@poss-web/shared/models';
import {
  abToleranceConfigReducer,
  initialState
} from './ab-tolerance-config.reducer';
import * as actions from './ab-tolerance-config.actions';
import { AbToleranceConfigState } from './ab-tolerance-config.state';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('weightToleranceReducer reducer Testing Suite', () => {
  const testState = initialState;
  describe('Testing LoadConfigList ', () => {
    beforeEach(() => {});
    it('LOAD_AB_TOLERANCE_CONFIG_LIST should be called', () => {
      const payload: LoadAbToleranceConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        orderType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new actions.LoadAbToleranceConfigList(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.abToleranceConfig).toBe(null);
    });
    it('LOAD_AB_TOLERANCE_CONFIG_LIST_SUCCESS should set be called', () => {
      const payload: {
        data: AbToleranceConfigResponse[];
        totalElements: number;
      } = {
        totalElements: 10,
        data: [
          {
            ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
            ruleId: 1,
            description: 'testconfig',
            isActive: true
          }
        ]
      };
      const action = new actions.LoadAbToleranceConfigListSuccess(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.totalElements).toBe(10);
      expect(result.abToleranceConfigList).toBeTruthy();
    });
    it('LOAD_AB_TOLERANCE_CONFIG_LIST_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadAbToleranceConfigListFailure(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing SearchAbToleranceConfigList ', () => {
    beforeEach(() => {});
    it('SEARCH_AB_TOLERANCE_CONFIG_LIST should be called', () => {
      const payload: { configName: string; ruleType: string } = {
        configName: 'testconfig',
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new actions.SearchAbToleranceConfigList(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
    });
    it('SEARCH_AB_TOLERANCE_CONFIG_LIST_SUCCESS should set be called', () => {
      const payload: {
        data: AbToleranceConfigResponse[];
        totalElements: number;
      } = {
        totalElements: 1,
        data: [
          {
            ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
            ruleId: 1,
            description: 'testconfig',
            isActive: true
          }
        ]
      };
      const action = new actions.SearchAbToleranceConfigListSuccess(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.totalElements).toBe(1);
      expect(result.abToleranceConfigList).toBeTruthy();
    });
    it('SEARCH_AB_TOLERANCE_CONFIG_LIST_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.SearchAbToleranceConfigListFailure(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing UpdateAbToleranceConfigIsActive ', () => {
    beforeEach(() => {});
    it('UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE should be called', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const action = new actions.UpdateAbToleranceConfigIsActive(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
      expect(result.abToleranceConfig).toBe(null);
    });
    it('UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE_SUCCESS should set be called', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };
      const action = new actions.UpdateAbToleranceConfigIsActiveSuccess(
        payload
      );
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
      expect(result.abToleranceConfig).toBeTruthy();
    });
    it('UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.UpdateAbToleranceConfigIsActiveFailure(
        payload
      );
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing SaveAbToleranceConfig ', () => {
    beforeEach(() => {});
    it('SAVE_AB_TOLERANCE_CONFIG should be called', () => {
      const payload: SaveAbTolerancePayload = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configDetail: {
          ruleDetails: {},
          description: 'testconfig',
          isActive: true
        },
        residualTolerance: null
      };
      const action = new actions.SaveAbToleranceConfig(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
      expect(result.abToleranceConfig).toBe(null);
    });
    it('SAVE_AB_TOLERANCE_CONFIG_SUCCESS should set be called', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };
      const action = new actions.SaveAbToleranceConfigSuccess(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
      expect(result.configId).toBeTruthy();
    });
    it('SAVE_AB_TOLERANCE_CONFIG_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.SaveAbToleranceConfigFailure(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadSelectedConfigDetails ', () => {
    beforeEach(() => {});
    it('LOAD_SELECTED_CONFIG_DETAILS should be called', () => {
      const payload: { configId: string; ruleType: string } = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configId: '1'
      };
      const action = new actions.LoadSelectedConfigDetails(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS should set be called', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };
      const action = new actions.LoadSelectedConfigDetailsSuccess(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.abToleranceConfig).toBeTruthy();
    });
    it('LOAD_SELECTED_CONFIG_DETAILS_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadSelectedConfigDetailsFailure(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadRangeMappingByConfigId ', () => {
    beforeEach(() => {});
    it('LOAD_RANGE_MAPPING_BY_CONFIG_ID should be called', () => {
      const payload: AbToleranceConfigDetailsReqPayload = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configId: '1',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      const action = new actions.LoadRangeMappingByConfigId(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.toleranceConfigMapping).toBe(null);
    });
    it('LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS should set be called', () => {
      const payload: AbToleranceConfigDetailsResPayload = {
        totalElements: 1,
        ruleDetails: [
          {
            id: '8888888888',
            rangeId: '3333333333333',
            ruleDetails: {
              data: {
                id: '5251B218-19D4-4DCD-AE68-A6E73B0A8FA2',
                metalType: 'J',
                rangeId: '851B2408-985D-49CB-86EC-0CA112333173'
              },
              type: 'ORDER_AB_FROZEN_TOLERANCE'
            }
          }
        ]
      };
      const action = new actions.LoadRangeMappingByConfigIdSuccess(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.toleranceConfigMapping).toBeTruthy();
      expect(result.ruleDetailsCount).toBe(1);
    });
    it('LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadRangeMappingByConfigIdFailure(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toEqual('Some Error');
      expect(result.toleranceConfigMapping).toBe(null);
    });
  });

  describe('Testing UpdateRangeMapping ', () => {
    beforeEach(() => {});
    it('UPADTE_RANGE_MAPPING should be called', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '7777777777',
        data: null,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new actions.UpdateRangeMapping(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });
    it('UPADTE_RANGE_MAPPING_SUCCESS should set be called', () => {
      const payload: AbToleranceRangeMappingResponse = {
        ruleId: 101,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        rules: [
          {
            id: '11111',
            rangeId: '222222',
            ruleDetails: {
              data: null,
              type: 'AB_TOLERANCE'
            }
          }
        ]
      };
      const action = new actions.UpdateRangeMappingSuccess(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.toleranceConfigMapping).toBeTruthy();
      expect(result.hasUpdated).toBe(true);
    });
    it('UPADTE_RANGE_MAPPING_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.UpdateRangeMappingFailure(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toEqual('Some Error');
      expect(result.hasUpdated).toBe(false);
    });
  });

  describe('Testing LoadMetalTypes ', () => {
    beforeEach(() => {});
    it('LOAD_METAL_TYPES should be called', () => {
      const action = new actions.LoadMetalTypes();
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LOAD_METAL_TYPES_SUCCESS should set be called', () => {
      const payload: AbToleranceConfigMetalType[] = [
        { materialTypeCode: 'J', description: 'GOLD' }
      ];
      const action = new actions.LoadMetalTypesSuccess(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.metalType).toBeTruthy();
    });
    it('LOAD_METAL_TYPES_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadMetalTypesFailure(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing RemoveAbToleranceConfig ', () => {
    beforeEach(() => {});
    it('REMOVE_AB_TOLERANCE_CONFIG should be called', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '55555555555',
        data: null,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new actions.RemoveAbToleranceConfig(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.isCleared).toBe(false);
    });
    it('REMOVE_AB_TOLERANCE_CONFIG_SUCCESS should set be called', () => {
      const payload: AbToleranceConfigMetalType[] = [
        { materialTypeCode: 'J', description: 'GOLD' }
      ];
      const action = new actions.RemoveAbToleranceConfigSuccess(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.isCleared).toBe(true);
    });
    it('REMOVE_AB_TOLERANCE_CONFIG_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.RemoveAbToleranceConfigFailure(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toEqual('Some Error');
      expect(result.isCleared).toBe(null);
    });
  });
  describe('Testing UniqueConfigurationNameCheck ', () => {
    beforeEach(() => {});
    it('AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK should be called', () => {
      const payload = 'configtest';
      const action = new actions.UniqueConfigurationNameCheck(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.uniqueNameCheckCount).toBe(null);
    });
    it('AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_SUCCESS should set be called', () => {
      const payload = 1;
      const action = new actions.UniqueConfigurationNameCheckSuccess(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.uniqueNameCheckCount).toBe(1);
    });
    it('AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.UniqueConfigurationNameCheckFailure(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('Some Error');
      expect(result.uniqueNameCheckCount).toBe(null);
    });
  });
  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LOAD_RESET should be called', () => {
      const action = new actions.LoadReset();
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.abToleranceConfigList.length).toBe(0);
      expect(result.abToleranceConfig).toBe(null);
      expect(result.isLoading).toBe(null);
      expect(result.hasSaved).toBe(null);
      expect(result.hasUpdated).toBe(null);
      expect(result.totalElements).toBe(null);
      expect(result.error).toBe(null);
      expect(result.toleranceConfigMapping).toBe(null);
      expect(result.rangeWeight.length).toBe(0);
      expect(result.metalType.length).toBe(0);
      expect(result.uniqueNameCheckCount).toBe(null);
    });
  });
  describe('Testing LoadAbToleranceRangeWeight ', () => {
    beforeEach(() => {});
    it('LOAD_AB_TOLERANCE_RANGE_WEIGHT should be called', () => {
      const action = new actions.LoadAbToleranceRangeWeight();
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.rangeWeight).toBe(null);
    });
    it('LOAD_AB_TOLERANCE_RANGE_WEIGHT_SUCCESS should set be called', () => {
      const payload: AbToleranceWeightRange[] = [
        { range: '0-10', id: '851B2408', rowId: 3 }
      ];
      const action = new actions.LoadAbToleranceRangeWeightSuccess(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.rangeWeight.length).toBe(1);
    });
    it('LOAD_AB_TOLERANCE_RANGE_WEIGHT_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadAbToleranceRangeWeightFailure(payload);
      const result: AbToleranceConfigState = abToleranceConfigReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toEqual('Some Error');
    });
  });
});
