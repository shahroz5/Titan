import { TestBed } from '@angular/core/testing';

import { CnValidation, CnValidationResponse } from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CnValidationAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getConfigurationListUrl,
  getSearchConfigByConfigNameUrl,
  getUpdateConfigurationUrl,
  getSaveConfigurationUrl,
  getCreditNoteTypeUrl
} from '@poss-web/shared/util-api-service';
import { CnValidationService } from './cn-validation.service';
describe('CnValidationService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let cnValidationService: CnValidationService;

  const dummyCnValidationResponse: CnValidationResponse = {
    description: 'GEP',
    ruleId: '1',
    ruleType: 'GEP',
    isActive: true,
    isCancellationAllowed: true,
    deductionRate: '30',
    criteriaRateForDeduction: '30',
    residentialValueAmount: '5000',
    isBrandWiseTransferAllowed: true,
    isBoutiqueWiseTransferAllowed: true,
    GHSUtilizationTransferPercent: '30',
    GHSMaxAmountTransfer: '2000'
  };

  const dummyCnValidationRequestResponse = {
    results: [dummyCnValidationResponse],
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  const dummyCNTypeResponse = [
    {
      id: 'GEP',
      description: 'Gold Exchange Policy'
    },
    {
      id: 'TEP',
      description: 'Tanishq Exchange Policy'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CnValidationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    cnValidationService = TestBed.inject(CnValidationService);
  });

  it('should be created', () => {
    expect(cnValidationService).toBeTruthy();
  });

  describe('getCnValidationList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(CnValidationAdaptor, 'getCnValidationList').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const url = getConfigurationListUrl(pageIndex, pageSize);

      cnValidationService.getCnValidationList(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );

      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      request.flush({});
    });

    it('should call CnValidationAdaptor getCnValidationList method with correct  parameters', () => {
      spyOn(CnValidationAdaptor, 'getCnValidationList').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;

      const url = getConfigurationListUrl(pageIndex, pageSize);
      cnValidationService.getCnValidationList(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyCnValidationRequestResponse);
      expect(CnValidationAdaptor.getCnValidationList).toHaveBeenCalledWith(
        dummyCnValidationRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CnValidationAdaptor, 'getCnValidationList').and.returnValue({
        cnValidationList: [dummyCnValidationResponse],
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;

      const url = getConfigurationListUrl(pageIndex, pageSize);

      cnValidationService
        .getCnValidationList(pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual({
            cnValidationList: [dummyCnValidationResponse],
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('saveCnValidation', () => {
    const path = getSaveConfigurationUrl('GEP');

    const dummyCnValidation: CnValidation = {
      description: 'GEP',
      ruleType: 'GEP',
      isActive: true,
      ruleDetails: {
        data: {
          isCancellationAllowed: true,
          deductionRate: '30',
          criteriaRateForDeduction: '30',
          residentialValueAmount: '5000',
          isBrandWiseTransferAllowed: true,
          isBoutiqueWiseTransferAllowed: true,
          GHSUtilizationTransferPercent: '30',
          GHSMaxAmountTransfer: '2000'
        },
        type: 'GEP'
      }
    };

    it('should call POST api method with correct url and params', () => {
      spyOn(CnValidationAdaptor, 'getCnValidation').and.returnValue({});

      cnValidationService.saveCnValidation(dummyCnValidation).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CnValidationAdaptor getCnValidation method with correct  parameters', () => {
      spyOn(CnValidationAdaptor, 'getCnValidation').and.returnValue({});

      cnValidationService.saveCnValidation(dummyCnValidation).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyCnValidationResponse);
      expect(CnValidationAdaptor.getCnValidation).toHaveBeenCalledWith(
        dummyCnValidationResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CnValidationAdaptor, 'getCnValidation').and.returnValue(
        dummyCnValidationResponse
      );

      cnValidationService
        .saveCnValidation(dummyCnValidation)
        .subscribe(data => {
          expect(data).toEqual(dummyCnValidationResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('updateCnValidation', () => {
    const dummyCnValidation: CnValidation = {
      ruleId: '1',
      ruleType: 'GHS',
      description: 'GHS',
      isActive: true,
      ruleDetails: {
        data: {
          isCancellationAllowed: true,
          deductionRate: '30',
          criteriaRateForDeduction: '30',
          residentialValueAmount: '5000',
          isBrandWiseTransferAllowed: true,
          isBoutiqueWiseTransferAllowed: true,
          GHSUtilizationTransferPercent: '30',
          GHSMaxAmountTransfer: '2000'
        },
        type: 'GHS'
      }
    };
    const path = getUpdateConfigurationUrl('1', 'GHS');
    it('should call PATCH api method with correct url and params', () => {
      cnValidationService.updateCnValidation(dummyCnValidation).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CnValidationAdaptor getCnValidation method with correct  parameters', () => {
      spyOn(CnValidationAdaptor, 'getCnValidation').and.returnValue({});

      cnValidationService.updateCnValidation(dummyCnValidation).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyCnValidationResponse);
      expect(CnValidationAdaptor.getCnValidation).toHaveBeenCalledWith(
        dummyCnValidationResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CnValidationAdaptor, 'getCnValidation').and.returnValue(
        dummyCnValidationResponse
      );

      cnValidationService
        .updateCnValidation(dummyCnValidation)
        .subscribe(data => {
          expect(data).toEqual(dummyCnValidationResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('getCnValidation', () => {
    const path = getUpdateConfigurationUrl('1', 'GEP');

    it('should call GET  api method with correct url and params', () => {
      spyOn(CnValidationAdaptor, 'getCnValidation').and.returnValue({});

      cnValidationService.getCnValidation('1', 'GEP').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call CnValidationAdaptor getCnValidation method with correct  parameters', () => {
      spyOn(CnValidationAdaptor, 'getCnValidation').and.returnValue({});

      cnValidationService.getCnValidation('1', 'GEP').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyCnValidationResponse);
      expect(CnValidationAdaptor.getCnValidation).toHaveBeenCalledWith(
        dummyCnValidationResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CnValidationAdaptor, 'getCnValidation').and.returnValue(
        dummyCnValidationResponse
      );

      cnValidationService.getCnValidation('1', 'GEP').subscribe(data => {
        expect(data).toEqual(dummyCnValidationResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getNewCnValidationByRuleId', () => {
    const newCnValidation: CnValidation = {
      ruleId: 'new',
      ruleType: '',
      description: '',
      isActive: true
    };
    it('should call CnValidationAdaptor getCnValidation method with correct  parameters', () => {
      spyOn(CnValidationAdaptor, 'getCnValidation').and.returnValue({});

      cnValidationService.getNewCnValidationByRuleId();

      expect(CnValidationAdaptor.getCnValidation).toHaveBeenCalledWith(false);
    });

    it('should return data mapped by adaptors', () => {
      cnValidationService.getNewCnValidationByRuleId();
      expect(newCnValidation).toEqual(newCnValidation);
    });
  });

  describe('searchCnValidationByCnType', () => {
    it('should call POST  api method with correct url and params', () => {
      spyOn(CnValidationAdaptor, 'getCnValidationList').and.returnValue({});
      const searchValue = 'GEP';
      const path = getSearchConfigByConfigNameUrl('GEP');

      cnValidationService.searchCnValidationByCnType(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call CnValidationAdaptor getCnValidationList method with correct  parameters', () => {
      spyOn(CnValidationAdaptor, 'getCnValidationList').and.returnValue({});
      const searchValue = 'GEP';
      const path = getSearchConfigByConfigNameUrl('GEP');
      cnValidationService.searchCnValidationByCnType(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyCnValidationRequestResponse);
      expect(CnValidationAdaptor.getCnValidationList).toHaveBeenCalledWith(
        dummyCnValidationRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CnValidationAdaptor, 'getCnValidationList').and.returnValue({
        cnValidationList: [dummyCnValidationResponse],
        totalElements: 10
      });
      const searchValue = 'GEP';
      const path = getSearchConfigByConfigNameUrl('GEP');

      cnValidationService
        .searchCnValidationByCnType(searchValue)
        .subscribe(data => {
          expect(data).toEqual({
            cnValidationList: [dummyCnValidationResponse],
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getCreditNoteType', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CnValidationAdaptor, 'getCnTypeList').and.returnValue({});

      const url = getCreditNoteTypeUrl();

      cnValidationService.getCreditNoteType().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call CnValidationAdaptor getCnTypeList method with correct  parameters', () => {
      spyOn(CnValidationAdaptor, 'getCnTypeList').and.returnValue({});

      const url = getCreditNoteTypeUrl();
      cnValidationService.getCreditNoteType().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(dummyCNTypeResponse);
      expect(CnValidationAdaptor.getCnTypeList).toHaveBeenCalledWith(
        dummyCNTypeResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CnValidationAdaptor, 'getCnTypeList').and.returnValue(
        dummyCNTypeResponse
      );

      const url = getCreditNoteTypeUrl();

      cnValidationService.getCreditNoteType().subscribe(data => {
        expect(data).toEqual(dummyCNTypeResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });
});
