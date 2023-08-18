import {
  ConfigListingPayload,
  SortItem,
  UploadResponse,
  UnipayConfigurationList
} from '@poss-web/shared/models';

import {
  FileUpload,
  FileUploadSuccess,
  FileUploadFailure,
  ResetResponse,
  GetAccessList,
  GetAccessListFailure,
  GetAccessListSuccess,
  ErrorLogDownload,
  ErrorLogDownloadSuccess,
  ErrorLogDownloadFailure,
  UnipayConfigurationActionTypes
} from './unipay-access-mapping.actions';
import { UnipayConfigurationState } from './unipay-access-mapping.state';
import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { UnipayConfigurationFacade } from './unipay-access-mapping.facade';
import { unipayAccessMappingAdapter } from './unipay-access-mapping.entity';
import * as moment from 'moment';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

const formData: FormData = new FormData();


const configListingPayload: ConfigListingPayload = {
  pageIndex: 0,
  pageSize: 10
};
const sortField: SortItem = {
  colId: '',
  sort: 'Desc'
};


describe('Unipay Access Mapping facade Testing Suite action', () => {
  const initialState: UnipayConfigurationState = {
    fileUploadResponse: null,
    updatedAccessList: '',
    accessList: unipayAccessMappingAdapter.getInitialState(),
    hasError: null,
    isLoading: false,
    totalCount: 0,
    errorLog: null
  };

  let unipayConfigurationFacade: UnipayConfigurationFacade;

  //let store: MockStore<UnipayConfigurationState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), UnipayConfigurationFacade]
    });

    unipayConfigurationFacade = TestBed.inject(UnipayConfigurationFacade);
  });

  describe('Dispatch Unipay acess mapping action', () => {
    it('should call loadFileUpload action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new FileUpload(formData);
      unipayConfigurationFacade.loadFileUpload(formData);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadAccessList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new GetAccessList(configListingPayload, sortField);
      unipayConfigurationFacade.loadAccessList(configListingPayload, sortField);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadErrorLog action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ErrorLogDownload('test');
      unipayConfigurationFacade.loadErrorLog('test');
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call clearResponse action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ResetResponse();
      unipayConfigurationFacade.clearResponse();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
  });

  describe('Access Selector action', () => {
    it('should get getTotalElements data', () => {
      expect(unipayConfigurationFacade.getTotalElements()).toBeTruthy();
    });
    it('should get getHasError data', () => {
      expect(unipayConfigurationFacade.getError()).toBeTruthy();
    });

    it('should get getIsLoading data', () => {
      expect(unipayConfigurationFacade.getIsLoading()).toBeTruthy();
    });

    it('should get GetErrorLog data', () => {
      expect(unipayConfigurationFacade.GetErrorLog()).toBeTruthy();
    });

    it('should get getFileUploadResponse data', () => {
      expect(unipayConfigurationFacade.getFileUploadResponse()).toBeTruthy();
    });

    it('should get getUpdateResposne data', () => {
      expect(unipayConfigurationFacade.getUpdateResposne()).toBeTruthy();
    });

    it('should get GetAccessList data', () => {
      expect(unipayConfigurationFacade.GetAccessList()).toBeTruthy();
    });
  });
});
