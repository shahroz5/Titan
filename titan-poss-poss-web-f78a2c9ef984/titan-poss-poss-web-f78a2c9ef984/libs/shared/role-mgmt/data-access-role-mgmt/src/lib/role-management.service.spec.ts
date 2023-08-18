import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  RoleManagementHelper,
  RoleManagementAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  getAllRolesUrl,
  getRoleDetailsUrl,
  getUpdateRoleUrl,
  addRoleUrl
} from '@poss-web/shared/util-api-service';

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
import { of } from 'rxjs';
import { RoleManagementService } from './role-management.service';
import { RoleTypesData } from '@poss-web/shared/models';

describe('RoleManagementService ', () => {
  let httpTestingController: HttpTestingController;
  let roleManagementService: RoleManagementService;
  let mockLOVService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    mockLOVService = jasmine.createSpyObj(['getLocationLovs', 'getUserLovs']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RoleManagementService,
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
    roleManagementService = TestBed.inject(RoleManagementService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(roleManagementService).toBeTruthy();
  });

  describe('loadRoles', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(RoleManagementHelper, 'getRolesData').and.returnValue({});
      const url = getAllRolesUrl(0, 5, 'admin', '', '');

      roleManagementService
        .loadRoles({ pageNumber: 0, pageSize: 5, roleCode: 'admin' })
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
      expect(request.request.params.get('roleCode')).toEqual('admin');
      request.flush({});
    });

    it('should call RoleManagementHelper method with correct arguments', () => {
      spyOn(RoleManagementHelper, 'getRolesData').and.returnValue({});
      const dummyResponse = {
        results: [
          {
            roleCode: '1rolecode',
            roleName: '2Rolenames ',
            description: 'Editing 2desc role descriptionss',
            roleType: 'BTQ',
            isActive: false,
            corpAccess: false
          },
          {
            roleCode: 'AA',
            roleName: 'bb',
            description: 'cc',
            roleType: 'CORP',
            isActive: true,
            corpAccess: true
          },
          {
            roleCode: 'ABC',
            roleName: 'abc',
            description: 'abc',
            roleType: 'BTQ',
            isActive: true,
            corpAccess: false
          }
        ],
        pageNumber: 0,
        pageSize: 10,
        totalPages: 5,
        totalElements: 45
      };

      const url = getAllRolesUrl(0, 5, 'admin', '', '');

      roleManagementService
        .loadRoles({ pageNumber: 0, pageSize: 5, roleCode: 'admin' })
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResponse);
      expect(RoleManagementHelper.getRolesData).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by RoleManagementHelper', () => {
      const dummyResponse = {
        roles: [
          {
            roleCode: 'BTA_KAR_RC',
            isActive: false,
            roleName: 'btq kar rn',
            roleType: 'BTQ',
            description: 'btq kar desc',
            corpAccess: false,
            userLimit: -1,
            assignedUsers: -1,
            locationFormats: new Map<string, number>()
          },
          {
            roleCode: 'BTQROLE',
            isActive: true,
            roleName: 'btqRole',
            roleType: 'BTQ',
            description: 'Test Boutique Role',
            corpAccess: false,
            userLimit: -1,
            assignedUsers: -1,
            locationFormats: new Map<string, number>()
          },
          {
            roleCode: 'CAP',
            isActive: true,
            roleName: 'cap',
            roleType: 'BTQ',
            description: 'cap',
            corpAccess: false,
            userLimit: -1,
            assignedUsers: -1,
            locationFormats: new Map<string, number>()
          }
        ],
        totalRoles: 20
      };
      spyOn(RoleManagementHelper, 'getRolesData').and.returnValue(
        dummyResponse
      );
      const url = getAllRolesUrl(0, 5, 'admin', '', '');

      roleManagementService
        .loadRoles({ pageNumber: 0, pageSize: 5, roleCode: 'admin' })
        .subscribe(response => {
          expect(response).toEqual(dummyResponse);
        });
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + url.path
      );

      request.flush({});
    });
  });

  describe('fetchRole', () => {
    it('should create proper URL for as per parameters passed', () => {
      const path = getRoleDetailsUrl('admin');
      expect(path).toBe('/user/v2/corp/roles/admin');
    });

    it('should call GET api method with correct url and params', () => {
      spyOn(RoleManagementAdaptor, 'getRoleData').and.returnValue({});
      const path = getRoleDetailsUrl('admin');

      roleManagementService.fetchRole('admin').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call RoleManagementAdaptor method with correct arguments', () => {
      spyOn(RoleManagementAdaptor, 'getRoleData').and.returnValue({});
      const dummyResponse = {
        roleCode: '1rolecode',
        roleName: '2Rolenames ',
        description: 'Editing 2desc role descriptionss',
        roleType: 'BTQ',
        isActive: false,
        corpAccess: false,
        aclCodes: [
          {
            aclCode: 'I29',
            description: 'Approve - Bin Requests',
            aclGroup: 'I3',
            isCorpCanAccess: null
          },
          {
            aclCode: 'I32',
            description: 'Approve - Adjustment Requests',
            aclGroup: 'I3',
            isCorpCanAccess: null
          }
        ],
        roleToLocationFormats: []
      };

      const path = getRoleDetailsUrl('admin');

      roleManagementService.fetchRole('admin').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyResponse);
      expect(RoleManagementAdaptor.getRoleData).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by RoleManagementAdaptor', () => {
      const dummyResponse = {
        roleCode: '1rolecode',
        isActive: false,
        roleName: '2Rolenames ',
        roleType: 'BTQ',
        description: 'Editing 2desc role descriptionss',
        corpAccess: false,
        userLimit: -1,
        assignedUsers: -1,
        locationFormats: new Map<string, number>()
      };
      spyOn(RoleManagementAdaptor, 'getRoleData').and.returnValue(
        dummyResponse
      );

      const path = getRoleDetailsUrl('admin');

      roleManagementService.fetchRole('admin').subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('fetchLocationFormat', () => {
    it('should call getLocationFormats method of RoleManagementHelper with correct arguments', () => {
      spyOn(RoleManagementHelper, 'getLocationFormats').and.returnValue({});
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

      roleManagementService.fetchLocationFormat().subscribe();
      expect(RoleManagementHelper.getLocationFormats).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by getLocationFormats method of RoleManagementHelper', () => {
      const dummyResponse = new Map<string, string>();
      dummyResponse.set('MICF', 'Micro Format');
      spyOn(RoleManagementHelper, 'getLocationFormats').and.returnValue(
        dummyResponse
      );
      mockLOVService.getLocationLovs.and.returnValue(of(dummyResponse));

      roleManagementService.fetchLocationFormat().subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });
    });
  });
  describe('fetchRoletypesList', () => {
    it('should call getRoleTypesData method of RoleManagementHelper with correct arguments', () => {
      const dummyResponse: RoleTypesData[] = [
        {
          code: '01',
          value: 'value'
        }
      ];

      spyOn(RoleManagementHelper, 'getRoleTypesData').and.returnValue(
        dummyResponse
      );

      mockLOVService.getUserLovs.and.returnValue(of(dummyResponse));

      roleManagementService.fetchRoletypesList().subscribe();
      expect(RoleManagementHelper.getRoleTypesData).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun array of RoleTypesData from getRoleTypesData method of RoleManagementHelper', () => {
      const dummyResponse: RoleTypesData[] = [
        {
          code: 'code',
          value: 'value'
        }
      ];

      spyOn(RoleManagementHelper, 'getRoleTypesData').and.returnValue(
        dummyResponse
      );
      mockLOVService.getUserLovs.and.returnValue(of(dummyResponse));

      roleManagementService.fetchRoletypesList().subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });
    });
  });

  describe('addRole', () => {
    it('should call POST api method with correct url and params', () => {
      const roleData = {
        roleType: 'BTQ',
        roleName: 'Test Role 1',
        roleCode: 'TestRole1',
        description: 'Test Role 1 description',
        addRoleToLocationFormats: [
          { locationFormat: 'MICF', userLimit: 0 },
          { locationFormat: 'SF', userLimit: 0 },
          { locationFormat: 'MF', userLimit: 2 },
          { locationFormat: 'LF', userLimit: 0 }
        ],
        corpAccess: false
      };
      const path = addRoleUrl();

      roleManagementService.addRole(roleData).subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.url).toMatch(path);
      expect(JSON.parse(request.request.body)).toEqual(roleData);
      request.flush({});
    });
  });

  describe('updateRole', () => {
    it('should call PATCH api method with correct url and params', () => {
      const roleData = {
        roleName: '2Rolenames ',
        description: 'Editing 2desc role descriptionss',
        isLocationFormatUpdate: true,
        addRoleToLocationFormats: [
          { locationFormat: 'MICF', userLimit: 3 },
          { locationFormat: 'SF', userLimit: 0 },
          { locationFormat: 'MF', userLimit: 0 },
          { locationFormat: 'LF', userLimit: 0 }
        ]
      };
      const path = getUpdateRoleUrl('admin');

      roleManagementService.updateRole('admin', roleData).subscribe();
      const request = httpTestingController.expectOne(apiUrl + path);

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.url).toMatch(path);
      expect(JSON.parse(request.request.body)).toEqual(roleData);
      request.flush({});
    });
  });
});
