import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  CashMemoDetailsResponse,
  CashMemoItemDetailsRequestPayload,
  CashMemoItemDetailsResponse,
  CashMemoTaxDetails,
  CNDetailsRequestPayload,
  CNDetailsResponsePayload,
  CoinDetails,
  ProductDetails,
  ProductPriceDetails,
  SearchProductList,
  StatusTypesEnum,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  ValidateProductAndPriceDetailsPayload
} from '@poss-web/shared/models';
import {
  CashMemoAdaptor,
  CashMemoHelper,
  DiscountHelper
} from '@poss-web/shared/util-adaptors';
import {
  getAdvanceBoookingCMItemEndPointUrl,
  getAdvanceBoookingItemEndPointUrl,
  getCashMemoItemEndPointUrl,
  getCnRequestListByCnTypeUrl,
  getCoinDetailsEndPointUrl,
  getPriceDetailsEndPointUrl,
  getProductDetailsEndPointUrl,
  getSearchProductEndPointUrl,
  getTaxDetailsEndPointUrl,
  getTEPSearchProductEndPointUrl,
  getValidateProductDetailsEndPointUrl
} from '@poss-web/shared/util-api-service';
import {
  POSS_WEB_API_URL,
  POSS_WEB_COIN_PRODUCT_GROUP_CODE
} from '@poss-web/shared/util-config';
import * as moment from 'moment';
import { ProductService } from './product.service';
describe('ProductService ', () => {
  let httpTestingController: HttpTestingController;
  let productService: ProductService;
  const apiUrl = 'http://localhost:3000';

  const dummyProductDetails: ProductDetails = {
    binCode: 'ZEROBIN',
    binGroupCode: 'STN',
    imageUrl: '/productcatalogue/ProductImages/1107CSI.jpg',
    inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
    itemCode: '511107CSIMAA00',
    itemDescription: '22KT - 1107CSI - CHAIN',
    karatage: 22,
    lotNumber: '2JA005700',
    productCategoryCode: 'C',
    productCategoryDescription: 'CHAIN',
    productGroupCode: '73',
    productGroupDescription: 'Gold Plain',
    stdValue: 28215.28,
    stdWeight: 8.854,
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
  let dummyValidateProductAndPriceDetailsPayload: ValidateProductAndPriceDetailsPayload = {
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
    productDetails: dummyProductDetails,
    availableLotNumbers: [
      {
        lotNumber: '2JA005700',
        inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96'
      }
    ],
    isABInvoked: false
  };
  const dummyProductPriceDetails: ProductPriceDetails = {
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
    productGroupCode: '73',
    productGroupDesc: 'Gold Plain',
    stdWeight: 8.854,
    ignoreUcpRecalculate: false
  };
  const dummCashMemoTaxDetails: CashMemoTaxDetails = {
    taxType: 'ITEMCHARGES',
    taxClass: 'TC72',
    data: { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 437.42 },
    cess: null
  };
  const dummyCoinDetails: CoinDetails = {
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
      taxDetails: dummCashMemoTaxDetails,
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
    taxDetails: dummCashMemoTaxDetails,
    totalDiscount: 0,
    totalQuantity: 2,
    totalTax: 2137.96,
    totalValue: 77188.31,
    totalWeight: 18.854,
    txnType: 'CM',
    hallmarkDiscount: 0,
    hallmarkCharges: 120,
    isFrozenAmount: 0
    // weightUnit: 'gms'
  };
  const cashMemoDetailsResponse: CashMemoDetailsResponse = {
    customerId: 721,
    metalRateList: {},
    finalValue: 721,
    occasion: '',
    otherChargesList: {},
    paidValue: 721,
    discountDetails: {},
    focDetails: {},
    refTxnId: '',
    refTxnType: '',
    refSubTxnType: '',
    remarks: '',
    taxDetails: dummCashMemoTaxDetails,
    totalDiscount: 721,
    totalQuantity: 721,
    totalTax: 721,
    totalValue: 721,
    totalWeight: 721,
    docNo: 721,
    firstHoldTime: moment(),
    fiscalYear: 721,
    id: '',
    lastHoldTime: moment(),
    roundingVariance: 721,
    status: StatusTypesEnum.APPROVED,
    itemIdList: [],
    txnType: '',
    orderWeightDetails: {
      type: '',
      data: {}
    },
    subTxnType: '',
    manualBillDetails: {
      approvedBy: '',
      manualBillDate: 1624300200000,
      manualBillNo: '',
      manualBillValue: 321,
      metalRates: {},
      password: '',
      remarks: '',
      validationType: '',
      requestNo: 321,
      frozenRateDate: 1624300200000,
      isFrozenRate: false,
      performedBy: '',
      processId: '',
      requestStatus: ''
    },
    docDate: moment(),
    employeeCode: '',
    txnTime: moment(),
    cndocNos: [712],
    customerDocDetails: '',
    hallmarkCharges: 120,
    hallmarkDiscount: 0,
    cancelTxnId: 2,
    refDocNo: 1,
    refFiscalYear: 2022
  };
  let cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
    txnType: 'CM',
    subTxnType: 'NEW_CM',
    id: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
    itemId: '115903ADUE',
    headerData: cashMemoDetailsResponse,
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
    productDetails: dummyProductDetails,
    availableLotNumbers: [
      {
        lotNumber: '2JA005700',
        inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96'
      }
    ]
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
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        },
        {
          provide: POSS_WEB_COIN_PRODUCT_GROUP_CODE,
          useValue: '73'
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    productService = TestBed.inject(ProductService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('getSearchProductList - If', () => {
    const dummySearchProductListResponse: SearchProductList = {
      itemCode: 'AAABBBCCCDDD71',
      totalQuantity: 1,
      productGroupCode: '73'
    };

    it('Search : should call POST api method with correct url and params', () => {
      spyOn(CashMemoHelper, 'getTEPSearchedProductList').and.returnValue({});
      const searchValue = 'XXXX00022';
      const type = 'TEP';
      const path = getTEPSearchProductEndPointUrl().path;
      productService.getSearchProductList(searchValue, type).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call stocks helper method with correct arguments', () => {
      spyOn(CashMemoHelper, 'getTEPSearchedProductList').and.returnValue({});
      const searchValue = 'XXXX00022';
      const type = 'TEP';

      const path = getTEPSearchProductEndPointUrl().path;
      productService.getSearchProductList(searchValue, type).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush([dummySearchProductListResponse]);
      expect(CashMemoHelper.getTEPSearchedProductList).toHaveBeenCalledWith([
        dummySearchProductListResponse
      ]);
    });

    it('should return data mapped by CashMemoHelper', () => {
      spyOn(CashMemoHelper, 'getTEPSearchedProductList').and.returnValue([
        dummySearchProductListResponse
      ]);

      const searchValue = 'XXXX00022';
      const type = 'TEP';
      const path = getTEPSearchProductEndPointUrl().path;
      productService.getSearchProductList(searchValue, type).subscribe(res => {
        expect(res).toEqual([dummySearchProductListResponse]);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
  describe('getSearchProductList - Else', () => {
    const dummySearchProductListResponse: SearchProductList = {
      itemCode: 'AAABBBCCCDDD71',
      totalQuantity: 1,
      productGroupCode: '73'
    };

    it('Search : should call GET api method with correct url and params', () => {
      spyOn(CashMemoHelper, 'getSearchedProductList').and.returnValue({});
      const searchValue = 'XXXX00022';
      const type = 'CM';
      const path = getSearchProductEndPointUrl(searchValue).path;
      productService.getSearchProductList(searchValue, type).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.get('itemCode').toString()).toEqual(
        searchValue
      );
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call stocks helper method with correct arguments', () => {
      spyOn(CashMemoHelper, 'getSearchedProductList').and.returnValue({});
      const searchValue = 'XXXX00022';
      const type = 'CM';

      const path = getSearchProductEndPointUrl(searchValue).path;
      productService.getSearchProductList(searchValue, type).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush([dummySearchProductListResponse]);
      expect(CashMemoHelper.getSearchedProductList).toHaveBeenCalledWith([
        dummySearchProductListResponse
      ]);
    });

    it('should return data mapped by CashMemoHelper', () => {
      spyOn(CashMemoHelper, 'getSearchedProductList').and.returnValue([
        dummySearchProductListResponse
      ]);

      const searchValue = 'XXXX00022';
      const type = 'CM';
      const path = getSearchProductEndPointUrl(searchValue).path;
      productService.getSearchProductList(searchValue, type).subscribe(res => {
        expect(res).toEqual([dummySearchProductListResponse]);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
  describe('getProductDetails', () => {
    const itemCode = 'AAAA';
    const lotNumber = 'BBBB';
    it('should call GET api method with correct url and params', () => {
      spyOn(CashMemoAdaptor, 'getProductDetails').and.returnValue({});
      const url = getProductDetailsEndPointUrl(itemCode, lotNumber);
      productService.getProductDetails(itemCode, lotNumber).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    it('should call CashMemoAdaptor getProductDetails method with correct  parameters', () => {
      spyOn(CashMemoAdaptor, 'getProductDetails').and.returnValue({});
      const url = getProductDetailsEndPointUrl(itemCode, lotNumber);
      productService.getProductDetails(itemCode, lotNumber).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush([dummyProductDetails]);
      expect(CashMemoAdaptor.getProductDetails).toHaveBeenCalledWith([
        dummyProductDetails
      ]);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CashMemoAdaptor, 'getProductDetails').and.returnValue([
        dummyProductDetails
      ]);
      const url = getProductDetailsEndPointUrl(itemCode, lotNumber);
      productService.getProductDetails(itemCode, lotNumber).subscribe(data => {
        expect(data).toEqual([dummyProductDetails]);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush({});
    });
  });

  describe('validateProductAndPriceDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CashMemoAdaptor, 'priceDetailsFromJson').and.returnValue(
        dummyProductPriceDetails
      );
      const url1 = getValidateProductDetailsEndPointUrl(
        dummyValidateProductAndPriceDetailsPayload.inventoryId,
        null
      );
      const url2 = getPriceDetailsEndPointUrl();
      productService
        .validateProductAndPriceDetails(
          dummyValidateProductAndPriceDetailsPayload.inventoryId,
          dummyValidateProductAndPriceDetailsPayload.orderPriceRequest,
          dummyValidateProductAndPriceDetailsPayload.productDetails,
          dummyValidateProductAndPriceDetailsPayload.availableLotNumbers,
          dummyValidateProductAndPriceDetailsPayload.txnDetails,
          dummyValidateProductAndPriceDetailsPayload.isABInvoked
        )
        .subscribe();
      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1.path;
      });
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('GET');
      expect(request1.request.responseType).toEqual('json');
      expect(request1.request.params.get('inventoryId').toString()).toEqual(
        dummyValidateProductAndPriceDetailsPayload.inventoryId
      );
      request1.flush({});

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2;
      });
      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('POST');
      expect(request2.request.responseType).toEqual('json');
      request2.flush({});
    });
  });
  describe('getTaxDetails', () => {
    const itemCode = 'AAAA';
    const customerId = 71;
    const txnType = 'CM';
    it('should call GET api method with correct url and params', () => {
      spyOn(CashMemoAdaptor, 'taxDetails').and.returnValue({});
      const url = getTaxDetailsEndPointUrl(customerId, itemCode, txnType);
      productService.getTaxDetails(customerId, itemCode, txnType).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    it('should call CashMemoAdaptor getTaxDetails method with correct  parameters', () => {
      spyOn(CashMemoAdaptor, 'taxDetails').and.returnValue({});
      const url = getTaxDetailsEndPointUrl(customerId, itemCode, txnType);
      productService.getTaxDetails(customerId, itemCode, txnType).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(dummCashMemoTaxDetails);
      expect(CashMemoAdaptor.taxDetails).toHaveBeenCalledWith(
        dummCashMemoTaxDetails
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CashMemoAdaptor, 'taxDetails').and.returnValue(
        dummCashMemoTaxDetails
      );
      const url = getTaxDetailsEndPointUrl(customerId, itemCode, txnType);
      productService
        .getTaxDetails(customerId, itemCode, txnType)
        .subscribe(data => {
          expect(data).toEqual(dummCashMemoTaxDetails);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush({});
    });
  });
  describe('addItemToCashMemo - CM', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CashMemoHelper, 'getCashMemoItemDetails').and.returnValue({});
      const url = getCashMemoItemEndPointUrl(
        cashMemoItemDetailsRequestPayload.id,
        cashMemoItemDetailsRequestPayload.txnType,
        cashMemoItemDetailsRequestPayload.subTxnType
      );
      productService
        .addItemToCashMemo(
          cashMemoItemDetailsRequestPayload.id,
          cashMemoItemDetailsRequestPayload.itemDetails,
          cashMemoItemDetailsRequestPayload.availableLotNumbers,
          cashMemoItemDetailsRequestPayload.productDetails,
          cashMemoItemDetailsRequestPayload.txnType,
          cashMemoItemDetailsRequestPayload.subTxnType
        )
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    // it('should call CashMemoHelper addItemToCashMemo method with correct  parameters', () => {
    //   spyOn(CashMemoHelper, 'getCashMemoItemDetails').and.returnValue({});
    //   const url = getCashMemoItemEndPointUrl(
    //     cashMemoItemDetailsRequestPayload.id,
    //     cashMemoItemDetailsRequestPayload.txnType,
    //     cashMemoItemDetailsRequestPayload.subTxnType
    //   );
    //   productService
    //     .addItemToCashMemo(
    //       cashMemoItemDetailsRequestPayload.id,
    //       cashMemoItemDetailsRequestPayload.itemDetails,
    //       cashMemoItemDetailsRequestPayload.availableLotNumbers,
    //       cashMemoItemDetailsRequestPayload.productDetails,
    //       cashMemoItemDetailsRequestPayload.txnType,
    //       cashMemoItemDetailsRequestPayload.subTxnType
    //     )
    //     .subscribe();
    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + url.path;
    //   });
    //   request.flush([cashMemoItemDetailsResponse]);
    //   expect(CashMemoHelper.getCashMemoItemDetails).toHaveBeenCalledWith(
    //     [cashMemoItemDetailsResponse],
    //     cashMemoItemDetailsRequestPayload.availableLotNumbers,
    //     cashMemoItemDetailsRequestPayload.productDetails
    //   );
    // });

    it('should return data mapped by adaptors', () => {
      spyOn(CashMemoHelper, 'getCashMemoItemDetails').and.returnValue([
        cashMemoItemDetailsResponse
      ]);
      const url = getCashMemoItemEndPointUrl(
        cashMemoItemDetailsRequestPayload.id,
        cashMemoItemDetailsRequestPayload.txnType,
        cashMemoItemDetailsRequestPayload.subTxnType
      );
      productService
        .addItemToCashMemo(
          cashMemoItemDetailsRequestPayload.id,
          cashMemoItemDetailsRequestPayload.itemDetails,
          cashMemoItemDetailsRequestPayload.availableLotNumbers,
          cashMemoItemDetailsRequestPayload.productDetails,
          cashMemoItemDetailsRequestPayload.txnType,
          cashMemoItemDetailsRequestPayload.subTxnType
        )
        .subscribe(data => {
          expect(data).toEqual([cashMemoItemDetailsResponse]);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush({});
    });
  });
  describe('addItemToCashMemo - AB', () => {
    const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
      txnType: 'AB',
      subTxnType: 'NEW_AB',
      id: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
      itemId: '115903ADUE',
      headerData: cashMemoDetailsResponse,
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
      productDetails: dummyProductDetails,
      availableLotNumbers: [
        {
          lotNumber: '2JA005700',
          inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96'
        }
      ]
    };

    it('should call GET api method with correct url and params', () => {
      spyOn(CashMemoHelper, 'getCashMemoItemDetails').and.returnValue({});
      const url = getAdvanceBoookingItemEndPointUrl(
        cashMemoItemDetailsRequestPayload.id,
        cashMemoItemDetailsRequestPayload.txnType,
        cashMemoItemDetailsRequestPayload.subTxnType
      );
      productService
        .addItemToCashMemo(
          cashMemoItemDetailsRequestPayload.id,
          cashMemoItemDetailsRequestPayload.itemDetails,
          cashMemoItemDetailsRequestPayload.availableLotNumbers,
          cashMemoItemDetailsRequestPayload.productDetails,
          cashMemoItemDetailsRequestPayload.txnType,
          cashMemoItemDetailsRequestPayload.subTxnType
        )
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    // it('should call CashMemoHelper addItemToCashMemo method with correct  parameters', () => {
    //   spyOn(CashMemoHelper, 'getCashMemoItemDetails').and.returnValue({});
    //   const url = getCashMemoItemEndPointUrl(
    //     cashMemoItemDetailsRequestPayload.id,
    //     cashMemoItemDetailsRequestPayload.txnType,
    //     cashMemoItemDetailsRequestPayload.subTxnType
    //   );
    //   productService
    //     .addItemToCashMemo(
    //       cashMemoItemDetailsRequestPayload.id,
    //       cashMemoItemDetailsRequestPayload.itemDetails,
    //       cashMemoItemDetailsRequestPayload.availableLotNumbers,
    //       cashMemoItemDetailsRequestPayload.productDetails,
    //       cashMemoItemDetailsRequestPayload.txnType,
    //       cashMemoItemDetailsRequestPayload.subTxnType
    //     )
    //     .subscribe();
    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + url.path;
    //   });
    //   request.flush([cashMemoItemDetailsResponse]);
    //   expect(CashMemoHelper.getCashMemoItemDetails).toHaveBeenCalledWith(
    //     [cashMemoItemDetailsResponse],
    //     cashMemoItemDetailsRequestPayload.availableLotNumbers,
    //     cashMemoItemDetailsRequestPayload.productDetails
    //   );
    // });

    it('should return data mapped by adaptors', () => {
      spyOn(CashMemoHelper, 'getCashMemoItemDetails').and.returnValue([
        cashMemoItemDetailsResponse
      ]);
      const url = getAdvanceBoookingItemEndPointUrl(
        cashMemoItemDetailsRequestPayload.id,
        cashMemoItemDetailsRequestPayload.txnType,
        cashMemoItemDetailsRequestPayload.subTxnType
      );
      productService
        .addItemToCashMemo(
          cashMemoItemDetailsRequestPayload.id,
          cashMemoItemDetailsRequestPayload.itemDetails,
          cashMemoItemDetailsRequestPayload.availableLotNumbers,
          cashMemoItemDetailsRequestPayload.productDetails,
          cashMemoItemDetailsRequestPayload.txnType,
          cashMemoItemDetailsRequestPayload.subTxnType
        )
        .subscribe(data => {
          expect(data).toEqual([cashMemoItemDetailsResponse]);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush({});
    });
  });
  describe('getItemFromCashMemo', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CashMemoHelper, 'getViewCashMemoItemDetails').and.returnValue({});
      spyOn(DiscountHelper, 'getDiscountsResponses').and.returnValue({});
      //   const url1 = getCashMemoItemEndPointUrl(
      //     cashMemoItemDetailsRequestPayload.id,
      //     cashMemoItemDetailsRequestPayload.txnType,
      //     cashMemoItemDetailsRequestPayload.subTxnType,
      //     cashMemoItemDetailsRequestPayload.itemId
      //   );
      //   productService
      //     .getItemFromCashMemo(
      //       cashMemoItemDetailsRequestPayload.id,
      //       cashMemoItemDetailsRequestPayload.itemId,
      //       cashMemoItemDetailsRequestPayload.headerData,
      //       cashMemoItemDetailsRequestPayload.txnType,
      //       cashMemoItemDetailsRequestPayload.subTxnType
      //     )
      //     .subscribe();
      //   const request1 = httpTestingController.expectOne(req => {
      //     return req.url === apiUrl + url1.path;
      //   });
      //   expect(request1.cancelled).toBeFalsy();
      //   expect(request1.request.method).toEqual('GET');
      //   expect(request1.request.params.get('txnType').toString()).toEqual(
      //     cashMemoItemDetailsRequestPayload.txnType
      //   );
      //   expect(request1.request.params.get('subTxnType').toString()).toEqual(
      //     cashMemoItemDetailsRequestPayload.subTxnType
      //   );
      //   expect(request1.request.url).toEqual(apiUrl + url1.path);
      //   request1.flush({});
      //   // const url2 = getProductDetailsEndPointUrl('21222WER');
      //   // const url2 = getCoinDetailsEndPointUrl('21222WER', true);
      //   // const request2 = httpTestingController.expectOne(req => {
      //   //   return req.url === apiUrl + url2;
      //   // });
      //   // expect(request2.cancelled).toBeFalsy();
      //   // expect(request2.request.method).toEqual('GET');
      //   // expect(request2.request.url).toEqual(apiUrl + url2);
      //   // request2.flush({});
      //   const url3 = getItemLevelDiscountsEndPointUrl(
      //     cashMemoItemDetailsRequestPayload.txnType,
      //     cashMemoItemDetailsRequestPayload.subTxnType,
      //     cashMemoItemDetailsRequestPayload.id,
      //     cashMemoItemDetailsRequestPayload.itemId
      //   );
      //   const request3 = httpTestingController.expectOne(req => {
      //     return req.url === apiUrl + url3.path;
      //   });
      //   expect(request3.cancelled).toBeFalsy();
      //   expect(request3.request.method).toEqual('GET');
      //   expect(request3.request.params.get('txnType').toString()).toEqual(
      //     cashMemoItemDetailsRequestPayload.txnType
      //   );
      //   expect(request3.request.params.get('subTxnType').toString()).toEqual(
      //     cashMemoItemDetailsRequestPayload.subTxnType
      //   );
      //   expect(request3.request.params.get('transactionId').toString()).toEqual(
      //     cashMemoItemDetailsRequestPayload.id
      //   );
      //   expect(request3.request.params.get('itemId').toString()).toEqual(
      //     cashMemoItemDetailsRequestPayload.itemId
      //   );
      //   expect(request3.request.url).toEqual(apiUrl + url3.path);
      //   request3.flush({});
    });
    // it('should call CashMemoHelper addItemToCashMemo method with correct  parameters', () => {
    //   spyOn(CashMemoHelper, 'getViewCashMemoItemDetails').and.returnValue([
    //     cashMemoItemDetailsResponse
    //   ]);
    //   spyOn(DiscountHelper, 'getDiscountsResponses').and.returnValue({});
    //   const coinDetails: CoinDetails = {
    //     // binGroupCode: 'STN',
    //     itemCode: '600107ZAARAS00',
    //     itemDescription: 'TRAD-GANESHA  10G D-22',
    //     karatage: 24,
    //     productCategoryCode: 'Z',
    //     productGroupCode: '73',
    //     stdValue: 60652,
    //     stdWeight: 10,
    //     totalQuantity: 1,
    //     totalWeightDetails: {
    //       type: 'WEIGHT_DETAILS',
    //       data: {
    //         diamondWeight: 0,
    //         goldWeight: 0,
    //         materialWeight: 0,
    //         platinumWeight: 0,
    //         silverWeight: 0,
    //         stoneWeight: 0
    //       }
    //     },
    //     unit: 'gms',
    //     unitWeight: 10
    //   };

    //   const url1 = getCashMemoItemEndPointUrl(
    //     cashMemoItemDetailsRequestPayload.id,
    //     cashMemoItemDetailsRequestPayload.txnType,
    //     cashMemoItemDetailsRequestPayload.subTxnType,
    //     cashMemoItemDetailsRequestPayload.itemId
    //   );
    //   productService
    //     .getItemFromCashMemo(
    //       cashMemoItemDetailsRequestPayload.id,
    //       cashMemoItemDetailsRequestPayload.itemId,
    //       cashMemoItemDetailsRequestPayload.headerData,
    //       cashMemoItemDetailsRequestPayload.txnType,
    //       cashMemoItemDetailsRequestPayload.subTxnType
    //     )
    //     .subscribe();
    //   const request1 = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + url1.path;
    //   });
    //   request1.flush([cashMemoItemDetailsResponse]);
    //   expect(CashMemoHelper.getViewCashMemoItemDetails).toHaveBeenCalledWith(
    //     [cashMemoItemDetailsResponse],
    //     cashMemoItemDetailsRequestPayload.headerData,
    //     coinDetails
    //   );
    //   const url2 = getCoinDetailsEndPointUrl('21222WER', true);
    //   const request2 = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + url2;
    //   });
    // });
    // it('should return data mapped by adaptors', () => {
    //   spyOn(CashMemoHelper, 'getViewCashMemoItemDetails').and.returnValue([
    //     cashMemoItemDetailsResponse
    //   ]);
    //   const url = getCashMemoItemEndPointUrl(
    //     cashMemoItemDetailsRequestPayload.id,
    //     cashMemoItemDetailsRequestPayload.txnType,
    //     cashMemoItemDetailsRequestPayload.subTxnType
    //   );
    //   productService
    //     .getItemFromCashMemo(
    //       cashMemoItemDetailsRequestPayload.id,
    //       cashMemoItemDetailsRequestPayload.itemId,
    //       cashMemoItemDetailsRequestPayload.headerData,
    //       cashMemoItemDetailsRequestPayload.txnType,
    //       cashMemoItemDetailsRequestPayload.subTxnType
    //     )
    //     .subscribe(data => {
    //       expect(data).toEqual([cashMemoItemDetailsResponse]);
    //     });
    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + url.path;
    //   });
    //   request.flush({});
    // });
  });
  describe('partialUpdateItemInCashMemo', () => {});
  describe('updateItemInCashMemo', () => {});
  describe('deleteItemFromCashMemo - IF', () => {
    it('should call DELETE api method with correct url and params', () => {
      const transactionType = TransactionTypeEnum.AB;
      const subTransactionType = SubTransactionTypeEnum.NEW_AB;
      const id = '1234';

      const url = getAdvanceBoookingItemEndPointUrl(
        id,
        transactionType,
        subTransactionType,
        cashMemoItemDetailsRequestPayload.itemId
      );

      productService
        .deleteItemFromCashMemo(
          id,
          cashMemoItemDetailsRequestPayload.itemId,
          transactionType,
          subTransactionType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('DELETE');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
  describe('deleteItemFromCashMemo - ELSE', () => {
    it('should call DELETE api method with correct url and params', () => {
      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const id = '1234';

      const url = getCashMemoItemEndPointUrl(
        id,
        transactionType,
        subTransactionType,
        cashMemoItemDetailsRequestPayload.itemId
      );

      productService
        .deleteItemFromCashMemo(
          id,
          cashMemoItemDetailsRequestPayload.itemId,
          transactionType,
          subTransactionType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('DELETE');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
  describe('deleteItemDetails', () => {
    it('should call DELETE api method with correct url and params', () => {
      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const id = '1234';
      const url = getAdvanceBoookingCMItemEndPointUrl(
        id,
        transactionType,
        subTransactionType,
        cashMemoItemDetailsRequestPayload.itemId,
        cashMemoItemDetailsRequestPayload.cashMemoId
      );

      productService
        .deleteItemDetails(
          id,
          cashMemoItemDetailsRequestPayload.itemId,
          transactionType,
          subTransactionType,
          cashMemoItemDetailsRequestPayload.cashMemoId
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('DELETE');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
  describe('getCoinDetails', () => {
    const itemCode = 'AJSDYSIDU';
    const withSaleableCheck = true;
    it('should call GET api method with correct url and params', () => {
      spyOn(CashMemoHelper, 'getCoinDetails').and.returnValue({});
      const url = getCoinDetailsEndPointUrl(itemCode, withSaleableCheck);
      productService.getCoinDetails(itemCode, withSaleableCheck).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url);
      request.flush({});
    });
    it('should call CashMemoHelper getCoinDetails method with correct  parameters', () => {
      spyOn(CashMemoHelper, 'getCoinDetails').and.returnValue({});
      const url = getCoinDetailsEndPointUrl(itemCode, withSaleableCheck);
      productService.getCoinDetails(itemCode, withSaleableCheck).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush([dummyCoinDetails]);
      expect(CashMemoHelper.getCoinDetails).toHaveBeenCalledWith([
        dummyCoinDetails
      ]);
    });
    it('should return data mapped by adaptors', () => {
      spyOn(CashMemoHelper, 'getCoinDetails').and.returnValue([
        dummyCoinDetails
      ]);
      const url = getCoinDetailsEndPointUrl(itemCode, withSaleableCheck);
      productService
        .getCoinDetails(itemCode, withSaleableCheck)
        .subscribe(data => {
          expect(data).toEqual([dummyCoinDetails]);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    });
  });
  describe('getPriceDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CashMemoAdaptor, 'priceDetailsFromJson').and.returnValue(
        dummyProductPriceDetails
      );

      const url1 = getValidateProductDetailsEndPointUrl(
        null,
        dummyValidateProductAndPriceDetailsPayload.orderPriceRequest.itemCode
      );
      const url2 = getPriceDetailsEndPointUrl();
      productService
        .getPriceDetails(dummyValidateProductAndPriceDetailsPayload)
        .subscribe();
      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1.path;
      });
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('GET');
      expect(request1.request.responseType).toEqual('json');

      request1.flush({});

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2;
      });
      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('POST');
      expect(request2.request.responseType).toEqual('json');
      expect(request1.request.params.get('itemCode').toString()).toEqual(
        dummyValidateProductAndPriceDetailsPayload.orderPriceRequest.itemCode
      );
      request2.flush({});
    });
  });
  describe('getCndetailsByCnType', () => {
    const customerId = 353;
    const cnType = 'ADV';
    const isFrozenRateCnRequired = true;
    it('should call GET api method with correct url and params', () => {
      spyOn(CashMemoHelper, 'getCnDetailsByCnTypeResponse').and.returnValue({});
      const url = getCnRequestListByCnTypeUrl(
        customerId,
        cnType,
        isFrozenRateCnRequired
      );
      productService.getCndetailsByCnType(cNDetailsRequestPayload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    it('should call CashMemoHelper getCnDetailsByCnTypeResponse method with correct  parameters', () => {
      spyOn(CashMemoHelper, 'getCnDetailsByCnTypeResponse').and.returnValue({});
      const url = getCnRequestListByCnTypeUrl(
        customerId,
        cnType,
        isFrozenRateCnRequired
      );
      productService.getCndetailsByCnType(cNDetailsRequestPayload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush([cNDetailsResponsePayload]);
      expect(CashMemoHelper.getCnDetailsByCnTypeResponse).toHaveBeenCalledWith([
        cNDetailsResponsePayload
      ]);
    });
    it('should return data mapped by adaptors', () => {
      spyOn(CashMemoHelper, 'getCnDetailsByCnTypeResponse').and.returnValue([
        cNDetailsResponsePayload
      ]);
      const url = getCnRequestListByCnTypeUrl(
        customerId,
        cnType,
        isFrozenRateCnRequired
      );
      productService
        .getCndetailsByCnType(cNDetailsRequestPayload)
        .subscribe(data => {
          expect(data).toEqual([cNDetailsResponsePayload]);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush({});
    });
  });
});
