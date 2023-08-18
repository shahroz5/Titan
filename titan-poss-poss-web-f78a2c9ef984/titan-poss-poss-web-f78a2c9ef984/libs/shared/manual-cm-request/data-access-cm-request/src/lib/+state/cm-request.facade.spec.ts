import { ClearCmRequestProductDetails, FileDownloadUrl, FileUploadList, SetDropownValues } from './cm-request.actions';
import { CmRequestState } from './cm-request.state';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { CmRequestFacade } from './cm-request.facade';
import { provideMockStore } from '@ngrx/store/testing';
import {
  CashMemoDetailsRequestPayload,
  CashMemoItemDetailsRequestPayload,
  CmApprovalRequestPayload,
  CmRequestDetailsPayload,
  CmRequestListPayload,
  FileUploadDownloadPayload,
  StatusTypesEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { initialState } from './cm-request.reducer';
import * as moment from 'moment';
import {
  ClearCmRequestDetails,
  ClearCmRequestList,
  CmApprovalRequest,
  ConfirmManualCM,
  LoadCmProductDetails,
  LoadCmProductList,
  LoadCmRequestDetails,
  LoadCmRequestList
} from './cm-request.actions';

const cmRequestListPayload: CmRequestListPayload = {
  approvalStatus: 'PENDING',
  appliedFilters: {
    dateRangeType: 'CUSTOM',
    endDate: moment(1625509800000).valueOf(),
    startDate: moment(1625509800000).valueOf()
  },
  pageIndex: 0,
  pageSize: 10,
  workflowType: 'MANUAL_BILL',
  userType: true
};

const cmRequestDetailsPayload: CmRequestDetailsPayload = {
  processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
  taskName: 'REQUEST_APPROVER_L1',
  workFlowType: 'MANUAL_BILL'
};

const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
  subTxnType: 'MANUAL_CM',
  txnType: 'CM'
};

const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
  id: '4D619FB5-45A3-423B-AE48-33C273633300',
  txnType: 'CM',
  subTxnType: 'NEW_CM'
};

const cmApprovalRequestPayload: CmApprovalRequestPayload = {
  isApprove: true,
  requestBody: {},
  processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
  taskName: 'REQUEST_APPROVER_L1',
  taskId: '8CDAA81B-DE68-11EB-BBE7-00155DDE1995'
};

const fileUploadDownloadPayload: FileUploadDownloadPayload = {
  txnType: TransactionTypeEnum.CM,
  id: '3A0E5E55-1830-4392-98E6-94D16766B6B2'
};

const fileDownloadReq = { id: '1234567', locationCode: 'CPD' };

describe('Manual Cash Memo Request facade Testing Suite action', () => {
  let cmRequestFacade: CmRequestFacade;
  let store: Store<CmRequestState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CmRequestFacade]
    });

    cmRequestFacade = TestBed.inject(CmRequestFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Manual Cash Memo Request actions', () => {
    it('should call loadCmRequestList action', () => {
      const action = new LoadCmRequestList(cmRequestListPayload);
      cmRequestFacade.loadCmRequestList(cmRequestListPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadCmRequestDetails action', () => {
      const action = new LoadCmRequestDetails(cmRequestDetailsPayload);
      cmRequestFacade.loadCmRequestDetails(cmRequestDetailsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadCmProductList action', () => {
      const action = new LoadCmProductList(cashMemoDetailsRequestPayload);
      cmRequestFacade.loadCmProductList(cashMemoDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadCmProductDetails action', () => {
      const action = new LoadCmProductDetails(
        cashMemoItemDetailsRequestPayload
      );
      cmRequestFacade.loadCmProductDetails(cashMemoItemDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadCmApprovalRequest action', () => {
      const action = new CmApprovalRequest(cmApprovalRequestPayload);
      cmRequestFacade.loadCmApprovalRequest(cmApprovalRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call updateCashMemo action', () => {
      const action = new ConfirmManualCM(cashMemoDetailsRequestPayload);
      cmRequestFacade.updateCashMemo(cashMemoDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call FileUploadList action', () => {
      const action = new FileUploadList(fileUploadDownloadPayload);
      cmRequestFacade.loadFileUploadList(fileUploadDownloadPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call FileDownloadUrl action', () => {
      const action = new FileDownloadUrl(fileDownloadReq);
      cmRequestFacade.loadFileDownloadUrl(fileDownloadReq);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call clearCmRequestList action', () => {
      const action = new ClearCmRequestList();
      cmRequestFacade.clearCmRequestList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call clearCmRequestDetails action', () => {
      const action = new ClearCmRequestDetails();
      cmRequestFacade.clearCmRequestDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call setDropDownValue action', () => {
      const action = new SetDropownValues(StatusTypesEnum.APPROVED);
      cmRequestFacade.setDropDownValue(StatusTypesEnum.APPROVED);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call clearCmRequestProductDetails action', () => {
      const action = new ClearCmRequestProductDetails();
      cmRequestFacade.clearCmRequestProductDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Manual Cash Memo Request Selectors', () => {
    it('should get getCmRequestList data', () => {
      expect(cmRequestFacade.getCmRequestList()).toEqual(
        cmRequestFacade['cmRequestList$']
      );
    });

    it('should get getCmRequestDetails data', () => {
      expect(cmRequestFacade.getCmRequestDetails()).toEqual(
        cmRequestFacade['cmRequestDetails$']
      );
    });

    it('should get getCmProductList data', () => {
      expect(cmRequestFacade.getCmProductList()).toEqual(
        cmRequestFacade['cmProductList$']
      );
    });

    it('should get getCmProductDetails data', () => {
      expect(cmRequestFacade.getCmProductDetails()).toEqual(
        cmRequestFacade['cmProductDetails$']
      );
    });

    it('should get getCmCustomerDetails data', () => {
      expect(cmRequestFacade.getCmCustomerDetails()).toEqual(
        cmRequestFacade['cmCustomerDetails$']
      );
    });

    it('should get getCmHeaderDetails data', () => {
      expect(cmRequestFacade.getCmHeaderDetails()).toEqual(
        cmRequestFacade['cmHeaderDetails$']
      );
    });

    it('should get getCmApprovalRequest data', () => {
      expect(cmRequestFacade.getCmApprovalRequest()).toEqual(
        cmRequestFacade['cmApprovalRequest$']
      );
    });

    it('should get getUpdateCashMemoResponse data', () => {
      expect(cmRequestFacade.getUpdateCashMemoResponse()).toEqual(
        cmRequestFacade['updateCashMemoResponse$']
      );
    });

    it('should get getFileUploadListRes data', () => {
      expect(cmRequestFacade.getFileUploadListRes()).toEqual(
        cmRequestFacade['fileUploadList$']
      );
    });

    it('should get getFileDownloadUrl data', () => {
      expect(cmRequestFacade.getFileDownloadUrl()).toEqual(
        cmRequestFacade['fileDownload$']
      );
    });

    it('should get getIsLoading data', () => {
      expect(cmRequestFacade.getIsLoading()).toEqual(
        cmRequestFacade['isLoading$']
      );
    });

    it('should get getHasError data', () => {
      expect(cmRequestFacade.getHasError()).toEqual(
        cmRequestFacade['hasError$']
      );
    });

    it('should get getDropdownValue data', () => {
      expect(cmRequestFacade.getDropdownValue()).toEqual(
        cmRequestFacade['dropDownValue$']
      );
    });
  });
});
