import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { StoneTypeService } from './stone-type.service';
import {
  getStoneTypeDetailsListingUrl,
  getStoneTypeDetailsBystoneTypeCodeUrl,
  getStoneTypeSaveFormDetailsUrl
} from '@poss-web/shared/util-api-service';
import {
  StoneTypeDetails,
  LoadStoneTypeListingPayload,
  LoadStoneTypeListingSuccessPayload,
  SaveStoneTypeFormDetailsPayload
} from '@poss-web/shared/models';
import { StoneTypeAdaptor } from '@poss-web/shared/util-adaptors';

describe('StoneTypeService ', () => {
  let httpTestingController: HttpTestingController;
  let stoneTypeService: StoneTypeService;
  const apiUrl = 'http://localhost:3000';

  const dummyItemList: StoneTypeDetails[] = [
    {
      stoneTypeCode: '0012',
      description: 'RUBY',
      configDetails: {
        karatageWeightPrint: 'yes'
      },
      isActive: false
    }
  ];

  const dummyItemResponse = {
    results: dummyItemList,
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StoneTypeService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    stoneTypeService = TestBed.inject(StoneTypeService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(stoneTypeService).toBeTruthy();
  });
  describe('getStoneTypeDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StoneTypeAdaptor, 'getStoneTypeDetailsListing').and.returnValue({});
      const payload: LoadStoneTypeListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getStoneTypeDetailsListingUrl(
        payload.pageIndex,
        payload.pageSize
      );
      stoneTypeService.getStoneTypeDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    it('should call StoneTypeAdaptor getStoneTypeDetailsListing method with correct  parameters', () => {
      spyOn(StoneTypeAdaptor, 'getStoneTypeDetailsListing').and.returnValue({});
      const payload: LoadStoneTypeListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getStoneTypeDetailsListingUrl(
        payload.pageIndex,
        payload.pageSize
      );

      stoneTypeService.getStoneTypeDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyItemResponse);
      expect(StoneTypeAdaptor.getStoneTypeDetailsListing).toHaveBeenCalledWith(
        dummyItemResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(StoneTypeAdaptor, 'getStoneTypeDetailsListing').and.returnValue({
        stoneTypeListing: dummyItemList,
        totalElements: 10
      });
      const payload: LoadStoneTypeListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const url = getStoneTypeDetailsListingUrl(
        payload.pageIndex,
        payload.pageSize
      );
      stoneTypeService.getStoneTypeDetails(payload).subscribe(data => {
        expect(data).toEqual({
          stoneTypeListing: dummyItemList,
          totalElements: 10
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
  describe('getStoneTypeDetailsByStoneTypeCode', () => {
    it('should call GET api method with correct url and params', () => {
      const stoneTypeCode = '0012';
      const path = getStoneTypeDetailsBystoneTypeCodeUrl(stoneTypeCode);
      stoneTypeService
        .getStoneTypeDetailsByStoneTypeCode(stoneTypeCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('saveStoneTypeFormDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const saveForm = {
        stoneTypeCode: '0012',
        description: 'RUBY',
        configDetails: {
          karatageWeightPrint: 'yes'
        },
        isActive: false
      };
      const path = getStoneTypeSaveFormDetailsUrl();
      stoneTypeService.saveStoneTypeFormDetails(saveForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('editStoneTypeFormDetails', () => {
    it('should call PATCH api method with correct url and params', () => {
      const editForm = {
        stoneTypeCode: '0012',
        description: 'RUBY',
        configDetails: {
          karatageWeightPrint: 'no'
        },
        isActive: false
      };
      const path = getStoneTypeDetailsBystoneTypeCodeUrl(
        editForm.stoneTypeCode
      );
      stoneTypeService.editStoneTypeFormDetails(editForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('getStoneTypeSearchResult', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StoneTypeAdaptor, 'getStoneTypeDetailsSearch').and.returnValue({});
      const stoneTypeCode = 'test';
      const path = getStoneTypeDetailsBystoneTypeCodeUrl(stoneTypeCode);
      stoneTypeService.getStoneTypeSearchResult(stoneTypeCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call StoneTypeAdaptor getStoneTypeDetailsSearch method with correct  parameters', () => {
      spyOn(StoneTypeAdaptor, 'getStoneTypeDetailsSearch').and.returnValue({});
      const stoneTypeCode = '0012';
      const path = getStoneTypeDetailsBystoneTypeCodeUrl(stoneTypeCode);
      stoneTypeService.getStoneTypeSearchResult(stoneTypeCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyItemResponse);
      expect(StoneTypeAdaptor.getStoneTypeDetailsSearch).toHaveBeenCalledWith(
        dummyItemResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(StoneTypeAdaptor, 'getStoneTypeDetailsSearch').and.returnValue(
        dummyItemList
      );
      const stoneTypeCode = '0012';
      const path = getStoneTypeDetailsBystoneTypeCodeUrl(stoneTypeCode);

      stoneTypeService
        .getStoneTypeSearchResult(stoneTypeCode)
        .subscribe(data => {
          expect(data).toEqual(dummyItemList);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
});
