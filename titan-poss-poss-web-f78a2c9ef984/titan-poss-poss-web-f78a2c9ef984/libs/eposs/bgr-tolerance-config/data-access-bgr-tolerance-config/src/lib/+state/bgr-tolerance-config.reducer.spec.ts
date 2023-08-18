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
  bgrToleranceConfigReducer,
  initialState
} from './bgr-tolerance-config.reducer';
import * as actions from './bgr-tolerance-config.actions';
import { BgrToleranceConfigState } from './bgr-tolerance-config.state';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('BgrToleranceReducer reducer Testing Suite', () => {
  const testState = initialState;
  describe('Testing LoadConfigList ', () => {
    beforeEach(() => {});
    it('LOAD_BGR_TOLERANCE_CONFIG_LIST should be called', () => {
      const payload: LoadAbToleranceConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        orderType: 'ORDER_BGR_TOLERANCE'
      };
      const action = new actions.LoadBgrToleranceConfigList(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.bgrToleranceConfig).toBe(null);
    });
    it('LOAD_BGR_TOLERANCE_CONFIG_LIST_SUCCESS should set be called', () => {
      const payload: {
        data: AbToleranceConfigResponse[];
        totalElements: number;
      } = {
        totalElements: 10,
        data: [
          {
            ruleType: 'ORDER_BGR_TOLERANCE',
            ruleId: 1,
            description: 'testconfig',
            isActive: true
          }
        ]
      };
      const action = new actions.LoadBgrToleranceConfigListSuccess(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.totalElements).toBe(10);
      expect(result.bgrToleranceConfigList).toBeTruthy();
    });
    it('LOAD_BGR_TOLERANCE_CONFIG_LIST_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadBgrToleranceConfigListFailure(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing SearchBgrToleranceConfigList ', () => {
    beforeEach(() => {});
    it('SEARCH_BGR_TOLERANCE_CONFIG_LIST should be called', () => {
      const payload: { configName: string; ruleType: string } = {
        configName: 'testconfig',
        ruleType: 'ORDER_BGR_TOLERANCE'
      };
      const action = new actions.SearchBgrToleranceConfigList('');
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(true);
    });
    it('SEARCH_BGR_TOLERANCE_CONFIG_LIST_SUCCESS should set be called', () => {
      const payload: {
        data: AbToleranceConfigResponse[];
        totalElements: number;
      } = {
        totalElements: 1,
        data: [
          {
            ruleType: 'ORDER_BGR_TOLERANCE',
            ruleId: 1,
            description: 'testconfig',
            isActive: true
          }
        ]
      };
      const action = new actions.SearchBgrToleranceConfigListSuccess(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.totalElements).toBe(1);
      expect(result.bgrToleranceConfigList).toBeTruthy();
    });
    it('SEARCH_BGR_TOLERANCE_CONFIG_LIST_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.SearchBgrToleranceConfigListFailure(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing UpdateBgrToleranceConfigIsActive ', () => {
    beforeEach(() => {});
    it('UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE should be called', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const action = new actions.UpdateBgrToleranceConfigIsActive(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
      expect(result.bgrToleranceConfig).toBe(null);
    });
    it('UPADTE_BGR_CONFIG_IS_ACTIVE_SUCCESS should set be called', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };
      const action = new actions.UpdateBgrToleranceConfigIsActiveSuccess(
        payload
      );
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
      expect(result.bgrToleranceConfig).toBeTruthy();
    });
    it('UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.UpdateBgrToleranceConfigIsActiveFailure(
        payload
      );
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing SaveBgrToleranceConfig ', () => {
    beforeEach(() => {});
    it('SAVE_BGR_TOLERANCE_CONFIG should be called', () => {
      const payload: SaveAbTolerancePayload = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        configDetail: {
          ruleDetails: {},
          description: 'testconfig',
          isActive: true
        },
        residualTolerance: null
      };
      const action = new actions.SaveBgrToleranceConfig(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
      expect(result.bgrToleranceConfig).toBe(null);
    });
    it('SAVE_BGR_TOLERANCE_CONFIG_SUCCESS should set be called', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };
      const action = new actions.SaveBgrToleranceConfigSuccess(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
      expect(result.configId).toBeTruthy();
    });
    it('SAVE_BGR_TOLERANCE_CONFIG_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.SaveBgrToleranceConfigFailure(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadSelectedConfigDetails ', () => {
    beforeEach(() => {});
    it('LOAD_SELECTED_CONFIG_DETAILS should be called', () => {
      const payload: { configId: string; ruleType: string } = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        configId: '1'
      };
      const action = new actions.LoadSelectedConfigDetails('');
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS should set be called', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };
      const action = new actions.LoadSelectedConfigDetailsSuccess(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.bgrToleranceConfig).toBeTruthy();
    });
    it('LOAD_SELECTED_CONFIG_DETAILS_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadSelectedConfigDetailsFailure(payload);
      const result = bgrToleranceConfigReducer(testState, action);
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
      const action = new actions.LoadRangeMappingByConfigId('');
      const result = bgrToleranceConfigReducer(testState, action);
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
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.toleranceConfigMapping).toBeTruthy();
    });
    it('LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadRangeMappingByConfigIdFailure(payload);
      const result = bgrToleranceConfigReducer(testState, action);
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
        ruleType: 'ORDER_BGR_TOLERANCE'
      };
      const action = new actions.UpdateRangeMapping(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });
    it('UPADTE_RANGE_MAPPING_SUCCESS should set be called', () => {
      const payload: AbToleranceRangeMappingResponse = {
        ruleId: 101,
        ruleType: 'ORDER_BGR_TOLERANCE',
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
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.toleranceConfigMapping).toBeTruthy();
      expect(result.hasUpdated).toBe(true);
    });
    it('UPADTE_RANGE_MAPPING_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.UpdateRangeMappingFailure(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toEqual('Some Error');
      expect(result.hasUpdated).toBe(false);
    });
  });

  describe('Testing LoadMetalTypes ', () => {
    beforeEach(() => {});
    it('LOAD_METAL_TYPES should be called', () => {
      const action = new actions.LoadMetalTypes();
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LOAD_METAL_TYPES_SUCCESS should set be called', () => {
      const payload: AbToleranceConfigMetalType[] = [
        { materialTypeCode: 'J', description: 'GOLD' }
      ];
      const action = new actions.LoadMetalTypesSuccess(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.metalType).toBeTruthy();
    });
    it('LOAD_METAL_TYPES_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadMetalTypesFailure(payload);
      const result = bgrToleranceConfigReducer(testState, action);
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
        ruleType: 'ORDER_BGR_TOLERANCE'
      };
      const action = new actions.RemoveBgrToleranceConfig(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(true);
      expect(result.isCleared).toBe(false);
    });
    it('REMOVE_BGR_TOLERANCE_CONFIG_SUCCESS should set be called', () => {
      const payload: AbToleranceConfigMetalType[] = [
        { materialTypeCode: 'J', description: 'GOLD' }
      ];
      const action = new actions.RemoveBgrToleranceConfigSuccess(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.isCleared).toBe(true);
    });
    it('REMOVE_BGR_TOLERANCE_CONFIG_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.RemoveBgrToleranceConfigFailure(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toEqual('Some Error');
      expect(result.isCleared).toBe(null);
    });
  });
  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LOAD_RESET should be called', () => {
      const action = new actions.LoadReset();
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.bgrToleranceConfigList.length).toBe(0);
      expect(result.bgrToleranceConfig).toBe(null);
      expect(result.isLoading).toBe(null);
      expect(result.hasSaved).toBe(null);
      expect(result.hasUpdated).toBe(null);
      expect(result.totalElements).toBe(null);
      expect(result.error).toBe(null);
      expect(result.toleranceConfigMapping).toBe(null);
      expect(result.rangeWeight.length).toBe(0);
      expect(result.metalType.length).toBe(0);
    });
  });
  describe('Testing LoadBgrToleranceRangeWeight ', () => {
    beforeEach(() => {});
    it('LOAD_BGR_TOLERANCE_RANGE_WEIGHT should be called', () => {
      const action = new actions.LoadBgrToleranceRangeWeight();
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.rangeWeight).toBe(null);
    });
    it('LOAD_BGR_TOLERANCE_RANGE_WEIGHT_SUCCESS should set be called', () => {
      const payload: AbToleranceWeightRange[] = [
        { range: '0-10', id: '851B2408', rowId: 3 }
      ];
      const action = new actions.LoadBgrToleranceRangeWeightSuccess(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.rangeWeight.length).toBe(1);
    });
    it('LOAD_BGR_TOLERANCE_RANGE_WEIGHT_FAILURE should set be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadBgrToleranceRangeWeightFailure(payload);
      const result = bgrToleranceConfigReducer(testState, action);
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toEqual('Some Error');
    });
  });
});
