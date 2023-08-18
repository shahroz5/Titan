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
  BgrToleranceConfigActionTypes,
  LoadBgrToleranceConfigList,
  LoadBgrToleranceConfigListFailure,
  LoadBgrToleranceConfigListSuccess,
  LoadBgrToleranceRangeWeight,
  LoadBgrToleranceRangeWeightFailure,
  LoadBgrToleranceRangeWeightSuccess,
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
  RemoveBgrToleranceConfig,
  RemoveBgrToleranceConfigFailure,
  RemoveBgrToleranceConfigSuccess,
  SaveBgrToleranceConfig,
  SaveBgrToleranceConfigFailure,
  SaveBgrToleranceConfigSuccess,
  SearchBgrToleranceConfigList,
  SearchBgrToleranceConfigListFailure,
  SearchBgrToleranceConfigListSuccess,
  UpdateBgrToleranceConfigIsActive,
  UpdateBgrToleranceConfigIsActiveFailure,
  UpdateBgrToleranceConfigIsActiveSuccess,
  UpdateRangeMapping,
  UpdateRangeMappingFailure,
  UpdateRangeMappingSuccess
} from './bgr-tolerance-config.actions';

describe('BGR Tolerance Action Testing Suite', () => {
  describe('LoadBgrToleranceConfigList Action Test Cases', () => {
    it('should check correct type is used for  LoadConfigList action ', () => {
      const payload: LoadAbToleranceConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        orderType: 'ORDER_BGR_TOLERANCE'
      };
      const action = new LoadBgrToleranceConfigList(payload);
      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadBgrToleranceConfigListSuccess action ', () => {
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
      const action = new LoadBgrToleranceConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadBgrToleranceConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBgrToleranceConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SearchBgrToleranceConfigList Action Test Cases', () => {
    it('should check correct type is used for  SearchBgrToleranceConfigList action ', () => {
      const payload: { configName: string; ruleType: string } = {
        configName: 'testconfig',
        ruleType: 'ORDER_BGR_TOLERANCE'
      };
      const action = new SearchBgrToleranceConfigList('');
      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.SEARCH_BGR_TOLERANCE_CONFIG_LIST,
        payload: ''
      });
    });
    it('should check correct type is used for  SearchBgrToleranceConfigListSuccess action ', () => {
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
      const action = new SearchBgrToleranceConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          BgrToleranceConfigActionTypes.SEARCH_BGR_TOLERANCE_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchBgrToleranceConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchBgrToleranceConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          BgrToleranceConfigActionTypes.SEARCH_BGR_TOLERANCE_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  describe('UpdateBgrToleranceConfigIsActive Action Test Cases', () => {
    it('should check correct type is used for  UpdateBgrToleranceConfigIsActive action ', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const action = new UpdateBgrToleranceConfigIsActive(payload);
      expect({ ...action }).toEqual({
        type:
          BgrToleranceConfigActionTypes.UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE,
        payload
      });
    });
    it('should check correct type is used for UpdateIsActiveSuccess action ', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };

      const action = new UpdateBgrToleranceConfigIsActiveSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          BgrToleranceConfigActionTypes.UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateBgrToleranceConfigIsActiveFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateBgrToleranceConfigIsActiveFailure(payload);

      expect({ ...action }).toEqual({
        type:
          BgrToleranceConfigActionTypes.UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE,
        payload
      });
    });
  });

  describe('SaveBgrToleranceConfig Action Test Cases', () => {
    it('should check correct type is used for  SaveBgrToleranceConfig action ', () => {
      const payload: SaveAbTolerancePayload = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        configDetail: {
          ruleDetails: {},
          description: 'testconfig',
          isActive: true
        },
        residualTolerance: null
      };
      const action = new SaveBgrToleranceConfig(payload);
      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.SAVE_BGR_TOLERANCE_CONFIG,
        payload
      });
    });
    it('should check correct type is used for SaveBgrToleranceConfigSuccess action ', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };

      const action = new SaveBgrToleranceConfigSuccess(payload);

      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.SAVE_BGR_TOLERANCE_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveAbToleranceConfigFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveBgrToleranceConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.SAVE_BGR_TOLERANCE_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedConfigDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedConfigDetails action ', () => {
      const payload: { configId: string; ruleType: string } = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        configId: '1'
      };
      const action = new LoadSelectedConfigDetails('');
      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS,
        payload: ''
      });
    });
    it('should check correct type is used for LoadSelectedConfigDetailsSuccess action ', () => {
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      };

      const action = new LoadSelectedConfigDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          BgrToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedConfigDetailsFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          BgrToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadRangeMappingByConfigId Action Test Cases', () => {
    it('should check correct type is used for  LoadRangeMappingByConfigId action ', () => {
      const payload: AbToleranceConfigDetailsReqPayload = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        configId: '1',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      const action = new LoadRangeMappingByConfigId('');
      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID,
        payload: ''
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
              type: 'ORDER_BGR_TOLERANCE'
            }
          }
        ]
      };

      const action = new LoadRangeMappingByConfigIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          BgrToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS,
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
          BgrToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });

  describe('UpdateRangeMapping Action Test Cases', () => {
    it('should check correct type is used for  UpdateRangeMapping action ', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '7777777777',
        data: null,
        ruleType: 'ORDER_BGR_TOLERANCE'
      };
      const action = new UpdateRangeMapping(payload);
      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.UPADTE_RANGE_MAPPING,
        payload
      });
    });
    it('should check correct type is used for UpdateRangeMappingSuccess action ', () => {
      const payload: AbToleranceRangeMappingResponse = {
        ruleId: 101,
        ruleType: 'ORDER_BGR_TOLERANCE',
        rules: [
          {
            id: '11111',
            rangeId: '222222',
            ruleDetails: {
              data: null,
              type: 'BGR_TOLERANCE'
            }
          }
        ]
      };

      const action = new UpdateRangeMappingSuccess(payload);

      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateRangeMappingFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateRangeMappingFailure(payload);

      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_FAILURE,
        payload
      });
    });
  });

  describe('LoadMetalTypes Action Test Cases', () => {
    it('should check correct type is used for  LoadMetalTypes action ', () => {
      const action = new LoadMetalTypes();
      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.LOAD_METAL_TYPES
      });
    });
    it('should check correct type is used for LoadMetalTypesSuccess action ', () => {
      const payload: AbToleranceConfigMetalType[] = [
        { materialTypeCode: 'J', description: 'GOLD' }
      ];

      const action = new LoadMetalTypesSuccess(payload);

      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.LOAD_METAL_TYPES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadMetalTypesFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMetalTypesFailure(payload);

      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.LOAD_METAL_TYPES_FAILURE,
        payload
      });
    });
  });
  describe('RemoveBgrToleranceConfig Action Test Cases', () => {
    it('should check correct type is used for  RemoveAbToleranceConfig action ', () => {
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '55555555555',
        data: null,
        ruleType: 'ORDER_BGR_TOLERANCE'
      };
      const action = new RemoveBgrToleranceConfig(payload);
      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.REMOVE_BGR_TOLERANCE_CONFIG,
        payload
      });
    });
    it('should check correct type is used for RemoveBgrToleranceConfigSuccess action ', () => {
      const payload = null;
      const action = new RemoveBgrToleranceConfigSuccess(payload);

      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.REMOVE_BGR_TOLERANCE_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for RemoveBgrToleranceConfigFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RemoveBgrToleranceConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.REMOVE_BGR_TOLERANCE_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.LOAD_RESET
      });
    });
  });

  describe('LoadBgrToleranceRangeWeight Action Test Cases', () => {
    it('should check correct type is used for  LoadAbToleranceRangeWeight action ', () => {
      const action = new LoadBgrToleranceRangeWeight();
      expect({ ...action }).toEqual({
        type: BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_RANGE_WEIGHT
      });
    });
    it('should check correct type is used for RemoveBgrToleranceConfigSuccess action ', () => {
      const payload: AbToleranceWeightRange[] = [
        { range: '0-10', id: '851B2408', rowId: 3 }
      ];
      const action = new LoadBgrToleranceRangeWeightSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_RANGE_WEIGHT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for RemoveAbToleranceConfigFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBgrToleranceRangeWeightFailure(payload);

      expect({ ...action }).toEqual({
        type:
          BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_RANGE_WEIGHT_FAILURE,
        payload
      });
    });
  });
});
