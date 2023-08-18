import {
  ListingPayload,
  SortItem,
  FileUploadResponse,
  AirpayHostSuccessList
} from '@poss-web/shared/models';

import {
  // FileUpload,
  ResetResponse,
  GetHostNameList
  // ErrorLogDownload
} from './airpay-host-configuration.actions';
import { AirpayHostConfigurationState } from './airpay-host-configuration.state';
import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { AirpayHostConfigurationFacade } from './airpay-host-configuration.facade';
import { airpayHostConfigAdapter } from './airpay-host-configuration.entity';
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

const configListingPayload: ListingPayload = {
  pageIndex: 0,
  pageSize: 10
};
const sortField: SortItem = {
  colId: '',
  sort: 'Desc'
};

const unipayConfigurationList: AirpayHostSuccessList = {
  hostList: [
    {
      hostName: 'airpay',
      id: '123',
      isActive: true,
      locationCode: '123',
      newlyAdded: true,
      paymentCode: 'airpay'
    }
  ],
  count: 1
};

describe('Unipay Access Mapping facade Testing Suite action', () => {
  const initialState: AirpayHostConfigurationState = {
    fileUploadResponse: null,
    updatedHostNameList: '',
    hostNameList: airpayHostConfigAdapter.getInitialState(),
    hasError: null,
    isLoading: false,
    totalCount: 0,
    errorLog: null
  };

  let airpayHostConfigurationFacade: AirpayHostConfigurationFacade;

  //let store: MockStore<AirpayHostConfigurationState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        AirpayHostConfigurationFacade
      ]
    });

    airpayHostConfigurationFacade = TestBed.inject(
      AirpayHostConfigurationFacade
    );
  });

  // describe('Dispatch Unipay acess mapping action', () => {
  //   it('should call loadFileUpload action', inject([Store], store => {
  //     const storeSpy = spyOn(store, 'dispatch').and.callThrough();
  //     const action = new FileUpload(formData);
  //     airpayHostConfigurationFacade.loadFileUpload(formData);
  //     expect(storeSpy).toHaveBeenCalledWith(action);
  //   }));

  //   it('should call loadHostNameList action', inject([Store], store => {
  //     const storeSpy = spyOn(store, 'dispatch').and.callThrough();

  //     const action = new GetHostNameList(configListingPayload, sortField);
  //     airpayHostConfigurationFacade.loadHostNameList(
  //       configListingPayload,
  //       sortField
  //     );
  //     expect(storeSpy).toHaveBeenCalledWith(action);
  //   }));

  //   it('should call loadErrorLog action', inject([Store], store => {
  //     const storeSpy = spyOn(store, 'dispatch').and.callThrough();

  //     const action = new ErrorLogDownload('test');
  //     airpayHostConfigurationFacade.loadErrorLog('test');
  //     expect(storeSpy).toHaveBeenCalledWith(action);
  //   }));

  //   it('should call clearResponse action', inject([Store], store => {
  //     const storeSpy = spyOn(store, 'dispatch').and.callThrough();

  //     const action = new ResetResponse();
  //     airpayHostConfigurationFacade.clearResponse();
  //     expect(storeSpy).toHaveBeenCalledWith(action);
  //   }));
  // });

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

    // it('should get getUpdateResposne data', () => {
    //   expect(airpayHostConfigurationFacade.getUpdateResposne()).toBeTruthy();
    // });

    it('should get GetHostNameList data', () => {
      expect(airpayHostConfigurationFacade.GetHostNameList()).toBeTruthy();
    });
  });
});
