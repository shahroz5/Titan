import {
  bcHistoryRequestPayload,
  bcHistoryResponse,
  BillCancelPayload,
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
  BillCancelActionsTypes,
  CancelRequest,
  CancelRequestFailure,
  CancelRequestSuccess,
  CancelType,
  CancelTypeFailure,
  CancelTypePayload,
  CancelTypeSuccess,
  ConfirmRequest,
  ConfirmRequestFailure,
  ConfirmRequestSuccess,
  GetItemfromCashMemo,
  GetItemfromCashMemoFailure,
  GetItemfromCashMemoSuccess,
  LoadBCHistory,
  LoadBCHistoryFailure,
  LoadBCHistorySuccess,
  LoadCmBillList,
  LoadCmBillListFailure,
  LoadCmBillListSuccess,
  LoadItemFromBCHistory,
  LoadItemFromBCHistoryFailure,
  LoadItemFromBCHistorysuccess,
  LoadReasonForCancel,
  LoadReasonForCancelFailure,
  LoadReasonForCancelSuccess,
  LoadRSODetails,
  LoadRSODetailsFailure,
  LoadRSODetailsSuccess,
  ResetDetail,
  ResetList,
  ViewCashMemo,
  ViewCashMemoFailure,
  ViewCashMemoSuccess
} from './bill-cancel.actions';

