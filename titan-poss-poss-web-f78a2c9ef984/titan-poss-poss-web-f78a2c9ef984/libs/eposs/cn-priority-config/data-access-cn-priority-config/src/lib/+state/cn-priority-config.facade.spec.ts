import {
  CnPriorityConfigListPayload,
  CnPriorityConfig
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import {
  LoadReset,
  LoadCnPriorityConfigList,
  SaveCnPriorityConfig,
  UpdateCnPriorityConfig,
  LoadCnPriorityConfigByConfigId,
  LoadNewCnPriorityConfigByConfigId,
  SearchConfigByConfigName,
  LoadCnTypeList
} from './cn-priority-config.actions';

import { CnPriorityConfigState } from './cn-priority-config.state';
import { CnPriorityConfigFacade } from './cn-priority-config.facade';

describe('CN priority config facade Testing Suite', () => {
  const initialState: CnPriorityConfigState = {
    cnPriorityConfigList: null,
    isLoading: null,
    error: null,
    cnPriorityConfig: null,
    hasSaved: null,
    hasUpdated: null,
    totalElements: null,
    cnTypeList: []
  };
  let cnPriorityConfigFacade: CnPriorityConfigFacade;
  let store: MockStore<CnPriorityConfigFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CnPriorityConfigFacade]
    });
    store = TestBed.inject<any>(Store);
    cnPriorityConfigFacade = TestBed.inject<any>(CnPriorityConfigFacade);
  });

  describe('Dispatch Actions action', () => {
    const cnPriorityConfigListPayload: CnPriorityConfigListPayload = {
      pageIndex: 0,
      pageSize: 100,
      length: 0
    };
    const cnPriorityConfig: CnPriorityConfig = {
      description: 'gep',
      ruleDetails: {
        data: {},
        type: 'GEP'
      },
      isActive: true
    };

    it('should call LOAD_CN_PRIORITY_CONFIG_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadCnPriorityConfigList(cnPriorityConfigListPayload);
      cnPriorityConfigFacade.loadCnPriorityConfigList(
        cnPriorityConfigListPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_CN_PRIORITY_CONFIG action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SaveCnPriorityConfig(cnPriorityConfig);
      cnPriorityConfigFacade.saveCnPriorityConfig(cnPriorityConfig);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_CN_PRIORITY_CONFIG action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new UpdateCnPriorityConfig(cnPriorityConfig);
      cnPriorityConfigFacade.updateCnPriorityConfig(cnPriorityConfig);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadCnPriorityConfigByConfigId(payload);
      cnPriorityConfigFacade.loadCnPriorityConfigByConfigId(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_CONFIG_BY_CONFIG_NAME action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'gep';
      const action = new SearchConfigByConfigName(payload);
      cnPriorityConfigFacade.searchConfig(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      cnPriorityConfigFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  it('should call LOAD_CN_TYPE_LIST action', () => {
    spyOn(store, 'dispatch').and.returnValue({});

    const action = new LoadCnTypeList();
    cnPriorityConfigFacade.loadCnTypeList();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call LOAD_NEW_CN_PRIORITY_CONFIG_BY_CONFIG_ID action', () => {
    spyOn(store, 'dispatch').and.returnValue({});
    const action = new LoadNewCnPriorityConfigByConfigId();

    cnPriorityConfigFacade.loadNewCnPriorityConfigByConfigId();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  describe('Access Selector action', () => {
    it('should access the getCnPriorityConfigList selector action', () => {
      expect(cnPriorityConfigFacade.getCnPriorityConfigList()).toEqual(
        cnPriorityConfigFacade['cnPriorityConfigList$']
      );
    });

    it('should access the getCnPriorityConfig selector action', () => {
      expect(cnPriorityConfigFacade.getCnPriorityConfig()).toEqual(
        cnPriorityConfigFacade['cnPriorityConfig$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(cnPriorityConfigFacade.getHasSaved()).toEqual(
        cnPriorityConfigFacade['hasSaved$']
      );
    });

    it('should access the getHasUpdated selector action', () => {
      expect(cnPriorityConfigFacade.getHasUpdated()).toEqual(
        cnPriorityConfigFacade['hasUpdated$']
      );
    });

    it('should access the getIsloading selector action', () => {
      expect(cnPriorityConfigFacade.getIsloading()).toEqual(
        cnPriorityConfigFacade['isLoading$']
      );
    });

    it('should access the getError selector action', () => {
      expect(cnPriorityConfigFacade.getError()).toEqual(
        cnPriorityConfigFacade['error$']
      );
    });

    it('should access the getTotalElement selector action', () => {
      expect(cnPriorityConfigFacade.getTotalElement()).toEqual(
        cnPriorityConfigFacade['totalElements$']
      );
    });

    it('should access the getCnTypeList selector action', () => {
      expect(cnPriorityConfigFacade.getCnTypeList()).toEqual(
        cnPriorityConfigFacade['cnTypeList$']
      );
    });
  });
});
