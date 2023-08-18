import * as actions from './grn-approval-config.actions';

import {
  GrnApprovalConfigListPayload,
  GrnApprovalConfigList,
  GrnApprovalConfig,
  GrnApprovalConfigResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  grnApprovalConfigReducer,
  initialState
} from './grn-approval-config.reducer';

describe('GRN Approval Config reducer Testing Suite', () => {
  const grnApprovalConfigListPayload: GrnApprovalConfigListPayload = {
    pageIndex: 0,
    pageSize: 100,
    length: 0
  };

  it('should return the initial state', () => {
    const action: any = {};
    const state = grnApprovalConfigReducer(null, action);

    expect(initialState).toBe(initialState);
  });

  describe('Testing LoadGrnApprovalConfigList ', () => {
    it('Load LoadGrnApprovalConfigList should set the isLoading to true', () => {
      const action = new actions.LoadGrnApprovalConfigList(
        grnApprovalConfigListPayload
      );

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadGrnApprovalConfigListSuccess should return list of cn validations', () => {
      const payload: GrnApprovalConfigList = {
        grnApprovalConfigList: [
          {
            ruleId: '1',

            description: 'GRN_APPROVAL_ACCESS_REGULAR',
            ruleDetails: {
              data: {},
              type: 'GRN_APPROVAL_ACCESS_REGULAR'
            },
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.LoadGrnApprovalConfigListSuccess(payload);

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.grnApprovalConfigList.length).toBe(1);
    });
    it('LoadGrnApprovalConfigListFailure should return error', () => {
      const action = new actions.LoadGrnApprovalConfigListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchGrnApprovalConfigByGrnType ', () => {
    beforeEach(() => {});
    it('Load SearchGrnApprovalConfigByGrnType should set the isLoading to true', () => {
      const action = new actions.SearchGrnApprovalConfigByGrnType(
        'GRN_APPROVAL_ACCESS_REGULAR'
      );

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadGrnApprovalConfigListSuccess should return list of GRN Approval Config', () => {
      const payload: GrnApprovalConfigList = {
        grnApprovalConfigList: [
          {
            ruleId: '1',

            description: 'Regular',
            ruleDetails: {
              data: {},
              type: 'GRN_APPROVAL_ACCESS_REGULAR'
            },
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.SearchGrnApprovalConfigByGrnTypeSuccess(
        payload
      );

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.grnApprovalConfigList.length).toBe(1);
    });
    it('LoadGrnApprovalConfigListFailure should return error', () => {
      const action = new actions.SearchGrnApprovalConfigByGrnTypeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveGrnApprovalConfig Functionality ', () => {
    beforeEach(() => {});
    it('SaveGrnApprovalConfig ', () => {
      const payload: GrnApprovalConfig = {
        description: 'ibtconfig',
        ruleDetails: {
          data: {},
          type: 'GRN_APPROVAL_ACCESS_REGULAR'
        },
        isActive: true
      };
      const action = new actions.SaveGrnApprovalConfig(payload);

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(null);
    });
    it('SaveGrnApprovalConfigSuccess should update the hasSaved property to true', () => {
      const payload: GrnApprovalConfigResponse = {
        ruleId: '1',
        description: 'Regular',
        ruleType: 'GRN_APPROVAL_ACCESS_REGULAR',
        config: [],
        isActive: true
      };
      const action = new actions.SaveGrnApprovalConfigSuccess(payload);

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.hasSaved).toBe(true);

      expect(result.isLoading).toBe(false);
    });
    it('SaveGrnApprovalConfigFailure should return error', () => {
      const action = new actions.SaveGrnApprovalConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateGrnApprovalConfig ', () => {
    beforeEach(() => {});
    it('UpdateGrnApprovalConfig ', () => {
      const payload: GrnApprovalConfig = {
        ruleId: '1',
        description: 'Regular',
        ruleDetails: {
          data: {},
          type: 'GRN_APPROVAL_ACCESS_REGULAR'
        },
        isActive: true
      };
      const action = new actions.UpdateGrnApprovalConfig(payload);

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateGrnApprovalConfigSuccess should update the hasUpdated property to true', () => {
      const payload: GrnApprovalConfigResponse = {
        ruleId: '1',
        description: 'Regular',
        ruleType: 'GRN_APPROVAL_ACCESS_REGULAR',
        config: [],

        isActive: true
      };

      const action = new actions.UpdateGrnApprovalConfigSuccess(payload);

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateGrnApprovalConfigFailure should return error', () => {
      const action = new actions.UpdateGrnApprovalConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadGrnApprovalConfigByRuleId ', () => {
    beforeEach(() => {});
    it('LoadGrnApprovalConfigByRuleId should return the Cn Validation ', () => {
      const payload = '1';
      const action = new actions.LoadGrnApprovalConfigByRuleId(
        payload,
        'GRN_APPROVAL_ACCESS_REGULAR'
      );

      const result = grnApprovalConfigReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadGrnApprovalConfigByRuleIdSuccess should return the ibt config', () => {
      const payload: GrnApprovalConfigResponse = {
        ruleId: '1',
        description: 'ibtconfig',
        ruleType: 'GRN_APPROVAL_ACCESS_REGULAR',
        config: [],

        isActive: true
      };

      const action = new actions.LoadGrnApprovalConfigByRuleIdSuccess(payload);

      const result = grnApprovalConfigReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.grnApprovalConfig).toEqual(payload);
    });
    it('LoadGrnApprovalConfigByConfigIdFailure should return error', () => {
      const action = new actions.LoadGrnApprovalConfigByRuleIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadRoleList ', () => {
    it('Load LoadCnTypeList should set the isLoading to true', () => {
      const action = new actions.LoadRoleList();

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadRoleListSuccess should return list of role type', () => {
      const payload = [
        {
          roleCode: 'BOS',
          roleName: 'BOS'
        }
      ];
      const action = new actions.LoadRoleListSuccess(payload);

      const result = grnApprovalConfigReducer(initialState, action);

      // expect(result.isLoading).toBe(false);
      expect(result.roleList.length).toBe(1);
    });
    it('LoadCnTypeListFailure should return error', () => {
      const action = new actions.LoadRoleListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = grnApprovalConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result = grnApprovalConfigReducer(
        initialState,

        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
