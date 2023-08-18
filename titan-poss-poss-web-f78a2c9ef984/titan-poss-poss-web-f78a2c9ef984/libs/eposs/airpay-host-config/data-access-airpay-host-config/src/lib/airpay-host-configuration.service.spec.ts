import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AirpayHostConfigurationService } from './airpay-host-configuration.service';
import {
  AirpayHostSuccessList,
  ListingPayload,
  SortItem,
  UploadResponse,
  FileGroupEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';

import { AirpayHostConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getFileUploadCommonUrl,
  getPaymentHostnameUrl
} from '@poss-web/shared/util-api-service';

describe('AirpayHostConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  let airpayHostConfigurationService: AirpayHostConfigurationService;
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

  const listingPayload: ListingPayload = {
    pageIndex: 0,
    pageSize: 10
  };
  const sortField: SortItem = {
    colId: '',
    sort: 'Desc'
  };

  const unipayConfigurationList1: AirpayHostSuccessList = {
    hostList: [
      {
        hostName: 'airpay',
        id: '123',
        isActive: true,
        locationCode: '123',
        newlyAdded: true,
        paymentCode: 'airpay'
      }
    ],
    count: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AirpayHostConfigurationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    airpayHostConfigurationService = TestBed.inject(
      AirpayHostConfigurationService
    );
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
  //       AirpayHostConfigurationAdaptor,
  //       'getFileUploadResponse'
  //     ).and.returnValue({});
  //     const path = getFileUploadCommonUrl(
  //       FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
  //     );

  //     airpayHostConfigurationService.FileUpload(formData).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('POST');
  //     expect(request.request.responseType).toEqual('json');

  //     request.flush({});
  //   });
  //   it('should call  AirpayHostConfigurationAdaptor method with correct arguments', () => {
  //     spyOn(
  //       AirpayHostConfigurationAdaptor,
  //       'getFileUploadResponse'
  //     ).and.returnValue({});
  //     const path = getFileUploadCommonUrl(
  //       FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
  //     );

  //     airpayHostConfigurationService.FileUpload(formData).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path;
  //     });
  //     request.flush(uploadResponse);
  //     expect(
  //       AirpayHostConfigurationAdaptor.getFileUploadResponse
  //     ).toHaveBeenCalledWith(uploadResponse);
  //   });

  //   it('should retun data mapped by AirpayHostConfigurationAdaptor Adaptor', () => {
  //     spyOn(
  //       AirpayHostConfigurationAdaptor,
  //       'getFileUploadResponse'
  //     ).and.returnValue(uploadResponse);

  //     const path = getFileUploadCommonUrl(
  //       FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
  //     );

  //     airpayHostConfigurationService.FileUpload(formData).subscribe(data => {
  //       expect(data).toEqual(uploadResponse);
  //     });

  //     const request = httpTestingController.expectOne(
  //       req => req.url === apiUrl + path
  //     );
  //     request.flush({});
  //   });
  // });

  describe('accessList', () => {
    it('should call GET api method with correct url', () => {
      spyOn(
        AirpayHostConfigurationAdaptor,
        'airpayHostNameList'
      ).and.returnValue({});
      const url = getPaymentHostnameUrl(0, 10, 'AIRPAY', sortField);
      airpayHostConfigurationService
        .hostnameList(listingPayload, sortField)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  AirpayHostConfigurationAdaptor method with correct arguments', () => {
      spyOn(
        AirpayHostConfigurationAdaptor,
        'airpayHostNameList'
      ).and.returnValue({});
      const url = getPaymentHostnameUrl(0, 10, 'AIRPAY', sortField);

      airpayHostConfigurationService
        .hostnameList(listingPayload, sortField)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(unipayConfigurationList1);
      expect(
        AirpayHostConfigurationAdaptor.airpayHostNameList
      ).toHaveBeenCalledWith(unipayConfigurationList1);
    });

    it('should retun data mapped by AirpayHostConfigurationAdaptor Adaptor', () => {
      spyOn(
        AirpayHostConfigurationAdaptor,
        'airpayHostNameList'
      ).and.returnValue(unipayConfigurationList1);

      const url = getPaymentHostnameUrl(0, 10, 'AIRPAY', sortField);

      airpayHostConfigurationService
        .hostnameList(listingPayload, sortField)
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
