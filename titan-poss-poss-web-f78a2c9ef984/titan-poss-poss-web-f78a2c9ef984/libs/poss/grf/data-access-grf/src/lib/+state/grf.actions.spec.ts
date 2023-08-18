import {
  CtGrfActionTypes,
  GenerateOTP,
  GenerateOTPFailure,
  GenerateOTPSuccess,
  InitiateGrf,
  InitiateGrfFailure,
  InitiateGrfSuccess,
  LoadFrozenCNs,
  LoadFrozenCNsFailure,
  LoadFrozenCNsSuccess,
  LoadRsoDetails,
  LoadRsoDetailsFailure,
  LoadRsoDetailsSuccess,
  MergeCNs,
  MergeCNsFailure,
  MergeCNsSuccess,
  PartiallyUpdateGrf,
  PartiallyUpdateGrfFailure,
  PartiallyUpdateGrfSuccess,
  RemoveALLGRFCNs,
  RemoveGRFCN,
  ResetGrf,
  SearchGRF,
  SearchGRFFailure,
  SearchGRFSuccess,
  SetGoldWeight,
  SetRemarks,
  SetSelectedRsoName,
  SetTotalAmount,
  UpdateGrf,
  UpdateGrfFailure,
  UpdateGrfSuccess,
  ValidateOTP,
  ValidateOTPFailure,
  ValidateOTPSuccess
} from './grf.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  InitiateGrfResponse,
  UpdateGrfRequestPayload,
  UpdateGrfTransactionResponse,
  PartialUpdateGrfRequestPayload,
  FrozenCNs,
  CreditNote,
  MergeCNPayload,
  MergeCNResponse,
  RsoNameObject
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('Actions Testing Suite', () => {
  describe('SetSelectedRsoName Action Test Cases', () => {
    it('should check correct type is used for SetSelectedRsoName action ', () => {
      const action = new SetSelectedRsoName({
        value: '123',
        description: 'RSO'
      });
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.SET_SELECTED_RSO_NAME,
        payload: { value: '123', description: 'RSO' }
      });
    });
  });
  describe('SetTotalAmount Action Test Cases', () => {
    it('should check correct type is used for SetTotalAmount action ', () => {
      const action = new SetTotalAmount(10000);
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.SET_TOTAL_AMOUNT,
        payload: 10000
      });
    });
  });
  describe('ResetGrf Action Test Cases', () => {
    it('should check correct type is used for ResetGrf action ', () => {
      const action = new ResetGrf();
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.RESET_GRF
      });
    });
  });
  describe('SetGoldWeight Action Test Cases', () => {
    it('should check correct type is used for SetGoldWeight action ', () => {
      const action = new SetGoldWeight(2.5);
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.SET_GOLD_WEIGHT,
        goldWeight: 2.5
      });
    });
  });
  describe('SetRemarks Action Test Cases', () => {
    it('should check correct type is used for SetRemarks action ', () => {
      const action = new SetRemarks('Test Remarks');
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.SET_REMARKS,
        payload: 'Test Remarks'
      });
    });
  });
  describe('LoadRsoDetails Action Test Cases', () => {
    it('should check correct type is used for LoadRsoDetails action ', () => {
      const action = new LoadRsoDetails('RSO');
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.LOAD_RSO_DETAILS,
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
      const action = new LoadRsoDetailsSuccess(rsoDetailsResponse);
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.LOAD_RSO_DETAILS_SUCCESS,
        payload: rsoDetailsResponse
      });
    });
    it('should check correct type is used for  LoadRsoDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRsoDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.LOAD_RSO_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('InitiateGrf Action Test Cases', () => {
    it('should check correct type is used for InitiateGrf action ', () => {
      const action = new InitiateGrf('NEW_GRF', null);
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.INITIATE_GRF,
        subTransactionType: 'NEW_GRF',
        requestBody: null
      });
    });
    it('should check correct type is used for InitiateGrfSuccess action ', () => {
      const initiateGrfResponse: InitiateGrfResponse = {
        docNo: 123,
        id: '',
        status: '',
        subTxnType: '',
        txnType: ''
      };
      const action = new InitiateGrfSuccess(initiateGrfResponse);
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.INITIATE_GRF_SUCCESS,
        payload: initiateGrfResponse
      });
    });
    it('should check correct type is used for  InitiateGrfFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new InitiateGrfFailure(payload);
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.INITIATE_GRF_FAILURE,
        payload
      });
    });
  });
  describe('UpdateGrf Action Test Cases', () => {
    it('should check correct type is used for UpdateGrf action ', () => {
      const updateGrfPayload: UpdateGrfRequestPayload = {
        customerId: 0,
        paidValue: 10000,
        remarks: 'sadasfsf',
        metalRateList: {
          metalRates: {
            J: {
              metalTypeCode: 'J',
              purity: 92,
              ratePerUnit: 1540,
              applicableDate: Number(new Date().toTimeString()),
              currency: 'INR'
            }
          }
        },
        weightAgreed: 2
      };
      const action = new UpdateGrf('NEW_GRF', '', updateGrfPayload);
      expect({ ...action }).toEqual({
        subTransactionType: 'NEW_GRF',
        type: CtGrfActionTypes.UPDATE_GRF,
        id: '',
        requestPayload: updateGrfPayload
      });
    });
    it('should check correct type is used for UpdateGrfSuccess action ', () => {
      const updateGrfSuccessResponse: UpdateGrfTransactionResponse = {
        cndocNos: [],
        docNo: 0,
        id: ''
      };
      const action = new UpdateGrfSuccess(updateGrfSuccessResponse);
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.UPDATE_GRF_SUCCESS,
        payload: updateGrfSuccessResponse
      });
    });
    it('should check correct type is used for  UpdateGrfFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateGrfFailure(payload);
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.UPDATE_GRF_FAILURE,
        payload
      });
    });
  });
  describe('PartiallyUpdateGrf Action Test Cases', () => {
    it('should check correct type is used for PartiallyUpdateGrf action ', () => {
      const partialUpdateGrfRequestPayload: PartialUpdateGrfRequestPayload = {
        customerId: 625
      };
      const action = new PartiallyUpdateGrf(
        'NEW_GRF',
        '',
        partialUpdateGrfRequestPayload
      );
      expect({ ...action }).toEqual({
        subTransactionType: 'NEW_GRF',
        type: CtGrfActionTypes.PARTIALLY_UPDATE_GRF,
        id: '',
        requestPayload: partialUpdateGrfRequestPayload
      });
    });
    it('should check correct type is used for PartiallyUpdateGrfSuccess action ', () => {
      const action = new PartiallyUpdateGrfSuccess({});
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.PARTIALLY_UPDATE_GRF_SUCCESS,
        payload: {}
      });
    });
    it('should check correct type is used for  PartiallyUpdateGrfFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PartiallyUpdateGrfFailure(payload);
      expect({ ...action }).toEqual({
        type: CtGrfActionTypes.PARTIALLY_UPDATE_GRF_FAILURE,
        payload
      });
    });
  });
});
describe('Merging CNs Action TestCases', () => {
  describe('LoadFrozenCNs Action Test Cases', () => {
    it('should check correct type is used for LoadFrozenCNs action ', () => {
      const action = new LoadFrozenCNs('12');

      expect(action.type).toEqual(CtGrfActionTypes.LOAD_FROZEN_CNS);
      expect(action.payload).toEqual('12');
    });
    it('should check correct type is used for LoadFrozenCNsSuccess action ', () => {
      const response: FrozenCNs[] = [
        {
          docNo: '12',
          fiscalYear: '2020',
          cnDocNo: '12',
          cnFiscalYear: '2021'
        }
      ];
      const action = new LoadFrozenCNsSuccess(response);

      expect(action.type).toEqual(CtGrfActionTypes.LOAD_FROZEN_CNS_SUCCESS);
      expect(action.payload).toEqual(response);
    });
    it('should check correct type is used for  LoadFrozenCNsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFrozenCNsFailure(payload);

      expect(action.type).toEqual(CtGrfActionTypes.LOAD_FROZEN_CNS_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchGRF Action Test Cases', () => {
    it('should check correct type is used for SearchGRF action ', () => {
      const action = new SearchGRF({ docNo: '123', fiscalYear: '123' });

      expect(action.type).toEqual(CtGrfActionTypes.SEARCH_GRF);
      expect(action.payload).toEqual({ docNo: '123', fiscalYear: '123' });
    });
    it('should check correct type is used for SearchGRFSuccess action ', () => {
      const response: CreditNote = {
        amount: 123,
        creditNoteType: 'CN',
        customerId: 12,
        customerName: 'Rama',
        docDate: moment('123'),
        docNo: 12,
        fiscalYear: 2021,
        ratePerUnit: 12,
        weight: 12,
        id: 'abc123',
        linkedTxnId: 'abc123',
        linkedTxnType: 'abc456',
        locationCode: 'CPD',
        mobileNumber: '9010462817',
        status: 'OPEN',
        utilisedAmount: 100,
        workflowStatus: 'OPEN',
        cashCollected: 123
      };
      const action = new SearchGRFSuccess(response);

      expect(action.type).toEqual(CtGrfActionTypes.SEARCH_GRF_SUCCESS);
      expect(action.payload).toEqual(response);
    });
    it('should check correct type is used for SearchGRFFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchGRFFailure(payload);

      expect(action.type).toEqual(CtGrfActionTypes.SEARCH_GRF_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('MergeCNs Action Test Cases', () => {
    it('should check correct type is used for MergeCNs action ', () => {
      const mergeCNPayload: MergeCNPayload = {
        tempFileIds: [{ others: ['abc123'] }],
        customerId: '12',
        employeeCode: 'URB',
        ids: ['12'],
        remarks: 'abc'
      };
      const action = new MergeCNs(mergeCNPayload);

      expect(action.type).toEqual(CtGrfActionTypes.MERGE_CNS);
      expect(action.payload).toEqual(mergeCNPayload);
    });
    it('should check correct type is used for MergeCNsSuccess action ', () => {
      const response: MergeCNResponse = {
        amount: 123,
        cnDocNo: 12,
        docNo: 2021,
        id: 'abc123'
      };
      const action = new MergeCNsSuccess(response);

      expect(action.type).toEqual(CtGrfActionTypes.MERGE_CNS_SUCCESS);
      expect(action.payload).toEqual(response);
    });
    it('should check correct type is used for MergeCNsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new MergeCNsFailure(payload);

      expect(action.type).toEqual(CtGrfActionTypes.MERGE_CNS_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('GenerateOTP Action Test Cases', () => {
    it('should check correct type is used for GenerateOTP action ', () => {
      const action = new GenerateOTP('12');

      expect(action.type).toEqual(CtGrfActionTypes.GENERATE_OTP);
      expect(action.payload).toEqual('12');
    });
    it('should check correct type is used for GenerateOTPSuccess action ', () => {
      const action = new GenerateOTPSuccess();

      expect(action.type).toEqual(CtGrfActionTypes.GENERATE_OTP_SUCCESS);
    });
    it('should check correct type is used for GenerateOTPFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GenerateOTPFailure(payload);

      expect(action.type).toEqual(CtGrfActionTypes.GENERATE_OTP_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ValidateOTP Action Test Cases', () => {
    it('should check correct type is used for ValidateOTP action ', () => {
      const action = new ValidateOTP({ token: 'abc123', id: 'abc123' });

      expect(action.type).toEqual(CtGrfActionTypes.VALIDATE_OTP);
      expect(action.payload).toEqual({ token: 'abc123', id: 'abc123' });
    });
    it('should check correct type is used for ValidateOTPSuccess action ', () => {
      const action = new ValidateOTPSuccess();

      expect(action.type).toEqual(CtGrfActionTypes.VALIDATE_OTP_SUCCESS);
    });
    it('should check correct type is used for ValidateOTPFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ValidateOTPFailure(payload);

      expect(action.type).toEqual(CtGrfActionTypes.VALIDATE_OTP_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('RemoveGRFCN Action Test Cases', () => {
    it('should check correct type is used for RemoveGRFCN action ', () => {
      const action = new RemoveGRFCN('abc123');

      expect(action.type).toEqual(CtGrfActionTypes.REMOVE_GRF_CN);
      expect(action.payload).toEqual('abc123');
    });

    it('should check correct type is used for RemoveALLGRFCNs action ', () => {
      const action = new RemoveALLGRFCNs();

      expect(action.type).toEqual(CtGrfActionTypes.REMOVE_ALL_GRF_CNS);
    });
  });
});
