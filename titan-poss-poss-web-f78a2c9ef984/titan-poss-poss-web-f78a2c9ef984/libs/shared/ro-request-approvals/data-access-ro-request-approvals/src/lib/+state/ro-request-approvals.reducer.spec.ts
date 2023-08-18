//you should simply assert that you get the right state given the provided inputs.

import * as actions from './ro-request-approvals.actions';

import {
  RoRequestApprovalListRequest,
  BoutiqueRoRequestApprovalListResponse,
  RoRequestApprovalListResponse,
  SaveRoRequestApproval
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  roRequestApprovalReducer,
  initialState
} from './ro-request-approvals.reducer';
import { RoRequestApprovalState } from './ro-request-approvals.state';

describe('roRequestApprovalReducer reducer Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadRoRequestApprovalList ', () => {
    beforeEach(() => {});
    it('Load LoadRoRequestApprovalList should set the isLoading to true', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT'
      };

      const action = new actions.LoadRoRequestApprovalList(payload);

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadRoRequestApprovalListSuccess should return list of ro request', () => {
      const payload: BoutiqueRoRequestApprovalListResponse = {
        requestList: [
          {
            amount: 100,
            approvedBy: 'commercial',
            approvedDate: '10',
            id: '1',
            reqNo: '1',
            requestedBy: 'rso',
            fiscalYear: '2020',
            requestedDate: '9',
            requestTime: '11',
            cashierName: 'rso',
            customerName: 'Sharath',
            customerMobileNumber: 12345567890,
            requestorReason: 'RO',
            status: 'PENDING',
            remarks: ''
          }
        ],
        totalElements: 10
      };

      const action = new actions.LoadRoRequestApprovalListSuccess(payload);

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.boutiqueRequestList.length).toBe(1);
    });
    it('LoadRoRequestApprovalListFailure should return error', () => {
      const action = new actions.LoadRoRequestApprovalListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadPendingRoRequestApprovalList ', () => {
    beforeEach(() => {});
    it('Load LoadPendingRoRequestApprovalList should set the isLoading to true', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT'
      };

      const action = new actions.LoadPendingRoRequestApprovalList(payload);

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadPendingRoRequestApprovalListSuccess should return list of ro request', () => {
      const payload: RoRequestApprovalListResponse[] = [
        {
          approvedBy: '',
          approvedDate: 1,
          remarks: '',
          docDate: '11',
          reqNo: 11,
          fiscalYear: 2020,
          amount: 1000,
          customerName: 'rso',
          customerTitle: 'rso',
          customerMobileNumber: 123467890,
          cashierId: '1',
          customerId: '1',
          locationCode: 'URB',
          processId: '111',
          cashierName: 'rso',
          requestedDate: '22',
          requestorReason: 'RO',
          taskId: '111',
          taskName: 'TEST',
          workflowType: 'APPROVE_RO_PAYMENT',
          requestTime: '11',
          totalElements: 1,
          approvalStatus: 'PENDING'
        }
      ];

      const action = new actions.LoadPendingRoRequestApprovalListSuccess(
        payload
      );

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.pendingRoRequestList.ids.length).toBe(1);
    });
    it('LoadPendingRoRequestApprovalListFailure should return error', () => {
      const action = new actions.LoadPendingRoRequestApprovalListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadApprovedRoRequestList ', () => {
    beforeEach(() => {});
    it('Load LoadApprovedRoRequestList should set the isLoading to true', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'APPROVED',
        workflowType: 'APPROVE_RO_PAYMENT'
      };

      const action = new actions.LoadApprovedRoRequestList(payload);

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadApprovedRoRequestListSuccess should return list of ro request', () => {
      const payload: RoRequestApprovalListResponse[] = [
        {
          approvedBy: '',
          approvedDate: 1,
          remarks: '',
          docDate: '11',
          reqNo: 11,
          fiscalYear: 2020,
          amount: 1000,
          customerName: 'rso',
          customerTitle: 'rso',
          customerMobileNumber: 123467890,
          cashierId: '1',
          customerId: '1',
          locationCode: 'URB',
          processId: '111',
          cashierName: 'rso',
          requestedDate: '22',
          requestorReason: 'RO',
          taskId: '111',
          taskName: 'TEST',
          workflowType: 'APPROVE_RO_PAYMENT',
          requestTime: '11',
          totalElements: 1,
          approvalStatus: 'PENDING'
        }
      ];

      const action = new actions.LoadApprovedRoRequestListSuccess(payload);

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.approvedRoRequestList.length).toBe(1);
    });
    it('LoadApprovedRoRequestListFailure should return error', () => {
      const action = new actions.LoadApprovedRoRequestListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadRejectedRoRequestApprovalList ', () => {
    beforeEach(() => {});
    it('Load LoadRejectedRoRequestApprovalList should set the isLoading to true', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'REJECTED',
        workflowType: 'APPROVE_RO_PAYMENT'
      };

      const action = new actions.LoadApprovedRoRequestList(payload);

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadRejectedRoRequestApprovalListSuccess should return list of ro request', () => {
      const payload: RoRequestApprovalListResponse[] = [
        {
          approvedBy: '',
          approvedDate: 1,
          remarks: '',
          docDate: '11',
          reqNo: 11,
          fiscalYear: 2020,
          amount: 1000,
          customerName: 'rso',
          customerTitle: 'rso',
          customerMobileNumber: 123467890,
          cashierId: '1',
          customerId: '1',
          locationCode: 'URB',
          processId: '111',
          cashierName: 'rso',
          requestedDate: '22',
          requestorReason: 'RO',
          taskId: '111',
          taskName: 'TEST',
          workflowType: 'APPROVE_RO_PAYMENT',
          requestTime: '11',
          totalElements: 1,
          approvalStatus: 'PENDING'
        }
      ];

      const action = new actions.LoadRejectedRoRequestApprovalListSuccess(
        payload
      );

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.rejectedRoRequestList.length).toBe(1);
    });
    it('LoadRejectedRoRequestApprovalListFailure should return error', () => {
      const action = new actions.LoadRejectedRoRequestApprovalListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveRoRequestApprovalStatus ', () => {
    beforeEach(() => {});
    it('Load SaveRoRequestApprovalStatus should set the isLoading to true', () => {
      const payload: SaveRoRequestApproval = {
        bulkApproverRequestObjectDto: [
          {
            approved: true,
            approverRemarks: 'APPROVING IT',
            taskId: '1',
            processId: '1',
            taskName: 'task'
          }
        ]
      };

      const action = new actions.SaveRoRequestApprovalStatus(payload);

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SaveRoRequestApprovalStatusSuccess should return list of saved ro request ids ', () => {
      const payload = ['1'];

      const action = new actions.SaveRoRequestApprovalStatusSuccess(payload);

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
    });
    it('SaveRoRequestApprovalStatusFailure should return error', () => {
      const action = new actions.SaveRoRequestApprovalStatusFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: RoRequestApprovalState = roRequestApprovalReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });
});
