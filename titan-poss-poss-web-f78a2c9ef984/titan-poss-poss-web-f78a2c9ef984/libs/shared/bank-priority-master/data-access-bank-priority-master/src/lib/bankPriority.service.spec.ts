import { TestBed } from '@angular/core/testing';

import {
  SaveBankPriorityFormDetailsPayload,
  LoadBankPriorityListingSuccessPayload
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { BankPriorityAdaptor } from '@poss-web/shared/util-adaptors';
import { getBankPrioritySaveFormDetailsUrl } from '@poss-web/shared/util-api-service';
import { BankPriorityService } from './bankPriority.service';

describe('BankPriorityService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let bankPriorityService: BankPriorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BankPriorityService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    bankPriorityService = TestBed.inject(BankPriorityService);
  });

  it('should be created', () => {
    expect(bankPriorityService).toBeTruthy();
  });

  describe('saveBankPriorityFormDetails', () => {
    const url = getBankPrioritySaveFormDetailsUrl();
    const payload: SaveBankPriorityFormDetailsPayload = {
      addPriority: [{ bankName: 'HDFC', priority: '2', locationCode: '' }],
      removePriority: []
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(BankPriorityAdaptor, 'getSavedBank').and.returnValue({});

      bankPriorityService.saveBankPriorityFormDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call BankPriorityAdaptor getPaymentMasterDataByPaymentCode method with correct  parameters', () => {
      spyOn(BankPriorityAdaptor, 'getSavedBank').and.returnValue({});

      bankPriorityService.saveBankPriorityFormDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(payload);
      expect(BankPriorityAdaptor.getSavedBank).toHaveBeenCalledWith(payload);
    });

    it('should return data mapped by adaptors', () => {
      const res: LoadBankPriorityListingSuccessPayload = {
        bankPriorityListing: [{ bankName: 'HDFC', priority: '1' }],
        totalElements: 1
      };
      spyOn(BankPriorityAdaptor, 'getSavedBank').and.returnValue(res);

      bankPriorityService
        .saveBankPriorityFormDetails(payload)
        .subscribe(data => {
          expect(data).toEqual(res);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });
});
