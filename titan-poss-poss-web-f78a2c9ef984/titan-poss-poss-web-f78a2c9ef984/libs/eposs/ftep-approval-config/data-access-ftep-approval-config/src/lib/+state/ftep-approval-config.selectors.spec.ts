// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  FtepApprovalConfig,
  FtepApprovalConfigResponse
} from '@poss-web/shared/models';

import { initialState } from './ftep-approval-config.reducer';
import * as selectors from './ftep-approval-config.selectors';

import { FtepApprovalConfigState } from './ftep-approval-config.state';

describe('FTEP Approval Config selector Testing Suite', () => {
  const ftepApprovalConfig: FtepApprovalConfig = {
    ruleId: '1',
    ruleType: 'FTEP_APPROVAL_ACCESS_REGULAR',
    description: 'FTEP_APPROVAL_ACCESS_REGULAR',
    ruleDetails: {
      data: {},
      type: 'FTEP_APPROVAL_ACCESS_REGULAR'
    },
    isActive: true
  };

  const roleList = [
    {
      roleCode: 'BOS',
      roleName: 'BOS'
    }
  ];

  const ftepApprovalConfigResponse: FtepApprovalConfigResponse = {
    ruleId: '1',
    description: 'FTEP_APPROVAL_ACCESS_REGULAR',
    ruleType: 'FTEP_APPROVAL_ACCESS_REGULAR',
    config: [],

    isActive: true
  };
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing FTEP Approval Config related Selectors', () => {
    it('selectFtepApprovalConfigList Should return the list of FTEP approval Config list', () => {
      const state: FtepApprovalConfigState = {
        ...initialState,
        ftepApprovalConfigList: [ftepApprovalConfigResponse]
      };
      expect(
        selectors.ftepApprovalConfigSelectors.selectFtepApprovalConfigList.projector(
          state
        )
      ).toEqual([ftepApprovalConfigResponse]);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: FtepApprovalConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.ftepApprovalConfigSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: FtepApprovalConfigState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.ftepApprovalConfigSelectors.selectError.projector(state)
      ).toEqual(error);
    });
    it('selectFtepApprovalConfig Should return the FTEP Approval Config object', () => {
      const state: FtepApprovalConfigState = {
        ...initialState,
        ftepApprovalConfig: ftepApprovalConfigResponse
      };
      expect(
        selectors.ftepApprovalConfigSelectors.selectFtepApprovalConfig.projector(
          state
        )
      ).toEqual(ftepApprovalConfigResponse);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: FtepApprovalConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.ftepApprovalConfigSelectors.selectHassaved.projector(state)
      ).toEqual(true);
    });
    it('selectHasUpdated Should return the true or false', () => {
      const state: FtepApprovalConfigState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.ftepApprovalConfigSelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return the true or false', () => {
      const state: FtepApprovalConfigState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.ftepApprovalConfigSelectors.selectTotalElement.projector(
          state
        )
      ).toEqual(10);
    });

    it('selectCnTypeList  Should return the CN Type', () => {
      const state: FtepApprovalConfigState = {
        ...initialState,
        roleList: roleList
      };
      expect(
        selectors.ftepApprovalConfigSelectors.selectRoleList.projector(state)
      ).toEqual(roleList);
    });
  });
});
