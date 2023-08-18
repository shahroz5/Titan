import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AirpayConfigurationService } from './airpay-configuration.service';
import {
  ListingPayload,
  SortItem,
  UploadResponse,
  FileGroupEnum,
  AirpayVendorSuccessList,
  ListPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';

import { AirpayConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getFileUploadCommonUrl,
  getVendorListUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';

describe('AirpayConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  let airpayHostConfigurationService: AirpayConfigurationService;
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

  const listingPayload: ListPayload = {
    pageIndex: 0,
    pageSize: 10
  };
  const sortField: SortItem = {
    colId: '',
    sort: 'Desc'
  };

  const unipayConfigurationList1: AirpayVendorSuccessList = {
    vendorList: [
      {
        newlyAdded: true,
        locationCode: 'test',
        MerchantId: 'test',
        Username: 'test',
        Password: 'test',
        SecretKey: 'test',
        SecretToken: 'test'
      }
    ],
    count: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AirpayConfigurationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    airpayHostConfigurationService = TestBed.inject(AirpayConfigurationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(airpayHostConfigurationService).toBeTruthy();
  });

  // describe('FileUpload', () => {
  //   it('should call GET api method with correct url', () => {
  //     spyOn(
  //       AirpayConfigurationAdaptor,
  //       'getFileUploadResponse'
  //     ).and.returnValue({});
  //     const path = getFileUploadCommonUrl(FileGroupEnum.AIRPAY_CONFIG);

  //     airpayHostConfigurationService.FileUpload(formData).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('POST');
  //     expect(request.request.responseType).toEqual('json');

  //     request.flush({});
  //   });
  //   it('should call  AirpayConfigurationAdaptor method with correct arguments', () => {
  //     spyOn(
  //       AirpayConfigurationAdaptor,
  //       'getFileUploadResponse'
  //     ).and.returnValue({});
  //     const path = getFileUploadCommonUrl(FileGroupEnum.AIRPAY_CONFIG);

  //     airpayHostConfigurationService.FileUpload(formData).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path;
  //     });
  //     request.flush(uploadResponse);
  //     expect(
  //       AirpayConfigurationAdaptor.getFileUploadResponse
  //     ).toHaveBeenCalledWith(uploadResponse);
  //   });

  //   it('should retun data mapped by AirpayConfigurationAdaptor Adaptor', () => {
  //     spyOn(
  //       AirpayConfigurationAdaptor,
  //       'getFileUploadResponse'
  //     ).and.returnValue(uploadResponse);

  //     const path = getFileUploadCommonUrl(FileGroupEnum.AIRPAY_CONFIG);

  //     airpayHostConfigurationService.FileUpload(formData).subscribe(data => {
  //       expect(data).toEqual(uploadResponse);
  //     });

  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + path
  //     );
  //     request.flush({});
  //   });
  // });

  describe('getVendorList', () => {
    it('should call GET api method with correct url', () => {
      spyOn(AirpayConfigurationAdaptor, 'getVendorList').and.returnValue({});
      const url = getVendorListUrl(0, 10, 'PAYMENT_AIRPAY', sortField);
      airpayHostConfigurationService
        .vendorList(listingPayload, sortField)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  AirpayConfigurationAdaptor method with correct arguments', () => {
      spyOn(AirpayConfigurationAdaptor, 'getVendorList').and.returnValue({});
      const url = getVendorListUrl(0, 10, 'PAYMENT_AIRPAY', sortField);

      airpayHostConfigurationService
        .vendorList(listingPayload, sortField)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(unipayConfigurationList1);
      expect(AirpayConfigurationAdaptor.getVendorList).toHaveBeenCalledWith(
        unipayConfigurationList1
      );
    });

    it('should retun data mapped by AirpayConfigurationAdaptor Adaptor', () => {
      spyOn(AirpayConfigurationAdaptor, 'getVendorList').and.returnValue(
        unipayConfigurationList1
      );

      const url = getVendorListUrl(0, 10, 'PAYMENT_AIRPAY', sortField);

      airpayHostConfigurationService
        .vendorList(listingPayload, sortField)
        .subscribe(data => {
          expect(data).toEqual(unipayConfigurationList1);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + url.path
      );
      request.flush({});
    });
  });
});
