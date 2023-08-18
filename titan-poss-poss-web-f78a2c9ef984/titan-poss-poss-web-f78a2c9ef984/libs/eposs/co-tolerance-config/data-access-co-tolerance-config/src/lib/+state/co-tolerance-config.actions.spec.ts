import {
  CoToleranceConfigDetailsReqPayload,
  CoToleranceConfigDetailsResPayload,
  CoToleranceConfigMetalType,
  CoToleranceConfigResponse,
  CoToleranceRangeMappingResponse,
  COToleranceUpdateRangeMappingPayload,
  CoToleranceWeightRange,
  CustomErrors,
  LoadCoToleranceConfigReqPayload,
  SaveCoTolerancePayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CoToleranceConfigActionTypes,
  LoadCoToleranceConfigList,
  LoadCoToleranceConfigListFailure,
  LoadCoToleranceConfigListSuccess,
  LoadCoToleranceRangeWeight,
  LoadCoToleranceRangeWeightFailure,
  LoadCoToleranceRangeWeightSuccess,
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
  RemoveCoToleranceConfig,
  RemoveCoToleranceConfigFailure,
  RemoveCoToleranceConfigSuccess,
  SaveCoToleranceConfig,
  SaveCoToleranceConfigFailure,
  SaveCoToleranceConfigSuccess,
  SearchCoToleranceConfigList,
  SearchCoToleranceConfigListFailure,
  SearchCoToleranceConfigListSuccess,
  UniqueConfigurationNameCheck,
  UniqueConfigurationNameCheckFailure,
  UniqueConfigurationNameCheckSuccess,
  UpdateCoToleranceConfigIsActive,
  UpdateCoToleranceConfigIsActiveFailure,
  UpdateCoToleranceConfigIsActiveSuccess,
  UpdateRangeMapping,
  UpdateRangeMappingFailure,
  UpdateRangeMappingSuccess
} from './co-tolerance-config.actions';

