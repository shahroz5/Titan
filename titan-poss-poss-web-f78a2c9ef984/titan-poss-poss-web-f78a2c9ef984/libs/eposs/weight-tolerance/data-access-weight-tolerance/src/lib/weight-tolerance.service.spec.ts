import { TestBed } from '@angular/core/testing';

import {
  weightToleranceEnum,
  WeightToleranceList,
  ConfigDetails,
  WeightToleranceResponse,
  WeightToleranceRequest,
  WeightRange,
  WeightTolerance
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { WeightToleranceAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getConfigurationListUrl,
  getUpdateConfigurationUrl,
  getSearchConfigByConfigNameUrl,
  getProductGroupMappingRulesUrl,
  getWeightRangeUrl
} from '@poss-web/shared/util-api-service';
import { WeightToleranceService } from './weight-tolerance.service';
describe('WeightToleranceService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let weightValueConfigService: WeightToleranceService;

  const pageIndex = 0;
  const pageSize = 10;
  const weightToleranceList: WeightToleranceList = {
    configList: [
      {
        configId: '1',
        configType: weightToleranceEnum.ruleType,
        configName: 'TEST',
        isActive: true,
        ruleDetails: {
          data: {},
          type: weightToleranceEnum.ruleType
        }
      }
    ],
    totalElements: 1
  };
  const weightTolerance: ConfigDetails = {
    configId: '1',
    configType: weightToleranceEnum.ruleType,
    configName: 'TEST',
    isActive: true
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WeightToleranceService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    weightValueConfigService = TestBed.inject(WeightToleranceService);
  });

  it('should be created', () => {
    expect(weightValueConfigService).toBeTruthy();
  });

  describe('getConfigDetailsList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(WeightToleranceAdaptor, 'getConfigDetailsListData').and.returnValue(
        {}
      );

      const url = getConfigurationListUrl(pageIndex, pageSize);
      weightValueConfigService
        .getConfigDetailsList(pageIndex, pageSize)
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

    it('should call WeightToleranceAdaptor getConfigDetailsListData method with correct  parameters', () => {
      spyOn(WeightToleranceAdaptor, 'getConfigDetailsListData').and.returnValue(
        {}
      );

      const url = getConfigurationListUrl(pageIndex, pageSize);
      weightValueConfigService
        .getConfigDetailsList(pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(weightToleranceList);
      expect(
        WeightToleranceAdaptor.getConfigDetailsListData
      ).toHaveBeenCalledWith(weightToleranceList);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(WeightToleranceAdaptor, 'getConfigDetailsListData').and.returnValue(
        weightToleranceList
      );

      const url = getConfigurationListUrl(pageIndex, pageSize);
      weightValueConfigService
        .getConfigDetailsList(pageIndex, pageSize)
        .subscribe(data1 => {
          expect(data1).toEqual(weightToleranceList);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getSelectedConfigDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(WeightToleranceAdaptor, 'getSelectedConfigData').and.returnValue(
        {}
      );
      const path = getUpdateConfigurationUrl('1', weightToleranceEnum.ruleType);
      weightValueConfigService.getSelectedConfigDetails('1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call WeightToleranceAdaptor getSelectedConfigData method with correct  parameters', () => {
      spyOn(WeightToleranceAdaptor, 'getSelectedConfigData').and.returnValue(
        {}
      );
      const path = getUpdateConfigurationUrl('1', weightToleranceEnum.ruleType);
      weightValueConfigService.getSelectedConfigDetails('1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(weightTolerance);
      expect(WeightToleranceAdaptor.getSelectedConfigData).toHaveBeenCalledWith(
        weightTolerance
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(WeightToleranceAdaptor, 'getSelectedConfigData').and.returnValue(
        weightTolerance
      );
      const path = getUpdateConfigurationUrl('1', weightToleranceEnum.ruleType);
      weightValueConfigService
        .getSelectedConfigDetails('1')
        .subscribe(data1 => {
          expect(data1).toEqual(weightTolerance);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('searchConfigDetailsByconfigName', () => {
    const path = getSearchConfigByConfigNameUrl(weightToleranceEnum.ruleType);
    it('should call POST api method with correct url and params', () => {
      spyOn(WeightToleranceAdaptor, 'getConfigDetailsListData').and.returnValue(
        {}
      );

      weightValueConfigService
        .searchConfigDetailsByconfigName('test')
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

    it('should call WeightToleranceAdaptor getConfigDetailsListData method with correct  parameters', () => {
      spyOn(WeightToleranceAdaptor, 'getConfigDetailsListData').and.returnValue(
        {}
      );

      weightValueConfigService
        .searchConfigDetailsByconfigName('test')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(weightToleranceList);
      expect(
        WeightToleranceAdaptor.getConfigDetailsListData
      ).toHaveBeenCalledWith(weightToleranceList);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(WeightToleranceAdaptor, 'getConfigDetailsListData').and.returnValue(
        weightToleranceList
      );

      weightValueConfigService
        .searchConfigDetailsByconfigName('test')
        .subscribe(data1 => {
          expect(data1).toEqual(weightToleranceList);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getWeightTolerance', () => {
    const path = getProductGroupMappingRulesUrl(
      '1',
      weightToleranceEnum.ruleType
    );
    const weightToleranceResponse: WeightToleranceResponse = {
      weightTolerance: [
        {
          rangeId: '1',
          productGroupCode: '76',
          tolerance: '1',
          id: []
        }
      ],
      totalElements: 10
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(WeightToleranceAdaptor, 'getWeightTolerance').and.returnValue({});
      const configId = '1';
      const productGroupCode = '71';

      weightValueConfigService
        .getWeightTolerance(pageIndex, pageSize, configId, productGroupCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call WeightToleranceAdaptor getWeightTolerance method with correct  parameters', () => {
      spyOn(WeightToleranceAdaptor, 'getWeightTolerance').and.returnValue({});
      const configId = '1';
      const productGroupCode = '71';

      weightValueConfigService
        .getWeightTolerance(pageIndex, pageSize, configId, productGroupCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(weightToleranceResponse);
      expect(WeightToleranceAdaptor.getWeightTolerance).toHaveBeenCalledWith(
        weightToleranceResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(WeightToleranceAdaptor, 'getWeightTolerance').and.returnValue(
        weightToleranceResponse
      );
      const configId = '1';

      const productGroupCode = '71';
      weightValueConfigService
        .getWeightTolerance(pageIndex, pageSize, configId, productGroupCode)
        .subscribe(data1 => {
          expect(data1).toEqual(weightToleranceResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('updateWeightTolerance', () => {
    const path = getProductGroupMappingRulesUrl(
      '1',
      weightToleranceEnum.ruleType
    );
    const weightToleranceRequest: WeightToleranceRequest = {
      addProducts: [
        {
          productGroupCode: '76',
          rangeId: '76',
          rowId: 1,
          ruleDetails: {
            data: {
              weightTolGrams: '76'
            },
            type: '76'
          }
        }
      ],
      removeProducts: ['76']
    };
    const weightToleranceResponse: WeightToleranceResponse = {
      weightTolerance: [
        {
          rangeId: '1',
          productGroupCode: '76',
          tolerance: '1',
          id: []
        }
      ],
      totalElements: 10
    };
    it('should call PATCH api method with correct url and params', () => {
      spyOn(WeightToleranceAdaptor, 'getWeightTolerance').and.returnValue({});

      weightValueConfigService
        .updateWeightTolerance('1', weightToleranceRequest)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call WeightToleranceAdaptor getWeightTolerance method with correct  parameters', () => {
      spyOn(WeightToleranceAdaptor, 'getWeightTolerance').and.returnValue({});

      weightValueConfigService
        .updateWeightTolerance('1', weightToleranceRequest)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(weightToleranceResponse);
      expect(WeightToleranceAdaptor.getWeightTolerance).toHaveBeenCalledWith(
        weightToleranceResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(WeightToleranceAdaptor, 'getWeightTolerance').and.returnValue(
        weightToleranceResponse
      );

      weightValueConfigService
        .updateWeightTolerance('1', weightToleranceRequest)
        .subscribe(data1 => {
          expect(data1).toEqual(weightToleranceResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadRangeWeight', () => {
    const weightRange: WeightRange[] = [
      {
        range: '100-200',
        id: '1',
        rowId: '1'
      }
    ];

    it('should call GET api method with correct url and params', () => {
      spyOn(WeightToleranceAdaptor, 'getRangeWeight').and.returnValue({});
      const url = getWeightRangeUrl();
      weightValueConfigService.loadRangeWeight().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call WeightToleranceAdaptor getRangeWeight method with correct  parameters', () => {
      spyOn(WeightToleranceAdaptor, 'getRangeWeight').and.returnValue({});
      weightValueConfigService.loadRangeWeight().subscribe();
      const url = getWeightRangeUrl();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(weightRange);
      expect(WeightToleranceAdaptor.getRangeWeight).toHaveBeenCalledWith(
        weightRange
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(WeightToleranceAdaptor, 'getRangeWeight').and.returnValue(
        weightRange
      );
      const url = getWeightRangeUrl();
      weightValueConfigService.loadRangeWeight().subscribe(data1 => {
        expect(data1).toEqual(weightRange);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('updateIsActive', () => {
    const path = getUpdateConfigurationUrl('1', weightToleranceEnum.ruleType);
    it('should call PATH api method with correct url and params', () => {
      weightValueConfigService.updateIsActive('1', {}).subscribe();

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
});
