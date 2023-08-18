import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  CourierDataService,
  LocationDataService,
  ProductCategoryDataService,
  ProductGroupDataService,
  StoreUserDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  Courier,
  CreateStockIssueItemsPayload,
  CreateStockIssuePayload,
  CreateStockIssueResponse,
  LoadStockIssueItemsPayload,
  LocationSummary,
  LocationSummaryDetails,
  ProductCategory,
  ProductGroup,
  StockIssueItem,
  StoreUser,
  UpdateStockIssuePayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { cold, hot } from 'jasmine-marbles';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { StockIssueTepGepService } from '../stock-issue-tep-gep.service';
import {
  CreateStockIssue,
  CreateStockIssueFailure,
  CreateStockIssueItems,
  CreateStockIssueItemsFailure,
  CreateStockIssueItemsSuccess,
  CreateStockIssueSuccess,
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
  LoadItemsSuccess,
  LoadProductCategories,
  LoadProductCategoriesFailure,
  LoadProductCategoriesSuccess,
  LoadProductGroups,
  LoadProductGroupsFailure,
  LoadProductGroupsSuccess,
  LoadStockIssueItems,
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
  SearchClear,
  UpdateAllStockIssueItems,
  UpdateAllStockIssueItemsFailure,
  UpdateAllStockIssueItemsSuccess,
  UpdateStockIssue,
  UpdateStockIssueFailure,
  UpdateStockIssueSuccess
} from './stock-issue-tep-gep.action';
import { IssueTEPEffects } from './stock-issue-tep-gep.effect';
import { initialState, tepGepFeatureKey } from './stock-issue-tep-gep.reducers';

