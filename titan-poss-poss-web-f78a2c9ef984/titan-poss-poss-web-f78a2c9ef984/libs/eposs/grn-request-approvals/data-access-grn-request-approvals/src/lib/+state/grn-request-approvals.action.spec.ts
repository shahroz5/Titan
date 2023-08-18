import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  GrnRequestApprovalListRequest,
  GrnRequestApprovalListResponse,
  SaveGrnRequestApproval
} from '@poss-web/shared/models';

import {
  GrnRequestApprovalActionTypes,
  LoadGrnRequestList,
  LoadGrnRequestListSuccess,
  LoadGrnRequestListFailure,
  SaveGrnRequestApprovalStatus,
  SaveGrnRequestApprovalStatusSuccess,
  SaveGrnRequestApprovalStatusFailure,
  LoadReset
} from './grn-request-approvals.action';

describe('GrnRequestApprovalActions  Action Testing Suite', () => {
  describe('LoadGrnRequestList Action Test Cases', () => {
    it('should check correct type is used for  LoadGrnRequestList action ', () => {
      const payload: GrnRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'GOODS_RETURN',
        pageIndex: 1,
        pageSize: 10
      };

      const action = new LoadGrnRequestList(payload);
      expect({ ...action }).toEqual({
        type: GrnRequestApprovalActionTypes.LOAD_GRN_REQUEST_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadGrnRequestListSuccess action ', () => {
      const payload: GrnRequestApprovalListResponse[] = [];

      const action = new LoadGrnRequestListSuccess(payload);

      expect({ ...action }).toEqual({
        type: GrnRequestApprovalActionTypes.LOAD_GRN_REQUEST_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadGrnRequestListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGrnRequestListFailure(payload);

      expect({ ...action }).toEqual({
        type: GrnRequestApprovalActionTypes.LOAD_GRN_REQUEST_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SaveGrnRequestApprovalStatus Action Test Cases', () => {
    it('should check correct type is used for  SaveGrnRequestApprovalStatus action ', () => {
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
      const action = new SaveGrnRequestApprovalStatus(payload);
      expect({ ...action }).toEqual({
        type: GrnRequestApprovalActionTypes.SAVE_GRN_REQUEST_APPROVAL_STATUS,
        payload
      });
    });
    it('should check correct type is used for SaveGrnRequestApprovalStatusSuccess action ', () => {
      const payload = ['1', '2'];

      const action = new SaveGrnRequestApprovalStatusSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          GrnRequestApprovalActionTypes.SAVE_GRN_REQUEST_APPROVAL_STATUS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveGrnRequestApprovalStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveGrnRequestApprovalStatusFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GrnRequestApprovalActionTypes.SAVE_GRN_REQUEST_APPROVAL_STATUS_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: GrnRequestApprovalActionTypes.LOAD_RESET
      });
    });
  });
});
