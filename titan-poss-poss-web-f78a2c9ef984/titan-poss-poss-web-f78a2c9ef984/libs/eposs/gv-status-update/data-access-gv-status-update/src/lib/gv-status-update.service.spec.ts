import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { GvStatusUpdateService } from './gv-status-update.service';
import {
  SortItem,
  UploadResponse,
  FileGroupEnum,
  GVExtendValidity,
  GVStatusChange,
  GVStatusUpdateList,
  GvStatusList,
  GVStatusListingPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';

import { GVStatusUpdateAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getFileUploadCommonUrl,
  getGVExtendValidityUrl,
  getGVStatusChangeUrl,
  getGVStatusUpdateUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';

describe('GvStatusUpdateService', () => {
  let httpTestingController: HttpTestingController;
  let gvStatusUpdateService: GvStatusUpdateService;
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

  const sortField: SortItem = {
    colId: '',
    sort: 'Desc'
  };

  const gvStatusListingPayload: GVStatusListingPayload = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    serialNo: '123',
    status: 'CLOSED'
  };
  const gvStatusList: GvStatusList = {
    activationDate: 12,
    denomination: 1,
    excludes: [],
    extendCount: 1,
    giftCode: '',
    giftDetails: {
      customerName: '',
      customerType: '',
      discount: '',
      discountPercentage: '',
      issuedTo: ''
    },
    indentNo: 1,
    locationCode: 123,
    mfgDate: 1,
    newlyAdded: true,
    quantity: 1,
    regionCode: '',
    remarks: '',
    serialNo: 1,
    status: '',
    totalValue: 12,
    validFrom: moment(),
    validTill: moment(),
    validityDays: 1
  };
  const gvStatusUpdateList: GVStatusUpdateList = {
    count: 1,
    gvStatusList: [gvStatusList]
  };

  const gvExtendValidity: GVExtendValidity = {
    giftValidity: [{ serialNo: 2, validTill: '' }],
    remarks: ''
  };

  const gvStatusChange: GVStatusChange = {
    giftVoucherStatus: [{ serialNo: 2, status: '' }],
    remarks: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GvStatusUpdateService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    gvStatusUpdateService = TestBed.inject(GvStatusUpdateService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('gvStatusUpdateService should be created', () => {
    expect(gvStatusUpdateService).toBeTruthy();
  });

  describe('FileUpload', () => {
    it('should call GET api method with correct url', () => {
      spyOn(
        GVStatusUpdateAdaptor,
        'gvStatusUploadFileResponse'
      ).and.returnValue({});
      const path = getFileUploadCommonUrl(FileGroupEnum.GV_STATUS_UPDATE);

      gvStatusUpdateService
        .FileUpload(formData, FileGroupEnum.GV_STATUS_UPDATE)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  GVStatusUpdateAdaptor method with correct arguments', () => {
      spyOn(
        GVStatusUpdateAdaptor,
        'gvStatusUploadFileResponse'
      ).and.returnValue({});
      const path = getFileUploadCommonUrl(FileGroupEnum.GV_STATUS_UPDATE);

      gvStatusUpdateService
        .FileUpload(formData, FileGroupEnum.GV_STATUS_UPDATE)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(uploadResponse);
      expect(
        GVStatusUpdateAdaptor.gvStatusUploadFileResponse
      ).toHaveBeenCalledWith(uploadResponse);
    });

    it('should retun data mapped by GVStatusUpdateAdaptor Adaptor', () => {
      spyOn(
        GVStatusUpdateAdaptor,
        'gvStatusUploadFileResponse'
      ).and.returnValue(uploadResponse);

      const path = getFileUploadCommonUrl(FileGroupEnum.GV_STATUS_UPDATE);

      gvStatusUpdateService
        .FileUpload(formData, FileGroupEnum.GV_STATUS_UPDATE)
        .subscribe(data => {
          expect(data).toEqual(uploadResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('gvStatusList', () => {
    it('should call GET api method with correct url', () => {
      spyOn(GVStatusUpdateAdaptor, 'gvStatusUpdateList').and.returnValue({});
      const path = getGVStatusUpdateUrl(gvStatusListingPayload, sortField);
      gvStatusUpdateService
        .gvStatusList(gvStatusListingPayload, sortField)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  GVStatusUpdateAdaptor method with correct arguments', () => {
      spyOn(GVStatusUpdateAdaptor, 'gvStatusUpdateList').and.returnValue({});
      const path = getGVStatusUpdateUrl(gvStatusListingPayload, sortField);

      gvStatusUpdateService
        .gvStatusList(gvStatusListingPayload, sortField)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(gvStatusUpdateList);
      expect(GVStatusUpdateAdaptor.gvStatusUpdateList).toHaveBeenCalledWith(
        gvStatusUpdateList
      );
    });

    it('should retun data mapped by GVStatusUpdateAdaptor Adaptor', () => {
      spyOn(GVStatusUpdateAdaptor, 'gvStatusUpdateList').and.returnValue(
        gvStatusUpdateList
      );

      const path = getGVStatusUpdateUrl(gvStatusListingPayload, sortField);

      gvStatusUpdateService
        .gvStatusList(gvStatusListingPayload, sortField)
        .subscribe(data => {
          expect(data).toEqual(gvStatusUpdateList);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('extendValidity', () => {
    it('should call GET api method with correct url', () => {
      spyOn(GVStatusUpdateAdaptor, 'gvStatusUpdateList').and.returnValue({});
      const path = getGVExtendValidityUrl(gvExtendValidity);
      gvStatusUpdateService.extendValidity(gvExtendValidity).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  GVStatusUpdateAdaptor method with correct arguments', () => {
      spyOn(GVStatusUpdateAdaptor, 'gvStatusUpdateList').and.returnValue({});
      const path = getGVExtendValidityUrl(gvExtendValidity);

      gvStatusUpdateService.extendValidity(gvExtendValidity).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(gvStatusUpdateList);
      expect(GVStatusUpdateAdaptor.gvStatusUpdateList).toHaveBeenCalledWith(
        gvStatusUpdateList
      );
    });

    it('should retun data mapped by GVStatusUpdateAdaptor Adaptor', () => {
      spyOn(GVStatusUpdateAdaptor, 'gvStatusUpdateList').and.returnValue(
        gvStatusUpdateList
      );

      const path = getGVExtendValidityUrl(gvExtendValidity);

      gvStatusUpdateService.extendValidity(gvExtendValidity).subscribe(data => {
        expect(data).toEqual(gvStatusUpdateList);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('changeStatus', () => {
    it('should call GET api method with correct url', () => {
      spyOn(GVStatusUpdateAdaptor, 'gvStatusUpdateList').and.returnValue({});
      const path = getGVStatusChangeUrl(gvStatusChange);
      gvStatusUpdateService.changeStatus(gvStatusChange).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  GVStatusUpdateAdaptor method with correct arguments', () => {
      spyOn(GVStatusUpdateAdaptor, 'gvStatusUpdateList').and.returnValue({});
      const path = getGVStatusChangeUrl(gvStatusChange);

      gvStatusUpdateService.changeStatus(gvStatusChange).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(gvStatusUpdateList);
      expect(GVStatusUpdateAdaptor.gvStatusUpdateList).toHaveBeenCalledWith(
        gvStatusUpdateList
      );
    });

    it('should retun data mapped by GVStatusUpdateAdaptor Adaptor', () => {
      spyOn(GVStatusUpdateAdaptor, 'gvStatusUpdateList').and.returnValue(
        gvStatusUpdateList
      );

      const path = getGVStatusChangeUrl(gvStatusChange);

      gvStatusUpdateService.changeStatus(gvStatusChange).subscribe(data => {
        expect(data).toEqual(gvStatusUpdateList);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });
});
