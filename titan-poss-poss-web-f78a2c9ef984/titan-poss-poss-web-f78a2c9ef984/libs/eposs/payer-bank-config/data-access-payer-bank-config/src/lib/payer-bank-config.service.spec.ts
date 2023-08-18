import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  PayerBankConfiguration,
  PayerBankMaster,
  SavePayerBankConfigDetailsPayload,
  UpdatePayerBankConfigPayload
} from '@poss-web/shared/models';
import { PayerBankConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getLoadPayerBanksUrl,
  getPayerBankListingUrl,
  getPayerBankSearchUrl,
  getSavePayerBanksUrl,
  getSearchPayerBankNameUrl,
  getUpdatePayerBankConfigUrl,
  savePayerBankConfigUrl,
  updatePayerBankConfigs
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { PayerBankConfigService } from './payer-bank-config.service';
describe('PayerBankConfigService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let payerBankConfigService: PayerBankConfigService;
  const savePayload: SavePayerBankConfigDetailsPayload = {
    configPayload: {
      description: 'Configuration',
      paymentCode: 'cc',
      paymentDetails: {},
      isActive: true
    },
    banksPayload: {
      addBankName: ['AXIS'],
      removeBankName: []
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PayerBankConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    payerBankConfigService = TestBed.inject(PayerBankConfigService);
  });
  const updatePayload: UpdatePayerBankConfigPayload = {
    id: 'abc123',
    configPayload: {
      description: 'Configuration',
      paymentCode: 'cc',
      paymentDetails: {},
      isActive: true
    },
    banksPayload: {
      addBankName: ['AXIS'],
      removeBankName: []
    }
  };
  const payerBankConfiguration: PayerBankConfiguration[] = [
    {
      id: 'abc123',
      description: 'Configuration',
      paymentCode: 'cc',
      isActive: true
    }
  ];
  const dummyPayerBankList = {
    results: payerBankConfiguration,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };
  const payerBanks: PayerBankMaster[] = [
    {
      bankName: 'Axis',
      isActive: true
    }
  ];
  const dummyPayerBanks = {
    results: payerBanks,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };
  it('should be created', () => {
    expect(payerBankConfigService).toBeTruthy();
  });
  describe('getPayerBankConfigListing', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        PayerBankConfigurationAdaptor,
        'getPayerBankListing'
      ).and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const { path, params } = getPayerBankListingUrl(pageIndex, pageSize);

      payerBankConfigService
        .getPayerBankConfigListing({ pageIndex: pageIndex, pageSize: pageSize })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
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

    it('should call PayerBankConfigurationAdaptor getPayerBankListing method with correct  parameters', () => {
      spyOn(
        PayerBankConfigurationAdaptor,
        'getPayerBankListing'
      ).and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;

      const path = getPayerBankListingUrl(pageIndex, pageSize).path;

      payerBankConfigService
        .getPayerBankConfigListing({ pageIndex: pageIndex, pageSize: pageSize })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyPayerBankList);
      expect(
        PayerBankConfigurationAdaptor.getPayerBankListing
      ).toHaveBeenCalledWith(dummyPayerBankList);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        PayerBankConfigurationAdaptor,
        'getPayerBankListing'
      ).and.returnValue({
        payerBankListing: payerBankConfiguration,
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;

      const path = getPayerBankListingUrl(pageIndex, pageSize).path;

      payerBankConfigService
        .getPayerBankConfigListing({ pageIndex: pageIndex, pageSize: pageSize })
        .subscribe(data => {
          expect(data).toEqual({
            payerBankListing: payerBankConfiguration,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('searchConfigName', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        PayerBankConfigurationAdaptor,
        'getPayerBankConfigSearch'
      ).and.returnValue({});

      const { path, params } = getPayerBankSearchUrl('Configuration');

      payerBankConfigService.searchConfigName('Configuration').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('description').toString()).toEqual(
        'Configuration'
      );
      request.flush({});
    });

    it('should call PayerBankConfigurationAdaptor getPayerBankConfigSearch method with correct  parameters', () => {
      spyOn(
        PayerBankConfigurationAdaptor,
        'getPayerBankConfigSearch'
      ).and.returnValue({});

      const path = getPayerBankSearchUrl('Configuration').path;

      payerBankConfigService.searchConfigName('Configuration').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyPayerBankList);
      expect(
        PayerBankConfigurationAdaptor.getPayerBankConfigSearch
      ).toHaveBeenCalledWith(dummyPayerBankList);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        PayerBankConfigurationAdaptor,
        'getPayerBankConfigSearch'
      ).and.returnValue(payerBankConfiguration);
      const pageIndex = 0;
      const pageSize = 10;

      const path = getPayerBankSearchUrl('Configuration').path;

      payerBankConfigService
        .searchConfigName('Configuration')
        .subscribe(data => {
          expect(data).toEqual(payerBankConfiguration);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('searchPayerBanks', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PayerBankConfigurationAdaptor, 'getSearchResult').and.returnValue(
        {}
      );

      const { path, params } = getSearchPayerBankNameUrl('Axis');

      payerBankConfigService.searchPayerBanks('Axis').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('bankName').toString()).toEqual('Axis');
      request.flush({});
    });

    it('should call PayerBankConfigurationAdaptor getSearchResult method with correct  parameters', () => {
      spyOn(PayerBankConfigurationAdaptor, 'getSearchResult').and.returnValue(
        {}
      );

      const path = getSearchPayerBankNameUrl('Axis').path;

      payerBankConfigService.searchPayerBanks('Axis').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyPayerBanks);
      expect(
        PayerBankConfigurationAdaptor.getSearchResult
      ).toHaveBeenCalledWith(dummyPayerBanks);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(PayerBankConfigurationAdaptor, 'getSearchResult').and.returnValue(
        payerBanks
      );

      const path = getSearchPayerBankNameUrl('Axis').path;

      payerBankConfigService.searchPayerBanks('Axis').subscribe(data => {
        expect(data).toEqual(payerBanks);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('updateToggleButton', () => {
    it('should call GET api method with correct url and params', () => {
      const path = updatePayerBankConfigs('abc123');

      payerBankConfigService
        .updateToggleButton({ id: 'abc123', isActive: true })
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
  describe('loadPayerBanks', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PayerBankConfigurationAdaptor, 'getPayerBanks').and.returnValue({});

      const { path, params } = getLoadPayerBanksUrl(0, 10);

      payerBankConfigService
        .loadPayerBanks({ pageIndex: 0, pageSize: 10 })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual('0');
      expect(request.request.params.get('size').toString()).toEqual('10');
      expect(request.request.params.get('isActive').toString()).toEqual('true');
      request.flush({});
    });

    it('should call PayerBankConfigurationAdaptor getPayerBanks method with correct  parameters', () => {
      spyOn(PayerBankConfigurationAdaptor, 'getPayerBanks').and.returnValue({});

      const path = getLoadPayerBanksUrl(0, 10).path;

      payerBankConfigService
        .loadPayerBanks({ pageIndex: 0, pageSize: 10 })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyPayerBanks);
      expect(PayerBankConfigurationAdaptor.getPayerBanks).toHaveBeenCalledWith(
        dummyPayerBanks
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(PayerBankConfigurationAdaptor, 'getPayerBanks').and.returnValue({
        payerBanks: payerBanks,
        totalElements: 10
      });

      const path = getLoadPayerBanksUrl(0, 10).path;

      payerBankConfigService
        .loadPayerBanks({ pageIndex: 0, pageSize: 10 })
        .subscribe(data => {
          expect(data).toEqual({
            payerBanks: payerBanks,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('updatePayerBankConfigDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const path = getUpdatePayerBankConfigUrl(updatePayload.id);

      payerBankConfigService
        .updatePayerBankConfigDetails(updatePayload)
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
  describe('savePayerBankDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const path = savePayerBankConfigUrl();

      payerBankConfigService.savePayerBankDetails(savePayload).subscribe();

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
});
