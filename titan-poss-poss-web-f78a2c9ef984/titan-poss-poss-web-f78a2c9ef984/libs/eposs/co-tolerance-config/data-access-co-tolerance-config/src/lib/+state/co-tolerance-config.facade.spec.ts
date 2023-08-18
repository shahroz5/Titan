import { CoToleranceConfigState } from './co-tolerance-config.state';
import { CoToleranceConfigFacade } from './co-tolerance-config.facade';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import {
  LoadCoToleranceConfigList,
  LoadCoToleranceRangeWeight,
  LoadMetalTypes,
  LoadRangeMappingByConfigId,
  LoadReset,
  LoadSelectedConfigDetails,
  RemoveCoToleranceConfig,
  SaveCoToleranceConfig,
  SearchCoToleranceConfigList,
  UniqueConfigurationNameCheck,
  UpdateCoToleranceConfigIsActive,
  UpdateRangeMapping
} from './co-tolerance-config.actions';
import {
  CoToleranceConfigDetailsReqPayload,
  CoToleranceConfigResponse,
  COToleranceUpdateRangeMappingPayload,
  LoadCoToleranceConfigReqPayload,
  SaveCoTolerancePayload
} from '@poss-web/shared/models';

describe(' weightToleranceFacade Testing Suite', () => {
  const initialState: CoToleranceConfigState = {
    coToleranceConfigList: [],
    coToleranceConfig: null,
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

  let coToleranceFacade: CoToleranceConfigFacade;
  let store: MockStore<CoToleranceConfigFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CoToleranceConfigFacade]
    });
    store = TestBed.inject<any>(Store);
    coToleranceFacade = TestBed.inject<any>(CoToleranceConfigFacade);
  });

  describe('Dispatch CoToleranceConfigFacade Actions', () => {
    it('should call LoadCoToleranceConfigList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadCoToleranceConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        orderType: 'ORDER_CO_FROZEN_TOLERANCE'
      };
      const action = new LoadCoToleranceConfigList(payload);
      coToleranceFacade.loadCoToleranceConfigList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadCoToleranceConfigList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: CoToleranceConfigResponse = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const action = new UpdateCoToleranceConfigIsActive(payload);
      coToleranceFacade.updateConfigIsActive(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SearchCoToleranceConfigList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: { configName: string; ruleType: string } = {
        configName: 'testconfig',
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE'
      };
      const action = new SearchCoToleranceConfigList(payload);
      coToleranceFacade.searchConfigByConfigName(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call saveToleranceConfig action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
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
      coToleranceFacade.saveToleranceConfig(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadReset action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      coToleranceFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadCoTolerancelWeightRanges action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadCoToleranceRangeWeight();
      coToleranceFacade.loadCoTolerancelWeightRanges();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call updateCoTolerance action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: COToleranceUpdateRangeMappingPayload = {
        id: '7777777777',
        data: null,
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE'
      };
      const action = new UpdateRangeMapping(payload);
      coToleranceFacade.updateCoTolerance(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadSelectedConfigDetails action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        configId: '1'
      };
      const action = new LoadSelectedConfigDetails(payload);
      coToleranceFacade.loadSelectedConfigDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadCoMappingByConfigId action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: CoToleranceConfigDetailsReqPayload = {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        configId: '1',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      const action = new LoadRangeMappingByConfigId(payload);
      coToleranceFacade.loadCoMappingByConfigId(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call removeConfiguration action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: COToleranceUpdateRangeMappingPayload = {
        id: '55555555555',
        data: null,
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE'
      };
      const action = new RemoveCoToleranceConfig(payload);
      coToleranceFacade.removeConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadMetalTypes action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadMetalTypes();
      coToleranceFacade.loadMetalTypes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call uniqueConfigNameCheck action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'config test';
      const action = new UniqueConfigurationNameCheck(payload);
      coToleranceFacade.uniqueConfigNameCheck(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getIsloading selector action', () => {
      expect(coToleranceFacade.getIsloading()).toEqual(
        coToleranceFacade['isLoading$']
      );
    });
    it('should access the getHasSaved selector action', () => {
      expect(coToleranceFacade.getHasSaved()).toEqual(
        coToleranceFacade['hasSaved$']
      );
    });
    it('should access the getHasUpdated selector action', () => {
      expect(coToleranceFacade.getHasUpdated()).toEqual(
        coToleranceFacade['hasUpdated$']
      );
    });
    it('should access the getTotalElements selector action', () => {
      expect(coToleranceFacade.getTotalElements()).toEqual(
        coToleranceFacade['totalElements$']
      );
    });
    it('should access the getError selector action', () => {
      expect(coToleranceFacade.getError()).toEqual(coToleranceFacade['error$']);
    });
    it('should access the getCoToleranceConfig selector action', () => {
      expect(coToleranceFacade.getCoToleranceConfig()).toEqual(
        coToleranceFacade['coToleranceConfiguration$']
      );
    });
    it('should access the getWeightRanges selector action', () => {
      expect(coToleranceFacade.getWeightRanges()).toEqual(
        coToleranceFacade['residualWeightRanges$']
      );
    });
    it('should access the getToleranceConfig selector action', () => {
      expect(coToleranceFacade.getToleranceConfig()).toEqual(
        coToleranceFacade['toleranceConfig$']
      );
    });
    it('should access the getConfigId selector action', () => {
      expect(coToleranceFacade.getConfigId()).toEqual(
        coToleranceFacade['configId$']
      );
    });
    it('should access the getUniqueNameCheckCount selector action', () => {
      expect(coToleranceFacade.getUniqueNameCheckCount()).toEqual(
        coToleranceFacade['selectUniqueNameCheckCount$']
      );
    });
    it('should access the getMetalTypes selector action', () => {
      expect(coToleranceFacade.getMetalTypes()).toEqual(
        coToleranceFacade['selectMetalType$']
      );
    });
    it('should access the getRuleDetailsTotalCount selector action', () => {
      expect(coToleranceFacade.getRuleDetailsTotalCount()).toEqual(
        coToleranceFacade['selectRuleDetalsTotalCount$']
      );
    });
    it('should access the getIsCleared selector action', () => {
      expect(coToleranceFacade.getIsCleared()).toEqual(
        coToleranceFacade['isCleared$']
      );
    });
    it('should access the getCoToleranceConfigList selector action', () => {
      expect(coToleranceFacade.getCoToleranceConfigList()).toEqual(
        coToleranceFacade['coToleranceConfigurationList$']
      );
    });
  });
});
