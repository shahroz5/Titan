import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { requestsAdaptor } from './cn-transfer.entity';
import { CreditNoteTransferState } from './cn-transfer.state';
import { CreditNoteTransferFacade } from './cn-transfer.facade';
import {
  ApproveOrRejectCnTransfer,
  GetCreditNoteDetailsById,
  GetLocationCodes,
  InwardCreditNote,
  LegacyCNInwardTransfer,
  LegacyCNOutwardTransfer,
  LoadTransferRequests,
  RaiseTransferRequest,
  ResetCnTransfer,
  ResetListPage,
  ResetSearch,
  SearchCreditNotes
} from './cn-transfer.actions';
import {
  ApproveOrRejectCnTransferPayaload,
  CnTransferSearchPayload,
  cnTransferTabEnum,
  InwardCnPayload,
  LegacyCNTransferPayload,
  LoadCnTransferRequestsPayload,
  LoadSelectedCnDetailsReqPayload,
  RequestTransferPayload
} from '@poss-web/shared/models';

describe('Razor Payment Requests Facade Testing Suite', () => {
  const initialState: CreditNoteTransferState = {
    locationCodes: [],
    error: null,
    isLoading: false,
    creditNoteSearchResult: [],
    searchCount: 0,
    creditNoteDetails: null,
    raisedRequestNo: null,
    raisedRequests: requestsAdaptor.getInitialState(),
    requestsCount: 0,
    hasCnUpdateRequestStatus: null,
    creditNoteUpdateResponse: null,
    isApprovedOrRejected: false,
    legacyOutwardTransferResponsePayload: null,
    legacyInwardTransferResponsePayload: null,
    isTransferRequestCancelled: false
  };

  let creditNoteTransferFacade: CreditNoteTransferFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CreditNoteTransferFacade]
    });
    creditNoteTransferFacade = TestBed.inject(CreditNoteTransferFacade);
  });

  describe('Testing Value accessor methods in CreditNoteTransferFacade', () => {
    it('should check truthy of getIsLoading', () => {
      expect(creditNoteTransferFacade.getIsLoading()).toBeTruthy();
    });
    it('should check value of getError', () => {
      expect(creditNoteTransferFacade.getError()).toBeTruthy();
    });
    it('should check value of getLocationCodes', () => {
      expect(creditNoteTransferFacade.getLocationCodes()).toBeTruthy();
    });
    it('should check value of getCreditNoteSearchResult', () => {
      expect(creditNoteTransferFacade.getCreditNoteSearchResult()).toBeTruthy();
    });
    it('should check value of getCreditNoteSearchResultCount', () => {
      expect(
        creditNoteTransferFacade.getCreditNoteSearchResultCount()
      ).toBeTruthy();
    });
    it('should check value of getSelectedCreditNoteDetails', () => {
      expect(
        creditNoteTransferFacade.getSelectedCreditNoteDetails()
      ).toBeTruthy();
    });
    it('should check value of getRaisedRequestDocNo', () => {
      expect(creditNoteTransferFacade.getRaisedRequestDocNo()).toBeTruthy();
    });
    it('should check value of getRaisedTransferRequestsTotalCount', () => {
      expect(
        creditNoteTransferFacade.getRaisedTransferRequestsTotalCount()
      ).toBeTruthy();
    });
    it('should check value of getHasCNUpdatedStatus', () => {
      expect(creditNoteTransferFacade.getHasCNUpdatedStatus()).toBeTruthy();
    });
    it('should check value of getCnUpdateResponse', () => {
      expect(creditNoteTransferFacade.getCnUpdateResponse()).toBeTruthy();
    });
    it('should check value of getIsApprovedOrRejectedStatus', () => {
      expect(
        creditNoteTransferFacade.getIsApprovedOrRejectedStatus()
      ).toBeTruthy();
    });
    it('should check value of getRaisedTransferRequests', () => {
      expect(creditNoteTransferFacade.getRaisedTransferRequests()).toBeTruthy();
    });
    it('should check value of getLegacyOutwardTransferResponsePayload', () => {
      expect(creditNoteTransferFacade.getLegacyInwardTransferResponsePayload()).toBeTruthy();
    });
    it('should check value of getLegacyInwardTransferResponsePayload', () => {
      expect(creditNoteTransferFacade.getLegacyInwardTransferResponsePayload()).toBeTruthy();
    });
  });
  describe('Testing Action Dispatcher methods in Razorpay Request Facade', () => {
    it('should dispatch GetLocationCodes action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new GetLocationCodes();
      creditNoteTransferFacade.loadLocationCodes();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch SearchCreditNotes action', inject([Store], store => {
      const payload: CnTransferSearchPayload = {
        srcBtqCode: 'PTU',
        docNo: 10,
        fiscalYear: '2021'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchCreditNotes(payload);
      creditNoteTransferFacade.loadSearchResulut(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch CreditNoteDetailsById action', inject(
      [Store],
      store => {
        const payload: LoadSelectedCnDetailsReqPayload = {
          tab: cnTransferTabEnum.SENT_REQUESTS,
          id: '123456',
          srcBtqCode: 'PTU',
          taskId: '1234567'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new GetCreditNoteDetailsById(payload);
        creditNoteTransferFacade.loadSelectedCreditNoteDetailsById(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
    it('should dispatch RaiseTransferRequest action', inject([Store], store => {
      const payload: RequestTransferPayload = {
        id: '123456',
        remarksDto: { approverLocationCode: 'CPD', remarks: 'remarks' }
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new RaiseTransferRequest(payload);
      creditNoteTransferFacade.raiseTransferRequest(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch LegacyCNOutwardTransfer action', inject([Store], store => {
      const payload: LegacyCNTransferPayload = {
        id: '123456',
        locationCode: 'CPD'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LegacyCNOutwardTransfer(payload);
      creditNoteTransferFacade.LegacyCNOutwardTransfer(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch LegacyCNInwardTransfer action', inject([Store], store => {
      const payload: LegacyCNTransferPayload = {
        id: '123456',
        locationCode: 'CPD'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LegacyCNInwardTransfer(payload);
      creditNoteTransferFacade.LegacyCNInwardTransfer(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch LoadTransferRequests action', inject([Store], store => {
      const payload: LoadCnTransferRequestsPayload = {
        tab: cnTransferTabEnum.SENT_REQUESTS,
        approvalStatus: 'PENDING',
        page: 0,
        size: 10,
        payload: { dateRangeType: 'FISCAL_YEAR', fiscalYear: 2021 }
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadTransferRequests(payload);
      creditNoteTransferFacade.loadRequests(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch InwardCreditNote action', inject([Store], store => {
      const payload: InwardCnPayload = {
        id: '123456',
        remarksDto: { remarks: 'test' },
        workflowType: 'CN_TRANSFER'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new InwardCreditNote(payload);
      creditNoteTransferFacade.inwardCN(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch approveOrRejectCNTransfer action', inject(
      [Store],
      store => {
        const payload: ApproveOrRejectCnTransferPayaload = {
          id: '1234',
          remarksDto: { remarks: 'test' },
          status: 'APPROVE',
          workflowType: 'CN_TRANSFER'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ApproveOrRejectCnTransfer(payload);
        creditNoteTransferFacade.approveOrRejectCNTransfer(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
    it('should dispatch ResetListPage action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetListPage();
      creditNoteTransferFacade.resetListPage();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch ResetSearch action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetSearch();
      creditNoteTransferFacade.resetSearch();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch resetCnTransfer action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetCnTransfer();
      creditNoteTransferFacade.resetCnTransfer();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
