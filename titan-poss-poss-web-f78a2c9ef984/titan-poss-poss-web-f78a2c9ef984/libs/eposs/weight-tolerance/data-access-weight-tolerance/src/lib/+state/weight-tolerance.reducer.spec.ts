//you should simply assert that you get the right state given the provided inputs.

import * as actions from './weight-tolerance.actions';

import {
  SaveWeightTolerancePayload,
  WeightToleranceList,
  WeightToleranceListPayload,
  ConfigDetails,
  WeightToleranceResponse,
  UpdateWeightTolerancePayload,
  ProductGroup,
  LoadWeightToleranceByConfigidPayload,
  WeightTolerance
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  weightToleranceReducer,
  initialState
} from './weight-tolerance.reducer';
import { WeightToleranceState } from './weight-tolerances.state';

describe('weightToleranceReducer reducer Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadConfigList ', () => {
    beforeEach(() => {});
    it('Load LoadConfigList should set the isLoading to true', () => {
      const payload: WeightToleranceListPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const action = new actions.LoadConfigList(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadConfigListSuccess should return list of config list', () => {
      const payload: WeightToleranceList = {
        configList: [
          {
            configId: '1',
            configName: 'weight tolerance config'
          }
        ],
        totalElements: 10
      };

      const action = new actions.LoadConfigListSuccess(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.configList.length).toBe(1);
    });
    it('LoadConfigListFailure should return error', () => {
      const action = new actions.LoadConfigListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightToleranceState = weightToleranceReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadSelectedConfigDetails Functionality ', () => {
    beforeEach(() => {});
    it('LoadSelectedConfigDetails should set isLoading true ', () => {
      const payload = '1';
      const action = new actions.LoadSelectedConfigDetails(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadSelectedConfigDetailsSuccess should return selected config details', () => {
      const payload: ConfigDetails = {
        configName: 'weight tolerance config'
      };
      const action = new actions.LoadSelectedConfigDetailsSuccess(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.selectedConfigIdDetails).toEqual(payload);
    });
    it('LoadSelectedConfigDetailsFailure should return error', () => {
      const action = new actions.LoadSelectedConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightToleranceState = weightToleranceReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveWeightTolerance ', () => {
    beforeEach(() => {});
    it('SaveWeightTolerance  should set isLoading true', () => {
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
      const action = new actions.SaveWeightTolerance(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SaveWeightToleranceSuccess should return the config Id', () => {
      const payload = '1';
      const action = new actions.SaveWeightToleranceSuccess(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.configId).toEqual('1');

      expect(result.isLoading).toBe(false);
    });
    it('SaveWeightToleranceFailure should return error', () => {
      const action = new actions.SaveWeightToleranceFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadWeightToleranceByConfigid ', () => {
    beforeEach(() => {});
    it('LoadWeightToleranceByConfigid should set the isloading true', () => {
      const payload: LoadWeightToleranceByConfigidPayload = {
        pageIndex: 1,
        pageSize: 2,
        configId: '1',
        productGroupCode: '71'
      };
      const action = new actions.LoadWeightToleranceByConfigid(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadWeightToleranceByConfigidSuccess should return the location deatails', () => {
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
      const action = new actions.LoadWeightToleranceByConfigidSuccess(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,

        action
      );

      expect(result.weightTolerance).toBe(payload.weightTolerance);
      expect(result.isLoading).toBe(false);
    });
    it('LoadWeightToleranceByConfigidFailure should return error', () => {
      const action = new actions.LoadWeightToleranceByConfigidFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateWeightTolerance Functionality ', () => {
    beforeEach(() => {});
    it('UpdateWeightTolerance should set hasUpdated false', () => {
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
      const action = new actions.UpdateWeightTolerance(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateWeightToleranceSuccess should set hasupdated false', () => {
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

      const action = new actions.UpdateWeightToleranceSuccess(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('UpdateWeightToleranceFailure should return error', () => {
      const action = new actions.UpdateWeightToleranceFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateIsActive Functionality ', () => {
    beforeEach(() => {});
    it('UpdateIsActive should set hasUpdated false', () => {
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: [],

          addProducts: [],
          isActive: true
        }
      };
      const action = new actions.UpdateIsActive(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });

    it('UpdateIsActiveSuccess should set hasUpdated true', () => {
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
      const action = new actions.UpdateIsActiveSuccess(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateIsActiveFailure should return error', () => {
      const action = new actions.UpdateIsActiveFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadRangeWeight Functionality ', () => {
    beforeEach(() => {});
    it('LoadRangeWeight should set isLoading true', () => {
      const action = new actions.LoadRangeWeight();

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadRangeWeightSuccess should set isLoading false', () => {
      const payload = ['100-200'];

      const action = new actions.LoadRangeWeightSuccesss(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
    });
    it('LoadRangeWeightFailure should return error', () => {
      const action = new actions.LoadRangeWeightFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing RemoveWeightTolerance Functionality ', () => {
    beforeEach(() => {});
    it('RemoveWeightTolerance should remove the tolerance', () => {
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: ['76'],

          addProducts: []
        }
      };
      const action = new actions.RemoveWeightTolerance(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.isCleared).toBe(false);
    });
    it('RemoveWeightToleranceSuccess should should remove the tolerance', () => {
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

      const action = new actions.RemoveWeightToleranceSuccess(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.isCleared).toBe(true);
    });
    it('RemoveWeightToleranceFailure should return error', () => {
      const action = new actions.RemoveWeightToleranceFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadProductGroupMapping Functionality ', () => {
    beforeEach(() => {});
    it('LoadProductGroupMapping should return product group', () => {
      const action = new actions.LoadProductGroupMapping();

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadProductGroupMappingSuccess  return product group', () => {
      const payload: ProductGroup[] = [
        {
          description: 'gold coin',
          productGroupCode: '76'
        }
      ];

      const action = new actions.LoadProductGroupMappingSuccess(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.productGroups).toBe(payload);
    });
    it('LoadProductGroupMappingFailure should return error', () => {
      const action = new actions.LoadProductGroupMappingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchConfigDetailsByConfigName Functionality ', () => {
    beforeEach(() => {});
    it('SearchConfigDetailsByConfigName should return searched config', () => {
      const payload = 'weight tolerance config';
      const action = new actions.SearchConfigDetailsByConfigName(payload);

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SearchConfigDetailsByConfigNameSuccess should return searched config', () => {
      const weightToleranceList: WeightToleranceList = {
        configList: [
          {
            configName: 'weight tolerance config'
          }
        ],
        totalElements: 10
      };
      const payload: ConfigDetails[] = [
        {
          configName: 'weight tolerance config'
        }
      ];

      const action = new actions.SearchConfigDetailsByConfigNameSuccess(
        weightToleranceList
      );

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.configList).toEqual(payload);
    });
    it('SearchConfigDetailsByConfigNameFailure should return error', () => {
      const action = new actions.SearchConfigDetailsByConfigNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadReset Functionality ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the state', () => {
      const action = new actions.LoadReset();

      const result: WeightToleranceState = weightToleranceReducer(
        initialState,
        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
