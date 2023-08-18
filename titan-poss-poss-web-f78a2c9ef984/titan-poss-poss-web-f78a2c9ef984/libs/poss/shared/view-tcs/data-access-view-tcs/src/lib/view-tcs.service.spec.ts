import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import * as moment from 'moment';
import { ViewTcsDataService } from './view-tcs.service';
import { CashMemoAdaptor, RevenueHelper } from '@poss-web/shared/util-adaptors';
import { TcsList, TcsRequestParam } from '@poss-web/shared/models';
import { getTcsDetailUrl } from '@poss-web/shared/util-api-service';

describe('ViewTcsDataService ', () => {
  let httpTestingController: HttpTestingController;
  let viewTcsDataService: ViewTcsDataService;
  const apiUrl = 'http://localhost:3000';

  const dummyTcsResponse = {
    customerTcsDetailsDtos: [
      {
        brandCode: 'Tanishq',
        ownerType: 'CPD',
        locationCode: 'CPD',
        docNo: 3453,
        transactionDate: 325363754757,
        fiscalYear: '2021',
        netInvoiceAmount: 2345,
        tcsApplicableAmount: 10000,
        tcsPercentage: 0.01,
        tcsAmountPaid: 100
      }
    ]
  };

  const tcsResult: TcsList[] = [
    {
      brandCode: 'Tanishq',
      ownerType: 'CPD',
      locationCode: 'CPD',
      docNo: '3453',
      transactionDate: moment(325363754757),
      fiscalYear: 2021,
      netInvoiceValue: 2345,
      tcsApplicableAmount: 10000,
      tcsPercentage: 0.01,
      tcsAmountPaid: 100,
      currentTransaction: false,
      tcsToBeCollected: 1000,
      tcsCollected: 1000
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ViewTcsDataService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    viewTcsDataService = TestBed.inject(ViewTcsDataService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(viewTcsDataService).toBeTruthy();
  });

  describe('getTcsDetail', () => {
    it('TCS Detail List - should call GET api method with correct url and params', () => {
      spyOn(CashMemoAdaptor, 'getTcsFromJson').and.returnValue({});

      const requestBody: TcsRequestParam = {
        id: '123245',
        txnType: 'CM',
        subTxnType: 'NEW CM'
      };

      const path = getTcsDetailUrl(requestBody);

      viewTcsDataService.getTcsDetail(requestBody).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call getTcsFromJson helper method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'getTcsFromJson').and.returnValue({});
      const requestBody: TcsRequestParam = {
        id: '123245',
        txnType: 'CM',
        subTxnType: 'NEW CM'
      };

      const path = getTcsDetailUrl(requestBody);

      viewTcsDataService.getTcsDetail(requestBody).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyTcsResponse);
      expect(CashMemoAdaptor.getTcsFromJson).toHaveBeenCalledWith(
        dummyTcsResponse
      );
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'getTcsFromJson').and.returnValue(tcsResult);
      const requestBody: TcsRequestParam = {
        id: '123245',
        txnType: 'CM',
        subTxnType: 'NEW CM'
      };

      const path = getTcsDetailUrl(requestBody);

      viewTcsDataService.getTcsDetail(requestBody).subscribe(data => {
        expect(tcsResult).toEqual(tcsResult);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });
});
