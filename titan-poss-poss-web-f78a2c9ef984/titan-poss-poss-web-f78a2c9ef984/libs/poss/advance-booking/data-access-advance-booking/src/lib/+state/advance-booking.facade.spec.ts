import {
  ClearSearchList,
  CreateCashMemo,
  DeleteCashMemo,
  FreezeAdvanceBooking,

  LoadRequests,
  LoadSelectedData,
  LoadSelectedLotNumberDetails,
  PartialUpdateCashMemo,
  ResetLotNumberValues,
  ResetProductValues,
  ResetValues,
  SearchAB,
  SetDropownValues,
  SetOrderNumber,
  SetSearchValues,
  UpdateCashMemo,
  UpdatePriceDetails,
  ViewCashMemo
} from './advance-booking.actions';
import { AdvanceBookingState } from './advance-booking.state';
import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { AdvanceBookingFacade } from './advance-booking.facade';
import {
  ABAdapter,
  ABRequestStatusListAdapter,


} from './advance-booking.entity';
import * as moment from 'moment';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  ABRequestStatusDownValues,
  ABSearchValues,
  AdvanceBookingDetailsRequestPayload,
  AdvanceBookingSearchPayload,
  CashMemoItemDetailsRequestPayload,
  RequestPayload
} from '@poss-web/shared/models';
import { ErrorEnums } from '@poss-web/shared/util-error';

const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
  id: '',
  subTxnType: '',
  txnType: ''
};

const requestPayload: RequestPayload = {
  httpMethod: '',
  relativeUrl: '',
  reqBody: {},
  requestParams: { approvalStatus: '', workflowType: '' }
};

const advanceBookingSearchPayload: AdvanceBookingSearchPayload = {
  docNo: 0,
  page: 0,
  size: 8,
  subTxnType: '',
  txnType: '',
  fiscalYear: 2015
};

const advanceBookingDetailsRequestPayload: AdvanceBookingDetailsRequestPayload = {
  subTxnType: '',
  txnType: '',
  actionType: ''
};

const aBRequestStatusDownValues: ABRequestStatusDownValues = {
  status: '',
  type: ''
};

