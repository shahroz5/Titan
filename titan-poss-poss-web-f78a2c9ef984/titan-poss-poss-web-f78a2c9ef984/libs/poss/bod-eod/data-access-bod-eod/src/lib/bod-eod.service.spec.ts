import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  BodEodEnum,
  OfflineGhsEodRevenueCollection
} from '@poss-web/shared/models';
import {
  getActiveUserSessionsEndpointUrl,
  getAvailableMetalRatesEndpointUrl,
  getBodBusinessDayEndpointUrl,
  getEodActivityEndpointUrl,
  getEodBusinessDayEndpointUrl,
  getEodOfflineGhsRevenueCollectionEndpointUrl,
  getgeneratePasswordForEghsBodEndpointUrl,
  getGhsBankDepositUploadEndpointUrl,
  getGhsBodBusinessDayEndpointUrl,
  getGhsEodActivityEndpointUrl,
  getGhsRevenueCollectionEndpointUrl,
  getgOfflineEghsBodListingEndpointUrlWithQueryParams,
  getLatestBodEndpointUrl,
  getPreviousDayBankDepositEndpointUrl,
  getRevenueCollectionEndpointUrl,
  getWalkInDetailsEndpointUrl
} from '@poss-web/shared/util-api-service';
import {
  POSS_WEB_API_URL,
  POSS_WEB_DATE_FORMAT
} from '@poss-web/shared/util-config';
import { BodEodService } from './bod-eod.service';

