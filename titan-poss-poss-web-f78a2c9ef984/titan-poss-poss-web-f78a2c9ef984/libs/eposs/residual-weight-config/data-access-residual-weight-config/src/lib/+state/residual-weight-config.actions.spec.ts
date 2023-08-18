import {
  CustomErrors,
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
import {
  ResidualWeightConfigActionTypes,
  LoadResidualWeightConfigList,
  LoadResidualWeightConfigListSuccess,
  LoadResidualWeightConfigListFailure,
  SearchResidualWeightConfigList,
  SearchResidualWeightConfigListSuccess,
  SearchResidualWeightConfigListFailure,
  SaveResidualWeightConfig,
  SaveResidualWeightConfigSuccess,
  SaveResidualWeightConfigFailure,
  UpdateResidualWeightConfigIsActive,
  UpdateResidualWeightConfigIsActiveSuccess,
  UpdateResidualWeightConfigIsActiveFailure,
  LoadReset,
  LoadResidualRangeWeight,
  LoadResidualRangeWeightSuccesss,
  LoadResidualRangeWeightFailure,
  LoadSelectedConfigDetails,
  LoadSelectedConfigDetailsSuccess,
  LoadSelectedConfigDetailsFailure,
  LoadRangeMappingByConfigid,
  LoadRangeMappingByConfigidSuccess,
  LoadRangeMappingByConfigidFailure,
  UpdateRangeMapping,
  UpdateRangeMappingSuccess,
  UpdateRangeMappingFailure,
  RemoveRangeMapping,
  RemoveRangeMappingSuccess,
  RemoveRangeMappingFailure
} from './residual-weight-config.actions';
describe('WeightTolerance  Action Testing Suite', () => {
  describe('LoadResidualWeightConfigList Action Test Cases', () => {
    it('should check correct type is used for  LoadResidualWeightConfigList action ', () => {
      const payload: LoadResidualWeightConfigListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const action = new LoadResidualWeightConfigList(payload);
      expect({ ...action }).toEqual({
        type: ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadResidualWeightConfigListSuccess action ', () => {
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

      const action = new LoadResidualWeightConfigListSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadResidualWeightConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new LoadResidualWeightConfigListFailure(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SearchResidualWeightConfigList Action Test Cases', () => {
    it('should check correct type is used for  SearchResidualWeightConfigList action ', () => {
      const payload = 'configtest';

      const action = new SearchResidualWeightConfigList(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for  SearchResidualWeightConfigListSuccess action ', () => {
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

      const action = new SearchResidualWeightConfigListSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchResidualWeightConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new SearchResidualWeightConfigListFailure(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SaveResidualWeightConfig Action Test Cases', () => {
    it('should check correct type is used for  SaveResidualWeightConfig action ', () => {
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
      const action = new SaveResidualWeightConfig(payload);
      expect({ ...action }).toEqual({
        type: ResidualWeightConfigActionTypes.SAVE_RESIDUAL_WEIGHT_CONFIG,
        payload
      });
    });
    it('should check correct type is used for  SaveResidualWeightConfigSuccess action ', () => {
      const payload: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };

      const action = new SaveResidualWeightConfigSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.SAVE_RESIDUAL_WEIGHT_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveResidualWeightConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new SaveResidualWeightConfigFailure(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.SAVE_RESIDUAL_WEIGHT_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('UpdateResidualWeightConfigIsActive Action Test Cases', () => {
    it('should check correct type is used for  UpdateResidualWeightConfigIsActive action ', () => {
      const payload: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };

      const action = new UpdateResidualWeightConfigIsActive(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE,
        payload
      });
    });
    it('should check correct type is used for  UpdateResidualWeightConfigIsActiveSuccess action ', () => {
      const payload: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };
      const action = new UpdateResidualWeightConfigIsActiveSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveResidualWeightConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new UpdateResidualWeightConfigIsActiveFailure(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE_FAILURE,
        payload
      });
    });
  });
  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: ResidualWeightConfigActionTypes.LOAD_RESET
      });
    });
  });
  describe('LoadResidualRangeWeight Action Test Cases', () => {
    it('should check correct type is used for  LoadResidualRangeWeight action ', () => {
      const action = new LoadResidualRangeWeight();
      expect({ ...action }).toEqual({
        type: ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT
      });
    });
    it('should check correct type is used for  LoadResidualRangeWeightSuccesss action ', () => {
      const payload: ResidualWeightRange[] = [
        {
          id: '1111',
          range: '1-10',
          rowId: '2'
        }
      ];
      const action = new LoadResidualRangeWeightSuccesss(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadResidualRangeWeightFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new LoadResidualRangeWeightFailure(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedConfigDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedConfigDetails action ', () => {
      const payload = '11111111';
      const action = new LoadSelectedConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: ResidualWeightConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedConfigDetailsSuccess action ', () => {
      const payload: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };
      const action = new LoadSelectedConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedConfigDetailFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new LoadSelectedConfigDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadRangeMappingByConfigid Action Test Cases', () => {
    it('should check correct type is used for  LoadRangeMappingByConfigid action ', () => {
      const payload: LoadResidualToleranceByConfigidPayload = {
        configId: '111111111',
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadRangeMappingByConfigid(payload);
      expect({ ...action }).toEqual({
        type: ResidualWeightConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for  LoadRangeMappingByConfigidSuccess action ', () => {
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
      const action = new LoadRangeMappingByConfigidSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadRangeMappingByConfigidFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new LoadRangeMappingByConfigidFailure(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });

  describe('UpdateRangeMapping Action Test Cases', () => {
    it('should check correct type is used for  UpdateRangeMapping action ', () => {
      const payload: UpdateRangeMappingPayload = {
        data: null,
        id: '111111111'
      };
      const action = new UpdateRangeMapping(payload);
      expect({ ...action }).toEqual({
        type: ResidualWeightConfigActionTypes.UPADTE_RANGE_MAPPING,
        payload
      });
    });
    it('should check correct type is used for  UpdateRangeMappingSuccess action ', () => {
      const payload: RangeMappingResponse = {
        ruleId: 1,
        ruleType: 'AB_RESIDUAL_TOLERANCE_CONFIG',
        rules: []
      };
      const action = new UpdateRangeMappingSuccess(payload);
      expect({ ...action }).toEqual({
        type: ResidualWeightConfigActionTypes.UPADTE_RANGE_MAPPING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateRangeMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new UpdateRangeMappingFailure(payload);
      expect({ ...action }).toEqual({
        type: ResidualWeightConfigActionTypes.UPADTE_RANGE_MAPPING_FAILURE,
        payload
      });
    });
  });
  describe('RemoveRangeMapping Action Test Cases', () => {
    it('should check correct type is used for  UpdateRangeMapping action ', () => {
      const payload: UpdateRangeMappingPayload = {
        data: null,
        id: '111111111'
      };
      const action = new RemoveRangeMapping(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT,
        payload
      });
    });
    it('should check correct type is used for  RemoveRangeMappingSuccess action ', () => {
      const payload = {
        ruleId: 1,
        ruleType: 'AB_RESIDUAL_TOLERANCE_CONFIG',
        rules: []
      };
      const action = new RemoveRangeMappingSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  RemoveRangeMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new RemoveRangeMappingFailure(payload);
      expect({ ...action }).toEqual({
        type:
          ResidualWeightConfigActionTypes.REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT_FAILURE,
        payload
      });
    });
  });
});
