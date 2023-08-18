import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { TepProductGroupConfigService } from './tep-product-group-config.service';
import {
  ApiService,
  getTepProductGroupConfigDetailsUrl,
  getTepProductGroupMappingListUrl,
  getTepStoneConfigListUrl,
  searchTepProductGroupConfigListUrl,
  searchTepProductGroupMappingListUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TepProductGroupConfigAdaptors } from '@poss-web/shared/util-adaptors';
import {
  TEPProductGroupConfigDetails,
  TEPProductGroupConfigListing,
  TEPProductGroupMappingListing,
} from '@poss-web/shared/models';
import { tepProductGroupMappingAdaptor } from './+state/tep-product-group-config.entity';

describe('TEP Product Group ConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  let service: TepProductGroupConfigService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TepProductGroupConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TepProductGroupConfigService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new TepProductGroupConfigService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('getTepProductGroupConfigList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        TepProductGroupConfigAdaptors,
        'getTepProductGroupConfigList'
      ).and.returnValue({});
      const path = getTepStoneConfigListUrl(10, 0);

      service.getTepProductGroupConfigList(10, 0).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTepProductGroupConfigList TepProductGroupConfigAdaptors method with correct arguments', () => {
      const payload = 1;

      const response: TEPProductGroupConfigListing = {
        results: [
          {
            configDetails: {
              data: 'Data',
              type: 'Type'
            },
            configId: 'ConfigId',
            configType: 'ConfigType',
            customerMobileNos: ['123', '456'],
            description: 'Desc',
            isActive: true,
            offerDetails: {
              data: 'Data',
              type: 'Type'
            }
          }
        ],
        totalElements: 1
      };

      spyOn(
        TepProductGroupConfigAdaptors,
        'getTepProductGroupConfigList'
      ).and.returnValue(response);

      const path = getTepStoneConfigListUrl(10, 0);
      service.getTepProductGroupConfigList(10, 0).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(response);
      expect(
        TepProductGroupConfigAdaptors.getTepProductGroupConfigList
      ).toHaveBeenCalledWith(response);
    });

    it('should return data mapped by listing adaptor', () => {
      const payload = 1;

      spyOn(
        TepProductGroupConfigAdaptors,
        'getTepProductGroupConfigList'
      ).and.returnValue(payload);

      const path = getTepStoneConfigListUrl(10, 0);
      service.getTepProductGroupConfigList(10, 0).subscribe(data => {
        expect(data).toBeDefined();
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('searchTepProductGroupConfigList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        TepProductGroupConfigAdaptors,
        'getTepProductGroupConfigList'
      ).and.returnValue({});

      const path = searchTepProductGroupConfigListUrl('');
      service.searchTepProductGroupConfigList('').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTepProductGroupConfigList TepProductGroupConfigAdaptors method with correct arguments', () => {
      const payload = 1;

      const response: TEPProductGroupConfigListing = {
        results: [
          {
            configDetails: {
              data: 'Data',
              type: 'Type'
            },
            configId: 'ConfigId',
            configType: 'ConfigType',
            customerMobileNos: ['123', '456'],
            description: 'Desc',
            isActive: true,
            offerDetails: {
              data: 'Data',
              type: 'Type'
            }
          }
        ],
        totalElements: 1
      };

      spyOn(
        TepProductGroupConfigAdaptors,
        'getTepProductGroupConfigList'
      ).and.returnValue(response);

      const path = searchTepProductGroupConfigListUrl('');
      service.searchTepProductGroupConfigList('').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(response);
      expect(
        TepProductGroupConfigAdaptors.getTepProductGroupConfigList
      ).toHaveBeenCalledWith(response);
    });

    it('should return data mapped by listing adaptor', () => {
      const payload = 1;

      spyOn(
        TepProductGroupConfigAdaptors,
        'getTepProductGroupConfigList'
      ).and.returnValue(payload);

      const path = searchTepProductGroupConfigListUrl('');
      service.searchTepProductGroupConfigList('').subscribe(data => {
        expect(data).toBeDefined();
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getTepProductGroupConfigDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        TepProductGroupConfigAdaptors,
        'getTepProductGroupConfigDetails'
      ).and.returnValue({});

      const path = getTepProductGroupConfigDetailsUrl('');
      service.getTepProductGroupConfigDetails('').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTepProductGroupConfigDetails TepProductGroupConfigAdaptors method with correct arguments', () => {
      const payload = 1;

      const response: TEPProductGroupConfigDetails = {
        configDetails: {
          data: 'Data',
          type: 'Type'
        },
        configId: 'ConfigId',
        configType: 'ConfigType',
        customerMobileNos: ['123', '456'],
        description: 'Desc',
        isActive: true,
        offerDetails: {
          data: 'Data',
          type: 'Type'
        }
      };

      spyOn(
        TepProductGroupConfigAdaptors,
        'getTepProductGroupConfigDetails'
      ).and.returnValue(response);

      const path = getTepProductGroupConfigDetailsUrl('');
      service.getTepProductGroupConfigDetails('').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(response);
      expect(
        TepProductGroupConfigAdaptors.getTepProductGroupConfigDetails
      ).toHaveBeenCalledWith(response);
    });

    it('should return data mapped by listing adaptor', () => {
      const payload = 1;

      spyOn(
        TepProductGroupConfigAdaptors,
        'getTepProductGroupConfigDetails'
      ).and.returnValue(payload);

      const path = getTepProductGroupConfigDetailsUrl('');
      service.getTepProductGroupConfigDetails('').subscribe(data => {
        expect(data).toBeDefined();
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getTepProductGroupMappingList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        TepProductGroupConfigAdaptors,
        'getTepProductGroupMappingList'
      ).and.returnValue({});

      const path = getTepProductGroupMappingListUrl('ConfigId', 0, 10).path;

      service.getTepProductGroupMappingList('ConfigId', 0, 10).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTepProductGroupMappingList TepProductGroupConfigAdaptors method with correct arguments', () => {
      const payload = 1;

      const response: TEPProductGroupMappingListing = {
        results:
        [
          {
            id: '1',
            productGroupCode: '2',
            configDetails: {
              data: {
                isTepAllowed: false,
                goldDeductionPercent: 0,
                silverDeductionPercent: 0,
                platinumDeductionPercent: 0,
                ucpDeductionPercent: 0,
                ucpDeductionFlatValue: null,
                isStoneChargesApplicable: false,
                stoneDeductionPercent: null,
                isCMMandatory: false,
                cmUnavailableDeductionPercent: 0,
                isFVTAllowed: false,
                fvtDeductionPercent: 0,
                isCutPieceTepAllowed: false,
                isInterBrandTepAllowed: false,
                typeOfExchange: 'Current Exchange',
                recoverDiscountPercent: 0,
                refundDeductionPercent: 0,
                isTEPSaleBin: false,
                weightTolerancePercent: 0,
                isProportionedValue: false
              },
              type: 'TEP_PRODUCT_CONFIG'
            },
            configId: 'ConfigId'
          }
        ],
        totalElements: 23,
      };

      spyOn(
        TepProductGroupConfigAdaptors,
        'getTepProductGroupMappingList'
      ).and.returnValue(response);

      const path = getTepProductGroupMappingListUrl('ConfigId', 0, 10);
      service.getTepProductGroupMappingList('ConfigId', 0, 10).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(response);
      expect(
        TepProductGroupConfigAdaptors.getTepProductGroupMappingList
      ).toHaveBeenCalledWith(response);
    })

    it('should return data mapped by listing adaptor', () => {
      const payload = 1;

      spyOn(
        TepProductGroupConfigAdaptors,
        'getTepProductGroupMappingList'
      ).and.returnValue(payload);

      const path = getTepProductGroupMappingListUrl('ConfigId', 0, 10).path;
      service.getTepProductGroupMappingList('ConfigId', 0, 10).subscribe(data => {
        expect(data).toBeDefined();
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });

    describe('searchTepProductGroupMappingList', () => {
      it('should call GET api method with correct url and params', () => {
        spyOn(
          TepProductGroupConfigAdaptors,
          'getTepProductGroupMappingList'
        ).and.returnValue({});


        const path = searchTepProductGroupMappingListUrl('ConfigId', '71').path;
        service.searchTepProductGroupMappingList('ConfigId', '71').subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('GET');
        expect(request.request.responseType).toEqual('json');
        request.flush({});
      });
      it('should call getTepProductGroupMappingList TepProductGroupConfigAdaptors method with correct arguments', () => {
        const payload = 1;

        const response: TEPProductGroupMappingListing = {
          results:
          [
            {
              id: '1',
              productGroupCode: '2',
              configDetails: {
                data: {
                  isTepAllowed: false,
                  goldDeductionPercent: 0,
                  silverDeductionPercent: 0,
                  platinumDeductionPercent: 0,
                  ucpDeductionPercent: 0,
                  ucpDeductionFlatValue: null,
                  isStoneChargesApplicable: false,
                  stoneDeductionPercent: null,
                  isCMMandatory: false,
                  cmUnavailableDeductionPercent: 0,
                  isFVTAllowed: false,
                  fvtDeductionPercent: 0,
                  isCutPieceTepAllowed: false,
                  isInterBrandTepAllowed: false,
                  typeOfExchange: 'Current Exchange',
                  recoverDiscountPercent: 0,
                  refundDeductionPercent: 0,
                  isTEPSaleBin: false,
                  weightTolerancePercent: 0,
                  isProportionedValue: false
                },
                type: 'TEP_PRODUCT_CONFIG'
              },
              configId: 'ConfigId'
            }
          ],
          totalElements: 23,
        };

        spyOn(
          TepProductGroupConfigAdaptors,
          'getTepProductGroupMappingList'
        ).and.returnValue(response);

        const path = searchTepProductGroupMappingListUrl('ConfigId', '71');
        service.searchTepProductGroupMappingList('ConfigId', '71').subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path.path;
        });
        request.flush(response);
        expect(
          TepProductGroupConfigAdaptors.getTepProductGroupMappingList
        ).toHaveBeenCalledWith(response);
      });
    });
  });
});
/* it('should return data mapped by listing adaptor', () => {
  const payload = 1;

  spyOn(
    TepProductGroupConfigAdaptors,
    'getTepProductGroupConfigList'
  ).and.returnValue(payload);

  const path = searchTepProductGroupMappingListUrl('ConfigId', '71');
  service.searchTepProductGroupMappingList('ConfigId', '71').subscribe(data => {
    expect(data).toBeDefined();
  });

  const request = httpTestingController.expectOne(req => {
    return req.url === apiUrl + path.path;
  });
  request.flush({});
}); */

