import {
  AdvanceBookingDetailsResponse,
  CashMemoItemDetailsResponse,
  CashMemoTaxDetails,
  CNDetailsResponsePayload,
  CoinDetails,
  CustomErrors,
  DiscountsResponse,
  DiscountTypeEnum,
  ProductDetails,
  ProductPriceDetails,
  RsoDetailsPayload,
  SearchProductList,
  StatusTypesEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { itemDetailsAdapter, productDetailsAdapter } from './product.entity';
import { initialState } from './product.reducer';
import * as selectors from './product.selectors';
import { ProductState } from './product.state';

describe('Product Selector Testing Suite', () => {
  const searchProductList: SearchProductList = {
    itemCode: '511107CSIMAA00',
    productGroupCode: '71',
    totalQuantity: 1
  };
  const coinDetails: CoinDetails = {
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

  const rsoDetails: RsoDetailsPayload[] = [{ code: 'RSO1', name: 'RSO User' }];

  const reasons = ['edited'];

  const productPriceDetails: ProductPriceDetails = {
    binCode: 'ZEROBIN',
    complexityCode: 'PCB',
    currencyCode: 'INR',
    finalValue: 35539.95,
    inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
    itemCode: '511107CSIMAA00',
    itemQuantity: 1,
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

  const cashMemoTaxDetails: CashMemoTaxDetails = {
    taxType: 'ITEMCHARGES',
    taxClass: 'TC72',
    data: { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 437.42 },
    cess: null
  };

  const discountDetails: DiscountsResponse[] = [
    {
      discountCode: '',
      discountId: '',
      discountTxnId: '',
      discountType: 'EMPLOYEE_DISCOUNT',
      discountValue: 21,
      discountValueDetails: {
        data: [],
        type: ''
      },
      isEdited: true,
      itemId: '',
      refDiscountId: '',
      refType: '',
      discountAttributes: null,
      isNarationMandatory: true,
      occasion: '',
      status: 'OPEN',
      clubbedDiscountId: null,
      referenceId: '123'
    },
    {
      discountCode: '',
      discountId: '',
      discountTxnId: '',
      discountType: 'TSSS_DISCOUNT',
      discountValue: 21,
      discountValueDetails: {
        data: [],
        type: ''
      },
      isEdited: true,
      itemId: '',
      refDiscountId: '',
      refType: '',
      discountAttributes: null,
      isNarationMandatory: true,
      occasion: '',
      status: 'OPEN',
      clubbedDiscountId: null
    },
    {
      discountCode: '',
      discountId: '',
      discountTxnId: '',
      discountType: 'TATA_EMPLOYEE_DISCOUNT',
      discountValue: 21,
      discountValueDetails: {
        data: [],
        type: ''
      },
      isEdited: true,
      itemId: '',
      refDiscountId: '',
      refType: '',
      discountAttributes: null,
      isNarationMandatory: true,
      occasion: '',
      status: 'OPEN',
      clubbedDiscountId: null
    },
    {
      discountCode: '',
      discountId: '',
      discountTxnId: '',
      discountType: 'EMPOWERMENT_DISCOUNT',
      discountValue: 21,
      discountValueDetails: {
        data: [],
        type: ''
      },
      isEdited: true,
      itemId: '',
      refDiscountId: '',
      refType: '',
      discountAttributes: null,
      isNarationMandatory: true,
      occasion: '',
      status: 'OPEN',
      clubbedDiscountId: null
    },
    {
      discountCode: '',
      discountId: '',
      discountTxnId: '',
      discountType: 'SYSTEM_DISCOUNT_DV',
      discountValue: 21,
      discountValueDetails: {
        data: [],
        type: ''
      },
      isEdited: true,
      itemId: '',
      refDiscountId: '',
      refType: '',
      discountAttributes: null,
      isNarationMandatory: true,
      occasion: '',
      status: 'OPEN',
      clubbedDiscountId: null
    },
    {
      discountCode: '',
      discountId: '',
      discountTxnId: '',
      discountType: 'KARAT_EXCHANGE_OFFER_DISCOUNT',
      discountValue: 21,
      discountValueDetails: {
        data: [],
        type: ''
      },
      isEdited: true,
      itemId: '',
      refDiscountId: '',
      refType: '',
      discountAttributes: null,
      isNarationMandatory: true,
      occasion: '',
      status: 'OPEN',
      clubbedDiscountId: null
    },
    {
      discountCode: '',
      discountId: '',
      discountTxnId: '',
      discountType: 'ULP_DISCOUNT_BIRTHDAY',
      discountValue: 21,
      discountValueDetails: {
        data: [],
        type: ''
      },
      isEdited: true,
      itemId: '',
      refDiscountId: '',
      refType: '',
      discountAttributes: null,
      isNarationMandatory: true,
      occasion: '',
      status: 'OPEN',
      clubbedDiscountId: null
    },
    {
      discountCode: '',
      discountId: '',
      discountTxnId: '',
      discountType: DiscountTypeEnum.DIGI_GOLD_DISCOUNT,
      discountValue: 21,
      discountValueDetails: {
        data: [],
        type: ''
      },
      isEdited: true,
      itemId: '',
      refDiscountId: '',
      refType: '',
      discountAttributes: null,
      isNarationMandatory: true,
      occasion: '',
      status: 'OPEN',
      clubbedDiscountId: null
    },
    {
      discountCode: '',
      discountId: '',
      discountTxnId: '',
      discountType: 'SYSTEM_DISCOUNT_GEP_PURITY',
      discountValue: 21,
      discountValueDetails: {
        data: [],
        type: ''
      },
      isEdited: true,
      itemId: '',
      refDiscountId: '',
      refType: '',
      discountAttributes: null,
      isNarationMandatory: true,
      occasion: '',
      status: 'OPEN',
      clubbedDiscountId: null
    }
  ];
  const cashMemoItemDetailsResponse: CashMemoItemDetailsResponse = {
    customerId: 6,
    otherChargesList: null,
    discountDetails: discountDetails,
    focdetails: null,
    txnTime: null,
    docDate: moment(1624300200000),
    docNo: 533,
    employeeCode: 'cashiercpd',
    finalValue: 79326,
    firstHoldTime: null,
    fiscalYear: 2021,
    id: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
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
    manualBillDetails: null,
    metalRateList: {},
    occasion: null,
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
  };
  const cashMemoItemDetailsResponse2: CashMemoItemDetailsResponse = {
    customerId: 6,
    otherChargesList: null,
    discountDetails: [
      {
        discountCode: '',
        discountId: '',
        discountTxnId: '',
        discountType: 'CATEGORY_DISCOUNT',
        discountValue: 21,
        discountValueDetails: {
          data: [],
          type: ''
        },
        isEdited: true,
        itemId: '',
        refDiscountId: '',
        refType: '',
        discountAttributes: null,
        isNarationMandatory: true,
        occasion: '',
        status: 'OPEN',
        clubbedDiscountId: null,
        referenceId: null
      }
    ],
    focdetails: null,
    txnTime: null,
    docDate: moment(1624300200000),
    docNo: 533,
    employeeCode: 'cashiercpd',
    finalValue: 79326,
    firstHoldTime: null,
    fiscalYear: 2021,
    id: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
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
    manualBillDetails: null,
    metalRateList: {},
    occasion: null,
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
    hallmarkDiscount: 0,
    hallmarkCharges: 120,
    cancelTxnId: 2,
    isRivaah: false,
    refDocNo: 1,
    refFiscalYear: 2022
  };
  const cNDetailsResponsePayload: CNDetailsResponsePayload = {
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
  };
  const productDetailsEntity = productDetailsAdapter.setAll([productDetails], {
    ...productDetailsAdapter.getInitialState()
  });
  const itemDetailsEntity = itemDetailsAdapter.setAll(
    [cashMemoItemDetailsResponse],
    {
      ...itemDetailsAdapter.getInitialState()
    }
  );
  describe('Testing Product Related selectors', () => {
    it('should return selectSearchProductList selector', () => {
      const state: ProductState = {
        ...initialState,
        searchProductList: [searchProductList]
      };
      expect(
        selectors.productSelectors.selectSearchProductList.projector(state)
      ).toEqual([searchProductList]);
    });

    it('should return selectSearchProductListCount selector', () => {
      const state: ProductState = {
        ...initialState,
        searchProductListCount: 10
      };
      expect(
        selectors.productSelectors.selectSearchProductListCount.projector(state)
      ).toEqual(10);
    });

    it('should return selectProductDetailsCount selector', () => {
      const state: ProductState = {
        ...initialState,
        productDetailsCount: 5
      };
      expect(
        selectors.productSelectors.selectProductDetailsCount.projector(state)
      ).toEqual(5);
    });

    it('should return selectRSODetails selector', () => {
      const state: ProductState = {
        ...initialState,
        RSODetails: rsoDetails
      };
      expect(
        selectors.productSelectors.selectRSODetails.projector(state)
      ).toEqual(rsoDetails);
    });

    it('should return selectReasons selector', () => {
      const state: ProductState = {
        ...initialState,
        reasons: reasons
      };
      expect(selectors.productSelectors.selectReasons.projector(state)).toEqual(
        reasons
      );
    });

    it('should return selectValidateProductAndPriceDetails selector', () => {
      const state: ProductState = {
        ...initialState,
        validateProductAndPriceDetails: productPriceDetails
      };
      expect(
        selectors.productSelectors.selectValidateProductAndPriceDetails.projector(
          state
        )
      ).toEqual(productPriceDetails);
    });

    it('should return selectTaxDetails selector', () => {
      const state: ProductState = {
        ...initialState,
        taxDetails: cashMemoTaxDetails
      };
      expect(
        selectors.productSelectors.selectTaxDetails.projector(state)
      ).toEqual(cashMemoTaxDetails);
    });

    it('should return selectDeleteItemFromCashMemoResponse selector', () => {
      const state: ProductState = {
        ...initialState,
        deleteItemFromCashMemoResponse: {
          responseData: cashMemoItemDetailsResponse,
          itemDetails: null
        }
      };
      expect(
        selectors.productSelectors.selectDeleteItemFromCashMemoResponse.projector(
          state
        )
      ).toEqual({
        responseData: cashMemoItemDetailsResponse,
        itemDetails: null
      });
    });

    it('should return selectValidateWeight selector', () => {
      const state: ProductState = {
        ...initialState,
        validateWeight: {}
      };
      expect(
        selectors.productSelectors.selectValidateWeight.projector(state)
      ).toEqual({});
    });

    it('should return selectCoinDetails selector', () => {
      const state: ProductState = {
        ...initialState,
        coinDetails: { itemCode: '600107ZAARAS00', coinDetails: [coinDetails] }
      };
      expect(
        selectors.productSelectors.selectCoinDetails.projector(state)
      ).toEqual({ itemCode: '600107ZAARAS00', coinDetails: [coinDetails] });
    });

    it('should return selectPriceDetails selector', () => {
      const state: ProductState = {
        ...initialState,
        priceDetails: productPriceDetails
      };
      expect(
        selectors.productSelectors.selectPriceDetails.projector(state)
      ).toEqual(productPriceDetails);
    });

    it('should return selectItemIDList selector', () => {
      const state: ProductState = {
        ...initialState,
        itemIDList: { item: cashMemoDetailsResponse, isUpdate: true }
      };
      expect(
        selectors.productSelectors.selectItemIDList.projector(state)
      ).toEqual({ item: cashMemoDetailsResponse, isUpdate: true });
    });

    it('should return selectClearProductGrid selector', () => {
      const state: ProductState = {
        ...initialState,
        clearProductGrid: false
      };
      expect(
        selectors.productSelectors.selectClearProductGrid.projector(state)
      ).toEqual(false);
    });

    it('should return selectGridSearchEnable selector', () => {
      const state: ProductState = {
        ...initialState,
        gridSearchEnable: false
      };
      expect(
        selectors.productSelectors.selectGridSearchEnable.projector(state)
      ).toEqual(false);
    });

    it('should return selectStandardPrice selector', () => {
      const state: ProductState = {
        ...initialState,
        standardPrice: { rate: 5000 }
      };
      expect(
        selectors.productSelectors.selectStandardPrice.projector(state)
      ).toEqual({ rate: 5000 });
    });

    it('should return selectMetalRate selector', () => {
      const state: ProductState = {
        ...initialState,
        metalRate: { rate: 5000 }
      };
      expect(
        selectors.productSelectors.selectMetalRate.projector(state)
      ).toEqual({ rate: 5000 });
    });

    it('should return selectCreateOrder selector', () => {
      const state: ProductState = {
        ...initialState,
        createOrder: true
      };
      expect(
        selectors.productSelectors.selectCreateOrder.projector(state)
      ).toEqual(true);
    });

    it('should return selectDiscountSelected selector', () => {
      const state: ProductState = {
        ...initialState,
        discountSelected: true
      };
      expect(
        selectors.productSelectors.selectDiscountSelected.projector(state)
      ).toEqual(true);
    });

    it('Should return productDetails Entity', () => {
      const state: ProductState = {
        ...initialState,
        productDetails: productDetailsEntity
      };
      expect(selectors.productDetails.projector(state)).toEqual(
        productDetailsEntity
      );
    });

    it('Should return productDetails', () => {
      expect(
        selectors.productSelectors.selectProductDetails.projector(
          productDetailsEntity
        )
      ).toEqual([productDetails]);
    });

    it('Should return selectHasError selector', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      const state: ProductState = {
        ...initialState,
        hasError: error
      };
      expect(
        selectors.productSelectors.selectHasError.projector(state)
      ).toEqual(error);
    });

    it('should return selectIsLoading selector', () => {
      const state: ProductState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.productSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('should return selectIsPriceLoading selector', () => {
      const state: ProductState = {
        ...initialState,
        isPriceLoading: true
      };
      expect(
        selectors.productSelectors.selectIsPriceLoading.projector(state)
      ).toEqual(true);
    });

    it('should return selectIsTaxLoading selector', () => {
      const state: ProductState = {
        ...initialState,
        isTaxLoading: true
      };
      expect(
        selectors.productSelectors.selectIsTaxLoading.projector(state)
      ).toEqual(true);
    });

    it('should return selectIsItemLoading selector', () => {
      const state: ProductState = {
        ...initialState,
        isItemLoading: true
      };
      expect(
        selectors.productSelectors.selectIsItemLoading.projector(state)
      ).toEqual(true);
    });

    it('should return selectIsCoinLoading selector', () => {
      const state: ProductState = {
        ...initialState,
        isCoinLoading: true
      };
      expect(
        selectors.productSelectors.selectIsCoinLoading.projector(state)
      ).toEqual(true);
    });

    it('should return selectSearchProductList selector', () => {
      const data = [
        {
          itemCode: 'AAAA',
          totalQuantity: 2,
          productGroupCode: 'AAAA'
        }
      ];
      const state: ProductState = {
        ...initialState,
        searchProductList: data
      };
      expect(
        selectors.productSelectors.selectSearchProductList.projector(state)
      ).toEqual(data);
    });
  });
  it('should return selectSearchProductListCount selector', () => {
    const data = [
      {
        itemCode: 'AAAA',
        totalQuantity: 2,
        productGroupCode: 'AAAA'
      }
    ];
    const state: ProductState = {
      ...initialState,
      searchProductListCount: data.length
    };
    expect(
      selectors.productSelectors.selectSearchProductListCount.projector(state)
    ).toEqual(data.length);
  });

  it('should return selectProductDetailsCount selector', () => {
    const state: ProductState = {
      ...initialState,
      productDetailsCount: [productDetails].length
    };
    expect(
      selectors.productSelectors.selectProductDetailsCount.projector(state)
    ).toEqual([productDetails].length);
  });

  it('Should return itemDetails Entity', () => {
    const state: ProductState = {
      ...initialState,
      itemDetails: itemDetailsEntity
    };
    expect(selectors.itemDetails.projector(state)).toEqual(itemDetailsEntity);
  });

  it('Should return itemDetails', () => {
    expect(
      selectors.productSelectors.selectItemDetails.projector(itemDetailsEntity)
    ).toEqual([cashMemoItemDetailsResponse]);
  });

  it('Should return abItemDetails Entity', () => {
    const state: ProductState = {
      ...initialState,
      abItemDetails: itemDetailsEntity
    };
    expect(selectors.abItemDetails.projector(state)).toEqual(itemDetailsEntity);
  });

  it('Should return selectAbItemDetails', () => {
    expect(
      selectors.productSelectors.selectAbItemDetails.projector(
        itemDetailsEntity
      )
    ).toEqual([cashMemoItemDetailsResponse]);
  });

  it('Should return true if ABDiscounts', () => {
    const isABDiscounts = true;
    const itemDetails = [cashMemoItemDetailsResponse];

    expect(
      selectors.productSelectors.selectABDiscounts.projector(itemDetails)
    ).toEqual([isABDiscounts]);
  });

  it('Should return false if not ABDiscounts', () => {
    const isABDiscounts = false;
    const itemDetails = [cashMemoItemDetailsResponse2];

    expect(
      selectors.productSelectors.selectABDiscounts.projector(itemDetails)
    ).toEqual([isABDiscounts]);
  });

  it('should return selectCNDetails selector', () => {
    const state: ProductState = {
      ...initialState,
      cnDetailsList: [cNDetailsResponsePayload]
    };
    expect(
      selectors.productSelectors.selectCNDetails.projector(state)
    ).toEqual([cNDetailsResponsePayload]);
  });

  it('should return selectValidCoinDetails selector', () => {
    const state: ProductState = {
      ...initialState,
      validCoinDetails: {
        itemCode: '600107ZAARAS00',
        coinDetails: [coinDetails]
      }
    };
    expect(
      selectors.productSelectors.selectValidCoinDetails.projector(state)
    ).toEqual({ itemCode: '600107ZAARAS00', coinDetails: [coinDetails] });
  });

  it('should return selectItemDetailsOperation selector', () => {
    const state: ProductState = {
      ...initialState,
      itemDetailsOperation: 'LOT'
    };
    expect(
      selectors.productSelectors.selectItemDetailsOperation.projector(state)
    ).toEqual('LOT');
  });

  it('should return selectSpecificItemId selector', () => {
    const state: ProductState = {
      ...initialState,
      specificItemDetails: {
        id: '1',
        isAdd: true,
        loadAutoDiscounts: true
      }
    };
    expect(
      selectors.productSelectors.selectSpecificItemId.projector(state)
    ).toEqual({
      id: '1',
      isAdd: true,
      loadAutoDiscounts: true
    });
  });

  it('should return selectIsABInvokedFirstTime selector', () => {
    const state: ProductState = {
      ...initialState,
      isABInvokedFirstTime: false
    };
    expect(
      selectors.productSelectors.selectIsABInvokedFirstTime.projector(state)
    ).toEqual(false);
  });
});
