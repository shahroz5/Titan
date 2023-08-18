import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { StockReceiveStock } from '@poss-web/shared/models';
import * as moment from 'moment';
import { AccessControlManagementService } from './access-control-mgmt.service';
import {
  ACLRoleHelper,
  ACLModuleDetailsHelper,
  ACLDetailsHelper
} from '@poss-web/shared/util-adaptors';
import {
  getRolesForAclUrl,
  getACLModulesUrl,
  getACLSubModulesUrl,
  getACLLoadUrl,
  getUpdateRoleUrl
} from '@poss-web/shared/util-api-service';

describe('AccessControlManagementService ', () => {
  let httpTestingController: HttpTestingController;
  let accessControlManagementService: AccessControlManagementService;
  const apiUrl = 'http://localhost:3000';

  const dummyStockResponse: StockReceiveStock[] = [
    {
      id: 111,
      srcDocNo: 111,
      srcLocationCode: 'TestLocation',
      type: 'courier',
      courierDetails: {
        type: 'TEST',
        data: {
          companyName: 'Test',
          docketNumber: 'Test',
          lockNumber: 'Test',
          roadPermitNumber: 'Test',
          employeeId: 'Test',
          employeeMobileNumber: 'Test',
          employeeName: 'Test'
        }
      },
      orderType: 'R',
      courierReceivedDate: moment(),
      totalAvailableValue: 10,
      totalAvailableWeight: 10,
      totalAvailableQuantity: 10,
      totalMeasuredQuantity: 10,
      totalMeasuredValue: 10,
      totalMeasuredWeight: 10,
      srcDocDate: moment(),
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'issued',
      srcFiscalYear: 2020,
      destDocDate: moment(),
      destDocNo: 111,
      destLocationCode: 'TestCode',
      srcLocationDescription: 'Description',
      destLocationDescription: 'Description'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AccessControlManagementService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    accessControlManagementService = TestBed.inject(
      AccessControlManagementService
    );
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(accessControlManagementService).toBeTruthy();
  });

  describe('loadRoles', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ACLRoleHelper, 'getRoles').and.returnValue({});
      const { path, params } = getRolesForAclUrl();

      accessControlManagementService.loadRoles().subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('isActive')).toEqual('true');
      expect(request.request.params.get('isPageable')).toEqual('false');
      request.flush({});
    });

    it('should call ACLRoleHelper method with correct arguments', () => {
      spyOn(ACLRoleHelper, 'getRoles').and.returnValue({});
      const dummyRoleResponse = {
        results: [
          {
            roleCode: 'ADMIN',
            roleName: 'System Administrator',
            description: 'System Administrator',
            roleType: 'CORP',
            isActive: true,
            corpAccess: true
          },
          {
            roleCode: 'ASSISTANT',
            roleName: 'Assistant',
            description: 'Assistant',
            roleType: 'BTQ',
            isActive: true,
            corpAccess: false
          },
          {
            roleCode: 'BOS',
            roleName: 'Boutique Operations Specialist',
            description: 'Boutique Operations Specialist',
            roleType: 'BTQ',
            isActive: true,
            corpAccess: false
          }
        ],
        pageNumber: 0,
        pageSize: 2147483647,
        totalPages: 1,
        totalElements: 24
      };
      const path = getRolesForAclUrl().path;

      accessControlManagementService.loadRoles().subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyRoleResponse);
      expect(ACLRoleHelper.getRoles).toHaveBeenCalledWith(dummyRoleResponse);
    });

    it('should retun data mapped by ACLRoleHelper', () => {
      const dummyRoleResponse = [
        {
          roleCode: 'ADMIN',
          roleName: 'System Administrator',
          description: 'System Administrator',
          roleType: 'CORP',
          isActive: true,
          corpAccess: true
        },
        {
          roleCode: 'ASSISTANT',
          roleName: 'Assistant',
          description: 'Assistant',
          roleType: 'BTQ',
          isActive: true,
          corpAccess: false
        },
        {
          roleCode: 'BOS',
          roleName: 'Boutique Operations Specialist',
          description: 'Boutique Operations Specialist',
          roleType: 'BTQ',
          isActive: true,
          corpAccess: false
        }
      ];

      spyOn(ACLRoleHelper, 'getRoles').and.returnValue(dummyRoleResponse);
      const path = getRolesForAclUrl().path;

      accessControlManagementService.loadRoles().subscribe(response => {
        expect(response).toEqual(dummyRoleResponse);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('loadModules', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ACLModuleDetailsHelper, 'getModules').and.returnValue({});
      const roleCode = 'bos';
      const { path, params } = getACLModulesUrl(roleCode);

      accessControlManagementService.loadModules(roleCode).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('roleCode')).toEqual(roleCode);
      expect(request.request.params.get('isPageable')).toEqual('false');
      request.flush({});
    });

    it('should call ACLModuleDetailsHelper method with correct arguments', () => {
      spyOn(ACLModuleDetailsHelper, 'getModules').and.returnValue({});
      const dummyModulesResponse = {
        results: [
          {
            aclGroupCode: 'I',
            description: 'Inventory Management',
            isLeaf: false,
            parentAclGroupCode: null
          },
          {
            aclGroupCode: 'L',
            description: 'Location Management',
            isLeaf: false,
            parentAclGroupCode: null
          },
          {
            aclGroupCode: 'P',
            description: 'Product Management',
            isLeaf: false,
            parentAclGroupCode: null
          },
          {
            aclGroupCode: 'U',
            description: 'User Access Management',
            isLeaf: true,
            parentAclGroupCode: null
          }
        ],
        pageNumber: 0,
        pageSize: 2147483647,
        totalPages: 1,
        totalElements: 4
      };

      const roleCode = 'bos';
      const path = getACLModulesUrl(roleCode).path;

      accessControlManagementService.loadModules(roleCode).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyModulesResponse);
      expect(ACLModuleDetailsHelper.getModules).toHaveBeenCalledWith(
        dummyModulesResponse
      );
    });

    it('should retun data mapped by ACLModuleDetailsHelper', () => {
      const dummyModulesResponse = [
        {
          aclGroupCode: 'I',
          description: 'Inventory Management',
          isLeaf: false,
          parentAclGroupCode: null
        },
        {
          aclGroupCode: 'L',
          description: 'Location Management',
          isLeaf: false,
          parentAclGroupCode: null
        },
        {
          aclGroupCode: 'P',
          description: 'Product Management',
          isLeaf: false,
          parentAclGroupCode: null
        },
        {
          aclGroupCode: 'U',
          description: 'User Access Management',
          isLeaf: true,
          parentAclGroupCode: null
        }
      ];
      spyOn(ACLModuleDetailsHelper, 'getModules').and.returnValue(
        dummyModulesResponse
      );

      const roleCode = 'bos';
      const path = getACLModulesUrl(roleCode).path;

      accessControlManagementService
        .loadModules(roleCode)
        .subscribe(response => {
          expect(response).toEqual(dummyModulesResponse);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadSubModules', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ACLModuleDetailsHelper, 'getModules').and.returnValue({});
      const roleCode = 'bos';
      const groupCode = 'I';
      const { path, params } = getACLSubModulesUrl(groupCode, roleCode);

      accessControlManagementService
        .loadSubModules(groupCode, roleCode)
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('roleCode')).toEqual(roleCode);
      expect(request.request.params.get('isPageable')).toEqual('false');
      request.flush({});
    });

    it('should call ACLModuleDetailsHelper with correct arguments', () => {
      spyOn(ACLModuleDetailsHelper, 'getModules').and.returnValue({});
      const dummyModulesResponse = {
        results: [
          {
            aclGroupCode: 'I',
            description: 'Inventory Management',
            isLeaf: false,
            parentAclGroupCode: null
          },
          {
            aclGroupCode: 'L',
            description: 'Location Management',
            isLeaf: false,
            parentAclGroupCode: null
          },
          {
            aclGroupCode: 'P',
            description: 'Product Management',
            isLeaf: false,
            parentAclGroupCode: null
          },
          {
            aclGroupCode: 'U',
            description: 'User Access Management',
            isLeaf: true,
            parentAclGroupCode: null
          }
        ],
        pageNumber: 0,
        pageSize: 2147483647,
        totalPages: 1,
        totalElements: 4
      };

      const roleCode = 'bos';
      const groupCode = 'I';
      const path = getACLSubModulesUrl(groupCode, roleCode).path;

      accessControlManagementService
        .loadSubModules(groupCode, roleCode)
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyModulesResponse);
      expect(ACLModuleDetailsHelper.getModules).toHaveBeenCalledWith(
        dummyModulesResponse
      );
    });

    it('should retun data mapped by ACLModuleDetailsHelper', () => {
      const dummyModulesResponse = [
        {
          aclGroupCode: 'I',
          description: 'Inventory Management',
          isLeaf: false,
          parentAclGroupCode: null
        },
        {
          aclGroupCode: 'L',
          description: 'Location Management',
          isLeaf: false,
          parentAclGroupCode: null
        },
        {
          aclGroupCode: 'P',
          description: 'Product Management',
          isLeaf: false,
          parentAclGroupCode: null
        },
        {
          aclGroupCode: 'U',
          description: 'User Access Management',
          isLeaf: true,
          parentAclGroupCode: null
        }
      ];
      spyOn(ACLModuleDetailsHelper, 'getModules').and.returnValue(
        dummyModulesResponse
      );

      const roleCode = 'bos';
      const groupCode = 'I';
      const path = getACLSubModulesUrl(groupCode, roleCode).path;

      accessControlManagementService
        .loadSubModules(groupCode, roleCode)
        .subscribe(response => {
          expect(response).toEqual(dummyModulesResponse);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadACL', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ACLDetailsHelper, 'getACL').and.returnValue({});
      const roleCode = 'bos';
      const groupCode = 'I';
      const { path, params } = getACLLoadUrl(groupCode, roleCode);

      accessControlManagementService.loadACL(groupCode, roleCode).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('roleCode')).toEqual(roleCode);
      expect(request.request.params.get('isPageable')).toEqual('false');
      request.flush({});
    });

    it('should call ACLDetailsHelper with correct arguments', () => {
      spyOn(ACLDetailsHelper, 'getACL').and.returnValue({});
      const dummyaclResponse = {
        results: [
          {
            aclCode: 'I28',
            description: 'Approve - IBT Requests',
            aclGroup: 'I3',
            isAssigned: false,
            isCorpCanAccess: true
          },
          {
            aclCode: 'I29',
            description: 'Approve - Bin Requests',
            aclGroup: 'I3',
            isAssigned: false,
            isCorpCanAccess: true
          },
          {
            aclCode: 'I36',
            description: 'Approve - FOC Requests',
            aclGroup: 'I3',
            isAssigned: false,
            isCorpCanAccess: true
          }
        ],
        pageNumber: 0,
        pageSize: 2147483647,
        totalPages: 1,
        totalElements: 9
      };

      const roleCode = 'bos';
      const groupCode = 'I';
      const path = getACLLoadUrl(groupCode, roleCode).path;

      accessControlManagementService.loadACL(groupCode, roleCode).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyaclResponse);
      expect(ACLDetailsHelper.getACL).toHaveBeenCalledWith(dummyaclResponse);
    });

    it('should retun data mapped by ACLDetailsHelper', () => {
      const dummyAclResponse = [
        {
          aclCode: 'I28',
          description: 'Approve - IBT Requests',
          aclGroup: 'I3',
          isAssigned: false,
          isCorpCanAccess: true
        },
        {
          aclCode: 'I29',
          description: 'Approve - Bin Requests',
          aclGroup: 'I3',
          isAssigned: false,
          isCorpCanAccess: true
        },
        {
          aclCode: 'I36',
          description: 'Approve - FOC Requests',
          aclGroup: 'I3',
          isAssigned: false,
          isCorpCanAccess: true
        }
      ];
      spyOn(ACLDetailsHelper, 'getACL').and.returnValue(dummyAclResponse);

      const roleCode = 'bos';
      const groupCode = 'I';
      const path = getACLLoadUrl(groupCode, roleCode).path;

      accessControlManagementService
        .loadACL(groupCode, roleCode)
        .subscribe(response => {
          expect(response).toEqual(dummyAclResponse);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('updateACL', () => {
    it('should call PATCH api method with correct url and params', () => {
      const roleCode = 'bos';
      const addedAclCodes = ['I1', 'I2'];
      const removedAclCodes = ['I3'];
      const path = getUpdateRoleUrl(roleCode);

      accessControlManagementService
        .updateACL(roleCode, addedAclCodes, removedAclCodes)
        .subscribe();
      const request = httpTestingController.expectOne(apiUrl + path);

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(JSON.parse(request.request.body).addAclCodes).toEqual(
        addedAclCodes
      );
      expect(JSON.parse(request.request.body).removeAclCodes).toEqual(
        removedAclCodes
      );
      request.flush({});
    });

    it('should retun data mapped by API', () => {
      const dummyResponse = 'Success';
      const roleCode = 'bos';
      const addedAclCodes = ['I1', 'I2'];
      const removedAclCodes = ['I3'];
      const path = getUpdateRoleUrl(roleCode);

      accessControlManagementService
        .updateACL(roleCode, addedAclCodes, removedAclCodes)
        .subscribe(response => {
          expect(response).toEqual(dummyResponse);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyResponse);
    });
  });
});
