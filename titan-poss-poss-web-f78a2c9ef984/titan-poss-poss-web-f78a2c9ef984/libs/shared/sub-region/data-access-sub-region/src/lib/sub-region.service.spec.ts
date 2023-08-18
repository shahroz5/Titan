import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { SubRegionService } from './sub-region.service';
import { SubRegionAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getRegionByRegionCodeUrl,
  getSaveRegionFormDetailsUrl,
  getSubRegionListingUrl,
  getRegionEditedFormDetailsUrl,
  getRegionLiteDataUrl
} from '@poss-web/shared/util-api-service';
import {
  LoadSubRegionListingSuccessPayload,
  LoadSubRegionDetailsListingPayload,
  RegionsData,
  SaveSubRegionDetailsPayload,
  EditSubRegionDetailsPayload,
  LoadRegionDetailsListingSuccessPayload,
  LoadSubRegionListingPayload,
  SubRegion,
  EditRegionDetailsPayload
} from '@poss-web/shared/models';

describe('SubRegionService ', () => {
  let httpTestingController: HttpTestingController;
  let subRegionService: SubRegionService;
  const apiUrl = 'http://localhost:3000';

  const dummyList: SubRegion[] = [
    {
      regionCode: 'EAST',
      description: 'EAST',
      orgCode: '',
      configDetails: {},
      parentRegionCode: 'EAST',
      isActive: true
    }
  ];
  const dummyResponse = {
    results: dummyList,
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SubRegionService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    subRegionService = TestBed.inject(SubRegionService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  it('should be created', () => {
    expect(subRegionService).toBeTruthy();
  });

  describe('getRegionDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(SubRegionAdaptor, 'getRegionDetailsListing').and.returnValue({});

      const url = getRegionLiteDataUrl();
      subRegionService.getRegionDetails().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    it('should call SubRegionAdaptor getRegionDetailsListing method with correct  parameters', () => {
      spyOn(SubRegionAdaptor, 'getRegionDetailsListing').and.returnValue({});
      // const payload: LoadRegionListingPayload = {
      //   pageIndex: 0,
      //   pageSize: 10
      // };
      const url = getRegionLiteDataUrl();

      subRegionService.getRegionDetails().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResponse);
      expect(SubRegionAdaptor.getRegionDetailsListing).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(SubRegionAdaptor, 'getRegionDetailsListing').and.returnValue({
        regionDetailsListing: dummyList,
        totalElements: 10
      });

      const url = getRegionLiteDataUrl();
      subRegionService.getRegionDetails().subscribe(data => {
        expect(data).toEqual({
          regionDetailsListing: dummyList,
          totalElements: 10
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
  describe('getSubRegionDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(SubRegionAdaptor, 'getSubRegionDetailsListing').and.returnValue({});
      const payload: LoadSubRegionListingPayload = {
        pageIndex: 0,
        pageSize: 10,
        parentRegionCode: 'EAST'
      };
      const url = getSubRegionListingUrl(
        payload.pageIndex,
        payload.pageSize,
        'EAST'
      );
      subRegionService.getSubRegionDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    it('should call SubRegionAdaptor getSubRegionDetailsListing method with correct  parameters', () => {
      spyOn(SubRegionAdaptor, 'getSubRegionDetailsListing').and.returnValue({});
      const payload: LoadSubRegionListingPayload = {
        pageIndex: 0,
        pageSize: 10,
        parentRegionCode: 'EAST'
      };
      const url = getSubRegionListingUrl(
        payload.pageIndex,
        payload.pageSize,
        'EAST'
      );

      subRegionService.getSubRegionDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResponse);
      expect(SubRegionAdaptor.getSubRegionDetailsListing).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(SubRegionAdaptor, 'getSubRegionDetailsListing').and.returnValue({
        subRegionDetailsListing: dummyList,
        totalElements: 10
      });
      const payload: LoadSubRegionListingPayload = {
        pageIndex: 0,
        pageSize: 10,
        parentRegionCode: 'EAST'
      };
      const url = getSubRegionListingUrl(
        payload.pageIndex,
        payload.pageSize,
        'EAST'
      );
      subRegionService.getSubRegionDetails(payload).subscribe(data => {
        expect(data).toEqual({
          subRegionDetailsListing: dummyList,
          totalElements: 10
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
  describe('getSubRegionByCode', () => {
    it('should call GET api method with correct url and params', () => {
      const payload = 'EAST';
      const url = getRegionByRegionCodeUrl(payload);
      subRegionService.getSubRegionByCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush(dummyResponse);
    });
  });

  describe('saveSubRegionFormDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const saveForm: SaveSubRegionDetailsPayload = {
        regionCode: 'EAST',
        description: 'EAST',
        orgCode: '',
        configDetails: {},
        parentRegionCode: 'EAST',
        isActive: true
      };
      const path = getSaveRegionFormDetailsUrl();
      subRegionService.saveSubRegionFormDetails(saveForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('editSubRegionFormDetails', () => {
    it('should call PATCH api method with correct url and params', () => {
      const editForm: EditSubRegionDetailsPayload = {
        regionCode: 'EAST',
        description: 'EAST',
        configDetails: {},
        isActive: true
      };
      const url = getRegionEditedFormDetailsUrl(editForm.regionCode);
      subRegionService.editSubRegionFormDetails(editForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('searchSubRegionByCode', () => {
    const payload1 = 'EAST';
    const regionCode = 'EAST';
    it('should call GET api method with correct url and params', () => {
      spyOn(SubRegionAdaptor, 'getSearchDetailsListing').and.returnValue({});

      const url = getRegionByRegionCodeUrl(payload1, regionCode);
      subRegionService.searchSubRegionByCode(payload1, regionCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    it('should call SubRegionAdaptor getSearchDetailsListing method with correct  parameters', () => {
      spyOn(SubRegionAdaptor, 'getSearchDetailsListing').and.returnValue({});

      const url = getRegionByRegionCodeUrl(payload1, regionCode);

      subRegionService.searchSubRegionByCode(payload1, regionCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResponse);
      expect(SubRegionAdaptor.getSearchDetailsListing).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(SubRegionAdaptor, 'getSearchDetailsListing').and.returnValue({
        subRegionDetailsListing: dummyList,
        totalElements: 10
      });
      const url = getRegionByRegionCodeUrl(payload1, regionCode);
      subRegionService
        .searchSubRegionByCode(payload1, regionCode)
        .subscribe(data => {
          expect(data).toEqual({
            subRegionDetailsListing: dummyList,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
});
