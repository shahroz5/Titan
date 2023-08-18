import { provideMockStore } from '@ngrx/store/testing';

import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  ConfigListingPayload,
  GrnInterboutiqueConfig,
  LoadStateTaxConfigurationListingPayload,
  SortItem,
  StateTaxConfigurationStateDetails,
  TaxDetailsSelect,
  TaxDetailsSubmit
} from '@poss-web/shared/models';
import { RazorpayVendorConfigurationFacade } from './razorpay-vendor-mapping.facade';
import { RazorpayVendorConfigurationState } from './razorpay-vendor-mapping.state';
import { initialState as istate } from './razorpay-vendor-mapping.reducers';
import {
  ErrorLogDownload,
  GetVendorList
} from './razorpay-vendor-mapping.actions';

describe('StateTaxConfigFacade', () => {
  let razorpayVendorConfigurationFacade: RazorpayVendorConfigurationFacade;
  const initialState: RazorpayVendorConfigurationState = { ...istate };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        RazorpayVendorConfigurationFacade
      ]
    });

    razorpayVendorConfigurationFacade = TestBed.inject(
      RazorpayVendorConfigurationFacade
    );
  });

  it('should create facade', () => {
    expect(razorpayVendorConfigurationFacade).toBeDefined();
  });

  describe('#getTotalElements', () => {
    it('should get getTotalElements', () => {
      expect(razorpayVendorConfigurationFacade.getTotalElements()).toBeTruthy();
    });
  });

  describe('#getUpdateResposne', () => {
    it('should get getUpdateResposne', () => {
      expect(
        razorpayVendorConfigurationFacade.getUpdateResposne()
      ).toBeTruthy();
    });
  });

  describe('#getFileUploadResponse', () => {
    it('should get getFileUploadResponse', () => {
      expect(
        razorpayVendorConfigurationFacade.getFileUploadResponse()
      ).toBeTruthy();
    });
  });

  describe('#GetVendorList', () => {
    it('should get GetVendorList', () => {
      expect(razorpayVendorConfigurationFacade.GetVendorList()).toBeTruthy();
    });
  });

  describe('#getIsLoading', () => {
    it('should get getIsLoading', () => {
      expect(razorpayVendorConfigurationFacade.getIsLoading()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should get getError', () => {
      expect(razorpayVendorConfigurationFacade.getError()).toBeTruthy();
    });
  });

  describe('#GetErrorLog', () => {
    it('should get GetErrorLog', () => {
      expect(razorpayVendorConfigurationFacade.GetErrorLog()).toBeTruthy();
    });
  });

  describe('#GetVendorList', () => {
    it('should GetVendorList', inject([Store], store => {
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
      const expectedAction = new GetVendorList(
        payload,
        sortField,
        locationCode
      );
      razorpayVendorConfigurationFacade.loadVendorList(
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
      razorpayVendorConfigurationFacade.loadErrorLog(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
