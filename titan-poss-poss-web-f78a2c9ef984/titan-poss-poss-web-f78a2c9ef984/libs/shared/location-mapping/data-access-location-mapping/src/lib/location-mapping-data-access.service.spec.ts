import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  ActiveConfig,
  ConfigTypeEnum,
  LoadActiveConfigsPayload,
  LoadMappedLocationsPayload,
  LocationMappingOption,
  Tax,
  UpdateLocationMappingPayload
} from '@poss-web/shared/models';
import { LocationMappingDataAccessService } from './location-mapping-data-access.service';
import { LocationMappingHelper } from '@poss-web/shared/util-adaptors';
import {
  getExchangeActiveConfigsUrl,
  getExchangeConfigByIdUrl,
  getMappedLocationByConfigIdUrl,
  getPayerBankActiveConfigsUrl,
  getPayerBankConfigByIdUrl,
  getPaymentActiveConfigsUrl,
  getPaymentConfigLocationMappingUrlByIdUrl,
  getRuleTypeActiveConfigUrl
} from '@poss-web/shared/util-api-service';

describe('Location Mapping Service Testing', () => {
  let httpTestingController: HttpTestingController;
  let locationMappingDataAccessService: LocationMappingDataAccessService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LocationMappingDataAccessService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    locationMappingDataAccessService = TestBed.inject(
      LocationMappingDataAccessService
    );
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(LocationMappingDataAccessService).toBeTruthy();
  });

  describe('loadGSTMappingList', () => {
    it('(Payment Configuration) should call GET api method with correct url and params', () => {
      spyOn(LocationMappingHelper, 'getMappedLocations').and.returnValue({});
      const payload: LoadMappedLocationsPayload = {
        ruleType: ConfigTypeEnum.CUSTOMER_TRANSACTION_CONFIGURATIONS,
        ruleID: 'ID'
      };

      const { path, params } = getPaymentConfigLocationMappingUrlByIdUrl(
        payload.ruleID,
        payload.ruleType
      );

      locationMappingDataAccessService.getMappedLocations(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('config-type')).toEqual(
        payload.ruleType
      );
      request.flush({});
    });

    it('(GEP Configuration) should call GET api method with correct url and params', () => {
      spyOn(LocationMappingHelper, 'getMappedLocations').and.returnValue({});
      const payload: LoadMappedLocationsPayload = {
        ruleType: ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS,
        ruleID: 'ID'
      };

      const { path, params } = getExchangeConfigByIdUrl(
        payload.ruleID,
        payload.ruleType
      );

      locationMappingDataAccessService.getMappedLocations(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType')).toEqual(
        payload.ruleType
      );
      request.flush({});
    });

    it('(Payer bank Configuration) should call GET api method with correct url and params', () => {
      spyOn(LocationMappingHelper, 'getMappedLocations').and.returnValue({});
      const payload: LoadMappedLocationsPayload = {
        ruleType: ConfigTypeEnum.PAYER_BANK_CONFIGURATIONS,
        ruleID: 'ID'
      };

      const { path, params } = getPayerBankConfigByIdUrl(payload.ruleID);

      locationMappingDataAccessService.getMappedLocations(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('(Rule Configuration) should call GET api method with correct url and params', () => {
      spyOn(LocationMappingHelper, 'getMappedLocations').and.returnValue({});
      const payload: LoadMappedLocationsPayload = {
        ruleType: ConfigTypeEnum.WEIGHT_TOLERANCE,
        ruleID: 'ID'
      };

      const { path, params } = getMappedLocationByConfigIdUrl(
        payload.ruleID,
        payload.ruleType
      );

      locationMappingDataAccessService.getMappedLocations(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call Location Mapping Helper method with correct arguments', () => {
      spyOn(LocationMappingHelper, 'getMappedLocations').and.returnValue({});
      const payload: LoadMappedLocationsPayload = {
        ruleType: ConfigTypeEnum.PAYER_BANK_CONFIGURATIONS,
        ruleID: 'ID'
      };

      const loactionMappingApiResponse: {
        results: LocationMappingOption[];
        totalElements: number;
      } = {
        results: [
          {
            id: 'Location 1',
            description: 'L1ID'
          },
          {
            id: 'Location 2',
            description: 'L2ID'
          }
        ],
        totalElements: 1
      };

      const { path, params } = getPayerBankConfigByIdUrl(payload.ruleID);

      locationMappingDataAccessService.getMappedLocations(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(loactionMappingApiResponse);
      expect(LocationMappingHelper.getMappedLocations).toHaveBeenCalledWith(
        loactionMappingApiResponse
      );
    });

    it('should return data mapped by Location Mapping Helper', () => {
      const locationMappingHelperResponse: LocationMappingOption[] = [
        {
          id: 'Location 1',
          description: 'L1ID'
        },
        {
          id: 'Location 2',
          description: 'L2ID'
        }
      ];
      spyOn(LocationMappingHelper, 'getMappedLocations').and.returnValue(
        locationMappingHelperResponse
      );

      const payload: LoadMappedLocationsPayload = {
        ruleType: ConfigTypeEnum.PAYER_BANK_CONFIGURATIONS,
        ruleID: 'ID'
      };
      const { path, params } = getPayerBankConfigByIdUrl(payload.ruleID);

      locationMappingDataAccessService
        .getMappedLocations(payload)
        .subscribe(data => {
          expect(data).toEqual(locationMappingHelperResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('updateLocationMapping', () => {
    it('(Payment Configuration) should call GET api method with correct url and params', () => {
      const payload: UpdateLocationMappingPayload = {
        ruleType: ConfigTypeEnum.CUSTOMER_TRANSACTION_CONFIGURATIONS,
        ruleID: 'ID',
        data: {
          addLocations: ['LOC1'],
          overwriteLocations: ['LOC2'],
          removeLocations: ['LOC3']
        }
      };

      const { path, params } = getPaymentConfigLocationMappingUrlByIdUrl(
        payload.ruleID,
        payload.ruleType
      );

      locationMappingDataAccessService
        .updateLocationMapping(payload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('config-type')).toEqual(
        payload.ruleType
      );
      request.flush({});
    });

    it('(GEP Configuration) should call GET api method with correct url and params', () => {
      const payload: UpdateLocationMappingPayload = {
        ruleType: ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS,
        ruleID: 'ID',
        data: {
          addLocations: ['LOC1'],
          overwriteLocations: ['LOC2'],
          removeLocations: ['LOC3']
        }
      };

      const { path, params } = getExchangeConfigByIdUrl(
        payload.ruleID,
        payload.ruleType
      );

      locationMappingDataAccessService
        .updateLocationMapping(payload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType')).toEqual(
        payload.ruleType
      );
      request.flush({});
    });

    it('(Payer bank Configuration) should call GET api method with correct url and params', () => {
      const payload: UpdateLocationMappingPayload = {
        ruleType: ConfigTypeEnum.PAYER_BANK_CONFIGURATIONS,
        ruleID: 'ID',
        data: {
          addLocations: ['LOC1'],
          overwriteLocations: ['LOC2'],
          removeLocations: ['LOC3']
        }
      };

      const { path, params } = getPayerBankConfigByIdUrl(payload.ruleID);

      locationMappingDataAccessService
        .updateLocationMapping(payload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('(Rule Configuration) should call GET api method with correct url and params', () => {
      const payload: UpdateLocationMappingPayload = {
        ruleType: ConfigTypeEnum.WEIGHT_TOLERANCE,
        ruleID: 'ID',
        data: {
          addLocations: ['LOC1'],
          overwriteLocations: ['LOC2'],
          removeLocations: ['LOC3']
        }
      };

      const { path, params } = getMappedLocationByConfigIdUrl(
        payload.ruleID,
        payload.ruleType
      );

      locationMappingDataAccessService
        .updateLocationMapping(payload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('loadActiveConfigs', () => {
    it('(Payment Configuration) should call GET api method with correct url and params', () => {
      spyOn(LocationMappingHelper, 'getActiveConfigs').and.returnValue({});
      const payload: LoadActiveConfigsPayload = {
        ruleType: ConfigTypeEnum.CUSTOMER_TRANSACTION_CONFIGURATIONS,
        data: {
          excludeRuleId: 'ID1',
          includeLocations: ['ID2']
        }
      };

      const data = {
        excludeConfigId: payload.data.excludeRuleId,
        includeLocations: payload.data.includeLocations
      };

      const { path, params } = getPaymentActiveConfigsUrl(payload.ruleType);

      locationMappingDataAccessService.loadActiveConfigs(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType')).toEqual(
        payload.ruleType
      );
      expect(request.request.body as Object).toEqual(JSON.stringify(data));
      request.flush({});
    });

    it('(GEP Configuration) should call GET api method with correct url and params', () => {
      spyOn(LocationMappingHelper, 'getActiveConfigs').and.returnValue({});
      const payload: LoadActiveConfigsPayload = {
        ruleType: ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS,
        data: {
          excludeRuleId: 'ID1',
          includeLocations: ['ID2']
        }
      };

      const data = {
        excludeConfigId: payload.data.excludeRuleId,
        includeLocations: payload.data.includeLocations
      };

      const { path, params } = getExchangeActiveConfigsUrl(payload.ruleType);

      locationMappingDataAccessService.loadActiveConfigs(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType')).toEqual(
        payload.ruleType
      );
      expect(request.request.body as Object).toEqual(JSON.stringify(data));
      request.flush({});
    });

    it('(Payer bank  Configuration) should call GET api method with correct url and params', () => {
      spyOn(LocationMappingHelper, 'getActiveConfigs').and.returnValue({});
      const payload: LoadActiveConfigsPayload = {
        ruleType: ConfigTypeEnum.PAYER_BANK_CONFIGURATIONS,
        data: {
          excludeRuleId: 'ID1',
          includeLocations: ['ID2']
        }
      };

      const data = {
        excludeConfigId: payload.data.excludeRuleId,
        includeLocations: payload.data.includeLocations
      };

      const { path, params } = getPayerBankActiveConfigsUrl();

      locationMappingDataAccessService.loadActiveConfigs(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');

      expect(request.request.body as Object).toEqual(JSON.stringify(data));
      request.flush({});
    });

    it('(Rule Configuration) should call GET api method with correct url and params', () => {
      spyOn(LocationMappingHelper, 'getActiveConfigs').and.returnValue({});
      const payload: LoadActiveConfigsPayload = {
        ruleType: ConfigTypeEnum.WEIGHT_TOLERANCE,
        data: {
          excludeRuleId: 'ID1',
          includeLocations: ['ID2']
        }
      };

      const data = {
        excludeRuleId: payload.data.excludeRuleId,
        includeLocations: payload.data.includeLocations
      };

      const { path, params } = getRuleTypeActiveConfigUrl(payload.ruleType);

      locationMappingDataAccessService.loadActiveConfigs(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');

      expect(request.request.body as Object).toEqual(JSON.stringify(data));
      request.flush({});
    });

    it('should call Location Mapping Helper method with correct arguments', () => {
      spyOn(LocationMappingHelper, 'getActiveConfigs').and.returnValue({});
      const payload: LoadActiveConfigsPayload = {
        ruleType: ConfigTypeEnum.WEIGHT_TOLERANCE,
        data: {
          excludeRuleId: 'ID1',
          includeLocations: ['ID2']
        }
      };

      const loactionMappingApiResponse: {
        results: LocationMappingOption[];
        totalElements: number;
      } = {
        results: [
          {
            id: 'Location 1',
            description: 'L1ID'
          },
          {
            id: 'Location 2',
            description: 'L2ID'
          }
        ],
        totalElements: 1
      };

      const { path, params } = getRuleTypeActiveConfigUrl(payload.ruleType);

      locationMappingDataAccessService.loadActiveConfigs(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(loactionMappingApiResponse);
      expect(LocationMappingHelper.getActiveConfigs).toHaveBeenCalledWith(
        loactionMappingApiResponse,
        false
      );
    });

    it('should return data mapped by Location Mapping Helper', () => {
      const locationMappingHelperResponse: ActiveConfig[] = [
        {
          configId: 'Location 1',
          configName: 'L1ID',
          locationCode: 'Location 1'
        },
        {
          configId: 'Location 2',
          configName: 'L2ID',
          locationCode: 'Location 2'
        }
      ];
      spyOn(LocationMappingHelper, 'getActiveConfigs').and.returnValue(
        locationMappingHelperResponse
      );

      const payload: LoadActiveConfigsPayload = {
        ruleType: ConfigTypeEnum.WEIGHT_TOLERANCE,
        data: {
          excludeRuleId: 'ID1',
          includeLocations: ['ID2']
        }
      };
      const { path, params } = getRuleTypeActiveConfigUrl(payload.ruleType);

      locationMappingDataAccessService
        .loadActiveConfigs(payload)
        .subscribe(data => {
          expect(data).toEqual(locationMappingHelperResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('isPaymentConfig', () => {
    it('should true for payment config', () => {
      const config1 = ConfigTypeEnum.PAYMENT_CONFIGURATIONS;

      expect(
        locationMappingDataAccessService.isPaymentConfig(config1)
      ).toBeTruthy();

      const config2 = ConfigTypeEnum.CUSTOMER_TRANSACTION_CONFIGURATIONS;

      expect(
        locationMappingDataAccessService.isPaymentConfig(config2)
      ).toBeTruthy();
    });

    it('should false for if it is not payment config', () => {
      const config1 = ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS;

      expect(
        locationMappingDataAccessService.isPaymentConfig(config1)
      ).toBeFalsy();

      const config2 = ConfigTypeEnum.TEP_EXCEPTION;

      expect(
        locationMappingDataAccessService.isPaymentConfig(config2)
      ).toBeFalsy();
    });
  });

  describe('isGEPConfig', () => {
    it('should true for GEP config', () => {
      const config1 = ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS;

      expect(
        locationMappingDataAccessService.isGEPConfig(config1)
      ).toBeTruthy();

      const config2 = ConfigTypeEnum.TEP_EXCEPTION;

      expect(
        locationMappingDataAccessService.isGEPConfig(config2)
      ).toBeTruthy();

      const config3 = ConfigTypeEnum.TEP_VALIDATION;

      expect(
        locationMappingDataAccessService.isGEPConfig(config3)
      ).toBeTruthy();

      const config4 = ConfigTypeEnum.TEP_ITEM;

      expect(
        locationMappingDataAccessService.isGEPConfig(config4)
      ).toBeTruthy();

      const config5 = ConfigTypeEnum.TEP_STONE;

      expect(
        locationMappingDataAccessService.isGEPConfig(config5)
      ).toBeTruthy();
    });

    it('should false for if it is not GEP config', () => {
      const config1 = ConfigTypeEnum.PAYMENT_CONFIGURATIONS;

      expect(locationMappingDataAccessService.isGEPConfig(config1)).toBeFalsy();

      const config2 = ConfigTypeEnum.CUSTOMER_TRANSACTION_CONFIGURATIONS;

      expect(locationMappingDataAccessService.isGEPConfig(config2)).toBeFalsy();
    });
  });

  describe('isPayerBankConfig', () => {
    it('should true for Payer Bank config', () => {
      const config1 = ConfigTypeEnum.PAYER_BANK_CONFIGURATIONS;

      expect(
        locationMappingDataAccessService.isPayerBankConfig(config1)
      ).toBeTruthy();
    });

    it('should false for if it is not payment config', () => {
      const config1 = ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS;

      expect(
        locationMappingDataAccessService.isPayerBankConfig(config1)
      ).toBeFalsy();
    });
  });

  describe('createActiveConfigPayload', () => {
    it('should create config based payload if it is config type', () => {
      const data = {
        excludeRuleId: 'ID1',
        includeLocations: ['ID2']
      };

      const isConfig = true;

      const expected = {
        excludeConfigId: 'ID1',
        includeLocations: ['ID2']
      };
      expect(
        locationMappingDataAccessService.createActiveConfigPayload(
          data,
          isConfig
        )
      ).toEqual(expected);
    });

    it('should false for if it is not payment config', () => {
      const data = {
        excludeRuleId: 'ID1',
        includeLocations: ['ID2']
      };

      const isConfig = false;

      const expected = {
        excludeRuleId: 'ID1',
        includeLocations: ['ID2']
      };
      expect(
        locationMappingDataAccessService.createActiveConfigPayload(
          data,
          isConfig
        )
      ).toEqual(expected);
    });
  });
});
