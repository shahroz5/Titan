import { TestBed } from '@angular/core/testing';

import {
  paymentConiguration,
  PaymentConfigurationList,
  PaymentConfiguration,
  SelectedOptionsData,
  MappedCount,
  CheckBoxResponse
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { PaymentConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getPaymentModeListUrl,
  getPaymentConfigurationListUrl,
  getSearchPaymenConfigurationListUrl,
  getUpdatePaymentConfigurationUrl,
  getUpdateUrl,
  getSelectedTransactionCodeUrl,
  getMappedCountUrl,
  getLoadPaymentConfigurationUrl
} from '@poss-web/shared/util-api-service';
import { PaymentConfigurationService } from './payment-configuration.service';
describe('PaymentConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let paymentConfigurationService: PaymentConfigurationService;

  const pageIndex = 0;
  const pageSize = 10;

  const dummyPaymentConfigurationResponse: PaymentConfiguration[] = [
    {
      configId: '1',
      paymentName: 'CASH',
      isActive: true
    }
  ];
  const pymentConfiguration: PaymentConfiguration = {
    configId: '1',
    paymentName: 'CASH',
    isActive: true
  };

  const dummyPaymentConfigurationRequestResponse = {
    results: dummyPaymentConfigurationResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PaymentConfigurationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    paymentConfigurationService = TestBed.inject(PaymentConfigurationService);
  });

  it('should be created', () => {
    expect(paymentConfigurationService).toBeTruthy();
  });

  describe('getPaymentModeCount', () => {
    const url = getPaymentModeListUrl(10);
    it('should call GET api method with correct url and params', () => {
      spyOn(
        PaymentConfigurationAdaptor,
        'getPaymentConfigurationListData'
      ).and.returnValue({});

      paymentConfigurationService.getPaymentModeCount().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('getPaymentConfigurationList', () => {
    const url = getPaymentConfigurationListUrl(
      pageIndex,
      pageSize,
      paymentConiguration.paymentConfig
    );

    it('should call GET api method with correct url and params', () => {
      spyOn(
        PaymentConfigurationAdaptor,
        'getPaymentConfigurationListData'
      ).and.returnValue({});

      paymentConfigurationService
        .getPaymentConfigurationList(pageIndex, pageSize)
        .subscribe();

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

    it('should call PaymentConfigurationAdaptor getPaymentConfigurationListData method with correct  parameters', () => {
      spyOn(
        PaymentConfigurationAdaptor,
        'getPaymentConfigurationListData'
      ).and.returnValue({});
      paymentConfigurationService
        .getPaymentConfigurationList(pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyPaymentConfigurationRequestResponse);
      expect(
        PaymentConfigurationAdaptor.getPaymentConfigurationListData
      ).toHaveBeenCalledWith(dummyPaymentConfigurationRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        PaymentConfigurationAdaptor,
        'getPaymentConfigurationListData'
      ).and.returnValue({
        paymentConfigurationList: dummyPaymentConfigurationResponse,
        totalElements: 1
      });

      paymentConfigurationService
        .getPaymentConfigurationList(pageIndex, pageSize)
        .subscribe(data1 => {
          expect(data1).toEqual({
            paymentConfigurationList: dummyPaymentConfigurationResponse,
            totalElements: 1
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('searchPaymentConfigurationList', () => {
    const url = getSearchPaymenConfigurationListUrl(
      'paymentName',
      paymentConiguration.paymentConfig
    );

    it('should call GET api method with correct url and params', () => {
      spyOn(PaymentConfigurationAdaptor, 'getSearchResult').and.returnValue(
        dummyPaymentConfigurationRequestResponse
      );
      paymentConfigurationService
        .searchPaymentConfigurationList('paymentName')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush(dummyPaymentConfigurationRequestResponse);
    });
  });

  describe('updateSelectedPaymentConfigurationDetailsByConfigId', () => {
    const path = getUpdateUrl('1');
    const checkBoxResponse: CheckBoxResponse = {
      added: [
        {
          rowHeaderKey: 'cash',
          columnHeaderKey: 'cash'
        }
      ],
      removed: []
    };
    it('should call PATH api method with correct url and params', () => {
      paymentConfigurationService
        .updateSelectedPaymentConfigurationDetailsByConfigId(
          '1',
          checkBoxResponse
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('getPaymentConfigurationByConfigId', () => {
    const paymentConfiguration: PaymentConfiguration = {
      paymentName: 'CASH',
      isActive: true,
      configId: '1'
    };
    const path = getLoadPaymentConfigurationUrl('1');

    it('should call GET api method with correct url and params', () => {
      paymentConfigurationService
        .getPaymentConfigurationByConfigId('1')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call PaymentConfigurationAdaptor getPaymentConfigurationByConfigIdData method with correct  parameters', () => {
      spyOn(
        PaymentConfigurationAdaptor,
        'getPaymentConfigurationByConfigIdData'
      ).and.returnValue({});

      paymentConfigurationService
        .getPaymentConfigurationByConfigId('1')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(paymentConfiguration);
      expect(
        PaymentConfigurationAdaptor.getPaymentConfigurationByConfigIdData
      ).toHaveBeenCalledWith(paymentConfiguration);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        PaymentConfigurationAdaptor,
        'getPaymentConfigurationByConfigIdData'
      ).and.returnValue(paymentConfiguration);

      paymentConfigurationService
        .getPaymentConfigurationByConfigId('1')
        .subscribe(data1 => {
          expect(data1).toEqual(paymentConfiguration);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getSelectedPaymentConfigurationDetailsByConfigId', () => {
    const url = getSelectedTransactionCodeUrl('1', 'paymentName');
    const selectedOptionsData: SelectedOptionsData = {
      selectedResponse: [
        {
          id: '1',
          rowHeaderKey: 'transactionType',
          columnHeaderKey: 'paymentCode',
          configDetails: 'configDetails'
        }
      ],
      selectedMap: null,
      count: 1,
      id: '1'
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(
        PaymentConfigurationAdaptor,
        'getSelectedPaymentConfigurationDetailsByConfigIdData'
      ).and.returnValue({});

      paymentConfigurationService
        .getSelectedPaymentConfigurationDetailsByConfigId('1', 1, 'paymentName')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call PaymentConfigurationAdaptor getSelectedPaymentConfigurationDetailsByConfigIdData method with correct  parameters', () => {
      spyOn(
        PaymentConfigurationAdaptor,
        'getSelectedPaymentConfigurationDetailsByConfigIdData'
      ).and.returnValue({});

      paymentConfigurationService
        .getSelectedPaymentConfigurationDetailsByConfigId('1', 1, 'paymentName')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(selectedOptionsData);
      expect(
        PaymentConfigurationAdaptor.getSelectedPaymentConfigurationDetailsByConfigIdData
      ).toHaveBeenCalledWith(selectedOptionsData, 1, 'paymentName');
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        PaymentConfigurationAdaptor,
        'getSelectedPaymentConfigurationDetailsByConfigIdData'
      ).and.returnValue(selectedOptionsData);

      paymentConfigurationService
        .getSelectedPaymentConfigurationDetailsByConfigId('1', 1, 'paymentName')
        .subscribe(data1 => {
          expect(data1).toEqual(selectedOptionsData);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getTcsPaymentMode', () => {
    const url = getSelectedTransactionCodeUrl('1', null);
    const tcsPaymentMode = [
      {
        code: 'AIRPAY',
        checked: true,
        id: '1'
      }
    ];
    const tcsPaymentModeRes = {
      configId: '1',
      configs: [
        {
          configDetails: {
            data: {
              isTCSPaymentEnabled: true
            },
            type: 'PAYEMENT_CONFIG_DETAILS'
          },
          id: '1',
          paymentCode: 'AIRPAY',
          transactionType: 'CM'
        }
      ]
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(PaymentConfigurationAdaptor, 'getTcsPaymentMode').and.returnValue(
        {}
      );

      paymentConfigurationService.getTcsPaymentMode('1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call PaymentConfigurationAdaptor getTcsPaymentMode method with correct  parameters', () => {
      spyOn(PaymentConfigurationAdaptor, 'getTcsPaymentMode').and.returnValue(
        {}
      );

      paymentConfigurationService.getTcsPaymentMode('1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(tcsPaymentModeRes);
      expect(
        PaymentConfigurationAdaptor.getTcsPaymentMode
      ).toHaveBeenCalledWith(tcsPaymentModeRes);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(PaymentConfigurationAdaptor, 'getTcsPaymentMode').and.returnValue(
        tcsPaymentMode
      );

      paymentConfigurationService.getTcsPaymentMode('1').subscribe(data1 => {
        expect(data1).toEqual(tcsPaymentMode);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
});
