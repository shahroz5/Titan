import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { StateTaxConfigurationService } from './state-tax-configuration.service';
import {
  ApiService,
  getAllStateListingUrl,
  getAllTaxClassListingUrl,
  getAllTaxListingUrl,
  getBaseCurrencyUrl,
  getCopyLocationUrl,
  getLocationDetailsByLocationCodeUrl,
  getLocationListUrl,
  getMarketCodeListUrl,
  getSaveLocationDetailsUrl,
  getSearchLocationByLocationCode,
  getStateTaxConfigurationListingUrl,
  getStateTaxConfigurationStateDetailsUrl,
  getStateTaxConfigurationTaxDetailsUrl,
  getStateTaxSaveUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  LocationAdpator,
  LocationMasterAdpator,
  StateAdaptor,
  StateTaxConfigurationAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  BrandDataService,
  LovDataService,
  RegionDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  CachingStrategySetting,
  LoadStatesDetailsListingSuccessPayload,
  LoadStateTaxConfigurationListingPayload,
  LocationListingPayload,
  LocationMasterDetails,
  LovMasterEnum,
  StateTaxConfigurationListingResult,
  StateTaxConfigurationStateDetails,
  TaxDetailsConfig,
  TaxDetailsSubmit,
  TaxsList
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
  let service: StateTaxConfigurationService;
  let lovDataService: LovDataService;

  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let lovDataServiceSpy: jasmine.SpyObj<LovDataService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StateTaxConfigurationService,
        LovDataService,

        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        },
        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(StateTaxConfigurationService);
    lovDataService = TestBed.inject(LovDataService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  lovDataServiceSpy = jasmine.createSpyObj<LovDataService>([
    'getLov'
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

  service = new StateTaxConfigurationService(apiServiceSpy, lovDataServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('StateTaxConfigurationListing Details', () => {
    const payload2: StateTaxConfigurationListingResult = {
      stateTaxConfigurationListing: [],
      pageNumber: 0,
      pageSize: 0,
      totalPages: 0,
      totalElements: 0
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationListing'
      ).and.returnValue({});
      const payload: LoadStateTaxConfigurationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const stateName = 'stateName';
      const path = getStateTaxConfigurationListingUrl(
        payload.pageIndex,
        payload.pageSize,
        stateName
      );
      service.getStateTaxConfigurationList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getStateTaxConfigurationListing StateTaxConfigurationAdaptor method with correct arguments', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationListing'
      ).and.returnValue(payload2);

      const payload: LoadStateTaxConfigurationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const stateName = 'stateName';
      const path = getStateTaxConfigurationListingUrl(
        payload.pageIndex,
        payload.pageSize,
        stateName
      );
      service.getStateTaxConfigurationList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload2);
      expect(
        StateTaxConfigurationAdaptor.getStateTaxConfigurationListing
      ).toHaveBeenCalledWith(payload2);
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationListing'
      ).and.returnValue(payload2);

      const payload: LoadStateTaxConfigurationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const stateName = 'stateName';
      const path = getStateTaxConfigurationListingUrl(
        payload.pageIndex,
        payload.pageSize,
        stateName
      );
      service.getStateTaxConfigurationList(payload).subscribe(data => {
        expect(data).toEqual(payload2);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getStateTaxConfigurationStateDetails', () => {
    const payload2: StateTaxConfigurationStateDetails = {
      isActive: true,
      id: '1',
      stateCode: 'KAR',
      stateId: 'ID',
      stateName: 'Karnaataka',
      stateTaxCode: 1,
      taxComponent: {
        cess: [
          {
            cessCode: 'cess code',
            cessOnTax: true,
            selected: true
          }
        ],
        tax: [
          {
            taxCode: 'TaxCode'
          }
        ],
        taxSystem: 'GST'
      }
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationStateDetails'
      ).and.returnValue({});
      const payload = '';
      const path = getStateTaxConfigurationStateDetailsUrl(payload);
      service.getStateTaxConfigurationStateDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getStateTaxConfigurationListing StateTaxConfigurationAdaptor method with correct arguments', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationStateDetails'
      ).and.returnValue(payload2);

      const payload = '';
      const path = getStateTaxConfigurationStateDetailsUrl(payload);
      service.getStateTaxConfigurationStateDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload2);
      expect(
        StateTaxConfigurationAdaptor.getStateTaxConfigurationStateDetails
      ).toHaveBeenCalledWith(payload2);
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationStateDetails'
      ).and.returnValue(payload2);

      const payload = '';
      const path = getStateTaxConfigurationStateDetailsUrl(payload);
      service.getStateTaxConfigurationStateDetails(payload).subscribe(data => {
        expect(data).toEqual(payload2);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getStateTaxConfigurationTaxDetails', () => {
    const payload2: TaxDetailsConfig[] = [
      {
        id: '1',
        isSelected: true,
        taxClassCode: 'code',
        taxDetails: {
          data: { IGST: 3, SGST: 1, UTGST: 0, CGST: 3 }
        }
      }
    ];
    it('should call GET api method with correct url and params', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationTaxDetails'
      ).and.returnValue({});
      const payload = '';
      const path = getStateTaxConfigurationTaxDetailsUrl(payload);
      service.getStateTaxConfigurationTaxDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getStateTaxConfigurationListing StateTaxConfigurationAdaptor method with correct arguments', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationTaxDetails'
      ).and.returnValue(payload2);

      const payload = '';
      const path = getStateTaxConfigurationTaxDetailsUrl(payload);
      service.getStateTaxConfigurationTaxDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload2);
      expect(
        StateTaxConfigurationAdaptor.getStateTaxConfigurationTaxDetails
      ).toHaveBeenCalledWith(payload2);
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationTaxDetails'
      ).and.returnValue(payload2);

      const payload = '';
      const path = getStateTaxConfigurationTaxDetailsUrl(payload);
      service.getStateTaxConfigurationTaxDetails(payload).subscribe(data => {
        expect(data).toEqual(payload2);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getAllStateList', () => {
    const payload2: LoadStatesDetailsListingSuccessPayload = {
      stateDetailsListing: [],
      totalElements: 1
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(StateAdaptor, 'getStateDetailsListing').and.returnValue({});
      const payload = '';
      const path = getAllStateListingUrl();
      service.getAllStateList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getStateDetailsListing StateAdaptor method with correct arguments', () => {
      spyOn(StateAdaptor, 'getStateDetailsListing').and.returnValue(payload2);

      const payload = '';
      const path = getAllStateListingUrl();
      service.getAllStateList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload2);
      expect(StateAdaptor.getStateDetailsListing).toHaveBeenCalledWith(
        payload2
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(StateAdaptor, 'getStateDetailsListing').and.returnValue(payload2);

      const payload = '';
      const path = getAllStateListingUrl();
      service.getAllStateList().subscribe(data => {
        expect(data).toEqual(payload2);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getAllTaxClassList', () => {
    const payload2: string[] = ['A', 'B'];
    it('should call GET api method with correct url and params', () => {
      spyOn(StateTaxConfigurationAdaptor, 'getTaxClassDetails').and.returnValue(
        {}
      );
      const payload = '';
      const path = getAllTaxClassListingUrl();
      service.getAllTaxClassList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call StateTaxConfigurationAdaptor getTaxClassDetails method with correct arguments', () => {
      spyOn(StateTaxConfigurationAdaptor, 'getTaxClassDetails').and.returnValue(
        payload2
      );

      const payload = '';
      const path = getAllTaxClassListingUrl();
      service.getAllTaxClassList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload2);
      expect(
        StateTaxConfigurationAdaptor.getTaxClassDetails
      ).toHaveBeenCalledWith(payload2);
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(StateTaxConfigurationAdaptor, 'getTaxClassDetails').and.returnValue(
        payload2
      );

      const payload = '';
      const path = getAllTaxClassListingUrl();
      service.getAllTaxClassList().subscribe(data => {
        expect(data).toEqual(payload2);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getAllTaxList', () => {
    const payload2: TaxsList[] = [
      {
        description: 'desc',
        isActive: null,
        taxCode: 'code',
        taxSystem: 'system'
      }
    ];
    it('should call GET api method with correct url and params', () => {
      spyOn(StateTaxConfigurationAdaptor, 'getTaxsList').and.returnValue({});
      const payload = '';
      const path = getAllTaxListingUrl();
      service.getAllTaxList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call StateTaxConfigurationAdaptor getTaxsList method with correct arguments', () => {
      spyOn(StateTaxConfigurationAdaptor, 'getTaxsList').and.returnValue(
        payload2
      );

      const payload = '';
      const path = getAllTaxListingUrl();
      service.getAllTaxList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload2);
      expect(StateTaxConfigurationAdaptor.getTaxsList).toHaveBeenCalledWith(
        payload2
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(StateTaxConfigurationAdaptor, 'getTaxsList').and.returnValue(
        payload2
      );

      const payload = '';
      const path = getAllTaxListingUrl();
      service.getAllTaxList().subscribe(data => {
        expect(data).toEqual(payload2);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('saveStateTaxConfigurationStateDetails', () => {
    const payload: StateTaxConfigurationStateDetails = {
      isActive: true,
      id: '1',
      stateCode: 'KAR',
      stateId: 'ID',
      stateName: 'Karnaataka',
      stateTaxCode: 1,
      taxComponent: {
        cess: [
          {
            cessCode: 'cess code',
            cessOnTax: true,
            selected: true
          }
        ],
        tax: [
          {
            taxCode: 'TaxCode'
          }
        ],
        taxSystem: 'GST'
      }
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationStateDetails'
      ).and.returnValue({});
      const path = getStateTaxSaveUrl();
      service.saveStateTaxConfigurationStateDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call StateTaxConfigurationAdaptor getStateTaxConfigurationStateDetails method with correct arguments', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationStateDetails'
      ).and.returnValue(payload);

      const path = getStateTaxSaveUrl();
      service.saveStateTaxConfigurationStateDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(
        StateTaxConfigurationAdaptor.getStateTaxConfigurationStateDetails
      ).toHaveBeenCalledWith(payload);
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationStateDetails'
      ).and.returnValue(payload);

      const path = getStateTaxSaveUrl();
      service.saveStateTaxConfigurationStateDetails(payload).subscribe(data => {
        expect(data).toEqual(payload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('editStateTaxConfigurationStateDetails', () => {
    const payload: StateTaxConfigurationStateDetails = {
      isActive: true,
      id: '1',
      stateCode: 'KAR',
      stateId: 'ID',
      stateName: 'Karnaataka',
      stateTaxCode: 1,
      taxComponent: {
        cess: [
          {
            cessCode: 'cess code',
            cessOnTax: true,
            selected: true
          }
        ],
        tax: [
          {
            taxCode: 'TaxCode'
          }
        ],
        taxSystem: 'GST'
      }
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationStateDetails'
      ).and.returnValue({});
      const path = getStateTaxConfigurationStateDetailsUrl('1');
      service.editStateTaxConfigurationStateDetails(payload, '1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call StateTaxConfigurationAdaptor getStateTaxConfigurationStateDetails method with correct arguments', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationStateDetails'
      ).and.returnValue(payload);

      const path = getStateTaxConfigurationStateDetailsUrl('1');
      service.editStateTaxConfigurationStateDetails(payload, '1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(
        StateTaxConfigurationAdaptor.getStateTaxConfigurationStateDetails
      ).toHaveBeenCalledWith(payload);
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(
        StateTaxConfigurationAdaptor,
        'getStateTaxConfigurationStateDetails'
      ).and.returnValue(payload);

      const path = getStateTaxConfigurationStateDetailsUrl('1');
      service
        .editStateTaxConfigurationStateDetails(payload, '1')
        .subscribe(data => {
          expect(data).toEqual(payload);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('saveStateTaxConfigurationTaxDetails', () => {
    const payload: TaxDetailsSubmit = {
      addStateTaxDetails: [
        {
          taxClassCode: '1',
          taxDetails: {
            data: { IGST: 3, SGST: 1, UTGST: 0, CGST: 3 }
          },
          id: '1'
        }
      ]
    };
    it('should call GET api method with correct url and params', () => {
      const path = getStateTaxConfigurationTaxDetailsUrl('1');
      service.saveStateTaxConfigurationTaxDetails(payload, '1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
});
