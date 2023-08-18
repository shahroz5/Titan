import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  CoToleranceConfigDetailsReqPayload,
  CoToleranceConfigMetalType,
  CoToleranceConfigResponse,
  CoToleranceWeightRange
} from '@poss-web/shared/models';
import { CoToleranceConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getCoToleranceConfigWeightRangeUrl,
  getCoToleranceRangeMappingRulesUrl,
  getConfigurationListUrl,
  getMetalTypesUrl,
  getRangeMappingRulesUrl,
  getSaveConfigurationUrl,
  getSearchConfigByConfigNameUrl,
  getUpdateConfigurationUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CoToleranceConfigService } from './co-tolerance-config.service';

describe('CoToleranceConfigService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let coToleranceConfigService: CoToleranceConfigService;

  const pageIndex = 0;
  const pageSize = 10;
  const ruleType = 'ORDER_CO_FROZEN_TOLERANCE';
  const configList: {
    data: CoToleranceConfigResponse[];
    totalElements: number;
  } = {
    totalElements: 1,
    data: [
      {
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      }
    ]
  };
  const configData = {
    ruleId: 1,
    ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
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
        CoToleranceConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    coToleranceConfigService = TestBed.inject(CoToleranceConfigService);
  });

  it('should be created', () => {
    expect(coToleranceConfigService).toBeTruthy();
  });

  describe('getConfigDetailsList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceConfigListData'
      ).and.returnValue({});

      const url = getConfigurationListUrl(pageIndex, pageSize);
      coToleranceConfigService
        .getCoToleranceConfigList(pageIndex, pageSize, ruleType)
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

    it('should call CoToleranceConfigAdaptor getConfigDetailsListData method with correct  parameters', () => {
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceConfigListData'
      ).and.returnValue({});

      const url = getConfigurationListUrl(pageIndex, pageSize);
      coToleranceConfigService
        .getCoToleranceConfigList(pageIndex, pageSize, ruleType)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(configList);
      expect(
        CoToleranceConfigAdaptor.getCoToleranceConfigListData
      ).toHaveBeenCalledWith(configList);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceConfigListData'
      ).and.returnValue(configList);

      const url = getConfigurationListUrl(pageIndex, pageSize);
      coToleranceConfigService
        .getCoToleranceConfigList(pageIndex, pageSize, ruleType)
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
        CoToleranceConfigAdaptor,
        'getCoToleranceConfigListData'
      ).and.returnValue({});

      const url = getSearchConfigByConfigNameUrl();
      coToleranceConfigService
        .searchConfigByConfigName({
          configName: 'configtest',
          ruleType: ruleType
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CoToleranceConfigAdaptor getConfigDetailsListData method with correct  parameters', () => {
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceConfigListData'
      ).and.returnValue({});

      const url = getSearchConfigByConfigNameUrl();
      coToleranceConfigService
        .searchConfigByConfigName({
          configName: 'configtest',
          ruleType: ruleType
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(configList);
      expect(
        CoToleranceConfigAdaptor.getCoToleranceConfigListData
      ).toHaveBeenCalledWith(configList);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceConfigListData'
      ).and.returnValue(configList);

      const url = getSearchConfigByConfigNameUrl();
      coToleranceConfigService
        .searchConfigByConfigName({
          configName: 'configtest',
          ruleType: ruleType
        })
        .subscribe(data1 => {
          expect(data1).toEqual(configList);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });
  describe('uniqueConfigNameCheck', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceConfigListData'
      ).and.returnValue({});

      const url = getSearchConfigByConfigNameUrl();
      coToleranceConfigService.uniqueConfigNameCheck('configtest').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('getSelectedConfigDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CoToleranceConfigAdaptor, 'getSelectedConfigData').and.returnValue(
        {}
      );

      const url = getUpdateConfigurationUrl('1', ruleType);
      coToleranceConfigService
        .getSelectedConfigDetails('1', ruleType)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call CoToleranceConfigAdaptor getConfigDetailsListData method with correct  parameters', () => {
      spyOn(CoToleranceConfigAdaptor, 'getSelectedConfigData').and.returnValue(
        {}
      );

      const url = getUpdateConfigurationUrl('1', ruleType);
      coToleranceConfigService
        .getSelectedConfigDetails('1', ruleType)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(configData);
      expect(
        CoToleranceConfigAdaptor.getSelectedConfigData
      ).toHaveBeenCalledWith(configData);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CoToleranceConfigAdaptor, 'getSelectedConfigData').and.returnValue(
        configData
      );

      const url = getUpdateConfigurationUrl('1', ruleType);
      coToleranceConfigService
        .getSelectedConfigDetails('1', ruleType)
        .subscribe(data1 => {
          expect(data1).toEqual(configData);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });

  describe('getConfigMapping', () => {
    it('should call GET api method with correct url and params', () => {
      const reqPayload: CoToleranceConfigDetailsReqPayload = {
        configId: '1111111',
        ruleType: ruleType,
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      spyOn(CoToleranceConfigAdaptor, 'getConfigMapping').and.returnValue({});

      const url = getCoToleranceRangeMappingRulesUrl(reqPayload);
      coToleranceConfigService.getConfigMapping(reqPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );

      request.flush({});
    });
    it('should call GET api method with correct url and params', () => {
      const reqPayload: CoToleranceConfigDetailsReqPayload = {
        configId: 'new',
        ruleType: ruleType,
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      spyOn(CoToleranceConfigAdaptor, 'getConfigMappingNew').and.returnValue(
        {}
      );
      coToleranceConfigService.getConfigMapping(reqPayload).subscribe();
    });

    it('should call CoToleranceConfigAdaptor getConfigMapping method with correct  parameters', () => {
      spyOn(CoToleranceConfigAdaptor, 'getConfigMapping').and.returnValue({});
      const reqPayload: CoToleranceConfigDetailsReqPayload = {
        configId: '1111111',
        ruleType: ruleType,
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      const url = getCoToleranceRangeMappingRulesUrl(reqPayload);
      coToleranceConfigService.getConfigMapping(reqPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush([ruleConfig]);
      expect(CoToleranceConfigAdaptor.getConfigMapping).toHaveBeenCalledWith([
        ruleConfig
      ]);
    });
  });
  describe('loadMetalTypes', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceConfigMetalTypes'
      ).and.returnValue({});

      const url = getMetalTypesUrl();
      coToleranceConfigService.loadMetalTypes().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call CoToleranceConfigAdaptor getCoToleranceConfigMetalTypes method with correct  parameters', () => {
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceConfigMetalTypes'
      ).and.returnValue({});
      const responsePayload: CoToleranceConfigMetalType[] = [
        { description: 'GOLD', materialTypeCode: 'J' }
      ];
      const url = getMetalTypesUrl();
      coToleranceConfigService.loadMetalTypes().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(responsePayload);
      expect(
        CoToleranceConfigAdaptor.getCoToleranceConfigMetalTypes
      ).toHaveBeenCalledWith(responsePayload);
    });

    it('should return data mapped by adaptors', () => {
      const responsePayload: CoToleranceConfigMetalType[] = [
        { description: 'GOLD', materialTypeCode: 'J' }
      ];
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceConfigMetalTypes'
      ).and.returnValue(responsePayload);

      const url = getMetalTypesUrl();
      coToleranceConfigService.loadMetalTypes().subscribe(data1 => {
        expect(data1).toEqual(responsePayload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadRangeWeight', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceRangeWeight'
      ).and.returnValue({});

      const url = getCoToleranceConfigWeightRangeUrl();
      coToleranceConfigService.loadRangeWeight().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call CoToleranceConfigAdaptor getCoToleranceRangeWeight method with correct  parameters', () => {
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceRangeWeight'
      ).and.returnValue({});
      const responsePayload: CoToleranceWeightRange[] = [
        { id: '11111111111111', range: '10-20', rowId: 2 }
      ];
      const url = getCoToleranceConfigWeightRangeUrl();
      coToleranceConfigService.loadRangeWeight().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(responsePayload);
      expect(
        CoToleranceConfigAdaptor.getCoToleranceRangeWeight
      ).toHaveBeenCalledWith(responsePayload);
    });

    it('should return data mapped by adaptors', () => {
      const responsePayload: CoToleranceWeightRange[] = [
        { id: '11111111111111', range: '10-20', rowId: 2 }
      ];
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceRangeWeight'
      ).and.returnValue(responsePayload);

      const url = getCoToleranceConfigWeightRangeUrl();
      coToleranceConfigService.loadRangeWeight().subscribe(data1 => {
        expect(data1).toEqual(responsePayload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('UpdateConfigMapping', () => {
    const reqPayload = {
      configId: '111111111',
      ruleType: ruleType,
      weightToleranceRequest: {
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
              type: 'ORDER_CO_TOLERANCE_CONFIG'
            }
          }
        ]
      }
    };
    it('should call PATCH api method with correct url and params', () => {
      spyOn(CoToleranceConfigAdaptor, 'getConfigMapping').and.returnValue({});

      const url = getRangeMappingRulesUrl(
        reqPayload.configId,
        reqPayload.ruleType
      );
      coToleranceConfigService
        .UpdateConfigMapping(
          reqPayload.configId,
          reqPayload.weightToleranceRequest,
          reqPayload.ruleType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call CoToleranceConfigAdaptor getConfigMapping method with correct  parameters', () => {
      spyOn(CoToleranceConfigAdaptor, 'getConfigMapping').and.returnValue({});
      const url = getRangeMappingRulesUrl(
        reqPayload.configId,
        reqPayload.ruleType
      );
      coToleranceConfigService
        .UpdateConfigMapping(
          reqPayload.configId,
          reqPayload.weightToleranceRequest,
          reqPayload.ruleType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({ ruleDetails: [ruleConfig], totalElements: 1 });
      expect(CoToleranceConfigAdaptor.getConfigMapping).toHaveBeenCalledWith({
        ruleDetails: [ruleConfig],
        totalElements: 1
      });
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CoToleranceConfigAdaptor, 'getConfigMapping').and.returnValue({
        ruleDetails: [],
        totalElements: 1
      });

      const url = getRangeMappingRulesUrl(
        reqPayload.configId,
        reqPayload.ruleType
      );
      coToleranceConfigService
        .UpdateConfigMapping(
          reqPayload.configId,
          reqPayload.weightToleranceRequest,
          reqPayload.ruleType
        )
        .subscribe(data1 => {
          expect(data1).toEqual({
            ruleDetails: [],
            totalElements: 1
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });

  describe('updateConfig', () => {
    it('should call PATCH api method with correct url and params', () => {
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceConfiguration'
      ).and.returnValue({});

      const url = getUpdateConfigurationUrl(
        configData.ruleId.toString(),
        ruleType
      );
      coToleranceConfigService.updateConfig(configData).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call CoToleranceConfigAdaptor getCoToleranceConfiguration method with correct  parameters', () => {
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceConfiguration'
      ).and.returnValue({});

      const url = getUpdateConfigurationUrl(
        configData.ruleId.toString(),
        ruleType
      );
      coToleranceConfigService.updateConfig(configData).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(configData);
      expect(
        CoToleranceConfigAdaptor.getCoToleranceConfiguration
      ).toHaveBeenCalledWith(configData);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        CoToleranceConfigAdaptor,
        'getCoToleranceConfiguration'
      ).and.returnValue(configData);

      const url = getUpdateConfigurationUrl(
        configData.ruleId.toString(),
        ruleType
      );
      coToleranceConfigService.updateConfig(configData).subscribe(data1 => {
        expect(data1).toEqual(configData);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });

  describe('saveConfig', () => {
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
              type: 'ORDER_CO_TOLERANCE_CONFIG'
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
              type: 'ORDER_CO_TOLERANCE_CONFIG'
            }
          }
        ]
      },
      ruleType
    };
    it('should call POST api method with correct url and params', () => {
      // spyOn(
      //   CoToleranceConfigAdaptor,
      //   'getCoToleranceConfiguration'
      // ).and.returnValue({});

      const url = getSaveConfigurationUrl(ruleType);
      coToleranceConfigService
        .saveConfig(
          reqPayload.configData,
          reqPayload.payload,
          reqPayload.ruleType
        )
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
});
