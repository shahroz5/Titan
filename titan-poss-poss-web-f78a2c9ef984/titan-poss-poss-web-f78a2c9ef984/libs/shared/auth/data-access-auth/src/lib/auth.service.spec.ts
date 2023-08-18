import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { UAFacade } from '@poss-web/shared/user-agent/data-access-user-agent';
import { ApiService } from '@poss-web/shared/util-api-service';
import {
  LocalStorageService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';
import {
  POSS_WEB_API_URL,
  POSS_WEB_BRAND_CODE,
  POSS_WEB_ENCRYPT_PASSWORD
} from '@poss-web/shared/util-config';
import { of } from 'rxjs';
import { AuthenticationService } from './auth.service';
import { CryptoService } from './crypto.service';

describe('Auth Service Testing Suite', () => {
  let httpTestingController: HttpTestingController;
  let authService: AuthenticationService;
  const apiUrl = 'http://localhost:3000';
  let apiServiceSpy;
  let storageFacadeSpy;
  let appSettingFacadeSpy;
  let userAgentFacadeSpy;
  // let cryptoServiceSpy;
  let localStorageServiceSpy;
  // spyOn(mockSomeService, 'getData').and.returnValue(Observable.of(someData));

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj<ApiService>([
      'FromHeader',
      'AuthorizationHeader',
      'get',
      'post',
      'delete'
    ]);
    storageFacadeSpy = jasmine.createSpyObj(['clearCachedDataForUser']);
    appSettingFacadeSpy = jasmine.createSpyObj([
      'changeStoreType',
      'setHostName'
    ]);
    userAgentFacadeSpy = jasmine.createSpyObj(['getEncryptedHostname']);
    // cryptoServiceSpy = jasmine.createSpyObj(['encryptPassword']);
    localStorageServiceSpy = jasmine.createSpyObj([
      'getDataFromStore',
      'setCache'
    ]);

    userAgentFacadeSpy.getEncryptedHostname.and.returnValue(
      of('encryptedHostName')
    );

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        CryptoService,
        {
          provide: ApiService,
          useValue: apiServiceSpy
        },
        {
          provide: StorageFacade,
          useValue: storageFacadeSpy
        },
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        },
        {
          provide: AppsettingFacade,
          useValue: appSettingFacadeSpy
        },
        {
          provide: UAFacade,
          useValue: userAgentFacadeSpy
        },

        {
          provide: LocalStorageService,
          useValue: localStorageServiceSpy
        },
        {
          provide: POSS_WEB_ENCRYPT_PASSWORD,
          useValue: false
        },
        {
          provide: 'env',
          useValue: 'DEV'
        },
        {
          provide: POSS_WEB_BRAND_CODE,
          useValue: 'Tanishq'
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthenticationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  // describe('login', () => {
  //   it('should call GET api method with correct url and params', () => {
  //     // spyOn(RoleManagementHelper, 'getRolesData').and.returnValue({});

  //     const url = getAllRolesUrl(0, 5, 'admin', '', '');

  //     roleManagementService
  //       .loadRoles({ pageNumber: 0, pageSize: 5, roleCode: 'admin' })
  //       .subscribe();
  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + url.path;
  //     });

  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('GET');
  //     expect(request.request.responseType).toEqual('json');
  //     expect(request.request.params.toString()).toEqual(url.params.toString());
  //     expect(request.request.params.get('page')).toEqual('0');
  //     expect(request.request.params.get('size')).toEqual('5');
  //     expect(request.request.params.get('roleCode')).toEqual('admin');
  //     request.flush({});
  //   });

  //   it('should call RoleManagementHelper method with correct arguments', () => {
  //     spyOn(RoleManagementHelper, 'getRolesData').and.returnValue({});
  //     const dummyResponse = {
  //       results: [
  //         {
  //           roleCode: '1rolecode',
  //           roleName: '2Rolenames ',
  //           description: 'Editing 2desc role descriptionss',
  //           roleType: 'BTQ',
  //           isActive: false,
  //           corpAccess: false
  //         },
  //         {
  //           roleCode: 'AA',
  //           roleName: 'bb',
  //           description: 'cc',
  //           roleType: 'CORP',
  //           isActive: true,
  //           corpAccess: true
  //         },
  //         {
  //           roleCode: 'ABC',
  //           roleName: 'abc',
  //           description: 'abc',
  //           roleType: 'BTQ',
  //           isActive: true,
  //           corpAccess: false
  //         }
  //       ],
  //       pageNumber: 0,
  //       pageSize: 10,
  //       totalPages: 5,
  //       totalElements: 45
  //     };

  //     const url = getAllRolesUrl(0, 5, 'admin', '', '');

  //     roleManagementService
  //       .loadRoles({ pageNumber: 0, pageSize: 5, roleCode: 'admin' })
  //       .subscribe();
  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + url.path;
  //     });

  //     request.flush(dummyResponse);
  //     expect(RoleManagementHelper.getRolesData).toHaveBeenCalledWith(
  //       dummyResponse
  //     );
  //   });

  //   it('should retun data mapped by RoleManagementHelper', () => {
  //     const dummyResponse = {
  //       roles: [
  //         {
  //           roleCode: 'BTA_KAR_RC',
  //           isActive: false,
  //           roleName: 'btq kar rn',
  //           roleType: 'BTQ',
  //           description: 'btq kar desc',
  //           corpAccess: false,
  //           userLimit: -1,
  //           assignedUsers: -1,
  //           locationFormats: new Map<string, number>()
  //         },
  //         {
  //           roleCode: 'BTQROLE',
  //           isActive: true,
  //           roleName: 'btqRole',
  //           roleType: 'BTQ',
  //           description: 'Test Boutique Role',
  //           corpAccess: false,
  //           userLimit: -1,
  //           assignedUsers: -1,
  //           locationFormats: new Map<string, number>()
  //         },
  //         {
  //           roleCode: 'CAP',
  //           isActive: true,
  //           roleName: 'cap',
  //           roleType: 'BTQ',
  //           description: 'cap',
  //           corpAccess: false,
  //           userLimit: -1,
  //           assignedUsers: -1,
  //           locationFormats: new Map<string, number>()
  //         }
  //       ],
  //       totalRoles: 20
  //     };
  //     spyOn(RoleManagementHelper, 'getRolesData').and.returnValue(
  //       dummyResponse
  //     );
  //     const url = getAllRolesUrl(0, 5, 'admin', '', '');

  //     roleManagementService
  //       .loadRoles({ pageNumber: 0, pageSize: 5, roleCode: 'admin' })
  //       .subscribe(response => {
  //         expect(response).toEqual(dummyResponse);
  //       });
  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + url.path
  //     );

  //     request.flush({});
  //   });
  // });
});
