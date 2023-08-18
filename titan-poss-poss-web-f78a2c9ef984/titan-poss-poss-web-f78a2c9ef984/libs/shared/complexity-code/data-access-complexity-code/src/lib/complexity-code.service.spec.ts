import { TestBed } from '@angular/core/testing';

import { ComplexityCodeService } from './complexity-code.service';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { ComplexityCode } from '@poss-web/shared/models';
import { ComplexityCodeAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getComplexityCodeListUrl,
  getComplexityByCodeUrl,
  saveComplexityCodeUrl,
  updateComplexityCodeUrl
} from '@poss-web/shared/util-api-service';

describe('ComplexityCodeService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let complexityCodeService: ComplexityCodeService;

  const dummyComplexityCodeResponse: ComplexityCode[] = [
    {
      complexityCode: 'ABC',
      description: 'ABC',
      isActive: true
    }
  ];
  const dummyComplexityCodeRequestResponse = {
    results: dummyComplexityCodeResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  const dummyComplexityCode: ComplexityCode = {
    complexityCode: 'ABC',
    description: 'ABC',
    isActive: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ComplexityCodeService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    complexityCodeService = TestBed.inject(ComplexityCodeService);
  });

  it('should be created', () => {
    expect(complexityCodeService).toBeTruthy();
  });

  describe('getComplexityCodeList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ComplexityCodeAdaptor, 'getComplexityCodeList').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const url = getComplexityCodeListUrl(pageIndex, pageSize);

      complexityCodeService
        .getComplexityCodeList(pageIndex, pageSize)
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

    it('should call ComplexityCodeAdaptor getPriceGroupMasterList method with correct  parameters', () => {
      spyOn(ComplexityCodeAdaptor, 'getComplexityCodeList').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;

      const url = getComplexityCodeListUrl(pageIndex, pageSize);

      complexityCodeService
        .getComplexityCodeList(pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyComplexityCodeRequestResponse);
      expect(ComplexityCodeAdaptor.getComplexityCodeList).toHaveBeenCalledWith(
        dummyComplexityCodeRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(ComplexityCodeAdaptor, 'getComplexityCodeList').and.returnValue({
        results: dummyComplexityCodeResponse,
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;

      const url = getComplexityCodeListUrl(pageIndex, pageSize);

      complexityCodeService
        .getComplexityCodeList(pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual({
            results: dummyComplexityCodeResponse,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getComplexityByCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ComplexityCodeAdaptor, 'getComplexityByCode').and.returnValue({});
      const complexityCode = 'ABC';

      const path = getComplexityByCodeUrl(complexityCode);

      complexityCodeService.getComplexityByCode(complexityCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call ComplexityCodeAdaptor getComplexityByCode method with correct  parameters', () => {
      spyOn(ComplexityCodeAdaptor, 'getComplexityByCode').and.returnValue({});
      const complexityCode = 'ABC';

      const path = getComplexityByCodeUrl(complexityCode);

      complexityCodeService.getComplexityByCode(complexityCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyComplexityCode);
      expect(ComplexityCodeAdaptor.getComplexityByCode).toHaveBeenCalledWith(
        dummyComplexityCode
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(ComplexityCodeAdaptor, 'getComplexityByCode').and.returnValue(
        dummyComplexityCode
      );
      const complexityCode = 'ABC';

      const path = getComplexityByCodeUrl(complexityCode);

      complexityCodeService
        .getComplexityByCode(complexityCode)
        .subscribe(data => {
          expect(data).toEqual(dummyComplexityCode);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('saveComplexityCode', () => {
    it('should call POST api method with correct url and params', () => {
      const path = saveComplexityCodeUrl();

      complexityCodeService.saveComplexityCode(dummyComplexityCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('updateComplexityCode', () => {
    it('should call PATCH api method with correct url and params', () => {
      const complexityCode = 'ABC';

      const path = updateComplexityCodeUrl(complexityCode);

      complexityCodeService
        .updateComplexityCode({
          complexityCode: complexityCode,
          description: 'ABC',
          isActive: true
        })
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

  describe('searchComplexityCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ComplexityCodeAdaptor, 'searchComplexityCode').and.returnValue({});
      const complexityCode = 'ABC';
      const path = getComplexityByCodeUrl(complexityCode);

      complexityCodeService.searchComplexityCode(complexityCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call ComplexityCodeAdaptor searchComplexityCode method with correct  parameters', () => {
      spyOn(ComplexityCodeAdaptor, 'searchComplexityCode').and.returnValue({});
      const complexityCode = 'ABC';
      const path = getComplexityByCodeUrl(complexityCode);
      complexityCodeService.searchComplexityCode(complexityCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyComplexityCodeRequestResponse);
      expect(ComplexityCodeAdaptor.searchComplexityCode).toHaveBeenCalledWith(
        dummyComplexityCodeRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(ComplexityCodeAdaptor, 'searchComplexityCode').and.returnValue({
        results: dummyComplexityCodeResponse,
        totalElements: 10
      });
      const complexityCode = 'ABC';
      const path = getComplexityByCodeUrl(complexityCode);

      complexityCodeService
        .searchComplexityCode(complexityCode)
        .subscribe(data => {
          expect(data).toEqual({
            results: dummyComplexityCodeResponse,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
});
