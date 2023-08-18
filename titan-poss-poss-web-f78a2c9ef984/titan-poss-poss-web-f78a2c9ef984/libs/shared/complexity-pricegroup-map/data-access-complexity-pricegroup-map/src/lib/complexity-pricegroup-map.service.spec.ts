import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { ComplexityPricegroupService } from './complexity-pricegroup-map.service';

import {
  getComplexityPricegroupListingUrl,
  getSaveComplexityPricegroupListingUrl,
  getLoadComplexityCodeUrl,
  getLoadPricegroupUrl,
  getComplexityPricegroupDetailsByIdUrl
} from '@poss-web/shared/util-api-service';

import {
  ComplexityPriceGroupDetails,
  LoadComplexityPriceGroupListingPayload,
  LoadComplexityPriceGroupListingSuccessPayload,
  SaveComplexityPriceGroupFormPayload,
  EditComplexityPriceGroupFormPayload
} from '@poss-web/shared/models';
import { ComplexityPricegroupAdaptor } from '@poss-web/shared/util-adaptors';

describe('ComplexityPricegroupService ', () => {
  let httpTestingController: HttpTestingController;
  let complexityPricegroupService: ComplexityPricegroupService;
  const apiUrl = 'http://localhost:3000';

  const dummyItemList: ComplexityPriceGroupDetails[] = [
    {
      id: '85DB811C-B9BD-4CDA-B685-850DC9379C46',
      complexityCode: 'PYD',
      priceGroup: 'ABC',
      makingChargesPerUnit: '1',
      makingChargesPerGram: '1',
      wastagePercentage: '1',
      makingChargesPercentage: '1'
    }
  ];

  const dummyItemResponse = {
    results: dummyItemList,
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ComplexityPricegroupService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.get(HttpTestingController);
    complexityPricegroupService = TestBed.get(ComplexityPricegroupService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(complexityPricegroupService).toBeTruthy();
  });

  describe('getComplexityPricegroupDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        ComplexityPricegroupAdaptor,
        'getComplexityPricegroupDetailsListing'
      ).and.returnValue({});
      const payload: LoadComplexityPriceGroupListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const searchParameter = 'AAA';
      const path = getComplexityPricegroupListingUrl(
        payload.pageIndex,
        payload.pageSize,
        searchParameter
      );
      complexityPricegroupService
        .getComplexityPricegroupDetails(payload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call ComplexityPricegroupAdaptor getComplexityPricegroupDetailsListing method with correct  parameters', () => {
      spyOn(
        ComplexityPricegroupAdaptor,
        'getComplexityPricegroupDetailsListing'
      ).and.returnValue({});
      const payload: LoadComplexityPriceGroupListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const searchParameter = 'AAA';
      const path = getComplexityPricegroupListingUrl(
        payload.pageIndex,
        payload.pageSize,
        searchParameter
      );

      complexityPricegroupService
        .getComplexityPricegroupDetails(payload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyItemResponse);
      expect(
        ComplexityPricegroupAdaptor.getComplexityPricegroupDetailsListing
      ).toHaveBeenCalledWith(dummyItemResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        ComplexityPricegroupAdaptor,
        'getComplexityPricegroupDetailsListing'
      ).and.returnValue({
        complexityPricegroupListing: dummyItemList,
        totalElements: 10
      });
      const payload: LoadComplexityPriceGroupListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const searchParameter = 'AAA';
      const path = getComplexityPricegroupListingUrl(
        payload.pageIndex,
        payload.pageSize,
        searchParameter
      );
      complexityPricegroupService
        .getComplexityPricegroupDetails(payload)
        .subscribe(data => {
          expect(data).toEqual({
            complexityPricegroupListing: dummyItemList,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getComplexityPricegroupDetailsById', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        ComplexityPricegroupAdaptor,
        'getComplexityPricegroupById'
      ).and.returnValue({});
      const id = 'ABC';
      const path = getComplexityPricegroupDetailsByIdUrl(id);
      complexityPricegroupService
        .getComplexityPricegroupDetailsById(id)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('saveComplexityPricegroupFormDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        ComplexityPricegroupAdaptor,
        'getComplexityPricegroupById'
      ).and.returnValue({});
      const saveForm = {
        complexityCode: 'PYD',
        priceGroup: 'ABC',
        makingChargePunit: '1',
        makingChargePgram: '1',
        wastagePct: '1',
        makingChargePct: '1'
      };
      const path = getSaveComplexityPricegroupListingUrl();
      complexityPricegroupService
        .saveComplexityPricegroupFormDetails(saveForm)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('editComplexityPricegroupFormDetails', () => {
    it('should call PATCH api method with correct url and params', () => {
      const editForm = {
        id: '85DB811C-B9BD-4CDA-B685-850DC9379C46',
        complexityCode: 'PYD',
        priceGroup: 'ABC',
        makingChargePunit: '2',
        makingChargePgram: '1',
        wastagePct: '3',
        makingChargePct: '1'
      };
      const path = getComplexityPricegroupDetailsByIdUrl(editForm.id);
      complexityPricegroupService
        .editComplexityPricegroupFormDetails(editForm)
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
  describe('getComplexityCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ComplexityPricegroupAdaptor, 'getComplexityCode').and.returnValue(
        {}
      );
      const path = getLoadComplexityCodeUrl();
      complexityPricegroupService.getComplexityCode().subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('getPricegroup', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ComplexityPricegroupAdaptor, 'getPriceGroup').and.returnValue({});
      const path = getLoadPricegroupUrl();
      complexityPricegroupService.getPricegroup().subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
});
