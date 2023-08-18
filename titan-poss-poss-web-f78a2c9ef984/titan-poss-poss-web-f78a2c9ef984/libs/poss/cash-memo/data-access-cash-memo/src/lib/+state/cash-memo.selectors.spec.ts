import {
  AdvanceBookingDetailsResponse,
  CashMemoItemDetails,
  CreateCashMemoResponse,
  CustomErrors,
  FileUploadLists,
  MetalRates,
  StatusTypesEnum,
  TcsDataResponse
} from '@poss-web/shared/models';
import { CashMemoState } from './cash-memo.state';
import { initialState } from './cash-memo.reducer';
import * as selectors from './cash-memo.selectors';
import * as moment from 'moment';
import { itemDetailsAdapter } from './cash-memo.entity';

describe('Cash Memo Selector Testing Suite', () => {
  const createCashMemoResponse: CreateCashMemoResponse = {
    id: '3A0E5E55-1830-4392-98E6-94D16766B6B2',
    status: StatusTypesEnum.OPEN,
    docNo: 36,
    subTxnType: 'MANUAL_CM',
    txnType: 'CM',
    manualBillDetails: {
      manualBillDate: (1625509800000),
      manualBillNo: '10AQ',
      manualBillValue: 100000,
      remarks: 'test',
      approvedBy: 'cashiercpd',
      password: 'MAzmkyR+',
      metalRates: {
        J: { metalTypeCode: 'J', totalMetalWeight: 10, ratePerUnit: 46934 }
      },
      isFrozenRate: null,
      frozenRateDate: null,
      processId: null,
      requestStatus: null,
      requestNo: null,
      validationType: 'PASSWORD_VALIDATION',
      performedBy: null
    }
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
    refSubTxnType: 'NEW_AB',
    isFrozenAmount: 0,
    hallmarkCharges: 100,
    hallmarkDiscount: 0,
    cancelTxnId: 1,
    isRivaah: false,
    refDocNo: 2,
    refFiscalYear: 2022
  };

  const metalRates: MetalRates[] = [
    {
      metalTypeCode: 'J',
      priceType: 'D',
      ratePerUnit: 46934
    }
  ];

  const fileUploadRes = true;

  const fileUploadListRes: FileUploadLists[] = [
    {
      id: '1234567',
      name: 'file1'
    }
  ];

  const fileDownloadRes = 'http://downloadedurl.com';
  const tcsResponse: TcsDataResponse = {
    tcsToBeCollected: 100,
    tcsCollected: 10,
    tcsEligibleAmount: 1000
  };
  const cashMemoItemDetailsRes: CashMemoItemDetails = {
    unitWeight: 0,
    focDetails: null,
    isFoc: false,
    refSubTxnType: null,
    binCode: 'ZEROBIN',
    discountDetails: null,
    employeeCode: null,
    finalValue: 36432.57,
    inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
    inventoryWeightDetails: {
      type: 'WEIGHT_DETAILS',
      data: {
        diamondWeight: 0,
        goldWeight: 8.854,
        materialWeight: 0,
        platinumWeight: 0,
        silverWeight: 0,
        stoneWeight: 0
      }
    },
    itemCode: '511107CSIMAA00',
    itemDetails: { type: 'ITEM_DETAILS', data: {} },
    itemId: 'F69D838B-7A96-4FDD-9BB6-704CB3FFA0A0',
    itemInStock: true,
    lotNumber: '2JA005700',
    measuredWeightDetails: {
      type: 'WEIGHT_DETAILS',
      data: {
        diamondWeight: 0,
        goldWeight: 0,
        materialWeight: 0,
        platinumWeight: 0,
        silverWeight: 0,
        stoneWeight: 0
      }
    },
    priceDetails: {
      netWeight: 8.854,
      isUcp: false,
      metalPriceDetails: {
        preDiscountValue: 31591.07,
        metalPrices: [
          {
            weightUnit: 'gms',
            netWeight: 8.854,
            metalValue: 31591.07,
            type: 'Gold',
            ratePerUnit: 3568.0,
            karat: 22.0,
            purity: 92.0,
            metalTypeCode: 'J'
          }
        ]
      },
      stonePriceDetails: {
        preDiscountValue: 0,
        weightUnit: null,
        stoneWeight: null,
        numberOfStones: null,
        weightUnitForView: null,
        stoneWeightForView: null
      },
      makingChargeDetails: {
        preDiscountValue: 3948.88,
        isDynamicPricing: false,
        makingChargePercentage: 12.5,
        makingChargePgram: 0.0,
        wastagePct: 12.5,
        makingChargePct: 0.0
      },
      itemHallmarkDetails: {
        hallmarkGstPct: 12,
        hallmarkingCharges: 120,
        hmQuantity: 1,
        isFOCForHallmarkingCharges: true,
        isHallmarked: true
      }
    },
    productCategoryCode: 'C',
    productGroupCode: '73',
    reason: 'Weight not checked during In warding',
    refTxnId: null,
    refTxnType: null,
    remarks: 'test',
    rowId: 2,
    taxDetails: {
      taxType: 'ITEMCHARGES',
      taxClass: 'TC72',
      data: { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 437.42 },
      cess: null
    },
    totalDiscount: 0,
    totalQuantity: 1,
    totalTax: 888.6,
    totalValue: 35543.97,
    totalWeight: 8.855,
    unitValue: 35543.97,
    hallmarkCharges: 120,
    hallmarkDiscount: 0
  };
  const itemDetailsEntity = itemDetailsAdapter.setAll(
    [cashMemoItemDetailsRes],
    {
      ...itemDetailsAdapter.getInitialState()
    }
  );

  describe('Testing Cash Memo Related selectors', () => {
    it('should return selectCreateCashMemoResponse selector', () => {
      const state: CashMemoState = {
        ...initialState,
        createCashMemoResponse: createCashMemoResponse
      };
      expect(
        selectors.cashMemoSelectors.selectCreateCashMemoResponse.projector(
          state
        )
      ).toEqual(createCashMemoResponse);
    });

    it('should return selectViewCashMemoResponse selector', () => {
      const state: CashMemoState = {
        ...initialState,
        viewCashMemoResponse: cashMemoDetailsResponse
      };
      expect(
        selectors.cashMemoSelectors.selectViewCashMemoResponse.projector(
          state
        )
      ).toEqual(cashMemoDetailsResponse);
    });

    it('should return selectPartailUpdateCashMemoResponse selector', () => {
      const state: CashMemoState = {
        ...initialState,
        partialUpdateCashMemoResponse: cashMemoDetailsResponse
      };
      expect(
        selectors.cashMemoSelectors.selectPartialUpdateCashMemoResponse.projector(
          state
        )
      ).toEqual(cashMemoDetailsResponse);
    });

    it('should return selectUpdateCashMemoResponse selector', () => {
      const state: CashMemoState = {
        ...initialState,
        updateCashMemoResponse: cashMemoDetailsResponse
      };
      expect(
        selectors.cashMemoSelectors.selectUpdateCashMemoResponse.projector(
          state
        )
      ).toEqual(cashMemoDetailsResponse);
    });

    it('should return selectDeleteCashMemoResponse selector', () => {
      const state: CashMemoState = {
        ...initialState,
        deleteCashMemoResponse: true
      };
      expect(
        selectors.cashMemoSelectors.selectDeleteCashMemoResponse.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectUpdatePriceDetailsResponse selector', () => {
      const state: CashMemoState = {
        ...initialState,
        updatePriceDetailsResponse: {
          data: cashMemoDetailsResponse,
          requestDetails: true
        }
      };
      expect(
        selectors.cashMemoSelectors.selectUpdatePriceDetailsResponse.projector(
          state
        )
      ).toEqual({
        data: cashMemoDetailsResponse,
        requestDetails: true
      });
    });

    it('should return selectInvokeOrderDetailsResponse selector', () => {
      const state: CashMemoState = {
        ...initialState,
        invokeOrderDetailsResponse: cashMemoDetailsResponse
      };
      expect(
        selectors.cashMemoSelectors.selectInvokeOrderDetailsResponse.projector(
          state
        )
      ).toEqual(cashMemoDetailsResponse);
    });

    it('Should return hasError selector', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      const state: CashMemoState = {
        ...initialState,
        hasError: error
      };
      expect(
        selectors.cashMemoSelectors.selectHasError.projector(state)
      ).toEqual(error);
    });

    it('should return isLoading selector', () => {
      const state: CashMemoState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.cashMemoSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('should return selectCashMemoHistory selector', () => {
      const state: CashMemoState = {
        ...initialState,
        cashMemoHistory: [
          {
            customerName: 'ABC',
            createdDate: '22/01/2020',
            createdBy: 'RSO',
            docNo: 11,
            docDate: '22/01/2020',
            fiscalYear: 2020,
            netAmount: 1000,
            id: '1',
            status: 'CONFIRMED'
          }
        ]
      };
      expect(
        selectors.cashMemoSelectors.selectCashMemoHistory.projector(
          state
        )
      ).toEqual([
        {
          customerName: 'ABC',
          createdDate: '22/01/2020',
          createdBy: 'RSO',
          docNo: 11,
          docDate: '22/01/2020',
          fiscalYear: 2020,
          netAmount: 1000,
          id: '1',
          status: 'CONFIRMED'
        }
      ]);
    });

    it('should return selectCashMemoHistoryTotalElements selector', () => {
      const state: CashMemoState = {
        ...initialState,
        cashMemoHistoryTotalElements: 10
      };
      expect(
        selectors.cashMemoSelectors.selectCashMemoHistoryTotalElements.projector(
          state
        )
      ).toEqual(10);
    });

    it('should return selectIsHistoryDetailsLoading selector', () => {
      const state: CashMemoState = {
        ...initialState,
        isHistoryDetailsLoading: true
      };
      expect(
        selectors.cashMemoSelectors.selectIsHistoryDetailsLoading.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectHistorySearchParameter selector', () => {
      const state: CashMemoState = {
        ...initialState,
        historySearchParameter: null
      };
      expect(
        selectors.cashMemoSelectors.selectHistorySearchParameter.projector(
          state
        )
      ).toEqual(null);
    });

    it('should return selectMaterialPrices selector', () => {
      const state: CashMemoState = {
        ...initialState,
        materialPrices: metalRates
      };
      expect(
        selectors.cashMemoSelectors.selectMaterialPrices.projector(state)
      ).toEqual(metalRates);
    });

    it('should return selectFileUploadRes selector', () => {
      const state: CashMemoState = {
        ...initialState,
        uploadFileResponse: fileUploadRes
      };
      expect(
        selectors.cashMemoSelectors.selectFileUploadRes.projector(state)
      ).toEqual(fileUploadRes);
    });

    it('should return selectFileUploadListRes selector', () => {
      const state: CashMemoState = {
        ...initialState,
        uploadFileListResponse: fileUploadListRes
      };
      expect(
        selectors.cashMemoSelectors.selectFileUploadListRes.projector(
          state
        )
      ).toEqual(fileUploadListRes);
    });

    it('should return selectFileDownloadUrl selector', () => {
      const state: CashMemoState = {
        ...initialState,
        downloadFileUrl: fileDownloadRes
      };
      expect(
        selectors.cashMemoSelectors.selectFileDownloadUrl.projector(state)
      ).toEqual(fileDownloadRes);
    });

    it('should return selectSetFocus selector', () => {
      const state: CashMemoState = {
        ...initialState,
        setFocus: 1
      };
      expect(
        selectors.cashMemoSelectors.selectSetFocus.projector(state)
      ).toEqual(1);
    });

    it('should return selectIsABInvoked selector', () => {
      const state: CashMemoState = {
        ...initialState,
        isABInvoked: false
      };
      expect(
        selectors.cashMemoSelectors.selectIsABInvoked.projector(state)
      ).toEqual(false);
    });

    it('should return selectTcsAmountResponse selector', () => {
      const state: CashMemoState = {
        ...initialState,
        tcsDetails: tcsResponse
      };
      expect(
        selectors.cashMemoSelectors.selectTcsAmountResponse.projector(state)
      ).toEqual(tcsResponse);
    });

    it('Should return productDetails Entity', () => {
      const state: CashMemoState = {
        ...initialState,
        productDetails: itemDetailsEntity
      };
      expect(selectors.itemDetails.projector(state)).toEqual(itemDetailsEntity);
    });
  
    it('Should return itemDetails', () => {
      expect(
        selectors.cashMemoSelectors.selectItemDetails.projector(itemDetailsEntity)
      ).toEqual([cashMemoItemDetailsRes]);
    });
  });
});
