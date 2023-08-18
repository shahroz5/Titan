import { initialState } from './inter-boutique-transfer.reducer';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { InterBoutiqueTransferFacade } from './inter-boutique-transfer.facade';
import { provideMockStore } from '@ngrx/store/testing';
import { InterBoutiqueTransferState } from './inter-boutique-transfer.state';
import {
  ClearBoutiqueList,
  ClearItemList,
  ClearRequestReceivedList,
  ClearRequestSentList,
  ClearSearchItemResponse,
  CreateRequest,
  LoadBoutiqueList,
  LoadBoutiqueListCount,
  LoadHistoryFilterData,
  LoadHistoryItems,
  LoadIBTHistory,
  LoadItemList,
  LoadRequest,
  LoadRequestReceivedList,
  LoadRequestReceivedListCount,
  LoadRequestSentList,
  LoadRequestSentListCount,
  LoadSelectedHistory,
  LoadStuddedProductGroups,
  RadioHistoryType,
  ResetBoutiqueListCount,
  ResetHstoryFilter,
  ResetLoadedHistory,
  ResetRequestList,
  SearchItem,
  UpdateItemList,
  UpdateItemListStatus
} from './inter-boutique-transfer.actions';
import {
  LoadBoutiqueListPayload,
  LoadRequestListCountPayload,
  LoadRequestListPayload,
  Request,
  LoadRequestPayload,
  LoadItemListPayload,
  UpdateItemListPayload,
  UpdateItemListStatusPayload,
  LoadIBTHistoryPayload,
  LoadSelectedHistoryHeaderInfoPayload,
  LoadIBTHistoryItemsPayload,
  HistoryFilterData,
  InterBoutiqueTransferRequestTypesEnum
} from '@poss-web/shared/models';

