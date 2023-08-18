import {
  BillCancellation,
  BillCancellationRequests,
  BillCancelPayload,
  BillCancelStatus,
  BillCancelStatusList,
  CancelResponse,
  CashMemoDetailsRequestPayload,
  CashMemoDetailsResponse,
  CashMemoItemDetails,
  CashMemoItemDetailsRequestPayload,
  CmBillList,
  CmBillListPayload,
  ConfirmResponse,
  CustomErrors,
  Lov,
  StatusTypesEnum
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import {
  ApproveBillCancellationRequests,
  ApproveBillCancellationRequestsFailure,
  ApproveBillCancellationRequestsSuccess,
  ApprovePayload,
  BillCancellationRequestsActionsTypes,
  BillCancellationRequestsListPayload,
  BillCancelListPayload,
  CANCELRequest,
  CANCELRequestFailure,
  CANCELRequestSuccess,
  CONFIRMRequest,
  CONFIRMRequestFailure,
  CONFIRMRequestSuccess,
  DeleteRequest,
  DeleteRequestFailure,
  DeleteRequestSuccess,
  GetItemfromCashMemo,
  GetItemfromCashMemoFailure,
  GetItemfromCashMemoSuccess,
  LoadBillCancellationRequests,
  LoadBillCancellationRequestsFailure,
  LoadBillCancellationRequestsStatus,
  LoadBillCancellationRequestsStatusFailure,
  LoadBillCancellationRequestsStatusSuccess,
  LoadBillCancellationRequestsSuccess,
  LoadCountBillCancellation,
  LoadCountBillCancellationFailure,
  LoadCountBillCancellationSuccess,
  LoadLocation,
  LoadLocationFailure,
  LoadLocationSuccess,
  LoadSelectedDataFailure,
  LoadSelectedDataSucess,
  LoadSeltedData,
  Reset,
  ResetBc,
  RESETDETAIL,
  RESETFILTER,
  ViewCashMemo,
  ViewCashMemoFailure,
  ViewCashMemoSuccess
} from './bill-cancellation-requests.actions';

describe('Bill Cancellation Action Testing suit', () => {
  const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
    id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
    subTxnType: 'NEW_CM',
    txnType: 'CM',
    itemId: '741B3399-ED98-44D8-B25D-BBDADCA2F1D2'
  };

  const CmItemDetailsResponse: CashMemoItemDetails = {
    itemCode: '503820DCEABAP1',
    lotNumber: '2EA000011',
    // inventoryWeight: 12.081
    unitWeight: 12.081,
    totalWeight: 12.05,
    totalQuantity: 1,
    inventoryId: 'AAB96E94-3AF9-4ADD-A6FC-0044417CDD67',
    unitValue: 60002.3,
    totalValue: 60002.3,
    totalDiscount: 0.0,
    finalValue: 61802.36,
    totalTax: 1800.06,
    employeeCode: 'rsocpd',
    remarks: 'asd',
    reason: null,
    itemId: '741B3399-ED98-44D8-B25D-BBDADCA2F1D2',
    binCode: 'ZEROBIN',
    rowId: 1,
    refTxnId: null,
    refTxnType: null,
    inventoryWeightDetails: {
      type: 'WEIGHT_DETAILS',
      data: {
        goldWeight: 12.081,
        platinumWeight: 0,
        silverWeight: 0,
        stoneWeight: 0.53,
        materialWeight: 0,
        diamondWeight: 0.0
      }
    },
    measuredWeightDetails: {
      type: 'WEIGHT_DETAILS',
      data: {
        silverWeight: 0.0,
        stoneWeight: 0,
        materialWeight: 0,
        goldWeight: 0.0,
        diamondWeight: 0,
        platinumWeight: 0.0
      }
    },
    priceDetails: {
      isUcp: true,
      netWeight: 67,
      metalPriceDetails: {
        preDiscountValue: 46948.85,

        metalPrices: [
          {
            weightUnit: 'gms',
            netWeight: 12.05,
            metalValue: 46948.85,
            type: 'Gold',
            ratePerUnit: 3896.17,
            karat: 18.0,
            purity: 75.0,
            metalTypeCode: 'J'
          }
        ]
      },
      stonePriceDetails: {
        preDiscountValue: 612.0,
        weightUnit: null,
        stoneWeight: null,
        numberOfStones: null,
        stoneWeightForView: null,
        weightUnitForView: null
      },
      makingChargeDetails: {
        preDiscountValue: 12441.45,
        makingChargePercentage: 26.5,
        makingChargePct: 5,
        makingChargePgram: 6,
        wastagePct: 7,
        isDynamicPricing: true
      },
      itemHallmarkDetails: {
        hallmarkGstPct: 12,
        hallmarkingCharges: 120,
        hmQuantity: 1,
        isFOCForHallmarkingCharges: true,
        isHallmarked: true
      }
    },
    taxDetails: {
      taxType: 'ITEMCHARGES',
      taxClass: 'TC75',
      data: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },
      cess: null
    },
    productGroupCode: '75',
    productCategoryCode: 'D',
    discountDetails: null,
    focDetails: {},
    isFoc: true,
    itemInStock: true,
    refSubTxnType: 'NEW_AB',
    hallmarkCharges: 350,
    hallmarkDiscount: 350
  };

  const billCancelPayload: BillCancelPayload = {
    cancelType: 'CANCEL_WITH_CN',
    employeeCode: 'rso',
    reasonForCancellation: 'test',
    refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
    remarks: 'test'
  };

  const cancelResponse: CancelResponse = {
    cndocNos: [234, 235],
    docNo: 12,
    id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28'
  };

  const confirmResponse: ConfirmResponse = {
    docNo: 12,
    id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
    requestNo: '90'
  };

  const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
    id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
    subTxnType: 'NEW_CM',
    txnType: 'CM'
  };

  const cashMemoDetailsResponse: CashMemoDetailsResponse = {
    customerId: 6,
    occasion: 'Wedding/Marriage',
    totalQuantity: 1,
    totalWeight: 12.05,
    totalValue: 60002.3,
    totalTax: 1800.06,
    finalValue: 61802.0,
    totalDiscount: 0.0,
    paidValue: 61802.0,
    remarks: 'Remarks',
    // otherCharges: null,
    otherChargesList: null,
    metalRateList: {
      metalRates: {
        J: {
          metalTypeCode: 'J',
          purity: 91.62,
          ratePerUnit: 4762,
          currency: 'INR',
          applicableDate: 1611081000000,
          karat: 22.0
        },
        L: {
          metalTypeCode: 'L',
          purity: 95.0,
          ratePerUnit: 3473,
          currency: 'INR',
          applicableDate: 1611081000000,
          karat: 0.0
        }
      }
    },
    id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
    status: StatusTypesEnum.CONFIRMED,
    refTxnId: null,
    refTxnType: null,
    docNo: 54,
    docDate: moment(1611081000000),
    fiscalYear: 2020,
    firstHoldTime: moment(1610012299519),
    lastHoldTime: moment(1610012299519),
    roundingVariance: -0.36,
    employeeCode: 'cashiercpd',
    txnType: 'CM',
    subTxnType: 'NEW_CM',
    // confirmedTime: moment(1611110936440),
    manualBillDetails: null,
    taxDetails: {
      // taxes: [
      //   {
      //     taxType: 'ITEMCHARGES',
      //     taxClass: 'TC75',
      //     data: [
      //       { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },
      //       { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 900.03 }
      //     ],
      //     cess: []
      //   }
      // ]
      taxType: 'ITEMCHARGES',
      taxClass: 'TC75',
      data: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },
      cess: null
    },
    // currencyCode: 'INR',
    // weightUnit: 'gms',
    // manualBillId: null,
    discountDetails: null,
    itemIdList: ['741B3399-ED98-44D8-B25D-BBDADCA2F1D2'],
    focDetails: null,
    txnTime: null,
    refSubTxnType: 'NEW_AB',
    customerDocDetails: null,
    cancelTxnId: 1,
    refDocNo: 1,
    refFiscalYear: 2022,
    hallmarkCharges: 350,
    hallmarkDiscount: 350
  };

  const cmBillListPayload: CmBillListPayload = {
    subTxnType: 'NEW_CM',
    txnType: 'CM',
    sort: 'docDate, DESC'
    // customerName?: string;
    // refDocNo?: number;
    // pageIndex?: number;
    // pageSize?: number;
  };

  const cmBillList: CmBillList[] = [
    {
      currencyCode: 'INR',
      customerName: 'SREENIVAS',
      refDocDate: moment(1611081000000),
      refDocNo: 54,
      refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      refTxnTime: moment(1611110936440),
      subTxnType: 'NEW_CM',
      totalValue: 60002.3,
      txnType: 'CM',
      totalElements: 10
    }
  ];

  const LOVCode = 'REASON_FOR_CANCELLATION';

  const dummyReasonForCancelResponse: Lov[] = [
    {
      code: 'CM',
      isActive: true,
      value: 'Cash Memo'
    }
  ];

  const RSOCode = 'RSO';

  const RSOResponae = ['RSO'];

  const billCancellationRequestsListPayload: BillCancellationRequestsListPayload = {
    approvalStatus: 'PENDING',
    workflowType: 'BILL_CANCELLATION',
    body: {}
  };

  const billCancellation: BillCancellation = {
    approvedBy: null,
    approvedDate: null,
    approverRemarks: null,
    docNo: 8,
    fiscalYear: 2022,
    headerData: {},
    processId: 'F17D8C04-CD05-11EC-9F7B-00155DB7A401',
    requestedBy: 'cashiercpd',
    requestedDate: 1651818595489,
    requestorRemarks: null,
    workflowType: 'BILL_CANCELLATION',
    invoiceNo: 2,
    docDate: moment(1651818595489),
    customerName: '353',
    totalAmount: 10000,
    locationCode: 'CPD',
    taskId: '1',
    taskName: null
  };

  const billCancellationRequests: BillCancellationRequests = {
    results: [billCancellation],
    count: 1
  };

  const approvePayload: ApprovePayload = {
    approved: 'true',
    body: {
      approvedData: {
        data: {},
        type: null
      },
      approverRemarks: 'test'
    },
    processId: 'p1',
    taskId: 't1',
    taskName: 'testName'
  };

  const billCancelListPayload: BillCancelListPayload = {
    httpMethod: 'GET',
    relativeUrl: 'http://test.com',
    reqBody: {},
    requestParams: {
      workflowType: 'BILL_CANCELLATION',
      approvalStatus: 'PENDING'
    }
  };

  const billCancelStatus: BillCancelStatus = {
    approvalLevel: 1,
    approvalStatus: 'PENDING',
    approvedBy: null,
    approvedDate: null,
    approverRemarks: null,
    docNo: 8,
    fiscalYear: 2022,
    headerData: {},
    processId: 'F17D8C04-CD05-11EC-9F7B-00155DB7A401',
    requestedBy: 'cashiercpd',
    requestedDate: moment(1651818595489),
    requestorRemarks: null,
    workflowType: 'BILL_CANCELLATION'
  };

  const billCancelStatusList: BillCancelStatusList = {
    response: null,
    pageNumber: 1,
    pageSize: 10,
    results: [billCancelStatus],
    totalElements: 10,
    totalPages: 5
  };

  const selectedDataPayload = {
    workflowType: 'BILL_CANCELLATION',
    processId: 'p1'
  };

  describe('Get Item from Cash Memo Action Test Cases', () => {
    it('should check correct type is used for  GetItemfromCashMemo action ', () => {
      const action = new GetItemfromCashMemo(cashMemoItemDetailsRequestPayload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.GET_ITEM_FROM_CASH_MEMO
      );
      expect(action.payload).toEqual(cashMemoItemDetailsRequestPayload);
    });

    it('should check correct type is used for  GetItemfromCashMemoSuccess action ', () => {
      const action = new GetItemfromCashMemoSuccess(CmItemDetailsResponse);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.GET_ITEM_FROM_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual(CmItemDetailsResponse);
    });

    it('should check correct type is used for  GetItemfromCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetItemfromCashMemoFailure(payload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.GET_ITEM_FROM_CASH_MEMO_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Cancel Request Action Test Cases', () => {
    it('should check correct type is used for  CancelRequest action ', () => {
      const action = new CANCELRequest(billCancelPayload);

      expect(action.type).toEqual(BillCancellationRequestsActionsTypes.CANCEL);
      expect(action.payload).toEqual(billCancelPayload);
    });

    it('should check correct type is used for  CancelRequestSuccess action ', () => {
      const action = new CANCELRequestSuccess(cancelResponse);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.CANCEL_SUCCESS
      );
      expect(action.payload).toEqual(cancelResponse);
    });

    it('should check correct type is used for  CancelRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CANCELRequestFailure(payload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.CANCEL_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Confirm Request Action Test Cases', () => {
    it('should check correct type is used for  ConfirmRequest action ', () => {
      const action = new CONFIRMRequest(billCancelPayload);

      expect(action.type).toEqual(BillCancellationRequestsActionsTypes.CONFIRM);
      expect(action.payload).toEqual(billCancelPayload);
    });

    it('should check correct type is used for  ConfirmRequestSuccess action ', () => {
      const action = new CONFIRMRequestSuccess(confirmResponse);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.CONFIRM_SUCCESS
      );
      expect(action.payload).toEqual(confirmResponse);
    });

    it('should check correct type is used for  ConfirmRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CONFIRMRequestFailure(payload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.CONFIRM_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('View Cash Memo Action Test Cases', () => {
    it('should check correct type is used for  ViewCashMemo action ', () => {
      const action = new ViewCashMemo(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.VIEW_CASH_MEMO
      );
      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });

    it('should check correct type is used for  ViewCashMemoSuccess action ', () => {
      const action = new ViewCashMemoSuccess(cashMemoDetailsResponse);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.VIEW_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual(cashMemoDetailsResponse);
    });

    it('should check correct type is used for  ViewCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ViewCashMemoFailure(payload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.VIEW_CASH_MEMO_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for ResetDetail action ', () => {
      const action = new RESETDETAIL();
      expect({ ...action }).toEqual({
        type: BillCancellationRequestsActionsTypes.RESET_DETAIL
      });
    });

    it('should check correct type is used for ResetList action ', () => {
      const action = new Reset();
      expect({ ...action }).toEqual({
        type: BillCancellationRequestsActionsTypes.RESET
      });
    });

    it('should check correct type is used for ResetStatus action ', () => {
      const action = new ResetBc();
      expect({ ...action }).toEqual({
        type: BillCancellationRequestsActionsTypes.RESET_BC_STATUS
      });
    });

    it('should check correct type is used for ResetStatus action ', () => {
      const action = new RESETFILTER();
      expect({ ...action }).toEqual({
        type: BillCancellationRequestsActionsTypes.RESET_FILTER
      });
    });
  });

  describe('LoadBillCancellationRequests Action Test Cases', () => {
    it('should check correct type is used for  LoadBillCancellationRequests action ', () => {
      const action = new LoadBillCancellationRequests(
        billCancellationRequestsListPayload
      );

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS
      );
      expect(action.payload).toEqual(billCancellationRequestsListPayload);
    });

    it('should check correct type is used for  LoadBillCancellationRequestsSuccess action ', () => {
      const action = new LoadBillCancellationRequestsSuccess(
        billCancellationRequests
      );

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_SUCCESS
      );
      expect(action.payload).toEqual(billCancellationRequests);
    });

    it('should check correct type is used for  LoadBillCancellationRequestsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBillCancellationRequestsFailure(payload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadCountBillCancellation Action Test Cases', () => {
    it('should check correct type is used for  LoadCountBillCancellation action ', () => {
      const action = new LoadCountBillCancellation(
        billCancellationRequestsListPayload
      );

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.COUNT_BILL_CANCELLATION_REQUESTS
      );
      expect(action.payload).toEqual(billCancellationRequestsListPayload);
    });

    it('should check correct type is used for  LoadCountBillCancellationSuccess action ', () => {
      const action = new LoadCountBillCancellationSuccess(2);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.COUNT_BILL_CANCELLATION_REQUESTS_SUCCESS
      );
      expect(action.payload).toEqual(2);
    });

    it('should check correct type is used for  LoadCountBillCancellationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCountBillCancellationFailure(payload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.COUNT_BILL_CANCELLATION_REQUESTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ApproveBillCancellationRequests Action Test Cases', () => {
    it('should check correct type is used for  ApproveBillCancellationRequests action ', () => {
      const action = new ApproveBillCancellationRequests(approvePayload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.APPROVE_BILL_CANCELLATION_REQUESTS
      );
      expect(action.payload).toEqual(approvePayload);
    });

    it('should check correct type is used for  ApproveBillCancellationRequestsSuccess action ', () => {
      const action = new ApproveBillCancellationRequestsSuccess(null);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.APPROVE_BILL_CANCELLATION_REQUESTS_SUCCESS
      );
      expect(action.payload).toEqual(null);
    });

    it('should check correct type is used for  ApproveBillCancellationRequestsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ApproveBillCancellationRequestsFailure(payload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.APPROVE_BILL_CANCELLATION_REQUESTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadLocation Action Test Cases', () => {
    it('should check correct type is used for  LoadLocation action ', () => {
      const action = new LoadLocation();

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.LOAD_LOCATION
      );
    });

    it('should check correct type is used for  LoadLocationSuccess action ', () => {
      const action = new LoadLocationSuccess([]);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.LOAD_LOCATION_SUCCESS
      );
      expect(action.payload).toEqual([]);
    });

    it('should check correct type is used for  LoadLocationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLocationFailure(payload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.LOAD_LOCATION_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadBillCancellationRequestsStatus Action Test Cases', () => {
    it('should check correct type is used for  LoadBillCancellationRequestsStatus action ', () => {
      const action = new LoadBillCancellationRequestsStatus(
        billCancelListPayload
      );

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_STATUS
      );
      expect(action.payload).toEqual(billCancelListPayload);
    });

    it('should check correct type is used for  LoadBillCancellationRequestsStatusSuccess action ', () => {
      const action = new LoadBillCancellationRequestsStatusSuccess(
        billCancelStatusList
      );

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_STATUS_SUCCESS
      );
      expect(action.payload).toEqual(billCancelStatusList);
    });

    it('should check correct type is used for  LoadBillCancellationRequestsStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBillCancellationRequestsStatusFailure(payload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_STATUS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('DeleteRequest Action Test Cases', () => {
    it('should check correct type is used for  DeleteRequest action ', () => {
      const action = new DeleteRequest(billCancelPayload);

      expect(action.type).toEqual(BillCancellationRequestsActionsTypes.DELETE);
      expect(action.payload).toEqual(billCancelPayload);
    });

    it('should check correct type is used for  DeleteRequestSuccess action ', () => {
      const action = new DeleteRequestSuccess(cancelResponse);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.DELETE_SUCCESS
      );
      expect(action.payload).toEqual(cancelResponse);
    });

    it('should check correct type is used for  DeleteRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DeleteRequestFailure(payload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.DELETE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadSeltedData Action Test Cases', () => {
    it('should check correct type is used for  LoadSeltedData action ', () => {
      const action = new LoadSeltedData(selectedDataPayload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.LOAD_SELECTED_DATA
      );
      expect(action.payload).toEqual(selectedDataPayload);
    });

    it('should check correct type is used for  LoadSelectedDataSucess action ', () => {
      const action = new LoadSelectedDataSucess(billCancelStatusList);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.LOAD_SELECTED_DATA_SUCESS
      );
      expect(action.payload).toEqual(billCancelStatusList);
    });

    it('should check correct type is used for  LoadSelectedDataFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedDataFailure(payload);

      expect(action.type).toEqual(
        BillCancellationRequestsActionsTypes.LOAD_SELECTED_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
