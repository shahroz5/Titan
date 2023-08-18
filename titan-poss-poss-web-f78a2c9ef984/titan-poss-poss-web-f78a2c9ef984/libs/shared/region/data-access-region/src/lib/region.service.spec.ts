import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { RegionService } from './region.service';

import { RegionsAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getRegionAllListingUrl,
  getRegionByRegionCodeUrl,
  getSaveRegionFormDetailsUrl,
  getRegionEditedFormDetailsUrl
} from '@poss-web/shared/util-api-service';
import {
  LoadRegionListingPayload,
  RegionsData,
  SaveRegionDetailsPayload,
  EditRegionDetailsPayload
} from '@poss-web/shared/models';

describe('RegionService ', () => {
  let httpTestingController: HttpTestingController;
  let regionService: RegionService;
  const apiUrl = 'http://localhost:3000';

  const dummyList: RegionsData[] = [
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
        RegionService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    regionService = TestBed.inject(RegionService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  it('should be created', () => {
    expect(regionService).toBeTruthy();
  });

  describe('getRegionDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(RegionsAdaptor, 'getRegionDetailsListing').and.returnValue({});
      const payload: LoadRegionListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getRegionAllListingUrl(
        payload.pageIndex,
        payload.pageSize,
        'REGION'
      );
      regionService.getRegionDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    it('should call RegionsAdaptor getRegionDetailsListing method with correct  parameters', () => {
      spyOn(RegionsAdaptor, 'getRegionDetailsListing').and.returnValue({});
      const payload: LoadRegionListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getRegionAllListingUrl(
        payload.pageIndex,
        payload.pageSize,
        'REGION'
      );

      regionService.getRegionDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResponse);
      expect(RegionsAdaptor.getRegionDetailsListing).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(RegionsAdaptor, 'getRegionDetailsListing').and.returnValue({
        regionDetailsListing: dummyList,
        totalElements: 10
      });
      const payload: LoadRegionListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getRegionAllListingUrl(
        payload.pageIndex,
        payload.pageSize,
        'REGION'
      );
      regionService.getRegionDetails(payload).subscribe(data => {
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
  describe('getRegionByCode', () => {
    it('should call GET api method with correct url and params', () => {
      const payload = 'EAST';
      const url = getRegionByRegionCodeUrl(payload);
      regionService.getRegionByCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush(dummyResponse);
    });
  });

  describe('saveRegionFormDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const saveForm: SaveRegionDetailsPayload = {
        regionCode: 'EAST',
        description: 'EAST',
        orgCode: '',
        configDetails: {},
        parentRegionCode: 'EAST',
        isActive: true
      };
      const path = getSaveRegionFormDetailsUrl();
      regionService.saveRegionFormDetails(saveForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('editRegionFormDetails', () => {
    it('should call PATCH api method with correct url and params', () => {
      const editForm: EditRegionDetailsPayload = {
        regionCode: 'EAST',
        description: 'EAST',
        configDetails: {},
        isActive: true
      };
      const url = getRegionEditedFormDetailsUrl(editForm.regionCode);
      regionService.editRegionFormDetails(editForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('searchRegionByCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(RegionsAdaptor, 'getSearchDetailsListing').and.returnValue({});
      const payload = 'EAST';
      const url = getRegionByRegionCodeUrl(payload);
      regionService.searchRegionByCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    it('should call RegionsAdaptor getSearchDetailsListing method with correct  parameters', () => {
      spyOn(RegionsAdaptor, 'getSearchDetailsListing').and.returnValue({});
      const payload = 'EAST';
      const url = getRegionByRegionCodeUrl(payload);

      regionService.searchRegionByCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResponse);
      expect(RegionsAdaptor.getSearchDetailsListing).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(RegionsAdaptor, 'getSearchDetailsListing').and.returnValue({
        regionDetailsListing: dummyList,
        totalElements: 10
      });
      const payload = 'EAST';
      const url = getRegionByRegionCodeUrl(payload);
      regionService.searchRegionByCode(payload).subscribe(data => {
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
});
