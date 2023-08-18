import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import * as moment from 'moment';
import { PasswordConfigService } from './password-config.service';
import { PasswordConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  GenerateBoutiquePasswordForGoldRateRequest,
  GenerateBoutiquePasswordForGoldRateResponse,
  GenerateBoutiquePasswordForManualBillRequest,
  GenerateBoutiquePasswordForManualBillResponse,
  GenerateCashDepositPasswordRequest,
  GenerateCashDepositPasswordResponse
} from '@poss-web/shared/models';
import {
  getGenerateBoutiquePasswordForGoldRateUrl,
  getGenerateBoutiquePasswordForManualBillUrl,
  getGenerateCashDepostPasswordUrl
} from '@poss-web/shared/util-api-service';

describe('PasswordConfigService ', () => {
  let httpTestingController: HttpTestingController;
  let passwordConfigService: PasswordConfigService;
  const apiUrl = 'http://localhost:3000';

  const dummyCashDepositPasswordRequest: GenerateCashDepositPasswordRequest = {
    businessDate: moment('2020-11-17T04:59:43.172Z').valueOf(),
    collectionDate: moment('2020-11-17T04:59:43.172Z').valueOf(),
    depositAmount: 1000,
    locationCode: 'URB',
    remarks: 'Testing Remarks'
  };

  const dummyCashDepositPasswordResponse: GenerateCashDepositPasswordResponse = {
    businessDate: moment(1605589183172),
    collectionDate: moment(1605589183172),
    depositAmount: 1000,
    remarks: 'Testing Remarks',
    locationCode: 'URB',
    id: '6511827d-733c-469c-9e86-7489bcd47f1e',
    password: '5dbh4o3+y74='
  };

  const dummyBoutiquePasswordForManualBillRequest: GenerateBoutiquePasswordForManualBillRequest = {
    locationCode: 'CPD',
    manualBillDate: moment('2021-01-06T10:19:19+05:30').valueOf(),
    manualBillNo: '12',
    manualBillValue: 12000,
    metalRates: {
      J: { metalTypeCode: 'J', totalMetalWeight: 12, ratePerUnit: 4694 }
    },
    remarks: 'test',
    txnType: 'CM'
  };

  const dummyBoutiquePasswordForManualBillResponse: GenerateBoutiquePasswordForManualBillResponse = {
    id: '13eecdf7-d489-42e3-8ed2-0098781c3504',
    locationCode: 'CPD',
    manualBillDate: moment('2021-01-06T10:19:19+05:30'),
    manualBillNo: '12',
    manualBillValue: 12000,
    metalRates: {
      J: { metalTypeCode: 'J', totalMetalWeight: 12, ratePerUnit: 4694 }
    },
    password: 'IA2LFHLDnuo=',
    remarks: 'test',
    txnType: 'CM',
    isOld: false
  };

  const dummyBoutiquePasswordForMetalRateRequest: GenerateBoutiquePasswordForGoldRateRequest = {
    locationCode: 'CPD',
    metalRates: { J: { metalTypeCode: 'J', ratePerUnit: 4694 } },
    applicableDate: moment('2021-01-06T10:54:16+05:30').valueOf(),
    remarks: 'test'
  };

  const dummyBoutiquePasswordForMetalRateResponse: GenerateBoutiquePasswordForGoldRateResponse = {
    metalRates: { J: { metalTypeCode: 'J', ratePerUnit: 4694 } },
    applicableDate: moment('2021-01-06T10:54:16+05:30'),
    id: '16b02e85-2cea-4283-883a-98c96cb02a84',
    password: 'iCdVSr8+lSQ='
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PasswordConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    passwordConfigService = TestBed.inject(PasswordConfigService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(passwordConfigService).toBeTruthy();
  });

  describe('generateCashDepositPassword', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        PasswordConfigAdaptor,
        'generateCashDepositPasswordResponseFromJson'
      ).and.returnValue({});

      const path = getGenerateCashDepostPasswordUrl();

      passwordConfigService
        .generateCashDepositPassword(dummyCashDepositPasswordRequest)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call PasswordConfigAdaptor adaptor method with correct arguments', () => {
      spyOn(
        PasswordConfigAdaptor,
        'generateCashDepositPasswordResponseFromJson'
      ).and.returnValue({});

      const path = getGenerateCashDepostPasswordUrl();

      passwordConfigService
        .generateCashDepositPassword(dummyCashDepositPasswordRequest)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyCashDepositPasswordResponse);
      expect(
        PasswordConfigAdaptor.generateCashDepositPasswordResponseFromJson
      ).toHaveBeenCalledWith(dummyCashDepositPasswordResponse);
    });

    it('should retun data mapped by PasswordConfigAdaptor adaptor', () => {
      spyOn(
        PasswordConfigAdaptor,
        'generateCashDepositPasswordResponseFromJson'
      ).and.returnValue(dummyCashDepositPasswordResponse);

      const path = getGenerateCashDepostPasswordUrl();

      passwordConfigService
        .generateCashDepositPassword(dummyCashDepositPasswordRequest)
        .subscribe(data => {
          expect(data).toEqual(dummyCashDepositPasswordResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('generateBoutiquePasswordForManualBill', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        PasswordConfigAdaptor,
        'generateBoutiquePasswordResponseForManualBillFromJson'
      ).and.returnValue({});

      const path = getGenerateBoutiquePasswordForManualBillUrl();

      passwordConfigService
        .generateBoutiquePasswordForManualBill(
          dummyBoutiquePasswordForManualBillRequest
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call PasswordConfigAdaptor adaptor method with correct arguments', () => {
      spyOn(
        PasswordConfigAdaptor,
        'generateBoutiquePasswordResponseForManualBillFromJson'
      ).and.returnValue({});

      const path = getGenerateBoutiquePasswordForManualBillUrl();

      passwordConfigService
        .generateBoutiquePasswordForManualBill(
          dummyBoutiquePasswordForManualBillRequest
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyBoutiquePasswordForManualBillResponse);
      expect(
        PasswordConfigAdaptor.generateBoutiquePasswordResponseForManualBillFromJson
      ).toHaveBeenCalledWith(dummyBoutiquePasswordForManualBillResponse);
    });

    it('should retun data mapped by PasswordConfigAdaptor adaptor', () => {
      spyOn(
        PasswordConfigAdaptor,
        'generateBoutiquePasswordResponseForManualBillFromJson'
      ).and.returnValue(dummyBoutiquePasswordForManualBillResponse);

      const path = getGenerateBoutiquePasswordForManualBillUrl();

      passwordConfigService
        .generateBoutiquePasswordForManualBill(
          dummyBoutiquePasswordForManualBillRequest
        )
        .subscribe(data => {
          expect(data).toEqual(dummyBoutiquePasswordForManualBillResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('generateBoutiquePasswordForGoldRate', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        PasswordConfigAdaptor,
        'generateBoutiquePasswordResponseForGoldRateFromJson'
      ).and.returnValue({});

      const path = getGenerateBoutiquePasswordForGoldRateUrl();

      passwordConfigService
        .generateBoutiquePasswordForGoldRate(
          dummyBoutiquePasswordForMetalRateRequest
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call PasswordConfigAdaptor adaptor method with correct arguments', () => {
      spyOn(
        PasswordConfigAdaptor,
        'generateBoutiquePasswordResponseForGoldRateFromJson'
      ).and.returnValue({});

      const path = getGenerateBoutiquePasswordForGoldRateUrl();

      passwordConfigService
        .generateBoutiquePasswordForGoldRate(
          dummyBoutiquePasswordForMetalRateRequest
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyBoutiquePasswordForMetalRateResponse);
      expect(
        PasswordConfigAdaptor.generateBoutiquePasswordResponseForGoldRateFromJson
      ).toHaveBeenCalledWith(dummyBoutiquePasswordForMetalRateResponse);
    });

    it('should retun data mapped by PasswordConfigAdaptor adaptor', () => {
      spyOn(
        PasswordConfigAdaptor,
        'generateBoutiquePasswordResponseForGoldRateFromJson'
      ).and.returnValue(dummyBoutiquePasswordForMetalRateResponse);

      const path = getGenerateBoutiquePasswordForGoldRateUrl();

      passwordConfigService
        .generateBoutiquePasswordForGoldRate(
          dummyBoutiquePasswordForMetalRateRequest
        )
        .subscribe(data => {
          expect(data).toEqual(dummyBoutiquePasswordForMetalRateResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
});
