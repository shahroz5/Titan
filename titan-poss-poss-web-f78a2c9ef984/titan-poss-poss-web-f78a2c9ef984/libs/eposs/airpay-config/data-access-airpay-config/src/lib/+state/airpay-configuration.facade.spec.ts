import {
  ListPayload,
  SortItem,
  FileUploadResponse,
  AirpayVendorSuccessList
} from '@poss-web/shared/models';

import {
  ResetResponse,
  GetAirpayVendorList
} from './airpay-configuration.actions';
import { AirpayConfigurationState } from './airpay-configuration.state';
import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { AirpayConfigurationFacade } from './airpay-configuration.facade';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

const formData: FormData = new FormData();
const uploadResponse: FileUploadResponse = {
  fileId: 'test123',
  hasError: false,
  message: 'uploaded',
  records: {
    errorLogId: 'abc123',
    failureCount: 0,
    successCount: 1,
    totalCount: 1
  }
};

const configListingPayload: ListPayload = {
  pageIndex: 0,
  pageSize: 10
};
const sortField: SortItem = {
  colId: '',
  sort: 'Desc'
};

const unipayConfigurationList: AirpayVendorSuccessList = {
  vendorList: [
    {
      newlyAdded: true,
      locationCode: 'test',
      MerchantId: 'test',
      Username: 'test',
      Password: 'test',
      SecretKey: 'test',
      SecretToken: 'test'
    }
  ],
  count: 1
};

describe('Unipay Access Mapping facade Testing Suite action', () => {
  const initialState: AirpayConfigurationState = {
    fileUploadResponse: null,
    vendorList: null,
    hasError: null,
    isLoading: false,
    totalCount: 0,
    errorLog: null
  };

  let airpayHostConfigurationFacade: AirpayConfigurationFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), AirpayConfigurationFacade]
    });

    airpayHostConfigurationFacade = TestBed.inject(AirpayConfigurationFacade);
  });

  describe('Dispatch Airpay Config Facade ', () => {
    // it('should call loadFileUpload action', inject([Store], store => {
    //   const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    //   const action = new FileUpload(formData);
    //   airpayHostConfigurationFacade.loadFileUpload(formData);
    //   expect(storeSpy).toHaveBeenCalledWith(action);
    // }));

    it('should call loadvendorList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new GetAirpayVendorList(configListingPayload, sortField);
      airpayHostConfigurationFacade.loadVendorList(
        configListingPayload,
        sortField
      );
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    // it('should call loadErrorLog action', inject([Store], store => {
    //   const storeSpy = spyOn(store, 'dispatch').and.callThrough();

    //   const action = new ErrorLogDownload('test');
    //   airpayHostConfigurationFacade.loadErrorLog('test');
    //   expect(storeSpy).toHaveBeenCalledWith(action);
    // }));

    it('should call clearResponse action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ResetResponse();
      airpayHostConfigurationFacade.clearResponse();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
  });

  describe('Access Selector action', () => {
    it('should get getTotalElements data', () => {
      expect(airpayHostConfigurationFacade.getTotalElements()).toBeTruthy();
    });
    it('should get getHasError data', () => {
      expect(airpayHostConfigurationFacade.getError()).toBeTruthy();
    });

    it('should get getIsLoading data', () => {
      expect(airpayHostConfigurationFacade.getIsLoading()).toBeTruthy();
    });

    // it('should get GetErrorLog data', () => {
    //   expect(airpayHostConfigurationFacade.GetErrorLog()).toBeTruthy();
    // });

    // it('should get getFileFileUploadResponse data', () => {
    //   expect(
    //     airpayHostConfigurationFacade.getFileUploadResponse()
    //   ).toBeTruthy();
    // });
    it('should get GetAirpayVendorList data', () => {
      expect(airpayHostConfigurationFacade.GetVendorList()).toBeTruthy();
    });
  });
});
