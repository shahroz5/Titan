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
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  AbToleranceConfigActionTypes,
  LoadAbToleranceConfigList,
  LoadAbToleranceConfigListFailure,
  LoadAbToleranceConfigListSuccess,
  LoadAbToleranceRangeWeight,
  LoadAbToleranceRangeWeightFailure,
  LoadAbToleranceRangeWeightSuccess,
  LoadMetalTypes,
  LoadMetalTypesFailure,
  LoadMetalTypesSuccess,
  LoadRangeMappingByConfigId,
  LoadRangeMappingByConfigIdFailure,
  LoadRangeMappingByConfigIdSuccess,
  LoadReset,
  LoadSelectedConfigDetails,
  LoadSelectedConfigDetailsFailure,
  LoadSelectedConfigDetailsSuccess,
  RemoveAbToleranceConfig,
  RemoveAbToleranceConfigFailure,
  RemoveAbToleranceConfigSuccess,
  SaveAbToleranceConfig,
  SaveAbToleranceConfigFailure,
  SaveAbToleranceConfigSuccess,
  SearchAbToleranceConfigList,
  SearchAbToleranceConfigListFailure,
  SearchAbToleranceConfigListSuccess,
  UniqueConfigurationNameCheck,
  UniqueConfigurationNameCheckFailure,
  UniqueConfigurationNameCheckSuccess,
  UpdateAbToleranceConfigIsActive,
  UpdateAbToleranceConfigIsActiveFailure,
  UpdateAbToleranceConfigIsActiveSuccess,
  UpdateRangeMapping,
  UpdateRangeMappingFailure,
  UpdateRangeMappingSuccess
} from './ab-tolerance-config.actions';

