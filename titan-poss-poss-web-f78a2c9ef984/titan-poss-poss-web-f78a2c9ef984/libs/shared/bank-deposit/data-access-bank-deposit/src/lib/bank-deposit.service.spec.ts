import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import * as moment from 'moment';
import { BankDepositService } from './bank-deposit.service';
import { RevenueHelper } from '@poss-web/shared/util-adaptors';
import {
  BankDepositPaymentModeWiseResponse,
  BankDepositResponse,
  PaginatePayload
} from '@poss-web/shared/models';
import { getBankDepositUrl } from '@poss-web/shared/util-api-service';

describe('BankDepositService ', () => {
  let httpTestingController: HttpTestingController;
  let bankDepositService: BankDepositService;
  const apiUrl = 'http://localhost:3000';

  const dummyBankDepositResponse = {
    results: [
      {
        date: 1604860200000,
        deposits: [
          { paymentCode: 'CASH', deposit: 310691.0 },
          { paymentCode: 'CARD', deposit: 1500.0 }
        ]
      },
      {
        date: 1604428200000,
        deposits: [
          { paymentCode: 'CASH', deposit: 310691.0 },
          { paymentCode: 'CARD', deposit: 1500.0 }
        ]
      },
      {
        date: 1604255400000,
        deposits: [
          { paymentCode: 'CASH', deposit: 310691.0 },
          { paymentCode: 'CARD', deposit: 1500.0 }
        ]
      },
      {
        date: 1601749800000,
        deposits: [
          { paymentCode: 'CASH', deposit: 310691.0 },
          { paymentCode: 'CARD', deposit: 1500.0 }
        ]
      },
      {
        date: 1601577000000,
        deposits: [
          { paymentCode: 'CASH', deposit: 310691.0 },
          { paymentCode: 'CARD', deposit: 1500.0 }
        ]
      },
      {
        date: 1601490600000,
        deposits: [
          { paymentCode: 'CASH', deposit: 310691.0 },
          { paymentCode: 'CARD', deposit: 1500.0 }
        ]
      },
      {
        date: 1601490600000,
        deposits: [
          { paymentCode: 'CASH', deposit: 310691.0 },
          { paymentCode: 'CARD', deposit: 1500.0 }
        ]
      },
      {
        date: 1601317800000,
        deposits: [
          { paymentCode: 'CASH', deposit: 310691.0 },
          { paymentCode: 'CARD', deposit: 1500.0 }
        ]
      },
      {
        date: 1601231400000,
        deposits: [
          { paymentCode: 'CASH', deposit: 310691.0 },
          { paymentCode: 'CARD', deposit: 1500.0 }
        ]
      },
      {
        date: 1601145000000,
        deposits: [
          { paymentCode: 'CASH', deposit: 310691.0 },
          { paymentCode: 'CARD', deposit: 1500.0 }
        ]
      }
    ],
    pageNumber: 0,
    pageSize: 10,
    totalPages: 2,
    totalElements: 14
  };

  const depositResult: BankDepositPaymentModeWiseResponse[] = [
    {
      cashPayment: 1000,
      cardPayment: 1000,
      ddPayment: 1000
    }
  ];

  const result: BankDepositResponse = {
    results: [
      {
        date: moment(1604860200000),
        deposits: depositResult
      }
    ],
    totalElements: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BankDepositService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    bankDepositService = TestBed.inject(BankDepositService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(bankDepositService).toBeTruthy();
  });

  describe('loadBankDeposit', () => {
    it('Bank Deposit List - should call GET api method with correct url and params', () => {
      spyOn(RevenueHelper, 'getBankDeposit').and.returnValue({});
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: '2020-08-31T18:30:00.000Z',
        toDate: '2020-11-09T18:30:00.000Z'
      };

      const path = getBankDepositUrl(payload.pageIndex, payload.pageSize);

      bankDepositService.loadBankDeposit(payload, requestBody).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call bankdeposit helper method with correct arguments', () => {
      spyOn(RevenueHelper, 'getBankDeposit').and.returnValue({});
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: '2020-08-31T18:30:00.000Z',
        toDate: '2020-11-09T18:30:00.000Z'
      };

      const path = getBankDepositUrl(payload.pageIndex, payload.pageSize);

      bankDepositService.loadBankDeposit(payload, requestBody).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyBankDepositResponse);
      expect(RevenueHelper.getBankDeposit).toHaveBeenCalledWith(
        dummyBankDepositResponse
      );
    });

    it('should retun data mapped by revnue helper', () => {
      spyOn(RevenueHelper, 'getBankDeposit').and.returnValue(result);
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: '2020-08-31T18:30:00.000Z',
        toDate: '2020-11-09T18:30:00.000Z'
      };

      const path = getBankDepositUrl(payload.pageIndex, payload.pageSize);

      bankDepositService
        .loadBankDeposit(payload, requestBody)
        .subscribe(data => {
          expect(data.results).toEqual(result.results);
          expect(data.totalElements).toEqual(result.totalElements);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });
});
