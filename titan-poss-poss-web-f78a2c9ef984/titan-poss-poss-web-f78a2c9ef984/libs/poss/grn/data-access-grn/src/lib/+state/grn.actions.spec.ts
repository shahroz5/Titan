import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  GrnHistoryPayload,
  GrnHistoryResponse,
  GrnReqStatusListPayload,
  GrnReqStatusListResponse,
  ConfirmGrnPayload,
  ConfirmGrnSuccessPayload,
  GrnReqDetails
} from '@poss-web/shared/models';

import {
  LoadReset,
  LoadGrnHistoryDetails,
  GrnActionTypes,
  LoadGrnHistoryDetailsSuccess,
  LoadGrnHistoryDetailsFailure,
  FilterGrnReqStatusList,
  FilterGrnReqStatusListSuccess,
  FilterGrnReqStatusListFailure,
  LoadGrnReqStatusListFailure,
  LoadGrnReqStatusListSuccess,
  LoadGrnReqStatusList,
  SearchGrnSuccess,
  SearchGrnFailure,
  SearchGrn,
  ConfirmGrnSuccess,
  ConfirmGrnFailure,
  ConfirmGrn,
  LoadGrnDetailsByIdSuccess,
  LoadGrnDetailsByIdFailure,
  LoadGrnDetailsById
} from './grn.actions';

describe('GrnActions  Action Testing Suite', () => {
  describe('LoadGrnHistoryDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadGrnHistoryDetails action ', () => {
      const payload: GrnHistoryPayload = {
        filterOptions: {
          fiscalYear: 2020
        }
      };

      const action = new LoadGrnHistoryDetails(payload);
      expect({ ...action }).toEqual({
        type: GrnActionTypes.LOAD_GRN_HISTORY_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadGrnHistoryDetailsSuccess action ', () => {
      const payload: GrnHistoryResponse = {
        grnHistoryDetails: [],
        totalElements: 0
      };

      const action = new LoadGrnHistoryDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: GrnActionTypes.LOAD_GRN_HISTORY_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadGrnRequestListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGrnHistoryDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: GrnActionTypes.LOAD_GRN_HISTORY_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadGrnReqStatusList Action Test Cases', () => {
    it('should check correct type is used for  LoadGrnReqStatusList action ', () => {
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };
      const action = new LoadGrnReqStatusList(payload);
      expect({ ...action }).toEqual({
        type: GrnActionTypes.LOAD_GRN_REQ_STATUS_LIST,
        payload
      });
    });
    it('should check correct type is used for LoadGrnReqStatusListSuccess action ', () => {
      const payload: GrnReqStatusListResponse = {
        grnReqStatus: [],
        totalElement: 0
      };

      const action = new LoadGrnReqStatusListSuccess(payload);

      expect({ ...action }).toEqual({
        type: GrnActionTypes.LOAD_GRN_REQ_STATUS_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadGrnReqStatusListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGrnReqStatusListFailure(payload);

      expect({ ...action }).toEqual({
        type: GrnActionTypes.LOAD_GRN_REQ_STATUS_LIST_FAILURE,
        payload
      });
    });
  });

  describe('FilterGrnReqStatusList Action Test Cases', () => {
    it('should check correct type is used for  FilterGrnReqStatusList action ', () => {
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };
      const action = new FilterGrnReqStatusList(payload);
      expect({ ...action }).toEqual({
        type: GrnActionTypes.FILTER_GRN_REQ_STATUS_LIST,
        payload
      });
    });
    it('should check correct type is used for FilterGrnReqStatusListSuccess action ', () => {
      const payload: GrnReqStatusListResponse = {
        grnReqStatus: [],
        totalElement: 0
      };

      const action = new FilterGrnReqStatusListSuccess(payload);

      expect({ ...action }).toEqual({
        type: GrnActionTypes.FILTER_GRN_REQ_STATUS_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  FilterGrnReqStatusListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FilterGrnReqStatusListFailure(payload);

      expect({ ...action }).toEqual({
        type: GrnActionTypes.FILTER_GRN_REQ_STATUS_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SearchGrn Action Test Cases', () => {
    it('should check correct type is used for  SearchGrn action ', () => {
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };
      const action = new SearchGrn(payload);
      expect({ ...action }).toEqual({
        type: GrnActionTypes.SEARCH_GRN,
        payload
      });
    });
    it('should check correct type is used for SearchGrnSuccess action ', () => {
      const payload: GrnReqStatusListResponse = {
        grnReqStatus: [],
        totalElement: 0
      };

      const action = new SearchGrnSuccess(payload);

      expect({ ...action }).toEqual({
        type: GrnActionTypes.SEARCH_GRN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchGrnFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchGrnFailure(payload);

      expect({ ...action }).toEqual({
        type: GrnActionTypes.SEARCH_GRN_FAILURE,
        payload
      });
    });
  });

  describe('ConfirmGrn Action Test Cases', () => {
    it('should check correct type is used for  ConfirmGrn action ', () => {
      const payload: ConfirmGrnPayload = {
        data: {
          customerId: '1',
          remarks: 'remarks'
        },
        txnType: 'GRN',
        subTxnType: 'CM',
        grnId: '1'
      };
      const action = new ConfirmGrn(payload);
      expect({ ...action }).toEqual({
        type: GrnActionTypes.CONFIRM_GRN,
        payload
      });
    });
    it('should check correct type is used for SearchGrnSuccess action ', () => {
      const payload: ConfirmGrnSuccessPayload = {
        cnAmt: 1000,
        cndocNos: [1],
        docNo: 1,
        loyaltyReversalPoint: 1,
        id: '55'
      };

      const action = new ConfirmGrnSuccess(payload);

      expect({ ...action }).toEqual({
        type: GrnActionTypes.CONFIRM_GRN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  ConfirmGrnFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmGrnFailure(payload);

      expect({ ...action }).toEqual({
        type: GrnActionTypes.CONFIRM_GRN_FAILURE,
        payload
      });
    });
  });

  describe('LoadGrnDetailsById Action Test Cases', () => {
    it('should check correct type is used for  LoadGrnDetailsById action ', () => {
      const payload = '1';
      const action = new LoadGrnDetailsById(payload);
      expect({ ...action }).toEqual({
        type: GrnActionTypes.LOAD_GRN_DETAILS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadGrnDetailsByIdSuccess action ', () => {
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

      const action = new LoadGrnDetailsByIdSuccess(payload);

      expect({ ...action }).toEqual({
        type: GrnActionTypes.LOAD_GRN_DETAILS_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadGrnDetailsByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGrnDetailsByIdFailure(payload);

      expect({ ...action }).toEqual({
        type: GrnActionTypes.LOAD_GRN_DETAILS_BY_ID_FAILURE,
        payload
      });
    });
  });
  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: GrnActionTypes.LOAD_RESET
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: GrnActionTypes.LOAD_RESET
      });
    });
  });
});
