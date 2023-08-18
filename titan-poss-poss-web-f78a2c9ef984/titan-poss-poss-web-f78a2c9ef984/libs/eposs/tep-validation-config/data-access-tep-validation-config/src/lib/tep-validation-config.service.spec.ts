import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { TepValidationConfigService } from './tep-validation-config.service';
import {
  ApiService,
  getTepValidationConfigDetailsUrl,
  getTepValidationConfigListUrl,
  searchTepValidationConfigListUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  TepExceptionConfigAdaptors,
  TepValidationConfigAdaptors
} from '@poss-web/shared/util-adaptors';
import { TEPValidationConfigListing } from '@poss-web/shared/models';

describe('TEP Validation Config Service', () => {
  let httpTestingController: HttpTestingController;
  let service: TepValidationConfigService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TepValidationConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TepValidationConfigService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new TepValidationConfigService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('getTepValidationConfigList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        TepValidationConfigAdaptors,
        'getTepValidationConfigList'
      ).and.returnValue({});
      const path = getTepValidationConfigListUrl(10, 0);

      service.getTepValidationConfigList(10, 0).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTepValidationConfigList TepValidationConfigAdaptors method with correct arguments', () => {
      const payload: number = 1;
      const response: TEPValidationConfigListing = {
        results: [
          {
            configDetails: {
              data: {
                fvtCNCancellationDeductionPercent: 10,
                isAnnexurePrintingAllowed: true,
                isFVTCNCancellationAllowed: true,
                isInterBrandCashRefundAllowed: true,
                tepCancellationDays: 1
              },
              type: 'TYPE'
            },
            configId: '1',
            configType: 'Type',
            description: 'Desc',
            isActive: true,
            offerDetails: null
          }
        ],
        totalElements: 1
      };

      spyOn(
        TepValidationConfigAdaptors,
        'getTepValidationConfigList'
      ).and.returnValue(response);

      const path = getTepValidationConfigListUrl(10, 0);
      service.getTepValidationConfigList(10, 0).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(response);
      expect(
        TepValidationConfigAdaptors.getTepValidationConfigList
      ).toHaveBeenCalledWith(response);
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload: number = 1;

      spyOn(
        TepValidationConfigAdaptors,
        'getTepValidationConfigList'
      ).and.returnValue(payload);

      const path = getTepValidationConfigListUrl(10, 0);
      service.getTepValidationConfigList(10, 0).subscribe(data => {
        expect(data).toBeDefined();
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('searchTepValidationConfigList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        TepValidationConfigAdaptors,
        'getTepValidationConfigList'
      ).and.returnValue({});
      const path = searchTepValidationConfigListUrl('');

      service.searchTepValidationConfigList('').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTepValidationConfigList TepValidationConfigAdaptors method with correct arguments', () => {
      const payload: number = 1;
      const response: TEPValidationConfigListing = {
        results: [
          {
            configDetails: {
              data: {
                fvtCNCancellationDeductionPercent: 10,
                isAnnexurePrintingAllowed: true,
                isFVTCNCancellationAllowed: true,
                isInterBrandCashRefundAllowed: true,
                tepCancellationDays: 1
              },
              type: 'TYPE'
            },
            configId: '1',
            configType: 'Type',
            description: 'Desc',
            isActive: true,
            offerDetails: null
          }
        ],
        totalElements: 1
      };

      spyOn(
        TepValidationConfigAdaptors,
        'getTepValidationConfigList'
      ).and.returnValue(response);

      const path = searchTepValidationConfigListUrl('');
      service.searchTepValidationConfigList('').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(response);
      expect(
        TepValidationConfigAdaptors.getTepValidationConfigList
      ).toHaveBeenCalledWith(response);
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload: number = 1;

      spyOn(
        TepValidationConfigAdaptors,
        'getTepValidationConfigList'
      ).and.returnValue(payload);

      const path = searchTepValidationConfigListUrl('');
      service.searchTepValidationConfigList('').subscribe(data => {
        expect(data).toBeDefined();
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getTepValidationConfigDetails', () => {
    it('should call GET api method with correct url and params', () =>{
      spyOn(
        TepValidationConfigAdaptors,
        'getTepValidationConfigDetails'
      ).and.returnValue({});
      const path = getTepValidationConfigDetailsUrl('').path;

      service.getTepValidationConfigDetails('').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    })
  })
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
});
