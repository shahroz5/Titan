import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import { DiscountEffect } from './discount.effect';
import { DiscountService } from '../discount.service';
import {
  LovDataService,
  ProductCategoryDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  ApplyDiscountRequest,
  AutoDiscRequest,
  ConfirmTransactionLevelDiscountPayload,
  DiscountHeaders,
  DiscountsRequestPayload,
  DiscountsResponse,
  DiscountTransactionLevelRequest,
  DiscountTransactionLevelResponse,
  ItemLevelDiscountsDetailsRequestPayload,
  ItemLevelDiscountsRequestPayload,
  LoadAppliedTransactionDiscountsRequest,
  Lov,
  RemoveAllAppliedTransactionLevelDiscountsPayload,
  RemoveAppliedTransactionLevelDiscountByIDPayload,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  UpdateTransactionLevelDiscountByIDPayload
} from '@poss-web/shared/models';
import {
  ApplyDiscountAtTransactionLevel,
  ApplyDiscountAtTransactionLevelFailure,
  ApplyDiscountAtTransactionLevelSucces,
  CheckABCOEligibility,
  CheckABCOEligibilityFailure,
  CheckABCOEligibilitySuccess,
  ConfirmAppliedTransactionLevelDiscount,
  ConfirmAppliedTransactionLevelDiscountFailure,
  ConfirmAppliedTransactionLevelDiscountSuccess,
  DeleteItemLevelDiscounts,
  DeleteItemLevelDiscountsFailure,
  DeleteItemLevelDiscountsSuccess,
  GetItemLevelDiscounts,
  GetItemLevelDiscountsFailure,
  GetItemLevelDiscountsSuccess,
  LoadABCOConfigDetails,
  LoadABCOConfigDetailsFailure,
  LoadABCOConfigDetailsSuccess,
  LoadABCODiscountDetails,
  LoadABCODiscountDetailsFailure,
  LoadABCODiscountDetailsSuccess,
  LoadABCODiscounts,
  LoadABCODiscountsFailure,
  LoadABCODiscountsSuccess,
  LoadAppliedTransactionLevelDiscounts,
  LoadAppliedTransactionLevelDiscountsFailure,
  LoadAppliedTransactionLevelDiscountsSuccess,
  LoadAutoDiscounts,
  LoadAutoDiscountsFailure,
  LoadAutoDiscountsSuccess,
  LoadAvailableEmployeeDiscounts,
  LoadAvailableEmployeeDiscountsFailure,
  LoadAvailableEmployeeDiscountsSuccess,
  LoadAvailableEmpowementDiscounts,
  LoadAvailableEmpowementDiscountsFailure,
  LoadAvailableEmpowementDiscountsSuccess,
  LoadAvailableSystemDvDiscounts,
  LoadAvailableSystemDvDiscountsFailure,
  LoadAvailableSystemDvDiscountsSuccess,
  LoadAvailableTataEmployeeDiscounts,
  LoadAvailableTataEmployeeDiscountsFailure,
  LoadAvailableTataEmployeeDiscountsSuccess,
  LoadAvailableTSSSDiscounts,
  LoadAvailableTSSSDiscountsFailure,
  LoadAvailableTSSSDiscountsSuccess,
  LoadDiscountTypes,
  LoadDiscountTypesFailure,
  LoadDiscountTypesSuccess,
  LoadItemLevelDiscounts,
  LoadItemLevelDiscountsDetails,
  LoadItemLevelDiscountsDetailsFailure,
  LoadItemLevelDiscountsDetailsSuccess,
  LoadItemLevelDiscountsFailure,
  LoadItemLevelDiscountsSuccess,
  LoadNewABCODiscounts,
  LoadNewABCODiscountsFailure,
  LoadNewABCODiscountsSuccess,
  LoadPcDesc,
  LoadPcDescFailure,
  LoadPcDescSuccess,
  LoadPgDesc,
  LoadPgDescFailure,
  LoadPgDescSuccess,
  LoadReasonForChangingDiscounts,
  LoadReasonForChangingDiscountsFailure,
  LoadReasonForChangingDiscountsSuccess,
  LoadReasonForNotGivingDiscounts,
  LoadReasonForNotGivingDiscountsFailure,
  LoadReasonForNotGivingDiscountsSuccess,
  LoadRivaahGHSDiscounts,
  LoadRivaahGHSDiscountsFailure,
  LoadRivaahGHSDiscountsSuccess,
  LoadTataCompanyNameList,
  LoadTataCompanyNameListFailure,
  LoadTataCompanyNameListSuccess,
  LoadTransactionLevelDiscounts,
  LoadTransactionLevelDiscountsFailure,
  LoadTransactionLevelDiscountsSuccess,
  RemoveAllAppliedTransactionLevelDiscounts,
  RemoveAllAppliedTransactionLevelDiscountsFailure,
  RemoveAllAppliedTransactionLevelDiscountsSuccess,
  RemoveAppliedTransactionLevelDiscountByID,
  RemoveAppliedTransactionLevelDiscountByIDFailure,
  RemoveAppliedTransactionLevelDiscountByIDSuccess,
  SaveItemLevelDiscounts,
  SaveItemLevelDiscountsFailure,
  SaveItemLevelDiscountsSuccess,
  SaveRivaahGHSDiscounts,
  SaveRivaahGHSDiscountsFailure,
  SaveRivaahGHSDiscountsSuccess,
  UpdateAppliedTransactionLevelDiscount,
  UpdateAppliedTransactionLevelDiscountFailure,
  UpdateAppliedTransactionLevelDiscountSuccess,
  UpdateItemLevelDiscounts,
  UpdateItemLevelDiscountsFailure,
  UpdateItemLevelDiscountsSuccess
} from './discount.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';

