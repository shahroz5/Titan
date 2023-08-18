import { TestBed } from '@angular/core/testing';

import {
  CnPriorityConfig,
  CnPriorityConfigResponse
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CnPriorityConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getConfigurationListUrl,
  getSearchConfigByConfigNameUrl,
  getUpdateConfigurationUrl,
  getSaveConfigurationUrl,
  getCreditNoteTypeUrl
} from '@poss-web/shared/util-api-service';
import { CnPriorityConfigService } from './cn-priority-config.service';
describe('CnPriorityConfigService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let cnPriorityConfigService: CnPriorityConfigService;

  const dummyCnPriorityConfigResponse: CnPriorityConfigResponse[] = [
    {
      description: 'GEP',
      configId: '1',
      configType: 'GEP',
      isActive: true,
      priorityDetails: []
    }
  ];
  const cnPriorityConfig: CnPriorityConfigResponse = {
    configId: '1',
    configType: 'GEP',
    description: 'GEP',
    isActive: true,
    priorityDetails: []
  };
  const dummyCnPriorityRequestResponse = {
    results: dummyCnPriorityConfigResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  const dummyCNTypeResponse = [
    {
      id: 'GEP',
      description: 'Gold Exchange Policy'
    },
    {
      id: 'TEP',
      description: 'Tanishq Exchange Policy'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CnPriorityConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    cnPriorityConfigService = TestBed.inject(CnPriorityConfigService);
  });

  it('should be created', () => {
    expect(cnPriorityConfigService).toBeTruthy();
  });

  describe('getCnPriorityConfigList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfigList').and.returnValue(
        {}
      );
      const pageIndex = 0;
      const pageSize = 10;
      const url = getConfigurationListUrl(pageIndex, pageSize);

      cnPriorityConfigService
        .getCnPriorityConfigList(pageIndex, pageSize)
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

    it('should call CnPriorityConfigAdaptor getCnPriorityConfigList method with correct  parameters', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfigList').and.returnValue(
        {}
      );
      const pageIndex = 0;
      const pageSize = 10;

      const url = getConfigurationListUrl(pageIndex, pageSize);
      cnPriorityConfigService
        .getCnPriorityConfigList(pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyCnPriorityRequestResponse);
      expect(
        CnPriorityConfigAdaptor.getCnPriorityConfigList
      ).toHaveBeenCalledWith(dummyCnPriorityRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfigList').and.returnValue(
        {
          cnPriorityConfigList: dummyCnPriorityConfigResponse,
          totalElements: 10
        }
      );
      const pageIndex = 0;
      const pageSize = 10;

      const url = getConfigurationListUrl(pageIndex, pageSize);

      cnPriorityConfigService
        .getCnPriorityConfigList(pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual({
            cnPriorityConfigList: dummyCnPriorityConfigResponse,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('saveCnPriorityConfig', () => {
    const path = getSaveConfigurationUrl('CN_PRIORITY_CONFIG');

    const dummyCnPriorityConfig: CnPriorityConfig = {
      description: 'GEP',
      isActive: true,
      ruleDetails: {
        data: {},
        type: 'GEP'
      }
    };

    it('should call POST api method with correct url and params', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfig').and.returnValue({});

      cnPriorityConfigService
        .saveCnPriorityConfig(dummyCnPriorityConfig)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CnPriorityConfigAdaptor getCnPriorityConfig method with correct  parameters', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfig').and.returnValue({});

      cnPriorityConfigService
        .saveCnPriorityConfig(dummyCnPriorityConfig)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(cnPriorityConfig);
      expect(CnPriorityConfigAdaptor.getCnPriorityConfig).toHaveBeenCalledWith(
        cnPriorityConfig
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfig').and.returnValue(
        cnPriorityConfig
      );

      cnPriorityConfigService
        .saveCnPriorityConfig(dummyCnPriorityConfig)
        .subscribe(data => {
          expect(data).toEqual(cnPriorityConfig);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('updateCnPriorityConfig', () => {
    const dummyCnPriorityConfig: CnPriorityConfig = {
      configId: '1',
      description: 'GEP',
      isActive: true,
      ruleDetails: {
        data: {},
        type: 'GEP'
      }
    };
    const path = getUpdateConfigurationUrl('1', 'CN_PRIORITY_CONFIG');
    it('should call PATCH api method with correct url and params', () => {
      cnPriorityConfigService
        .updateCnPriorityConfig(dummyCnPriorityConfig)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CnPriorityConfigAdaptor getCnPriorityConfig method with correct  parameters', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfig').and.returnValue({});

      cnPriorityConfigService
        .updateCnPriorityConfig(dummyCnPriorityConfig)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(cnPriorityConfig);
      expect(CnPriorityConfigAdaptor.getCnPriorityConfig).toHaveBeenCalledWith(
        cnPriorityConfig
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfig').and.returnValue(
        cnPriorityConfig
      );

      cnPriorityConfigService
        .updateCnPriorityConfig(dummyCnPriorityConfig)
        .subscribe(data => {
          expect(data).toEqual(cnPriorityConfig);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('getCnPriorityConfig', () => {
    const path = getUpdateConfigurationUrl('1', 'CN_PRIORITY_CONFIG');

    it('should call GET  api method with correct url and params', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfig').and.returnValue({});

      cnPriorityConfigService.getCnPriorityConfig('1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call CnPriorityConfigAdaptor getCnPriorityConfig method with correct  parameters', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfig').and.returnValue({});

      cnPriorityConfigService.getCnPriorityConfig('1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(cnPriorityConfig);
      expect(CnPriorityConfigAdaptor.getCnPriorityConfig).toHaveBeenCalledWith(
        cnPriorityConfig
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfig').and.returnValue(
        cnPriorityConfig
      );

      cnPriorityConfigService.getCnPriorityConfig('1').subscribe(data => {
        expect(data).toEqual(cnPriorityConfig);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getNewCnPriorityConfigByConfigId', () => {
    const newCnConfig: CnPriorityConfig = {
      configId: 'new',
      configType: '',
      description: '',
      isActive: true
    };
    it('should call CnPriorityConfigAdaptor getCnPriorityConfig method with correct  parameters', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfig').and.returnValue({});

      cnPriorityConfigService.getNewCnPriorityConfigByConfigId();

      expect(CnPriorityConfigAdaptor.getCnPriorityConfig).toHaveBeenCalledWith(
        false
      );
    });

    it('should return data mapped by adaptors', () => {
      cnPriorityConfigService.getNewCnPriorityConfigByConfigId();
      expect(newCnConfig).toEqual(newCnConfig);
    });
  });

  describe('searchConfigByConfigName', () => {
    it('should call POST  api method with correct url and params', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfigList').and.returnValue(
        {}
      );
      const searchValue = 'CN_PRIORITY_CONFIG';
      const path = getSearchConfigByConfigNameUrl('CN_PRIORITY_CONFIG');

      cnPriorityConfigService.searchConfigByConfigName(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call CnPriorityConfigAdaptor getCnPriorityConfigList method with correct  parameters', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfigList').and.returnValue(
        {}
      );
      const searchValue = 'CN_PRIORITY_CONFIG';
      const path = getSearchConfigByConfigNameUrl('CN_PRIORITY_CONFIG');
      cnPriorityConfigService.searchConfigByConfigName(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyCnPriorityRequestResponse);
      expect(
        CnPriorityConfigAdaptor.getCnPriorityConfigList
      ).toHaveBeenCalledWith(dummyCnPriorityRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnPriorityConfigList').and.returnValue(
        {
          cnPriorityConfigList: dummyCnPriorityConfigResponse,
          totalElements: 10
        }
      );
      const searchValue = 'CN_PRIORITY_CONFIG';
      const path = getSearchConfigByConfigNameUrl('CN_PRIORITY_CONFIG');

      cnPriorityConfigService
        .searchConfigByConfigName(searchValue)
        .subscribe(data => {
          expect(data).toEqual({
            cnPriorityConfigList: dummyCnPriorityConfigResponse,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getCreditNoteType', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnTypeList').and.returnValue({});

      const url = getCreditNoteTypeUrl();

      cnPriorityConfigService.getCreditNoteType().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call CnPriorityConfigAdaptor getCnTypeList method with correct  parameters', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnTypeList').and.returnValue({});

      const url = getCreditNoteTypeUrl();
      cnPriorityConfigService.getCreditNoteType().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(dummyCNTypeResponse);
      expect(CnPriorityConfigAdaptor.getCnTypeList).toHaveBeenCalledWith(
        dummyCNTypeResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CnPriorityConfigAdaptor, 'getCnTypeList').and.returnValue(
        dummyCNTypeResponse
      );

      const url = getCreditNoteTypeUrl();

      cnPriorityConfigService.getCreditNoteType().subscribe(data => {
        expect(data).toEqual(dummyCNTypeResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });
});
