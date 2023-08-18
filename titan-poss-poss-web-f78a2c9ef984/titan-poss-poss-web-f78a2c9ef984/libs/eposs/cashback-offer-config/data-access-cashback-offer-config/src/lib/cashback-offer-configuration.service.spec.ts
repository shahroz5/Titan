import { TestBed } from '@angular/core/testing';

import {
  CashbackOfferList,
  BankDetailsPayload,
  SaveBankDetailsPayload,
  UpdateBankDetailsPayload,
  PayerBankList,
  OfferDetails,
  ProductGroupMappingOption,
  CardDetailsResponse,
  LoadCardDetailsPayload,
  OfferDetailResponse,
  UpdateCardDetails
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CashbackOfferConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getCashBackOfferListUrl,
  getBankDetailsByIdUrl,
  getSaveBankDetailsUrl,
  getUpdateBankDetailsUrl,
  getloadPayerBankList,
  getOfferDetailsByIdUrl,
  getMappedProductGroupByIdUrl,
  getCardDetailsUrl,
  getUpdateCardDetailsUrl
} from '@poss-web/shared/util-api-service';
import { CashbackOfferConfigurationService } from './cashback-offer-configuration.service';
describe('CashbackOfferConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let cashbackOfferConfigurationService: CashbackOfferConfigurationService;
  const dummyCashbackListResponse: CashbackOfferList = {
    cashbackOfferList: [
      {
        id: '1',
        cardBankName: 'HDFC',
        cashBackName: 'OFFER1',
        isActive: true
      }
    ],
    totalElements: 1
  };

  const dummyCashbackListRequestResponse = {
    results: dummyCashbackListResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  const bankDetailsPayload: BankDetailsPayload = {
    cashbackName: 'test',
    cardNoLength: '1',
    isActive: true,
    bankName: 'HDFC',
    startDate: 22,
    endDate: 23,
    cmRemarks: 'remarks',
    fromFirst: true,
    isCashAmount: true,
    maxUsageCount: '1',
    mobileFlag: true,
    digitsTobeValidated: '2',
    offerRemarks: 'remarks',
    excludeCashback: true
  };

  const saveBankDetailsPayload: SaveBankDetailsPayload = {
    cashbackName: 'test',
    cardNoLength: '1',
    isActive: true,
    bankName: 'HDFC',
    startDate: 22,
    endDate: 23,
    cmRemarks: 'remarks',
    firstCardDigits: '1',
    lastCardDigits: '2',
    maxUsageCount: '1',
    mobileFlag: true,
    offerRemarks: 'remarks',
    excludeCashback: true
  };

  const updateBankDetailsPayload: UpdateBankDetailsPayload = {
    id: '1',
    data: {
      isActive: false
    }
  };
  const offerDetails: OfferDetails[] = [
    {
      maxDiscountPercent: 100,
      maxInvoiceAmt: 100,
      maxSwipeAmt: 100,
      minInvoiceAmt: 100,
      minSwipeAmt: 100,
      discountAmt: '100',
      discountPercent: 100,
      id: '1',
      isCashbackAmount: true
    }
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CashbackOfferConfigurationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    cashbackOfferConfigurationService = TestBed.inject(
      CashbackOfferConfigurationService
    );
  });

  it('should be created', () => {
    expect(cashbackOfferConfigurationService).toBeTruthy();
  });

  describe('loadCashbackOfferList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getCashBackOfferList'
      ).and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const url = getCashBackOfferListUrl(pageIndex, pageSize);

      cashbackOfferConfigurationService
        .loadCashbackOfferList(pageIndex, pageSize, '')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      request.flush({});
    });

    it('should call CashbackOfferConfigurationAdaptor getCashBackOfferList method with correct  parameters', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getCashBackOfferList'
      ).and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const url = getCashBackOfferListUrl(pageIndex, pageSize);
      cashbackOfferConfigurationService
        .loadCashbackOfferList(pageIndex, pageSize, '')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyCashbackListRequestResponse);
      expect(
        CashbackOfferConfigurationAdaptor.getCashBackOfferList
      ).toHaveBeenCalledWith(dummyCashbackListRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getCashBackOfferList'
      ).and.returnValue(dummyCashbackListResponse);
      const pageIndex = 0;
      const pageSize = 10;

      const url = getCashBackOfferListUrl(pageIndex, pageSize);
      cashbackOfferConfigurationService
        .loadCashbackOfferList(pageIndex, pageSize, null)
        .subscribe(data => {
          expect(data).toEqual(dummyCashbackListResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadPayerBankList', () => {
    const payload: PayerBankList[] = [
      {
        id: '1',
        name: 'HDFC'
      }
    ];
    const url = getloadPayerBankList();
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getPayerBankList'
      ).and.returnValue({});

      cashbackOfferConfigurationService.loadPayerBankList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call CashbackOfferConfigurationAdaptor getPayerBankList method with correct  parameters', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getPayerBankList'
      ).and.returnValue({});
      cashbackOfferConfigurationService.loadPayerBankList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyCashbackListRequestResponse);
      expect(
        CashbackOfferConfigurationAdaptor.getPayerBankList
      ).toHaveBeenCalledWith(dummyCashbackListRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getPayerBankList'
      ).and.returnValue(payload);

      cashbackOfferConfigurationService.loadPayerBankList().subscribe(data => {
        expect(data).toEqual(payload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadBankDetailsByConfigId', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getBankDetails'
      ).and.returnValue({});
      const configId = '1';

      const path = getBankDetailsByIdUrl(configId);

      cashbackOfferConfigurationService
        .loadBankDetailsByConfigId(configId)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CashbackOfferConfigurationAdaptor getBankDetailsByIdUrl method with correct  parameters', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getBankDetails'
      ).and.returnValue({});
      const configId = 'cash';

      const path = getBankDetailsByIdUrl(configId);

      cashbackOfferConfigurationService
        .loadBankDetailsByConfigId(configId)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(bankDetailsPayload);
      expect(
        CashbackOfferConfigurationAdaptor.getBankDetails
      ).toHaveBeenCalledWith(bankDetailsPayload);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getBankDetails'
      ).and.returnValue(bankDetailsPayload);
      const configId = 'cash';

      const path = getBankDetailsByIdUrl(configId);

      cashbackOfferConfigurationService
        .loadBankDetailsByConfigId(configId)
        .subscribe(data => {
          expect(data).toEqual(bankDetailsPayload);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('saveBankDetails', () => {
    const path = getSaveBankDetailsUrl();
    it('should call POST api method with correct url and params', () => {
      cashbackOfferConfigurationService
        .saveBankDetails(saveBankDetailsPayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CashbackOfferConfigurationAdaptor getBankDetails method with correct  parameters', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getBankDetails'
      ).and.returnValue({});

      cashbackOfferConfigurationService
        .saveBankDetails(saveBankDetailsPayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(saveBankDetailsPayload);
      expect(
        CashbackOfferConfigurationAdaptor.getBankDetails
      ).toHaveBeenCalledWith(saveBankDetailsPayload);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getBankDetails'
      ).and.returnValue(bankDetailsPayload);

      cashbackOfferConfigurationService
        .saveBankDetails(saveBankDetailsPayload)
        .subscribe(data => {
          expect(data).toEqual(bankDetailsPayload);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('updateBankDetails', () => {
    const path = getUpdateBankDetailsUrl('1');
    it('should call PATCH api method with correct url and params', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getBankDetails'
      ).and.returnValue({});

      cashbackOfferConfigurationService
        .updateBankDetails('1', updateBankDetailsPayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call CashbackOfferConfigurationAdaptor getBankDetails method with correct  parameters', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getBankDetails'
      ).and.returnValue({});

      cashbackOfferConfigurationService
        .updateBankDetails('1', updateBankDetailsPayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(saveBankDetailsPayload);
      expect(
        CashbackOfferConfigurationAdaptor.getBankDetails
      ).toHaveBeenCalledWith(saveBankDetailsPayload);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getBankDetails'
      ).and.returnValue(bankDetailsPayload);

      cashbackOfferConfigurationService
        .updateBankDetails('1', updateBankDetailsPayload)
        .subscribe(data => {
          expect(data).toEqual(bankDetailsPayload);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadOfferDetailsById', () => {
    const path = getOfferDetailsByIdUrl('1');
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getOfferDetails'
      ).and.returnValue({});
      const configId = '1';

      cashbackOfferConfigurationService
        .loadOfferDetailsById(configId)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CashbackOfferConfigurationAdaptor getOfferDetails method with correct  parameters', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getOfferDetails'
      ).and.returnValue({});
      const configId = '1';

      cashbackOfferConfigurationService
        .loadOfferDetailsById(configId)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(offerDetails);
      expect(
        CashbackOfferConfigurationAdaptor.getOfferDetails
      ).toHaveBeenCalledWith(offerDetails);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getOfferDetails'
      ).and.returnValue(offerDetails);
      const configId = '1';

      cashbackOfferConfigurationService
        .loadOfferDetailsById(configId)
        .subscribe(data => {
          expect(data).toEqual(offerDetails);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadMappedProductGroupById', () => {
    const payload: ProductGroupMappingOption[] = [
      { id: '1', description: '72' }
    ];

    const path = getMappedProductGroupByIdUrl('1');

    it('should call GET api method with correct url and params', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getMappedProductGroup'
      ).and.returnValue({});
      const configId = '1';

      cashbackOfferConfigurationService
        .loadMappedProductGroupById(configId)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CashbackOfferConfigurationAdaptor getMappedProductGroup method with correct  parameters', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getMappedProductGroup'
      ).and.returnValue({});
      const configId = '1';

      cashbackOfferConfigurationService
        .loadMappedProductGroupById(configId)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(payload);
      expect(
        CashbackOfferConfigurationAdaptor.getMappedProductGroup
      ).toHaveBeenCalledWith(payload);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getMappedProductGroup'
      ).and.returnValue(payload);
      const configId = '1';

      cashbackOfferConfigurationService
        .loadMappedProductGroupById(configId)
        .subscribe(data => {
          expect(data).toEqual(payload);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadCardDetailsById', () => {
    const ladCardDetailsPayload: LoadCardDetailsPayload = {
      id: '1',
      pageEvent: {
        pageIndex: 0,
        pageSize: 10,
        length: 0
      }
    };
    const url = getCardDetailsUrl('1', '0', '10');
    const payload: CardDetailsResponse = {
      cardDetails: [
        { cardNo: '111', isActive: true, id: '11', newlyAdded: true }
      ],
      totalElements: 1
    };

    it('should call GET api method with correct url and params', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getCardDetails'
      ).and.returnValue({});
      const configId = '1';

      cashbackOfferConfigurationService
        .loadCardDetailsById(configId, ladCardDetailsPayload.pageEvent)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CashbackOfferConfigurationAdaptor getCardDetails method with correct  parameters', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getCardDetails'
      ).and.returnValue({});
      const configId = '1';

      cashbackOfferConfigurationService
        .loadCardDetailsById(configId, ladCardDetailsPayload.pageEvent)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(payload);
      expect(
        CashbackOfferConfigurationAdaptor.getCardDetails
      ).toHaveBeenCalledWith(payload);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        CashbackOfferConfigurationAdaptor,
        'getCardDetails'
      ).and.returnValue(payload);
      const configId = '1';

      cashbackOfferConfigurationService
        .loadCardDetailsById(configId, ladCardDetailsPayload.pageEvent)
        .subscribe(data => {
          expect(data).toEqual(payload);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('clearOfferDetailsById', () => {
    const payload: OfferDetailResponse = {
      id: '1',
      data: {
        addOffers: [
          {
            maxDiscountPercent: 100,
            maxInvoiceAmt: 100,
            maxSwipeAmt: 100,
            minInvoiceAmt: 100,
            minSwipeAmt: 100,
            discountAmt: '100',
            discountPercent: 100,
            id: '1',
            isCashbackAmount: true
          }
        ]
      }
    };
    const path = getOfferDetailsByIdUrl('1');
    it('should call PATCH api method with correct url and params', () => {
      cashbackOfferConfigurationService
        .clearOfferDetailsById(payload.id, payload.data)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('updateOfferDetailsById', () => {
    const payload: OfferDetailResponse = {
      id: '1',
      data: {
        addOffers: [
          {
            maxDiscountPercent: 100,
            maxInvoiceAmt: 100,
            maxSwipeAmt: 100,
            minInvoiceAmt: 100,
            minSwipeAmt: 100,
            discountAmt: '100',
            discountPercent: 100,
            id: '1',
            isCashbackAmount: true
          }
        ]
      }
    };
    const path = getOfferDetailsByIdUrl('1');
    it('should call PATCH api method with correct url and params', () => {
      cashbackOfferConfigurationService
        .updateOfferDetailsById(payload.id, payload.data)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('updateCardDetailsById', () => {
    const payload: UpdateCardDetails = {
      id: '11',
      updateCards: ''
    };
    const path = getUpdateCardDetailsUrl('11');
    it('should call PATCH api method with correct url and params', () => {
      cashbackOfferConfigurationService
        .updateCardDetailsById(payload.id, payload.updateCards)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
});
