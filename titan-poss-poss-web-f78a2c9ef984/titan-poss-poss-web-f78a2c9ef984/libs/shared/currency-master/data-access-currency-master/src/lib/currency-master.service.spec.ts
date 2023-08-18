import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { CurrencyService } from './currency-master.service';
import {
  getCurrencyListingUrl,
  getCurrencyDetailsByCurrencyCodeUrl,
  getSaveCurrencyFormDetailsUrl
} from '@poss-web/shared/util-api-service';
import { CurrencyAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CurrencyDetails,
  LoadCurrencyListingPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
describe('CurrencyService ', () => {
  let httpTestingController: HttpTestingController;
  let currencyService: CurrencyService;
  const apiUrl = 'http://localhost:3000';

  const dummyList: CurrencyDetails[] = [
    {
      currencyCode: 'ABC',
      currencySymbol: 'ABC',
      description: 'ABC',
      isActive: true,
      unicode: 'ABC',
      lastModifiedDate: moment()
    }
  ];

  const dummyItemResponse = {
    results: dummyList,
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CurrencyService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    currencyService = TestBed.inject(CurrencyService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(currencyService).toBeTruthy();
  });
  describe('getCurrencyDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CurrencyAdaptor, 'getCurrencyDetailsListing').and.returnValue({});
      const payload: LoadCurrencyListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getCurrencyListingUrl(payload.pageIndex, payload.pageSize);
      currencyService.getCurrencyDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    it('should call CurrencyAdaptor getCurrencyDetailsListing method with correct  parameters', () => {
      spyOn(CurrencyAdaptor, 'getCurrencyDetailsListing').and.returnValue({});
      const payload: LoadCurrencyListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getCurrencyListingUrl(payload.pageIndex, payload.pageSize);

      currencyService.getCurrencyDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyItemResponse);
      expect(CurrencyAdaptor.getCurrencyDetailsListing).toHaveBeenCalledWith(
        dummyItemResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CurrencyAdaptor, 'getCurrencyDetailsListing').and.returnValue({
        currencyListing: dummyList,
        totalElements: 10
      });
      const payload: LoadCurrencyListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getCurrencyListingUrl(payload.pageIndex, payload.pageSize);
      currencyService.getCurrencyDetails(payload).subscribe(data => {
        expect(data).toEqual({
          currencyListing: dummyList,
          totalElements: 10
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
  describe('getCurrencyDetailsByCurrencyCode', () => {
    it('should call GET api method with correct url and params', () => {
      const currencyCode = 'ABC';
      const path = getCurrencyDetailsByCurrencyCodeUrl(currencyCode);
      currencyService
        .getCurrencyDetailsByCurrencyCode(currencyCode)
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

  describe('saveCurrencyFormDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const saveForm = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true
      };
      const path = getSaveCurrencyFormDetailsUrl();
      currencyService.saveCurrencyFormDetails(saveForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('editCurrencyFormDetails', () => {
    it('should call PATCH api method with correct url and params', () => {
      const editForm = {
        currencyCode: 'ABC',
        currencySymbol: 'ABC',
        description: 'ABC',
        isActive: true
      };
      const path = getCurrencyDetailsByCurrencyCodeUrl(editForm.currencyCode);
      currencyService.editCurrencyFormDetails(editForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('getCurrencyDetailsSearch', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CurrencyAdaptor, 'getCurrencyDetailsSearch').and.returnValue({});
      const currencyCode = 'test';
      const path = getCurrencyDetailsByCurrencyCodeUrl(currencyCode);
      currencyService.getCurrencyDetailsSearch(currencyCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call CurrencyAdaptor getCurrencyDetailsSearch method with correct  parameters', () => {
      spyOn(CurrencyAdaptor, 'getCurrencyDetailsSearch').and.returnValue({});
      const currencyCode = 'ABC';
      const path = getCurrencyDetailsByCurrencyCodeUrl(currencyCode);
      currencyService.getCurrencyDetailsSearch(currencyCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyItemResponse);
      expect(CurrencyAdaptor.getCurrencyDetailsSearch).toHaveBeenCalledWith(
        dummyItemResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CurrencyAdaptor, 'getCurrencyDetailsSearch').and.returnValue(
        dummyList
      );
      const currencyCode = 'ABC';
      const path = getCurrencyDetailsByCurrencyCodeUrl(currencyCode);

      currencyService.getCurrencyDetailsSearch(currencyCode).subscribe(data => {
        expect(data).toEqual(dummyList);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
});
