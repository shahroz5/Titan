import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { BrandMasterService } from './brand-master.service';
import {
  BrandConfigDetails,
  BrandMasterDetails
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { BrandMasterAdaptors } from '@poss-web/shared/util-adaptors';
import {
  getBrandListUrl,
  getSaveBrandUrl,
  getUpdateBrandUrl,
  getSearchBrandByBrandCode,
  getCurrencyUrl,
  getBrandDetailsByBrandCode
} from '@poss-web/shared/util-api-service';
describe('BrandMasterService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let brandMasterService: BrandMasterService;

  const dummyBrandsResponse: BrandMasterDetails[] = [
    {
      brandCode: 'TANISHQ',
      description: 'TANISHQ',
      parentBrandCode: '',
      orgCode: '',
      isActive: true,
      configDetails: null,
      cmDetails: null,
      customerDetails: null,
      panCardDetails: null,
      taxDetails: null
    }
  ];
  const dummyBrandsRequestResponse = {
    results: dummyBrandsResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  const dummyBrandsToCreate: BrandMasterDetails = {
    brandCode: 'tanishq',
    description: 'ABC',
    parentBrandCode: 'titan',
    orgCode: 'TJ',
    isActive: true,
    configDetails: {
      type: 'CONFIG_DETAILS',
      data: {
        airpayPaymentExpiry: '1',
        // dummyMobNo: '9999999999',
        isCustomerMandatoryForDigiGold: true,
        isInterbrandTEPAllowed: true,
        minUtilizationPercentageforGRF: '100',
        minUtilizationPercentageforGRN: '50',
        numberOfPrintsAllowed: '2',
        passwordConfigForCashDeposit: 'c',
        razorpayPaymentExpiry: '3',
        referCashPaymentConfig: true
      }
    },
    cmDetails: {
      type: 'CM_DETAILS',
      data: {
        residualAmountForeGHSTransfer: '1',
        smsPassword: 'pass',
        smsUserName: 'user'
      }
    },
    customerDetails: {
      type: 'CUSTOMER_DETAILS',
      data: {
        institutionalMobileNoStartsWith: [9, 8],
        internationalMobileNoStartsWith: [9, 8],
        oneTimeMobileNoStartsWith: [9, 8],
        regularMobileNoStartsWith: [9, 8]
      }
    },
    panCardDetails: {
      type: 'PANCARD_DETAILS',
      data: {
        configurationAmountForAdvance: '1',
        configurationAmountForCashMemo: '2',
        configurationAmountForGHS: '2',
        configurationAmountForGEP: '2',
        editPanDetailsNumber: 3,
        isPanCardMandatoryforAdvance: true,
        isPanCardMandatoryforCashMemo: true,
        isPanCardMandatoryforGHS: true,
        isPanCardOnSingleInvoice: true,
        isPanCardMandatoryforGEP: true,
        isPanCardOnCumulativeInvoice: true
      }
    },
    taxDetails: {
      type: 'TAX_DETAILS',
      data: {
        bullion: {
          cashAmount: '2',
          netInvoiceAmount: '3',
          unitWeight: '3'
        },
        form60: {
          indianCustomerPercent: '2',
          isNetInvoice: '3',
          nonIndianCustomerPercent: '3'
        },
        isAdvancedCNAllowed: true,
        isGhsAllowed: true,
        isOnSingleInvoice: true,
        jewellery: {
          cashAmount: '3',
          netInvoiceAmount: '3',
          panCardPercent: '4'
        },
        silverPlatinumConfig: {
          isPlatinumAllowed: true,
          isSilverAllowed: true
        }
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BrandMasterService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    brandMasterService = TestBed.inject(BrandMasterService);
  });

  it('should be created', () => {
    expect(brandMasterService).toBeTruthy();
  });
  describe('getBrandMasterList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(BrandMasterAdaptors, 'getBrandMasterList').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const path = getBrandListUrl(pageIndex, pageSize);

      brandMasterService.getBrandMasterList(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call BrandMasterAdaptors getBrandMasterList method with correct  parameters', () => {
      spyOn(BrandMasterAdaptors, 'getBrandMasterList').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const path = getBrandListUrl(pageIndex, pageSize);

      brandMasterService.getBrandMasterList(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyBrandsRequestResponse);
      expect(BrandMasterAdaptors.getBrandMasterList).toHaveBeenCalledWith(
        dummyBrandsRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(BrandMasterAdaptors, 'getBrandMasterList').and.returnValue({
        results: dummyBrandsResponse,
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;
      const path = getBrandListUrl(pageIndex, pageSize);

      brandMasterService
        .getBrandMasterList(pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual({
            results: dummyBrandsResponse,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush({});
    });
  });

  describe('getBrandDetailsByBrandCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        BrandMasterAdaptors,
        'getAllBrandDetailsByBrandCode'
      ).and.returnValue({});
      const payload = 'Code';
      const path = getBrandDetailsByBrandCode(payload);

      brandMasterService.getBrandDetailsByBrandCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call BrandMasterAdaptors getAllBrandDetailsByBrandCode method with correct  parameters', () => {
      spyOn(
        BrandMasterAdaptors,
        'getAllBrandDetailsByBrandCode'
      ).and.returnValue({});
      const payload = 'Code';
      const path = getBrandDetailsByBrandCode(payload);

      brandMasterService.getBrandDetailsByBrandCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyBrandsRequestResponse);
      expect(
        BrandMasterAdaptors.getAllBrandDetailsByBrandCode
      ).toHaveBeenCalledWith(dummyBrandsRequestResponse);
    });

    const configDetails: BrandConfigDetails = {
      data: {
        airpayPaymentExpiry: '100',
        // dummyMobNo: '00000',
        isCustomerMandatoryForDigiGold: false,
        isInterbrandTEPAllowed: true,
        minUtilizationPercentageforGRF: '10',
        minUtilizationPercentageforGRN: '10',
        numberOfPrintsAllowed: '1',
        passwordConfigForCashDeposit: 'pass',
        razorpayPaymentExpiry: '10',
        referCashPaymentConfig: null
      },
      type: 'TYPE'
    };

    it('should return data mapped by adaptors', () => {
      spyOn(
        BrandMasterAdaptors,
        'getAllBrandDetailsByBrandCode'
      ).and.returnValue(dummyBrandsToCreate);

      const payload = 'Code';
      const path = getBrandDetailsByBrandCode(payload);

      brandMasterService.getBrandDetailsByBrandCode(payload).subscribe(data => {
        expect(data).toEqual(dummyBrandsToCreate);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush({});
    });
  });

  describe('saveBrandMasterDetails', () => {
    it('should call POST api method with correct url and params', () => {
      const path = getSaveBrandUrl();

      brandMasterService
        .saveBrandMasterDetails(dummyBrandsToCreate)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('updateBrandMasterDetails', () => {
    it('should call PATCH api method with correct url and params', () => {
      const brandCode = 'GOLDPLUS';
      const brandToUpdate = {
        brandCode: 'GOLDPLUS',
        description: 'GOLDPLUS',
        parentBrandCode: '',
        orgCode: '',
        isActive: true,
        configDetails: null
      };
      const path = getUpdateBrandUrl(brandCode);

      brandMasterService.updateBrandMasterDetails(brandToUpdate).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('updateIsActive', () => {
    it('should call PATCH api method with correct url and params', () => {
      const brandCode = 'GOLDPLUS';
      const brandToUpdate = {
        isActive: true
      };
      const path = getUpdateBrandUrl(brandCode);

      brandMasterService.updateIsActive(brandCode, brandToUpdate).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('searchBrandByBrandCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        BrandMasterAdaptors,
        'getsearchBrandByBrandCodeData'
      ).and.returnValue({});
      const brandCode = 'TANISHQ';
      const path = getSearchBrandByBrandCode(brandCode);

      brandMasterService.searchBrandByBrandCode(brandCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call BrandMasterAdaptors getAllBrandDetailsByBrandCode method with correct  parameters', () => {
      spyOn(
        BrandMasterAdaptors,
        'getsearchBrandByBrandCodeData'
      ).and.returnValue({});
      const brandCode = 'TANISHQ';
      const path = getSearchBrandByBrandCode(brandCode);

      brandMasterService.searchBrandByBrandCode(brandCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyBrandsRequestResponse);
      expect(
        BrandMasterAdaptors.getsearchBrandByBrandCodeData
      ).toHaveBeenCalledWith(dummyBrandsRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        BrandMasterAdaptors,
        'getsearchBrandByBrandCodeData'
      ).and.returnValue({ results: dummyBrandsResponse, totalElements: 1 });
      const brandCode = 'TANISHQ';
      const path = getSearchBrandByBrandCode(brandCode);
      brandMasterService.searchBrandByBrandCode(brandCode).subscribe(data => {
        expect(data).toEqual({
          results: dummyBrandsResponse,
          totalElements: 1
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush({});
    });
  });

  describe('getSupportedCurrencyCode', () => {
    const dummyResponse = [
      {
        id: 'IND',
        name: 'IND'
      }
    ];
    const dummyRequestReponse = {
      results: dummyResponse,
      pagIndex: 0,
      pageSize: 10,
      totalElements: 30
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(BrandMasterAdaptors, 'getCurrencyData').and.returnValue({});

      const path = getCurrencyUrl();

      brandMasterService.getSupportedCurrencyCode().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call BrandMasterAdaptors getAllBrandDetailsByBrandCode method with correct  parameters', () => {
      spyOn(BrandMasterAdaptors, 'getCurrencyData').and.returnValue({});
      const path = getCurrencyUrl();

      brandMasterService.getSupportedCurrencyCode().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyRequestReponse);
      expect(BrandMasterAdaptors.getCurrencyData).toHaveBeenCalledWith(
        dummyRequestReponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(BrandMasterAdaptors, 'getCurrencyData').and.returnValue(
        dummyResponse
      );
      const path = getCurrencyUrl();
      brandMasterService.getSupportedCurrencyCode().subscribe(data => {
        expect(data).toEqual(dummyResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush({});
    });
  });
});
