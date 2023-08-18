import {
  BinCode,
  ConversionHistoryAdvancedFilterPayload,
  ConversionHistoryItems,
  ConversionInventoryItem,
  ConversionItem,
  ConversionRequestItems,
  ConversionRequestResponse,
  ConversionRequests,
  ConversionResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { initialState } from './conversion.reducer';
import { conversionSelectors } from './conversion.selector';
import { ConversionState } from './conversion.state';

const conversionInventoryItem: ConversionInventoryItem = {
  availableQuantity: 1,
  availableValue: 166396,
  availableWeight: 3.905,
  binCode: 'AREPLNISH',
  binGroupCode: 'STN',
  currencyCode: 'INR',
  id: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
  imageURL: '/productcatalogue/ProductImages/1090FGA.jpg',
  itemCode: '501090FGALAP70',
  isLoadingImage: true,
  isLoadingThumbnailImage: false,
  thumbnailImageURL: 'abcdefg',
  itemDetails: {
    type: 'ITEM_DETAILS',
    data: {
      stoneValue: 141200.0,
      hallMarkRemarks1: '',
      hallMarkingCode: '',
      hallMarkingCentreName: '',
      hallMarkRemarks: '',
      hallMarkedDate: null,
      isHallMarking: true
    }
  },
  lotNumber: '3IH005125',
  mfgDate: moment(1636309800000),
  productCategory: 'F',
  productCategoryDesc: 'FINGER RING',
  productGroup: '77',
  productGroupDesc: 'Studded - Solitaire',
  status: null,
  stdValue: 166396,
  stdWeight: 3.905,
  weightUnit: 'gms',
  isStudded: false
};
const conversionItem: ConversionItem = {
  autoApproved: false,
  binCode: 'AREPLNISH',
  childItems: [],
  complexityCode: 'PNA',
  currencyCode: 'INR',
  imageURL: '/productcatalogue/ProductImages/1090FGA.jpg',
  inventoryId: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
  itemCode: '501090FGALAP70',
  isLoadingImage: true,
  isLoadingThumbnailImage: false,
  thumbnailImageURL: 'abcdefg',
  itemDescription: 'FINGER RING/D(100-150)/B(40-49 CENTS)/SI/G-H',
  lotNumber: '3IH005125',
  productCategory: 'F',
  productCategoryDesc: 'FINGER RING',
  productGroup: '77',
  productGroupDesc: 'Studded - Solitaire',
  productType: null,
  stdValue: 166396,
  stdWeight: 3.905,
  stoneValue: null,
  weightUnit: 'gms',
  isStudded: false
};
const conversionResponse: ConversionResponse = {
  currencyCode: 'INR',
  destDocDate: moment(456),
  destDocNo: 12,
  destLocationCode: 'CPD',
  id: 12,
  orderType: 'CM',
  srcDocDate: moment(123),
  srcDocNo: 12,
  srcFiscalYear: 12,
  srcLocationCode: 'CPD',
  status: null,
  totalValue: 166396,
  totalWeight: 3.905,
  weightUnit: 'gms',
  totalQuantity: 1
};
const conversionRequestResponse: ConversionRequestResponse = {
  currencyCode: 'INR',
  destDocDate: moment(456),
  destDocNo: 12,
  destLocationCode: 'CPD',
  id: 12,
  orderType: 'CM',
  reqDocDate: moment(123),
  reqDocNo: 123,
  requestType: 'REQUEST',
  srcDocDate: moment(123),
  srcDocNo: 12,
  srcFiscalYear: 12,
  srcLocationCode: 'CPD',
  status: 'PENDING',
  totalAvailableQuantity: 12,
  totalMeasuredQuantity: 12,
  totalAvailableValue: 12,
  totalMeasuredValue: 12,
  totalAvailableWeight: 12,
  totalMeasuredWeight: 12,
  weightUnit: 'gms'
};
const conversionRequests: ConversionRequests = {
  id: 12,
  srcDocNo: 12,
  status: 'PENDING',
  createdDate: moment(123),
  totalQuantity: 12,
  totalWeight: 12,
  totalValue: 12,
  otherDetails: null,
  approvalRemarks: 'approved'
};
const conversionRequestItems: ConversionRequestItems = {
  binCode: 'AREPLNISH',
  imageURL: '/productcatalogue/ProductImages/1090FGA.jpg',
  inventoryId: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
  itemCode: '501090FGALAP70',
  isLoadingImage: true,
  isLoadingThumbnailImage: false,
  thumbnailImageURL: 'abcdefg',
  itemDetails: {
    complexityCode: '123',
    itemCode: '123',
    itemType: 'AB',
    netWeight: '3.123',
    remarks: 'good',
    sold: 'yes',
    stonePrice: '12345'
  },
  lotNumber: '3IH005125',
  mfgDate: moment(123),
  productCategory: 'F',
  productCategoryDesc: 'FINGER RING',
  productGroup: '77',
  productGroupDesc: 'Studded - Solitaire',
  stdValue: 166396,
  stdWeight: 3.905,
  weightUnit: 'gms',
  isStudded: false
};
const binCode: BinCode = { binCode: 'ONE', description: 'One' };

describe('Conversion Selector Testing Suie', () => {
  it('should return searchedItemsList', () => {
    const state: ConversionState = {
      ...initialState,
      searchedItemsList: [conversionInventoryItem]
    };
    expect(
      conversionSelectors.selectSearchedItemsList.projector(state)
    ).toEqual([conversionInventoryItem]);
  });
  it('should return isSearchingItems', () => {
    const state: ConversionState = {
      ...initialState,
      isSearchingItems: true
    };
    expect(conversionSelectors.selectIsSearchingItems.projector(state)).toEqual(
      true
    );
  });
  it('should return hasSearchedItems', () => {
    const state: ConversionState = {
      ...initialState,
      hasSearchedItems: true
    };
    expect(conversionSelectors.selectHasSearchedItems.projector(state)).toEqual(
      true
    );
  });

  it('should return hasselectedVarient', () => {
    const state: ConversionState = {
      ...initialState,
      hasselectedVarient: true
    };
    expect(
      conversionSelectors.selectHasSelectedVarient.projector(state)
    ).toEqual(true);
  });
  it('should return isLoadingConversionItems', () => {
    const state: ConversionState = {
      ...initialState,
      isLoadingConversionItems: true
    };
    expect(
      conversionSelectors.selectisLoadingConversionItems.projector(state)
    ).toEqual(true);
  });
  it('should return hasConversionItems', () => {
    const state: ConversionState = {
      ...initialState,
      hasConversionItems: true
    };
    expect(
      conversionSelectors.selectHasConversionItems.projector(state)
    ).toEqual(true);
  });
  it('should return conversionItems', () => {
    const state: ConversionState = {
      ...initialState,
      conversionItems: conversionItem
    };
    expect(conversionSelectors.selectConversionItems.projector(state)).toEqual(
      conversionItem
    );
  });
  it('should return ItemSplitResponse', () => {
    const state: ConversionState = {
      ...initialState,
      ItemSplitResponse: conversionResponse
    };
    expect(
      conversionSelectors.selectItemSplitResponse.projector(state)
    ).toEqual(conversionResponse);
  });
  it('should return isSplitting', () => {
    const state: ConversionState = {
      ...initialState,
      isSplitting: true
    };
    expect(conversionSelectors.selectIsSplitting.projector(state)).toEqual(
      true
    );
  });
  it('should return isSplitted', () => {
    const state: ConversionState = {
      ...initialState,
      isSplitted: true
    };
    expect(conversionSelectors.selectIsSplitted.projector(state)).toEqual(true);
  });
  it('should return conversionRequestResponse', () => {
    const state: ConversionState = {
      ...initialState,
      conversionRequestResponse: conversionRequestResponse
    };
    expect(
      conversionSelectors.selectConversionRequestResponse.projector(state)
    ).toEqual(conversionRequestResponse);
  });
  it('should return isSendingRequest', () => {
    const state: ConversionState = {
      ...initialState,
      isSendingRequest: true
    };
    expect(conversionSelectors.selectIsSendingRequest.projector(state)).toEqual(
      true
    );
  });
  it('should return hasRequestResponse', () => {
    const state: ConversionState = {
      ...initialState,
      hasRequestResponse: true
    };
    expect(
      conversionSelectors.selectHasRequestResponse.projector(state)
    ).toEqual(true);
  });
  it('should return conversionRequestsCount', () => {
    const state: ConversionState = {
      ...initialState,
      conversionRequestsCount: 10
    };
    expect(
      conversionSelectors.selectConversionRequestCount.projector(state)
    ).toEqual(10);
  });
  it('should return isLoadingCount', () => {
    const state: ConversionState = {
      ...initialState,
      isLoadingCount: false
    };
    expect(conversionSelectors.selectIsLoadingCount.projector(state)).toEqual(
      false
    );
  });

  it('should return isLoadingRequests', () => {
    const state: ConversionState = {
      ...initialState,
      isLoadingRequests: false
    };
    expect(
      conversionSelectors.selectIsLoadingRequests.projector(state)
    ).toEqual(false);
  });

  it('should return isSearchingRequests', () => {
    const state: ConversionState = {
      ...initialState,
      isSearchingRequests: false
    };
    expect(
      conversionSelectors.selectIsSearchingRequests.projector(state)
    ).toEqual(false);
  });
  it('should return hasSearchedConversionRequests', () => {
    const state: ConversionState = {
      ...initialState,
      hasSearchedConversionRequests: false
    };
    expect(
      conversionSelectors.selectHasSearchedRequests.projector(state)
    ).toEqual(false);
  });
  it('should return isLoadingSelectedRequest', () => {
    const state: ConversionState = {
      ...initialState,
      isLoadingSelectedRequest: false
    };
    expect(
      conversionSelectors.selectIsLoadingSelectedRequest.projector(state)
    ).toEqual(false);
  });
  it('should return selectedRequest', () => {
    const state: ConversionState = {
      ...initialState,
      selectedRequest: conversionRequests
    };
    expect(conversionSelectors.selectSelectedRequest.projector(state)).toEqual(
      conversionRequests
    );
  });
  it('should return isLoadingSelectedRequestData', () => {
    const state: ConversionState = {
      ...initialState,
      isLoadingSelectedRequestData: false
    };
    expect(
      conversionSelectors.selectIsLoadingSelectedRequestData.projector(state)
    ).toEqual(false);
  });
  it('should return selectedRequestData', () => {
    const state: ConversionState = {
      ...initialState,
      selectedRequestData: [conversionRequestItems]
    };
    expect(
      conversionSelectors.selectSelectedRequestData.projector(state)
    ).toEqual([conversionRequestItems]);
  });
  it('should return rsoDetails', () => {
    const state: ConversionState = {
      ...initialState,
      rsoDetails: ['rso']
    };
    expect(conversionSelectors.selectRsoDetails.projector(state)).toEqual([
      'rso'
    ]);
  });
  it('should return isLoadingRsoDetails', () => {
    const state: ConversionState = {
      ...initialState,
      isLoadingRsoDetails: false
    };
    expect(
      conversionSelectors.selectIsLoadingRsoDetails.projector(state)
    ).toEqual(false);
  });
  it('should return hasRsoDetails', () => {
    const state: ConversionState = {
      ...initialState,
      hasRsoDetails: false
    };
    expect(conversionSelectors.selectHasRsoDetails.projector(state)).toEqual(
      false
    );
  });
  it('should return binCodes', () => {
    const state: ConversionState = {
      ...initialState,
      binCodes: [binCode]
    };
    expect(conversionSelectors.selectBincodes.projector(state)).toEqual([
      binCode
    ]);
  });
  it('should return isLoading', () => {
    const state: ConversionState = {
      ...initialState,
      isLoading: false
    };
    expect(conversionSelectors.selectIsLoading.projector(state)).toEqual(false);
  });
  it('should return hasBinCodes', () => {
    const state: ConversionState = {
      ...initialState,
      hasBinCodes: false
    };
    expect(conversionSelectors.selectHasBinCodes.projector(state)).toEqual(
      false
    );
  });
  it('should return error', () => {
    const state: ConversionState = {
      ...initialState,
      error: null
    };
    expect(conversionSelectors.selectError.projector(state)).toEqual(null);
  });

  // History Related Below
  it('should return totalElements', () => {
    const state: ConversionState = {
      ...initialState,
      totalElements: 10
    };
    expect(
      conversionSelectors.selectConversionHistoryCount.projector(state)
    ).toEqual(10);
  });
  it('should return isHistoryLoadingCount', () => {
    const state: ConversionState = {
      ...initialState,
      isLoadingHistory: false
    };
    expect(conversionSelectors.selectIsLoadingHistory.projector(state)).toEqual(
      false
    );
  });
  it('should return requestHistory', () => {
    const conversionHistory = {
      id: 12,
      srcLocationCode: 'CPD',
      destLocationCode: 'CPD',
      status: 'PENDING',
      weightUnit: '12',
      currencyCode: 'INR',
      srcLocationDescription: 'CPD',
      destLocationDescription: '123',
      srcDocNo: 12,
      srcFiscalYear: 12,
      srcDocDate: moment(123),
      destDocNo: '12',
      destDocDate: moment(456),
      totalAvailableQuantity: 12,
      totalMeasuredQuantity: 12,
      totalAvailableValue: 12,
      totalMeasuredValue: 12,
      totalAvailableWeight: 12,
      totalMeasuredWeight: 12,
      reqDocDate: moment(123),
      reqDocNo: 123,
      reqLocationCode: 'CPD',
      requestType: 'REQUEST',
      remarks: 'good',
      prevTransaction: 12,
      rsoName: 'RSO'
    };
    const state: ConversionState = {
      ...initialState,
      selectedRequestHistory: conversionHistory
    };
    expect(
      conversionSelectors.selectSelectedRequestHistory.projector(state)
    ).toEqual(conversionHistory);
  });
  it('should return conversionHistoryItems', () => {
    const conversionHistoryItems: ConversionHistoryItems[] = [
    {
      id: '123',
      itemCode: '123',
      lotNumber: '123',
      mfgDate: moment(123),
      productCategory: '123',
      productGroup: '123',
      productCategoryDesc: '123',
      productGroupDesc: '12',
      binCode: '123',
      binGroupCode: '123',
      stdValue: 123,
      stdWeight: 123,
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'PENDING',
      imageURL: 'abcdef',
      isLoadingImage: true,
      isLoadingThumbnailImage: false,
      thumbnailImageURL: 'abcdefg',
      itemDetails: {
        remarks: 'good',
        itemCode: '123',
        netWeight: 'gms',
        stonePrice: '12',
        complexityCode: '123',
        sold: 'yes',
        itemType: 'AB'
      },
      availableQuantity: 12,
      availableWeight: 12,
      availableValue: 12,
      measuredQuantity: 12,
      measuredWeight: 12,
      measuredValue: 12,
      orderType: 'CM',
      inventoryId: '123',
      isStudded: true
    }
  ]
    const state: ConversionState = {
      ...initialState,
      conversionHistoryItems: conversionHistoryItems
    };
    expect(
      conversionSelectors.selectConversionHistoryItems.projector(state)
    ).toEqual(conversionHistoryItems);
  });
  it('should return historyItemsCount', () => {
    const state: ConversionState = {
      ...initialState,
      historyItemsCount: 10
    };
    expect(
      conversionSelectors.selectConversionHistoryItemsCount.projector(state)
    ).toEqual(10);
  });
  it('should return requestType', () => {
    const state: ConversionState = {
      ...initialState,
      requestType: 'REQUEST'
    };
    expect(conversionSelectors.selectRequestType.projector(state)).toEqual(
      'REQUEST'
    );
  });
  it('should return advancedFilter', () => {
    const advanceFilter: ConversionHistoryAdvancedFilterPayload = {
      requestFromDate: 123,
      requestToDate: 12312312,
      fiscalYear: 2020,
      statuses: [],
      docNo: 12
    };
    const state: ConversionState = {
      ...initialState,
      advancedFilter: advanceFilter
    };
    expect(
      conversionSelectors.selectAdvancedFilterData.projector(state)
    ).toEqual(advanceFilter);
  });
});
