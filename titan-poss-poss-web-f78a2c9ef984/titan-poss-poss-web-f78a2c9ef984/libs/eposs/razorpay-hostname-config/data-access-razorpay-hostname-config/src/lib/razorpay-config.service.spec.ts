import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  ApiService,
  getFileUploadCommonUrl,
  getPaymentHostnameUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { RazorpayAccessMappingAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ConfigListingPayload,
  FileGroupEnum,
  RazorpayConfigurationList,
  SortItem,
  UnipayConfigurationList,
  UploadResponse
} from '@poss-web/shared/models';
import { RazorpayConfigurationService } from './razorpay-config.service';

describe('CashPaymentConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  let service: RazorpayConfigurationService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  const formData: FormData = new FormData();
  const uploadResponse: UploadResponse = {
    fileId: 'test123',
    hasError: false,
    message: 'uploaded',
    records: {
      errorLogId: 'abc123',
      failureCount: 0,
      successCount: 1,
      totalCount: 1
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RazorpayConfigurationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RazorpayConfigurationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new RazorpayConfigurationService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('accessList', () => {
    const payload: ConfigListingPayload = {
      pageIndex: 0,
      pageSize: 1
    };
    const sortField: SortItem = {
      colId: '0',
      sort: '1'
    };
    const locationCode: string = '';

    it('should call GET api method with correct url and params', () => {
      spyOn(RazorpayAccessMappingAdaptor, 'razorpayAccessList').and.returnValue(
        {}
      );
      const path = getPaymentHostnameUrl();
      service.accessList(payload, sortField, locationCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getLovMasterType LovMasterAdaptor method with correct arguments', () => {
      const payload2: RazorpayConfigurationList = {
        count: 0,
        accessList: [
          {
            deviceId: '1',
            hostName: 'Host Name',
            id: '1',
            isActive: true,
            locationCode: 'Code',
            newlyAdded: true,
            paymentCode: 'Code'
          }
        ]
      };
      spyOn(RazorpayAccessMappingAdaptor, 'razorpayAccessList').and.returnValue(
        payload2
      );

      const path = getPaymentHostnameUrl();
      service.accessList(payload, sortField, locationCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload2);
      expect(
        RazorpayAccessMappingAdaptor.razorpayAccessList
      ).toHaveBeenCalledWith(payload2);
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload2: UnipayConfigurationList = {
        count: 0,
        accessList: [
          {
            deviceId: '1',
            hostName: 'Host Name',
            id: '1',
            isActive: true,
            locationCode: 'Code',
            newlyAdded: true,
            paymentCode: 'Code'
          }
        ]
      };
      spyOn(RazorpayAccessMappingAdaptor, 'razorpayAccessList').and.returnValue(
        payload2
      );

      const path = getPaymentHostnameUrl();
      service.accessList(payload, sortField, locationCode).subscribe(data => {
        expect(data).toEqual(payload2);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('FileUpload', () => {
    it('should call GET api method with correct url', () => {
      spyOn(
        RazorpayAccessMappingAdaptor,
        'razorpayUploadFileResponse'
      ).and.returnValue({});
      const path = getFileUploadCommonUrl(
        FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
      );

      service.FileUpload(formData).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call RazorpayAccessMappingAdaptor method with correct arguments', () => {
      spyOn(
        RazorpayAccessMappingAdaptor,
        'razorpayUploadFileResponse'
      ).and.returnValue({});
      const path = getFileUploadCommonUrl(
        FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
      );

      service.FileUpload(formData).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(uploadResponse);
      expect(
        RazorpayAccessMappingAdaptor.razorpayUploadFileResponse
      ).toHaveBeenCalledWith(uploadResponse);
    });

    it('should retun data mapped by RazorpayAccessMappingAdaptor Adaptor', () => {
      spyOn(
        RazorpayAccessMappingAdaptor,
        'razorpayUploadFileResponse'
      ).and.returnValue(uploadResponse);

      const path = getFileUploadCommonUrl(
        FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
      );

      service.FileUpload(formData).subscribe(data => {
        expect(data).toEqual(uploadResponse);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });
});
