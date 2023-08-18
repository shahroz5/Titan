import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { CountryService } from './country.service';
import {
  ApiService,
  getCountryDetailsListingUrl,
  getCountryByCountryCodeUrl,
  getCountrySaveFormDetailsUrl,
  getCurrencyCodeUrl
} from '@poss-web/shared/util-api-service';
import { CountryAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CountryDetails,
  LoadCountryListingPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
describe('CountryService ', () => {
  let httpTestingController: HttpTestingController;
  let countryService: CountryService;
  const apiUrl = 'http://localhost:3000';

  const dummyList: CountryDetails[] = [
    {
      countryCode: 'ABC',
      description: 'ABC',
      isdCode: 'ABC',
      dateFormat: 'ABC',
      phoneLength: 'ABC',
      locale: 'ABC',
      timeFormat: 'ABC',
      isActive: true
    }
  ];

  const dummyResoonse = {
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
        CountryService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    countryService = TestBed.inject(CountryService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(countryService).toBeTruthy();
  });
  describe('getCountryDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CountryAdaptor, 'getCountryDetailsListing').and.returnValue({});
      const payload: LoadCountryListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getCountryDetailsListingUrl(
        payload.pageIndex,
        payload.pageSize
      );
      countryService.getCountryDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    it('should call CountryAdaptor getCountryDetailsListing method with correct  parameters', () => {
      spyOn(CountryAdaptor, 'getCountryDetailsListing').and.returnValue({});
      const payload: LoadCountryListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getCountryDetailsListingUrl(
        payload.pageIndex,
        payload.pageSize
      );

      countryService.getCountryDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResoonse);
      expect(CountryAdaptor.getCountryDetailsListing).toHaveBeenCalledWith(
        dummyResoonse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CountryAdaptor, 'getCountryDetailsListing').and.returnValue({
        countryListing: dummyList,
        totalElements: 10
      });
      const payload: LoadCountryListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getCountryDetailsListingUrl(
        payload.pageIndex,
        payload.pageSize
      );
      countryService.getCountryDetails(payload).subscribe(data => {
        expect(data).toEqual({
          countryListing: dummyList,
          totalElements: 10
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
  describe('getCountryByCountryCode', () => {
    it('should call GET api method with correct url and params', () => {
      const countryCode = 'ABC';
      const path = getCountryByCountryCodeUrl(countryCode);
      countryService.getCountryByCountryCode(countryCode).subscribe();

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
        countryCode: 'ABC',
        description: 'ABC',
        currencyCode: 'ABC',
        dateFormat: 'ABC',
        fiscalYearStart: 'ABC',
        isdCode: 'ABC',
        phoneLength: 'ABC',
        locale: 'ABC',
        timeFormat: 'ABC',
        fiscalYear: 2020,
        weightUnit: 'gms',
        stoneWeightUnit: 'karat',
        isActive: true
      };
      const path = getCountrySaveFormDetailsUrl();
      countryService.saveCountryFormDetails(saveForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('saveCurrencyFormDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const saveForm = {
        countryCode: 'ABC',
        description: 'ABC',
        currencyCode: 'ABC',
        dateFormat: 'ABC',
        fiscalYearStart: null,
        isdCode: 'ABC',
        phoneLength: 'ABC',
        locale: 'ABC',
        timeFormat: 'ABC',
        fiscalYear: null,
        weightUnit: 'gms',
        stoneWeightUnit: 'karat',
        isActive: true
      };
      const path = getCountrySaveFormDetailsUrl();
      countryService.saveCountryFormDetails(saveForm).subscribe();

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
        countryCode: 'ABC',
        description: 'ABC',
        currencyCode: 'ABC',
        dateFormat: 'ABC',
        fiscalYearStart: 'ABC',
        isdCode: 'ABC',
        phoneLength: 'ABC',
        locale: 'ABC',
        timeFormat: 'ABC',
        fiscalYear: 2020,
        weightUnit: 'gms',
        stoneWeightUnit: 'karat',
        isActive: true
      };
      const path = getCountryByCountryCodeUrl(editForm.countryCode);
      countryService.editCountryFormDetails(editForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('editCurrencyFormDetails', () => {
    it('should call PATCH api method with correct url and params', () => {
      const editForm = {
        countryCode: 'ABC',
        description: 'ABC',
        currencyCode: 'ABC',
        dateFormat: 'ABC',
        fiscalYearStart: null,
        isdCode: 'ABC',
        phoneLength: 'ABC',
        locale: 'ABC',
        timeFormat: 'ABC',
        fiscalYear: null,
        weightUnit: 'gms',
        stoneWeightUnit: 'karat',
        isActive: true
      };
      const path = getCountryByCountryCodeUrl(editForm.countryCode);
      countryService.editCountryFormDetails(editForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('getCountrySearchResult', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CountryAdaptor, 'getCountryDetailsSearch').and.returnValue({});
      const countryName = 'test';
      const url = getCountryDetailsListingUrl(0, 0, countryName);
      countryService.getCountrySearchResult(countryName).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call CountryAdaptor getCountryDetailsSearch method with correct  parameters', () => {
      spyOn(CountryAdaptor, 'getCountryDetailsSearch').and.returnValue({});
      const countryName = 'ABC';
      const url = getCountryDetailsListingUrl(0, 0, countryName);
      countryService.getCountrySearchResult(countryName).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResoonse);
      expect(CountryAdaptor.getCountryDetailsSearch).toHaveBeenCalledWith(
        dummyResoonse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CountryAdaptor, 'getCountryDetailsSearch').and.returnValue(
        dummyList
      );
      const countryName = 'test';
      const url = getCountryDetailsListingUrl(0, 0, countryName);

      countryService.getCountrySearchResult(countryName).subscribe(data => {
        expect(data).toEqual(dummyList);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getCurrencyCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CountryAdaptor, 'getCurrencyCode').and.returnValue({});
      const url = getCurrencyCodeUrl();
      countryService.getCurrencyCode().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
});
