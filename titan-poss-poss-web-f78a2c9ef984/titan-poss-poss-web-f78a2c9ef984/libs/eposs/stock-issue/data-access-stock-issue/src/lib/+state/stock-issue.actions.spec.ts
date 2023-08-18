import {
  Column,
  ConfirmIssuePayload,
  CustomErrors,
  Filter,
  IssueAdvanceFilterPayload,
  IssueInventoryItem,
  ItemToleranceValidate,
  LoadCancelIssuesPayload,
  LoadCancelIssuesSTNPayload,
  LoadCancelIssuetemsPayload,
  LoadHistoryRequestPayload,
  LoadIssueItemPayload,
  LoadIssueItemsTotalCountPayload,
  LoadIssueItemsTotalCountSuccessPayload,
  LoadIssueSTNCountsPayload,
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
import {
  CancelIssueSTN,
  CancelIssueSTNFailure,
  CancelIssueSTNSuccess,
  ClearHistoryAdvancedFilterData,
  ClearHistoryItems,
  ClearItems,
  ClearPendingIssuesForCancel,
  ClearSortAndFilter,
  ConfirmIssue,
  ConfirmIssueFailure,
  ConfirmIssueSuccess,
  LoadBoutiqueIssuePendingSTN,
  LoadBoutiqueIssuePendingSTNFailure,
  LoadBoutiqueIssuePendingSTNSuccess,
  LoadCancelIssueCount,
  LoadCancelIssueCountFailure,
  LoadCancelIssueCountSuccess,
  LoadCancelIssueDetails,
  LoadCancelIssueDetailsFailure,
  LoadCancelIssueDetailsSuccess,
  LoadCancelIssueItems,
  LoadCancelIssueItemsCount,
  LoadCancelIssueItemsCountFailure,
  LoadCancelIssueItemsCountSuccess,
  LoadCancelIssueItemsFailure,
  LoadCancelIssueItemsSuccess,
  LoadCancelIssuePendingSTN,
  LoadCancelIssuePendingSTNFailure,
  LoadCancelIssuePendingSTNSuccess,
  LoadCourierDetails,
  LoadCourierDetailsFailure,
  LoadCourierDetailsSuccess,
  LoadEmployeeCodes,
  LoadEmployeeCodesFailure,
  LoadEmployeeCodesSuccess,
  LoadEmployeeDetails,
  LoadEmployeeDetailsFailure,
  LoadEmployeeDetailsSuccess,
  LoadFactoryIssuePendingSTN,
  LoadFactoryIssuePendingSTNFailure,
  LoadFactoryIssuePendingSTNSuccess,
  LoadHistoryItems,
  LoadHistoryItemsFailure,
  LoadHistoryItemsSuccess,
  LoadHistoryItemsTotalCount,
  LoadHistoryItemsTotalCountFailure,
  LoadHistoryItemsTotalCountSuccess,
  LoadIssueHistory,
  LoadIssueHistoryFailure,
  LoadIssueHistorySuccess,
  LoadIssueItemsTotalCount,
  LoadIssueItemsTotalCountFailure,
  LoadIssueItemsTotalCountSuccess,
  LoadIssueSTNCount,
  LoadIssueSTNCountFailure,
  LoadIssueSTNCountSuccess,
  LoadItems,
  LoadItemsFailure,
  LoadItemsSuccess,
  LoadMerchantIssuePendingSTN,
  LoadMerchantIssuePendingSTNFailure,
  LoadMerchantIssuePendingSTNSuccess,
  LoadProductCategories,
  LoadProductCategoriesFailure,
  LoadProductCategoriesSuccess,
  LoadProductGroups,
  LoadProductGroupsFailure,
  LoadProductGroupsSuccess,
  LoadSelectedHistory,
  LoadSelectedHistoryFailure,
  LoadSelectedHistorySuccess,
  LoadSelectedIssue,
  LoadSelectedIssueFailure,
  LoadSelectedIssueSuccess,
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsFailure,
  LoadStuddedProductGroupsSuccess,
  LoadTotalMeasuredWeightAndValue,
  LoadTotalMeasuredWeightAndValueFailure,
  LoadTotalMeasuredWeightAndValueSuccess,
  ResetError,
  ResetLoadedHistory,
  ResetStockIssueList,
  SeachPendingIssuesFailure,
  SearchClear,
  SearchPendingIssues,
  SearchPendingIssuesSuccess,
  SetFilterDataApprovedProducts,
  SetFilterDataSelectedProducts,
  SetHistoryAdvancedFilterData,
  SetSortDataApprovedProducts,
  SetSortDataSelectedProducts,
  StockIssueActionTypes,
  UpdateAllItems,
  UpdateAllItemsFailure,
  UpdateAllItemsSuccess,
  UpdateItem,
  UpdateItemFailure,
  UpdateItemListStatus,
  UpdateItemListStatusFailure,
  UpdateItemListStatusSuccess,
  UpdateItemSuccess,
  ValidateItem,
  ValidateItemFailure,
  ValidateItemSuccess
} from './stock-issue.actions';

describe('Stock Issue Action Testing Suite', () => {
  describe('LoadingFactoryIssuePendingSTN Action Test Cases', () => {
    it('should check correct type is used for LoadFactoryIssuePendingSTN action', () => {
      const payload: LoadPendingIssuePayload = {
        requestType: 'FAC',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadFactoryIssuePendingSTN(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_FACTORY_STN,
        payload
      });
    });

    it('should check correct type is used for LoadFactoryIssuePendingSTNSuccess action', () => {
      const payload: { response: StockRequestNote[]; count: number } = {
        response: [],
        count: 8
      };

      const action = new LoadFactoryIssuePendingSTNSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_FACTORY_STN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadFactoryIssuePendingSTNFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFactoryIssuePendingSTNFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_FACTORY_STN_FAILURE,
        payload
      });
    });
  });

  describe('LoadingBoutiqueIssuePendingSTN Action Test Cases', () => {
    it('should check correct type is used for LoadBoutiqueIssuePendingSTN action', () => {
      const payload: LoadPendingIssuePayload = {
        requestType: 'BTQ',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadBoutiqueIssuePendingSTN(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_BOUTIQUE_STN,
        payload
      });
    });

    it('should check correct type is used for LoadBoutiqueIssuePendingSTNSuccess action', () => {
      const payload: { response: StockRequestNote[]; count: number } = {
        response: [],
        count: 8
      };

      const action = new LoadBoutiqueIssuePendingSTNSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_BOUTIQUE_STN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadBoutiqueIssuePendingSTNFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBoutiqueIssuePendingSTNFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_BOUTIQUE_STN_FAILURE,
        payload
      });
    });
  });

  describe('LoadingMerchantIssuePendingSTN Action Test Cases', () => {
    it('should check correct type is used for LoadMerchantIssuePendingSTN action', () => {
      const payload: LoadPendingIssuePayload = {
        requestType: 'BTQ',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadMerchantIssuePendingSTN(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_MERCHANT_STN,
        payload
      });
    });

    it('should check correct type is used for LoadMerchantIssuePendingSTNSuccess action', () => {
      const payload: { response: StockRequestNote[]; count: number } = {
        response: [],
        count: 8
      };

      const action = new LoadMerchantIssuePendingSTNSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_MERCHANT_STN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadMerchantIssuePendingSTNFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMerchantIssuePendingSTNFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_MERCHANT_STN_FAILURE,
        payload
      });
    });
  });

  describe('LoadingIssueSTNCount Action Test Cases', () => {
    it('should check correct type is used for LoadIssuesSTNCount action', () => {
      const action = new LoadIssueSTNCount();
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_ISSUES_COUNT
      });
    });

    it('should check correct type is used for LoadIssuesSTNCountSuccess action', () => {
      const payload: LoadIssueSTNCountsPayload = {
        pendingIssueBTQ_BTQ_STNCount: 5,
        pendingIssueBTQ_FAC_STNCount: 5,
        pendingIssueBTQ_MER_STNCount: 5
      };
      const action = new LoadIssueSTNCountSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_ISSUES_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadIssuesSTNCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssueSTNCountFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_ISSUES_COUNT_FAILURE,
        payload
      });
    });
  });

  describe('SearchingPendingIssues Action Test Cases', () => {
    it('should check correct type is used for SearchPendingIssues action', () => {
      const payload: SearchPendingPayload = {
        reqDocNo: 111,
        requestType: 'FAC'
      };
      const action = new SearchPendingIssues(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.SEARCH_PENDING_ISSUES,
        payload
      });
    });
    it('should check correct type is used for SearchPendingIssuesSuccess action', () => {
      const payload: StockRequestNote[] = [];

      const action = new SearchPendingIssuesSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.SEARCH_PENDING_ISSUES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchPendingIssuesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SeachPendingIssuesFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.SEARCH_PENDING_ISSUES_FAILURE,
        payload
      });
    });
  });

  describe('ClearingSTNSearch Action Test Cases', () => {
    it('should check corrct type is used for SearchClear action', () => {
      const action = new SearchClear();
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.SEARCH_CLEAR
      });
    });
  });

  describe('ResettingStockIssueList Action Test Cases', () => {
    it('should check correct type is used for ResetStockIssueList action', () => {
      const action = new ResetStockIssueList();
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.RESET_STOCK_ISSUE_LIST
      });
    });
  });

  describe('LoadingSelectedIssue Action Test Cases', () => {
    it('should check correct type is used for LoadSelectedIssue action', () => {
      const payload: LoadSelectedPayload = {
        id: 1,
        requestType: 'FAC'
      };
      const action = new LoadSelectedIssue(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_SELECTED_ISSUE,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedIssueSuccess action', () => {
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
      const action = new LoadSelectedIssueSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_SELECTED_ISSUE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedIssueFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedIssueFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_SELECTED_ISSUE_FAILURE,
        payload
      });
    });
  });

  describe('LoadingItems Actions Test Cases', () => {
    it('should check correct type is used for LoadItems action', () => {
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
      const action = new LoadItems(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_ITEMS,
        payload
      });
    });
    it('should check correct type is used for LoadItemsSuccess action', () => {
      const payload: { items: IssueInventoryItem[]; count: number } = {
        items: [],
        count: 10
      };
      const action = new LoadItemsSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_ITEMS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadItemsFailure action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemsFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_ITEMS_FAILURE,
        payload
      });
    });
  });
  describe('ClearingItems Actions Test Cases', () => {
    it('should check correct type is used for ClearItems action', () => {
      const action = new ClearItems();
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.CLEAR_ITEMS
      });
    });
  });

  describe('LoadingIssueItemsTotalCount Action Test Cases', () => {
    it('should check correct type is used for LoadIssueItemsTotalCount Action', () => {
      const payload: LoadIssueItemsTotalCountPayload = {
        id: 11,
        requestType: 'FAC',
        storeType: 'L1'
      };
      const action = new LoadIssueItemsTotalCount(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_ISSUE_ITEMS_COUNT,
        payload
      });
    });
    it('should check correct type is used for LoadIssueItemsTotalCountSuccess Action', () => {
      const payload: LoadIssueItemsTotalCountSuccessPayload = {
        approvedItemsTotalCount: 10,
        selectedItemsTotalCount: 5,
        // searchedItemsCount: number;
        historyItemsTotalCount: 0
      };
      const action = new LoadIssueItemsTotalCountSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_ISSUE_ITEMS_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadIssueItemsTotalCountFailure Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssueItemsTotalCountFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_ISSUE_ITEMS_COUNT_FAILURE,
        payload
      });
    });
  });

  describe('UpdatingAllItems Action Test Cases', () => {
    it('should check correct type is used for UpdateAllItems Action', () => {
      const payload: UpdateAllItemPayload = {
        requestType: 'FAC',
        storeType: 'L1',
        id: 1,
        itemId: '11001111',
        status: 'APPROVED'
      };
      const action = new UpdateAllItems(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.UPDATE_ALL_ITEM,
        payload
      });
    });
    it('should check correct type is used for UpdateAllItemsSuccess Action', () => {
      const payload = true;
      const action = new UpdateAllItemsSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.UPDATE_ALL_ITEM_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateAllItemsFailure Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateAllItemsFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.UPDATE_ALL_ITEM_FAILURE,
        payload
      });
    });
  });
  describe('ValidatingItems Action Test Cases', () => {
    it('should check correct type is used for ValidateItem Action', () => {
      const payload: ItemToleranceValidate = {
        itemId: '11100000AB11',
        productGroupCode: '71',
        availableWeight: 10.1,
        measuredWeight: 10.08,
        measuredQuantity: 2,
        availableQuantity: 2
      };
      const action = new ValidateItem(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.VALIDATE_ITEM,
        payload
      });
    });
    it('should check correct type is used for ValidateItemSuccess Action', () => {
      const payload: {
        itemId: string;
        isSuccess: boolean;
      } = {
        itemId: '11100000AB11',
        isSuccess: true
      };
      const action = new ValidateItemSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.VALIDATE_ITEM_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for ValidateItemFailure Action', () => {
      const payload: {
        itemId: string;
        error: CustomErrors;
      } = {
        itemId: '11100000AB11',
        error: CustomErrorAdaptor.fromJson(Error('Some Error'))
      };

      const action = new ValidateItemFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.VALIDATE_ITEM_FAILURE,
        payload
      });
    });
  });
  describe('UpdatingItem Action Test Cases', () => {
    it('should check correct type is used for UpdateItem Action', () => {
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
      const action = new UpdateItem(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.UPDATE_ITEM,
        payload
      });
    });

    it('should check correct type is used for UpdateItemSuccess Action', () => {
      const payload: IssueInventoryItem = {
        availableQuantity: 1,
        availableValue: 1000,
        availableWeight: 10,
        binCode: '71',
        binGroupCode: 'Plain Gold',
        currencyCode: 'INR',
        id: '10001',
        imageURL: 'imageurl.com',
        inventoryId: '1234567asdfgh',
        itemCode: '11110000AB1',
        itemDetails: {},
        lotNumber: '1ABOOOO1',
        measuredQuantity: 1,
        measuredValue: 1000,
        measuredWeight: 10,
        mfgDate: moment(),
        orderType: null,
        productCategory: null,
        productCategoryDesc: null,
        productGroup: null,
        productGroupDesc: null,
        status: null,
        stdValue: null,
        stdWeight: null,
        weightUnit: null,
        isUpdating: false,
        isUpdatingSuccess: false,
        isValidating: false,
        isValidatingSuccess: false,
        isValidatingError: false,
        isStudded: false,
        taxDetails: null,
        isLoadingImage: true,
        isLoadingThumbnailImage: true,
        thumbnailImageURL: 'url/data'
      };
      const action = new UpdateItemSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.UPDATE_ITEM_SUCCESS,
        payload
      });
    });

    it('should check correct type is used for UpdateItemFailure Action', () => {
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

      const action = new UpdateItemFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.UPDATE_ITEM_FAILURE,
        payload
      });
    });
  });
  describe('ConfirmingIssue Action Test Cases', () => {
    it('should check correct type is used for ConfirmIssue Action', () => {
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
      const action = new ConfirmIssue(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.CONFIRM_ISSUE,
        payload
      });
    });
    it('should check correct type is used for ConfirmIssueSuccess Action', () => {
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

      const action = new ConfirmIssueSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.CONFIRM_ISSUE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for ConfirmIssue Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmIssueFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.CONFIRM_ISSUE_FAILURE,
        payload
      });
    });
  });
  describe('LoadingCourierDetails Action Test Cases', () => {
    it('should check correct types is used for LoadCourierDetails Action', () => {
      const payload = 'HNR';
      const action = new LoadCourierDetails(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_COURIER_DETAILS,
        payload
      });
    });
    it('should check correct type is used for LoadCourierDetails Action', () => {
      const payload: string[] = [];
      const action = new LoadCourierDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_COURIER_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCourierDetailsFailure Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCourierDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_COURIER_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadingEmployeeCodes Action Test Cases', () => {
    it('should check correct types is used for LoadEmployeeCodes Action', () => {
      const action = new LoadEmployeeCodes();

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_EMPLOYEE_CODES
      });
    });
    it('should check correct type is used for LoadEmployeeCodesSuccess Action', () => {
      const payload: string[] = [];
      const action = new LoadEmployeeCodesSuccess(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_EMPLOYEE_CODES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadEmployeeCodesFailure Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadEmployeeCodesFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_EMPLOYEE_CODES_FAILURE,
        payload
      });
    });
  });

  describe('LoadingEmployeeDetails Action Test Cases', () => {
    it('should check correct types is used for LoadEmployeeDetails Action', () => {
      const payload = '111';
      const action = new LoadEmployeeDetails(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_EMPLOYEE_DETAILS,
        payload
      });
    });
    it('should check correct type is used for LoadEmployeeDetailsSuccess Action', () => {
      const payload: StoreUser[] = [];
      const action = new LoadEmployeeDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_EMPLOYEE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadEmployeeDetailsFailure Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadEmployeeDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_EMPLOYEE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadingProductCategories Action Test Cases', () => {
    it('should check correct types is used for LoadProductCategories Action', () => {
      const action = new LoadProductCategories();
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PRODUCT_CATEGORIES
      });
    });
    it('should check correct type is used for LoadProductCategoriesSuccess Action', () => {
      const payload: ProductCategory[] = [];
      const action = new LoadProductCategoriesSuccess(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadProductCategoriesFailure Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoriesFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE,
        payload
      });
    });
  });

  describe('LoadingProductGroups Action Test Cases', () => {
    it('should check correct types is used for LoadProductGroups Action', () => {
      const action = new LoadProductGroups();
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PROUDCT_GROUPS
      });
    });
    it('should check correct type is used for LoadProductGroupsSuccess Action', () => {
      const payload: ProductGroup[] = [];
      const action = new LoadProductGroupsSuccess(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadProductGroupsFailuew Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupsFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PROUDCT_GROUPS_FAILURE,
        payload
      });
    });
  });

  describe('LoadingStuddedProductGroups Action Test Cases', () => {
    it('should check correct types is used for LoadStuddedProductGroups Action', () => {
      const action = new LoadStuddedProductGroups();

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_STUDDED_PRODUCT_GROUPS
      });
    });
    it('should check correct type is used for LoadStuddedProductGroupsSuccess Action', () => {
      const payload: string[] = [];
      const action = new LoadStuddedProductGroupsSuccess(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadStuddedProductGroupsFailure Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStuddedProductGroupsFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE,
        payload
      });
    });
  });
  describe('SettingFilterDataApprovedProducts Action Test cases', () => {
    it('should check correct type is used for SetFilterDataApprovedProducts', () => {
      const payload: { [key: string]: Filter[] } = {
        ['productCategory']: [{ id: 1, description: 'AA', selected: true }]
      };

      const action = new SetFilterDataApprovedProducts(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.SET_FILTER_DATA_APPROVED_PRODUCTS,
        payload
      });
    });
  });
  describe('SettingFilterDataSelectedProducts Action Test cases', () => {
    it('should check correct type is used for SetFilterDataSelectedProducts', () => {
      const payload: { [key: string]: Filter[] } = {
        ['productCategory']: [{ id: 1, description: 'AA', selected: true }]
      };

      const action = new SetFilterDataSelectedProducts(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.SET_FILTER_DATA_SELECTED_PRODUCTS,
        payload
      });
    });
  });
  describe('SettingSortDataApprovedProducts Action Test Case', () => {
    it('should check correct type is used for SetSortDataApprovedProducsts Action', () => {
      const payload: Column[] = [];

      const action = new SetSortDataApprovedProducts(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.SET_SORT_DATA_APPROVED_PRODUCTS,
        payload
      });
    });
  });
  describe('SettingSortDataSelectedProducts Action Test Case', () => {
    it('should check correct type is used for SetSortDataSelectedProducsts Action', () => {
      const payload: Column[] = [];

      const action = new SetSortDataSelectedProducts(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.SET_SORT_DATA_SELECTED_PRODUCTS,
        payload
      });
    });
  });
  describe('ClearingSortAndFilter Action Test Case', () => {
    it('should check correct type is used for ClearSortAndFilter Action', () => {
      const action = new ClearSortAndFilter();

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.CLEAR_SORT_AND_FILTER
      });
    });
  });
  describe('ResettingError Action Test Case', () => {
    it('should check correct type is used for ResetError Action', () => {
      const action = new ResetError();

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.RESET_ERROR
      });
    });
  });
  describe('UpdatingItemListStatus Action Test Cases', () => {
    it('should check correct type is used for UpdateItemListStatus Action', () => {
      const payload: UpdateItemListStatusPayload = {
        type: 'BTQ',
        id: 11,
        requestGroup: 'IBT',
        itemIds: [],
        remarks: 'test data'
      };
      const action = new UpdateItemListStatus(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.UPDATE_ITEM_LIST_STATUS,
        payload
      });
    });
    it('should check correct type is used for UpdateItemListStatusSuccess Action', () => {
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
      const action = new UpdateItemListStatusSuccess(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.UPDATE_ITEM_LIST_STATUS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateItemListStatusFailure Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateItemListStatusFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.UPDATE_ITEM_LIST_STATUS_FAILURE,
        payload
      });
    });
  });
  describe('LoadingTotalMeasuredWeightAndValue Action Test Cases', () => {
    it('should check correct type is used for LoadTotalMeasuredWeightAndValue Action', () => {
      const payload: LoadSelectedPayload = {
        id: 1,
        requestType: 'FAC'
      };
      const action = new LoadTotalMeasuredWeightAndValue(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_TOTAL_WEIGHT_AND_VALUE,
        payload
      });
    });
    it('should check correct type is used for LoadTotalMeasuredWeightAndValueSuccess Action', () => {
      const payload: MeasuredWeightAndValuePayload = {
        currencyCode: 'INR',
        totalMeasuredQuantity: 2,
        totalMeasuredValue: 10000,
        totalMeasuredWeight: 10,
        weightUnit: 'gms'
      };
      const action = new LoadTotalMeasuredWeightAndValueSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_TOTAL_WEIGHT_AND_VALUE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadToalMeasuredWeightAndValueFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTotalMeasuredWeightAndValueFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_TOTAL_WEIGHT_AND_VALUE_FAILURE,
        payload
      });
    });
  });
  describe('LoadingissueHistory Actions Test Cases', () => {
    it('should check correct type is used for LoadIssueHistory', () => {
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
      const action = new LoadIssueHistory(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_ISSUE_HISTORY,
        payload
      });
    });
    it('should check correct type is used for LoadIssueHistorySuccess Action', () => {
      const payload: { response: StockRequestNote[]; count: number } = {
        response: [],
        count: 10
      };
      const action = new LoadIssueHistorySuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_ISSUE_HISTORY_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadIssueHistoryFailure Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssueHistoryFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_ISSUE_HISTORY_FAILURE,
        payload
      });
    });
  });
  describe('ResettingLoadedHistory Action Test Cases', () => {
    it('should check correct type is used for ResetLoadedHistory', () => {
      const action = new ResetLoadedHistory();
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.RESET_LOADED_HISTORY
      });
    });
  });
  describe('LoadingSelectedHistory Action Test Cases', () => {
    it('should check correct type is used for LoadSelectedHistory Action', () => {
      const payload: StockIssueSelectedHistoryPayload = {
        actionType: 'ISSUE',
        id: 1,
        type: 'BTW',
        isL1L2Store: true,
        isL3Store: false
      };
      const action = new LoadSelectedHistory(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_SELECTED_HISTORY,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedHistorySuccess Action', () => {
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
      const action = new LoadSelectedHistorySuccess(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_SELECTED_HISTORY_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedHistoryFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedHistoryFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_SELECTED_HISTORY_FAILURE,
        payload
      });
    });
  });
  describe('LoadingHistoryItems Actions Test Cases', () => {
    it('should check correct type is used for LoadHistoryItems Action', () => {
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
      const action = new LoadHistoryItems(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS,
        payload
      });
    });
    it('should check correct type is used for LoadHistoryItemsSuccess Action', () => {
      const payload: { items: IssueInventoryItem[]; count: number } = {
        items: [],
        count: 10
      };
      const action = new LoadHistoryItemsSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadHistoryItemsFailure Action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadHistoryItemsFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_FAILURE,
        payload
      });
    });
  });
  describe('ClearingHistoryItems Action Test cases', () => {
    it('should check correct type is used for ClearHistoryItems Action', () => {
      const action = new ClearHistoryItems();
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.CLEAR_SELECTED_HISTORY_ITEMS
      });
    });
  });
  describe('LoadingHistoryItemsCount Action test Cases', () => {
    it('should check correct type is used for LoadHistoryItemsTotalCount Action', () => {
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
      const action = new LoadHistoryItemsTotalCount(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_COUNT,
        payload
      });
    });
    it('should check correct type is used for LoadHistoryItemsTotalCountSuccess Action', () => {
      const payload = 10;
      const action = new LoadHistoryItemsTotalCountSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadHistoryItemsTotalCountFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadHistoryItemsTotalCountFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_COUNT_FAILURE,
        payload
      });
    });
  });
  describe('SettingHistoryAdvancedFilterData Action Test cases', () => {
    it('should check correct type is used for SetHistoryAdvancedFilterData Action', () => {
      const payload: IssueAdvanceFilterPayload = {
        docFromDate: null,
        docToDate: null,
        locationCode: null,
        fiscalYear: null,
        docNo: null
      };
      const action = new SetHistoryAdvancedFilterData(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.SET_ADAVANCED_FILTER_DATA,
        payload
      });
    });
  });
  describe('ClearingHistoryAdvancedFilterData Action Test Cases', () => {
    it('should check correct type is used for ClearHistoryAdvancedFilterData', () => {
      const action = new ClearHistoryAdvancedFilterData(1);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.CLEAR_ADAVANCED_FILTER_DATA,
        payload: 1
      });
    });
  });

  // cancel STN
  describe('LoadCancelIssuePendingSTN Action Test Cases', () => {
    it('should check correct type is used for LoadCancelIssuePendingSTN action', () => {
      const payload: LoadCancelIssuesSTNPayload = {
        requestType: 'FAC',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadCancelIssuePendingSTN(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_CANCEL_STN,
        payload
      });
    });

    it('should check correct type is used for LoadCancelIssuePendingSTNSuccess action', () => {
      const payload: { response: StockRequestNote[]; count: number } = {
        response: [],
        count: 8
      };

      const action = new LoadCancelIssuePendingSTNSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_CANCEL_STN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCancelIssuePendingSTNFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCancelIssuePendingSTNFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_CANCEL_STN_FAILURE,
        payload
      });
    });
  });

  describe('LoadCancelIssueCount Action Test Cases', () => {
    it('should check correct type is used for LoadCancelIssueCount action', () => {
      const payload: LoadCancelIssuesPayload = {
        transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
      };
      const action = new LoadCancelIssueCount(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_CANCEL_ISSUES_COUNT,
        payload
      });
    });

    it('should check correct type is used for LoadCancelIssueCountSuccess action', () => {
      const action = new LoadCancelIssueCountSuccess(1);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_CANCEL_ISSUES_COUNT_SUCCESS,
        payload: 1
      });
    });
    it('should check correct type is used for LoadCancelIssueCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCancelIssueCountFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_CANCEL_ISSUES_COUNT_FAILURE,
        payload
      });
    });
  });

  describe('LoadCancelIssueDetails Action Test Cases', () => {
    it('should check correct type is used for LoadCancelIssueDetails action', () => {
      const payload: LoadCancelIssuesPayload = {
        transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
      };
      const action = new LoadCancelIssueDetails(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_CANCEL_ISSUES_DETAILS,
        payload
      });
    });

    it('should check correct type is used for LoadCancelIssueDetailsSuccess action', () => {
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
      const action = new LoadCancelIssueDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_CANCEL_ISSUES_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCancelIssueDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCancelIssueDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_CANCEL_ISSUES_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadCancelIssueItems Action Test Cases', () => {
    it('should check correct type is used for LoadCancelIssueItems action', () => {
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
      const action = new LoadCancelIssueItems(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS,
        payload
      });
    });

    it('should check correct type is used for LoadCancelIssueItemsSuccess action', () => {
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

      const action = new LoadCancelIssueItemsSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCancelIssueItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCancelIssueItemsFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_FAILURE,
        payload
      });
    });
  });

  describe('LoadCancelIssueItemsCount Action Test Cases', () => {
    it('should check correct type is used for LoadCancelIssueItemsCount action', () => {
      const payload: LoadCancelIssuesPayload = {
        transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
      };
      const action = new LoadCancelIssueItemsCount(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_COUNT,
        payload
      });
    });

    it('should check correct type is used for LoadCancelIssueItemsCountSuccess action', () => {
      const action = new LoadCancelIssueItemsCountSuccess(8);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_COUNT_SUCCESS,
        payload: 8
      });
    });
    it('should check correct type is used for LoadCancelIssueItemsCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCancelIssueItemsCountFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_COUNT_FAILURE,
        payload
      });
    });
  });

  describe('CancelIssueSTN Action Test Cases', () => {
    it('should check correct type is used for CancelIssueSTN action', () => {
      const payload: LoadCancelIssuesPayload = {
        transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
      };
      const action = new CancelIssueSTN(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.CANCEL_ISSUE_STN,
        payload
      });
    });

    it('should check correct type is used for CancelIssueSTNSuccess action', () => {
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
      const action = new CancelIssueSTNSuccess(payload);
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.CANCEL_ISSUE_STN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for CancelIssueSTNFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CancelIssueSTNFailure(payload);

      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.CANCEL_ISSUE_STN_FAILURE,
        payload
      });
    });
  });

  describe('ClearPendingIssuesForCancel Action Test cases', () => {
    it('should check correct type is used for ClearPendingIssuesForCancel Action', () => {
      const action = new ClearPendingIssuesForCancel();
      expect({ ...action }).toEqual({
        type: StockIssueActionTypes.CLEAR_PENDING_ISSUES_FOR_CANCEL
      });
    });
  });
});
