import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ResidualWeightConfigState } from './residual-weight-config.state';
import { ResidualWeightConfigFacade } from './residual-weight-config.facade';
import {
  LoadResidualToleranceByConfigidPayload,
  LoadResidualWeightConfigListingPayload,
  ResidualWeightConfigResponse,
  SaveResidualTolerancePayload,
  UpdateRangeMappingPayload
} from '@poss-web/shared/models';
import {
  LoadRangeMappingByConfigid,
  LoadReset,
  LoadResidualRangeWeight,
  LoadResidualWeightConfigList,
  LoadSelectedConfigDetails,
  RemoveRangeMapping,
  SaveResidualWeightConfig,
  SearchResidualWeightConfigList,
  UpdateRangeMapping,
  UpdateResidualWeightConfigIsActive
} from './residual-weight-config.actions';

describe(' ResidualWeightConfigFacade Testing Suite', () => {
  const initialState: ResidualWeightConfigState = {
    residualWeightConfigList: [],
    residualWeightConfig: null,
    isLoading: null,
    hasSaved: null,
    hasUpdated: null,
    totalElements: null,
    error: null,
    configId: null,
    rangeWeight: [],
    rangeMapping: null,
    isCleared: null,
    ruleDetailsCount: 0
  };

  let weightToleranceFacade: ResidualWeightConfigFacade;
  let store: MockStore<ResidualWeightConfigFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        ResidualWeightConfigFacade
      ]
    });
    store = TestBed.inject<any>(Store);
    weightToleranceFacade = TestBed.inject<any>(ResidualWeightConfigFacade);
  });

  describe('Dispatch ResidualWeightConfigFacade Actions ', () => {
    it('should call LoadResidualWeightConfigList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadResidualWeightConfigListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const action = new LoadResidualWeightConfigList(payload);
      weightToleranceFacade.loadResidualWeightConfigList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UpdateResidualWeightConfigIsActive action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFOG'
      };

      const action = new UpdateResidualWeightConfigIsActive(payload);
      weightToleranceFacade.updateConfigIsActive(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SearchResidualWeightConfigList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'config test';

      const action = new SearchResidualWeightConfigList(payload);
      weightToleranceFacade.searchConfigByConfigName(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SaveResidualWeightConfig action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
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
      weightToleranceFacade.saveWeightToleranceConfig(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadReset action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      weightToleranceFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadResidualRangeWeight action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadResidualRangeWeight();
      weightToleranceFacade.loadResidualWeightRanges();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UpdateRangeMapping action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateRangeMappingPayload = {
        data: null,
        id: '111111111'
      };

      const action = new UpdateRangeMapping(payload);
      weightToleranceFacade.updateWeightTolerance(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadRangeMappingByConfigid action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadResidualToleranceByConfigidPayload = {
        configId: '111111111',
        pageIndex: 0,
        pageSize: 10
      };

      const action = new LoadRangeMappingByConfigid(payload);
      weightToleranceFacade.loadRangeMappingByConfigId(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RemoveRangeMapping action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateRangeMappingPayload = {
        data: null,
        id: '111111111'
      };

      const action = new RemoveRangeMapping(payload);
      weightToleranceFacade.removeConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadSelectedConfigDetails action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '11111111';

      const action = new LoadSelectedConfigDetails(payload);
      weightToleranceFacade.loadSelectedConfigDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Selector action', () => {
    it('should access the getHasSaved selector action', () => {
      expect(weightToleranceFacade.getHasSaved()).toEqual(
        weightToleranceFacade['hasSaved$']
      );
    });
    it('should access the getHasUpdated selector action', () => {
      expect(weightToleranceFacade.getHasUpdated()).toEqual(
        weightToleranceFacade['hasUpdated$']
      );
    });
    it('should access the getIsCleared selector action', () => {
      expect(weightToleranceFacade.getIsCleared()).toEqual(
        weightToleranceFacade['isCleared$']
      );
    });
    it('should access the getTotalElements selector action', () => {
      expect(weightToleranceFacade.getTotalElements()).toEqual(
        weightToleranceFacade['totalElements$']
      );
    });
    it('should access the getError selector action', () => {
      expect(weightToleranceFacade.getError()).toEqual(
        weightToleranceFacade['error$']
      );
    });
    it('should access the getIsloading selector action', () => {
      expect(weightToleranceFacade.getIsloading()).toEqual(
        weightToleranceFacade['isLoading$']
      );
    });
    it('should access the getResidualWeightConfigList selector action', () => {
      expect(weightToleranceFacade.getResidualWeightConfigList()).toEqual(
        weightToleranceFacade['residualWeightConfigurationList$']
      );
    });
    it('should access the getResidualWeightCOnfig selector action', () => {
      expect(weightToleranceFacade.getResidualWeightCOnfig()).toEqual(
        weightToleranceFacade['residualWeightConfiguration$']
      );
    });
    it('should access the getResidualWeightRanges selector action', () => {
      expect(weightToleranceFacade.getResidualWeightRanges()).toEqual(
        weightToleranceFacade['residualWeightRanges$']
      );
    });
    it('should access the getRangeMappingConfig selector action', () => {
      expect(weightToleranceFacade.getRangeMappingConfig()).toEqual(
        weightToleranceFacade['rangeMappingConfig$']
      );
    });
    it('should access the getConfigId selector action', () => {
      expect(weightToleranceFacade.getConfigId()).toEqual(
        weightToleranceFacade['configId$']
      );
    });
    it('should access the getRuleDetailsCount selector action', () => {
      expect(weightToleranceFacade.getRuleDetailsCount()).toEqual(
        weightToleranceFacade['ruleDetailsCount$']
      );
    });
  });
});
