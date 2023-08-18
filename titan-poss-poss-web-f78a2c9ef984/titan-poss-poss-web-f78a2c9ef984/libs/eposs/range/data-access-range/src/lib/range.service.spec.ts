import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigurationRanges } from '@poss-web/shared/models';
import { RangeAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getLoadRangesUrl,
  getSaveRangesUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { RangeService } from './range.service';
describe('RangeService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let rangeService: RangeService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RangeService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    rangeService = TestBed.inject(RangeService);
  });
  const ranges: ConfigurationRanges[] = [
    {
      fromRange: '70',
      toRange: '80',
      id: 'abc123',
      rowId: 1,
      isActive: true
    }
  ];
  const dummyRanges = {
    results: ranges,
    totalElements: 1
  };
  describe('LoadRanges', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(RangeAdaptor, 'rangeList').and.returnValue({});

      const { path, params } = getLoadRangesUrl('GEP_PURITY');

      rangeService.loadRanges('GEP_PURITY').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('rangeType').toString()).toEqual(
        'GEP_PURITY'
      );
      expect(request.request.params.get('isPageable').toString()).toEqual(
        'false'
      );
      request.flush({});
    });

    it('should call RangeAdaptor RangeList method with correct  parameters', () => {
      spyOn(RangeAdaptor, 'rangeList').and.returnValue({});

      const { path, params } = getLoadRangesUrl('GEP_PURITY');

      rangeService.loadRanges('GEP_PURITY').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyRanges);
      expect(RangeAdaptor.rangeList).toHaveBeenCalledWith(dummyRanges);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(RangeAdaptor, 'rangeList').and.returnValue(ranges);

      const { path, params } = getLoadRangesUrl('GEP_PURITY');

      rangeService.loadRanges('GEP_PURITY').subscribe(data => {
        expect(data).toEqual(ranges);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('SaveRanges', () => {
    it('should call PATCH api method with correct url and params', () => {
      const { path, params } = getSaveRangesUrl('GEP_PURITY');
      const savePayload = {
        rangeType: 'GEP_PURITY',
        savePayload: [
          {
            fromRange: 12,
            toRange: 13,
            isActive: true,
            id: 'abc123',
            range: 'GEP_PURITY'
          }
        ]
      };

      rangeService.saveRanges(savePayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('rangeType').toString()).toEqual(
        'GEP_PURITY'
      );
      request.flush({});
    });
  });
});
