import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { RoleConfigHelper } from '@poss-web/shared/util-adaptors';
import {
  getActiveRolesUrl,
  getRoleCountRequestListUrl,
  getRoleCountRequestUrl,
  getChangeRoleCountUrl
} from '@poss-web/shared/util-api-service';
import * as moment from 'moment';

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
import { of } from 'rxjs';
import { RoleConfigService } from './role-config.service';

describe('RoleManagementService ', () => {
  let httpTestingController: HttpTestingController;
  let roleConfigService: RoleConfigService;
  let mockLOVService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    mockLOVService = jasmine.createSpyObj(['getLocationLovs']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RoleConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        },
        {
          provide: LovDataService,
          useValue: mockLOVService
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    roleConfigService = TestBed.inject(RoleConfigService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(roleConfigService).toBeTruthy();
  });

  describe('loadRolesforCount', () => {
    it('should create proper URL for as per parameters passed', () => {
      let url = getActiveRolesUrl(false);
      expect(url.path).toBe('/user/v2/corp/roles');

      url = getActiveRolesUrl(true);
      expect(url.path).toBe('/user/v2/location/roles');
    });

    it('should call GET api method with correct url and params', () => {
      spyOn(RoleConfigHelper, 'getRolesData').and.returnValue({});
      const url = getActiveRolesUrl(false, 'BTQ', 'URB');

      roleConfigService.loadRolesforCount(false, 'BTQ', 'URB').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(url.params.toString());
      expect(request.request.params.get('roleType')).toEqual('BTQ');
      expect(request.request.params.get('locationCode')).toEqual('URB');
      expect(request.request.params.get('isActive')).toEqual('true');
      request.flush({});
    });

    it('should call RoleConfigHelper method with correct arguments', () => {
      spyOn(RoleConfigHelper, 'getRolesData').and.returnValue({});
      const dummyResponse = {
        results: [
          {
            roleCode: 'BOS',
            roleName: 'Boutique Operations Specialist',
            description: 'Boutique Operations Specialist in Tanishq Jewellers',
            roleType: 'BTQ',
            isActive: true,
            userLimit: 8,
            assignedUsers: 7,
            corpAccess: false
          },
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
        totalElements: 2
      };
      const url = getActiveRolesUrl(false, 'BTQ', 'URB');

      roleConfigService.loadRolesforCount(false, 'BTQ', 'URB').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResponse);
      expect(RoleConfigHelper.getRolesData).toHaveBeenCalledWith(dummyResponse);
    });

    it('should retun data mapped by RoleConfigHelper', () => {
      const dummyResponse = [
        {
          roleCode: 'BOS',
          isActive: true,
          roleName: 'Boutique Operations Specialist',
          roleType: 'BTQ',
          description: 'Boutique Operations Specialist in Tanishq Jewellers',
          corpAccess: false,
          userLimit: 8,
          assignedUsers: 7,
          locationFormats: new Map<string, number>()
        },
        {
          roleCode: 'SM',
          isActive: true,
          roleName: 'Store Manager',
          roleType: 'BTQ',
          description: 'Store Manager Test',
          corpAccess: true,
          userLimit: 3,
          assignedUsers: 3,
          locationFormats: new Map<string, number>()
        }
      ];
      spyOn(RoleConfigHelper, 'getRolesData').and.returnValue({
        roles: dummyResponse
      });
      const url = getActiveRolesUrl(false, 'BTQ', 'URB');

      roleConfigService
        .loadRolesforCount(false, 'BTQ', 'URB')
        .subscribe(response => {
          expect(response).toEqual(dummyResponse);
        });
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + url.path
      );

      request.flush({});
    });
  });

  describe('fetchRoleCountRequestList', () => {
    it('should create proper URL for as per parameters passed', () => {
      let url = getRoleCountRequestListUrl(0, 5, false);
      expect(url.path).toEqual('/user/v2/corp/role-limits');

      url = getRoleCountRequestListUrl(0, 5, true);
      expect(url.path).toEqual('/user/v2/location/role-limits');
    });

    it('should call GET api method with correct url and params', () => {
      spyOn(RoleConfigHelper, 'getRoleCountRequestListData').and.returnValue(
        {}
      );
      const url = getRoleCountRequestListUrl(0, 5, false);

      roleConfigService
        .fetchRoleCountRequestList(0, 5, false, [], '')
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
      expect(request.request.params.get('sort')).toEqual('reqDocDate,desc');
      request.flush({});
    });

    it('should call RoleConfigHelper method with correct arguments', () => {
      spyOn(RoleConfigHelper, 'getRoleCountRequestListData').and.returnValue(
        {}
      );
      const dummyResponse = {
        results: [
          {
            id: 336,
            ownerType: 'L3',
            reqDocNo: 3,
            requestRemarks: 'Defect test',
            requesterName: 'SAM12',
            status: 'PENDING',
            address: '60-A, Sardar Patel Marg,Civil Lines,',
            roleName: 'Store Manager',
            reqDocDate: 1583912470540,
            reqLocationCode: 'ALD',
            requesterContactNo: '7007521151'
          },
          {
            id: 335,
            ownerType: 'L3',
            reqDocNo: 2,
            requestRemarks: 'Defect test',
            requesterName: 'SAM12',
            status: 'CANCELLED',
            address: '60-A, Sardar Patel Marg,Civil Lines,',
            roleName: 'Store Manager',
            reqDocDate: 1583912404651,
            reqLocationCode: 'ALD',
            requesterContactNo: '7007521151'
          }
        ],
        pageNumber: 0,
        pageSize: 4,
        totalPages: 4,
        totalElements: 14
      };
      const url = getRoleCountRequestListUrl(0, 5, false);

      roleConfigService
        .fetchRoleCountRequestList(0, 5, false, [], '')
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResponse);
      expect(RoleConfigHelper.getRoleCountRequestListData).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by RoleConfigHelper', () => {
      const dummyResponse = {
        isFilter: '',
        isSearch: '',
        totalrequests: 14,
        requests: [
          {
            id: 336,
            ownerType: 'L3',
            reqDocNo: 3,
            requestRemarks: 'Defect test',
            requesterName: 'SAM12',
            status: 'PENDING',
            address: ['60-A', 'Sardar Patel Marg', 'Civil Lines'],
            reqDocDate: moment(),
            roleName: 'Store Manager',
            locationCode: 'ALD'
          },
          {
            id: 335,
            ownerType: 'L3',
            reqDocNo: 2,
            requestRemarks: 'Defect test',
            requesterName: 'SAM12',
            status: 'CANCELLED',
            address: ['60-A', 'Sardar Patel Marg', 'Civil Lines'],
            reqDocDate: moment(),
            roleName: 'Store Manager',
            locationCode: 'ALD'
          }
        ]
      };

      spyOn(RoleConfigHelper, 'getRoleCountRequestListData').and.returnValue(
        dummyResponse
      );
      const url = getRoleCountRequestListUrl(0, 5, false);

      roleConfigService
        .fetchRoleCountRequestList(0, 5, false, [], '')
        .subscribe(response => {
          expect(response).toEqual(dummyResponse);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('fetchRoleRequestCount', () => {
    it('should call GET api method with correct url and params', () => {
      const url = getRoleCountRequestListUrl(0, 5, false);

      roleConfigService.fetchRoleRequestCount(0, 5).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(url.params.toString());
      expect(request.request.params.get('page')).toEqual('0');
      expect(request.request.params.get('size')).toEqual('5');
      expect(request.request.params.get('sort')).toEqual('reqDocDate,desc');
      request.flush({});
    });

    it('should retun data mapped by fetchRoleRequestCount of RoleConfigService', () => {
      const dummyResponse = {
        totalElements: 14
      };
      const url = getRoleCountRequestListUrl(0, 5, false);

      roleConfigService.fetchRoleRequestCount(0, 5).subscribe(response => {
        expect(response).toEqual(dummyResponse.totalElements);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResponse);
    });
  });

  describe('fetchRoleCountRequest', () => {
    it('should create proper URL for as per parameters passed', () => {
      let url = getRoleCountRequestUrl('5', false);
      expect(url).toEqual('/user/v2/corp/role-limits/5/requests');

      url = getRoleCountRequestUrl('5', true);
      expect(url).toEqual('/user/v2/location/role-limits/5/requests');
    });

    it('should call GET api method with correct url and params', () => {
      spyOn(RoleConfigHelper, 'getRequestedRoles').and.returnValue({});
      const url = getRoleCountRequestUrl('5', false);

      roleConfigService.fetchRoleCountRequest('5', false).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call RoleConfigHelper method with correct arguments', () => {
      spyOn(RoleConfigHelper, 'getRequestedRoles').and.returnValue({});
      const dummyResponse = {
        id: 336,
        ownerType: 'L3',
        reqDocNo: 3,
        requestRemarks: 'Defect test',
        requesterName: 'SAM12',
        status: 'PENDING',
        address: '60-A, Sardar Patel Marg,Civil Lines,',
        roleName: 'Store Manager',
        reqDocDate: 1583912470540,
        requestedRoleDetails: [
          {
            id: '1322CDA0-F931-4AA8-A6E7-450F696C77F1',
            roleCode: 'SM',
            roleName: 'Store Manager',
            assignedUsers: 2,
            userLimit: 2,
            reqValue: 3
          }
        ]
      };
      const url = getRoleCountRequestUrl('5', false);

      roleConfigService.fetchRoleCountRequest('5', false).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(dummyResponse);
      expect(RoleConfigHelper.getRequestedRoles).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by RoleConfigHelper', () => {
      const dummyResponse = {
        requestedRoles: [
          {
            roleCode: 'SM',
            reqValue: 3,
            userLimit: 2,
            assignedUsers: 2,
            roleName: 'Store Manager'
          }
        ],
        requestdata: {
          id: 336,
          ownerType: 'L3',
          reqDocNo: 3,
          requestRemarks: 'Defect test',
          requesterName: 'SAM12',
          status: 'PENDING',
          address: ['60-A', 'Sardar Patel Marg', 'Civil Lines'],
          reqDocDate: moment(),
          roleName: 'Store Manager',
          locationCode: 'ALD'
        }
      };

      spyOn(RoleConfigHelper, 'getRequestedRoles').and.returnValue(
        dummyResponse
      );
      const url = getRoleCountRequestUrl('5', false);

      roleConfigService
        .fetchRoleCountRequest('5', false)
        .subscribe(response => {
          expect(response).toEqual(dummyResponse);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });

  describe('requestRoleCountChange', () => {
    it('should create proper URL for as per parameters passed', () => {
      let url = getChangeRoleCountUrl();
      expect(url).toEqual('/user/v2/location/role-limits/requests');

      url = getChangeRoleCountUrl('URB');
      expect(url).toBe('/user/v2/corp/role-limits/locations/URB');

      url = getChangeRoleCountUrl(undefined, '5');
      expect(url).toBe('/user/v2/corp/role-limits/requests/5');
    });

    it('should call PATCH & POST api method with correct url and params', () => {
      const roleCountData = [
        {
          reqValue: 1,
          roleCode: 'SM'
        },
        {
          reqValue: 2,
          roleCode: 'BOS'
        }
      ];
      let url = getChangeRoleCountUrl('URB');

      roleConfigService
        .requestRoleCountChange(roleCountData, 'remarks', 'status', 'URB')
        .subscribe();
      let request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(JSON.parse(request.request.body)).toEqual({
        roles: roleCountData
      });
      request.flush({});

      const roleCountRequestData = {
        requestRemarks: 'remarks',
        roleLimitReqDto: [
          {
            reqValue: 1,
            roleCode: 'SM'
          },
          {
            reqValue: 2,
            roleCode: 'BOS'
          }
        ]
      };
      url = getChangeRoleCountUrl();

      roleConfigService
        .requestRoleCountChange(roleCountData, 'remarks')
        .subscribe();
      request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(JSON.parse(request.request.body)).toEqual(roleCountRequestData);
      request.flush({});
    });
  });

  describe('fetchLocationFormat', () => {
    it('should call getLocationFormats method of RoleConfigHelper with correct arguments', () => {
      spyOn(RoleConfigHelper, 'getLocationFormats').and.returnValue({});
      const dummyResponse = {
        lovType: 'LOCATIONFORMAT',
        values: [
          { code: 'MICF', value: 'Micro Format', isActive: true },
          { code: 'SF', value: 'Small Format', isActive: true },
          { code: 'MF', value: 'Medium Format', isActive: true },
          { code: 'LF', value: 'Large Format', isActive: true }
        ]
      };
      mockLOVService.getLocationLovs.and.returnValue(of(dummyResponse));

      roleConfigService.fetchLocationFormat().subscribe();
      expect(RoleConfigHelper.getLocationFormats).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by getLocationFormats method of RoleConfigHelper', () => {
      const dummyResponse = [{ code: 'MICF', value: 'Micro Format' }];
      spyOn(RoleConfigHelper, 'getLocationFormats').and.returnValue(
        dummyResponse
      );
      mockLOVService.getLocationLovs.and.returnValue(of(dummyResponse));

      roleConfigService.fetchLocationFormat().subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });
    });
  });
});
