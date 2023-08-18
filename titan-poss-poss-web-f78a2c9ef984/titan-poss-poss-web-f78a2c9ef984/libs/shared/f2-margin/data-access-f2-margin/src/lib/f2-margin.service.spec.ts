import { TestBed } from '@angular/core/testing';

import {
  F2MarginListPayload,
  F2MarginListResponse
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { F2MarginAdaptor } from '@poss-web/shared/util-adaptors';
import { getF2MarginListUrl } from '@poss-web/shared/util-api-service';
import { F2MarginService } from './f2-margin.service';
describe('F2MarginService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let f2MarginService: F2MarginService;
  const dummyF2MarginRequestResponse: F2MarginListResponse = {
    f2MarginList: [
      {
        id: '1',
        cfa: '71',
        f1From: 1,
        f1To: 2,
        stoneBandFrom: 1,
        stoneBandTo: 2,
        margin: 1
      }
    ],
    totalElements: 1
  };

  const dummyF2MarginRequestRequestResponse = {
    pageNumber: 0,
    pageSize: 0,
    results: dummyF2MarginRequestResponse,
    totalElements: 0,
    totalPages: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        F2MarginService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    f2MarginService = TestBed.inject(F2MarginService);
  });

  it('should be created', () => {
    expect(f2MarginService).toBeTruthy();
  });

  describe('getF2MarginList', () => {
    const f2MarginListPayload: F2MarginListPayload = {
      cfaCode: '71',
      pageIndex: 1,
      pageSize: 10
    };
    const url = getF2MarginListUrl(
      f2MarginListPayload.pageIndex,
      f2MarginListPayload.pageSize,
      f2MarginListPayload.cfaCode
    );

    it('should call GET api method with correct url and params', () => {
      spyOn(F2MarginAdaptor, 'getF2MarginListData').and.returnValue({});

      f2MarginService.getF2MarginList(f2MarginListPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        f2MarginListPayload.pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        f2MarginListPayload.pageSize.toString()
      );
      request.flush({});
    });

    it('should call F2MarginAdaptor getF2MarginListData method with correct  parameters', () => {
      spyOn(F2MarginAdaptor, 'getF2MarginListData').and.returnValue({});

      f2MarginService.getF2MarginList(f2MarginListPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyF2MarginRequestRequestResponse);
      expect(F2MarginAdaptor.getF2MarginListData).toHaveBeenCalledWith(
        dummyF2MarginRequestRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(F2MarginAdaptor, 'getF2MarginListData').and.returnValue(
        dummyF2MarginRequestResponse
      );

      f2MarginService.getF2MarginList(f2MarginListPayload).subscribe(data1 => {
        expect(data1).toEqual(dummyF2MarginRequestResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
});
