import { AbToleranceConfigState } from './ab-tolerance-config.state';
import { AbToleranceConfigFacade } from './ab-tolerance-config.facade';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import {
  LoadAbToleranceConfigList,
  LoadAbToleranceRangeWeight,
  LoadMetalTypes,
  LoadRangeMappingByConfigId,
  LoadReset,
  LoadSelectedConfigDetails,
  RemoveAbToleranceConfig,
  SaveAbToleranceConfig,
  SearchAbToleranceConfigList,
  UniqueConfigurationNameCheck,
  UpdateAbToleranceConfigIsActive,
  UpdateRangeMapping
} from './ab-tolerance-config.actions';
import {
  AbToleranceConfigDetailsReqPayload,
  AbToleranceConfigResponse,
  ABToleranceUpdateRangeMappingPayload,
  LoadAbToleranceConfigReqPayload,
  SaveAbTolerancePayload
} from '@poss-web/shared/models';

describe(' weightToleranceFacade Testing Suite', () => {
  const initialState: AbToleranceConfigState = {
    abToleranceConfigList: [],
    abToleranceConfig: null,
    toleranceConfigMapping: null,
    totalElements: null,
    isLoading: false,
    configId: null,
    hasSaved: false,
    hasUpdated: false,
    error: null,
    isCleared: false,
    rangeWeight: [],
    metalType: [],
    uniqueNameCheckCount: null,
    ruleDetailsCount: 0
  };

  let abToleranceFacade: AbToleranceConfigFacade;
  let store: MockStore<AbToleranceConfigFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), AbToleranceConfigFacade]
    });
    store = TestBed.inject<any>(Store);
    abToleranceFacade = TestBed.inject<any>(AbToleranceConfigFacade);
  });

  describe('Dispatch AbToleranceConfigFacade Actions', () => {
    it('should call LoadAbToleranceConfigList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadAbToleranceConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        orderType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new LoadAbToleranceConfigList(payload);
      abToleranceFacade.loadAbToleranceConfigList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadAbToleranceConfigList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const action = new UpdateAbToleranceConfigIsActive(payload);
      abToleranceFacade.updateConfigIsActive(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SearchAbToleranceConfigList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: { configName: string; ruleType: string } = {
        configName: 'testconfig',
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new SearchAbToleranceConfigList(payload);
      abToleranceFacade.searchConfigByConfigName(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call saveToleranceConfig action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
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
      abToleranceFacade.saveToleranceConfig(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadReset action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      abToleranceFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadAbTolerancelWeightRanges action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadAbToleranceRangeWeight();
      abToleranceFacade.loadAbTolerancelWeightRanges();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call updateAbTolerance action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '7777777777',
        data: null,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new UpdateRangeMapping(payload);
      abToleranceFacade.updateAbTolerance(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadSelectedConfigDetails action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configId: '1'
      };
      const action = new LoadSelectedConfigDetails(payload);
      abToleranceFacade.loadSelectedConfigDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadAbMappingByConfigId action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: AbToleranceConfigDetailsReqPayload = {
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        configId: '1',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      const action = new LoadRangeMappingByConfigId(payload);
      abToleranceFacade.loadAbMappingByConfigId(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call removeConfiguration action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '55555555555',
        data: null,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new RemoveAbToleranceConfig(payload);
      abToleranceFacade.removeConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadMetalTypes action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadMetalTypes();
      abToleranceFacade.loadMetalTypes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call uniqueConfigNameCheck action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'config test';
      const action = new UniqueConfigurationNameCheck(payload);
      abToleranceFacade.uniqueConfigNameCheck(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getIsloading selector action', () => {
      expect(abToleranceFacade.getIsloading()).toEqual(
        abToleranceFacade['isLoading$']
      );
    });
    it('should access the getHasSaved selector action', () => {
      expect(abToleranceFacade.getHasSaved()).toEqual(
        abToleranceFacade['hasSaved$']
      );
    });
    it('should access the getHasUpdated selector action', () => {
      expect(abToleranceFacade.getHasUpdated()).toEqual(
        abToleranceFacade['hasUpdated$']
      );
    });
    it('should access the getTotalElements selector action', () => {
      expect(abToleranceFacade.getTotalElements()).toEqual(
        abToleranceFacade['totalElements$']
      );
    });
    it('should access the getError selector action', () => {
      expect(abToleranceFacade.getError()).toEqual(abToleranceFacade['error$']);
    });
    it('should access the getAbToleranceConfig selector action', () => {
      expect(abToleranceFacade.getAbToleranceConfig()).toEqual(
        abToleranceFacade['abToleranceConfiguration$']
      );
    });
    it('should access the getWeightRanges selector action', () => {
      expect(abToleranceFacade.getWeightRanges()).toEqual(
        abToleranceFacade['residualWeightRanges$']
      );
    });
    it('should access the getToleranceConfig selector action', () => {
      expect(abToleranceFacade.getToleranceConfig()).toEqual(
        abToleranceFacade['toleranceConfig$']
      );
    });
    it('should access the getConfigId selector action', () => {
      expect(abToleranceFacade.getConfigId()).toEqual(
        abToleranceFacade['configId$']
      );
    });
    it('should access the getUniqueNameCheckCount selector action', () => {
      expect(abToleranceFacade.getUniqueNameCheckCount()).toEqual(
        abToleranceFacade['selectUniqueNameCheckCount$']
      );
    });
    it('should access the getMetalTypes selector action', () => {
      expect(abToleranceFacade.getMetalTypes()).toEqual(
        abToleranceFacade['selectMetalType$']
      );
    });
    it('should access the getRuleDetailsTotalCount selector action', () => {
      expect(abToleranceFacade.getRuleDetailsTotalCount()).toEqual(
        abToleranceFacade['selectRuleDetalsTotalCount$']
      );
    });
    it('should access the getIsCleared selector action', () => {
      expect(abToleranceFacade.getIsCleared()).toEqual(
        abToleranceFacade['isCleared$']
      );
    });
    it('should access the getAbToleranceConfigList selector action', () => {
      expect(abToleranceFacade.getAbToleranceConfigList()).toEqual(
        abToleranceFacade['abToleranceConfigurationList$']
      );
    });
  });
});
