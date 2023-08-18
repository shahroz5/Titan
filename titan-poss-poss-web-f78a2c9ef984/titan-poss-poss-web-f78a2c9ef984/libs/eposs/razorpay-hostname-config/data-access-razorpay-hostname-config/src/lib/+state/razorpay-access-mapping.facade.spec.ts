import { provideMockStore } from '@ngrx/store/testing';

import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ConfigListingPayload, SortItem } from '@poss-web/shared/models';
import { RazorpayConfigurationFacade } from './razorpay-access-mapping.facade';
import { RazorpayConfigurationState } from './razorpay-access-mapping.state';
import { initialState as istate } from './razorpay-access-mapping.reducers';
import {
  ErrorLogDownload,
  GetAccessList
} from './razorpay-access-mapping.actions';

describe('StateTaxConfigFacade', () => {
  let razorpayConfigurationFacade: RazorpayConfigurationFacade;
  const initialState: RazorpayConfigurationState = { ...istate };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        RazorpayConfigurationFacade
      ]
    });

    razorpayConfigurationFacade = TestBed.inject(RazorpayConfigurationFacade);
  });

  it('should create facade', () => {
    expect(razorpayConfigurationFacade).toBeDefined();
  });

  describe('#getTotalElements', () => {
    it('should get getTotalElements', () => {
      expect(razorpayConfigurationFacade.getTotalElements()).toBeTruthy();
    });
  });

  describe('#getUpdateResposne', () => {
    it('should get getUpdateResposne', () => {
      expect(razorpayConfigurationFacade.getUpdateResposne()).toBeTruthy();
    });
  });

  describe('#getFileUploadResponse', () => {
    it('should get getFileUploadResponse', () => {
      expect(razorpayConfigurationFacade.getFileUploadResponse()).toBeTruthy();
    });
  });

  describe('#GetVendorList', () => {
    it('should get GetVendorList', () => {
      expect(razorpayConfigurationFacade.GetAccessList()).toBeTruthy();
    });
  });

  describe('#getIsLoading', () => {
    it('should get getIsLoading', () => {
      expect(razorpayConfigurationFacade.getIsLoading()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should get getError', () => {
      expect(razorpayConfigurationFacade.getError()).toBeTruthy();
    });
  });

  describe('#GetErrorLog', () => {
    it('should get GetErrorLog', () => {
      expect(razorpayConfigurationFacade.GetErrorLog()).toBeTruthy();
    });
  });

  describe('#GetAccessList', () => {
    it('should GetAccessList', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: ConfigListingPayload = {
        pageIndex: 0,
        pageSize: 1
      };
      const sortField: SortItem = {
        colId: '0',
        sort: '1'
      };
      const locationCode: string = '';
      const expectedAction = new GetAccessList(
        payload,
        sortField,
        locationCode
      );
      razorpayConfigurationFacade.loadAccessList(
        payload,
        sortField,
        locationCode
      );

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadErrorLog', () => {
    it('should loadErrorLog', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload = '';
      const expectedAction = new ErrorLogDownload(payload);
      razorpayConfigurationFacade.loadErrorLog(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
