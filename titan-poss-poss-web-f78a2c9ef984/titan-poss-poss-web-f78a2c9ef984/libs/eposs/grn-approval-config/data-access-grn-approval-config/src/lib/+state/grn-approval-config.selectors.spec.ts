import {
  CustomErrors,
  GrnApprovalConfig,
  GrnApprovalConfigResponse
} from '@poss-web/shared/models';

import { initialState } from './grn-approval-config.reducer';
import * as selectors from './grn-approval-config.selectors';

import { GrnApprovalConfigState } from './grn-approval-config.state';

describe('GRN Approval Config selector Testing Suite', () => {
  const roleList = [
    {
      roleCode: 'BOS',
      roleName: 'BOS'
    }
  ];

  const grnApprovalConfigResponse: GrnApprovalConfigResponse = {
    ruleId: '1',
    description: 'GRN_APPROVAL_ACCESS_REGULAR',
    ruleType: 'GRN_APPROVAL_ACCESS_REGULAR',
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
  describe('Testing GRN Approval Config related Selectors', () => {
    it('selectGrnApprovalConfigList Should return the list of GRN approval Config list', () => {
      const state: GrnApprovalConfigState = {
        ...initialState,
        grnApprovalConfigList: [grnApprovalConfigResponse]
      };
      expect(
        selectors.grnApprovalConfigSelectors.selectGrnApprovalConfigList.projector(
          state
        )
      ).toEqual([grnApprovalConfigResponse]);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: GrnApprovalConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.grnApprovalConfigSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: GrnApprovalConfigState = {
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
        selectors.grnApprovalConfigSelectors.selectError.projector(state)
      ).toEqual(error);
    });
    it('selectGrnApprovalConfig Should return the GRN Approval Config object', () => {
      const state: GrnApprovalConfigState = {
        ...initialState,
        grnApprovalConfig: grnApprovalConfigResponse
      };
      expect(
        selectors.grnApprovalConfigSelectors.selectGrnApprovalConfig.projector(
          state
        )
      ).toEqual(grnApprovalConfigResponse);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: GrnApprovalConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.grnApprovalConfigSelectors.selectHassaved.projector(state)
      ).toEqual(true);
    });
    it('selectHasUpdated Should return the true or false', () => {
      const state: GrnApprovalConfigState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.grnApprovalConfigSelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return the true or false', () => {
      const state: GrnApprovalConfigState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.grnApprovalConfigSelectors.selectTotalElement.projector(state)
      ).toEqual(10);
    });

    it('selectCnTypeList  Should return the CN Type', () => {
      const state: GrnApprovalConfigState = {
        ...initialState,
        roleList: roleList
      };
      expect(
        selectors.grnApprovalConfigSelectors.selectRoleList.projector(state)
      ).toEqual(roleList);
    });
  });
});