describe('Poss Bod Eod Data Service Testing Suite', () => {
  let bodEodService: BodEodService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  const dateFormat = 'DD-MMM-YYYY';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BodEodService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        },
        {
          provide: POSS_WEB_DATE_FORMAT,
          useValue: dateFormat
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    bodEodService = TestBed.inject(BodEodService);
  });

  it('should be created', () => {
    expect(bodEodService).toBeTruthy();
  });

  it('getPreviousDayEodStatus - should get Previous day Eod Status', () => {
    const apiPath = getBodBusinessDayEndpointUrl();

    bodEodService.getPreviousDayEodStatus().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('startBodProcess - should start BOD process & update the BOD status', () => {
    const apiPath = getBodBusinessDayEndpointUrl();

    bodEodService.startBodProcess().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PUT');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getMetalRatesAndGoldRateAvailabityForBusinessDay - should get Metal Rates for the business day', () => {
    const businessDay = 123456789;
    const apiPath = getAvailableMetalRatesEndpointUrl();

    bodEodService
      .getMetalRatesAndGoldRateAvailabityForBusinessDay(businessDay)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getMetalRatesAndGoldRateAvailabity - should get Metal Rates for the business day', () => {
    const payload = {
      businessDate: 123456789,
      isRetryAttempted: false
    };
    const apiPath = getAvailableMetalRatesEndpointUrl();

    bodEodService.getMetalRatesAndGoldRateAvailabity(payload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getBoutiquePossBodCompletionStatus - should get Boutique Poss Bod Completion Status', () => {
    const businessDate = 123456789;
    const apiPath = getBodBusinessDayEndpointUrl();

    bodEodService.getBoutiquePossBodCompletionStatus(businessDate).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getGhsBodCompletionStatus - should get GHS Bod Completion Status', () => {
    const businessDate = 123456789;
    const apiPath = getGhsBodBusinessDayEndpointUrl();

    bodEodService.getGhsBodCompletionStatus(businessDate).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('generatePasswordForEghsOffline - should generate Password for Eghs Offline BOD', () => {
    const businessDate = 123456789;
    const apiPath = getgeneratePasswordForEghsBodEndpointUrl();

    bodEodService.generatePasswordForEghsOffline(businessDate).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('loadGhsOfflineBodPasswords - should load Ghs Offline BOD Passwords', () => {
    const params = {
      contextType: BodEodEnum.GHS_OFFLINE_BOD,
      pageIndex: 0,
      pageSize: 10,
      sortBy: 'passwordDate,desc'
    };
    const apiPath = getgOfflineEghsBodListingEndpointUrlWithQueryParams(params);

    bodEodService.loadGhsOfflineBodPasswords().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.toString()).toEqual(
      apiPath.params.toString()
    );
    expect(request.request.params.get('contextType')).toEqual(
      BodEodEnum.GHS_OFFLINE_BOD
    );
    expect(request.request.params.get('page')).toEqual(
      params.pageIndex.toString()
    );
    expect(request.request.params.get('size')).toEqual(
      params.pageSize.toString()
    );
    expect(request.request.params.get('sort')).toEqual(params.sortBy);
    request.flush({});
  });

  /*Eod Related*/

  it('getCurrentDayBodStatus - should get Current Day Bod Status', () => {
    const apiPath = getEodBusinessDayEndpointUrl();

    bodEodService.getCurrentDayBodStatus().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getClosedBod - should get Latest Bod Business date', () => {
    const apiPath = getLatestBodEndpointUrl();

    bodEodService.getClosedBod().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('startEodProcess - should start EOD process & update the EOD process status', () => {
    const apiPath = getEodBusinessDayEndpointUrl();

    bodEodService.startEodProcess().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PUT');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getWalkinDetailsStatus - should get Walkin details for the business date', () => {
    const businessDay = 123456789;
    const apiPath = getWalkInDetailsEndpointUrl();

    bodEodService.getWalkinDetailsStatus(businessDay).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getGhsBankDepositUploadStatus - should get GHS Bank Deposit upload status', () => {
    const businessDay = 123456789;
    const apiPath = getGhsBankDepositUploadEndpointUrl();

    bodEodService.getGhsBankDepositUploadStatus(businessDay).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('getPreviousDayBankDepositStatus - should get Previous day bank deposit status', () => {
    const inputData = {
      businessDate: 123456789,
      remarks: '',
      skipBanking: false
    };
    const apiPath = getPreviousDayBankDepositEndpointUrl();

    bodEodService.getPreviousDayBankDepositStatus(inputData).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('performRevenueCollection - should perform Revenue collection', () => {
    const businessDate = 123456789;
    const apiPath = getRevenueCollectionEndpointUrl();

    bodEodService.performRevenueCollection(businessDate).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('performGhsRevenueCollection - should perform GHS Revenue collection', () => {
    const businessDate = 123456789;
    const apiPath = getGhsRevenueCollectionEndpointUrl();

    bodEodService.performGhsRevenueCollection(businessDate).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('performEodOfflineGhsRevenueCollection - should perform EOD Offline GHS Revenue collection', () => {
    const eghsOfflineEodData: OfflineGhsEodRevenueCollection = {
      achAmount: '123',
      achReversal: '123',
      airPayAmount: '123',
      airPayReversal: '123',
      businessDate: 123456789,
      cashAmount: '123',
      cashRefund: '123',
      cashReversal: '123',
      cccommission: '123',
      ccrevenue: '123',
      ccreversal: '123',
      chequeAmount: '123',
      chequeReversal: '123',
      ddamount: '123',
      ddreversal: '123',
      emplSalaryDeductionAmount: '123',
      emplSalaryDeductionAmountReversal: '123',
      locationCode: '123',
      netAmount: '123',
      password: '123',
      paytmAmount: '123',
      paytmReversal: '123',
      roRefund: '123'
    };
    const apiPath = getEodOfflineGhsRevenueCollectionEndpointUrl();

    bodEodService
      .performEodOfflineGhsRevenueCollection(eghsOfflineEodData)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
  it('performGhsEodActivity - should perform GHS EOD Activity', () => {
    const businessDate = 123456789;
    const apiPath = getGhsEodActivityEndpointUrl();

    bodEodService.performGhsEodActivity(businessDate).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('performEodActivity - should perform EOD Activity', () => {
    const businessDate = 123456789;
    const apiPath = getEodActivityEndpointUrl();

    bodEodService.performEodActivity(businessDate).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('loadActiveUserSessions - should load Active Boutique User Sessions', () => {
    const apiPath = getActiveUserSessionsEndpointUrl();

    bodEodService.loadActiveUserSessions().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
});
