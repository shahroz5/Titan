import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { TaxClassService } from './tax-class.service';
import {
  ApiService,
  getSaveTaxClassFormUrl,
  getTaxClassDetailsUrl,
  getTaxClassListingUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  LoadTaxClassListingPayload,
  TaxClassDetails
} from '@poss-web/shared/models';
import { TaxClassAdaptor } from '@poss-web/shared/util-adaptors';

describe('TaxClassService', () => {
  const dummyResponse: TaxClassDetails = {
    description: 'desc',
    isActive: true,
    taxClassCode: 'code'
  };

  let httpTestingController: HttpTestingController;
  let service: TaxClassService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TaxClassService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TaxClassService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new TaxClassService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('getTaxClassList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(TaxClassAdaptor, 'getTaxClassDetailsListing').and.returnValue({});
      const payload: LoadTaxClassListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const path = getTaxClassListingUrl(payload.pageIndex, payload.pageSize);
      service.getTaxClassList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTaxClassList TaxClassAdaptor method with correct arguments', () => {
      spyOn(TaxClassAdaptor, 'getTaxClassDetailsListing').and.returnValue({
        taxClassListing: [dummyResponse],
        totalElements: 10
      });

      const payload: LoadTaxClassListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const path = getTaxClassListingUrl(payload.pageIndex, payload.pageSize);
      service.getTaxClassList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({
        taxClassListing: [dummyResponse],
        totalElements: 10
      });
      expect(TaxClassAdaptor.getTaxClassDetailsListing).toHaveBeenCalledWith({
        taxClassListing: [dummyResponse],
        totalElements: 10
      });
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(TaxClassAdaptor, 'getTaxClassDetailsListing').and.returnValue({
        taxClassListing: [dummyResponse],
        totalElements: 10
      });

      const payload: LoadTaxClassListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const path = getTaxClassListingUrl(payload.pageIndex, payload.pageSize);
      service.getTaxClassList(payload).subscribe(data => {
        expect(data).toEqual({
          taxClassListing: [dummyResponse],
          totalElements: 10
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getTaxClassDetailsByTaxClassCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(TaxClassAdaptor, 'getTaxClassDetails').and.returnValue({});
      const path = getTaxClassDetailsUrl('');
      service.getTaxClassDetailsByTaxClassCode('').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTaxClassDetailsByTaxClassCode TaxClassAdaptor method with correct arguments', () => {
      spyOn(TaxClassAdaptor, 'getTaxClassDetails').and.returnValue(
        dummyResponse
      );

      const path = getTaxClassDetailsUrl('');
      service.getTaxClassDetailsByTaxClassCode('').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummyResponse);
      expect(TaxClassAdaptor.getTaxClassDetails).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by adaptor', () => {
      spyOn(TaxClassAdaptor, 'getTaxClassDetails').and.returnValue(
        dummyResponse
      );

      const path = getTaxClassDetailsUrl('');
      service.getTaxClassDetailsByTaxClassCode('').subscribe(data => {
        expect(data).toEqual(dummyResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('saveTaxClassFormDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(TaxClassAdaptor, 'getTaxClassDetails').and.returnValue({});
      const path = getSaveTaxClassFormUrl();
      service.saveTaxClassFormDetails(dummyResponse).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call saveTaxClassFormDetails TaxClassAdaptor method with correct arguments', () => {
      spyOn(TaxClassAdaptor, 'getTaxClassDetails').and.returnValue(
        dummyResponse
      );

      const path = getSaveTaxClassFormUrl();
      service.saveTaxClassFormDetails(dummyResponse).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummyResponse);
      expect(TaxClassAdaptor.getTaxClassDetails).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by adaptor', () => {
      spyOn(TaxClassAdaptor, 'getTaxClassDetails').and.returnValue(
        dummyResponse
      );

      const path = getSaveTaxClassFormUrl();
      service.saveTaxClassFormDetails(dummyResponse).subscribe(data => {
        expect(data).toEqual(dummyResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('editTaxClassFormDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(TaxClassAdaptor, 'getTaxClassDetails').and.returnValue({});
      const path = getTaxClassDetailsUrl(dummyResponse.taxClassCode);
      service.editTaxClassFormDetails(dummyResponse).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call editTaxClassFormDetails TaxClassAdaptor method with correct arguments', () => {
      spyOn(TaxClassAdaptor, 'getTaxClassDetails').and.returnValue(
        dummyResponse
      );

      const path = getTaxClassDetailsUrl(dummyResponse.taxClassCode);
      service.editTaxClassFormDetails(dummyResponse).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummyResponse);
      expect(TaxClassAdaptor.getTaxClassDetails).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by adaptor', () => {
      spyOn(TaxClassAdaptor, 'getTaxClassDetails').and.returnValue(
        dummyResponse
      );

      const path = getTaxClassDetailsUrl(dummyResponse.taxClassCode);
      service.editTaxClassFormDetails(dummyResponse).subscribe(data => {
        expect(data).toEqual(dummyResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });
});
