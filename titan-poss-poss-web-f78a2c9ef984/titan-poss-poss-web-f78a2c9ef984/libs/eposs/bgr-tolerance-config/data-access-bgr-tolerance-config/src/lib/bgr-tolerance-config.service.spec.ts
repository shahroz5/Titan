import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  AbToleranceConfigMetalType,
  AbToleranceConfigResponse
} from '@poss-web/shared/models';
import { AbToleranceConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getBgrToleranceConfigWeightRangeUrl,
  getConfigurationListUrl,
  getMetalTypesUrl,
  getRangeMappingRulesUrl,
  getSearchConfigByConfigNameUrl,
  getUpdateConfigurationUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { BgrToleranceConfigService } from './bgr-tolerance-config.service';

describe('BgrToleranceConfigService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let bgrToleranceConfigService: BgrToleranceConfigService;

  const pageIndex = 0;
  const pageSize = 10;
  const ruleType = 'BGR_TOLERANCE_CONFIG';
  const configList: {
    data: AbToleranceConfigResponse[];
    totalElements: number;
  } = {
    totalElements: 1,
    data: [
      {
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      }
    ]
  };
  const configData = {
    ruleId: 1,
    ruleType: 'ORDER_BGR_TOLERANCE',
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
        BgrToleranceConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    bgrToleranceConfigService = TestBed.inject(BgrToleranceConfigService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(bgrToleranceConfigService).toBeTruthy();
  });

  describe('getConfigDetailsList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        AbToleranceConfigAdaptor,
        'getAbToleranceConfigListData'
      ).and.returnValue({});

      const url = getConfigurationListUrl(pageIndex, pageSize);
      bgrToleranceConfigService
        .getBgrToleranceConfigList(pageIndex, pageSize)
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

    it('should call BgrToleranceConfigAdaptor getConfigDetailsListData method with correct  parameters', () => {
      spyOn(
        AbToleranceConfigAdaptor,
        'getAbToleranceConfigListData'
      ).and.returnValue({});

      const url = getConfigurationListUrl(pageIndex, pageSize);
      bgrToleranceConfigService
        .getBgrToleranceConfigList(pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(configList);
      expect(
        AbToleranceConfigAdaptor.getAbToleranceConfigListData
      ).toHaveBeenCalledWith(configList);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        AbToleranceConfigAdaptor,
        'getAbToleranceConfigListData'
      ).and.returnValue(configList);

      const url = getConfigurationListUrl(pageIndex, pageSize);
      bgrToleranceConfigService
        .getBgrToleranceConfigList(pageIndex, pageSize)
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
        AbToleranceConfigAdaptor,
        'getAbToleranceConfigListData'
      ).and.returnValue({});

      const url = getSearchConfigByConfigNameUrl();
      bgrToleranceConfigService
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

    it('should call BgrToleranceConfigAdaptor getConfigDetailsListData method with correct  parameters', () => {
      spyOn(
        AbToleranceConfigAdaptor,
        'getAbToleranceConfigListData'
      ).and.returnValue({});

      const url = getSearchConfigByConfigNameUrl();
      bgrToleranceConfigService
        .searchConfigByConfigName('configtest')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(configList);
      expect(
        AbToleranceConfigAdaptor.getAbToleranceConfigListData
      ).toHaveBeenCalledWith(configList);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        AbToleranceConfigAdaptor,
        'getAbToleranceConfigListData'
      ).and.returnValue(configList);

      const url = getSearchConfigByConfigNameUrl();
      bgrToleranceConfigService
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

  describe('getSelectedConfigDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(AbToleranceConfigAdaptor, 'getSelectedConfigData').and.returnValue(
        {}
      );

      const url = getUpdateConfigurationUrl('1', ruleType);
      bgrToleranceConfigService.getSelectedConfigDetails('1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    // it('should call BgrToleranceConfigAdaptor getConfigDetailsListData method with correct  parameters', () => {
    //   spyOn(AbToleranceConfigAdaptor, 'getSelectedConfigData').and.returnValue(
    //     {}
    //   );

    //   const url = getUpdateConfigurationUrl('1', ruleType);
    //   bgrToleranceConfigService.getSelectedConfigDetails('1').subscribe();

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + url;
    //   });

    //   request.flush(configData);
    //   expect(
    //     AbToleranceConfigAdaptor.getSelectedConfigData
    //   ).toHaveBeenCalledWith(configData);
    // });

    // it('should return data mapped by adaptors', () => {
    //   spyOn(AbToleranceConfigAdaptor, 'getSelectedConfigData').and.returnValue(
    //     configData
    //   );

    //   const url = getUpdateConfigurationUrl('1', ruleType);
    //   bgrToleranceConfigService
    //     .getSelectedConfigDetails('1')
    //     .subscribe(data1 => {
    //       expect(data1).toEqual(configData);
    //     });

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + url;
    //   });

    //   request.flush({});
    // });
  });

  describe('getConfigMapping', () => {
    it('should call GET api method with correct url and params', () => {
      // const reqPayload: AbToleranceConfigDetailsReqPayload = {
      //   configId: '1111111',
      //   ruleType: ruleType,
      //   pageIndex: 0,
      //   pageSize: 10,
      //   sort: []
      // };
      spyOn(AbToleranceConfigAdaptor, 'getConfigMapping').and.returnValue({});

      const url = getRangeMappingRulesUrl('1111111', 'BGR_TOLERANCE_CONFIG');
      bgrToleranceConfigService.getConfigMapping('1111111').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    // it('should call GET api method with correct url and params', () => {
    //   // const reqPayload: AbToleranceConfigDetailsReqPayload = {
    //   //   configId: 'new',
    //   //   ruleType: ruleType,
    //   //   pageIndex: 0,
    //   //   pageSize: 10,
    //   //   sort: []
    //   // };
    //   spyOn(AbToleranceConfigAdaptor, 'getConfigMappingNew').and.returnValue(
    //     {}
    //   );
    //   bgrToleranceConfigService.getConfigMapping('1111111').subscribe();
    // });

    // it('should call AbToleranceConfigAdaptor getConfigMapping method with correct  parameters', () => {
    //   spyOn(AbToleranceConfigAdaptor, 'getConfigMapping').and.returnValue({});
    //   // const reqPayload: AbToleranceConfigDetailsReqPayload = {
    //   //   configId: '1111111',
    //   //   ruleType: ruleType,
    //   //   pageIndex: 0,
    //   //   pageSize: 10,
    //   //   sort: []
    //   // };
    //   const url = getRangeMappingRulesUrl('1111111', 'BGR_TOLERANCE_CONFIG');
    //   bgrToleranceConfigService.getConfigMapping('1111111').subscribe();

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + url;
    //   });

    //   request.flush([ruleConfig]);
    //   expect(AbToleranceConfigAdaptor.getConfigMapping).toHaveBeenCalledWith([
    //     ruleConfig
    //   ]);
    // });
  });
  describe('loadMetalTypes', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        AbToleranceConfigAdaptor,
        'getAbToleranceConfigMetalTypes'
      ).and.returnValue({});

      const url = getMetalTypesUrl();
      bgrToleranceConfigService.loadMetalTypes().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call AbToleranceConfigAdaptor getAbToleranceConfigMetalTypes method with correct  parameters', () => {
      spyOn(
        AbToleranceConfigAdaptor,
        'getAbToleranceConfigMetalTypes'
      ).and.returnValue({});
      const responsePayload: AbToleranceConfigMetalType[] = [
        { description: 'GOLD', materialTypeCode: 'J' }
      ];
      const url = getMetalTypesUrl();
      bgrToleranceConfigService.loadMetalTypes().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(responsePayload);
      expect(
        AbToleranceConfigAdaptor.getAbToleranceConfigMetalTypes
      ).toHaveBeenCalledWith(responsePayload);
    });

    it('should return data mapped by adaptors', () => {
      const responsePayload: AbToleranceConfigMetalType[] = [
        { description: 'GOLD', materialTypeCode: 'J' }
      ];
      spyOn(
        AbToleranceConfigAdaptor,
        'getAbToleranceConfigMetalTypes'
      ).and.returnValue(responsePayload);

      const url = getMetalTypesUrl();
      bgrToleranceConfigService.loadMetalTypes().subscribe(data1 => {
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
        AbToleranceConfigAdaptor,
        'getAbToleranceRangeWeight'
      ).and.returnValue({});

      const url = getBgrToleranceConfigWeightRangeUrl();
      bgrToleranceConfigService.loadRangeWeight().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    // it('should call AbToleranceConfigAdaptor getAbToleranceRangeWeight method with correct  parameters', () => {
    //   spyOn(
    //     AbToleranceConfigAdaptor,
    //     'getAbToleranceRangeWeight'
    //   ).and.returnValue({});
    //   const responsePayload: AbToleranceWeightRange[] = [
    //     { id: '11111111111111', range: '10-20', rowId: 2 }
    //   ];
    //   const url = getAbToleranceConfigWeightRangeUrl();
    //   bgrToleranceConfigService.loadRangeWeight().subscribe();

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + url.path;
    //   });

    //   request.flush(responsePayload);
    //   expect(
    //     AbToleranceConfigAdaptor.getAbToleranceRangeWeight
    //   ).toHaveBeenCalledWith(responsePayload);
    // });

    // it('should return data mapped by adaptors', () => {
    //   const responsePayload: AbToleranceWeightRange[] = [
    //     { id: '11111111111111', range: '10-20', rowId: 2 }
    //   ];
    //   spyOn(
    //     AbToleranceConfigAdaptor,
    //     'getAbToleranceRangeWeight'
    //   ).and.returnValue(responsePayload);

    //   const url = getAbToleranceConfigWeightRangeUrl();
    //   bgrToleranceConfigService.loadRangeWeight().subscribe(data1 => {
    //     expect(data1).toEqual(responsePayload);
    //   });

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + url.path;
    //   });

    //   request.flush({});
    // });
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
              type: 'ORDER_BGR_CONFIG'
            }
          }
        ]
      }
    };
    it('should call PATCH api method with correct url and params', () => {
      spyOn(AbToleranceConfigAdaptor, 'getConfigMapping').and.returnValue({});

      const url = getRangeMappingRulesUrl(
        reqPayload.configId,
        reqPayload.ruleType
      );
      bgrToleranceConfigService
        .UpdateConfigMapping(
          reqPayload.configId,
          reqPayload.weightToleranceRequest
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

    it('should call AbToleranceConfigAdaptor getConfigMapping method with correct  parameters', () => {
      spyOn(AbToleranceConfigAdaptor, 'getConfigMapping').and.returnValue({});
      const url = getRangeMappingRulesUrl(
        reqPayload.configId,
        reqPayload.ruleType
      );
      bgrToleranceConfigService
        .UpdateConfigMapping(
          reqPayload.configId,
          reqPayload.weightToleranceRequest
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({ ruleDetails: [ruleConfig], totalElements: 1 });
      expect(AbToleranceConfigAdaptor.getConfigMapping).toHaveBeenCalledWith({
        ruleDetails: [ruleConfig],
        totalElements: 1
      });
    });

    it('should return data mapped by adaptors', () => {
      spyOn(AbToleranceConfigAdaptor, 'getConfigMapping').and.returnValue({
        ruleDetails: [],
        totalElements: 1
      });

      const url = getRangeMappingRulesUrl(
        reqPayload.configId,
        reqPayload.ruleType
      );
      bgrToleranceConfigService
        .UpdateConfigMapping(
          reqPayload.configId,
          reqPayload.weightToleranceRequest
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
        AbToleranceConfigAdaptor,
        'getAbToleranceConfiguration'
      ).and.returnValue({});

      const url = getUpdateConfigurationUrl(
        configData.ruleId.toString(),
        ruleType
      );
      bgrToleranceConfigService.updateConfig(configData).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call AbToleranceConfigAdaptor getAbToleranceConfiguration method with correct  parameters', () => {
      spyOn(
        AbToleranceConfigAdaptor,
        'getAbToleranceConfiguration'
      ).and.returnValue({});

      const url = getUpdateConfigurationUrl(
        configData.ruleId.toString(),
        ruleType
      );
      bgrToleranceConfigService.updateConfig(configData).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(configData);
      expect(
        AbToleranceConfigAdaptor.getAbToleranceConfiguration
      ).toHaveBeenCalledWith(configData);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        AbToleranceConfigAdaptor,
        'getAbToleranceConfiguration'
      ).and.returnValue(configData);

      const url = getUpdateConfigurationUrl(
        configData.ruleId.toString(),
        ruleType
      );
      bgrToleranceConfigService.updateConfig(configData).subscribe(data1 => {
        expect(data1).toEqual(configData);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });

  // describe('saveConfig', () => {
  //   const reqPayload = {
  //     configData,
  //     payload: {
  //       addRangeConfigs: [
  //         {
  //           rangeId: '45321A06-2133-4F2D-A385-E3ACF4E819AD',
  //           rowId: 29,
  //           metalType: 'J',
  //           rangeDetails: {
  //             data: {
  //               configValue: '1.000',
  //               configPercent: '1.000'
  //             },
  //             type: 'ORDER_BGR_CONFIG'
  //           }
  //         }
  //       ],
  //       updateRangeConfigs: [
  //         {
  //           rangeId: '851B2408-985D-49CB-86EC-0CA112333173',
  //           rowId: 3,
  //           id: '5251B218-19D4-4DCD-AE68-A6E73B0A8FA2',
  //           metalType: 'J',
  //           rangeDetails: {
  //             data: {
  //               configValue: '1.000',
  //               configPercent: '1.000'
  //             },
  //             type: 'ORDER_BGR_CONFIG'
  //           }
  //         }
  //       ]
  //     },
  //     ruleType
  //   };
  //   it('should call POST api method with correct url and params', () => {
  //     // spyOn(
  //     //   AbToleranceConfigAdaptor,
  //     //   'getAbToleranceConfiguration'
  //     // ).and.returnValue({});

  //     const url = getSaveConfigurationUrl(ruleType);
  //     bgrToleranceConfigService
  //       .saveConfig(reqPayload.configData, reqPayload.payload)
  //       .subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + url;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('POST');
  //     expect(request.request.responseType).toEqual('json');

  //     request.flush({});
  //   });
  // });
});
