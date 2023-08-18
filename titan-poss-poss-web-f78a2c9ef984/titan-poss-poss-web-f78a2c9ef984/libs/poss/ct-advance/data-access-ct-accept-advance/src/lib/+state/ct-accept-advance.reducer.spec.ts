import { CtAcceptAdvanceState } from './ct-accept-advance.state';
import {
  initialState,
  CtAcceptAdvanceReducer
} from './ct-accept-advance.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './ct-accept-advance.actions';
import {
  InitiateAdvanceResponse,
  PartialUpdateAdvanceRequestPayload,
  UpdateAdvanceRequestPayload,
  UpdateAdvanceTransactionResponse
} from '@poss-web/shared/models';

describe('Accept Advance reducer Testing Suite', () => {
  describe('Testing initiate advance Functionality', () => {
    beforeEach(() => {});
    it('Testing INITIATE_ADVANCE', () => {
      const action = new actions.InitiateAdvance();
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('INITIATE_ADVANCE_SUCCESS should update initiateAdvanceResponse field in state', () => {
      const initiateAdvanceResponse: InitiateAdvanceResponse = {
        docNo: 123,
        id: '',
        status: '',
        subTxnType: '',
        txnType: ''
      };
      const action = new actions.InitiateAdvancesSuccess(
        initiateAdvanceResponse
      );
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.initiateAdvanceResponse).toBe(initiateAdvanceResponse);
    });
    it('INITIATE_ADVANCE_FAILURE should return error', () => {
      const action = new actions.InitiateAdvancesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing LoadRsoDetails Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_RSO_DETAILS', () => {
      const action = new actions.LoadRSODetails('RSO');
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('LOAD_RSO_DETAILS_SUCCESS should update LoadRsoDetailsSucces field in state', () => {
      const action = new actions.LoadRSODetailsSuccess([
        {
          value: 'rso.urb.2',
          description: 'rso.urb.2'
        }
      ]);
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.rsoDetails.length).toBe(1);
    });
    it('LOAD_RSO_DETAILS_FAILURE should return error', () => {
      const action = new actions.LoadRSODetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing update advance Functionality', () => {
    beforeEach(() => {});
    it('Testing UPDATE_ADVANCE', () => {
      const updateAdvancePayload: UpdateAdvanceRequestPayload = {
        customerId: 0,
        paidValue: 10000,
        remarks: 'sadasfsf',
        weightAgreed: 2
      };
      const action = new actions.UpdateAdvance('', updateAdvancePayload);
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('UPDATE_ADVANCE_SUCCESS should update updateAdvanceResponse field in state', () => {
      const updateAdvanceSuccessResponse: UpdateAdvanceTransactionResponse = {
        cndocNos: [],
        docNo: 0,
        id: ''
      };
      const action = new actions.UpdateAdvanceSuccess(
        updateAdvanceSuccessResponse
      );
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.updateAdvanceResponse).toBe(updateAdvanceSuccessResponse);
    });
    it('UPDATE_ADVANCE_FAILURE should return error', () => {
      const action = new actions.UpdateAdvanceFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing ViewAdvance Reducer Functionality', () => {
    beforeEach(() => {});
    it('Testing VIEW_ADVANCE', () => {
      const action = new actions.ViewAdvance('123');
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
      expect(result.viewAdvanceResponse).toBe(null);
    });
    it('VIEW_ADVANCE_SUCCESS should update viewAdvanceResponse field in state', () => {
      const viewAdvanceResponse = {
        docNo: 123
      };
      const action = new actions.ViewAdvanceSuccess(viewAdvanceResponse);
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.viewAdvanceResponse).toBe(viewAdvanceResponse);
    });
    it('VIEW_ADVANCE_FAILURE should return error', () => {
      const action = new actions.ViewAdvanceFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('LoadAdvanceHistory', () => {
    it('LoadAdvanceHistory should return proper state', () => {
      const action = new actions.LoadAdvanceHistory(
        {
          docNo: 123
        },
        '123',
        'docNo',
        'CONFIRMED',
        0,
        10
      );

      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.advanceHistoryItems).toBe(null);
    });

    it('LoadAdvanceHistorySuccess should return proper state', () => {
      const action = new actions.LoadAdvanceHistorySuccess({
        results: [],
        totalElements: 0
      });

      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.advanceHistoryItems).toBeTruthy();
      expect(result.advanceHistoryItems.results.length).toBe(0);
    });

    it('LoadAdvanceHistoryFailure should return error', () => {
      const action = new actions.LoadAdvanceHistoryFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );

      expect(result.errors.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.advanceHistoryItems).toEqual(null);
    });
  });

  describe('DeleteAdvanceTransactionDetails', () => {
    it('DeleteAdvanceTransactionDetails should return proper state', () => {
      const action = new actions.DeleteAdvanceTransactionDetails('123');

      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.deleteAdvanceTransactionResponse).toBe(null);
    });

    it('DeleteAdvanceTransactionDetailsSuccess should return proper state', () => {
      const action = new actions.DeleteAdvanceTransactionDetailsSuccess({
        results: [],
        totalElements: 0
      });

      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.deleteAdvanceTransactionResponse).toBeTruthy();
      expect(result.deleteAdvanceTransactionResponse.results.length).toBe(0);
    });

    it('DeleteAdvanceTransactionDetailsFailure should return error', () => {
      const action = new actions.DeleteAdvanceTransactionDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );

      expect(result.errors.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.deleteAdvanceTransactionResponse).toEqual(null);
    });
  });

  describe('Testing partially update advance Functionality', () => {
    beforeEach(() => {});
    it('Testing PARTIALLY_UPDATE_ADVANCE', () => {
      const partialUpdateAdvanceRequestPayload: PartialUpdateAdvanceRequestPayload = {
        customerId: 625
      };
      const action = new actions.PartiallyUpdateAdvance(
        '',
        partialUpdateAdvanceRequestPayload
      );
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('PARTIALLY_UPDATE_ADVANCE_SUCCESS should update partiallyUpdateAdvanceResponse field in state', () => {
      const action = new actions.PartiallyUpdateAdvanceSuccess(null);
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.partiallyAdvanceResponse).toBe(null);
    });
    it('PARTIALLY_UPDATE_ADVANCE_FAILURE should return error', () => {
      const action = new actions.PartiallyUpdateAdvanceFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
        initialState,
        action
      );
      expect(result.errors.message).toEqual('some error');
    });
  });

  it('SET_SELECTED_RSO_NAME should set selectedRsoName field in state', () => {
    const action = new actions.SetSelectedRsoName({
      value: 'rso.urb.2',
      description: 'rso.urb.2'
    });
    const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
      initialState,
      action
    );
    expect(result.selectedRsoName.value).toBe('rso.urb.2');
    expect(result.errors).toBe(null);
    expect(result.isLoading).toBe(false);
  });

  it('SET_TOTAL_AMOUNT should set totalAmt field in state', () => {
    const action = new actions.SetTotalAmount(10000);
    const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
      initialState,
      action
    );
    expect(result.totalAmt).toBe(10000);
    expect(result.errors).toBe(null);
    expect(result.isLoading).toBe(false);
  });

  it('RESET_ACCEPT_ADVANCE should reset all field in state', () => {
    const action = new actions.ResetAcceptAdvance();
    const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
      initialState,
      action
    );
    expect(result.errors).toBe(null);
    expect(result.isLoading).toBe(false);
    expect(result.totalAmt).toBe(0);
    expect(result.initiateAdvanceResponse).toBe(null);
    expect(result.updateAdvanceResponse).toBe(null);
    expect(result.partiallyAdvanceResponse).toBe(null);
    expect(result.rsoDetails.length).toBe(0);
    expect(result.remarks).toBe('');
  });

  it('SET_REMARKS should set remarks field in state', () => {
    const action = new actions.SetRemarks('Test Remarks');
    const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
      initialState,
      action
    );
    expect(result.remarks).toBe('Test Remarks');
  });

  it('SetHistorySearchParamDetails', () => {
    const action = new actions.SetHistoryAdvanceSearchParamDetails({
      docNo: 123
    });
    const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
      initialState,
      action
    );
    expect(result.historySearchParamDetails).toBeTruthy();
    expect(result.historySearchParamDetails.docNo).toBe(123);
  });

  it('SetOrderNumber', () => {
    const action = new actions.SetOrderNumber(123, 'OPEN');
    const result: CtAcceptAdvanceState = CtAcceptAdvanceReducer(
      initialState,
      action
    );
    expect(result.orderNumber).toBeTruthy();
    expect(result.orderNumber.status).toBe('OPEN');
  });
});
