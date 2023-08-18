//you should simply assert that you get the right state given the provided inputs.

import * as actions from './grn.actions';

import {
  GrnHistoryPayload,
  GrnHistoryResponse,
  GrnReqStatusListPayload,
  GrnReqStatusListResponse,
  ConfirmGrnPayload,
  ConfirmGrnSuccessPayload,
  GrnReqDetails
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { grnReducer, initialState } from './grn.reducer';

describe('grnReducer  Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadGrnHistoryDetails ', () => {
    beforeEach(() => {});
    it('Load LoadGrnHistoryDetails should set the isLoading to true', () => {
      const payload: GrnHistoryPayload = {
        filterOptions: {
          fiscalYear: 2020
        }
      };
      const action = new actions.LoadGrnHistoryDetails(payload);

      const result = grnReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadGrnHistoryDetailsSuccess should return list of grn request and isLoading false', () => {
      const payload: GrnHistoryResponse = {
        grnHistoryDetails: [],
        totalElements: 0
      };

      const action = new actions.LoadGrnHistoryDetailsSuccess(payload);

      const result = grnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.grnHistory).toBe(payload.grnHistoryDetails);
    });
    it('LoadGrnHistoryDetailsFailure should return error', () => {
      const action = new actions.LoadGrnHistoryDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = grnReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadGrnReqStatusList ', () => {
    beforeEach(() => {});
    it('Load LoadGrnReqStatusList should set the isLoading to true', () => {
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };

      const action = new actions.LoadGrnReqStatusList(payload);

      const result = grnReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadGrnReqStatusListSuccess should set isLoading false', () => {
      const payload: GrnReqStatusListResponse = {
        grnReqStatus: [],
        totalElement: 0
      };

      const action = new actions.LoadGrnReqStatusListSuccess(payload);

      const result = grnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.totalElements).toBe(0);
    });
    it('LoadGrnReqStatusListFailure should return error', () => {
      const action = new actions.LoadGrnReqStatusListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = grnReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing FilterGrnReqStatusList ', () => {
    beforeEach(() => {});
    it('Load FilterGrnReqStatusList should set the isLoading to true', () => {
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };

      const action = new actions.FilterGrnReqStatusList(payload);

      const result = grnReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('FilterGrnReqStatusListSuccess should set isLoading false', () => {
      const payload: GrnReqStatusListResponse = {
        grnReqStatus: [],
        totalElement: 0
      };

      const action = new actions.FilterGrnReqStatusListSuccess(payload);

      const result = grnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.totalElements).toBe(0);
    });
    it('FilterGrnReqStatusListFailure should return error', () => {
      const action = new actions.FilterGrnReqStatusListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = grnReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchGrn ', () => {
    beforeEach(() => {});
    it('Load SearchGrn should set the isLoading to true', () => {
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };

      const action = new actions.SearchGrn(payload);

      const result = grnReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SearchGrnSuccess should set isLoading false', () => {
      const payload: GrnReqStatusListResponse = {
        grnReqStatus: [],
        totalElement: 0
      };

      const action = new actions.SearchGrnSuccess(payload);

      const result = grnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.totalElements).toBe(0);
    });
    it('SearchGrnFailure should return error', () => {
      const action = new actions.SearchGrnFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = grnReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ConfirmGrn ', () => {
    beforeEach(() => {});
    it('Load ConfirmGrn should set the isLoading to true', () => {
      const payload: ConfirmGrnPayload = {
        data: {
          customerId: '1',
          remarks: 'remarks'
        },
        txnType: 'GRN',
        subTxnType: 'CM',
        grnId: '1'
      };

      const action = new actions.ConfirmGrn(payload);

      const result = grnReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('ConfirmGrnSuccess should set isLoading false', () => {
      const payload: ConfirmGrnSuccessPayload = {
        cnAmt: 1000,
        cndocNos: [1],
        docNo: 1,
        loyaltyReversalPoint: 1,
        id: '55'
      };

      const action = new actions.ConfirmGrnSuccess(payload);

      const result = grnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
    });
    it('ConfirmGrnFailure should return error', () => {
      const action = new actions.ConfirmGrnFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = grnReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadGrnDetailsById ', () => {
    beforeEach(() => {});
    it('Load LoadGrnDetailsById should set the isLoading to true', () => {
      const payload = '1';

      const action = new actions.LoadGrnDetailsById(payload);

      const result = grnReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadGrnDetailsByIdSuccess should set isLoading false', () => {
      const payload: GrnReqDetails = {
        txnType: 'GRN',
        subTxnType: 'CM',
        boutiqueCode: 'URB',
        boutiqueName: 'BANGLORE',
        fiscalYear: '2020',
        cmNumber: '100',
        cmDate: '12',
        invoicedGoldRate: '1',
        invoicedPlatinumRate: '2',
        productDetails: [],
        cmNetAmount: '22',
        otherCharges: '11',
        encirclePoints: '3',
        tcsTobeRefund: '100',
        focRecoveredValue: '222',
        grnType: 'MFG',
        reasonForCancellation: 'DONT WANT',
        approver: 'SM',
        reason: 'QUALITY ISSUE',
        time: '1',
        status: 'PENDING',
        totalReturnProduct: '1',
        totalReturnGrn: '1000',
        customerId: '1'
      };
      const action = new actions.LoadGrnDetailsByIdSuccess(payload);

      const result = grnReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.grnDetails).toBe(payload);
    });
    it('LoadGrnDetailsByIdFailure should return error', () => {
      const action = new actions.LoadGrnDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = grnReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  // describe('Testing LoadReset ', () => {
  //   beforeEach(() => {});
  //   it('Load LoadReset should reset the state', () => {
  //     const action = new actions.LoadReset();

  //     const result = grnReducer(testState, action);

  //     expect(result).toBe(initialState);
  //   });
  // });
});
