import {
  LoadGrfRequestList,
  FileDownloadUrl,
  FileDownloadUrlSuccess,
  FileDownloadUrlFailure,
  FileUploadList,
  FileUploadListSuccess,
  FileUploadListFailure,
  LoadGrfRequestListSuccess,
  LoadGrfRequestListFailure,
  GrfRequestActionTypes,
  LoadGrfRequestDetails,
  LoadGrfRequestDetailsSuccess,
  LoadGrfRequestDetailsFailure,
  LoadGrfProductListFailure,
  LoadGrfProductListSuccess,
  LoadGrfProductList,
  ConfirmManualGRFFailure,
  ConfirmManualGRFSuccess,
  ConfirmManualGRF,
  ClearGrfRequestList,
  ClearGrfRequestDetails,
  GrfApprovalRequestFailure,
  GrfApprovalRequestSuccess,
  GrfApprovalRequest,
  LoadGrfProductDetailsFailure,
  LoadGrfProductDetailsSuccess,
  LoadGrfProductDetails
} from './grf-request.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  StatusTypesEnum,
  AdvanceBookingDetailsResponse,
  CashMemoDetailsRequestPayload,
  FileUploadDownloadPayload,
  TransactionTypeEnum,
  FileUploadLists,
  grfRequestListPayload,
  GRFRequestDetailsPayload,
  GRFRequestList,
  CmApprovalRequestPayload,
  ApprovalRequest,
  CashMemoItemDetailsRequestPayload,
  CashMemoItemDetails,
  CashMemoDetailsResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';

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

