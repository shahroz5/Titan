import {
  LoadCmRequestList,
  FileDownloadUrl,
  FileDownloadUrlSuccess,
  FileDownloadUrlFailure,
  FileUploadList,
  FileUploadListSuccess,
  FileUploadListFailure,
  LoadCmRequestListSuccess,
  LoadCmRequestListFailure,
  CmRequestActionTypes,
  LoadCmRequestDetails,
  LoadCmRequestDetailsSuccess,
  LoadCmRequestDetailsFailure,
  LoadCmProductListFailure,
  LoadCmProductListSuccess,
  LoadCmProductList,
  ConfirmManualCMFailure,
  ConfirmManualCMSuccess,
  ConfirmManualCM,
  ClearCmRequestList,
  ClearCmRequestDetails,
  CmApprovalRequestFailure,
  CmApprovalRequestSuccess,
  CmApprovalRequest,
  LoadCmProductDetailsFailure,
  LoadCmProductDetailsSuccess,
  LoadCmProductDetails,
  SetDropownValues,
  ClearCmRequestProductDetails
} from './cm-request.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  StatusTypesEnum,
  AdvanceBookingDetailsResponse,
  CashMemoDetailsRequestPayload,
  FileUploadDownloadPayload,
  TransactionTypeEnum,
  FileUploadLists,
  CmRequestListPayload,
  CmRequestDetailsPayload,
  CmRequestList,
  CmApprovalRequestPayload,
  ApprovalRequest,
  CashMemoItemDetailsRequestPayload,
  CashMemoItemDetails
} from '@poss-web/shared/models';
import * as moment from 'moment';

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

const cmRequestList: CmRequestList[] = [
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

const cmRequestDetailsPayload: CmRequestDetailsPayload = {
  processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
  taskName: 'REQUEST_APPROVER_L1',
  workFlowType: 'MANUAL_BILL'
};

const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
  subTxnType: 'MANUAL_CM',
  txnType: 'CM'
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
  cancelTxnId: 1,
  isFrozenAmount: 0,
  isRivaah: false,
  refDocNo: 1,
  refFiscalYear: 2022,
  hallmarkCharges: 350,
  hallmarkDiscount: 350,
  minPaymentDetails: {},
  cancelRemarks: ''
};

const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
  id: '4D619FB5-45A3-423B-AE48-33C273633300',
  txnType: 'CM',
  subTxnType: 'NEW_CM'
};

const cashMemoItemDetails: CashMemoItemDetails = {
  binCode: '18 COIN',
  discountDetails: null,
  employeeCode: null,
  finalValue: 34170.12,
  inventoryId: 'FF472F1A-B663-4061-8D5C-4BD9CE4983F6',
  inventoryWeightDetails: {
    type: 'WEIGHT_DETAILS',
    data: {
      diamondWeight: 0,
      goldWeight: 8.104,
      materialWeight: 0,
      platinumWeight: 0,
      silverWeight: 0,
      stoneWeight: 0.078
    }
  },
  itemCode: '500452VQAA1A11',
  itemDetails: { type: 'ITEM_DETAILS', data: {} },
  itemId: 'C5B8634F-5739-4E42-AFAE-A8F26F764D1A',
  itemInStock: true,
  lotNumber: '2JA005208',
  measuredWeightDetails: {
    type: 'WEIGHT_DETAILS',
    data: {
      diamondWeight: 0,
      goldWeight: 8.104,
      materialWeight: 0,
      platinumWeight: 0,
      silverWeight: 0,
      stoneWeight: 0.078
    }
  },
  priceDetails: {
    netWeight: 8.104,
    isUcp: false,
    metalPriceDetails: {
      preDiscountValue: 23657.76,
      metalPrices: [
        {
          karat: 18,
          metalTypeCode: 'J',
          metalValue: 23657.76,
          netWeight: 8.104,
          purity: 75,
          ratePerUnit: 2919.27,
          type: 'Gold',
          weightUnit: 'gms'
        }
      ]
    },
    makingChargeDetails: {
      isDynamicPricing: true,
      makingChargePct: null,
      makingChargePercentage: 24.92,
      makingChargePgram: null,
      preDiscountValue: 6617.98,
      wastagePct: null
    },
    stonePriceDetails: {
      numberOfStones: 13,
      preDiscountValue: 2899.14,
      stoneWeight: 0.39,
      stoneWeightForView: 0.078,
      weightUnit: 'carat',
      weightUnitForView: 'gms'
    },
    itemHallmarkDetails: {
      hallmarkGstPct: 12,
      hallmarkingCharges: 120,
      hmQuantity: 1,
      isFOCForHallmarkingCharges: true,
      isHallmarked: true
    }
  },
  productCategoryCode: 'V',
  productGroupCode: '78',
  reason: null,
  refTxnId: null,
  refTxnType: null,
  remarks: null,
  rowId: 1,
  taxDetails: {
    taxType: 'ITEMCHARGES',
    taxClass: 'TC78',
    cess: {
      cessCode: 'ABC',
      cessOnTax: true,
      cessPercentage: 3,
      cessValue: 3400
    },
    data: {
      taxCode: 'CGST',
      taxPercentage: 1.5,
      taxValue: 497.62
    }
  },
  totalDiscount: 0,
  totalQuantity: 1,
  totalTax: 995.24,
  totalValue: 33174.88,
  totalWeight: 8.182,
  unitValue: 33174.88,
  unitWeight: 8.182,
  focDetails: {},
  isFoc: false,
  refSubTxnType: 'NEW_AB',
  hallmarkCharges: 350,
  hallmarkDiscount: 350
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
  txnType: TransactionTypeEnum.CM,
  id: '3A0E5E55-1830-4392-98E6-94D16766B6B2'
};

