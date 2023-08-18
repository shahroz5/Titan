import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ProfileDataService } from './profile-data.service';
import { LocationDataService } from '@poss-web/shared/masters/data-access-masters';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { getUserProfileDataUrl } from '@poss-web/shared/util-api-service';
import { ProfileDataAdaptor } from '@poss-web/shared/util-adaptors';
import { ProfileData, Location } from '@poss-web/shared/models';
import { of } from 'rxjs';

describe('ProfileDataService ', () => {
  let httpTestingController: HttpTestingController;
  let profileDataService: ProfileDataService;
  let mockLocationDataService;
  let mockAppsettingFacade;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    mockLocationDataService = jasmine.createSpyObj([
      'getLocationSummaryByLocationCode'
    ]);
    mockAppsettingFacade = jasmine.createSpyObj(['getStoreType']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProfileDataService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        },
        {
          provide: LocationDataService,
          useValue: mockLocationDataService
        },
        {
          provide: AppsettingFacade,
          useValue: mockAppsettingFacade
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    profileDataService = TestBed.inject(ProfileDataService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(profileDataService).toBeTruthy();
  });

  describe('loadUserProfile', () => {
    const profileData: ProfileData = {
      empName: 'System Admin',
      email: 'abcd@titan.com',
      userType: 'CORP',
      boutiqueType: 'ORG',
      boutiqueCode: '',
      boutiqueDesc: '',
      isBTQUser: false,
      isCorpUser: true,
      isRegUser: false,
      regionCode: null,
      isL1Boutique: false,
      isL2Boutique: false,
      isL3Boutique: false,
      orgCode: 'TJ',
      address: null,
      roles: null
    };
    const locationSummary: Location = {
      address: '',
      brandCode: 'Tanishq',
      description: 'Tanishq Store',
      isActive: true,
      locationCode: 'TJ',
      locationTypeCode: 'ORG',
      phoneNo: '9876543219',
      regionCode: '',
      stateCode: 560066,
      townCode: 34,
      cfaCodeValue: '',
      configDetails: null,
      contactNo: '9876543219',
      countryCode: 91,
      factoryCodeValue: '',
      fax: '',
      locationEmail: 'tanishq@tanishq.in',
      locationFormat: 'LF',
      ownerTypeCode: '',
      pincode: 560066,
      registrationNo: ''
    };
    // it('should call GET api method with correct url and params', () => {
    //   const url = getUserProfileDataUrl();
    //   spyOn(profileDataService, 'loadUserProfile').and.returnValue(
    //     of(profileData)
    //   );
    //   profileDataService.loadUserProfile().subscribe();
    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === url;
    //   });

    //   expect(request.cancelled).toBeFalsy();
    //   expect(request.request.method).toEqual('GET');
    //   expect(request.request.responseType).toEqual('json');
    //   expect(request.error).toBe(null);
    //   request.flush({});
    // });

    //   it('should call ProfileDataAdaptor method', () => {
    //     mockLocationDataService.getLocationSummaryByLocationCode.and.returnValue(
    //       of(locationSummary)
    //     );
    //     spyOn(profileDataService, 'loadUserProfile').and.returnValue(
    //       of(profileData)
    //     );
    //     const url = getUserProfileDataUrl();
    //     profileDataService.loadUserProfile().subscribe();
    //     const request = httpTestingController.expectOne(req => {
    //       return req.url === apiUrl + url;
    //     });

    //     request.flush(locationSummary);
    //     expect(ProfileDataAdaptor.profileDatafromJson).toHaveBeenCalledWith(
    //       locationSummary
    //     );
    //   });

    //   it('should retun data mapped by RoleManagementHelper', () => {
    //     spyOn(ProfileDataAdaptor, 'profileDatafromJson').and.returnValue(
    //       of(profileData)
    //     );
    //     spyOn(profileDataService, 'loadUserProfile').and.returnValue(
    //       of(profileData)
    //     );
    //     const url = getUserProfileDataUrl();
    //     profileDataService.loadUserProfile().subscribe(response => {
    //       expect(response).toEqual(profileData);
    //     });

    //     const request = httpTestingController.expectOne(
    //       req => req.url === apiUrl + url
    //     );

    //     request.flush({});
    //   });
  });
});
