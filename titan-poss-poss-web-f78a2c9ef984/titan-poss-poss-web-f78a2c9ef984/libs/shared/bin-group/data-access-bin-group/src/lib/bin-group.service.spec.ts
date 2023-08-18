import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { BinGroupService } from './bin-group.service';
import { BinGroupAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getBinGroupDetailsListingUrl,
  getBinGroupByBinGroupCode,
  getSaveRegionFormDetailsUrl,
  getRegionEditedFormDetailsUrl,
  getBinGroupEditedFormDetailsUrl,
  getBinGroupSaveFormDetailsUrl
} from '@poss-web/shared/util-api-service';
import {
  BinGroup,
  LoadBinGroupDetailsListingPayload,
  SaveBinGroupFormDetailsPayload
} from '@poss-web/shared/models';
describe('BinGroupService ', () => {
  let httpTestingController: HttpTestingController;
  let regionService: BinGroupService;
  const apiUrl = 'http://localhost:3000';

  const dummyList: BinGroup[] = [
    {
      binGroupCode: 'AAA',
      description: 'AAA',
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
        BinGroupService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    regionService = TestBed.inject(BinGroupService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  it('should be created', () => {
    expect(regionService).toBeTruthy();
  });

  describe('getbinGroupDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(BinGroupAdaptor, 'getBinGroupDetailsListing').and.returnValue({});
      const payload: LoadBinGroupDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getBinGroupDetailsListingUrl(
        payload.pageIndex,
        payload.pageSize
      );
      regionService.getbinGroupDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    it('should call BinGroupAdaptor getBinGroupDetailsListing method with correct  parameters', () => {
      spyOn(BinGroupAdaptor, 'getBinGroupDetailsListing').and.returnValue({});
      const payload: LoadBinGroupDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getBinGroupDetailsListingUrl(
        payload.pageIndex,
        payload.pageSize
      );

      regionService.getbinGroupDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResponse);
      expect(BinGroupAdaptor.getBinGroupDetailsListing).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(BinGroupAdaptor, 'getBinGroupDetailsListing').and.returnValue({
        binGroupDetailsListing: dummyList,
        totalElements: 10
      });
      const payload: LoadBinGroupDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getBinGroupDetailsListingUrl(
        payload.pageIndex,
        payload.pageSize
      );
      regionService.getbinGroupDetails(payload).subscribe(data => {
        expect(data).toEqual({
          binGroupDetailsListing: dummyList,
          totalElements: 10
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
  describe('getBinGroupByBinGroupCode', () => {
    it('should call GET api method with correct url and params', () => {
      const payload = 'EAST';
      const url = getBinGroupByBinGroupCode(payload);
      regionService.getBinGroupByBinGroupCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush(dummyResponse);
    });
  });

  describe('saveBinGroupFormDetails', () => {
    it('should call PATCH api method with correct url and params', () => {
      const saveForm: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };
      const url = getBinGroupSaveFormDetailsUrl();
      regionService.saveBinGroupFormDetails(saveForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('editBinGroupFormDetails', () => {
    it('should call PATCH api method with correct url and params', () => {
      const editForm: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };
      const url = getBinGroupEditedFormDetailsUrl(editForm.binGroupCode);
      regionService.editBinGroupFormDetails(editForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('searchBinGroupByBinGroupCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(BinGroupAdaptor, 'getSearchDetailsListing').and.returnValue({});
      const payload = 'EAST';
      const url = getBinGroupByBinGroupCode(payload);
      regionService.searchBinGroupByBinGroupCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url);
      request.flush({});
    });
    it('should call BinGroupAdaptor getSearchDetailsListing method with correct  parameters', () => {
      spyOn(BinGroupAdaptor, 'getSearchDetailsListing').and.returnValue({});
      const payload = 'EAST';
      const url = getBinGroupByBinGroupCode(payload);

      regionService.searchBinGroupByBinGroupCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(dummyResponse);
      expect(BinGroupAdaptor.getSearchDetailsListing).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(BinGroupAdaptor, 'getSearchDetailsListing').and.returnValue({
        binGroupDetailsListing: dummyList,
        totalElements: 10
      });
      const payload = 'EAST';
      const url = getBinGroupByBinGroupCode(payload);
      regionService.searchBinGroupByBinGroupCode(payload).subscribe(data => {
        expect(data).toEqual({
          binGroupDetailsListing: dummyList,
          totalElements: 10
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });
});
