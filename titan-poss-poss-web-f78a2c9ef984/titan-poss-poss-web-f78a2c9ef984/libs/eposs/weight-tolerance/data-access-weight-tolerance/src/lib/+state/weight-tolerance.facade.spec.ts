import {
  SaveWeightTolerancePayload,
  UpdateWeightTolerancePayload,
  WeightToleranceListPayload,
  LoadWeightToleranceByConfigidPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { WeightToleranceFacade } from './weight-tolerance.facade';

import {
  LoadConfigList,
  LoadSelectedConfigDetails,
  SaveWeightTolerance,
  LoadWeightToleranceByConfigid,
  UpdateWeightTolerance,
  UpdateIsActive,
  LoadRangeWeight,
  RemoveWeightTolerance,
  SearchConfigDetailsByConfigName,
  LoadReset,
  LoadProductGroupMapping
} from './weight-tolerance.actions';
import { WeightToleranceState } from './weight-tolerances.state';

describe(' weightToleranceFacade Testing Suite', () => {
  const initialState: WeightToleranceState = {
    configList: [],

    weightTolerance: [],
    totalElements: null,
    selectedConfigIdDetails: null,
    rangeWeight: [],
    isLoading: null,
    hasSaved: null,
    error: null,
    hasUpdated: null,
    configId: null,
    isCleared: null,
    productGroups: []
  };

  let weightToleranceFacade: WeightToleranceFacade;
  let store: MockStore<WeightToleranceFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), WeightToleranceFacade]
    });
    store = TestBed.inject<any>(Store);
    weightToleranceFacade = TestBed.inject<any>(WeightToleranceFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_CONFIG_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: WeightToleranceListPayload = {
        pageIndex: 1,
        pageSize: 10
      };
      const action = new LoadConfigList(payload);
      weightToleranceFacade.loadConfigList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_SELECTED_CONFIG_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadSelectedConfigDetails(payload);
      weightToleranceFacade.loadSelectedConfigDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_WEIGHT_TOLERANCE_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
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
      weightToleranceFacade.saveWeightTolerance(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadWeightToleranceByConfigidPayload = {
        pageIndex: 1,
        pageSize: 2,
        configId: '1',
        productGroupCode: '71'
      };
      const action = new LoadWeightToleranceByConfigid(payload);
      weightToleranceFacade.loadWeightToleranceByConfigId(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPADTE_WEIGHT_TOLERANCE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
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
      weightToleranceFacade.updateWeightTolerance(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_IS_ACTIVE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: [],

          addProducts: [],
          isActive: true
        }
      };
      const action = new UpdateIsActive(payload);
      weightToleranceFacade.updateIsActive(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RANGE_WEIGHT action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadRangeWeight();
      weightToleranceFacade.loadRangeWeight();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call REMOVE_WEIGHT_TOLERANCE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateWeightTolerancePayload = {
        id: '1',
        data: {
          removeProducts: ['76'],

          addProducts: []
        }
      };
      const action = new RemoveWeightTolerance(payload);
      weightToleranceFacade.removeWeightTolerance(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PRODUCT_GROUPS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '';
      const action = new LoadProductGroupMapping();
      weightToleranceFacade.loadProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'weight tolerance config';

      const action = new SearchConfigDetailsByConfigName(payload);
      weightToleranceFacade.searchConfigDetailsByConfigName(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      weightToleranceFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getIsloading selector action', () => {
      expect(weightToleranceFacade.getIsloading()).toEqual(
        weightToleranceFacade['isLoading$']
      );
    });

    it('should access the getConfigList selector action', () => {
      expect(weightToleranceFacade.getConfigList()).toEqual(
        weightToleranceFacade['configList$']
      );
    });

    it('should access the getTotalElements selector action', () => {
      expect(weightToleranceFacade.getTotalElements()).toEqual(
        weightToleranceFacade['totalElements$']
      );
    });

    it('should access the getSelectedConfigDetails selector action', () => {
      expect(weightToleranceFacade.getSelectedConfigDetails()).toEqual(
        weightToleranceFacade['selectedConfigDetails$']
      );
    });

    it('should access the getWeightToleranceByConfigId selector action', () => {
      expect(weightToleranceFacade.getWeightToleranceByConfigId()).toEqual(
        weightToleranceFacade['selectWeightTolerance$']
      );
    });

    it('should access the getRangeWeight selector action', () => {
      expect(weightToleranceFacade.getRangeWeight()).toEqual(
        weightToleranceFacade['selectRangeWeight$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(weightToleranceFacade.getHasSaved()).toEqual(
        weightToleranceFacade['selectHasSaved$']
      );
    });

    it('should access the getIsUpdated selector action', () => {
      expect(weightToleranceFacade.getIsUpdated()).toEqual(
        weightToleranceFacade['selectIsupdated$']
      );
    });

    it('should access the getProductGroups selector action', () => {
      expect(weightToleranceFacade.getProductGroups()).toEqual(
        weightToleranceFacade['productGroups$']
      );
    });

    it('should access the getError selector action', () => {
      expect(weightToleranceFacade.getError()).toEqual(
        weightToleranceFacade['selectError$']
      );
    });

    it('should access the getIsLoading selector action', () => {
      expect(weightToleranceFacade.getIsLoading()).toEqual(
        weightToleranceFacade['isLoading$']
      );
    });
    it('should access the getError selector action', () => {
      expect(weightToleranceFacade.getError()).toEqual(
        weightToleranceFacade['selectError$']
      );
    });
    it('should access the getConfigId selector action', () => {
      expect(weightToleranceFacade.getConfigId()).toEqual(
        weightToleranceFacade['selectConfigId$']
      );
    });
    it('should access the getIsCleared selector action', () => {
      expect(weightToleranceFacade.getIsCleared()).toEqual(
        weightToleranceFacade['isCleared$']
      );
    });
  });
});
