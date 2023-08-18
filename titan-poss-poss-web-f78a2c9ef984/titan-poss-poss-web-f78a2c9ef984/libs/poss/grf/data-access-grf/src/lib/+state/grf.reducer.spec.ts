import { CtGrfState } from './grf.state';
import { initialState, CtGrfReducer } from './grf.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './grf.actions';
import {
  CreditNote,
  FrozenCNs,
  InitiateGrfResponse,
  MergeCNPayload,
  MergeCNResponse,
  PartialUpdateGrfRequestPayload,
  UpdateGrfRequestPayload,
  UpdateGrfTransactionResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('Grf reducer Testing Suite', () => {
  describe('Testing initiate grf Functionality', () => {
    beforeEach(() => {});
    it('Testing INITIATE_GRF', () => {
      const action = new actions.InitiateGrf('NEW_GRF', null);
      const result: CtGrfState = CtGrfReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('INITIATE_GRF_SUCCESS should update initiateGrfResponse field in state', () => {
      const initiateGrfResponse: InitiateGrfResponse = {
        docNo: 123,
        id: '',
        status: '',
        subTxnType: '',
        txnType: ''
      };
      const action = new actions.InitiateGrfSuccess(initiateGrfResponse);
      const result: CtGrfState = CtGrfReducer(initialState, action);
      expect(result.initiateGrfResponse).toBe(initiateGrfResponse);
    });
    it('INITIATE_GRF_FAILURE should return error', () => {
      const action = new actions.InitiateGrfFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CtGrfState = CtGrfReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing update grf Functionality', () => {
    beforeEach(() => {});
    it('Testing UPDATE_GRF', () => {
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
      const action = new actions.UpdateGrf('NEW_GRF', '', updateGrfPayload);
      const result: CtGrfState = CtGrfReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('UPDATE_GRF_SUCCESS should update updateGrfResponse field in state', () => {
      const updateGrfSuccessResponse: UpdateGrfTransactionResponse = {
        cndocNos: [],
        docNo: 0,
        id: ''
      };
      const action = new actions.UpdateGrfSuccess(updateGrfSuccessResponse);
      const result: CtGrfState = CtGrfReducer(initialState, action);
      expect(result.updateGrfResponse).toBe(updateGrfSuccessResponse);
    });
    it('UPDATE_GRF_FAILURE should return error', () => {
      const action = new actions.UpdateGrfFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CtGrfState = CtGrfReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing partially update grf Functionality', () => {
    beforeEach(() => {});
    it('Testing PARTIALLY_UPDATE_GRF', () => {
      const partialUpdateGrfRequestPayload: PartialUpdateGrfRequestPayload = {
        customerId: 625
      };
      const action = new actions.PartiallyUpdateGrf(
        'NEW_GRF',
        '',
        partialUpdateGrfRequestPayload
      );
      const result: CtGrfState = CtGrfReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('PARTIALLY_UPDATE_GRF_SUCCESS should update partiallyUpdateGrfResponse field in state', () => {
      const action = new actions.PartiallyUpdateGrfSuccess(null);
      const result: CtGrfState = CtGrfReducer(initialState, action);
      expect(result.partiallyGrfResponse).toBe(null);
    });
    it('PARTIALLY_UPDATE_GRF_FAILURE should return error', () => {
      const action = new actions.PartiallyUpdateGrfFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CtGrfState = CtGrfReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing LoadRsoDetails Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_RSO_DETAILS', () => {
      const action = new actions.LoadRsoDetails('RSO');
      const result: CtGrfState = CtGrfReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('LOAD_RSO_DETAILS_SUCCESS should update LoadRsoDetailsSucces field in state', () => {
      const action = new actions.LoadRsoDetailsSuccess([
        {
          value: 'rso.urb.2',
          description: 'rso.urb'
        }
      ]);
      const result: CtGrfState = CtGrfReducer(initialState, action);
      expect(result.rsoDetails.length).toBe(1);
    });
    it('LOAD_RSO_DETAILS_FAILURE should return error', () => {
      const action = new actions.LoadRsoDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CtGrfState = CtGrfReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  it('SET_SELECTED_RSO_NAME should set selectedRsoName field in state', () => {
    const action = new actions.SetSelectedRsoName({
      value: 'abc123',
      description: 'abc123'
    });
    const result: CtGrfState = CtGrfReducer(initialState, action);
    expect(result.selectedRsoName.value).toBe('abc123');
    expect(result.errors).toBe(null);
    expect(result.isLoading).toBe(false);
  });

  it('SET_TOTAL_AMOUNT should set totalAmt field in state', () => {
    const action = new actions.SetTotalAmount(10000);
    const result: CtGrfState = CtGrfReducer(initialState, action);
    expect(result.totalAmt).toBe(10000);
    expect(result.errors).toBe(null);
    expect(result.isLoading).toBe(false);
  });

  it('RESET_GRF should reset all field in state', () => {
    const action = new actions.ResetGrf();
    const result: CtGrfState = CtGrfReducer(initialState, action);
    expect(result.errors).toBe(null);
    expect(result.isLoading).toBe(false);
    expect(result.selectedRsoName).toBe(null);
    expect(result.totalAmt).toBe(0);
    expect(result.initiateGrfResponse).toBe(null);
    expect(result.updateGrfResponse).toBe(null);
    expect(result.partiallyGrfResponse).toBe(null);
    expect(result.goldWeight).toBe(0.0);
    expect(result.rsoDetails.length).toBe(0);
    expect(result.remarks).toBe('');
  });

  it('SET_GOLD_WEIGHT should set goldWeight field in state', () => {
    const action = new actions.SetGoldWeight(2.5);
    const result: CtGrfState = CtGrfReducer(initialState, action);
    expect(result.goldWeight).toBe(2.5);
  });

  it('SET_REMARKS should set remarks field in state', () => {
    const action = new actions.SetRemarks('Test Remarks');
    const result: CtGrfState = CtGrfReducer(initialState, action);
    expect(result.remarks).toBe('Test Remarks');
  });
});
describe('Merging CN Reducer Testing Suite', () => {
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
  describe('LoadFrozenCNs', () => {
    it('LoadFrozenCNs should return proper state', () => {
      const action = new actions.LoadFrozenCNs('123');

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('LoadFrozenCNsSuccess should return proper state', () => {
      const frozenCNs: FrozenCNs[] = [
        {
          docNo: '123',
          fiscalYear: '2021',
          cnDocNo: '123',
          cnFiscalYear: '2021'
        }
      ];
      const action = new actions.LoadFrozenCNsSuccess(frozenCNs);

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
    });

    it('LoadFrozenCNsFailure should return error', () => {
      const action = new actions.LoadFrozenCNsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.errors.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('SearchGRF', () => {
    it('SearchGRF should return proper state', () => {
      const action = new actions.SearchGRF({
        docNo: 'abc123',
        fiscalYear: '2020'
      });

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('SearchGRFSuccess should return proper state', () => {
      const action = new actions.SearchGRFSuccess(response);

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.errors).toBe(null);
    });

    it('SearchGRFFailure should return error', () => {
      const action = new actions.SearchGRFFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.errors.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('MergeCNs', () => {
    it('MergeCNs should return proper state', () => {
      const mergeCNPayload: MergeCNPayload = {
        tempFileIds: { others: ['abc123'] },
        customerId: '12',
        employeeCode: 'URB',
        ids: ['12'],
        remarks: 'abc'
      };
      const action = new actions.MergeCNs(mergeCNPayload);

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });

    it('MergeCNsSuccess should return proper state', () => {
      const mergeCNResponse: MergeCNResponse = {
        amount: 123,
        cnDocNo: 12,
        docNo: 2021,
        id: 'abc123'
      };
      const action = new actions.MergeCNsSuccess(mergeCNResponse);

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.mergeCNsResponse).toBe(mergeCNResponse);
    });

    it('MergeCNsFailure should return error', () => {
      const action = new actions.MergeCNsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.errors.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('GenerateOTP', () => {
    it('GenerateOTP should return proper state', () => {
      const action = new actions.GenerateOTP('12');

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.hasOtpGenerated).toBe(false);
    });

    it('GenerateOTPSuccess should return proper state', () => {
      const action = new actions.GenerateOTPSuccess();

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasOtpGenerated).toBe(true);
    });

    it('GenerateOTPFailure should return error', () => {
      const action = new actions.GenerateOTPFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.errors.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasOtpGenerated).toEqual(false);
    });
  });

  describe('ValidateOTP', () => {
    it('ValidateOTP should return proper state', () => {
      const action = new actions.ValidateOTP({ token: 'abc123', id: 'abc123' });

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasOtpValidated).toBe(false);
    });

    it('ValidateOTPSuccess should return proper state', () => {
      const action = new actions.ValidateOTPSuccess();

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasOtpValidated).toBe(true);
    });

    it('ValidateOTPFailure should return error', () => {
      const action = new actions.ValidateOTPFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.errors.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasOtpValidated).toEqual(false);
    });
  });

  describe('RemoveALLGRFCNs', () => {
    it('RemoveALLGRFCNs should return proper state', () => {
      const action = new actions.RemoveALLGRFCNs();

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.frozenCNs.length).toBe(0);
      expect(result.mergeCNsResponse).toBe(null);
      expect(result.hasOtpGenerated).toBe(false);
      expect(result.hasOtpValidated).toBe(false);
      expect(result.anotherCustomerCN).toBe(null);
    });
  });

  describe('ViewGRF', () => {
    it('ViewGrf should return proper state', () => {
      const action = new actions.ViewGrf('NEW_GRF', '');

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.viewGrfResponse).toBe(null);
    });

    it('ViewGrfSuccess should return proper state', () => {
      const action = new actions.ViewGrfSuccess({
        docNo: 10
      });

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.viewGrfResponse).toBeTruthy();
      expect(result.viewGrfResponse.docNo).toBe(10);
    });

    it('ViewGrfFailure should return error', () => {
      const action = new actions.ViewGrfFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.errors.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.viewGrfResponse).toEqual(null);
    });
  });

  describe('LoadGrfHistory', () => {
    it('LoadGrfHistory should return proper state', () => {
      const action = new actions.LoadGrfHistory(
        'NEW_GRF',
        {
          docNo: 123
        },
        '123',
        'docNo',
        'CONFIRMED',
        0,
        10
      );

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.grfHistoryItems).toBe(null);
    });

    it('LoadGrfHistorySuccess should return proper state', () => {
      const action = new actions.LoadGrfHistorySuccess({
        results: [],
        totalElements: 0
      });

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.grfHistoryItems).toBeTruthy();
      expect(result.grfHistoryItems.results.length).toBe(0);
    });

    it('LoadGrfHistoryFailure should return error', () => {
      const action = new actions.LoadGrfHistoryFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CtGrfState = CtGrfReducer(initialState, action);

      expect(result.errors.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.grfHistoryItems).toEqual(null);
    });
  });

  it('SetHistorySearchParamDetails', () => {
    const action = new actions.SetHistoryGrfSearchParamDetails({
      docNo: 123
    });
    const result: CtGrfState = CtGrfReducer(initialState, action);
    expect(result.historySearchParamDetails).toBeTruthy();
    expect(result.historySearchParamDetails.docNo).toBe(123);
  });

  it('SetOrderNumber', () => {
    const action = new actions.SetOrderNumber(123, 'OPEN');
    const result: CtGrfState = CtGrfReducer(initialState, action);
    expect(result.orderNumber).toBeTruthy();
    expect(result.orderNumber.status).toBe('OPEN');
  });
});
