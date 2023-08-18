import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import {
  AclUrlPermissionRequestBody,
  AuthState,
  ElementLevelPermissionItemModel,
  ElementLevelPermissionModel
} from '@poss-web/shared/models';
import {
  ApiService,
  getACLPermissionsApiUrl,
  getElementLevelPermissionsApiUrl
} from '@poss-web/shared/util-api-service';
import {
  POSS_WEB_API_URL,
  POSS_WEB_LOAD_ACL_DATA_FROM_DB
} from '@poss-web/shared/util-config';
import { of } from 'rxjs';
import { PermissionDataService } from './permission-data.service';

export function authFacadeFactory(store: Store<AuthState>) {
  return new AuthFacade(store);
}
export function apiServiceFactory(http: HttpClient, apiUrl: string) {
  return new ApiService(http, apiUrl);
}
describe('Permission data Service testing Suite', () => {
  let apiServiceSpy;
  let authFacadeSpy;

  let httpTestingController: HttpTestingController;
  let permissionDataService: PermissionDataService;
  const apiUrl = 'http://localhost:3000';

  describe('When loading ACL Data from DB', () => {
    beforeEach(() => {
      apiServiceSpy = jasmine.createSpyObj(['post']);
      authFacadeSpy = jasmine.createSpyObj(['getAccessToken']);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          PermissionDataService,
          HttpClient,
          ApiService,
          {
            provide: AuthFacade,
            useValue: authFacadeSpy
          },
          {
            provide: POSS_WEB_LOAD_ACL_DATA_FROM_DB,
            useValue: true
          },
          {
            provide: POSS_WEB_API_URL,
            useValue: apiUrl
          }
        ]
      });
      httpTestingController = TestBed.inject(HttpTestingController);
      permissionDataService = TestBed.inject(PermissionDataService);
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('should be created', () => {
      expect(permissionDataService).toBeTruthy();
    });

    it('getPermissionforURL - should get Element permissions for Url', () => {
      const payload: ElementLevelPermissionItemModel[] = [
        {
          url: 'inventory/home',
          transactionCodes: [
            'I0',
            'I1',
            'I2',
            'I27',
            'I42',
            'I43',
            'I44',
            'I45'
          ],
          element: 'Inventory Home - Stock Receive Request Card',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: ['I0', 'I2', 'I27'],
          element: 'Inventory Home - Stock Receive Request Count L1L2',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: ['I1'],
          element: 'Inventory Home - Stock Receive Request Count L3',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: [
            'I18',
            'I20',
            'I21',
            'I22',
            'I23',
            'I24',
            'I62',
            'I64',
            'I65',
            'I66',
            'I67',
            'I68'
          ],
          element: 'Inventory Home - Stock Issue Card L1L2',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: [
            'I39',
            'I22',
            'I23',
            'I24',
            'I63',
            'I66',
            'I67',
            'I68'
          ],
          element: 'Inventory Home - Stock Issue  Card L3',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: ['I18', 'I20', 'I21'],
          element: 'Inventory Home - Stock Issue L1L2 Request Count',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: [
            'I3',
            'I4',
            'I5',
            'I8',
            'I9',
            'I10',
            'I11',
            'I12',
            'I13',
            'I14',
            'I15',
            'I16',
            'I17',
            'I26',
            'I28',
            'I29',
            'I30',
            'I31',
            'I32',
            'I33',
            'I46',
            'I47',
            'I48',
            'I51',
            'I52',
            'I53',
            'I54',
            'I55',
            'I56',
            'I57',
            'I58',
            'I59',
            'I60',
            'I61',
            'I70'
          ],
          element: 'Inventory Home - In-Stock Management Card',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        }
      ];
      const elementLevelPermissionModel: ElementLevelPermissionModel = {
        results: payload
      };

      const urlPattern = '/inventory/home';
      const elementLevelPermissionsApiUrl = getElementLevelPermissionsApiUrl();

      permissionDataService.getPermissionforURL(urlPattern).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + elementLevelPermissionsApiUrl;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');

      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('Should get URL Permissions', () => {
      const requestBody: AclUrlPermissionRequestBody = {
        urls: ['/inventory/home']
      };

      authFacadeSpy.getAccessToken.and.returnValue(of('token'));

      const aclPermissionsApiUrl = getACLPermissionsApiUrl();
      permissionDataService.getURLPermissions(requestBody).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + aclPermissionsApiUrl;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('When loading ACL Data from JSON', () => {
    beforeEach(() => {
      apiServiceSpy = jasmine.createSpyObj(['post']);
      authFacadeSpy = jasmine.createSpyObj(['getAccessToken']);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          PermissionDataService,
          HttpClient,
          ApiService,
          {
            provide: AuthFacade,
            useValue: authFacadeSpy
          },
          {
            provide: POSS_WEB_LOAD_ACL_DATA_FROM_DB,
            useValue: false
          },
          {
            provide: POSS_WEB_API_URL,
            useValue: apiUrl
          }
        ]
      });
      httpTestingController = TestBed.inject(HttpTestingController);
      permissionDataService = TestBed.inject(PermissionDataService);
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('should be created', () => {
      expect(permissionDataService).toBeTruthy();
    });

    it('getPermissionforURL - should get Element permissions for Url', () => {
      const urlPattern = '/inventory/home';
      const elementLevelPermissionsApiUrl =
        './assets/element-level-permissions.json';

      permissionDataService.getPermissionforURL(urlPattern).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === elementLevelPermissionsApiUrl;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('Should get URL Permissions', () => {
      const requestBody: AclUrlPermissionRequestBody = {
        urls: ['/inventory/home']
      };

      const aclPermissionsApiUrl = './assets/url-level-permissions.json';
      permissionDataService.getURLPermissions(requestBody).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === aclPermissionsApiUrl;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('Should get Suggested Routes', () => {
      const requestBody = '/inventory/home';
      const aclPermissionsApiUrl = './assets/allowed-route-mapping.json';
      permissionDataService.getURLSuggestions(requestBody).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === aclPermissionsApiUrl;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
});
