import {
  Column,
  CreateStockIssueItemsPayload,
  CreateStockIssuePayload,
  CreateStockIssueResponse,
  CustomErrors,
  Filter,
  LoadStockIssueItemsPayload,
  LocationSummaryDetails,
  ProductCategory,
  ProductGroup,
  StockIssueItem,
  StoreUser,
  UpdateStockIssuePayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import {
  CreateStockIssue,
  CreateStockIssueFailure,
  CreateStockIssueItems,
  CreateStockIssueItemsFailure,
  CreateStockIssueItemsSuccess,
  CreateStockIssueSuccess,
  IssueTEPActionTypes,
  LoadCourierDetails,
  LoadCourierDetailsFailure,
  LoadCourierDetailsSuccess,
  LoadEmployeeCodes,
  LoadEmployeeCodesFailure,
  LoadEmployeeCodesSuccess,
  LoadEmployeeDetails,
  LoadEmployeeDetailsFailure,
  LoadEmployeeDetailsSuccess,
  LoadFactoryAddress,
  LoadFactoryAddressFailure,
  LoadFactoryAddressSuccess,
  LoadItems,
  LoadItemsFailure,
  LoadItemsSuccess,
  LoadProductCategories,
  LoadProductCategoriesFailure,
  LoadProductCategoriesSuccess,
  LoadProductGroups,
  LoadProductGroupsFailure,
  LoadProductGroupsSuccess,
  LoadStockIssueItems,
  LoadStockIssueItemsFailure,
  LoadStockIssueItemsSuccess,
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsFailure,
  LoadStuddedProductGroupsSuccess,
  LoadTotalItemsCount,
  LoadTotalItemsCountFailure,
  LoadTotalItemsCountSuccess,
  LoadTotalStockIssueItemsCount,
  LoadTotalStockIssueItemsCountFailure,
  LoadTotalStockIssueItemsCountSuccess,
  ResetAll,
  ResetList,
  ResetResponse,
  SearchClear,
  SetFilterDataItems,
  SetFilterDataStockIssueItems,
  SetSortDataItems,
  SetSortDataStockIssueItems,
  UpdateAllStockIssueItems,
  UpdateAllStockIssueItemsFailure,
  UpdateAllStockIssueItemsSuccess,
  UpdateStockIssue,
  UpdateStockIssueFailure,
  UpdateStockIssueSuccess
} from './stock-issue-tep-gep.action';

describe('Issue TEP-GEP Actions Testing suit', () => {
  const createStockIssuePayload: CreateStockIssuePayload = {
    transferType: 'TEP_PLAIN',
    storeType: 'L1'
  };

  const createStockIssueResponse: CreateStockIssueResponse = {
    id: 1,
    srcLocationCode: 'ABO',
    destLocationCode: 'FHJR',
    status: 'OPEN',
    weightUnit: 'gms',
    currencyCode: 'INR',
    srcDocNo: 1001,
    srcFiscalYear: 100,
    srcDocDate: moment(),
    destDocNo: 2001,
    destDocDate: moment(),
    orderType: 'R',
    totalAvailableQuantity: 5,
    totalMeasuredQuantity: 4,
    totalAvailableValue: 50,
    totalMeasuredValue: 60,
    totalAvailableWeight: 12,
    totalMeasuredWeight: 13,
    // for l1/l2
    transferType: 'TEP_PLAIN',
    // for l3
    invoiceType: 'TEP_PLAIN',
    // for l1/l2
    courierReceivedDate: moment(),
    courierDetails: {},
    // for l3
    issuedRemarks: 'remarks'
  };

  const updateStockIssuePayload: UpdateStockIssuePayload = {
    id: 12,
    transferType: 'TEP_PLAIN',
    storeType: 'L1',
    remarks: 'string'
  };

  const loadStockIssueItemsPayload: LoadStockIssueItemsPayload = {
    id: 12,
    transferType: 'TEP_PLAIN',
    storeType: 'L1',
    status: 'OPEN'
  };

  const itemsResponse: StockIssueItem[] = [
    {
      id: 1,
      itemCode: '21212121212921',
      lotNumber: '1234567',
      mfgDate: moment(),
      productCategory: 'P',
      productGroup: 'Plain',
      binCode: 'A',
      binGroupCode: 'B',
      stdValue: 120,
      stdWeight: 130,
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'OPEN,',
      imageURL: 'url',
      itemDetails: {},
      availableQuantity: 10,
      availableWeight: 100,
      availableValue: 11,
      measuredQuantity: 20,
      measuredWeight: 200,
      measuredValue: 22,
      orderType: 'R',
      inventoryId: '100',
      productCategoryDesc: 'gold',
      productGroupDesc: 'plain',
      // for l3
      remarks: 'remarks',
      totalElements: 12,
      isStudded: true,
      refDocDate: moment(),
      refDocNumber: 1,
      refDocType: 'TEP',
      taxDetails: null
    }
  ];

  const createStockIssueItemsPayload: CreateStockIssueItemsPayload = {
    id: 12,
    transferType: 'TEP_PLAIN',
    storeType: 'L1',
    itemIds: ['20D16ABE-DB4E-4E25-BD4C-20126C3B7D79']
  };

  const createStockIssueItemsRes: boolean = true;

  const loadStockIssueItemsCountRes: number = 10;

  const locationSummaryDetails: LocationSummaryDetails = {
    address: 'string',
    brandCode: 'Tanishq',
    description: null,
    isActive: true,
    locationCode: 'PAT',
    locationTypeCode: 'CFA',
    phoneNo: null,
    regionCode: null,
    stateCode: null,
    townCode: null
  };

  const productCategoryRes: ProductCategory[] = [
    {
      description: 'chain',
      productCategoryCode: 'C'
    }
  ];

  const productGroupRes: ProductGroup[] = [
    {
      description: 'Gold Plain',
      productGroupCode: '71'
    }
  ];

  const courierDetailsReq: string = 'CPD';

  const courierDetailsRes: string[] = ['CPD'];

  const employeeCodesRes: string[] = ['ID1'];

  const employeeDetailsReq: string = 'ID1';

  const employeeDetailsRes: StoreUser[] = [
    {
      empName: 'ABC',
      employeeCode: 'ID1',
      locationCode: 'CPD',
      mobileNo: '9876543210',
      isLoginActive: true
    }
  ];

  const studdedProductGroups: string[] = ['72'];

  const sortData: Column[] = [
    {
      id: 13,
      sortByColumnName: 'TOTAL_WEIGHT',
      sortAscOrder: true
    }
  ];

  const filterArray = [
    {
      id: 14,
      description: 'PLAIN',
      selected: true
    }
  ];

  const filterData: { [key: string]: Filter[] } = {
    filter: filterArray
  };

  describe('CreateStockIssue Action Test Cases', () => {
    it('should check correct type is used for  CreateStockIssue action ', () => {
      const action = new CreateStockIssue(createStockIssuePayload);

      expect(action.type).toEqual(IssueTEPActionTypes.CREATE_STOCK_ISSUE);
      expect(action.payload).toEqual(createStockIssuePayload);
    });

    it('should check correct type is used for  CreateStockIssueSuccess action ', () => {
      const action = new CreateStockIssueSuccess(createStockIssueResponse);

      expect(action.type).toEqual(
        IssueTEPActionTypes.CREATE_STOCK_ISSUE_SUCCESS
      );
      expect(action.payload).toEqual(createStockIssueResponse);
    });

    it('should check correct type is used for  CreateStockIssueFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateStockIssueFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.CREATE_STOCK_ISSUE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('UpdateStockIssue Action Test Cases', () => {
    it('should check correct type is used for  UpdateStockIssue action ', () => {
      const action = new UpdateStockIssue(updateStockIssuePayload);

      expect(action.type).toEqual(IssueTEPActionTypes.UPDATE_STOCK_ISSUE);
      expect(action.payload).toEqual(updateStockIssuePayload);
    });

    it('should check correct type is used for  UpdateStockIssueSuccess action ', () => {
      const action = new UpdateStockIssueSuccess(createStockIssueResponse);

      expect(action.type).toEqual(
        IssueTEPActionTypes.UPDATE_STOCK_ISSUE_SUCCESS
      );
      expect(action.payload).toEqual(createStockIssueResponse);
    });

    it('should check correct type is used for  UpdateStockIssueFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateStockIssueFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.UPDATE_STOCK_ISSUE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadItems Action Test Cases', () => {
    it('should check correct type is used for  LoadItems action ', () => {
      const action = new LoadItems(loadStockIssueItemsPayload);

      expect(action.type).toEqual(IssueTEPActionTypes.LOAD_ITEMS);
      expect(action.payload).toEqual(loadStockIssueItemsPayload);
    });

    it('should check correct type is used for  LoadItemsSuccess action ', () => {
      const action = new LoadItemsSuccess(itemsResponse);

      expect(action.type).toEqual(IssueTEPActionTypes.LOAD_ITEMS_SUCCESS);
      expect(action.payload).toEqual(itemsResponse);
    });

    it('should check correct type is used for  LoadItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemsFailure(payload);

      expect(action.type).toEqual(IssueTEPActionTypes.LOAD_ITEMS_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('UpdateAllStockIssueItems Action Test Cases', () => {
    it('should check correct type is used for  UpdateAllStockIssueItems action ', () => {
      const action = new UpdateAllStockIssueItems(createStockIssueItemsPayload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.UPDATE_ALL_STOCK_ISSUE_ITEMS
      );
      expect(action.payload).toEqual(createStockIssueItemsPayload);
    });

    it('should check correct type is used for  UpdateAllStockIssueItemsSuccess action ', () => {
      const action = new UpdateAllStockIssueItemsSuccess(
        createStockIssueItemsRes
      );

      expect(action.type).toEqual(
        IssueTEPActionTypes.UPDATE_ALL_STOCK_ISSUE_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(createStockIssueItemsRes);
    });

    it('should check correct type is used for  UpdateAllStockIssueItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateAllStockIssueItemsFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.UPDATE_ALL_STOCK_ISSUE_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('CreateStockIssueItems Action Test Cases', () => {
    it('should check correct type is used for  CreateStockIssueItems action ', () => {
      const action = new CreateStockIssueItems(createStockIssueItemsPayload);

      expect(action.type).toEqual(IssueTEPActionTypes.CREATE_STOCK_ISSUE_ITEMS);
      expect(action.payload).toEqual(createStockIssueItemsPayload);
    });

    it('should check correct type is used for  CreateStockIssueItemsSuccess action ', () => {
      const action = new CreateStockIssueItemsSuccess(createStockIssueItemsRes);

      expect(action.type).toEqual(
        IssueTEPActionTypes.CREATE_STOCK_ISSUE_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(createStockIssueItemsRes);
    });

    it('should check correct type is used for  CreateStockIssueItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateStockIssueItemsFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.CREATE_STOCK_ISSUE_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadStockIssueItems Action Test Cases', () => {
    it('should check correct type is used for  LoadStockIssueItems action ', () => {
      const action = new LoadStockIssueItems(loadStockIssueItemsPayload);

      expect(action.type).toEqual(IssueTEPActionTypes.LOAD_STOCK_ISSUE_ITEMS);
      expect(action.payload).toEqual(loadStockIssueItemsPayload);
    });

    it('should check correct type is used for  LoadStockIssueItemsSuccess action ', () => {
      const action = new LoadStockIssueItemsSuccess(itemsResponse);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_STOCK_ISSUE_ITEMS_SUCCESS
      );
      expect(action.payload).toEqual(itemsResponse);
    });

    it('should check correct type is used for  LoadStockIssueItemsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStockIssueItemsFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_STOCK_ISSUE_ITEMS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadTotalItemsCount Action Test Cases', () => {
    it('should check correct type is used for  LoadTotalItemsCount action ', () => {
      const action = new LoadTotalItemsCount(loadStockIssueItemsPayload);

      expect(action.type).toEqual(IssueTEPActionTypes.LOAD_TOTAL_ITEMS_COUNT);
      expect(action.payload).toEqual(loadStockIssueItemsPayload);
    });

    it('should check correct type is used for  LoadTotalItemsCountSuccess action ', () => {
      const action = new LoadTotalItemsCountSuccess(
        loadStockIssueItemsCountRes
      );

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_TOTAL_ITEMS_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(loadStockIssueItemsCountRes);
    });

    it('should check correct type is used for  LoadTotalItemsCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTotalItemsCountFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_TOTAL_ITEMS_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadTotalStockIssueItemsCount Action Test Cases', () => {
    it('should check correct type is used for  LoadTotalStockIssueItemsCount action ', () => {
      const action = new LoadTotalStockIssueItemsCount(
        loadStockIssueItemsPayload
      );

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_TOTAL_STOCK_ISSUE_ITEMS_COUNT
      );
      expect(action.payload).toEqual(loadStockIssueItemsPayload);
    });

    it('should check correct type is used for  LoadTotalStockIssueItemsCountSuccess action ', () => {
      const action = new LoadTotalStockIssueItemsCountSuccess(
        loadStockIssueItemsCountRes
      );

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_TOTAL_STOCK_ISSUE_ITEMS_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(loadStockIssueItemsCountRes);
    });

    it('should check correct type is used for  LoadTotalStockIssueItemsCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTotalStockIssueItemsCountFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_TOTAL_STOCK_ISSUE_ITEMS_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadFactoryAddress Action Test Cases', () => {
    it('should check correct type is used for  LoadFactoryAddress action ', () => {
      const action = new LoadFactoryAddress();

      expect(action.type).toEqual(IssueTEPActionTypes.LOAD_FACTORY_ADDRESS);
    });

    it('should check correct type is used for  LoadFactoryAddressSuccess action ', () => {
      const action = new LoadFactoryAddressSuccess(locationSummaryDetails);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_FACTORY_ADDRESS_SUCCESS
      );
      expect(action.payload).toEqual(locationSummaryDetails);
    });

    it('should check correct type is used for  LoadFactoryAddressFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFactoryAddressFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_FACTORY_ADDRESS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductCategories Action Test Cases', () => {
    it('should check correct type is used for  LoadProductCategories action ', () => {
      const action = new LoadProductCategories();

      expect(action.type).toEqual(IssueTEPActionTypes.LOAD_PRODUCT_CATEGORIES);
    });

    it('should check correct type is used for  LoadProductCategoriesSuccess action ', () => {
      const action = new LoadProductCategoriesSuccess(productCategoryRes);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS
      );
      expect(action.payload).toEqual(productCategoryRes);
    });

    it('should check correct type is used for  LoadProductCategoriesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoriesFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductGroups Action Test Cases', () => {
    it('should check correct type is used for  LoadProductGroups action ', () => {
      const action = new LoadProductGroups();

      expect(action.type).toEqual(IssueTEPActionTypes.LOAD_PROUDCT_GROUPS);
    });

    it('should check correct type is used for  LoadProductGroupsSuccess action ', () => {
      const action = new LoadProductGroupsSuccess(productGroupRes);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(productGroupRes);
    });

    it('should check correct type is used for  LoadProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupsFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_PROUDCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadCourierDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadCourierDetails action ', () => {
      const action = new LoadCourierDetails(courierDetailsReq);

      expect(action.type).toEqual(IssueTEPActionTypes.LOAD_COURIER_DETAILS);
      expect(action.payload).toEqual(courierDetailsReq);
    });

    it('should check correct type is used for  LoadCourierDetailsSuccess action ', () => {
      const action = new LoadCourierDetailsSuccess(courierDetailsRes);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_COURIER_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(courierDetailsRes);
    });

    it('should check correct type is used for  LoadCourierDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCourierDetailsFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_COURIER_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadEmployeeCodes Action Test Cases', () => {
    it('should check correct type is used for  LoadEmployeeCodes action ', () => {
      const action = new LoadEmployeeCodes();

      expect(action.type).toEqual(IssueTEPActionTypes.LOAD_EMPLOYEE_CODES);
    });

    it('should check correct type is used for  LoadEmployeeCodesSuccess action ', () => {
      const action = new LoadEmployeeCodesSuccess(employeeCodesRes);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_EMPLOYEE_CODES_SUCCESS
      );
      expect(action.payload).toEqual(employeeCodesRes);
    });

    it('should check correct type is used for  LoadEmployeeCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadEmployeeCodesFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_EMPLOYEE_CODES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadEmployeeDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadEmployeeDetails action ', () => {
      const action = new LoadEmployeeDetails(employeeDetailsReq);

      expect(action.type).toEqual(IssueTEPActionTypes.LOAD_EMPLOYEE_DETAILS);
      expect(action.payload).toEqual(employeeDetailsReq);
    });

    it('should check correct type is used for  LoadEmployeeDetailsSuccess action ', () => {
      const action = new LoadEmployeeDetailsSuccess(employeeDetailsRes);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_EMPLOYEE_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(employeeDetailsRes);
    });

    it('should check correct type is used for  LoadEmployeeDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadEmployeeDetailsFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_EMPLOYEE_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for SearchClear action ', () => {
      const action = new SearchClear();
      expect({ ...action }).toEqual({
        type: IssueTEPActionTypes.SEARCH_CLEAR
      });
    });

    it('should check correct type is used for ResetList action ', () => {
      const action = new ResetList();
      expect({ ...action }).toEqual({
        type: IssueTEPActionTypes.RESET_LIST
      });
    });

    it('should check correct type is used for ResetResponse action ', () => {
      const action = new ResetResponse();
      expect({ ...action }).toEqual({
        type: IssueTEPActionTypes.RESET_RESPONSE
      });
    });

    it('should check correct type is used for ResetAll action ', () => {
      const action = new ResetAll();
      expect({ ...action }).toEqual({
        type: IssueTEPActionTypes.RESET_ALL
      });
    });
  });

  describe('Setting Data Action Test Cases', () => {
    it('should check correct type is used for SetSortDataItems action ', () => {
      const action = new SetSortDataItems(sortData);
      expect(action.type).toEqual(IssueTEPActionTypes.SET_SORT_DATA_ITEMS);
      expect(action.payload).toEqual(sortData);
    });

    it('should check correct type is used for SetSortDataStockIssueItems action ', () => {
      const action = new SetSortDataStockIssueItems(sortData);
      expect(action.type).toEqual(
        IssueTEPActionTypes.SET_SORT_DATA_STOCK_ISSUE_ITEMS
      );
      expect(action.payload).toEqual(sortData);
    });

    it('should check correct type is used for SetFilterDataItems action ', () => {
      const action = new SetFilterDataItems(filterData);
      expect(action.type).toEqual(IssueTEPActionTypes.SET_FILTER_DATA_ITEMS);
      expect(action.payload).toEqual(filterData);
    });

    it('should check correct type is used for SetFilterDataStockIssueItems action ', () => {
      const action = new SetFilterDataStockIssueItems(filterData);
      expect(action.type).toEqual(
        IssueTEPActionTypes.SET_FILTER_DATA_STOCK_ISSUE_ITEMS
      );
      expect(action.payload).toEqual(filterData);
    });
  });

  describe('Load Studded Product Groups Action Test Cases', () => {
    it('should check correct type is used for LoadStuddedProductGroups action ', () => {
      const action = new LoadStuddedProductGroups();

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_STUDDED_PRODUCT_GROUPS
      );
    });

    it('should check correct type is used for LoadStuddedProductGroupSuccess action ', () => {
      const action = new LoadStuddedProductGroupsSuccess(studdedProductGroups);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(studdedProductGroups);
    });

    it('should check correct type is used for LoadStuddedProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStuddedProductGroupsFailure(payload);

      expect(action.type).toEqual(
        IssueTEPActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
