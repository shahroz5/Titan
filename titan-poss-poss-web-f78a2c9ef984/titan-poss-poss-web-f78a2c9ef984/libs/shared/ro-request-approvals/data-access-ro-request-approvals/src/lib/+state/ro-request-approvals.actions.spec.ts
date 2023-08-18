import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  RoRequestApprovalListRequest,
  BoutiqueRoRequestApprovalListResponse,
  RoRequestApprovalListResponse,
  SaveRoRequestApproval
} from '@poss-web/shared/models';
import {
  RoRequestApprovalActionTypes,
  LoadReset,
  LoadRoRequestApprovalList,
  LoadRoRequestApprovalListSuccess,
  LoadRoRequestApprovalListFailure,
  LoadPendingRoRequestApprovalList,
  LoadPendingRoRequestApprovalListSuccess,
  LoadPendingRoRequestApprovalListFailure,
  LoadApprovedRoRequestListSuccess,
  LoadApprovedRoRequestListFailure,
  LoadApprovedRoRequestList,
  LoadRejectedRoRequestApprovalList,
  LoadRejectedRoRequestApprovalListFailure,
  LoadRejectedRoRequestApprovalListSuccess,
  SaveRoRequestApprovalStatus,
  SaveRoRequestApprovalStatusSuccess,
  SaveRoRequestApprovalStatusFailure
} from './ro-request-approvals.actions';

describe('RoRequestApproval  Action Testing Suite', () => {
  describe('LoadRoRequestApprovalList Action Test Cases', () => {
    it('should check correct type is used for  LoadRoRequestApprovalList action ', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT'
      };

      const action = new LoadRoRequestApprovalList(payload);
      expect({ ...action }).toEqual({
        type: RoRequestApprovalActionTypes.LOAD_RO_REQUEST_APPROVAL_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadRoRequestApprovalListSuccess action ', () => {
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
            remarks: 'OK'
          }
        ],
        totalElements: 10
      };
      const action = new LoadRoRequestApprovalListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          RoRequestApprovalActionTypes.LOAD_RO_REQUEST_APPROVAL_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadRoRequestApprovalListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRoRequestApprovalListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          RoRequestApprovalActionTypes.LOAD_RO_REQUEST_APPROVAL_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadPendingRoRequestApprovalList Action Test Cases', () => {
    it('should check correct type is used for  LoadPendingRoRequestApprovalList action ', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT'
      };
      const action = new LoadPendingRoRequestApprovalList(payload);
      expect({ ...action }).toEqual({
        type:
          RoRequestApprovalActionTypes.LOAD_PENDING_RO_REQUEST_APPROVAL_LIST,
        payload
      });
    });
    it('should check correct type is used for LoadPendingRoRequestApprovalListSuccess action ', () => {
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

      const action = new LoadPendingRoRequestApprovalListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          RoRequestApprovalActionTypes.LOAD_PENDING_RO_REQUEST_APPROVAL_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPendingRoRequestApprovalListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPendingRoRequestApprovalListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          RoRequestApprovalActionTypes.LOAD_PENDING_RO_REQUEST_APPROVAL_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadApprovedRoRequestList Action Test Cases', () => {
    it('should check correct type is used for  LoadApprovedRoRequestList action ', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT'
      };
      const action = new LoadApprovedRoRequestList(payload);
      expect({ ...action }).toEqual({
        type: RoRequestApprovalActionTypes.LOAD_APPROVED_RO_REQUEST_LIST,
        payload
      });
    });
    it('should check correct type is used for LoadApprovedRoRequestListSuccess action ', () => {
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

      const action = new LoadApprovedRoRequestListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          RoRequestApprovalActionTypes.LOAD_APPROVED_RO_REQUEST_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadApprovedRoRequestListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadApprovedRoRequestListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          RoRequestApprovalActionTypes.LOAD_APPROVED_RO_REQUEST_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadRejectedRoRequestApprovalList Action Test Cases', () => {
    it('should check correct type is used for  LoadRejectedRoRequestApprovalList action ', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'REJECTED',
        workflowType: 'APPROVE_RO_PAYMENT'
      };
      const action = new LoadRejectedRoRequestApprovalList(payload);
      expect({ ...action }).toEqual({
        type:
          RoRequestApprovalActionTypes.LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST,
        payload
      });
    });
    it('should check correct type is used for LoadPendingRoRequestApprovalListSuccess action ', () => {
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

      const action = new LoadRejectedRoRequestApprovalListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          RoRequestApprovalActionTypes.LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPendingRoRequestApprovalListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRejectedRoRequestApprovalListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          RoRequestApprovalActionTypes.LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SaveRoRequestApprovalStatus Action Test Cases', () => {
    it('should check correct type is used for  SaveRoRequestApprovalStatus action ', () => {
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
      const action = new SaveRoRequestApprovalStatus(payload);
      expect({ ...action }).toEqual({
        type: RoRequestApprovalActionTypes.SAVE_RO_REQUEST_APPROVAL_STATUS,
        payload
      });
    });
    it('should check correct type is used for SaveRoRequestApprovalStatusSuccess action ', () => {
      const payload = ['1'];
      const action = new SaveRoRequestApprovalStatusSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          RoRequestApprovalActionTypes.SAVE_RO_REQUEST_APPROVAL_STATUS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveRoRequestApprovalStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveRoRequestApprovalStatusFailure(payload);

      expect({ ...action }).toEqual({
        type:
          RoRequestApprovalActionTypes.SAVE_RO_REQUEST_APPROVAL_STATUS_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: RoRequestApprovalActionTypes.LOAD_RESET
      });
    });
  });
});
