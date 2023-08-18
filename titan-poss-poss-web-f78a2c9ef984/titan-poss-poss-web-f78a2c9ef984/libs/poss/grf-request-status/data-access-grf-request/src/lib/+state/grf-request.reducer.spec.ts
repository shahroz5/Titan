import {
  FileDownloadUrlFailure,
  FileDownloadUrlSuccess,
  FileDownloadUrl,
  FileUploadList,
  FileUploadListSuccess,
  FileUploadListFailure
} from './grf-request.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { cmRequestReducer, initialState } from './grf-request.reducer';
import { CmRequestState } from './grf-request.state';
import {
  AdvanceBookingDetailsResponse,
  ApprovalRequest,
  CashMemoDetailsRequestPayload,
  CashMemoItemDetails,
  CashMemoItemDetailsRequestPayload,
  CmApprovalRequestPayload,
  CmRequestDetails,
  GRFRequestDetailsPayload,
  GRFRequestList,
  grfRequestListPayload,
  FileUploadDownloadPayload,
  FileUploadLists,
  StatusTypesEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  ClearGrfRequestDetails,
  ClearGrfRequestList,
  GrfApprovalRequest,
  GrfApprovalRequestFailure,
  GrfApprovalRequestSuccess,
  ConfirmManualGRF,
  ConfirmManualGRFFailure,
  ConfirmManualGRFSuccess,
  LoadGrfProductDetails,
  LoadGrfProductDetailsFailure,
  LoadGrfProductDetailsSuccess,
  LoadGrfProductList,
  LoadGrfProductListFailure,
  LoadGrfProductListSuccess,
  LoadGrfRequestDetails,
  LoadGrfRequestDetailsFailure,
  LoadGrfRequestDetailsSuccess,
  LoadGrfRequestList,
  LoadGrfRequestListFailure,
  LoadGrfRequestListSuccess
} from './grf-request.actions';

describe('Manual Cash Memo Request Reducer Testing Suite', () => {
  const testState = initialState;

  const grfRequestListPayload: grfRequestListPayload = {
    approvalStatus: 'PENDING',
    appliedFilters: {
      dateRangeType: 'CUSTOM',
      endDate: 1625509800000,
      startDate: 1625509800000
    },
    pageIndex: 0,
    pageSize: 10,
    workflowType: 'MANUAL_BILL',

  };

  const grfRequestList: GRFRequestList[] = [
    {
      approvalStatus: 'PENDING',
      approvedBy: null,
      approvedDate: null,
      approverRemarks: null,
      docDate: moment(1625582616979),
      docNo: 23,
      fiscalYear: 2020,
      headerData: { type: 'MANUAL_BILL_HEADER' },
      locationCode: 'CPD',
      processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
      requestedBy: 'cashiercpd',
      requestedDate: moment(1625582616979),
      requestorRemarks: 'remarks',
      taskId: '8be44538-de68-11eb-bbe7-00155dde1995',
      taskName: 'REQUEST_APPROVER_L1',
      workflowType: 'MANUAL_BILL'
    }
  ];

  const grfRequestDetailsCorpPayload: GRFRequestDetailsPayload = {
    processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
    taskName: 'REQUEST_APPROVER_L1',
    workFlowType: 'MANUAL_BILL',
  };

  const grfRequestDetailsBtqPayload: GRFRequestDetailsPayload = {
    processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
    taskName: 'REQUEST_APPROVER_L1',
    workFlowType: 'MANUAL_BILL',
  };

  const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
    subTxnType: 'MANUAL_GRF',
    txnType: 'GRF'
  };






  const grfApprovalRequestPayload: CmApprovalRequestPayload = {
    isApprove: true,
    requestBody: {},
    processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
    taskName: 'REQUEST_APPROVER_L1',
    taskId: '8CDAA81B-DE68-11EB-BBE7-00155DDE1995'
  };

  const approvalRequest: ApprovalRequest = {
    approverRemarks: 'test',
    approverRoleCode: 'A1',
    approverUserName: 'Approver1',
    level: 1,
    processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
    taskId: '8CDAA81B-DE68-11EB-BBE7-00155DDE1995',
    requestorUserName: 'Requestor1',
    taskStatus: 'APPROVED',
    totalApproverLevels: 3
  };
  const fileUploadDownloadPayload: FileUploadDownloadPayload = {
    txnType: TransactionTypeEnum.GRF,
    id: '3A0E5E55-1830-4392-98E6-94D16766B6B2'
  };

  const fileUploadListRes: FileUploadLists[] = [
    {
      id: '1234567',
      name: 'file1'
    }
  ];

  const fileDownloadReq = '1234567';
  const fileDownloadRes = 'http://downloadedurl.com';


  it('should return the initial state', () => {
    const action: any = {};
    const state: CmRequestState = cmRequestReducer(undefined, action);

    expect(state).toBe(testState);
  });

  describe('Testing LoadGrfRequestList Functionality', () => {
    it('LoadGrfRequestList should be called', () => {
      const action = new LoadGrfRequestList(grfRequestListPayload);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });
    it('LoadGrfRequestListSuccess should be called', () => {
      const action = new LoadGrfRequestListSuccess(grfRequestList);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.cmRequestList).toBeTruthy();
    });
    it('LoadGrfRequestListFailure should be called', () => {
      const action = new LoadGrfRequestListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadGrfRequestDetails - Corp Functionality', () => {
    it('LoadGrfRequestDetails should be called', () => {
      const action = new LoadGrfRequestDetails(grfRequestDetailsCorpPayload);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });


    it('LoadGrfRequestDetailsFailure should be called', () => {
      const action = new LoadGrfRequestDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadGrfRequestDetails - Btq Functionality', () => {
    it('LoadGrfRequestDetails should be called', () => {
      const action = new LoadGrfRequestDetails(grfRequestDetailsBtqPayload);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });


    it('LoadGrfRequestDetailsFailure should be called', () => {
      const action = new LoadGrfRequestDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });


});
