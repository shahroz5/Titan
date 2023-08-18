import { TestBed } from '@angular/core/testing';

import {
  IbtConfiguration,
  IbtConfigurationResponse
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { IbtConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getConfigurationListUrl,
  getSearchConfigByConfigNameUrl,
  getUpdateConfigurationUrl,
  getSaveConfigurationUrl
} from '@poss-web/shared/util-api-service';
import { IbtConfigurationService } from './ibt-configuration.service';
describe('IbtConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let ibtConfigurationService: IbtConfigurationService;

  const dummyIbtConfigurationResponse: IbtConfigurationResponse[] = [
    {
      description: 'IBT Configuration',
      configId: '1',
      configType: 'IBT',
      isActive: true,
      maxProductsPerStn: '10',
      maxReqPerMonth: '20',
      maxValPerStn: '45',
      validRequestTime: '55'
    }
  ];
  const ibtConfiguration: IbtConfigurationResponse = {
    configId: '1',
    configType: 'IBT_CONFIGURATION',
    description: 'Ibt',
    isActive: true,
    maxProductsPerStn: '10',
    maxReqPerMonth: '20',
    maxValPerStn: '45',
    validRequestTime: '55'
  };
  const dummyIbtConfigurationRequestResponse = {
    results: dummyIbtConfigurationResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IbtConfigurationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    ibtConfigurationService = TestBed.inject(IbtConfigurationService);
  });

  it('should be created', () => {
    expect(ibtConfigurationService).toBeTruthy();
  });

  describe('getIbtConfiguratonList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfigurationList').and.returnValue(
        {}
      );
      const pageIndex = 0;
      const pageSize = 10;
      const url = getConfigurationListUrl(pageIndex, pageSize);

      ibtConfigurationService
        .getIbtConfiguratonList(pageIndex, pageSize)
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

    it('should call IbtConfigurationAdaptor getIbtConfigurationList method with correct  parameters', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfigurationList').and.returnValue(
        {}
      );
      const pageIndex = 0;
      const pageSize = 10;

      const url = getConfigurationListUrl(pageIndex, pageSize);
      ibtConfigurationService
        .getIbtConfiguratonList(pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyIbtConfigurationRequestResponse);
      expect(
        IbtConfigurationAdaptor.getIbtConfigurationList
      ).toHaveBeenCalledWith(dummyIbtConfigurationRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfigurationList').and.returnValue(
        {
          ibtConfigList: dummyIbtConfigurationResponse,
          totalElements: 10
        }
      );
      const pageIndex = 0;
      const pageSize = 10;

      const url = getConfigurationListUrl(pageIndex, pageSize);

      ibtConfigurationService
        .getIbtConfiguratonList(pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual({
            ibtConfigList: dummyIbtConfigurationResponse,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('saveIbtConfiguration', () => {
    const path = getSaveConfigurationUrl('IBT_CONFIGURATIONS');

    const dummyIbtConfiguration: IbtConfiguration = {
      description: 'IBT Configuration',
      isActive: true,
      ruleDetails: {
        data: {
          maxProductsPerStn: '10',
          maxReqPerMonth: '20',
          maxValPerStn: '45',
          validRequestTime: '55'
        },
        type: 'IBT_CONFIGURATIONS'
      }
    };

    it('should call POST api method with correct url and params', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfiguration').and.returnValue({});

      ibtConfigurationService
        .saveIbtConfiguration(dummyIbtConfiguration)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call IbtConfigurationAdaptor getIbtConfiguration method with correct  parameters', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfiguration').and.returnValue({});

      ibtConfigurationService
        .saveIbtConfiguration(dummyIbtConfiguration)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(ibtConfiguration);
      expect(IbtConfigurationAdaptor.getIbtConfiguration).toHaveBeenCalledWith(
        ibtConfiguration
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfiguration').and.returnValue(
        ibtConfiguration
      );

      ibtConfigurationService
        .saveIbtConfiguration(dummyIbtConfiguration)
        .subscribe(data => {
          expect(data).toEqual(ibtConfiguration);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('updateIbtConfiguration', () => {
    const dummyIbtConfiguration: IbtConfiguration = {
      configId: '1',
      description: 'IBT Configuration',
      isActive: true,
      ruleDetails: {
        data: {
          maxProductsPerStn: '10',
          maxReqPerMonth: '20',
          maxValPerStn: '45',
          validRequestTime: '55'
        },
        type: 'IBT_CONFIGURATIONS'
      }
    };
    const path = getUpdateConfigurationUrl('1', 'IBT_CONFIGURATIONS');
    it('should call PATCH api method with correct url and params', () => {
      ibtConfigurationService
        .updateIbtConfiguration(dummyIbtConfiguration)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call IbtConfigurationAdaptor getIbtConfiguration method with correct  parameters', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfiguration').and.returnValue({});

      ibtConfigurationService
        .updateIbtConfiguration(dummyIbtConfiguration)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(ibtConfiguration);
      expect(IbtConfigurationAdaptor.getIbtConfiguration).toHaveBeenCalledWith(
        ibtConfiguration
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfiguration').and.returnValue(
        ibtConfiguration
      );

      ibtConfigurationService
        .updateIbtConfiguration(dummyIbtConfiguration)
        .subscribe(data => {
          expect(data).toEqual(ibtConfiguration);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('getIbtConfiguration', () => {
    const path = getUpdateConfigurationUrl('1', 'IBT_CONFIGURATIONS');

    it('should call GET  api method with correct url and params', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfiguration').and.returnValue({});

      ibtConfigurationService.getIbtConfiguration('1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call IbtConfigurationAdaptor getIbtConfiguration method with correct  parameters', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfiguration').and.returnValue({});

      ibtConfigurationService.getIbtConfiguration('1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(ibtConfiguration);
      expect(IbtConfigurationAdaptor.getIbtConfiguration).toHaveBeenCalledWith(
        ibtConfiguration
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfiguration').and.returnValue(
        ibtConfiguration
      );

      ibtConfigurationService.getIbtConfiguration('1').subscribe(data => {
        expect(data).toEqual(ibtConfiguration);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getNewIbtConfigurationByConfigId', () => {
    const newIbt: IbtConfiguration = {
      configId: 'new',
      configType: '',
      description: '',
      isActive: true
    };
    it('should call IbtConfigurationAdaptor getIbtConfiguration method with correct  parameters', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfiguration').and.returnValue({});

      ibtConfigurationService.getNewIbtConfigurationByConfigId();

      expect(IbtConfigurationAdaptor.getIbtConfiguration).toHaveBeenCalledWith(
        false
      );
    });

    it('should return data mapped by adaptors', () => {
      ibtConfigurationService.getNewIbtConfigurationByConfigId();
      expect(newIbt).toEqual(newIbt);
    });
  });

  describe('searchConfigByConfigName', () => {
    it('should call POST  api method with correct url and params', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfigurationList').and.returnValue(
        {}
      );
      const searchValue = 'IBT_CONFIGURATIONS';
      const path = getSearchConfigByConfigNameUrl('IBT_CONFIGURATIONS');

      ibtConfigurationService.searchConfigByConfigName(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call IbtConfigurationAdaptor getIbtConfigurationList method with correct  parameters', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfigurationList').and.returnValue(
        {}
      );
      const searchValue = 'IBT_CONFIGURATIONS';
      const path = getSearchConfigByConfigNameUrl('IBT_CONFIGURATIONS');
      ibtConfigurationService.searchConfigByConfigName(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyIbtConfigurationRequestResponse);
      expect(
        IbtConfigurationAdaptor.getIbtConfigurationList
      ).toHaveBeenCalledWith(dummyIbtConfigurationRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(IbtConfigurationAdaptor, 'getIbtConfigurationList').and.returnValue(
        {
          ibtConfigList: dummyIbtConfigurationResponse,
          totalElements: 10
        }
      );
      const searchValue = 'IBT_CONFIGURATIONS';
      const path = getSearchConfigByConfigNameUrl('IBT_CONFIGURATIONS');

      ibtConfigurationService
        .searchConfigByConfigName(searchValue)
        .subscribe(data => {
          expect(data).toEqual({
            ibtConfigList: dummyIbtConfigurationResponse,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
});
