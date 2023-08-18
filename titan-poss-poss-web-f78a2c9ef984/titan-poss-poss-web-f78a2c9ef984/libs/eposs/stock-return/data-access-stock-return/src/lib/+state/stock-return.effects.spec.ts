import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  CFAddress,
  ConfirmStockReturnPayload,
  Courier,
  CreateIssueItemsPayload,
  HistoryAdvancedFilterPayload,
  LoadStockIssueInvoiceHistory,
  LoadStockIssueInvoiceHistoryPayload,
  LoadStockReturnItemsPayload,
  LocationSummary,
  LocationSummaryDetails,
  ProductCategory,
  ProductGroup,
  RemoveSelectedItemsPayload,
  RequestInvoice,
  SearchItemPayload,
  StockReturnItem,
  StoreUser
} from '@poss-web/shared/models';
import { provideMockActions } from '@ngrx/effects/testing';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { StockReturnService } from '../stock-return.service';
import { StockReturnEffect } from './stock-return.effects';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import {
  ConfirmIssue,
  ConfirmIssueFailure,
  ConfirmIssueSuccess,
  CreateIssueItems,
  CreateIssueItemsFailure,
  CreateIssueItemsSuccess,
  CreateRequestToCfa,
  CreateRequestToCfaFailure,
  CreateRequestToCfaSuccess,
  LoadCFALocationCode,
  LoadCFALocationCodeFailure,
  LoadCFALocationCodeSuccess,
  LoadCourierDetails,
  LoadCourierDetailsFailure,
  LoadCourierDetailsSuccess,
  LoadHeaderLevelDetails,
  LoadHeaderLevelDetailsFailure,
  LoadHeaderLevelDetailsSuccess,
  LoadItems,
  LoadItemsFailure,
  LoadItemSuccess,
  LoadProductCategories,
  LoadProductCategoriesFailure,
  LoadProductCategoriesSuccess,
  LoadProductGroups,
  LoadProductGroupsFailure,
  LoadProductGroupsSuccess,
  RemoveSelectedItems,
  RemoveSelectedItemsFailure,
  RemoveSelectedItemsSuccess,
  SearchItem,
  SearchItemFailure,
  SearchItemSuccess,
  SelectedProductsSearch,
  SelectedProductsSearchFailure,
  SelectedProdutsSearchSuccess
} from './stock-return.actions';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CourierDataService,
  LocationDataService,
  ProductCategoryDataService,
  ProductGroupDataService,
} from '@poss-web/shared/masters/data-access-masters';
import { CommonService } from '@poss-web/shared/common/data-access-common';
describe('StockReturn Effects Testing Suite', () => {
  const stockReturnServiceSpy = jasmine.createSpyObj<StockReturnService>([
    'createReturnRequestToCfa',
    'confirmIssueCfa',
    'searchItem',
    'createIssueItems',
    'getItemsCFA',
    'removeSelectedItems',
    'loadHeaderLevelDetails',
    'getInvoiceHistory'
  ]);
  const locationDataServiceSpy = jasmine.createSpyObj<LocationDataService>([
    'getLocationSummary'
  ]);
  const courierDetailsDataServiceSpy = jasmine.createSpyObj<CourierDataService>(
    ['getCouriersSummary']
  );
  const productGroupDataServiceSpy = jasmine.createSpyObj<
    ProductGroupDataService
  >(['getProductGroups']);
  const commonServiceSpy = jasmine.createSpyObj<
  CommonService
>(['getCommonService']);
  const productCategoryDataServiceSpy = jasmine.createSpyObj<
    ProductCategoryDataService
  >(['getProductCategories']);
  const createIssueItems: CreateIssueItemsPayload = {
    id: 123,
    invoiceItems: [{ inventoryId: 132123123 }]
  };
  const loadItems: LoadStockReturnItemsPayload = {
    id: 12,
    pageSize: 10,
    pageIndex: 1,
    sortBy: null,
    sortOrder: null,
    itemId: '12333333',
    lotNumber: '123333',
    filter: [{ key: '', value: [] }]
  };
  const invoiceHistory: RequestInvoice[] = [
    {
      id: 12,
      srcLocationCode: 'PNA',
      destLocationCode: 'URB',
      status: 'Verified',
      weightUnit: 'gms',
      currencyCode: 'INR',
      srcLocationDescription: 'urb',
      destLocationDescription: 'rso',
      srcDocNo: '123',
      srcFiscalYear: '2019',
      srcDocDate: moment(123123123),
      destDocNo: '123',
      destDocDate: moment(12312312),
      orderType: 'p',
      totalAvailableQuantity: 123,
      totalMeasuredQuantity: 123,
      totalAvailableValue: 123,
      totalMeasuredValue: 123,
      totalAvailableWeight: 123,
      totalMeasuredWeight: 123,
      invoiceType: 'ISSUE_TO_CFA',
      remarks: 'good',
      courierDetails: null
    }
  ];
  const searchItemPayload: LoadStockReturnItemsPayload = {
    id: 12,
    pageSize: 10,
    pageIndex: 1,
    sortBy: null,
    sortOrder: null,
    itemId: '12333333',
    lotNumber: '123333',
    filter: [{ key: '', value: [] }]
  };
  const invoceHistory: LoadStockIssueInvoiceHistory = {
    actionType: 'INVOICE',
    dateRangeType: 'Custom',
    destDocNo: 21,
    destFiscalYear: '2019',
    endDate: 12312321312,
    locationCode: 'PNA',
    srcDocNo: 123,
    srcFiscalYear: '2020',
    startDate: 2222222,
    statuses: []
  };
  const historyPayload: LoadStockIssueInvoiceHistoryPayload = {
    loadStockIssueInvoiceHistory: invoceHistory,
    pageIndex: 0,
    pageSize: 10,
    invoiceType: 'ISSUE_INVOICE'
  };
  const advanceFilter: HistoryAdvancedFilterPayload = {
    docFromDate: 12312213,
    docToDate: 2123121,
    fiscalYear: '2019',
    invoiceNumber: 'INVOICE'
  };
  const removeSelectedItems: RemoveSelectedItemsPayload = {
    requestId: 230,
    itemIds: [21, 22]
  };
  const productGroup: ProductGroup[] = [
    {
      description: 'ProductGroup',
      productGroupCode: 'pg'
    }
  ];
  const productCat: ProductCategory[] = [
    {
      description: 'ProductCategory',
      productCategoryCode: 'pc'
    }
  ];
  const employeeDetails: StoreUser[] = [
    {
      empName: 'raju',
      employeeCode: '1213',
      locationCode: 'pna',
      mobileNo: '1234555556',
      isLoginActive: true
    }
  ];
  const stockReturnItem: StockReturnItem[] = [
    {
      id: 1,
      itemCode: '123123123',
      lotNumber: '123132',
      mfgDate: moment(213123123),
      productCategory: 'pc',
      productGroup: 'pg',
      binCode: 'PURCFA',
      binGroupCode: 'PURCFA',
      stdValue: 123,
      stdWeight: 123,
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'verified',
      imageURL: 'www.image',
      itemDetails: {},
      availableQuantity: 123,
      availableWeight: 123,
      availableValue: 123,
      measuredQuantity: 123,
      measuredWeight: 123,
      measuredValue: 123,
      orderType: 'P',
      inventoryId: '12312312',
      productCategoryDesc: 'DESC',
      productGroupDesc: 'ASC',
      remarks: 'good',
      isStudded: true,
      thumbnailImageURL:'',
      taxDetails:{
      },
      isLoadingImage: true,
      isLoadingThumbnailImage :true
    }
  ];
  const headerDetails: StockReturnItem = {
    id: 1,
    itemCode: '123123123',
    lotNumber: '123132',
    mfgDate: moment(213123123),
    productCategory: 'pc',
    productGroup: 'pg',
    binCode: 'PURCFA',
    binGroupCode: 'PURCFA',
    stdValue: 123,
    stdWeight: 123,
    currencyCode: 'INR',
    weightUnit: 'gms',
    status: 'verified',
    imageURL: 'www.image',
    itemDetails: {},
    availableQuantity: 123,
    availableWeight: 123,
    availableValue: 123,
    measuredQuantity: 123,
    measuredWeight: 123,
    measuredValue: 123,
    orderType: 'P',
    inventoryId: '12312312',
    productCategoryDesc: 'DESC',
    productGroupDesc: 'ASC',
    remarks: 'good',
    isStudded: true,
    thumbnailImageURL:'',
      taxDetails:{
      },
      isLoadingImage: true,
      isLoadingThumbnailImage :true
  };

  const confirmIssue: ConfirmStockReturnPayload = {
    id: 231,
    confirmIssue: {
      cfaLocationCode: 'pna',
      remarks: 'good',
      carrierDetails: {
        type: 'BLUE DART',
        data: {}
      }
    }
  };
  const searchVariantCode: SearchItemPayload = {
    id: 23,
    variantCode: '123123123',
    lotNumber: '12312312'
  };
  const cfaAddress: LocationSummary = {
    address: 'aaa',
    brandCode: 'aaa',
    cfaCodeValue: 'aaa',
    cfaDetails: {
      locationCode: 'PNA',
      brandCode: 'BC',
      townCode: 123,
      stateCode: 123,
      regionCode: 'LC',
      locationTypeCode: 'PNA',
      isActive: true,
      address: 'Vijayawada',
      phoneNo: '9010462817',
      description: 'CFAAdress'
    },
    configDetails: {},
    contactNo: 'aaa',
    countryCode: 132,
    description: 'aaa',
    factoryCodeValue: 'aaa',
    factoryDetails: null,
    fax: 'aaa',
    isActive: true,
    locationCode: 'aaa',
    locationEmail: 'aaa',
    locationFormat: 'aaa',
    locationTypeCode: 'aaa',
    ownerTypeCode: 'aaa',
    phoneNo: 'aaa',
    pincode: 521156,
    regionCode: 'aaa',
    registrationNo: 'aaa',
    stateCode: 123,
    townCode: 123,
    baseCurrency: 'aaa',
    stockCurrency: 'aaa',
    masterCurrency: 'aaa',
    paymentCurrencies: 'aaa',
    companyName: 'aaa'
  };
  let actions$: Observable<any>;
  let effect: StockReturnEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const initialState = {};
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StockReturnEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: StockReturnService,
          useValue: stockReturnServiceSpy
        },
        {
          provide: LocationDataService,
          useValue: locationDataServiceSpy
        },
        {
          provide: CourierDataService,
          useValue: courierDetailsDataServiceSpy
        },
        {
          provide: ProductGroupDataService,
          useValue: productGroupDataServiceSpy
        },
        {
          provide: CommonService,
          useValue: commonServiceSpy
        },
        {
          provide: ProductCategoryDataService,
          useValue: productCategoryDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(StockReturnEffect);
  });

  describe('createRequestToCfa', () => {
    it('should return a stream with createRequestToCfa', () => {
      const action = new CreateRequestToCfa();
      const outcome = new CreateRequestToCfaSuccess(120);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: 120 });
      stockReturnServiceSpy.createReturnRequestToCfa.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.createRequestTocfa$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new CreateRequestToCfa();
      const error = new Error('some error');
      const outcome = new CreateRequestToCfaFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockReturnServiceSpy.createReturnRequestToCfa.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.createRequestTocfa$).toBeObservable(expected);
    });
  });

  describe('confirmIssue', () => {
    it('should return a stream with confirmIssue', () => {
      const action = new ConfirmIssue(confirmIssue);
      const outcome = new ConfirmIssueSuccess(120);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: 120 });
      stockReturnServiceSpy.confirmIssueCfa.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.confirmIssue$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new ConfirmIssue(confirmIssue);
      const error = new Error('some error');
      const outcome = new ConfirmIssueFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockReturnServiceSpy.confirmIssueCfa.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirmIssue$).toBeObservable(expected);
    });
  });

  // describe('searchItem', () => {
  //   const response = {
  //     items: stockReturnItem,
  //     count: 1
  //   };
  //   it('should return a stream with searchItem', () => {
  //     const action = new SearchItem(searchVariantCode);
  //     const outcome = new SearchItemSuccess(response);
  //     actions$ = cold('-a', { a: action });

  //     const response$ = cold('-b', { b: response });
  //     stockReturnServiceSpy.searchItem.and.returnValue(response$);

  //     const expected$ = cold('-c', { c: outcome });

  //     expect(effect.searchItem$).toBeObservable(expected$);
  //   });
  //   it('should fail and return an action with the error', () => {
  //     const action = new SearchItem(searchVariantCode);
  //     const error = new Error('some error');
  //     const outcome = new SearchItemFailure(CustomErrorAdaptor.fromJson(error));
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#|', {}, error);
  //     stockReturnServiceSpy.searchItem.and.returnValue(response$);
  //     const expected = cold('--b', { b: outcome });
  //     expect(effect.searchItem$).toBeObservable(expected);
  //   });
  // });

  describe('createIssueItems', () => {
    it('should return a stream with CreateIssueItems', () => {
      const action = new CreateIssueItems(createIssueItems);
      const outcome = new CreateIssueItemsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: null
      });
      stockReturnServiceSpy.createIssueItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.CreateIssueItems$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new CreateIssueItems(createIssueItems);
      const error = new Error('some error');
      const outcome = new CreateIssueItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockReturnServiceSpy.createIssueItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.CreateIssueItems$).toBeObservable(expected);
    });
  });

  describe('LoadCFALocationCode', () => {
    it('should return a stream with LoadCFALocationCode', () => {
      const action = new LoadCFALocationCode();
      const outcome = new LoadCFALocationCodeSuccess(cfaAddress.cfaDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: cfaAddress
      });
      locationDataServiceSpy.getLocationSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCfaAddress$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadCFALocationCode();
      const error = new Error('some error');
      const outcome = new LoadCFALocationCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationDataServiceSpy.getLocationSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCfaAddress$).toBeObservable(expected);
    });
  });

  // describe('LoadItems', () => {
  //   it('should return a stream with LoadItems', () => {
  //     const action = new LoadItems(loadItems);
  //     const outcome = new LoadItemSuccess({ items: stockReturnItem, count: 1 });
  //     actions$ = hot('-a', { a: action });

  //     const response$ = cold('-a|', {
  //       a: { items: stockReturnItem, count: 1 }
  //     });
  //     stockReturnServiceSpy.getItemsCFA.and.returnValue(response$);

  //     const expected$ = cold('--b', { b: outcome });
  //     expect(effect.loadItems$).toBeObservable(expected$);
  //   });
  //   it('should fail and return an action with the error', () => {
  //     const action = new LoadItems(loadItems);
  //     const error = new Error('some error');
  //     const outcome = new LoadItemsFailure(CustomErrorAdaptor.fromJson(error));
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#|', {}, error);
  //     stockReturnServiceSpy.getItemsCFA.and.returnValue(response$);
  //     const expected = cold('--b', { b: outcome });
  //     expect(effect.loadItems$).toBeObservable(expected);
  //   });
  // });

  describe('RemoveSelectedItems', () => {
    it('should return a stream with RemoveSelectedItems', () => {
      const action = new RemoveSelectedItems(removeSelectedItems);
      const outcome = new RemoveSelectedItemsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: null
      });
      stockReturnServiceSpy.removeSelectedItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.removeMultipleItems$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new RemoveSelectedItems(removeSelectedItems);
      const error = new Error('some error');
      const outcome = new RemoveSelectedItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockReturnServiceSpy.removeSelectedItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.removeMultipleItems$).toBeObservable(expected);
    });
  });

  // describe('SelectedProductsSearch', () => {
  //   it('should return a stream with SelectedProductsSearch', () => {
  //     const action = new SelectedProductsSearch(loadItems);
  //     const outcome = new SelectedProdutsSearchSuccess({
  //       items: stockReturnItem,
  //       count: 1
  //     });
  //     actions$ = hot('-a', { a: action });

  //     const response$ = cold('-a|', {
  //       a: {
  //         items: stockReturnItem,
  //         count: 1
  //       }
  //     });
  //     stockReturnServiceSpy.getItemsCFA.and.returnValue(response$);

  //     const expected$ = cold('--b', { b: outcome });
  //     expect(effect.selectedProductsSearch$).toBeObservable(expected$);
  //   });
  //   it('should fail and return an action with the error', () => {
  //     const action = new SelectedProductsSearch(loadItems);
  //     const error = new Error('some error');
  //     const outcome = new SelectedProductsSearchFailure(
  //       CustomErrorAdaptor.fromJson(error)
  //     );
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#|', {}, error);
  //     stockReturnServiceSpy.getItemsCFA.and.returnValue(response$);
  //     const expected = cold('--b', { b: outcome });
  //     expect(effect.selectedProductsSearch$).toBeObservable(expected);
  //   });
  // });

  describe('LoadCourierDetails', () => {
    const response: Courier[] = [
      {
        address: 'Vijayawada',
        contactPerson: 'Admin',
        courierName: 'BLUE DART',
        isActive: true,
        mailId: 'titan@gmail.com',
        mobileNumber: '9010462817',
        phoneNumber: '90104682819',
        stateCode: 'AR',
        townCode: 'TN'
      }
    ];
    it('should return a stream with LoadCourierDetails', () => {
      const action = new LoadCourierDetails();
      const outcome = new LoadCourierDetailsSuccess(['BLUE DART']);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: response
      });
      courierDetailsDataServiceSpy.getCouriersSummary.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCourierDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadCourierDetails();
      const error = new Error('some error');
      const outcome = new LoadCourierDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      courierDetailsDataServiceSpy.getCouriersSummary.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCourierDetails$).toBeObservable(expected);
    });
  });

  describe('LoadHeaderLevelDetails', () => {
    it('should return a stream with LoadHeaderLevelDetails', () => {
      const action = new LoadHeaderLevelDetails(120);
      const outcome = new LoadHeaderLevelDetailsSuccess(headerDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: headerDetails
      });
      stockReturnServiceSpy.loadHeaderLevelDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadHeaderLevelDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadHeaderLevelDetails(120);
      const error = new Error('some error');
      const outcome = new LoadHeaderLevelDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockReturnServiceSpy.loadHeaderLevelDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadHeaderLevelDetails$).toBeObservable(expected);
    });
  });

  describe('LoadProductCategories', () => {
    it('should return a stream with LoadProductCategories', () => {
      const action = new LoadProductCategories();
      const outcome = new LoadProductCategoriesSuccess(productCat);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: productCat
      });
      productCategoryDataServiceSpy.getProductCategories.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductCategories$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadProductCategories();
      const error = new Error('some error');
      const outcome = new LoadProductCategoriesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productCategoryDataServiceSpy.getProductCategories.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductCategories$).toBeObservable(expected);
    });
  });

  describe('LoadProductGroups', () => {
    it('should return a stream with LoadProductGroups', () => {
      const action = new LoadProductGroups();
      const outcome = new LoadProductGroupsSuccess(productGroup);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: productGroup
      });
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadProductGroups();
      const error = new Error('some error');
      const outcome = new LoadProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected);
    });
  });
});
