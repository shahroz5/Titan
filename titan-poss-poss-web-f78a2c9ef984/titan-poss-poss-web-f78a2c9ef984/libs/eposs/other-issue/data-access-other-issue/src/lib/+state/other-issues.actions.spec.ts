import {
  AdjustmentSearchItemPayload,
  AdjustmentSearchItemPayloadSuccess,
  CancelOtherRequestPayload,
  ConfirmOtherStockIssuePayload,
  ConfirmOtherStockIssueResponse,
  CreateOtherIssueStockRequestItemsPayload,
  CreateOtherStockIssueItemsPayload,
  CreateStockRequestAdjustmentPayload,
  CustomErrors,
  LoadAllOtherIssuePayload,
  LoadOtherIssueCreateItemsTotalCountPayload,
  LoadOtherIssueCreateItemsTotalCountSuccessPayload,
  LoadOtherIssuesItemPayload,
  LoadOtherIssuesSTNCountPayload,
  OtherIssuedataModel,
  OtherIssueLoadListItemsPayload,
  OtherIssueLoadSelectedPayload,
  OtherIssueModel,
  OtherIssuesCreateStockResponse,
  OtherIssuesCreateStockResponsePayload,
  OtherIssueSearchPendingPayload,
  OtherIssuesItem,
  PrintOtherIssuePayload,
  ProductCategory,
  ProductGroup,
  PSVSearchItemPayload,
  PSVSearchItemPayloadSuccess,
  RemoveCartItemPSVPayload,
  RemoveOtherIssueStockRequestItemsPayload,
  RequestOtherIssueStockTransferNote,
  SearchCartItemPSVPayload,
  UpdateCartItemAdjustmentPayload,
  UpdateStockRequestItemPayload,
  UpdateStockRequestPayload,
  LoadOtherIssueHistoryPayload,
  LoadOtherIssueHistoryItemsPayload,
  OtherIssuesHistoryItem,
  OtherReceiptsIssuesAdvanceFilterPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import {
  LoadIssuesSTNCount,
  LoadIssuesSTNCountSuccess,
  LoadIssuesSTNCountFailure,
  LoadIssueList,
  LoadIssueListSuccess,
  LoadIssueListFailure,
  SearchPendingIssue,
  SearchPendingIssueSuccess,
  SearchPendingIssueFailure,
  LoadIssueLoanList,
  LoadIssueLoanListSuccess,
  LoadIssueLoanListFailure,
  DropDownvalueForIssues,
  LoadSelectedIssue,
  LoadSelectedIssueSuccess,
  LoadSelectedIssueFailure,
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsSuccess,
  LoadStuddedProductGroupsFailure,
  LoadNonVerifiedOtherIssueItems,
  LoadNonVerifiedOtherIssueItemsSuccess,
  LoadNonVerifiedOtherIssueItemsFailure,
  SearchClearIssue,
  CreateOtherStockIssueItems,
  CreateOtherStockIssueItemsItemsSuccess,
  CreateOtherStockIssueItemsItemsFailure,
  RemoveInitialLoadOtherIssue,
  ConfirmOtherStockIssue,
  ConfirmOtherStockIssueSuccess,
  ConfirmOtherStockIssueFailure,
  ResetConfirmOtherIssueResponse,
  //create page
  CreateOtherIssueStockRequest,
  CreateOtherIssueStockRequestSuccess,
  CreateOtherIssueStockRequestFailure,
  LoadAllOtherIssueCreateItems,
  LoadAllOtherIssueCreateItemsSuccess,
  LoadAllOtherIssueCreateItemsFailure,
  LoadSelectedOtherIssueCreateItems,
  LoadSelectedOtherIssueCreateItemsSuccess,
  LoadSelectedOtherIssueCreateItemsFailure,
  LoadIssueItemsCreateTotalCount,
  LoadIssueItemsCreateTotalCountSuccess,
  LoadIssueItemsCreateTotalCountFailure,
  CreateOtherIssueStockRequestItems,
  CreateOtherIssueStockRequestItemsSuccess,
  CreateOtherIssueStockRequestItemsFailure,
  RemoveOtherIssueStockRequestItems,
  RemoveOtherIssueStockRequestItemsSuccess,
  RemoveOtherIssueStockRequestItemsFailure,
  UpdateStockRequestCreateItem,
  UpdateStockRequestCreateItemSuccess,
  UpdateStockRequestCreateItemFailure,
  ResetOtherIssueCreateListItems,
  ResetOtherIssueCreateResponse,
  UpdateStockRequest,
  UpdateStockRequestSuccess,
  UpdateStockRequestFailure,
  ClearItems,
  //psv and adjustment
  SearchAdjustment,
  SearchAdjustmentSuccess,
  SearchAdjustmentFailure,
  AddItemsToCart,
  CreateStockRequestAdjustment,
  CreateStockRequestAdjustmentSuccess,
  CreateStockRequestAdjustmentFailure,
  UpdateCartItemsAdjustment,
  RemoveCartItemsAdjustment,
  SearchCartItemsAdjustment,
  LoadIssueADJList,
  LoadIssueADJListSuccess,
  LoadIssueADJListFailure,
  ResetAdjustmentIssueData,
  LoadIssueLossList,
  LoadIssueLossListSuccess,
  LoadIssueLossListFailure,
  LoadIssuePSVList,
  LoadIssuePSVListSuccess,
  LoadIssuePSVListFailure,
  ClearSearchCartItemAdjustment,
  SearchPSV,
  SearchPSVSuccess,
  SearchPSVFailure,
  AddPSVItemsToCart,
  CreateStockRequestPSV,
  CreateStockRequestPSVSuccess,
  CreateStockRequestPSVFailure,
  UpdateCartItemsPSV,
  RemoveCartItemsPSV,
  SearchCartItemsPSV,
  ResetPSVIssueData,
  ClearSearchCartItemPSV,
  SearchFOC,
  SearchFOCSuccess,
  SearchFOCFailure,
  AddFOCItemsToCart,
  CreateStockRequestFOC,
  CreateStockRequestFOCSuccess,
  CreateStockRequestFOCFailure,
  UpdateCartItemsFOC,
  RemoveCartItemsFOC,
  SearchCartItemsFOC,
  ResetFOCIssueData,
  ClearSearchCartItemFOC,
  LoadIssueFOCList,
  LoadIssueFOCListSuccess,
  LoadIssueFOCListFailure,
  ClearSearchInventoryItemAdjustment,
  ClearSearchInventoryItemPSV,
  ClearSearchInventoryItemFOC,
  ResetIssueListData,
  CancelStockRequest,
  CancelStockRequestSuccess,
  CancelStockRequestFailure,
  PrintOtherIssues,
  PrintOtherIssuesSuccess,
  PrintOtherIssuesFailure,
  LoadProductGroups,
  LoadProductGroupsSuccess,
  LoadProductGroupsFailure,
  LoadProductCategories,
  LoadProductCategoriesSuccess,
  LoadProductCategoriesFailure,
  SetFilterDataAllProducts,
  SetFilterDataSelectedProducts,
  SetSortDataAllProducts,
  SetSortDataSelectedProducts,
  SetFilterDataOtherIssue,
  SetSortDataOtherIssue,
  OtherIssuesActionTypes,
  LoadOtherIssueHistory,
  LoadOtherIssueHistorySuccess,
  LoadOtherIssueHistoryFailure,
  ResetOtherIssueHistory,
  LoadSelectedHistory,
  LoadSelectedHistorySuccess,
  LoadSelectedHistoryFailure,
  LoadSelectedHistoryItems,
  LoadSelectedHistoryItemsSuccess,
  LoadSelectedHistoryItemsFailure,
  ClearSelectedHistoryItems,
  LoadSelectedHistoryItemsTotalCount,
  LoadSelectedHistoryItemsTotalCountSuccess,
  LoadSelectedHistoryItemsTotalCountFailure,
  SetOtherReceiptsIssueFilterData,
  ClearOtherReceiptsIssueFilterData
} from './other-issues.actions';

const dummyIssueCount: LoadOtherIssuesSTNCountPayload = {
  countData: [{ type: '', count: 0 }],
  pendingOtherIssuesSTNCount: 0
};

const dummmyIssueList: OtherIssuedataModel = {
  issueData: [
    {
      id: 4966,
      srcLocationCode: 'URB',
      destLocationCode: 'URB',
      status: 'APPROVED',
      weightUnit: 'gms',
      currencyCode: 'INR',
      srcDocNo: null,
      srcFiscalYear: null,
      srcDocDate: null,
      destDocNo: null,
      destDocDate: null,
      orderType: null,
      totalAvailableQuantity: 2,
      totalMeasuredQuantity: null,
      totalAvailableValue: 1264123.12,
      totalMeasuredValue: 0,
      totalAvailableWeight: 47.483,
      totalMeasuredWeight: null,
      reqDocDate: moment(1592288081939),
      reqDocNo: 48,
      reqLocationCode: 'URB',
      requestType: 'EXH',
      otherDetails: {
        type: 'approval',
        data: {
          approvalCode: '444',
          approvedBy: 're'
        }
      },
      carrierDetails: {
        type: 'address_exh',
        data: {
          address1: 'ff',
          address2: 'ff',
          city: 'banglore',
          town: 'kar',
          Designation: '',
          contactNo: 8105391994,
          emailId: '',
          employeeId: '',
          employeeName: '',
          pinCode: '123456'
        }
      }
    }
  ],
  totalElements: 1
};

const dummyCreateIssue: OtherIssueModel = {
  id: 5260,
  srcLocationCode: 'URB',
  destLocationCode: 'URB',
  status: 'APVL_PENDING',
  weightUnit: 'gms',
  currencyCode: 'INR',
  carrierDetails: null,
  otherDetails: null,
  reqLocationCode: null,
  remarks: null,
  srcDocNo: 517,
  srcFiscalYear: null,
  srcDocDate: moment(1600692426386),
  destDocNo: null,
  destDocDate: null,
  orderType: null,
  totalAvailableQuantity: 15,
  totalMeasuredQuantity: 15,
  totalAvailableValue: 7631640,
  totalMeasuredValue: 7631640,
  totalAvailableWeight: 321.9,
  totalMeasuredWeight: 321.9,
  reqDocNo: 517,
  reqDocDate: moment(1600692426386),
  requestType: 'FOC'
};

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

const dummysearchOtherIssueCreateItems: OtherIssuesItem[] = [
  {
    id: null,
    itemCode: '512219VGGQ2A00',
    lotNumber: '2EB000073',
    mfgDate: moment(1588703400000),
    productCategory: 'V',
    productGroup: '71',
    binCode: 'LOAN',
    binGroupCode: 'LOAN',
    stdValue: 160410,
    stdWeight: 46.186,
    currencyCode: 'INR',
    weightUnit: 'gms',
    status: 'OPEN',
    imageURL: '/productcatalogue/ProductImages/2219VGG.jpg',
    itemDetails: null,
    availableQuantity: 5,
    availableWeight: 230.93,
    availableValue: 802050,
    measuredQuantity: null,
    measuredWeight: null,
    measuredValue: null,
    orderType: null,
    approvedQuantity: null,
    isStudded: null,
    isUpdating: null,
    isUpdatingSuccess: null,
    issuedQuantity: null,
    itemValue: null,
    itemWeight: null,
    productCategoryId: null,
    productGroupId: null,
    requestedQuantity: null,
    totalQuantity: null,
    totalValue: null,
    totalWeight: null,
    totalElements: null,

    inventoryId: 123,
    taxDetails: {}
  }
];

const dummyConfirmIssueResponse: ConfirmOtherStockIssueResponse = {
  id: 8297,
  srcLocationCode: 'URB',
  destLocationCode: 'URB',
  status: 'ISSUED',
  weightUnit: 'gms',
  currencyCode: 'INR',
  srcLocationDescription: null,
  destLocationDescription: null,
  srcDocNo: 231,
  srcFiscalYear: 2020,
  srcDocDate: moment(1600681186289),
  destDocNo: null,
  courierDetails: '',
  destDocDate: null,
  orderType: null,
  totalAvailableQuantity: null,
  totalMeasuredQuantity: 0,
  totalAvailableValue: null,
  totalMeasuredValue: 0,
  totalAvailableWeight: null,
  totalMeasuredWeight: 0,
  transferType: 'ADJ',
  courierReceivedDate: null
};

const dummyCreateStockResponse: OtherIssuesCreateStockResponse = {
  destLocationCode: '',
  id: 1,
  reqDocDate: moment(),
  reqDocNo: 1,
  srcLocationCode: '',
  status: '',
  totalQuantity: 1
};
const dummySearchADJ: AdjustmentSearchItemPayloadSuccess = {
  items: [
    {
      id: 1,
      itemCode: '512313CDYMAA00',
      lotNumber: '2JA005739',
      mfgDate: moment(1558895400000),
      productCategory: 'C',
      productGroup: '71',
      approvedQuantity: 1,
      isStudded: false,
      isUpdating: true,
      isUpdatingSuccess: false,
      issuedQuantity: 1,
      itemValue: 2,
      itemWeight: 3,
      measuredQuantity: 2,
      measuredValue: 1,
      measuredWeight: 1,
      orderType: '',
      productCategoryId: '',
      productGroupId: '',
      requestedQuantity: 3,
      totalQuantity: 3,
      totalValue: 12,
      totalWeight: 2,
      binCode: 'BEST DEAL',
      binGroupCode: 'STN',
      stdValue: 60103.55,
      stdWeight: 19.346,
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: null,
      imageURL: '/productcatalogue/ProductImages/2313CDY.jpg',
      itemDetails: {},
      availableWeight: 19.346,
      availableValue: 60103.55,
      availableQuantity: 1,
      taxDetails: {}
    }
  ],
  count: 1
};

const dummySuccessPayload: LoadOtherIssueCreateItemsTotalCountSuccessPayload = {
  allOtherIssueCreateItemsTotalCount: 0,
  selectedOtherIssueCreateItemsTotalCount: 1
};
describe('Other Issue Action Testing Suite', () => {
  describe('LoadIssuesSTNCount Action Test Cases', () => {
    it('should check correct type is used for  LoadIssuesSTNCount action ', () => {
      const action = new LoadIssuesSTNCount();

      expect(action.type).toEqual(OtherIssuesActionTypes.LOAD_ISSUES_STN_COUNT);
    });
    it('should check correct type is used for  LoadIssuesSTNCountSuccess action ', () => {
      const payload: LoadOtherIssuesSTNCountPayload = dummyIssueCount;
      const action = new LoadIssuesSTNCountSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUES_STN_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssuesSTNCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssuesSTNCountFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUES_STN_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadIssueList Action Test Cases', () => {
    it('should check correct type is used for  LoadIssueList action ', () => {
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: 'EXH'
      };

      const action = new LoadIssueList(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.LOAD_ISSUE_LIST);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssueListSuccess action ', () => {
      const payload: OtherIssuedataModel = dummmyIssueList;
      const action = new LoadIssueListSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssueListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssueListFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadIssueLoanList Action Test Cases', () => {
    it('should check correct type is used for  LoadIssueLoanList action ', () => {
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: 'EXH'
      };

      const action = new LoadIssueLoanList(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.LOAD_ISSUE_LOAN_LIST);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssueLoanListSuccess action ', () => {
      const payload: OtherIssuedataModel = dummmyIssueList;
      const action = new LoadIssueLoanListSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_LOAN_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssueListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssueLoanListFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_LOAN_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadIssueADJList Action Test Cases', () => {
    it('should check correct type is used for  LoadIssueADJList action ', () => {
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: 'EXH'
      };

      const action = new LoadIssueADJList(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.LOAD_ISSUE_ADJ_LIST);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssueADJListSuccess action ', () => {
      const payload: OtherIssuedataModel = dummmyIssueList;
      const action = new LoadIssueADJListSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_ADJ_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssueADJListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssueADJListFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_ADJ_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadIssueLossList Action Test Cases', () => {
    it('should check correct type is used for  LoadIssueLossList action ', () => {
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: 'EXH'
      };

      const action = new LoadIssueLossList(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.LOAD_ISSUE_LOSS_LIST);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssueLossListSuccess action ', () => {
      const payload: OtherIssuedataModel = dummmyIssueList;
      const action = new LoadIssueLossListSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_LOSS_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssueLossListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssueLossListFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_LOSS_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadIssuePSVList Action Test Cases', () => {
    it('should check correct type is used for  LoadIssuePSVListSuccess action ', () => {
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: 'EXH'
      };

      const action = new LoadIssuePSVList(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.LOAD_ISSUE_PSV_LIST);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssuePSVList action ', () => {
      const payload: OtherIssuedataModel = dummmyIssueList;
      const action = new LoadIssuePSVListSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_PSV_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssuePSVListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssuePSVListFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_PSV_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadIssueFOCList Action Test Cases', () => {
    it('should check correct type is used for  LoadIssueFOCList action ', () => {
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: 'EXH'
      };

      const action = new LoadIssueFOCList(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.LOAD_ISSUE_FOC_LIST);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssueFOCListSuccess action ', () => {
      const payload: OtherIssuedataModel = dummmyIssueList;
      const action = new LoadIssueFOCListSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_FOC_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssueFOCListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssueFOCListFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_FOC_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchPendingIssue Action Test Cases', () => {
    it('should check correct type is used for  SearchPendingIssue action ', () => {
      const payload: OtherIssueSearchPendingPayload = {
        srcDocnumber: 1,
        type: 'EXH'
      };

      const action = new SearchPendingIssue(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.SEARCH_PENDING_ISSUE);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  SearchPendingIssueSuccess action ', () => {
      const payload: OtherIssueModel[] = [dummyCreateIssue];
      const action = new SearchPendingIssueSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.SEARCH_PENDING_ISSUE_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssueFOCListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchPendingIssueFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.SEARCH_PENDING_ISSUE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('CreateStockRequestAdjustment Action Test Cases', () => {
    it('should check correct type is used for  CreateStockRequestAdjustment action ', () => {
      const payload: CreateStockRequestAdjustmentPayload = {
        approvalDetails: { data: '', type: '' },
        items: [],
        remarks: '',
        reqType: 'EXH'
      };

      const action = new CreateStockRequestAdjustment(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_STOCK_REQUEST_ADJUSTMENT
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  CreateStockRequestAdjustmentSuccess action ', () => {
      const payload: OtherIssueModel = dummyCreateIssue;
      const action = new CreateStockRequestAdjustmentSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_STOCK_REQUEST_ADJUSTMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  CreateStockRequestAdjustmentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateStockRequestAdjustmentFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_STOCK_REQUEST_ADJUSTMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('UpdateStockRequest Action Test Cases', () => {
    it('should check correct type is used for  UpdateStockRequest action ', () => {
      const payload: UpdateStockRequestPayload = {
        approvalDetails: { data: '', type: '' },
        carrierDetails: { data: '', type: '' },
        id: 1,
        status: '',
        remarks: '',
        reqType: 'EXH'
      };

      const action = new UpdateStockRequest(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.UPDATE_STOCK_REQUEST);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  UpdateStockRequest action ', () => {
      const payload: OtherIssueModel = dummyCreateIssue;
      const action = new UpdateStockRequestSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  UpdateStockRequest action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateStockRequestFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('CreateStockRequestPSV Action Test Cases', () => {
    it('should check correct type is used for  CreateStockRequestPSV action ', () => {
      const payload: CreateStockRequestAdjustmentPayload = {
        approvalDetails: { data: '', type: '' },
        items: [],
        remarks: '',
        reqType: 'EXH'
      };

      const action = new CreateStockRequestPSV(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_STOCK_REQUEST_PSV
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for CreateStockRequestPSVSuccess action ', () => {
      const payload: OtherIssueModel = dummyCreateIssue;
      const action = new CreateStockRequestPSVSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_STOCK_REQUEST_PSV_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for CreateStockRequestPSVFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateStockRequestPSVFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_STOCK_REQUEST_PSV_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('CreateStockRequestFOC Action Test Cases', () => {
    it('should check correct type is used for  CreateStockRequestFOC action ', () => {
      const payload: CreateStockRequestAdjustmentPayload = {
        approvalDetails: { data: '', type: '' },
        items: [],
        remarks: '',
        reqType: 'EXH'
      };

      const action = new CreateStockRequestFOC(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_STOCK_REQUEST_FOC
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for CreateStockRequestFOCSuccess action ', () => {
      const payload: OtherIssueModel = dummyCreateIssue;
      const action = new CreateStockRequestFOCSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_STOCK_REQUEST_FOC_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for CreateStockRequestFOCFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateStockRequestFOCFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_STOCK_REQUEST_FOC_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('DropDownvalueForIssues Action Test Cases', () => {
    it('should check correct type is used for  DropDownvalueForIssues action ', () => {
      const payload = '';

      const action = new DropDownvalueForIssues(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.DROPDOWN_SELECTED_FOR_ISSUES
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadSelectedIssue Action Test Cases', () => {
    it('should check correct type is used for LoadSelectedIssue action ', () => {
      const payload: OtherIssueLoadSelectedPayload = {
        reqDocNo: 1,
        type: 'EXH'
      };

      const action = new LoadSelectedIssue(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.LOAD_SELECTED_ISSUE);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadSelectedIssueSuccess action ', () => {
      const payload: RequestOtherIssueStockTransferNote = dummyLoadIssue;
      const action = new LoadSelectedIssueSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_SELECTED_ISSUE_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadSelectedIssueFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedIssueFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_SELECTED_ISSUE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  //
  describe('LoadNonVerifiedOtherIssueItems Action Test Cases', () => {
    it('should check correct type is used for LoadNonVerifiedOtherIssueItems action ', () => {
      const payload: LoadOtherIssuesItemPayload = {
        id: 1,
        pageIndex: 2,
        pageSize: 1,
        status: '',
        type: ''
      };

      const action = new LoadNonVerifiedOtherIssueItems(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadNonVerifiedOtherIssueItemsSuccess action ', () => {
      const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
      const action = new LoadNonVerifiedOtherIssueItemsSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadNonVerifiedOtherIssueItemsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadNonVerifiedOtherIssueItemsFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadNonVerifiedOtherIssueItems Action Test Cases', () => {
    it('should check correct type is used for LoadNonVerifiedOtherIssueItems action ', () => {
      const payload: LoadOtherIssuesItemPayload = {
        id: 1,
        pageIndex: 2,
        pageSize: 1,
        status: '',
        type: ''
      };

      const action = new LoadNonVerifiedOtherIssueItems(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadNonVerifiedOtherIssueItemsSuccess action ', () => {
      const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
      const action = new LoadNonVerifiedOtherIssueItemsSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadNonVerifiedOtherIssueItemsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadNonVerifiedOtherIssueItemsFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadAllOtherIssueCreateItems Action Test Cases', () => {
    it('should check correct type is used for LoadAllOtherIssueCreateItems action ', () => {
      const payload: LoadAllOtherIssuePayload = {
        id: 1,
        pageIndex: 2,
        pageSize: 1,
        reqtype: ''
      };

      const action = new LoadAllOtherIssueCreateItems(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadAllOtherIssueCreateItemsSuccess action ', () => {
      const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
      const action = new LoadAllOtherIssueCreateItemsSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadAllOtherIssueCreateItemsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllOtherIssueCreateItemsFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadSelectedOtherIssueCreateItems Action Test Cases', () => {
    it('should check correct type is used for LoadSelectedOtherIssueCreateItems action ', () => {
      const payload: LoadAllOtherIssuePayload = {
        id: 1,
        pageIndex: 2,
        pageSize: 1,
        reqtype: ''
      };

      const action = new LoadSelectedOtherIssueCreateItems(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadSelectedOtherIssueCreateItemsSuccess action ', () => {
      const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
      const action = new LoadSelectedOtherIssueCreateItemsSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadSelectedOtherIssueCreateItemsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedOtherIssueCreateItemsFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('AddItemsToCart Action Test Cases', () => {
    it('should check correct type is used for AddItemsToCart action ', () => {
      const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
      const action = new AddItemsToCart(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.ADD_ADJUSTMENT_ITEMS_TO_CART
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('AddPSVItemsToCart Action Test Cases', () => {
    it('should check correct type is used for AddPSVItemsToCart action ', () => {
      const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
      const action = new AddPSVItemsToCart(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.ADD_PSV_ITEMS_TO_CART);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('AddFOCItemsToCart Action Test Cases', () => {
    it('should check correct type is used for AddFOCItemsToCart action ', () => {
      const payload: OtherIssuesItem[] = dummysearchOtherIssueCreateItems;
      const action = new AddFOCItemsToCart(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.ADD_FOC_ITEMS_TO_CART);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchClearIssue Action Test Cases', () => {
    it('should check correct type is used for  SearchClearIssue action ', () => {
      const action = new SearchClearIssue();

      expect(action.type).toEqual(OtherIssuesActionTypes.SEARCH_CLEAR_ISSUE);
    });
  });

  describe('ClearItems Action Test Cases', () => {
    it('should check correct type is used for ClearItems action ', () => {
      const action = new ClearItems();

      expect(action.type).toEqual(OtherIssuesActionTypes.CLEAR_ITEMS);
    });
  });

  describe('CreateOtherStockIssueItems Action Test Cases', () => {
    it('should check correct type is used for CreateOtherStockIssueItems action ', () => {
      const payload: CreateOtherStockIssueItemsPayload = {
        id: 1,
        data: '',
        transferType: ''
      };

      const action = new CreateOtherStockIssueItems(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_OTHER_STOCK_ISSUE_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for CreateOtherStockIssueItemsSuccess action ', () => {
      const payload: any = [];
      const action = new CreateOtherStockIssueItemsItemsSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_OTHER_STOCK_ISSUE_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for CreateOtherStockIssueItemsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateOtherStockIssueItemsItemsFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_OTHER_STOCK_ISSUE_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('RemoveInitialLoadOtherIssue Action Test Cases', () => {
    it('should check correct type is used for RemoveInitialLoadOtherIssue action ', () => {
      const action = new RemoveInitialLoadOtherIssue();

      expect(action.type).toEqual(
        OtherIssuesActionTypes.REMOVE_INITIAL_LOAD_OTHER_ISSUE
      );
    });
  });

  describe('ConfirmOtherStockIssue Action Test Cases', () => {
    it('should check correct type is used for ConfirmOtherStockIssue action ', () => {
      const payload: ConfirmOtherStockIssuePayload = {
        id: 1,
        carrierDetails: { data: '', type: '' },
        destinationLocationCode: '',
        remarks: '',
        transferType: ''
      };

      const action = new ConfirmOtherStockIssue(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CONFIRM_OTHER_STOCK_ISSUE
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for ConfirmOtherStockIssueSuccess action ', () => {
      const payload: ConfirmOtherStockIssueResponse = dummyConfirmIssueResponse;

      const action = new ConfirmOtherStockIssueSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CONFIRM_OTHER_STOCK_ISSUE_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for ConfirmOtherStockIssueFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmOtherStockIssueFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CONFIRM_OTHER_STOCK_ISSUE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ResetConfirmOtherIssueResponse Action Test Cases', () => {
    it('should check correct type is used for ResetConfirmOtherIssueResponse action ', () => {
      const action = new ResetConfirmOtherIssueResponse();

      expect(action.type).toEqual(
        OtherIssuesActionTypes.RESET_CONFIRM_OTHER_STOCK_ISSUE_RESPONSE
      );
    });
  });
  describe('CreateOtherIssueStockRequest Action Test Cases', () => {
    it('should check correct type is used for CreateOtherIssueStockRequest action ', () => {
      const payload: OtherIssuesCreateStockResponsePayload = {
        reqtype: 'EXH'
      };

      const action = new CreateOtherIssueStockRequest(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for CreateOtherIssueStockRequestSuccess action ', () => {
      const payload: OtherIssuesCreateStockResponse = dummyCreateStockResponse;

      const action = new CreateOtherIssueStockRequestSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for CreateOtherIssueStockRequestFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateOtherIssueStockRequestFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadIssueItemsCreateTotalCount Action Test Cases', () => {
    it('should check correct type is used for LoadIssueItemsCreateTotalCount action ', () => {
      const payload: LoadOtherIssueCreateItemsTotalCountPayload = {
        id: 1,
        reqtype: ''
      };

      const action = new LoadIssueItemsCreateTotalCount(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_ITEMS_CREATE_COUNT
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadIssueItemsCreateTotalCountSuccess action ', () => {
      const payload: LoadOtherIssueCreateItemsTotalCountSuccessPayload = dummySuccessPayload;
      const action = new LoadIssueItemsCreateTotalCountSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_ITEMS_CREATE_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadIssueItemsCreateTotalCountFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssueItemsCreateTotalCountFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_ITEMS_CREATE_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('CreateOtherIssueStockRequestItems Action Test Cases', () => {
    it('should check correct type is used for CreateOtherIssueStockRequestItems action ', () => {
      const payload: CreateOtherIssueStockRequestItemsPayload = {
        data: {},
        id: 1,
        requestType: ''
      };

      const action = new CreateOtherIssueStockRequestItems(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for CreateOtherIssueStockRequestItemsSuccess action ', () => {
      const payload: any = [];
      const action = new CreateOtherIssueStockRequestItemsSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for CreateOtherIssueStockRequestItemsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateOtherIssueStockRequestItemsFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('RemoveOtherIssueStockRequestItems Action Test Cases', () => {
    it('should check correct type is used for RemoveOtherIssueStockRequestItems action ', () => {
      const payload: RemoveOtherIssueStockRequestItemsPayload = {
        id: 1,
        data: {},
        requestType: ''
      };

      const action = new RemoveOtherIssueStockRequestItems(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for RemoveOtherIssueStockRequestItemsSuccess action ', () => {
      const payload: any = [];
      const action = new RemoveOtherIssueStockRequestItemsSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for RemoveOtherIssueStockRequestItemsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RemoveOtherIssueStockRequestItemsFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('UpdateStockRequestCreateItem Action Test Cases', () => {
    it('should check correct type is used for UpdateStockRequestCreateItem action ', () => {
      const payload: UpdateStockRequestItemPayload = {
        id: 1,
        itemid: 1,
        reqType: '',
        value: { inventoryId: 0, measuredWeight: 0, quantity: 0, status: '' }
      };

      const action = new UpdateStockRequestCreateItem(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_CREATE_ITEM
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for UpdateStockRequestCreateItemSuccess action ', () => {
      const payload: any = [];
      const action = new UpdateStockRequestCreateItemSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_CREATE_ITEM_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for UpdateStockRequestCreateItemFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateStockRequestCreateItemFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_CREATE_ITEM_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ResetOtherIssueCreateListItems Action Test Cases', () => {
    it('should check correct type is used for ResetOtherIssueCreateListItems action ', () => {
      const action = new ResetOtherIssueCreateListItems();

      expect(action.type).toEqual(
        OtherIssuesActionTypes.RESET_OTHER_ISSUE_CREATE_LIST_ITEMS
      );
    });
  });

  describe('ResetOtherIssueCreateResponse Action Test Cases', () => {
    it('should check correct type is used for ResetOtherIssueCreateResponse action ', () => {
      const action = new ResetOtherIssueCreateResponse();

      expect(action.type).toEqual(
        OtherIssuesActionTypes.RESET_OTHER_ISSUE_CREATE_RESPONSE
      );
    });
  });

  describe('SearchAdjustment Action Test Cases', () => {
    it('should check correct type is used for SearchAdjustment action ', () => {
      const payload: AdjustmentSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: ''
      };

      const action = new SearchAdjustment(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.ADJUSTMENT_SEARCH);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for SearchAdjustmentSuccess action ', () => {
      const payload: AdjustmentSearchItemPayloadSuccess = dummySearchADJ;

      const action = new SearchAdjustmentSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.ADJUSTMENT_SEARCH_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for SearchAdjustmentFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchAdjustmentFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.ADJUSTMENT_SEARCH_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchPSV Action Test Cases', () => {
    it('should check correct type is used for SearchPSV action ', () => {
      const payload: PSVSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: ''
      };

      const action = new SearchPSV(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.PSV_SEARCH);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for SearchPSVSuccess action ', () => {
      const payload: PSVSearchItemPayloadSuccess = dummySearchADJ;

      const action = new SearchPSVSuccess(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.PSV_SEARCH_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for SearchPSVFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchPSVFailure(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.PSV_SEARCH_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchFOC Action Test Cases', () => {
    it('should check correct type is used for SearchFOC action ', () => {
      const payload: PSVSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: ''
      };

      const action = new SearchFOC(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.FOC_SEARCH);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for SearchFOCSuccess action ', () => {
      const payload: PSVSearchItemPayloadSuccess = dummySearchADJ;

      const action = new SearchFOCSuccess(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.FOC_SEARCH_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for SearchFOCFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchFOCFailure(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.FOC_SEARCH_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('UpdateCartItemsAdjustment Action Test Cases', () => {
    it('should check correct type is used for UpdateCartItemsAdjustment action ', () => {
      const payload: UpdateCartItemAdjustmentPayload = {
        id: 1,
        quantity: 1,
        weight: 0
      };
      const action = new UpdateCartItemsAdjustment(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.UPDATE_CART_ITEM_ADJUSTMENT
      );
    });
  });

  describe('RemoveCartItemsAdjustment Action Test Cases', () => {
    it('should check correct type is used for RemoveCartItemsAdjustment action ', () => {
      const payload: RemoveCartItemPSVPayload = {
        ids: []
      };
      const action = new RemoveCartItemsAdjustment(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.REMOVE_CART_ITEM_ADJUSTMENT
      );
    });
  });

  describe('SearchCartItemsAdjustment Action Test Cases', () => {
    it('should check correct type is used for SearchCartItemsAdjustment action ', () => {
      const payload: SearchCartItemPSVPayload = {
        searchValue: ''
      };
      const action = new SearchCartItemsAdjustment(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.SEARCH_CART_ITEM_ADJUSTMENT
      );
    });
  });

  describe('UpdateCartItemsPSV Action Test Cases', () => {
    it('should check correct type is used for UpdateCartItemsPSV action ', () => {
      const payload: UpdateCartItemAdjustmentPayload = {
        id: 1,
        quantity: 1,
        weight: 0
      };
      const action = new UpdateCartItemsPSV(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.UPDATE_CART_ITEM_PSV);
    });
  });

  describe('RemoveCartItemsPSV Action Test Cases', () => {
    it('should check correct type is used for RemoveCartItemsPSV action ', () => {
      const payload: RemoveCartItemPSVPayload = {
        ids: []
      };
      const action = new RemoveCartItemsPSV(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.REMOVE_CART_ITEM_PSV);
    });
  });

  describe('SearchCartItemsPSV Action Test Cases', () => {
    it('should check correct type is used for SearchCartItemsPSV action ', () => {
      const payload: SearchCartItemPSVPayload = {
        searchValue: ''
      };
      const action = new SearchCartItemsPSV(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.SEARCH_CART_ITEM_PSV);
    });
  });

  describe('ResetPSVIssueData Action Test Cases', () => {
    it('should check correct type is used for ResetPSVIssueData action ', () => {
      const action = new ResetPSVIssueData();

      expect(action.type).toEqual(OtherIssuesActionTypes.RESET_PSV_ISSUE_DATA);
    });
  });

  describe('ClearSearchCartItemPSV Action Test Cases', () => {
    it('should check correct type is used for ClearSearchCartItemPSV action ', () => {
      const action = new ClearSearchCartItemPSV();

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CLEAR_SEARCH_CART_ITEM_PSV
      );
    });
  });

  describe('ResetAdjustmentIssueData Action Test Cases', () => {
    it('should check correct type is used for ResetAdjustmentIssueData action ', () => {
      const action = new ResetAdjustmentIssueData();

      expect(action.type).toEqual(
        OtherIssuesActionTypes.RESET_ADJUSTMENT_ISSUE_DATA
      );
    });
  });

  describe('ClearSearchCartItemAdjustment Action Test Cases', () => {
    it('should check correct type is used for ClearSearchCartItemAdjustment action ', () => {
      const action = new ClearSearchCartItemAdjustment();

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT
      );
    });
  });

  describe('LoadStuddedProductGroups Action Test Cases', () => {
    it('should check correct type is used for LoadStuddedProductGroups action ', () => {
      const action = new LoadStuddedProductGroups();

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_STUDDED_PRODUCT_GROUPS
      );
    });
    it('should check correct type is used for LoadStuddedProductGroupsSuccess action ', () => {
      const payload: string[] = [];

      const action = new LoadStuddedProductGroupsSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadStuddedProductGroupsFailre action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStuddedProductGroupsFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('UpdateCartItemsFOC Action Test Cases', () => {
    it('should check correct type is used for UpdateCartItemsFOC action ', () => {
      const payload: UpdateCartItemAdjustmentPayload = {
        id: 1,
        quantity: 1,
        weight: 0
      };
      const action = new UpdateCartItemsFOC(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.UPDATE_CART_ITEM_FOC);
    });
  });

  describe('RemoveCartItemsFOC Action Test Cases', () => {
    it('should check correct type is used for RemoveCartItemsFOC action ', () => {
      const payload: RemoveCartItemPSVPayload = {
        ids: []
      };
      const action = new RemoveCartItemsFOC(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.REMOVE_CART_ITEM_FOC);
    });
  });

  describe('SearchCartItemsFOC Action Test Cases', () => {
    it('should check correct type is used for SearchCartItemsFOC action ', () => {
      const payload: SearchCartItemPSVPayload = {
        searchValue: ''
      };
      const action = new SearchCartItemsFOC(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.SEARCH_CART_ITEM_FOC);
    });
  });

  describe('ResetFOCIssueData Action Test Cases', () => {
    it('should check correct type is used for ResetFOCIssueData action ', () => {
      const action = new ResetFOCIssueData();

      expect(action.type).toEqual(OtherIssuesActionTypes.RESET_FOC_ISSUE_DATA);
    });
  });

  describe('ClearSearchCartItemFOC Action Test Cases', () => {
    it('should check correct type is used for ClearSearchCartItemFOC action ', () => {
      const action = new ClearSearchCartItemFOC();

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CLEAR_SEARCH_CART_ITEM_FOC
      );
    });
  });

  describe('ClearSearchInventoryItemAdjustment Action Test Cases', () => {
    it('should check correct type is used for ClearSearchInventoryItemAdjustment action ', () => {
      const action = new ClearSearchInventoryItemAdjustment();

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CLEAR_SEARCH_INVENTORY_ADJUSTMENT
      );
    });
  });

  describe('ClearSearchInventoryItemPSV Action Test Cases', () => {
    it('should check correct type is used for ClearSearchInventoryItemPSV action ', () => {
      const action = new ClearSearchInventoryItemPSV();

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CLEAR_SEARCH_INVENTORY_PSV
      );
    });
  });

  describe('ClearSearchInventoryItemFOC Action Test Cases', () => {
    it('should check correct type is used for ClearSearchInventoryItemFOC action ', () => {
      const action = new ClearSearchInventoryItemFOC();

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CLEAR_SEARCH_INVENTORY_FOC
      );
    });
  });

  describe('LoadIssueADJList Action Test Cases', () => {
    it('should check correct type is used for  LoadIssueADJList action ', () => {
      const payload: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 1,
        type: 'EXH'
      };

      const action = new LoadIssueADJList(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.LOAD_ISSUE_ADJ_LIST);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssueADJListSuccess action ', () => {
      const payload: OtherIssuedataModel = dummmyIssueList;
      const action = new LoadIssueADJListSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_ADJ_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadIssueADJListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssueADJListFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_ISSUE_ADJ_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ResetIssueListData Action Test Cases', () => {
    it('should check correct type is used for ResetIssueListData action ', () => {
      const action = new ResetIssueListData();

      expect(action.type).toEqual(OtherIssuesActionTypes.RESET_ISSUE_LIST_DATA);
    });
  });

  describe('ResetIssueListData Action Test Cases', () => {
    it('should check correct type is used for ResetIssueListData action ', () => {
      const action = new ResetIssueListData();

      expect(action.type).toEqual(OtherIssuesActionTypes.RESET_ISSUE_LIST_DATA);
    });
  });

  describe('CancelStockRequest Action Test Cases', () => {
    it('should check correct type is used for  CancelStockRequest action ', () => {
      const payload: CancelOtherRequestPayload = {
        id: 0,
        requestType: ''
      };

      const action = new CancelStockRequest(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.CANCEL_STOCK_REQUEST);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  CancelStockRequestSuccess action ', () => {
      const payload: any = [];
      const action = new CancelStockRequestSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CANCEL_STOCK_REQUEST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  CancelStockRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CancelStockRequestFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.CANCEL_STOCK_REQUEST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('PrintOtherIssues Action Test Cases', () => {
    it('should check correct type is used for  PrintOtherIssues action ', () => {
      const payload: PrintOtherIssuePayload = {
        id: 1,
        requestType: ''
      };

      const action = new PrintOtherIssues(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.PRINT_OTHER_ISSUES);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  PrintOtherIssuesSuccess action ', () => {
      const payload: any = [];
      const action = new PrintOtherIssuesSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.PRINT_OTHER_ISSUES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  PrintOtherIssuesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PrintOtherIssuesFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.PRINT_OTHER_ISSUES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductGroups Action Test Cases', () => {
    it('should check correct type is used for  LoadProductGroups action ', () => {
      const payload = '';
      const action = new LoadProductGroups(payload);

      expect(action.type).toEqual(OtherIssuesActionTypes.LOAD_PROUDCT_GROUPS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadProductGroupsSuccess action ', () => {
      const payload: ProductGroup[] = [
        { description: '', productGroupCode: '' }
      ];
      const action = new LoadProductGroupsSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupsFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_PROUDCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductCategories Action Test Cases', () => {
    it('should check correct type is used for  LoadProductCategories action ', () => {
      const action = new LoadProductCategories();

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_PRODUCT_CATEGORIES
      );
    });
    it('should check correct type is used for  LoadProductCategoriesSuccess action ', () => {
      const payload: ProductCategory[] = [
        { description: '', productCategoryCode: '', isActive: true }
      ];
      const action = new LoadProductCategoriesSuccess(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadProductCategoriesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoriesFailure(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SetFilterDataAllProducts Action Test Cases', () => {
    it('should check correct type is used for SetFilterDataAllProducts action ', () => {
      const payload = {};
      const action = new SetFilterDataAllProducts(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.SET_FILTER_DATA_ALL_PRODUCTS
      );
    });
  });

  describe('SetFilterDataSelectedProducts Action Test Cases', () => {
    it('should check correct type is used for SetFilterDataSelectedProducts action ', () => {
      const payload = {};
      const action = new SetFilterDataSelectedProducts(payload);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.SET_FILTER_DATA_SELECTED_PRODUCTS
      );
    });
  });

  describe('SetSortDataAllProducts Action Test Cases', () => {
    it('should check correct type is used for SetSortDataAllProducts action ', () => {
      const action = new SetSortDataAllProducts([]);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.SET_SORT_DATA_ALL_PRODUCTS
      );
    });
  });

  describe('SetSortDataSelectedProducts Action Test Cases', () => {
    it('should check correct type is used for SetSortDataSelectedProducts action ', () => {
      const action = new SetSortDataSelectedProducts([]);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.SET_SORT_DATA_SELECTED_PRODUCTS
      );
    });
  });

  describe('SetFilterDataOtherIssue Action Test Cases', () => {
    it('should check correct type is used for SetFilterDataOtherIssue action ', () => {
      const action = new SetFilterDataOtherIssue({});

      expect(action.type).toEqual(
        OtherIssuesActionTypes.SET_FILTER_DATA_OTHER_ISSUE
      );
    });
  });

  describe('SetSortDataOtherIssue Action Test Cases', () => {
    it('should check correct type is used for SetSortDataOtherIssue action ', () => {
      const action = new SetSortDataOtherIssue([]);

      expect(action.type).toEqual(
        OtherIssuesActionTypes.SET_SORT_DATA_OTHER_ISSUE
      );
    });
  });

  describe('LoadOtherIssueHistory Action Test Cases', () => {
    it('should check correct type is used for LoadOtherIssueHistory action', () => {
      const payload: LoadOtherIssueHistoryPayload = {
        type: 'other-issues',
        page: 0,
        size: 8,
        sort: '',
        payload: {
          actionType: 'ISSUE',
          dateRangeType: 'LAST_YEAR',
          endDate: null,
          issueDocNo: null,
          issueFiscalYear: null,
          receiveDocNo: null,
          receiveFiscalYear: null,
          startDate: null,
          statuses: [],
          transactionType: 'ADJ'
        },
        issueType: 'ADJ'
      };
      const action = new LoadOtherIssueHistory(payload);
      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY,
        payload
      });
    });

    it('should check correct type is used for LoadOtherIssueHistorySuccess action', () => {
      const payload: OtherIssuedataModel = {
        issueData: [],
        totalElements: 0
      };
      const action = new LoadOtherIssueHistorySuccess(payload);
      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_SUCCESS,
        payload
      });
    });

    it('should check correct type is used for LoadOtherIssueHistoryFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOtherIssueHistoryFailure(payload);
      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_FAILURE,
        payload
      });
    });
  });

  describe('ResetOtherIssueHistory Action Test Cases', () => {
    it('should check correct type is used for ResetOtherIssueHistory action', () => {
      const action = new ResetOtherIssueHistory();
      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.RESET_OTHER_ISSUE_HISTORY
      });
    });
  });
  describe('LoadSelectedHistory Action Test Cases', () => {
    it('should check correct type is used for LoadSelectedHistory Action', () => {
      const payload = {
        type: 'other-issue',
        actionType: 'ISSUE',
        id: 1,
        transactionType: 'ADJ'
      };
      const action = new LoadSelectedHistory(payload);
      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_HISTORY,
        payload
      });
    });

    it('should check correct type is used for LoadSelectedHistory Action', () => {
      const payload: OtherIssueModel = {
        id: 1,
        srcLocationCode: 'srcLoc',
        destLocationCode: 'destLoc',
        status: 'ISSUED',
        weightUnit: 'gms',
        currencyCode: 'INR',
        reqDocNo: 111,
        reqDocDate: moment(),
        reqLocationCode: 'reqLoc',
        requestType: 'ADJ',
        carrierDetails: null,
        destDocDate: moment(),
        destDocNo: 222,
        orderType: null,
        otherDetails: null,
        srcDocDate: moment(),
        srcDocNo: 333,
        srcFiscalYear: 2019,
        totalAvailableQuantity: 10,
        totalAvailableValue: 10000,
        totalAvailableWeight: 100,
        totalMeasuredQuantity: 10,
        totalMeasuredValue: 1000,
        totalMeasuredWeight: 100,
        remarks: 'testing'
      };
      const action = new LoadSelectedHistorySuccess(payload);
      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_HISTORY_SUCCESS,
        payload
      });
    });

    it('should check correct type is used for LoadSelectedHistoryFailure Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedHistoryFailure(payload);
      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_HISTORY_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedHistoryItems Action Test cases', () => {
    it('should check correct type is used for LoadSelectedHistoryItems action', () => {
      const payload: LoadOtherIssueHistoryItemsPayload = {
        type: 'other-issues',
        actionType: 'ISSUE',
        id: 1,
        page: 0,
        size: 10,
        sort: [],
        payload: {
          binCodes: [],
          binGroupCode: null,
          itemCode: null,
          lotNumber: null,
          productCategories: [],
          productGroups: []
        },
        transactionType: 'ADJ'
      };
      const action = new LoadSelectedHistoryItems(payload);
      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS,
        payload
      });
    });

    it('should check correct type is used for LoadSelectedHistoryItems action', () => {
      const payload: LoadOtherIssueHistoryItemsPayload = {
        type: 'other-issues',
        actionType: 'ISSUE',
        id: 1,
        page: 0,
        size: 10,
        sort: [],
        payload: {
          binCodes: [],
          binGroupCode: null,
          itemCode: null,
          lotNumber: null,
          productCategories: [],
          productGroups: []
        },
        transactionType: 'ADJ'
      };
      const action = new LoadSelectedHistoryItems(payload);
      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedHistoryItemsSuccess Action', () => {
      const payload: { items: OtherIssuesHistoryItem[]; count: number } = {
        count: 1,
        items: [
          {
            id: 1,
            itemCode: '111AVSW1111',
            lotNumber: '10000AB1',
            productCategory: '',
            productCategoryDesc: '',
            productGroup: '',
            productGroupDesc: '',
            binCode: '',
            binGroupCode: '',
            orderType: null,
            itemValue: 100,
            itemWeight: 1,
            totalQuantity: 1,
            totalValue: 100,
            totalWeight: 1,
            currencyCode: 'INR',
            weightUnit: 'gms',
            mfgDate: moment(),
            status: 'ISSUED',
            imageURL: '',
            itemDetails: {},
            approvedQuantity: 1,
            issuedQuantity: 1,
            requestedQuantity: 1,
            isUpdating: false,
            isUpdatingSuccess: true,
            totalElements: 1,
            inventoryId: 111111,
            measuredWeight: 10,
            measuredValue: 1000,
            measuredQuantity: 1,
            availableQuantity: 1,
            availableValue: 1000,
            availableWeight: 10,
            stdWeight: 10,
            stdValue: 100,
            isStudded: false
          }
        ]
      };

      const action = new LoadSelectedHistoryItemsSuccess(payload);
      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_SUCCESS,
        payload
      });
    });

    it('should check correct type is used for LoadSelectedHistoryItemsFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedHistoryItemsFailure(payload);
      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_FAILURE,
        payload
      });
    });
  });

  describe('ClearSelectedHistoryItems Action Test cases', () => {
    it('should check correct type is used for ClearSelectedHistoryItems action', () => {
      const action = new ClearSelectedHistoryItems();

      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.CLEAR_OTHER_ISSUE_HISTORY_ITEMS
      });
    });
  });

  describe('LoadSelectedHistoryItemsTotalCount Action Test cases', () => {
    it('should check correct type is used for LoadSelectedHistoryItemsTotalCount action', () => {
      const payload: LoadOtherIssueHistoryItemsPayload = {
        type: 'other-issues',
        actionType: 'ISSUE',
        id: 1,
        page: 0,
        size: 10,
        sort: [],
        payload: {
          binCodes: [],
          binGroupCode: null,
          itemCode: null,
          lotNumber: null,
          productCategories: [],
          productGroups: []
        },
        transactionType: 'ADJ'
      };

      const action = new LoadSelectedHistoryItemsTotalCount(payload);
      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_TOTAL_COUNT,
        payload
      });
    });

    it('should check correct type is used for LoadSelectedHistoryItemsTotalCountSuccess action', () => {
      const payload = 10;

      const action = new LoadSelectedHistoryItemsTotalCountSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_TOTAL_COUNT_SUCCESS,
        payload
      });
    });

    it('should check correct type is used for LoadSelectedHistoryItemsTotalCountFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedHistoryItemsTotalCountFailure(payload);
      expect({ ...action }).toEqual({
        type:
          OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_TOTAL_COUNT_FAILURE,
        payload
      });
    });
  });

  describe('SettingHistoryAdvancedFilterData Action Test cases', () => {
    it('should check correct type is used for SetHistoryAdvancedFilterData Action', () => {
      const payload: OtherReceiptsIssuesAdvanceFilterPayload = {
        docFromDate: null,
        docToDate: null,
        fiscalYear: null,
        docNo: null,
        status: null
      };
      const action = new SetOtherReceiptsIssueFilterData(payload);
      expect({ ...action }).toEqual({
        type: OtherIssuesActionTypes.SET_OTHER_RECEIPTS_ISSUE_FILTER_DATA,
        payload
      });
    });
  });
  // describe('ClearOtherReceiptsIssueFilterData Action Test Cases', () => {
  //   it('should check correct type is used for ClearOtherReceiptsIssueFilterData', () => {
  //     const action = new ClearOtherReceiptsIssueFilterData(0);
  //     expect({ ...action }).toEqual({
  //       type: OtherIssuesActionTypes.CLEAR_OTHER_RECEIPTS_ISSUE_FILTER_DATA
  //     });
  //   });
  // });
});
