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
import * as actions from './stock-issue-tep-gep.action';
import {
  itemsAdapter,
  stockIssueItemsAdapter
} from './stock-issue-tep-gep.entity';
import { initialState, issueTEPReducer } from './stock-issue-tep-gep.reducers';
import { IssueTEPState } from './stock-issue-tep-gep.state';

describe('Issue TEP-GEP Reducer Testing Suite', () => {
  let testState = initialState;

  describe('Actions should update state properly', () => {
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

    it('should return the initial state', () => {
      const action: any = {};
      const state: IssueTEPState = issueTEPReducer(undefined, action);
      expect(state).toBe(testState);
    });

    it('CreateStockIssue action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.CreateStockIssue(createStockIssuePayload);
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('CreateStockIssueSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        createStockIssueResponse: createStockIssueResponse
      };
      const action = new actions.CreateStockIssueSuccess(
        createStockIssueResponse
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.createStockIssueResponse).toBe(createStockIssueResponse);
    });

    it('CreateStockIssueFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.CreateStockIssueFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('UpdateStockIssue action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.UpdateStockIssue(updateStockIssuePayload);
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('UpdateStockIssueSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        updateStockIssueResponse: createStockIssueResponse
      };
      const action = new actions.UpdateStockIssueSuccess(
        createStockIssueResponse
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.updateStockIssueResponse).toBe(createStockIssueResponse);
    });

    it('UpdateStockIssueFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdateStockIssueFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('UpdateAllStockIssueItems action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.UpdateAllStockIssueItems(
        createStockIssueItemsPayload
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('UpdateAllStockIssueItemsSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        updateAllStockIssueItemsResponse: createStockIssueItemsRes
      };
      const action = new actions.UpdateAllStockIssueItemsSuccess(
        createStockIssueItemsRes
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.updateAllStockIssueItemsResponse).toBe(
        createStockIssueItemsRes
      );
    });

    it('UpdateAllStockIssueItemsFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdateAllStockIssueItemsFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('CreateStockIssueItems action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.CreateStockIssueItems(
        createStockIssueItemsPayload
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('CreateStockIssueItemsSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        createStockIssueItemsResponse: createStockIssueItemsRes
      };
      const action = new actions.CreateStockIssueItemsSuccess(
        createStockIssueItemsRes
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.createStockIssueItemsResponse).toBe(
        createStockIssueItemsRes
      );
    });

    it('CreateStockIssueItemsFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.CreateStockIssueItemsFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadItems action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadItems(loadStockIssueItemsPayload);
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadItemsSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        items: itemsAdapter.addMany(itemsResponse, testState.items)
      };
      const action = new actions.LoadItemsSuccess(itemsResponse);
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.items.ids.length).toBe(1);
    });

    it('LoadItemsFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadItemsFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadStockIssueItems action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadStockIssueItems(
        loadStockIssueItemsPayload
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadStockIssueItemsSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        stockIssueItems: stockIssueItemsAdapter.addMany(
          itemsResponse,
          testState.stockIssueItems
        )
      };
      const action = new actions.LoadStockIssueItemsSuccess(itemsResponse);
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.items.ids.length).toBe(1);
    });

    it('LoadStockIssueItemsFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadStockIssueItemsFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadStuddedProductGroups action', () => {
      testState = {
        ...testState,
        isLoading: true
      };

      const action = new actions.LoadStuddedProductGroups();
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadStuddedProductGroupsSuccess action', () => {
      testState = {
        ...testState,
        isLoading: false,
        studdedProductGroups: studdedProductGroups
      };
      const action = new actions.LoadStuddedProductGroupsSuccess(
        studdedProductGroups
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.studdedProductGroups).toBe(studdedProductGroups);
    });

    it('LoadStuddedProductGroupsFailure action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadStuddedProductGroupsFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadTotalItemsCount action', () => {
      testState = {
        ...testState,
        isLoading: true
      };

      const action = new actions.LoadTotalItemsCount(
        loadStockIssueItemsPayload
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadTotalItemsCountSuccess action', () => {
      testState = {
        ...testState,
        isLoading: false,
        totalItemsCount: loadStockIssueItemsCountRes
      };
      const action = new actions.LoadTotalItemsCountSuccess(
        loadStockIssueItemsCountRes
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.totalItemsCount).toBe(loadStockIssueItemsCountRes);
    });

    it('LoadTotalItemsCountFailure action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadTotalItemsCountFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadTotalStockIssueItemsCount action', () => {
      testState = {
        ...testState,
        isLoading: true
      };

      const action = new actions.LoadTotalStockIssueItemsCount(
        loadStockIssueItemsPayload
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadTotalStockIssueItemsCountSuccess action', () => {
      testState = {
        ...testState,
        isLoading: false,
        totalItemsCount: loadStockIssueItemsCountRes
      };
      const action = new actions.LoadTotalStockIssueItemsCountSuccess(
        loadStockIssueItemsCountRes
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.totalItemsCount).toBe(loadStockIssueItemsCountRes);
    });

    it('LoadTotalStockIssueItemsCountFailure action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadTotalStockIssueItemsCountFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadFactoryAddress action', () => {
      testState = {
        ...testState,
        isFactoryAddressLoading: true
      };

      const action = new actions.LoadFactoryAddress();
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isFactoryAddressLoading).toBeTruthy();
    });

    it('LoadFactoryAddressSuccess action', () => {
      testState = {
        ...testState,
        isFactoryAddressLoading: false,
        factoryAddress: locationSummaryDetails
      };
      const action = new actions.LoadFactoryAddressSuccess(
        locationSummaryDetails
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isFactoryAddressLoading).toBeFalsy();
      expect(result.factoryAddress).toBe(locationSummaryDetails);
    });

    it('LoadFactoryAddressFailure action', () => {
      testState = {
        ...testState,
        isFactoryAddressLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadFactoryAddressFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isFactoryAddressLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadEmployeeCodes action', () => {
      testState = {
        ...testState,
        isEmployeeCodesLoading: true
      };

      const action = new actions.LoadEmployeeCodes();
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isEmployeeCodesLoading).toBeTruthy();
    });

    it('LoadEmployeeCodesSuccess action', () => {
      testState = {
        ...testState,
        isEmployeeCodesLoading: false,
        employeeCodes: employeeCodesRes
      };
      const action = new actions.LoadEmployeeCodesSuccess(employeeCodesRes);
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isEmployeeCodesLoading).toBeFalsy();
      expect(result.employeeCodes).toBe(employeeCodesRes);
    });

    it('LoadEmployeeCodesFailure action', () => {
      testState = {
        ...testState,
        isEmployeeCodesLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadEmployeeCodesFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isEmployeeCodesLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadEmployeeDetails action', () => {
      testState = {
        ...testState,
        isLoading: true
      };

      const action = new actions.LoadEmployeeDetails(employeeDetailsReq);
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('LoadEmployeeDetailsSuccess action', () => {
      testState = {
        ...testState,
        isLoading: false,
        employeeDetails: employeeDetailsRes
      };
      const action = new actions.LoadEmployeeDetailsSuccess(employeeDetailsRes);
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.employeeDetails).toBe(employeeDetailsRes);
    });

    it('LoadEmployeeDetailsFailure action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadEmployeeDetailsFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadProductCategories action', () => {
      testState = {
        ...testState,
        isProductCategoriesLoading: true
      };

      const action = new actions.LoadProductCategories();
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isProductCategoriesLoading).toBeTruthy();
    });

    it('LoadProductCategoriesSuccess action', () => {
      testState = {
        ...testState,
        isProductCategoriesLoading: false,
        productCategories: productCategoryRes
      };
      const action = new actions.LoadProductCategoriesSuccess(
        productCategoryRes
      );
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isProductCategoriesLoading).toBeFalsy();
      expect(result.productCategories).toBe(productCategoryRes);
    });

    it('LoadProductCategoriesFailure action', () => {
      testState = {
        ...testState,
        isProductCategoriesLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadProductCategoriesFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isProductCategoriesLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadProductGroups action', () => {
      testState = {
        ...testState,
        isProductGroupsLoading: true
      };

      const action = new actions.LoadProductGroups();
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isProductGroupsLoading).toBeTruthy();
    });

    it('LoadProductGroupsSuccess action', () => {
      testState = {
        ...testState,
        isProductGroupsLoading: false,
        productGroups: productGroupRes
      };
      const action = new actions.LoadProductGroupsSuccess(productGroupRes);
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isProductGroupsLoading).toBeFalsy();
      expect(result.productGroups).toBe(productGroupRes);
    });

    it('LoadProductGroupsFailure action', () => {
      testState = {
        ...testState,
        isProductGroupsLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadProductGroupsFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isProductGroupsLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadCourierDetails action', () => {
      testState = {
        ...testState,
        isCourierDetailsLoading: true
      };

      const action = new actions.LoadCourierDetails(courierDetailsReq);
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isCourierDetailsLoading).toBeTruthy();
    });

    it('LoadCourierDetailsSuccess action', () => {
      testState = {
        ...testState,
        isCourierDetailsLoading: false,
        courierDetails: courierDetailsRes
      };
      const action = new actions.LoadCourierDetailsSuccess(courierDetailsRes);
      const result: IssueTEPState = issueTEPReducer(testState, action);
      expect(result.isCourierDetailsLoading).toBeFalsy();
      expect(result.courierDetails).toBe(courierDetailsRes);
    });

    it('LoadCourierDetailsFailure action', () => {
      testState = {
        ...testState,
        isCourierDetailsLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadCourierDetailsFailure(payload);

      const result: IssueTEPState = issueTEPReducer(testState, action);

      expect(result.isCourierDetailsLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('SearchClear', () => {
      const action = new actions.SearchClear();
      const newState = {
        ...testState,
        searchItems: itemsAdapter.addMany(itemsResponse, testState.searchItems),
        searchStockIssueItems: stockIssueItemsAdapter.addMany(
          itemsResponse,
          testState.searchStockIssueItems
        )
      };
      const result: IssueTEPState = issueTEPReducer(newState, action);
      expect(result.searchItems.ids.length).toEqual(0);
      expect(result.searchStockIssueItems.ids.length).toEqual(0);
    });

    it('ResetList', () => {
      const action = new actions.ResetList();
      const newState = {
        ...testState,
        items: itemsAdapter.addMany(itemsResponse, testState.items),
        stockIssueItems: stockIssueItemsAdapter.addMany(
          itemsResponse,
          testState.stockIssueItems
        )
      };
      const result: IssueTEPState = issueTEPReducer(newState, action);
      expect(result.items.ids.length).toEqual(0);
      expect(result.stockIssueItems.ids.length).toEqual(0);
    });

    it('ResetResponse', () => {
      const action = new actions.ResetResponse();
      const newState = {
        ...testState,
        updateAllStockIssueItemsResponse: createStockIssueItemsRes,
        createStockIssueItemsResponse: createStockIssueItemsRes,
        totalItemsCount: loadStockIssueItemsCountRes,
        totalStockIssueItemsCount: loadStockIssueItemsCountRes
      };
      const result: IssueTEPState = issueTEPReducer(newState, action);
      expect(result.updateAllStockIssueItemsResponse).toEqual(false);
      expect(result.createStockIssueItemsResponse).toEqual(false);
      expect(result.totalItemsCount).toEqual(0);
      expect(result.totalStockIssueItemsCount).toEqual(0);
    });

    it('ResetAll', () => {
      const action = new actions.ResetAll();
      const newState = {
        ...testState,
        courierDetails: courierDetailsRes,
        sortDataItems: sortData,
        employeeCodes: employeeCodesRes,
        totalItemsCount: loadStockIssueItemsCountRes
      };
      const result: IssueTEPState = issueTEPReducer(newState, action);
      expect(result.courierDetails.length).toEqual(0);
      expect(result.sortDataItems.length).toEqual(0);
      expect(result.employeeCodes).toEqual(null);
      expect(result.totalItemsCount).toEqual(0);
    });

    it('SetSortDataItems', () => {
      const action = new actions.SetSortDataItems(sortData);
      const newState = {
        ...testState,
        sortDataItems: null
      };
      const result: IssueTEPState = issueTEPReducer(newState, action);
      expect(result.sortDataItems).toEqual(sortData);
    });

    it('SetSortDataStockIssueItems', () => {
      const action = new actions.SetSortDataStockIssueItems(sortData);
      const newState = {
        ...testState,
        sortDataStockIssueItems: null
      };
      const result: IssueTEPState = issueTEPReducer(newState, action);
      expect(result.sortDataStockIssueItems).toEqual(sortData);
    });

    it('SetFilterDataItems', () => {
      const action = new actions.SetFilterDataItems(filterData);
      const newState = {
        ...testState,
        filterDataItems: null
      };
      const result: IssueTEPState = issueTEPReducer(newState, action);
      expect(result.filterDataItems).toEqual(filterData);
    });

    it('SetFilterDataStockIssueItems', () => {
      const action = new actions.SetFilterDataStockIssueItems(filterData);
      const newState = {
        ...testState,
        filterDataStockIssueItems: filterData
      };
      const result: IssueTEPState = issueTEPReducer(newState, action);
      expect(result.filterDataStockIssueItems).toEqual(filterData);
    });
  });
});