const cashMemoDetailsResponse: CashMemoDetailsResponse = {
  customerId: 1,
  cancelTxnId: 1,
  discountDetails: 0,
  docDate: moment(),
  docNo: 1,
  employeeCode: '',
  finalValue: 123,
  firstHoldTime: moment(),
  fiscalYear: 2015,
  focDetails: {},
  id: '',
  taxDetails: {
    cess: {
      cessCode: 'cess code',
      cessOnTax: false,
      cessPercentage: 3,
      cessValue: 3400
    },
    data: {
      taxCode: 'CGST',
      taxPercentage: 1.5,
      taxValue: 437.47
    },
    taxClass: 'TC72',
    taxType: 'ITEMCHARGES'
  },
  lastHoldTime: moment(),
  metalRateList: {},
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
  totalDiscount: 1,
  totalQuantity: 1,
  totalTax: 1,
  totalValue: 1,
  totalWeight: 1,
  txnTime: moment(),
  customerDocDetails: null,
  refSubTxnType: 'MANUAL_AB',
  hallmarkCharges: 0,
  hallmarkDiscount: 0,
  refDocNo: 0,
  refFiscalYear: 0,
  cancelRemarks: '',
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

const fileDownloadReq = '1234567';
const fileDownloadRes = 'http://downloadedurl.com';

describe('Manual Cash Memo Request Action Testing Suite', () => {
  describe('LoadGrfRequestList Action Test Cases', () => {
    it('should check correct type is used for  LoadGrfRequestList  action ', () => {
      const action = new LoadGrfRequestList(cmRequestListPayload);

      expect(action.type).toEqual(GrfRequestActionTypes.LOAD_GRF_REQUEST_LIST);

      expect(action.payload).toEqual(cmRequestListPayload);
    });
    it('should check correct type is used for LoadGrfRequestListSuccess action ', () => {
      const action = new LoadGrfRequestListSuccess(cmRequestList);

      expect(action.type).toEqual(
        GrfRequestActionTypes.LOAD_GRF_REQUEST_LIST_SUCCESS
      );
      expect(action.payload).toEqual(cmRequestList);
    });
    it('should check correct type is used for LoadGrfRequestListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGrfRequestListFailure(payload);

      expect(action.type).toEqual(
        GrfRequestActionTypes.LOAD_GRF_REQUEST_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadGrfRequestDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadGrfRequestDetails  action ', () => {
      const action = new LoadGrfRequestDetails(cmRequestDetailsPayload);

      expect(action.type).toEqual(GrfRequestActionTypes.LOAD_GRF_REQUEST_DETAILS);

      expect(action.payload).toEqual(cmRequestDetailsPayload);
    });
    it('should check correct type is used for LoadGrfRequestDetailsSuccess action ', () => {
      const action = new LoadGrfRequestDetailsSuccess(cashMemoDetailsResponse);

      expect(action.type).toEqual(
        GrfRequestActionTypes.LOAD_GRF_REQUEST_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(cashMemoDetailsResponse);
    });
    it('should check correct type is used for LoadGrfRequestDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGrfRequestDetailsFailure(payload);

      expect(action.type).toEqual(
        GrfRequestActionTypes.LOAD_GRF_REQUEST_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadGrfProductList Action Test Cases', () => {
    it('should check correct type is used for  LoadGrfProductList  action ', () => {
      const action = new LoadGrfProductList(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(GrfRequestActionTypes.LOAD_GRF_PRODUCT_LIST);

      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });
    it('should check correct type is used for LoadGrfProductListSuccess action ', () => {
      const action = new LoadGrfProductListSuccess(cashMemoDetailsResponse);

      expect(action.type).toEqual(
        GrfRequestActionTypes.LOAD_GRF_PRODUCT_LIST_SUCCESS
      );
      expect(action.payload).toEqual(cashMemoDetailsResponse);
    });
    it('should check correct type is used for LoadGrfProductListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGrfProductListFailure(payload);

      expect(action.type).toEqual(
        GrfRequestActionTypes.LOAD_GRF_PRODUCT_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });


  describe('GrfApprovalRequest Action Test Cases', () => {
    it('should check correct type is used for  GrfApprovalRequest  action ', () => {
      const action = new GrfApprovalRequest(cmApprovalRequestPayload);

      expect(action.type).toEqual(GrfRequestActionTypes.GRF_APPROVAL_REQUEST);

      expect(action.payload).toEqual(cmApprovalRequestPayload);
    });
    it('should check correct type is used for GrfApprovalRequestSuccess action ', () => {
      const action = new GrfApprovalRequestSuccess(approvalRequest);

      expect(action.type).toEqual(
        GrfRequestActionTypes.GRF_APPROVAL_REQUEST_SUCCESS
      );
      expect(action.payload).toEqual(approvalRequest);
    });
    it('should check correct type is used for GrfApprovalRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GrfApprovalRequestFailure(payload);

      expect(action.type).toEqual(
        GrfRequestActionTypes.GRF_APPROVAL_REQUEST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ConfirmManualGRF Action Test Cases', () => {
    it('should check correct type is used for  ConfirmManualGRF  action ', () => {
      const action = new ConfirmManualGRF(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(GrfRequestActionTypes.CONFIRM_MANUAL_GRF);

      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });
    it('should check correct type is used for ConfirmManualGRFSuccess action ', () => {
      const action = new ConfirmManualGRFSuccess(cashMemoDetailsResponse);

      expect(action.type).toEqual(
        GrfRequestActionTypes.CONFIRM_MANUAL_GRF_SUCCESS
      );
      expect(action.payload).toEqual(cashMemoDetailsResponse);
    });
    it('should check correct type is used for ConfirmManualGRFFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmManualGRFFailure(payload);

      expect(action.type).toEqual(
        GrfRequestActionTypes.CONFIRM_MANUAL_GRF_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ClearGrfRequestList Test Cases', () => {
    it('should check correct type is used for  ClearGrfRequestList action ', () => {
      const action = new ClearGrfRequestList();

      expect(action.type).toEqual(GrfRequestActionTypes.CLEAR_GRF_REQUEST_LIST);
    });
  });

  describe('ClearGrfRequestDetails Test Cases', () => {
    it('should check correct type is used for  ClearGrfRequestDetails action ', () => {
      const action = new ClearGrfRequestDetails();

      expect(action.type).toEqual(
        GrfRequestActionTypes.CLEAR_GRF_REQUEST_DETAILS
      );
    });
  });

  describe('FileUploadList Action Test Cases', () => {
    it('should check correct type is used for  FileUploadList  action ', () => {
      const action = new FileUploadList(fileUploadDownloadPayload);

      expect(action.type).toEqual(GrfRequestActionTypes.FILE_UPLOAD_LIST);

      expect(action.payload).toEqual(fileUploadDownloadPayload);
    });
    it('should check correct type is used for  FileUploadListSuccess  action ', () => {
      const action = new FileUploadListSuccess(fileUploadListRes);

      expect(action.type).toEqual(GrfRequestActionTypes.FILE_UPLOAD_LIST_SUCCESS);

      expect(action.payload).toEqual(fileUploadListRes);
    });
    it('should check correct type is used for  FileUploadList  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      )
      const action = new FileUploadListFailure(payload);

      expect(action.type).toEqual(GrfRequestActionTypes.FILE_UPLOAD_LIST_FAILURE);

      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadGrfProductDetails', () => {
    it('should check correct type is used for LoadGrfProductDetails action', () => {
      const payload: CashMemoItemDetailsRequestPayload = {
        txnType: 'GRF',
        subTxnType: 'MANUAL_GRF',
        id: '1'
      }
      const action  = new LoadGrfProductDetails(payload);

      expect(action.type).toEqual(GrfRequestActionTypes.LOAD_GRF_PRODUCT_DETAILS)

      expect(action.payload).toEqual(payload);
    })
    it('should check correct type is used for LoadGrfProductDetailsSuccess action', () => {
      const payload: CashMemoItemDetails[] = [
        {
          itemCode: '123',
          lotNumber: 'LOTNUMBER',
          binCode: 'CHAIN',
          inventoryId: 'TestId',
          finalValue: 123,
          remarks: 'remarks',
          totalDiscount: 1,
          totalQuantity: 12,
          totalTax: 1,
          totalValue: 826133,
          totalWeight: 269.728,
          unitValue: 60002.3,
          unitWeight: 12.081,
          employeeCode: 'code',
          discountDetails: {},
          focDetails: {},
          taxDetails: {
            cess: {
              cessCode: 'cess code',
              cessOnTax: false,
              cessPercentage: 3,
              cessValue: 3400
            },
            data: {
              taxCode: 'CGST',
              taxPercentage: 1.5,
              taxValue: 437.47
            },
            taxClass: 'TC72',
            taxType: 'ITEMCHARGES'
          },
          priceDetails: {
            isUcp: true,
            makingChargeDetails: {
              isDynamicPricing: false,
              makingChargePercentage: 26.5,
              preDiscountValue: 612.0,
              makingChargePct: 0,
              makingChargePgram: 0,
              wastagePct: 12.5
            },
            metalPriceDetails: {
              metalPrices: [{
                karat: 0,
                metalTypeCode: 'J',
                metalValue: 46948.85,
                netWeight: 3.123,
                purity: 12,
                ratePerUnit: 4762,
                type: 'type',
                weightUnit: 'gms'
              }],
              preDiscountValue: 67
            },
            stonePriceDetails: {
              numberOfStones: null,
              stoneWeight: 0,
              weightUnit: 'gms',
              preDiscountValue: 612.0,
              stoneWeightForView: null,
              weightUnitForView: null
            },
            itemHallmarkDetails: {
              hallmarkGstPct: 12,
              hallmarkingCharges: 120,
              hmQuantity: 1,
              isFOCForHallmarkingCharges: false,
              isHallmarked: true
            },
            netWeight: 67
          },
          inventoryWeightDetails: {
            type: 'type',
            data: {
              goldWeight: 12.081,
              materialWeight: 0,
              platinumWeight: 0.0,
              silverWeight: 0.0,
              stoneWeight: null,
              diamondWeight: 0
            }
          },
          isFoc: false,
          measuredWeightDetails: {
            type: '5',
            data: {
              goldWeight: 12.081,
              materialWeight: 0,
              platinumWeight: 0,
              silverWeight: 0.0,
              stoneWeight: 12.33,
              diamondWeight: 0.0
          }
        },
        productCategoryCode: 'Test1',
        productGroupCode: 'Test2',
        refTxnId: 'RefTxnId',
        refTxnType: 'RefTxnType',
        refSubTxnType: 'SubTxnType',
        hallmarkCharges: 23,
        hallmarkDiscount: 4,
        rowId: 1,
        reason: 'reason'
      }
    ]
      const action  = new LoadGrfProductDetailsSuccess(payload);

      expect(action.type).toEqual(GrfRequestActionTypes.LOAD_GRF_PRODUCT_DETAILS_SUCCESS)

      expect(action.payload).toEqual(payload);
    })
    it('should check correct type is used for LoadGrfProductDetailsFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      )

      const action  = new LoadGrfProductDetailsFailure(payload);

      expect(action.type).toEqual(GrfRequestActionTypes.LOAD_GRF_PRODUCT_DETAILS_FAILURE)

      expect(action.payload).toEqual(payload);
    })
  })

  describe('FileDownloadUrl  Action Test Cases', () => {
    it('should check correct type is used for  FileDownloadUrl   action ', () => {
      const payload = {
        id: '1',
        locationCode: 'IND'
      }
      const action = new FileDownloadUrl(payload);

      expect(action.type).toEqual(GrfRequestActionTypes.FILE_DOWNLOAD_URL);

      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  FileDownloadUrlSuccess  action ', () => {
      const action = new FileDownloadUrlSuccess('IND');

      expect(action.type).toEqual(GrfRequestActionTypes.FILE_DOWNLOAD_URL_SUCCESS);

      expect(action.payload).toEqual('IND');
    });
    it('should check correct type is used for  FileDownloadUrlFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      )
      const action = new FileDownloadUrlFailure(payload);

      expect(action.type).toEqual(GrfRequestActionTypes.FILE_DOWNLOAD_URL_FAILURE);

      expect(action.payload).toEqual(payload);
    });
  });
});