describe('Issue TEP-GEP Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: IssueTEPEffects;

  const stockIssueTepGepServiceSpy = jasmine.createSpyObj<
    StockIssueTepGepService
  >([
    'createStockIssue',
    'updateStockIssue',
    'loadStockIssueItems',
    'updateAllStockIssueItems',
    'createStockIssueItems',
    'loadTotalCount'
  ]);

  const courierDataServiceSpy = jasmine.createSpyObj<CourierDataService>([
    'getCouriersSummary'
  ]);

  const productGroupDataServiceSpy = jasmine.createSpyObj<
    ProductGroupDataService
  >(['getProductGroups']);

  const productCategoryDataServiceSpy = jasmine.createSpyObj<
    ProductCategoryDataService
  >(['getProductCategories']);

  const locationDataServiceSpy = jasmine.createSpyObj<LocationDataService>([
    'getLocationSummary'
  ]);

  const storeUserDataServiceSpy = jasmine.createSpyObj<StoreUserDataService>([
    'getStoreUsers'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IssueTEPEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [tepGepFeatureKey]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: StockIssueTepGepService,
          useValue: stockIssueTepGepServiceSpy
        },
        {
          provide: CourierDataService,
          useValue: courierDataServiceSpy
        },
        {
          provide: ProductGroupDataService,
          useValue: productGroupDataServiceSpy
        },
        {
          provide: ProductCategoryDataService,
          useValue: productCategoryDataServiceSpy
        },
        {
          provide: LocationDataService,
          useValue: locationDataServiceSpy
        },
        {
          provide: StoreUserDataService,
          useValue: storeUserDataServiceSpy
        }
      ]
    });

    effect = TestBed.inject(IssueTEPEffects);
  });

  describe('createStockIssue', () => {
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

    it('should return a createStockIssue', () => {
      const action = new CreateStockIssue(createStockIssuePayload);
      const outcome = new CreateStockIssueSuccess(createStockIssueResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: createStockIssueResponse });
      stockIssueTepGepServiceSpy.createStockIssue.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.createStockIssue$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CreateStockIssue(createStockIssuePayload);
      const error = new Error('some error');
      const outcome = new CreateStockIssueFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueTepGepServiceSpy.createStockIssue.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.createStockIssue$).toBeObservable(expected);
    });
  });

  describe('updateStockIssue', () => {
    const updateStockIssuePayload: UpdateStockIssuePayload = {
      id: 12,
      transferType: 'TEP_PLAIN',
      storeType: 'L1',
      remarks: 'string'
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

    it('should return a updateStockIssue', () => {
      const action = new UpdateStockIssue(updateStockIssuePayload);
      const outcome = new UpdateStockIssueSuccess(createStockIssueResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: createStockIssueResponse });
      stockIssueTepGepServiceSpy.updateStockIssue.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.updateStockIssue$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateStockIssue(updateStockIssuePayload);
      const error = new Error('some error');
      const outcome = new UpdateStockIssueFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueTepGepServiceSpy.updateStockIssue.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateStockIssue$).toBeObservable(expected);
    });
  });

  describe('loadItems', () => {
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

    it('should return a loadItems', () => {
      const action = new LoadItems(loadStockIssueItemsPayload);
      const outcome = new LoadItemsSuccess(itemsResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: itemsResponse });
      stockIssueTepGepServiceSpy.loadStockIssueItems.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadItems(loadStockIssueItemsPayload);
      const error = new Error('some error');
      const outcome = new SearchClear();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueTepGepServiceSpy.loadStockIssueItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadItems$).toBeObservable(expected);
    });
  });

  describe('updateAllStockIssueItems', () => {
    const createStockIssueItemsPayload: CreateStockIssueItemsPayload = {
      id: 12,
      transferType: 'TEP_PLAIN',
      storeType: 'L1',
      itemIds: ['20D16ABE-DB4E-4E25-BD4C-20126C3B7D79']
    };

    const createStockIssueItemsRes: boolean = true;

    it('should return a UpdateAllStockIssueItems', () => {
      const action = new UpdateAllStockIssueItems(createStockIssueItemsPayload);
      const outcome = new UpdateAllStockIssueItemsSuccess(
        createStockIssueItemsRes
      );
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: createStockIssueItemsRes });
      stockIssueTepGepServiceSpy.updateAllStockIssueItems.and.returnValue(
        response$
      );
      const expected$ = cold('--c', { c: outcome });
      expect(effect.updateAllStockIssueItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateAllStockIssueItems(createStockIssueItemsPayload);
      const error = new Error('some error');
      const outcome = new UpdateAllStockIssueItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueTepGepServiceSpy.updateAllStockIssueItems.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateAllStockIssueItems$).toBeObservable(expected);
    });
  });

  describe('createStockIssueItems', () => {
    const createStockIssueItemsPayload: CreateStockIssueItemsPayload = {
      id: 12,
      transferType: 'TEP_PLAIN',
      storeType: 'L1',
      itemIds: ['20D16ABE-DB4E-4E25-BD4C-20126C3B7D79']
    };

    const createStockIssueItemsRes: boolean = true;

    it('should return a createStockIssueItems', () => {
      const action = new CreateStockIssueItems(createStockIssueItemsPayload);
      const outcome = new CreateStockIssueItemsSuccess(
        createStockIssueItemsRes
      );
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: createStockIssueItemsRes });
      stockIssueTepGepServiceSpy.createStockIssueItems.and.returnValue(
        response$
      );
      const expected$ = cold('--c', { c: outcome });
      expect(effect.createStockIssueItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CreateStockIssueItems(createStockIssueItemsPayload);
      const error = new Error('some error');
      const outcome = new CreateStockIssueItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueTepGepServiceSpy.createStockIssueItems.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.createStockIssueItems$).toBeObservable(expected);
    });
  });

  describe('loadStockIssueItems', () => {
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

    it('should return a loadStockIssueItems', () => {
      const action = new LoadStockIssueItems(loadStockIssueItemsPayload);
      const outcome = new LoadStockIssueItemsSuccess(itemsResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: itemsResponse });
      stockIssueTepGepServiceSpy.loadStockIssueItems.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadStockIssueItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadStockIssueItems(loadStockIssueItemsPayload);
      const error = new Error('some error');
      const outcome = new SearchClear();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueTepGepServiceSpy.loadStockIssueItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStockIssueItems$).toBeObservable(expected);
    });
  });

  describe('totalItemsCount', () => {
    const loadStockIssueItemsPayload: LoadStockIssueItemsPayload = {
      id: 12,
      transferType: 'TEP_PLAIN',
      storeType: 'L1',
      status: 'OPEN'
    };

    const loadStockIssueItemsCountRes: number = 10;

    it('should return a totalItemsCount', () => {
      const action = new LoadTotalItemsCount(loadStockIssueItemsPayload);
      const outcome = new LoadTotalItemsCountSuccess(
        loadStockIssueItemsCountRes
      );
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: loadStockIssueItemsCountRes });
      stockIssueTepGepServiceSpy.loadTotalCount.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.totalItemsCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadTotalItemsCount(loadStockIssueItemsPayload);
      const error = new Error('some error');
      const outcome = new LoadTotalItemsCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueTepGepServiceSpy.loadTotalCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.totalItemsCount$).toBeObservable(expected);
    });
  });

  describe('totalStockIssueItemsCount', () => {
    const loadStockIssueItemsPayload: LoadStockIssueItemsPayload = {
      id: 12,
      transferType: 'TEP_PLAIN',
      storeType: 'L1',
      status: 'OPEN'
    };

    const loadStockIssueItemsCountRes: number = 10;

    it('should return a totalStockIssueItemsCount', () => {
      const action = new LoadTotalStockIssueItemsCount(
        loadStockIssueItemsPayload
      );
      const outcome = new LoadTotalStockIssueItemsCountSuccess(
        loadStockIssueItemsCountRes
      );
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: loadStockIssueItemsCountRes });
      stockIssueTepGepServiceSpy.loadTotalCount.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.totalStockIssueItemsCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadTotalStockIssueItemsCount(
        loadStockIssueItemsPayload
      );
      const error = new Error('some error');
      const outcome = new LoadTotalStockIssueItemsCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueTepGepServiceSpy.loadTotalCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.totalStockIssueItemsCount$).toBeObservable(expected);
    });
  });

  describe('loadFactoryAddress', () => {
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
    const locationSummary: LocationSummary = {
      address: 'string',
      brandCode: 'Tanishq',
      description: null,
      cfaCodeValue: 'CFA1',
      cfaDetails: locationSummaryDetails,
      configDetails: null,
      contactNo: '9087654321',
      countryCode: 123,
      factoryCodeValue: 'FHJR1',
      factoryDetails: locationSummaryDetails,
      fax: null,
      isActive: true,
      locationCode: 'CPD',
      locationEmail: 'abc@gmail.com',
      locationFormat: 'CPD',
      locationTypeCode: 'CPD',
      ownerTypeCode: 'BTQ5',
      phoneNo: '9087654321',
      pincode: 624619,
      regionCode: 'DGL009',
      registrationNo: 'DGL90',
      stateCode: 90,
      townCode: 32,
      baseCurrency: 'INR',
      stockCurrency: 'INR',
      masterCurrency: 'INR',
      paymentCurrencies: 'INR',
      companyName: 'TITAN'
    };

    it('should return a loadFactoryAddress', () => {
      const action = new LoadFactoryAddress();
      const outcome = new LoadFactoryAddressSuccess(locationSummaryDetails);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: locationSummary });
      locationDataServiceSpy.getLocationSummary.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadFactoryAddress$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadFactoryAddress();
      const error = new Error('some error');
      const outcome = new LoadFactoryAddressFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      locationDataServiceSpy.getLocationSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFactoryAddress$).toBeObservable(expected);
    });
  });

  describe('loadProductCategories', () => {
    const productCategoryRes: ProductCategory[] = [
      {
        description: 'chain',
        productCategoryCode: 'C'
      }
    ];

    it('should return a loadProductCategories', () => {
      const action = new LoadProductCategories();
      const outcome = new LoadProductCategoriesSuccess(productCategoryRes);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: productCategoryRes });
      productCategoryDataServiceSpy.getProductCategories.and.returnValue(
        response$
      );
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadProductCategories$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProductCategories();
      const error = new Error('some error');
      const outcome = new LoadProductCategoriesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      productCategoryDataServiceSpy.getProductCategories.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductCategories$).toBeObservable(expected);
    });
  });

  describe('loadProductGroups', () => {
    const productGroupRes: ProductGroup[] = [
      {
        description: 'Gold Plain',
        productGroupCode: '71'
      }
    ];

    it('should return a loadProductGroups', () => {
      const action = new LoadProductGroups();
      const outcome = new LoadProductGroupsSuccess(productGroupRes);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: productGroupRes });
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProductGroups();
      const error = new Error('some error');
      const outcome = new LoadProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected);
    });
  });

  describe('loadCourierDetails', () => {
    const courierDetailsReq: string = 'CPD';

    const courierDetailsRes: string[] = ['blue dart'];

    const courierDetails: Courier[] = [
      {
        address: 'address',
        contactPerson: 'tester',
        courierName: 'blue dart',
        isActive: true,
        mailId: 'abc@gmail.com',
        mobileNumber: '90876544321',
        phoneNumber: '234567',
        stateCode: 'S1',
        townCode: 'T1'
      }
    ];
    it('should return a loadCourierDetails', () => {
      const action = new LoadCourierDetails(courierDetailsReq);
      const outcome = new LoadCourierDetailsSuccess(courierDetailsRes);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: courierDetails });
      courierDataServiceSpy.getCouriersSummary.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadCourierDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCourierDetails(courierDetailsReq);
      const error = new Error('some error');
      const outcome = new LoadCourierDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      courierDataServiceSpy.getCouriersSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCourierDetails$).toBeObservable(expected);
    });
  });

  describe('loadEmployeeCodes', () => {
    const employeeCodesRes: string[] = ['ID1'];

    const storeUserDetails: StoreUser[] = [
      {
        empName: 'tester',
        employeeCode: 'ID1',
        locationCode: 'CPD',
        mobileNo: '9087654321',
        isLoginActive: true
      }
    ];
    it('should return a loadEmployeeCodes', () => {
      const action = new LoadEmployeeCodes();
      const outcome = new LoadEmployeeCodesSuccess(employeeCodesRes);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: storeUserDetails });
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadEmployeeCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadEmployeeCodes();
      const error = new Error('some error');
      const outcome = new LoadEmployeeCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadEmployeeCodes$).toBeObservable(expected);
    });
  });

  describe('loadEmployeeDetails', () => {
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
    it('should return a loadEmployeeDetails', () => {
      const action = new LoadEmployeeDetails(employeeDetailsReq);
      const outcome = new LoadEmployeeDetailsSuccess(employeeDetailsRes);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: employeeDetailsRes });
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadEmployeeDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadEmployeeDetails(employeeDetailsReq);
      const error = new Error('some error');
      const outcome = new LoadEmployeeDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadEmployeeDetails$).toBeObservable(expected);
    });
  });

  describe('loadStuddedProductGroups', () => {
    const serviceReponse: ProductGroup[] = [
      {
        productGroupCode: 'Test 1',
        description: 'Test 1'
      },
      {
        productGroupCode: 'Test 2',
        description: 'Test 2'
      }
    ];
    const studdedProductGroups: string[] = serviceReponse.map(
      pg => pg.productGroupCode
    );

    it('should return a loadStuddedProductGroups', () => {
      const action = new LoadStuddedProductGroups();
      const outcome = new LoadStuddedProductGroupsSuccess(studdedProductGroups);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: serviceReponse });
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadStuddedProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadStuddedProductGroups();
      const error = new Error('some error');
      const outcome = new LoadStuddedProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStuddedProductGroups$).toBeObservable(expected);
    });
  });
});
