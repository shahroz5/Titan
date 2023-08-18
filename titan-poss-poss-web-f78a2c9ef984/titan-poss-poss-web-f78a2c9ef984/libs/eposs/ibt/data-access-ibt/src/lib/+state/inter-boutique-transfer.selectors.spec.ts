import {
  BoutiqueList,
  HistoryFilterData,
  IBThistoryHeaderPayload,
  InterBoutiqueTransferRequestTypesEnum,
  ItemList,
  ItemSummary,
  RequestList
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  boutiqueListAdapter,
  IBTHistoryAdaptor,
  itemListAdapter,
  requestListAdapter
} from './inter-boutique-transfer.entity';
import { initialState } from './inter-boutique-transfer.reducer';
// you will need to assert that the store is calling the right selector function.
import * as selectors from './inter-boutique-transfer.selectors';
import { InterBoutiqueTransferState } from './inter-boutique-transfer.state';

describe('IBT related Selectors', () => {
  const requestListResponse: RequestList = {
    createdDate: moment(1616078003356),
    destLocationCode: 'CPD',
    id: 69,
    reqDocDate: moment(1615919400000),
    reqDocNo: 20,
    requestRemarks: 'send',
    requestType: 'BTQ',
    srcLocationCode: 'PTU',
    status: 'REQUESTED',
    totalRequestedQuantity: 1,
    totalElements: 1,
    acceptedQuantity: null,
    approvedQuantity: null
  };

  const requestListCountResponse: number = 10;

  const boutiqueListResponse: BoutiqueList[] = [
    {
      address: null,
      contactNo: null,
      description: 'Pune - JM Road',
      locationCode: 'TPN',
      phoneNo: null
    }
  ];

  const boutiqueListCountResponse: number = 20;

  const createRequestResponse: RequestList = {
    createdDate: moment(1625625540904),
    destLocationCode: 'CPD',
    id: 138,
    reqDocDate: moment(1625509800000),
    reqDocNo: 17,
    requestRemarks: 'send',
    requestType: 'BTQ',
    srcLocationCode: 'VSH',
    status: 'REQUESTED',
    acceptedQuantity: null,
    approvedQuantity: null,
    totalRequestedQuantity: 1,
    totalElements: 1
  };

  const itemListRes: ItemList = {
    acceptedQuantity: null,
    approvedQuantity: null,
    availableQuantity: 1,
    binCode: '.STN',
    binGroupCode: 'STN',
    currencyCode: 'INR',
    id: '2946A1EC-5790-4451-B7D5-FD62E1253CC8',
    imageURL: '/productcatalogue/ProductImages/30182SH.jpg',
    inventoryId: '900E385A-6D71-4E7F-B5DD-E6B3C400D086',
    itemCode: '5130182SHABA00',
    itemDetails: { type: 'ITEM_DETAILS', data: { stoneValue: 0 } },
    lotNumber: '2EA000117',
    mfgDate: moment(1625596200000),
    productCategory: '2',
    productCategoryDesc: 'SetProduct2',
    productGroup: '71',
    productGroupDesc: 'Gold Plain',
    requestedQuantity: 1,
    requestedWeight: 29.975,
    status: 'REQUESTED',
    stdValue: 107885,
    stdWeight: 29.975,
    totalAcceptedQuantity: null,
    weightUnit: 'gms',
    isStudded: false
  };

  const searchItemResponse: ItemSummary = {
    itemCode: '5',
    productCategoryCode: 'UD',
    productCategoryDesc: 'RUDRAKSHA',
    productGroupCode: '74',
    productGroupDesc: 'Diamonds',
    stdValue: 511
  };

  const IBThistoryHeaderPayloadRes: IBThistoryHeaderPayload = {
    carrierDetails: {},
    currencyCode: 'INR',
    destDocDate: moment(1624386600000),
    destDocNo: null,
    destLocationCode: 'CPD',
    destLocationDescription: 'Delhi - CPD @CC',
    id: '125',
    orderType: null,
    otherDetails: {},
    remarks: 'cancel',
    reqDocDate: moment(1624386600000),
    reqDocNo: 16,
    reqLocationCode: 'CPD',
    requestType: 'BTQ',
    srcDocDate: moment(1624386600000),
    srcFiscalYear: 2021,
    srcLocationCode: 'VSH',
    srcLocationDescription: 'Vashi 2 - LFS',
    status: 'CANCELLED',
    totalAvailableQuantity: null,
    totalAvailableValue: null,
    totalAvailableWeight: null,
    totalMeasuredQuantity: 1,
    totalMeasuredValue: 11594,
    totalMeasuredWeight: 0.88,
    weightUnit: 'gms',
    dateType: 'REQUESTDATE'
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

  const requestListEntity = requestListAdapter.setAll([requestListResponse], {
    ...requestListAdapter.getInitialState()
  });

  const boutiqueListEntity = boutiqueListAdapter.setAll(boutiqueListResponse, {
    ...boutiqueListAdapter.getInitialState()
  });

  const itemListEntity = itemListAdapter.setAll([itemListRes], {
    ...itemListAdapter.getInitialState()
  });

  const historyEntity = IBTHistoryAdaptor.setAll([IBThistoryHeaderPayloadRes], {
    ...IBTHistoryAdaptor.getInitialState()
  });

  it('Should return requestSentList Entity', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      requestSentList: requestListEntity
    };
    expect(selectors.requestSentList.projector(state)).toEqual(
      requestListEntity
    );
  });

  it('Should return requestSentList', () => {
    expect(
      selectors.interBoutiqueTransferSelectors.selectRequestSentList.projector(
        requestListEntity
      )
    ).toEqual([requestListResponse]);
  });

  it('Should return requestSentListCount ', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      requestSentListCount: requestListCountResponse
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectRequestSentListCount.projector(
        state
      )
    ).toEqual(requestListCountResponse);
  });

  it('Should return requestReceivedList Entity', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      requestReceivedList: requestListEntity
    };
    expect(selectors.requestReceivedList.projector(state)).toEqual(
      requestListEntity
    );
  });

  it('Should return requestReceivedList', () => {
    expect(
      selectors.interBoutiqueTransferSelectors.selectRequestReceivedList.projector(
        requestListEntity
      )
    ).toEqual([requestListResponse]);
  });

  it('Should return requestReceivedListCount ', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      requestReceivedListCount: requestListCountResponse
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectRequestReceivedListCount.projector(
        state
      )
    ).toEqual(requestListCountResponse);
  });

  it('Should return boutiqueList Entity', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      boutiqueList: boutiqueListEntity
    };
    expect(selectors.boutiqueList.projector(state)).toEqual(boutiqueListEntity);
  });

  it('Should return boutiqueList', () => {
    expect(
      selectors.interBoutiqueTransferSelectors.selectBoutiqueList.projector(
        boutiqueListEntity
      )
    ).toEqual(boutiqueListResponse);
  });

  it('Should return boutiqueListCount', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      boutiqueListCount: boutiqueListCountResponse
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectBoutiqueListCount.projector(
        state
      )
    ).toEqual(boutiqueListCountResponse);
  });

  it('Should return createRequestResponse', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      createRequestResponse: createRequestResponse
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectCreateRequestResponse.projector(
        state
      )
    ).toEqual(createRequestResponse);
  });

  it('Should return selectRequest', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      request: createRequestResponse
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectRequest.projector(state)
    ).toEqual(createRequestResponse);
  });

  it('Should return itemList Entity', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      itemList: itemListEntity
    };
    expect(selectors.itemList.projector(state)).toEqual(itemListEntity);
  });

  it('Should return itemList', () => {
    expect(
      selectors.interBoutiqueTransferSelectors.selectItemList.projector(
        itemListEntity
      )
    ).toEqual([itemListRes]);
  });

  it('Should return updateItemListResponse', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      updateItemListResponse: itemListRes
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectUpdateItemListResponse.projector(
        state
      )
    ).toEqual(itemListRes);
  });

  it('Should return updateItemListStatusResponse', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      updateItemListStatusResponse: requestListResponse
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectUpdateItemListStatusResponse.projector(
        state
      )
    ).toEqual(requestListResponse);
  });

  it('Should return searchItemResponse', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      searchItemResponse: {
        searchResult: searchItemResponse,
        isSearchSuccess: true
      }
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectSearchItemResponse.projector(
        state
      )
    ).toEqual({
      searchResult: searchItemResponse,
      isSearchSuccess: true
    });
  });

  it('Should return IBThistory Entity', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      IBThistory: historyEntity
    };
    expect(selectors.IBThistory.projector(state)).toEqual(historyEntity);
  });

  it('Should return IBThistory', () => {
    expect(
      selectors.interBoutiqueTransferSelectors.selectIBTHistory.projector(
        historyEntity
      )
    ).toEqual([IBThistoryHeaderPayloadRes]);
  });

  it('Should return isLoadingHistory', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      isLoadingHistory: true
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectIsLoadingIBTHistory.projector(
        state
      )
    ).toEqual(true);
  });

  it('Should return advancedFilter', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      advancedFilter: historyFilterData
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectHistoryFilterData.projector(
        state
      )
    ).toEqual(historyFilterData);
  });

  it('Should return ibtHistoryCount', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      ibtHistoryCount: 11
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectIBTHistoryCount.projector(
        state
      )
    ).toEqual(11);
  });

  it('Should return selectedHistory', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      selectedHistory: IBThistoryHeaderPayloadRes
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectSelectedHistory.projector(
        state
      )
    ).toEqual(IBThistoryHeaderPayloadRes);
  });

  it('Should return isLoadingSelectedHistory', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      isLoadingSelectedHistory: true
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectIsLoadingSelectedHistory.projector(
        state
      )
    ).toEqual(true);
  });

  it('Should return hasSelectedHistory', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      hasSelectedHistory: true
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectHasSelectedHistory.projector(
        state
      )
    ).toEqual(true);
  });

  it('Should return historyType', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      historyType: interBoutiqueTransferRequestTypesEnumReq
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectRadioHistoryType.projector(
        state
      )
    ).toEqual(interBoutiqueTransferRequestTypesEnumReq);
  });

  it('Should return advancedFilter', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      advancedFilter: historyFilterData
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectAdvancedFilterData.projector(
        state
      )
    ).toEqual(historyFilterData);
  });

  it('Should return  isLoading status ', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      isLoading: false
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectIsLoading.projector(state)
    ).toEqual(false);
  });

  it('Should return  error ', () => {
    const state: InterBoutiqueTransferState = {
      ...initialState,
      hasError: null
    };
    expect(
      selectors.interBoutiqueTransferSelectors.selectHasError.projector(state)
    ).toEqual(null);
  });
});
