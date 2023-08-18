import { GrfRequestEffects } from './grf-request.effects';
import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  FileDownloadUrl,
  FileDownloadUrlSuccess,
  FileDownloadUrlFailure,
  FileUploadListFailure,
  FileUploadList,
  FileUploadListSuccess,
  LoadGrfRequestList,
  LoadGrfRequestListSuccess,
  LoadGrfRequestDetails,
  LoadGrfRequestDetailsFailure,
  LoadGrfRequestDetailsSuccess,
  LoadGrfProductList,
  LoadGrfProductListSuccess,
  LoadGrfProductListFailure,
  LoadGrfProductDetails,
  LoadGrfProductDetailsSuccess,
  LoadGrfProductDetailsFailure,
  GrfApprovalRequestFailure,
  GrfApprovalRequest,
  GrfApprovalRequestSuccess,
  ConfirmManualGRF,
  ConfirmManualGRFSuccess,
  ConfirmManualGRFFailure,
  ClearGrfRequestList
} from './grf-request.actions';
import { hot, cold } from 'jasmine-marbles';
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
  CustomerInfo,
  FileUploadDownloadPayload,
  FileUploadLists,
  ManualBillDetails,
  StatusTypesEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { grfRequestService } from '../grf-request.service';
import { Observable } from 'rxjs';
import { cmRequestFeatureKey, initialState } from './grf-request.reducer';


const cmRequestListPayload: grfRequestListPayload = {
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

const cmRequestDetailsPayload: GRFRequestDetailsPayload = {
  processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
  taskName: 'REQUEST_APPROVER_L1',
  workFlowType: 'MANUAL_BILL'
};

const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
  subTxnType: 'MANUAL_GRF',
  txnType: 'GRF'
};

const cashMemoDetailsResponse: AdvanceBookingDetailsResponse = {
  activationDetails: {},
  cancellationDetails: {},
  confirmedTime: moment(),
  customerId: 1,
  discountDetails: 0,
  docDate: moment(),
  docNo: 1,
  employeeCode: '',
  finalValue: 123,
  firstHoldTime: moment(),
  fiscalYear: 2015,
  focDetails: {},
  id: '',
  isBestRate: true,
  isFrozenRate: true,
  lastHoldTime: moment(),
  metalRateList: {},
  minValue: 1,
  occasion: '',
  txnType: '',
  otherChargesList: {},
  paidValue: 1,
  refTxnId: '',
  refTxnType: '',
  remarks: '',
  roundingVariance: 1,
  status: StatusTypesEnum.APPROVED,
  subTxnType: '',
  taxDetails: {
    taxes: [
      {
        taxType: 'ITEMCHARGES',
        taxClass: 'TC72',
        data: {
          SGST: { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 437.42 },
          CGST: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 437.42 }
        },
        cess: {}
      }
    ]
  },
  totalDiscount: 1,
  totalQuantity: 1,
  totalTax: 1,
  totalValue: 1,
  totalWeight: 1,
  txnTime: moment(),
  customerDocDetails: null,
  refSubTxnType: 'MANUAL_AB',
  cancelTxnId: 0,
  isRivaah: false,
  isFrozenAmount: 0,
  hallmarkCharges: 0,
  hallmarkDiscount: 0,
  refDocNo: 0,
  refFiscalYear: 0,
  cancelRemarks: '',
  minPaymentDetails: {}
};

const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
  id: '4D619FB5-45A3-423B-AE48-33C273633300',
  txnType: 'GRF',
  subTxnType: 'NEW_GRF'
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

const cmRequestDetails: CmRequestDetails = {
  approvalLevel: 1,
  approvalStatus: 'APPROVED',
  approvedData: null,
  docNo: 89,
  headerData: null,
  locationCode: 'CPD',
  processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
  requestorRemarks: 'testing',
  requestorUserName: 'Requestor1'
};


