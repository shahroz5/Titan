import {
  Column,
  ConfirmIssuePayload,
  CustomErrors,
  Filter,
  IssueAdvanceFilterPayload,
  IssueInventoryItem,
  LoadCancelIssuesPayload,
  LoadCancelIssuesSTNPayload,
  LoadCancelIssuetemsPayload,
  LoadHistoryRequestPayload,
  LoadIssueItemPayload,
  LoadIssueItemsTotalCountPayload,
  LoadIssueItemsTotalCountSuccessPayload,
  LoadPendingIssuePayload,
  LoadSelectedPayload,
  LoadStockIssueHistoryItemsPayload,
  MeasuredWeightAndValuePayload,
  ProductCategory,
  ProductGroup,
  RequestList,
  SearchPendingPayload,
  StockIssueAPIRequestTypesEnum,
  StockIssueSelectedHistoryPayload,
  StockRequestNote,
  StoreUser,
  UpdateAllItemPayload,
  UpdateItemFailurePayload,
  UpdateItemListStatusPayload,
  UpdateItemPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import * as actions from './stock-issue.actions';
import { initialState, StockIssueReducer } from './stock-issue.reducer';
import { StockIssueState } from './stock-issue.state';

describe('Stock Issue Reducer Testing Suite', () => {
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

  const pendingRequestArray = [pendingSTN1, pendingSTN2];
  const issueItemsArray = [item1, item2];

  describe('Testing Load pending Issue to Factory Requests Functionality', () => {
    it('LoadFactoryIssuePendingSTN should be called', () => {
      const payload: LoadPendingIssuePayload = {
        requestType: 'FAC',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new actions.LoadFactoryIssuePendingSTN(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueFactorySTN).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadFactoryIssuePendingSTNSuccess should retur pending list', () => {
      const action = new actions.LoadFactoryIssuePendingSTNSuccess({
        response: pendingRequestArray,
        count: 2
      });
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.issueFactorySTN.ids.length).toBe(2);
      expect(result.isLoadingIssueFactorySTN).toBe(false);
    });
    it('LoadFactoryIssuePendingSTNFailure should return error', () => {
      const action = new actions.LoadFactoryIssuePendingSTNFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing Load pending Issue to OtherBTQ Requests Functionality', () => {
    it('LoadBoutiqueIssuePendingSTN should be called', () => {
      const payload: LoadPendingIssuePayload = {
        requestType: 'BTQ',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new actions.LoadBoutiqueIssuePendingSTN(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueBoutiqueSTN).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadBoutiqueIssuePendingSTNSuccess should retur pending list', () => {
      const action = new actions.LoadBoutiqueIssuePendingSTNSuccess({
        response: pendingRequestArray,
        count: 2
      });
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.issueBoutiqueSTN.ids.length).toBe(2);
      expect(result.isLoadingIssueBoutiqueSTN).toBe(false);
    });
    it('LoadBoutiqueIssuePendingSTNFailure should return error', () => {
      const action = new actions.LoadBoutiqueIssuePendingSTNFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing Load pending Issue by Merchandise Requests Functionality', () => {
    it('LoadMerchantIssuePendingSTN should be called', () => {
      const payload: LoadPendingIssuePayload = {
        requestType: 'BTQ',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new actions.LoadMerchantIssuePendingSTN(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueMerchantSTN).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadMerchantIssuePendingSTNSuccess should retur pending list', () => {
      const action = new actions.LoadMerchantIssuePendingSTNSuccess({
        response: pendingRequestArray,
        count: 2
      });
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.issueMerchantSTN.ids.length).toBe(2);
      expect(result.isLoadingIssueMerchantSTN).toBe(false);
    });
    it('LoadMerchantIssuePendingSTNFailure should return error', () => {
      const action = new actions.LoadMerchantIssuePendingSTNFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing Search pending Issue Functionality', () => {
    it('SearchPendingIssues should be called', () => {
      const payload: SearchPendingPayload = {
        reqDocNo: 111,
        requestType: 'FAC'
      };
      const action = new actions.SearchPendingIssues(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isSearchingIssues).toEqual(true);
      expect(result.hasSearchIssueResults).toEqual(false);
      expect(result.searchIssueResults).toEqual({
        ids: [],
        entities: Object({})
      });
      expect(result.error).toEqual(null);
    });
    it('SearchPendingIssuesSuccess should retur pending list', () => {
      const action = new actions.SearchPendingIssuesSuccess(
        pendingRequestArray
      );
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.isSearchingIssues).toEqual(false);
      expect(result.hasSearchIssueResults).toEqual(true);
      expect(result.searchIssueResults.ids.length).toBe(2);
    });
    it('SearchPendingIssuesFailure should return error', () => {
      const action = new actions.SeachPendingIssuesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isSearchingIssues).toEqual(false);
      expect(result.hasSearchIssueResults).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing CLareing Search Functionality', () => {
    it('SearchClear should be called', () => {
      const action = new actions.SearchClear();

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.searchIssueResults).toEqual({
        ids: [],
        entities: Object({})
      });
    });
  });

  describe('Testing Resetting Stock Issue pending Functionality', () => {
    it('ResetStockIssueList should be called', () => {
      const action = new actions.ResetStockIssueList();

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.issueBoutiqueSTN).toEqual({
        ids: [],
        entities: Object({})
      });
      expect(result.issueFactorySTN).toEqual({
        ids: [],
        entities: Object({})
      });
      expect(result.issueMerchantSTN).toEqual({
        ids: [],
        entities: Object({})
      });
      expect(result.error).toEqual(null);
      expect(result.isStockIssueListReset).toEqual(true);
    });
  });

  describe('Testing Loading Selected Issue Functionality', () => {
    it('LoadSelectedIssue should be called', () => {
      const payload: LoadSelectedPayload = {
        id: 1,
        requestType: 'FAC'
      };
      const action = new actions.LoadSelectedIssue(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingSelectedIssue).toEqual(true);
      expect(result.selectedIssue).toEqual(null);
      expect(result.hasSelectedIssue).toEqual(false);
      expect(result.isItemsTotalCountLoaded).toEqual(null);

      expect(result.approvedItems.ids.length).toBe(0);
      expect(result.isApprovedItemsLoading).toEqual(false);
      expect(result.approvedItemsTotalCount).toEqual(0);

      expect(result.selectedItems.ids.length).toBe(0);
      expect(result.isSelectedItemsLoading).toEqual(false);
      expect(result.selectedItemsTotalCount).toEqual(0);

      expect(result.searchedItems.ids.length).toBe(0);
      expect(result.isSearchingItems).toEqual(false);
      expect(result.hasSearchedItems).toEqual(false);

      expect(result.items.ids.length).toBe(0);
      expect(result.isItemsLoading).toEqual(false);
      expect(result.isItemsLoaded).toEqual(false);
      expect(result.itemsCount).toBe(0);
      expect(result.isItemIssued).toEqual(null);
      expect(result.error).toEqual(null);
    });
    it('LoadSelectedIssueSuccess should return selectedIssue', () => {
      const action = new actions.LoadSelectedIssueSuccess(pendingSTN1);
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.selectedIssue).toEqual(pendingSTN1);
      expect(result.isLoadingSelectedIssue).toEqual(false);
      expect(result.hasSelectedIssue).toEqual(true);
    });
    it('LoadSelectedIssueFailure should return selectedIssue', () => {
      const action = new actions.LoadSelectedIssueFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing Loading Issue Items Functionality', () => {
    it('LoadItems should be called', () => {
      const payload: LoadIssueItemPayload = {
        id: 1,
        itemCode: '1000111112222',
        lotNumber: '1AOB111',
        requestType: 'FAC',
        storeType: 'L1',
        status: 'APPROVED',
        pageIndex: 0,
        pageSize: 10
        // sort?: Map<string, string>;
        // filter?: { key: string; value: any[] }[];
      };
      const action = new actions.LoadItems(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isItemsLoading).toEqual(true);
      expect(result.error).toEqual(null);
      expect(result.isItemsLoaded).toEqual(false);
    });
    it('LoadItemsSuccess should return selectedIssue', () => {
      const action = new actions.LoadItemsSuccess({
        items: issueItemsArray,
        count: 10
      });
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.items.ids.length).toBe(2);
      expect(result.itemsCount).toEqual(10);
      expect(result.isItemsLoading).toEqual(false);
      expect(result.isItemsLoaded).toEqual(true);
    });
    it('LoadItemsFailure should return selectedIssue', () => {
      const action = new actions.LoadItemsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isItemsLoading).toEqual(false);
      expect(result.isItemsLoaded).toEqual(false);
    });
  });

  describe('Testing Clear Items Functionality', () => {
    it('ClearItems should be called', () => {
      const action = new actions.ClearItems();

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.items.ids.length).toEqual(0);
    });
  });
  describe('Testing LoadIssueItemsTotalCount Functionality', () => {
    it('LoadIssueItemsTotalCount should be called', () => {
      const payload: LoadIssueItemsTotalCountPayload = {
        id: 11,
        requestType: 'FAC',
        storeType: 'L1'
      };
      const action = new actions.LoadIssueItemsTotalCount(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isItemsTotalCountLoading).toEqual(true);
      expect(result.isItemsTotalCountLoaded).toEqual(null);
      expect(result.error).toEqual(null);
    });
    it('LoadIssueItemsTotalCountSuccess should be called', () => {
      const payload: LoadIssueItemsTotalCountSuccessPayload = {
        approvedItemsTotalCount: 10,
        selectedItemsTotalCount: 5,
        // searchedItemsCount: number;
        historyItemsTotalCount: 0
      };
      const action = new actions.LoadIssueItemsTotalCountSuccess(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.approvedItemsTotalCount).toEqual(10);
      expect(result.selectedItemsTotalCount).toEqual(5);
      expect(result.historyItemsCount).toEqual(0);
    });
    it('LoadIssueItemsTotalCountFailure should be called', () => {
      const action = new actions.LoadIssueItemsTotalCountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isItemsTotalCountLoading).toEqual(false);
      expect(result.isItemsTotalCountLoaded).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing UpdateAllItems Functionality', () => {
    it('updateAllItems should be called', () => {
      const payload: UpdateAllItemPayload = {
        requestType: 'FAC',
        storeType: 'L1',
        id: 1,
        itemId: '11001111',
        status: 'APPROVED'
      };
      const action = new actions.UpdateAllItems(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isUpdatingAllItems).toEqual(true);
      expect(result.isUpdatingAllItemsSuccess).toEqual(null);
      expect(result.error).toEqual(null);
    });
    it('updateAllItemsSuccess should be called', () => {
      const payload = true;
      const action = new actions.UpdateAllItemsSuccess(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isUpdatingAllItems).toEqual(false);
      expect(result.isUpdatingAllItemsSuccess).toEqual(true);
    });
    it('updateAllItemsFailure should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdateAllItemsFailure(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.error.message).toEqual('Some Error');
      expect(result.isUpdatingAllItems).toEqual(false);
      expect(result.isUpdatingAllItemsSuccess).toEqual(false);
    });
  });

  // describe('Testing ValidateItem Functionality', () => {
  //   it('ValidateItem should be called', () => {
  //     const payload: ItemToleranceValidate = {
  //       itemId: '11100000AB11',
  //       productGroupCode: '71',
  //       availableWeight: 10.1,
  //       measuredWeight: 10.08,
  //       measuredQuantity: 2,
  //       availableQuantity: 2
  //     };
  //     const action = new actions.ValidateItem(payload);
  //     const result: StockIssueState = StockIssueReducer(initialState, action);
  //     expect(result.items.ids[0]).toEqual(payload.itemId);
  //     expect(result.error).toEqual(null);
  //   });
  //   it('ValidateItemSuccess should be called', () => {
  //     const payload: {
  //       itemId: string;
  //       isSuccess: boolean;
  //     } = {
  //       itemId: '11100000AB11',
  //       isSuccess: true
  //     };
  //     const action = new actions.ValidateItemSuccess(payload);
  //     const result: StockIssueState = StockIssueReducer(initialState, action);
  //     expect(result.items.ids[0]).toEqual(payload.itemId);
  //   });
  //   it('ValidateItemFailure should be called', () => {
  //     const payload: {
  //       itemId: string;
  //       error: CustomErrors;
  //     } = {
  //       itemId: '11100000AB11',
  //       error: CustomErrorAdaptor.fromJson(Error('Some Error'))
  //     };

  //     const action = new actions.ValidateItemFailure(payload);
  //     const result: StockIssueState = StockIssueReducer(initialState, action);
  //     expect(result.error.message).toEqual('Some Error');
  //     expect(result.items.ids[0]).toEqual(payload.itemId);
  //   });
  // });
  describe('Testing UpdateItem Functionality', () => {
    it('updateItem should be called', () => {
      const payload: UpdateItemPayload = {
        requestType: 'FAC',
        storeType: 'L1',
        id: 1,
        itemId: '111000AB11',
        newUpdate: {
          measuredQuantity: 10.1,
          status: 'APPROVED',
          inventoryId: '12345676DFGH',
          measuredWeight: 10.2
        },
        actualDetails: {
          measuredQuantity: 10.1,
          status: 'APPROVED',
          inventoryId: '12345676DFGH',
          measuredWeight: 10.2
        }
      };
      const action = new actions.UpdateItem(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isItemUpdated).toEqual(false);
      expect(result.isitemUpdating).toEqual(true);
      expect(result.updateItemSuccess).toEqual(null);
      expect(result.error).toEqual(null);
    });
    it('updateItemsSuccess should be called', () => {
      const payload = item1;
      const action = new actions.UpdateItemSuccess(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isitemUpdating).toEqual(false);
      expect(result.isItemUpdated).toEqual(true);
      expect(result.updateItemSuccess).toEqual(true);
    });
    it('updateItemsFailure should be called', () => {
      const payload: UpdateItemFailurePayload = {
        itemId: 111110,
        actualDetails: {
          measuredQuantity: 10.1,
          status: 'APPROVED',
          inventoryId: '12345676DFGH',
          measuredWeight: 10.2
        },
        error: CustomErrorAdaptor.fromJson(Error('Some Error'))
      };

      const action = new actions.UpdateItemFailure(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isitemUpdating).toEqual(false);
      expect(result.isItemUpdated).toEqual(false);
      expect(result.updateItemSuccess).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });
  describe('Testing ConfirmIssue Functionality', () => {
    it('confirmIssue Should be called', () => {
      const payload: ConfirmIssuePayload = {
        requestType: 'FAC',
        id: 1,
        data: {
          carrierDetails: {
            data: 'test data',
            type: 'test data'
          },
          remarks: 'remarks'
        }
      };
      const action = new actions.ConfirmIssue(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isItemIssued).toEqual(null);
      expect(result.error).toEqual(null);
    });
    it('confirmIssueSuccess should be called', () => {
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
      const action = new actions.ConfirmIssueSuccess(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isItemIssued).toEqual(true);
      expect(result.confirmIssue).toEqual(payload);
    });
    it('confirmIssueFailure should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.ConfirmIssueFailure(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.isItemIssued).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadCourierDetails Functionality', () => {
    it('loadCourierDeatails Should be called', () => {
      const payload = 'HNR';
      const action = new actions.LoadCourierDetails(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingCourierDetails).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('loadCourierDetailsSuccess should be called', () => {
      const payload: string[] = [];

      const action = new actions.LoadCourierDetailsSuccess(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.courierDetails.length).toEqual(0);
      expect(result.isLoadingCourierDetails).toEqual(false);
      expect(result.hasCourierDetails).toEqual(true);
    });
    it('loadCourierDetailsFailure should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadCourierDetailsFailure(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.hasCourierDetails).toEqual(false);
      expect(result.isLoadingCourierDetails).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing loadEmployeeCodes Functionality', () => {
    it('loadEmployeeCodes Should be called', () => {
      const action = new actions.LoadEmployeeCodes();

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('loadingEmployeeCodesSuccess should be called', () => {
      const payload: string[] = [];

      const action = new actions.LoadEmployeeCodesSuccess(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.employeeCodes.length).toEqual(0);
      expect(result.isLoading).toEqual(false);
      expect(result.error).toEqual(null);
    });
    it('loadCourierDetailsFailure should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadEmployeeCodesFailure(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });
  describe('Testing loadEmployeeDetails Functionality', () => {
    it('loadEmployeeDetails Should be called', () => {
      const payload = '111';
      const action = new actions.LoadEmployeeDetails(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('loadEmployeeDetailsSuccess should be called', () => {
      const payload: StoreUser[] = [];

      const action = new actions.LoadEmployeeDetailsSuccess(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.employeeDetails.length).toEqual(0);
      expect(result.isLoading).toEqual(false);
      expect(result.error).toEqual(null);
    });
    it('loadEmployeeDetailsFailure should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadEmployeeCodesFailure(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadingProductCategory Functionality', () => {
    it('loadProductCategories Should be called', () => {
      const action = new actions.LoadProductCategories();

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('loadProductCategoriesSuccess should be called', () => {
      const payload: ProductCategory[] = [];

      const action = new actions.LoadProductCategoriesSuccess(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.productCategories.length).toEqual(0);
      expect(result.isLoading).toEqual(false);
      expect(result.error).toEqual(null);
    });
    it('loadProductCategoriesFailure should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadProductCategoriesFailure(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadingProductGroup Functionality', () => {
    it('loadProductGroup Should be called', () => {
      const action = new actions.LoadProductGroups();

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('loadProductGroupSuccess should be called', () => {
      const payload: ProductGroup[] = [];

      const action = new actions.LoadProductGroupsSuccess(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.productGroups.length).toEqual(0);
      expect(result.isLoading).toEqual(false);
      expect(result.error).toEqual(null);
    });
    it('loadProductGroupFailure should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadProductGroupsFailure(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadingStuddedProductGroup Functionality', () => {
    it('loadStuddedProductGroup Should be called', () => {
      const action = new actions.LoadStuddedProductGroups();

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.error).toEqual(null);
    });
    it('loadStuddedProductGroupSuccess should be called', () => {
      const payload = [];

      const action = new actions.LoadStuddedProductGroupsSuccess(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.studdedProductGroups.length).toEqual(0);
      expect(result.isLoading).toEqual(false);
      expect(result.error).toEqual(null);
    });
    it('loadStuddedProductGroupFailure should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadStuddedProductGroupsFailure(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing SetFilter for products Functionality', () => {
    const payload: { [key: string]: Filter[] } = {
      ['productCategory']: [{ id: 1, description: 'AA', selected: true }]
    };
    it('SetFilterDataApprovedProducts should be called', () => {
      const action = new actions.SetFilterDataApprovedProducts(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.filterDataAllProducts).toEqual(payload);
    });
    it('SetFilterDataSelectedProducts should be called', () => {
      const action = new actions.SetFilterDataSelectedProducts(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.filterDataSelectedProducts).toEqual(payload);
    });
  });

  describe('Testing SetSort for products Functionality', () => {
    const payload: Column[] = [];
    it('SetSortDataApprovedProducts should be called', () => {
      const action = new actions.SetSortDataApprovedProducts(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.sortDataAllProducts.length).toEqual(0);
    });
    it('SetSortDataSelectedProducts should be called', () => {
      const action = new actions.SetSortDataSelectedProducts(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.sortDataSelectedProducts.length).toEqual(0);
    });
  });
  describe('Testing ClearSortAndFilter Functionality', () => {
    it('clearFilter should be called', () => {
      const action = new actions.ClearSortAndFilter();
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.filterDataAllProducts).toEqual({});
      expect(result.filterDataSelectedProducts).toEqual({});
      expect(result.sortDataAllProducts.length).toEqual(0);
      expect(result.sortDataSelectedProducts.length).toEqual(0);
    });
  });
  describe('Testing ResetError Functionality', () => {
    it('resetError should be called', () => {
      const action = new actions.ResetError();
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error).toEqual(null);
    });
  });

  describe('Testing UpdateItemListStatus Functionality', () => {
    it('UpdateItemListStatus should be called', () => {
      const payload: UpdateItemListStatusPayload = {
        type: 'BTQ',
        id: 11,
        requestGroup: 'IBT',
        itemIds: [],
        remarks: 'test data'
      };
      const action = new actions.UpdateItemListStatus(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('UpdateItemListStatusSuccess should be called', () => {
      const payload: RequestList = {
        id: 1,
        reqDocNo: 101,
        srcLocationCode: 'URB',
        destLocationCode: 'HNR',
        totalRequestedQuantity: 2,
        acceptedQuantity: 1,
        approvedQuantity: 2,
        status: 'CANCELLED',
        reqDocDate: moment(),
        requestType: 'BTQ',
        requestRemarks: 'testData',
        totalElements: 5
      };
      const action = new actions.UpdateItemListStatusSuccess(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error).toEqual(null);
      expect(result.updateItemListStatusResponse).toEqual(payload);
    });
    it('UpdateItemListStatusFailure should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.UpdateItemListStatusFailure(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadingTotalMeasuredWeightAndValue Functionality', () => {
    it('LoadTotalMeasuredWeightAndValue Should be called', () => {
      const payload: LoadSelectedPayload = {
        id: 1,
        requestType: 'FAC'
      };
      const action = new actions.LoadTotalMeasuredWeightAndValue(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.error).toEqual(null);
    });
    it('LoadTotalMeasuredWeightAndValueSuccess should be called', () => {
      const payload: MeasuredWeightAndValuePayload = {
        currencyCode: 'INR',
        totalMeasuredQuantity: 2,
        totalMeasuredValue: 10000,
        totalMeasuredWeight: 10,
        weightUnit: 'gms'
      };

      const action = new actions.LoadTotalMeasuredWeightAndValueSuccess(
        payload
      );
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.totalMeasuredValue).toEqual(10000);
      expect(result.totalMeasuredWeight).toEqual(10);
    });
    it('LoadTotalMeasuredWeightAndValueFailure should be called', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadTotalMeasuredWeightAndValueFailure(
        payload
      );
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('Some Error');
    });
  });
  describe('Testing Load Issue History Functionality', () => {
    it('LoadIssueHistory should be called', () => {
      const payload: LoadHistoryRequestPayload = {
        payload: {
          actionType: 'ISSUE',
          dateRangeType: 'TODAY',
          destDocNo: null,
          destFiscalYear: null,
          endDate: null,
          locationCode: null,
          srcDocNo: null,
          srcFiscalYear: null,
          startDate: null,
          statuses: []
        },
        pageSize: 0,
        pageIndex: 10,
        sort: [],
        transferType: 'BTQ_FAC'
      };
      const action = new actions.LoadIssueHistory(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingHistory).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadIssueHistorySuccess should return pending list', () => {
      const payload: { response: StockRequestNote[]; count: number } = {
        response: pendingRequestArray,
        count: 2
      };
      const action = new actions.LoadIssueHistorySuccess(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.issueHistory.ids.length).toBe(2);
      expect(result.issueHistoryCount).toEqual(2);
      expect(result.isLoadingHistory).toBe(false);
    });
    it('LoadIssueHistoryFailure should return error', () => {
      const action = new actions.LoadIssueHistoryFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingHistory).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing ResetLoadedHistory Functionality', () => {
    it('ResetLoadedHistory should be called', () => {
      const action = new actions.ResetLoadedHistory();
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.issueHistory.ids.length).toBe(0);
      expect(result.issueHistoryCount).toBe(0);
    });
  });

  describe('Testing Loading Selected History Functionality', () => {
    it('LoadSelectedHistory should be called', () => {
      const payload: StockIssueSelectedHistoryPayload = {
        actionType: 'ISSUE',
        id: 1,
        type: 'BTW',
        isL1L2Store: true,
        isL3Store: false
      };
      const action = new actions.LoadSelectedHistory(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingSelectedHistory).toEqual(true);
      expect(result.isLoadingHistoryItems).toEqual(false);
      expect(result.isHistoryItemsLoaded).toEqual(false);
      expect(result.historyItems.ids.length).toEqual(0);

      expect(result.historyItemsCount).toBe(0);
      expect(result.error).toEqual(null);
      expect(result.hasSelectedIssue).toEqual(false);
    });
    it('LoadSelectedIssueSuccess should return selectedIssue', () => {
      const action = new actions.LoadSelectedHistorySuccess(pendingSTN1);
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.selectedHistory).toEqual(pendingSTN1);
      expect(result.isLoadingSelectedHistory).toEqual(false);
      expect(result.hasSelectedHistory).toEqual(true);
    });
    it('LoadSelectedIssueFailure should return selectedIssue', () => {
      const action = new actions.LoadSelectedIssueFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing Loading Issue History Items Functionality', () => {
    it('LoadHistoryItems should be called', () => {
      const payload: LoadStockIssueHistoryItemsPayload = {
        payload: {
          binCodes: null,
          binGroupCode: null,
          itemCode: '111',
          lotNumber: '111111',
          productCategories: [],
          productGroups: [],
          statuses: []
        },
        actionType: 'ISSUE',
        id: 1,
        page: 0,
        size: 10,
        sort: null,
        transferType: 'BTQ_FAC',
        isL1L2Store: true,
        isL3Store: false
      };
      const action = new actions.LoadHistoryItems(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingHistoryItems).toEqual(true);
      expect(result.error).toEqual(null);
      expect(result.isHistoryItemsLoaded).toEqual(false);
      expect(result.issueHistoryCount).toBe(0);
    });
    it('LoadHistoryItemsSuccess should return selectedIssue', () => {
      const payload: { items: IssueInventoryItem[]; count: number } = {
        items: issueItemsArray,
        count: 2
      };
      const action = new actions.LoadHistoryItemsSuccess(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.historyItems.ids.length).toBe(2);
      expect(result.historyItemsCount).toEqual(2);
      expect(result.isLoadingHistoryItems).toEqual(false);
      expect(result.isHistoryItemsLoaded).toEqual(true);
    });
    it('LoadHistoryItemsFailure should return selectedIssue', () => {
      const action = new actions.LoadHistoryItemsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoadingHistoryItems).toEqual(false);
      expect(result.isHistoryItemsLoaded).toEqual(false);
    });
  });
  describe('Testing ClearHistory Items Functionality', () => {
    it('clearHistoryItems should be called', () => {
      const action = new actions.ClearHistoryItems();
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.historyItems.ids.length).toBe(0);
    });
  });
  describe('Testing Loading HistoryItemTotalCount Functionality', () => {
    it('LoadHistoryItemTotalCount should be called', () => {
      const payload: LoadStockIssueHistoryItemsPayload = {
        payload: {
          binCodes: null,
          binGroupCode: null,
          itemCode: '111',
          lotNumber: '111111',
          productCategories: [],
          productGroups: [],
          statuses: []
        },
        actionType: 'ISSUE',
        id: 1,
        page: 0,
        size: 10,
        sort: null,
        transferType: 'BTQ_FAC',
        isL1L2Store: true,
        isL3Store: false
      };
      const action = new actions.LoadHistoryItemsTotalCount(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingHistoryItemsTotalCount).toBe(true);
    });

    it('LoadHistoryItemTotalCountSuccess should be called', () => {
      const payload = 10;
      const action = new actions.LoadHistoryItemsTotalCountSuccess(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingHistoryItemsTotalCount).toBe(false);
      expect(result.historyItemsTotalCount).toBe(10);
    });
    it('LoadHistoryItemTotalCountFailure should return selectedIssue', () => {
      const action = new actions.LoadHistoryItemsTotalCountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoadingHistoryItemsTotalCount).toEqual(false);
    });
  });
  describe('Testing Set HistAdvancedFilterData Functionality', () => {
    it('SetHistoryAdvancedFilterData shpuld be called', () => {
      const payload: IssueAdvanceFilterPayload = {
        docFromDate: null,
        docToDate: null,
        locationCode: null,
        fiscalYear: null,
        docNo: null
      };
      const action = new actions.SetHistoryAdvancedFilterData(payload);
      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.advancedFilterData).toEqual(payload);
    });
  });
  describe('Testing Clear HistAdvancedFilterData Functionality', () => {
    it('ClearHistoryAdvancedFilterData should be called', () => {
      const action = new actions.ClearHistoryAdvancedFilterData(1);
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.advancedFilterData.docFromDate).toBeTruthy();
      expect(result.advancedFilterData.docToDate).toBeTruthy();
      expect(result.advancedFilterData.fiscalYear).toBeNull();
      expect(result.advancedFilterData.locationCode).toBeNull();
      expect(result.advancedFilterData.docNo).toBeNull();
    });
  });

  // cancel STN
  describe('Testing Loading LoadCancelIssuePendingSTN Functionality', () => {
    it('LoadCancelIssuePendingSTN should be called', () => {
      const payload: LoadCancelIssuesSTNPayload = {
        requestType: 'FAC',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new actions.LoadCancelIssuePendingSTN(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueCancelSTN).toBe(true);
    });

    it('LoadCancelIssuePendingSTNSuccess should be called', () => {
      const payload: { response: StockRequestNote[]; count: number } = {
        response: [],
        count: 8
      };
      const action = new actions.LoadCancelIssuePendingSTNSuccess(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueCancelSTN).toBe(false);
      // expect(result.issueCancelSTN).toBe(payload);
    });
    it('LoadCancelIssuePendingSTNFailure should be called', () => {
      const action = new actions.LoadCancelIssuePendingSTNFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoadingIssueCancelSTN).toEqual(false);
    });
  });

  describe('Testing Loading LoadCancelIssueCount Functionality', () => {
    it('LoadCancelIssueCount should be called', () => {
      const payload: LoadCancelIssuesPayload = {
        transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
      };
      const action = new actions.LoadCancelIssueCount(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueCount).toBe(true);
    });

    it('LoadCancelIssueCountSuccess should be called', () => {
      const payload = 8;
      const action = new actions.LoadCancelIssueCountSuccess(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueCount).toBe(false);
      expect(result.pendingBTQ_BTQ_STNCancelCount).toBe(payload);
    });
    it('LoadCancelIssueCountFailure should be called', () => {
      const action = new actions.LoadCancelIssueCountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoadingIssueCount).toEqual(false);
    });
  });

  describe('Testing Loading LoadCancelIssueDetails Functionality', () => {
    it('LoadCancelIssueDetails should be called', () => {
      const payload: LoadCancelIssuesPayload = {
        transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
      };
      const action = new actions.LoadCancelIssueDetails(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueCancelSTN).toBe(true);
    });

    it('LoadCancelIssueDetailsSuccess should be called', () => {
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
      const action = new actions.LoadCancelIssueDetailsSuccess(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueCancelSTN).toBe(false);
      expect(result.cancelIssueSTNDetails).toBe(payload);
    });
    it('LoadCancelIssueDetailsFailure should be called', () => {
      const action = new actions.LoadCancelIssueDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoadingIssueCancelSTN).toEqual(false);
    });
  });

  describe('Testing Loading LoadCancelIssueItems Functionality', () => {
    it('LoadCancelIssueItems should be called', () => {
      const payload: LoadCancelIssuetemsPayload = {
        id: 1,
        page: 0,
        size: 10,
        sort: [''],
        transferType: 'BTQ_BTQ',
        binCodes: [],
        binGroupCode: '',
        itemCode: '',
        lotNumber: '',
        productCategories: [],
        productGroups: []
      };
      const action = new actions.LoadCancelIssueItems(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueCancelSTN).toBe(true);
    });

    it('LoadCancelIssueItemsSuccess should be called', () => {
      const dummyItemResponse: IssueInventoryItem[] = [
        {
          availableQuantity: 5,
          availableValue: 5000,
          availableWeight: 50,
          binCode: 'TestBinCode',
          binGroupCode: 'TestBinGroupCode',
          currencyCode: 'INR',
          id: '111ew22',
          imageURL: 'http://test.com',
          inventoryId: 'F7D-A3D5',
          itemCode: '5097321AAA4A11',
          itemDetails: {},
          lotNumber: '1BA000001',
          measuredQuantity: 2,
          measuredValue: 2000,
          measuredWeight: 20,
          mfgDate: moment(),
          orderType: null,
          productCategory: 'OTHERS',
          productCategoryDesc: 'OTHERS',
          productGroup: '71',
          productGroupDesc: 'Gold Plain',
          status: 'APPROVED',
          stdValue: 100,
          stdWeight: 10,
          weightUnit: 'gms',
          isUpdating: false,
          isUpdatingSuccess: null,
          isValidating: false,
          isValidatingSuccess: null,
          isValidatingError: false,
          isStudded: false,
          isLoadingImage: false,
          isLoadingThumbnailImage: true,
          taxDetails: {},
          thumbnailImageURL: ''
        }
      ];
      const payload = { items: dummyItemResponse, count: 1 };
      const action = new actions.LoadCancelIssueItemsSuccess(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueCancelSTN).toBe(false);
      // expect(result.cancelIssueItems).toBe(payload);
    });
    it('LoadCancelIssueItemsFailure should be called', () => {
      const action = new actions.LoadCancelIssueItemsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoadingIssueCancelSTN).toEqual(false);
    });
  });

  describe('Testing Loading LoadCancelIssueItemsCount Functionality', () => {
    it('LoadCancelIssueItemsCount should be called', () => {
      const payload: LoadCancelIssuesPayload = {
        transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
      };
      const action = new actions.LoadCancelIssueItemsCount(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueCancelSTN).toBe(true);
    });

    it('LoadCancelIssueItemsCountSuccess should be called', () => {
      const payload = 1;
      const action = new actions.LoadCancelIssueItemsCountSuccess(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueCancelSTN).toBe(false);
      expect(result.cancelIssueItemsCount).toBe(payload);
    });
    it('LoadCancelIssueItemsCountFailure should be called', () => {
      const action = new actions.LoadCancelIssueItemsCountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoadingIssueCancelSTN).toEqual(false);
    });
  });

  describe('Testing Loading CancelIssueSTN Functionality', () => {
    it('CancelIssueSTN should be called', () => {
      const payload: LoadCancelIssuesPayload = {
        transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
      };
      const action = new actions.CancelIssueSTN(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueCancelSTN).toBe(true);
    });

    it('CancelIssueSTNSuccess should be called', () => {
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
      const action = new actions.CancelIssueSTNSuccess(payload);

      const result: StockIssueState = StockIssueReducer(initialState, action);
      expect(result.isLoadingIssueCancelSTN).toBe(false);
      expect(result.cancelIssuesSTNRes).toBe(payload);
    });
    it('CancelIssueSTNFailure should be called', () => {
      const action = new actions.CancelIssueSTNFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoadingIssueCancelSTN).toEqual(false);
    });
  });

  describe('Testing ClearPendingIssuesForCancel Functionality', () => {
    it('ClearPendingIssuesForCancel should be called', () => {
      const action = new actions.ClearPendingIssuesForCancel();
      const result: StockIssueState = StockIssueReducer(initialState, action);

      expect(result.issueCancelSTN.ids.length).toBe(0);
    });
  });
});
