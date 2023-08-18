import { TestBed } from '@angular/core/testing';

import {
  DiscountLovTypesEnum,
  FtepApprovalConfig,
  FtepApprovalConfigResponse
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { FtepApprovalConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getConfigurationListUrl,
  getSearchConfigByConfigNameUrl,
  getUpdateConfigurationUrl,
  getSaveConfigurationUrl,
  getCreditNoteTypeUrl,
  getRoleTypeUrl,
  getDiscountTypesUrl
} from '@poss-web/shared/util-api-service';
import { FtepApprovalConfigService } from './ftep-approval-config.service';
describe('FtepApprovalConfigService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let ftepApprovalConfigService: FtepApprovalConfigService;

  const dummyFtepApprovalConfigResponse: FtepApprovalConfigResponse = {
    description: 'GEP',
    ruleId: '1',
    ruleType: 'GEP',
    isActive: true,
    config: []
  };

  const dummyFtepApprovalConfigRequestResponse = {
    results: [dummyFtepApprovalConfigResponse],
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  const dummyFtepTypeResponse = [
    {
      roleCode: 'BOS',
      roleName: 'BOS'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FtepApprovalConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    ftepApprovalConfigService = TestBed.inject(FtepApprovalConfigService);
  });

  it('should be created', () => {
    expect(ftepApprovalConfigService).toBeTruthy();
  });

  describe('getFtepApprovalConfigList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        FtepApprovalConfigAdaptor,
        'getFtepApprovalConfigList'
      ).and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const url = getConfigurationListUrl(pageIndex, pageSize);

      ftepApprovalConfigService
        .getFtepApprovalConfigList(pageIndex, pageSize)
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

    it('should call FtepApprovalConfigAdaptor getFtepApprovalConfigList method with correct  parameters', () => {
      spyOn(
        FtepApprovalConfigAdaptor,
        'getFtepApprovalConfigList'
      ).and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;

      const url = getConfigurationListUrl(pageIndex, pageSize);
      ftepApprovalConfigService
        .getFtepApprovalConfigList(pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyFtepApprovalConfigRequestResponse);
      expect(
        FtepApprovalConfigAdaptor.getFtepApprovalConfigList
      ).toHaveBeenCalledWith(dummyFtepApprovalConfigRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        FtepApprovalConfigAdaptor,
        'getFtepApprovalConfigList'
      ).and.returnValue({
        ftepApprovalConfigList: [dummyFtepApprovalConfigResponse],
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;

      const url = getConfigurationListUrl(pageIndex, pageSize);

      ftepApprovalConfigService
        .getFtepApprovalConfigList(pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual({
            ftepApprovalConfigList: [dummyFtepApprovalConfigResponse],
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('saveFtepApprovalConfig', () => {
    const path = getSaveConfigurationUrl('GRN_APPROVAL_ACCESS_REGULAR');

    const dummyFtepApprovalConfig: FtepApprovalConfig = {
      description: 'Regular',
      ruleType: 'GRN_APPROVAL_ACCESS_REGULAR',
      isActive: true,
      ruleDetails: {
        data: {},
        type: 'GRN_APPROVAL_ACCESS_REGULAR'
      }
    };

    it('should call POST api method with correct url and params', () => {
      spyOn(FtepApprovalConfigAdaptor, 'getFtepApprovalConfig').and.returnValue(
        {}
      );

      ftepApprovalConfigService
        .saveFtepApprovalConfig(dummyFtepApprovalConfig)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call FtepApprovalConfigAdaptor getFtepApprovalConfig method with correct  parameters', () => {
      spyOn(FtepApprovalConfigAdaptor, 'getFtepApprovalConfig').and.returnValue(
        {}
      );

      ftepApprovalConfigService
        .saveFtepApprovalConfig(dummyFtepApprovalConfig)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyFtepApprovalConfigResponse);
      expect(
        FtepApprovalConfigAdaptor.getFtepApprovalConfig
      ).toHaveBeenCalledWith(dummyFtepApprovalConfigResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(FtepApprovalConfigAdaptor, 'getFtepApprovalConfig').and.returnValue(
        dummyFtepApprovalConfigResponse
      );

      ftepApprovalConfigService
        .saveFtepApprovalConfig(dummyFtepApprovalConfig)
        .subscribe(data => {
          expect(data).toEqual(dummyFtepApprovalConfigResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('updateFtepApprovalConfig', () => {
    const dummyFtepApprovalConfig: FtepApprovalConfig = {
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
      ftepApprovalConfigService
        .updateFtepApprovalConfig(dummyFtepApprovalConfig)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call FtepApprovalConfigAdaptor getFtepApprovalConfig method with correct  parameters', () => {
      spyOn(FtepApprovalConfigAdaptor, 'getFtepApprovalConfig').and.returnValue(
        {}
      );

      ftepApprovalConfigService
        .updateFtepApprovalConfig(dummyFtepApprovalConfig)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyFtepApprovalConfigResponse);
      expect(
        FtepApprovalConfigAdaptor.getFtepApprovalConfig
      ).toHaveBeenCalledWith(dummyFtepApprovalConfigResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(FtepApprovalConfigAdaptor, 'getFtepApprovalConfig').and.returnValue(
        dummyFtepApprovalConfigResponse
      );

      ftepApprovalConfigService
        .updateFtepApprovalConfig(dummyFtepApprovalConfig)
        .subscribe(data => {
          expect(data).toEqual(dummyFtepApprovalConfigResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('getFtepApprovalConfig', () => {
    const path = getUpdateConfigurationUrl('1', 'Regular');

    it('should call GET  api method with correct url and params', () => {
      spyOn(FtepApprovalConfigAdaptor, 'getFtepApprovalConfig').and.returnValue(
        {}
      );

      ftepApprovalConfigService
        .getFtepApprovalConfig('1', 'Regular')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call FtepApprovalConfigAdaptor getFtepApprovalConfig method with correct  parameters', () => {
      spyOn(FtepApprovalConfigAdaptor, 'getFtepApprovalConfig').and.returnValue(
        {}
      );

      ftepApprovalConfigService
        .getFtepApprovalConfig('1', 'Regular')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyFtepApprovalConfigResponse);
      expect(
        FtepApprovalConfigAdaptor.getFtepApprovalConfig
      ).toHaveBeenCalledWith(dummyFtepApprovalConfigResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(FtepApprovalConfigAdaptor, 'getFtepApprovalConfig').and.returnValue(
        dummyFtepApprovalConfigResponse
      );

      ftepApprovalConfigService
        .getFtepApprovalConfig('1', 'Regular')
        .subscribe(data => {
          expect(data).toEqual(dummyFtepApprovalConfigResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getNewFtepApprovalConfigByRuleId', () => {
    const newFtepApprovalConfig: FtepApprovalConfig = {
      ruleId: 'new',
      ruleType: '',
      description: '',
      isActive: true
    };
    it('should call FtepApprovalConfigAdaptor getFtepApprovalConfig method with correct  parameters', () => {
      spyOn(FtepApprovalConfigAdaptor, 'getFtepApprovalConfig').and.returnValue(
        {}
      );

      ftepApprovalConfigService.getNewFtepApprovalConfigByRuleId();

      expect(
        FtepApprovalConfigAdaptor.getFtepApprovalConfig
      ).toHaveBeenCalledWith(false);
    });

    it('should return data mapped by adaptors', () => {
      ftepApprovalConfigService.getNewFtepApprovalConfigByRuleId();
      expect(newFtepApprovalConfig).toEqual(newFtepApprovalConfig);
    });
  });

  describe('searchFtepApprovalConfigByFtepType', () => {
    it('should call POST  api method with correct url and params', () => {
      spyOn(
        FtepApprovalConfigAdaptor,
        'getFtepApprovalConfigList'
      ).and.returnValue({});
      const searchValue = 'Regular';
      const path = getSearchConfigByConfigNameUrl('Regular');

      ftepApprovalConfigService
        .searchFtepApprovalConfigByFtepType(searchValue)
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

    it('should call FtepApprovalConfigAdaptor getFtepApprovalConfigList method with correct  parameters', () => {
      spyOn(
        FtepApprovalConfigAdaptor,
        'getFtepApprovalConfigList'
      ).and.returnValue({});
      const searchValue = 'Regular';
      const path = getSearchConfigByConfigNameUrl('Regular');
      ftepApprovalConfigService
        .searchFtepApprovalConfigByFtepType(searchValue)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyFtepApprovalConfigRequestResponse);
      expect(
        FtepApprovalConfigAdaptor.getFtepApprovalConfigList
      ).toHaveBeenCalledWith(dummyFtepApprovalConfigRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        FtepApprovalConfigAdaptor,
        'getFtepApprovalConfigList'
      ).and.returnValue({
        ftepApprovalConfigList: [dummyFtepApprovalConfigResponse],
        totalElements: 10
      });
      const searchValue = 'Regular';
      const path = getSearchConfigByConfigNameUrl('Regular');

      ftepApprovalConfigService
        .searchFtepApprovalConfigByFtepType(searchValue)
        .subscribe(data => {
          expect(data).toEqual({
            ftepApprovalConfigList: [dummyFtepApprovalConfigResponse],
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
      spyOn(FtepApprovalConfigAdaptor, 'getRoleList').and.returnValue({});
      const lovType = DiscountLovTypesEnum.APPROVAL_ROLES;
      const url = getDiscountTypesUrl(lovType);

      ftepApprovalConfigService.getRoleList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path + url.params;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call FtepApprovalConfigAdaptor getRoleList method with correct  parameters', () => {
      spyOn(FtepApprovalConfigAdaptor, 'getRoleList').and.returnValue({});

      const lovType = DiscountLovTypesEnum.APPROVAL_ROLES;
      const url = getDiscountTypesUrl(lovType);
      ftepApprovalConfigService.getRoleList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path + url.params;
      });

      request.flush(dummyFtepTypeResponse);
      expect(FtepApprovalConfigAdaptor.getRoleList).toHaveBeenCalledWith(
        dummyFtepTypeResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(FtepApprovalConfigAdaptor, 'getRoleList').and.returnValue(
        dummyFtepTypeResponse
      );

      const lovType = DiscountLovTypesEnum.APPROVAL_ROLES;
      const url = getDiscountTypesUrl(lovType);

      ftepApprovalConfigService.getRoleList().subscribe(data => {
        expect(data).toEqual(dummyFtepTypeResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path + url.params;
      });

      request.flush({});
    });
  });
});
