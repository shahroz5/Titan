import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { LocationMasterService } from './location-master.service';
import {
  ApiService,
  getBaseCurrencyUrl,
  getCopyLocationUrl,
  getLocationDetailsByLocationCodeUrl,
  getLocationListUrl,
  getMarketCodeListUrl,
  getSaveLocationDetailsUrl,
  getSearchLocationByLocationCode
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  LocationAdpator,
  LocationMasterAdpator
} from '@poss-web/shared/util-adaptors';
import {
  BrandDataService,
  LovDataService,
  RegionDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  CachingStrategySetting,
  LocationListingPayload,
  LocationMasterDetails,
  LovMasterEnum
} from '@poss-web/shared/models';
import {
  CacheableApiService,
  DexieService,
  HashkeyGeneratorService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';
import { HttpClient } from '@angular/common/http';

describe('LocationMasterService', () => {
  let httpTestingController: HttpTestingController;
  let service: LocationMasterService;
  let lovDataService: LovDataService;
  let brandDataService: BrandDataService;
  let regionDataService: RegionDataService;

  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let lovDataServiceSpy: jasmine.SpyObj<LovDataService>;
  let brandDataServiceSpy: jasmine.SpyObj<BrandDataService>;
  let regionDataServiceSpy: jasmine.SpyObj<RegionDataService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LocationMasterService,
        LovDataService,
        BrandDataService,
        RegionDataService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        },
        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        },
        {
          provide: BrandDataService,
          useValue: brandDataServiceSpy
        },
        {
          provide: RegionDataService,
          useValue: regionDataServiceSpy
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(LocationMasterService);
    lovDataService = TestBed.inject(LovDataService);
    brandDataService = TestBed.inject(BrandDataService);
    regionDataService = TestBed.inject(RegionDataService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  let cacheableApiService: CacheableApiService;
  const cachingStrategySettings: CachingStrategySetting[] = [
    {
      type: 3,
      name: 'InvalidatedBySize',
      category: 'cache',
      size: 1,
      unit: 'MB'
    }
  ];
  const http: HttpClient = null;
  const indexedDBStorage = new DexieService();
  cacheableApiService = new CacheableApiService(
    new HashkeyGeneratorService('test'),
    new StorageFacade(indexedDBStorage),
    new ApiService(http, 'test'),
    cachingStrategySettings
  );

  lovDataService = new LovDataService(cacheableApiService);

  // lovDataServiceSpy = jasmine.createSpyObj<LovDataService>('LovDataService', [
  //   'getLocationLovs'
  // ]);
  // brandDataServiceSpy = jasmine.createSpyObj<BrandDataService>(
  //   'BrandDataService',
  //   ['getBrands']
  // );
  // regionDataServiceSpy = jasmine.createSpyObj<RegionDataService>(
  //   'RegionDataService',
  //   ['getRegions']
  // );

  service = new LocationMasterService(
    apiServiceSpy,
    lovDataServiceSpy,
    brandDataServiceSpy,
    regionDataServiceSpy
  );

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('Location Master Details', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        LocationMasterAdpator,
        'getNewLocationMasterDetails'
      ).and.returnValue({});
      const payload = 'Code';
      const path = getLocationDetailsByLocationCodeUrl(payload);
      service.getLocationDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getNewLocationMasterDetails LocationMasterAdpator method with correct arguments', () => {
      spyOn(LocationMasterAdpator, 'getLocationMasterDetails').and.returnValue({
        locationCode: 'Code'
      });

      const payload = 'Code';

      const path = getLocationDetailsByLocationCodeUrl(payload);
      service.getLocationDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({
        locationCode: 'Code'
      });
      expect(
        LocationMasterAdpator.getLocationMasterDetails
      ).toHaveBeenCalledWith({
        locationCode: 'Code'
      });
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(LocationMasterAdpator, 'getLocationMasterDetails').and.returnValue({
        locationCode: 'Code'
      });

      const payload = 'Code';

      const path = getLocationDetailsByLocationCodeUrl(payload);
      service.getLocationDetails(payload).subscribe(data => {
        expect(data).toEqual({
          locationCode: 'Code'
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getLocationListing Details', () => {
    const payload: LocationListingPayload = {
      results: [],
      pageNumber: 1,
      pageSize: 1,
      totalPages: 1,
      totalElements: 0
    };

    it('should call GET api method with correct url and params', () => {
      spyOn(LocationMasterAdpator, 'getLocationListingDetails').and.returnValue(
        {}
      );

      const pageIndex: number = 0;
      const pageSize: number = 10;
      const path = getLocationListUrl(pageIndex, pageSize);
      service.getLocationListing(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getNewLocationMasterDetails LocationMasterAdpator method with correct arguments', () => {
      spyOn(LocationMasterAdpator, 'getLocationListingDetails').and.returnValue(
        payload
      );

      const pageIndex: number = 0;
      const pageSize: number = 10;
      const path = getLocationListUrl(pageIndex, pageSize);
      service.getLocationListing(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(
        LocationMasterAdpator.getLocationListingDetails
      ).toHaveBeenCalledWith(payload);
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(LocationMasterAdpator, 'getLocationListingDetails').and.returnValue(
        payload
      );

      const pageIndex: number = 0;
      const pageSize: number = 10;
      const path = getLocationListUrl(pageIndex, pageSize);
      service.getLocationListing(pageIndex, pageSize).subscribe(data => {
        expect(data).toEqual(payload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('searchLocationByLocationCode Details', () => {
    const response: LocationListingPayload = {
      results: [],
      pageNumber: 1,
      pageSize: 1,
      totalPages: 1,
      totalElements: 0
    };

    it('should call GET api method with correct url and params', () => {
      spyOn(LocationMasterAdpator, 'getSearchResult').and.returnValue({});

      const payload = 'Code';
      const path = getSearchLocationByLocationCode(payload);
      service.searchLocationByLocationCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getNewLocationMasterDetails LocationMasterAdpator method with correct arguments', () => {
      spyOn(LocationMasterAdpator, 'getSearchResult').and.returnValue(response);

      const payload = 'Code';
      const path = getSearchLocationByLocationCode(payload);
      service.searchLocationByLocationCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(response);
      expect(LocationMasterAdpator.getSearchResult).toHaveBeenCalledWith(
        response
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(LocationMasterAdpator, 'getSearchResult').and.returnValue(response);

      const payload = 'Code';
      const path = getSearchLocationByLocationCode(payload);
      service.searchLocationByLocationCode(payload).subscribe(data => {
        expect(data).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('copyLocationDetail Details', () => {
    it('should call GET api method with correct url and params', () => {
      // spyOn(LocationMasterAdpator, 'getSearchResult').and.returnValue({});

      const sourceLocationCode: string = 'A';
      const destinationLocationCode: string = 'B';
      const path = getCopyLocationUrl(
        sourceLocationCode,
        destinationLocationCode
      );
      service
        .copyLocationDetail(sourceLocationCode, destinationLocationCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('saveLocationDetails Details', () => {
    const payload: LocationMasterDetails = {
      locationCode: 'Code'
    };

    it('saveLocationDetails should call GET api method with correct url and params', () => {
      spyOn(LocationMasterAdpator, 'getLocationMasterDetails').and.returnValue(
        {}
      );

      const path = getSaveLocationDetailsUrl();
      service.saveLocationDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getNewLocationMasterDetails LocationMasterAdpator method with correct arguments', () => {
      spyOn(LocationMasterAdpator, 'getLocationMasterDetails').and.returnValue(
        payload
      );

      const path = getSaveLocationDetailsUrl();
      service.saveLocationDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(
        LocationMasterAdpator.getLocationMasterDetails
      ).toHaveBeenCalledWith(payload);
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(LocationMasterAdpator, 'getLocationMasterDetails').and.returnValue(
        payload
      );

      const path = getSaveLocationDetailsUrl();
      service.saveLocationDetails(payload).subscribe(data => {
        expect(data).toEqual(payload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getMarketCodeData Details', () => {
    const payload: { id: string; name: string }[] = [
      {
        id: '1',
        name: 'Name'
      }
    ];
    it('getMarketCodeData should call GET api method with correct url and params', () => {
      spyOn(LocationAdpator, 'getMarketList').and.returnValue({});

      const path = getMarketCodeListUrl();
      service.getMarketCodeData().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getMarketList LocationAdpator method with correct arguments', () => {
      spyOn(LocationAdpator, 'getMarketList').and.returnValue(payload);

      const path = getMarketCodeListUrl();
      service.getMarketCodeData().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(LocationAdpator.getMarketList).toHaveBeenCalledWith(payload);
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(LocationAdpator, 'getMarketList').and.returnValue(payload);

      const path = getMarketCodeListUrl();
      service.getMarketCodeData().subscribe(data => {
        expect(data).toEqual(payload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getBaseCurrencyData Details', () => {
    const payload: { id: string; name: string }[] = [
      {
        id: '1',
        name: 'Name'
      }
    ];
    it('getBaseCurrencyData should call GET api method with correct url and params', () => {
      spyOn(LocationAdpator, 'getBaseCurrency').and.returnValue({});

      const path = getBaseCurrencyUrl();
      service.getBaseCurrencyData().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getBaseCurrency LocationAdpator method with correct arguments', () => {
      spyOn(LocationAdpator, 'getBaseCurrency').and.returnValue(payload);

      const path = getBaseCurrencyUrl();
      service.getBaseCurrencyData().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(LocationAdpator.getBaseCurrency).toHaveBeenCalledWith(payload);
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(LocationAdpator, 'getBaseCurrency').and.returnValue(payload);

      const path = getBaseCurrencyUrl();
      service.getBaseCurrencyData().subscribe(data => {
        expect(data).toEqual(payload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });
});
