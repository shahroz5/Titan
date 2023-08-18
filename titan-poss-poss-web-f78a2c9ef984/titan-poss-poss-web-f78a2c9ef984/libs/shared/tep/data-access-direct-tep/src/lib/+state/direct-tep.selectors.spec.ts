import * as selectors from './direct-tep.selectors';
import { initialState } from './direct-tep.reducer';
import { TepState } from './direct-tep.state';
import {
  AddOrUpdateTepItemResponse,
  ConfirmTepItemResponse,
  CreateOpenTepTransactionResponse,
  CreateTepTypesEnum,
  CustomErrors,
  DeleteTepItemResponse,
  GetTepCashMemoResponse,
  GetTepItemConfiguratonResponse,
  GetTepPriceDetailsResponse,
  InitiateAdvanceResponse,
  TepItemResponse,
  TepTransactionResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CreateOpenTepTransaction } from './direct-tep.actions';
import * as moment from 'moment';

describe('TEP Selector Testing Suite', () => {
  it('Testing selectSelectedRsoName selector', () => {
    const state: TepState = {
      ...initialState,
      selectedRsoName: { value: 'rsocpd', description: 'rsocpd' }
    };
    expect(
      selectors.TepSelectors.selectSelectedRsoName.projector(state)
    ).toEqual({ value: 'rsocpd', description: 'rsocpd' });
  });
  it('Testing selectCreateOpenTepTransactionResponse selector', () => {
    const createOpenTepTransactionSuccessResponse: CreateOpenTepTransactionResponse = {
      docNo: 1,
      id: '',
      status: '',
      subTxnType: '',
      txnType: ''
    };
    const state: TepState = {
      ...initialState,
      createOpenTepTransactionResponse: createOpenTepTransactionSuccessResponse
    };
    expect(
      selectors.TepSelectors.selectCreateOpenTepTransactionResponse.projector(
        state
      )
    ).toEqual(createOpenTepTransactionSuccessResponse);
  });
  it('Testing selectError selector', () => {
    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );
    const state: TepState = {
      ...initialState,
      errors: payload
    };
    expect(selectors.TepSelectors.selectError.projector(state)).toEqual(
      payload
    );
  });
  it('Testing selectIsLoading selector', () => {
    const state: TepState = {
      ...initialState,
      isLoading: true
    };
    expect(selectors.TepSelectors.selectIsLoading.projector(state)).toEqual(
      true
    );
  });
  it('Testing selectIsOpenTaskLoading selector', () => {
    const state: TepState = {
      ...initialState,
      isOpenTaskLoading: true
    };
    expect(
      selectors.TepSelectors.selectIsOpenTaskLoading.projector(state)
    ).toEqual(true);
  });
  it('Testing selectSelectedCmItem selector', () => {
    const state: TepState = {
      ...initialState,
      selectedCmItem: ''
    };
    expect(
      selectors.TepSelectors.selectSelectedCmItem.projector(state)
    ).toEqual('');
  });
  it('Testing selectUpdateOpenTepTransactionResponse selector', () => {
    const updateOpenTepTransactionSuccessResponse: CreateOpenTepTransactionResponse = {
      docNo: 1,
      id: '',
      status: '',
      subTxnType: '',
      txnType: ''
    };
    const state: TepState = {
      ...initialState,
      updateOpenTepTransactionResponse: updateOpenTepTransactionSuccessResponse
    };
    expect(
      selectors.TepSelectors.selectUpdateOpenTepTransactionResponse.projector(
        state
      )
    ).toEqual(updateOpenTepTransactionSuccessResponse);
  });
  it('Testing selectTepItemConfiguratonResponse selector', () => {
    const getTepItemConfiguratonResponse: GetTepItemConfiguratonResponse = {
      isCMMandatory: true,
      isQuantityEditable: false,
      isTepAllowed: true,
      isTEPSaleBin: true,
      isCutPieceTepAllowed: true,
      isFVTAllowed: true,
      tepOfferDetails: {
        type: '',
        data: {
          deductionPercent: 2,
          flatTepExchangeValue: 70,
          isWeightToleranceAllowed: true,
          approvedBy: '',
          reasonForException: ''
        }
      },
      goldDeductionPercent: 2,
      silverDeductionPercent: 2,
      platinumDeductionPercent: 2,
      ucpDeductionPercent: 2,
      ucpDeductionFlatValue: 1000,
      isStoneChargesApplicable: true,
      stoneDeductionPercent: 2,
      cmUnavailableDeductionPercent: 2,
      recoverDiscountPercent: 2,
      refundDeductionPercent: 2,
      weightTolerancePercent: 2,
      isProportionedValue: true,
      typeOfExchange: '',
      isInterBrandTepAllowed: true,
      tepGeneralCodeConfig: {
        allowedProductGroups: [],
        isCMMandatory: true,
        isValuationAtStore: true
      },
      tepCutPieceConfig: { weightTolerancePercent: 2 },
      allowedRefundMode: 'RTGS',
      refundCashLimit: 1000
    };
    const state: TepState = {
      ...initialState,
      tepItemConfiguratonResponse: getTepItemConfiguratonResponse
    };
    expect(
      selectors.TepSelectors.selectTepItemConfiguratonResponse.projector(state)
    ).toEqual(getTepItemConfiguratonResponse);
  });
  it('Testing selectTepCashMemoResponseItemList selector', () => {
    const getTepCashMemoResponse: GetTepCashMemoResponse = {
      results: [
        {
          itemCode: '',
          lotNumber: '',
          totalWeight: 1,
          cashMemoDetailsId: '',
          totalValue: 1,
          totalQuantity: 1,
          totalPendingQuantity: 1,
          productGroupCode: '',
          isCMMandatory: true
        }
      ]
    };
    const state: TepState = {
      ...initialState,
      tepCashMemoResponseItemList: getTepCashMemoResponse
    };
    expect(
      selectors.TepSelectors.selectTepCashMemoResponseItemList.projector(state)
    ).toEqual(getTepCashMemoResponse);
  });
  it('Testing selectTepPriceDetailsResponse selector', () => {
    const getTepPriceDetailsResponse: GetTepPriceDetailsResponse = {
      currencyCode: 'INR',
      deductionAmount: 1000,
      discountRecovered: 1200,
      finalValue: 1200,
      isExceptionValue: true,
      isUCPCMValue: true,
      iscashMemoAvailable: true,
      refundDeductionAmount: 0,
      itemCode: '',
      itemQuantity: 1,
      itemTypeCode: '',
      lotNumber: '',
      materialDetails: {
        materialWeight: 1,
        preDiscountValue: 1,
        weightUnit: ''
      },
      metalPriceDetails: {
        metalPrices: [
          {
            karat: 22,
            metalTypeCode: 'J',
            metalValue: 4560,
            netWeight: 1,
            purity: 92.7,
            ratePerUnit: 4560,
            type: '',
            weightUnit: ''
          }
        ],
        preDiscountValue: 1
      },
      netWeight: 1,
      productCategoryCode: '',
      productCategoryDesc: '',
      productGroupCode: '',
      productGroupDesc: '',
      stdWeight: 1,
      stonePriceDetails: {
        numberOfStones: 1,
        preDiscountValue: 1,
        stoneWeight: 1,
        weightUnit: ''
      },
      stones: []
    };
    const state: TepState = {
      ...initialState,
      tepPriceDetailsResponse: getTepPriceDetailsResponse
    };
    expect(
      selectors.TepSelectors.selectTepPriceDetailsResponse.projector(state)
    ).toEqual(getTepPriceDetailsResponse);
  });
  it('Testing selectAddTepItemResponse selector', () => {
    const addOrUpdateTepItemResponse: AddOrUpdateTepItemResponse = {
      taxDetails: null,
      confirmedTime: '',
      currencyCode: '',
      customerId: 1,
      docDate: '',
      docNo: 1,
      employeeCode: '',
      firstHoldTime: '',
      fiscalYear: 1,
      id: '',
      itemDetails: {
        refDocDate: '',
        binCode: '',
        cashMemoDetailsId: '',
        finalValue: 1,
        inventoryId: '',
        itemCode: '',
        itemId: '',
        itemType: '',
        karat: 1,
        lotNumber: '',
        measuredPurity: 1,
        measuredWeight: 1,
        metalType: '',
        preMeltingDetails: {
          karatage: 1,
          purity: 1,
          weight: 1
        },
        priceDetails: {},
        purity: 1,
        quantity: 1,
        rowId: 1,
        taxDetails: {
          cess: [
            {
              cessCode: '',
              cessOnTax: true,
              cessPercentage: 0,
              cessValue: 0
            }
          ],
          data: [
            {
              taxCode: '',
              taxPercentage: 1,
              taxValue: 1
            }
          ],
          taxClass: '',
          taxType: ''
        },
        totalTax: 1,
        totalValue: 1,
        totalWeight: 1,
        unitValue: 1,
        unitWeight: 1
      },
      lastHoldTime: '',
      metalRateList: {
        metalRates: null
      },
      remarks: '',
      roundingVariance: 1,
      status: '',
      manualBillDetails: null,
      totalQuantity: 1,
      totalTax: 1,
      totalValue: 1,
      totalWeight: 1,
      weightUnit: ''
    };
    const state: TepState = {
      ...initialState,
      addTepItemResponse: addOrUpdateTepItemResponse
    };
    expect(
      selectors.TepSelectors.selectAddTepItemResponse.projector(state)
    ).toEqual(addOrUpdateTepItemResponse);
  });
  it('Testing selectAddTepItemResponse selector', () => {
    const addOrUpdateTepItemResponse: AddOrUpdateTepItemResponse = {
      taxDetails: null,
      confirmedTime: '',
      currencyCode: '',
      customerId: 1,
      docDate: '',
      docNo: 1,
      employeeCode: '',
      firstHoldTime: '',
      fiscalYear: 1,
      id: '',
      itemDetails: {
        refDocDate: '',
        binCode: '',
        cashMemoDetailsId: '',
        finalValue: 1,
        inventoryId: '',
        itemCode: '',
        itemId: '',
        itemType: '',
        karat: 1,
        lotNumber: '',
        measuredPurity: 1,
        measuredWeight: 1,
        metalType: '',
        preMeltingDetails: {
          karatage: 1,
          purity: 1,
          weight: 1
        },
        priceDetails: {},
        purity: 1,
        quantity: 1,
        rowId: 1,
        taxDetails: {
          cess: [
            {
              cessCode: '',
              cessOnTax: true,
              cessPercentage: 0,
              cessValue: 0
            }
          ],
          data: [
            {
              taxCode: '',
              taxPercentage: 1,
              taxValue: 1
            }
          ],
          taxClass: '',
          taxType: ''
        },
        totalTax: 1,
        totalValue: 1,
        totalWeight: 1,
        unitValue: 1,
        unitWeight: 1
      },
      lastHoldTime: '',
      metalRateList: {
        metalRates: null
      },
      remarks: '',
      roundingVariance: 1,
      status: '',
      manualBillDetails: null,
      totalQuantity: 1,
      totalTax: 1,
      totalValue: 1,
      totalWeight: 1,
      weightUnit: ''
    };
    const state: TepState = {
      ...initialState,
      addTepItemResponse: addOrUpdateTepItemResponse
    };
    expect(
      selectors.TepSelectors.selectAddTepItemResponse.projector(state)
    ).toEqual(addOrUpdateTepItemResponse);
  });
  it('Testing selectUpdateTepItemResponse selector', () => {
    const addOrUpdateTepItemResponse: AddOrUpdateTepItemResponse = {
      taxDetails: null,
      confirmedTime: '',
      currencyCode: '',
      customerId: 1,
      docDate: '',
      docNo: 1,
      employeeCode: '',
      firstHoldTime: '',
      fiscalYear: 1,
      id: '',
      itemDetails: {
        refDocDate: '',
        binCode: '',
        cashMemoDetailsId: '',
        finalValue: 1,
        inventoryId: '',
        itemCode: '',
        itemId: '',
        itemType: '',
        karat: 1,
        lotNumber: '',
        measuredPurity: 1,
        measuredWeight: 1,
        metalType: '',
        preMeltingDetails: {
          karatage: 1,
          purity: 1,
          weight: 1
        },
        priceDetails: {},
        purity: 1,
        quantity: 1,
        rowId: 1,
        taxDetails: {
          cess: [
            {
              cessCode: '',
              cessOnTax: true,
              cessPercentage: 0,
              cessValue: 0
            }
          ],
          data: [
            {
              taxCode: '',
              taxPercentage: 1,
              taxValue: 1
            }
          ],
          taxClass: '',
          taxType: ''
        },
        totalTax: 1,
        totalValue: 1,
        totalWeight: 1,
        unitValue: 1,
        unitWeight: 1
      },
      lastHoldTime: '',
      metalRateList: {
        metalRates: null
      },
      remarks: '',
      roundingVariance: 1,
      status: '',
      manualBillDetails: null,
      totalQuantity: 1,
      totalTax: 1,
      totalValue: 1,
      totalWeight: 1,
      weightUnit: ''
    };
    const state: TepState = {
      ...initialState,
      updateTepItemResponse: addOrUpdateTepItemResponse
    };
    expect(
      selectors.TepSelectors.selectUpdateTepItemResponse.projector(state)
    ).toEqual(addOrUpdateTepItemResponse);
  });
  it('Testing selectConfirmTepItemResponse selector', () => {
    const confirmTepItemResponse: ConfirmTepItemResponse = {
      cnDocNo: 123,
      confirmedTime: '',
      currencyCode: '',
      customerId: 521,
      docDate: '',
      docNo: 251,
      employeeCode: '',
      firstHoldTime: '',
      fiscalYear: 2020,
      id: '',
      itemDetails: {
        binCode: '',
        cashMemoDetailsId: '',
        finalValue: 1000,
        inventoryId: '',
        itemCode: '',
        itemId: '',
        itemType: '',
        karat: 123,
        lotNumber: '',
        measuredPurity: 123,
        measuredWeight: 123,
        metalType: '',
        preMeltingDetails: {
          karatage: 22,
          purity: 92,
          weight: 1
        },
        priceDetails: {},
        purity: 1,
        quantity: 1,
        rowId: 1,
        taxDetails: {
          cess: [
            {
              cessCode: '',
              cessOnTax: true,
              cessPercentage: 0,
              cessValue: 0
            }
          ],
          data: [
            {
              taxCode: '',
              taxPercentage: 1,
              taxValue: 1
            }
          ],
          taxClass: '',
          taxType: ''
        },
        totalTax: 100,
        totalValue: 1000,
        totalWeight: 1,
        unitValue: 1000,
        unitWeight: 1
      },
      lastHoldTime: '',
      metalRateList: {
        metalRates: null
      },
      remarks: '',
      roundingVariance: 0,
      status: '',
      manualBillDetails: null,
      totalQuantity: 1,
      totalTax: 1,
      totalValue: 1000,
      totalWeight: 1,
      weightUnit: ''
    };
    const state: TepState = {
      ...initialState,
      confirmTepItemResponse: confirmTepItemResponse
    };
    expect(
      selectors.TepSelectors.selectConfirmTepItemResponse.projector(state)
    ).toEqual(confirmTepItemResponse);
  });
  it('Testing selectDeleteTepItemResponse selector', () => {
    const deleteTepItemResponse: DeleteTepItemResponse = {
      confirmedTime: '',
      currencyCode: '',
      customerId: 1,
      docDate: '',
      docNo: 1,
      employeeCode: '',
      firstHoldTime: '',
      fiscalYear: 1,
      id: '',
      itemDetails: {
        binCode: '',
        cashMemoDetailsId: '',
        finalValue: 1,
        inventoryId: '',
        itemCode: '',
        itemId: '',
        itemType: '',
        karat: 1,
        lotNumber: '',
        measuredPurity: 1,
        measuredWeight: 1,
        metalType: '',
        preMeltingDetails: {
          karatage: 1,
          purity: 1,
          weight: 1
        },
        priceDetails: {},
        purity: 1,
        quantity: 1,
        rowId: 1,
        taxDetails: {
          cess: [
            {
              cessCode: '',
              cessOnTax: true,
              cessPercentage: 0,
              cessValue: 0
            }
          ],
          data: [
            {
              taxCode: '',
              taxPercentage: 1,
              taxValue: 1
            }
          ],
          taxClass: '',
          taxType: ''
        },
        totalTax: 1,
        totalValue: 1,
        totalWeight: 1,
        unitValue: 1,
        unitWeight: 1
      },
      lastHoldTime: '',
      metalRateList: {
        metalRates: null
      },
      remarks: '',
      roundingVariance: 1,
      status: '',
      manualBillDetails: null,
      totalQuantity: 1,
      totalTax: 1,
      totalValue: 1,
      totalWeight: 1,
      weightUnit: ''
    };
    const state: TepState = {
      ...initialState,
      deleteTepItemResponse: deleteTepItemResponse
    };
    expect(
      selectors.TepSelectors.selectDeleteTepItemResponse.projector(state)
    ).toEqual(deleteTepItemResponse);
  });
  it('Testing selectRsoList selector', () => {
    const state: TepState = {
      ...initialState,
      rsoList: [
        {value: 'rsocpd',
        description: 'abc'
      }]
    };
    expect(selectors.TepSelectors.selectRsoList.projector(state)).toEqual(state.rsoList);
  });
  it('Testing selectRemarks selector', () => {
    const state: TepState = {
      ...initialState,
      remarks: 'Remarks'
    };
    expect(selectors.TepSelectors.selectRemarks.projector(state)).toEqual(
      'Remarks'
    );
  });
  it('Testing selectTotalQty selector', () => {
    const state: TepState = {
      ...initialState,
      totalQty: 1
    };
    expect(selectors.TepSelectors.selectTotalQty.projector(state)).toEqual(1);
  });
  it('Testing selectTotalGrossWt selector', () => {
    const state: TepState = {
      ...initialState,
      totalGrossWt: 1
    };
    expect(selectors.TepSelectors.selectTotalGrossWt.projector(state)).toEqual(
      1
    );
  });
  it('Testing selectTotalExchangeWt selector', () => {
    const state: TepState = {
      ...initialState,
      totalExchangeAmt: 1000
    };
    expect(
      selectors.TepSelectors.selectTotalExchangeWt.projector(state)
    ).toEqual(1000);
  });
  it('Testing selectSelectedPaymentMethod selector', () => {
    const state: TepState = {
      ...initialState,
      selectedPaymentMethod: 'CN'
    };
    expect(
      selectors.TepSelectors.selectSelectedPaymentMethod.projector(state)
    ).toEqual('CN');
  });
  it('Testing selectSelectedTepType selector', () => {
    const state: TepState = {
      ...initialState,
      selectedTepType: CreateTepTypesEnum.FULL_VALUE_TEP
    };
    expect(
      selectors.TepSelectors.selectSelectedTepType.projector(state)
    ).toEqual(CreateTepTypesEnum.FULL_VALUE_TEP);
  });
  it('Testing selectScannedTepItemCode selector', () => {
    const state: TepState = {
      ...initialState,
      scannedTepItemCode: ''
    };
    expect(
      selectors.TepSelectors.selectScannedTepItemCode.projector(state)
    ).toEqual('');
  });
  it('Testing selectTepItemCutPieceDetailsResponse selector', () => {
    const state: TepState = {
      ...initialState,
      tepItemCutPieceDetailsResponse: ''
    };
    expect(
      selectors.TepSelectors.selectTepItemCutPieceDetailsResponse.projector(
        state
      )
    ).toEqual('');
  });
  it('Testing selectCutPieceTotalQty selector', () => {
    const state: TepState = {
      ...initialState,
      cutPieceTotalQty: 1
    };
    expect(
      selectors.TepSelectors.selectCutPieceTotalQty.projector(state)
    ).toEqual(1);
  });
  it('Testing selectCutPieceTotalValue selector', () => {
    const state: TepState = {
      ...initialState,
      cutPieceTotalValue: 1200
    };
    expect(
      selectors.TepSelectors.selectCutPieceTotalValue.projector(state)
    ).toEqual(1200);
  });
  it('Testing selectViewTepTransactionResponse selector', () => {
    const tepTransactionResponse: TepTransactionResponse = {
      reason: 'Full Value TEP Reason',
      confirmedTime: '',
      currencyCode: '',
      customerId: 521,
      docDate: '',
      docNo: 241,
      employeeCode: '',
      exchangeDetails: null,
      firstHoldTime: moment(),
      fiscalYear: 2020,
      id: '',
      itemIdList: [],
      lastHoldTime: moment(),
      manualBillDetails: null,
      manualBillId: '',
      metalRateList: {
        metalRates: null
      },
      roundingVariance: 0,
      status: '',
      taxDetails: null,
      totalQuantity: 1,
      totalTax: 100,
      totalValue: 1000,
      totalWeight: 1,
      weightUnit: 'gms'
    };
    const state: TepState = {
      ...initialState,
      viewTepTransactionResponse: tepTransactionResponse
    };
    expect(
      selectors.TepSelectors.selectViewTepTransactionResponse.projector(state)
    ).toEqual(tepTransactionResponse);
  });
  it('Testing selectViewTepItemResponse selector', () => {
    const tepItemResponse: TepItemResponse = {
      binCode: '',
      cashMemoDetailsId: '',
      discountDetails: {
        data: null,
        type: ''
      },
      finalValue: 1000,
      inventoryId: '',
      itemCode: '',
      itemId: '',
      itemType: '',
      karat: 22,
      lotNumber: '',
      measuredPurity: 92,
      measuredWeight: 1,
      metalType: '',
      preMeltingDetails: {
        karatage: 22,
        purity: 92,
        weight: 1
      },
      priceDetails: null,
      purity: 92,
      quantity: 1,
      rowId: 1,
      stones: [],
      taxDetails: {
        cess: [
          {
            cessCode: '',
            cessOnTax: true,
            cessPercentage: 1,
            cessValue: 100
          }
        ],
        data: [
          {
            taxCode: '',
            taxPercentage: 1,
            taxValue: 100
          }
        ],
        taxClass: '',
        taxType: ''
      },
      totalTax: 100,
      totalValue: 1000,
      totalWeight: 1,
      unitValue: 1000,
      unitWeight: 1,
      itemDetails: {
        type: '',
        data: null
      }
    };
    const state: TepState = {
      ...initialState,
      viewTepItemResponse: tepItemResponse
    };
    expect(
      selectors.TepSelectors.selectViewTepItemResponse.projector(state)
    ).toEqual(tepItemResponse);
  });
  it('Testing selectDeleteTransactionResponse selector', () => {
    const state: TepState = {
      ...initialState,
      deleteTepTransactionResponse: 'Success'
    };
    expect(
      selectors.TepSelectors.selectDeleteTransactionResponse.projector(state)
    ).toEqual('Success');
  });
  it('Testing selectCmListItemTepConfigurationResponse selector', () => {
    const getTepItemConfiguratonResponse: GetTepItemConfiguratonResponse = {
      isCMMandatory: true,
      isQuantityEditable: false,
      isTepAllowed: true,
      isTEPSaleBin: true,
      isCutPieceTepAllowed: true,
      isFVTAllowed: true,
      tepOfferDetails: {
        type: '',
        data: {
          deductionPercent: 2,
          flatTepExchangeValue: 70,
          isWeightToleranceAllowed: true,
          approvedBy: '',
          reasonForException: ''
        }
      },
      goldDeductionPercent: 2,
      silverDeductionPercent: 2,
      platinumDeductionPercent: 2,
      ucpDeductionPercent: 2,
      ucpDeductionFlatValue: 1000,
      isStoneChargesApplicable: true,
      stoneDeductionPercent: 2,
      cmUnavailableDeductionPercent: 2,
      recoverDiscountPercent: 2,
      refundDeductionPercent: 2,
      weightTolerancePercent: 2,
      isProportionedValue: true,
      typeOfExchange: '',
      isInterBrandTepAllowed: true,
      tepGeneralCodeConfig: {
        allowedProductGroups: [],
        isCMMandatory: true,
        isValuationAtStore: true
      },
      tepCutPieceConfig: { weightTolerancePercent: 2 },
      allowedRefundMode: 'RTGS',
      refundCashLimit: 1000
    };
    const state: TepState = {
      ...initialState,
      cmListItemTepConfigurationResponse: getTepItemConfiguratonResponse
    };
    expect(
      selectors.TepSelectors.selectCmListItemTepConfigurationResponse.projector(
        state
      )
    ).toEqual(getTepItemConfiguratonResponse);
  });
  it('Testing selectIsRefundFormValid selector', () => {
    const state: TepState = {
      ...initialState,
      isRefundFormValid: true
    };
    expect(
      selectors.TepSelectors.selectIsRefundFormValid.projector(state)
    ).toEqual(true);
  });
  it('Testing selectIsRequestRaisingScenario selector', () => {
    const state: TepState = {
      ...initialState,
      isRequestRaisingScenario: true
    };
    expect(
      selectors.TepSelectors.selectIsRequestRaisingScenario.projector(state)
    ).toEqual(true);
  });
  it('Testing selectGoldPlusLocations selector', () => {
    const state: TepState = {
      ...initialState,
      goldPlusLocations: []
    };
    expect(
      selectors.TepSelectors.selectGoldPlusLocations.projector(state)
    ).toEqual([]);
  });
  it('Testing selectHoldTransactionMetalRates selector', () => {
    const state: TepState = {
      ...initialState,
      holdTransactionMetalRates: []
    };
    expect(
      selectors.TepSelectors.selectHoldTransactionMetalRates.projector(state)
    ).toEqual([]);
  });
  it('Testing selectIsExceptionScenario selector', () => {
    const state: TepState = {
      ...initialState,
      isExceptionScenario: false
    };
    expect(
      selectors.TepSelectors.selectIsExceptionScenario.projector(state)
    ).toEqual(false);
  });
  it('Testing selectStuddedProductGroupCodes selector', () => {
    const state: TepState = {
      ...initialState,
      studdedProductGroupCodes: []
    };
    expect(
      selectors.TepSelectors.selectStuddedProductGroupCodes.projector(state)
    ).toEqual([]);
  });

  it('Testing selectAvailableDiscountsList selector', () => {
    const state: TepState = {
      ...initialState,
      availableDiscountsList: []
    };
    expect(
      selectors.TepSelectors.selectAvailableDiscountsList.projector(state)
    ).toEqual([]);
  });

  it('Testing selectConfirmCutPieceTepItemResponse selector', () => {
    const state: TepState = {
      ...initialState,
      confirmCutPieceTepItemResponse: {} as any
    };
    expect(
      selectors.TepSelectors.selectConfirmCutPieceTepItemResponse.projector(state)
    ).toEqual({} as any);
  });

  it('Testing selectPatchCutPieceTepItemResponse selector', () => {
    const state: TepState = {
      ...initialState,
      patchCutPieceTepItemResponse: {} as any
    };
    expect(
      selectors.TepSelectors.selectPatchCutPieceTepItemResponse.projector(state)
    ).toEqual({} as any);
  });

  it('Testing selectAddCutPieceTepItemResponse selector', () => {
    const state: TepState = {
      ...initialState,
      addCutPieceTepItemResponse: {} as any
    };
    expect(
      selectors.TepSelectors.selectAddCutPieceTepItemResponse.projector(state)
    ).toEqual({} as any);
  });

  it('Testing selectPatchCutPieceTepTransactionResponse selector', () => {
    const state: TepState = {
      ...initialState,
      patchCutPieceTepTransactionResponse: {} as any
    };
    expect(
      selectors.TepSelectors.selectPatchCutPieceTepTransactionResponse.projector(state)
    ).toEqual({} as any);
  });

  it('Testing selectCreateOpenCutPieceTepTransactionResponse selector', () => {
    const state: TepState = {
      ...initialState,
      createOpenCutPieceTepTransactionResponse: {} as any
    };
    expect(
      selectors.TepSelectors.selectCreateOpenCutPieceTepTransactionResponse.projector(state)
    ).toEqual({} as any);
  });

  it('Testing selectUpdateTepTransactionPriceDetailsResponse selector', () => {
    const state: TepState = {
      ...initialState,
      updateTepTransactionPriceDetailsResponse: {} as any
    };
    expect(
      selectors.TepSelectors.selectUpdateTepTransactionPriceDetailsResponse.projector(state)
    ).toEqual({} as any);
  });

  it('Testing selectFtepReasons selector', () => {
    const state: TepState = {
      ...initialState,
      fvtReasons: {} as any
    };
    expect(
      selectors.TepSelectors.selectFtepReasons.projector(state)
    ).toEqual({} as any);
  });

  it('Testing cancelTEPResponse selector', () => {
    const state: TepState = {
      ...initialState,
      cancelTEPResponse: {} as any
    };
    expect(
      selectors.TepSelectors.cancelTEPResponse.projector(state)
    ).toEqual({} as any);
  });

  it('Testing cancelResponse selector', () => {
    const state: TepState = {
      ...initialState,
      cancelResponse: {} as any
    };
    expect(
      selectors.TepSelectors.cancelResponse.projector(state)
    ).toEqual({} as any);
  });

  it('Testing selectFileApprovalMailDownloadUrl selector', () => {
    const state: TepState = {
      ...initialState,
      downloadApprovalMailFileUrl: {} as any
    };
    expect(
      selectors.TepSelectors.selectFileApprovalMailDownloadUrl.projector(state)
    ).toEqual({} as any);
  });

  it('Testing selectFileCancelledChequeDownloadUrl selector', () => {
    const state: TepState = {
      ...initialState,
      downloadCancelledChequeFileUrl: {} as any
    };
    expect(
      selectors.TepSelectors.selectFileCancelledChequeDownloadUrl.projector(state)
    ).toEqual({} as any);
  });

  it('Testing selectFileIdProofDownloadUrl selector', () => {
    const state: TepState = {
      ...initialState,
      downloadIdProofFileUrl: {} as any
    };
    expect(
      selectors.TepSelectors.selectFileIdProofDownloadUrl.projector(state)
    ).toEqual({} as any);
  });

  it('Testing selectFileUploadRes selector', () => {
    const state: TepState = {
      ...initialState,
      uploadFileResponse: {} as any
    };
    expect(
      selectors.TepSelectors.selectFileUploadRes.projector(state)
    ).toEqual({} as any);
  });

});
