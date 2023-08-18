//you should simply assert that you get the right state given the provided inputs.

import * as actions from './grn-request-approvals.action';

import {
  GrnRequestApprovalListRequest,
  GrnRequestApprovalListResponse,
  SaveGrnRequestApproval
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  grnRequestApprovalsReducer,
  initialState
} from './grn-request-approvals.reducer';
import { GrnRequestApprovalState } from './grn-request-approvals.state';

describe('grnRequestApprovalsReducer  Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadGrnRequestList ', () => {
    beforeEach(() => {});
    it('Load LoadGrnRequestList should set the isLoading to true', () => {
      const payload: GrnRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'GOODS_RETURN',
        pageIndex: 1,
        pageSize: 10
      };
      const action = new actions.LoadGrnRequestList(payload);

      const result: GrnRequestApprovalState = grnRequestApprovalsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadGrnRequestListSuccess should return list of grn request and isLoading false', () => {
      const payload: GrnRequestApprovalListResponse[] = [];

      const action = new actions.LoadGrnRequestListSuccess(payload);

      const result: GrnRequestApprovalState = grnRequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
    });
    it('LoadGrnRequestListFailure should return error', () => {
      const action = new actions.LoadGrnRequestListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: GrnRequestApprovalState = grnRequestApprovalsReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveGrnRequestApprovalStatus ', () => {
    beforeEach(() => {});
    it('Load SaveGrnRequestApprovalStatus should set the isLoading to true', () => {
      const payload: SaveGrnRequestApproval = {
        bulkApproverRequestObjectDto: [
          {
            processId: '1',
            taskId: '2',
            taskName: 't',
            approved: true,
            approverRemarks: 'test'
          }
        ]
      };

      const action = new actions.SaveGrnRequestApprovalStatus(payload);

      const result: GrnRequestApprovalState = grnRequestApprovalsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SaveGrnRequestApprovalStatusSuccess should set isLoading false', () => {
      const payload = ['1', '2'];

      const action = new actions.SaveGrnRequestApprovalStatusSuccess(payload);

      const result: GrnRequestApprovalState = grnRequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
    });
    it('SaveGrnRequestApprovalStatusFailure should return error', () => {
      const action = new actions.SaveGrnRequestApprovalStatusFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: GrnRequestApprovalState = grnRequestApprovalsReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('Load LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result: GrnRequestApprovalState = grnRequestApprovalsReducer(
        testState,
        action
      );

      expect(result).toEqual(testState);
    });
  });
});
