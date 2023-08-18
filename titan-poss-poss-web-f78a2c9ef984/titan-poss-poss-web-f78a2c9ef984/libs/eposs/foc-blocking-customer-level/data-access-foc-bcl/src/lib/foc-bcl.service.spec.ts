import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FOCBlockingCustomerLevelListResponse } from '@poss-web/shared/models';
import {
  FOCBlockingAtCustomerLevelAdaptor,
  FOCBlockingLocationLevelAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  getFocBlockingLocationLevelListUrl,
  getSaveFocBlockingLocationLevelUrl,
  getSchemeIdUrl,
  getSearchLocationCodeUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { FOCBCLService } from './foc-bcl.service';
describe('FOCBlockingLocationLevelService', () => {
  const savePayload = {
    validity: {
      endDate: 123123213213213,
      startDate: 123123123213,

      status: true
    },
    configDetails: {
      type: 'FOC_LOCATION_DETAILS',
      data: {
        remarks: 'good',
        approvedBy: 'CM',
        isCMNumber: 'true'
      }
    },
    addLocations: ['URB'],
    updateLocations: [],
    removeLocations: [],
    mobileNo: '9010462817'
  };
  const focBlockingCustomerDetails: FOCBlockingCustomerLevelListResponse = {
    response: [
      {
        locationCode: 'URB',
        description: 'URB',
        fromDate: '12312312',
        toDate: '12323213',
        approvedBy: 'CM',
        isCMMandatory: true,
        remarks: 'Good',
        isActive: true,
        mobileNumber: '9010462817',
        id: 'abc123',
        focItemCode: 'abc123',
        quantity: '12'
      }
    ],
    totalElements: 1
  };
  const dummyFocBlockingCustomerLevelData = {
    results: focBlockingCustomerDetails.response,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 1
  };
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let focBlockingLocationLevelService: FOCBCLService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FOCBCLService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    focBlockingLocationLevelService = TestBed.inject(FOCBCLService);
  });
  it('should be created', () => {
    expect(focBlockingLocationLevelService).toBeTruthy();
  });

  describe('searchLocation', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        FOCBlockingAtCustomerLevelAdaptor,
        'SearchLocationCode'
      ).and.returnValue({});

      const { path, params } = getSearchLocationCodeUrl('abc123', 'URB');

      focBlockingLocationLevelService
        .searchLocation({ schemeId: 'abc123', locationCode: 'URB' })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('locationCode').toString()).toEqual(
        'URB'
      );
      request.flush({});
    });

    it('should call FOCBlockingAtCustomerLevelAdaptor SearchLocationCode method with correct  parameters', () => {
      spyOn(
        FOCBlockingAtCustomerLevelAdaptor,
        'SearchLocationCode'
      ).and.returnValue({});

      const path = getSearchLocationCodeUrl('abc123', 'URB').path;

      focBlockingLocationLevelService
        .searchLocation({ schemeId: 'abc123', locationCode: 'URB' })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyFocBlockingCustomerLevelData);
      expect(
        FOCBlockingAtCustomerLevelAdaptor.SearchLocationCode
      ).toHaveBeenCalledWith(dummyFocBlockingCustomerLevelData);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        FOCBlockingAtCustomerLevelAdaptor,
        'SearchLocationCode'
      ).and.returnValue(focBlockingCustomerDetails.response);

      const path = getSearchLocationCodeUrl('abc123', 'URB').path;

      focBlockingLocationLevelService
        .searchLocation({ schemeId: 'abc123', locationCode: 'URB' })
        .subscribe(data => {
          expect(data).toEqual(focBlockingCustomerDetails.response);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadFOCBLLDetails', () => {
    const payload = {
      pageIndex: 0,
      pageSize: 10,
      schemeId: 'abc123'
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(
        FOCBlockingAtCustomerLevelAdaptor,
        'FocBlockingCustomerLevelList'
      ).and.returnValue({});

      const { path, params } = getFocBlockingLocationLevelListUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.schemeId
      );

      focBlockingLocationLevelService.loadFOCBCLDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        payload.pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        payload.pageSize.toString()
      );
      request.flush({});
    });

    it('should call FOCBlockingAtCustomerLevelAdaptor FocBlockingCustomerLevelList method with correct  parameters', () => {
      spyOn(
        FOCBlockingAtCustomerLevelAdaptor,
        'FocBlockingCustomerLevelList'
      ).and.returnValue({});

      const path = getFocBlockingLocationLevelListUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.schemeId
      ).path;

      focBlockingLocationLevelService.loadFOCBCLDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyFocBlockingCustomerLevelData);
      expect(
        FOCBlockingAtCustomerLevelAdaptor.FocBlockingCustomerLevelList
      ).toHaveBeenCalledWith(dummyFocBlockingCustomerLevelData);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        FOCBlockingAtCustomerLevelAdaptor,
        'FocBlockingCustomerLevelList'
      ).and.returnValue(focBlockingCustomerDetails);

      const path = getFocBlockingLocationLevelListUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.schemeId
      ).path;

      focBlockingLocationLevelService
        .loadFOCBCLDetails(payload)
        .subscribe(data => {
          expect(data).toEqual(focBlockingCustomerDetails);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('saveFOCBCLDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const path = getSaveFocBlockingLocationLevelUrl('abc123');

      focBlockingLocationLevelService
        .saveFOCBCLDetails({ id: 'abc123', savePayload: savePayload })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });
  });

  describe('loadSchemeId', () => {
    const schemeDetails = {
      id: 'abc123'
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(FOCBlockingLocationLevelAdaptor, 'getSchemeId').and.returnValue({});

      const { path, params } = getSchemeIdUrl('FOC_BLOCKING_CUSTOMER');

      focBlockingLocationLevelService
        .loadSchemeId('FOC_BLOCKING_CUSTOMER')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('schemeName').toString()).toEqual(
        'FOC_BLOCKING_CUSTOMER'
      );
      request.flush({});
    });

    it('should call FOCBlockingAtCustomerLevelAdaptor getSchemeId method with correct parameters', () => {
      spyOn(FOCBlockingLocationLevelAdaptor, 'getSchemeId').and.returnValue({});

      const path = getSchemeIdUrl('FOC_BLOCKING_LOCATION').path;

      focBlockingLocationLevelService
        .loadSchemeId('FOC_BLOCKING_LOCATION')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(schemeDetails);
      expect(FOCBlockingLocationLevelAdaptor.getSchemeId).toHaveBeenCalledWith(
        schemeDetails
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(FOCBlockingLocationLevelAdaptor, 'getSchemeId').and.returnValue(
        'abc123'
      );

      const path = getSchemeIdUrl('FOC_BLOCKING_LOCATION').path;

      focBlockingLocationLevelService
        .loadSchemeId('FOC_BLOCKING_LOCATION')
        .subscribe(data => {
          expect(data).toEqual('abc123');
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
});
