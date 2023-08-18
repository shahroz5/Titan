import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  AdvanceBookingDetailsResponse,
  CashMemoDetailsRequest,
  CashMemoDetailsRequestPayload,
  CashMemoHistoryResponse,
  CashMemoItemDetails,
  CreateCashMemoResponse,
  FileUploadDownloadPayload,
  StatusTypesEnum,
  TcsDataResponse,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import {
  getCashMemoEndPointUrl,
  getPriceUpdateEndPointUrl,
  getInvokeOrderDetailsEndPointUrl,
  uploadManualBillUrl,
  manualBillListUrl,
  downloadManualBillUrl,
  getTcsDetailUrl,
  getCashMemoHistoryDetailsUrl,
  getCashMemoItemEndPointUrl
} from '@poss-web/shared/util-api-service';
import { CashMemoAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import { CashMemoService } from './cash-memo.service';

const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
  subTxnType: 'MANUAL_CM',
  txnType: 'CM',
  requestDetails: {
    manualBillDetails: {
      approvedBy: 'cashiercpd',
      manualBillDate: '2021-07-06T00:00:00+05:30',
      manualBillNo: '10AQ',
      manualBillValue: 100000,
      metalRates: {
        J: { metalTypeCode: 'J', ratePerUnit: 46934, totalMetalWeight: 10 }
      },
      password: 'MAzmkyR+',
      remarks: 'test'
    },
    validationType: 'PASSWORD_VALIDATION'
  }
};

const cashMemoDetailsRequest: CashMemoDetailsRequest = {
  customerId: 73,
  metalRateList: {
    metalRates: {
      J: {
        metalTypeCode: 'J',
        purity: 91.6666667,
        ratePerUnit: 4956,
        currency: 'INR',
        applicableDate: 1618770600000,
        karat: 22
      }
    }
  },
  finalValue: 14187,
  occasion: 'Wedding/Marriage',
  // otherChargesList: null,
  paidValue: 0,
  remarks: 'commercial',
  totalDiscount: 0,
  totalQuantity: 1,
  totalTax: 675.57,
  totalValue: 13511.27,
  totalWeight: 2.381,
  hallmarkCharges: 100,
  hallmarkDiscount: 0
};

