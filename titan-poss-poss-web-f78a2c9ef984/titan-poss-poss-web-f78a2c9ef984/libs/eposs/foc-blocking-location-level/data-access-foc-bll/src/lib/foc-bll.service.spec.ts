import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FOCBlockingLocaionLevelListResponse } from '@poss-web/shared/models';
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
import { FOCBLLSelectors } from './+state/foc-bll.selectors';
import { FOCBLLService } from './foc-bll.service';
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
    mobileNo: null
  };
  const focBlockingLocationDetails: FOCBlockingLocaionLevelListResponse = {
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
        id: 'abc123'
      }
    ],
    totalElements: 1
  };
  const dummyFocBlockingLocationLevelData = {
    results: focBlockingLocationDetails.response,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 1
  };
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let focBlockingLocationLevelService: FOCBLLService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FOCBLLService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    focBlockingLocationLevelService = TestBed.inject(FOCBLLService);
  });
  it('should be created', () => {
    expect(focBlockingLocationLevelService).toBeTruthy();
  });

  describe('searchLocation', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        FOCBlockingLocationLevelAdaptor,
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

    it('should call FOCBlockingLocationLevelAdaptor SearchLocationCode method with correct  parameters', () => {
      spyOn(
        FOCBlockingLocationLevelAdaptor,
        'SearchLocationCode'
      ).and.returnValue({});

      const path = getSearchLocationCodeUrl('abc123', 'URB').path;

      focBlockingLocationLevelService
        .searchLocation({ schemeId: 'abc123', locationCode: 'URB' })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyFocBlockingLocationLevelData);
      expect(
        FOCBlockingLocationLevelAdaptor.SearchLocationCode
      ).toHaveBeenCalledWith(dummyFocBlockingLocationLevelData);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        FOCBlockingLocationLevelAdaptor,
        'SearchLocationCode'
      ).and.returnValue(focBlockingLocationDetails.response);

      const path = getSearchLocationCodeUrl('abc123', 'URB').path;

      focBlockingLocationLevelService
        .searchLocation({ schemeId: 'abc123', locationCode: 'URB' })
        .subscribe(data => {
          expect(data).toEqual(focBlockingLocationDetails.response);
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
      id: 'abc123'
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(
        FOCBlockingLocationLevelAdaptor,
        'FocBlockingLocationLevelList'
      ).and.returnValue({});

      const { path, params } = getFocBlockingLocationLevelListUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.id
      );

      focBlockingLocationLevelService.loadFOCBLLDetails(payload).subscribe();

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

    it('should call FOCBlockingLocationLevelAdaptor FocBlockingLocationLevelList method with correct  parameters', () => {
      spyOn(
        FOCBlockingLocationLevelAdaptor,
        'FocBlockingLocationLevelList'
      ).and.returnValue({});

      const path = getFocBlockingLocationLevelListUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.id
      ).path;

      focBlockingLocationLevelService.loadFOCBLLDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyFocBlockingLocationLevelData);
      expect(
        FOCBlockingLocationLevelAdaptor.FocBlockingLocationLevelList
      ).toHaveBeenCalledWith(dummyFocBlockingLocationLevelData);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        FOCBlockingLocationLevelAdaptor,
        'FocBlockingLocationLevelList'
      ).and.returnValue(focBlockingLocationDetails);

      const path = getFocBlockingLocationLevelListUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.id
      ).path;

      focBlockingLocationLevelService
        .loadFOCBLLDetails(payload)
        .subscribe(data => {
          expect(data).toEqual(focBlockingLocationDetails);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('saveFOCBLLDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const path = getSaveFocBlockingLocationLevelUrl('abc123');

      focBlockingLocationLevelService
        .saveFOCBLLDetails({ id: 'abc123', savePayload: savePayload })
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

      const { path, params } = getSchemeIdUrl('FOC_BLOCKING_LOCATION');

      focBlockingLocationLevelService
        .loadSchemeId('FOC_BLOCKING_LOCATION')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('schemeName').toString()).toEqual(
        'FOC_BLOCKING_LOCATION'
      );
      request.flush({});
    });

    it('should call FOCBlockingLocationLevelAdaptor getSchemeId method with correct parameters', () => {
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
