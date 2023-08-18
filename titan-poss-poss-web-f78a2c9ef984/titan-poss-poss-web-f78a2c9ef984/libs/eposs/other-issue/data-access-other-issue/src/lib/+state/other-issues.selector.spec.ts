import {
  OtherDetails,
  CourierDetailsOtherIssue,
  OtherIssueModel,
  OtherIssuesHistoryItem,
  OtherReceiptsIssuesAdvanceFilterPayload,
  OtherIssuesItem,
  ProductCategory,
  ProductGroup,
  CustomErrors,
  OtherIssueTransferType,
  RequestOtherIssueStockTransferNote,
  OtherIssuesCreateStockResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  OtherIssueEntity,
  OtherIssueHistoryItemEntity,
  otherIssueAdapter,
  otherIssuesHistoryItemAdapter,
  OtherIssueItemEntity,
  OtherIssueCreateItemEntity
} from './other-issues.entity';
import { OtherIssuesState } from './other-issues.state';
import { initialState } from './other-issues.reducer';
import * as selectors from './other-issues.selector';
import { Moment } from 'moment';

describe('Other Issue Selector Testing Suite', () => {
  const createHistorySTN = (
    id: number,
    srcLocationCode: string,
    destLocationCode: string,
    status: string,
    weightUnit: string,
    currencyCode: string,
    reqDocNo: number,
    reqDocDate: moment.Moment,
    reqLocationCode: string,
    requestType: string,
    carrierDetails: CourierDetailsOtherIssue,
    destDocDate: moment.Moment,
    destDocNo: number,
    orderType: string,
    otherDetails: OtherDetails,
    srcDocDate: moment.Moment,
    srcDocNo: number,
    srcFiscalYear: number,
    totalAvailableQuantity: number,
    totalAvailableValue: number,
    totalAvailableWeight: number,
    totalMeasuredQuantity: number,
    totalMeasuredValue: number,
    totalMeasuredWeight: number,
    remarks?: string
  ): OtherIssueModel => {
    return {
      id,
      srcLocationCode,
      destLocationCode,
      status,
      weightUnit,
      currencyCode,
      reqDocNo,
      reqDocDate,
      reqLocationCode,
      requestType,
      carrierDetails,
      destDocDate,
      destDocNo,
      orderType,
      otherDetails,
      srcDocDate,
      srcDocNo,
      srcFiscalYear,
      totalAvailableQuantity,
      totalAvailableValue,
      totalAvailableWeight,
      totalMeasuredQuantity,
      totalMeasuredValue,
      totalMeasuredWeight,
      remarks
    };
  };

  const createOtherIssueItem = (
    id: number,
    itemCode: string,
    lotNumber: string,
    mfgDate: Moment,
    productCategory: string,
    productGroup: string,

    binCode: string,
    binGroupCode: string,
    stdValue: number,
    stdWeight: number,
    currencyCode: string,
    weightUnit: string,

    status: string,
    imageURL: string,
    itemDetails: {},
    availableQuantity: number,

    availableWeight: number,
    availableValue: number,
    measuredQuantity: number,
    measuredWeight: number,
    measuredValue: number,

    orderType: string,
    approvedQuantity: number,
    isStudded: boolean,
    isUpdating: boolean,
    isUpdatingSuccess: boolean,

    issuedQuantity: number,

    itemValue: number,
    itemWeight: number,
    productCategoryId: string,
    productGroupId: string,
    requestedQuantity: number,
    totalQuantity: number,
    totalValue: number,
    totalWeight: number,
    totalElements: number,
    inventoryId?: number,
    taxDetails?:any,
  ): OtherIssuesItem => {
    return {
      id,
      itemCode,
      lotNumber,
      mfgDate,
      productCategory,
      productGroup,
      binCode,
      binGroupCode,
      stdValue,
      stdWeight,
      currencyCode,
      weightUnit,
      status,
      imageURL,
      itemDetails,
      availableQuantity,
      availableWeight,
      availableValue,
      measuredQuantity,
      measuredWeight,
      measuredValue,
      orderType,
      approvedQuantity,
      isStudded,
      isUpdating,
      isUpdatingSuccess,
      issuedQuantity,
      itemValue,
      itemWeight,
      productCategoryId,
      productGroupId,
      requestedQuantity,
      totalQuantity,
      totalValue,
      totalWeight,
      totalElements,

      inventoryId,
      taxDetails
    };
  };

  const historySTN1 = createHistorySTN(
    1,
    'srcLocationCode1',
    'destLocationCode1',
    'ISSUED',
    'gms',
    'INR',
    1001,
    moment(),
    'reqLocationCode1',
    '',
    null,
    moment(),
    2001,
    null,
    null,
    moment(),
    3003,
    2019,
    1,
    1000,
    10,
    1,
    1000,
    10,
    'remarks'
  );
  const historySTN2 = createHistorySTN(
    2,
    'srcLocationCode2',
    'destLocationCode2',
    'ISSUED',
    'gms',
    'INR',
    2001,
    moment(),
    'reqLocationCode2',
    '',
    null,
    moment(),
    2222,
    null,
    null,
    moment(),
    33333,
    2019,
    2,
    2000,
    20,
    2,
    2000,
    20,
    'remarks'
  );

  const createItemList = (
    id: number,
    itemCode: string,
    lotNumber: string,
    productCategory: string,
    productCategoryDesc: string,
    productGroup: string,
    productGroupDesc: string,
    binCode: string,
    binGroupCode: string,
    orderType: string,
    itemValue: number,
    itemWeight: number,
    totalQuantity: number,
    totalValue: number,
    totalWeight: number,
    currencyCode: string,
    weightUnit: string,
    mfgDate: moment.Moment,
    status: string,
    imageURL: string,
    itemDetails: {},
    approvedQuantity: number,
    issuedQuantity: number,
    requestedQuantity: number,
    isUpdating: boolean,
    isUpdatingSuccess: boolean,
    totalElements: number,
    inventoryId: number,
    measuredWeight: number,
    measuredValue: number,
    measuredQuantity: number,
    availableQuantity: number,
    availableValue: number,
    availableWeight: number,
    stdWeight: number,
    stdValue: number,
    isStudded: boolean
  ): OtherIssuesHistoryItem => {
    return {
      id,
      itemCode,
      lotNumber,
      productCategory,
      productCategoryDesc,
      productGroup,
      productGroupDesc,
      binCode,
      binGroupCode,
      orderType,
      itemValue,
      itemWeight,
      totalQuantity,
      totalValue,
      totalWeight,
      currencyCode,
      weightUnit,
      mfgDate,
      status,
      imageURL,
      itemDetails,
      approvedQuantity,
      issuedQuantity,
      requestedQuantity,
      isUpdating,
      isUpdatingSuccess,
      totalElements,
      inventoryId,
      measuredWeight,
      measuredValue,
      measuredQuantity,
      availableQuantity,
      availableValue,
      availableWeight,
      stdWeight,
      stdValue,
      isStudded
    };
  };

  const item1 = createItemList(
    1,
    '111AAA1111BB11',
    '10000AB1',
    'productCategory',
    'productCategoryDesc',
    'productGroup',
    'productGroupDesc',
    'binCode',
    'binGroupCode',
    null,
    1000,
    10,
    1,
    1000,
    10,
    'INR',
    'gms',
    moment(),
    'status',
    'url',
    {},
    1,
    1,
    1,
    false,
    true,
    10,
    11111,
    10,
    1000,
    1,
    1,
    1000,
    10,
    10,
    1000,
    true
  );
  const item2 = createItemList(
    2,
    '222AAA2222BB22',
    '20000AB2',
    'productCategory',
    'productCategoryDesc',
    'productGroup',
    'productGroupDesc',
    'binCode',
    'binGroupCode',
    null,
    2000,
    20,
    2,
    2000,
    20,
    'INR',
    'gms',
    moment(),
    'status',
    'url',
    {},
    2,
    2,
    2,
    false,
    true,
    20,
    22222,
    20,
    2000,
    2,
    2,
    2000,
    20,
    20,
    2000,
    true
  );

  const dummyOtherIssueCreateItems1 = createOtherIssueItem(
    1,
    '512219VGGQ2A00',
    '2EB000073',
    moment(1588703400000),
    'V',
    '71',
    'LOAN',
    'LOAN',
    160410,
    46.186,
    'INR',
    'gms',
    'OPEN',
    '/productcatalogue/ProductImages/2219VGG.jpg',
    null,
    5,
    230.93,
    802050,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    1
  );

  const dummyLoadIssue: RequestOtherIssueStockTransferNote = {
    currencyUnit: '',
    destLocationCode: '',
    id: 1,
    reqDocDate: moment(),
    reqDocNo: 1,
    reqLocationCode: '',
    requestType: '',
    srcLocationCode: '',
    status: '',
    totalAvailableQuantity: 1,
    totalAvailableValue: 1,
    totalAvailableWeight: 1,
    totalQuantity: 1,
    totalValue: 1,
    totalWeight: 1,
    weightUnit: '',
    carrierDetails: null,
    otherDetails: null
  };
  const dummyOtherIssueCreateItems2 = createOtherIssueItem(
    2,
    '512219VGGQ2A00',
    '2EB000073',
    moment(1588703400000),
    'V',
    '71',
    'LOAN',
    'LOAN',
    160410,
    46.186,
    'INR',
    'gms',
    'OPEN',
    '/productcatalogue/ProductImages/2219VGG.jpg',
    null,
    5,
    230.93,
    802050,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    2
  );

  const addSTNElementToEntities = <T extends OtherIssueModel>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.id]: element
        };
      },
      {}
    );
    return reducedEntities;
  };

  const addIssueElementToEntities = <T extends OtherIssuesItem>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.id]: element
        };
      },
      {}
    );
    return reducedEntities;
  };

  const addIssueCreateElementToEntities = <T extends OtherIssuesItem>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.id]: element
        };
      },
      {}
    );
    return reducedEntities;
  };

  const addItemsElementToEntities = <T extends OtherIssuesHistoryItem>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.id]: element
        };
      },
      {}
    );
    return reducedEntities;
  };

  const historySTNArray = [historySTN1, historySTN2];
  const historyItemsArray = [item1, item2];
  const otherIssueArray = [
    dummyOtherIssueCreateItems1,
    dummyOtherIssueCreateItems2
  ];

  const historySTN: OtherIssueEntity = {
    ids: [historySTN1.id, historySTN2.id],
    entities: addSTNElementToEntities(historySTNArray)
  };

  const historyItems: OtherIssueHistoryItemEntity = {
    ids: [item1.id, item2.id],
    entities: addItemsElementToEntities(historyItemsArray)
  };
  const otherIssueItems: OtherIssueItemEntity = {
    ids: [dummyOtherIssueCreateItems1.id, dummyOtherIssueCreateItems2.id],

    entities: addIssueElementToEntities(otherIssueArray)
  };

  const otherIssueCreateItems: OtherIssueCreateItemEntity = {
    ids: [
      dummyOtherIssueCreateItems1.inventoryId,
      dummyOtherIssueCreateItems2.inventoryId
    ],

    entities: addIssueCreateElementToEntities(otherIssueArray)
  };
  describe('Testing Other Issue History STN Listing related Selectors', () => {
    const state: OtherIssuesState = {
      ...initialState,
      otherIssueHistory: historySTN,
      isLoadingHistory: false,
      otherIssueHistoryCount: 1
    };
    it('should return the other Issue History STNs', () => {
      const historySTNS = otherIssueAdapter.setAll(historySTNArray, {
        ...otherIssueAdapter.getInitialState()
      });

      // expect(selectors.otherIssueHistory.projector(state)).toEqual(historySTNS);
    });
    it('should return other Issue History STNs selector', () => {
      expect(
        selectors.otherIssuesSelector.selectOtherIssueHistory.projector(
          historySTN
        )
      ).toEqual(historySTNArray);
    });

    it('should return isLoadingHistory selector', () => {
      expect(
        selectors.otherIssuesSelector.selectIsLoadingOtherIssueHistory.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return OtherIssueHistoryCount selector', () => {
      expect(
        selectors.otherIssuesSelector.selectOtherIssueHistoryCount.projector(
          state
        )
      ).toEqual(1);
    });
  });
  describe('Testing Loading Selected History Related selectors', () => {
    const state: OtherIssuesState = {
      ...initialState,
      isLoadingSelectedHistory: false,
      hasSelectedHistory: true,
      selectedHistory: historySTN1
    };
    it('should return isLoadingSelectedHistory selector', () => {
      expect(
        selectors.otherIssuesSelector.selectIsLoadingSelectedHistory.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return HasSelectedHistory selector', () => {
      expect(
        selectors.otherIssuesSelector.selectHasSelectedHistory.projector(state)
      ).toEqual(true);
    });
    it('should return selectedHistory selector', () => {
      expect(
        selectors.otherIssuesSelector.selectSelectedHistory.projector(state)
      ).toEqual(historySTN1);
    });
  });

  describe('Testing Loading History Items Related selectors', () => {
    const state: OtherIssuesState = {
      ...initialState,
      isLoadingHistoryItems: false,
      isHistoryItemsLoaded: true,
      historyItemsCount: 2,
      historyItems: historyItems
    };

    it('should return the other Issue History Items', () => {
      const OtherIssueHistoryItems = otherIssuesHistoryItemAdapter.setAll(
        historyItemsArray,
        {
          ...otherIssuesHistoryItemAdapter.getInitialState()
        }
      );

      // expect(selectors.historyItems.projector(state)).toEqual(
      //   OtherIssueHistoryItems
      // );
    });
    it('should return other Issue History Items selector', () => {
      expect(
        selectors.otherIssuesSelector.selectHistoryItems.projector(historyItems)
      ).toEqual(historyItemsArray);
    });

    it('should return isLoadingHistoryItems selector', () => {
      expect(
        selectors.otherIssuesSelector.selectIsLoadingHistoryItems.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return isHistoryItemsLoaded selector', () => {
      expect(
        selectors.otherIssuesSelector.selectIsHistoryItemsLoaded.projector(
          state
        )
      ).toEqual(true);
    });
    it('should return historyItemsCount selector', () => {
      expect(
        selectors.otherIssuesSelector.selectHistoryItemsCount.projector(state)
      ).toEqual(2);
    });
  });

  describe('Testing Loading History Items Related selectors', () => {
    const state: OtherIssuesState = {
      ...initialState,
      isLoadingHistoryItemsTotalCount: false,
      isHistoryItemsTotalCountLoaded: true,
      historyItemsTotalCount: 2
    };

    it('should return isLoadingHistoryItemsTotalCount selector', () => {
      expect(
        selectors.otherIssuesSelector.selectIsLoadingHistoryItemsTotalCount.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return isHistoryItemsTotalCountLoaded selector', () => {
      expect(
        selectors.otherIssuesSelector.selectIsHistoryItemsTotalCountLoaded.projector(
          state
        )
      ).toEqual(true);
    });
    it('should return historyItemsTotalCount selector', () => {
      expect(
        selectors.otherIssuesSelector.selectHistoryItemsTotalCount.projector(
          state
        )
      ).toEqual(2);
    });
  });

  describe('Testing advancedfilter Related selectors', () => {
    const filterData: OtherReceiptsIssuesAdvanceFilterPayload = {
      docFromDate: null,
      docToDate: null,
      status: null,
      fiscalYear: null,
      docNo: null
    };
    const state: OtherIssuesState = {
      ...initialState,

      advancedfilter: filterData
    };

    it('should return AdvancedFilterData selector', () => {
      expect(
        selectors.otherIssuesSelector.selectAdvancedFilterData.projector(state)
      ).toEqual(filterData);
    });
  });

  describe('Testing otherIssue Related selectors', () => {
    it('Should return productCategories', () => {
      const productCategories: ProductCategory[] = [
        {
          productCategoryCode: 'TEST1',
          description: 'TEST1'
        },
        {
          productCategoryCode: 'TEST2',
          description: 'TEST2'
        }
      ];
      const state: OtherIssuesState = {
        ...initialState,
        productCategories: productCategories
      };
      expect(
        selectors.otherIssuesSelector.selectProductCategories.projector(state)
      ).toEqual(productCategories);
    });

    it('Should return productGroups', () => {
      const productGroups: ProductGroup[] = [
        {
          productGroupCode: 'TEST1',
          description: 'TEST1'
        },
        {
          productGroupCode: 'TEST2',
          description: 'TEST2'
        }
      ];
      const state: OtherIssuesState = {
        ...initialState,
        productGroups: productGroups
      };
      expect(
        selectors.otherIssuesSelector.selectProductGroups.projector(state)
      ).toEqual(productGroups);
    });
    it('Should return the error', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      const state: OtherIssuesState = {
        ...initialState,
        error: error
      };
      expect(
        selectors.otherIssuesSelector.selectError.projector(state)
      ).toEqual(error);
    });

    it('should return selectHasError selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        hasError: 'yes'
      };
      expect(
        selectors.otherIssuesSelector.selectHasError.projector(state)
      ).toEqual('yes');
    });

    it('should return isLoading selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('should return selectIsLoadingOtherIssuesSTN selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isLoadingOtherIssuesList: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsLoadingOtherIssuesSTN.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectIsSearchingStocks selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isSearchingStocks: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsSearchingStocks.projector(state)
      ).toEqual(true);
    });

    it('should return selectHasSearchStockResults selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        hasSearchStockResults: true
      };
      expect(
        selectors.otherIssuesSelector.selectHasSearchStockResults.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectIssueItemsTotalCount selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        issueItemsTotalCount: 1
      };
      expect(
        selectors.otherIssuesSelector.selectIssueItemsTotalCount.projector(
          state
        )
      ).toEqual(1);
    });

    it('should return selectTotalIssueCount selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        totalElementsOtherIssues: 1
      };
      expect(
        selectors.otherIssuesSelector.selectTotalIssueCount.projector(state)
      ).toEqual(1);
    });

    it('should return selectIsLoadingSelectedIssueStock selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isLoadingOtherIssueSelectedStock: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsLoadingSelectedIssueStock.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectIsSearchingOtherIssueItems selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isSearchingOtherIssueItems: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsSearchingOtherIssueItems.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectHasSearchedOtherIssueItems selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        hasSearchedOtherssueIItems: true
      };
      expect(
        selectors.otherIssuesSelector.selectHasSearchedOtherIssueItems.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectAllOtherIssueCreateItemsTotalCount selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        allOtherIssueCreateItemsTotalCount: 1
      };
      expect(
        selectors.otherIssuesSelector.selectAllOtherIssueCreateItemsTotalCount.projector(
          state
        )
      ).toEqual(1);
    });

    it('should return selectSelectedOtherIssueCreateTotalCount selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        selectedOtherIssueCreateItemsTotalCount: 1
      };
      expect(
        selectors.otherIssuesSelector.selectSelectedOtherIssueCreateTotalCount.projector(
          state
        )
      ).toEqual(1);
    });

    it('should return selectIsAllOtherIssueCreateItemsLoading selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isallOtherIssueCreateItemsLoading: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsAllOtherIssueCreateItemsLoading.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectIsSelectedOtherIssueItemsLoading selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isselectedOtherIssueCreateItemsLoading: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsSelectedOtherIssueItemsLoading.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectIsOtherIssueCreateTotalCountLoaded selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isOtherIssueCreateItemTotalCountLoaded: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsOtherIssueCreateTotalCountLoaded.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectIsSearchingOtherIssueCreateItems selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isSearchingOtherIssueCreateItems: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsSearchingOtherIssueCreateItems.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectHasSearchedOtherIssueCreateItems selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        hasSearchedOtherssueCreateItems: true
      };
      expect(
        selectors.otherIssuesSelector.selectHasSearchedOtherIssueCreateItems.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectIsOtherIssueCreateTotalCountLoading selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isOtherIssueItemTotalCountLoading: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsOtherIssueCreateTotalCountLoading.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectisLoadingOtherIssueDetails selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isLoadingOtherIssueDetails: true
      };
      expect(
        selectors.otherIssuesSelector.selectisLoadingOtherIssueDetails.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectIsSearchingAdjustment selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isSearchingAdjustment: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsSearchingAdjustment.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectHasSearchedItemAdjustment selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        hasSearchedItemAdjustment: true
      };
      expect(
        selectors.otherIssuesSelector.selectHasSearchedItemAdjustment.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectIsLoadingAdjustment selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isLoadingAdjustment: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsLoadingAdjustment.projector(state)
      ).toEqual(true);
    });

    it('should return selectHasSearchItemInCartSearch selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        hasSearchItemInCartSearch: true
      };
      expect(
        selectors.otherIssuesSelector.selectHasSearchItemInCartSearch.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectIsSearchingPSV selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isSearchingPSV: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsSearchingPSV.projector(state)
      ).toEqual(true);
    });

    it('should return selectHasSearchedItemPSV selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        hasSearchedItemPSV: true
      };
      expect(
        selectors.otherIssuesSelector.selectHasSearchedItemPSV.projector(state)
      ).toEqual(true);
    });

    it('should return selectIsLoadingPSV selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isLoadingPSV: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsLoadingPSV.projector(state)
      ).toEqual(true);
    });

    it('should return selectHasSearchItemInCartSearchPSV selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        hasSearchItemInCartSearchPSV: true
      };
      expect(
        selectors.otherIssuesSelector.selectHasSearchItemInCartSearchPSV.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectIsSearchingFOC selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isSearchingFOC: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsSearchingFOC.projector(state)
      ).toEqual(true);
    });

    it('should return selectIsLoadingFOC selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isLoadingFOC: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsLoadingFOC.projector(state)
      ).toEqual(true);
    });

    it('should return selectHasSearchedItemFOC selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        hasSearchedItemFOC: true
      };
      expect(
        selectors.otherIssuesSelector.selectHasSearchedItemFOC.projector(state)
      ).toEqual(true);
    });

    it('should return selectIsLoadingCancelStockRequestResponse selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isLoadingCancelStockRequestResponse: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsLoadingCancelStockRequestResponse.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectCancelOtherStockRequestResponse selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        cancelStockRequestResponse: true
      };
      expect(
        selectors.otherIssuesSelector.selectCancelOtherStockRequestResponse.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectIsLoadingCancelStockRequestResponse selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        isLoadingCancelStockRequestResponse: true
      };
      expect(
        selectors.otherIssuesSelector.selectIsLoadingCancelStockRequestResponse.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectCancelOtherStockRequestResponse selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        cancelStockRequestResponse: true
      };
      expect(
        selectors.otherIssuesSelector.selectCancelOtherStockRequestResponse.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectOtherIssuesSTNCount selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        pendingOtherIssuesSTNCount: 0
      };
      expect(
        selectors.otherIssuesSelector.selectOtherIssuesSTNCount.projector(state)
      ).toEqual(0);
    });

    it('should return selectPendingIssuesList selector', () => {
      expect(
        selectors.otherIssuesSelector.selectPendingIssuesList.projector(
          historySTN
        )
      ).toEqual(historySTNArray);
    });

    it('should return selectOtherIssueStockResults selector', () => {
      expect(
        selectors.otherIssuesSelector.selectOtherIssueStockResults.projector(
          historySTN
        )
      ).toEqual(historySTNArray);
    });

    it('should return selectOtherIssuesDropDown selector', () => {
      const dropDown: OtherIssueTransferType[] = [
        {
          type: '',
          count: 0
        }
      ];
      const state: OtherIssuesState = {
        ...initialState,
        otherIssuesDropdownValues: dropDown
      };
      expect(
        selectors.otherIssuesSelector.selectOtherIssuesDropDown.projector(state)
      ).toEqual(dropDown);
    });

    it('should return selectPendingIssuesLoanList selector', () => {
      expect(
        selectors.otherIssuesSelector.selectPendingIssuesLoanList.projector(
          historySTN
        )
      ).toEqual(historySTNArray);
    });

    it('should return selectOtherissuesSelectedDropDown selector', () => {
      const dropDown: OtherIssueTransferType[] = [
        {
          type: '',
          count: 0
        }
      ];
      const state: OtherIssuesState = {
        ...initialState,
        selectedDropDownForIssues: 'EXH'
      };
      expect(
        selectors.otherIssuesSelector.selectOtherissuesSelectedDropDown.projector(
          state
        )
      ).toEqual('EXH');
    });
    it('should return selectSelectedIssue selector', () => {
      const selectSelectedIssue: RequestOtherIssueStockTransferNote = dummyLoadIssue;
      const state: OtherIssuesState = {
        ...initialState,
        selectedIssue: selectSelectedIssue
      };
      expect(
        selectors.otherIssuesSelector.selectSelectedIssue.projector(state)
      ).toEqual(selectSelectedIssue);
    });

    it('should return selectNonVerifiedOtherIssueItems selector', () => {
      expect(
        selectors.otherIssuesSelector.selectNonVerifiedOtherIssueItems.projector(
          otherIssueItems
        )
      ).toEqual(otherIssueArray);
    });

    it('should return createOtherIssueStockRequestResponse selector', () => {
      const createOtherIssueStockRequestResponse: OtherIssuesCreateStockResponse = {
        destLocationCode: '',
        id: 1,
        reqDocDate: moment(),
        reqDocNo: 1,
        srcLocationCode: '',
        status: '',
        totalQuantity: 1
      };
      const state: OtherIssuesState = {
        ...initialState,
        createOtherIssueStockRequestResponse: createOtherIssueStockRequestResponse
      };
      expect(
        selectors.otherIssuesSelector.createOtherIssueStockRequestResponse.projector(
          state
        )
      ).toEqual(createOtherIssueStockRequestResponse);
    });

    it('should return selectAllOtherIssuesCreateItems selector', () => {
      expect(
        selectors.otherIssuesSelector.selectAllOtherIssuesCreateItems.projector(
          otherIssueCreateItems
        )
      ).toEqual(otherIssueArray);
    });

    it('should return selectSelectedOtherIssuesCreateItems selector', () => {
      expect(
        selectors.otherIssuesSelector.selectSelectedOtherIssuesCreateItems.projector(
          otherIssueCreateItems
        )
      ).toEqual(otherIssueArray);
    });

    it('should return selectCreateStockRequestItemsResponse selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        createOtherIssueStockRequestItemsResponse: []
      };
      expect(
        selectors.otherIssuesSelector.selectCreateStockRequestItemsResponse.projector(
          state
        )
      ).toEqual([]);
    });

    it('should return selectRemoveOtherIssueStockRequestItemsResponse selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        removeOtherIssueStockRequestItemsResponse: []
      };
      expect(
        selectors.otherIssuesSelector.selectRemoveOtherIssueStockRequestItemsResponse.projector(
          state
        )
      ).toEqual([]);
    });

    it('should return selectupdateStockRequestResponse selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        updateStockRequestResponse: []
      };
      expect(
        selectors.otherIssuesSelector.selectupdateStockRequestResponse.projector(
          state
        )
      ).toEqual([]);
    });

    it('should return selectCreateOtherStockIssueItemsResponse selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        updateStockRequestResponse: {}
      };
      expect(
        selectors.otherIssuesSelector.selectCreateOtherStockIssueItemsResponse.projector(
          state
        )
      ).toEqual({});
    });
    it('should return selectConfirmOtherStockIssueResponse selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        confirmOtherStockIssueResponse: {}
      };
      expect(
        selectors.otherIssuesSelector.selectConfirmOtherStockIssueResponse.projector(
          state
        )
      ).toEqual({});
    });

    it('should return selectSearchedAdjustmentItems selector', () => {
      expect(
        selectors.otherIssuesSelector.selectSearchedAdjustmentItems.projector(
          otherIssueItems
        )
      ).toEqual(otherIssueArray);
    });

    it('should return selectAdjustmentItemsInCart selector', () => {
      expect(
        selectors.otherIssuesSelector.selectAdjustmentItemsInCart.projector(
          otherIssueItems
        )
      ).toEqual(otherIssueArray);
    });

    it('should return selectPendingIssuesADJList selector', () => {
      expect(
        selectors.otherIssuesSelector.selectPendingIssuesADJList.projector(
          historySTN
        )
      ).toEqual(historySTNArray);
    });

    it('should return selectPendingIssuesLossList selector', () => {
      expect(
        selectors.otherIssuesSelector.selectPendingIssuesLossList.projector(
          historySTN
        )
      ).toEqual(historySTNArray);
    });

    it('should return selectPendingIssuesPSVList selector', () => {
      expect(
        selectors.otherIssuesSelector.selectPendingIssuesPSVList.projector(
          historySTN
        )
      ).toEqual(historySTNArray);
    });

    it('should return selectcreateStockRequestAdjustmentResponse selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        createStockRequestAdjustmentResponse: []
      };
      expect(
        selectors.otherIssuesSelector.selectcreateStockRequestAdjustmentResponse.projector(
          state
        )
      ).toEqual([]);
    });

    it('should return selectAdjustmentItemsInCartsSearch selector', () => {
      expect(
        selectors.otherIssuesSelector.selectAdjustmentItemsInCartsSearch.projector(
          otherIssueItems
        )
      ).toEqual(otherIssueArray);
    });

    it('should return selectSearchedPSVItems selector', () => {
      expect(
        selectors.otherIssuesSelector.selectSearchedPSVItems.projector(
          otherIssueCreateItems
        )
      ).toEqual(otherIssueArray);
    });

    it('should return selectPSVItemsInCart selector', () => {
      expect(
        selectors.otherIssuesSelector.selectPSVItemsInCart.projector(
          otherIssueItems
        )
      ).toEqual(otherIssueArray);
    });

    it('should return selectcreateStockRequestPSVResponse selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        createStockRequestAdjustmentResponse: []
      };

      expect(
        selectors.otherIssuesSelector.selectcreateStockRequestAdjustmentResponse.projector(
          state
        )
      ).toEqual([]);
    });

    it('should return selectPSVItemsInCartsSearch selector', () => {
      expect(
        selectors.otherIssuesSelector.selectAdjustmentItemsInCartsSearch.projector(
          otherIssueItems
        )
      ).toEqual(otherIssueArray);
    });

    ///////////////////////////

    it('should return selectSearchedFOCItems selector', () => {
      expect(
        selectors.otherIssuesSelector.selectSearchedFOCItems.projector(
          otherIssueItems
        )
      ).toEqual(otherIssueArray);
    });

    it('should return selectFOCItemsInCart selector', () => {
      expect(
        selectors.otherIssuesSelector.selectFOCItemsInCart.projector(
          otherIssueItems
        )
      ).toEqual(otherIssueArray);
    });

    it('should return selectcreateStockRequestFOCResponse selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        createStockRequestFOCResponse: []
      };
      expect(
        selectors.otherIssuesSelector.selectcreateStockRequestFOCResponse.projector(
          state
        )
      ).toEqual([]);
    });

    it('should return selectFOCItemsInCartsSearch selector', () => {
      expect(
        selectors.otherIssuesSelector.selectFOCItemsInCartsSearch.projector(
          otherIssueItems
        )
      ).toEqual(otherIssueArray);
    });

    it('should return selectPendingIssuesFOCList selector', () => {
      expect(
        selectors.otherIssuesSelector.selectPendingIssuesFOCList.projector(
          historySTN
        )
      ).toEqual(historySTNArray);
    });

    it('should return selectprintDataResponse selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        printDataResponse: []
      };
      expect(
        selectors.otherIssuesSelector.selectprintDataResponse.projector(state)
      ).toEqual([]);
    });

    it('should return selectfilterDataAllProducts selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        filterDataAllProducts: {}
      };
      expect(
        selectors.otherIssuesSelector.selectfilterDataAllProducts.projector(
          state
        )
      ).toEqual({});
    });

    it('should return selectfilterDataSelectedProducts selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        filterDataSelectedProducts: {}
      };
      expect(
        selectors.otherIssuesSelector.selectfilterDataSelectedProducts.projector(
          state
        )
      ).toEqual({});
    });

    it('should return selectSortDataAllProducts selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        sortDataAllProducts: []
      };
      expect(
        selectors.otherIssuesSelector.selectSortDataAllProducts.projector(state)
      ).toEqual([]);
    });

    it('should return selectSortDataSelectedProducts selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        sortDataSelectedProducts: []
      };
      expect(
        selectors.otherIssuesSelector.selectSortDataSelectedProducts.projector(
          state
        )
      ).toEqual([]);
    });

    it('should return selectfilterDataOtherIssue selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        filterDataOtherIssue: {}
      };
      expect(
        selectors.otherIssuesSelector.selectfilterDataOtherIssue.projector(
          state
        )
      ).toEqual({});
    });

    it('should return selectSortDataOtherIssue selector', () => {
      const state: OtherIssuesState = {
        ...initialState,
        sortDataSelectedProducts: []
      };
      expect(
        selectors.otherIssuesSelector.selectSortDataOtherIssue.projector(state)
      ).toEqual([]);
    });
  });
});