describe('IBT facade Testing Suite action', () => {
  let interBoutiqueTransferFacade: InterBoutiqueTransferFacade;

  let store: Store<InterBoutiqueTransferState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        InterBoutiqueTransferFacade
      ]
    });

    interBoutiqueTransferFacade = TestBed.inject(InterBoutiqueTransferFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions', () => {
    const loadRequestListPayload: LoadRequestListPayload = {
      requestGroup: 'SENT',
      searchValue: 12,
      pageIndex: 0,
      pageSize: 8
    };

    const loadRequestListCountPayload: LoadRequestListCountPayload = {
      requestGroup: 'SENT',
      searchValue: 12
    };

    const loadBoutiqueListPayload: LoadBoutiqueListPayload = {
      item: [{ itemCode: '5130182SHABA00', quantity: 1 }],
      regionType: 'TOWN'
    };

    const createRequestPayload: Request = {
      items: [{ itemCode: '5130182SHABA00', quantity: 1 }],
      remarks: 'send',
      srcLocationCode: 'VSH'
    };

    const loadRequestPayload: LoadRequestPayload = {
      id: 138,
      requestGroup: 'SENT'
    };

    const loadItemListPayload: LoadItemListPayload = {
      id: 138,
      requestGroup: 'SENT'
    };

    const updateItemListPayload: UpdateItemListPayload = {
      id: 92,
      itemId: 'A5D6041E-365C-409A-A614-EB022C5E44C0',
      requestGroup: 'SENT',
      data: {
        quantity: 1,
        status: 'ACCEPTED'
      }
    };

    const updateItemListStatusPayload: UpdateItemListStatusPayload = {
      type: 'ACCEPTED',
      id: 92,
      requestGroup: 'SENT',
      itemIds: ['A5D6041E-365C-409A-A614-EB022C5E44C0'],
      remarks: 'string'
    };

    const searchItemRequest: string = '504117VDCS1A09';

    const loadIBTHistoryPayload: LoadIBTHistoryPayload = {
      historyData: {
        actionType: 'RECEIVE',
        dateRangeType: 'CUSTOM',
        statuses: [],
        dateType: 'REQUESTDATE'
      },
      page: 0,
      size: 0,
      requestType: 'BTQ'
    };

    const loadSelectedHistoryHeaderInfoPayload: LoadSelectedHistoryHeaderInfoPayload = {
      id: 125,
      actionType: 'RECEIVE'
    };

    const loadIBTHistoryItemsPayload: LoadIBTHistoryItemsPayload = {
      historyItemsData: {
        binCodes: [null],
        binGroupCode: null,
        itemCode: null,
        lotNumber: null,
        productCategories: [null],
        productGroups: [null]
      },
      requestType: 'BTQ',
      actionType: 'RECEIVE',
      page: 0,
      size: 0
    };

    const historyFilterData: HistoryFilterData = {
      endDate: 1625682599999,
      locationCode: null,
      reqFiscalYear: 2021,
      startDate: 1617215400000,
      statuses: ['ISSUED'],
      dateType: 'REQUESTDATE'
    };

    let interBoutiqueTransferRequestTypesEnumReq: InterBoutiqueTransferRequestTypesEnum;

    it('should call LoadRequestSentList action', () => {
      const action = new LoadRequestSentList(loadRequestListPayload);
      interBoutiqueTransferFacade.loadRequestSentList(loadRequestListPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadRequestReceivedList action', () => {
      const action = new LoadRequestReceivedList(loadRequestListPayload);
      interBoutiqueTransferFacade.loadRequestReceivedList(
        loadRequestListPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadRequestSentListCount action', () => {
      const action = new LoadRequestSentListCount(loadRequestListCountPayload);
      interBoutiqueTransferFacade.loadRequestSentListCount(
        loadRequestListCountPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadRequestReceivedListCount action', () => {
      const action = new LoadRequestReceivedListCount(
        loadRequestListCountPayload
      );
      interBoutiqueTransferFacade.loadRequestReceivedListCount(
        loadRequestListCountPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadBoutiqueList action', () => {
      const action = new LoadBoutiqueList(loadBoutiqueListPayload);
      interBoutiqueTransferFacade.loadBoutiqueList(loadBoutiqueListPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadBoutiqueListCount action', () => {
      const action = new LoadBoutiqueListCount(loadBoutiqueListPayload);
      interBoutiqueTransferFacade.loadBoutiqueListCount(
        loadBoutiqueListPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CreateRequest action', () => {
      const action = new CreateRequest(createRequestPayload);
      interBoutiqueTransferFacade.createRequest(createRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadRequest action', () => {
      const action = new LoadRequest(loadRequestPayload);
      interBoutiqueTransferFacade.loadRequest(loadRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadItemList action', () => {
      const action = new LoadItemList(loadItemListPayload);
      interBoutiqueTransferFacade.loadItemList(loadItemListPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UpdateItemList action', () => {
      const action = new UpdateItemList(updateItemListPayload);
      interBoutiqueTransferFacade.updateItemList(updateItemListPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UpdateItemListStatus action', () => {
      const action = new UpdateItemListStatus(updateItemListStatusPayload);
      interBoutiqueTransferFacade.updateItemListStatus(
        updateItemListStatusPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SearchItem action', () => {
      const action = new SearchItem(searchItemRequest);
      interBoutiqueTransferFacade.loadSearchItem(searchItemRequest);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadStuddedProductGroups action', () => {
      const action = new LoadStuddedProductGroups();
      interBoutiqueTransferFacade.loadStuddedProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadIBTHistory action', () => {
      const action = new LoadIBTHistory(loadIBTHistoryPayload);
      interBoutiqueTransferFacade.loadIBTHistory(loadIBTHistoryPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadSelectedHistory action', () => {
      const action = new LoadSelectedHistory(
        loadSelectedHistoryHeaderInfoPayload
      );
      interBoutiqueTransferFacade.loadSelectedHistory(
        loadSelectedHistoryHeaderInfoPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadHistoryItems action', () => {
      const action = new LoadHistoryItems(loadIBTHistoryItemsPayload);
      interBoutiqueTransferFacade.loadHistoryItems(loadIBTHistoryItemsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadHistoryFilterData action', () => {
      const action = new LoadHistoryFilterData(historyFilterData);
      interBoutiqueTransferFacade.loadHistoryFilterData(historyFilterData);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call RadioHistoryType action', () => {
      const action = new RadioHistoryType(
        interBoutiqueTransferRequestTypesEnumReq
      );
      interBoutiqueTransferFacade.loadRadioHistoryType(
        interBoutiqueTransferRequestTypesEnumReq
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetHstoryFilter action', () => {
      const payload = 345700000;
      const action = new ResetHstoryFilter(payload);
      interBoutiqueTransferFacade.resetAdvanceFilter(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetLoadedHistory action', () => {
      const action = new ResetLoadedHistory();
      interBoutiqueTransferFacade.resetLoadedHistory();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetRequestList action', () => {
      const action = new ResetRequestList();
      interBoutiqueTransferFacade.resetRequestList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ClearSearchItemResponse action', () => {
      const action = new ClearSearchItemResponse();
      interBoutiqueTransferFacade.clearSearchItemResponse();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ClearBoutiqueList action', () => {
      const action = new ClearBoutiqueList();
      interBoutiqueTransferFacade.clearBoutiqueList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ClearItemList action', () => {
      const action = new ClearItemList();
      interBoutiqueTransferFacade.clearItemList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ClearRequestReceivedList action', () => {
      const action = new ClearRequestReceivedList();
      interBoutiqueTransferFacade.clearRequestReceivedList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ClearRequestSentList action', () => {
      const action = new ClearRequestSentList();
      interBoutiqueTransferFacade.clearRequestSentList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ResetBoutiqueListCount action', () => {
      const action = new ResetBoutiqueListCount();
      interBoutiqueTransferFacade.resetBoutiqueListCount();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector', () => {
    it('should access selectHasError selector', () => {
      expect(interBoutiqueTransferFacade.getHasError()).toEqual(
        interBoutiqueTransferFacade['hasError$']
      );
    });

    it('should access selectIsLoading selector', () => {
      expect(interBoutiqueTransferFacade.getIsLoading()).toEqual(
        interBoutiqueTransferFacade['isLoading$']
      );
    });

    it('should access selectRequestSentListCount selector', () => {
      expect(interBoutiqueTransferFacade.getRequestSentListCount()).toEqual(
        interBoutiqueTransferFacade['requestSentListCount$']
      );
    });

    it('should access selectRequestReceivedListCount selector', () => {
      expect(interBoutiqueTransferFacade.getRequestReceivedListCount()).toEqual(
        interBoutiqueTransferFacade['requestReceivedListCount$']
      );
    });

    it('should access selectRequestSentList selector', () => {
      expect(interBoutiqueTransferFacade.getRequestSentList()).toEqual(
        interBoutiqueTransferFacade['requestSentList$']
      );
    });

    it('should access selectRequestReceivedList selector', () => {
      expect(interBoutiqueTransferFacade.getRequestReceivedList()).toEqual(
        interBoutiqueTransferFacade['requestReceivedList$']
      );
    });

    it('should access selectBoutiqueList selector', () => {
      expect(interBoutiqueTransferFacade.getBoutiqueList()).toEqual(
        interBoutiqueTransferFacade['boutiqueList$']
      );
    });

    it('should access selectBoutiqueListCount selector', () => {
      expect(interBoutiqueTransferFacade.getBoutiqueListCount()).toEqual(
        interBoutiqueTransferFacade['boutiqueListCount$']
      );
    });

    it('should access selectRequest selector', () => {
      expect(interBoutiqueTransferFacade.getRequest()).toEqual(
        interBoutiqueTransferFacade['request$']
      );
    });

    it('should access selectItemList selector', () => {
      expect(interBoutiqueTransferFacade.getItemList()).toEqual(
        interBoutiqueTransferFacade['itemList$']
      );
    });

    it('should access selectSearchItemResponse selector', () => {
      expect(interBoutiqueTransferFacade.getSearchItemResponse()).toEqual(
        interBoutiqueTransferFacade['searchItemResponse$']
      );
    });

    it('should access selectIBTHistory selector', () => {
      expect(interBoutiqueTransferFacade.getIBTHistory()).toEqual(
        interBoutiqueTransferFacade['ibtHistory$']
      );
    });

    it('should access selectIsLoadingIBTHistory selector', () => {
      expect(interBoutiqueTransferFacade.getHistoryFilterData()).toEqual(
        interBoutiqueTransferFacade['historyFilterData$']
      );
    });

    it('should access selectRadioHistoryType selector', () => {
      expect(interBoutiqueTransferFacade.getRadioHistoryType()).toEqual(
        interBoutiqueTransferFacade['radioHistoryType$']
      );
    });

    it('should access selectIsLoadingIBTHistory selector', () => {
      expect(interBoutiqueTransferFacade.getIsIBTHistoryLoading()).toEqual(
        interBoutiqueTransferFacade['isLoadingHistory$']
      );
    });

    it('should access selectIBTHistoryCount selector', () => {
      expect(interBoutiqueTransferFacade.getIBTHistoryCount()).toEqual(
        interBoutiqueTransferFacade['ibtHistoryCount$']
      );
    });

    it('should access selectSelectedHistory selector', () => {
      expect(interBoutiqueTransferFacade.getSelectedHistory()).toEqual(
        interBoutiqueTransferFacade['selectedHistory$']
      );
    });

    it('should access selectIsLoadingSelectedHistory selector', () => {
      expect(interBoutiqueTransferFacade.getIsLoadingSelectedHistory()).toEqual(
        interBoutiqueTransferFacade['isLoadingSelectedHistory$']
      );
    });

    it('should access selectHasSelectedHistory selector', () => {
      expect(interBoutiqueTransferFacade.getHasSelectedHistory()).toEqual(
        interBoutiqueTransferFacade['hasSelectedHistory$']
      );
    });

    it('should access selectAdvancedFilterData selector', () => {
      expect(interBoutiqueTransferFacade.getAdvancedFilter()).toEqual(
        interBoutiqueTransferFacade['advancedFilter$']
      );
    });

    it('should access selectUpdateItemListResponse selector', () => {
      expect(interBoutiqueTransferFacade.updateItemListResponse()).toEqual(
        interBoutiqueTransferFacade['updateItemListResponse$']
      );
    });

    it('should access selectUpdateItemListStatusResponse selector', () => {
      expect(
        interBoutiqueTransferFacade.updateSelectedRequestProductListStatusResponse()
      ).toEqual(interBoutiqueTransferFacade['updateItemListStatusResponse$']);
    });

    it('should access selectCreateRequestResponse selector', () => {
      expect(interBoutiqueTransferFacade.getCreateRequestResponse()).toEqual(
        interBoutiqueTransferFacade['createRequestResponse$']
      );
    });
  });
});
