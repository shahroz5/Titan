import { CmRequestEffects } from './cm-request.effects';
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
  LoadCmRequestList,
  LoadCmRequestListSuccess,
  LoadCmRequestDetails,
  LoadCmRequestDetailsFailure,
  LoadCmRequestDetailsSuccess,
  LoadCmProductList,
  LoadCmProductListSuccess,
  LoadCmProductListFailure,
  LoadCmProductDetails,
  LoadCmProductDetailsSuccess,
  LoadCmProductDetailsFailure,
  CmApprovalRequestFailure,
  CmApprovalRequest,
  CmApprovalRequestSuccess,
  ConfirmManualCM,
  ConfirmManualCMSuccess,
  ConfirmManualCMFailure,
  ClearCmRequestList
} from './cm-request.actions';
import { hot, cold } from 'jasmine-marbles';
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
  FileUploadLists,
  StatusTypesEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CmRequestService } from '../cm-request.service';
import { Observable } from 'rxjs';
import { cmRequestFeatureKey, initialState } from './cm-request.reducer';
import { CashMemoService } from '@poss-web/poss/cash-memo/data-access-cash-memo';

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

const fileDownloadReq = {id:'1234567', locationCode: 'CPD'};
const fileDownloadRes = 'http://downloadedurl.com';

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

describe('Manual Cash Memo Request Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CmRequestEffects;

  const CmRequestServiceSpy = jasmine.createSpyObj<CmRequestService>(
    'CmRequestService',
    [
      'getCmRequestList',
      'getCmRequestDetails',
      'getCmProductList',
      'getCmProductDetails',
      'getCmApprovalRequest',
      'uploadFileList',
      'downloadFile'
    ]
  );

  const cashMemoServiceSpy = jasmine.createSpyObj<CashMemoService>([
    'updateCashMemo'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CmRequestEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [cmRequestFeatureKey]: initialState
          }
        }),
        provideMockActions(() => actions$),
        {
          provide: CmRequestService,
          useValue: CmRequestServiceSpy
        },
        {
          provide: CashMemoService,
          useValue: cashMemoServiceSpy
        }
      ]
    });

    effect = TestBed.inject(CmRequestEffects);
  });

  describe('loadCmRequestList', () => {
    it('should return LoadCmRequestList response', () => {
      const action = new LoadCmRequestList(cmRequestListPayload);
      const outcome = new LoadCmRequestListSuccess(cmRequestList);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cmRequestList
      });
      CmRequestServiceSpy.getCmRequestList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadCmRequestList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCmRequestList(cmRequestListPayload);
      const error = new Error('some error');
      const outcome = new ClearCmRequestList();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      CmRequestServiceSpy.getCmRequestList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCmRequestList$).toBeObservable(expected);
    });
  });

  describe('loadCmRequestDetails', () => {
    it('should return a LoadCmRequestDetails response', () => {
      const action = new LoadCmRequestDetails(cmRequestDetailsPayload);
      const outcome = new LoadCmRequestDetailsSuccess(cmRequestDetails);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cmRequestDetails
      });
      CmRequestServiceSpy.getCmRequestDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadCmRequestDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCmRequestDetails(cmRequestDetailsPayload);
      const error = new Error('some error');
      const outcome = new LoadCmRequestDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      CmRequestServiceSpy.getCmRequestDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCmRequestDetails$).toBeObservable(expected);
    });
  });

  describe('loadCmProductList', () => {
    it('should return a LoadCmProductList response', () => {
      const action = new LoadCmProductList(cashMemoDetailsRequestPayload);
      const outcome = new LoadCmProductListSuccess(cashMemoDetailsResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cashMemoDetailsResponse
      });
      CmRequestServiceSpy.getCmProductList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadCmProductList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCmProductList(cashMemoDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new LoadCmProductListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      CmRequestServiceSpy.getCmProductList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCmProductList$).toBeObservable(expected);
    });
  });

  describe('loadCmProductDetails', () => {
    it('should return a LoadCmProductDetails response', () => {
      const action = new LoadCmProductDetails(
        cashMemoItemDetailsRequestPayload
      );
      const outcome = new LoadCmProductDetailsSuccess([cashMemoItemDetails]);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cashMemoItemDetails
      });
      CmRequestServiceSpy.getCmProductDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadCmProductDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCmProductDetails(
        cashMemoItemDetailsRequestPayload
      );
      const error = new Error('some error');
      const outcome = new LoadCmProductDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      CmRequestServiceSpy.getCmProductDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCmProductDetails$).toBeObservable(expected);
    });
  });

  describe('cmApprovalRequest', () => {
    it('should return a CmApprovalRequest response', () => {
      const action = new CmApprovalRequest(cmApprovalRequestPayload);
      const outcome = new CmApprovalRequestSuccess(approvalRequest);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: approvalRequest
      });
      CmRequestServiceSpy.getCmApprovalRequest.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.cmApprovalRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CmApprovalRequest(cmApprovalRequestPayload);
      const error = new Error('some error');
      const outcome = new CmApprovalRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      CmRequestServiceSpy.getCmApprovalRequest.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cmApprovalRequest$).toBeObservable(expected);
    });
  });

  describe('confirmManualCM', () => {
    it('should return a ConfirmManualCM response', () => {
      const action = new ConfirmManualCM(cashMemoDetailsRequestPayload);
      const outcome = new ConfirmManualCMSuccess(cashMemoDetailsResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cashMemoDetailsResponse
      });
      cashMemoServiceSpy.updateCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.confirmManualCM$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ConfirmManualCM(cashMemoDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new ConfirmManualCMFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoServiceSpy.updateCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirmManualCM$).toBeObservable(expected);
    });
  });

  describe('FileUploadList', () => {
    it('should return a FileUploadList response', () => {
      const action = new FileUploadList(fileUploadDownloadPayload);
      const outcome = new FileUploadListSuccess(fileUploadListRes);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: fileUploadListRes
      });
      CmRequestServiceSpy.uploadFileList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.getFileUploadList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FileUploadList(fileUploadDownloadPayload);
      const error = new Error('some error');
      const outcome = new FileUploadListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      CmRequestServiceSpy.uploadFileList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getFileUploadList$).toBeObservable(expected);
    });
  });

  describe('FileDownloadUrl', () => {
    it('should return a FileDownloadUrl response', () => {
      const action = new FileDownloadUrl(fileDownloadReq);
      const outcome = new FileDownloadUrlSuccess(fileDownloadRes);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: fileDownloadRes
      });
      CmRequestServiceSpy.downloadFile.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.getFileDownload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FileDownloadUrl(fileDownloadReq);
      const error = new Error('some error');
      const outcome = new FileDownloadUrlFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      CmRequestServiceSpy.downloadFile.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getFileDownload$).toBeObservable(expected);
    });
  });
});
