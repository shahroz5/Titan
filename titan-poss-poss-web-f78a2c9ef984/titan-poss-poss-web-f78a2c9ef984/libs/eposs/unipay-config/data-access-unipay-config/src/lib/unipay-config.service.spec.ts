import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { UnipayConfigurationService } from './unipay-config.service';
import {
  UnipayConfigurationList,
  ConfigListingPayload,
  SortItem,
  UploadResponse,
  FileGroupEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';

import { UnipayAccessMappingAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getFileUploadCommonUrl,
  getPaymentHostnameUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';

describe('UnipayConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  let unipayConfigurationService: UnipayConfigurationService;
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

  const configListingPayload: ConfigListingPayload = {
    pageIndex: 0,
    pageSize: 10
  };
  const sortField: SortItem = {
    colId: '',
    sort: 'Desc'
  };

  const unipayConfigurationList1: UnipayConfigurationList = {
    accessList: [
      {
        deviceId: '123',
        hostName: 'unipay',
        id: '123',
        isActive: true,
        locationCode: '123',
        newlyAdded: true,
        paymentCode: 'unipay'
      }
    ],
    count: 1
  };



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UnipayConfigurationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    unipayConfigurationService = TestBed.inject(UnipayConfigurationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(unipayConfigurationService).toBeTruthy();
  });

  describe('FileUpload', () => {
    it('should call GET api method with correct url', () => {
      spyOn(
        UnipayAccessMappingAdaptor,
        'unipayUploadFileResponse'
      ).and.returnValue({});
      const path = getFileUploadCommonUrl(
        FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
      );

      unipayConfigurationService.FileUpload(formData).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  UnipayAccessMappingAdaptor method with correct arguments', () => {
      spyOn(
        UnipayAccessMappingAdaptor,
        'unipayUploadFileResponse'
      ).and.returnValue({});
      const path = getFileUploadCommonUrl(
        FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
      );

      unipayConfigurationService.FileUpload(formData).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(uploadResponse);
      expect(
        UnipayAccessMappingAdaptor.unipayUploadFileResponse
      ).toHaveBeenCalledWith(uploadResponse);
    });

    it('should retun data mapped by UnipayAccessMappingAdaptor Adaptor', () => {
      spyOn(
        UnipayAccessMappingAdaptor,
        'unipayUploadFileResponse'
      ).and.returnValue(uploadResponse);

      const path = getFileUploadCommonUrl(
        FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
      );

      unipayConfigurationService.FileUpload(formData).subscribe(data => {
        expect(data).toEqual(uploadResponse);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('accessList', () => {
    it('should call GET api method with correct url', () => {
      spyOn(UnipayAccessMappingAdaptor, 'unipayAccessList').and.returnValue({});
      const path = getPaymentHostnameUrl(0, 10, 'UNIPAY', sortField);
      unipayConfigurationService
        .accessList(configListingPayload, sortField)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  UnipayAccessMappingAdaptor method with correct arguments', () => {
      spyOn(UnipayAccessMappingAdaptor, 'unipayAccessList').and.returnValue({});
      const path = getPaymentHostnameUrl(0, 10, 'UNIPAY', sortField);

      unipayConfigurationService
        .accessList(configListingPayload, sortField)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(unipayConfigurationList1);
      expect(UnipayAccessMappingAdaptor.unipayAccessList).toHaveBeenCalledWith(
        unipayConfigurationList1
      );
    });

    it('should retun data mapped by UnipayAccessMappingAdaptor Adaptor', () => {
      spyOn(UnipayAccessMappingAdaptor, 'unipayAccessList').and.returnValue(
        unipayConfigurationList1
      );

      const path = getPaymentHostnameUrl(0, 10, 'UNIPAY', sortField);

      unipayConfigurationService
        .accessList(configListingPayload, sortField)
        .subscribe(data => {
          expect(data).toEqual(unipayConfigurationList1);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });
});
