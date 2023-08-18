import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  SaveWeightTolerancePayload,
  WeightToleranceListPayload,
  WeightToleranceList,
  ConfigDetails,
  WeightToleranceResponse,
  UpdateWeightTolerancePayload,
  ProductGroup,
  LoadWeightToleranceByConfigidPayload
} from '@poss-web/shared/models';
import {
  WeightToleranceActionTypes,
  LoadConfigList,
  LoadConfigListSuccess,
  LoadConfigListFailure,
  LoadReset,
  LoadSelectedConfigDetails,
  LoadSelectedConfigDetailsSuccess,
  LoadSelectedConfigDetailsFailure,
  SaveWeightTolerance,
  SaveWeightToleranceSuccess,
  SaveWeightToleranceFailure,
  LoadWeightToleranceByConfigid,
  LoadWeightToleranceByConfigidSuccess,
  LoadWeightToleranceByConfigidFailure,
  UpdateWeightToleranceSuccess,
  UpdateWeightToleranceFailure,
  UpdateWeightTolerance,
  UpdateIsActiveSuccess,
  UpdateIsActiveFailure,
  UpdateIsActive,
  LoadRangeWeightSuccesss,
  LoadRangeWeightFailure,
  LoadRangeWeight,
  RemoveWeightToleranceSuccess,
  RemoveWeightToleranceFailure,
  RemoveWeightTolerance,
  LoadProductGroupMapping,
  LoadProductGroupMappingSuccess,
  LoadProductGroupMappingFailure,
  SearchConfigDetailsByConfigNameSuccess,
  SearchConfigDetailsByConfigNameFailure,
  SearchConfigDetailsByConfigName
} from './weight-tolerance.actions';

