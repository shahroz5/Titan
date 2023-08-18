//you should simply assert that you get the right state given the provided inputs.

import * as actions from './cn-approvals.action';

import {
  CnApprovalListRequest,
  CnApprovalListResponse,
  SaveCnApproval
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { cnApprovalsReducer, initialState } from './cn-approvals.reducer';
import { CnApprovalState } from './cn-approvals.state';

describe('cnApprovalsReducer  Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadCnApprovalsList ', () => {
    beforeEach(() => {});
    it('Load LoadCnApprovalsList should set the isLoading to true', () => {
      const payload: CnApprovalListRequest = {
        approvalStatus: 'PENDING',
        filterOptions: {
          fiscalYear: 2020,
          dateRangeType: 'CUSTOM'
        },
        workflowType: 'CREDIT_NOTE_ACTIVATE',
        pageIndex: 0,
        pageSize: 10
      };
      const action = new actions.LoadCnApprovalsList(payload);

      const result: CnApprovalState = cnApprovalsReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadCnApprovalsListSuccess should return cn approval request list and isLoading false', () => {
      const payload: CnApprovalListResponse[] = [
        {
          locationCode: 'CPD',
          cnNumber: '1',
          fiscalYear: '2020',
          cnType: 'ACTIVATE',
          cnDate: '21/06/2021',
          customerName: 'ABC',
          customerMobileNumber: '8976542378',
          amount: '1000',
          requestedBy: 'CPD',
          requestedType: 'ACTIVATE',
          suspendedDate: '20/06/2021',
          requestorRemarks: 11,
          remarks: 'OK',
          processId: '22',
          taskId: '33',
          taskName: 'TEST',
          totalElements: 10
        }
      ];

      const action = new actions.LoadCnApprovalsListSuccess(payload);

      const result: CnApprovalState = cnApprovalsReducer(initialState, action);

      expect(result.isLoading).toBe(false);
    });
    it('LoadCnApprovalsListFailure should return error', () => {
      const action = new actions.LoadCnApprovalsListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CnApprovalState = cnApprovalsReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveCnApprovalStatus ', () => {
    beforeEach(() => {});
    it('Load SaveCnApprovalStatus should set the isLoading to true', () => {
      const payload: SaveCnApproval = {
        bulkApproverRequestObjectDto: [
          {
            approvedData: {
              data: 'ok',
              type: 'string'
            },
            approved: true,
            approverRemarks: 'test',
            processId: '11',
            taskId: '22',
            taskName: 'ABc'
          }
        ]
      };
      const action = new actions.SaveCnApprovalStatus(payload);

      const result: CnApprovalState = cnApprovalsReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SaveCnApprovalStatusSuccess should return cn approval request list and isLoading false', () => {
      const payload = ['1', '2'];

      const action = new actions.SaveCnApprovalStatusSuccess(payload);

      const result: CnApprovalState = cnApprovalsReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
    });
    it('SaveCnApprovalStatusFailure should return error', () => {
      const action = new actions.SaveCnApprovalStatusFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CnApprovalState = cnApprovalsReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result: CnApprovalState = cnApprovalsReducer(
        initialState,
        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