const createCashMemoResponse: CreateCashMemoResponse = {
  id: '3A0E5E55-1830-4392-98E6-94D16766B6B2',
  status: StatusTypesEnum.OPEN,
  docNo: 36,
  subTxnType: 'MANUAL_CM',
  txnType: 'CM',
  manualBillDetails: {
    manualBillDate: 1625509800000,
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

const fileUploadDownloadPayload: FileUploadDownloadPayload = {
  txnType: TransactionTypeEnum.CM,
  id: '3A0E5E55-1830-4392-98E6-94D16766B6B2'
};

const fileDownloadReq = { id: '1234567', locationCode: 'CPD' };

const tcsRequestParam = {
  id: '5000023',
  txnType: 'CM',
  subTxnType: 'NEW_CM'
};

const tcsResponse: TcsDataResponse = {
  tcsToBeCollected: 100,
  tcsCollected: 10,
  tcsEligibleAmount: 1000
};

const cashMemoHistoryDetails: CashMemoHistoryResponse = {
  cashMemoHistoryDetails: [
    {
      createdBy: 'cashiercpd',
      createdDate: 1650881730057,
      customerName: 'SREENIVAS',
      docDate: 1649269800000,
      docNo: 153,
      fiscalYear: 2022,
      id: 'C2563EC3-98E4-4B04-B520-C5198B392190',
      netAmount: 2611,
      status: 'CONFIRMED'
    }
  ],
  totalElements: 1
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

describe('CashMemoService', () => {
  let httpTestingController: HttpTestingController;
  let cashMemoService: CashMemoService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CashMemoService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    cashMemoService = TestBed.inject(CashMemoService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(cashMemoService).toBeTruthy();
  });

  describe('createCashMemo', () => {
    it('should call POST api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'createCashMemoResponseFromJson').and.returnValue(
        {}
      );

      const path = getCashMemoEndPointUrl(
        cashMemoDetailsRequestPayload.txnType,
        cashMemoDetailsRequestPayload.subTxnType
      ).path;
      cashMemoService
        .createCashMemo(
          cashMemoDetailsRequestPayload.txnType,
          cashMemoDetailsRequestPayload.subTxnType,
          cashMemoDetailsRequestPayload.requestDetails
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'createCashMemoResponseFromJson').and.returnValue(
        {}
      );
      const path = getCashMemoEndPointUrl(
        cashMemoDetailsRequestPayload.txnType,
        cashMemoDetailsRequestPayload.subTxnType
      ).path;
      cashMemoService
        .createCashMemo(
          cashMemoDetailsRequestPayload.txnType,
          cashMemoDetailsRequestPayload.subTxnType,
          cashMemoDetailsRequestPayload.requestDetails
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(createCashMemoResponse);
      expect(
        CashMemoAdaptor.createCashMemoResponseFromJson
      ).toHaveBeenCalledWith(createCashMemoResponse);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'createCashMemoResponseFromJson').and.returnValue(
        createCashMemoResponse
      );

      const path = getCashMemoEndPointUrl(
        cashMemoDetailsRequestPayload.txnType,
        cashMemoDetailsRequestPayload.subTxnType
      ).path;
      cashMemoService
        .createCashMemo(
          cashMemoDetailsRequestPayload.txnType,
          cashMemoDetailsRequestPayload.subTxnType,
          cashMemoDetailsRequestPayload.requestDetails
        )
        .subscribe(data => {
          expect(data).toEqual(createCashMemoResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('viewCashMemo', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getCashMemoEndPointUrl('CM', 'NEW_CM', '5000023').path;
      cashMemoService.viewCashMemo('5000023', 'CM', 'NEW_CM').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getCashMemoEndPointUrl('CM', 'NEW_CM', '5000023').path;
      cashMemoService.viewCashMemo('5000023', 'CM', 'NEW_CM').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(cashMemoDetailsResponse);
      expect(
        CashMemoAdaptor.cashMemoDetailsResponseFromJson
      ).toHaveBeenCalledWith(cashMemoDetailsResponse);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        cashMemoDetailsResponse
      );
      const path = getCashMemoEndPointUrl('CM', 'NEW_CM', '5000023').path;
      cashMemoService
        .viewCashMemo('5000023', 'CM', 'NEW_CM')
        .subscribe(data => {
          expect(data).toEqual(cashMemoDetailsResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('partialUpdateCashMemo', () => {
    it('should call PATCH api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );

      const path = getCashMemoEndPointUrl('CM', 'NEW_CM', '5000023').path;
      cashMemoService
        .partialUpdateCashMemo('5000023', 'RSO', 'CM', 'NEW_CM')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getCashMemoEndPointUrl('CM', 'NEW_CM', '5000023').path;
      cashMemoService
        .partialUpdateCashMemo('5000023', 'RSO', 'CM', 'NEW_CM')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(cashMemoDetailsResponse);
      expect(
        CashMemoAdaptor.cashMemoDetailsResponseFromJson
      ).toHaveBeenCalledWith(cashMemoDetailsResponse);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        cashMemoDetailsResponse
      );

      const path = getCashMemoEndPointUrl('CM', 'NEW_CM', '5000023').path;
      cashMemoService
        .partialUpdateCashMemo('5000023', 'RSO', 'CM', 'NEW_CM')
        .subscribe(data => {
          expect(data).toEqual(cashMemoDetailsResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('updateCashMemo', () => {
    it('should call PUT api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );

      const path = getCashMemoEndPointUrl('CM', 'NEW_CM', '212121').path;
      cashMemoService
        .updateCashMemo(
          cashMemoDetailsRequest,
          '212121',
          'OPEN',
          'CM',
          'NEW_CM'
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getCashMemoEndPointUrl('CM', 'NEW_CM', '212121').path;
      cashMemoService
        .updateCashMemo(
          cashMemoDetailsRequest,
          '212121',
          'OPEN',
          'CM',
          'NEW_CM'
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(cashMemoDetailsResponse);
      expect(
        CashMemoAdaptor.cashMemoDetailsResponseFromJson
      ).toHaveBeenCalledWith(cashMemoDetailsResponse);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        cashMemoDetailsResponse
      );

      const path = getCashMemoEndPointUrl('CM', 'NEW_CM', '212121').path;
      cashMemoService
        .updateCashMemo(
          cashMemoDetailsRequest,
          '212121',
          'OPEN',
          'CM',
          'NEW_CM'
        )
        .subscribe(data => {
          expect(data).toEqual(cashMemoDetailsResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('deleteCashMemo', () => {
    it('should call DELETE api method with correct url', () => {
      const path = getCashMemoEndPointUrl('CM', 'NEW_CM', '212121').path;
      cashMemoService.deleteCashMemo('212121', 'CM', 'NEW_CM').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('DELETE');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('updatePriceDetails', () => {
    it('should call PATCH api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getPriceUpdateEndPointUrl('212121', 'CM', 'NEW_CM').path;
      cashMemoService.updatePriceDetails('212121', 'CM', 'NEW_CM').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getPriceUpdateEndPointUrl('212121', 'CM', 'NEW_CM').path;
      cashMemoService.updatePriceDetails('212121', 'CM', 'NEW_CM').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(cashMemoDetailsResponse);
      expect(
        CashMemoAdaptor.cashMemoDetailsResponseFromJson
      ).toHaveBeenCalledWith(cashMemoDetailsResponse);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        cashMemoDetailsResponse
      );
      const path = getPriceUpdateEndPointUrl('212121', 'CM', 'NEW_CM').path;
      cashMemoService
        .updatePriceDetails('212121', 'CM', 'NEW_CM')
        .subscribe(data => {
          expect(data).toEqual(cashMemoDetailsResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('invokeOrderDetails', () => {
    it('should call PATCH api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getInvokeOrderDetailsEndPointUrl('CM', 'NEW_CM').path;
      cashMemoService.invokeOrderDetails('CM', 'NEW_CM', {}).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getInvokeOrderDetailsEndPointUrl('CM', 'NEW_CM').path;
      cashMemoService.invokeOrderDetails('CM', 'NEW_CM', {}).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(cashMemoDetailsResponse);
      expect(
        CashMemoAdaptor.cashMemoDetailsResponseFromJson
      ).toHaveBeenCalledWith(cashMemoDetailsResponse);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        cashMemoDetailsResponse
      );
      const path = getInvokeOrderDetailsEndPointUrl('CM', 'NEW_CM').path;
      cashMemoService.invokeOrderDetails('CM', 'NEW_CM', {}).subscribe(data => {
        expect(data).toEqual(cashMemoDetailsResponse);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('uploadFile', () => {
    it('should call POST api method with correct url', () => {
      const path = uploadManualBillUrl(fileUploadDownloadPayload);
      cashMemoService.uploadFile(fileUploadDownloadPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('text');

      request.flush({});
    });
  });

  describe('uploadFileList', () => {
    it('should call GET api method with correct url', () => {
      const path = manualBillListUrl(fileUploadDownloadPayload);
      cashMemoService.uploadFileList(fileUploadDownloadPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('downloadFile', () => {
    it('should call GET api method with correct url', () => {
      const path = downloadManualBillUrl(fileDownloadReq);
      cashMemoService.downloadFile(fileDownloadReq).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('getTcsAmount', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'getTcsDataFromJson').and.returnValue({});
      const path = getTcsDetailUrl(tcsRequestParam).path;
      cashMemoService.getTcsAmount('5000023', 'CM', 'NEW_CM').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'getTcsDataFromJson').and.returnValue({});

      const path = getTcsDetailUrl(tcsRequestParam).path;
      cashMemoService.getTcsAmount('5000023', 'CM', 'NEW_CM').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(tcsResponse);
      expect(CashMemoAdaptor.getTcsDataFromJson).toHaveBeenCalledWith(
        tcsResponse
      );
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'getTcsDataFromJson').and.returnValue(tcsResponse);
      const path = getTcsDetailUrl(tcsRequestParam).path;
      cashMemoService
        .getTcsAmount('5000023', 'CM', 'NEW_CM')
        .subscribe(data => {
          expect(data).toEqual(tcsResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('loadCashMemoHistory', () => {
    it('should call POST api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'getCashMemoHistoryDetails').and.returnValue({});
      const path = getCashMemoHistoryDetailsUrl(
        10,
        0,
        'NEW_CM',
        'CM',
        '',
        '',
        ''
      ).path;
      cashMemoService
        .loadCashMemoHistory('CM', 'NEW_CM', 0, 10, '', {})
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'getCashMemoHistoryDetails').and.returnValue({});

      const path = getCashMemoHistoryDetailsUrl(
        10,
        0,
        'NEW_CM',
        'CM',
        '',
        '',
        ''
      ).path;
      cashMemoService
        .loadCashMemoHistory('CM', 'NEW_CM', 0, 10, '', {})
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(cashMemoHistoryDetails);
      expect(CashMemoAdaptor.getCashMemoHistoryDetails).toHaveBeenCalledWith(
        cashMemoHistoryDetails
      );
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'getCashMemoHistoryDetails').and.returnValue(
        cashMemoHistoryDetails
      );
      const path = getCashMemoHistoryDetailsUrl(
        10,
        0,
        'NEW_CM',
        'CM',
        '',
        '',
        ''
      ).path;
      cashMemoService
        .loadCashMemoHistory('CM', 'NEW_CM', 0, 10, '', {})
        .subscribe(data => {
          expect(data).toEqual(cashMemoHistoryDetails);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('getItemFromCashMemo', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoItemDetailsFromJson').and.returnValue({});
      const path = getCashMemoItemEndPointUrl(
        '5000023',
        'CM',
        'NEW_CM',
        '60007'
      ).path;
      cashMemoService
        .getItemFromCashMemo('5000023', '60007', 'CM', 'NEW_CM')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoItemDetailsFromJson').and.returnValue({});

      const path = getCashMemoItemEndPointUrl(
        '5000023',
        'CM',
        'NEW_CM',
        '60007'
      ).path;
      cashMemoService
        .getItemFromCashMemo('5000023', '60007', 'CM', 'NEW_CM')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(cashMemoItemDetailsRes);
      expect(CashMemoAdaptor.cashMemoItemDetailsFromJson).toHaveBeenCalledWith(
        cashMemoItemDetailsRes
      );
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoItemDetailsFromJson').and.returnValue(cashMemoItemDetailsRes);
      const path = getCashMemoItemEndPointUrl(
        '5000023',
        'CM',
        'NEW_CM',
        '60007'
      ).path;
      cashMemoService
        .getItemFromCashMemo('5000023', '60007', 'CM', 'NEW_CM')
        .subscribe(data => {
          expect(data).toEqual(cashMemoItemDetailsRes);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });
});
