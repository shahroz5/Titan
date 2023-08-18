import { TestBed } from '@angular/core/testing';

import {
  UpdateFieldValuePayload,
  InvglobalConfiguration,
  InvglobalConfigurationFiledValue
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { InventoryGlobalConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getConfigurationListUrl,
  getUpdateConfigFiledValueUrl
} from '@poss-web/shared/util-api-service';
import { InventoryGlobalConfigService } from './inventory-global-config.service';
describe('InventoryGlobalConfigService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let inventoryGlobalConfigService: InventoryGlobalConfigService;

  const updateFieldValuePayload: UpdateFieldValuePayload = {
    configId: '1',
    ruleDetails: {
      data: {
        maxTimeToMoveTranscToHistory: '250'
      },
      type: 'HISTROY_TIME_CONFIG'
    }
  };

  const invglobalConfigurationFiledValue: InvglobalConfigurationFiledValue = {
    maxTimeToMoveTranscToHistory: '250'
  };
  const invglobalConfiguration: InvglobalConfiguration[] = [
    {
      configId: '1',
      description: 'testConfig',
      isActive: true,
      configType: 'HISTORY_TIME_CONFIG',
      ruleDetails: {
        data: {
          maxTimeToMoveTranscToHistory: '1'
        },
        type: 'HISTORY_TIME_CONFIG'
      }
    }
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InventoryGlobalConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    inventoryGlobalConfigService = TestBed.inject(InventoryGlobalConfigService);
  });

  it('should be created', () => {
    expect(inventoryGlobalConfigService).toBeTruthy();
  });

  describe('getInvGlobalConfigurationList', () => {
    const url = getConfigurationListUrl('HISTORY_TIME_CONFIGURATION');
    it('should call GET api method with correct url and params', () => {
      spyOn(
        InventoryGlobalConfigAdaptor,
        'getInvGlobalConfigurationList'
      ).and.returnValue({});

      inventoryGlobalConfigService.getInvGlobalConfigurationList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call InventoryGlobalConfigAdaptor getInvGlobalConfigurationList method with correct  parameters', () => {
      spyOn(
        InventoryGlobalConfigAdaptor,
        'getInvGlobalConfigurationList'
      ).and.returnValue({});

      inventoryGlobalConfigService.getInvGlobalConfigurationList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(invglobalConfiguration);
      expect(
        InventoryGlobalConfigAdaptor.getInvGlobalConfigurationList
      ).toHaveBeenCalledWith(invglobalConfiguration);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        InventoryGlobalConfigAdaptor,
        'getInvGlobalConfigurationList'
      ).and.returnValue(invglobalConfiguration);

      inventoryGlobalConfigService
        .getInvGlobalConfigurationList()
        .subscribe(data => {
          expect(data).toEqual(invglobalConfiguration);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getInvGlobalConfigurationFiledValue', () => {
    const configId = '1';
    const path = getUpdateConfigFiledValueUrl(
      configId,
      'HISTORY_TIME_CONFIGURATION'
    );
    it('should call GET api method with correct url and params', () => {
      spyOn(
        InventoryGlobalConfigAdaptor,
        'getInvGlobalConfigFiledValues'
      ).and.returnValue({});

      inventoryGlobalConfigService
        .getInvGlobalConfigurationFiledValue(configId)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call InventoryGlobalConfigAdaptor getInvGlobalConfigFiledValues method with correct  parameters', () => {
      spyOn(
        InventoryGlobalConfigAdaptor,
        'getInvGlobalConfigFiledValues'
      ).and.returnValue({});

      inventoryGlobalConfigService
        .getInvGlobalConfigurationFiledValue(configId)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(invglobalConfigurationFiledValue);
      expect(
        InventoryGlobalConfigAdaptor.getInvGlobalConfigFiledValues
      ).toHaveBeenCalledWith(invglobalConfigurationFiledValue);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        InventoryGlobalConfigAdaptor,
        'getInvGlobalConfigFiledValues'
      ).and.returnValue(invglobalConfigurationFiledValue);

      inventoryGlobalConfigService
        .getInvGlobalConfigurationFiledValue(configId)
        .subscribe(data => {
          expect(data).toEqual(invglobalConfigurationFiledValue);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('updateInvGlobalonfigurationFieldValue', () => {
    const configId = '1';
    const path = getUpdateConfigFiledValueUrl(
      configId,
      'HISTORY_TIME_CONFIGURATION'
    );

    it('should call PATCH api method with correct url and params', () => {
      spyOn(
        InventoryGlobalConfigAdaptor,
        'getInvGlobalConfigFiledValues'
      ).and.returnValue({});

      inventoryGlobalConfigService
        .updateInvGlobalonfigurationFieldValue(updateFieldValuePayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call InventoryGlobalConfigAdaptor getInvGlobalConfigFiledValues method with correct  parameters', () => {
      spyOn(
        InventoryGlobalConfigAdaptor,
        'getInvGlobalConfigFiledValues'
      ).and.returnValue({});

      inventoryGlobalConfigService
        .updateInvGlobalonfigurationFieldValue(updateFieldValuePayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(invglobalConfigurationFiledValue);
      expect(
        InventoryGlobalConfigAdaptor.getInvGlobalConfigFiledValues
      ).toHaveBeenCalledWith(invglobalConfigurationFiledValue);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        InventoryGlobalConfigAdaptor,
        'getInvGlobalConfigFiledValues'
      ).and.returnValue(invglobalConfigurationFiledValue);

      inventoryGlobalConfigService
        .updateInvGlobalonfigurationFieldValue(updateFieldValuePayload)
        .subscribe(data => {
          expect(data).toEqual(invglobalConfigurationFiledValue);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
});
