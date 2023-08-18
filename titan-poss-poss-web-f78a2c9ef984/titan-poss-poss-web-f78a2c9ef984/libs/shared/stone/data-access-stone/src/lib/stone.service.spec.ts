import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { StoneService } from './stone.service';
import {
  ApiService,
  getFilterStoneListUrl
} from '@poss-web/shared/util-api-service';
import { StoneDetails, StoneFilter } from '@poss-web/shared/models';
import { StoneAdaptor } from '@poss-web/shared/util-adaptors';
describe('StoneService ', () => {
  let httpTestingController: HttpTestingController;
  let stoneService: StoneService;
  const apiUrl = 'http://localhost:3000';

  const dummyList: StoneDetails[] = [
    {
      stoneCode: 'ABC',
      stoneTypeCode: 'ABC',
      stdWeight: 'ABC',
      color: 'ABC',
      stdValue: 'ABC',
      quality: 'ABC',
      configDetails: { StoneTEPDiscount: 0 },
      ratePerCarat: 0,
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

  const payload: StoneFilter = {
    payloadData: {
      color: 'AAA',
      fromStdValue: 10,
      quality: 'AAA',
      ratePerCarat: 10,
      stoneCode: 'AAA',
      stoneTypeCode: 'AAA',
      toStdValue: 10
    },
    pageIndex: 0,
    pageSize: 100
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StoneService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    stoneService = TestBed.inject(StoneService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(stoneService).toBeTruthy();
  });
  describe('getFilteredStoneList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(StoneAdaptor, 'getStoneDetailsListing').and.returnValue({});

      const url = getFilterStoneListUrl(payload.pageIndex, payload.pageSize);
      stoneService.getFilteredStoneList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.url).toEqual(apiUrl + url.path);
      request.flush({});
    });
    it('should call StoneAdaptor getStoneDetailsListing method with correct  parameters', () => {
      spyOn(StoneAdaptor, 'getStoneDetailsListing').and.returnValue({});

      const url = getFilterStoneListUrl(payload.pageIndex, payload.pageSize);

      stoneService.getFilteredStoneList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResponse);
      expect(StoneAdaptor.getStoneDetailsListing).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(StoneAdaptor, 'getStoneDetailsListing').and.returnValue({
        stoneListing: dummyList,
        totalElements: 10
      });

      const url = getFilterStoneListUrl(payload.pageIndex, payload.pageSize);
      stoneService.getFilteredStoneList(payload).subscribe(data => {
        expect(data).toEqual({
          stoneListing: dummyList,
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
