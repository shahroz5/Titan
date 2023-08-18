import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  RoleList,
  GrnApprovalConfig,
  GrnApprovalConfigList,
  GrnApprovalConfigListPayload,
  GrnApprovalConfigResponse,
  CustomErrors
} from '@poss-web/shared/models';
import {
  GrnApprovalConfigActionTypes,
  LoadGrnApprovalConfigByRuleId,
  LoadGrnApprovalConfigByRuleIdFailure,
  LoadGrnApprovalConfigByRuleIdSuccess,
  LoadGrnApprovalConfigList,
  LoadGrnApprovalConfigListFailure,
  LoadGrnApprovalConfigListSuccess,
  LoadNewGrnApprovalConfigByRuleId,
  LoadReset,
  SaveGrnApprovalConfig,
  SaveGrnApprovalConfigFailure,
  SaveGrnApprovalConfigSuccess,
  SearchGrnApprovalConfigByGrnType,
  SearchGrnApprovalConfigByGrnTypeFailure,
  SearchGrnApprovalConfigByGrnTypeSuccess,
  UpdateGrnApprovalConfig,
  UpdateGrnApprovalConfigFailure,
  UpdateGrnApprovalConfigSuccess,
  LoadRoleList,
  LoadRoleListSuccess,
  LoadRoleListFailure
} from './grn-approval-config.actions';