describe('WeightTolerance  Action Testing Suite', () => {
  describe('LoadConfigList Action Test Cases', () => {
    it('should check correct type is used for  LoadConfigList action ', () => {
      const payload: WeightToleranceListPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const action = new LoadConfigList(payload);
      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadConfigListSuccess action ', () => {
      const payload: WeightToleranceList = {
        configList: [
          {
            configId: '1',
            configName: 'weight tolerance config'
          }
        ],
        totalElements: 10
      };
      const action = new LoadConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedConfigDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedConfigDetails action ', () => {
      const payload = '1';
      const action = new LoadSelectedConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_SELECTED_CONFIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedConfigDetailsSuccess action ', () => {
      const payload: ConfigDetails = {
        configName: 'weight tolerance config'
      };

      const action = new LoadSelectedConfigDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveWeightTolerance Action Test Cases', () => {
    it('should check correct type is used for  SaveWeightTolerance action ', () => {
      const payload: SaveWeightTolerancePayload = {
        configDetail: {
          description: 'weight tolerance config',
          isActive: true
        },
        weightToleranceRequest: {
          removeProducts: [],

          addProducts: [
            {
              productGroupCode: '76',
              rangeId: '100-200',
              rowId: 1,
              ruleDetails: {
                type: 'WEIGHT_TOLERANCE',
                data: {
                  weightTolGrams: '0.03'
                }
              }
            }
          ]
        }
      };
      const action = new SaveWeightTolerance(payload);
      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.SAVE_WEIGHT_TOLERANCE_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveWeightToleranceSuccess action ', () => {
      const payload = '1';
      const action = new SaveWeightToleranceSuccess(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.SAVE_WEIGHT_TOLERANCE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveWeightToleranceFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveWeightToleranceFailure(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.SAVE_WEIGHT_TOLERANCE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadWeightToleranceByConfigid Action Test Cases', () => {
    it('should check correct type is used for  LoadWeightToleranceByConfigid action ', () => {
      const payload: LoadWeightToleranceByConfigidPayload = {
        pageIndex: 1,
        pageSize: 2,
        configId: '1',
        productGroupCode: '71'
      };
      const action = new LoadWeightToleranceByConfigid(payload);
      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for LoadSeLoadWeightToleranceByConfigidSuccesslectedConfigDetailsSuccess action ', () => {
      const payload: WeightToleranceResponse = {
        weightTolerance: [
          {
            rangeId: '1',
            productGroupCode: '76',
            tolerance: '1',
            id: []
          }
        ],
        totalElements: 10
      };

      const action = new LoadWeightToleranceByConfigidSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          WeightToleranceActionTypes.LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadWeightToleranceByConfigidFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadWeightToleranceByConfigidFailure(payload);

      expect({ ...action }).toEqual({
        type:
          WeightToleranceActionTypes.LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });

  describe('UpdateWeightTolerance Action Test Cases', () => {
    it('should check correct type is used for  UpdateWeightTolerance action ', () => {
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: [],

          addProducts: [
            {
              productGroupCode: '76',
              rangeId: '100-200',
              ruleDetails: {
                type: 'WEIGHT_TOLERANCE',
                data: {
                  weightTolGrams: '0.03'
                }
              }
            }
          ]
        }
      };
      const action = new UpdateWeightTolerance(payload);
      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.UPADTE_WEIGHT_TOLERANCE,
        payload
      });
    });
    it('should check correct type is used for UpdateWeightToleranceSuccess action ', () => {
      const payload: WeightToleranceResponse = {
        weightTolerance: [
          {
            rangeId: '1',
            productGroupCode: '76',
            tolerance: '1',
            id: []
          }
        ],
        totalElements: 10
      };

      const action = new UpdateWeightToleranceSuccess(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.UPADTE_WEIGHT_TOLERANCE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateWeightToleranceFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateWeightToleranceFailure(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.UPADTE_WEIGHT_TOLERANCE_FAILURE,
        payload
      });
    });
  });

  describe('UpdateIsActive Action Test Cases', () => {
    it('should check correct type is used for  UpdateIsActive action ', () => {
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: [],

          addProducts: [],
          isActive: true
        }
      };
      const action = new UpdateIsActive(payload);
      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.UPDATE_IS_ACTIVE,
        payload
      });
    });
    it('should check correct type is used for UpdateIsActiveSuccess action ', () => {
      const payload: WeightToleranceResponse = {
        weightTolerance: [
          {
            rangeId: '1',
            productGroupCode: '76',
            tolerance: '1',
            id: []
          }
        ],
        totalElements: 10
      };

      const action = new UpdateIsActiveSuccess(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.UPDATE_IS_ACTIVE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateIsActiveFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateIsActiveFailure(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.UPDATE_IS_ACTIVE_FAILURE,
        payload
      });
    });
  });

  describe('LoadRangeWeight Action Test Cases', () => {
    it('should check correct type is used for  LoadRangeWeight action ', () => {
      const action = new LoadRangeWeight();
      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_RANGE_WEIGHT
      });
    });
    it('should check correct type is used for LoadRangeWeightSuccesss action ', () => {
      const payload = ['100-200'];

      const action = new LoadRangeWeightSuccesss(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_RANGE_WEIGHT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadRangeWeightFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRangeWeightFailure(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_RANGE_WEIGHT_FAILURE,
        payload
      });
    });
  });

  describe('RemoveWeightTolerance Action Test Cases', () => {
    it('should check correct type is used for  RemoveWeightTolerance action ', () => {
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: ['76'],

          addProducts: []
        }
      };
      const action = new RemoveWeightTolerance(payload);
      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.REMOVE_WEIGHT_TOLERANCE,
        payload
      });
    });
    it('should check correct type is used for RemoveWeightToleranceSuccess action ', () => {
      const payload: WeightToleranceResponse = {
        weightTolerance: [
          {
            rangeId: '1',
            productGroupCode: '76',
            tolerance: '1',
            id: []
          }
        ],
        totalElements: 10
      };

      const action = new RemoveWeightToleranceSuccess(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.REMOVE_WEIGHT_TOLERANCE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  RemoveWeightToleranceFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RemoveWeightToleranceFailure(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.REMOVE_WEIGHT_TOLERANCE_FAILURE,
        payload
      });
    });
  });

  describe('LoadProductGroupMapping Action Test Cases', () => {
    it('should check correct type is used for  LoadProductGroupMapping action ', () => {
      const action = new LoadProductGroupMapping();
      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_PRODUCT_GROUPS
      });
    });
    it('should check correct type is used for LoadProductGroupMappingSuccess action ', () => {
      const payload: ProductGroup[] = [
        {
          description: 'gold coin',
          productGroupCode: '76'
        }
      ];

      const action = new LoadProductGroupMappingSuccess(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadProductGroupMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupMappingFailure(payload);

      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_PRODUCT_GROUPS_FAILURE,
        payload
      });
    });
  });

  describe('SearchConfigDetailsByConfigName Action Test Cases', () => {
    it('should check correct type is used for  SearchConfigDetailsByConfigName action ', () => {
      const payload = 'weight tolerance config';

      const action = new SearchConfigDetailsByConfigName(payload);
      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME,
        payload
      });
    });
    it('should check correct type is used for  SearchConfigDetailsByConfigNameSuccess action ', () => {
      const payload: WeightToleranceList = {
        configList: [
          {
            configId: '1',
            configName: 'weight tolerance config'
          }
        ],
        totalElements: 10
      };
      const action = new SearchConfigDetailsByConfigNameSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          WeightToleranceActionTypes.SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME_SUCCESS,
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
          WeightToleranceActionTypes.SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME_FAILURE,
        payload
      });
    });
  });
  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: WeightToleranceActionTypes.LOAD_RESET
      });
    });
  });
});