const aBSearchValues: ABSearchValues = {
  doNo: 0,
  fiscalYear: 2016,
  function: '',
  phNo: 810539193
};
describe('Advance Booking facade Testing Suite action', () => {
  let advanceBookingFacade: AdvanceBookingFacade;

  //let store: MockStore<UnipayConfigurationState>;
  const initialState: AdvanceBookingState = {
    hasError: null,
    requestStausDropDownValues: {
      status: 'APPROVED',
      type: 'CANCEL_ADVANCE_BOOKING'
    },
    frozenABOrderAmount:0,
    isLoading: false,
    searchProductList: [],
    downloadFileUrl:null,
    frozenABOrder:null,
    uploadFileListResponse:null,
    uploadFileResponse:null,
    searchProductListCount: -1,
    //productDetails: productDetailsAdapter.getInitialState(),

    //allProductDetails: productDetailsAdapter.getInitialState(),
    ABRequestStatusList: ABRequestStatusListAdapter.getInitialState(),
    ABRequestStatusListCount: 0,
    productDetailsCount: -1,
    orderNumber: {order:1,status:''},

    RSODetails: [],
    validateProductAndPriceDetails: null,
    searhABResponse: ABAdapter.getInitialState(),
    taxDetails: null,
    createCashMemoResponse: null,
    viewCashMemoResponse: null,
    partialUpdateCashMemoResponse: null,
    updateCashMemoResponse: null,
    deleteCashMemoResponse: false,
    deleteItemFromCashMemoResponse: null,
    selectedData: null,
    searchValues: { function: null, doNo: null, fiscalYear: null, phNo: null },
   //itemDetails: itemDetailsAdapter.getInitialState(),
    selectedLotNumber: null,
    freezeAdvanceBookingResponse: null,
    minABvalue: 0,
    searhABResponseCount: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), AdvanceBookingFacade]
    });

    advanceBookingFacade = TestBed.inject(AdvanceBookingFacade);
  });

  describe('Dispatch AdvanceBooking action', () => {
    // it('should call getItemFromCashMemo action', inject([Store], store => {
    //   const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    //   const action = new GetItemfromCashMemo(cashMemoItemDetailsRequestPayload);
    //   advanceBookingFacade.getItemFromCashMemo(
    //     cashMemoItemDetailsRequestPayload
    //   );
    //   expect(storeSpy).toHaveBeenCalledWith(action);
    // }));

    it('should call resetProductValues action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ResetProductValues();
      advanceBookingFacade.resetProductValues();

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call resetLotNumberValues action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ResetLotNumberValues();
      advanceBookingFacade.resetLotNumberValues();

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call resetValues action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ResetValues();
      advanceBookingFacade.resetValues();

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadRequests action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new LoadRequests(requestPayload);
      advanceBookingFacade.loadRequests(requestPayload);

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    // it('should call setOrderNumber action', inject([Store], store => {
    //   const storeSpy = spyOn(store, 'dispatch').and.callThrough();

    //   const action = new SetOrderNumber({});
    //   advanceBookingFacade.setOrderNumber(0);

    //   expect(storeSpy).toHaveBeenCalledWith(action);
    // }));

    it('should call loadLotNumber action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new LoadSelectedLotNumberDetails('');
      advanceBookingFacade.loadLotNumber('');

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call searchAB action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new SearchAB(advanceBookingSearchPayload);
      advanceBookingFacade.searchAB(advanceBookingSearchPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call updatePriceDetails action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new UpdatePriceDetails(
        advanceBookingDetailsRequestPayload
      );
      advanceBookingFacade.updatePriceDetails(
        advanceBookingDetailsRequestPayload
      );
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call deleteCashMemo action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new DeleteCashMemo(advanceBookingDetailsRequestPayload);
      advanceBookingFacade.deleteCashMemo(advanceBookingDetailsRequestPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call updateCashMemo action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new UpdateCashMemo(advanceBookingDetailsRequestPayload);
      advanceBookingFacade.updateCashMemo(advanceBookingDetailsRequestPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call freezeAdvanceBooking action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new FreezeAdvanceBooking(
        advanceBookingDetailsRequestPayload
      );
      advanceBookingFacade.freezeAdvanceBooking(
        advanceBookingDetailsRequestPayload
      );
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call partialUpdateCashMemo action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new PartialUpdateCashMemo(
        advanceBookingDetailsRequestPayload
      );
      advanceBookingFacade.partialUpdateCashMemo(
        advanceBookingDetailsRequestPayload
      );
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call setDropDownValue action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new SetDropownValues(aBRequestStatusDownValues);
      advanceBookingFacade.setDropDownValue(aBRequestStatusDownValues);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call setSearchValue action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new SetSearchValues(aBSearchValues);
      advanceBookingFacade.setSearchValue(aBSearchValues);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call clearSearchList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ClearSearchList();
      advanceBookingFacade.clearSearchList();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadSelectedData action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new LoadSelectedData(aBRequestStatusDownValues);
      advanceBookingFacade.loadSelectedData(aBRequestStatusDownValues);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call viewCashMemo action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ViewCashMemo(advanceBookingDetailsRequestPayload);
      advanceBookingFacade.viewCashMemo(advanceBookingDetailsRequestPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call createCashMemo action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new CreateCashMemo(advanceBookingDetailsRequestPayload);
      advanceBookingFacade.createCashMemo(advanceBookingDetailsRequestPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
  });

  describe('Advance Booking action', () => {
    it('should get getSelectedData data', () => {
      expect(advanceBookingFacade.getSelectedData()).toBeTruthy();
    });
    it('should get getSearchValues data', () => {
      expect(advanceBookingFacade.getSearchValues()).toBeTruthy();
    });

    it('should get getIsLoading data', () => {
      expect(advanceBookingFacade.getIsLoading()).toBeTruthy();
    });

    it('should get getDropdownValue data', () => {
      expect(advanceBookingFacade.getDropdownValue()).toBeTruthy();
    });

    it('should get getSelectedRequests data', () => {
      expect(advanceBookingFacade.getSelectedRequests()).toBeTruthy();
    });

    it('should get getHasError data', () => {
      expect(advanceBookingFacade.getHasError()).toBeTruthy();
    });

    it('should get getPartailUpdateCashMemoResponse data', () => {
      expect(
        advanceBookingFacade.getPartailUpdateCashMemoResponse()
      ).toBeTruthy();
    });

    it('should get getRSODetails data', () => {
      expect(advanceBookingFacade.getRSODetails()).toBeTruthy();
    });
    it('should get getMinABValue data', () => {
      expect(advanceBookingFacade.getMinABValue()).toBeTruthy();
    });

    it('should get getRequestCount data', () => {
      expect(advanceBookingFacade.getRequestCount()).toBeTruthy();
    });

    it('should get getSearchABCount data', () => {
      expect(advanceBookingFacade.getSearchABCount()).toBeTruthy();
    });



    it('should get getCreateCashMemoResponse data', () => {
      expect(advanceBookingFacade.getCreateCashMemoResponse()).toBeTruthy();
    });

    it('should get getViewCashMemoResponse data', () => {
      expect(advanceBookingFacade.getViewCashMemoResponse()).toBeTruthy();
    });

    it('should get getOrderNumber data', () => {
      expect(advanceBookingFacade.getOrderNumber()).toBeTruthy();
    });
    it('should get getSearchABResponse data', () => {
      expect(advanceBookingFacade.getSearchABResponse()).toBeTruthy();
    });

    it('should get getFreezeRateResponse data', () => {
      expect(advanceBookingFacade.getFreezeRateResponse()).toBeTruthy();
    });

    it('should get getUpdateCashMemoResponse data', () => {
      expect(advanceBookingFacade.getUpdateCashMemoResponse()).toBeTruthy();
    });



  });
});
