import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import * as moment from 'moment';
import { RevenueService } from './revenue.service';
import { RevenueHelper } from '@poss-web/shared/util-adaptors';
import {
  PaginatePayload,
  RevenuePaymentModeWiseResponse,
  RevenueResponse,
  TodayRevenueResponse,
  TodayRevenueResult
} from '@poss-web/shared/models';
import {
  getDayWiseRevenueUrl,
  getGHSRevenueUrl,
  getTodayRevenueUrl
} from '@poss-web/shared/util-api-service';

describe('RevenueService ', () => {
  let httpTestingController: HttpTestingController;
  let revenueService: RevenueService;
  const apiUrl = 'http://localhost:3000';

  const dummyDaywiseRevenueResponse = {
    results: [
      {
        date: 1604860200000,
        revenues: [
          {
            paymentCode: 'CASH',
            revenues: 2000,
            payments: 3000,
            returns: 1000
          },
          { paymentCode: 'CARD', revenues: 2000, payments: 2500, returns: 500 }
        ]
      },
      {
        date: 1604428200000,
        revenues: [
          {
            paymentCode: 'CASH',
            revenues: 310691.0,
            payments: 311191.0,
            returns: 500.0
          },
          {
            paymentCode: 'CARD',
            revenues: 1500.0,
            payments: 2000.0,
            returns: 500.0
          },
          {
            paymentCode: 'CHEQUE',
            revenues: 124.0,
            payments: 124.0,
            returns: 0
          },
          { paymentCode: 'DD', revenues: 112.0, payments: 112.0, returns: 0 },
          {
            paymentCode: 'AIRPAY',
            revenues: 322.0,
            payments: 322.0,
            returns: 0
          },
          {
            paymentCode: 'RTGS',
            revenues: 1000.0,
            payments: 1000.0,
            returns: 0
          },
          {
            paymentCode: 'WALLET',
            revenues: 1000.0,
            payments: 1000.0,
            returns: 0
          },
          {
            paymentCode: 'EMPLOYEE_LOAN',
            revenues: 0,
            payments: 0,
            returns: 0
          },
          {
            paymentCode: 'SALARY_ADVANCE',
            revenues: 0,
            payments: 0,
            returns: 0
          },
          { paymentCode: 'RO_PAYMENT', revenues: 0, payments: 0, returns: 0 }
        ]
      },
      {
        date: 1604255400000,
        revenues: [
          {
            paymentCode: 'CASH',
            revenues: 310691.0,
            payments: 311191.0,
            returns: 500.0
          },
          {
            paymentCode: 'CARD',
            revenues: 1500.0,
            payments: 2000.0,
            returns: 500.0
          },
          {
            paymentCode: 'CHEQUE',
            revenues: 124.0,
            payments: 124.0,
            returns: 0
          },
          { paymentCode: 'DD', revenues: 112.0, payments: 112.0, returns: 0 },
          {
            paymentCode: 'AIRPAY',
            revenues: 322.0,
            payments: 322.0,
            returns: 0
          },
          {
            paymentCode: 'RTGS',
            revenues: 1000.0,
            payments: 1000.0,
            returns: 0
          },
          {
            paymentCode: 'WALLET',
            revenues: 1000.0,
            payments: 1000.0,
            returns: 0
          },
          {
            paymentCode: 'EMPLOYEE_LOAN',
            revenues: 0,
            payments: 0,
            returns: 0
          },
          {
            paymentCode: 'SALARY_ADVANCE',
            revenues: 0,
            payments: 0,
            returns: 0
          },
          { paymentCode: 'RO_PAYMENT', revenues: 0, payments: 0, returns: 0 }
        ]
      },
      {
        date: 1601749800000,
        revenues: [
          {
            paymentCode: 'CASH',
            revenues: 2000,
            payments: 3000,
            returns: 1000
          },
          { paymentCode: 'CARD', revenues: 2000, payments: 2500, returns: 500 }
        ]
      },
      {
        date: 1601577000000,
        revenues: [
          {
            paymentCode: 'CASH',
            revenues: 2500,
            payments: 3000,
            returns: 1000
          },
          { paymentCode: 'CARD', revenues: 21000, payments: 2500, returns: 500 }
        ]
      },
      {
        date: 1601490600000,
        revenues: [
          {
            paymentCode: 'CASH',
            revenues: 5000,
            payments: 2000,
            returns: 1000
          },
          { paymentCode: 'CARD', revenues: 1000, payments: 4500, returns: 500 }
        ]
      },
      {
        date: 1601490600000,
        revenues: [
          {
            paymentCode: 'CASH',
            revenues: 2000,
            payments: 3000,
            returns: 1000
          },
          { paymentCode: 'CARD', revenues: 2000, payments: 2500, returns: 500 }
        ]
      },
      {
        date: 1601317800000,
        revenues: [
          {
            paymentCode: 'CASH',
            revenues: 2000,
            payments: 3000,
            returns: 1000
          },
          { paymentCode: 'CARD', revenues: 2000, payments: 2500, returns: 1000 }
        ]
      },
      {
        date: 1601231400000,
        revenues: [
          {
            paymentCode: 'CASH',
            revenues: 2000,
            payments: 3000,
            returns: 1000
          },
          { paymentCode: 'CARD', revenues: 2000, payments: 2500, returns: 500 }
        ]
      },
      {
        date: 1601145000000,
        revenues: [
          {
            paymentCode: 'CASH',
            revenues: 2000,
            payments: 3000,
            returns: 1000
          },
          { paymentCode: 'CARD', revenues: 2000, payments: 1500, returns: 500 }
        ]
      }
    ],
    pageNumber: 0,
    pageSize: 10,
    totalPages: 2,
    totalElements: 14
  };

  const dummyTodayRevenueResponse = {
    results: [
      {
        revenueType: 'STORE',
        revenues: [
          {
            paymentCode: 'CASH',
            revenues: 2475265.0,
            payments: 2486265.0,
            returns: 11000.0
          },
          {
            paymentCode: 'CARD',
            revenues: 2075.0,
            payments: 2075.0,
            returns: 0
          },
          {
            paymentCode: 'DD',
            revenues: 605407.0,
            payments: 606113.0,
            returns: 706.0
          }
        ]
      }
    ]
  };

  const revenueResult: RevenuePaymentModeWiseResponse[] = [
    {
      cashPayment: 1000,
      cardPayment: 1000,
      chequePayment: 1000,
      ddPayment: 1000,
      airpayPayment: 1000,
      rtgsPayment: 1000,
      walletPayment: 1000,
      employeeLoanPayment: 1000,
      salaryAdvancePayment: 1000,
      roPayment: 1000
    }
  ];

  const result: RevenueResponse = {
    revenues: [
      {
        date: moment(1604860200000),
        revenues: revenueResult
      }
    ],
    totalRevenues: 10
  };
  const todayRevenueResult: TodayRevenueResult[] = [
    {
      revenueType: 'Store',
      revenues: revenueResult
    }
  ];

  const todayRevenue: TodayRevenueResponse = {
    results: todayRevenueResult
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RevenueService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    revenueService = TestBed.inject(RevenueService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(revenueService).toBeTruthy();
  });

  describe('getDayWiseRevenue', () => {
    it('DayWise Revenue List - should call GET api method with correct url and params', () => {
      spyOn(RevenueHelper, 'getDaywiseRevenue').and.returnValue({});
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: '2020-08-31T18:30:00.000Z',
        toDate: '2020-11-09T18:30:00.000Z'
      };

      const path = getDayWiseRevenueUrl(payload.pageIndex, payload.pageSize);

      revenueService.loadDayWiseRevenue(payload, requestBody).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call daywise revenue helper method with correct arguments', () => {
      spyOn(RevenueHelper, 'getDaywiseRevenue').and.returnValue({});
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: '2020-08-31T18:30:00.000Z',
        toDate: '2020-11-09T18:30:00.000Z'
      };

      const path = getDayWiseRevenueUrl(payload.pageIndex, payload.pageSize);

      revenueService.loadDayWiseRevenue(payload, requestBody).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyDaywiseRevenueResponse);
      expect(RevenueHelper.getDaywiseRevenue).toHaveBeenCalledWith(
        dummyDaywiseRevenueResponse
      );
    });

    it('should retun data mapped by revnue helper', () => {
      spyOn(RevenueHelper, 'getDaywiseRevenue').and.returnValue(result);
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: '2020-08-31T18:30:00.000Z',
        toDate: '2020-11-09T18:30:00.000Z'
      };

      const path = getDayWiseRevenueUrl(payload.pageIndex, payload.pageSize);

      revenueService
        .loadDayWiseRevenue(payload, requestBody)
        .subscribe(data => {
          expect(data.revenues).toEqual(result.revenues);
          expect(data.totalRevenues).toEqual(result.totalRevenues);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getTodaysRevenue', () => {
    it('Today Revenue List - should call GET api method with correct url and params', () => {
      spyOn(RevenueHelper, 'getTodayRevenue').and.returnValue({});
      const locationCode = '';

      const path = getTodayRevenueUrl(locationCode);

      revenueService.getTodayRevenue(locationCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call today revenue helper method with correct arguments', () => {
      spyOn(RevenueHelper, 'getTodayRevenue').and.returnValue({});

      const locationCode = '';

      const path = getTodayRevenueUrl(locationCode);

      revenueService.getTodayRevenue(locationCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyTodayRevenueResponse);
      expect(RevenueHelper.getTodayRevenue).toHaveBeenCalledWith(
        dummyTodayRevenueResponse
      );
    });

    it('should retun data mapped by revnue helper', () => {
      spyOn(RevenueHelper, 'getTodayRevenue').and.returnValue(todayRevenue);

      const locationCode = '';

      const path = getTodayRevenueUrl(locationCode);

      revenueService.getTodayRevenue(locationCode).subscribe(data => {
        expect(data.results).toEqual(todayRevenue.results);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getGhsRevenue', () => {
    it('GHS Revenue List - should call GET api method with correct url and params', () => {
      spyOn(RevenueHelper, 'getTodayRevenue').and.returnValue({});
      const businessDate = '';

      const path = getGHSRevenueUrl('GHS');

      revenueService.getGhsRevenue(businessDate).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call today revenue helper method with correct arguments', () => {
      spyOn(RevenueHelper, 'getTodayRevenue').and.returnValue({});

      const locationCode = '';

      const path = getGHSRevenueUrl('GHS');

      revenueService.getGhsRevenue(locationCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyTodayRevenueResponse);
      expect(RevenueHelper.getTodayRevenue).toHaveBeenCalledWith(
        dummyTodayRevenueResponse
      );
    });

    it('should retun data mapped by revnue helper', () => {
      spyOn(RevenueHelper, 'getTodayRevenue').and.returnValue(todayRevenue);

      const locationCode = '';

      const path = getGHSRevenueUrl('GHS');

      revenueService.getGhsRevenue(locationCode).subscribe(data => {
        expect(data.results).toEqual(todayRevenue.results);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });
});
