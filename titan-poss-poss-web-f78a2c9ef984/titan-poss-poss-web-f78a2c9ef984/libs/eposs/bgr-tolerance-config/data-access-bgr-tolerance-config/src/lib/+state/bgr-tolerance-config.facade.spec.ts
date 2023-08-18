import { BgrToleranceConfigState } from './bgr-tolerance-config.state';
import { BgrToleranceConfigFacade } from './bgr-tolerance-config.facade';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import {
  LoadBgrToleranceConfigList,
  LoadBgrToleranceRangeWeight,
  LoadMetalTypes,
  LoadRangeMappingByConfigId,
  LoadReset,
  LoadSelectedConfigDetails,
  RemoveBgrToleranceConfig,
  SaveBgrToleranceConfig,
  SearchBgrToleranceConfigList,
  UpdateBgrToleranceConfigIsActive,
  UpdateRangeMapping
} from './bgr-tolerance-config.actions';
import {
  AbToleranceConfigDetailsReqPayload,
  AbToleranceConfigResponse,
  ABToleranceUpdateRangeMappingPayload,
  LoadAbToleranceConfigReqPayload,
  SaveAbTolerancePayload
} from '@poss-web/shared/models';

describe(' BgrToleranceFacade Testing Suite', () => {
  const initialState: BgrToleranceConfigState = {
    bgrToleranceConfigList: [],
    bgrToleranceConfig: null,
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
    configIdInSlabValidationFailure: null
  };

  let bgrToleranceFacade: BgrToleranceConfigFacade;
  let store: MockStore<BgrToleranceConfigFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), BgrToleranceConfigFacade]
    });
    store = TestBed.inject<any>(Store);
    bgrToleranceFacade = TestBed.inject<any>(BgrToleranceConfigFacade);
  });

  describe('Dispatch BgrToleranceConfigFacade Actions', () => {
    it('should call LoadBgrToleranceConfigList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadAbToleranceConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        orderType: 'ORDER_BGR_TOLERANCE'
      };
      const action = new LoadBgrToleranceConfigList(payload);
      bgrToleranceFacade.loadBgrToleranceConfigList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadBgrToleranceConfigList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: AbToleranceConfigResponse = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        isActive: false
      };
      const action = new UpdateBgrToleranceConfigIsActive(payload);
      bgrToleranceFacade.updateConfigIsActive(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SearchBgrToleranceConfigList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: { configName: string; ruleType: string } = {
        configName: 'testconfig',
        ruleType: 'ORDER_BGR_TOLERANCE'
      };
      const action = new SearchBgrToleranceConfigList('');
      bgrToleranceFacade.searchConfigByConfigName('');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call saveToleranceConfig action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
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
      bgrToleranceFacade.saveToleranceConfig(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadReset action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      bgrToleranceFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadBgrTolerancelWeightRanges action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadBgrToleranceRangeWeight();
      bgrToleranceFacade.loadBgrTolerancelWeightRanges();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call updateBgrTolerance action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '7777777777',
        data: null,
        ruleType: 'ORDER_BGR_TOLERANCE'
      };
      const action = new UpdateRangeMapping(payload);
      bgrToleranceFacade.updateBgrTolerance(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadSelectedConfigDetails action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        configId: '1'
      };
      const action = new LoadSelectedConfigDetails('');
      bgrToleranceFacade.loadSelectedConfigDetails('');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadBgrMappingByConfigId action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: AbToleranceConfigDetailsReqPayload = {
        ruleType: 'ORDER_BGR_TOLERANCE',
        configId: '1',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      const action = new LoadRangeMappingByConfigId('');
      bgrToleranceFacade.loadBgrMappingByConfigId('');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call removeConfiguration action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: ABToleranceUpdateRangeMappingPayload = {
        id: '55555555555',
        data: null,
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE'
      };
      const action = new RemoveBgrToleranceConfig(payload);
      bgrToleranceFacade.removeConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadMetalTypes action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadMetalTypes();
      bgrToleranceFacade.loadMetalTypes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getIsloading selector action', () => {
      expect(bgrToleranceFacade.getIsloading()).toEqual(
        bgrToleranceFacade['isLoading$']
      );
    });
    it('should access the getHasSaved selector action', () => {
      expect(bgrToleranceFacade.getHasSaved()).toEqual(
        bgrToleranceFacade['hasSaved$']
      );
    });
    it('should access the getHasUpdated selector action', () => {
      expect(bgrToleranceFacade.getHasUpdated()).toEqual(
        bgrToleranceFacade['hasUpdated$']
      );
    });
    it('should access the getTotalElements selector action', () => {
      expect(bgrToleranceFacade.getTotalElements()).toEqual(
        bgrToleranceFacade['totalElements$']
      );
    });
    it('should access the getError selector action', () => {
      expect(bgrToleranceFacade.getError()).toEqual(
        bgrToleranceFacade['error$']
      );
    });
    it('should access the getBgrToleranceConfig selector action', () => {
      expect(bgrToleranceFacade.getAbToleranceConfig()).toEqual(
        bgrToleranceFacade['bgrToleranceConfiguration$']
      );
    });
    it('should access the getToleranceConfig selector action', () => {
      expect(bgrToleranceFacade.getToleranceConfig()).toEqual(
        bgrToleranceFacade['toleranceConfig$']
      );
    });
    it('should access the getConfigId selector action', () => {
      expect(bgrToleranceFacade.getConfigId()).toEqual(
        bgrToleranceFacade['configId$']
      );
    });
    it('should access the getMetalTypes selector action', () => {
      expect(bgrToleranceFacade.getMetalTypes()).toEqual(
        bgrToleranceFacade['selectMetalType$']
      );
    });
    it('should access the getIsCleared selector action', () => {
      expect(bgrToleranceFacade.getIsCleared()).toEqual(
        bgrToleranceFacade['isCleared$']
      );
    });
    it('should access the getAbToleranceConfigList selector action', () => {
      expect(bgrToleranceFacade.getBgrToleranceConfigList()).toEqual(
        bgrToleranceFacade['bgrToleranceConfigurationList$']
      );
    });
  });
});
