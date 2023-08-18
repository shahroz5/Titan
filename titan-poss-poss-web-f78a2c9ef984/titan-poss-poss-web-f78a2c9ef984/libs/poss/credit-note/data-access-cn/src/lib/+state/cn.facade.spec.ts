import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  CancelCnRequestPayload,
  CNSearchEnum,
  ConfirmRequestTypePayload,
  CreditNoteSearch,
  LoadRequestsPayload,
  SentRequestPayload,
  TransferEghsPayload
} from '@poss-web/shared/models';
import {
  CalculateCnRefundAmount,
  CancelAutoApprovedCn,
  CancelRequest,
  CancelRequestApprovedCn,
  ConfirmRequestType,
  CreditNoteDetailsById,
  DownloadCN,
  LoadRequestById,
  LoadSentRequests,
  LoadTransferedCNS,
  RaiseRequest,
  ResetDetailPage,
  ResetListPage,
  ResetRequests,
  ResetSearch,
  SearchCreditNotes,
  SearchRequst,
  StoreRequestType,
  StoreSearch,
  TransfetToEghs
} from './cn.actions';
import { sentRequestAdaptor, transferedCNsAdaptor } from './cn.entity';
import { CreditNoteFacade } from './cn.facade';
import { CreditNoteState } from './cn.state';
describe('Credit Note Facade Testing', () => {
  const initialState: CreditNoteState = {
    error: null,
    isLoading: false,
    creditNoteSearchResult: [],
    creditNoteDetails: null,
    requestNo: null,
    search: {
      cnNumber: '',
      mobileNumber: '',
      fiscalYear: ''
    },
    sentRequests: sentRequestAdaptor.getInitialState(),
    searchRequests: sentRequestAdaptor.getInitialState(),
    count: 0,
    hasSearched: false,
    request: null,
    cnNumber: null,
    requestType: CNSearchEnum.REMOVE_GOLD_RATE,
    transferToEghs: null,
    transferedCNs: transferedCNsAdaptor.getInitialState(),
    downloadCN: false,
    totalCount: 0,
    hasCancelled: false,
    totalElements: 0,
    transferedCN: null,
    refundAmountDetails: null
  };
  const transferToEghsPayload: TransferEghsPayload = {
    id: 'abc123',
    payload: {
      accountNumber: 12345678,
      fiscalYear: 2021,
      locationCode: 'CPD',
      remarks: 'good',
      transferAmount: 0
    }
  };
  const requestPayload: LoadRequestsPayload = {
    workFlowType: 'REMOVE_GOLD_RATE',
    pageIndex: 0,
    pageSize: 10,
    payload: {}
  };
  const cancelCnRequestPayload: CancelCnRequestPayload = {
    paymentDetails: {
      data: {
        paymentCode: 'CASH',
        paymentGroup: '',
        refundAmount: 12345,
        otherDetails: null
      },
      type: 'CN_REFUND_PAYMENT_DETAILS'
    },
    id: '12345',
    creditNoteWorkFlowType: 'CREDIT_NOTE_CANCELLATION',
    remarks: null
  };

  let creditNoteFacade: CreditNoteFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CreditNoteFacade]
    });
    creditNoteFacade = TestBed.inject(CreditNoteFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions', () => {
    const searchPayload: CreditNoteSearch = {
      cnNumber: '12',
      mobileNumber: '2020',
      fiscalYear: '2021'
    };
    it('should call SEARCH_CREDIT_NOTES', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SearchCreditNotes(searchPayload);
      creditNoteFacade.loadSearchResult(searchPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CREDIT_NOTE_DETAILS_BY_ID', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new CreditNoteDetailsById('123');
      creditNoteFacade.loadCreditNoteDetails('123');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call RAISE_REQUEST', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SentRequestPayload = {
        creditNoteType: 'REMOVE_GOLD_RATE',
        id: 'abc123',
        payload: {}
      };
      const action = new RaiseRequest(payload);
      creditNoteFacade.raiseRequest(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call RESET_LIST_PAGE', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new ResetListPage();
      creditNoteFacade.resetListPage();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call RESET_LIST_PAGE', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new ResetListPage();
      creditNoteFacade.resetListPage();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call STORE_SEARCH', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new StoreSearch(searchPayload);
      creditNoteFacade.storeSearch(searchPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_SENT_REQUESTS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadSentRequests(requestPayload);
      creditNoteFacade.loadSentRequest(requestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call RESET_DETAILS_PAGE', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetDetailPage();
      creditNoteFacade.resetDetailPage();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call RESET_REQUESTS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetRequests();
      creditNoteFacade.resetRequests();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_REQUEST', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchRequst(requestPayload);
      creditNoteFacade.searchRequest(requestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CONFIGRM_REQUEST_TYPE', () => {
      const confirmPayload: ConfirmRequestTypePayload = {
        payload: {},
        workFlowType: 'REMOVE_GOLD_RATE',
        id: 'abc123'
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ConfirmRequestType(confirmPayload);
      creditNoteFacade.confirmRequest(confirmPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_REQUEST_BY_ID', () => {
      const payload = {
        processId: 'abc123',
        workFlowType: 'REMOVE_GOLD_RATE'
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadRequestById(payload);
      creditNoteFacade.loadRequestById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call TRANSFER_TO_EGHS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new TransfetToEghs(transferToEghsPayload);
      creditNoteFacade.transfterToEghs(transferToEghsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_TRANSFERED_CNS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadTransferedCNS();
      creditNoteFacade.loadTransferedCNs();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call DOWNLOAD_CN', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new DownloadCN({ id: '123', ghsDocNo: 12 });
      creditNoteFacade.downloadCN({ id: '123', ghsDocNo: 12 });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call RESET_SEARCH', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetSearch();
      creditNoteFacade.resetSearch();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CANCEL_REQUEST', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new CancelRequest({
        remarks: 'good',
        id: 'abc123',
        workFlowType: 'REMOVE_GOLD_RATE'
      });
      creditNoteFacade.cancelRequest({
        remarks: 'good',
        id: 'abc123',
        workFlowType: 'REMOVE_GOLD_RATE'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call STORE_REQUEST_TYPE', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new StoreRequestType('REMOVE_GOLD_RATE');
      creditNoteFacade.storeRequestType('REMOVE_GOLD_RATE');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CALCULATE_CN_REFUND_AMOUNT', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new CalculateCnRefundAmount('123');
      creditNoteFacade.loadCnRefundAmountDetails('123');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call CANCEL_AUTO_APPROVED_CN', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new CancelAutoApprovedCn(cancelCnRequestPayload);
      creditNoteFacade.cancelAutoApprovedCn(cancelCnRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call CANCEL_REQUEST_APPROVED_CN', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new CancelRequestApprovedCn(cancelCnRequestPayload);
      creditNoteFacade.cancelRequestApprovedCn(cancelCnRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selectors', () => {
    it('should access the error', () => {
      expect(creditNoteFacade.getError()).toEqual(creditNoteFacade['error$']);
    });

    it('should access the isloading', () => {
      expect(creditNoteFacade.getIsLoading()).toEqual(
        creditNoteFacade['isLoading$']
      );
    });

    it('should access the creditNoteSearchResult', () => {
      expect(creditNoteFacade.getCreditNoteSearchResult()).toEqual(
        creditNoteFacade['creditNoteSearchResult$']
      );
    });

    it('should access the creditNoteDetails', () => {
      expect(creditNoteFacade.getCreditNoteDetails()).toEqual(
        creditNoteFacade['creditNoteDetails$']
      );
    });

    it('should access the requestId', () => {
      expect(creditNoteFacade.getRequestId()).toEqual(
        creditNoteFacade['requestId$']
      );
    });

    it('should access the search', () => {
      expect(creditNoteFacade.getSearch()).toEqual(creditNoteFacade['search$']);
    });

    it('should access the totalCount', () => {
      expect(creditNoteFacade.getTotalCount()).toEqual(
        creditNoteFacade['totalCount$']
      );
    });

    it('should access the sentRequests', () => {
      expect(creditNoteFacade.getSentRequests()).toEqual(
        creditNoteFacade['sentRequests$']
      );
    });

    it('should access the searchRequests', () => {
      expect(creditNoteFacade.getSearchRequests()).toEqual(
        creditNoteFacade['searchRequests$']
      );
    });

    it('should access the hasSearched', () => {
      expect(creditNoteFacade.getHasSearched()).toEqual(
        creditNoteFacade['hasSearched$']
      );
    });

    it('should access the cnNumber', () => {
      expect(creditNoteFacade.getcnNumber()).toEqual(
        creditNoteFacade['cnNumber$']
      );
    });

    it('should access the requestType', () => {
      expect(creditNoteFacade.getRequestType()).toEqual(
        creditNoteFacade['requestType$']
      );
    });

    it('should access the request', () => {
      expect(creditNoteFacade.getRequest()).toEqual(
        creditNoteFacade['request$']
      );
    });
    it('should access the transferedCNs', () => {
      expect(creditNoteFacade.getTransfteredCNs()).toEqual(
        creditNoteFacade['trnasferedCNs$']
      );
    });

    it('should access the transferedCNCount', () => {
      expect(creditNoteFacade.getTransferedCNsCount()).toEqual(
        creditNoteFacade['transferedCNsCount$']
      );
    });

    it('should access the transferedCNCount', () => {
      expect(creditNoteFacade.getTransferedCNsCount()).toEqual(
        creditNoteFacade['transferedCNsCount$']
      );
    });
    it('should access the hasCancelled', () => {
      expect(creditNoteFacade.getHasCancelled()).toEqual(
        creditNoteFacade['hasCancelled$']
      );
    });

    it('should access the totalElements', () => {
      expect(creditNoteFacade.getTotalElements()).toEqual(
        creditNoteFacade['totalElements$']
      );
    });

    it('should access the downloadCN', () => {
      expect(creditNoteFacade.getDownloadCN()).toEqual(
        creditNoteFacade['downloadCN$']
      );
    });

    it('should access the requestNumber', () => {
      expect(creditNoteFacade.getTransferedCN()).toEqual(
        creditNoteFacade['searchResult$']
      );
    });

    it('should access the getCnRefundAmountDetails', () => {
      expect(creditNoteFacade.getCnRefundAmountDetails()).toEqual(
        creditNoteFacade['cnRefundAmountDetails$']
      );
    });
  });
});
