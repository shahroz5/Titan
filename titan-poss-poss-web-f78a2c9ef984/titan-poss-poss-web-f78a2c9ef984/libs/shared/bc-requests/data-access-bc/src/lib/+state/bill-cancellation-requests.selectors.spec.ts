import {
  CancelResponse,
  CashMemoDetailsResponse,
  CashMemoItemDetails,
  CmBillList,
  ConfirmResponse,
  Lov,
  StatusTypesEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { itemDetailsAdapter } from './bill-cancellation-requests.entity';
import { initialState } from './bill-cancellation-requests.reducer';
// you will need to assert that the store is calling the right selector function.
import * as selectors from './bill-cancellation-requests.selectors';
import { BillCancellationRequestsState } from './bill-cancellation-requests.state';

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

  it('Should return cash memo response', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      viewCashMemoResponse: cashMemoDetailsResponse
    };
    expect(
      selectors.BillCancellationRequestsSelector.selectViewCashMemoResponse.projector(
        state
      )
    ).toEqual(cashMemoDetailsResponse);
  });

  it('Should return cancel reponse', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      cancelResponse: cancelResponse
    };
    expect(
      selectors.BillCancellationRequestsSelector.cancelResponse.projector(state)
    ).toEqual(cancelResponse);
  });

  it('Should return confirm reponse ', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      confirmResponse: confirmResponse
    };
    expect(
      selectors.BillCancellationRequestsSelector.confirmResponse.projector(
        state
      )
    ).toEqual(confirmResponse);
  });

  it('Should return selectbillRequestCoun ', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      billCancellationRequestsCount: 10
    };
    expect(
      selectors.BillCancellationRequestsSelector.selectbillRequestCount.projector(
        state
      )
    ).toEqual(10);
  });
  it('Should return selectbillRequestDetails ', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      billancellationRequestsDetail: confirmResponse
    };
    expect(
      selectors.BillCancellationRequestsSelector.selectbillRequestDetails.projector(
        state
      )
    ).toEqual(confirmResponse);
  });

  // it('Should return CM bill list ', () => {
  //   const state: BillCancellationRequestsState = {
  //     ...initialState,
  //     cmBillList: cmBillList
  //   };
  //   expect(
  //     selectors.BillCancellationRequestsSelector.selectCmBillList.projector(state)
  //   ).toEqual(cmBillList);
  // });

  // it('Should return RSO Details ', () => {
  //   const state: BillCancellationRequestsState = {
  //     ...initialState,
  //     rsoDetails: RSOResponae
  //   };
  //   expect(
  //     selectors.BillCancellationRequestsSelector.selectRsoDetails.projector(state)
  //   ).toEqual(RSOResponae);
  // });

  // it('Should return Reasons', () => {
  //   const state: BillCancellationRequestsState = {
  //     ...initialState,
  //     reasonsForCancel: dummyReasonForCancelResponse
  //   };
  //   expect(selectors.BillCancellationRequestsSelector.selectReason.projector(state)).toEqual(
  //     dummyReasonForCancelResponse
  //   );
  // });

  it('Should return  isLoading status ', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      isLoading: false
    };
    expect(
      selectors.BillCancellationRequestsSelector.selectLoading.projector(state)
    ).toEqual(false);
  });

  it('Should return  error ', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      hasError: null
    };
    expect(
      selectors.BillCancellationRequestsSelector.selecthasError.projector(state)
    ).toEqual(null);
  });
  it('Should return ApprovedDetail ', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      billancellationRequestsDetail: null
    };
    expect(
      selectors.BillCancellationRequestsSelector.selectApprovedDetail.projector(
        state
      )
    ).toEqual(null);
  });
  it('Should return selectLocation ', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      locations: null
    };
    expect(
      selectors.BillCancellationRequestsSelector.selectLocation.projector(state)
    ).toEqual(null);
  });

  it('Should return selectLocation ', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      locations: null
    };
    expect(
      selectors.BillCancellationRequestsSelector.selectLocation.projector(state)
    ).toEqual(null);
  });

  it('Should return selectLocation ', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      advancedFilter: null
    };
    expect(
      selectors.BillCancellationRequestsSelector.selectHistoryFilterData.projector(
        state
      )
    ).toEqual(null);
  });

  it('Should return cancelType ', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      cancelType: null
    };
    expect(
      selectors.BillCancellationRequestsSelector.CancelType.projector(state)
    ).toEqual(null);
  });

  it('Should return selectedData ', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      selectedData: null
    };
    expect(
      selectors.BillCancellationRequestsSelector.selectedData.projector(state)
    ).toEqual(null);
  });

  it('Should return countResponse ', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      billStatusCount: null
    };
    expect(
      selectors.BillCancellationRequestsSelector.countResponse.projector(state)
    ).toEqual(null);
  });

  it('Should return deleteResponse ', () => {
    const state: BillCancellationRequestsState = {
      ...initialState,
      deleteResponse: null
    };
    expect(
      selectors.BillCancellationRequestsSelector.deleteResponse.projector(state)
    ).toEqual(null);
  });

  describe('Testing Item details related Selectors', () => {
    const itemDetailsArray = [CmItemDetailsResponse];
    const itemDetailsEntity = itemDetailsAdapter.setAll(itemDetailsArray, {
      ...itemDetailsAdapter.getInitialState()
    });
    it('Should return Item Entity', () => {
      const state: BillCancellationRequestsState = {
        ...initialState,
        productDetails: itemDetailsEntity
      };
      expect(
        selectors.BillCancellationRequestsSelector.itemDetails.projector(state)
      ).toEqual(itemDetailsEntity);
    });

    it('Should return Item Entity', () => {
      expect(
        selectors.BillCancellationRequestsSelector.selectItemDetails.projector(
          itemDetailsEntity
        )
      ).toEqual(itemDetailsArray);
    });
  });
});
