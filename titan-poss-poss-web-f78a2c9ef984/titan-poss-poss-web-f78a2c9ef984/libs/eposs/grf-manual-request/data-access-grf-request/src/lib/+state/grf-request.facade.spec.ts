import { FileDownloadUrl, FileUploadList } from './grf-request.actions';
import { CmRequestState } from './grf-request.state';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { grfRequestFacade } from './grf-request.facade';
import { provideMockStore } from '@ngrx/store/testing';
import {
  CashMemoDetailsRequestPayload,
  CashMemoItemDetailsRequestPayload,
  CmApprovalRequestPayload,
  GRFRequestDetailsPayload,
  grfRequestListPayload,
  FileUploadDownloadPayload,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { initialState } from './grf-request.reducer';
import * as moment from 'moment';
import {
  ClearGrfRequestDetails,
  ClearGrfRequestList,
  GrfApprovalRequest,
  ConfirmManualGRF,
  LoadGrfProductDetails,
  LoadGrfProductList,
  LoadGrfRequestDetails,
  LoadGrfRequestList
} from './grf-request.actions';

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

const grfRequestDetailsPayload: GRFRequestDetailsPayload = {
  processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
  taskName: 'REQUEST_APPROVER_L1',
  workFlowType: 'MANUAL_BILL'
};

const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
  subTxnType: 'MANUAL_GRF',
  txnType: 'GRF'
};

const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
  id: '4D619FB5-45A3-423B-AE48-33C273633300',
  txnType: 'GRF',
  subTxnType: 'NEW_GRF'
};

const grfApprovalRequestPayload: CmApprovalRequestPayload = {
  isApprove: true,
  requestBody: {},
  processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
  taskName: 'REQUEST_APPROVER_L1',
  taskId: '8CDAA81B-DE68-11EB-BBE7-00155DDE1995'
};

const fileUploadDownloadPayload: FileUploadDownloadPayload = {
  txnType: TransactionTypeEnum.GRF,
  id: '3A0E5E55-1830-4392-98E6-94D16766B6B2'
};

const fileDownloadReq = '1234567';


