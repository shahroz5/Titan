import { PIFSeriesService } from './pif-series.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { PIFSeriesAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getPIFSeriesUrl,
  getSavePIFSeriesUrl
} from '@poss-web/shared/util-api-service';
import {
  PIFSeriesResponse,
  SavePIFSeriesPayload
} from '@poss-web/shared/models';
describe('PIFSeriesService', () => {
  const dummyPIFSeriesResponse: PIFSeriesResponse = {
    pifSeries: [
      {
        id: '123',
        bankName: 'AXIS BANK',
        paymentCode: 'CASH',
        fromNo: 12,
        toNo: 123,
        currentSeqNo: 123,
        homeBank: 'AXIS',
        isActive: true
      }
    ],
    totalElements: 1
  };
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let pifSeriesService: PIFSeriesService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PIFSeriesService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    pifSeriesService = TestBed.inject(PIFSeriesService);
  });
  it('should be created', () => {
    expect(pifSeriesService).toBeTruthy();
  });
  describe('loadPIFSeries', () => {
    it('should call GET api method with correct url and paramters', () => {
      spyOn(PIFSeriesAdaptor, 'getPIFSeries').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const { path, params } = getPIFSeriesUrl(pageIndex, pageSize);
      pifSeriesService
        .loadPIFSeries({
          pageIndex: pageIndex,
          pageSize: pageSize
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page')).toEqual(pageIndex.toString());
      expect(request.request.params.get('size')).toEqual(pageSize.toString());
      request.flush({});
    });
    it('should call PIFSeriesAdaptor getPIFSeries method with correct  parameters', () => {
      spyOn(PIFSeriesAdaptor, 'getPIFSeries').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;

      const path = getPIFSeriesUrl(pageIndex, pageSize).path;

      pifSeriesService
        .loadPIFSeries({ pageIndex: pageIndex, pageSize: pageSize })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyPIFSeriesResponse);
      expect(PIFSeriesAdaptor.getPIFSeries).toHaveBeenCalledWith(
        dummyPIFSeriesResponse
      );
    });
  });

  it('should return data mapped by adaptors', () => {
    spyOn(PIFSeriesAdaptor, 'getPIFSeries').and.returnValue({
      pifSeries: dummyPIFSeriesResponse.pifSeries,
      totalElements: dummyPIFSeriesResponse.totalElements
    });
    const pageIndex = 0;
    const pageSize = 10;

    const path = getPIFSeriesUrl(pageIndex, pageSize).path;

    pifSeriesService
      .loadPIFSeries({ pageIndex: pageIndex, pageSize: pageSize })
      .subscribe(data => {
        expect(data).toEqual({
          pifSeries: dummyPIFSeriesResponse.pifSeries,
          totalElements: dummyPIFSeriesResponse.totalElements
        });
      });

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });

    request.flush({});
  });
  describe('savePIFSeries', () => {
    it('should call GET api method with correct url and paramters', () => {
      const savePayload: SavePIFSeriesPayload[] = [
        {
          fromNo: 100,
          id: 'ABC',
          toNo: 120
        }
      ];

      const path = getSavePIFSeriesUrl();
      pifSeriesService.savePIFSeries(savePayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });
  });
});