/*
describe('addNewCashPaymentConfigurationDetails', () => {
it('should call GET api method with correct url and params', () => {
  spyOn(
    CashPaymentConfigurationAdaptor,
    'getCashPaymentConfigurationDetails'
  ).and.returnValue({});
  const path = getAddNewCashPaymentConfigurationUrl();
  service.addNewCashPaymentConfigurationDetails(dummyResponse).subscribe();

  const request = httpTestingController.expectOne(req => {
    return req.url === apiUrl + path;
  });
  expect(request.cancelled).toBeFalsy();
  expect(request.request.method).toEqual('POST');
  expect(request.request.responseType).toEqual('json');
  request.flush({});
});
it('should call addNewCashPaymentConfigurationDetails CashPaymentConfigurationAdaptor method with correct arguments', () => {
  spyOn(
    CashPaymentConfigurationAdaptor,
    'getCashPaymentConfigurationDetails'
  ).and.returnValue(dummyResponse);

  const path = getAddNewCashPaymentConfigurationUrl();
  service.addNewCashPaymentConfigurationDetails(dummyResponse).subscribe();

  const request = httpTestingController.expectOne(req => {
    return req.url === apiUrl + path;
  });
  request.flush(dummyResponse);
  expect(
    CashPaymentConfigurationAdaptor.getCashPaymentConfigurationDetails
  ).toHaveBeenCalledWith(dummyResponse);
});

it('should retun data mapped by adaptor', () => {
  spyOn(
    CashPaymentConfigurationAdaptor,
    'getCashPaymentConfigurationDetails'
  ).and.returnValue(dummyResponse);

  const path = getAddNewCashPaymentConfigurationUrl();
  service
    .addNewCashPaymentConfigurationDetails(dummyResponse)
    .subscribe(data => {
      expect(data).toEqual(dummyResponse);
    });

  const request = httpTestingController.expectOne(req => {
    return req.url === apiUrl + path;
  });
  request.flush({});
});
});

describe('editCashPaymentConfigurationDetails', () => {
it('should call GET api method with correct url and params', () => {
  spyOn(
    CashPaymentConfigurationAdaptor,
    'getCashPaymentConfigurationDetails'
  ).and.returnValue({});
  const path = getCashPaymentConfigurationUrl(1);
  service.editCashPaymentConfigurationDetails(1, dummyResponse).subscribe();

  const request = httpTestingController.expectOne(req => {
    return req.url === apiUrl + path;
  });
  expect(request.cancelled).toBeFalsy();
  expect(request.request.method).toEqual('PATCH');
  expect(request.request.responseType).toEqual('json');
  request.flush({});
});
it('should call editCashPaymentConfigurationDetails CashPaymentConfigurationAdaptor method with correct arguments', () => {
  spyOn(
    CashPaymentConfigurationAdaptor,
    'getCashPaymentConfigurationDetails'
  ).and.returnValue(dummyResponse);

  const path = getCashPaymentConfigurationUrl(1);
  service.editCashPaymentConfigurationDetails(1, dummyResponse).subscribe();

  const request = httpTestingController.expectOne(req => {
    return req.url === apiUrl + path;
  });
  request.flush(dummyResponse);
  expect(
    CashPaymentConfigurationAdaptor.getCashPaymentConfigurationDetails
  ).toHaveBeenCalledWith(dummyResponse);
});

it('should retun data mapped by adaptor', () => {
  spyOn(
    CashPaymentConfigurationAdaptor,
    'getCashPaymentConfigurationDetails'
  ).and.returnValue(dummyResponse);

  const path = getCashPaymentConfigurationUrl(1);
  service
    .editCashPaymentConfigurationDetails(1, dummyResponse)
    .subscribe(data => {
      expect(data).toEqual(dummyResponse);
    });

  const request = httpTestingController.expectOne(req => {
    return req.url === apiUrl + path;
  });
  request.flush({});
});
}); */
