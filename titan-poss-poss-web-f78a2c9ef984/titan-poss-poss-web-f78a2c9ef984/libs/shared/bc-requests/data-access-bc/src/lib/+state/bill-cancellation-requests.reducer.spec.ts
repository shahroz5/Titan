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
import * as actions from './bill-cancellation-requests.actions';
import { itemDetailsAdapter } from './bill-cancellation-requests.entity';
import {
  BillCancellationRequestsReducer,
  initialState
} from './bill-cancellation-requests.reducer';
import { BillCancellationRequestsState } from './bill-cancellation-requests.state';

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

    const dummyBillCancellationRequestsPayload: BillCancelPayload = {
      cancelType: 'CANCEL_WITH_CN',
      employeeCode: 'rso',
      reasonForCancellation: 'test',
      refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      remarks: 'test'
    };

    const cancelTypePayload: actions.CancelTypePayload = {
      refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      subTxnType: 'NEW_CM',
      txnType: 'CM'
    };

    const cancelTypeResponse = {
      results: ['CANCEL_WITH_CN', 'CANCEL_WITH_RETURN']
    };

    const billCancellationRequestsListPayload: actions.BillCancellationRequestsListPayload = {
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

    const approvePayload: actions.ApprovePayload = {
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

    const billCancelListPayload: actions.BillCancelListPayload = {
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

    it('should return the initial state', () => {
      const action: any = {};
      const state: BillCancellationRequestsState = BillCancellationRequestsReducer(
        undefined,
        action
      );

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

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

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

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

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

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('CANCEL action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.CANCELRequest(
        dummyBillCancellationRequestsPayload
      );

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('CANCEL_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        cancelResponse: null
      };

      const action = new actions.CANCELRequestSuccess(dummyCancelResponse);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

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

      const action = new actions.CANCELRequestFailure(payload);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('ConfirmRequest action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.CONFIRMRequest(
        dummyBillCancellationRequestsPayload
      );

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('ConfirmRequestSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        confirmResponse: null
      };

      const action = new actions.CONFIRMRequestSuccess(dummyConfirmResponse);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

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

      const action = new actions.CONFIRMRequestFailure(payload);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

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

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

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

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

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

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('ResetFilter action', () => {
      const newState = {
        ...testState,
        isLoading: false,
        advancedFilter: 'APPROVED'
      };

      const action = new actions.RESETFILTER();

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        newState,
        action
      );

      expect(result.isLoading).toBeFalsy();

      expect(result.advancedFilter).toBe('APPROVED');
    });

    it('Resetaction', () => {
      const newState = {
        ...testState,
        isLoading: false,
        hasError: null
      };

      const action = new actions.Reset();

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        newState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(null);
    });

    it('RESET_BC_STATUS', () => {
      const newState = {
        ...testState,
        isLoading: true,
        hasError: null,
        billStatusCount: 10
      };

      const action = new actions.ResetBc();

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        newState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(null);
      expect(result.billStatusCount).toBe(0);
    });

    it('RESET_DETAIL', () => {
      const newState = {
        ...testState,
        isLoading: true,
        hasError: null,
        cancelType: ['cancel']
      };

      const action = new actions.RESETDETAIL();

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        newState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(null);
      expect(result.cancelType).toBe(null);
    });

    it('LOAD_SELECTED_DATA', () => {
      const newState = {
        ...testState,
        isLoading: false,
        hasError: null
      };

      const action = new actions.LoadSelectedData(null);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        newState,
        action
      );

      expect(result.hasError).toBe(null);
    });

    it('LOAD_SELECTED_DATA_SUCESS', () => {
      const newState = {
        ...testState,
        isLoading: false,
        hasError: null,
        selectedData: null
      };

      const action = new actions.LoadSelectedDataSucess(billCancelStatusList);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        newState,
        action
      );

      expect(result.hasError).toBe(null);
      expect(result.selectedData).toBe(billCancelStatusList);
    });

    it('LOAD_SELECTED_FAILURE', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadSelectedDataFailure(payload);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('CancelType action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.CancelType(cancelTypePayload);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('CancelTypeSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        cancelType: null
      };

      const action = new actions.CancelTypeSuccess(cancelTypeResponse);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

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

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadBillCancellationRequests action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadBillCancellationRequests(
        billCancellationRequestsListPayload
      );

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadBillCancellationRequestsSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true
      };

      const action = new actions.LoadBillCancellationRequestsSuccess(
        billCancellationRequests
      );

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
    });

    it('LoadBillCancellationRequestsFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadBillCancellationRequestsFailure(payload);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadCountBillCancellation action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadCountBillCancellation(
        billCancellationRequestsListPayload
      );

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadCountBillCancellationSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        billCancellationRequestsCount: 0
      };

      const action = new actions.LoadCountBillCancellationSuccess(2);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.billCancellationRequestsCount).toBe(2);
    });

    it('LoadCountBillCancellationFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadCountBillCancellationFailure(payload);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadBillCancellationRequestsStatus action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadBillCancellationRequestsStatus(
        billCancelListPayload
      );

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadBillCancellationRequestsStatusSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        billStatusCount: 0
      };

      const action = new actions.LoadBillCancellationRequestsStatusSuccess(
        billCancelStatusList
      );

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.billStatusCount).toBe(10);
    });

    it('LoadBillCancellationRequestsStatusFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadBillCancellationRequestsStatusFailure(
        payload
      );

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('ApproveBillCancellationRequests action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.ApproveBillCancellationRequests(
        approvePayload
      );

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('ApproveBillCancellationRequestsSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        billancellationRequestsDetail: null
      };

      const action = new actions.ApproveBillCancellationRequestsSuccess('test');

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.billancellationRequestsDetail).toBe('test');
    });

    it('ApproveBillCancellationRequestsFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.ApproveBillCancellationRequestsFailure(
        payload
      );

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadLocation action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadLocation();

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadLocationSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        locations: []
      };
      const locations = ['CPD'];

      const action = new actions.LoadLocationSuccess(locations);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.locations).toBe(locations);
    });

    it('LoadLocationFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadLocationFailure(payload);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('DeleteRequest action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.DeleteRequest(dummyBillCancelPayload);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('DeleteRequestSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        deleteResponse: null
      };

      const action = new actions.DeleteRequestSuccess(dummyCancelResponse);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.deleteResponse).toBe(dummyCancelResponse);
    });

    it('DeleteRequestFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.DeleteRequestFailure(payload);

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadHistoryFilterData action', () => {
      testState = {
        ...testState,
        isLoading: false,
        advancedFilter: null
      };

      const action = new actions.LoadHistoryFilterData('location');

      const result: BillCancellationRequestsState = BillCancellationRequestsReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.advancedFilter).toBe('location');
    });
  });
});
