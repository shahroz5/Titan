import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  CnApprovalListRequest,
  CnApprovalListResponse,
  SaveCnApproval
} from '@poss-web/shared/models';

import {
  LoadReset,
  LoadCnApprovalsList,
  LoadCnApprovalsListSuccess,
  LoadCnApprovalsListFailure,
  CnApprovalActionTypes,
  SaveCnApprovalStatus,
  SaveCnApprovalStatusSuccess,
  SaveCnApprovalStatusFailure
} from './cn-approvals.action';

describe('CnApprovalActionTypes  Action Testing Suite', () => {
  describe('LoadCnApprovalsList Action Test Cases', () => {
    it('should check correct type is used for  LoadCnApprovalsList action ', () => {
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

      const action = new LoadCnApprovalsList(payload);
      expect({ ...action }).toEqual({
        type: CnApprovalActionTypes.LOAD_CN_APPROVALS_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadCnApprovalsListSuccess action ', () => {
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

      const action = new LoadCnApprovalsListSuccess(payload);

      expect({ ...action }).toEqual({
        type: CnApprovalActionTypes.LOAD_CN_APPROVALS_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCnApprovalsListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCnApprovalsListFailure(payload);

      expect({ ...action }).toEqual({
        type: CnApprovalActionTypes.LOAD_CN_APPROVALS_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SaveCnApprovalStatus Action Test Cases', () => {
    it('should check correct type is used for  SaveCnApprovalStatus action ', () => {
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

      const action = new SaveCnApprovalStatus(payload);
      expect({ ...action }).toEqual({
        type: CnApprovalActionTypes.SAVE_CN_APPROVAL_STATUS,
        payload
      });
    });
    it('should check correct type is used for  SaveCnApprovalStatusSuccess action ', () => {
      const payload = ['1', '2'];

      const action = new SaveCnApprovalStatusSuccess(payload);

      expect({ ...action }).toEqual({
        type: CnApprovalActionTypes.SAVE_CN_APPROVAL_STATUS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveCnApprovalStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCnApprovalStatusFailure(payload);

      expect({ ...action }).toEqual({
        type: CnApprovalActionTypes.SAVE_CN_APPROVAL_STATUS_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: CnApprovalActionTypes.LOAD_RESET
      });
    });
  });
});
