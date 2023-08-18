import {
  CustomErrors,
  IssueAdvanceFilterPayload,
  IssueInventoryItem,
  RequestList,
  StockRequestNote
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  issueItemAdaptor,
  IssueItemEntity,
  requestStockTransferNoteAdaptor,
  RequestStockTransferNoteEntity
} from './stock-issue.entity';
import { initialState } from './stock-issue.reducer';
import * as selectors from './stock-issue.selector';
import { StockIssueState } from './stock-issue.state';

describe('Stock Issue Selector Testing Suite', () => {
  const createPendingSTN = (
    carrierDetails: {},
    currencyCode: string,
    destDocDate: moment.Moment,
    destDocNo: number,
    destLocationCode: string,
    destLocationDescription: string,
    id: number,
    orderType: string,
    otherDetails: {},
    reqDocDate: moment.Moment,
    reqDocNo: number,
    reqLocationCode: string,
    requestType: string,
    srcDocDate: moment.Moment,
    srcDocNo: number,
    srcFiscalYear: number,
    srcLocationCode: string,
    srcLocationDescription: string,
    status: string,
    totalAvailableQuantity: number,
    totalAvailableValue: number,
    totalAvailableWeight: number,
    totalMeasuredQuantity: number,
    totalMeasuredValue: number,
    totalMeasuredWeight: number,
    weightUnit: string,
    courierReceivedDate: any,
    reasonForDelay: string,
    remarks: string,
    transferType: string
  ): StockRequestNote => {
    return {
      carrierDetails,
      currencyCode,
      destDocDate,
      destDocNo,
      destLocationCode,
      destLocationDescription,
      id,
      orderType,
      otherDetails,
      reqDocDate,
      reqDocNo,
      reqLocationCode,
      requestType,
      srcDocDate,
      srcDocNo,
      srcFiscalYear,
      srcLocationCode,
      srcLocationDescription,
      status,
      totalAvailableQuantity,
      totalAvailableValue,
      totalAvailableWeight,
      totalMeasuredQuantity,
      totalMeasuredValue,
      totalMeasuredWeight,
      weightUnit,
      courierReceivedDate,
      reasonForDelay,
      remarks,
      transferType
    };
  };

  const pendingSTN1 = createPendingSTN(
    {},
    'INR',
    moment(),
    101,
    'URB',
    'URB desc',
    1,
    '',
    {},
    moment(),
    111,
    'URB',
    'FAC',
    moment(),
    1111,
    2019,
    'SrcLocCode',
    'SrcLocDesc',
    'APPROVED',
    2,
    2000,
    20,
    2,
    2000,
    20,
    'gms',
    null,
    '',
    '',
    ''
  );
  const pendingSTN2 = createPendingSTN(
    {},
    'INR',
    moment(),
    201,
    'URB',
    'URB desc',
    2,
    '',
    {},
    moment(),
    222,
    'URB',
    'FAC',
    moment(),
    2222,
    2019,
    'SrcLocCode',
    'SrcLocDesc',
    'APPROVED',
    2,
    2000,
    20,
    2,
    2000,
    20,
    'gms',
    null,
    '',
    '',
    ''
  );

  const createItemsList = (
    availableQuantity: number,
    availableValue: number,
    availableWeight: number,
    binCode: string,
    binGroupCode: string,
    currencyCode: string,
    id: string,
    imageURL: string,
    inventoryId: string,
    itemCode: string,
    itemDetails: {},
    lotNumber: string,
    measuredQuantity: number,
    measuredValue: number,
    measuredWeight: number,
    mfgDate: moment.Moment,
    orderType: string,
    productCategory: string,
    productCategoryDesc: string,
    productGroup: string,
    productGroupDesc: string,
    status: string,
    stdValue: number,
    stdWeight: number,
    weightUnit: string,
    isUpdating: boolean,
    isUpdatingSuccess: boolean,
    isValidating: boolean,
    isValidatingSuccess: boolean,
    isValidatingError: boolean,
    isStudded: boolean
  ): IssueInventoryItem => {
    return {
      availableQuantity,
      availableValue,
      availableWeight,
      binCode,
      binGroupCode,
      currencyCode,
      id,
      imageURL,
      inventoryId,
      itemCode,
      itemDetails: {},
      lotNumber,
      measuredQuantity,
      measuredValue,
      measuredWeight,
      mfgDate,
      orderType,
      productCategory,
      productCategoryDesc,
      productGroup,
      productGroupDesc,
      status,
      stdValue,
      stdWeight,
      weightUnit,
      isUpdating,
      isUpdatingSuccess,
      isValidating,
      isValidatingSuccess,
      isValidatingError,
      isStudded,
      isLoadingImage: false,
      isLoadingThumbnailImage: true,
      taxDetails: {},
      thumbnailImageURL: ''
    };
  };
  const item1 = createItemsList(
    1,
    1,
    1,
    '',
    '',
    'INR',
    '1',
    'url',
    'invID',
    '111111',
    {},
    '100111',
    1,
    1,
    1,
    moment(),
    '',
    'cat',
    'catDesc',
    'grp',
    'grpDesc',
    'APPROVED',
    1000,
    10,
    'gms',
    false,
    false,
    false,
    false,
    false,
    false
  );
  const item2 = createItemsList(
    2,
    2,
    2,
    '',
    '',
    'INR',
    '2',
    'url',
    'invID',
    '2111111',
    {},
    '2100111',
    2,
    2,
    2,
    moment(),
    '',
    'cat',
    'catDesc',
    'grp',
    'grpDesc',
    'APPROVED',
    2000,
    20,
    'gms',
    false,
    false,
    false,
    false,
    false,
    false
  );

  const addSTNElementToEntities = <T extends StockRequestNote>(
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

  const addItemsElementToEntities = <T extends IssueInventoryItem>(
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

  const pendingRequestArray = [pendingSTN1, pendingSTN2];
  const searchedRequestArray = [pendingSTN1];

  const issueItemsArray = [item1, item2];

  const pendingStockIssueRequests: RequestStockTransferNoteEntity = {
    ids: [pendingSTN1.id, pendingSTN2.id],
    entities: addSTNElementToEntities(pendingRequestArray)
  };
  const searchedPendingRequest: RequestStockTransferNoteEntity = {
    ids: [pendingSTN1.id],
    entities: addSTNElementToEntities(searchedRequestArray)
  };

  const issueItems: IssueItemEntity = {
    ids: [item1.id, item2.id],
    entities: addItemsElementToEntities(issueItemsArray)
  };

  describe('Testing Issue to Factory Pending STN related Selectors', () => {
    it('Should return the pending Factory STN', () => {
      const pendingSTNS = requestStockTransferNoteAdaptor.setAll(
        pendingRequestArray,
        {
          ...requestStockTransferNoteAdaptor.getInitialState()
        }
      );
      const state: StockIssueState = {
        ...initialState,
        issueFactorySTN: pendingStockIssueRequests
      };
      expect(selectors.pendingIssuetoFactorySTN.projector(state)).toEqual(
        pendingSTNS
      );
    });
    it('should return the pending Factory STN selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIssueToFactorySTN.projector(
          pendingStockIssueRequests
        )
      ).toEqual(pendingRequestArray);
    });
  });

  describe('Testing Issue to Other Boutiques STN related Selectors', () => {
    it('Should return the pending Other Boutique STN', () => {
      const pendingSTNS = requestStockTransferNoteAdaptor.setAll(
        pendingRequestArray,
        {
          ...requestStockTransferNoteAdaptor.getInitialState()
        }
      );
      const state: StockIssueState = {
        ...initialState,
        issueBoutiqueSTN: pendingStockIssueRequests
      };
      expect(selectors.pendingIssuetoBoutiqueSTN.projector(state)).toEqual(
        pendingSTNS
      );
    });
    it('should return the pending Other Boutique STN selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIssueToBoutiqueSTN.projector(
          pendingStockIssueRequests
        )
      ).toEqual(pendingRequestArray);
    });
  });

  describe('Testing Issue by merchndise STN related Selectors', () => {
    it('Should return the pending merchandise STN', () => {
      const pendingSTNS = requestStockTransferNoteAdaptor.setAll(
        pendingRequestArray,
        {
          ...requestStockTransferNoteAdaptor.getInitialState()
        }
      );
      const state: StockIssueState = {
        ...initialState,
        issueMerchantSTN: pendingStockIssueRequests
      };
      expect(selectors.pendingIssuetoMerchantSTN.projector(state)).toEqual(
        pendingSTNS
      );
    });
    it('should return the pending merchandise STN selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIssuetoMerchantSTN.projector(
          pendingStockIssueRequests
        )
      ).toEqual(pendingRequestArray);
    });
  });
  describe('Testing Searching Pending Issues related selectors', () => {
    it('Should return the searched STN', () => {
      const searchedSTNS = requestStockTransferNoteAdaptor.setAll(
        searchedRequestArray,
        {
          ...requestStockTransferNoteAdaptor.getInitialState()
        }
      );
      const state: StockIssueState = {
        ...initialState,
        searchIssueResults: searchedPendingRequest
      };
      expect(selectors.searchIssueResults.projector(state)).toEqual(
        searchedSTNS
      );
    });
    it('should return the searched STN selector', () => {
      expect(
        selectors.stockIssueSelectors.selectSearchIssueResult.projector(
          searchedPendingRequest
        )
      ).toEqual(searchedRequestArray);
    });
    it('should return HasSearchIssueResults', () => {
      const state: StockIssueState = {
        ...initialState,
        hasSearchIssueResults: false
      };
      expect(
        selectors.stockIssueSelectors.selectHasSearchIssueResults.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return IsSearchingIssueResults', () => {
      const state: StockIssueState = {
        ...initialState,
        isSearchingIssues: false
      };
      expect(
        selectors.stockIssueSelectors.selectIsSearchingIssues.projector(state)
      ).toEqual(false);
    });
  });
  describe('Testing IsLoading Selectors for Issue Pending requests', () => {
    it('should return IsLoadingissueFactorySTNS selector', () => {
      const state: StockIssueState = {
        ...initialState,
        isLoadingIssueFactorySTN: false
      };
      expect(
        selectors.stockIssueSelectors.selectIsLoadingIssueFactorySTN.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return isLoadingIssueBoutiqueSTN selector', () => {
      const state: StockIssueState = {
        ...initialState,
        isLoadingIssueBoutiqueSTN: false
      };
      expect(
        selectors.stockIssueSelectors.selectIsLoadingIssueBoutiqueSTN.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return isLoadingIssueMerchantSTN selector', () => {
      const state: StockIssueState = {
        ...initialState,
        isLoadingIssueMerchantSTN: false
      };
      expect(
        selectors.stockIssueSelectors.selectIsLoadingIssueMerchantSTN.projector(
          state
        )
      ).toEqual(false);
    });
  });

  describe('Testing Count Related Selectors for Issue Pending requests', () => {
    const state: StockIssueState = {
      ...initialState,
      pendingBTQ_FAC_STNCount: 5,
      pendingBTQ_BTQ_STNCount: 10,
      pendingBTQ_MER_STNCount: 15,
      isLoadingIssueCount: false
    };
    it('should return pendingBTQ_FAC_STNCount selector', () => {
      expect(
        selectors.stockIssueSelectors.selectPendingBTQ_FAC_STNCount.projector(
          state
        )
      ).toEqual(5);
    });
    it('should return pendingBTQ_BTQ_STNCount selector', () => {
      expect(
        selectors.stockIssueSelectors.selectPendingBTQ_BTQ_STNCount.projector(
          state
        )
      ).toEqual(10);
    });
    it('should return pendingBTQ_MER_STNCount selector', () => {
      expect(
        selectors.stockIssueSelectors.selectPendingBTQ_MER_STNCount.projector(
          state
        )
      ).toEqual(15);
    });
    it('should return isLoadingIssueCount selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsLoadingIssueCount.projector(state)
      ).toEqual(false);
    });
  });

  describe('Testing Loading Selected Issue Related Selectors', () => {
    const state: StockIssueState = {
      ...initialState,
      selectedIssue: pendingSTN1,
      isLoadingSelectedIssue: false,
      hasSelectedIssue: true,
      isSelectedItemsLoading: false
    };
    it('should return selectedIssue selector', () => {
      expect(
        selectors.stockIssueSelectors.selectSelectedIssue.projector(state)
      ).toEqual(pendingSTN1);
    });
    it('should return isLoadingSelectedIssue selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsLoadingSelectedIssue.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return hasSelectedIssue selector', () => {
      expect(
        selectors.stockIssueSelectors.selectHasSelectedIssue.projector(state)
      ).toEqual(true);
    });
    it('should return IsSelectedItemsLoading selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsSelectedItemsLoading.projector(
          state
        )
      ).toEqual(false);
    });
  });
  describe('Testing ResetStockIssueList Related Selectors', () => {
    it('should return stockIssueListReset Selector', () => {
      const state: StockIssueState = {
        ...initialState,
        isStockIssueListReset: false
      };
      expect(
        selectors.stockIssueSelectors.selectIsStockIssueListReset.projector(
          state
        )
      ).toEqual(false);
    });
  });
  describe('Testing Error Related Selectors', () => {
    it('should return selectedError Selector', () => {
      const error: CustomErrors = {
        code: '503',
        traceId: 'E-303',
        timeStamp: '',
        error: null,
        message: 'Some error'
      };

      const state: StockIssueState = {
        ...initialState,
        error: error
      };
      expect(
        selectors.stockIssueSelectors.selectError.projector(state)
      ).toEqual(error);
    });
  });
  describe('Testing ApprovedItems Releated Selectors', () => {
    const issueItemsList = issueItemAdaptor.setAll(issueItemsArray, {
      ...issueItemAdaptor.getInitialState()
    });
    const state: StockIssueState = {
      ...initialState,
      approvedItems: issueItemsList,
      isApprovedItemsLoading: false,
      approvedItemsTotalCount: 10
    };
    it('should return approved Items', () => {
      expect(selectors.approvedItems.projector(state)).toEqual(issueItemsList);
    });
    it('should return approved Items selector', () => {
      expect(
        selectors.stockIssueSelectors.selectApprovedItems.projector(
          issueItemsList
        )
      ).toEqual(issueItemsArray);
    });
    it('should return isApprovedItemsLoading Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsApprovedItemsLoading.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return ApprovedItemsTotalCount Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectApprovedItemsTotalCount.projector(
          state
        )
      ).toEqual(10);
    });
  });

  describe('Testing SelectedItems Releated Selectors', () => {
    const issueItemsList = issueItemAdaptor.setAll(issueItemsArray, {
      ...issueItemAdaptor.getInitialState()
    });
    const state: StockIssueState = {
      ...initialState,
      selectedItems: issueItemsList,
      isSelectedItemsLoading: false,
      selectedItemsTotalCount: 10
    };
    it('should return selected Items', () => {
      expect(selectors.selectedItems.projector(state)).toEqual(issueItemsList);
    });
    it('should return selected Items selector', () => {
      expect(
        selectors.stockIssueSelectors.selectSelectedItems.projector(
          issueItemsList
        )
      ).toEqual(issueItemsArray);
    });
    it('should return isSelectedItemsLoading Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsSelectedItemsLoading.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return SelectedItemsTotalCount Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectSelectedItemsTotalCount.projector(
          state
        )
      ).toEqual(10);
    });
  });

  describe('Testing IssueItems Releated Selectors', () => {
    const issueItemsList = issueItemAdaptor.setAll(issueItemsArray, {
      ...issueItemAdaptor.getInitialState()
    });
    const state: StockIssueState = {
      ...initialState,
      issueItems: issueItemsList,
      isIssueItemsLoading: false,
      isItemsTotalCountLoaded: true,
      issueItemsTotalCount: 10,
      isItemsTotalCountLoading: false
    };
    it('should return issue Items', () => {
      expect(selectors.issueItems.projector(state)).toEqual(issueItemsList);
    });
    it('should return issue Items selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIssueItems.projector(issueItemsList)
      ).toEqual(issueItemsArray);
    });
    it('should return IsIssueItemsLoading Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsIssueItemsLoading.projector(state)
      ).toEqual(false);
    });
    it('should return issueItemsTotalCount Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIssueItemsTotalCount.projector(
          state
        )
      ).toEqual(10);
    });
    it('should return issueItemsTotalCountLoaded Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIssueItemsTotalCountLoaded.projector(
          state
        )
      ).toEqual(true);
      expect(
        selectors.stockIssueSelectors.selectIsItemsTotalCountLoaded.projector(
          state
        )
      ).toEqual(true);
    });
    it('should return issueItemsTotalCountLoading Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsItemsTotalCountLoading.projector(
          state
        )
      ).toEqual(false);
    });
  });

  describe('Testing Item Search Releated Selectors', () => {
    const searchedItemsList = issueItemAdaptor.setAll([item1], {
      ...issueItemAdaptor.getInitialState()
    });
    const state: StockIssueState = {
      ...initialState,
      isSearchingItems: false,
      hasSearchedItems: true,
      searchedItems: searchedItemsList,
      searchedIssueItemsCount: 1,
      isSearchIssueItemsCountLoaded: true
    };
    it('should return searched Items', () => {
      expect(selectors.searchedItems.projector(state)).toEqual(
        searchedItemsList
      );
    });
    it('should return searched items selector', () => {
      expect(
        selectors.stockIssueSelectors.selectSearchedItems.projector(
          searchedItemsList
        )
      ).toEqual([item1]);
    });
    it('should return isSearchingItems Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsSearchingItems.projector(state)
      ).toEqual(false);
    });
    it('should return hasSearchingItems Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectHasSearchedItems.projector(state)
      ).toEqual(true);
    });
    it('should return searchedIssuesItemsCount Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectSearchedIssueItemsCount.projector(
          state
        )
      ).toEqual(1);
    });
    it('should return SearchedissueItemsCountLoaded Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectSearchedissueItemsCountLoaded.projector(
          state
        )
      ).toEqual(true);
    });
  });
  describe('Testing ItemUpdate Related Selectors', () => {
    const state: StockIssueState = {
      ...initialState,
      isitemUpdating: false,
      isItemUpdated: true
    };
    it('should return isItemUpdated Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsItemUpdateStatus.projector(state)
      ).toEqual(true);
    });
    it('should return isItemUpdating Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsItemUpdating.projector(state)
      ).toEqual(false);
    });
  });
  describe('Testing AllItemUpdate Related Selectors', () => {
    const state: StockIssueState = {
      ...initialState,
      isUpdatingAllItems: false,
      isUpdatingAllItemsSuccess: true
    };
    it('should return isUpdatingAll Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsUpdatingAll.projector(state)
      ).toEqual(false);
    });
    it('should return isUpdatingAllSuccess Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsUpdatingAllSuccess.projector(
          state
        )
      ).toEqual(true);
    });
  });
  describe('Testing IssueConfirmation Related Selectors', () => {
    const state: StockIssueState = {
      ...initialState,
      confirmIssue: pendingSTN1,
      isItemIssued: true
    };
    it('should return confirmIssue Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectConfirmIssue.projector(state)
      ).toEqual(pendingSTN1);
      expect(
        selectors.stockIssueSelectors.selectConfirmationSrcDocNo.projector(
          state
        )
      ).toEqual(pendingSTN1.srcDocNo);
    });
    it('should return issueConfirmationStatus Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectConfirmIssueStatus.projector(state)
      ).toEqual(true);
    });
  });
  describe('Testing CourierDetails Related', () => {
    const state: StockIssueState = {
      ...initialState,
      courierDetails: [],
      isLoadingCourierDetails: false,
      hasCourierDetails: true
    };
    it('should return courierDetails Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectCourierDetails.projector(state)
      ).toEqual([]);
    });
    it('should return isLoadingCourierDetails Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsLoadingCourierDetails.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return hasCourierDetails Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectHasCourierDetails.projector(state)
      ).toEqual(true);
    });
  });
  describe('Testing Employee Related Selectors', () => {
    const state: StockIssueState = {
      ...initialState,
      employeeCodes: [],
      employeeDetails: []
    };
    it('should return employeeCodes', () => {
      expect(
        selectors.stockIssueSelectors.selectEmployeeCodes.projector(state)
      ).toEqual([]);
    });
    it('should return employeeDetails', () => {
      expect(
        selectors.stockIssueSelectors.selectEmployeeDetails.projector(state)
      ).toEqual([]);
    });
  });
  describe('Testing Products group and category Related Selectors', () => {
    const state: StockIssueState = {
      ...initialState,
      productGroups: [],
      productCategories: []
    };
    it('should return employeeCodes', () => {
      expect(
        selectors.stockIssueSelectors.selectProductGroups.projector(state)
      ).toEqual([]);
    });
    it('should return employeeDetails', () => {
      expect(
        selectors.stockIssueSelectors.selectProductCategories.projector(state)
      ).toEqual([]);
    });
  });
  describe('Testing Filter and Sort Related Selectors', () => {
    const state: StockIssueState = {
      ...initialState,
      filterDataAllProducts: null,
      filterDataSelectedProducts: null,
      sortDataAllProducts: [],
      sortDataSelectedProducts: []
    };
    it('should return filterAllProducts Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectfilterDataApprovedProducts.projector(
          state
        )
      ).toEqual(null);
    });
    it('should return filterSelectorProducts Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectfilterDataSelectedProducts.projector(
          state
        )
      ).toEqual(null);
    });
    it('should return sortAllProducts Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectSortDataApprovedProducts.projector(
          state
        )
      ).toEqual([]);
    });
    it('should return sortSelectedProducts Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectSortDataSelectedProducts.projector(
          state
        )
      ).toEqual([]);
    });
  });
  describe('Testing items Releated Selectors', () => {
    const issueItemsList = issueItemAdaptor.setAll(issueItemsArray, {
      ...issueItemAdaptor.getInitialState()
    });
    const state: StockIssueState = {
      ...initialState,
      itemsCount: 10,
      isItemsLoading: false,
      isItemsLoaded: true,
      items: issueItemsList
    };
    it('should return Items', () => {
      expect(selectors.items.projector(state)).toEqual(issueItemsList);
    });
    it('should return Items selector', () => {
      expect(
        selectors.stockIssueSelectors.selectItems.projector(issueItemsList)
      ).toEqual(issueItemsArray);
    });
    it('should return IsItemsLoading Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsItemsLoading.projector(state)
      ).toEqual(false);
    });
    it('should return issueItemsCount Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectItemsCount.projector(state)
      ).toEqual(10);
    });
    it('should return isItemsLoaded Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsItemsLoaded.projector(state)
      ).toEqual(true);
    });
    it('should return issueItemsTotalCountLoading Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsItemsTotalCountLoading.projector(
          state
        )
      ).toEqual(false);
    });
  });
  describe('Testing UpdateItemListStatusResponse Releated Selectors', () => {
    const response: RequestList = {
      id: 1,
      reqDocNo: 1,
      srcLocationCode: '',
      destLocationCode: '',
      totalRequestedQuantity: 1,
      acceptedQuantity: 1,
      approvedQuantity: 1,
      status: '',
      reqDocDate: moment(),
      requestType: '',
      requestRemarks: '',
      totalElements: 0
    };
    const state: StockIssueState = {
      ...initialState,
      updateItemListStatusResponse: response
    };
    it('should return updateItemListStatusResponse Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectUpdateItemListStatusResponse.projector(
          state
        )
      ).toEqual(response);
    });
  });
  describe('Testing TotalMeasuredWeightAndValue Related Selectors', () => {
    const state: StockIssueState = {
      ...initialState,
      totalMeasuredWeight: 10,
      totalMeasuredValue: 10000
    };
    it('should return TotalMeasuedWeight', () => {
      expect(
        selectors.stockIssueSelectors.selectTotalMeasuredWeight.projector(state)
      ).toEqual(10);
    });
    it('should return TotalMeasuredValue', () => {
      expect(
        selectors.stockIssueSelectors.selectTotalMeasuredValue.projector(state)
      ).toEqual(10000);
    });
  });
  describe('Testing Issue HistoryListing Related Selectors', () => {
    const issueHistoryList = requestStockTransferNoteAdaptor.setAll(
      pendingRequestArray,
      {
        ...requestStockTransferNoteAdaptor.getInitialState()
      }
    );

    const state: StockIssueState = {
      ...initialState,
      issueHistory: pendingStockIssueRequests,
      isLoadingHistory: false,
      issueHistoryCount: 8
    };
    it('should return issueHistory', () => {
      expect(selectors.issueHistory.projector(state)).toEqual(issueHistoryList);
    });
    it('should return the pending Factory STN selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIssueHistory.projector(
          pendingStockIssueRequests
        )
      ).toEqual(pendingRequestArray);
    });
    it('should return isLoadingHistory Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsLoadingIssueHistory.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return issueHistoryCount Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIssueHistoryCount.projector(state)
      ).toEqual(8);
    });
  });
  describe('Testing Loading Selected HistoryIssue Related Selectors', () => {
    const state: StockIssueState = {
      ...initialState,
      selectedHistory: pendingSTN1,
      isLoadingSelectedHistory: false,
      hasSelectedHistory: true
    };
    it('should return selectedIHistoryssue selector', () => {
      expect(
        selectors.stockIssueSelectors.selectSelectedHistory.projector(state)
      ).toEqual(pendingSTN1);
    });
    it('should return isLoadingSelectedHistory selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsLoadingSelectedHistory.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return hasSelectedHistory selector', () => {
      expect(
        selectors.stockIssueSelectors.selectHasSelectedHistory.projector(state)
      ).toEqual(true);
    });
  });
  describe('Testing ApprovedItems Releated Selectors', () => {
    const historyItemsList = issueItemAdaptor.setAll(issueItemsArray, {
      ...issueItemAdaptor.getInitialState()
    });
    const state: StockIssueState = {
      ...initialState,
      historyItems: historyItemsList,
      isHistoryItemsLoaded: true,
      isLoadingHistoryItems: false,
      historyItemsTotalCount: 10,
      isLoadingHistoryItemsTotalCount: false,
      historyItemsCount: 10
    };
    it('should return historyItems', () => {
      expect(selectors.historyItems.projector(state)).toEqual(historyItemsList);
    });
    it('should return historyItems selector', () => {
      expect(
        selectors.stockIssueSelectors.selectHistoryItems.projector(
          historyItemsList
        )
      ).toEqual(issueItemsArray);
    });
    it('should return isLoadingHistoryItems Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsLoadingHistoryItems.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return isHistoryItemsLoaded Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsHistoryItemsLoaded.projector(
          state
        )
      ).toEqual(true);
    });
    it('should return historyItemsTotalCount Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectHistoryItemsTotalCount.projector(
          state
        )
      ).toEqual(10);
      expect(
        selectors.stockIssueSelectors.selectHistoryCount.projector(state)
      ).toEqual(10);
    });
    it('should return isLoadingHistoryItemsTotalCount Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsLoadingHistoryItemsTotalCount.projector(
          state
        )
      ).toEqual(false);
    });
  });
  describe('Testing AdvancedFilterData Related Selectors', () => {
    const filterData: IssueAdvanceFilterPayload = {
      docFromDate: null,
      docToDate: null,
      locationCode: null,
      fiscalYear: null,
      docNo: null
    };
    const state: StockIssueState = {
      ...initialState,
      advancedFilterData: filterData
    };
    it('should return advanceFilter Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectAdvancedFilterData.projector(state)
      ).toEqual(filterData);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    const state: StockIssueState = {
      ...initialState,
      isLoading: true
    };
    it('should return selectIsLoading Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsLoading.projector(
          state
        )
      ).toBeTruthy();
    });
  });

  // cancel STN
  describe('Testing selectIsLoadingIssueBoutiqueCancelSTN Related Selectors', () => {
    const state: StockIssueState = {
      ...initialState,
      isLoadingIssueCancelSTN: true
    };
    it('should return selectIsLoadingIssueBoutiqueCancelSTN Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIsLoadingIssueBoutiqueCancelSTN.projector(
          state
        )
      ).toBeTruthy();
    });
  });

  describe('Testing selectPendingBTQ_BTQ_STNCancelCount Related Selectors', () => {
    const state: StockIssueState = {
      ...initialState,
      pendingBTQ_BTQ_STNCancelCount: 5
    };
    it('should return selectPendingBTQ_BTQ_STNCancelCount Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectPendingBTQ_BTQ_STNCancelCount.projector(
          state
        )
      ).toBe(5);
    });
  });

  describe('Testing selectCancelIssueItemsCount Related Selectors', () => {
    const state: StockIssueState = {
      ...initialState,
      cancelIssueItemsCount: 5
    };
    it('should return selectCancelIssueItemsCount Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectCancelIssueItemsCount.projector(
          state
        )
      ).toBe(5);
    });
  });

  describe('Testing selectCancelIssueSTNDetails Related Selectors', () => {
    const payload: StockRequestNote = {
      carrierDetails: {},
      currencyCode: 'INR',
      destDocDate: moment(),
      destDocNo: 222,
      destLocationCode: 'test Loc',
      destLocationDescription: 'test Loc Desc',
      id: 1,
      orderType: null,
      otherDetails: {},
      reqDocDate: moment(),
      reqDocNo: 111,
      reqLocationCode: 'test loc',
      requestType: 'FAC',
      srcDocDate: moment(),
      srcDocNo: 222,
      srcFiscalYear: 2019,
      srcLocationCode: 'test loc',
      srcLocationDescription: 'test loc desc',
      status: 'APPROVED',
      totalAvailableQuantity: 100,
      totalAvailableValue: 10000,
      totalAvailableWeight: 10,
      totalMeasuredQuantity: 100,
      totalMeasuredValue: 10000,
      totalMeasuredWeight: 10,
      weightUnit: 'gms',
      courierReceivedDate: null,
      reasonForDelay: null,
      remarks: null,
      transferType: null
    };
    const state: StockIssueState = {
      ...initialState,
      cancelIssueSTNDetails: payload
    };
    it('should return selectCancelIssueSTNDetails Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectCancelIssueSTNDetails.projector(
          state
        )
      ).toBe(payload);
    });
  });

  describe('Testing selectCancelIssueSTNRes Related Selectors', () => {
    const payload: StockRequestNote = {
      carrierDetails: {},
      currencyCode: 'INR',
      destDocDate: moment(),
      destDocNo: 222,
      destLocationCode: 'test Loc',
      destLocationDescription: 'test Loc Desc',
      id: 1,
      orderType: null,
      otherDetails: {},
      reqDocDate: moment(),
      reqDocNo: 111,
      reqLocationCode: 'test loc',
      requestType: 'FAC',
      srcDocDate: moment(),
      srcDocNo: 222,
      srcFiscalYear: 2019,
      srcLocationCode: 'test loc',
      srcLocationDescription: 'test loc desc',
      status: 'APPROVED',
      totalAvailableQuantity: 100,
      totalAvailableValue: 10000,
      totalAvailableWeight: 10,
      totalMeasuredQuantity: 100,
      totalMeasuredValue: 10000,
      totalMeasuredWeight: 10,
      weightUnit: 'gms',
      courierReceivedDate: null,
      reasonForDelay: null,
      remarks: null,
      transferType: null
    };

    const state: StockIssueState = {
      ...initialState,
      cancelIssuesSTNRes: payload
    };
    it('should return selectCancelIssueSTNRes Selector', () => {
      expect(
        selectors.stockIssueSelectors.selectCancelIssueSTNRes.projector(state)
      ).toBe(payload);
    });
  });

  describe('Testing pendingIssuetoBoutiqueCancelSTN related Selectors', () => {
    it('Should return the pendingIssuetoBoutiqueCancelSTN', () => {
      const pendingSTNS = requestStockTransferNoteAdaptor.setAll(
        pendingRequestArray,
        {
          ...requestStockTransferNoteAdaptor.getInitialState()
        }
      );
      const state: StockIssueState = {
        ...initialState,
        issueCancelSTN: pendingStockIssueRequests
      };
      expect(
        selectors.pendingIssuetoBoutiqueCancelSTN.projector(state)
      ).toEqual(pendingSTNS);
    });
    it('should return the pendingIssuetoBoutiqueCancelSTN ` selector', () => {
      expect(
        selectors.stockIssueSelectors.selectIssuetoBoutiqueCancelSTN.projector(
          pendingStockIssueRequests
        )
      ).toEqual(pendingRequestArray);
    });
  });

  describe('Testing cancelIssueItems Releated Selectors', () => {
    const issueItemsList = issueItemAdaptor.setAll(issueItemsArray, {
      ...issueItemAdaptor.getInitialState()
    });
    const state: StockIssueState = {
      ...initialState,
      cancelIssueItems: issueItemsList
    };
    it('should return cancelIssueItems', () => {
      expect(selectors.cancelIssueItems.projector(state)).toEqual(
        issueItemsList
      );
    });
    it('should return cancelIssueItems selector', () => {
      expect(
        selectors.stockIssueSelectors.selectCancelIssueItems.projector(
          issueItemsList
        )
      ).toEqual(issueItemsArray);
    });
  });
});
