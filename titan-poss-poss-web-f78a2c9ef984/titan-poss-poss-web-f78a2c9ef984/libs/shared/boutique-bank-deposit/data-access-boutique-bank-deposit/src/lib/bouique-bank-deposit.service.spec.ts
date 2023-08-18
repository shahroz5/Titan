import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { BoutiqueBankDepositService } from './boutique-bank-deposit.service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { BoutiqueBankDepositAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getBankDepositDetailsUrl,
  getSaveBoutiqueBankDepositDetails
} from '@poss-web/shared/util-api-service';
import { BankDepositDetails } from '@poss-web/shared/models';
describe('BoutiqueBankDepositService', () => {
  const boutiqueBankDepositDetails: BankDepositDetails[] = [
    {
      collectionDate: '2020-10-09',
      paymentCode: 'CASH',
      locationCode: 'URB',
      payerBankName: 'AXIS',
      payeeBankName: ['AXIS', 'ICICI'],
      instrumentDate: '2020-10-09',
      depositDate: '2020-10-09',
      businessDate: '2020-10-09',
      instrumentNo: 12,
      amount: 12222,
      openingBalance: 12222,
      depositAmount: 12222,
      pifNo: 12222,
      midCode: 1222,
      depositDetails: {},
      isGhsIncluded: true,
      depositSlipNo: 123,
      password: 'Welcome@123',
      approvalDetails: {},
      isBankingCompleted: true,
      id: 'abc',
      depositedSlipDate: '2020-10-19'
    }
  ];
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let boutiqueBankDepositService: BoutiqueBankDepositService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BoutiqueBankDepositService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    boutiqueBankDepositService = TestBed.inject(BoutiqueBankDepositService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  it('should be created', () => {
    expect(boutiqueBankDepositService).toBeTruthy();
  });
  describe('loadBoutiqueBankDeposit', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        BoutiqueBankDepositAdaptor,
        'getBoutiqueBankDepositDetails'
      ).and.returnValue({});
      const payload: string[] = ['CC', 'DD'];
      const { path, params } = getBankDepositDetailsUrl(payload);

      boutiqueBankDepositService.loadBankDepositDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      //expect(request.request.params.get('PaymentMode')).toEqual(payload);
      //expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });
    // it('should call BoutiqueBankDepositAdaptor getBoutiqueBankDepositDetails method with correct  parameters', () => {
    //   spyOn(
    //     BoutiqueBankDepositAdaptor,
    //     'getBoutiqueBankDepositDetails'
    //   ).and.returnValue({});
    //   const payload: string[] = ['CC', 'DD'];

    //   const path = getBankDepositDetailsUrl(payload);

    //   boutiqueBankDepositService.loadBankDepositDetails(payload).subscribe();

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + path;
    //   });

    //   request.flush(boutiqueBankDepositDetails);
    //   expect(
    //     BoutiqueBankDepositAdaptor.getBoutiqueBankDepositDetails
    //   ).toHaveBeenCalledWith(boutiqueBankDepositDetails);
    // });
    // it('should return data mapped by adaptors', () => {
    //   spyOn(
    //     BoutiqueBankDepositAdaptor,
    //     'getBoutiqueBankDepositDetails'
    //   ).and.returnValue(boutiqueBankDepositDetails);
    //   const payload = ['CC', 'DD'];

    //   const path = getBankDepositDetailsUrl(payload);

    //   boutiqueBankDepositService
    //     .loadBankDepositDetails(payload)
    //     .subscribe(data => {
    //       expect(data).toEqual(boutiqueBankDepositDetails);
    //     });

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + path;
    //   });

    //   request.flush({});
    // });
  });
  describe('saveBankDepostDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        BoutiqueBankDepositAdaptor,
        'getSaveDepositDetailsResponse'
      ).and.returnValue({});
      const payload: any = {
        bankDeposit: [
          {
            amount: 0,
            approvalDetails: {
              data: {},
              type: 'Approve'
            },
            bankName: 'Axis',
            businessDate: '2020-10-16T16:28:13.029Z',
            collectionDate: '2020-10-16T16:28:13.029Z',
            depositAmount: 0,
            depositDate: '2020-10-16T16:28:13.029Z',
            depositDetails: {
              data: {},
              type: 'string'
            },
            id: 'ABC'
          }
        ]
      };
      const path = getSaveBoutiqueBankDepositDetails();

      boutiqueBankDepositService.saveBankDepostDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      //expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });
  });
});
