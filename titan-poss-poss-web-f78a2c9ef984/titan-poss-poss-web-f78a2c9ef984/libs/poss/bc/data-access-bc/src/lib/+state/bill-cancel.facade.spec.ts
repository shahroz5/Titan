import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  bcHistoryRequestPayload,
  BillCancelPayload,
  CashMemoDetailsRequestPayload,
  CashMemoItemDetailsRequestPayload,
  CmBillListPayload
} from '@poss-web/shared/models';
import {
  CancelRequest,
  CancelType,
  CancelTypePayload,
  ConfirmRequest,
  GetItemfromCashMemo,
  LoadBCHistory,
  LoadCmBillList,
  LoadReasonForCancel,
  LoadRSODetails,
  ResetDetail,
  ResetHistory,
  ResetList,
  SetHistorySearchParamDetails,
  ViewCashMemo
} from './bill-cancel.actions';
import { BillCancelFacade } from './bill-cancel.facade';
import { initialState } from './bill-cancel.reducer';
import { BillCancelState } from './bill-cancel.state';

describe('Bill Cancel facade Testing Suite action', () => {
  let billCancelFacade: BillCancelFacade;

  let store: Store<BillCancelState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), BillCancelFacade]
    });

    billCancelFacade = TestBed.inject(BillCancelFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions', () => {
    const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      subTxnType: 'NEW_CM',
      txnType: 'CM',
      itemId: '741B3399-ED98-44D8-B25D-BBDADCA2F1D2'
    };

    const billCancelPayload: BillCancelPayload = {
      cancelType: 'CANCEL_WITH_CN',
      employeeCode: 'rso',
      reasonForCancellation: 'test',
      refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      remarks: 'test'
    };

    const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      subTxnType: 'NEW_CM',
      txnType: 'CM'
    };

    const cmBillListPayload: CmBillListPayload = {
      subTxnType: 'NEW_CM',
      txnType: 'CM',
      sort: 'docDate, DESC'
      // customerName?: string;
      // refDocNo?: number;
      // pageIndex?: number;
      // pageSize?: number;
    };

    const LOVCode = 'REASON_FOR_CANCELLATION';

    const RSOCode = 'RSO';

    const cancelTypePayload: CancelTypePayload = {
      refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      subTxnType: 'NEW_CM',
      txnType: 'CM'
    };

    const bcHistoryPayload: bcHistoryRequestPayload = {
      docNo: 60,
      fiscalYear: 2020
    };

    it('should call ViewCashMemo action', () => {
      const action = new ViewCashMemo(cashMemoDetailsRequestPayload);
      billCancelFacade.viewCashMemo(cashMemoDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GetItemfromCashMemo action', () => {
      const action = new GetItemfromCashMemo(cashMemoItemDetailsRequestPayload);
      billCancelFacade.getItemFromCashMemo(cashMemoItemDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetList action', () => {
      const action = new ResetList();
      billCancelFacade.resetList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetDetail action', () => {
      const action = new ResetDetail();
      billCancelFacade.resetDetail();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ConfirmRequest action', () => {
      const action = new ConfirmRequest(billCancelPayload);
      billCancelFacade.loadConfirmData(billCancelPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call cancel action', () => {
      const action = new CancelRequest(billCancelPayload);
      billCancelFacade.cancel(billCancelPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadCmBillList action', () => {
      const action = new LoadCmBillList(cmBillListPayload);
      billCancelFacade.loadCmBillList(cmBillListPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadRSODetails action', () => {
      const action = new LoadRSODetails(RSOCode);
      billCancelFacade.loadRsoDetails(RSOCode);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadReasonForCancel action', () => {
      const action = new LoadReasonForCancel(LOVCode);
      billCancelFacade.loadReasons(LOVCode);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CancelType action', () => {
      const action = new CancelType(cancelTypePayload);
      billCancelFacade.loadCancelType(cancelTypePayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetHistory action', () => {
      const action = new ResetHistory();
      billCancelFacade.resethistory();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call clearHistorySearchParamDetails action', () => {
      const action = new SetHistorySearchParamDetails(null);
      billCancelFacade.clearHistorySearchParamDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call setHistorySearchParamDetails action', () => {
      const action = new SetHistorySearchParamDetails(bcHistoryPayload);
      billCancelFacade.setHistorySearchParamDetails(bcHistoryPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadBCHistory action', () => {
      const action = new LoadBCHistory(bcHistoryPayload);
      billCancelFacade.loadBCHistory(bcHistoryPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector', () => {
    it('should access confirmResponse selector', () => {
      expect(billCancelFacade.getConfirmRequest()).toEqual(
        billCancelFacade['confirmRequest$']
      );
    });

    it('should access selecthasError selector', () => {
      expect(billCancelFacade.hasError()).toEqual(
        billCancelFacade['hasError$']
      );
    });

    it('should access selectLoading selector', () => {
      expect(billCancelFacade.getisLoading()).toEqual(
        billCancelFacade['isLoading$']
      );
    });

    it('should access cancelResponse selector', () => {
      expect(billCancelFacade.getCancelRequest()).toEqual(
        billCancelFacade['cancelRequest$']
      );
    });

    it('should access selectViewCashMemoResponse selector', () => {
      expect(billCancelFacade.getViewCashMemoResponse()).toEqual(
        billCancelFacade['viewCashMemoResponse$']
      );
    });

    it('should access selectItemDetails selector', () => {
      expect(billCancelFacade.getItemDetails()).toEqual(
        billCancelFacade['itemDetails$']
      );
    });

    it('should access selectCmBillList selector', () => {
      expect(billCancelFacade.getCmBillList()).toEqual(
        billCancelFacade['cmBillList$']
      );
    });

    it('should access selectBillcancelhistory selector', () => {
      expect(billCancelFacade.getBcList()).toEqual(
        billCancelFacade['bcHistoryList$']
      );
    });

    it('should access selectRsoDetails selector', () => {
      expect(billCancelFacade.getRsoDetails()).toEqual(
        billCancelFacade['rsoDetails$']
      );
    });

    it('should access selectReason selector', () => {
      expect(billCancelFacade.getReasons()).toEqual(
        billCancelFacade['reasons$']
      );
    });

    it('should access CancelType selector', () => {
      expect(billCancelFacade.getCancelType()).toEqual(
        billCancelFacade['CancelType$']
      );
    });

    it('should access getHistorySearchParamDetails selector', () => {
      expect(billCancelFacade.getHistorySearchParamDetails()).toEqual(
        billCancelFacade['historySearchParamDetails$']
      );
    });
  });
});
