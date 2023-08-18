import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OrderPayementRulesRequest, OrderpyamentRulesResponse } from '@poss-web/shared/models';
import { getConfigurationListUrl, getProductGroupMappingGetRulesUrl, getProductGroupMappingRulesUrl, getSearchConfigByConfigNameUrl, getUniqueConfigByConfigNameUrl, getUpdateConfigurationUrl } from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { OrderPaymentConfigAdaptor } from 'libs/shared/util-adaptors/src/lib/configuration/order-payment-config.adaptor';
import { OrderPaymentConfigService } from './order-payment-config.service';

describe('orderPaymentConfigService', () => {
  let httpTestingController: HttpTestingController;
  let orderPaymentConfigService: OrderPaymentConfigService;
  const apiUrl = 'http://localhost:3000';

  const selectedConfigPaymentPayload: OrderPayementRulesRequest = {
    pageIndex: 0,
    pageSize: 10,
    configId: 'configId',
    productGroupCode: 'productGroup',
    isPageable: false,
    sort: []
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OrderPaymentConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    orderPaymentConfigService = TestBed.inject(OrderPaymentConfigService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(OrderPaymentConfigService).toBeTruthy();
  });

  describe('getOrderPaymentConfigList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(OrderPaymentConfigAdaptor, 'getConfigDetailsListData').and.returnValue({});
      const url = getConfigurationListUrl(0, 10).path;
      orderPaymentConfigService.getOrderPaymentConfigList(0, 10).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should return data mapped by adaptors', () => {
      spyOn(OrderPaymentConfigAdaptor, 'getConfigDetailsListData').and.returnValue({});

      const url = getConfigurationListUrl(0, 10).path;
      orderPaymentConfigService.getOrderPaymentConfigList(0, 10).subscribe(data => {
        expect(data).toEqual(data);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    })
  })

  describe('updateIsActive', () => {
    it('should call PATCH api method with correct url and params', () => {
      const url = getUpdateConfigurationUrl('configId', 'ORDER_AB_PAYMENT_CONFIG');
      orderPaymentConfigService.updateIsActive('configId', 'ORDER_AB_PAYMENT_CONFIG').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');

      request.flush({});
    })
  })

  describe('searchConfigDetailsByconfigName', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(OrderPaymentConfigAdaptor, 'getConfigDetailsListData').and.returnValue({});
      const url = getSearchConfigByConfigNameUrl();
      orderPaymentConfigService.searchConfigDetailsByconfigName('configName').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should return data mapped by adaptors', () => {
      spyOn(OrderPaymentConfigAdaptor, 'getConfigDetailsListData').and.returnValue({});

      const url = getSearchConfigByConfigNameUrl();
      orderPaymentConfigService.searchConfigDetailsByconfigName('configName').subscribe(
        data => {
          expect(data).toEqual(data)
        }
      );

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    })
  })

  describe('getSelectedConfigDetails', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(OrderPaymentConfigAdaptor, 'getSelectedConfigData').and.returnValue({});
      const url = getUpdateConfigurationUrl('configId', 'ORDER_AB_PAYMENT_CONFIG');
      orderPaymentConfigService.getSelectedConfigDetails('configId').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should return data mapped by adaptors', () => {
      spyOn(OrderPaymentConfigAdaptor, 'getSelectedConfigData').and.returnValue({});
      const url = getUpdateConfigurationUrl('configId', 'ORDER_AB_PAYMENT_CONFIG');
      orderPaymentConfigService.getSelectedConfigDetails('configId').subscribe(
        data => {
          expect(data).toEqual(data)
        }
      );
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    })
  })

  describe('getSelectedConfigDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const url = getUniqueConfigByConfigNameUrl().path;
      orderPaymentConfigService.uniqueConfigNameCheck('payload').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should return data mapped by adaptors', () => {
      const url = getUniqueConfigByConfigNameUrl().path;
      orderPaymentConfigService.uniqueConfigNameCheck('payload').subscribe(
        data => {
          expect(data).toEqual(data);
        }
      );
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    })
  })

  describe('getSelectedConfigPaymentDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(OrderPaymentConfigAdaptor, 'getOrderPaymentDetails').and.returnValue({});
      const url = getProductGroupMappingGetRulesUrl(
        selectedConfigPaymentPayload.pageIndex,
        selectedConfigPaymentPayload.pageSize,
        selectedConfigPaymentPayload.configId,
        selectedConfigPaymentPayload.productGroupCode,
        'ORDER_AB_PAYMENT_CONFIG',
        selectedConfigPaymentPayload.isPageable,
        selectedConfigPaymentPayload.sort
      ).path;
      orderPaymentConfigService.getSelectedConfigPaymentDetails(selectedConfigPaymentPayload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should return data mapped by adaptors', () => {
      const response: OrderpyamentRulesResponse = {
        response: [{
          id: '1',
          productGroupCode: 'prodGroup',
          ruleDetails: {
            type: 'type',
            data: null
          }
        }],
        totalElements: 0
      }
      spyOn(OrderPaymentConfigAdaptor, 'getOrderPaymentDetails').and.returnValue(response);
      const url = getProductGroupMappingGetRulesUrl(
        selectedConfigPaymentPayload.pageIndex,
        selectedConfigPaymentPayload.pageSize,
        selectedConfigPaymentPayload.configId,
        selectedConfigPaymentPayload.productGroupCode,
        'ORDER_AB_PAYMENT_CONFIG',
        selectedConfigPaymentPayload.isPageable,
        selectedConfigPaymentPayload.sort
      ).path;
      orderPaymentConfigService.getSelectedConfigPaymentDetails(selectedConfigPaymentPayload).subscribe(
        data => {
          expect(data).toEqual(response);
        }
      );
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    })
  })

  describe('removeConfig', () => {
    it('should call PATCH api method with correct url and params', () => {
      spyOn(OrderPaymentConfigAdaptor, 'getOrderPaymentDetails').and.returnValue({});
      const url = getProductGroupMappingRulesUrl('configId', 'ORDER_AB_PAYMENT_CONFIG');
      orderPaymentConfigService.removeConfig('configId', '').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should return data mapped by adaptors', () => {
      spyOn(OrderPaymentConfigAdaptor, 'getOrderPaymentDetails').and.returnValue({});
      const url = getProductGroupMappingRulesUrl('configId', 'ORDER_AB_PAYMENT_CONFIG');
      orderPaymentConfigService.removeConfig('configId', '').subscribe(
        data => {
          expect(data).toEqual(data);
        }
      );
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    })
  })

  describe('updateConfig', () => {
    it('should call PATCH api method with correct url and params', () => {
      spyOn(OrderPaymentConfigAdaptor, 'getOrderPaymentDetails').and.returnValue({});
      const url = getProductGroupMappingRulesUrl('configId', 'ORDER_AB_PAYMENT_CONFIG');
      orderPaymentConfigService.updateConfig('configId', '').subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should return data mapped by adaptors', () => {
      spyOn(OrderPaymentConfigAdaptor, 'getOrderPaymentDetails').and.returnValue({});
      const url = getProductGroupMappingRulesUrl('configId', 'ORDER_AB_PAYMENT_CONFIG');
      orderPaymentConfigService.updateConfig('configId', '').subscribe(
        data => {
          expect(data).toEqual(data);
        }
      );
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    })
  })
});


