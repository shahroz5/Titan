import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  BillCancelPayload,
  CashMemoDetailsRequestPayload,
  CashMemoItemDetailsRequestPayload,
  CmBillListPayload
} from '@poss-web/shared/models';
import {
  ApproveBillCancellationRequests,
  CANCELRequest,
  CancelType,
  CONFIRMRequest,
  DeleteRequest,
  GetItemfromCashMemo,
  LoadBillCancellationRequests,
  LoadBillCancellationRequestsStatus,
  LoadCountBillCancellation,
  LoadHistoryFilterData,
  LoadLocation,
  LoadSelectedData,
  LoadSeltedData,
  Reset,
  ResetBc,
  RESETDETAIL,
  RESETFILTER,
  ViewCashMemo
} from './bill-cancellation-requests.actions';
import { BillCancellationRequestsFacade } from './bill-cancellation-requests.facade';
import { initialState } from './bill-cancellation-requests.reducer';
import { BillCancellationRequestsState } from './bill-cancellation-requests.state';

describe('Bill Cancel facade Testing Suite action', () => {
  let billCancelFacade: BillCancellationRequestsFacade;

  let store: Store<BillCancellationRequestsState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        BillCancellationRequestsFacade
      ]
    });

    billCancelFacade = TestBed.inject(BillCancellationRequestsFacade);
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
      const action = new ResetBc();
      billCancelFacade.resetList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetDetail action', () => {
      const action = new RESETFILTER();
      billCancelFacade.resetFilter();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetDetail action', () => {
      const action = new RESETDETAIL();
      billCancelFacade.resetDetail();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call Reset action', () => {
      const action = new Reset();
      billCancelFacade.reset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call location action', () => {
      const action = new LoadLocation();
      billCancelFacade.loadLocations();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ConfirmRequest action', () => {
      const action = new CONFIRMRequest(billCancelPayload);
      billCancelFacade.loadConfirmData(billCancelPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call cancel action', () => {
      const action = new CANCELRequest(billCancelPayload);
      billCancelFacade.Cancel(billCancelPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadSelected action', () => {
      const action = new LoadSelectedData(null);
      billCancelFacade.loadSelectedData(null);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadHistoryFilterData action', () => {
      const action = new LoadHistoryFilterData(null);
      billCancelFacade.loadHistoryFilterData(null);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadHistoryFilterData action', () => {
      const action = new LoadHistoryFilterData(null);
      billCancelFacade.loadHistoryFilterData(null);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadCancelType action', () => {
      const action = new CancelType(null);
      billCancelFacade.loadCancelType(null);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call Delete action', () => {
      const action = new DeleteRequest(null);
      billCancelFacade.Delete(null);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadBillCancellationRequestsaction', () => {
      const action = new LoadBillCancellationRequests(null);
      billCancelFacade.loadBillCancellationRequests(null);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadCount action', () => {
      const action = new LoadCountBillCancellation(null);
      billCancelFacade.loadCount(null);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call   approveBillCancellationRequests action', () => {
      const action = new ApproveBillCancellationRequests(null);
      billCancelFacade.approveBillCancellationRequests(null);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadSeltedData action', () => {
      const action = new LoadSeltedData(null);
      billCancelFacade.loadSelected(null);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadBillCancellationStatus action', () => {
      const action = new LoadBillCancellationRequestsStatus(null);
      billCancelFacade.loadBillCancellationStatus(null);
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
        billCancelFacade['CancelRequest$']
      );
    });

    it('should access getLocations selector', () => {
      expect(billCancelFacade.getLocations()).toEqual(
        billCancelFacade['location$']
      );
    });

    it('should access cancelType selector', () => {
      expect(billCancelFacade.getCancelType()).toEqual(
        billCancelFacade['CancelType$']
      );
    });

    it('should access billcount selector', () => {
      expect(billCancelFacade.getBillsCount()).toEqual(
        billCancelFacade['BillRequestCount$']
      );
    });

    it('should access getDeleteRequest selector', () => {
      expect(billCancelFacade.getDeleteRequest()).toEqual(
        billCancelFacade['DeleteRequest$']
      );
    });

    it('should access getHistoryFilterData()  selector', () => {
      expect(billCancelFacade.getHistoryFilterData()).toEqual(
        billCancelFacade['historyFilterData$']
      );
    });

    it('should access getSelectedData() selector', () => {
      expect(billCancelFacade.getSelectedData()).toEqual(
        billCancelFacade['selectedData$']
      );
    });

    it('should access getbillCancellationDetail selector', () => {
      expect(billCancelFacade.getbillCancellationDetail()).toEqual(
        billCancelFacade['billCancellationDetail$']
      );
    });

    it('should access billcount selector', () => {
      expect(billCancelFacade.getbillCancelCount()).toEqual(
        billCancelFacade['billCancelCount$']
      );
    });
    it('should access getbillCancellationRequestStatus() t selector', () => {
      expect(billCancelFacade.getbillCancellationRequestStatus()).toEqual(
        billCancelFacade['billCancelRequest$']
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

    it('should access getbillCancellationRequest selector', () => {
      expect(billCancelFacade.getbillCancellationRequest()).toEqual(
        billCancelFacade['billCancellationRequest$']
      );
    });
  });
});
