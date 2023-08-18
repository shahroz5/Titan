import { TestBed } from '@angular/core/testing';

import { VendorMasterListing, VendorMaster } from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { VendorMasterAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getVendorMasterUrl,
  getSearchVendorMasterUrl,
  getVendorMasterByCodeUrl
} from '@poss-web/shared/util-api-service';
import { VendorMasterService } from './vendor-master.service';
describe('VendorMasterService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let vendorMasterService: VendorMasterService;
  const pageIndex = 0;
  const pageSize = 10;
  const vendorCode = 'EMAIL';
  const dummyVendorMaster: VendorMaster = {
    vendorCode: 'EMAIL',
    vendorName: 'EMAIL',
    vendorDetail: '',
    baseUrl: 'email.com',
    vendorType: 'EMAIL'
  };

  const dummyVendorMasterRequestResponse: VendorMasterListing = {
    results: [
      {
        vendorCode: 'EMAIL',
        vendorName: 'EMAIL',
        vendorDetail: '',
        baseUrl: 'email.com',
        vendorType: 'EMAIL'
      }
    ],
    totalElements: 1
  };

  const dummyVendorMasterRequestRequestResponse = {
    pageNumber: 0,
    pageSize: 0,
    results: dummyVendorMasterRequestResponse,
    totalElements: 0,
    totalPages: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VendorMasterService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    vendorMasterService = TestBed.inject(VendorMasterService);
  });

  it('should be created', () => {
    expect(vendorMasterService).toBeTruthy();
  });

  describe('getVendorMasterList', () => {
    const url = getVendorMasterUrl(pageIndex, pageSize);
    it('should call GET api method with correct url and params', () => {
      spyOn(VendorMasterAdaptor, 'getVendorMasterList').and.returnValue({});

      vendorMasterService.getVendorMasterList(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call VendorMasterAdaptor getVendorMasterList method with correct  parameters', () => {
      spyOn(VendorMasterAdaptor, 'getVendorMasterList').and.returnValue({});

      vendorMasterService.getVendorMasterList(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyVendorMasterRequestRequestResponse);
      expect(VendorMasterAdaptor.getVendorMasterList).toHaveBeenCalledWith(
        dummyVendorMasterRequestRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(VendorMasterAdaptor, 'getVendorMasterList').and.returnValue(
        dummyVendorMasterRequestResponse
      );

      vendorMasterService
        .getVendorMasterList(pageIndex, pageSize)
        .subscribe(data1 => {
          expect(data1).toEqual(dummyVendorMasterRequestResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getVendorMasterList', () => {
    const url = getVendorMasterUrl(pageIndex, pageSize);
    it('should call GET api method with correct url and params', () => {
      spyOn(VendorMasterAdaptor, 'getVendorMasterList').and.returnValue({});

      vendorMasterService.getVendorMasterList(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call VendorMasterAdaptor getVendorMasterList method with correct  parameters', () => {
      spyOn(VendorMasterAdaptor, 'getVendorMasterList').and.returnValue({});

      vendorMasterService.getVendorMasterList(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyVendorMasterRequestRequestResponse);
      expect(VendorMasterAdaptor.getVendorMasterList).toHaveBeenCalledWith(
        dummyVendorMasterRequestRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(VendorMasterAdaptor, 'getVendorMasterList').and.returnValue(
        dummyVendorMasterRequestResponse
      );

      vendorMasterService
        .getVendorMasterList(pageIndex, pageSize)
        .subscribe(data1 => {
          expect(data1).toEqual(dummyVendorMasterRequestResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getVendorMasterList', () => {
    const url = getVendorMasterUrl(pageIndex, pageSize);
    it('should call GET api method with correct url and params', () => {
      spyOn(VendorMasterAdaptor, 'getVendorMasterList').and.returnValue({});

      vendorMasterService.getVendorMasterList(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call VendorMasterAdaptor getVendorMasterList method with correct  parameters', () => {
      spyOn(VendorMasterAdaptor, 'getVendorMasterList').and.returnValue({});

      vendorMasterService.getVendorMasterList(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyVendorMasterRequestRequestResponse);
      expect(VendorMasterAdaptor.getVendorMasterList).toHaveBeenCalledWith(
        dummyVendorMasterRequestRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(VendorMasterAdaptor, 'getVendorMasterList').and.returnValue(
        dummyVendorMasterRequestResponse
      );

      vendorMasterService
        .getVendorMasterList(pageIndex, pageSize)
        .subscribe(data1 => {
          expect(data1).toEqual(dummyVendorMasterRequestResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getSearchVendorMasterList', () => {
    const url = getSearchVendorMasterUrl(vendorCode);
    it('should call GET api method with correct url and params', () => {
      spyOn(VendorMasterAdaptor, 'getSearchedVendorMasterList').and.returnValue(
        {}
      );

      vendorMasterService.getSearchVendorMasterList(vendorCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call VendorMasterAdaptor getSearchedVendorMasterList method with correct  parameters', () => {
      spyOn(VendorMasterAdaptor, 'getSearchedVendorMasterList').and.returnValue(
        {}
      );

      vendorMasterService.getSearchVendorMasterList(vendorCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(dummyVendorMasterRequestRequestResponse);
      expect(
        VendorMasterAdaptor.getSearchedVendorMasterList
      ).toHaveBeenCalledWith(dummyVendorMasterRequestRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(VendorMasterAdaptor, 'getSearchedVendorMasterList').and.returnValue(
        dummyVendorMasterRequestResponse
      );

      vendorMasterService
        .getSearchVendorMasterList(vendorCode)
        .subscribe(data1 => {
          expect(data1).toEqual(dummyVendorMasterRequestResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });

  describe('getVendorMasterByCode', () => {
    const url = getVendorMasterByCodeUrl(vendorCode);
    it('should call GET api method with correct url and params', () => {
      spyOn(VendorMasterAdaptor, 'getVendorMasterByCodeData').and.returnValue(
        {}
      );

      vendorMasterService.getVendorMasterByCode(vendorCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call VendorMasterAdaptor getVendorMasterByCodeData method with correct  parameters', () => {
      spyOn(VendorMasterAdaptor, 'getVendorMasterByCodeData').and.returnValue(
        {}
      );

      vendorMasterService.getVendorMasterByCode(vendorCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(dummyVendorMasterRequestRequestResponse);
      expect(
        VendorMasterAdaptor.getVendorMasterByCodeData
      ).toHaveBeenCalledWith(dummyVendorMasterRequestRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(VendorMasterAdaptor, 'getVendorMasterByCodeData').and.returnValue(
        dummyVendorMaster
      );

      vendorMasterService.getVendorMasterByCode(vendorCode).subscribe(data1 => {
        expect(data1).toEqual(dummyVendorMaster);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });
});
