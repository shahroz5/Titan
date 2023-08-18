import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  RoRequestApprovalListRequest,
  BoutiqueRoRequestApprovalListResponse,
  RoRequestApprovalListResponse,
  SaveRoRequestApproval
} from '@poss-web/shared/models';
import {
  ABRequestsActionsTypes
  , LoadABRequests
  , LoadABRequestsSuccess
  , LoadABRequestsFailure

  , ApproveABRequests
  , ApproveABRequestsFailure
  , ApproveABRequestsSuccess
  , Reset
  , LoadLocation
  , LoadLocationSuccess
  , LoadLocationFailure
} from './ab-requests.actions';

describe('RequestApproval  Action Testing Suite', () => {
  describe('LoadRoRequestApprovalList Action Test Cases', () => {
    it('should check correct type is used for  LoadAbRequestApprovalList action ', () => {
      const payload = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_AB',
        body:{}
      };

      const action = new LoadABRequests(payload);
      expect({ ...action }).toEqual({
        type: ABRequestsActionsTypes.LOAD_AB__REQUESTS,
        payload
      });
    });
    it('should check correct type is used for  LoadRoRequestApprovalListSuccess action ', () => {
      const payload= {
        results: [
          {
            approvedBy: 'Abc',
            invoiceNo:788,
            approvedDate: null,
            approverRemarks: 'Abc',
            docDate:null,
            docNo: 89,
            fiscalYear: 89,
            headerData: null,
            customerName: 'Abc',
            totalAmount: 78999,
            locationCode: 'Abc',
            mobileNumber: 907890000,
            abDocNo: 89,
            processId: 'Abc',
            requestedBy: 'Abc',
            requestedDate: null,
            requestorRemarks: 'Abc',
            taskId: 'Abc',
            taskName: 'Abc',
            workflowType: 'Abc',
          }
        ],
        count: 1
      };
      const action = new LoadABRequestsSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          ABRequestsActionsTypes.LOAD_AB__REQUESTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadAbRequestApprovalListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadABRequestsFailure(payload);

      expect({ ...action }).toEqual({
        type:
        ABRequestsActionsTypes.LOAD_AB__REQUESTS_FAILURE,
        payload
      });
    });
  });





  describe('SaveRequestApprovalStatus Action Test Cases', () => {
    it('should check correct type is used for  SaveRequestApprovalStatus action ', () => {
      const payloadl = {
        approved: 'yes',
  body: {
    approvedData: {
      data: null,
      type:'cm'
    },
    approverRemarks: 'string',
  },
  processId: '4567890',
  taskId: '4567890',
  taskName: 'string',
      };
      const action = new ApproveABRequests(payloadl);
      expect({ ...action }).toEqual({
        type: ABRequestsActionsTypes.APPROVE_AB__REQUESTS,
     payload:payloadl
      });
    });
    it('should check correct type is used for SaveRequestApprovalStatusSuccess action ', () => {
      const payload = {
        data:null,
        docNo:9
      };
      const action = new ApproveABRequestsSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          ABRequestsActionsTypes.APPROVE_AB__REQUESTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveRequestApprovalStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ApproveABRequestsFailure(payload);

      expect({ ...action }).toEqual({
        type:
        ABRequestsActionsTypes.APPROVE_AB__REQUESTS_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new Reset();
      expect({ ...action }).toEqual({
        type: ABRequestsActionsTypes.RESET
      });
    });
  });

  describe('LoadLocation Action Test Cases', () => {
    it('should check correct type is used for  LoadLocation action ', () => {
      const action = new LoadLocation();
      expect({ ...action }).toEqual({
        type: ABRequestsActionsTypes.LOAD_LOCATION
      });
    })
      it('should check correct type is used for  LoadLocationSuccess action ', () => {
        const payload=null
        const action = new LoadLocationSuccess(payload);
        expect({ ...action }).toEqual({
          type: ABRequestsActionsTypes.LOAD_LOCATION_SUCCESS,
          payload
        });
      });
        it('should check correct type is used for  LoadLocationFailure action ', () => {
          const payload: CustomErrors = CustomErrorAdaptor.fromJson(
            Error('Some Error')
          );
          const action = new LoadLocationFailure(payload);
          expect({ ...action }).toEqual({
            type: ABRequestsActionsTypes.LOAD_LOCATION_FAILURE,
            payload
          });

    });
  });
});
