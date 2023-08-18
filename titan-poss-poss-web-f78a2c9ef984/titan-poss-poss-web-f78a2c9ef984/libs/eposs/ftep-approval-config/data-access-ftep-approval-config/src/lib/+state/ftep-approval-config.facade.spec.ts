import {
  FtepApprovalConfigListPayload,
  FtepApprovalConfig
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import {
  LoadRoleList,
  LoadFtepApprovalConfigByRuleId,
  LoadFtepApprovalConfigList,
  LoadNewFtepApprovalConfigByRuleId,
  LoadReset,
  SaveFtepApprovalConfig,
  SearchFtepApprovalConfigByFtepType,
  UpdateFtepApprovalConfig
} from './ftep-approval-config.actions';

import { FtepApprovalConfigState } from './ftep-approval-config.state';
import { FtepApprovalConfigFacade } from './ftep-approval-config.facade';

describe('FtepApprovalConfig facade Testing Suite', () => {
  const initialState: FtepApprovalConfigState = {
    ftepApprovalConfigList: null,
    isLoading: null,
    error: null,
    ftepApprovalConfig: null,
    hasSaved: null,
    hasUpdated: null,
    totalElements: null,
    roleList: null
  };
  let ftepApprovalConfigFacade: FtepApprovalConfigFacade;
  let store: MockStore<FtepApprovalConfigFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), FtepApprovalConfigFacade]
    });
    store = TestBed.inject<any>(Store);
    ftepApprovalConfigFacade = TestBed.inject<any>(FtepApprovalConfigFacade);
  });

  describe('Dispatch Actions action', () => {
    const ftepApprovalConfigListPayload: FtepApprovalConfigListPayload = {
      pageIndex: 0,
      pageSize: 100,
      length: 0
    };
    const ftepApprovalConfig: FtepApprovalConfig = {
      description: 'FTEP_APPROVAL_ACCESS_REGULAR',
      ruleDetails: {
        data: {},
        type: 'FTEP_APPROVAL_ACCESS_REGULAR'
      },
      isActive: true
    };

    it('should call LOAD_FTEP_APPROVAL_CONFIG_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadFtepApprovalConfigList(
        ftepApprovalConfigListPayload
      );
      ftepApprovalConfigFacade.loadFtepApprovalConfigList(
        ftepApprovalConfigListPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_ROLE_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadRoleList();
      ftepApprovalConfigFacade.loadRoleList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_FTEP_APPROVAL_CONFIG action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SaveFtepApprovalConfig(ftepApprovalConfig);
      ftepApprovalConfigFacade.saveFtepApprovalConfig(ftepApprovalConfig);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_FTEP_APPROVAL_CONFIG action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new UpdateFtepApprovalConfig(ftepApprovalConfig);
      ftepApprovalConfigFacade.updateFtepApprovalConfig(ftepApprovalConfig);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadFtepApprovalConfigByRuleId(
        payload,
        'FTEP_APPROVAL_ACCESS_REGULAR'
      );
      ftepApprovalConfigFacade.loadFtepApprovalConfigByRuleId(
        payload,
        'FTEP_APPROVAL_ACCESS_REGULAR'
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'FTEP_APPROVAL_ACCESS_REGULAR';
      const action = new SearchFtepApprovalConfigByFtepType(payload);
      ftepApprovalConfigFacade.searchFtepType(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      ftepApprovalConfigFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  it('should call LOAD_NEW_FTEP_APPROVAL_CONFIG_BY_RULE_ID action', () => {
    spyOn(store, 'dispatch').and.returnValue({});
    const action = new LoadNewFtepApprovalConfigByRuleId();

    ftepApprovalConfigFacade.loadNewFtepApprovalConfigByRuleId();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  describe('Access Selector action', () => {
    it('should access the getFtepApprovalConfigList selector action', () => {
      expect(ftepApprovalConfigFacade.getFtepApprovalConfigList()).toEqual(
        ftepApprovalConfigFacade['ftepApprovalConfigList$']
      );
    });

    it('should access the getFtepApprovalConfig selector action', () => {
      expect(ftepApprovalConfigFacade.getFtepApprovalConfig()).toEqual(
        ftepApprovalConfigFacade['ftepApprovalConfig$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(ftepApprovalConfigFacade.getHasSaved()).toEqual(
        ftepApprovalConfigFacade['hasSaved$']
      );
    });

    it('should access the getHasUpdated selector action', () => {
      expect(ftepApprovalConfigFacade.getHasUpdated()).toEqual(
        ftepApprovalConfigFacade['hasUpdated$']
      );
    });

    it('should access the getIsloading selector action', () => {
      expect(ftepApprovalConfigFacade.getIsloading()).toEqual(
        ftepApprovalConfigFacade['isLoading$']
      );
    });

    it('should access the getError selector action', () => {
      expect(ftepApprovalConfigFacade.getError()).toEqual(
        ftepApprovalConfigFacade['error$']
      );
    });

    it('should access the getTotalElement selector action', () => {
      expect(ftepApprovalConfigFacade.getTotalElement()).toEqual(
        ftepApprovalConfigFacade['totalElements$']
      );
    });

    it('should access the getRoleList selector action', () => {
      expect(ftepApprovalConfigFacade.getRoleList()).toEqual(
        ftepApprovalConfigFacade['roleList$']
      );
    });
  });
});
