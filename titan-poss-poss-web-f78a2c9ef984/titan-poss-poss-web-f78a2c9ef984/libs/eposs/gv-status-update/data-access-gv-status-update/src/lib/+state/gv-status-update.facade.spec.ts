import {
  ConfigListingPayload,
  CustomErrors,
  SortItem,
  GvStatusList,
  UploadResponse,
  GVStatusListingPayload,
  GVStatusUpdateList,
  GVExtendValidity,
  GVStatusChange
} from '@poss-web/shared/models';

import {
  FileUpload,
  FileUploadSuccess,
  FileUploadFailure,
  ResetResponse,
  GetGVStatusList,
  GetGVStatusListFailure,
  ExtendGVStatus,
  ExtendGVStatusSuccess,
  ExtendGVStatusFailure,
  GetGVStatusListSuccess,
  ChangeGVStatus,
  ChangeGVStatusSuccess,
  ChangeGVStatusFailure,
  ErrorLogDownload,
  ErrorLogDownloadSuccess,
  ErrorLogDownloadFailure,
  GVStatusUpdateActionTypes
} from './gv-status-update.actions';
import { GVStatusUpdateState } from './gv-status-update.state';
import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { GVStatusUpdateFacade } from './gv-status-update.facade';
import { gvStatusUpdateAdapter } from './gv-status-update.entity';
import * as moment from 'moment';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
const formData: FormData = new FormData();
const uploadResponse: UploadResponse = {
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

const configListingPayload: ConfigListingPayload = {
  pageIndex: 0,
  pageSize: 10
};
const sortField: SortItem = {
  colId: '',
  sort: 'Desc'
};

const gvStatusListingPayload: GVStatusListingPayload = {
  length: 0,
  pageIndex: 0,
  pageSize: 10,
  serialNo: '123',
  status: 'CLOSED'
};
const gvStatusList: GvStatusList = {
  activationDate: 12,
  denomination: 1,
  excludes: [],
  extendCount: 1,
  giftCode: '',
  giftDetails: {
    customerName: '',
    customerType: '',
    discount: '',
    discountPercentage: '',
    issuedTo: ''
  },
  indentNo: 1,
  locationCode: 123,
  mfgDate: 1,
  newlyAdded: true,
  quantity: 1,
  regionCode: '',
  remarks: '',
  serialNo: 1,
  status: '',
  totalValue: 12,
  validFrom: moment(),
  validTill: moment(),
  validityDays: 1
};
const gvStatusUpdateList: GVStatusUpdateList = {
  count: 1,
  gvStatusList: [gvStatusList]
};

const gvExtendValidity: GVExtendValidity = {
  giftValidity: [{ serialNo: 2, validTill: '' }],
  remarks: ''
};

const gvStatusChange: GVStatusChange = {
  giftVoucherStatus: [{ serialNo: 2, status: '' }],
  remarks: ''
};

describe('Gv Status Update facade Testing Suite action', () => {
  const initialState: GVStatusUpdateState = {
    fileUploadResponse: null,
    updatedList: null,
    newList: null,
    gvStatusUpdateList: gvStatusUpdateAdapter.getInitialState(),
    hasError: null,
    isLoading: false,
    totalCount: 0,
    errorLog: null
  };

  let unipayConfigurationFacade: GVStatusUpdateFacade;

  //let store: MockStore<GVStatusUpdateState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), GVStatusUpdateFacade]
    });

    unipayConfigurationFacade = TestBed.inject(GVStatusUpdateFacade);
  });

  describe('Dispatch Unipay acess mapping action', () => {
    it('should call loadFileUpload action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new FileUpload(formData, '');
      unipayConfigurationFacade.loadFileUpload(formData, '');
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadGVStatusList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new GetGVStatusList(gvStatusListingPayload, sortField);
      unipayConfigurationFacade.loadGVStatusList(
        gvStatusListingPayload,
        sortField
      );
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call validityExtend action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ExtendGVStatus(gvExtendValidity);
      unipayConfigurationFacade.validityExtend(gvExtendValidity);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call changeStatus action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ChangeGVStatus(gvStatusChange);
      unipayConfigurationFacade.changeStatus(gvStatusChange);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call loadErrorLog action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ErrorLogDownload('test1', 'test2');
      unipayConfigurationFacade.loadErrorLog('test1', 'test2');
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

    it('should get getNewList data', () => {
      expect(unipayConfigurationFacade.getNewList()).toBeTruthy();
    });

    it('should get GetGVStatusList data', () => {
      expect(unipayConfigurationFacade.GetGVStatusList()).toBeTruthy();
    });
  });
});
