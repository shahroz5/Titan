import {
  LoadResidualToleranceByConfigidPayload,
  LoadResidualWeightConfigListingPayload,
  RangeMappingResponse,
  ResidualWeightConfigResponse,
  ResidualWeightRange,
  ResidualWeightToleranceResponse,
  SaveResidualTolerancePayload,
  UpdateRangeMappingPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './residual-weight-config.actions';
import {
  residualWeightConfigReducer,
  initialState
} from './residual-weight-config.reducer';
import { ResidualWeightConfigState } from './residual-weight-config.state';
describe('residualWeightConfigReducer reducer Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadResidualWeightConfigList ', () => {
    beforeEach(() => {});
    it('Load LOAD_RESIDUAL_WEIGHT_CONFIG_LIST should set the isLoading to true', () => {
      const payload: LoadResidualWeightConfigListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const action = new actions.LoadResidualWeightConfigList(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.residualWeightConfig).toBe(null);
    });
    it('Load LOAD_RESIDUAL_WEIGHT_CONFIG_LIST_SUCCESS should set the isLoading to true', () => {
      const payload: {
        data: ResidualWeightConfigResponse[];
        totalElements: number;
      } = {
        data: [
          {
            description: 'configtest',
            isActive: true,
            ruleDetails: null,
            ruleId: 2,
            ruleType: 'AB_RESIDUALTOLERANCE_CONFIG'
          }
        ],
        totalElements: 1
      };

      const action = new actions.LoadResidualWeightConfigListSuccess(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      //expect(result.residualWeightConfigList).toBeTruthy;
      expect(result.totalElements).toBe(1);
    });
    it('LOAD_RESIDUAL_WEIGHT_CONFIG_LIST_FAILURE should return error', () => {
      const action = new actions.LoadResidualWeightConfigListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchResidualWeightConfigList ', () => {
    beforeEach(() => {});
    it('SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST should set the isLoading to true', () => {
      const payload = 'configtest';

      const action = new actions.SearchResidualWeightConfigList(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('Load SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST_SUCCESS should set the isLoading to true', () => {
      const payload: {
        data: ResidualWeightConfigResponse[];
        totalElements: number;
      } = {
        data: [
          {
            description: 'configtest',
            isActive: true,
            ruleDetails: null,
            ruleId: 2,
            ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
          }
        ],
        totalElements: 1
      };

      const action = new actions.SearchResidualWeightConfigListSuccess(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      //expect(result.residualWeightConfigList).toBeTruthy;
      expect(result.totalElements).toBe(1);
    });
    it('SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST_FAILURE should return error', () => {
      const action = new actions.SearchResidualWeightConfigListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing SaveResidualWeightConfig ', () => {
    beforeEach(() => {});
    it('SAVE_RESIDUAL_WEIGHT_CONFIG should set the isLoading to true', () => {
      const payload: SaveResidualTolerancePayload = {
        configDetail: {
          description: 'config test',
          isActive: true,
          ruleDetails: null
        },
        residualTolerance: {
          addRangeConfigs: []
        }
      };
      const action = new actions.SaveResidualWeightConfig(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
      expect(result.residualWeightConfig).toBe(null);
    });
    it('Load SAVE_RESIDUAL_WEIGHT_CONFIG_SUCCESS should set the isLoading to true', () => {
      const payload: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };

      const action = new actions.SaveResidualWeightConfigSuccess(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
      expect(result.configId).toBeTruthy();
    });
    it('SAVE_RESIDUAL_WEIGHT_CONFIG_FAILURE should return error', () => {
      const action = new actions.SaveResidualWeightConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(false);
    });
  });
  describe('Testing UpdateResidualWeightConfigIsActive ', () => {
    beforeEach(() => {});
    it('UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE should set the isLoading to true', () => {
      const payload: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };
      const action = new actions.UpdateResidualWeightConfigIsActive(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
      expect(result.residualWeightConfig).toBe(null);
    });
    it('Load UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE_SUCCESS should set the isLoading to true', () => {
      const payload: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };

      const action = new actions.UpdateResidualWeightConfigIsActiveSuccess(
        payload
      );

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
      expect(result.residualWeightConfig).toBeTruthy();
    });
    it('UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE_FAILURE should return error', () => {
      const action = new actions.UpdateResidualWeightConfigIsActiveFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(false);
    });
  });
  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LOAD_RESET should set the isLoading to true', () => {
      const action = new actions.LoadReset();

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.residualWeightConfigList.length).toBe(0);
      expect(result.residualWeightConfig).toBe(null);
      expect(result.isLoading).toBe(null);
      expect(result.hasSaved).toBe(null);
      expect(result.hasUpdated).toBe(null);
      expect(result.totalElements).toBe(null);
      expect(result.error).toBe(null);
      expect(result.rangeMapping).toBe(null);
      expect(result.configId).toBe(null);
      expect(result.isCleared).toBe(null);
    });
  });
  describe('Testing LoadResidualRangeWeight ', () => {
    beforeEach(() => {});
    it('LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT should set the isLoading to true', () => {
      const action = new actions.LoadResidualRangeWeight();

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('Load LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT_SUCCESS should set the isLoading to true', () => {
      const payload: ResidualWeightRange[] = [
        {
          id: '1111',
          range: '1-10',
          rowId: '2'
        }
      ];

      const action = new actions.LoadResidualRangeWeightSuccesss(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.rangeWeight).toBeTruthy();
    });
    it('LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT_FAILURE should return error', () => {
      const action = new actions.LoadResidualRangeWeightFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toBe(null);
    });
  });
  describe('Testing LoadSelectedConfigDetails ', () => {
    beforeEach(() => {});
    it('LOAD_SELECTED_CONFIG_DETAILS should set the isLoading to true', () => {
      const payload = '11111111';
      const action = new actions.LoadSelectedConfigDetails(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('Load LOAD_SELECTED_CONFIG_DETAILS_SUCCESS should set the isLoading to true', () => {
      const payload: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };

      const action = new actions.LoadSelectedConfigDetailsSuccess(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.residualWeightConfig).toBeTruthy();
    });
    it('LOAD_SELECTED_CONFIG_DETAILS_FAILURE should return error', () => {
      const action = new actions.LoadSelectedConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toBe(null);
    });
  });
  describe('Testing LoadRangeMappingByConfigid ', () => {
    beforeEach(() => {});
    it('LOAD_RANGE_MAPPING_BY_CONFIG_ID should set the isLoading to true', () => {
      const payload: LoadResidualToleranceByConfigidPayload = {
        configId: '111111111',
        pageIndex: 0,
        pageSize: 10
      };
      const action = new actions.LoadRangeMappingByConfigid(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('Load LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS should set the isLoading to true', () => {
      const payload: ResidualWeightToleranceResponse = {
        totalElements: 10,
        weightTolerance: [
          {
            ruleId: 1,
            ruleType: 'AB_RESIDUAL_TOLERANCE_CONFIG',
            rules: [
              {
                id: '123456',
                rangeId: '22222222',
                ruleDetails: {
                  data: null,
                  type: 'AB_RESIDUAL_TOLERANCE_CONFIG'
                }
              }
            ]
          }
        ]
      };
      const action = new actions.LoadRangeMappingByConfigidSuccess(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.rangeMapping).toBeTruthy();
      expect(result.ruleDetailsCount).toBe(10);
    });
    it('LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE should return error', () => {
      const action = new actions.LoadRangeMappingByConfigidFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toBe(null);
      expect(result.rangeMapping).toBe(null);
    });
  });

  describe('Testing UpdateRangeMapping ', () => {
    beforeEach(() => {});
    it('UPADTE_RANGE_MAPPING should set the isLoading to true', () => {
      const payload: UpdateRangeMappingPayload = {
        data: null,
        id: '111111111'
      };
      const action = new actions.UpdateRangeMapping(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });
    it('Load UPADTE_RANGE_MAPPING_SUCCESS should set the isLoading to true', () => {
      const payload: RangeMappingResponse = {
        ruleId: 1,
        ruleType: 'AB_RESIDUAL_TOLERANCE_CONFIG',
        rules: []
      };
      const action = new actions.UpdateRangeMappingSuccess(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
    });
    it('UPADTE_RANGE_MAPPING_FAILURE should return error', () => {
      const action = new actions.UpdateRangeMappingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(false);
    });
  });
  describe('Testing RemoveRangeMapping ', () => {
    beforeEach(() => {});
    it('REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT should set the isLoading to true', () => {
      const payload: UpdateRangeMappingPayload = {
        data: null,
        id: '111111111'
      };
      const action = new actions.RemoveRangeMapping(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.isCleared).toBe(false);
    });
    it('Load REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT_SUCCESS should set the isLoading to true', () => {
      const payload: RangeMappingResponse = {
        ruleId: 1,
        ruleType: 'AB_RESIDUAL_TOLERANCE_CONFIG',
        rules: []
      };
      const action = new actions.RemoveRangeMappingSuccess(payload);

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.isCleared).toBe(true);
    });
    it('REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT_FAILURE should return error', () => {
      const action = new actions.RemoveRangeMappingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ResidualWeightConfigState = residualWeightConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toBe(null);
      expect(result.isCleared).toBe(null);
    });
  });
});
