import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { PrinterConfigService } from './printer-config.service';
import {
  ConfigListingPayload,
  SortItem,
  PrinterConfigDetails,
  PrinterConfigList
} from '@poss-web/shared/models';

import {
  ApiService,
  getPrinterDetailsUrl,
  getAddPrinterDetailsUrl
} from '@poss-web/shared/util-api-service';
import { PrinterConfigAdaptor } from '@poss-web/shared/util-adaptors';

describe('PrinterConfigService', () => {
  let httpTestingController: HttpTestingController;
  let printerConfigService: PrinterConfigService;
  const apiUrl = 'http://localhost:3000';

  const configListingPayload: ConfigListingPayload = {
    pageIndex: 0,
    pageSize: 10
  };
  const sortField: SortItem = {
    colId: 'test',
    sort: 'Desc'
  };
  const printerConfigList: PrinterConfigList = {
    count: 1,
    list: [
      {
        documentType: '',
        hostname: '',
        locationCode: '',
        printerName: '',
        id: '',
        isActive: 'true'
      }
    ]
  };
  const printerConfigDetails: PrinterConfigDetails = {
    documentType: '',
    hostname: '',
    locationCode: '',
    printerName: '',
    id: '',
    isActive: 'true'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PrinterConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    printerConfigService = TestBed.inject(PrinterConfigService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(printerConfigService).toBeTruthy();
  });

  describe('printerList', () => {
    it('should call GET api method with correct url', () => {
      spyOn(PrinterConfigAdaptor, 'PrinterConfigDetails').and.returnValue({});
      const path = getPrinterDetailsUrl(
        configListingPayload.pageIndex,
        configListingPayload.pageSize,
        sortField
      );
      printerConfigService
        .printerList(configListingPayload, sortField)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  PrinterConfigAdapter method with correct arguments', () => {
      spyOn(PrinterConfigAdaptor, 'PrinterConfigDetails').and.returnValue({});
      const path = getPrinterDetailsUrl(
        configListingPayload.pageIndex,
        configListingPayload.pageSize,
        sortField
      );

      printerConfigService
        .printerList(configListingPayload, sortField)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(printerConfigList);
      expect(PrinterConfigAdaptor.PrinterConfigDetails).toHaveBeenCalledWith(
        printerConfigList
      );
    });

    it('should retun data mapped by PrinterConfigAdapter Adaptor', () => {
      spyOn(PrinterConfigAdaptor, 'PrinterConfigDetails').and.returnValue(
        printerConfigList
      );

      const path = getPrinterDetailsUrl(
        configListingPayload.pageIndex,
        configListingPayload.pageSize,
        sortField
      );

      printerConfigService
        .printerList(configListingPayload, sortField)
        .subscribe(data => {
          expect(data).toEqual(printerConfigList, sortField);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });
  describe('addPrinter', () => {
    it('should call POST api method with correct url', () => {
      spyOn(PrinterConfigAdaptor, 'PrinterConfigResponse').and.returnValue(
        printerConfigDetails
      );
      const path = getAddPrinterDetailsUrl();
      printerConfigService.addPrinter(printerConfigDetails).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush(printerConfigDetails);
    });
    it('should call  PrinterConfigAdapter method with correct arguments', () => {
      spyOn(PrinterConfigAdaptor, 'PrinterConfigResponse').and.returnValue(
        printerConfigDetails
      );
      const path = getAddPrinterDetailsUrl();
      printerConfigService.addPrinter(printerConfigDetails).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(printerConfigDetails);
      expect(PrinterConfigAdaptor.PrinterConfigResponse).toHaveBeenCalledWith(
        printerConfigDetails
      );
    });

    it('should retun data mapped by PrinterConfigAdapter Adaptor', () => {
      spyOn(PrinterConfigAdaptor, 'PrinterConfigResponse').and.returnValue(
        printerConfigDetails
      );
      const path = getAddPrinterDetailsUrl();

      printerConfigService.addPrinter(printerConfigDetails).subscribe(data => {
        expect(data).toEqual(printerConfigDetails);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(printerConfigDetails);
    });
  });

  describe('deletePrinter', () => {
    it('should call PATCH api method with correct url', () => {
      spyOn(PrinterConfigAdaptor, 'PrinterConfigResponse').and.returnValue(
        printerConfigDetails
      );
      const path = getAddPrinterDetailsUrl();
      printerConfigService.deletePrinter(printerConfigDetails).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush(printerConfigDetails);
    });
    it('should call  PrinterConfigAdapter method with correct arguments', () => {
      spyOn(PrinterConfigAdaptor, 'PrinterConfigResponse').and.returnValue(
        printerConfigDetails
      );
      const path = getAddPrinterDetailsUrl();
      printerConfigService.deletePrinter(printerConfigDetails).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(printerConfigDetails);
      expect(PrinterConfigAdaptor.PrinterConfigResponse).toHaveBeenCalledWith(
        printerConfigDetails
      );
    });

    it('should retun data mapped by PrinterConfigAdapter Adaptor', () => {
      spyOn(PrinterConfigAdaptor, 'PrinterConfigResponse').and.returnValue(
        printerConfigDetails
      );
      const path = getAddPrinterDetailsUrl();

      printerConfigService
        .deletePrinter(printerConfigDetails)
        .subscribe(data => {
          expect(data).toEqual(printerConfigDetails);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush(printerConfigDetails);
    });
  });
});
