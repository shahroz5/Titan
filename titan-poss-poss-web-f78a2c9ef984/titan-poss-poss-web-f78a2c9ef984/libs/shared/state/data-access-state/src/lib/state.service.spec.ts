import { TestBed } from '@angular/core/testing';
import {
  PriceGroupMaster,
  StateData,
  SaveStateDetailsPayload
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { StateAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getStateAllListingUrl,
  getCountriesListingUrl,
  getStateByStateCodeUrl,
  getSaveStateFormDetailsUrl,
  getSearchStateUrl,
  getStateEditedFormDetailsUrl
} from '@poss-web/shared/util-api-service';
import { StateService } from './state.service';
describe('State service', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let stateService: StateService;

  const dummyStateResponse: StateData[] = [
    {
      stateId: 1,
      stateCode: 'KA',
      stateTaxCode: 11,
      description: 'KARNATAKA',
      isUnionTerritory: false,
      configDetails: {},
      countryCode: 'IND',
      isActive: true
    }
  ];
  const dummyStateRequestResponse = {
    results: dummyStateResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };
  const dummmyCountryResponse = [
    {
      countryCode: 'IND',
      description: 'INDIA'
    }
  ];
  const dummyCountryRequestResponse = {
    countryDetailsListing: dummmyCountryResponse,
    totalElements: 2
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StateService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    stateService = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(stateService).toBeTruthy();
  });

  describe('getStateDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StateAdaptor, 'getStateDetailsListing').and.returnValue({});

      const pageSize = 10;
      const pageIndex = 10;
      const url = getStateAllListingUrl(pageIndex, pageSize);

      stateService
        .getStateDetails({ pageSize: pageSize, pageIndex: pageIndex })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call StateAdaptor getStateDetailsListing method with correct  parameters', () => {
      spyOn(StateAdaptor, 'getStateDetailsListing').and.returnValue({});
      const pageEvent = {
        pageSize: 10,
        pageIndex: 10
      };
      const url = getStateAllListingUrl(
        pageEvent.pageIndex,
        pageEvent.pageSize
      );

      stateService.getStateDetails(pageEvent).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyStateRequestResponse);
      expect(StateAdaptor.getStateDetailsListing).toHaveBeenCalledWith(
        dummyStateRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(StateAdaptor, 'getStateDetailsListing').and.returnValue({
        stateDetailsListing: dummyStateResponse,
        totalElements: 10
      });
      const pageEvent = {
        pageSize: 10,
        pageIndex: 10
      };
      const url = getStateAllListingUrl(
        pageEvent.pageIndex,
        pageEvent.pageSize
      );

      stateService.getStateDetails(pageEvent).subscribe(data => {
        expect(data).toEqual({
          stateDetailsListing: dummyStateResponse,
          totalElements: 10
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getCountryDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StateAdaptor, 'getCountryDetailsListing').and.returnValue({});

      const url = getCountriesListingUrl();

      stateService.getCountryDetails().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');

      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call StateAdaptor getCountryDetailsListing method with correct  parameters', () => {
      spyOn(StateAdaptor, 'getCountryDetailsListing').and.returnValue({});
      const url = getCountriesListingUrl();

      stateService.getCountryDetails().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyCountryRequestResponse);
      expect(StateAdaptor.getCountryDetailsListing).toHaveBeenCalledWith(
        dummyCountryRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(StateAdaptor, 'getCountryDetailsListing').and.returnValue({
        countryDetailsListing: dummmyCountryResponse,
        totalElements: 1
      });

      const url = getCountriesListingUrl();

      stateService.getCountryDetails().subscribe(data => {
        expect(data).toEqual({
          countryDetailsListing: dummmyCountryResponse,
          totalElements: 1
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getStateByCode', () => {
    it('should call GET api method with correct url and params', () => {
      const stateCode = 'KA';
      const path = getStateByStateCodeUrl(stateCode);
      stateService.getStateByCode(stateCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('saveStateFormDetails', () => {
    it('should call POST api method with correct url and params', () => {
      const path = getSaveStateFormDetailsUrl();
      const state: SaveStateDetailsPayload = {
        stateCode: 'KA',
        stateTaxCode: 11,
        isActive: true,
        countryCode: 'IND',
        description: 'KARNATAKA',
        configDetails: {},
        isUnionTerritory: false
      };
      stateService.saveStateFormDetails(state).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('editStateFormDetails', () => {
    it('should call PATCH api method with correct url and params', () => {
      const state = {
        stateId: 1,
        stateCode: 'KA',
        stateTaxCode: 11,
        isActive: true,
        countryCode: 'IND',
        description: 'KARNATAKA',
        configDetails: {},
        isUnionTerritory: false
      };
      const path = getStateEditedFormDetailsUrl(state.stateId);

      stateService.editStateFormDetails(state).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('searchStateByCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StateAdaptor, 'getSearchDetailsListing').and.returnValue({});
      const stateCode = 'KA';
      const url = getSearchStateUrl(stateCode);

      stateService.searchStateByCode(stateCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('stateName').toString()).toEqual(
        stateCode
      );
      request.flush({});
    });

    it('should call StateAdaptor getSearchResult method with correct  parameters', () => {
      spyOn(StateAdaptor, 'getSearchDetailsListing').and.returnValue({});
      const stateCode = 'KA';
      const url = getSearchStateUrl(stateCode);
      stateService.searchStateByCode(stateCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyStateRequestResponse);
      expect(StateAdaptor.getSearchDetailsListing).toHaveBeenCalledWith(
        dummyStateRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(StateAdaptor, 'getSearchDetailsListing').and.returnValue({
        stateDetailsListing: dummyStateResponse,
        totalElements: 10
      });
      const stateCode = 'KA';
      const url = getSearchStateUrl(stateCode);

      stateService.searchStateByCode(stateCode).subscribe(data => {
        expect(data).toEqual({
          stateDetailsListing: dummyStateResponse,
          totalElements: 10
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('updateIsActive', () => {
    it('should call PATCH api method with correct url and params', () => {
      const state = {
        stateId: 1,
        isActive: true
      };
      const path = getStateEditedFormDetailsUrl(state.stateId);

      stateService.updateIsActive(state.stateId, state.isActive).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
});
