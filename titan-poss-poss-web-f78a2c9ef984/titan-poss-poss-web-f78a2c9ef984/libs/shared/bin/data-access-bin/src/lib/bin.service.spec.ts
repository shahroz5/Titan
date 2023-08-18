import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { BinService } from './bin.service';
import { BinAdaptor } from '@poss-web/shared/util-adaptors';
import {
  BinCodeListingPayload,
  BinCodesByBinGroup,
  LocationMappingPostPayload,
  LocationsByBinGroupAndBinCodePayload
} from '@poss-web/shared/models';
import {
  getBinCodeEditedFormDetailsUrl,
  getBinCodeSaveNewFormDetailsUrl,
  getBinCodesByBinGroupCode,
  getBinDetailsByBinNameUrl,
  getLocationMappingUpdateUrl,
  getLocationsByBinGroupAndBinCode
} from '@poss-web/shared/util-api-service';

describe('BinService ', () => {
  let httpTestingController: HttpTestingController;
  let binService: BinService;
  const apiUrl = 'http://localhost:3000';

  const dummyList: BinCodesByBinGroup[] = [
    {
      binCode: 'A',
      description: 'B',
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
        BinService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    binService = TestBed.inject(BinService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  it('should be created', () => {
    expect(binService).toBeTruthy();
  });

  describe('getBinCodesByBinGroupCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(BinAdaptor, 'binCodesByBinGroup').and.returnValue({});
      const payload: BinCodeListingPayload = {
        binGroupCode: 'STN',
        pageIndex: 0,
        pageSize: 10
      };
      const url = getBinCodesByBinGroupCode(
        payload.binGroupCode,
        payload.pageIndex,
        payload.pageSize
      );
      binService.getBinCodesByBinGroupCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush(dummyResponse);
      expect(BinAdaptor.binCodesByBinGroup).toHaveBeenCalledWith(dummyResponse);
    });
  });

  describe('saveBinCodeNewFormDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const saveForm = {
        binCode: 'STNNEW',
        binGroups: ['STN'],
        description: 'test'
      };
      const path = getBinCodeSaveNewFormDetailsUrl();
      binService.saveBinCodeNewFormDetails(saveForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('saveBinCodeEditedFormDetails', () => {
    it('should call PATCH api method with correct url and params', () => {
      const editForm = {
        binCode: 'STNNEW',
        binGroups: [],
        description: 'test'
      };
      const url = getBinCodeEditedFormDetailsUrl(editForm.binCode);
      binService.saveBinCodeEditedFormDetails(editForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  // describe('searchBinName', () => {
  //   it('should call GET api method with correct url and params', () => {
  //     const payload = {
  //       binName: 'STN',
  //       binGroupCode: 'STNNEW'
  //     };
  //     const url = getBinDetailsByBinNameUrl(
  //       payload.binName,
  //       payload.binGroupCode
  //     );
  //     binService
  //       .searchBinName(payload.binName, payload.binGroupCode)
  //       .subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + url.path;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('GET');
  //     expect(request.request.responseType).toEqual('json');
  //     request.flush({});
  //   });
  // });
  describe('getLocationsByBinGroupAndBinCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(BinAdaptor, 'locationsByBinGroupAndCode').and.returnValue({});
      const payload: LocationsByBinGroupAndBinCodePayload = {
        binGroup: 'STNNEW',
        binCodes: ['STN']
      };
      const url = getLocationsByBinGroupAndBinCode(payload);
      binService.getLocationsByBinGroupAndBinCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush([{ id: '', descrption: '' }]);
      expect(BinAdaptor.locationsByBinGroupAndCode).toHaveBeenCalledWith([
        { id: '', descrption: '' }
      ]);
    });
  });
  describe('saveLocationMapping', () => {
    it('should call PATCH api method with correct url and params', () => {
      const payload: LocationMappingPostPayload = {
        binGroup: 'STN',
        data: { addLocations: [], binCodes: [], removeLocations: [] }
      };
      const path = getLocationMappingUpdateUrl(payload.binGroup);
      binService.saveLocationMapping(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
});
