import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  RoleList,
  FtepApprovalConfig,
  FtepApprovalConfigList,
  FtepApprovalConfigListPayload,
  FtepApprovalConfigResponse,
  CustomErrors
} from '@poss-web/shared/models';
import {
  FtepApprovalConfigActionTypes,
  LoadFtepApprovalConfigByRuleId,
  LoadFtepApprovalConfigByRuleIdFailure,
  LoadFtepApprovalConfigByRuleIdSuccess,
  LoadFtepApprovalConfigList,
  LoadFtepApprovalConfigListFailure,
  LoadFtepApprovalConfigListSuccess,
  LoadNewFtepApprovalConfigByRuleId,
  LoadReset,
  SaveFtepApprovalConfig,
  SaveFtepApprovalConfigFailure,
  SaveFtepApprovalConfigSuccess,
  SearchFtepApprovalConfigByFtepType,
  SearchFtepApprovalConfigByFtepTypeFailure,
  SearchFtepApprovalConfigByFtepTypeSuccess,
  UpdateFtepApprovalConfig,
  UpdateFtepApprovalConfigFailure,
  UpdateFtepApprovalConfigSuccess,
  LoadRoleList,
  LoadRoleListSuccess,
  LoadRoleListFailure
} from './ftep-approval-config.actions';

