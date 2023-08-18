import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { CourierDataService } from '@poss-web/shared/masters/data-access-masters';
import { CourierDetailsService } from './courier-details.service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CourierDetailsAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getCourierDetailsBasedOnCourierNameUrl,
  getCourierDetailsListingUrl
} from '@poss-web/shared/util-api-service';
describe('CourierDetailsService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let courierDetailsService: CourierDetailsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CourierDetailsService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    courierDetailsService = TestBed.inject(CourierDetailsService);
  });

  it('should be created', () => {
    expect(courierDetailsService).toBeTruthy();
  });
  describe('getCourierDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CourierDetailsAdaptor, 'getCourierDetailsListing').and.returnValue(
        {}
      );
      const pageIndex = 0;
      const pageSize = 10;
      const { path, params } = getCourierDetailsListingUrl(pageIndex, pageSize);

      courierDetailsService
        .getCourierDetails({ pageIndex: pageIndex, pageSize: pageSize })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('page')).toEqual(pageIndex.toString());
      expect(request.request.params.get('size')).toEqual(pageSize.toString());
      expect(request.request.params.get('sort')).toEqual('createdDate,desc');
      request.flush({});
    });
  });

  describe('getCourierDetailsBasedOnCourierName', () => {
    it('should call GET api method with correct url and params', () => {
      // spyOn(CourierDetailsAdaptor, 'getCourierDetailsListing').and.returnValue(
      //   {}
      // );

      const path = getCourierDetailsBasedOnCourierNameUrl('CourierName');

      courierDetailsService
        .getCourierDetailsBasedOnCourierName('CourierName')
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
});
