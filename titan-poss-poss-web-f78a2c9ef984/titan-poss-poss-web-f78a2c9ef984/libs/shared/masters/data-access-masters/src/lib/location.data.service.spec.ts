import { LocationDataService } from './location.data.service';

import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '@poss-web/shared/util-api-service';
import { of } from 'rxjs';

import {
  CachingStrategySetting,
  LocationFilter
} from '@poss-web/shared/models';
import {
  CacheableApiService,
  DexieService,
  HashkeyGeneratorService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';

describe('Testing location Master Data Service Functionality', () => {
  let service: LocationDataService;
  let cacheableApiService: CacheableApiService;

  const http: HttpClient = null;

  let testLocations: any;
  let testLocationsDummy: any;
  let activeLocations: any;
  let activeLocationsDummy: any;
  let location: any;
  let locationDummy: any;
  let locationDummy1: any;
  let locationSummaryData: any;
  let locationSummaryDataDummy: any;
  let locationSummaryListData: any;
  let locationResposne: any;

  beforeAll(() => {
    testLocations = {
      results: [
        {
          locationCode: '$',
          brandCode: 'Tanishqqq',
          townId: 46,
          stateId: 20,
          regionCode: 'EAST',
          locationTypeCode: 'BTQ',
          isActive: false,
          address:
            'UNIT NO:- DD 26 NEAR SECURITY CHECK IN GATE A,DOMESTIC TERMINAL, KOLKATA AIRPORT',
          phoneNo: '9980XXXXXX',
          description: null,
          cfaCodeValue: '',
          configDetails: {},
          contactNo: '',
          countryCode: 0,
          factoryCodeValue: '',
          fax: '',
          locationEmail: '',
          locationFormat: '',
          ownerTypeCode: '',
          pincode: 0,
          registrationNo: ''
        },
        {
          locationCode: '$1',
          brandCode: 'Tanishq',
          townId: 46,
          stateId: 20,
          regionCode: 'EAST',
          locationTypeCode: 'BTQ',
          isActive: false,
          address:
            'UNIT NO:- DD 26 NEAR SECURITY CHECK IN GATE A,DOMESTIC TERMINAL, KOLKATA AIRPORT',
          phoneNo: '9980XXXXXX',
          description: null,
          cfaCodeValue: '',
          configDetails: {},
          contactNo: '',
          countryCode: 0,
          factoryCodeValue: '',
          fax: '',
          locationEmail: '',
          locationFormat: '',
          ownerTypeCode: '',
          pincode: 0,
          registrationNo: ''
        },
        {
          locationCode: '1',
          brandCode: null,
          townId: 16,
          stateId: 4,

          regionCode: 'East',
          locationTypeCode: 'FAC',
          isActive: true,
          address: 'Bangalore',
          phoneNo: '9010462817',
          description: null,
          cfaCodeValue: '',
          configDetails: {},
          contactNo: '',
          countryCode: 0,
          factoryCodeValue: '',
          fax: '',
          locationEmail: '',
          locationFormat: '',
          ownerTypeCode: '',
          pincode: 0,
          registrationNo: ''
        }
      ],
      totalElements: 50
    };
    testLocationsDummy = {
      results: [
        {
          locationCode: '$',
          brandCode: 'Tanishqqq',
          townCode: 46,
          stateCode: 20,
          regionCode: 'EAST',
          locationTypeCode: 'BTQ',
          isActive: false,
          address:
            'UNIT NO:- DD 26 NEAR SECURITY CHECK IN GATE A,DOMESTIC TERMINAL, KOLKATA AIRPORT',
          phoneNo: '9980XXXXXX',
          description: null,
          cfaCodeValue: '',
          configDetails: {},
          contactNo: '',
          countryCode: 0,
          factoryCodeValue: '',
          fax: '',
          locationEmail: '',
          locationFormat: '',
          ownerTypeCode: '',
          pincode: 0,
          registrationNo: ''
        },
        {
          locationCode: '$1',
          brandCode: 'Tanishq',
          townCode: 46,
          stateCode: 20,
          regionCode: 'EAST',
          locationTypeCode: 'BTQ',
          isActive: false,
          address:
            'UNIT NO:- DD 26 NEAR SECURITY CHECK IN GATE A,DOMESTIC TERMINAL, KOLKATA AIRPORT',
          phoneNo: '9980XXXXXX',
          description: null,
          cfaCodeValue: '',
          configDetails: {},
          contactNo: '',
          countryCode: 0,
          factoryCodeValue: '',
          fax: '',
          locationEmail: '',
          locationFormat: '',
          ownerTypeCode: '',
          pincode: 0,
          registrationNo: ''
        },
        {
          locationCode: '1',
          brandCode: null,
          townCode: 16,
          stateCode: 4,

          regionCode: 'East',
          locationTypeCode: 'FAC',
          isActive: true,
          address: 'Bangalore',
          phoneNo: '9010462817',
          description: null,
          cfaCodeValue: '',
          configDetails: {},
          contactNo: '',
          countryCode: 0,
          factoryCodeValue: '',
          fax: '',
          locationEmail: '',
          locationFormat: '',
          ownerTypeCode: '',
          pincode: 0,
          registrationNo: ''
        }
      ],
      totalElements: 50
    };
    activeLocations = {
      results: [
        {
          locationCode: '$',
          brandCode: 'Tanishq',
          townId: 46,
          stateId: 20,
          regionCode: 'EAST',
          locationTypeCode: 'BTQ',
          isActive: true,
          address:
            'UNIT NO:- DD 26 NEAR SECURITY CHECK IN GATE A,DOMESTIC TERMINAL, KOLKATA AIRPORT',
          phoneNo: '9980XXXXXX',
          description: null,
          cfaCodeValue: '',
          configDetails: {},
          contactNo: '',
          countryCode: 0,
          factoryCodeValue: '',
          fax: '',
          locationEmail: '',
          locationFormat: '',
          ownerTypeCode: '',
          pincode: 0,
          registrationNo: ''
        }
      ]
    };
    activeLocationsDummy = {
      results: [
        {
          locationCode: '$',
          brandCode: 'Tanishq',
          townCode: 46,
          stateCode: 20,
          regionCode: 'EAST',
          locationTypeCode: 'BTQ',
          isActive: true,
          address:
            'UNIT NO:- DD 26 NEAR SECURITY CHECK IN GATE A,DOMESTIC TERMINAL, KOLKATA AIRPORT',
          phoneNo: '9980XXXXXX',
          description: null,
          cfaCodeValue: '',
          configDetails: {},
          contactNo: '',
          countryCode: 0,
          factoryCodeValue: '',
          fax: '',
          locationEmail: '',
          locationFormat: '',
          ownerTypeCode: '',
          pincode: 0,
          registrationNo: ''
        }
      ]
    };
    location = {
      locationCode: '1',
      brandCode: null,
      townId: 16,
      stateId: 4,
      regionCode: 'East',
      locationTypeCode: 'FAC',
      isActive: true,
      address: 'Bangalore',
      phoneNo: '9010462817',
      description: null,
      cfaCodeValue: '',
      configDetails: {},
      contactNo: '',
      countryCode: 0,
      factoryCodeValue: '',
      fax: '',
      locationEmail: '',
      locationFormat: '',
      ownerTypeCode: '',
      pincode: 0,
      registrationNo: ''
    };
    locationDummy = {
      locationCode: '1',
      brandCode: null,
      townCode: 16,
      stateCode: 4,
      regionCode: 'East',
      locationTypeCode: 'FAC',
      isActive: true,
      address: 'Bangalore',
      phoneNo: '9010462817',
      description: null,
      cfaCodeValue: '',
      configDetails: {},
      contactNo: '',
      countryCode: 0,
      factoryCodeValue: '',
      fax: '',
      locationEmail: '',
      locationFormat: '',
      ownerTypeCode: '',
      pincode: 0,
      registrationNo: ''
    };

    locationDummy1 = {
      locationCode: '1',
      brandCode: null,
      townId: 16,
      stateId: 4,
      regionCode: 'East',
      locationTypeCode: 'FAC',
      isActive: true,
      address: 'Bangalore',
      phoneNo: '9010462817',
      description: null,
      cfaCodeValue: '',
      configDetails: {},
      contactNo: '',
      countryCode: 0,
      factoryCodeValue: '',
      fax: '',
      locationEmail: '',
      locationFormat: '',
      ownerTypeCode: '',
      pincode: 0,
      registrationNo: ''
    };
    locationSummaryData = {
      description: 'Chennai - Usman Road',
      address: '46, NORTH USMAN ROADT NAGAR',
      pincode: 600017,
      phoneNo: '9980XXXXXX',
      contactNo: '9980XXXXXX',
      fax: '50',
      locationEmail: 'URB@titan.co.in',
      locationTypeCode: 'BTQ',
      registrationNo: '33AAACT5131A1Z4',
      townId: 4,
      stateId: 2,
      countryCode: 1,
      regionCode: 'SOUTH',
      ownerTypeCode: 'L1',
      factoryCodeValue: 'URB',
      locationFormat: 'LF',
      brandCode: 'Tanishq',
      configDetails: null,
      isActive: true,
      cfaCodeValue: 'URB',
      baseCurrency: 'INR',
      stockCurrency: 'INR',
      masterCurrency: 'INR',
      paymentCurrencies: 'INR',
      companyName: 'TITAN COMPANY LIMITED',
      locationCode: 'URB',
      factoryDetails: {
        locationCode: 'FHJR',
        brandCode: 'Tanishq',
        townId: 9,
        stateId: 2,
        regionCode: 'SOUTH',
        locationTypeCode: 'FAC',
        isActive: true,
        address: 'JEWELLERY STORES29, SIPCOT INDL. COMPLEX,HOSUR',
        phoneNo: '9980XXXXXX',
        description: 'Hosur Factory',
        companyName: 'TITAN COMPANY LIMITED'
      },
      cfaDetails: {
        locationCode: 'PAT',
        brandCode: 'Tanishq',
        townId: 47,
        stateId: 21,
        regionCode: 'EAST',
        locationTypeCode: 'CFA',
        isActive: true,
        address: '229 B SRIKRISHNA PURIBORING ROAD',
        phoneNo: '9980XXXXXX',
        description: 'PAT',
        companyName: 'TITAN INDUSTRIES LIMITED'
      }
    };
    locationSummaryDataDummy = {
      description: 'Chennai - Usman Road',
      address: '46, NORTH USMAN ROADT NAGAR',
      pincode: 600017,
      phoneNo: '9980XXXXXX',
      contactNo: '9980XXXXXX',
      fax: '50',
      locationEmail: 'URB@titan.co.in',
      locationTypeCode: 'BTQ',
      registrationNo: '33AAACT5131A1Z4',
      townCode: 4,
      stateCode: 2,
      countryCode: 1,
      regionCode: 'SOUTH',
      ownerTypeCode: 'L1',
      factoryCodeValue: 'URB',
      locationFormat: 'LF',
      brandCode: 'Tanishq',
      configDetails: null,
      isActive: true,
      cfaCodeValue: 'URB',
      baseCurrency: 'INR',
      stockCurrency: 'INR',
      masterCurrency: 'INR',
      paymentCurrencies: 'INR',
      companyName: 'TITAN COMPANY LIMITED',
      locationCode: 'URB',
      factoryDetails: {
        locationCode: 'FHJR',
        brandCode: 'Tanishq',
        townId: 9,
        stateId: 2,
        regionCode: 'SOUTH',
        locationTypeCode: 'FAC',
        isActive: true,
        address: 'JEWELLERY STORES29, SIPCOT INDL. COMPLEX,HOSUR',
        phoneNo: '9980XXXXXX',
        description: 'Hosur Factory',
        companyName: 'TITAN COMPANY LIMITED'
      },
      cfaDetails: {
        locationCode: 'PAT',
        brandCode: 'Tanishq',
        townId: 47,
        stateId: 21,
        regionCode: 'EAST',
        locationTypeCode: 'CFA',
        isActive: true,
        address: '229 B SRIKRISHNA PURIBORING ROAD',
        phoneNo: '9980XXXXXX',
        description: 'PAT',
        companyName: 'TITAN INDUSTRIES LIMITED'
      }
    };
    locationSummaryListData = {
      results: [
        {
          locationCode: '$',
          description: '$'
        },
        {
          locationCode: '$1',
          description: '$1'
        },
        {
          locationCode: '1',
          description: 'short loc code'
        },
        {
          locationCode: '3',
          description: '3'
        },
        {
          locationCode: '33',
          description: '33'
        },
        {
          locationCode: '44',
          description: '44'
        },
        {
          locationCode: '5',
          description: '5'
        },
        {
          locationCode: '54',
          description: '54'
        },
        {
          locationCode: 'AAZ',
          description: 'AAZ'
        },
        {
          locationCode: 'AB1',
          description: 'AB1'
        },
        {
          locationCode: 'ABD',
          description: 'Ahemdabad'
        },
        {
          locationCode: 'ABL',
          description: 'Ambala'
        },
        {
          locationCode: 'ABOP',
          description: 'AIRPORT -KOLKATA'
        },
        {
          locationCode: 'ABR',
          description: 'Indore - AB Road'
        },
        {
          locationCode: 'ABT',
          description: 'Aurangabad'
        },
        {
          locationCode: 'ABX',
          description: 'ABX'
        },
        {
          locationCode: 'ACH',
          description: 'ACH-Chandkheda'
        },
        {
          locationCode: 'ADH',
          description: 'Mumbai - Andheri'
        },
        {
          locationCode: 'ADR',
          description: 'Chennai - Adayar'
        },
        {
          locationCode: 'AEC',
          description: 'Tanishq (ecom)'
        }
      ],
      pageNumber: 0,
      pageSize: 20,
      totalPages: 26,
      totalElements: 502
    };

    locationResposne = {
      locationCode: '1',
      brandCode: null,
      townCode: 16,
      stateCode: 4,
      regionCode: 'East',
      locationTypeCode: 'FAC',
      isActive: true,
      address: 'Bangalore',
      phoneNo: '9010462817',
      description: null,
      cfaCodeValue: '',
      configDetails: {},
      contactNo: '',
      countryCode: 0,
      factoryCodeValue: '',
      fax: '',
      locationEmail: '',
      locationFormat: '',
      ownerTypeCode: '',
      pincode: 0,
      registrationNo: ''
    };
  });
  beforeEach(() => {
    const indexedDBStorage = new DexieService();
    const cachingStrategySettings: CachingStrategySetting[] = [
      {
        type: 3,
        name: 'InvalidatedBySize',
        category: 'cache',
        size: 1,
        unit: 'MB'
      }
    ];
    cacheableApiService = new CacheableApiService(
      new HashkeyGeneratorService('test'),
      new StorageFacade(indexedDBStorage),
      new ApiService(http, 'test'),
      cachingStrategySettings
    );

    service = new LocationDataService(cacheableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get 3 locations', () => {
    spyOn(cacheableApiService, 'post').and.returnValue(of(testLocations));

    // act
    service.getLocations().subscribe(x => {
      expect(x.length).toEqual(3);
    });
  });

  it('should get all locations', () => {
    spyOn(cacheableApiService, 'post').and.returnValue(of(testLocations));

    // act
    service.getLocations().subscribe(x => {
      expect(x).toEqual(testLocationsDummy.results);
    });
  });
  it('should get total count of locations', () => {
    spyOn(cacheableApiService, 'post').and.returnValue(of(testLocations));

    // act
    service.getLocationsCount().subscribe(x => {
      expect(x).toEqual(testLocationsDummy.totalElements);
    });
  });
  it('should get 1 Active location', () => {
    spyOn(cacheableApiService, 'post').and.returnValue(of(activeLocations));

    // act
    service.getLocations(null, true).subscribe(x => {
      expect(x.length).toEqual(1);
    });
  });

  it('should get all the Active location', () => {
    spyOn(cacheableApiService, 'post').and.returnValue(of(activeLocations));

    // act
    service.getLocations(null, true).subscribe(x => {
      expect(x).toEqual(activeLocationsDummy.results);
    });
  });
  it('should get all the sorted by location', () => {
    spyOn(cacheableApiService, 'post').and.returnValue(of(testLocations));

    service
      .getLocations(null, null, null, null, null, ['brandCode,ASC'])
      .subscribe(x => {
        expect(x).toEqual(testLocationsDummy.results);
      });
  });

  it('should get location by locationCode', () => {
    const locationCode = '1';
    spyOn(cacheableApiService, 'get').and.returnValue(of(location));

    service.getLocationByCode(locationCode).subscribe(x => {
      expect(x).toEqual(locationDummy);
    });
  });
  it('should get location from stores', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(locationSummaryData));

    service.getLocationSummary().subscribe(x => {
      expect(x).toEqual(locationSummaryDataDummy);
    });
  });

  it('should get locationSummary by locationCode', () => {
    const locationCode = '1';

    spyOn(cacheableApiService, 'get').and.returnValue(of(locationDummy1));

    service.getLocationSummaryByLocationCode(locationCode).subscribe(x => {
      expect(x).toEqual(locationResposne);
    });
  });

  it('should get locationSummary for Inter Boutique Transfer(IBT)', () => {
    spyOn(cacheableApiService, 'get').and.returnValue(of(testLocations));

    service.getIBTLocationsSummary().subscribe(x => {
      expect(x).toEqual(testLocationsDummy.results);
    });
  });
  it('should get Location Summary List ', () => {
    spyOn(cacheableApiService, 'post').and.returnValue(
      of(locationSummaryListData)
    );

    service.getLocationSummaryList({}).subscribe(x => {
      expect(x).toEqual(locationSummaryListData.results);
    });
  });
});
