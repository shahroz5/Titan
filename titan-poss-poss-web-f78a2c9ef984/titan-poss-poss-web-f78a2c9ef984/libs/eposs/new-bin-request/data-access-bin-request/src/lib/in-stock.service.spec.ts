import { InStockService } from './in-stock.service';
import { TestBed, getTestBed } from '@angular/core/testing';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  getAllBinCodesUrl,
  requestBinUrl
} from '@poss-web/shared/util-api-service';

import {
  IbtApprovalsItemsHelper,
  InStockAdaptor
} from '@poss-web/shared/util-adaptors';

describe('Testing BinCodes  Service Functionality', () => {
  let inStockService: InStockService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let testBinCodes: any;
  let requestBin: any;

  beforeEach(() => {
    (testBinCodes = [
      {
        binCode: 'ring',
        quantity: 45
      },
      {
        binCode: 'earring',
        quantity: 45
      }
    ]),
      (requestBin = {
        bin: 'studded pendant',
        remarks: 'Want for Commercial use'
      });

    TestBed.configureTestingModule({
      providers: [
        InStockService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ],
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    inStockService = TestBed.inject(InStockService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(inStockService).toBeTruthy();
  });

  it('should make get  request for bincodes', () => {
    spyOn(InStockAdaptor, 'BinCodesJson').and.returnValue({});

    const url = getAllBinCodesUrl();
    inStockService.getBinCodes().subscribe();

    const request = httpTestingController.expectOne(apiUrl + url);

    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');

    expect(request.request.responseType).toEqual('json');

    request.flush({});
  });

  it('should make post call for Bins', () => {
    const url = requestBinUrl();
    inStockService.requestBin(requestBin).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + url;
    });

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(JSON.stringify(requestBin));

    request.flush({});
  });
});
