import * as moment from "moment"
import { AbManualRequestListAdapter, itemDetailsAdapter } from "./ab-manual-request.entity"
import { AbManualRequestState } from "./ab-manual-request.state"
import { AbManualRequestFacade } from './ab-manual-request.facade'
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { TestBed } from "@angular/core/testing"
import { Store } from "@ngrx/store"
import { AbManualApprovalRequest, ClearAbManualRequestDetails, ClearAbManualRequestList, ConfirmManualAbManual, FileDownloadUrl, FileUploadList, LoadAbManualProductDetails, LoadAbManualProductList, LoadAbManualRequestDetails, LoadAbManualRequestList, LoadHistoryFilterData, LoadProductDetails, RESETFILTER } from "./ab-manual-request.actions"
import { AbManualApprovalRequestPayload, AbManualRequestDetailsPayload, AbManualRequestListPayload, CashMemoDetailsRequestPayload, CashMemoItemDetailsRequestPayload, FileUploadDownloadPayload, HistoryFiltersData, TransactionTypeEnum } from "@poss-web/shared/models"

describe('AbManualRequestFacade Testing Suite', () => {
  const initialState: AbManualRequestState = {
    hasError: null,
    isLoading: false,
    abManualRequestList: AbManualRequestListAdapter.getInitialState(),
    abManualRequestDetails: null,
    customerDetails: null,
    headerDetails: null,
    productList: null,
    productDetails: itemDetailsAdapter.getInitialState(),
    abManualApprovalRequest: null,
    updateCashMemoResponse: null,
    advancedFilter: {
      startDate: moment().startOf('day').valueOf(),
      endDate: moment().endOf('day').valueOf(),
      reqFiscalYear: null,
      location: null
    },
    uploadFileListResponse: [],
    downloadFileUrl: null
  };

  let abManualRequestFacade: AbManualRequestFacade;
  let store: MockStore<AbManualRequestFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), AbManualRequestFacade]
    });
    store = TestBed.inject<any>(Store);
    abManualRequestFacade = TestBed.inject<any>(AbManualRequestFacade);
  });

  describe('Dispatch Actions', () => {
    it('should call LoadAbManualRequestDetails action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: AbManualRequestDetailsPayload = {
        processId: 'processId',
        workFlowType: 'workFlowType'
      };
      const action = new LoadAbManualRequestDetails(payload);
      abManualRequestFacade.loadAbManualRequestDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadAbManualProductList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: CashMemoDetailsRequestPayload = {
        txnType: 'txnType',
        subTxnType: 'subTxnType'
      };
      const action = new LoadAbManualProductList(payload);
      abManualRequestFacade.loadAbManualProductList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadAbManualProductDetails action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: CashMemoItemDetailsRequestPayload = {
        txnType: 'txnType',
        subTxnType: 'subTxnType',
        id: 'id'
      }
      const action = new LoadAbManualProductDetails(payload);
      abManualRequestFacade.loadAbManualProductDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadProductDetails action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadProductDetails('payload');
      abManualRequestFacade.loadProductDetails('payload');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadAbManualApprovalRequest action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: AbManualApprovalRequestPayload = {
        isApprove: false,
        requestBody: {},
        processId: 'processId',
        taskId: 'taskId',
        taskName: 'taskName'
      }
      const action = new AbManualApprovalRequest(payload);
      abManualRequestFacade.loadAbManualApprovalRequest(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call updateCashMemo action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: CashMemoDetailsRequestPayload = {
        txnType: 'txnType',
        subTxnType: 'subTxnType'
      };
      const action = new ConfirmManualAbManual(payload);
      abManualRequestFacade.updateCashMemo(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call clearAbManualRequestList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ClearAbManualRequestList();
      abManualRequestFacade.clearAbManualRequestList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call clearAbManualRequestDetails action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ClearAbManualRequestDetails();
      abManualRequestFacade.clearAbManualRequestDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call resetFilter action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new RESETFILTER();
      abManualRequestFacade.resetFilter();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadHistoryFilterData action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: HistoryFiltersData = {
        startDate: 161234500,
        endDate: 161234501,
        reqFiscalYear: 2022
      };
      const action = new LoadHistoryFilterData(payload);
      abManualRequestFacade.loadHistoryFilterData(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadFileUploadList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: FileUploadDownloadPayload = {
        txnType: TransactionTypeEnum.AB,
        id: 'Id'
      };
      const action = new FileUploadList(payload);
      abManualRequestFacade.loadFileUploadList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadFileDownloadUrl action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = {
        id: 'Id',
        locationCode: 'CPD'
      };
      const action = new FileDownloadUrl(payload);
      abManualRequestFacade.loadFileDownloadUrl(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadAbManualRequestList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: AbManualRequestListPayload = {
        approvalStatus: 'PENDING',
        appliedFilters: {},
        pageIndex: 0,
        pageSize: 10,
        workflowType: 'workFlow'
      };
      const action = new LoadAbManualRequestList(payload);
      abManualRequestFacade.loadAbManualRequestList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  })
  describe('Access Selector action', () => {
    it('should access the getHasError selector action', () => {
      expect(abManualRequestFacade.getHasError()).toEqual(
        abManualRequestFacade['hasError$']
      );
    })
    it('should access the getIsLoading selector action', () => {
      expect(abManualRequestFacade.getIsLoading()).toEqual(
        abManualRequestFacade['isLoading$']
      );
    })
    it('should access the getAbManualRequestList selector action', () => {
      expect(abManualRequestFacade.getAbManualRequestList()).toEqual(
        abManualRequestFacade['abManualRequestList$']
      );
    })
    it('should access the getAbManualRequestDetails selector action', () => {
      expect(abManualRequestFacade.getAbManualRequestDetails()).toEqual(
        abManualRequestFacade['abManualRequestDetails$']
      );
    })
    it('should access the getAbManualProductList selector action', () => {
      expect(abManualRequestFacade.getAbManualProductList()).toEqual(
        abManualRequestFacade['abManualProductList$']
      );
    })
    it('should access the getHistoryFilterData selector action', () => {
      expect(abManualRequestFacade.getHistoryFilterData()).toEqual(
        abManualRequestFacade['historyFilterData$']
      );
    })
    it('should access the getAbManualProductDetails selector action', () => {
      expect(abManualRequestFacade.getAbManualProductDetails()).toEqual(
        abManualRequestFacade['abManualProductDetails$']
      );
    })
    it('should access the getAbManualCustomerDetails selector action', () => {
      expect(abManualRequestFacade.getAbManualCustomerDetails()).toEqual(
        abManualRequestFacade['abManualCustomerDetails$']
      );
    })
    it('should access the getAbManualHeaderDetails selector action', () => {
      expect(abManualRequestFacade.getAbManualHeaderDetails()).toEqual(
        abManualRequestFacade['abManualHeaderDetails$']
      );
    })
    it('should access the getAbManualApprovalRequest selector action', () => {
      expect(abManualRequestFacade.getAbManualApprovalRequest()).toEqual(
        abManualRequestFacade['abManualApprovalRequest$']
      );
    })
    it('should access the getUpdateCashMemoResponse selector action', () => {
      expect(abManualRequestFacade.getUpdateCashMemoResponse()).toEqual(
        abManualRequestFacade['updateCashMemoResponse$']
      );
    })
    it('should access the getFileUploadListRes selector action', () => {
      expect(abManualRequestFacade.getFileUploadListRes()).toEqual(
        abManualRequestFacade['fileUploadList$']
      );
    })
    it('should access the getFileDownloadUrl selector action', () => {
      expect(abManualRequestFacade.getFileDownloadUrl()).toEqual(
        abManualRequestFacade['fileDownload$']
      );
    })
  })
})
