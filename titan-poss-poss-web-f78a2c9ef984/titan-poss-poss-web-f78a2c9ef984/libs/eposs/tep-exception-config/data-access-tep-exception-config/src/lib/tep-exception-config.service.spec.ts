import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { TepExceptionConfigService } from './tep-exception-config.service';
import {
  ApiService,
  getTepExceptionConfigListUrl,
  getTepGlobalConfigListUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TepExceptionConfigAdaptors } from '@poss-web/shared/util-adaptors';
import { TEPExceptiononfigListing } from '@poss-web/shared/models';

describe('TEPExceptionConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  let service: TepExceptionConfigService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TepExceptionConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TepExceptionConfigService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new TepExceptionConfigService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('getMaxFlatTepExchangeValue', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(TepExceptionConfigAdaptors, 'getTepGlobalConfig').and.returnValue(
        {}
      );
      const path = getTepGlobalConfigListUrl();
      service.getMaxFlatTepExchangeValue().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTepGlobalConfig TepExceptionConfigAdaptors method with correct arguments', () => {
      const payload: number = 1;

      spyOn(TepExceptionConfigAdaptors, 'getTepGlobalConfig').and.returnValue(
        payload
      );

      const path = getTepGlobalConfigListUrl();
      service.getMaxFlatTepExchangeValue().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(
        TepExceptionConfigAdaptors.getTepGlobalConfig
      ).toHaveBeenCalledWith(payload);
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload: number = 1;

      spyOn(TepExceptionConfigAdaptors, 'getTepGlobalConfig').and.returnValue(
        payload
      );

      const path = getTepGlobalConfigListUrl();
      service.getMaxFlatTepExchangeValue().subscribe(data => {
        expect(data).toEqual(payload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getTepExceptionConfigList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        TepExceptionConfigAdaptors,
        'getTepExceptionConfigList'
      ).and.returnValue({});
      const path = getTepExceptionConfigListUrl(1, 1);
      service.getTepExceptionConfigList(1, 1).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTepExceptionConfigList TepExceptionConfigAdaptors method with correct arguments', () => {
      const payload: TEPExceptiononfigListing = {
        results: [
          {
            configId: '1',
            isActive: true,
            configDetails: {
              data: null,
              type: 'TYPE'
            },
            configType: 'TYPE',
            createdDate: 222222,
            customerMobileNos: ['3333333'],
            description: 'Desc',
            endDate: 444444,
            isOfferEnabled: true,
            itemCode: 'Code',
            offerDetails: {
              data: null,
              type: 'TYPE'
            },
            startDate: 111111
          }
        ],
        totalElements: 1
      };

      spyOn(
        TepExceptionConfigAdaptors,
        'getTepExceptionConfigList'
      ).and.returnValue(payload);

      const path = getTepExceptionConfigListUrl(1, 1);
      service.getTepExceptionConfigList(1, 1).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(
        TepExceptionConfigAdaptors.getTepExceptionConfigList
      ).toHaveBeenCalledWith(payload);
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload: TEPExceptiononfigListing = {
        results: [
          {
            configId: '1',
            isActive: true,
            configDetails: {
              data: null,
              type: 'TYPE'
            },
            configType: 'TYPE',
            createdDate: 222222,
            customerMobileNos: ['3333333'],
            description: 'Desc',
            endDate: 444444,
            isOfferEnabled: true,
            itemCode: 'Code',
            offerDetails: {
              data: null,
              type: 'TYPE'
            },
            startDate: 111111
          }
        ],
        totalElements: 1
      };

      spyOn(
        TepExceptionConfigAdaptors,
        'getTepExceptionConfigList'
      ).and.returnValue(payload);

      const path = getTepExceptionConfigListUrl(1, 1);
      service.getTepExceptionConfigList(1, 1).subscribe(data => {
        expect(data).toEqual(payload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });
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
