import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { TaxMasterService } from './tax-master.service';
import {
  ApiService,
  getEditTaxMasterFormUrl,
  getSaveTaxMasterFormUrl,
  getTaxMasterDetailsUrl,
  getTaxMasterListingUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  LoadTaxMasterListingPayload,
  TaxMasterDetails
} from '@poss-web/shared/models';
import { TaxMasterAdaptor } from '@poss-web/shared/util-adaptors';

describe('TaxMasterService', () => {
  const dummyResponse: TaxMasterDetails = {
    description: 'desc',
    isActive: true,
    taxCode: 'code',
    taxSystem: 'VAT'
  };

  let httpTestingController: HttpTestingController;
  let service: TaxMasterService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TaxMasterService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TaxMasterService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new TaxMasterService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('getTaxMasterList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(TaxMasterAdaptor, 'getTaxMasterDetailsListing').and.returnValue({});
      const payload: LoadTaxMasterListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const path = getTaxMasterListingUrl(payload.pageIndex, payload.pageSize);
      service.getTaxMasterList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTaxMasterList TaxMasterAdaptor method with correct arguments', () => {
      spyOn(TaxMasterAdaptor, 'getTaxMasterDetailsListing').and.returnValue({
        taxMasterListing: [dummyResponse],
        totalElements: 10
      });

      const payload: LoadTaxMasterListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const path = getTaxMasterListingUrl(payload.pageIndex, payload.pageSize);
      service.getTaxMasterList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({
        taxMasterListing: [dummyResponse],
        totalElements: 10
      });
      expect(TaxMasterAdaptor.getTaxMasterDetailsListing).toHaveBeenCalledWith({
        taxMasterListing: [dummyResponse],
        totalElements: 10
      });
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(TaxMasterAdaptor, 'getTaxMasterDetailsListing').and.returnValue({
        taxMasterListing: [dummyResponse],
        totalElements: 10
      });

      const payload: LoadTaxMasterListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const path = getTaxMasterListingUrl(payload.pageIndex, payload.pageSize);
      service.getTaxMasterList(payload).subscribe(data => {
        expect(data).toEqual({
          taxMasterListing: [dummyResponse],
          totalElements: 10
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getTaxMasterDetailsByTaxMasterCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(TaxMasterAdaptor, 'getTaxMasterDetails').and.returnValue({});
      const path = getTaxMasterDetailsUrl('');
      service.getTaxMasterDetailsByTaxMasterCode('').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTaxMasterDetailsByTaxMasterCode TaxMasterAdaptor method with correct arguments', () => {
      spyOn(TaxMasterAdaptor, 'getTaxMasterDetails').and.returnValue(
        dummyResponse
      );

      const path = getTaxMasterDetailsUrl('');
      service.getTaxMasterDetailsByTaxMasterCode('').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummyResponse);
      expect(TaxMasterAdaptor.getTaxMasterDetails).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by adaptor', () => {
      spyOn(TaxMasterAdaptor, 'getTaxMasterDetails').and.returnValue(
        dummyResponse
      );

      const path = getTaxMasterDetailsUrl('');
      service.getTaxMasterDetailsByTaxMasterCode('').subscribe(data => {
        expect(data).toEqual(dummyResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('saveTaxMasterFormDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(TaxMasterAdaptor, 'getTaxMasterDetails').and.returnValue({});
      const path = getSaveTaxMasterFormUrl();
      service.saveTaxMasterFormDetails(dummyResponse).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call saveTaxMasterFormDetails TaxMasterAdaptor method with correct arguments', () => {
      spyOn(TaxMasterAdaptor, 'getTaxMasterDetails').and.returnValue(
        dummyResponse
      );

      const path = getSaveTaxMasterFormUrl();
      service.saveTaxMasterFormDetails(dummyResponse).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummyResponse);
      expect(TaxMasterAdaptor.getTaxMasterDetails).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by adaptor', () => {
      spyOn(TaxMasterAdaptor, 'getTaxMasterDetails').and.returnValue(
        dummyResponse
      );

      const path = getSaveTaxMasterFormUrl();
      service.saveTaxMasterFormDetails(dummyResponse).subscribe(data => {
        expect(data).toEqual(dummyResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('editTaxMasterFormDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(TaxMasterAdaptor, 'getTaxMasterDetails').and.returnValue({});
      const path = getEditTaxMasterFormUrl(dummyResponse.taxCode);
      service.editTaxMasterFormDetails(dummyResponse).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call editTaxMasterFormDetails TaxMasterAdaptor method with correct arguments', () => {
      spyOn(TaxMasterAdaptor, 'getTaxMasterDetails').and.returnValue(
        dummyResponse
      );

      const path = getEditTaxMasterFormUrl(dummyResponse.taxCode);
      service.editTaxMasterFormDetails(dummyResponse).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(dummyResponse);
      expect(TaxMasterAdaptor.getTaxMasterDetails).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by adaptor', () => {
      spyOn(TaxMasterAdaptor, 'getTaxMasterDetails').and.returnValue(
        dummyResponse
      );

      const path = getEditTaxMasterFormUrl(dummyResponse.taxCode);
      service.editTaxMasterFormDetails(dummyResponse).subscribe(data => {
        expect(data).toEqual(dummyResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });
});