describe('DiscountEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: DiscountEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch', 'delete']
  );
  const initialState = {};
  let discountService = jasmine.createSpyObj<DiscountService>(
    'DiscountService',
    [
      'loadAvailableTransactionLevelDiscounts',
      'applyTransactionLevelDiscount',
      'loadAppliedTransactionLevelDiscount',
      'removeAllTransactionLevelDiscounts',
      'removeSelectedTransactionLevelDiscount',
      'updateTransactionLevelDiscount',
      'confirmTransactionLevelDiscount',
      'loadItemLevelDiscounts',
      'loadItemLevelDiscountsDetails',
      'getItemLevelDiscountsDetails',
      'saveItemLevelDiscountsDetails',
      'updateItemLevelDiscountsDetails',
      'deleteItemLevelDiscountsDetails',
      'checkABCOEligibility',
      'loadABCODiscounts',
      'loadNewABCODiscounts',
      'loadABCODiscountDetails',
      'loadABCODConfigDetails',
      'loadAutoDiscounts',
      'loadRivaahGHSDiscounts',
      'saveRivaahGHSDiscounts'
    ]
  );
  const lovDataService = jasmine.createSpyObj<LovDataService>([
    'getSalesLovs',
    'getEngineConfigLovs'
  ]);
  const productCategoryDataService = jasmine.createSpyObj<
    ProductCategoryDataService
  >(['getProductCategoryDescription']);
  const productGroupDataService = jasmine.createSpyObj<ProductGroupDataService>(
    ['getProductGroupDescription']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DiscountEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },

        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: LovDataService,
          useValue: lovDataService
        },
        {
          provide: ProductCategoryDataService,
          useValue: productCategoryDataService
        },
        {
          provide: ProductGroupDataService,
          useValue: productGroupDataService
        },

        {
          provide: DiscountService,
          useValue: {
            loadAvailableTransactionLevelDiscounts: jasmine.createSpy(),
            applyTransactionLevelDiscount: jasmine.createSpy(),
            loadAppliedTransactionLevelDiscount: jasmine.createSpy(),
            removeAllTransactionLevelDiscounts: jasmine.createSpy(),
            removeSelectedTransactionLevelDiscount: jasmine.createSpy(),
            saveWeightTolerance: jasmine.createSpy(),
            updateTransactionLevelDiscount: jasmine.createSpy(),
            confirmTransactionLevelDiscount: jasmine.createSpy(),
            loadItemLevelDiscounts: jasmine.createSpy(),
            loadItemLevelDiscountsDetails: jasmine.createSpy(),
            getItemLevelDiscountsDetails: jasmine.createSpy(),
            saveItemLevelDiscountsDetails: jasmine.createSpy(),
            updateItemLevelDiscountsDetails: jasmine.createSpy(),
            deleteItemLevelDiscountsDetails: jasmine.createSpy(),
            checkABCOEligibility: jasmine.createSpy(),
            loadABCODiscounts: jasmine.createSpy(),
            loadNewABCODiscounts: jasmine.createSpy(),
            loadABCODiscountDetails: jasmine.createSpy(),
            loadABCODConfigDetails: jasmine.createSpy(),
            loadAutoDiscounts: jasmine.createSpy(),
            loadRivaahGHSDiscounts: jasmine.createSpy(),
            saveRivaahGHSDiscounts: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(DiscountEffect);
    discountService = TestBed.inject<any>(DiscountService);
  });

  describe('tataCompanyNameList', () => {
    it('should return a stream with tata company name list', () => {
      const req = 'TATA_COMPANY';
      const res: Lov[] = [
        {
          code: 'TCS',
          isActive: true,
          value: 'TCS'
        }
      ];

      const action = new LoadTataCompanyNameList(req);
      const outcome = new LoadTataCompanyNameListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      lovDataService.getSalesLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.cmOccasionList$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const req = 'TATA_COMPANY';
      const action = new LoadTataCompanyNameList(req);
      const error = new Error('some error');
      const outcome = new LoadTataCompanyNameListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataService.getSalesLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cmOccasionList$).toBeObservable(expected);
    });
  });
  describe('LoadTransactionLevelDiscounts', () => {
    it('should return a stream with Bill level list', () => {
      const req: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'BILL_LEVEL_DISCOUNT'
      };

      const res: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];

      const action = new LoadTransactionLevelDiscounts(req);
      const outcome = new LoadTransactionLevelDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadAvailableTransactionLevelDiscounts.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadAvailableTransactionLevelDiscounts$).toBeObservable(
        expected$
      );
    });
    it('should fail and return an action with the error', () => {
      const req: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'BILL_LEVEL_DISCOUNT'
      };
      const action = new LoadTransactionLevelDiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadTransactionLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadAvailableTransactionLevelDiscounts.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAvailableTransactionLevelDiscounts$).toBeObservable(
        expected
      );
    });
  });
  describe('loadAvailableEmployeeDiscounts', () => {
    it('should return a stream with Employee list', () => {
      const req: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'EMPLOYEE_DISCOUNT',
        itemDetails: [],
        employeeDetails: { couponDetails: [{ couponCode: '1234567' }] }
      };

      const res: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];

      const action = new LoadAvailableEmployeeDiscounts(req);
      const outcome = new LoadAvailableEmployeeDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadAvailableTransactionLevelDiscounts.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadAvailableEmployeeDiscounts$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const req: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'EMPLOYEE_DISCOUNT',
        itemDetails: [],
        employeeDetails: { couponDetails: [{ couponCode: '1234567' }] }
      };
      const action = new LoadAvailableEmployeeDiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadAvailableEmployeeDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadAvailableTransactionLevelDiscounts.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAvailableEmployeeDiscounts$).toBeObservable(expected);
    });
  });
  describe('loadAvailableTSSSDiscounts', () => {
    const req: DiscountTransactionLevelRequest = {
      businessDate: '1624300200000',
      discountType: 'TSSS_DISCOUNT',
      itemDetails: [],
      tsssDetails: { couponDetails: [{ couponCode: '1234567' }] }
    };
    it('should return a stream with TSSSDiscounts list', () => {
      const res: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];

      const action = new LoadAvailableTSSSDiscounts(req);
      const outcome = new LoadAvailableTSSSDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadAvailableTransactionLevelDiscounts.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadAvailableTSSSDiscounts$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadAvailableTSSSDiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadAvailableTSSSDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadAvailableTransactionLevelDiscounts.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAvailableTSSSDiscounts$).toBeObservable(expected);
    });
  });
  describe('loadAvailableTataEmployeeDiscounts', () => {
    const req: DiscountTransactionLevelRequest = {
      businessDate: '1624300200000',
      discountType: 'TATA_EMPLOYEE_DISCOUNT',
      itemDetails: [],
      tataEmployeeDetails: {
        companyName: 'TCS',
        employeeId: '1234',
        isIdProofUploaded: true,
        employeeName: 'Joe'
      }
    };
    it('should return a stream with TataEmployeeDiscounts list', () => {
      const res: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];

      const action = new LoadAvailableTataEmployeeDiscounts(req);
      const outcome = new LoadAvailableTataEmployeeDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadAvailableTransactionLevelDiscounts.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadAvailableTataEmployeeDiscounts$).toBeObservable(
        expected$
      );
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadAvailableTataEmployeeDiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadAvailableTataEmployeeDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadAvailableTransactionLevelDiscounts.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAvailableTataEmployeeDiscounts$).toBeObservable(
        expected
      );
    });
  });
  describe('loadAvailableSystemDvDiscounts', () => {
    const req: DiscountTransactionLevelRequest = {
      businessDate: '1624300200000',
      discountType: 'SYSTEM_DISCOUNT_DV',
      itemDetails: []
    };

    it('should return a stream with AvailableSystemDvDiscounts list', () => {
      const res: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];

      const action = new LoadAvailableSystemDvDiscounts(req);
      const outcome = new LoadAvailableSystemDvDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadAvailableTransactionLevelDiscounts.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadAvailableSystemDvDiscounts$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadAvailableSystemDvDiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadAvailableSystemDvDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadAvailableTransactionLevelDiscounts.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAvailableSystemDvDiscounts$).toBeObservable(expected);
    });
  });
  describe('loadAvailableEmpowermentDiscounts', () => {
    const req: DiscountTransactionLevelRequest = {
      businessDate: '1624300200000',
      discountType: 'SYSTEM_DISCOUNT_DV',
      itemDetails: []
    };

    it('should return a stream with AvailableSystemDvDiscounts list', () => {
      const res: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];

      const action = new LoadAvailableEmpowementDiscounts(req);
      const outcome = new LoadAvailableEmpowementDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadAvailableTransactionLevelDiscounts.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadAvailableEmpowermentDiscounts$).toBeObservable(
        expected$
      );
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadAvailableEmpowementDiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadAvailableEmpowementDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadAvailableTransactionLevelDiscounts.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAvailableEmpowermentDiscounts$).toBeObservable(
        expected
      );
    });
  });
  describe('applyTransactionLevelDiscounts', () => {
    const req: ApplyDiscountRequest = {
      subTxnType: 'NEW_CM',
      transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
      discountType: 'BILL_LEVEL_DISCOUNT',
      txnType: 'CM',
      hasDiscounts: false,
      requestBody: {
        discountDetails: [
          {
            discountCode: 'Test bill discount',
            discountId: '3DFC0981-5F67-4CB4-BD90-80EE1421C2FC',
            discountType: 'BILL_LEVEL_DISCOUNT',
            discountValue: 1000,
            discountValueDetails: {},
            isEdited: false
          }
        ]
      }
    };
    it('should return a stream with AvailableSystemDvDiscounts list', () => {
      const res = true;

      const action = new ApplyDiscountAtTransactionLevel(req);
      const outcome = new ApplyDiscountAtTransactionLevelSucces(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.applyTransactionLevelDiscount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.applyTransactionLevelDiscounts$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new ApplyDiscountAtTransactionLevel(req);
      const error = new Error('some error');
      const outcome = new ApplyDiscountAtTransactionLevelFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.applyTransactionLevelDiscount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.applyTransactionLevelDiscounts$).toBeObservable(expected);
    });
  });
  describe('loadAppliedTransactionLevelDiscounts', () => {
    const req: LoadAppliedTransactionDiscountsRequest = {
      subTxnType: 'NEW_CM',
      transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
      txnType: 'CM'
    };

    it('should return a stream with AvailableSystemDvDiscounts list', () => {
      const res = true;

      const action = new LoadAppliedTransactionLevelDiscounts(req);
      const outcome = new LoadAppliedTransactionLevelDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadAppliedTransactionLevelDiscount.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadAppliedTransactionLevelDiscounts$).toBeObservable(
        expected$
      );
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadAppliedTransactionLevelDiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadAppliedTransactionLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadAppliedTransactionLevelDiscount.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAppliedTransactionLevelDiscounts$).toBeObservable(
        expected
      );
    });
  });
  describe('removeAllAppliedTransactionLevelDiscounts', () => {
    const req: RemoveAllAppliedTransactionLevelDiscountsPayload = {
      subTxnType: 'NEW_CM',
      transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
      txnType: 'CM',
      discountType: 'BILL_LEVEL_DISCOUNT'
    };

    it('should return a stream with AvailableSystemDvDiscounts list', () => {
      const res = true;

      const action = new RemoveAllAppliedTransactionLevelDiscounts(req);
      const outcome = new RemoveAllAppliedTransactionLevelDiscountsSuccess({
        isDeleted: res,
        discountType: 'BILL_LEVEL_DISCOUNT'
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.removeAllTransactionLevelDiscounts.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.removeAllAppliedTransactionLevelDiscounts$).toBeObservable(
        expected$
      );
    });
    it('should fail and return an action with the error', () => {
      const action = new RemoveAllAppliedTransactionLevelDiscounts(req);
      const error = new Error('some error');
      const outcome = new RemoveAllAppliedTransactionLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.removeAllTransactionLevelDiscounts.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.removeAllAppliedTransactionLevelDiscounts$).toBeObservable(
        expected
      );
    });
  });
  describe('removeSelectedTransactionLevelDiscount', () => {
    const req: RemoveAppliedTransactionLevelDiscountByIDPayload = {
      subTxnType: 'NEW_CM',
      transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
      txnType: 'CM',
      discountType: 'BILL_LEVEL_DISCOUNT',
      discountId: '1111111111111'
    };
    it('should return a result after removing', () => {
      const res = true;

      const action = new RemoveAppliedTransactionLevelDiscountByID(req);
      const outcome = new RemoveAppliedTransactionLevelDiscountByIDSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.removeSelectedTransactionLevelDiscount.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.removeSelectedTransactionLevelDiscount$).toBeObservable(
        expected$
      );
    });
    it('should fail and return an action with the error', () => {
      const action = new RemoveAppliedTransactionLevelDiscountByID(req);
      const error = new Error('some error');
      const outcome = new RemoveAppliedTransactionLevelDiscountByIDFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.removeSelectedTransactionLevelDiscount.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.removeSelectedTransactionLevelDiscount$).toBeObservable(
        expected
      );
    });
  });
  describe('updateTransactionLevelDiscount', () => {
    const req: UpdateTransactionLevelDiscountByIDPayload = {
      subTxnType: 'NEW_CM',
      transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
      txnType: 'CM',
      discountType: 'BILL_LEVEL_DISCOUNT',
      isPriceUpdate: false
    };
    it('should return a result after removing', () => {
      const res = true;

      const action = new UpdateAppliedTransactionLevelDiscount(req);
      const outcome = new UpdateAppliedTransactionLevelDiscountSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.updateTransactionLevelDiscount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateTransactionLevelDiscount$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new UpdateAppliedTransactionLevelDiscount(req);
      const error = new Error('some error');
      const outcome = new UpdateAppliedTransactionLevelDiscountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.updateTransactionLevelDiscount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateTransactionLevelDiscount$).toBeObservable(expected);
    });
  });
  describe('confirmTransactionLevelDiscount', () => {
    const req: ConfirmTransactionLevelDiscountPayload = {
      subTxnType: 'NEW_CM',
      transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
      txnType: 'CM',
      discountType: 'BILL_LEVEL_DISCOUNT',
      discountTxnId: ['111111111111111']
    };
    it('should return a result after confirming', () => {
      const res = true;

      const action = new ConfirmAppliedTransactionLevelDiscount(req);
      const outcome = new ConfirmAppliedTransactionLevelDiscountSuccess(
        res,
        req
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.confirmTransactionLevelDiscount.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.confirmTransactionLevelDiscount$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new ConfirmAppliedTransactionLevelDiscount(req);
      const error = new Error('some error');
      const outcome = new ConfirmAppliedTransactionLevelDiscountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.confirmTransactionLevelDiscount.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.confirmTransactionLevelDiscount$).toBeObservable(expected);
    });
  });

  // Item Level Discounts
  describe('LoadItemLevelDiscounts', () => {
    const req: ItemLevelDiscountsRequestPayload = {
      businessDate: 1650652200000,
      itemDetails: {
        itemCode: '511881VQMQ2AP1',
        lotNumber: '2CD000002',
        mfgDate: moment(1608834600000),
        stockInwardDate: moment(1614450600000),
        totalTax: 4966.33,
        totalWeight: 52.731,
        netWeight: 52.731,
        totalValue: 365890.83,
        complexityPercent: 26,
        makingChargePerGram: 0,
        productCategoryCode: 'V',
        productGroupCode: '75'
      },
      transactionDetails: {
        transactionType: 'CM',
        subTransactionType: 'NEW_CM',
        isFrozenRate: null
      },
      encircleDiscount: {},
      employeeDetails: {},
      tsssDetails: null,
      tataEmployeeDetails: null,
      empowermentDetails: null,
      rivaahGhsDetails: null
    };
    it('should return a stream with LoadItemLevelDiscounts', () => {
      const res: DiscountHeaders = {
        discounts: [
          {
            discountType: 'CATEGORY_DISCOUNT',
            discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
            discountCode: 'catapr22',
            refDiscountTxnId: null,
            discountAttributes: {
              isRiva: true,
              isAccrualUlpPoints: false,
              clubbingDiscountType: 'TYPE1',
              occasion: 'catapr22'
            },
            rivaahGhsDetails: null
          }
        ],
        clubDiscounts: []
      };

      const action = new LoadItemLevelDiscounts(req);
      const outcome = new LoadItemLevelDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadItemLevelDiscounts.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadItemLevelDisc$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadItemLevelDiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadItemLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadItemLevelDiscounts.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadItemLevelDisc$).toBeObservable(expected);
    });
  });

  describe('LoadItemLevelDiscountsDetails', () => {
    const req: ItemLevelDiscountsDetailsRequestPayload = {
      requestBody: {
        businessDate: 1650652200000,
        itemDetails: {
          itemCode: '511881VQMQ2AP1',
          lotNumber: '2CD000002',
          productCategoryCode: 'V',
          productGroupCode: '75',
          priceDetails: {
            isUcp: false,
            printGuranteeCard: false,
            metalPriceDetails: {
              preDiscountValue: 290020.5,
              metalPrices: [
                {
                  weightUnit: 'gms',
                  netWeight: 52.731,
                  metalValue: 290020.5,
                  type: 'Gold',
                  ratePerUnit: 5500,
                  karat: 22,
                  purity: 92,
                  metalTypeCode: 'J'
                }
              ]
            },
            stonePriceDetails: {
              numberOfStones: null,
              preDiscountValue: 465,
              stoneWeight: null,
              weightUnit: null,
              stoneWeightForView: null,
              weightUnitForView: null
            },
            makingChargeDetails: {
              preDiscountValue: 75405.33,
              makingChargePercentage: 26,
              isDynamicPricing: false,
              makingChargePct: 0,
              makingChargePgram: 0,
              wastagePct: 26
            },
            itemHallmarkDetails: {
              hallmarkGstPct: null,
              hallmarkingCharges: null,
              hmQuantity: null,
              isFOCForHallmarkingCharges: null,
              isHallmarked: true
            },
            netWeight: 52.731
          },
          totalQuantity: 1,
          totalValue: 365890.83,
          totalWeight: 52.731,
          netWeight: 52.731,
          totalTax: 4966.33
        },
        customerDetails: {
          enrollmentDate: moment(1650652200000),
          ulpId: '700001358840'
        },
        transactionDetails: {
          transactionType: 'CM',
          subTransactionType: 'NEW_CM',
          isFrozenRate: null
        },
        eligibleRivaahGhsDetails: null
      },
      discountId: '',
      discountClubId: ''
    };
    it('should return a stream with LoadItemLevelDiscountsDetails', () => {
      const res = {
        discountConfigDetails: [
          {
            discountValue: 34802.46,
            discountValueDetails: [
              {
                component: 'UCP',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'MAKING_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'METAL_CHARGE',
                discountValue: 34802.46,
                discountPercent: 12,
                isDiscountPercentage: true
              },
              {
                component: 'STONE_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'UNIT_WEIGHT',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              }
            ],
            discountConfigDetails: {
              discountType: 'CATEGORY_DISCOUNT',
              discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
              discountCode: 'catapr22',
              refDiscountTxnId: null,
              basicCriteriaDetails: {
                isNarationMandatory: false,
                maxDiscount: 0,
                isEditable: false,
                isTepRecovery: true,
                isBillValue: false,
                ucpValue: 0,
                isFullValueTepDiscountRecovery: false,
                coinPurchaseStartDate: moment(),
                coinPurchaseEndDate: moment(),
                tepPeriodStartDate: moment(),
                tepPeriodEndDate: moment(),
                tepCNUtilizationPercent: 1,
                startingSerialNo: 1,
                isUploadMandatory: false,
                isNameMandatory: false,
                startingSerialNoEmpDiscountType: 0,
                startingSerialNoTataEmpDiscountType: 0,
                isMultipleTrnsctnAllowedOnSameDay: false,
                maxNoOfTimes: 1,
                maxCount: 1,
                isApplicableForAutomatedDiscount: true,
                isFullValueTepRecovery: false
              },
              discountAttributes: {
                isRiva: true,
                isAccrualUlpPoints: false,
                clubbingDiscountType: 'TYPE1',
                occasion: 'catapr22'
              },
              clubbingDetails: {
                isExchangeOffer: true,
                isGHS: true,
                isRiva: false,
                isEmpowerment: false,
                isDV: true,
                isFOCOffer: true,
                isCBOOffer: false,
                isBillLevelDiscount: true,
                isOtherBillLevelDiscount: false,
                isCoin: true
              },
              grnConfigDetails: {
                noOfDaysAllowedBeforeOfferPeriod: 0,
                noOfDaysAllowedAfterOfferPeriod: 0,
                utilizationPercent: 0,
                isAllowedBeforeOffer: false,
                isSameCfaEligible: false
              },
              tepConfigDetails: {
                tepDetails: [{ durationInDays: '10-20', recoveryPercent: 95 }],
                enabled: false
              },
              orderConfigDetails: {
                isGoldRateFrozenForCO: false,
                isGoldRateFrozenForAB: false,
                isDisplayOnAB: false,
                isAllowedToChangeCO: false,
                isAllowedToChangeAB: false,
                isDisplayOnCO: false,
                offerPeriodForCO: 0,
                offerPeriodForAB: 0,
                coPercent: 0,
                abPercent: 0
              },
              locationOfferDetails: {
                offerStartDate: moment(1648751400000),
                offerEndDate: moment(1672425000000),
                configDetails: null,
                empowermentQuarterMaxDiscountValue: 0,
                previewOfferStartDate: moment(1648751400000),
                previewOfferEndDate: moment(1672425000000)
              }
            },
            rivaahGhsDetails: null
          }
        ],
        clubbingId: '',
        data: null
      };

      const action = new LoadItemLevelDiscountsDetails(req);
      const outcome = new LoadItemLevelDiscountsDetailsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadItemLevelDiscountsDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadItemLevelDiscDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadItemLevelDiscountsDetails(req);
      const error = new Error('some error');
      const outcome = new LoadItemLevelDiscountsDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadItemLevelDiscountsDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadItemLevelDiscDetails$).toBeObservable(expected);
    });
  });

  describe('GetItemLevelDiscounts', () => {
    const req: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: ''
    };
    it('should return a stream with GetItemLevelDiscounts', () => {
      const res: DiscountsResponse[] = [
        {
          discountCode: 'catapr22',
          discountType: 'CATEGORY_DISCOUNT',
          discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
          discountValue: 34802.46,
          discountValueDetails: {
            type: 'DISCOUNT_VALUE_DETAILS',
            data: [
              {
                component: 'UCP',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'MAKING_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'METAL_CHARGE',
                discountValue: 34802.46,
                discountPercent: 12,
                isDiscountPercentage: true
              },
              {
                component: 'STONE_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'UNIT_WEIGHT',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              }
            ]
          },
          referenceId: null,
          referenceType: null,
          isEdited: false,
          clubbedDiscountId: null,
          discountSubType: null,
          discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
          itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
          discountAttributes: {
            isRiva: true,
            isAccrualUlpPoints: false,
            clubbingDiscountType: 'TYPE1',
            occasion: 'catapr22'
          },
          status: 'CONFIRMED',
          txnLevelDiscountValueDetails: null,
          isNarationMandatory: false,
          occasion: ''
        }
      ];

      const action = new GetItemLevelDiscounts(req);
      const outcome = new GetItemLevelDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.getItemLevelDiscountsDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.getItemLevelDisc$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new GetItemLevelDiscounts(req);
      const error = new Error('some error');
      const outcome = new GetItemLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.getItemLevelDiscountsDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getItemLevelDisc$).toBeObservable(expected);
    });
  });

  describe('SaveItemLevelDiscounts', () => {
    const reqPayload: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: ''
    };
    const req = {
      request: reqPayload,
      data: null
    };
    it('should return a stream with SaveItemLevelDiscounts', () => {
      const resPayload: DiscountsResponse[] = [
        {
          discountCode: 'catapr22',
          discountType: 'CATEGORY_DISCOUNT',
          discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
          discountValue: 34802.46,
          discountValueDetails: {
            type: 'DISCOUNT_VALUE_DETAILS',
            data: [
              {
                component: 'UCP',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'MAKING_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'METAL_CHARGE',
                discountValue: 34802.46,
                discountPercent: 12,
                isDiscountPercentage: true
              },
              {
                component: 'STONE_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'UNIT_WEIGHT',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              }
            ]
          },
          referenceId: null,
          referenceType: null,
          isEdited: false,
          clubbedDiscountId: null,
          discountSubType: null,
          discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
          itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
          discountAttributes: {
            isRiva: true,
            isAccrualUlpPoints: false,
            clubbingDiscountType: 'TYPE1',
            occasion: 'catapr22'
          },
          status: 'CONFIRMED',
          txnLevelDiscountValueDetails: null,
          isNarationMandatory: false,
          occasion: ''
        }
      ];
      const res = {
        response: resPayload,
        data: null
      };

      const action = new SaveItemLevelDiscounts(req);
      const outcome = new SaveItemLevelDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res.response });
      discountService.saveItemLevelDiscountsDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveItemLevelDisc$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveItemLevelDiscounts(req);
      const error = new Error('some error');
      const outcome = new SaveItemLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.saveItemLevelDiscountsDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveItemLevelDisc$).toBeObservable(expected);
    });
  });

  describe('UpdateItemLevelDiscounts', () => {
    const req: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: ''
    };
    it('should return a stream with UpdateItemLevelDiscounts', () => {
      const res: DiscountsResponse = {
        discountCode: 'catapr22',
        discountType: 'CATEGORY_DISCOUNT',
        discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
        discountValue: 34802.46,
        discountValueDetails: {
          type: 'DISCOUNT_VALUE_DETAILS',
          data: [
            {
              component: 'UCP',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'MAKING_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'METAL_CHARGE',
              discountValue: 34802.46,
              discountPercent: 12,
              isDiscountPercentage: true
            },
            {
              component: 'STONE_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'UNIT_WEIGHT',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            }
          ]
        },
        referenceId: null,
        referenceType: null,
        isEdited: false,
        clubbedDiscountId: null,
        discountSubType: null,
        discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
        itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
        discountAttributes: {
          isRiva: true,
          isAccrualUlpPoints: false,
          clubbingDiscountType: 'TYPE1',
          occasion: 'catapr22'
        },
        status: 'CONFIRMED',
        txnLevelDiscountValueDetails: null,
        isNarationMandatory: false,
        occasion: ''
      };

      const action = new UpdateItemLevelDiscounts(req);
      const outcome = new UpdateItemLevelDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.updateItemLevelDiscountsDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateItemLevelDisc$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new UpdateItemLevelDiscounts(req);
      const error = new Error('some error');
      const outcome = new UpdateItemLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.updateItemLevelDiscountsDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateItemLevelDisc$).toBeObservable(expected);
    });
  });

  describe('DeleteItemLevelDiscounts', () => {
    const reqPayload: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: '',
      requestBody: null
    };
    const req = {
      request: reqPayload,
      data: null
    };
    it('should return a stream with DeleteItemLevelDiscounts', () => {
      const res = {
        response: true,
        data: {
          itemData: req.data,
          discountData: req.request.requestBody
        }
      };

      const action = new DeleteItemLevelDiscounts(req);
      const outcome = new DeleteItemLevelDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res.response });
      discountService.deleteItemLevelDiscountsDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.deleteItemLevelDisc$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new DeleteItemLevelDiscounts(req);
      const error = new Error('some error');
      const outcome = new DeleteItemLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.deleteItemLevelDiscountsDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.deleteItemLevelDisc$).toBeObservable(expected);
    });
  });

  describe('LoadPcDesc', () => {
    it('should return a stream with LoadPcDesc', () => {
      const res = {};

      const action = new LoadPcDesc();
      const outcome = new LoadPcDescSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      productCategoryDataService.getProductCategoryDescription.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPcDesc$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadPcDesc();
      const error = new Error('some error');
      const outcome = new LoadPcDescFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productCategoryDataService.getProductCategoryDescription.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPcDesc$).toBeObservable(expected);
    });
  });

  describe('LoadPgDesc', () => {
    it('should return a stream with LoadPgDesc', () => {
      const res = {};

      const action = new LoadPgDesc();
      const outcome = new LoadPgDescSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      productGroupDataService.getProductGroupDescription.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPgDesc$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadPgDesc();
      const error = new Error('some error');
      const outcome = new LoadPgDescFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productGroupDataService.getProductGroupDescription.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPgDesc$).toBeObservable(expected);
    });
  });

  describe('LoadDiscountTypes', () => {
    const req = '';
    it('should return a stream with LoadDiscountTypes', () => {
      const res: Lov[] = [
        {
          code: 'CATEGORY_DISCOUNT',
          isActive: true,
          value: 'CATEGORY_DISCOUNT'
        }
      ];

      const action = new LoadDiscountTypes(req);
      const outcome = new LoadDiscountTypesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      lovDataService.getEngineConfigLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadDiscTypes$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadDiscountTypes(req);
      const error = new Error('some error');
      const outcome = new LoadDiscountTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataService.getEngineConfigLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadDiscTypes$).toBeObservable(expected);
    });
  });

  describe('CheckABCOEligibility', () => {
    const reqPayload: DiscountsResponse[] = [
      {
        discountCode: 'catapr22',
        discountType: 'CATEGORY_DISCOUNT',
        discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
        discountValue: 34802.46,
        discountValueDetails: {
          type: 'DISCOUNT_VALUE_DETAILS',
          data: [
            {
              component: 'UCP',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'MAKING_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'METAL_CHARGE',
              discountValue: 34802.46,
              discountPercent: 12,
              isDiscountPercentage: true
            },
            {
              component: 'STONE_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'UNIT_WEIGHT',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            }
          ]
        },
        referenceId: null,
        referenceType: null,
        isEdited: false,
        clubbedDiscountId: null,
        discountSubType: null,
        discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
        itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
        discountAttributes: {
          isRiva: true,
          isAccrualUlpPoints: false,
          clubbingDiscountType: 'TYPE1',
          occasion: 'catapr22'
        },
        status: 'CONFIRMED',
        txnLevelDiscountValueDetails: null,
        isNarationMandatory: false,
        occasion: ''
      }
    ];
    const req = {
      data: null,
      existingDiscounts: reqPayload,
      id: ['']
    };
    it('should return a stream with CheckABCOEligibility', () => {
      const res = 'no-response';

      const action = new CheckABCOEligibility(req);
      const outcome = new CheckABCOEligibilitySuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.checkABCOEligibility.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.checkABCOEligibility$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new CheckABCOEligibility(req);
      const error = new Error('some error');
      const outcome = new CheckABCOEligibilityFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.checkABCOEligibility.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.checkABCOEligibility$).toBeObservable(expected);
    });
  });

  describe('LoadABCODiscounts', () => {
    const req: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: ''
    };
    it('should return a stream with LoadABCODiscounts', () => {
      const res: DiscountHeaders = {
        discounts: [
          {
            discountType: 'CATEGORY_DISCOUNT',
            discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
            discountCode: 'catapr22',
            refDiscountTxnId: null,
            discountAttributes: {
              isRiva: true,
              isAccrualUlpPoints: false,
              clubbingDiscountType: 'TYPE1',
              occasion: 'catapr22'
            },
            rivaahGhsDetails: null
          }
        ],
        clubDiscounts: []
      };

      const action = new LoadABCODiscounts(req);
      const outcome = new LoadABCODiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadABCODiscounts.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadABCODiscounts$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadABCODiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadABCODiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadABCODiscounts.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadABCODiscounts$).toBeObservable(expected);
    });
  });

  describe('LoadNewABCODiscounts', () => {
    const req: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: ''
    };
    it('should return a stream with LoadNewABCODiscounts', () => {
      const res: DiscountHeaders = {
        discounts: [
          {
            discountType: 'CATEGORY_DISCOUNT',
            discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
            discountCode: 'catapr22',
            refDiscountTxnId: null,
            discountAttributes: {
              isRiva: true,
              isAccrualUlpPoints: false,
              clubbingDiscountType: 'TYPE1',
              occasion: 'catapr22'
            },
            rivaahGhsDetails: null
          }
        ],
        clubDiscounts: []
      };

      const action = new LoadNewABCODiscounts(req);
      const outcome = new LoadNewABCODiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadNewABCODiscounts.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadNewABCODiscounts$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadNewABCODiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadNewABCODiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadNewABCODiscounts.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadNewABCODiscounts$).toBeObservable(expected);
    });
  });

  describe('LoadABCODiscountDetails', () => {
    const reqPayload: DiscountsResponse[] = [
      {
        discountCode: 'catapr22',
        discountType: 'CATEGORY_DISCOUNT',
        discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
        discountValue: 34802.46,
        discountValueDetails: {
          type: 'DISCOUNT_VALUE_DETAILS',
          data: [
            {
              component: 'UCP',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'MAKING_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'METAL_CHARGE',
              discountValue: 34802.46,
              discountPercent: 12,
              isDiscountPercentage: true
            },
            {
              component: 'STONE_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'UNIT_WEIGHT',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            }
          ]
        },
        referenceId: null,
        referenceType: null,
        isEdited: false,
        clubbedDiscountId: null,
        discountSubType: null,
        discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
        itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
        discountAttributes: {
          isRiva: true,
          isAccrualUlpPoints: false,
          clubbingDiscountType: 'TYPE1',
          occasion: 'catapr22'
        },
        status: 'CONFIRMED',
        txnLevelDiscountValueDetails: null,
        isNarationMandatory: false,
        occasion: ''
      }
    ];
    const req = {
      id: [''],
      existingDiscounts: reqPayload,
      data: null
    };
    it('should return a stream with LoadABCODiscountDetails', () => {
      const res = {
        discountConfigDetails: [
          {
            discountValue: 34802.46,
            discountValueDetails: [
              {
                component: 'UCP',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'MAKING_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'METAL_CHARGE',
                discountValue: 34802.46,
                discountPercent: 12,
                isDiscountPercentage: true
              },
              {
                component: 'STONE_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'UNIT_WEIGHT',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              }
            ],
            discountConfigDetails: {
              discountType: 'CATEGORY_DISCOUNT',
              discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
              discountCode: 'catapr22',
              refDiscountTxnId: null,
              basicCriteriaDetails: {
                isNarationMandatory: false,
                maxDiscount: 0,
                isEditable: false,
                isTepRecovery: true,
                isBillValue: false,
                ucpValue: 0,
                isFullValueTepDiscountRecovery: false,
                coinPurchaseStartDate: moment(),
                coinPurchaseEndDate: moment(),
                tepPeriodStartDate: moment(),
                tepPeriodEndDate: moment(),
                tepCNUtilizationPercent: 1,
                startingSerialNo: 1,
                isUploadMandatory: false,
                isNameMandatory: false,
                startingSerialNoEmpDiscountType: 0,
                startingSerialNoTataEmpDiscountType: 0,
                isMultipleTrnsctnAllowedOnSameDay: false,
                maxNoOfTimes: 1,
                maxCount: 1,
                isApplicableForAutomatedDiscount: true,
                isFullValueTepRecovery: false
              },
              discountAttributes: {
                isRiva: true,
                isAccrualUlpPoints: false,
                clubbingDiscountType: 'TYPE1',
                occasion: 'catapr22'
              },
              clubbingDetails: {
                isExchangeOffer: true,
                isGHS: true,
                isRiva: false,
                isEmpowerment: false,
                isDV: true,
                isFOCOffer: true,
                isCBOOffer: false,
                isBillLevelDiscount: true,
                isOtherBillLevelDiscount: false,
                isCoin: true
              },
              grnConfigDetails: {
                noOfDaysAllowedBeforeOfferPeriod: 0,
                noOfDaysAllowedAfterOfferPeriod: 0,
                utilizationPercent: 0,
                isAllowedBeforeOffer: false,
                isSameCfaEligible: false
              },
              tepConfigDetails: {
                tepDetails: [{ durationInDays: '10-20', recoveryPercent: 95 }],
                enabled: false
              },
              orderConfigDetails: {
                isGoldRateFrozenForCO: false,
                isGoldRateFrozenForAB: false,
                isDisplayOnAB: false,
                isAllowedToChangeCO: false,
                isAllowedToChangeAB: false,
                isDisplayOnCO: false,
                offerPeriodForCO: 0,
                offerPeriodForAB: 0,
                coPercent: 0,
                abPercent: 0
              },
              locationOfferDetails: {
                offerStartDate: moment(1648751400000),
                offerEndDate: moment(1672425000000),
                configDetails: null,
                empowermentQuarterMaxDiscountValue: 0,
                previewOfferStartDate: moment(1648751400000),
                previewOfferEndDate: moment(1672425000000)
              }
            },
            rivaahGhsDetails: null
          }
        ],
        clubbingId: ''
      };

      const action = new LoadABCODiscountDetails(req);
      const outcome = new LoadABCODiscountDetailsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadABCODiscountDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadABCODiscountDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadABCODiscountDetails(req);
      const error = new Error('some error');
      const outcome = new LoadABCODiscountDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadABCODiscountDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadABCODiscountDetails$).toBeObservable(expected);
    });
  });

  describe('LoadABCOConfigDetails', () => {
    const req: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: ''
    };
    it('should return a stream with LoadABCOConfigDetails', () => {
      const res = {
        discounts: [
          {
            discountType: 'CATEGORY_DISCOUNT',
            discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
            discountCode: 'catapr22',
            refDiscountTxnId: null,
            discountAttributes: {
              isRiva: true,
              isAccrualUlpPoints: false,
              clubbingDiscountType: 'TYPE1',
              occasion: 'catapr22'
            },
            rivaahGhsDetails: null
          }
        ],
        clubDiscounts: []
      };
      const action = new LoadABCOConfigDetails(req);
      const outcome = new LoadABCOConfigDetailsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadABCODConfigDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadABCOConfigDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadABCOConfigDetails(req);
      const error = new Error('some error');
      const outcome = new LoadABCOConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadABCODConfigDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadABCOConfigDetails$).toBeObservable(expected);
    });
  });

  describe('LoadAutoDiscounts', () => {
    const req: AutoDiscRequest = {
      request: {
        customerDetails: {
          enrollmentDate: moment(),
          ulpId: '700001358840'
        },
        discountRequestDto: {
          businessDate: 1650652200000,
          itemDetails: {
            itemCode: '511881VQMQ2AP1',
            lotNumber: '2CD000002',
            mfgDate: moment(1608834600000),
            stockInwardDate: moment(1614450600000),
            totalTax: 4515.48,
            totalWeight: 52.731,
            netWeight: 52.731,
            totalValue: 332670.3,
            complexityPercent: 26,
            makingChargePerGram: 0,
            productCategoryCode: 'V',
            productGroupCode: '75'
          },
          transactionDetails: {
            transactionType: 'CM',
            subTransactionType: 'NEW_CM',
            isFrozenRate: null
          },
          encircleDiscount: {},
          employeeDetails: null,
          tsssDetails: null,
          tataEmployeeDetails: null,
          empowermentDetails: null,
          rivaahGhsDetails: null
        },
        itemDetails: {
          itemCode: '511881VQMQ2AP1',
          lotNumber: '2CD000002',
          productCategoryCode: 'V',
          productGroupCode: '75',
          priceDetails: {
            isUcp: false,
            printGuranteeCard: false,
            metalPriceDetails: {
              preDiscountValue: 263655,
              metalPrices: [
                {
                  weightUnit: 'gms',
                  netWeight: 52.731,
                  metalValue: 263655,
                  type: 'Gold',
                  ratePerUnit: 5000,
                  karat: 22,
                  purity: 92,
                  metalTypeCode: 'J'
                }
              ]
            },
            stonePriceDetails: {
              numberOfStones: null,
              preDiscountValue: 465,
              stoneWeight: null,
              weightUnit: null,
              stoneWeightForView: null,
              weightUnitForView: null
            },
            makingChargeDetails: {
              preDiscountValue: 68550.3,
              makingChargePercentage: 26,
              isDynamicPricing: false,
              makingChargePct: 0,
              makingChargePgram: 0,
              wastagePct: 26
            },
            itemHallmarkDetails: {
              hallmarkGstPct: null,
              hallmarkingCharges: null,
              hmQuantity: null,
              isFOCForHallmarkingCharges: null,
              isHallmarked: true
            },
            netWeight: 52.731
          },
          totalQuantity: 1,
          totalValue: 332670.3,
          totalWeight: 52.731,
          netWeight: 52.731,
          totalTax: 4515.48
        }
      },
      data: null
    };
    it('should return a stream with LoadAutoDiscounts', () => {
      const res = {
        response: {
          discountConfigDetails: [
            {
              discountValue: 34802.46,
              discountValueDetails: [
                {
                  component: 'UCP',
                  discountValue: 0,
                  discountPercent: null,
                  isDiscountPercentage: null
                },
                {
                  component: 'MAKING_CHARGE',
                  discountValue: 0,
                  discountPercent: null,
                  isDiscountPercentage: null
                },
                {
                  component: 'METAL_CHARGE',
                  discountValue: 34802.46,
                  discountPercent: 12,
                  isDiscountPercentage: true
                },
                {
                  component: 'STONE_CHARGE',
                  discountValue: 0,
                  discountPercent: null,
                  isDiscountPercentage: null
                },
                {
                  component: 'UNIT_WEIGHT',
                  discountValue: 0,
                  discountPercent: null,
                  isDiscountPercentage: null
                }
              ],
              discountConfigDetails: {
                discountType: 'CATEGORY_DISCOUNT',
                discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
                discountCode: 'catapr22',
                refDiscountTxnId: null,
                basicCriteriaDetails: {
                  isNarationMandatory: false,
                  maxDiscount: 0,
                  isEditable: false,
                  isTepRecovery: true,
                  isBillValue: false,
                  ucpValue: 0,
                  isFullValueTepDiscountRecovery: false,
                  coinPurchaseStartDate: moment(),
                  coinPurchaseEndDate: moment(),
                  tepPeriodStartDate: moment(),
                  tepPeriodEndDate: moment(),
                  tepCNUtilizationPercent: 1,
                  startingSerialNo: 1,
                  isUploadMandatory: false,
                  isNameMandatory: false,
                  startingSerialNoEmpDiscountType: 0,
                  startingSerialNoTataEmpDiscountType: 0,
                  isMultipleTrnsctnAllowedOnSameDay: false,
                  maxNoOfTimes: 1,
                  maxCount: 1,
                  isApplicableForAutomatedDiscount: true,
                  isFullValueTepRecovery: false
                },
                discountAttributes: {
                  isRiva: true,
                  isAccrualUlpPoints: false,
                  clubbingDiscountType: 'TYPE1',
                  occasion: 'catapr22'
                },
                clubbingDetails: {
                  isExchangeOffer: true,
                  isGHS: true,
                  isRiva: false,
                  isEmpowerment: false,
                  isDV: true,
                  isFOCOffer: true,
                  isCBOOffer: false,
                  isBillLevelDiscount: true,
                  isOtherBillLevelDiscount: false,
                  isCoin: true
                },
                grnConfigDetails: {
                  noOfDaysAllowedBeforeOfferPeriod: 0,
                  noOfDaysAllowedAfterOfferPeriod: 0,
                  utilizationPercent: 0,
                  isAllowedBeforeOffer: false,
                  isSameCfaEligible: false
                },
                tepConfigDetails: {
                  tepDetails: [
                    { durationInDays: '10-20', recoveryPercent: 95 }
                  ],
                  enabled: false
                },
                orderConfigDetails: {
                  isGoldRateFrozenForCO: false,
                  isGoldRateFrozenForAB: false,
                  isDisplayOnAB: false,
                  isAllowedToChangeCO: false,
                  isAllowedToChangeAB: false,
                  isDisplayOnCO: false,
                  offerPeriodForCO: 0,
                  offerPeriodForAB: 0,
                  coPercent: 0,
                  abPercent: 0
                },
                locationOfferDetails: {
                  offerStartDate: moment(1648751400000),
                  offerEndDate: moment(1672425000000),
                  configDetails: null,
                  empowermentQuarterMaxDiscountValue: 0,
                  previewOfferStartDate: moment(1648751400000),
                  previewOfferEndDate: moment(1672425000000)
                }
              },
              rivaahGhsDetails: null
            }
          ],
          clubbingId: ''
        },
        data: null
      };
      const action = new LoadAutoDiscounts(req);
      const outcome = new LoadAutoDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res.response });
      discountService.loadAutoDiscounts.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadAutoDiscounts$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadAutoDiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadAutoDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadAutoDiscounts.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAutoDiscounts$).toBeObservable(expected);
    });
  });

  describe('LoadRivaahGHSDiscounts', () => {
    const req: DiscountTransactionLevelRequest = {
      businessDate: '1624300200000',
      discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT'
    };
    it('should return a stream with LoadRivaahGHSDiscounts', () => {
      const resPayload: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];
      const res = {
        clubDiscountDetails: [],
        discountDetails: resPayload
      };
      const action = new LoadRivaahGHSDiscounts(req);
      const outcome = new LoadRivaahGHSDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.loadRivaahGHSDiscounts.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRivaahGHSDiscounts$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadRivaahGHSDiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadRivaahGHSDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.loadRivaahGHSDiscounts.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRivaahGHSDiscounts$).toBeObservable(expected);
    });
  });

  describe('SaveRivaahGHSDiscounts', () => {
    const req: ApplyDiscountRequest = {
      subTxnType: 'NEW_CM',
      transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
      discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT',
      txnType: 'CM',
      hasDiscounts: false,
      requestBody: {
        discountDetails: [
          {
            discountCode: 'Test rivaah discount',
            discountId: '3DFC0981-5F67-4CB4-BD90-80EE1421C2FC',
            discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT',
            discountValue: 1000,
            discountValueDetails: {},
            isEdited: false
          }
        ]
      }
    };
    it('should return a stream with SaveRivaahGHSDiscounts', () => {
      const res: string[] = ['RIVAAH_ASHIRWAAD_DISCOUNT'];
      const action = new SaveRivaahGHSDiscounts(req);
      const outcome = new SaveRivaahGHSDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountService.saveRivaahGHSDiscounts.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveRivaahGHSDiscounts$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveRivaahGHSDiscounts(req);
      const error = new Error('some error');
      const outcome = new SaveRivaahGHSDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountService.saveRivaahGHSDiscounts.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveRivaahGHSDiscounts$).toBeObservable(expected);
    });
  });

  describe('LoadReasonForChangingDiscounts', () => {
    const req = 'REASON_FOR_CHANGING_DISCOUNTS';
    it('should return a stream with LoadReasonForChangingDiscounts', () => {
      const res: Lov[] = [
        {
          code: 'GOT_HIGH_VALUE',
          isActive: true,
          value: 'GOT_HIGH_VALUE'
        }
      ];
      const action = new LoadReasonForChangingDiscounts(req);
      const outcome = new LoadReasonForChangingDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      lovDataService.getSalesLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadReasonForChangingDiscounts$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadReasonForChangingDiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadReasonForChangingDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataService.getSalesLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadReasonForChangingDiscounts$).toBeObservable(expected);
    });
  });

  describe('LoadReasonForNotGivingDiscounts', () => {
    const req = 'REASON_FOR_NOTGIVING_DISCOUNTS';
    it('should return a stream with LoadReasonForNotGivingDiscounts', () => {
      const res: Lov[] = [
        {
          code: 'NOT_INTERESTED',
          isActive: true,
          value: 'NOT_INTERESTED'
        }
      ];
      const action = new LoadReasonForNotGivingDiscounts(req);
      const outcome = new LoadReasonForNotGivingDiscountsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      lovDataService.getSalesLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadReasonForNotGivingDiscounts$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadReasonForNotGivingDiscounts(req);
      const error = new Error('some error');
      const outcome = new LoadReasonForNotGivingDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataService.getSalesLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadReasonForNotGivingDiscounts$).toBeObservable(expected);
    });
  });
});
