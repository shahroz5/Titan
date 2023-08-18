import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { GSTMappingService } from './gst-mapping.service';
import {
  GSTMappingAdaptor,
  GSTMappingHelper
} from '@poss-web/shared/util-adaptors';
import {
  LoadGSTMappingListPayload,
  GSTMappingDetails,
  GSTMappingResponse,
  Tax,
  GSTMappingPayload
} from '@poss-web/shared/models';
import {
  getEditGSTMappingUrl,
  getGSTMappingBaseUrl,
  getGSTMappingListUrl,
  getTaxMasterListingUrl
} from '@poss-web/shared/util-api-service';

describe('GST Mapping Service Testing', () => {
  let httpTestingController: HttpTestingController;
  let gstMappingService: GSTMappingService;
  const apiUrl = 'http://localhost:3000';

  const gstMappingDetails: GSTMappingDetails = {
    isActive: true,
    customerTaxType: 'REGISTERED',
    destLocationTaxType: 'L2',
    srcLocationTaxType: 'CFA',
    txnType: 'SERVICE_TAx',
    applicableTax: 'GST',
    destLocationApplicableTax: 'GST',
    isSameState: false,
    srcLocationApplicableTax: 'GST',
    srcTaxApplicable: false,
    id: 'ID'
  };

  const taxData: Tax = {
    taxCode: 'TAX-1',
    description: 'TAX DESC 1'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GSTMappingService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    gstMappingService = TestBed.inject(GSTMappingService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(gstMappingService).toBeTruthy();
  });

  describe('loadGSTMappingList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(GSTMappingHelper, 'getGSTMappingDetails').and.returnValue({});
      const payload: LoadGSTMappingListPayload = {
        pageIndex: 10,
        pageSize: 20,
        filter: {
          isActive: true,
          customerTaxType: 'REGISTERED',
          destLocationTaxType: 'L2',
          srcLocationTaxType: 'CFA',
          txnType: 'SERVICE_TAx'
        }
      };

      const { path, params } = getGSTMappingListUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.filter
      );

      gstMappingService.loadGSTMappingList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('isActive')).toEqual(
        '' + payload.filter.isActive
      );
      expect(request.request.params.get('customerTaxType')).toEqual(
        payload.filter.customerTaxType
      );

      expect(request.request.params.get('destLocationTaxType')).toEqual(
        payload.filter.destLocationTaxType
      );

      expect(request.request.params.get('srcLocationTaxType')).toEqual(
        payload.filter.srcLocationTaxType
      );

      expect(request.request.params.get('txnTypeEnum')).toEqual(
        payload.filter.txnType
      );

      expect(request.request.params.get('txnTypeEnum')).toEqual(
        payload.filter.txnType
      );

      expect(request.request.params.get('page')).toEqual(
        payload.pageIndex.toString()
      );
      expect(request.request.params.get('size')).toEqual(
        payload.pageSize.toString()
      );

      request.flush({});
    });

    it('should call GSTMapping Helper method with correct arguments', () => {
      spyOn(GSTMappingHelper, 'getGSTMappingDetails').and.returnValue({});
      const payload: LoadGSTMappingListPayload = {
        pageIndex: 10,
        pageSize: 20,
        filter: {
          isActive: true,
          customerTaxType: 'REGISTERED',
          destLocationTaxType: 'L2',
          srcLocationTaxType: 'CFA',
          txnType: 'SERVICE_TAx'
        }
      };

      const gstMappingApiResponse: {
        results: GSTMappingDetails[];
        totalElements: number;
      } = {
        results: [gstMappingDetails],
        totalElements: 1
      };

      const { path, params } = getGSTMappingListUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.filter
      );

      gstMappingService.loadGSTMappingList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(gstMappingApiResponse);
      expect(GSTMappingHelper.getGSTMappingDetails).toHaveBeenCalledWith(
        gstMappingApiResponse
      );
    });

    it('should return data mapped by GST Mapping Helper', () => {
      const gstMappingHelperResponse: GSTMappingResponse = {
        gstMappingList: [gstMappingDetails],
        totalElements: 1
      };
      spyOn(GSTMappingHelper, 'getGSTMappingDetails').and.returnValue(
        gstMappingHelperResponse
      );
      const payload: LoadGSTMappingListPayload = {
        pageIndex: 10,
        pageSize: 20,
        filter: {
          isActive: true,
          customerTaxType: 'REGISTERED',
          destLocationTaxType: 'L2',
          srcLocationTaxType: 'CFA',
          txnType: 'SERVICE_TAx'
        }
      };

      const { path, params } = getGSTMappingListUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.filter
      );

      gstMappingService.loadGSTMappingList(payload).subscribe(data => {
        expect(data).toEqual(gstMappingHelperResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('loadTaxDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(GSTMappingHelper, 'getTaxDetails').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 100000;

      const { path, params } = getTaxMasterListingUrl(pageIndex, pageSize);

      gstMappingService.loadTaxDetails().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');

      expect(request.request.params.get('page')).toEqual(pageIndex.toString());
      expect(request.request.params.get('size')).toEqual(pageSize.toString());

      request.flush({});
    });

    it('should call GSTMapping Helper method with correct arguments', () => {
      spyOn(GSTMappingHelper, 'getTaxDetails').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 100000;

      const gstMappingApiResponse: {
        results: Tax[];
        totalElements: number;
      } = {
        results: [taxData],
        totalElements: 1
      };

      const { path, params } = getTaxMasterListingUrl(pageIndex, pageSize);

      gstMappingService.loadTaxDetails().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(gstMappingApiResponse);
      expect(GSTMappingHelper.getTaxDetails).toHaveBeenCalledWith(
        gstMappingApiResponse
      );
    });

    it('should return data mapped by GST Mapping Helper', () => {
      const gstMappingHelperResponse: Tax[] = [taxData];
      spyOn(GSTMappingHelper, 'getTaxDetails').and.returnValue(
        gstMappingHelperResponse
      );
      const pageIndex = 0;
      const pageSize = 100000;

      const { path, params } = getTaxMasterListingUrl(pageIndex, pageSize);

      gstMappingService.loadTaxDetails().subscribe(data => {
        expect(data).toEqual(gstMappingHelperResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('addGSTMapping', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(GSTMappingAdaptor, 'getGSTMappingDetails').and.returnValue({});
      const payload: GSTMappingPayload = {
        isActive: true,
        customerTaxType: 'REGISTERED',
        destLocationTaxType: 'L2',
        srcLocationTaxType: 'CFA',
        txnType: 'SERVICE_TAx',
        applicableTax: 'GST',
        destLocationApplicableTax: 'GST',
        isSameState: false,
        srcLocationApplicableTax: 'GST',
        srcTaxApplicable: false
      };

      const path = getGSTMappingBaseUrl();

      gstMappingService.addGSTMapping(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.body as Object).toEqual(JSON.stringify(payload));
      request.flush({});
    });

    it('should call GSTMapping Adaptor method with correct arguments', () => {
      spyOn(GSTMappingAdaptor, 'getGSTMappingDetails').and.returnValue({});
      const payload: GSTMappingPayload = {
        isActive: true,
        customerTaxType: 'REGISTERED',
        destLocationTaxType: 'L2',
        srcLocationTaxType: 'CFA',
        txnType: 'SERVICE_TAx',
        applicableTax: 'GST',
        destLocationApplicableTax: 'GST',
        isSameState: false,
        srcLocationApplicableTax: 'GST',
        srcTaxApplicable: false
      };

      const gstMappingApiResponse = gstMappingDetails;

      const path = getGSTMappingBaseUrl();

      gstMappingService.addGSTMapping(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(gstMappingApiResponse);
      expect(GSTMappingAdaptor.getGSTMappingDetails).toHaveBeenCalledWith(
        gstMappingApiResponse
      );
    });

    it('should return data mapped by GST Mapping Adaptor', () => {
      const gstMappingAdaptorResponse = gstMappingDetails;
      spyOn(GSTMappingAdaptor, 'getGSTMappingDetails').and.returnValue(
        gstMappingAdaptorResponse
      );
      const payload: GSTMappingPayload = {
        isActive: true,
        customerTaxType: 'REGISTERED',
        destLocationTaxType: 'L2',
        srcLocationTaxType: 'CFA',
        txnType: 'SERVICE_TAx',
        applicableTax: 'GST',
        destLocationApplicableTax: 'GST',
        isSameState: false,
        srcLocationApplicableTax: 'GST',
        srcTaxApplicable: false
      };

      const path = getGSTMappingBaseUrl();

      gstMappingService.addGSTMapping(payload).subscribe(data => {
        expect(data).toEqual(gstMappingAdaptorResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('editGSTMapping', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(GSTMappingAdaptor, 'getGSTMappingDetails').and.returnValue({});
      const payload: GSTMappingPayload = {
        isActive: true,
        customerTaxType: 'REGISTERED',
        destLocationTaxType: 'L2',
        srcLocationTaxType: 'CFA',
        txnType: 'SERVICE_TAx',
        applicableTax: 'GST',
        destLocationApplicableTax: 'GST',
        isSameState: false,
        srcLocationApplicableTax: 'GST',
        srcTaxApplicable: false
      };

      const id = 'ID';

      const path = getEditGSTMappingUrl(id);

      gstMappingService.editGSTMapping(id, payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.body as Object).toEqual(JSON.stringify(payload));
      request.flush({});
    });

    it('should call GSTMapping Adaptor method with correct arguments', () => {
      spyOn(GSTMappingAdaptor, 'getGSTMappingDetails').and.returnValue({});
      const payload: GSTMappingPayload = {
        isActive: true,
        customerTaxType: 'REGISTERED',
        destLocationTaxType: 'L2',
        srcLocationTaxType: 'CFA',
        txnType: 'SERVICE_TAx',
        applicableTax: 'GST',
        destLocationApplicableTax: 'GST',
        isSameState: false,
        srcLocationApplicableTax: 'GST',
        srcTaxApplicable: false
      };

      const gstMappingApiResponse = gstMappingDetails;

      const id = 'ID';

      const path = getEditGSTMappingUrl(id);

      gstMappingService.editGSTMapping(id, payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(gstMappingApiResponse);
      expect(GSTMappingAdaptor.getGSTMappingDetails).toHaveBeenCalledWith(
        gstMappingApiResponse
      );
    });

    it('should return data mapped by GST Mapping Adaptor', () => {
      const gstMappingAdaptorResponse = gstMappingDetails;
      spyOn(GSTMappingAdaptor, 'getGSTMappingDetails').and.returnValue(
        gstMappingAdaptorResponse
      );
      const payload: GSTMappingPayload = {
        isActive: true,
        customerTaxType: 'REGISTERED',
        destLocationTaxType: 'L2',
        srcLocationTaxType: 'CFA',
        txnType: 'SERVICE_TAx',
        applicableTax: 'GST',
        destLocationApplicableTax: 'GST',
        isSameState: false,
        srcLocationApplicableTax: 'GST',
        srcTaxApplicable: false
      };

      const id = 'ID';

      const path = getEditGSTMappingUrl(id);

      gstMappingService.editGSTMapping(id, payload).subscribe(data => {
        expect(data).toEqual(gstMappingAdaptorResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
});
