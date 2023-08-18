import { LoadABRequests, LoadABRequestsSuccess } from './ab-requests.actions';
//you should simply assert that you get the right state given the provided inputs.

import * as actions from './ab-requests.actions';


import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ABRequestsReducer,
  initialState
} from './ab-requests.reducer';
import { AbRequestsState } from './ab-requests.state';

describe('RequestApprovalReducer reducer Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadAbRequestApprovalList ', () => {
    beforeEach(() => {});
    it('Load LoadRequestApprovalList should set the isLoading to true', () => {
      const payload = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT',
        body:{}
      };

      const action = new actions.LoadABRequests(payload);

      const result: AbRequestsState = ABRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadRoRequestApprovalListSuccess should return list of ro request', () => {
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
      const action = new actions.LoadABRequestsSuccess(payload);

      const result: AbRequestsState = ABRequestsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);

    });
    it('LoadRequestApprovalListFailure should return error', () => {
      const action = new actions.LoadABRequestsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: AbRequestsState = ABRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing savApprovalt ', () => {
    beforeEach(() => {});
    it('Load savApproval should set the isLoading to true', () => {
      const payload = {
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
      const action = new actions.ApproveABRequests(payload);

      const result: AbRequestsState = ABRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('ApproveSuccess should return list of ro request', () => {
      const payload = {
        data:null,
        docNo:9
      };
      const action = new actions.ApproveABRequestsSuccess(payload);

      const result: AbRequestsState = ABRequestsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);

    });
    it('ApproveFailure should return error', () => {
      const action = new actions.ApproveABRequestsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: AbRequestsState = ABRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing LocationList ', () => {
    beforeEach(() => {});
    it('Load LoadlocationList should set the isLoading to true', () => {


      const action = new actions.LoadLocation;

      const result: AbRequestsState = ABRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadLocationListSuccess should return list of location request', () => {
      const payload= null
      const action = new actions.LoadLocationSuccess(payload);

      const result: AbRequestsState = ABRequestsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);

    });
    it('LoadLocationFailure should return error', () => {
      const action = new actions.LoadLocationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: AbRequestsState = ABRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toEqual(false);
    });

    it('Reset ()', () => {


      const action = new actions.Reset();

      const result: AbRequestsState = ABRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(false);
    });
  });


  // describe('Testing SaveRoRequestApprovalStatus ', () => {
  //   beforeEach(() => {});
  //   it('Load SaveRoRequestApprovalStatus should set the isLoading to true', () => {
  //     const payload: SaveRoRequestApproval = {
  //       bulkApproverRequestObjectDto: [
  //         {
  //           approved: true,
  //           approverRemarks: 'APPROVING IT',
  //           taskId: '1',
  //           processId: '1',
  //           taskName: 'task'
  //         }
  //       ]
  //     };

  //     const action = new actions.SaveRoRequestApprovalStatus(payload);

  //     const result: RoRequestApprovalState = roRequestApprovalReducer(
  //       testState,
  //       action
  //     );

  //     expect(result.isLoading).toBe(true);
  //   });
  //   it('SaveRoRequestApprovalStatusSuccess should return list of saved ro request ids ', () => {
  //     const payload = ['1'];

  //     const action = new actions.SaveRoRequestApprovalStatusSuccess(payload);

  //     const result: RoRequestApprovalState = roRequestApprovalReducer(
  //       initialState,
  //       action
  //     );

  //     expect(result.isLoading).toBe(false);
  //   });
  //   it('SaveRoRequestApprovalStatusFailure should return error', () => {
  //     const action = new actions.SaveRoRequestApprovalStatusFailure(
  //       CustomErrorAdaptor.fromJson(Error('some error'))
  //     );

  //     const result: RoRequestApprovalState = roRequestApprovalReducer(
  //       testState,
  //       action
  //     );

  //     expect(result.error.message).toEqual('some error');
  //   });
  // });
});
