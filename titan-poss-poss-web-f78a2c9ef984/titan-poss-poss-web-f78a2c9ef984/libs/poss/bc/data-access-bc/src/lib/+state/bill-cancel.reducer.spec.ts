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
import * as actions from './bill-cancel.actions';
import { itemDetailsAdapter } from './bill-cancel.entity';
import { BillCancelReducer, initialState } from './bill-cancel.reducer';
import { BillCancelState } from './bill-cancel.state';

describe('Bill cancel Reducer Testing Suite', () => {
  let testState = initialState;

  describe('Actions should update state properly', () => {
    const dummayCashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      subTxnType: 'NEW_CM',
      txnType: 'CM',
      itemId: '741B3399-ED98-44D8-B25D-BBDADCA2F1D2'
    };

    const dummyCmItemDetailsResponse: CashMemoItemDetails = {
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
        isUcp: false,
        netWeight: 3,
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

    const dummyBillCancelPayload: BillCancelPayload = {
      cancelType: 'CANCEL_WITH_CN',
      employeeCode: 'rso',
      reasonForCancellation: 'test',
      refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      remarks: 'test'
    };

    const dummyCancelResponse: CancelResponse = {
      cndocNos: [234, 235],
      docNo: 12,
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28'
    };

    const dummyConfirmResponse: ConfirmResponse = {
      docNo: 12,
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      requestNo: '90'
    };

    const dummyCashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      subTxnType: 'NEW_CM',
      txnType: 'CM'
    };

    const dummyCashMemoDetailsResponse: CashMemoDetailsResponse = {
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

    const dummyCmBillListPayload: CmBillListPayload = {
      subTxnType: 'NEW_CM',
      txnType: 'CM',
      sort: 'docDate, DESC'
      // customerName?: string;
      // refDocNo?: number;
      // pageIndex?: number;
      // pageSize?: number;
    };

    const dummyCmBillList: CmBillList[] = [
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

    const dummyHistoryListParams: bcHistoryRequestPayload = {
      docNo: 66,
      fiscalYear: 2020,
      fromDocDate: moment(1611110936440),
      fromNetAmount: 200,
      refDocNo: 23,
      toDocDate: '2-22-2020',
      toNetAmount: 122
    };

    const dummyLOVCode = 'REASON_FOR_CANCELLATION';

    const dummyReasonForCancelResponse: Lov[] = [
      {
        code: 'CM',
        isActive: true,
        value: 'Cash Memo'
      }
    ];

    const dummyRSOCode = 'RSO';

    const dummyRSOResponae = ['RSO'];

    const cancelTypePayload: actions.CancelTypePayload = {
      refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      subTxnType: 'NEW_CM',
      txnType: 'CM'
    };

    const cancelTypeResponse = {
      results: ['CANCEL_WITH_CN', 'CANCEL_WITH_RETURN']
    };

    const bcHistoryRequestPayload: bcHistoryRequestPayload = {
      docNo: 1,
      fiscalYear: 2022
    };

    it('should return the initial state', () => {
      const action: any = {};
      const state: BillCancelState = BillCancelReducer(undefined, action);

      expect(state).toBe(testState);
    });

    it('GET_ITEM_FROM_CASH_MEMO action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.GetItemfromCashMemo(
        dummayCashMemoItemDetailsRequestPayload
      );

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('GET_ITEM_FROM_CASH_MEMO_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        productDetails: itemDetailsAdapter.setAll(
          [dummyCmItemDetailsResponse],
          testState.productDetails
        )
      };

      const action = new actions.GetItemfromCashMemoSuccess(
        dummyCmItemDetailsResponse
      );

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      // expect(result.productDetails).toBe([dummyCmItemDetailsResponse]);
    });

    it('GET_ITEM_FROM_CASH_MEMO_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetItemfromCashMemoFailure(payload);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('CANCEL action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.CancelRequest(dummyBillCancelPayload);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('CANCEL_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        cancelResponse: null
      };

      const action = new actions.CancelRequestSuccess(dummyCancelResponse);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.cancelResponse).toBe(dummyCancelResponse);
    });

    it('CANCEL_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.CancelRequestFailure(payload);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('ConfirmRequest action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.ConfirmRequest(dummyBillCancelPayload);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('ConfirmRequestSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        confirmResponse: null
      };

      const action = new actions.ConfirmRequestSuccess(dummyConfirmResponse);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.confirmResponse).toBe(dummyConfirmResponse);
    });

    it('ConfirmRequestFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.ConfirmRequestFailure(payload);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('ViewCashMemo action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.ViewCashMemo(
        dummyCashMemoDetailsRequestPayload
      );

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
    });

    it('ViewCashMemoSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        viewCashMemoResponse: null
      };

      const action = new actions.ViewCashMemoSuccess(
        dummyCashMemoDetailsResponse
      );

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.viewCashMemoResponse).toBe(dummyCashMemoDetailsResponse);
    });

    it('ViewCashMemoFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.ViewCashMemoFailure(payload);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadCmBillList action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadCmBillList(dummyCmBillListPayload);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadCmBillListSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        cmBillList: null
      };

      const action = new actions.LoadCmBillListSuccess(dummyCmBillList);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.cmBillList).toBe(dummyCmBillList);
    });

    it('LoadCmBillListFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadCmBillListFailure(payload);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadReasonForCancel action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadReasonForCancel(dummyLOVCode);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadReasonForCancelSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        reasonsForCancel: null
      };

      const action = new actions.LoadReasonForCancelSuccess(
        dummyReasonForCancelResponse
      );

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.reasonsForCancel).toBe(dummyReasonForCancelResponse);
    });

    it('LoadReasonForCancelFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadReasonForCancelFailure(payload);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadRSODetails action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadRSODetails(dummyRSOCode);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadRSODetailsSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        rsoDetails: null
      };

      const action = new actions.LoadRSODetailsSuccess(dummyRSOResponae);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.rsoDetails).toBe(dummyRSOResponae);
    });

    it('LoadRSODetailsFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadRSODetailsFailure(payload);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('CancelType action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.CancelType(cancelTypePayload);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('CancelTypeSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        cancelType: null
      };

      const action = new actions.CancelTypeSuccess(cancelTypeResponse);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.cancelType).toBe(cancelTypeResponse.results);
    });

    it('CancelTypeFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.CancelTypeFailure(payload);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('ResetList action', () => {
      const newState = {
        isLoading: true,
        hasError: null,
        productDetails: itemDetailsAdapter.setAll(
          [dummyCmItemDetailsResponse],
          testState.productDetails
        ),
        viewCashMemoResponse: dummyCashMemoDetailsResponse,
        confirmResponse: dummyConfirmResponse,
        cancelResponse: dummyCancelResponse,
        cmBillList: dummyCmBillList,
        reasonsForCancel: dummyReasonForCancelResponse,
        rsoDetails: dummyRSOResponae,
        cancelType: null,
        historyList: dummyHistory,
        bcHistoryRequestParams: dummyHistoryListParams
      };

      const action = new actions.ResetList();

      const result: BillCancelState = BillCancelReducer(newState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(null);
      expect(result.cmBillList.length).toBe(0);
    });

    it('ResetDetail action', () => {
      const newState = {
        isLoading: true,
        hasError: null,
        productDetails: itemDetailsAdapter.setAll(
          [dummyCmItemDetailsResponse],
          testState.productDetails
        ),
        viewCashMemoResponse: dummyCashMemoDetailsResponse,
        confirmResponse: dummyConfirmResponse,
        cancelResponse: dummyCancelResponse,
        cmBillList: dummyCmBillList,
        reasonsForCancel: dummyReasonForCancelResponse,
        rsoDetails: dummyRSOResponae,
        cancelType: null,
        historyList: dummyHistory,
        bcHistoryRequestParams: dummyHistoryListParams
      };

      const action = new actions.ResetDetail();

      const result: BillCancelState = BillCancelReducer(newState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(null);
      // expect(result.productDetails).toBe(itemDetailsAdapter.getInitialState());
      expect(result.viewCashMemoResponse).toBe(null);
      expect(result.confirmResponse).toBe(null);
      expect(result.cancelResponse).toBe(null);
      expect(result.reasonsForCancel.length).toBe(0);
      expect(result.rsoDetails.length).toBe(0);
      expect(result.cmBillList).toBe(dummyCmBillList);
    });

    it('ResetHistory action', () => {
      const newState = {
        isLoading: true,
        hasError: null,
        productDetails: itemDetailsAdapter.setAll(
          [dummyCmItemDetailsResponse],
          testState.productDetails
        ),
        viewCashMemoResponse: dummyCashMemoDetailsResponse,
        confirmResponse: dummyConfirmResponse,
        cancelResponse: dummyCancelResponse,
        cmBillList: dummyCmBillList,
        reasonsForCancel: dummyReasonForCancelResponse,
        rsoDetails: dummyRSOResponae,
        cancelType: null,
        historyList: dummyHistory,
        bcHistoryRequestParams: dummyHistoryListParams
      };

      const action = new actions.ResetHistory();

      const result: BillCancelState = BillCancelReducer(newState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(null);
      expect(result.historyList).toBe(null);
    });

    it('LoadBCHistory action', () => {
      testState = {
        ...testState,
        isLoading: true
      };

      const action = new actions.LoadBCHistory(dummyHistoryListParams);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadBCHistorySuccess action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: null
      };
      const action = new actions.LoadBCHistorySuccess(dummyHistory);
      const result: BillCancelState = BillCancelReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
    });

    it('LoadBCHistoryFailure action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadBCHistoryFailure(payload);

      const result: BillCancelState = BillCancelReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('ResetHistory action', () => {
      const newState = {
        isLoading: true,
        hasError: null,
        productDetails: itemDetailsAdapter.setAll(
          [dummyCmItemDetailsResponse],
          testState.productDetails
        ),
        viewCashMemoResponse: dummyCashMemoDetailsResponse,
        confirmResponse: dummyConfirmResponse,
        cancelResponse: dummyCancelResponse,
        cmBillList: dummyCmBillList,
        reasonsForCancel: dummyReasonForCancelResponse,
        rsoDetails: dummyRSOResponae,
        cancelType: null,
        historyList: dummyHistory,
        bcHistoryRequestParams: null
      };

      const action = new actions.SetHistorySearchParamDetails(
        bcHistoryRequestPayload
      );

      const result: BillCancelState = BillCancelReducer(newState, action);

      expect(result.bcHistoryRequestParams).toBe(bcHistoryRequestPayload);
    });
  });
});
