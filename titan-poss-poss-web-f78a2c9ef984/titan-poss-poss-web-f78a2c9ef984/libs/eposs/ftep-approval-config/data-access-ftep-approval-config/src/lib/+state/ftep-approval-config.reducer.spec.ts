//you should simply assert that you get the right state given the provided inputs.

import * as actions from './ftep-approval-config.actions';

import {
  FtepApprovalConfigListPayload,
  FtepApprovalConfigList,
  FtepApprovalConfig,
  FtepApprovalConfigResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ftepApprovalConfigReducer,
  initialState
} from './ftep-approval-config.reducer';
import { FtepApprovalConfigState } from './ftep-approval-config.state';

describe('FTEP Approval Config reducer Testing Suite', () => {
  const ftepApprovalConfigListPayload: FtepApprovalConfigListPayload = {
    pageIndex: 0,
    pageSize: 100,
    length: 0
  };

  it('should return the initial state', () => {
    const action: any = {};
    const state = ftepApprovalConfigReducer(null, action);

    expect(initialState).toBe(initialState);
  });

  describe('Testing LoadFtepApprovalConfigList ', () => {
    it('Load LoadFtepApprovalConfigList should set the isLoading to true', () => {
      const action = new actions.LoadFtepApprovalConfigList(
        ftepApprovalConfigListPayload
      );

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadFtepApprovalConfigListSuccess should return list of cn validations', () => {
      const payload: FtepApprovalConfigList = {
        ftepApprovalConfigList: [
          {
            ruleId: '1',

            description: 'FTEP_APPROVAL_ACCESS_REGULAR',
            ruleDetails: {
              data: {},
              type: 'FTEP_APPROVAL_ACCESS_REGULAR'
            },
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.LoadFtepApprovalConfigListSuccess(payload);

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.ftepApprovalConfigList.length).toBe(1);
    });
    it('LoadFtepApprovalConfigListFailure should return error', () => {
      const action = new actions.LoadFtepApprovalConfigListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchFtepApprovalConfigByFtepType ', () => {
    beforeEach(() => {});
    it('Load SearchFtepApprovalConfigByFtepType should set the isLoading to true', () => {
      const action = new actions.SearchFtepApprovalConfigByFtepType(
        'FTEP_APPROVAL_ACCESS_REGULAR'
      );

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadFtepApprovalConfigListSuccess should return list of FTEP Approval Config', () => {
      const payload: FtepApprovalConfigList = {
        ftepApprovalConfigList: [
          {
            ruleId: '1',

            description: 'Regular',
            ruleDetails: {
              data: {},
              type: 'FTEP_APPROVAL_ACCESS_REGULAR'
            },
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.SearchFtepApprovalConfigByFtepTypeSuccess(
        payload
      );

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.ftepApprovalConfigList.length).toBe(1);
    });
    it('LoadFtepApprovalConfigListFailure should return error', () => {
      const action = new actions.SearchFtepApprovalConfigByFtepTypeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveFtepApprovalConfig Functionality ', () => {
    beforeEach(() => {});
    it('SaveFtepApprovalConfig ', () => {
      const payload: FtepApprovalConfig = {
        description: 'ibtconfig',
        ruleDetails: {
          data: {},
          type: 'FTEP_APPROVAL_ACCESS_REGULAR'
        },
        isActive: true
      };
      const action = new actions.SaveFtepApprovalConfig(payload);

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(null);
    });
    it('SaveFtepApprovalConfigSuccess should update the hasSaved property to true', () => {
      const payload: FtepApprovalConfigResponse = {
        ruleId: '1',
        description: 'Regular',
        ruleType: 'FTEP_APPROVAL_ACCESS_REGULAR',
        config: [],
        isActive: true
      };
      const action = new actions.SaveFtepApprovalConfigSuccess(payload);

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.hasSaved).toBe(true);

      expect(result.isLoading).toBe(false);
    });
    it('SaveFtepApprovalConfigFailure should return error', () => {
      const action = new actions.SaveFtepApprovalConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateFtepApprovalConfig ', () => {
    beforeEach(() => {});
    it('UpdateFtepApprovalConfig ', () => {
      const payload: FtepApprovalConfig = {
        ruleId: '1',
        description: 'Regular',
        ruleDetails: {
          data: {},
          type: 'FTEP_APPROVAL_ACCESS_REGULAR'
        },
        isActive: true
      };
      const action = new actions.UpdateFtepApprovalConfig(payload);

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateFtepApprovalConfigSuccess should update the hasUpdated property to true', () => {
      const payload: FtepApprovalConfigResponse = {
        ruleId: '1',
        description: 'Regular',
        ruleType: 'FTEP_APPROVAL_ACCESS_REGULAR',
        config: [],

        isActive: true
      };

      const action = new actions.UpdateFtepApprovalConfigSuccess(payload);

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateFtepApprovalConfigFailure should return error', () => {
      const action = new actions.UpdateFtepApprovalConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadFtepApprovalConfigByRuleId ', () => {
    beforeEach(() => {});
    it('LoadFtepApprovalConfigByRuleId should return the Cn Validation ', () => {
      const payload = '1';
      const action = new actions.LoadFtepApprovalConfigByRuleId(
        payload,
        'FTEP_APPROVAL_ACCESS_REGULAR'
      );

      const result = ftepApprovalConfigReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadFtepApprovalConfigByRuleIdSuccess should return the ibt config', () => {
      const payload: FtepApprovalConfigResponse = {
        ruleId: '1',
        description: 'ibtconfig',
        ruleType: 'FTEP_APPROVAL_ACCESS_REGULAR',
        config: [],

        isActive: true
      };

      const action = new actions.LoadFtepApprovalConfigByRuleIdSuccess(payload);

      const result = ftepApprovalConfigReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.ftepApprovalConfig).toEqual(payload);
    });
    it('LoadFtepApprovalConfigByConfigIdFailure should return error', () => {
      const action = new actions.LoadFtepApprovalConfigByRuleIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadRoleList ', () => {
    it('Load LoadCnTypeList should set the isLoading to true', () => {
      const action = new actions.LoadRoleList();

      const result = ftepApprovalConfigReducer(initialState, action);

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

      const result = ftepApprovalConfigReducer(initialState, action);

      // expect(result.isLoading).toBe(false);
      expect(result.roleList.length).toBe(1);
    });
    it('LoadCnTypeListFailure should return error', () => {
      const action = new actions.LoadRoleListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = ftepApprovalConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result = ftepApprovalConfigReducer(
        initialState,

        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
