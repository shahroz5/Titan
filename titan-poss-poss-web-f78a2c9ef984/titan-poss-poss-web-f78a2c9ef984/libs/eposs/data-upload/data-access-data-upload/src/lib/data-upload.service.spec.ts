import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataUploadService } from './data-upload.service';
import {
  getFIRFileUploadUrl,
  getMERFileUploadUrl,
  getInvoiceJobTriggerUrl,
  getSTNJobTriggerUrl
} from '@poss-web/shared/util-api-service';
import { NewFileUploadResponse } from '@poss-web/shared/models';
import { FileUploadAdaptor } from '@poss-web/shared/util-adaptors';

describe('dataUploadService ', () => {
  let httpTestingController: HttpTestingController;
  let dataUploadService: DataUploadService;
  const APIUrl = 'http://localhost:3000';

  const fileUploadResponse: NewFileUploadResponse = {
    fileId: '37ac5682-87ae-4766-a72d-172c59e3eaf7',
    message: 'SUCCESS',
    uploadType: 'async',
    hasError: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DataUploadService,
        {
          provide: POSS_WEB_API_URL,
          useValue: APIUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    dataUploadService = TestBed.inject(DataUploadService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(DataUploadService).toBeTruthy();
  });

  describe('FIRFileUpload', () => {
    it('should call POST API method', () => {
      spyOn(FileUploadAdaptor, 'getFileUploadResponse').and.returnValue({});
      const file = new FormData();

      const path = getFIRFileUploadUrl();

      dataUploadService.FIRFileUpload(file).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call adaptor method', () => {
      spyOn(FileUploadAdaptor, 'getFileUploadResponse').and.returnValue({});
      const file = new FormData();

      const path = getFIRFileUploadUrl();

      dataUploadService.FIRFileUpload(file).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(fileUploadResponse);
      expect(FileUploadAdaptor.getFileUploadResponse).toHaveBeenCalledWith(
        fileUploadResponse
      );
    });

    it('should return mapped data', () => {
      spyOn(FileUploadAdaptor, 'getFileUploadResponse').and.returnValue(
        fileUploadResponse
      );
      const file = new FormData();

      const path = getFIRFileUploadUrl();

      dataUploadService.FIRFileUpload(file).subscribe(data => {
        expect(data).toEqual(fileUploadResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('MERFileUpload', () => {
    it('should call POST API method', () => {
      spyOn(FileUploadAdaptor, 'getFileUploadResponse').and.returnValue({});
      const file = new FormData();

      const path = getMERFileUploadUrl();

      dataUploadService.MERFileUpload(file).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call adaptor method', () => {
      spyOn(FileUploadAdaptor, 'getFileUploadResponse').and.returnValue({});
      const file = new FormData();

      const path = getMERFileUploadUrl();

      dataUploadService.MERFileUpload(file).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(fileUploadResponse);
      expect(FileUploadAdaptor.getFileUploadResponse).toHaveBeenCalledWith(
        fileUploadResponse
      );
    });

    it('should return mapped data', () => {
      spyOn(FileUploadAdaptor, 'getFileUploadResponse').and.returnValue(
        fileUploadResponse
      );
      const file = new FormData();

      const path = getMERFileUploadUrl();

      dataUploadService.MERFileUpload(file).subscribe(data => {
        expect(data).toEqual(fileUploadResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('InvoiceUpload', () => {
    it('should call POST API method', () => {
      const path = getInvoiceJobTriggerUrl();

      dataUploadService.InvoiceUpload().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should return string', () => {
      const fileUploadResponse = {};

      const path = getInvoiceJobTriggerUrl();

      dataUploadService.InvoiceUpload().subscribe(data => {
        expect(data).toEqual(fileUploadResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      request.flush({});
    });
  });

  describe('STNUpload', () => {
    it('should call POST API method', () => {
      const path = getSTNJobTriggerUrl();

      dataUploadService.STNUpload().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should return string', () => {
      const fileUploadResponse = {};
      const path = getSTNJobTriggerUrl();

      dataUploadService.STNUpload().subscribe(data => {
        expect(data).toEqual(fileUploadResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      request.flush({});
    });
  });
});
