import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import { InventoryValidationService } from '@poss-web/shared/common/data-access-common';
import {
  LovDataService,
  StoreUserDataService
} from '@poss-web/shared/masters/data-access-masters';
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
  ProductDetailsPayload,
  ProductPriceDetails,
  RsoDetailsPayload,
  SearchProductList,
  SearchProductPayload,
  StatusTypesEnum,
  StoreUser,
  TaxDetailsPayload,
  ValidateProductAndPriceDetailsPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { cold, hot } from 'jasmine-marbles';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ProductService } from '../product.service';
import {
  AddItemtoCashMemo,
  AddItemtoCashMemoFailure,
  AddItemtoCashMemoSuccess,
  ClearSearchProductList,
  DeleteItemDetails,
  DeleteItemDetailsFailure,
  DeleteItemfromCashMemo,
  DeleteItemfromCashMemoFailure,
  GetItemDetails,
  GetItemDetailsFailure,
  GetItemDetailsSuccess,
  GetItemfromCashMemo,
  GetItemfromCashMemoFailure,
  LoadCoinDetails,
  LoadCoinDetailsFailure,
  LoadCreditNoteDetails,
  LoadCreditNoteDetailsFailure,
  LoadCreditNoteDetailsSuccess,
  LoadPriceDetails,
  LoadPriceDetailsFailure,
  LoadPriceDetailsSuccess,
  LoadProductDetails,
  LoadProductDetailsFailure,
  LoadProductDetailsSuccess,
  LoadReasons,
  LoadReasonsFailure,
  LoadReasonsSuccess,
  LoadRSODetails,
  LoadRSODetailsFailure,
  LoadRSODetailsSuccess,
  LoadTaxDetails,
  LoadTaxDetailsFailure,
  LoadTaxDetailsSuccess,
  LoadValidCoinDetails,
  LoadValidCoinDetailsFailure,
  PartialUpdateIteminCashMemo,
  PartialUpdateIteminCashMemoFailure,
  PartialUpdateIteminCashMemoSuccess,
  SearchProduct,
  SearchProductSuccess,
  UpdateIteminCashMemo,
  UpdateIteminCashMemoFailure,
  UpdateIteminCashMemoSuccess,
  ValidateItem,
  ValidateItemFailure,
  ValidateItemSuccess,
  ValidateProductAndPriceDetails,
  ValidateProductAndPriceDetailsFailure,
  ValidateProductAndPriceDetailsSuccess
} from './product.actions';
import { ProductEffects } from './product.effects';
import { initialState } from './product.reducer';
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
  },
  oldData: null
};
const cashMemoItemDetailsResponse: CashMemoItemDetailsResponse = {
  //   confirmedTime: null,
  // creditNotes: null,
  // currencyCode: "INR",
  // customerDocDetails: null,
  itemId: 'f69d838b-7a96-4fdd-9bb6-704cb3ffa0a0',
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

  itemDetails: null,
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
  hallmarkDiscount: 0,
  hallmarkCharges: 120,
  isFrozenAmount: 0,
  cancelTxnId: 2,
  isRivaah: false,
  refDocNo: 1,
  refFiscalYear: 2022
};
describe('ProductState Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ProductEffects;
  const productServiceSpy = jasmine.createSpyObj<ProductService>([
    'getSearchProductList',
    'getProductDetails',
    'validateProductAndPriceDetails',
    'getTaxDetails',
    'addItemToCashMemo',
    'getItemFromCashMemo',
    'partialUpdateItemInCashMemo',
    'updateItemInCashMemo',
    'deleteItemFromCashMemo',
    'deleteItemDetails',
    'getCoinDetails',
    'getPriceDetails',
    'getCndetailsByCnType'
  ]);

  const storeDataServiceSpy = jasmine.createSpyObj<StoreUserDataService>([
    'getStoreUsers'
  ]);

  const inventoryValidationDataServiceSpy = jasmine.createSpyObj<
    InventoryValidationService
  >(['validateWeightTolerance']);

  const lovDataServiceSpy = jasmine.createSpyObj<LovDataService>([
    'getEngineProductLovs'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },

        {
          provide: ProductService,
          useValue: productServiceSpy
        },
        {
          provide: StoreUserDataService,
          useValue: storeDataServiceSpy
        },
        {
          provide: InventoryValidationService,
          useValue: inventoryValidationDataServiceSpy
        },
        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(ProductEffects);
  });

  describe('LoadProductDetails', () => {
    const response = [productDetails];
    it('should return a stream with LoadProductDetails', () => {
      const action = new LoadProductDetails(productDetailsPayload);
      const outcome = new LoadProductDetailsSuccess(response);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      productServiceSpy.getProductDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadProductDetails(productDetailsPayload);
      const error = new Error('some error');
      const outcome = new LoadProductDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.getProductDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductDetails$).toBeObservable(expected);
    });
  });

  describe('LoadRSODetails', () => {
    const response: StoreUser[] = [
      {
        empName: 'RSO User',
        employeeCode: 'RSO1',
        locationCode: 'CPD',
        mobileNo: '9010462817',
        isLoginActive: true
      }
    ];
    it('should return a stream with LoadRSODetails', () => {
      const action = new LoadRSODetails('RSO');
      const outcome = new LoadRSODetailsSuccess(rsoDetails);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      storeDataServiceSpy.getStoreUsers.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRSODetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadRSODetails('RSO');
      const error = new Error('some error');
      const outcome = new LoadRSODetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      storeDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRSODetails$).toBeObservable(expected);
    });
  });

  describe('ValidateProductAndPriceDetails', () => {
    it('should return a stream with ValidateProductAndPriceDetails', () => {
      const action = new ValidateProductAndPriceDetails(
        validateProductAndPriceDetailsPayload
      );
      const outcome = new ValidateProductAndPriceDetailsSuccess(
        productPriceDetails
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: productPriceDetails });
      productServiceSpy.validateProductAndPriceDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.validateProductAndPriceDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new ValidateProductAndPriceDetails(
        validateProductAndPriceDetailsPayload
      );
      const error = new Error('some error');
      const outcome = new ValidateProductAndPriceDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.validateProductAndPriceDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.validateProductAndPriceDetails$).toBeObservable(expected);
    });
  });

  describe('LoadTaxDetails', () => {
    it('should return a stream with LoadTaxDetails', () => {
      const action = new LoadTaxDetails(taxDetailsPayload);
      const outcome = new LoadTaxDetailsSuccess(cashMemoTaxDetails);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: cashMemoTaxDetails });
      productServiceSpy.getTaxDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTaxDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadTaxDetails(taxDetailsPayload);
      const error = new Error('some error');
      const outcome = new LoadTaxDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.getTaxDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTaxDetails$).toBeObservable(expected);
    });
  });

  describe('AddItemtoCashMemo', () => {
    const response = [cashMemoItemDetailsResponse];
    it('should return a stream with AddItemtoCashMemo', () => {
      const action = new AddItemtoCashMemo(cashMemoItemDetailsRequestPayload);
      const outcome = new AddItemtoCashMemoSuccess(response);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      productServiceSpy.addItemToCashMemo.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.addItemToCashMemo$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new AddItemtoCashMemo(cashMemoItemDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new AddItemtoCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.addItemToCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addItemToCashMemo$).toBeObservable(expected);
    });
  });

  describe('GetItemfromCashMemo', () => {
    const response = [cashMemoItemDetailsResponse];
    // it('should return a stream with GetItemfromCashMemo', () => {
    //   const action = new GetItemfromCashMemo(cashMemoItemDetailsRequestPayload);
    //   const outcome = new GetItemfromCashMemoSuccess(response, true);
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-a|', { a: response });
    //   productServiceSpy.getItemFromCashMemo.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.getItemToCashMemo$).toBeObservable(expected$);
    // });
    it('should fail and return an action with the error', () => {
      const action = new GetItemfromCashMemo(cashMemoItemDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new GetItemfromCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.getItemFromCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getItemToCashMemo$).toBeObservable(expected);
    });
  });

  describe('PartialUpdateIteminCashMemo', () => {
    const response = [cashMemoItemDetailsResponse];

    it('should return a stream with PartialUpdateIteminCashMemo', () => {
      const action = new PartialUpdateIteminCashMemo(
        cashMemoItemDetailsRequestPayload
      );
      const outcome = new PartialUpdateIteminCashMemoSuccess(response);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      productServiceSpy.partialUpdateItemInCashMemo.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.partialUpdateItemInCashMemo$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new PartialUpdateIteminCashMemo(
        cashMemoItemDetailsRequestPayload
      );
      const error = new Error('some error');
      const errorResponse = {
        error: CustomErrorAdaptor.fromJson(error),
        oldData: cashMemoItemDetailsRequestPayload.oldData
      };
      const outcome = new PartialUpdateIteminCashMemoFailure(errorResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.partialUpdateItemInCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.partialUpdateItemInCashMemo$).toBeObservable(expected);
    });
  });

  describe('UpdateIteminCashMemo', () => {
    const response = [cashMemoItemDetailsResponse];
    it('should return a stream with UpdateIteminCashMemo', () => {
      const action = new UpdateIteminCashMemo(
        cashMemoItemDetailsRequestPayload
      );
      const outcome = new UpdateIteminCashMemoSuccess(response);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      productServiceSpy.updateItemInCashMemo.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateItemInCashMemo$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new UpdateIteminCashMemo(
        cashMemoItemDetailsRequestPayload
      );
      const error = new Error('some error');
      const outcome = new UpdateIteminCashMemoFailure({
        error: CustomErrorAdaptor.fromJson(error),
        oldData: cashMemoItemDetailsRequestPayload.oldData
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.updateItemInCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateItemInCashMemo$).toBeObservable(expected);
    });
  });

  describe('DeleteItemfromCashMemo', () => {
    const response = {
      itemId: '123',
      data: cashMemoItemDetailsResponse,
      itemDetails: null
    };
    // it('should return a stream with DeleteItemfromCashMemo', () => {
    //   const action = new DeleteItemfromCashMemo(
    //     cashMemoItemDetailsRequestPayload
    //   );
    //   const outcome = new DeleteItemfromCashMemoSuccess({
    //     itemId: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
    //     data: cashMemoItemDetailsResponse,
    //     itemDetails: null
    //   });
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-a|', { a: cashMemoItemDetailsResponse });
    //   productServiceSpy.deleteItemFromCashMemo.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.deleteItemFromCashMemo$).toBeObservable(expected$);
    // });
    it('should fail and return an action with the error', () => {
      const action = new DeleteItemfromCashMemo(
        cashMemoItemDetailsRequestPayload
      );
      const error = new Error('some error');
      const outcome = new DeleteItemfromCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.deleteItemFromCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.deleteItemFromCashMemo$).toBeObservable(expected);
    });
  });

  describe('ValidateItem', () => {
    const response = {
      itemId: 'f69d838b-7a96-4fdd-9bb6-704cb3ffa0a0',
      isSuccess: true
    };
    it('should return a stream with ValidateItem', () => {
      const action = new ValidateItem(validateItemPayload);
      const outcome = new ValidateItemSuccess(response);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      inventoryValidationDataServiceSpy.validateWeightTolerance.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.validateItem$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new ValidateItem(validateItemPayload);
      const error = new Error('some error');
      const outcome = new ValidateItemFailure({
        itemId: 'f69d838b-7a96-4fdd-9bb6-704cb3ffa0a0',
        error: CustomErrorAdaptor.fromJson(error)
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      inventoryValidationDataServiceSpy.validateWeightTolerance.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.validateItem$).toBeObservable(expected);
    });
  });

  describe('LoadCoinDetails', () => {
    const details = [];
    details.push({
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
    });
    const response = {
      itemCode: 'f69d838b-7a96-4fdd-9bb6-704cb3ffa0a0',
      coinDetails: details
    };
    const payload = {
      itemCode: 'f69d838b-7a96-4fdd-9bb6-704cb3ffa0a0',
      withSaleableCheck: true
    };
    // it('should return a stream with LoadCoinDetails', () => {
    //   const action = new LoadCoinDetails(payload);
    //   const outcome = new LoadCoinDetailsSuccess(response);
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-a|', { a: response });
    //   productServiceSpy.getCoinDetails.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.loadCoinDetails$).toBeObservable(expected$);
    // });
    it('should fail and return an action with the error', () => {
      const action = new LoadCoinDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadCoinDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.getCoinDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCoinDetails$).toBeObservable(expected);
    });
  });

  describe('LoadValidCoinDetails', () => {
    const details = [];
    details.push({
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
    });
    const response = {
      itemCode: 'f69d838b-7a96-4fdd-9bb6-704cb3ffa0a0',
      coinDetails: details
    };
    const payload = {
      itemCode: 'f69d838b-7a96-4fdd-9bb6-704cb3ffa0a0',
      withSaleableCheck: true
    };
    // it('should return a stream with LoadValidCoinDetails', () => {
    //   const action = new LoadValidCoinDetails(payload);
    //   const outcome = new LoadValidCoinDetailsSuccess(response);
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-a|', { a: response });
    //   productServiceSpy.getCoinDetails.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.loadValidCoinDetails$).toBeObservable(expected$);
    // });
    it('should fail and return an action with the error', () => {
      const action = new LoadValidCoinDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadValidCoinDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.getCoinDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadValidCoinDetails$).toBeObservable(expected);
    });
  });

  describe('LoadPriceDetails', () => {
    it('should return a stream with LoadPriceDetails', () => {
      const action = new LoadPriceDetails(
        validateProductAndPriceDetailsPayload
      );
      const outcome = new LoadPriceDetailsSuccess(productPriceDetails);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: productPriceDetails });
      productServiceSpy.getPriceDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPriceDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadPriceDetails(
        validateProductAndPriceDetailsPayload
      );
      const error = new Error('some error');
      const outcome = new LoadPriceDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.getPriceDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPriceDetails$).toBeObservable(expected);
    });
  });

  describe('GetItemDetails', () => {
    const response = [cashMemoItemDetailsResponse];
    it('should return a stream with GetItemDetails', () => {
      const action = new GetItemDetails(cashMemoItemDetailsRequestPayload);
      const outcome = new GetItemDetailsSuccess(response);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      productServiceSpy.getItemFromCashMemo.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.getItemDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new GetItemDetails(cashMemoItemDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new GetItemDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.getItemFromCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getItemDetails$).toBeObservable(expected);
    });
  });

  describe('DeleteItemDetails', () => {
    const response = {
      itemId: 'F69D838B-7A96-4FDD-9BB6-704CB3FFA0A0',
      data: cashMemoItemDetailsResponse,
      itemDetails: null
    };

    // it('should return a stream with DeleteItemDetails', () => {
    //   const action = new DeleteItemDetails(cashMemoItemDetailsRequestPayload);
    //   const outcome = new DeleteItemDetailsSuccess(response);
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-a|', { a: response });
    //   productServiceSpy.deleteItemDetails.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.deleteItemDetails$).toBeObservable(expected$);
    // });
    it('should fail and return an action with the error', () => {
      const action = new DeleteItemDetails(cashMemoItemDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new DeleteItemDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.deleteItemDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.deleteItemDetails$).toBeObservable(expected);
    });
  });

  describe('SearchProduct', () => {
    const response = [searchProductList];
    it('should return a stream with SearchProduct', () => {
      const action = new SearchProduct(searchProductPayload);
      const outcome = new SearchProductSuccess(response);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      productServiceSpy.getSearchProductList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchProduct$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SearchProduct(searchProductPayload);
      const error = new Error('some error');
      const outcome = new ClearSearchProductList();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.getSearchProductList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchProduct$).toBeObservable(expected);
    });
  });

  describe('LoadReasons', () => {
    const lov = [
      {
        code: 'RSO',
        isActive: true,
        value: 'RSO'
      }
    ];
    it('should return a stream with LoadReasons', () => {
      const action = new LoadReasons('RSO');
      const outcome = new LoadReasonsSuccess(['RSO']);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: lov });
      lovDataServiceSpy.getEngineProductLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadReasons$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadReasons('RSO');
      const error = new Error('some error');
      const outcome = new LoadReasonsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataServiceSpy.getEngineProductLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadReasons$).toBeObservable(expected);
    });
  });

  describe('LoadCreditNoteDetails', () => {
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
    it('should return a stream with LoadCreditNoteDetails', () => {
      const action = new LoadCreditNoteDetails(cNDetailsRequestPayload);
      const outcome = new LoadCreditNoteDetailsSuccess([
        cNDetailsResponsePayload
      ]);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: [cNDetailsResponsePayload] });
      productServiceSpy.getCndetailsByCnType.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadCreditNoteDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadCreditNoteDetails(cNDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new LoadCreditNoteDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productServiceSpy.getCndetailsByCnType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadCreditNoteDetails$).toBeObservable(expected);
    });
  });
});
