import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  AdvanceBookingDetailsResponse,
  ApprovalRequest,
  CashMemoDetailsRequestPayload,
  CashMemoItemDetails,
  CashMemoItemDetailsRequestPayload,
  CmApprovalRequestPayload,
  CmRequestDetails,
  CmRequestDetailsPayload,
  CmRequestList,
  CmRequestListPayload,
  FileUploadDownloadPayload,
  GRFRequestDetailsPayload,
  GRFRequestList,
  grfRequestListPayload,
  StatusTypesEnum,
  TransactionTypeEnum,
  WorkflowTypeEnum
} from '@poss-web/shared/models';
import {
  getCashMemoEndPointUrl,
  manualBillListUrl,
  downloadManualBillUrl,
  getCmRequestListUrl,
  getCmRequestDetailsUrl,
  getCashMemoItemEndPointUrl,
  getCmApprovalRequestUrl,
  getWorkFlowProcessUrl,
  getWorkFlowProcessDetailsUrl
} from '@poss-web/shared/util-api-service';
import {
  CashMemoAdaptor,
  CmRequestAdaptor,
  CmRequestHelper
} from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import { grfRequestService } from './grf-request.service';

const cmRequestListCorpPayload: CmRequestListPayload = {
  approvalStatus: 'PENDING',
  appliedFilters: {
    dateRangeType: 'CUSTOM',
    endDate: 1625509800000,
    startDate:1625509800000
  },
  pageIndex: 0,
  pageSize: 10,
  workflowType: 'MANUAL_BILL',
  userType: true
};

const cmRequestListBtqPayload: grfRequestListPayload = {
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

const cmRequestList: GRFRequestList[] = [
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

const cmRequestDetailsCorpPayload: GRFRequestDetailsPayload = {
  processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
  taskName: 'REQUEST_APPROVER_L1',
  workFlowType: 'MANUAL_BILL',
};

const cmRequestDetailsBtqPayload: GRFRequestDetailsPayload = {
  processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
  taskName: 'REQUEST_APPROVER_L1',
  workFlowType: 'MANUAL_BILL',
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

const fileDownloadReq = '1234567';




