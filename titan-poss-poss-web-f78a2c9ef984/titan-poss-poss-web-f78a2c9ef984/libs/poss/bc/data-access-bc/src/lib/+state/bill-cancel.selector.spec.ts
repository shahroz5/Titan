import {
  bcHistoryRequestPayload,
  bcHistoryResponse,
  CancelResponse,
  CashMemoDetailsResponse,
  CashMemoItemDetails,
  CmBillList,
  ConfirmResponse,
  Lov,
  StatusTypesEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { itemDetailsAdapter } from './bill-cancel.entity';
import { initialState } from './bill-cancel.reducer';
// you will need to assert that the store is calling the right selector function.
import * as selectors from './bill-cancel.selector';
import { BillCancelState } from './bill-cancel.state';

describe('Testing Bill cancel related Selectors', () => {
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

  const bcHistoryDetails = [
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
    bcHistoryDetails: bcHistoryDetails,
    totalElements: 22
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

  const dummyReasonForCancelResponse: Lov[] = [
    {
      code: 'CM',
      isActive: true,
      value: 'Cash Memo'
    }
  ];

  const RSOResponae = ['RSO'];

  const cancelTypeResponse = ['CANCEL_WITH_CN', 'CANCEL_WITH_RETURN'];

  const bcHistoryRequestPayload: bcHistoryRequestPayload = {
    docNo: 1,
    fiscalYear: 2022
  };

  it('Should return cash memo response', () => {
    const state: BillCancelState = {
      ...initialState,
      viewCashMemoResponse: cashMemoDetailsResponse
    };
    expect(
      selectors.BillCancelSelector.selectViewCashMemoResponse.projector(state)
    ).toEqual(cashMemoDetailsResponse);
  });

  it('Should return cancel reponse', () => {
    const state: BillCancelState = {
      ...initialState,
      cancelResponse: cancelResponse
    };
    expect(
      selectors.BillCancelSelector.cancelResponse.projector(state)
    ).toEqual(cancelResponse);
  });

  it('Should return confirm reponse ', () => {
    const state: BillCancelState = {
      ...initialState,
      confirmResponse: confirmResponse
    };
    expect(
      selectors.BillCancelSelector.confirmResponse.projector(state)
    ).toEqual(confirmResponse);
  });

  it('Should return CM bill list ', () => {
    const state: BillCancelState = {
      ...initialState,
      cmBillList: cmBillList
    };
    expect(
      selectors.BillCancelSelector.selectCmBillList.projector(state)
    ).toEqual(cmBillList);
  });

  it('Should return bc history list ', () => {
    const state: BillCancelState = {
      ...initialState,
      historyList: dummyHistory
    };
    expect(selectors.BillCancelSelector.selectBcList.projector(state)).toEqual(
      dummyHistory
    );
  });

  it('Should return bcHistoryRequestParams list ', () => {
    const state: BillCancelState = {
      ...initialState,
      bcHistoryRequestParams: bcHistoryRequestPayload
    };
    expect(
      selectors.BillCancelSelector.selectHistorySearchParamDetails.projector(
        state
      )
    ).toEqual(bcHistoryRequestPayload);
  });

  it('Should return RSO Details ', () => {
    const state: BillCancelState = {
      ...initialState,
      rsoDetails: RSOResponae
    };
    expect(
      selectors.BillCancelSelector.selectRsoDetails.projector(state)
    ).toEqual(RSOResponae);
  });

  it('Should return Reasons', () => {
    const state: BillCancelState = {
      ...initialState,
      reasonsForCancel: dummyReasonForCancelResponse
    };
    expect(selectors.BillCancelSelector.selectReason.projector(state)).toEqual(
      dummyReasonForCancelResponse
    );
  });

  it('Should return CancelType', () => {
    const state: BillCancelState = {
      ...initialState,
      cancelType: cancelTypeResponse
    };
    expect(selectors.BillCancelSelector.CancelType.projector(state)).toEqual(
      cancelTypeResponse
    );
  });

  it('Should return  isLoading status ', () => {
    const state: BillCancelState = {
      ...initialState,
      isLoading: false
    };
    expect(selectors.BillCancelSelector.selectLoading.projector(state)).toEqual(
      false
    );
  });

  it('Should return  error ', () => {
    const state: BillCancelState = {
      ...initialState,
      hasError: null
    };
    expect(
      selectors.BillCancelSelector.selecthasError.projector(state)
    ).toEqual(null);
  });

  describe('Testing Item details related Selectors', () => {
    const itemDetailsArray = [CmItemDetailsResponse];
    const itemDetailsEntity = itemDetailsAdapter.setAll(itemDetailsArray, {
      ...itemDetailsAdapter.getInitialState()
    });
    it('Should return Item Entity', () => {
      const state: BillCancelState = {
        ...initialState,
        productDetails: itemDetailsEntity
      };
      expect(selectors.itemDetails.projector(state)).toEqual(itemDetailsEntity);
    });

    it('Should return Item Entity', () => {
      expect(
        selectors.BillCancelSelector.selectItemDetails.projector(
          itemDetailsEntity
        )
      ).toEqual(itemDetailsArray);
    });
  });
});