const fileUploadListRes: FileUploadLists[] = [
  {
    id: '1234567',
    name: 'file1'
  }
];

const fileDownloadReq = { id: '1234567', locationCode: 'CPD' };
const fileDownloadRes = 'http://downloadedurl.com';

describe('Manual Cash Memo Request Action Testing Suite', () => {
  describe('LoadCmRequestList Action Test Cases', () => {
    it('should check correct type is used for  LoadCmRequestList  action ', () => {
      const action = new LoadCmRequestList(cmRequestListPayload);

      expect(action.type).toEqual(CmRequestActionTypes.LOAD_CM_REQUEST_LIST);

      expect(action.payload).toEqual(cmRequestListPayload);
    });
    it('should check correct type is used for LoadCmRequestListSuccess action ', () => {
      const action = new LoadCmRequestListSuccess(cmRequestList);

      expect(action.type).toEqual(
        CmRequestActionTypes.LOAD_CM_REQUEST_LIST_SUCCESS
      );
      expect(action.payload).toEqual(cmRequestList);
    });
    it('should check correct type is used for LoadCmRequestListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCmRequestListFailure(payload);

      expect(action.type).toEqual(
        CmRequestActionTypes.LOAD_CM_REQUEST_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadCmRequestDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadCmRequestDetails  action ', () => {
      const action = new LoadCmRequestDetails(cmRequestDetailsPayload);

      expect(action.type).toEqual(CmRequestActionTypes.LOAD_CM_REQUEST_DETAILS);

      expect(action.payload).toEqual(cmRequestDetailsPayload);
    });
    it('should check correct type is used for LoadCmRequestDetailsSuccess action ', () => {
      const action = new LoadCmRequestDetailsSuccess(cashMemoDetailsResponse);

      expect(action.type).toEqual(
        CmRequestActionTypes.LOAD_CM_REQUEST_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(cashMemoDetailsResponse);
    });
    it('should check correct type is used for LoadCmRequestDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCmRequestDetailsFailure(payload);

      expect(action.type).toEqual(
        CmRequestActionTypes.LOAD_CM_REQUEST_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadCmProductList Action Test Cases', () => {
    it('should check correct type is used for  LoadCmProductList  action ', () => {
      const action = new LoadCmProductList(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(CmRequestActionTypes.LOAD_CM_PRODUCT_LIST);

      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });
    it('should check correct type is used for LoadCmProductListSuccess action ', () => {
      const action = new LoadCmProductListSuccess(cashMemoDetailsResponse);

      expect(action.type).toEqual(
        CmRequestActionTypes.LOAD_CM_PRODUCT_LIST_SUCCESS
      );
      expect(action.payload).toEqual(cashMemoDetailsResponse);
    });
    it('should check correct type is used for LoadCmProductListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCmProductListFailure(payload);

      expect(action.type).toEqual(
        CmRequestActionTypes.LOAD_CM_PRODUCT_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadCmProductDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadCmProductDetails  action ', () => {
      const action = new LoadCmProductDetails(
        cashMemoItemDetailsRequestPayload
      );

      expect(action.type).toEqual(CmRequestActionTypes.LOAD_CM_PRODUCT_DETAILS);

      expect(action.payload).toEqual(cashMemoItemDetailsRequestPayload);
    });
    it('should check correct type is used for LoadCmProductDetailsSuccess action ', () => {
      const action = new LoadCmProductDetailsSuccess([cashMemoItemDetails]);

      expect(action.type).toEqual(
        CmRequestActionTypes.LOAD_CM_PRODUCT_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual([cashMemoItemDetails]);
    });
    it('should check correct type is used for LoadCmProductDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCmProductDetailsFailure(payload);

      expect(action.type).toEqual(
        CmRequestActionTypes.LOAD_CM_PRODUCT_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('CmApprovalRequest Action Test Cases', () => {
    it('should check correct type is used for  CmApprovalRequest  action ', () => {
      const action = new CmApprovalRequest(cmApprovalRequestPayload);

      expect(action.type).toEqual(CmRequestActionTypes.CM_APPROVAL_REQUEST);

      expect(action.payload).toEqual(cmApprovalRequestPayload);
    });
    it('should check correct type is used for CmApprovalRequestSuccess action ', () => {
      const action = new CmApprovalRequestSuccess(approvalRequest);

      expect(action.type).toEqual(
        CmRequestActionTypes.CM_APPROVAL_REQUEST_SUCCESS
      );
      expect(action.payload).toEqual(approvalRequest);
    });
    it('should check correct type is used for CmApprovalRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CmApprovalRequestFailure(payload);

      expect(action.type).toEqual(
        CmRequestActionTypes.CM_APPROVAL_REQUEST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ConfirmManualCM Action Test Cases', () => {
    it('should check correct type is used for  ConfirmManualCM  action ', () => {
      const action = new ConfirmManualCM(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(CmRequestActionTypes.CONFIRM_MANUAL_CM);

      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });
    it('should check correct type is used for ConfirmManualCMSuccess action ', () => {
      const action = new ConfirmManualCMSuccess(cashMemoDetailsResponse);

      expect(action.type).toEqual(
        CmRequestActionTypes.CONFIRM_MANUAL_CM_SUCCESS
      );
      expect(action.payload).toEqual(cashMemoDetailsResponse);
    });
    it('should check correct type is used for ConfirmManualCMFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmManualCMFailure(payload);

      expect(action.type).toEqual(
        CmRequestActionTypes.CONFIRM_MANUAL_CM_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ClearCmRequestList Test Cases', () => {
    it('should check correct type is used for  ClearCmRequestList action ', () => {
      const action = new ClearCmRequestList();

      expect(action.type).toEqual(CmRequestActionTypes.CLEAR_CM_REQUEST_LIST);
    });
  });

  describe('ClearCmRequestDetails Test Cases', () => {
    it('should check correct type is used for  ClearCmRequestDetails action ', () => {
      const action = new ClearCmRequestDetails();

      expect(action.type).toEqual(
        CmRequestActionTypes.CLEAR_CM_REQUEST_DETAILS
      );
    });
  });

  describe('FileUploadList Action Test Cases', () => {
    it('should check correct type is used for  FileUploadList  action ', () => {
      const action = new FileUploadList(fileUploadDownloadPayload);

      expect(action.type).toEqual(CmRequestActionTypes.FILE_UPLOAD_LIST);

      expect(action.payload).toEqual(fileUploadDownloadPayload);
    });
    it('should check correct type is used for FileUploadListSuccess action ', () => {
      const action = new FileUploadListSuccess(fileUploadListRes);

      expect(action.type).toEqual(
        CmRequestActionTypes.FILE_UPLOAD_LIST_SUCCESS
      );
      expect(action.payload).toEqual(fileUploadListRes);
    });
    it('should check correct type is used for FileUploadListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FileUploadListFailure(payload);

      expect(action.type).toEqual(
        CmRequestActionTypes.FILE_UPLOAD_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('FileDownloadUrl Action Test Cases', () => {
    it('should check correct type is used for  FileDownloadUrl  action ', () => {
      const action = new FileDownloadUrl(fileDownloadReq);

      expect(action.type).toEqual(CmRequestActionTypes.FILE_DOWNLOAD_URL);

      expect(action.payload).toEqual(fileDownloadReq);
    });
    it('should check correct type is used for FileDownloadUrlSuccess action ', () => {
      const action = new FileDownloadUrlSuccess(fileDownloadRes);

      expect(action.type).toEqual(
        CmRequestActionTypes.FILE_DOWNLOAD_URL_SUCCESS
      );
      expect(action.payload).toEqual(fileDownloadRes);
    });
    it('should check correct type is used for FileDownloadUrlFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FileDownloadUrlFailure(payload);

      expect(action.type).toEqual(
        CmRequestActionTypes.FILE_DOWNLOAD_URL_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ClearCmRequestProductDetails Test Cases', () => {
    it('should check correct type is used for  ClearCmRequestProductDetails action ', () => {
      const action = new ClearCmRequestProductDetails();

      expect(action.type).toEqual(CmRequestActionTypes.CLEAR_CM_REQUEST_PRODUCT_DETAILS);
    });
  });

  describe('SetDropownValues Test Cases', () => {
    it('should check correct type is used for  SetDropownValues action ', () => {
      const action = new SetDropownValues(StatusTypesEnum.APPROVED);

      expect(action.type).toEqual(CmRequestActionTypes.SET_DROPDOWN_VALUE);
    });
  });
});
