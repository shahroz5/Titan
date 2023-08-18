import { TestBed } from '@angular/core/testing';

import {
  PriceGroupMaster,
  PaymentMaster,
  SavePaymentMasterPayload,
  UpdatePaymentMasterPayload
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  PriceGroupAdaptor,
  PaymentMasterAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  getPaymentMasterUrl,
  getLoadPaymentMasterByPaymentCodeUrl,
  getSavePaymentMasterUrl,
  getUpdatePaymentMasterUrl
} from '@poss-web/shared/util-api-service';
import { PaymentMasterService } from './payment-master.service';
describe('PriceGroupService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let paymentMasterService: PaymentMasterService;

  const dummyPaymentMasterListResponse: PaymentMaster[] = [
    {
      paymentCode: 'CASH',
      type: 'REGULAR',
      description: 'BANGALORE',
      isActive: true,
      customerDependent: true,
      isEditable: false
    }
  ];
  const dummyPaymentMasterListRequestResponse = {
    results: dummyPaymentMasterListResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PaymentMasterService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    paymentMasterService = TestBed.inject(PaymentMasterService);
  });

  it('should be created', () => {
    expect(paymentMasterService).toBeTruthy();
  });

  describe('getPaymentMasterList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PaymentMasterAdaptor, 'getPaymentMasterList').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const url = getPaymentMasterUrl(pageIndex, pageSize);

      paymentMasterService
        .getPaymentMasterList(pageIndex, pageSize)
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

    it('should call PaymentMasterAdaptor getPaymentMasterList method with correct  parameters', () => {
      spyOn(PaymentMasterAdaptor, 'getPaymentMasterList').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const url = getPaymentMasterUrl(pageIndex, pageSize);

      paymentMasterService
        .getPaymentMasterList(pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyPaymentMasterListRequestResponse);
      expect(PaymentMasterAdaptor.getPaymentMasterList).toHaveBeenCalledWith(
        dummyPaymentMasterListRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(PaymentMasterAdaptor, 'getPaymentMasterList').and.returnValue({
        results: dummyPaymentMasterListResponse,
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;

      const url = getPaymentMasterUrl(pageIndex, pageSize);
      paymentMasterService
        .getPaymentMasterList(pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual({
            results: dummyPaymentMasterListResponse,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadPaymentMasterByPaymentCode', () => {
    const dummyPaymentMode: PaymentMaster = {
      paymentCode: 'CASH',
      type: 'REGULAR',
      description: 'CASH',
      isActive: true,
      customerDependent: true,
      isEditable: false
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(
        PaymentMasterAdaptor,
        'getPaymentMasterDataByPaymentCode'
      ).and.returnValue({});
      const paymentCode = 'cash';

      const path = getLoadPaymentMasterByPaymentCodeUrl(paymentCode);

      paymentMasterService
        .loadPaymentMasterByPaymentCode(paymentCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call PaymentMasterAdaptor getPaymentMasterDataByPaymentCode method with correct  parameters', () => {
      spyOn(
        PaymentMasterAdaptor,
        'getPaymentMasterDataByPaymentCode'
      ).and.returnValue({});
      const paymentCode = 'cash';

      const path = getLoadPaymentMasterByPaymentCodeUrl(paymentCode);

      paymentMasterService
        .loadPaymentMasterByPaymentCode(paymentCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyPaymentMode);
      expect(
        PaymentMasterAdaptor.getPaymentMasterDataByPaymentCode
      ).toHaveBeenCalledWith(dummyPaymentMode);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        PaymentMasterAdaptor,
        'getPaymentMasterDataByPaymentCode'
      ).and.returnValue(dummyPaymentMode);
      const paymentCode = 'cash';

      const path = getLoadPaymentMasterByPaymentCodeUrl(paymentCode);

      paymentMasterService
        .loadPaymentMasterByPaymentCode(paymentCode)
        .subscribe(data => {
          expect(data).toEqual(dummyPaymentMode);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('savePaymentMaster', () => {
    const dummyPaymentMode: SavePaymentMasterPayload = {
      paymentGroup: 'REGULAR',
      data: {
        customerDependent: true,
        paymentCode: 'CASH',
        description: 'CASH',
        isActive: true,
        fieldDetails: [
          {
            fieldCode: 'remarks',
            fieldName: 'Remarks',
            fieldRegex: '',
            fieldType: ''
          }
        ]
      }
    };
    it('should call POST api method with correct url and params', () => {
      const url = getSavePaymentMasterUrl(dummyPaymentMode.paymentGroup);

      paymentMasterService
        .savePaymentMaster(dummyPaymentMode.paymentGroup, dummyPaymentMode.data)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('updatePaymentMaster', () => {
    it('should call PATCH api method with correct url and params', () => {
      spyOn(PriceGroupAdaptor, 'getPriceGroupByPriceGroupCode').and.returnValue(
        {}
      );
      const dummyPaymentMode: UpdatePaymentMasterPayload = {
        paymentGroup: 'REGULAR',
        paymentCode: 'CASH',
        data: {
          isActive: false,
          description: 'CASH MODE'
        }
      };

      const url = getUpdatePaymentMasterUrl(
        dummyPaymentMode.paymentCode,
        dummyPaymentMode.paymentGroup
      );

      paymentMasterService
        .updatePaymentMaster(
          dummyPaymentMode.paymentCode,
          dummyPaymentMode.paymentGroup,
          dummyPaymentMode.data
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('searchPaymentMaster', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PaymentMasterAdaptor, 'getSearchResult').and.returnValue({});
      const paymentCode = 'CASH';
      const path = getLoadPaymentMasterByPaymentCodeUrl(paymentCode);

      paymentMasterService.searchPaymentMaster(paymentCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call PaymentMasterAdaptor getSearchResult method with correct  parameters', () => {
      spyOn(PaymentMasterAdaptor, 'getSearchResult').and.returnValue({});
      const paymentCode = 'CASH';
      const path = getLoadPaymentMasterByPaymentCodeUrl(paymentCode);

      paymentMasterService.searchPaymentMaster(paymentCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyPaymentMasterListRequestResponse);
      expect(PaymentMasterAdaptor.getSearchResult).toHaveBeenCalledWith(
        dummyPaymentMasterListRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(PaymentMasterAdaptor, 'getSearchResult').and.returnValue({
        results: dummyPaymentMasterListResponse,
        totalElements: 10
      });
      const paymentCode = 'CASH';
      const path = getLoadPaymentMasterByPaymentCodeUrl(paymentCode);

      paymentMasterService.searchPaymentMaster(paymentCode).subscribe(data => {
        expect(data).toEqual({
          results: dummyPaymentMasterListResponse,
          totalElements: 10
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
});