describe('GRN Approval Access action Action Testing Suite', () => {
  describe('LoadGrnApprovalConfigList Action Test Cases', () => {
    it('should check correct type is used for  LoadGrnApprovalConfigList action ', () => {
      const payload: GrnApprovalConfigListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const action = new LoadGrnApprovalConfigList(payload);
      expect({ ...action }).toEqual({
        type: GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for LoadGrnApprovalConfigListSuccess action ', () => {
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
      const action = new LoadGrnApprovalConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadGrnApprovalConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGrnApprovalConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SearchGrnApprovalConfigByGrnType Action Test Cases', () => {
    it('should check correct type is used for  SearchGrnApprovalConfigByGrnType action ', () => {
      const payload = 'GRN_APPROVAL_ACCESS_REGULAR';
      const action = new SearchGrnApprovalConfigByGrnType(payload);
      expect({ ...action }).toEqual({
        type:
          GrnApprovalConfigActionTypes.SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE,
        payload
      });
    });
    it('should check correct type is used for SearchGrnApprovalConfigByGrnTypeSuccess action ', () => {
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
      const action = new SearchGrnApprovalConfigByGrnTypeSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          GrnApprovalConfigActionTypes.SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchGrnApprovalConfigByGrnTypeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchGrnApprovalConfigByGrnTypeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GrnApprovalConfigActionTypes.SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE_FAILURE,
        payload
      });
    });
  });

  describe('SaveGrnApprovalConfig Action Test Cases', () => {
    it('should check correct type is used for  SaveGrnApprovalConfig action ', () => {
      const payload: GrnApprovalConfig = {
        description: 'GRN_APPROVAL_ACCESS_REGULAR',
        ruleDetails: {
          data: {},
          type: 'GRN_APPROVAL_ACCESS_REGULAR'
        },
        isActive: true
      };

      const action = new SaveGrnApprovalConfig(payload);
      expect({ ...action }).toEqual({
        type: GrnApprovalConfigActionTypes.SAVE_GRN_APPROVAL_CONFIG,
        payload
      });
    });
    it('should check correct type is used for SaveGrnApprovalConfigSuccess action ', () => {
      const payload: GrnApprovalConfigResponse = {
        ruleId: '1',
        description: 'GRN_APPROVAL_ACCESS_REGULAR',
        ruleType: 'GRN_APPROVAL_ACCESS_REGULAR',
        config: [],
        isActive: true
      };
      const action = new SaveGrnApprovalConfigSuccess(payload);

      expect({ ...action }).toEqual({
        type: GrnApprovalConfigActionTypes.SAVE_GRN_APPROVAL_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveGrnApprovalConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveGrnApprovalConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: GrnApprovalConfigActionTypes.SAVE_GRN_APPROVAL_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('UpdateGrnApprovalConfig Action Test Cases', () => {
    it('should check correct type is used for  UpdateGrnApprovalConfig action ', () => {
      const payload: GrnApprovalConfig = {
        ruleId: '1',
        description: 'GRN_APPROVAL_ACCESS_REGULAR',
        ruleDetails: {
          data: {},
          type: 'GRN_APPROVAL_ACCESS_REGULAR'
        },
        isActive: true
      };
      const action = new UpdateGrnApprovalConfig(payload);
      expect({ ...action }).toEqual({
        type: GrnApprovalConfigActionTypes.UPDATE_GRN_APPROVAL_CONFIG,
        payload
      });
    });
    it('should check correct type is used for UpdateGrnApprovalConfigSuccess action ', () => {
      const payload: GrnApprovalConfigResponse = {
        ruleId: '1',
        description: 'GRN_APPROVAL_ACCESS_REGULAR',
        ruleType: 'GRN_APPROVAL_ACCESS_REGULAR',
        config: [],

        isActive: true
      };
      const action = new UpdateGrnApprovalConfigSuccess(payload);

      expect({ ...action }).toEqual({
        type: GrnApprovalConfigActionTypes.UPDATE_GRN_APPROVAL_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateGrnApprovalConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateGrnApprovalConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: GrnApprovalConfigActionTypes.UPDATE_GRN_APPROVAL_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('LoadGrnApprovalConfigByRuleId Action Test Cases', () => {
    it('should check correct type is used for  LoadGrnApprovalConfigByRuleId action ', () => {
      const payload = '1';
      const action = new LoadGrnApprovalConfigByRuleId(
        payload,
        'GRN_APPROVAL_ACCESS_REGULAR'
      );
      expect({ ...action }).toEqual({
        type: GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID,
        ruleId: payload,
        ruleType: 'GRN_APPROVAL_ACCESS_REGULAR'
      });
    });
    it('should check correct type is used for LoadGrnApprovalConfigByRuleIdSuccess action ', () => {
      const payload: GrnApprovalConfigResponse = {
        ruleId: '1',
        description: 'GRN_APPROVAL_ACCESS_REGULAR',
        ruleType: 'GRN_APPROVAL_ACCESS_REGULAR',
        config: [],

        isActive: true
      };
      const action = new LoadGrnApprovalConfigByRuleIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadGrnApprovalConfigByRuleIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGrnApprovalConfigByRuleIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadRoleList Action Test Cases', () => {
    it('should check correct type is used for  LoadGrnTypeList action ', () => {
      const action = new LoadRoleList();
      expect({ ...action }).toEqual({
        type: GrnApprovalConfigActionTypes.LOAD_ROLE_LIST
      });
    });
    it('should check correct type is used for LoadGrnTypeListSuccess action ', () => {
      const payload: RoleList[] = [
        {
          roleCode: 'BOS',
          roleName: 'BOS'
        }
      ];
      const action = new LoadRoleListSuccess(payload);

      expect({ ...action }).toEqual({
        type: GrnApprovalConfigActionTypes.LOAD_ROLE_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadRoleListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRoleListFailure(payload);

      expect({ ...action }).toEqual({
        type: GrnApprovalConfigActionTypes.LOAD_ROLE_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadNewGrnApprovalConfigByRuleId Action Test Cases', () => {
    it('should check correct type is used for  LoadNewGrnApprovalConfigByRuleId action ', () => {
      const action = new LoadNewGrnApprovalConfigByRuleId();
      expect({ ...action }).toEqual({
        type:
          GrnApprovalConfigActionTypes.LOAD_NEW_GRN_APPROVAL_CONFIG_BY_RULE_ID
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: GrnApprovalConfigActionTypes.LOAD_RESET
      });
    });
  });
});
