import {
  CtAcceptAdvanceActionTypes,
  InitiateAdvance,
  InitiateAdvancesFailure,
  InitiateAdvancesSuccess,
  LoadRSODetails,
  LoadRSODetailsFailure,
  LoadRSODetailsSuccess,
  PartiallyUpdateAdvance,
  PartiallyUpdateAdvanceFailure,
  PartiallyUpdateAdvanceSuccess,
  ResetAcceptAdvance,
  SetRemarks,
  SetSelectedRsoName,
  SetTotalAmount,
  UpdateAdvance,
  UpdateAdvanceFailure,
  UpdateAdvanceSuccess
} from './ct-accept-advance.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  InitiateAdvanceResponse,
  UpdateAdvanceRequestPayload,
  UpdateAdvanceTransactionResponse,
  PartialUpdateAdvanceRequestPayload,
  RsoNameObject
} from '@poss-web/shared/models';

describe('Actions Testing Suite', () => {
  describe('SetSelectedRsoName Action Test Cases', () => {
    it('should check correct type is used for SetSelectedRsoName action ', () => {
      const action = new SetSelectedRsoName({ value: '', description: '' });
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.SET_SELECTED_RSO_NAME,
        payload: { value: '', description: '' }
      });
    });
  });
  describe('SetTotalAmount Action Test Cases', () => {
    it('should check correct type is used for SetTotalAmount action ', () => {
      const action = new SetTotalAmount(10000);
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.SET_TOTAL_AMOUNT,
        payload: 10000
      });
    });
  });
  describe('ResetAcceptAdvance Action Test Cases', () => {
    it('should check correct type is used for ResetAcceptAdvance action ', () => {
      const action = new ResetAcceptAdvance();
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.RESET_ACCEPT_ADVANCE
      });
    });
  });
  describe('SetRemarks Action Test Cases', () => {
    it('should check correct type is used for SetRemarks action ', () => {
      const action = new SetRemarks('Test Remarks');
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.SET_REMARKS,
        payload: 'Test Remarks'
      });
    });
  });
  describe('LoadRsoDetails Action Test Cases', () => {
    it('should check correct type is used for LoadRsoDetails action ', () => {
      const action = new LoadRSODetails('RSO');
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.LOAD_RSO_DETAILS,
        payload: 'RSO'
      });
    });
    it('should check correct type is used for LoadRsoDetailsSuccess action ', () => {
      const rsoDetailsResponse: RsoNameObject[] = [
        {
          value: 'rso.urb.2',
          description: 'rso.urb.2'
        }
      ];
      const action = new LoadRSODetailsSuccess(rsoDetailsResponse);
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.LOAD_RSO_DETAILS_SUCCESS,
        payload: rsoDetailsResponse
      });
    });
    it('should check correct type is used for  LoadRsoDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRSODetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.LOAD_RSO_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('InitiateAdvance Action Test Cases', () => {
    it('should check correct type is used for InitiateAdvance action ', () => {
      const action = new InitiateAdvance();
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.INITIATE_ADVANCE
      });
    });
    it('should check correct type is used for InitiateAdvanceSuccess action ', () => {
      const initiateAdvanceResponse: InitiateAdvanceResponse = {
        docNo: 123,
        id: '',
        status: '',
        subTxnType: '',
        txnType: ''
      };
      const action = new InitiateAdvancesSuccess(initiateAdvanceResponse);
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.INITIATE_ADVANCE_SUCCESS,
        payload: initiateAdvanceResponse
      });
    });
    it('should check correct type is used for  InitiateAdvanceFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new InitiateAdvancesFailure(payload);
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.INITIATE_ADVANCE_FAILURE,
        payload
      });
    });
  });
  describe('UpdateAdvance Action Test Cases', () => {
    it('should check correct type is used for UpdateAdvance action ', () => {
      const updateAdvancePayload: UpdateAdvanceRequestPayload = {
        customerId: 0,
        paidValue: 10000,
        remarks: 'sadasfsf',
        weightAgreed: 2
      };
      const action = new UpdateAdvance('', updateAdvancePayload);
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.UPDATE_ADVANCE,
        id: '',
        requestPayload: updateAdvancePayload
      });
    });
    it('should check correct type is used for UpdateAdvanceSuccess action ', () => {
      const updateAdvanceSuccessResponse: UpdateAdvanceTransactionResponse = {
        cndocNos: [],
        docNo: 0,
        id: ''
      };
      const action = new UpdateAdvanceSuccess(updateAdvanceSuccessResponse);
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.UPDATE_ADVANCE_SUCCESS,
        payload: updateAdvanceSuccessResponse
      });
    });
    it('should check correct type is used for  UpdateAdvanceFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateAdvanceFailure(payload);
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.UPDATE_ADVANCE_FAILURE,
        payload
      });
    });
  });
  describe('PartiallyUpdateAdvance Action Test Cases', () => {
    it('should check correct type is used for PartiallyUpdateAdvance action ', () => {
      const partialUpdateAdvanceRequestPayload: PartialUpdateAdvanceRequestPayload = {
        customerId: 625
      };
      const action = new PartiallyUpdateAdvance(
        '',
        partialUpdateAdvanceRequestPayload
      );
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.PARTIALLY_UPDATE_ADVANCE,
        id: '',
        requestPayload: partialUpdateAdvanceRequestPayload
      });
    });
    it('should check correct type is used for PartiallyUpdateAdvanceSuccess action ', () => {
      const action = new PartiallyUpdateAdvanceSuccess({});
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.PARTIALLY_UPDATE_ADVANCE_SUCCESS,
        payload: {}
      });
    });
    it('should check correct type is used for  PartiallyUpdateAdvanceFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PartiallyUpdateAdvanceFailure(payload);
      expect({ ...action }).toEqual({
        type: CtAcceptAdvanceActionTypes.PARTIALLY_UPDATE_ADVANCE_FAILURE,
        payload
      });
    });
  });
});
