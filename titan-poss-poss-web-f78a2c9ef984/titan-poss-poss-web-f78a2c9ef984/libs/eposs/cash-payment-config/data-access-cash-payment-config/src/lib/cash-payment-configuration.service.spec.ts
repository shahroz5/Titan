import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { CashPaymentConfigurationService } from './cash-payment-configuration.service';
import {
  ApiService,
  getAddNewCashPaymentConfigurationUrl,
  getCashPaymentConfigurationUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CashPaymentConfiguration } from '@poss-web/shared/models';
import { CashPaymentConfigurationAdaptor } from '@poss-web/shared/util-adaptors';

describe('CashPaymentConfigurationService', () => {
  const dummyResponse: CashPaymentConfiguration = {
    description: 'Desc',
    isActive: true,
    ruleDetails: {
      data: {
        cashAmountMaxCap: '1',
        validFrom: new Date(),
        applicableDays: {
          isSingleDay: true,
          isVariableDay: true
        },
        applicablePaymentType: {
          advanceCN: true,
          billCancel: true,
          cnIBT: true,
          ghsMaturity: true,
          giftCard: true,
          grn: true
        },
        applicableTransaction: {
          acceptAdvance: true,
          advanceBooking: true,
          cashMemo: true,
          customerOrder: true,
          ghs: true,
          giftCardValue: true,
          grf: true
        },
        l1l2Stores: true,
        applicableL1L2Stores: {
          acrossCountry: true,
          sameState: true,
          sameStore: true
        },
        l3Stores: true,
        applicableL3Stores: {
          acrossCountry: true,
          sameState: true,
          sameStore: true
        },
        cummulativeCashValue: true,
        cashRefundSetting: {
          refundCashLimit: '10000'
        },
        pmlaSettings: {
          cashAmountMaxCap: '10000',
          applicableL1L2Stores: {
            acrossCountry: true,
            sameState: true,
            sameStore: true
          },
          applicableL3Stores: {
            acrossCountry: true,
            sameState: true,
            sameStore: true
          },
          l1l2Stores: true,
          l3Stores: true
        }
      },
      type: 'type'
    },
    ruleId: 1,
    ruleType: 'T'
  };

  let httpTestingController: HttpTestingController;
  let service: CashPaymentConfigurationService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CashPaymentConfigurationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CashPaymentConfigurationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new CashPaymentConfigurationService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('getCashPaymentConfigurationDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CashPaymentConfigurationAdaptor,
        'getCashPaymentConfigurationDetails'
      ).and.returnValue({});
      const path = getCashPaymentConfigurationUrl(3);
      service.getCashPaymentConfigurationDetails(3).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getCashPaymentConfigurationDetails CashPaymentConfigurationAdaptor method with correct arguments', () => {
      spyOn(
        CashPaymentConfigurationAdaptor,
        'getCashPaymentConfigurationDetails'
      ).and.returnValue(dummyResponse);

      const path = getCashPaymentConfigurationUrl(3);
      service.getCashPaymentConfigurationDetails(3).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyResponse);
      expect(
        CashPaymentConfigurationAdaptor.getCashPaymentConfigurationDetails
      ).toHaveBeenCalledWith(dummyResponse);
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(
        CashPaymentConfigurationAdaptor,
        'getCashPaymentConfigurationDetails'
      ).and.returnValue(dummyResponse);

      const path = getCashPaymentConfigurationUrl(3);
      service.getCashPaymentConfigurationDetails(3).subscribe(data => {
        expect(data).toEqual(dummyResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('addNewCashPaymentConfigurationDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CashPaymentConfigurationAdaptor,
        'getCashPaymentConfigurationDetails'
      ).and.returnValue({});
      const path = getAddNewCashPaymentConfigurationUrl();
      service.addNewCashPaymentConfigurationDetails(dummyResponse).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call addNewCashPaymentConfigurationDetails CashPaymentConfigurationAdaptor method with correct arguments', () => {
      spyOn(
        CashPaymentConfigurationAdaptor,
        'getCashPaymentConfigurationDetails'
      ).and.returnValue(dummyResponse);

      const path = getAddNewCashPaymentConfigurationUrl();
      service.addNewCashPaymentConfigurationDetails(dummyResponse).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyResponse);
      expect(
        CashPaymentConfigurationAdaptor.getCashPaymentConfigurationDetails
      ).toHaveBeenCalledWith(dummyResponse);
    });

    it('should retun data mapped by adaptor', () => {
      spyOn(
        CashPaymentConfigurationAdaptor,
        'getCashPaymentConfigurationDetails'
      ).and.returnValue(dummyResponse);

      const path = getAddNewCashPaymentConfigurationUrl();
      service
        .addNewCashPaymentConfigurationDetails(dummyResponse)
        .subscribe(data => {
          expect(data).toEqual(dummyResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('editCashPaymentConfigurationDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CashPaymentConfigurationAdaptor,
        'getCashPaymentConfigurationDetails'
      ).and.returnValue({});
      const path = getCashPaymentConfigurationUrl(1);
      service.editCashPaymentConfigurationDetails(1, dummyResponse).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call editCashPaymentConfigurationDetails CashPaymentConfigurationAdaptor method with correct arguments', () => {
      spyOn(
        CashPaymentConfigurationAdaptor,
        'getCashPaymentConfigurationDetails'
      ).and.returnValue(dummyResponse);

      const path = getCashPaymentConfigurationUrl(1);
      service.editCashPaymentConfigurationDetails(1, dummyResponse).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyResponse);
      expect(
        CashPaymentConfigurationAdaptor.getCashPaymentConfigurationDetails
      ).toHaveBeenCalledWith(dummyResponse);
    });

    it('should retun data mapped by adaptor', () => {
      spyOn(
        CashPaymentConfigurationAdaptor,
        'getCashPaymentConfigurationDetails'
      ).and.returnValue(dummyResponse);

      const path = getCashPaymentConfigurationUrl(1);
      service
        .editCashPaymentConfigurationDetails(1, dummyResponse)
        .subscribe(data => {
          expect(data).toEqual(dummyResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
});
