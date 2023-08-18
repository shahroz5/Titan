import {
  AdvanceBookingDetailsResponse,
  CashMemoItemDetailsRequestPayload,
  CashMemoItemDetailsResponse,
  CashMemoItemValidate,
  CashMemoTaxDetails,
  CNDetailsRequestPayload,
  CNDetailsResponsePayload,
  CoinDetails,
  ProductDetails,
  ProductDetailsInGrid,
  ProductDetailsPayload,
  ProductPriceDetails,
  RsoDetailsPayload,
  SearchProductList,
  SearchProductPayload,
  StatusTypesEnum,
  TaxDetailsPayload,
  ValidateProductAndPriceDetailsPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import * as actions from './product.actions';
import { initialState, productReducer } from './product.reducer';
import { ProductState } from './product.state';
describe('Product Reducer Testing Suite', () => {
  const testState = initialState;

  const searchProductPayload: SearchProductPayload = {
    searchValue: '511107C'
  };
  const searchProductList: SearchProductList = {
    itemCode: '511107CSIMAA00',
    productGroupCode: '71',
    totalQuantity: 1
  };

  const productDetailsPayload: ProductDetailsPayload = {
    itemCode: '511107CSIMAA00'
  };
  const productDetails: ProductDetails = {
    binCode: 'ZEROBIN',
    binGroupCode: 'STN',
    imageUrl: '/productcatalogue/ProductImages/1107CSI.jpg',
    inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
    itemCode: '511107CSIMAA00',
    itemDescription: '22KT - 1107CSI - CHAIN',
    karatage: 22,
    lotNumber: '2JA005700',
    // mfgDate: 1557685800000,
    productCategoryCode: 'C',
    productCategoryDescription: 'CHAIN',
    productGroupCode: '71',
    productGroupDescription: 'Gold Plain',
    stdValue: 28215.28,
    stdWeight: 8.854,
    // stockInwardDate: 1612377000000,
    totalQuantity: 1,
    totalWeightDetails: {
      type: 'WEIGHT_DETAILS',
      data: {
        silverWeight: 0,
        stoneWeight: 0,
        materialWeight: 0,
        goldWeight: 8.854,
        diamondWeight: 0,
        platinumWeight: 0
      }
    },
    unitWeight: 8.854
  };

  const validateProductAndPriceDetailsPayload: ValidateProductAndPriceDetailsPayload = {
    inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
    orderPriceRequest: {
      checkInventory: true,
      itemCode: '511107CSIMAA00',
      lotNumber: '2JA005700',
      inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
      standardPrice: {
        P: {
          metalTypeCode: 'P',
          purity: 92.5,
          ratePerUnit: 30,
          currency: 'INR',
          applicableDate: 1624300200000,
          karat: 0
        },
        J: {
          metalTypeCode: 'J',
          purity: 91.6666667,
          ratePerUnit: 3568,
          currency: 'INR',
          applicableDate: 1624300200000,
          karat: 22
        },
        L: {
          metalTypeCode: 'L',
          purity: 95,
          ratePerUnit: 2000,
          currency: 'INR',
          applicableDate: 1624300200000,
          karat: 0
        }
      }
    },
    isABInvoked: false
  };
  const productPriceDetails: ProductPriceDetails = {
    binCode: 'ZEROBIN',
    complexityCode: 'PCB',
    currencyCode: 'INR',
    finalValue: 35539.95,
    inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
    // isGoldPriceMandatory: true,
    // isMakingChargeMandatory: false,
    // isPlatinumPriceMandatory: false,
    // isSilverPriceMandatory: false,
    // isStonePriceMandatory: false,
    itemCode: '511107CSIMAA00',
    itemQuantity: 1,
    // itemTypeCode: 'J',
    lotNumber: '2JA005700',
    isUcp: false,
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
    priceGroup: 'NORTH1',
    productCategoryCode: 'C',
    productDesc: 'Gold Plain',
    productGroupCode: '71',
    productGroupDesc: 'Gold Plain',
    stdWeight: 8.854,
    ignoreUcpRecalculate: false
  };

  const taxDetailsPayload: TaxDetailsPayload = {
    customerId: 6,
    itemCode: '511107CSIMAA00',
    txnType: 'CUST_TRANSACTION_CM'
  };
  const cashMemoTaxDetails: CashMemoTaxDetails = {
    taxType: 'ITEMCHARGES',
    taxClass: 'TC72',
    data: { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 437.42 },
    cess: null
  };

  const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
    txnType: 'CM',
    subTxnType: 'NEW_CM',
    id: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
    itemDetails: {
      employeeCode: null,
      finalValue: 36428.45,
      inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
      inventoryWeight: 8.854,
      itemCode: '511107CSIMAA00',
      lotNumber: '2JA005700',
      reason: null,
      remarks: null,
      totalDiscount: 0,
      totalQuantity: 1,
      totalTax: 888.5,
      totalValue: 35539.95,
      totalWeight: 8.854,
      unitValue: 35539.95
    }
  };
  const cashMemoItemDetailsResponse: CashMemoItemDetailsResponse[] = [
    {
      //   confirmedTime: null,
      // creditNotes: null,
      // currencyCode: "INR",
      // customerDocDetails: null,
      customerId: 6,
      otherChargesList: null,
      discountDetails: null,
      focdetails: null,
      txnTime: null,
      // discountTxnDetails: null,
      docDate: moment(1624300200000),
      docNo: 533,
      employeeCode: 'cashiercpd',
      finalValue: 79326,
      firstHoldTime: null,
      fiscalYear: 2021,
      id: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
      // invokeCount: 2,
      // invokeTime: 1627408254671,
      itemDetails: {
        unitWeight: 0,
        focDetails: null,
        isFoc: false,
        refSubTxnType: null,
        binCode: 'ZEROBIN',
        discountDetails: null,
        employeeCode: null,
        finalValue: 36432.57,
        inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
        // inventoryStdValue: 28215.28,
        // inventoryStdWeight: 8.854,
        // inventoryWeight: 8.854,
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
        // orderItemId: null,
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
        productGroupCode: '71',
        reason: 'Weight not checked during In warding',
        refTxnId: null,
        refTxnType: null,
        remarks: 'test',
        rowId: 2,
        taxDetails: cashMemoTaxDetails,
        totalDiscount: 0,
        totalQuantity: 1,
        totalTax: 888.6,
        totalValue: 35543.97,
        totalWeight: 8.855,
        unitValue: 35543.97,
        hallmarkDiscount: 0,
        hallmarkCharges: 120
      },
      lastHoldTime: null,
      // locationCode: 'CPD',
      manualBillDetails: null,
      // manualBillId: null,
      metalRateList: {},
      occasion: null,
      // otherCharges: null,
      paidValue: 0,
      refSubTxnType: null,
      refTxnId: null,
      refTxnType: null,
      remarks: null,
      roundingVariance: -0.27,
      status: StatusTypesEnum.OPEN,
      subTxnType: 'NEW_CM',
      taxDetails: cashMemoTaxDetails,
      totalDiscount: 0,
      totalQuantity: 2,
      totalTax: 2137.96,
      totalValue: 77188.31,
      totalWeight: 18.854,
      txnType: 'CM',
      hallmarkCharges: 120,
      hallmarkDiscount: 0,
      isFrozenAmount: 0
      // weightUnit: 'gms'
    }
  ];

  const validateItemPayload: CashMemoItemValidate = {
    itemId: 'f69d838b-7a96-4fdd-9bb6-704cb3ffa0a0',
    productGroupCode: '71',
    availableWeight: 8.854,
    measuredWeight: 8.855,
    measuredQuantity: 1,
    availableQuantity: 1
  };

  const coinDetails: CoinDetails[] = [
    {
      // binGroupCode: 'STN',
      itemCode: '600107ZAARAS00',
      itemDescription: 'TRAD-GANESHA  10G D-22',
      karatage: 24,
      productCategoryCode: 'Z',
      productGroupCode: '73',
      stdValue: 60652,
      stdWeight: 10,
      totalQuantity: 1,
      totalWeightDetails: {
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
      unit: 'gms',
      unitWeight: 10
    }
  ];

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
    hallmarkCharges: 120,
    hallmarkDiscount: 0,
    cancelTxnId: 2,
    isRivaah: false,
    refDocNo: 1,
    refFiscalYear: 2022
  };

  const rsoDetails: RsoDetailsPayload[] = [{ code: 'RSO1', name: 'RSO User' }];

  const productGrid: ProductDetailsInGrid = {
    itemCode: '123',
    description: '123',
    binCode: '123',
    selectedLotNumber: 123,
    availableLotNumbers: null,
    unitWeight: 12,
    actualWeight: 12,
    availableReasons: ['GOOD'],
    selectedReason: 'good',
    remarks: 'good',
    selectedRso: 'RSO',
    availableRso: rsoDetails,
    pricePerUnit: 12,
    discount: null,
    finalPrice: 12,
    priceBreakUp: null,
    productDetails: null,
    inventoryId: '12',
    itemId: '12222',
    productType: 'item',
    isAdd: true,
    priceDetails: null,
    quantity: 12,
    taxDetails: null,
    stdWeight: 12,
    karatage: 12,
    productCatergory: 'PC',
    productGroup: 'PG',
    status: 'good',
    totalQuantity: 12,
    subTxnType: 'good',
    refSubTxnType: 'good',
    responseData: null,
    selectedDiscounts: null,
    rowId: 1
  };

  const details: CashMemoItemDetailsResponse = {
    //   confirmedTime: null,
    // creditNotes: null,
    // currencyCode: "INR",
    // customerDocDetails: null,
    customerId: 6,
    otherChargesList: null,
    discountDetails: null,
    focdetails: null,
    txnTime: null,
    // discountTxnDetails: null,
    docDate: moment(1624300200000),
    docNo: 533,
    employeeCode: 'cashiercpd',
    finalValue: 79326,
    firstHoldTime: null,
    fiscalYear: 2021,
    id: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
    // invokeCount: 2,
    // invokeTime: 1627408254671,
    itemDetails: {
      unitWeight: 0,
      focDetails: null,
      isFoc: false,
      refSubTxnType: null,
      binCode: 'ZEROBIN',
      discountDetails: null,
      employeeCode: null,
      finalValue: 36432.57,
      inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
      // inventoryStdValue: 28215.28,
      // inventoryStdWeight: 8.854,
      // inventoryWeight: 8.854,
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
      // orderItemId: null,
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
      productGroupCode: '71',
      reason: 'Weight not checked during In warding',
      refTxnId: null,
      refTxnType: null,
      remarks: 'test',
      rowId: 2,
      taxDetails: cashMemoTaxDetails,
      totalDiscount: 0,
      totalQuantity: 1,
      totalTax: 888.6,
      totalValue: 35543.97,
      totalWeight: 8.855,
      unitValue: 35543.97,
      hallmarkDiscount: 0,
      hallmarkCharges: 120
    },
    lastHoldTime: null,
    // locationCode: 'CPD',
    manualBillDetails: null,
    // manualBillId: null,
    metalRateList: {},
    occasion: null,
    // otherCharges: null,
    paidValue: 0,
    refSubTxnType: null,
    refTxnId: null,
    refTxnType: null,
    remarks: null,
    roundingVariance: -0.27,
    status: StatusTypesEnum.OPEN,
    subTxnType: 'NEW_CM',
    taxDetails: cashMemoTaxDetails,
    totalDiscount: 0,
    totalQuantity: 2,
    totalTax: 2137.96,
    totalValue: 77188.31,
    totalWeight: 18.854,
    txnType: 'CM',
    isFrozenAmount: 0,
    hallmarkCharges: 120,
    hallmarkDiscount: 0
    // weightUnit: 'gms'
  };

  it('should return the initial state', () => {
    const action: any = {};
    const state: ProductState = productReducer(undefined, action);

    expect(state).toBe(testState);
  });

  describe('Testing Search Product', () => {
    it('SearchProduct should return proper state', () => {
      const action = new actions.SearchProduct(searchProductPayload);

      const result: ProductState = productReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    });

    it('SearchProductSuccess should return proper state', () => {
      const searchProductsList: SearchProductList[] = [
        {
          itemCode: '511107CSIMAA00',
          productGroupCode: '71',
          totalQuantity: 1
        }
      ];

      const action = new actions.SearchProductSuccess(searchProductsList);

      const result: ProductState = productReducer(initialState, action);

      expect(result.searchProductList).toBe(searchProductsList);
      expect(result.searchProductListCount).toEqual(searchProductsList.length);
      expect(result.hasError).toEqual(null);
      expect(result.isLoading).toEqual(false);
    });

    it('SearchProductFailure should return error', () => {
      const action = new actions.SearchProductFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing LoadProductDetails', () => {
    it('LoadProductDetails should return proper state', () => {
      const action = new actions.LoadProductDetails(productDetailsPayload);

      const result: ProductState = productReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
      expect(result.productDetails.ids.length).toEqual(0);
    });

    it('LoadProductDetailsSuccess should return proper state', () => {
      const products: ProductDetails[] = [
        {
          binCode: 'ZEROBIN',
          binGroupCode: 'STN',
          imageUrl: '/productcatalogue/ProductImages/1107CSI.jpg',
          inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
          itemCode: '511107CSIMAA00',
          itemDescription: '22KT - 1107CSI - CHAIN',
          karatage: 22,
          lotNumber: '2JA005700',
          // mfgDate: 1557685800000,
          productCategoryCode: 'C',
          productCategoryDescription: 'CHAIN',
          productGroupCode: '71',
          productGroupDescription: 'Gold Plain',
          stdValue: 28215.28,
          stdWeight: 8.854,
          // stockInwardDate: 1612377000000,
          totalQuantity: 1,
          totalWeightDetails: {
            type: 'WEIGHT_DETAILS',
            data: {
              silverWeight: 0,
              stoneWeight: 0,
              materialWeight: 0,
              goldWeight: 8.854,
              diamondWeight: 0,
              platinumWeight: 0
            }
          },
          unitWeight: 8.854
        }
      ];
      const action = new actions.LoadProductDetailsSuccess(products);

      const result: ProductState = productReducer(initialState, action);

      expect(result.productDetailsCount).toEqual(products.length);
      expect(result.hasError).toEqual(null);
      expect(result.isLoading).toEqual(false);
    });

    it('SearchProductFailure should return error', () => {
      const action = new actions.SearchProductFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing LoadRSODetails', () => {
    it('LoadRSODetails should return proper state', () => {
      const action = new actions.LoadRSODetails('RSO');

      const result: ProductState = productReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    });

    it('LoadRSODetailsSuccess should return proper state', () => {
      const rsoDetails: RsoDetailsPayload[] = [
        { code: 'RSO1', name: 'RSO User' }
      ];
      const action = new actions.LoadRSODetailsSuccess(rsoDetails);

      const result: ProductState = productReducer(initialState, action);

      expect(result.RSODetails).toEqual(rsoDetails);
      expect(result.hasError).toEqual(null);
      expect(result.isLoading).toEqual(false);
    });

    it('LoadRSODetailsFailure should return error', () => {
      const action = new actions.LoadRSODetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing LoadReasons', () => {
    it('LoadReasons should return proper state', () => {
      const action = new actions.LoadReasons('RSO');

      const result: ProductState = productReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    });

    it('LoadReasonsSuccess should return proper state', () => {
      const reason: string[] = ['good'];
      const action = new actions.LoadReasonsSuccess(reason);

      const result: ProductState = productReducer(initialState, action);

      expect(result.reasons).toEqual(reason);
      expect(result.hasError).toEqual(null);
      expect(result.isLoading).toEqual(false);
    });

    it('LoadReasonsFailure should return error', () => {
      const action = new actions.LoadReasonsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing ValidateProductAndPriceDetails', () => {
    it('ValidateProductAndPriceDetails should return proper state', () => {
      const action = new actions.ValidateProductAndPriceDetails(
        validateProductAndPriceDetailsPayload
      );

      const result: ProductState = productReducer(initialState, action);

      expect(result.isPriceLoading).toBe(true);
      expect(result.hasError).toBe(null);
      expect(result.priceDetails).toBe(null);
      expect(result.validateProductAndPriceDetails).toBe(null);
    });

    it('ValidateProductAndPriceDetailsSuccess should return proper state', () => {
      const action = new actions.ValidateProductAndPriceDetailsSuccess(
        productPriceDetails
      );

      const result: ProductState = productReducer(initialState, action);

      expect(result.validateProductAndPriceDetails).toEqual(
        productPriceDetails
      );
      expect(result.hasError).toEqual(null);
      expect(result.isPriceLoading).toEqual(false);
    });

    it('ValidateProductAndPriceDetailsFailure should return error', () => {
      const action = new actions.ValidateProductAndPriceDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isPriceLoading).toEqual(false);
    });
  });

  describe('Testing LoadTaxDetails', () => {
    it('LoadTaxDetails should return proper state', () => {
      const action = new actions.LoadTaxDetails(taxDetailsPayload);

      const result: ProductState = productReducer(initialState, action);

      expect(result.isTaxLoading).toBe(true);
      expect(result.hasError).toBe(null);
      expect(result.taxDetails).toBe(null);
    });

    it('LoadTaxDetailsSuccess should return proper state', () => {
      const action = new actions.LoadTaxDetailsSuccess(cashMemoTaxDetails);

      const result: ProductState = productReducer(initialState, action);

      expect(result.taxDetails).toEqual(cashMemoTaxDetails);
      expect(result.hasError).toEqual(null);
      expect(result.isTaxLoading).toEqual(false);
    });

    it('LoadTaxDetailsFailure should return error', () => {
      const action = new actions.LoadTaxDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isTaxLoading).toEqual(false);
    });
  });

  describe('Testing AddItemtoCashMemo', () => {
    it('AddItemtoCashMemo should return proper state', () => {
      const action = new actions.AddItemtoCashMemo(
        cashMemoItemDetailsRequestPayload
      );

      const result: ProductState = productReducer(initialState, action);

      expect(result.isItemLoading).toBe(true);
      expect(result.hasError).toBe(null);
    });

    it('AddItemtoCashMemoSuccess should return proper state', () => {
      const action = new actions.AddItemtoCashMemoSuccess(
        cashMemoItemDetailsResponse
      );

      const result: ProductState = productReducer(initialState, action);

      expect(result.isItemLoading).toEqual(false);
    });

    it('AddItemtoCashMemoFailure should return error', () => {
      const action = new actions.AddItemtoCashMemoFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isItemLoading).toEqual(false);
    });
  });

  describe('Testing GetItemfromCashMemo', () => {
    it('GetItemfromCashMemo should return proper state', () => {
      const action = new actions.GetItemfromCashMemo(
        cashMemoItemDetailsRequestPayload
      );

      const result: ProductState = productReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    });

    // it('GetItemfromCashMemoSuccess should return proper state', () => {
    //   const action = new actions.GetItemfromCashMemoSuccess(
    //     cashMemoItemDetailsResponse, true, true
    //   );

    //   const result: ProductState = productReducer(initialState, action);

    //   expect(result.isLoading).toEqual(false);
    // });

    it('GetItemfromCashMemoFailure should return error', () => {
      const action = new actions.GetItemfromCashMemoFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing PartialUpdateIteminCashMemo', () => {
    it('PartialUpdateIteminCashMemo should return proper state', () => {
      const action = new actions.PartialUpdateIteminCashMemo(
        cashMemoItemDetailsRequestPayload
      );

      const result: ProductState = productReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    });

    it('PartialUpdateIteminCashMemoSuccess should return proper state', () => {
      const action = new actions.PartialUpdateIteminCashMemoSuccess(
        cashMemoItemDetailsResponse
      );

      const result: ProductState = productReducer(initialState, action);

      expect(result.isLoading).toEqual(false);
    });

    it('PartialUpdateIteminCashMemoFailure should return error', () => {
      const cashMemoDetails: CashMemoItemDetailsResponse = {
        //   confirmedTime: null,
        // creditNotes: null,
        // currencyCode: "INR",
        // customerDocDetails: null,
        customerId: 6,
        otherChargesList: null,
        discountDetails: null,
        focdetails: null,
        txnTime: null,
        // discountTxnDetails: null,
        docDate: moment(1624300200000),
        docNo: 533,
        employeeCode: 'cashiercpd',
        finalValue: 79326,
        firstHoldTime: null,
        fiscalYear: 2021,
        id: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
        // invokeCount: 2,
        // invokeTime: 1627408254671,
        itemDetails: {
          unitWeight: 0,
          focDetails: null,
          isFoc: false,
          refSubTxnType: null,
          binCode: 'ZEROBIN',
          discountDetails: null,
          employeeCode: null,
          finalValue: 36432.57,
          inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
          // inventoryStdValue: 28215.28,
          // inventoryStdWeight: 8.854,
          // inventoryWeight: 8.854,
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
          // orderItemId: null,
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
          productGroupCode: '71',
          reason: 'Weight not checked during In warding',
          refTxnId: null,
          refTxnType: null,
          remarks: 'test',
          rowId: 2,
          taxDetails: cashMemoTaxDetails,
          totalDiscount: 0,
          totalQuantity: 1,
          totalTax: 888.6,
          totalValue: 35543.97,
          totalWeight: 8.855,
          unitValue: 35543.97,
          hallmarkDiscount: 0,
          hallmarkCharges: 120
        },
        lastHoldTime: null,
        // locationCode: 'CPD',
        manualBillDetails: null,
        // manualBillId: null,
        metalRateList: {},
        occasion: null,
        // otherCharges: null,
        paidValue: 0,
        refSubTxnType: null,
        refTxnId: null,
        refTxnType: null,
        remarks: null,
        roundingVariance: -0.27,
        status: StatusTypesEnum.OPEN,
        subTxnType: 'NEW_CM',
        taxDetails: cashMemoTaxDetails,
        totalDiscount: 0,
        totalQuantity: 2,
        totalTax: 2137.96,
        totalValue: 77188.31,
        totalWeight: 18.854,
        txnType: 'CM',
        isFrozenAmount: 0,
        hallmarkCharges: 120,
        hallmarkDiscount: 0
        // weightUnit: 'gms'
      };

      const action = new actions.PartialUpdateIteminCashMemoFailure({
        error: CustomErrorAdaptor.fromJson(Error('some error')),
        oldData: cashMemoDetails
      });
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing UpdateIteminCashMemo', () => {
    it('UpdateIteminCashMemo should return proper state', () => {
      const action = new actions.UpdateIteminCashMemo(
        cashMemoItemDetailsRequestPayload
      );

      const result: ProductState = productReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    });

    // it('UpdateIteminCashMemoSuccess should return proper state', () => {
    //   const action = new actions.UpdateIteminCashMemoSuccess(
    //     cashMemoItemDetailsResponse
    //   );

    //   const result: ProductState = productReducer(initialState, action);

    //   expect(result.isLoading).toEqual(false);
    // });

    it('UpdateIteminCashMemoFailure should return error', () => {
      const cashMemoDetails: CashMemoItemDetailsResponse = {
        //   confirmedTime: null,
        // creditNotes: null,
        // currencyCode: "INR",
        // customerDocDetails: null,
        customerId: 6,
        otherChargesList: null,
        discountDetails: null,
        focdetails: null,
        txnTime: null,
        // discountTxnDetails: null,
        docDate: moment(1624300200000),
        docNo: 533,
        employeeCode: 'cashiercpd',
        finalValue: 79326,
        firstHoldTime: null,
        fiscalYear: 2021,
        id: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
        // invokeCount: 2,
        // invokeTime: 1627408254671,
        itemDetails: {
          unitWeight: 0,
          focDetails: null,
          isFoc: false,
          refSubTxnType: null,
          binCode: 'ZEROBIN',
          discountDetails: null,
          employeeCode: null,
          finalValue: 36432.57,
          inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
          // inventoryStdValue: 28215.28,
          // inventoryStdWeight: 8.854,
          // inventoryWeight: 8.854,
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
          // orderItemId: null,
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
          productGroupCode: '71',
          reason: 'Weight not checked during In warding',
          refTxnId: null,
          refTxnType: null,
          remarks: 'test',
          rowId: 2,
          taxDetails: cashMemoTaxDetails,
          totalDiscount: 0,
          totalQuantity: 1,
          totalTax: 888.6,
          totalValue: 35543.97,
          totalWeight: 8.855,
          unitValue: 35543.97,
          hallmarkDiscount: 0,
          hallmarkCharges: 120
        },
        lastHoldTime: null,
        // locationCode: 'CPD',
        manualBillDetails: null,
        // manualBillId: null,
        metalRateList: {},
        occasion: null,
        // otherCharges: null,
        paidValue: 0,
        refSubTxnType: null,
        refTxnId: null,
        refTxnType: null,
        remarks: null,
        roundingVariance: -0.27,
        status: StatusTypesEnum.OPEN,
        subTxnType: 'NEW_CM',
        taxDetails: cashMemoTaxDetails,
        totalDiscount: 0,
        totalQuantity: 2,
        totalTax: 2137.96,
        totalValue: 77188.31,
        totalWeight: 18.854,
        txnType: 'CM',
        hallmarkCharges: 120,
        hallmarkDiscount: 0,
        isFrozenAmount: 0
        // weightUnit: 'gms'
      };

      const action = new actions.UpdateIteminCashMemoFailure({
        error: CustomErrorAdaptor.fromJson(Error('some error')),
        oldData: cashMemoDetails
      });
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing DeleteItemfromCashMemo', () => {
    it('DeleteItemfromCashMemo should return proper state', () => {
      const action = new actions.DeleteItemfromCashMemo(
        cashMemoItemDetailsRequestPayload
      );

      const result: ProductState = productReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    });

    it('DeleteItemfromCashMemoSuccess should return proper state', () => {
      const action = new actions.DeleteItemfromCashMemoSuccess({
        itemId: 'RSO',
        data: details,
        itemDetails: productGrid
      });

      const result: ProductState = productReducer(initialState, action);

      expect(result.isLoading).toBe(false);
    });

    it('DeleteItemfromCashMemoFailure should return error', () => {
      const action = new actions.DeleteItemfromCashMemoFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing ValidateItem', () => {
    it('ValidateItem should return proper state', () => {
      const action = new actions.ValidateItem(validateItemPayload);

      const result: ProductState = productReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    });

    it('ValidateItemSuccess should return proper state', () => {
      const action = new actions.ValidateItemSuccess({
        itemId: '123',
        isSuccess: true,
        toleranceLimit: 12
      });
      const response = {
        isSuccess: true,
        toleranceLimit: 12
      };
      const result: ProductState = productReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.validateWeight.isSuccess).toBe(response.isSuccess);
      expect(result.validateWeight.toleranceLimit).toBe(
        response.toleranceLimit
      );
    });

    it('ValidateItemFailure should return error', () => {
      const action = new actions.ValidateItemFailure({
        itemId: '21',
        error: CustomErrorAdaptor.fromJson(Error('some error'))
      });
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.validateWeight).toEqual('error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing LoadCoinDetails', () => {
    it('LoadCoinDetails should return proper state', () => {
      const action = new actions.LoadCoinDetails({
        itemCode: 'ABC123',
        withSaleableCheck: true
      });

      const result: ProductState = productReducer(initialState, action);

      expect(result.isCoinLoading).toBe(true);
      expect(result.hasError).toBe(null);
      expect(result.coinDetails.itemCode).toBe(null);
      expect(result.coinDetails.coinDetails.length).toEqual(0);
    });

    it('LoadCoinDetailsSuccess should return proper state', () => {
      const response = {
        itemCode: 'abc123',
        coinDetails: coinDetails
      };
      const action = new actions.LoadCoinDetailsSuccess(response);

      const result: ProductState = productReducer(initialState, action);

      expect(result.coinDetails).toBe(response);
      expect(result.hasError).toBe(null);
      expect(result.isCoinLoading).toBe(false);
    });

    it('LoadCoinDetailsFailure should return error', () => {
      const action = new actions.LoadCoinDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isCoinLoading).toEqual(false);
    });
  });

  describe('Testing LoadValidCoinDetails', () => {
    it('LoadValidCoinDetails should return proper state', () => {
      const action = new actions.LoadValidCoinDetails({
        itemCode: 'ABC123',
        withSaleableCheck: true
      });

      const result: ProductState = productReducer(initialState, action);

      expect(result.isCoinLoading).toBe(true);
      expect(result.hasError).toBe(null);
      expect(result.coinDetails.itemCode).toBe(null);
      expect(result.coinDetails.coinDetails.length).toEqual(0);
    });

    it('LoadValidCoinDetailsSuccess should return proper state', () => {
      const response = {
        itemCode: 'abc123',
        coinDetails: coinDetails
      };
      const action = new actions.LoadValidCoinDetailsSuccess(response);

      const result: ProductState = productReducer(initialState, action);

      expect(result.validCoinDetails).toBe(response);
      expect(result.hasError).toBe(null);
      expect(result.isCoinLoading).toBe(false);
    });

    it('LoadValidCoinDetailsFailure should return error', () => {
      const action = new actions.LoadValidCoinDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isCoinLoading).toEqual(false);
    });
  });

  describe('Testing LoadPriceDetails', () => {
    it('LoadPriceDetails should return proper state', () => {
      const action = new actions.LoadPriceDetails(
        validateProductAndPriceDetailsPayload
      );

      const result: ProductState = productReducer(initialState, action);

      expect(result.isPriceLoading).toBe(true);
      expect(result.hasError).toBe(null);
      expect(result.priceDetails).toBe(null);
      expect(result.validateProductAndPriceDetails).toEqual(null);
    });

    it('LoadPriceDetailsSuccess should return proper state', () => {
      const action = new actions.LoadPriceDetailsSuccess(productPriceDetails);

      const result: ProductState = productReducer(initialState, action);

      expect(result.priceDetails).toBe(productPriceDetails);
      expect(result.hasError).toBe(null);
      expect(result.isPriceLoading).toBe(false);
    });

    it('LoadPriceDetailsFailure should return error', () => {
      const action = new actions.LoadPriceDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isPriceLoading).toEqual(false);
    });
  });

  describe('Testing LoadCreditNoteDetails', () => {
    it('LoadCreditNoteDetails should return proper state', () => {
      const cNDetailsRequestPayload: CNDetailsRequestPayload = {
        customerId: 353,
        cnType: 'ADV',
        isFrozenRateCnRequired: true
      };

      const action = new actions.LoadCreditNoteDetails(cNDetailsRequestPayload);

      const result: ProductState = productReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    });

    it('LoadCreditNoteDetailsSuccess should return proper state', () => {
      const cNDetailsResponsePayload: CNDetailsResponsePayload[] = [
        {
          id: '919DF438-ADE5-46E5-9DC8-FE34C04950F3',
          docNo: 314,
          fiscalYear: '2022',
          customerName: 'ABC',
          locationCode: 'CPD',
          creditNoteType: 'ADV',
          docDate: moment(1649356200000),
          amount: 6000,
          status: 'OPEN',
          linkedTxnType: null,
          mobileNumber: '9626999255',
          linkedTxnId: null,
          cashCollected: 6000.0,
          eghsDetails: null,
          goldRateAmount: 5000,
          goldWeight: 5
        }
      ];
      const action = new actions.LoadCreditNoteDetailsSuccess(
        cNDetailsResponsePayload
      );

      const result: ProductState = productReducer(initialState, action);

      expect(result.cnDetailsList).toBe(cNDetailsResponsePayload);
      expect(result.isLoading).toBe(false);
    });

    it('LoadCreditNoteDetailsFailure should return error', () => {
      const action = new actions.LoadCreditNoteDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing LoadSelectedLotNumberDetails', () => {
    it('LoadSelectedLotNumberDetails should return proper state', () => {
      const action = new actions.LoadSelectedLotNumberDetails('abc123');

      const result: ProductState = productReducer(initialState, action);

      expect(result.selectedLotNumber).toBe('abc123');
    });
  });

  describe('Testing LoadSelectedItemDetails', () => {
    it('LoadSelectedItemDetails should return proper state', () => {
      const action = new actions.LoadSelectedItemDetails('abc123');

      const result: ProductState = productReducer(initialState, action);

      expect(result.selectedItemId).toBe('abc123');
    });
  });

  describe('Testing ResetItemIdValues', () => {
    it('ResetItemIdValues should return proper state', () => {
      const action = new actions.ResetItemIdValues();

      const result: ProductState = productReducer(initialState, action);

      expect(result.selectedItemId).toBe(null);
    });
  });

  describe('Testing ResetItemIdList', () => {
    it('ResetItemIdList should return proper state', () => {
      const action = new actions.ResetItemIdList();

      const result: ProductState = productReducer(initialState, action);

      expect(result.itemDetails.ids.length).toBe(0);
    });
  });

  describe('Testing ResetValues', () => {
    it('ResetValues should return proper state', () => {
      const action = new actions.ResetValues();

      const result: ProductState = productReducer(initialState, action);

      expect(result.hasError).toBe(null);
      expect(result.isLoading).toBe(false);
      expect(result.isPriceLoading).toBe(false);
      expect(result.isTaxLoading).toBe(false);
      expect(result.isItemLoading).toBe(false);
      expect(result.searchProductList.length).toEqual(0);
      expect(result.searchProductListCount).toBe(-1);
      expect(result.productDetailsCount).toBe(-1);
      expect(result.RSODetails.length).toEqual(0);
      expect(result.reasons.length).toEqual(0);
      expect(result.validateProductAndPriceDetails).toBe(null);
      expect(result.taxDetails).toBe(null);
      expect(result.validateWeight).toBe(null);
      expect(result.selectedLotNumber).toBe(null);
      expect(result.coinDetails.itemCode).toBe(null);
      expect(result.coinDetails.coinDetails.length).toEqual(0);
      expect(result.priceDetails).toBe(null);
      expect(result.itemIDList.item).toBe(null);
      expect(result.itemIDList.isUpdate).toBe(false);
      expect(result.clearProductGrid).toBe(false);
      expect(result.standardPrice).toBe(null);
      expect(result.metalRate).toBe(null);
      expect(result.createOrder).toBe(false);
      expect(result.gridSearchEnable).toBe(true);
      expect(result.selectedItemId).toBe(null);
      expect(result.discountSelected).toBe(false);
      expect(result.isCoinLoading).toBe(false);
    });
  });

  describe('Testing ResetLotNumberValues', () => {
    it('ResetLotNumberValues should return proper state', () => {
      const action = new actions.ResetLotNumberValues();

      const result: ProductState = productReducer(initialState, action);

      expect(result.selectedLotNumber).toBe(null);
    });
  });
  describe('Testing ResetProductValues', () => {
    it('ResetLotNumberValues should return proper state', () => {
      const action = new actions.ResetProductValues();

      const result: ProductState = productReducer(initialState, action);

      expect(result.hasError).toBe(null);
      expect(result.isLoading).toBe(false);
      expect(result.isPriceLoading).toBe(false);
      expect(result.isTaxLoading).toBe(false);
      expect(result.isItemLoading).toBe(false);
      expect(result.searchProductList.length).toEqual(0);
      expect(result.searchProductListCount).toBe(-1);
      expect(result.productDetailsCount).toBe(-1);
      expect(result.validateProductAndPriceDetails).toBe(null);
      expect(result.taxDetails).toBe(null);
      expect(result.deleteItemFromCashMemoResponse.responseData).toBe(null);
      expect(result.deleteItemFromCashMemoResponse.itemDetails).toBe(null);
      expect(result.validateWeight).toBe(null);
      expect(result.selectedLotNumber).toBe(null);
      expect(result.coinDetails.itemCode).toBe(null);
      expect(result.coinDetails.coinDetails.length).toEqual(0);
      expect(result.priceDetails).toBe(null);
      expect(result.itemIDList.item).toBe(null);
      expect(result.itemIDList.isUpdate).toBe(false);
      expect(result.clearProductGrid).toBe(false);
      expect(result.standardPrice).toBe(null);
      expect(result.metalRate).toBe(null);
      expect(result.createOrder).toBe(false);
      expect(result.gridSearchEnable).toBe(true);
      expect(result.selectedItemId).toBe(null);
      expect(result.isCoinLoading).toBe(false);
    });
  });

  describe('Testing ResetCoinValues', () => {
    it('ResetCoinValues should return proper state', () => {
      const action = new actions.ResetCoinValues();

      const result: ProductState = productReducer(initialState, action);

      expect(result.priceDetails).toBe(null);
      expect(result.taxDetails).toBe(null);
      expect(result.isPriceLoading).toBe(false);
      expect(result.isTaxLoading).toBe(false);
      expect(result.isItemLoading).toBe(false);
    });
  });

  describe('Testing ClearSearchProductList', () => {
    it('ClearSearchProductList should return proper state', () => {
      const action = new actions.ClearSearchProductList();

      const result: ProductState = productReducer(initialState, action);

      expect(result.searchProductList.length).toEqual(0);
      expect(result.searchProductListCount).toBe(0);
      expect(result.isLoading).toBe(false);
      expect(result.isPriceLoading).toBe(false);
      expect(result.isTaxLoading).toBe(false);
      expect(result.isItemLoading).toBe(false);
    });
  });

  describe('Testing ClearProductList', () => {
    it('ClearProductList should return proper state', () => {
      const action = new actions.ClearProductList();

      const result: ProductState = productReducer(initialState, action);

      expect(result.productDetailsCount).toBe(0);
      expect(result.isLoading).toBe(false);
      expect(result.isPriceLoading).toBe(false);
      expect(result.isTaxLoading).toBe(false);
      expect(result.isItemLoading).toBe(false);
    });
  });

  describe('Testing ClearProductRelatedDetails', () => {
    it('ClearProductRelatedDetails should return proper state', () => {
      const action = new actions.ClearProductRelatedDetails();

      const result: ProductState = productReducer(initialState, action);

      expect(result.hasError).toBe(null);
      expect(result.isLoading).toBe(false);
      expect(result.isPriceLoading).toBe(false);
      expect(result.isTaxLoading).toBe(false);
      expect(result.isItemLoading).toBe(false);
      expect(result.searchProductList.length).toEqual(0);
      expect(result.searchProductListCount).toBe(-1);
      expect(result.productDetailsCount).toBe(-1);
      expect(result.validateProductAndPriceDetails).toBe(null);
      expect(result.taxDetails).toBe(null);
      expect(result.deleteItemFromCashMemoResponse.responseData).toBe(null);
      expect(result.deleteItemFromCashMemoResponse.itemDetails).toBe(null);
      expect(result.validateWeight).toBe(null);
      expect(result.selectedLotNumber).toBe(null);
      expect(result.priceDetails).toBe(null);
      expect(result.selectedItemId).toBe(null);
    });
  });

  describe('Testing ClearValidateItem', () => {
    it('ClearValidateItem should return proper state', () => {
      const action = new actions.ClearValidateItem();

      const result: ProductState = productReducer(initialState, action);

      expect(result.validateWeight).toBe(null);
      expect(result.hasError).toBe(null);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing SetItemIDList', () => {
    it('SetItemIDList should return proper state', () => {
      const response = {
        item: cashMemoDetailsResponse,
        isUpdate: false
      };
      const action = new actions.SetItemIDList(response);

      const result: ProductState = productReducer(initialState, action);

      expect(result.itemIDList).toBe(response);
      expect(result.hasError).toBe(null);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing ClearProductGrid', () => {
    it('ClearProductGrid should return proper state', () => {
      const action = new actions.ClearProductGrid();

      const result: ProductState = productReducer(initialState, action);

      expect(result.clearProductGrid).toBe(true);
      expect(result.hasError).toBe(null);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing SetGridSearchEnable', () => {
    it('SetGridSearchEnable should return proper state', () => {
      const action = new actions.SetGridSearchEnable(true);

      const result: ProductState = productReducer(initialState, action);

      expect(result.hasError).toBe(null);
      expect(result.isLoading).toBe(false);
      expect(result.gridSearchEnable).toBe(true);
    });
  });

  describe('Testing SetStandardPrice', () => {
    it('SetStandardPrice should return proper state', () => {
      const action = new actions.SetStandardPrice(true);

      const result: ProductState = productReducer(initialState, action);

      expect(result.standardPrice).toBe(true);
      expect(result.hasError).toBe(null);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing SetMetalRate', () => {
    it('SetMetalRate should return proper state', () => {
      const action = new actions.SetMetalRate({});

      const result: ProductState = productReducer(initialState, action);

      expect(result.metalRate).toEqual({});
      expect(result.hasError).toBe(null);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing SetABInvokedFirstTime', () => {
    it('SetABInvokedFirstTime should return proper state', () => {
      const action = new actions.SetABInvokedFirstTime(true);

      const result: ProductState = productReducer(initialState, action);

      expect(result.isABInvokedFirstTime).toBe(true);
    });
  });

  describe('Testing SetItemDetailsOperation', () => {
    it('SetItemDetailsOperation should return proper state', () => {
      const action = new actions.SetItemDetailsOperation('LOT');

      const result: ProductState = productReducer(initialState, action);

      expect(result.itemDetailsOperation).toBe('LOT');
      expect(result.hasError).toBe(null);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing SetCreateOrder', () => {
    it('SetCreateOrder should return proper state', () => {
      const action = new actions.SetCreateOrder(true);

      const result: ProductState = productReducer(initialState, action);

      expect(result.createOrder).toBe(true);
      expect(result.hasError).toBe(null);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing GetItemDetails', () => {
    it('GetItemDetails should return proper state', () => {
      const action = new actions.GetItemDetails(
        cashMemoItemDetailsRequestPayload
      );

      const result: ProductState = productReducer(initialState, action);

      expect(result.hasError).toBe(null);
      expect(result.isLoading).toBe(true);
    });
  });
  describe('Testing GetItemDetailsSuccess', () => {
    it('GetItemDetailsSuccess should return proper state', () => {
      const action = new actions.GetItemDetailsSuccess(
        cashMemoItemDetailsResponse
      );

      const result: ProductState = productReducer(initialState, action);

      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing GetItemDetailsFailure', () => {
    it('GetItemDetailsFailure should return proper state', () => {
      const action = new actions.GetItemDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing DeleteItemDetails', () => {
    it('DeleteItemDetails should return proper state', () => {
      const action = new actions.DeleteItemDetails(
        cashMemoItemDetailsRequestPayload
      );

      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError).toEqual(null);
      expect(result.isLoading).toEqual(true);
    });
  });

  describe('Testing DeleteItemDetailsSuccess', () => {
    it('DeleteItemDetailsSuccess should return proper state', () => {
      const response = {
        itemId: 'abc123',
        data: details,
        itemDetails: productGrid
      };
      const action = new actions.DeleteItemDetailsSuccess(response);

      const result: ProductState = productReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing DeleteItemDetailsFailure', () => {
    it('DeleteItemDetailsFailure should return proper state', () => {
      const action = new actions.DeleteItemDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ProductState = productReducer(initialState, action);
      expect(result.hasError.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing SetDiscountSelected', () => {
    it('SetDiscountSelected should return proper state', () => {
      const action = new actions.SetDiscountSelected(true);

      const result: ProductState = productReducer(initialState, action);
      expect(result.discountSelected).toEqual(true);
      expect(result.hasError).toEqual(null);
      expect(result.isLoading).toEqual(false);
    });
  });
});
