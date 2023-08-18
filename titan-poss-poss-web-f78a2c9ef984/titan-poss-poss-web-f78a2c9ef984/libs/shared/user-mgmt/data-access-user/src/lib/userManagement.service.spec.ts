import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  CountryDataService,
  LocationDataService,
  LovDataService,
  StateDataService
} from '@poss-web/shared/masters/data-access-masters';
import { LocationMappingData, RoleInfo } from '@poss-web/shared/models';
import {
  UserManagementAdaptor,
  UserManagementHelper
} from '@poss-web/shared/util-adaptors';
import {
  addUserDataUrl,
  changeUserPasswordUrl,
  getActiveAccessTokenEndpointUrl,
  getActiveRolesUrl,
  getEmailMobileCheckUrl,
  getMappedLocationsDataUrl,
  getRegionsDataUrl,
  getUserDataUrl,
  getUserProfileDataUrl,
  getUserRoleUrl,
  getUsersListUrl
} from '@poss-web/shared/util-api-service';
import {
  POSS_WEB_API_URL,
  POSS_WEB_ENCRYPT_PASSWORD
} from '@poss-web/shared/util-config';
import * as moment from 'moment';
import { of } from 'rxjs';
import { UserManagementService } from './userManagement.service';

describe('UserManagementService ', () => {
  let httpTestingController: HttpTestingController;
  let userManagementService: UserManagementService;
  let mockStateService;
  let mockCountryService;
  let mockLocationService;
  let lovDataServiceSpy;

  const apiUrl = 'http://localhost:3000';

  const dummyUserDetailResponse = {
    emailId: 'arnab01@titan.com',
    empName: 'arnab01',
    employeeCode: 'arnab01',
    hasLoginAccess: true,
    isActive: true,
    isLocked: false,
    isLoginActive: true,
    locationCode: '',
    mobileNo: '8608455701',
    userType: 'ORG',
    address: {
      line1: 'ABCD, , , , ',
      line2: '',
      city: 'Bangalore',
      country: 'India',
      pincode: '751024',
      state: 'KARNATAKA'
    },
    birthDate: moment(),
    joiningDate: moment(),
    resignationDate: moment(),
    regionCode: '',
    primaryRole: 'COMMERCIAL',
    roleName: 'Commercial Team',
    secondaryRole: 'TEST LOCATION FORMAT',
    secondaryRoleName: 'Location Format',
    secondaryendtime: moment(),
    secondarystarttime: moment(),
    resendOTP: true
  };

  const dummyUserDataResponse = {
    employeeCode: 'arnab01',
    empName: 'arnab01',
    locationCode: null,
    userType: 'ORG',
    employeeType: 'PERMANENT',
    mobileNo: '8608455701',
    address: {
      type: 'address',
      data: {
        line1: 'ABCD, , , ',
        line2: '',
        city: 'Bangalore',
        country: 'India',
        pincode: '751024',
        state: 'KARNATAKA'
      }
    },
    joiningDate: moment(),
    resignationDate: moment(),
    birthDate: moment(),
    emailId: 'arnab01@titan.com',
    hasLoginAccess: true,
    forcePasswordChange: true,
    roles: [
      {
        roleCode: 'COMMERCIAL',
        roleName: 'Commercial Team',
        description: 'Commercial Team',
        isPrimary: true,
        startTime: null,
        expiryTime: null,
        corpAccess: true
      },
      {
        roleCode: 'TEST LOCATION FORMAT',
        roleName: 'Location Format',
        description: 'testing adding Location Format Details',
        isPrimary: false,
        startTime: moment(),
        expiryTime: moment(),
        corpAccess: true
      }
    ],
    regionCode: null,
    orgCode: 'TJ',
    requestedMobileNo: null,
    isLoginActive: true,
    isLocked: false,
    isActive: true
  };

  const dummyStateListResponse = {
    results: [
      { stateId: 1, stateCode: 'K', description: 'KARNATAKA' },
      { stateId: 2, stateCode: 'TN', description: 'TAMIL NADU' },
      { stateId: 3, stateCode: 'KL', description: 'KERALA' }
    ],
    pageNumber: 0,
    pageSize: 20,
    totalPages: 3,
    totalElements: 45
  };

  const dummyCountryListResponse = {
    results: [
      { countryCode: 'AUS', description: 'AUSTRALIA' },
      { countryCode: 'GRM', description: 'GERMANY' },
      { countryCode: 'IND', description: 'India' }
    ],
    pageNumber: 0,
    pageSize: 20,
    totalPages: 1,
    totalElements: 6
  };

  const dummyLocationDataResponse = {
    locationCode: 'PNA',
    description: 'Patna - Bailley Road',
    address: 'Jagdeopath MoreBailey Road Patna',
    companyName: 'M/S EXCLUSIVE',
    phoneNo: '9980111111',
    locationEmail: 'PNA@titan.co.in',
    registrationNo: '38ABCDE1234F2Z5',
    ownerTypeCode: 'L3',
    locationTypeCode: 'BTQ',
    regionCode: 'East',
    stateCode: 1,
    isActive: true,
    pincode: 800014,
    baseCurrency: 'INR',
    stockCurrency: 'INR',
    masterCurrency: 'INR',
    paymentCurrencies: 'INR'
  };

  const dummyRoleListResponse = {
    results: [
      {
        roleCode: 'SM',
        roleName: 'Store Manager',
        description: 'Store Manager Test',
        roleType: 'BTQ',
        isActive: true,
        userLimit: 3,
        assignedUsers: 3,
        corpAccess: true
      }
    ],
    pageNumber: 0,
    pageSize: 20,
    totalPages: 1,
    totalElements: 1
  };

  const dummyRoleMapdata: RoleInfo = {
    rolesDetails: [],
    roles: new Map()
  };;
  dummyRoleMapdata.roles.set('SM', 'Store Manager');
  const dummyLocationData: LocationMappingData[] = [
    {
      id: '1',
      description: 'CPD'
    },
    {
      id: '2',
      description: "ABC"
    }
  ]
  beforeEach(() => {
    mockStateService = jasmine.createSpyObj(['getStatesSummary']);
    mockCountryService = jasmine.createSpyObj(['getCountrySummary']);
    lovDataServiceSpy = jasmine.createSpyObj(['getUserLovs']);
    mockLocationService = jasmine.createSpyObj([
      'getLocationSummaryByLocationCode'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserManagementService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        },
        {
          provide: StateDataService,
          useValue: mockStateService
        },
        {
          provide: CountryDataService,
          useValue: mockCountryService
        },
        {
          provide: LocationDataService,
          useValue: mockLocationService
        },
        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        },
        {
          provide: POSS_WEB_ENCRYPT_PASSWORD,
          useValue: false
        },
        {
          provide: 'env',
          useValue: 'dev'
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    userManagementService = TestBed.inject(UserManagementService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(userManagementService).toBeTruthy();
  });

  describe('getUsersList', () => {
    it('should create proper URL for as per parameters passed', () => {
      let url = getUsersListUrl(
        false,
        0,
        5,
        'admin',
        ['BOS', 'SM'],
        ['HNR', 'URB']
      );
      expect(url.path).toEqual('/user/v2/corp/users');

      url = getUsersListUrl(true, 0, 5, undefined, [], []);
      expect(url.path).toEqual('/user/v2/location/users');
    });

    it('should call GET api method with correct url and params', () => {
      spyOn(UserManagementHelper, 'getUserData').and.returnValue({});
      const url = getUsersListUrl(
        false,
        0,
        5,
        'admin',
        ['BOS', 'SM'],
        ['HNR', 'URB']
      );

      userManagementService
        .getUsersList(false, 0, 5, 'admin', ['BOS', 'SM'], ['HNR', 'URB'])
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(url.params.toString());
      expect(request.request.params.get('page')).toEqual('0');
      expect(request.request.params.get('size')).toEqual('5');
      expect(request.request.params.get('searchField')).toEqual('admin');
      expect(request.request.params.get('roleCodes')).toEqual('BOS, SM');
      // expect(request.request.params.get('locationCodes')).toEqual('HNR, URB');
      expect(request.request.params.get('locationCodes')).toEqual('HNR');
      request.flush({});
    });

    it('should call UserManagementHelper method with correct arguments', () => {
      spyOn(UserManagementHelper, 'getUserData').and.returnValue({});
      const dummyResponse = {
        results: [
          {
            employeeCode: 'arnab01',
            empName: 'arnab01',
            locationCode: 'TJ',
            userType: 'ORG',
            employeeType: 'PERMANENT',
            mobileNo: '8608455701',
            primaryRoleCode: 'COMMERCIAL',
            primaryRoleName: 'Commercial Team',
            isLoginActive: true,
            isLocked: false,
            isActive: true
          },
          {
            employeeCode: 'arnab02',
            empName: 'arnab02',
            locationCode: 'TJ',
            userType: 'ORG',
            employeeType: 'PERMANENT',
            mobileNo: '9115671402',
            primaryRoleCode: 'COMMERCIAL',
            primaryRoleName: 'Commercial Team',
            isLoginActive: false,
            isLocked: false,
            isActive: true
          },
          {
            employeeCode: 'Arthur',
            empName: 'Arthur',
            locationCode: 'PNA',
            userType: 'L3',
            employeeType: 'PERMANENT',
            mobileNo: '8765434511',
            primaryRoleCode: null,
            primaryRoleName: null,
            isLoginActive: false,
            isLocked: false,
            isActive: true
          }
        ],
        pageNumber: 0,
        pageSize: 10,
        totalPages: 26,
        totalElements: 254
      };

      const url = getUsersListUrl(true, 0, 5, undefined, [], []);
      userManagementService
        .getUsersList(true, 0, 5, undefined, undefined, undefined)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResponse);
      expect(UserManagementHelper.getUserData).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by UserManagementHelper', () => {
      const dummyResponse = {
        users: [dummyUserDetailResponse],
        totalUsers: 254
      };
      spyOn(UserManagementHelper, 'getUserData').and.returnValue(dummyResponse);

      const url = getUsersListUrl(true, 0, 5, undefined, [], []);

      userManagementService
        .getUsersList(true, 0, 5, undefined, undefined, undefined)
        .subscribe(response => {
          expect(response).toEqual(dummyResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + url.path
      );

      request.flush({});
    });
  });

  describe('loadMappedLocations', () => {
    it('should create proper URL for as per parameters passed', () => {
      let url = getMappedLocationsDataUrl(
        false,
        'ADMIN',
      );
      expect(url).toBeDefined();
    });

    it('should call GET api method with correct url and params', () => {
      spyOn(UserManagementHelper, 'getMappedLocations').and.returnValue({});
      const url = getMappedLocationsDataUrl(
        false,
        'ADMIN',
      );

      userManagementService
        .loadMappedLocations(false, 'ADMIN')
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call UserManagementHelper method with correct arguments', () => {
      spyOn(UserManagementHelper, 'getMappedLocations').and.returnValue({});

      const url = getMappedLocationsDataUrl(false, 'ADMIN');
      userManagementService
        .loadMappedLocations(false, 'ADMIN')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(dummyLocationData);
      expect(UserManagementHelper.getMappedLocations).toHaveBeenCalledWith(
        dummyLocationData
      );
    });

    // it('should retun data mapped by UserManagementHelper', () => {
    //   const dummyResponse = {
    //     users: [dummyUserDetailResponse],
    //     totalUsers: 254
    //   };
    //   spyOn(UserManagementHelper, 'getUserData').and.returnValue(dummyResponse);

    //   const url = getUsersListUrl(true, 0, 5, undefined, [], []);

    //   userManagementService
    //     .getUsersList(true, 0, 5, undefined, undefined, undefined)
    //     .subscribe(response => {
    //       expect(response).toEqual(dummyResponse);
    //     });

    //   const request = httpTestingController.expectOne(
    //     req => req.url === apiUrl + url.path
    //   );

    //   request.flush({});
    // });
  });
  describe('updateMappedLocations', () => {
    it('should create proper URL for as per parameters passed', () => {
      let url = getMappedLocationsDataUrl(
        false,
        'ADMIN',
      );
      expect(url).toBeDefined();
    });

    it('should call GET api method with correct url and params', () => {
      spyOn(UserManagementHelper, 'getMappedLocations').and.returnValue({});
      const url = getMappedLocationsDataUrl(
        false,
        'ADMIN',
      );

      userManagementService
        .updateMappedLocations(false, 'ADMIN',{})
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    // it('should retun data mapped by UserManagementHelper', () => {
    //   const dummyResponse = {
    //     users: [dummyUserDetailResponse],
    //     totalUsers: 254
    //   };
    //   spyOn(UserManagementHelper, 'getUserData').and.returnValue(dummyResponse);

    //   const url = getUsersListUrl(true, 0, 5, undefined, [], []);

    //   userManagementService
    //     .getUsersList(true, 0, 5, undefined, undefined, undefined)
    //     .subscribe(response => {
    //       expect(response).toEqual(dummyResponse);
    //     });

    //   const request = httpTestingController.expectOne(
    //     req => req.url === apiUrl + url.path
    //   );

    //   request.flush({});
    // });
  });

  describe('getUser', () => {
    it('should create proper URL for as per parameters passed', () => {
      let path = getUserDataUrl(false, 'admin');
      expect(path).toEqual('/user/v2/corp/users/admin');

      path = getUserDataUrl(true, 'admin');
      expect(path).toEqual('/user/v2/location/users/admin');
    });

    it('should call GET api method with correct url and params', () => {
      spyOn(UserManagementAdaptor, 'usersfromJson').and.returnValue({});
      const roleCode = 'admin';
      const path = getUserDataUrl(false, roleCode);

      userManagementService.getUser(false, roleCode).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call UserManagementAdaptor method with correct arguments', () => {
      spyOn(UserManagementAdaptor, 'usersfromJson').and.returnValue({});
      const path = getUserDataUrl(false, 'admin');

      userManagementService.getUser(false, 'admin').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyUserDataResponse);
      expect(UserManagementAdaptor.usersfromJson).toHaveBeenCalledWith(
        dummyUserDataResponse
      );
    });

    it('should retun data mapped by UserManagementAdaptor', () => {
      spyOn(UserManagementAdaptor, 'usersfromJson').and.returnValue(
        dummyUserDetailResponse
      );

      const roleCode = 'admin';
      const path = getUserDataUrl(false, roleCode);

      userManagementService.getUser(false, roleCode).subscribe(response => {
        expect(response).toEqual(dummyUserDetailResponse);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  // describe('getUserProfile', () => {
  // it('should call GET api method with correct url and params', () => {
  //   spyOn(UserManagementAdaptor, 'userProfilefromJson').and.returnValue({});
  //   const path = getUserProfileDataUrl();

  //   // spyOn(
  //   //   mockLocationService,
  //   //   'getLocationSummaryByLocationCode'
  //   // ).and.callThrough();

  //   userManagementService.getUserProfile().subscribe();
  //   const request = httpTestingController.expectOne(req => {
  //     return req.url === apiUrl + path;
  //   });

  //   expect(request.cancelled).toBeFalsy();
  //   expect(request.request.method).toEqual('GET');
  //   expect(request.request.responseType).toEqual('json');
  //   request.flush({});
  // });

  // it('should call UserManagementAdaptor with correct arguments', () => {
  //   spyOn(UserManagementAdaptor, 'userProfilefromJson').and.returnValue({});
  //   const path = getUserProfileDataUrl();

  //   userManagementService.getUserProfile().subscribe();
  //   const request = httpTestingController.expectOne(req => {
  //     return req.url === apiUrl + path;
  //   });

  //   request.flush(dummyUserDataResponse);
  //   expect(UserManagementAdaptor.userProfilefromJson).toHaveBeenCalledWith(
  //     dummyUserDataResponse
  //   );
  // });

  // it('should retun data mapped by UserManagementAdaptor', () => {
  //   const dummyResponse = {
  //     emailId: 'admin@mindtree.com',
  //     empName: 'System admin',
  //     employeeCode: 'admin',
  //     locationCode: '',
  //     mobileNo: '8608455812',
  //     userType: 'ORG',
  //     address: {
  //       line1: 'DS Max Silicon, RR Layout, RR Nagar, , ',
  //       line2: '',
  //       city: 'Bangalore',
  //       country: 'India',
  //       pincode: '751024',
  //       state: 'HARYANA'
  //     },
  //     birthDate: moment(),
  //     joiningDate: moment(),
  //     roleName: 'ADMIN (System Admin)',
  //     employeeType: 'PERMANENT',
  //     validateMobile: false
  //   };
  //   spyOn(UserManagementAdaptor, 'userProfilefromJson').and.returnValue(
  //     dummyResponse
  //   );
  //   const path = getUserProfileDataUrl();

  //   userManagementService.getUserProfile().subscribe(response => {
  //     expect(response).toEqual(dummyResponse);
  //   });
  //   const request = httpTestingController.expectOne(req => {
  //     return req.url === apiUrl + path;
  //   });

  //   request.flush({});
  // });
  // });

  describe('loadStates', () => {
    it('should call getStateData method of UserManagementHelper with correct arguments', () => {
      spyOn(UserManagementHelper, 'getStateData').and.returnValue({});
      mockStateService.getStatesSummary.and.returnValue(
        of(dummyStateListResponse)
      );

      userManagementService.loadStates('IND').subscribe();
      expect(UserManagementHelper.getStateData).toHaveBeenCalledWith(
        dummyStateListResponse
      );
    });

    it('should retun data mapped by getStateData method of UserManagementHelper', () => {
      const dummyResponse = ['KARNATAKA', 'TAMIL NADU', 'KERALA'];
      spyOn(UserManagementHelper, 'getStateData').and.returnValue(
        dummyResponse
      );
      mockStateService.getStatesSummary.and.returnValue(
        of(dummyStateListResponse)
      );

      userManagementService.loadStates('IND').subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });
    });
  });

  describe('loadCountries', () => {
    it('should call getCountryData method of UserManagementHelper with correct arguments', () => {
      spyOn(UserManagementHelper, 'getCountryData').and.returnValue({});
      mockCountryService.getCountrySummary.and.returnValue(
        of(dummyCountryListResponse)
      );

      userManagementService.loadCountries().subscribe();
      expect(UserManagementHelper.getCountryData).toHaveBeenCalledWith(
        dummyCountryListResponse
      );
    });

    it('should retun data mapped by getCountryData method of UserManagementHelper', () => {
      spyOn(UserManagementHelper, 'getCountryData').and.returnValue(
        dummyCountryListResponse.results
      );
      mockCountryService.getCountrySummary.and.returnValue(
        of(dummyCountryListResponse)
      );

      userManagementService.loadCountries().subscribe(response => {
        expect(response).toEqual(dummyCountryListResponse.results);
      });
    });
  });

  describe('loadlocations', () => {
    it('should call getLocationCodeData method of UserManagementHelper with correct arguments', () => {
      spyOn(UserManagementHelper, 'getLocationCodeData').and.returnValue({});
      mockLocationService.getLocationSummaryByLocationCode.and.returnValue(
        of(dummyLocationDataResponse)
      );

      userManagementService.loadlocations('PNA').subscribe();
      expect(UserManagementHelper.getLocationCodeData).toHaveBeenCalledWith(
        dummyLocationDataResponse
      );
    });

    it('should retun data mapped by getLocationCodeData method of UserManagementHelper', () => {
      const dummyResponse = { locationCode: 'PNA', countryCode: undefined };
      spyOn(UserManagementHelper, 'getLocationCodeData').and.returnValue(
        dummyResponse
      );
      mockLocationService.getLocationSummaryByLocationCode.and.returnValue(
        of(dummyLocationDataResponse)
      );

      userManagementService.loadlocations('PNA').subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });
    });
  });

  describe('loadUserRoles', () => {
    it('should create proper URL for as per parameters passed', () => {
      let url = getUserRoleUrl(false, 'CORP', 'URB');
      expect(url.path).toEqual('/user/v2/corp/roles');

      url = getUserRoleUrl(true, 'BTQ');
      expect(url.path).toEqual('/user/v2/location/roles');
    });

    it('should call GET api method with correct url and params', () => {
      spyOn(UserManagementHelper, 'getRolesData').and.returnValue({});
      const url = getUserRoleUrl(false, 'CORP', 'URB');

      userManagementService.loadUserRoles(false, 'CORP', 'URB').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(url.params.toString());
      expect(request.request.params.get('isActive')).toEqual('true');
      expect(request.request.params.get('corpAccess')).toEqual('true');
      expect(request.request.params.get('roleType')).toEqual('CORP');
      expect(request.request.params.get('locationCode')).toEqual('URB');
      request.flush({});
    });

    it('should call UserManagementHelper method with correct arguments', () => {
      spyOn(UserManagementHelper, 'getRolesData').and.returnValue({});
      const url = getUserRoleUrl(false, 'BTQ', 'URB');

      userManagementService.loadUserRoles(false, 'BTQ', 'URB').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyRoleListResponse);
      expect(UserManagementHelper.getRolesData).toHaveBeenCalledWith(
        dummyRoleListResponse
      );
    });

    it('should retun data mapped by UserManagementHelper', () => {
      spyOn(UserManagementHelper, 'getRolesData').and.returnValue(
        dummyRoleMapdata
      );
      const url = getUserRoleUrl(false, 'BTQ', 'URB');

      userManagementService
        .loadUserRoles(false, 'BTQ', 'URB')
        .subscribe(response => {
          expect(response).toEqual(dummyRoleMapdata);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadActiveRoles', () => {
    it('should create proper URL for as per parameters passed', () => {
      let url = getActiveRolesUrl(false);
      expect(url.path).toEqual('/user/v2/corp/roles');

      url = getActiveRolesUrl(true);
      expect(url.path).toEqual('/user/v2/location/roles');
    });

    it('should call GET api method with correct url and params', () => {
      spyOn(UserManagementHelper, 'getRolesData').and.returnValue({});
      const url = getActiveRolesUrl(false);

      userManagementService.loadActiveRoles(false).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(url.params.toString());
      expect(request.request.params.get('isActive')).toEqual('true');
      request.flush({});
    });

    it('should call UserManagementHelper method with correct arguments', () => {
      spyOn(UserManagementHelper, 'getRolesData').and.returnValue({});
      const url = getActiveRolesUrl(false);

      userManagementService.loadActiveRoles(false).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyRoleListResponse);
      expect(UserManagementHelper.getRolesData).toHaveBeenCalledWith(
        dummyRoleListResponse
      );
    });

    it('should retun data mapped by UserManagementHelper', () => {
      spyOn(UserManagementHelper, 'getRolesData').and.returnValue(
        dummyRoleMapdata
      );
      const url = getActiveRolesUrl(false);

      userManagementService.loadActiveRoles(false).subscribe(response => {
        expect(response).toEqual(dummyRoleMapdata);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('addUser', () => {
    it('should create proper URL for as per parameters passed', () => {
      let path = addUserDataUrl(false);
      expect(path).toEqual('/user/v2/corp/users');

      path = addUserDataUrl(true);
      expect(path).toEqual('/user/v2/location/users');
    });

    it('should call POST api method with correct url and params', () => {
      const userData = {
        address: {
          data: {
            line1: 'Abc Apt.',
            line2: '',
            city: 'Bangalore',
            country: 'India',
            pincode: '560059',
            state: 'PONDICHERRY'
          },
          type: 'address'
        },
        birthDate: '2020-03-30T18:29:59.000Z',
        empName: 'Test 1 User',
        isLoginActive: true,
        employeeCode: 'Test1',
        organizationCode: 'TJ',
        joiningDate: '2020-03-30T18:29:59.000Z',
        resignationDate: '2020-05-07T18:29:59.000Z',
        emailId: 'abd@titan.com',
        mobileNo: '9798788686',
        primaryRoleCode: 'Corp Role',
        tempRoleCodes: ['COMMERCIAL'],
        expiryTime: '2020-04-23T18:29:59.000Z',
        startTime: '2020-04-08T18:29:59.000Z'
      };
      const path = addUserDataUrl(false);

      userManagementService.addUser(false, userData).subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(JSON.parse(request.request.body)).toEqual(userData);
      request.flush({});
    });
  });

  describe('updateUser', () => {
    it('should call updateUser PATCH api method with correct url and params', () => {
      const userData = {
        address: {
          data: {
            line1: 'ABCD, , ',
            line2: '',
            city: 'Bangalore',
            country: 'India',
            pincode: '751024',
            state: 'KARNATAKA'
          },
          type: 'address'
        },
        birthDate: '2020-03-30T18:29:59.000Z',
        joiningDate: '2020-04-01T18:29:59.000Z',
        resignationDate: '2020-04-24T18:29:59.000Z',
        addTempRoleCodes: ['ADMIN'],
        expiryTime: '2020-04-23T18:29:59.000Z',
        startTime: '2020-04-14T18:29:59.000Z'
      };
      const path = getUserDataUrl(false, 'admin');

      userManagementService.updateUser(false, 'admin', userData).subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(JSON.parse(request.request.body)).toEqual(userData);
      request.flush({});
    });
  });

  describe('changePassword', () => {
    it('should call changePassword PATCH api method with correct url and params', () => {
      const path = changeUserPasswordUrl();

      userManagementService
        .changePassword('welcome123', 'mindtree12')
        .subscribe();
      const request = httpTestingController.expectOne(apiUrl + path);

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.url).toMatch(path);
      expect(JSON.parse(request.request.body).oldPassword).toEqual(
        window.btoa('welcome123')
      );
      expect(JSON.parse(request.request.body).newPassword).toEqual(
        window.btoa('mindtree12')
      );
      request.flush({});
    });
  });

  describe('checkMobileEmail', () => {
    it('should call GET api method with correct url and params', () => {
      const url = getEmailMobileCheckUrl('EMAIL', 'abc@mail.com');

      userManagementService
        .checkMobileEmail('EMAIL', 'abc@mail.com')
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(url.params.toString());
      expect(request.request.params.get('uniqueType')).toEqual('EMAIL');
      expect(request.request.params.get('value')).toEqual('abc@mail.com');
      request.flush({});
    });
  });

  describe('getRegions', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(UserManagementHelper, 'getMappedRegions').and.returnValue({})
      const url = getRegionsDataUrl();

      userManagementService
        .getRegions()
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      request.flush({});
    });
  });

  describe('getUserProfile', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(UserManagementAdaptor, 'userProfilefromJson').and.returnValue({})
      const url = getUserProfileDataUrl();

      userManagementService
        .getUserProfile()
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      // request.flush({});
    });
  });
  describe('changePassword', () => {
    it('should call GET api method with correct url and params', () => {
      const url = changeUserPasswordUrl();

      userManagementService
        .changePassword('a','b')
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      request.flush({});
    });
  });
});