describe('FTEP Approval Access action Action Testing Suite', () => {
  describe('LoadFtepApprovalConfigList Action Test Cases', () => {
    it('should check correct type is used for  LoadFtepApprovalConfigList action ', () => {
      const payload: FtepApprovalConfigListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const action = new LoadFtepApprovalConfigList(payload);
      expect({ ...action }).toEqual({
        type: FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for LoadFtepApprovalConfigListSuccess action ', () => {
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
      const action = new LoadFtepApprovalConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadFtepApprovalConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFtepApprovalConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SearchFtepApprovalConfigByFtepType Action Test Cases', () => {
    it('should check correct type is used for  SearchFtepApprovalConfigByFtepType action ', () => {
      const payload = 'FTEP_APPROVAL_ACCESS_REGULAR';
      const action = new SearchFtepApprovalConfigByFtepType(payload);
      expect({ ...action }).toEqual({
        type:
          FtepApprovalConfigActionTypes.SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE,
        payload
      });
    });
    it('should check correct type is used for SearchFtepApprovalConfigByFtepTypeSuccess action ', () => {
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
      const action = new SearchFtepApprovalConfigByFtepTypeSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          FtepApprovalConfigActionTypes.SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchFtepApprovalConfigByFtepTypeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchFtepApprovalConfigByFtepTypeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          FtepApprovalConfigActionTypes.SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE_FAILURE,
        payload
      });
    });
  });

  describe('SaveFtepApprovalConfig Action Test Cases', () => {
    it('should check correct type is used for  SaveFtepApprovalConfig action ', () => {
      const payload: FtepApprovalConfig = {
        description: 'FTEP_APPROVAL_ACCESS_REGULAR',
        ruleDetails: {
          data: {},
          type: 'FTEP_APPROVAL_ACCESS_REGULAR'
        },
        isActive: true
      };

      const action = new SaveFtepApprovalConfig(payload);
      expect({ ...action }).toEqual({
        type: FtepApprovalConfigActionTypes.SAVE_FTEP_APPROVAL_CONFIG,
        payload
      });
    });
    it('should check correct type is used for SaveFtepApprovalConfigSuccess action ', () => {
      const payload: FtepApprovalConfigResponse = {
        ruleId: '1',
        description: 'FTEP_APPROVAL_ACCESS_REGULAR',
        ruleType: 'FTEP_APPROVAL_ACCESS_REGULAR',
        config: [],
        isActive: true
      };
      const action = new SaveFtepApprovalConfigSuccess(payload);

      expect({ ...action }).toEqual({
        type: FtepApprovalConfigActionTypes.SAVE_FTEP_APPROVAL_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveFtepApprovalConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveFtepApprovalConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: FtepApprovalConfigActionTypes.SAVE_FTEP_APPROVAL_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('UpdateFtepApprovalConfig Action Test Cases', () => {
    it('should check correct type is used for  UpdateFtepApprovalConfig action ', () => {
      const payload: FtepApprovalConfig = {
        ruleId: '1',
        description: 'FTEP_APPROVAL_ACCESS_REGULAR',
        ruleDetails: {
          data: {},
          type: 'FTEP_APPROVAL_ACCESS_REGULAR'
        },
        isActive: true
      };
      const action = new UpdateFtepApprovalConfig(payload);
      expect({ ...action }).toEqual({
        type: FtepApprovalConfigActionTypes.UPDATE_FTEP_APPROVAL_CONFIG,
        payload
      });
    });
    it('should check correct type is used for UpdateFtepApprovalConfigSuccess action ', () => {
      const payload: FtepApprovalConfigResponse = {
        ruleId: '1',
        description: 'FTEP_APPROVAL_ACCESS_REGULAR',
        ruleType: 'FTEP_APPROVAL_ACCESS_REGULAR',
        config: [],

        isActive: true
      };
      const action = new UpdateFtepApprovalConfigSuccess(payload);

      expect({ ...action }).toEqual({
        type: FtepApprovalConfigActionTypes.UPDATE_FTEP_APPROVAL_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateFtepApprovalConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateFtepApprovalConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: FtepApprovalConfigActionTypes.UPDATE_FTEP_APPROVAL_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('LoadFtepApprovalConfigByRuleId Action Test Cases', () => {
    it('should check correct type is used for  LoadFtepApprovalConfigByRuleId action ', () => {
      const payload = '1';
      const action = new LoadFtepApprovalConfigByRuleId(
        payload,
        'FTEP_APPROVAL_ACCESS_REGULAR'
      );
      expect({ ...action }).toEqual({
        type:
          FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID,
        ruleId: payload,
        ruleType: 'FTEP_APPROVAL_ACCESS_REGULAR'
      });
    });
    it('should check correct type is used for LoadFtepApprovalConfigByRuleIdSuccess action ', () => {
      const payload: FtepApprovalConfigResponse = {
        ruleId: '1',
        description: 'FTEP_APPROVAL_ACCESS_REGULAR',
        ruleType: 'FTEP_APPROVAL_ACCESS_REGULAR',
        config: [],

        isActive: true
      };
      const action = new LoadFtepApprovalConfigByRuleIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadFtepApprovalConfigByRuleIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFtepApprovalConfigByRuleIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadRoleList Action Test Cases', () => {
    it('should check correct type is used for  LoadFtepTypeList action ', () => {
      const action = new LoadRoleList();
      expect({ ...action }).toEqual({
        type: FtepApprovalConfigActionTypes.LOAD_ROLE_LIST
      });
    });
    it('should check correct type is used for LoadFtepTypeListSuccess action ', () => {
      const payload: RoleList[] = [
        {
          roleCode: 'BOS',
          roleName: 'BOS'
        }
      ];
      const action = new LoadRoleListSuccess(payload);

      expect({ ...action }).toEqual({
        type: FtepApprovalConfigActionTypes.LOAD_ROLE_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadRoleListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRoleListFailure(payload);

      expect({ ...action }).toEqual({
        type: FtepApprovalConfigActionTypes.LOAD_ROLE_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadNewFtepApprovalConfigByRuleId Action Test Cases', () => {
    it('should check correct type is used for  LoadNewFtepApprovalConfigByRuleId action ', () => {
      const action = new LoadNewFtepApprovalConfigByRuleId();
      expect({ ...action }).toEqual({
        type:
          FtepApprovalConfigActionTypes.LOAD_NEW_FTEP_APPROVAL_CONFIG_BY_RULE_ID
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: FtepApprovalConfigActionTypes.LOAD_RESET
      });
    });
  });
});
