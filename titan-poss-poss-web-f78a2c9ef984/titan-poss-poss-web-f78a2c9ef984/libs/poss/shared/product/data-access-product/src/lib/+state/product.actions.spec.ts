import {
  AdvanceBookingDetailsResponse,
  CashMemoItemDetailsRequestPayload,
  CashMemoItemDetailsResponse,
  CashMemoItemValidate,
  CashMemoTaxDetails,
  CNDetailsRequestPayload,
  CNDetailsResponsePayload,
  CoinDetails,
  CustomErrors,
  ProductDetails,
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
import * as productActions from './product.actions';

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

const rsoDetailsPayload = 'RSO';
const rsoDetails: RsoDetailsPayload[] = [{ code: 'RSO1', name: 'RSO User' }];

const reasonsPayload = 'WEIGHT_EDIT';
const reasons = ['edited'];

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
const cashMemoItemDetailsResponse: CashMemoItemDetailsResponse = {
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
    hallmarkCharges: 120,
    hallmarkDiscount: 0
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
  hallmarkDiscount: 0,
  hallmarkCharges: 120
  // weightUnit: 'gms'
};

const validateItemPayload: CashMemoItemValidate = {
  itemId: 'f69d838b-7a96-4fdd-9bb6-704cb3ffa0a0',
  productGroupCode: '71',
  availableWeight: 8.854,
  measuredWeight: 8.855,
  measuredQuantity: 1,
  availableQuantity: 1
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
  hallmarkCharges: 120,
  hallmarkDiscount: 0,
  isFrozenAmount: 0,
  cancelTxnId: 2,
  isRivaah: false,
  refDocNo: 1,
  refFiscalYear: 2022
};

const cNDetailsRequestPayload: CNDetailsRequestPayload = {
  customerId: 353,
  cnType: 'ADV',
  isFrozenRateCnRequired: true
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

describe('Product Action Testing Suite', () => {
  describe('SearchProduct Action Test Cases', () => {
    it('should check correct type is used for  SearchProduct  action ', () => {
      const action = new productActions.SearchProduct(searchProductPayload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.SEARCH_PRODUCT
      );

      expect(action.payload).toEqual(searchProductPayload);
    });
    it('should check correct type is used for SearchProductSuccess action ', () => {
      const action = new productActions.SearchProductSuccess([
        searchProductList
      ]);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.SEARCH_PRODUCT_SUCCESS
      );
      expect(action.payload).toEqual([searchProductList]);
    });
    it('should check correct type is used for SearchProductFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.SearchProductFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.SEARCH_PRODUCT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadProductDetails  action ', () => {
      const action = new productActions.LoadProductDetails(
        productDetailsPayload
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_PRODUCT_DETAILS
      );

      expect(action.payload).toEqual(productDetailsPayload);
    });
    it('should check correct type is used for LoadProductDetailsSuccess action ', () => {
      const action = new productActions.LoadProductDetailsSuccess([
        productDetails
      ]);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_PRODUCT_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual([productDetails]);
    });
    it('should check correct type is used for LoadProductDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.LoadProductDetailsFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_PRODUCT_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadRSODetails Action Test Cases', () => {
    it('should check correct type is used for  LoadRSODetails  action ', () => {
      const action = new productActions.LoadRSODetails(rsoDetailsPayload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_RSO_DETAILS
      );

      expect(action.payload).toEqual(rsoDetailsPayload);
    });
    it('should check correct type is used for LoadRSODetailsSuccess action ', () => {
      const action = new productActions.LoadRSODetailsSuccess(rsoDetails);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_RSO_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(rsoDetails);
    });
    it('should check correct type is used for LoadRSODetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.LoadRSODetailsFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_RSO_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadReasons Action Test Cases', () => {
    it('should check correct type is used for  LoadReasons  action ', () => {
      const action = new productActions.LoadReasons(reasonsPayload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_REASONS
      );

      expect(action.payload).toEqual(reasonsPayload);
    });
    it('should check correct type is used for LoadReasonsSuccess action ', () => {
      const action = new productActions.LoadReasonsSuccess(reasons);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_REASONS_SUCCESS
      );
      expect(action.payload).toEqual(reasons);
    });
    it('should check correct type is used for LoadReasonsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.LoadReasonsFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_REASONS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ValidateProductAndPriceDetails Action Test Cases', () => {
    it('should check correct type is used for  ValidateProductAndPriceDetails  action ', () => {
      const action = new productActions.ValidateProductAndPriceDetails(
        validateProductAndPriceDetailsPayload
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.VALIDATE_PRODUCT_AND_PRICE_DETAILS
      );

      expect(action.payload).toEqual(validateProductAndPriceDetailsPayload);
    });
    it('should check correct type is used for ValidateProductAndPriceDetailsSuccess action ', () => {
      const action = new productActions.ValidateProductAndPriceDetailsSuccess(
        productPriceDetails
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes
          .VALIDATE_PRODUCT_AND_PRICE_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(productPriceDetails);
    });
    it('should check correct type is used for ValidateProductAndPriceDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.ValidateProductAndPriceDetailsFailure(
        payload
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes
          .VALIDATE_PRODUCT_AND_PRICE_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadTaxDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadTaxDetails  action ', () => {
      const action = new productActions.LoadTaxDetails(taxDetailsPayload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_TAX_DETAILS
      );

      expect(action.payload).toEqual(taxDetailsPayload);
    });
    it('should check correct type is used for LoadTaxDetailsSuccess action ', () => {
      const action = new productActions.LoadTaxDetailsSuccess(
        cashMemoTaxDetails
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_TAX_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(cashMemoTaxDetails);
    });
    it('should check correct type is used for LoadTaxDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.LoadTaxDetailsFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_TAX_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('AddItemtoCashMemo Action Test Cases', () => {
    it('should check correct type is used for  AddItemtoCashMemo  action ', () => {
      const action = new productActions.AddItemtoCashMemo(
        cashMemoItemDetailsRequestPayload
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.ADD_ITEM_TO_CASH_MEMO
      );

      expect(action.payload).toEqual(cashMemoItemDetailsRequestPayload);
    });
    it('should check correct type is used for AddItemtoCashMemoSuccess action ', () => {
      const action = new productActions.AddItemtoCashMemoSuccess([
        cashMemoItemDetailsResponse
      ]);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.ADD_ITEM_TO_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual([cashMemoItemDetailsResponse]);
    });
    it('should check correct type is used for AddItemtoCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.AddItemtoCashMemoFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.ADD_ITEM_TO_CASH_MEMO_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('GetItemfromCashMemo Action Test Cases', () => {
    it('should check correct type is used for  GetItemfromCashMemo  action ', () => {
      const action = new productActions.GetItemfromCashMemo(
        cashMemoItemDetailsRequestPayload
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.GET_ITEM_FROM_CASH_MEMO
      );

      expect(action.payload).toEqual(cashMemoItemDetailsRequestPayload);
    });
    it('should check correct type is used for GetItemfromCashMemoSuccess action ', () => {
      const action = new productActions.GetItemfromCashMemoSuccess(
        [cashMemoItemDetailsResponse],
        true,
        false
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.GET_ITEM_FROM_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual([cashMemoItemDetailsResponse]);
    });
    it('should check correct type is used for GetItemfromCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.GetItemfromCashMemoFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.GET_ITEM_FROM_CASH_MEMO_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('PartialUpdateIteminCashMemo Action Test Cases', () => {
    it('should check correct type is used for  PartialUpdateIteminCashMemo  action ', () => {
      const action = new productActions.PartialUpdateIteminCashMemo(
        cashMemoItemDetailsRequestPayload
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CASH_MEMO
      );

      expect(action.payload).toEqual(cashMemoItemDetailsRequestPayload);
    });
    it('should check correct type is used for PartialUpdateIteminCashMemoSuccess action ', () => {
      const action = new productActions.PartialUpdateIteminCashMemoSuccess([
        cashMemoItemDetailsResponse
      ]);

      expect(action.type).toEqual(
        productActions.ProductActionTypes
          .PARTIAL_UPDATE_ITEM_IN_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual([cashMemoItemDetailsResponse]);
    });
    it('should check correct type is used for PartialUpdateIteminCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.PartialUpdateIteminCashMemoFailure({
        error: payload,
        oldData: cashMemoItemDetailsResponse
      });

      expect(action.type).toEqual(
        productActions.ProductActionTypes
          .PARTIAL_UPDATE_ITEM_IN_CASH_MEMO_FAILURE
      );
      expect(action.payload.error).toEqual(payload);
      expect(action.payload.oldData).toEqual(cashMemoItemDetailsResponse);
    });
  });

  describe('UpdateIteminCashMemo Action Test Cases', () => {
    it('should check correct type is used for UpdateIteminCashMemo  action ', () => {
      const action = new productActions.UpdateIteminCashMemo(
        cashMemoItemDetailsRequestPayload
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.UPDATE_ITEM_IN_CASH_MEMO
      );

      expect(action.payload).toEqual(cashMemoItemDetailsRequestPayload);
    });
    it('should check correct type is used for UpdateIteminCashMemoSuccess action ', () => {
      const action = new productActions.UpdateIteminCashMemoSuccess([
        cashMemoItemDetailsResponse
      ]);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.UPDATE_ITEM_IN_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual([cashMemoItemDetailsResponse]);
    });
    it('should check correct type is used for UpdateIteminCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.UpdateIteminCashMemoFailure({
        error: payload,
        oldData: cashMemoItemDetailsResponse
      });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.UPDATE_ITEM_IN_CASH_MEMO_FAILURE
      );
      expect(action.payload.error).toEqual(payload);
      expect(action.payload.oldData).toEqual(cashMemoItemDetailsResponse);
    });
  });

  describe('DeleteItemfromCashMemo Action Test Cases', () => {
    it('should check correct type is used for  DeleteItemfromCashMemo  action ', () => {
      const action = new productActions.DeleteItemfromCashMemo(
        cashMemoItemDetailsRequestPayload
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.DELETE_ITEM_FROM_CASH_MEMO
      );

      expect(action.payload).toEqual(cashMemoItemDetailsRequestPayload);
    });
    it('should check correct type is used for DeleteItemfromCashMemoSuccess action ', () => {
      const action = new productActions.DeleteItemfromCashMemoSuccess({
        itemId: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
        data: cashMemoItemDetailsResponse,
        itemDetails: null
      });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.DELETE_ITEM_FROM_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual({
        itemId: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
        data: cashMemoItemDetailsResponse,
        itemDetails: null
      });
    });
    it('should check correct type is used for DeleteItemfromCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.DeleteItemfromCashMemoFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.DELETE_ITEM_FROM_CASH_MEMO_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ValidateItem Action Test Cases', () => {
    it('should check correct type is used for  ValidateItem  action ', () => {
      const action = new productActions.ValidateItem(validateItemPayload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.VALIDATE_ITEM
      );

      expect(action.payload).toEqual(validateItemPayload);
    });
    it('should check correct type is used for ValidateItemSuccess action ', () => {
      const action = new productActions.ValidateItemSuccess({
        itemId: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
        isSuccess: true
      });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.VALIDATE_ITEM_SUCCESS
      );
      expect(action.payload).toEqual({
        itemId: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
        isSuccess: true
      });
    });
    it('should check correct type is used for ValidateItemFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.ValidateItemFailure({
        itemId: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
        error: payload
      });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.VALIDATE_ITEM_FAILURE
      );
      expect(action.payload).toEqual({
        itemId: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
        error: payload
      });
    });
  });

  describe('LoadCoinDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadCoinDetails  action ', () => {
      const action = new productActions.LoadCoinDetails({
        itemCode: '600107ZAARAS00',
        withSaleableCheck: false
      });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_COIN_DETAILS
      );

      expect(action.payload).toEqual({
        itemCode: '600107ZAARAS00',
        withSaleableCheck: false
      });
    });
    it('should check correct type is used for LoadCoinDetailsSuccess action ', () => {
      const action = new productActions.LoadCoinDetailsSuccess({
        itemCode: '600107ZAARAS00',
        coinDetails: [coinDetails]
      });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_COIN_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual({
        itemCode: '600107ZAARAS00',
        coinDetails: [coinDetails]
      });
    });
    it('should check correct type is used for LoadCoinDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.LoadCoinDetailsFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_COIN_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadValidCoinDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadValidCoinDetails  action ', () => {
      const action = new productActions.LoadValidCoinDetails({
        itemCode: '600107ZAARAS00',
        withSaleableCheck: false
      });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_VALID_COIN_DETAILS
      );

      expect(action.payload).toEqual({
        itemCode: '600107ZAARAS00',
        withSaleableCheck: false
      });
    });
    it('should check correct type is used for LoadValidCoinDetailsSuccess action ', () => {
      const action = new productActions.LoadValidCoinDetailsSuccess({
        itemCode: '600107ZAARAS00',
        coinDetails: [coinDetails]
      });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_VALID_COIN_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual({
        itemCode: '600107ZAARAS00',
        coinDetails: [coinDetails]
      });
    });
    it('should check correct type is used for LoadValidCoinDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.LoadValidCoinDetailsFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_VALID_COIN_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadPriceDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadPriceDetails  action ', () => {
      const action = new productActions.LoadPriceDetails(
        validateProductAndPriceDetailsPayload
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_PRICE_DETAILS
      );

      expect(action.payload).toEqual(validateProductAndPriceDetailsPayload);
    });
    it('should check correct type is used for LoadPriceDetailsSuccess action ', () => {
      const action = new productActions.LoadPriceDetailsSuccess(
        productPriceDetails
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_PRICE_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(productPriceDetails);
    });
    it('should check correct type is used for LoadPriceDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.LoadPriceDetailsFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_PRICE_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('GetItemDetails Action Test Cases', () => {
    it('should check correct type is used for  GetItemDetails  action ', () => {
      const action = new productActions.GetItemDetails(
        cashMemoItemDetailsRequestPayload
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.GET_ITEM_DETAILS
      );

      expect(action.payload).toEqual(cashMemoItemDetailsRequestPayload);
    });
    it('should check correct type is used for GetItemDetailsSuccess action ', () => {
      const action = new productActions.GetItemDetailsSuccess([
        cashMemoItemDetailsResponse
      ]);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.GET_ITEM_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual([cashMemoItemDetailsResponse]);
    });
    it('should check correct type is used for GetItemDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.GetItemDetailsFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.GET_ITEM_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('DeleteItemDetails Action Test Cases', () => {
    it('should check correct type is used for  DeleteItemDetails  action ', () => {
      const action = new productActions.DeleteItemDetails(
        cashMemoItemDetailsRequestPayload
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.DELETE_ITEM_DETAILS
      );

      expect(action.payload).toEqual(cashMemoItemDetailsRequestPayload);
    });
    it('should check correct type is used for DeleteItemDetailsSuccess action ', () => {
      const action = new productActions.DeleteItemDetailsSuccess({
        itemId: 'F69D838B-7A96-4FDD-9BB6-704CB3FFA0A0',
        data: cashMemoItemDetailsResponse,
        itemDetails: null
      });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.DELETE_ITEM_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual({
        itemId: 'F69D838B-7A96-4FDD-9BB6-704CB3FFA0A0',
        data: cashMemoItemDetailsResponse,
        itemDetails: null
      });
    });
    it('should check correct type is used for DeleteItemDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.DeleteItemDetailsFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.DELETE_ITEM_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadCreditNoteDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadCreditNoteDetails  action ', () => {
      const action = new productActions.LoadCreditNoteDetails(
        cNDetailsRequestPayload
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_CREDIT_NOTE_DETAILS
      );

      expect(action.payload).toEqual(cNDetailsRequestPayload);
    });
    it('should check correct type is used for LoadCreditNoteDetailsSuccess action ', () => {
      const action = new productActions.LoadCreditNoteDetailsSuccess([
        cNDetailsResponsePayload
      ]);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_CREDIT_NOTE_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual([cNDetailsResponsePayload]);
    });
    it('should check correct type is used for LoadCreditNoteDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new productActions.LoadCreditNoteDetailsFailure(payload);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_CREDIT_NOTE_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Other LoadAction Test Cases', () => {
    it('should check correct type is used for  LoadSelectedLotNumberDetails action ', () => {
      const action = new productActions.LoadSelectedLotNumberDetails(
        'E4CAC29B-F951-4D20-A9C9-C9572C72FE96'
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_SELECTED_LOTNUMBER_DETAILS
      );
      expect(action.payload).toEqual('E4CAC29B-F951-4D20-A9C9-C9572C72FE96');
    });

    it('should check correct type is used for  LoadSelectedItemDetails action ', () => {
      const action = new productActions.LoadSelectedItemDetails(
        'E4CAC29B-F951-4D20-A9C9-C9572C72FE96'
      );

      expect(action.type).toEqual(
        productActions.ProductActionTypes.LOAD_SELECTED_ITEM_DETAILS
      );
      expect(action.payload).toEqual('E4CAC29B-F951-4D20-A9C9-C9572C72FE96');
    });
  });

  describe('Other GetSetAction Test Cases', () => {
    it('should check correct type is used for  SetGridSearchEnable action ', () => {
      const action = new productActions.SetGridSearchEnable(true);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.SET_GRID_SEARCH_ENABLE
      );
      expect(action.payload).toEqual(true);
    });

    it('should check correct type is used for  GetGridSearchEnable action ', () => {
      const action = new productActions.GetGridSearchEnable(true);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.GET_GRID_SEARCH_ENABLE
      );
      expect(action.payload).toEqual(true);
    });

    it('should check correct type is used for  SetStandardPrice action ', () => {
      const action = new productActions.SetStandardPrice({ price: 5000 });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.SET_STANDARD_PRICE
      );
      expect(action.payload).toEqual({ price: 5000 });
    });

    it('should check correct type is used for  GetStandardPrice action ', () => {
      const action = new productActions.GetStandardPrice({ price: 5000 });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.GET_STANDARD_PRICE
      );
      expect(action.payload).toEqual({ price: 5000 });
    });

    it('should check correct type is used for  SetMetalRate action ', () => {
      const action = new productActions.SetMetalRate({ price: 5000 });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.SET_METAL_RATE
      );
      expect(action.payload).toEqual({ price: 5000 });
    });

    it('should check correct type is used for  GetMetalRate action ', () => {
      const action = new productActions.GetMetalRate({ price: 5000 });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.GET_METAL_RATE
      );
      expect(action.payload).toEqual({ price: 5000 });
    });

    it('should check correct type is used for  SetCreateOrder action ', () => {
      const action = new productActions.SetCreateOrder(false);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.SET_CREATE_ORDER
      );
      expect(action.payload).toEqual(false);
    });

    it('should check correct type is used for  GetCreateOrder action ', () => {
      const action = new productActions.GetCreateOrder(false);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.GET_CREATE_ORDER
      );
      expect(action.payload).toEqual(false);
    });

    it('should check correct type is used for  SetItemIDList action ', () => {
      const action = new productActions.SetItemIDList({
        item: cashMemoDetailsResponse,
        isUpdate: true
      });

      expect(action.type).toEqual(
        productActions.ProductActionTypes.SET_ITEMID_LIST
      );
      expect(action.payload).toEqual({
        item: cashMemoDetailsResponse,
        isUpdate: true
      });
    });

    it('should check correct type is used for  GetItemIDList action ', () => {
      const action = new productActions.GetItemIDList();

      expect(action.type).toEqual(
        productActions.ProductActionTypes.GET_ITEMID_LIST
      );
    });

    it('should check correct type is used for  SetDiscountSelected action ', () => {
      const action = new productActions.SetDiscountSelected(false);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.SET_DISCOUNT_SELECTED
      );
      expect(action.payload).toEqual(false);
    });

    it('should check correct type is used for  SetABInvokedFirstTime action ', () => {
      const action = new productActions.SetABInvokedFirstTime(false);

      expect(action.type).toEqual(
        productActions.ProductActionTypes.SET_AB_INVOKED_FIRST_TIME
      );
      expect(action.payload).toEqual(false);
    });

    it('should check correct type is used for  SetItemDetailsOperation action ', () => {
      const action = new productActions.SetItemDetailsOperation('LOT');

      expect(action.type).toEqual(
        productActions.ProductActionTypes.SET_ITEM_DETAILS_OPERATION
      );
      expect(action.payload).toEqual('LOT');
    });
  });

  describe('ResetAction Test Cases', () => {
    it('should check correct type is used for  ResetItemIdValues action ', () => {
      const action = new productActions.ResetItemIdValues();

      expect(action.type).toEqual(
        productActions.ProductActionTypes.RESET_ITEMID_VALUES
      );
    });

    it('should check correct type is used for  ResetValues action ', () => {
      const action = new productActions.ResetValues();

      expect(action.type).toEqual(
        productActions.ProductActionTypes.RESET_VALUES
      );
    });

    it('should check correct type is used for  ResetLotNumberValues action ', () => {
      const action = new productActions.ResetLotNumberValues();

      expect(action.type).toEqual(
        productActions.ProductActionTypes.RESET_LOTNUMBER_VALUES
      );
    });

    it('should check correct type is used for  ResetProductValues action ', () => {
      const action = new productActions.ResetProductValues();

      expect(action.type).toEqual(
        productActions.ProductActionTypes.RESET_PRODUCT_VALUES
      );
    });

    it('should check correct type is used for  ResetCoinValues action ', () => {
      const action = new productActions.ResetCoinValues();

      expect(action.type).toEqual(
        productActions.ProductActionTypes.RESET_COIN_VALUES
      );
    });

    it('should check correct type is used for  ResetItemIdList action ', () => {
      const action = new productActions.ResetItemIdList();

      expect(action.type).toEqual(
        productActions.ProductActionTypes.RESET_ITEMID_LIST
      );
    });

    it('should check correct type is used for  ClearSearchProductList action ', () => {
      const action = new productActions.ClearSearchProductList();

      expect(action.type).toEqual(
        productActions.ProductActionTypes.CLEAR_SEARCH_PRODUCT_LIST
      );
    });

    it('should check correct type is used for  ClearProductList action ', () => {
      const action = new productActions.ClearProductList();

      expect(action.type).toEqual(
        productActions.ProductActionTypes.CLEAR_PRODUCT_LIST
      );
    });

    it('should check correct type is used for  ClearProductRelatedDetails action ', () => {
      const action = new productActions.ClearProductRelatedDetails();

      expect(action.type).toEqual(
        productActions.ProductActionTypes.CLEAR_PRODUCT_RELATED_DETAILS
      );
    });

    it('should check correct type is used for  ClearValidateItem action ', () => {
      const action = new productActions.ClearValidateItem();

      expect(action.type).toEqual(
        productActions.ProductActionTypes.CLEAR_VALIDATE_ITEM
      );
    });

    it('should check correct type is used for  ClearProductGrid action ', () => {
      const action = new productActions.ClearProductGrid();

      expect(action.type).toEqual(
        productActions.ProductActionTypes.CLEAR_PRODUCT_GRID
      );
    });
  });
});
