import {
  GrnApprovalConfigListPayload,
  GrnApprovalConfig
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import {
  LoadRoleList,
  LoadGrnApprovalConfigByRuleId,
  LoadGrnApprovalConfigList,
  LoadNewGrnApprovalConfigByRuleId,
  LoadReset,
  SaveGrnApprovalConfig,
  SearchGrnApprovalConfigByGrnType,
  UpdateGrnApprovalConfig
} from './grn-approval-config.actions';

import { GrnApprovalConfigState } from './grn-approval-config.state';
import { GrnApprovalConfigFacade } from './grn-approval-config.facade';

describe('GrnApprovalConfig facade Testing Suite', () => {
  const initialState: GrnApprovalConfigState = {
    grnApprovalConfigList: null,
    isLoading: null,
    error: null,
    grnApprovalConfig: null,
    hasSaved: null,
    hasUpdated: null,
    totalElements: null,
    roleList: null
  };
  let grnApprovalConfigFacade: GrnApprovalConfigFacade;
  let store: MockStore<GrnApprovalConfigFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), GrnApprovalConfigFacade]
    });
    store = TestBed.inject<any>(Store);
    grnApprovalConfigFacade = TestBed.inject<any>(GrnApprovalConfigFacade);
  });

  describe('Dispatch Actions action', () => {
    const grnApprovalConfigListPayload: GrnApprovalConfigListPayload = {
      pageIndex: 0,
      pageSize: 100,
      length: 0
    };
    const grnApprovalConfig: GrnApprovalConfig = {
      description: 'GRN_APPROVAL_ACCESS_REGULAR',
      ruleDetails: {
        data: {},
        type: 'GRN_APPROVAL_ACCESS_REGULAR'
      },
      isActive: true
    };

    it('should call LOAD_GRN_APPROVAL_CONFIG_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadGrnApprovalConfigList(
        grnApprovalConfigListPayload
      );
      grnApprovalConfigFacade.loadGrnApprovalConfigList(
        grnApprovalConfigListPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_ROLE_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadRoleList();
      grnApprovalConfigFacade.loadRoleList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_GRN_APPROVAL_CONFIG action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SaveGrnApprovalConfig(grnApprovalConfig);
      grnApprovalConfigFacade.saveGrnApprovalConfig(grnApprovalConfig);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_GRN_APPROVAL_CONFIG action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new UpdateGrnApprovalConfig(grnApprovalConfig);
      grnApprovalConfigFacade.updateGrnApprovalConfig(grnApprovalConfig);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadGrnApprovalConfigByRuleId(
        payload,
        'GRN_APPROVAL_ACCESS_REGULAR'
      );
      grnApprovalConfigFacade.loadGrnApprovalConfigByRuleId(
        payload,
        'GRN_APPROVAL_ACCESS_REGULAR'
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'GRN_APPROVAL_ACCESS_REGULAR';
      const action = new SearchGrnApprovalConfigByGrnType(payload);
      grnApprovalConfigFacade.searchGrnType(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      grnApprovalConfigFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  it('should call LOAD_NEW_GRN_APPROVAL_CONFIG_BY_RULE_ID action', () => {
    spyOn(store, 'dispatch').and.returnValue({});
    const action = new LoadNewGrnApprovalConfigByRuleId();

    grnApprovalConfigFacade.loadNewGrnApprovalConfigByRuleId();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  describe('Access Selector action', () => {
    it('should access the getGrnApprovalConfigList selector action', () => {
      expect(grnApprovalConfigFacade.getGrnApprovalConfigList()).toEqual(
        grnApprovalConfigFacade['grnApprovalConfigList$']
      );
    });

    it('should access the getGrnApprovalConfig selector action', () => {
      expect(grnApprovalConfigFacade.getGrnApprovalConfig()).toEqual(
        grnApprovalConfigFacade['grnApprovalConfig$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(grnApprovalConfigFacade.getHasSaved()).toEqual(
        grnApprovalConfigFacade['hasSaved$']
      );
    });

    it('should access the getHasUpdated selector action', () => {
      expect(grnApprovalConfigFacade.getHasUpdated()).toEqual(
        grnApprovalConfigFacade['hasUpdated$']
      );
    });

    it('should access the getIsloading selector action', () => {
      expect(grnApprovalConfigFacade.getIsloading()).toEqual(
        grnApprovalConfigFacade['isLoading$']
      );
    });

    it('should access the getError selector action', () => {
      expect(grnApprovalConfigFacade.getError()).toEqual(
        grnApprovalConfigFacade['error$']
      );
    });

    it('should access the getTotalElement selector action', () => {
      expect(grnApprovalConfigFacade.getTotalElement()).toEqual(
        grnApprovalConfigFacade['totalElements$']
      );
    });

    it('should access the getRoleList selector action', () => {
      expect(grnApprovalConfigFacade.getRoleList()).toEqual(
        grnApprovalConfigFacade['roleList$']
      );
    });
  });
});
