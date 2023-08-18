// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  RoRequestApprovalListResponse,
  BoutiqueRoRequestApprovalList
} from '@poss-web/shared/models';

import { initialState } from './ro-request-approvals.reducer';
import * as selectors from './ro-request-approvals.selectors';

import { RoRequestApprovalState } from './ro-request-approvals.state';
import { RequestListEntity } from './ro-request-approvals.entity';

describe('RoRequestApprovalState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing RoRequestApprovalState related Selectors', () => {
    it('selectRejectedRoRequestList Should return the ro request list', () => {
      const roRequestApprovalListResponse: RoRequestApprovalListResponse[] = [
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
      const state: RoRequestApprovalState = {
        ...initialState,
        rejectedRoRequestList: roRequestApprovalListResponse
      };
      expect(
        selectors.roRequestApprovalsSelectors.selectRejectedRoRequestList.projector(
          state
        )
      ).toEqual(roRequestApprovalListResponse);
    });

    it('selectApprovedRoRequestList Should return the ro request list', () => {
      const roRequestApprovalListResponse: RoRequestApprovalListResponse[] = [
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
      const state: RoRequestApprovalState = {
        ...initialState,
        approvedRoRequestList: roRequestApprovalListResponse
      };
      expect(
        selectors.roRequestApprovalsSelectors.selectApprovedRoRequestList.projector(
          state
        )
      ).toEqual(roRequestApprovalListResponse);
    });

    it('selectBoutiqueRoRequestList Should return the ro request list', () => {
      const roRequestApprovalListResponse: BoutiqueRoRequestApprovalList[] = [
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
      ];
      const state: RoRequestApprovalState = {
        ...initialState,
        boutiqueRequestList: roRequestApprovalListResponse
      };
      expect(
        selectors.roRequestApprovalsSelectors.selectBoutiqueRoRequestList.projector(
          state
        )
      ).toEqual(roRequestApprovalListResponse);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: RoRequestApprovalState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.roRequestApprovalsSelectors.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: RoRequestApprovalState = {
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
        selectors.roRequestApprovalsSelectors.selectError.projector(state)
      ).toEqual(error);
    });

    it('selectHasupdated Should return the true or false', () => {
      const state: RoRequestApprovalState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.roRequestApprovalsSelectors.selectHasupdated.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return total elements', () => {
      const state: RoRequestApprovalState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.roRequestApprovalsSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(10);
    });
  });
});