describe('CO Tokerance Action Testing Suite', () => {
  describe('LoadCoToleranceConfigList Action Test Cases', () => {
    it('should check correct type is used for  LoadConfigList action ', () => {
      const payload: LoadCoToleranceConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        orderType: 'ORDER_CO_FROZEN_TOLERANCE'
      };
      const action = new LoadCoToleranceConfigList(payload);
      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadCoToleranceConfigListSuccess action ', () => {
      const payload: {
        data: CoToleranceConfigResponse[];
        totalElements: number;
      } = {
        totalElements: 10,
        data: [
          {
            ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
            ruleId: 1,
            description: 'testconfig',
            isActive: true
          }
        ]
      };
      const action = new LoadCoToleranceConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCoToleranceConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCoToleranceConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SearchCoToleranceConfigList Action Test Cases', () => {
    it('should check correct type is used for  SearchCoToleranceConfigList action ', () => {
      const payload: { configName: string; ruleType: string } = {
        configName: 'testconfig',
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE'
      };
      const action = new SearchCoToleranceConfigList(payload);
      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.SEARCH_CO_TOLERANCE_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for  SearchCoToleranceConfigListSuccess action ', () => {
      const payload: {
        data: CoToleranceConfigResponse[];
        totalElements: number;
      } = {
        totalElements: 1,
        data: [
          {
            ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
            ruleId: 1,
            description: 'testconfig',
            isActive: true
          }
        ]
      };
      const action = new SearchCoToleranceConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CoToleranceConfigActionTypes.SEARCH_CO_TOLERANCE_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchCoToleranceConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCoToleranceConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CoToleranceConfigActionTypes.SEARCH_CO_TOLERANCE_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  describe('UpdateCoToleranceConfigIsActive Action Test Cases', () => {
    it('should check correct type is used for  UpdateCoToleranceConfigIsActive action ', () => {
      const payload: CoToleranceConfigResponse = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const action = new UpdateCoToleranceConfigIsActive(payload);
      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.UPADTE_CO_TOLERANCE_CONFIG_IS_ACTIVE,
        payload
      });
    });
    it('should check correct type is used for UpdateIsActiveSuccess action ', () => {
      const payload: CoToleranceConfigResponse = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };

      const action = new UpdateCoToleranceConfigIsActiveSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CoToleranceConfigActionTypes.UPADTE_CO_TOLERANCE_CONFIG_IS_ACTIVE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateCoToleranceConfigIsActiveFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCoToleranceConfigIsActiveFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CoToleranceConfigActionTypes.UPADTE_CO_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE,
        payload
      });
    });
  });

  describe('SaveCoToleranceConfig Action Test Cases', () => {
    it('should check correct type is used for  SaveCoToleranceConfig action ', () => {
      const payload: SaveCoTolerancePayload = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        configDetail: {
          ruleDetails: {},
          description: 'testconfig',
          isActive: true
        },
        residualTolerance: null
      };
      const action = new SaveCoToleranceConfig(payload);
      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.SAVE_CO_TOLERANCE_CONFIG,
        payload
      });
    });
    it('should check correct type is used for SaveCoToleranceConfigSuccess action ', () => {
      const payload: CoToleranceConfigResponse = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };

      const action = new SaveCoToleranceConfigSuccess(payload);

      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.SAVE_CO_TOLERANCE_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveCoToleranceConfigFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCoToleranceConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.SAVE_CO_TOLERANCE_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedConfigDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedConfigDetails action ', () => {
      const payload: { configId: string; ruleType: string } = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        configId: '1'
      };
      const action = new LoadSelectedConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedConfigDetailsSuccess action ', () => {
      const payload: CoToleranceConfigResponse = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };

      const action = new LoadSelectedConfigDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CoToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedConfigDetailsFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadRangeMappingByConfigId Action Test Cases', () => {
    it('should check correct type is used for  LoadRangeMappingByConfigId action ', () => {
      const payload: CoToleranceConfigDetailsReqPayload = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        configId: '1',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      const action = new LoadRangeMappingByConfigId(payload);
      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for LoadRangeMappingByConfigIdSuccess action ', () => {
      const payload: CoToleranceConfigDetailsResPayload = {
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
              type: 'ORDER_CO_FROZEN_TOLERANCE'
            }
          }
        ]
      };

      const action = new LoadRangeMappingByConfigIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CoToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS,
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
          CoToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });

  describe('UpdateRangeMapping Action Test Cases', () => {
    it('should check correct type is used for  UpdateRangeMapping action ', () => {
      const payload: COToleranceUpdateRangeMappingPayload = {
        id: '7777777777',
        data: null,
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE'
      };
      const action = new UpdateRangeMapping(payload);
      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.UPADTE_RANGE_MAPPING,
        payload
      });
    });
    it('should check correct type is used for UpdateRangeMappingSuccess action ', () => {
      const payload: CoToleranceRangeMappingResponse = {
        ruleId: 101,
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        rules: [
          {
            id: '11111',
            rangeId: '222222',
            ruleDetails: {
              data: null,
              type: 'CO_TOLERANCE'
            }
          }
        ]
      };

      const action = new UpdateRangeMappingSuccess(payload);

      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateRangeMappingFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateRangeMappingFailure(payload);

      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_FAILURE,
        payload
      });
    });
  });

  describe('LoadMetalTypes Action Test Cases', () => {
    it('should check correct type is used for  LoadMetalTypes action ', () => {
      const action = new LoadMetalTypes();
      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.LOAD_METAL_TYPES
      });
    });
    it('should check correct type is used for LoadMetalTypesSuccess action ', () => {
      const payload: CoToleranceConfigMetalType[] = [
        { materialTypeCode: 'J', description: 'GOLD' }
      ];

      const action = new LoadMetalTypesSuccess(payload);

      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.LOAD_METAL_TYPES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadMetalTypesFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMetalTypesFailure(payload);

      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.LOAD_METAL_TYPES_FAILURE,
        payload
      });
    });
  });
  describe('RemoveCoToleranceConfig Action Test Cases', () => {
    it('should check correct type is used for  RemoveCoToleranceConfig action ', () => {
      const payload: COToleranceUpdateRangeMappingPayload = {
        id: '55555555555',
        data: null,
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE'
      };
      const action = new RemoveCoToleranceConfig(payload);
      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.REMOVE_CO_TOLERANCE_CONFIG,
        payload
      });
    });
    it('should check correct type is used for RemoveCoToleranceConfigSuccess action ', () => {
      const payload = null;
      const action = new RemoveCoToleranceConfigSuccess(payload);

      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.REMOVE_CO_TOLERANCE_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for RemoveCoToleranceConfigFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RemoveCoToleranceConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.REMOVE_CO_TOLERANCE_CONFIG_FAILURE,
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
          CoToleranceConfigActionTypes.CO_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK,
        payload
      });
    });
    it('should check correct type is used for UniqueConfigurationNameCheckSuccess action ', () => {
      const payload = 1;
      const action = new UniqueConfigurationNameCheckSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CoToleranceConfigActionTypes.CO_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_SUCCESS,
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
          CoToleranceConfigActionTypes.CO_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_FAILURE,
        payload
      });
    });
  });
  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.LOAD_RESET
      });
    });
  });

  describe('LoadCoToleranceRangeWeight Action Test Cases', () => {
    it('should check correct type is used for  LoadCoToleranceRangeWeight action ', () => {
      const action = new LoadCoToleranceRangeWeight();
      expect({ ...action }).toEqual({
        type: CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_RANGE_WEIGHT
      });
    });
    it('should check correct type is used for RemoveCoToleranceConfigSuccess action ', () => {
      const payload: CoToleranceWeightRange[] = [
        { range: '0-10', id: '851B2408', rowId: 3 }
      ];
      const action = new LoadCoToleranceRangeWeightSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_RANGE_WEIGHT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for RemoveCoToleranceConfigFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCoToleranceRangeWeightFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_RANGE_WEIGHT_FAILURE,
        payload
      });
    });
  });
});
