import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import * as moment from 'moment';
import { ToolbarService } from './toolbar.service';
import { ToolbarHelper } from '@poss-web/shared/util-adaptors';
import {
  MetalPrice,
  StatusTypesEnum,
  TransactionCount,
  TransactionDetails,
  TransactionListPayload
} from '@poss-web/shared/models';
import {
  getMetalPriceUrl,
  getTransactionListCountUrl,
  getTransactionListUrl
} from '@poss-web/shared/util-api-service';

describe('ToolbarService ', () => {
  let httpTestingController: HttpTestingController;
  let toolbarService: ToolbarService;
  const apiUrl = 'http://localhost:3000';

  const dummyMetalPriceResponse: MetalPrice[] = [
    {
      applicableDate: new Date('2021-01-06T10:19:19+05:30'),
      // currency: 'INR',
      karatage: 0,
      metalName: 'Platinum',
      metalTypeCode: 'L',
      offset: 1,
      purity: 95,
      ratePerUnit: 3465,
      unit: 'gms'
    }
  ];

  const dummyTransactionListPayload: TransactionListPayload = {
    pageIndex: 0,
    pageSize: 10,
    searchValue: 'Test1',
    status: 'OPEN',
    txnType: 'CM',
    subTxnType: 'NEW_CM'
  };

  const dummyTransactionDetailsResponse: TransactionDetails[] = [
    {
      customerId: 101,
      customerName: 'TESTING',
      docDate: moment(1611513000000),
      docNo: 15,
      firstHoldTime: moment(1611667249687),
      fiscalYear: 2020,
      id: '1681C56A-9080-427A-8B9A-3C6FC9369399',
      lastHoldTime: moment(1611667249687),
      locationCode: 'CPD',
      // mobileNumber: '8645635697',
      status: StatusTypesEnum.HOLD,
      subTxnType: 'NEW_CM',
      txnType: 'CM',
      totalElements: 10
    }
  ];

  const dummyTransactionCountResponse: TransactionCount[] = [
    {
      count: 10,
      txnType: 'CM',
      subTxnType: 'NEW_CM'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ToolbarService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    toolbarService = TestBed.inject(ToolbarService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(toolbarService).toBeTruthy();
  });

  describe('getMaterialPriceDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ToolbarHelper, 'getMetalPriceData').and.returnValue({});

      const path = getMetalPriceUrl();

      toolbarService.getMaterialPriceDetails().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call ToolbarHelper method with correct arguments', () => {
      spyOn(ToolbarHelper, 'getMetalPriceData').and.returnValue([]);

      const path = getMetalPriceUrl();

      toolbarService.getMaterialPriceDetails().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyMetalPriceResponse);
      expect(ToolbarHelper.getMetalPriceData).toHaveBeenCalledWith(
        dummyMetalPriceResponse
      );
    });

    it('should retun data mapped by ToolbarHelper ', () => {
      spyOn(ToolbarHelper, 'getMetalPriceData').and.returnValue(
        dummyMetalPriceResponse
      );

      const path = getMetalPriceUrl();

      toolbarService.getMaterialPriceDetails().subscribe(data => {
        expect(data).toEqual(dummyMetalPriceResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('loadTransactionList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ToolbarHelper, 'getTransactionDetails').and.returnValue({});

      const { path, params } = getTransactionListUrl(
        'Test1',
        'OPEN',
        'CM',
        'NEW_CM',
        0,
        10,
        dummyTransactionListPayload
      );

      toolbarService
        .loadTransactionList(
          'Test1',
          'OPEN',
          'CM',
          'NEW_CM',
          0,
          10,
          dummyTransactionListPayload
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('txnType')).toEqual('CM');

      request.flush({});
    });

    it('should call ToolbarHelper method with correct arguments', () => {
      spyOn(ToolbarHelper, 'getTransactionDetails').and.returnValue({});

      const path = getTransactionListUrl(
        'Test1',
        'OPEN',
        'CM',
        'NEW_CM',
        0,
        10,
        dummyTransactionListPayload
      ).path;

      toolbarService
        .loadTransactionList(
          'Test1',
          'OPEN',
          'CM',
          'NEW_CM',
          0,
          10,
          dummyTransactionListPayload
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyTransactionDetailsResponse);
      expect(ToolbarHelper.getTransactionDetails).toHaveBeenCalledWith(
        dummyTransactionDetailsResponse
      );
    });

    it('should retun data mapped by ToolbarHelper', () => {
      spyOn(ToolbarHelper, 'getTransactionDetails').and.returnValue(
        dummyTransactionDetailsResponse
      );

      const path = getTransactionListUrl(
        'Test1',
        'OPEN',
        'CM',
        'NEW_CM',
        0,
        10,
        dummyTransactionListPayload
      ).path;

      toolbarService
        .loadTransactionList(
          'Test1',
          'OPEN',
          'CM',
          'NEW_CM',
          0,
          10,
          dummyTransactionListPayload
        )
        .subscribe(data => {
          expect(data).toEqual(dummyTransactionDetailsResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('loadTransactionListCount', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ToolbarHelper, 'getTransactionCount').and.returnValue({});

      const { path, params } = getTransactionListCountUrl(
        'OPEN',
        'CM',
        'NEW_CM'
      );

      toolbarService
        .loadTransactionListCount('OPEN', 'CM', 'NEW_CM')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('txnType')).toEqual('CM');

      request.flush({});
    });

    it('should call ToolbarHelper method with correct arguments', () => {
      spyOn(ToolbarHelper, 'getTransactionCount').and.returnValue({});

      const path = getTransactionListCountUrl('OPEN', 'CM', 'NEW_CM').path;

      toolbarService
        .loadTransactionListCount('OPEN', 'CM', 'NEW_CM')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyTransactionCountResponse);
      expect(ToolbarHelper.getTransactionCount).toHaveBeenCalledWith(
        dummyTransactionCountResponse
      );
    });

    it('should retun data mapped by ToolbarHelper', () => {
      spyOn(ToolbarHelper, 'getTransactionCount').and.returnValue(
        dummyTransactionCountResponse
      );

      const path = getTransactionListCountUrl('OPEN', 'CM', 'NEW_CM').path;

      toolbarService
        .loadTransactionListCount('OPEN', 'CM', 'NEW_CM')
        .subscribe(data => {
          expect(data).toEqual(dummyTransactionCountResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
});