describe('AB Tokerance Action Testing Suite', () => {
  describe('LoadAbToleranceConfigList Action Test Cases', () => {
    it('should check correct type is used for  LoadConfigList action ', () => {
      const payload: LoadAbToleranceConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        orderType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new LoadAbToleranceConfigList(payload);
      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadAbToleranceConfigListSuccess action ', () => {
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
      const action = new LoadAbToleranceConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadAbToleranceConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAbToleranceConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SearchAbToleranceConfigList Action Test Cases', () => {
    it('should check correct type is used for  SearchAbToleranceConfigList action ', () => {
      const payload: { configName: string; ruleType: string } = {
        configName: 'testconfig',
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new SearchAbToleranceConfigList(payload);
      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.SEARCH_AB_TOLERANCE_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for  SearchAbToleranceConfigListSuccess action ', () => {
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
      const action = new SearchAbToleranceConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.SEARCH_AB_TOLERANCE_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchAbToleranceConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchAbToleranceConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.SEARCH_AB_TOLERANCE_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  describe('UpdateAbToleranceConfigIsActive Action Test Cases', () => {
    it('should check correct type is used for  UpdateAbToleranceConfigIsActive action ', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const action = new UpdateAbToleranceConfigIsActive(payload);
      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE,
        payload
      });
    });
    it('should check correct type is used for UpdateIsActiveSuccess action ', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };

      const action = new UpdateAbToleranceConfigIsActiveSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateAbToleranceConfigIsActiveFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateAbToleranceConfigIsActiveFailure(payload);

      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE,
        payload
      });
    });
  });

  describe('SaveAbToleranceConfig Action Test Cases', () => {
    it('should check correct type is used for  SaveAbToleranceConfig action ', () => {
      const payload: SaveAbTolerancePayload = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configDetail: {
          ruleDetails: {},
          description: 'testconfig',
          isActive: true
        },
        residualTolerance: null
      };
      const action = new SaveAbToleranceConfig(payload);
      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.SAVE_AB_TOLERANCE_CONFIG,
        payload
      });
    });
    it('should check correct type is used for SaveAbToleranceConfigSuccess action ', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };

      const action = new SaveAbToleranceConfigSuccess(payload);

      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.SAVE_AB_TOLERANCE_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveAbToleranceConfigFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveAbToleranceConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.SAVE_AB_TOLERANCE_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedConfigDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedConfigDetails action ', () => {
      const payload: { configId: string; ruleType: string } = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configId: '1'
      };
      const action = new LoadSelectedConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedConfigDetailsSuccess action ', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };

      const action = new LoadSelectedConfigDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedConfigDetailsFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadRangeMappingByConfigId Action Test Cases', () => {
    it('should check correct type is used for  LoadRangeMappingByConfigId action ', () => {
      const payload: AbToleranceConfigDetailsReqPayload = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configId: '1',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      const action = new LoadRangeMappingByConfigId(payload);
      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for LoadRangeMappingByConfigIdSuccess action ', () => {
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

      const action = new LoadRangeMappingByConfigIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRangeMappingByConfigIdFailue  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRangeMappingByConfigIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });

  describe('UpdateRangeMapping Action Test Cases', () => {
    it('should check correct type is used for  UpdateRangeMapping action ', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '7777777777',
        data: null,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new UpdateRangeMapping(payload);
      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.UPADTE_RANGE_MAPPING,
        payload
      });
    });
    it('should check correct type is used for UpdateRangeMappingSuccess action ', () => {
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

      const action = new UpdateRangeMappingSuccess(payload);

      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateRangeMappingFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateRangeMappingFailure(payload);

      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_FAILURE,
        payload
      });
    });
  });

  describe('LoadMetalTypes Action Test Cases', () => {
    it('should check correct type is used for  LoadMetalTypes action ', () => {
      const action = new LoadMetalTypes();
      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.LOAD_METAL_TYPES
      });
    });
    it('should check correct type is used for LoadMetalTypesSuccess action ', () => {
      const payload: AbToleranceConfigMetalType[] = [
        { materialTypeCode: 'J', description: 'GOLD' }
      ];

      const action = new LoadMetalTypesSuccess(payload);

      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.LOAD_METAL_TYPES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadMetalTypesFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMetalTypesFailure(payload);

      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.LOAD_METAL_TYPES_FAILURE,
        payload
      });
    });
  });
  describe('RemoveAbToleranceConfig Action Test Cases', () => {
    it('should check correct type is used for  RemoveAbToleranceConfig action ', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '55555555555',
        data: null,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new RemoveAbToleranceConfig(payload);
      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.REMOVE_AB_TOLERANCE_CONFIG,
        payload
      });
    });
    it('should check correct type is used for RemoveAbToleranceConfigSuccess action ', () => {
      const payload = null;
      const action = new RemoveAbToleranceConfigSuccess(payload);

      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.REMOVE_AB_TOLERANCE_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for RemoveAbToleranceConfigFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RemoveAbToleranceConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.REMOVE_AB_TOLERANCE_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('UniqueConfigurationNameCheck Action Test Cases', () => {
    it('should check correct type is used for  UniqueConfigurationNameCheck action ', () => {
      const payload = 'configtest';
      const action = new UniqueConfigurationNameCheck(payload);
      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK,
        payload
      });
    });
    it('should check correct type is used for UniqueConfigurationNameCheckSuccess action ', () => {
      const payload = 1;
      const action = new UniqueConfigurationNameCheckSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UniqueConfigurationNameCheckFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UniqueConfigurationNameCheckFailure(payload);

      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_FAILURE,
        payload
      });
    });
  });
  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.LOAD_RESET
      });
    });
  });

  describe('LoadAbToleranceRangeWeight Action Test Cases', () => {
    it('should check correct type is used for  LoadAbToleranceRangeWeight action ', () => {
      const action = new LoadAbToleranceRangeWeight();
      expect({ ...action }).toEqual({
        type: AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_RANGE_WEIGHT
      });
    });
    it('should check correct type is used for RemoveAbToleranceConfigSuccess action ', () => {
      const payload: AbToleranceWeightRange[] = [
        { range: '0-10', id: '851B2408', rowId: 3 }
      ];
      const action = new LoadAbToleranceRangeWeightSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_RANGE_WEIGHT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for RemoveAbToleranceConfigFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAbToleranceRangeWeightFailure(payload);

      expect({ ...action }).toEqual({
        type:
          AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_RANGE_WEIGHT_FAILURE,
        payload
      });
    });
  });
});
