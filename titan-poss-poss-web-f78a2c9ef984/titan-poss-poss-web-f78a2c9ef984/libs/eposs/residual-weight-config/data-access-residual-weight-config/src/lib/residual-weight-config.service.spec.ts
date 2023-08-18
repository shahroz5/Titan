import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  LoadResidualToleranceByConfigidPayload,
  RangeConfigRequest,
  ResidualWeightConfigResponse
} from '@poss-web/shared/models';
import { ResidualWeightConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  geResidualRangeMappingRulesUrl,
  getConfigurationListUrl,
  getRangeMappingRulesUrl,
  getResidualWeightRangeUrl,
  getSaveConfigurationUrl,
  getSearchConfigByConfigNameUrl,
  getUpdateConfigurationUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { ResidualWeightConfigService } from './residual-weight-config.service';

describe('ResidualWeightConfigService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let residualWeightConfigService: ResidualWeightConfigService;

  const pageIndex = 0;
  const pageSize = 10;
  const ruleType = 'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG';
  const configList: {
    data: ResidualWeightConfigResponse[];
    totalElements: number;
  } = {
    data: [
      {
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFIG'
      }
    ],
    totalElements: 1
  };
  const configData = {
    ruleId: 1,
    ruleType: 'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG',
    description: 'configtest',
    isActive: true,
    ruleDetails: { data: null, type: ruleType }
  };
  const ruleConfig = {
    rangeId: '22222222',
    configValue: 10,
    configPercent: 10,
    metalType: 'J',
    id: '1111111111'
  };

  // const weightTolerance: ConfigDetails = {
  //   configId: '1',
  //   configType: weightToleranceEnum.ruleType,
  //   configName: 'TEST',
  //   isActive: true
  // };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ResidualWeightConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    residualWeightConfigService = TestBed.inject(ResidualWeightConfigService);
  });

  it('should be created', () => {
    expect(residualWeightConfigService).toBeTruthy();
  });

  describe('getResidualWeightConfigList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualWeightConfigListData'
      ).and.returnValue({});

      const url = getConfigurationListUrl(pageIndex, pageSize);
      residualWeightConfigService
        .getResidualWeightConfigList(pageIndex, pageSize)
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

    it('should call ResidualWeightConfigAdaptor getResidualWeightConfigListData method with correct  parameters', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualWeightConfigListData'
      ).and.returnValue({});

      const url = getConfigurationListUrl(pageIndex, pageSize);
      residualWeightConfigService
        .getResidualWeightConfigList(pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(configList);
      expect(
        ResidualWeightConfigAdaptor.getResidualWeightConfigListData
      ).toHaveBeenCalledWith(configList);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualWeightConfigListData'
      ).and.returnValue(configList);

      const url = getConfigurationListUrl(pageIndex, pageSize);
      residualWeightConfigService
        .getResidualWeightConfigList(pageIndex, pageSize)
        .subscribe(data1 => {
          expect(data1).toEqual(configList);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
  describe('searchConfigByConfigName', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualWeightConfigListData'
      ).and.returnValue({});

      const url = getSearchConfigByConfigNameUrl();
      residualWeightConfigService
        .searchConfigByConfigName('configtest')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call ResidualWeightConfigAdaptor getResidualWeightConfigListData method with correct  parameters', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualWeightConfigListData'
      ).and.returnValue({});

      const url = getSearchConfigByConfigNameUrl();
      residualWeightConfigService
        .searchConfigByConfigName('configtest')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(configList);
      expect(
        ResidualWeightConfigAdaptor.getResidualWeightConfigListData
      ).toHaveBeenCalledWith(configList);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualWeightConfigListData'
      ).and.returnValue(configList);

      const url = getSearchConfigByConfigNameUrl();
      residualWeightConfigService
        .searchConfigByConfigName('configtest')
        .subscribe(data1 => {
          expect(data1).toEqual(configList);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });
  describe('saveResidualWeightConfig', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualWeightConfigListData'
      ).and.returnValue({});
      const reqPayload = {
        configData,
        payload: {
          addRangeConfigs: [
            {
              rangeId: '45321A06-2133-4F2D-A385-E3ACF4E819AD',
              rowId: 29,
              metalType: 'J',
              rangeDetails: {
                data: {
                  configValue: '1.000',
                  configPercent: '1.000'
                },
                type: 'ORDER_AB_TOLERANCE_CONFIG'
              }
            }
          ],
          updateRangeConfigs: [
            {
              rangeId: '851B2408-985D-49CB-86EC-0CA112333173',
              rowId: 3,
              id: '5251B218-19D4-4DCD-AE68-A6E73B0A8FA2',
              metalType: 'J',
              rangeDetails: {
                data: {
                  configValue: '1.000',
                  configPercent: '1.000'
                },
                type: 'ORDER_AB_TOLERANCE_CONFIG'
              }
            }
          ]
        },
        ruleType
      };
      const url = getSaveConfigurationUrl(ruleType);
      residualWeightConfigService
        .saveResidualWeightConfig(reqPayload.configData, reqPayload.payload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
  describe('updateResidualWeightConfig', () => {
    it('should call PATCH api method with correct url and params', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualWeightConfiguration'
      ).and.returnValue({});

      const url = getUpdateConfigurationUrl(
        configData.ruleId.toString(),
        ruleType
      );
      residualWeightConfigService
        .updateResidualWeightConfig(configData)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call ResidualWeightConfigAdaptor getResidualWeightConfiguration method with correct  parameters', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualWeightConfiguration'
      ).and.returnValue({});

      const url = getUpdateConfigurationUrl(
        configData.ruleId.toString(),
        ruleType
      );
      residualWeightConfigService
        .updateResidualWeightConfig(configData)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(configData);
      expect(
        ResidualWeightConfigAdaptor.getResidualWeightConfiguration
      ).toHaveBeenCalledWith(configData);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualWeightConfiguration'
      ).and.returnValue(configData);

      const url = getUpdateConfigurationUrl(
        configData.ruleId.toString(),
        ruleType
      );
      residualWeightConfigService
        .updateResidualWeightConfig(configData)
        .subscribe(data1 => {
          expect(data1).toEqual(configData);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });
  describe('loadRangeWeight', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualRangeWeight'
      ).and.returnValue({});

      const url = getResidualWeightRangeUrl();
      residualWeightConfigService.loadRangeWeight().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call ResidualWeightConfigAdaptor getResidualRangeWeight method with correct  parameters', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualRangeWeight'
      ).and.returnValue({});

      const url = getResidualWeightRangeUrl();
      residualWeightConfigService.loadRangeWeight().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(configData);
      expect(
        ResidualWeightConfigAdaptor.getResidualRangeWeight
      ).toHaveBeenCalledWith(configData);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualRangeWeight'
      ).and.returnValue([{ id: '11111111111111', range: '10-20', rowId: 2 }]);

      const url = getResidualWeightRangeUrl();
      residualWeightConfigService.loadRangeWeight().subscribe(data1 => {
        expect(data1).toEqual([
          {
            id: '11111111111111',
            range: '10-20',
            rowId: 2
          }
        ]);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
  describe('selectedConfigDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualWeightConfiguration'
      ).and.returnValue({});

      const url = getUpdateConfigurationUrl('1111111111111', ruleType);
      residualWeightConfigService
        .selectedConfigDetails('1111111111111')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
  describe('getRangeMapping', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualWeightConfiguration'
      ).and.returnValue({});
      const payload: LoadResidualToleranceByConfigidPayload = {
        configId: '111111111',
        pageIndex: 0,
        pageSize: 10
      };
      const url = geResidualRangeMappingRulesUrl(payload, ruleType);
      residualWeightConfigService.getRangeMapping(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
  describe('UpdateRangeMapping', () => {
    it('should call PATCH api method with correct url and params', () => {
      spyOn(
        ResidualWeightConfigAdaptor,
        'getResidualWeightConfiguration'
      ).and.returnValue({});
      const payload: {
        configId: string;
        weightToleranceRequest: RangeConfigRequest;
      } = {
        configId: '111111111',
        weightToleranceRequest: { removeRangeConfigs: [] }
      };
      const url = getRangeMappingRulesUrl('111111111', ruleType);
      residualWeightConfigService
        .UpdateRangeMapping(payload.configId, payload.weightToleranceRequest)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
});
