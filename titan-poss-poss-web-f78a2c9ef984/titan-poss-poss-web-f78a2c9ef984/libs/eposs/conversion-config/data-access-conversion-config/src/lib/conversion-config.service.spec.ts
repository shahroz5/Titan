import { ConversionConfigService } from './conversion-config.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { ConversionConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ConversionConfigValuesByIdUrl,
  CreateConversionConfigByIdUrl,
  CreateconversionConfigUrl,
  filterUrl,
  getConfigurationListUrl,
  ProductCategoryUrl,
  ProductGroupsUrl
} from '@poss-web/shared/util-api-service';
import {
  ConversionConfigList,
  SaveConversionConfigValuesPayload,
  UpdateToggleButtonPayload
} from '@poss-web/shared/models';
describe('ConversionConfigService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let conversionConfigService: ConversionConfigService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConversionConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    conversionConfigService = TestBed.inject(ConversionConfigService);
  });
  const listResponse: ConversionConfigList = {
    conversionConfigList: [
      {
        description: 'Configuration',
        isActive: true
      }
    ],
    totalElements: 1
  };
  const updateStatusPayload: UpdateToggleButtonPayload = {
    id: 1,
    toggleButton: {
      isActive: true,
      ruleDetails: {}
    }
  };
  const dummyConversionConfigList = {
    results: listResponse.conversionConfigList,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };
  const savePayload: SaveConversionConfigValuesPayload = {
    configId: 1,
    createConfig: {
      description: 'Configuration',
      isActive: true,
      ruleDetails: {}
    },
    configValues: {
      addProducts: [
        {
          productCategoryCode: '71',
          productGroupCode: '72',
          ruleDetails: {
            allowedLimitValue: 123,
            allowedLimitWeight: 13,
            autoApprovalLimitValue: 13,
            autoApprovalLimitWeight: 13
          }
        }
      ],
      removeProducts: [],
      updateProducts: []
    }
  };

  describe('getConversionConfiguratonList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ConversionConfigAdaptor, 'ConversionConfigList').and.returnValue(
        {}
      );
      const { path, params } = getConfigurationListUrl(0, 10);

      conversionConfigService.getConversionConfiguratonList(0, 10).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual('0');
      expect(request.request.params.get('size').toString()).toEqual('10');
      request.flush({});
    });

    it('should call ConversionConfigAdaptor ConversionConfigList method with correct  parameters', () => {
      spyOn(ConversionConfigAdaptor, 'ConversionConfigList').and.returnValue(
        {}
      );
      const pageIndex = 0;
      const pageSize = 10;

      const path = getConfigurationListUrl(pageIndex, pageSize).path;

      conversionConfigService
        .getConversionConfiguratonList(pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyConversionConfigList);
      expect(ConversionConfigAdaptor.ConversionConfigList).toHaveBeenCalledWith(
        dummyConversionConfigList
      );
    });
    it('should return data mapped by adaptors', () => {
      spyOn(ConversionConfigAdaptor, 'ConversionConfigList').and.returnValue(
        listResponse
      );
      const pageIndex = 0;
      const pageSize = 10;

      const path = getConfigurationListUrl(pageIndex, pageSize).path;

      conversionConfigService
        .getConversionConfiguratonList(pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual(listResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('SearchConfigName', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ConversionConfigAdaptor, 'ConversionConfigList').and.returnValue(
        {}
      );
      const path = filterUrl();

      conversionConfigService.search('Configuration').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });
    it('should call ConversionConfigAdaptor ConversionConfigList method with correct  parameters', () => {
      spyOn(ConversionConfigAdaptor, 'ConversionConfigList').and.returnValue(
        {}
      );

      const path = filterUrl();

      conversionConfigService.search('ConfigName').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyConversionConfigList);
      expect(ConversionConfigAdaptor.ConversionConfigList).toHaveBeenCalledWith(
        dummyConversionConfigList
      );
    });
    it('should return data mapped by adaptors', () => {
      spyOn(ConversionConfigAdaptor, 'ConversionConfigList').and.returnValue(
        listResponse
      );

      const path = filterUrl();

      conversionConfigService.search('ConfigName').subscribe(data => {
        expect(data).toEqual(listResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('updateToggleButton', () => {
    it('should call GET api method with correct url and params', () => {
      const path = CreateConversionConfigByIdUrl(updateStatusPayload.id);

      conversionConfigService
        .updateToggleButton(updateStatusPayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });
  });

  describe('updateConversionConfigDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const path = CreateConversionConfigByIdUrl(savePayload.configId);

      conversionConfigService
        .updateConversionConfigDetails(savePayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });
  });
  describe('saveConversionConfigValues', () => {
    it('should call GET api method with correct url and params', () => {
      const path = CreateconversionConfigUrl();

      conversionConfigService
        .saveConversionConfigValues(savePayload)
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
  });
  describe('getConversionConfigDetaildById', () => {
    it('should call GET api method with correct url and params', () => {
      const path = CreateConversionConfigByIdUrl(12);

      conversionConfigService.getConversionConfigDetaildById(12).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });
  });
  describe('loadProductGroups', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ConversionConfigAdaptor, 'getProductGroups').and.returnValue({});
      const { path, params } = ProductGroupsUrl();

      conversionConfigService.loadProductGroups().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('isActive').toString()).toEqual('true');
      request.flush({});
    });
  });
  describe('loadProductCategories', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ConversionConfigAdaptor, 'getProductCategories').and.returnValue(
        {}
      );
      const { path, params } = ProductCategoryUrl();

      conversionConfigService.loadProductCategories().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('isActive').toString()).toEqual('true');
      request.flush({});
    });
  });
});
