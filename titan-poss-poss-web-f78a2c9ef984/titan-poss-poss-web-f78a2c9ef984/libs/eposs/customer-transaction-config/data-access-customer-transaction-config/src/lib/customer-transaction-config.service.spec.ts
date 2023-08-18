import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  CheckBoxHeader,
  CustomerConfigDetails,
  CustomerTransactionConfigListPayload,
  CustomerTransactionConfigListResponse,
  SaveCustomerTranConfigDetails,
  UpdateStatus
} from '@poss-web/shared/models';
import { CustomerTransactionConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getCustomersUrl,
  getCustomerTranConfigById,
  getCustomerTransactionConfigListUrl,
  getCustomerTransactionConfigUrl,
  getCustomerTransactionDetailsUrl,
  getSearchConfigNameUrl,
  getUpdateConfigStatus
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomerTransactionConfigService } from './customer-transaction-config.service';
describe('CustomerTransactionConfigService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let customerTransactionConfigService: CustomerTransactionConfigService;
  const customerConfigDetails: CustomerConfigDetails = {
    createConfig: {
      configId: '123',
      description: 'Configuration',
      isActive: true
    },
    configDetails: [
      {
        id: '123',
        rowHeaderKey: 'customer',
        columnHeaderKey: 'transaction'
      }
    ]
  };
  const listPayload: CustomerTransactionConfigListPayload = {
    pageIndex: 0,
    pageSize: 100,
    length: 0
  };
  const configListResponse: CustomerTransactionConfigListResponse = {
    configList: [
      {
        configId: '123',
        description: 'Configuration',
        isActive: true
      }
    ],
    totalElements: 1
  };
  const savePayload: SaveCustomerTranConfigDetails = {
    createConfig: {
      description: 'Configuration',
      isActive: true,
      configType: 'CUSTOMER_CONFIG'
    },
    configDetails: {
      addConfigs: [
        {
          customerType: 'AB',
          transactionType: 'TC'
        }
      ],
      removeConfigs: []
    }
  };
  const updateStatusPayload: UpdateStatus = {
    configId: 'ABC123',
    isActive: true,
    configType: 'CUSTOMER_CONFIG'
  };
  const transactionResponse: CheckBoxHeader[] = [
    {
      title: 'transaction',
      key: 'transaction'
    }
  ];
  const customersResponse: CheckBoxHeader[] = [
    {
      title: 'customer',
      key: 'customer'
    }
  ];
  const dummyCustomerTransactionConfigList = {
    results: configListResponse.configList,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };
  const dummyCustomers = {
    values: [{ value: 'Cusotmer', code: 'Customer' }],
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomerTransactionConfigService,
        LovDataService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    customerTransactionConfigService = TestBed.inject(
      CustomerTransactionConfigService
    );
  });
  describe('loadConfigList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CustomerTransactionConfigAdaptor,
        'customerTransactionConfigList'
      ).and.returnValue({});

      const { path, params } = getCustomerTransactionConfigListUrl(
        listPayload.pageIndex,
        listPayload.pageSize
      );

      customerTransactionConfigService.loadConfigList(listPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        listPayload.pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        listPayload.pageSize.toString()
      );
      request.flush({});
    });
    it('should call CustomerTransactionConfigAdaptor customerTransactionConfigList method with correct  parameters', () => {
      spyOn(
        CustomerTransactionConfigAdaptor,
        'customerTransactionConfigList'
      ).and.returnValue({});

      const path = getCustomerTransactionConfigListUrl(
        listPayload.pageIndex,
        listPayload.pageSize
      ).path;

      customerTransactionConfigService.loadConfigList(listPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyCustomerTransactionConfigList);
      expect(
        CustomerTransactionConfigAdaptor.customerTransactionConfigList
      ).toHaveBeenCalledWith(dummyCustomerTransactionConfigList);
    });
    it('should return data mapped by adaptors', () => {
      spyOn(
        CustomerTransactionConfigAdaptor,
        'customerTransactionConfigList'
      ).and.returnValue(configListResponse);

      const path = getCustomerTransactionConfigListUrl(
        listPayload.pageIndex,
        listPayload.pageSize
      ).path;

      customerTransactionConfigService
        .loadConfigList(listPayload)
        .subscribe(data => {
          expect(data).toEqual(configListResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('searchByConfigName', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CustomerTransactionConfigAdaptor,
        'searchByConfigName'
      ).and.returnValue({});

      const { path, params } = getSearchConfigNameUrl('Configuration');

      customerTransactionConfigService
        .searchConfigName('Configuration')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType').toString()).toEqual(
        'CUSTOMER_CONFIG'
      );
      expect(request.request.params.get('description').toString()).toEqual(
        'Configuration'
      );
      request.flush({});
    });
    it('should call CustomerTransactionConfigAdaptor searchByConfigName method with correct  parameters', () => {
      spyOn(
        CustomerTransactionConfigAdaptor,
        'searchByConfigName'
      ).and.returnValue({});

      const path = getSearchConfigNameUrl('Configuration').path;

      customerTransactionConfigService
        .searchConfigName('Configuration')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyCustomerTransactionConfigList);
      expect(
        CustomerTransactionConfigAdaptor.searchByConfigName
      ).toHaveBeenCalledWith(dummyCustomerTransactionConfigList);
    });
    it('should return data mapped by adaptors', () => {
      spyOn(
        CustomerTransactionConfigAdaptor,
        'searchByConfigName'
      ).and.returnValue(configListResponse.configList);

      const path = getSearchConfigNameUrl('Configuration').path;

      customerTransactionConfigService
        .searchConfigName('Configuration')
        .subscribe(data => {
          expect(data).toEqual(configListResponse.configList);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
  describe('UpdateStatus', () => {
    it('should call GET api method with correct url and params', () => {
      const { path, params } = getUpdateConfigStatus(
        updateStatusPayload.configId,
        updateStatusPayload.isActive
      );

      customerTransactionConfigService
        .updateStatus(updateStatusPayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('isActive').toString()).toEqual(
        updateStatusPayload.isActive.toString()
      );
      request.flush({});
    });
  });
  describe('loadCustomers', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CustomerTransactionConfigAdaptor, 'getCustomers').and.returnValue(
        {}
      );

      const path = getCustomersUrl();

      customerTransactionConfigService.loadCustomers().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call CustomerTransactionConfigAdaptor getCustomers method with correct  parameters', () => {
      spyOn(CustomerTransactionConfigAdaptor, 'getCustomers').and.returnValue(
        {}
      );

      const path = getCustomersUrl();

      customerTransactionConfigService.loadCustomers().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyCustomers);
      expect(
        CustomerTransactionConfigAdaptor.getCustomers
      ).toHaveBeenCalledWith(dummyCustomers);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CustomerTransactionConfigAdaptor, 'getCustomers').and.returnValue(
        customersResponse
      );

      const path = getCustomersUrl();

      customerTransactionConfigService.loadCustomers().subscribe(data => {
        expect(data).toEqual(customersResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
  describe('saveCustomerTranConfigDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const path = getCustomerTransactionConfigUrl();

      customerTransactionConfigService
        .saveCustomerTranConfigDetails(savePayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('updateCustomerTranConfigDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const { path, params } = getUpdateConfigStatus(
        savePayload.configId,
        savePayload.createConfig.isActive
      );

      customerTransactionConfigService
        .updateCustomerTranConfigDetails(savePayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('isActive').toString()).toEqual(
        updateStatusPayload.isActive.toString()
      );
      request.flush({});
    });
    // it('should call GET api method with correct url and params', () => {
    //   const path = getCustomerTransactionDetailsUrl(savePayload.configId);

    //   customerTransactionConfigService
    //     .updateCustomerTranConfigDetails(savePayload)
    //     .subscribe();

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + path;
    //   });
    //   expect(request.cancelled).toBeFalsy();
    //   expect(request.request.method).toEqual('PATCH');
    //   expect(request.request.responseType).toEqual('json');
    //   request.flush({});
    // });
  });
  describe('CustomerTranConfigDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const path = getCustomerTranConfigById('abc123');

      customerTransactionConfigService
        .getCustomerTranConfigDetails('abc123')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
});
