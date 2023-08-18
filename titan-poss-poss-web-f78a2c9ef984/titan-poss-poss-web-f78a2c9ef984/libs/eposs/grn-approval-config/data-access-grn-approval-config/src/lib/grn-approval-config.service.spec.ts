import { TestBed } from '@angular/core/testing';

import {
  DiscountLovTypesEnum,
  GrnApprovalConfig,
  GrnApprovalConfigResponse
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { GrnApprovalConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getConfigurationListUrl,
  getSearchConfigByConfigNameUrl,
  getUpdateConfigurationUrl,
  getSaveConfigurationUrl,
  getRoleTypeUrl,
  getDiscountTypesUrl
} from '@poss-web/shared/util-api-service';
import { GrnApprovalConfigService } from './grn-approval-config.service';
describe('GrnApprovalConfigService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let grnApprovalConfigService: GrnApprovalConfigService;

  const dummyGrnApprovalConfigResponse: GrnApprovalConfigResponse = {
    description: 'GEP',
    ruleId: '1',
    ruleType: 'GEP',
    isActive: true,
    config: []
  };

  const dummyGrnApprovalConfigRequestResponse = {
    results: [dummyGrnApprovalConfigResponse],
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  const dummyGrnTypeResponse = [
    {
      roleCode: 'BOS',
      roleName: 'BOS'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GrnApprovalConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    grnApprovalConfigService = TestBed.inject(GrnApprovalConfigService);
  });

  it('should be created', () => {
    expect(grnApprovalConfigService).toBeTruthy();
  });

  describe('getGrnApprovalConfigList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        GrnApprovalConfigAdaptor,
        'getGrnApprovalConfigList'
      ).and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const url = getConfigurationListUrl(pageIndex, pageSize);

      grnApprovalConfigService
        .getGrnApprovalConfigList(pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );

      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      request.flush({});
    });

    it('should call GrnApprovalConfigAdaptor getGrnApprovalConfigList method with correct  parameters', () => {
      spyOn(
        GrnApprovalConfigAdaptor,
        'getGrnApprovalConfigList'
      ).and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;

      const url = getConfigurationListUrl(pageIndex, pageSize);
      grnApprovalConfigService
        .getGrnApprovalConfigList(pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyGrnApprovalConfigRequestResponse);
      expect(
        GrnApprovalConfigAdaptor.getGrnApprovalConfigList
      ).toHaveBeenCalledWith(dummyGrnApprovalConfigRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        GrnApprovalConfigAdaptor,
        'getGrnApprovalConfigList'
      ).and.returnValue({
        grnApprovalConfigList: [dummyGrnApprovalConfigResponse],
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;

      const url = getConfigurationListUrl(pageIndex, pageSize);

      grnApprovalConfigService
        .getGrnApprovalConfigList(pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual({
            grnApprovalConfigList: [dummyGrnApprovalConfigResponse],
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('saveGrnApprovalConfig', () => {
    const path = getSaveConfigurationUrl('GRN_APPROVAL_ACCESS_REGULAR');

    const dummyGrnApprovalConfig: GrnApprovalConfig = {
      description: 'Regular',
      ruleType: 'GRN_APPROVAL_ACCESS_REGULAR',
      isActive: true,
      ruleDetails: {
        data: {},
        type: 'GRN_APPROVAL_ACCESS_REGULAR'
      }
    };

    it('should call POST api method with correct url and params', () => {
      spyOn(GrnApprovalConfigAdaptor, 'getGrnApprovalConfig').and.returnValue(
        {}
      );

      grnApprovalConfigService
        .saveGrnApprovalConfig(dummyGrnApprovalConfig)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call GrnApprovalConfigAdaptor getGrnApprovalConfig method with correct  parameters', () => {
      spyOn(GrnApprovalConfigAdaptor, 'getGrnApprovalConfig').and.returnValue(
        {}
      );

      grnApprovalConfigService
        .saveGrnApprovalConfig(dummyGrnApprovalConfig)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyGrnApprovalConfigResponse);
      expect(
        GrnApprovalConfigAdaptor.getGrnApprovalConfig
      ).toHaveBeenCalledWith(dummyGrnApprovalConfigResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(GrnApprovalConfigAdaptor, 'getGrnApprovalConfig').and.returnValue(
        dummyGrnApprovalConfigResponse
      );

      grnApprovalConfigService
        .saveGrnApprovalConfig(dummyGrnApprovalConfig)
        .subscribe(data => {
          expect(data).toEqual(dummyGrnApprovalConfigResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('updateGrnApprovalConfig', () => {
    const dummyGrnApprovalConfig: GrnApprovalConfig = {
      ruleId: '1',
      ruleType: 'Regular',
      description: 'Regular',
      isActive: true,
      ruleDetails: {
        data: {},
        type: 'Regular'
      }
    };
    const path = getUpdateConfigurationUrl('1', 'Regular');
    it('should call PATCH api method with correct url and params', () => {
      grnApprovalConfigService
        .updateGrnApprovalConfig(dummyGrnApprovalConfig)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call GrnApprovalConfigAdaptor getGrnApprovalConfig method with correct  parameters', () => {
      spyOn(GrnApprovalConfigAdaptor, 'getGrnApprovalConfig').and.returnValue(
        {}
      );

      grnApprovalConfigService
        .updateGrnApprovalConfig(dummyGrnApprovalConfig)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyGrnApprovalConfigResponse);
      expect(
        GrnApprovalConfigAdaptor.getGrnApprovalConfig
      ).toHaveBeenCalledWith(dummyGrnApprovalConfigResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(GrnApprovalConfigAdaptor, 'getGrnApprovalConfig').and.returnValue(
        dummyGrnApprovalConfigResponse
      );

      grnApprovalConfigService
        .updateGrnApprovalConfig(dummyGrnApprovalConfig)
        .subscribe(data => {
          expect(data).toEqual(dummyGrnApprovalConfigResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('getGrnApprovalConfig', () => {
    const path = getUpdateConfigurationUrl('1', 'Regular');

    it('should call GET  api method with correct url and params', () => {
      spyOn(GrnApprovalConfigAdaptor, 'getGrnApprovalConfig').and.returnValue(
        {}
      );

      grnApprovalConfigService.getGrnApprovalConfig('1', 'Regular').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call GrnApprovalConfigAdaptor getGrnApprovalConfig method with correct  parameters', () => {
      spyOn(GrnApprovalConfigAdaptor, 'getGrnApprovalConfig').and.returnValue(
        {}
      );

      grnApprovalConfigService.getGrnApprovalConfig('1', 'Regular').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyGrnApprovalConfigResponse);
      expect(
        GrnApprovalConfigAdaptor.getGrnApprovalConfig
      ).toHaveBeenCalledWith(dummyGrnApprovalConfigResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(GrnApprovalConfigAdaptor, 'getGrnApprovalConfig').and.returnValue(
        dummyGrnApprovalConfigResponse
      );

      grnApprovalConfigService
        .getGrnApprovalConfig('1', 'Regular')
        .subscribe(data => {
          expect(data).toEqual(dummyGrnApprovalConfigResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getNewGrnApprovalConfigByRuleId', () => {
    const newGrnApprovalConfig: GrnApprovalConfig = {
      ruleId: 'new',
      ruleType: '',
      description: '',
      isActive: true
    };
    it('should call GrnApprovalConfigAdaptor getGrnApprovalConfig method with correct  parameters', () => {
      spyOn(GrnApprovalConfigAdaptor, 'getGrnApprovalConfig').and.returnValue(
        {}
      );

      grnApprovalConfigService.getNewGrnApprovalConfigByRuleId();

      expect(
        GrnApprovalConfigAdaptor.getGrnApprovalConfig
      ).toHaveBeenCalledWith(false);
    });

    it('should return data mapped by adaptors', () => {
      grnApprovalConfigService.getNewGrnApprovalConfigByRuleId();
      expect(newGrnApprovalConfig).toEqual(newGrnApprovalConfig);
    });
  });

  describe('searchGrnApprovalConfigByGrnType', () => {
    it('should call POST  api method with correct url and params', () => {
      spyOn(
        GrnApprovalConfigAdaptor,
        'getGrnApprovalConfigList'
      ).and.returnValue({});
      const searchValue = 'Regular';
      const path = getSearchConfigByConfigNameUrl('Regular');

      grnApprovalConfigService
        .searchGrnApprovalConfigByGrnType(searchValue)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call GrnApprovalConfigAdaptor getGrnApprovalConfigList method with correct  parameters', () => {
      spyOn(
        GrnApprovalConfigAdaptor,
        'getGrnApprovalConfigList'
      ).and.returnValue({});
      const searchValue = 'Regular';
      const path = getSearchConfigByConfigNameUrl('Regular');
      grnApprovalConfigService
        .searchGrnApprovalConfigByGrnType(searchValue)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyGrnApprovalConfigRequestResponse);
      expect(
        GrnApprovalConfigAdaptor.getGrnApprovalConfigList
      ).toHaveBeenCalledWith(dummyGrnApprovalConfigRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        GrnApprovalConfigAdaptor,
        'getGrnApprovalConfigList'
      ).and.returnValue({
        grnApprovalConfigList: [dummyGrnApprovalConfigResponse],
        totalElements: 10
      });
      const searchValue = 'Regular';
      const path = getSearchConfigByConfigNameUrl('Regular');

      grnApprovalConfigService
        .searchGrnApprovalConfigByGrnType(searchValue)
        .subscribe(data => {
          expect(data).toEqual({
            grnApprovalConfigList: [dummyGrnApprovalConfigResponse],
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getRoleList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(GrnApprovalConfigAdaptor, 'getRoleList').and.returnValue({});

      const lovType = DiscountLovTypesEnum.APPROVAL_ROLES;
      const url = getDiscountTypesUrl(lovType);

      grnApprovalConfigService.getRoleList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path + url.params;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call GrnApprovalConfigAdaptor getRoleList method with correct  parameters', () => {
      spyOn(GrnApprovalConfigAdaptor, 'getRoleList').and.returnValue({});

      const lovType = DiscountLovTypesEnum.APPROVAL_ROLES;
      const url = getDiscountTypesUrl(lovType);
      grnApprovalConfigService.getRoleList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path + url.params;
      });

      request.flush(dummyGrnTypeResponse);
      expect(GrnApprovalConfigAdaptor.getRoleList).toHaveBeenCalledWith(
        dummyGrnTypeResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(GrnApprovalConfigAdaptor, 'getRoleList').and.returnValue(
        dummyGrnTypeResponse
      );

      const lovType = DiscountLovTypesEnum.APPROVAL_ROLES;
      const url = getDiscountTypesUrl(lovType);

      grnApprovalConfigService.getRoleList().subscribe(data => {
        expect(data).toEqual(dummyGrnTypeResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path + url.params;
      });

      request.flush({});
    });
  });
});