describe('Bill Cancellation Action Testing suit', () => {
  const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
    id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
    subTxnType: 'NEW_CM',
    txnType: 'CM',
    itemId: '741B3399-ED98-44D8-B25D-BBDADCA2F1D2'
  };

  const CmItemDetailsResponse: CashMemoItemDetails = {
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
    customerId: 1,
    cancelTxnId: 1,
    discountDetails: 0,
    docDate: moment(12345678),
    docNo: 1,
    employeeCode: 'code',
    finalValue: 123,
    firstHoldTime: moment(1610012299519),
    fiscalYear: 2015,
    focDetails: {},
    id: '2',
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
    occasion: 'Wedding',
    txnType: 'MANUAL_GRF',
    otherChargesList: {},
    paidValue: 721,
    refTxnId: null,
    refTxnType: '',
    remarks: 'APPROVING IT',
    roundingVariance: 1,
    status: StatusTypesEnum.APPROVED,
    subTxnType: 'SUB_TXN',
    totalDiscount: 1,
    totalQuantity: 12,
    totalTax: 1800.6,
    totalValue: 826133,
    totalWeight: 269.728,
    txnTime: moment(161111093),
    customerDocDetails: null,
    refSubTxnType: 'MANUAL_AB',
    hallmarkCharges: 0,
    hallmarkDiscount: 0,
    refDocNo: 0,
    refFiscalYear: 0,
    cancelRemarks: ''
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

  const cancelTypePayload: CancelTypePayload = {
    refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
    subTxnType: 'NEW_CM',
    txnType: 'CM'
  };

  const bcHistoryPayload: bcHistoryRequestPayload = {
    docNo: 60,
    fiscalYear: 2020
  };

  const cancelTypeResponse = ['CANCEL_WITH_CN', 'CANCEL_WITH_RETURN'];

  const BcHistoryDetails = [
    {
      customerName: 'srinivas',
      createdDate: moment(1611110936440),
      createdBy: 'cpd',
      docNo: 100,
      docDate: moment(1611110936440),
      fiscalYear: 2020,
      netAmount: 100,
      cancelReason: 'cancel',
      cancellationType: 'return',
      page: 1,
      size: 10
    }
  ];

  const dummyHistory: bcHistoryResponse = {
    bcHistoryDetails: BcHistoryDetails,
    totalElements: 22
  };

  describe('Get Item from Cash Memo Action Test Cases', () => {
    it('should check correct type is used for  GetItemfromCashMemo action ', () => {
      const action = new GetItemfromCashMemo(cashMemoItemDetailsRequestPayload);

      expect(action.type).toEqual(
        BillCancelActionsTypes.GET_ITEM_FROM_CASH_MEMO
      );
      expect(action.payload).toEqual(cashMemoItemDetailsRequestPayload);
    });

    it('should check correct type is used for  GetItemfromCashMemoSuccess action ', () => {
      const action = new GetItemfromCashMemoSuccess(CmItemDetailsResponse);

      expect(action.type).toEqual(
        BillCancelActionsTypes.GET_ITEM_FROM_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual(CmItemDetailsResponse);
    });

    it('should check correct type is used for  GetItemfromCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetItemfromCashMemoFailure(payload);

      expect(action.type).toEqual(
        BillCancelActionsTypes.GET_ITEM_FROM_CASH_MEMO_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Cancel Request Action Test Cases', () => {
    it('should check correct type is used for  CancelRequest action ', () => {
      const action = new CancelRequest(billCancelPayload);

      expect(action.type).toEqual(BillCancelActionsTypes.CANCEL);
      expect(action.payload).toEqual(billCancelPayload);
    });

    it('should check correct type is used for  CancelRequestSuccess action ', () => {
      const action = new CancelRequestSuccess(cancelResponse);

      expect(action.type).toEqual(BillCancelActionsTypes.CANCEL_SUCCESS);
      expect(action.payload).toEqual(cancelResponse);
    });

    it('should check correct type is used for  CancelRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CancelRequestFailure(payload);

      expect(action.type).toEqual(BillCancelActionsTypes.CANCEL_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Confirm Request Action Test Cases', () => {
    it('should check correct type is used for  ConfirmRequest action ', () => {
      const action = new ConfirmRequest(billCancelPayload);

      expect(action.type).toEqual(BillCancelActionsTypes.CONFIRM);
      expect(action.payload).toEqual(billCancelPayload);
    });

    it('should check correct type is used for  ConfirmRequestSuccess action ', () => {
      const action = new ConfirmRequestSuccess(confirmResponse);

      expect(action.type).toEqual(BillCancelActionsTypes.CONFIRM_SUCCESS);
      expect(action.payload).toEqual(confirmResponse);
    });

    it('should check correct type is used for  ConfirmRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmRequestFailure(payload);

      expect(action.type).toEqual(BillCancelActionsTypes.CONFIRM_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('View Cash Memo Action Test Cases', () => {
    it('should check correct type is used for  ViewCashMemo action ', () => {
      const action = new ViewCashMemo(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(BillCancelActionsTypes.VIEW_CASH_MEMO);
      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });

    it('should check correct type is used for  ViewCashMemoSuccess action ', () => {
      const action = new ViewCashMemoSuccess(cashMemoDetailsResponse);

      expect(action.type).toEqual(
        BillCancelActionsTypes.VIEW_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual(cashMemoDetailsResponse);
    });

    it('should check correct type is used for  ViewCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ViewCashMemoFailure(payload);

      expect(action.type).toEqual(
        BillCancelActionsTypes.VIEW_CASH_MEMO_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Cm Bill List Action Test Cases', () => {
    it('should check correct type is used for  LoadCmBillList action ', () => {
      const cmBillListPayload: CmBillListPayload = {
        txnType: 'BILL',
        subTxnType: 'SUB_BILL',
        sort: '1'
      }
      const action = new LoadCmBillList(cmBillListPayload);

      expect(action.type).toEqual(BillCancelActionsTypes.LOAD_CM_BILL_LIST);
      expect(action.payload).toEqual(cmBillListPayload);
    });

    it('should check correct type is used for  LoadCmBillListSuccess action ', () => {
      const action = new LoadCmBillListSuccess(cmBillList);

      expect(action.type).toEqual(
        BillCancelActionsTypes.LOAD_CM_BILL_LIST_SUCCESS
      );
      expect(action.payload).toEqual(cmBillList);
    });

    it('should check correct type is used for  LoadCmBillListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCmBillListFailure(payload);

      expect(action.type).toEqual(
        BillCancelActionsTypes.LOAD_CM_BILL_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Reason for Cancel Action Test Cases', () => {
    it('should check correct type is used for  LoadReasonForCancel action ', () => {
      const action = new LoadReasonForCancel(LOVCode);

      expect(action.type).toEqual(
        BillCancelActionsTypes.LOAD_REASON_FOR_CANCEL
      );
      expect(action.payload).toEqual(LOVCode);
    });

    it('should check correct type is used for  LoadReasonForCancelSuccess action ', () => {
      const action = new LoadReasonForCancelSuccess(
        dummyReasonForCancelResponse
      );

      expect(action.type).toEqual(
        BillCancelActionsTypes.LOAD_REASON_FOR_CANCEL_SUCCESS
      );
      expect(action.payload).toEqual(dummyReasonForCancelResponse);
    });

    it('should check correct type is used for  LoadReasonForCancelFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadReasonForCancelFailure(payload);

      expect(action.type).toEqual(
        BillCancelActionsTypes.LOAD_REASON_FOR_CANCEL_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load RSO Details Action Test Cases', () => {
    it('should check correct type is used for  LoadRSODetails action ', () => {
      const action = new LoadRSODetails(RSOCode);

      expect(action.type).toEqual(BillCancelActionsTypes.LOAD_RSO_DETAILS);
      expect(action.payload).toEqual(RSOCode);
    });

    it('should check correct type is used for  LoadRSODetailsSuccess action ', () => {
      const action = new LoadRSODetailsSuccess(RSOResponae);

      expect(action.type).toEqual(
        BillCancelActionsTypes.LOAD_RSO_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(RSOResponae);
    });

    it('should check correct type is used for  LoadRSODetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRSODetailsFailure(payload);

      expect(action.type).toEqual(
        BillCancelActionsTypes.LOAD_RSO_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('CancelType Action Test Cases', () => {
    it('should check correct type is used for  CancelType action ', () => {
      const action = new CancelType(cancelTypePayload);

      expect(action.type).toEqual(BillCancelActionsTypes.CANCEL_TYPE);
      expect(action.payload).toEqual(cancelTypePayload);
    });

    it('should check correct type is used for  CancelTypeSuccess action ', () => {
      const action = new CancelTypeSuccess(cancelTypeResponse);

      expect(action.type).toEqual(BillCancelActionsTypes.CANCEL_TYPE_SUCCESS);
      expect(action.payload).toEqual(cancelTypeResponse);
    });

    it('should check correct type is used for  CancelTypeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CancelTypeFailure(payload);

      expect(action.type).toEqual(BillCancelActionsTypes.CANCEL_TYPE_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for ResetDetail action ', () => {
      const action = new ResetDetail();
      expect({ ...action }).toEqual({
        type: BillCancelActionsTypes.RESET_DETAIL
      });
    });

    it('should check correct type is used for ResetList action ', () => {
      const action = new ResetList();
      expect({ ...action }).toEqual({
        type: BillCancelActionsTypes.RESET_LIST
      });
    });
  });

  describe('bill cancellation history Action Test Cases', () => {
    it('should check correct type is used for bc history action ', () => {
      const action = new LoadBCHistory(bcHistoryPayload);

      expect(action.type).toEqual(BillCancelActionsTypes.LOAD_BC_HISTORY);
      expect(action.payload).toEqual(bcHistoryPayload);
    });

    it('should check correct type is used for  LoadBCHistorySuccess action ', () => {
      const action = new LoadBCHistorySuccess(dummyHistory);
      expect(action.type).toEqual(
        BillCancelActionsTypes.LOAD_BC_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(dummyHistory);
    });
    it('should check correct type is used for  LoadBCHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBCHistoryFailure(payload);
      expect(action.type).toEqual(
        BillCancelActionsTypes.LOAD_BC_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadItemFromBCHistory Action Test Cases', () => {
    it('should check correct type is used for  LoadItemFromBCHistory action ', () => {
      const action = new LoadItemFromBCHistory(bcHistoryPayload);

      expect(action.type).toEqual(
        BillCancelActionsTypes.LOAD_ITEM_FROM_BC_HISTORY
      );
      expect(action.payload).toEqual(bcHistoryPayload);
    });

    it('should check correct type is used for  LoadItemFromBCHistorySuccess action ', () => {
      const action = new LoadItemFromBCHistorysuccess(dummyHistory);

      expect(action.type).toEqual(
        BillCancelActionsTypes.LOAD_ITEM_FROM_BC_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(dummyHistory);
    });

    it('should check correct type is used for  LoadItemFromBCHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemFromBCHistoryFailure(payload);

      expect(action.type).toEqual(
        BillCancelActionsTypes.LOAD_ITEM_FROM_BC_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
