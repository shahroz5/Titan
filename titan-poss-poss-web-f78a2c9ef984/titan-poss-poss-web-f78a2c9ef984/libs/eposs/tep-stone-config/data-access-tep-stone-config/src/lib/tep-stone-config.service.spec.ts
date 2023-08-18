import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { TepStoneConfigService } from './tep-stone-config.service';
import {
  ApiService,
  getStoneQualitiesDetailsListingUrl,
  getStoneTypeDetailsAllListingUrl,
  getTepStoneConfigListUrl,
  getTepValidationConfigListUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  TepExceptionConfigAdaptors,
  TepStoneConfigAdaptors,
  TepValidationConfigAdaptors
} from '@poss-web/shared/util-adaptors';

describe('CashPaymentConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  let service: TepStoneConfigService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TepStoneConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TepStoneConfigService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new TepStoneConfigService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('getTepValidationConfigList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(TepStoneConfigAdaptors, 'getTepStoneConfigList').and.returnValue(
        {}
      );
      const path = getTepStoneConfigListUrl(10, 0);

      service.getTepStoneConfigList(10, 0).subscribe();

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

      spyOn(TepStoneConfigAdaptors, 'getTepStoneConfigList').and.returnValue(
        payload
      );

      const path = getTepStoneConfigListUrl(10, 0);
      service.getTepStoneConfigList(10, 0).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(TepStoneConfigAdaptors.getTepStoneConfigList).toHaveBeenCalledWith(
        payload
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload: number = 1;

      spyOn(TepStoneConfigAdaptors, 'getTepStoneConfigList').and.returnValue(
        payload
      );

      const path = getTepStoneConfigListUrl(10, 0);
      service.getTepStoneConfigList(10, 0).subscribe(data => {
        expect(data).toBeDefined();
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getStoneQualitiesList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(TepStoneConfigAdaptors, 'getStoneQualitiesList').and.returnValue({});
      const path = getStoneQualitiesDetailsListingUrl();

      service.getStoneQualitiesList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getStoneQualitiesList TepStoneConfigAdaptors method with correct arguments', () => {
      const payload: number = 1;

      spyOn(TepStoneConfigAdaptors, 'getStoneQualitiesList').and.returnValue(payload);

      const path = getStoneQualitiesDetailsListingUrl();
      service.getStoneQualitiesList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(TepStoneConfigAdaptors.getStoneQualitiesList).toHaveBeenCalledWith(
        payload
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload: number = 1;

      spyOn(TepStoneConfigAdaptors, 'getStoneQualitiesList').and.returnValue(
        payload
      );

      const path = getStoneQualitiesDetailsListingUrl();
      service.getStoneQualitiesList().subscribe(data => {
        expect(data).toBeDefined();
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getStoneTypesList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(TepStoneConfigAdaptors, 'getStoneTypeList').and.returnValue({});
      const path = getStoneTypeDetailsAllListingUrl();

      service.getStoneTypesList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getStoneTypesList TepStoneConfigAdaptors method with correct arguments', () => {
      const payload: number = 1;

      spyOn(TepStoneConfigAdaptors, 'getStoneTypeList').and.returnValue(payload);

      const path = getStoneTypeDetailsAllListingUrl();
      service.getStoneTypesList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(TepStoneConfigAdaptors.getStoneTypeList).toHaveBeenCalledWith(
        payload
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload: number = 1;

      spyOn(TepStoneConfigAdaptors, 'getStoneTypeList').and.returnValue(
        payload
      );

      const path = getStoneTypeDetailsAllListingUrl();
      service.getStoneTypesList().subscribe(data => {
        expect(data).toBeDefined();
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
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
