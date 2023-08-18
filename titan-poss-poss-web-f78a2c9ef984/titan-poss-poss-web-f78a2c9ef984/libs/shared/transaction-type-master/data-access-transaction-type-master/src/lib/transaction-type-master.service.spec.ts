import { TransactionTypeMasterService } from './transaction-type-master.service';
import {
  ApiService} from '@poss-web/shared/util-api-service';
import {
  PaymentDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { LoadTransactionTypeMasterListingSuccessPayload } from '@poss-web/shared/models';

describe('TransactionTypeMasterService', () => {
  const dummyResponseList: LoadTransactionTypeMasterListingSuccessPayload = {
    transactionTypeMasterListing: [
      {
        code: 'code',
        isActive: true,
        value: 'value'
      }
    ],
    totalElements: 1
  };

  let httpTestingController: HttpTestingController;
  let service: TransactionTypeMasterService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let paymentDataServiceSpy: jasmine.SpyObj<PaymentDataService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TransactionTypeMasterService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TransactionTypeMasterService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);
  paymentDataServiceSpy = jasmine.createSpyObj<PaymentDataService>(
    'PaymentDataService',
    ['getPaymentModes']
  );

  service = new TransactionTypeMasterService(
    apiServiceSpy,
    paymentDataServiceSpy
  );

  // it('should create service', () => {
  //   expect(service).toBeDefined();
  // });

  /*  
  describe('getTransactionTypeMasterListing', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        TransactionTypeMasterAdaptor,
        'getTransactionTypeMasterListing'
      ).and.returnValue({});

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTepValidationConfigList TepValidationConfigAdaptors method with correct arguments', () => {
      const payload: string = 'test';

      spyOn(
        TransactionTypeMasterAdaptor,
        'getTransactionTypeMasterDetails'
      ).and.returnValue(payload);

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl;
      });
      request.flush(payload);
      expect(
        TransactionTypeMasterAdaptor.getTransactionTypeMasterDetails
      ).toHaveBeenCalledWith(payload);
    });
  });

  describe('getTransactionTypeMasterList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(TransactionTypeMasterAdaptor, 'getTransactionTypeMasterListing').and.returnValue({});
      const lovType = 'TRANSACTION_TYPE';
      const path = getMasterPaymentLovsEndpointUrl(lovType);
      service.getTransactionTypeMasterList().subscribe();

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
        TransactionTypeMasterAdaptor,
        'getTransactionTypeMasterListing'
      ).and.returnValue(dummyResponseList);
      const lovType = 'TRANSACTION_TYPE';
      const path = getMasterPaymentLovsEndpointUrl(lovType);
      service.getTransactionTypeMasterList().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyResponseList);
      expect(TransactionTypeMasterAdaptor.getTransactionTypeMasterListing).toHaveBeenCalledWith(
        dummyResponseList
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(TransactionTypeMasterAdaptor, 'getTransactionTypeMasterListing').and.returnValue(dummyResponseList);


      const lovType = 'TRANSACTION_TYPE';
      const path = getMasterPaymentLovsEndpointUrl(lovType);
      service.getTransactionTypeMasterList().subscribe(data => {
        expect(data).toEqual(dummyResponseList);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });

  }); */
});
