import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  ApiService,
  getFileUploadCommonUrl,
  getVendorListUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { RazorpayAccessMappingAdaptor, RazorpayVendorConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ConfigListingPayload,
  FileGroupEnum,
  RazorpayVendorSuccessList,
  SortItem,
  UploadResponse
} from '@poss-web/shared/models';
import { RazorpayVendorConfigurationService } from './razorpay-vendor-config.service';

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

describe('CashPaymentConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  let service: RazorpayVendorConfigurationService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RazorpayVendorConfigurationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RazorpayVendorConfigurationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new RazorpayVendorConfigurationService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('vendorList', () => {
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
      spyOn(
        RazorpayVendorConfigurationAdaptor,
        'getVendorList'
      ).and.returnValue({});
      const path = getVendorListUrl();
      service.vendorList(payload, sortField, locationCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getLovMasterType LovMasterAdaptor method with correct arguments', () => {
      const payload2: RazorpayVendorSuccessList = {
        count: 0,
        vendorList: [
          {
            accountId: '1',
            locationCode: 'A',
            newlyAdded: true
          }
        ]
      };
      spyOn(
        RazorpayVendorConfigurationAdaptor,
        'getVendorList'
      ).and.returnValue(payload2);

      const path = getVendorListUrl();
      service.vendorList(payload, sortField, locationCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload2);
      expect(
        RazorpayVendorConfigurationAdaptor.getVendorList
      ).toHaveBeenCalledWith(payload2);
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload2: RazorpayVendorSuccessList = {
        count: 0,
        vendorList: [
          {
            accountId: '1',
            locationCode: 'A',
            newlyAdded: true
          }
        ]
      };
      spyOn(
        RazorpayVendorConfigurationAdaptor,
        'getVendorList'
      ).and.returnValue(payload2);

      const path = getVendorListUrl();
      service.vendorList(payload, sortField, locationCode).subscribe(data => {
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
        FileGroupEnum.RAZORPAY_CONFIG
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
        FileGroupEnum.RAZORPAY_CONFIG
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
        FileGroupEnum.RAZORPAY_CONFIG
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
