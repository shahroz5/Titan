import { DiscountState } from './discount.state';
import * as actions from './discount.actions';
import { initialState, DiscountReducer } from './discount.reducer';
import {
  AdvanceBookingDetailsResponse,
  ApplyDiscountRequest,
  AutoDiscRequest,
  ConfirmTransactionLevelDiscountPayload,
  CustomErrors,
  DiscountHeaders,
  DiscountsRequestPayload,
  DiscountsResponse,
  DiscountTransactionLevelRequest,
  DiscountTransactionLevelResponse,
  DiscountVoucherDetailsRequestPayload,
  DiscountVoucherDetailsResponePayload,
  ItemLevelDiscountsDetailsRequestPayload,
  ItemLevelDiscountsRequestPayload,
  LoadAppliedTransactionDiscountsRequest,
  Lov,
  RemoveAllAppliedTransactionLevelDiscountsPayload,
  RemoveAppliedTransactionLevelDiscountByIDPayload,
  StatusTypesEnum,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  UpdateTransactionLevelDiscountByIDPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';

describe('DiscountReducer reducer Testing Suite', () => {
  let testState = initialState;

  describe('Testing LoadTransactionLevelDiscounts ', () => {
    beforeEach(() => {});
    it('Load LoadTransactionLevelDiscounts should set the isLoading to true', () => {
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'BILL_LEVEL_DISCOUNT'
      };

      const action = new actions.LoadTransactionLevelDiscounts(paylaod);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.transactionLevelDiscounts.length).toBe(0);
    });
    it('LoadTransactionLevelDiscountsSuccess should return list of data', () => {
      const payload: DiscountTransactionLevelResponse[] = [
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

      const action = new actions.LoadTransactionLevelDiscountsSuccess(payload);

      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.transactionLevelDiscounts.length).toBe(1);
    });
    it('LoadConfigListFailure should return error', () => {
      const action = new actions.LoadTransactionLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadAvailableEmployeeDiscounts ', () => {
    beforeEach(() => {});
    it('Load LoadAvailableEmployeeDiscounts should set the isLoading to true', () => {
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'EMPLOYEE_DISCOUNT',
        itemDetails: [],
        employeeDetails: { couponDetails: [{ couponCode: '1234567' }] }
      };

      const action = new actions.LoadAvailableEmployeeDiscounts(paylaod);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.isLoadingAvailableDiscounts).toBe(true);
      expect(result.error).toBe(null);
      expect(result.availableEmployeeDiscounts).toBe(null);
    });
    it('LoadAvailableEmployeeDiscountsSuccess should return list of data', () => {
      const payload: DiscountTransactionLevelResponse[] = [
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

      const action = new actions.LoadAvailableEmployeeDiscountsSuccess(payload);

      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isLoadingAvailableDiscounts).toBe(false);
      expect(result.availableEmployeeDiscounts.length).toBe(1);
    });
    it('LoadAvailableEmployeeDiscountsFailure should return error', () => {
      const action = new actions.LoadAvailableEmployeeDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.isLoadingAvailableDiscounts).toEqual(false);
      expect(result.availableEmployeeDiscounts).toEqual(null);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadAvailableTSSSDiscounts ', () => {
    beforeEach(() => {});
    it('Load LoadAvailableTSSSDiscounts should set the isLoading to true', () => {
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'TSSS_DISCOUNT',
        itemDetails: [],
        tsssDetails: { couponDetails: [{ couponCode: '1234567' }] }
      };

      const action = new actions.LoadAvailableTSSSDiscounts(paylaod);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.isLoadingAvailableDiscounts).toBe(true);
      expect(result.error).toBe(null);
      expect(result.availableTsssDiscounts).toBe(null);
    });
    it('LoadAvailableTSSSDiscountsSuccess should return list of data', () => {
      const payload: DiscountTransactionLevelResponse[] = [
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

      const action = new actions.LoadAvailableTSSSDiscountsSuccess(payload);

      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isLoadingAvailableDiscounts).toBe(false);
      expect(result.availableTsssDiscounts.length).toBe(1);
    });
    it('LoadAvailableTSSSDiscountsFailure should return error', () => {
      const action = new actions.LoadAvailableTSSSDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.isLoadingAvailableDiscounts).toEqual(false);
      expect(result.availableTsssDiscounts).toEqual(null);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadAvailableTataEmployeeDiscounts ', () => {
    beforeEach(() => {});
    it('Load LoadAvailableTataEmployeeDiscounts should set the isLoading to true', () => {
      const paylaod: DiscountTransactionLevelRequest = {
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

      const action = new actions.LoadAvailableTataEmployeeDiscounts(paylaod);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.isLoadingAvailableDiscounts).toBe(true);
      expect(result.error).toBe(null);
      expect(result.availableTataEmployeeDiscounts).toBe(null);
    });
    it('LoadAvailableTataEmployeeDiscountsSuccess should return list of data', () => {
      const payload: DiscountTransactionLevelResponse[] = [
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

      const action = new actions.LoadAvailableTataEmployeeDiscountsSuccess(
        payload
      );

      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isLoadingAvailableDiscounts).toBe(false);
      expect(result.availableTataEmployeeDiscounts.length).toBe(1);
    });
    it('LoadAvailableTataEmployeeDiscountsFailure should return error', () => {
      const action = new actions.LoadAvailableTataEmployeeDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.isLoadingAvailableDiscounts).toEqual(false);
      expect(result.availableTataEmployeeDiscounts).toEqual(null);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadAvailableSystemDvDiscounts ', () => {
    beforeEach(() => {});
    it('Load LoadAvailableSystemDvDiscounts should set the isLoading to true', () => {
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'SYSTEM_DISCOUNT_DV',
        itemDetails: []
      };

      const action = new actions.LoadAvailableSystemDvDiscounts(paylaod);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.isLoadingAvailableDiscounts).toBe(true);
      expect(result.error).toBe(null);
      expect(result.availableSystemDvDiscounts).toBe(null);
    });
    it('LoadAvailableSystemDvDiscountsSuccess should return list of data', () => {
      const payload: DiscountTransactionLevelResponse[] = [
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

      const action = new actions.LoadAvailableSystemDvDiscountsSuccess(payload);

      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isLoadingAvailableDiscounts).toBe(false);
      expect(result.availableSystemDvDiscounts.length).toBe(1);
    });
    it('LoadAvailableSystemDvDiscountsFailure should return error', () => {
      const action = new actions.LoadAvailableSystemDvDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.isLoadingAvailableDiscounts).toEqual(false);
      expect(result.availableSystemDvDiscounts).toEqual(null);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadAvailableEmpowementDiscounts ', () => {
    beforeEach(() => {});
    it('Load LoadAvailableEmpowementDiscounts should set the isLoading to true', () => {
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'EMPOWERMENT_DISCOUNT',
        itemDetails: [],
        empowermentDetails: { applyEmpowermentDiscount: true }
      };
      const action = new actions.LoadAvailableEmpowementDiscounts(paylaod);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.isLoadingAvailableDiscounts).toBe(true);
      expect(result.error).toBe(null);
      expect(result.availableEmpowermentDiscounts).toBe(null);
    });
    it('LoadAvailableEmpowementDiscountsSuccess should return list of data', () => {
      const payload: DiscountTransactionLevelResponse[] = [
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

      const action = new actions.LoadAvailableEmpowementDiscountsSuccess(
        payload
      );

      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isLoadingAvailableDiscounts).toBe(false);
      expect(result.availableEmpowermentDiscounts.length).toBe(1);
    });
    it('LoadAvailableEmpowementDiscountsFailure should return error', () => {
      const action = new actions.LoadAvailableEmpowementDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.isLoadingAvailableDiscounts).toEqual(false);
      expect(result.availableEmpowermentDiscounts).toEqual(null);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing ApplyDiscountAtTransactionLevel ', () => {
    beforeEach(() => {});
    it('Load ApplyDiscountAtTransactionLevel should set the isLoading to true', () => {
      const paylaod: ApplyDiscountRequest = {
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
      const action = new actions.ApplyDiscountAtTransactionLevel(paylaod);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.isTransactionLevelDiscountApplied).toBe(false);
      expect(result.error).toBe(null);
    });
    it('ApplyDiscountAtTransactionLevelSucces should return list of data', () => {
      const payload = true;

      const action = new actions.ApplyDiscountAtTransactionLevelSucces(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isTransactionLevelDiscountApplied).toBe(true);
    });
    it('ApplyDiscountAtTransactionLevelFailure should return error', () => {
      const action = new actions.ApplyDiscountAtTransactionLevelFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadAppliedTransactionLevelDiscounts ', () => {
    beforeEach(() => {});
    it('Load LoadAppliedTransactionLevelDiscounts should set the isLoading to true', () => {
      const paylaod: LoadAppliedTransactionDiscountsRequest = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM'
      };
      const action = new actions.LoadAppliedTransactionLevelDiscounts(paylaod);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.appliedTransactionLevelDiscounts.length).toBe(0);
      expect(result.error).toBe(null);
    });
    it('LoadAppliedTransactionLevelDiscountsSuccess should return list of data', () => {
      const payload = [
        {
          discountCode: 'bill345',
          discountId: '82A9B3CC-02B7-48A2-A7C4-8E25256CB693',
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: 2,
          discountValueDetails: {
            type: 'DISCOUNT_VALUE_DETAILS',
            data: {
              discountValueDetails: [
                {
                  component: 'BILL_DISCOUNT',
                  discountPercent: null,
                  discountValue: 2,
                  isDiscountPercentage: true
                }
              ]
            }
          },
          referenceId: null,
          referenceType: null,
          isEdited: false,
          isAutoApplied: null,
          reason: null,
          discountTxnId: '7F93EB5A-75E5-4D27-B857-EEFC4C155519',
          itemId: null
        }
      ];

      const action = new actions.LoadAppliedTransactionLevelDiscountsSuccess(
        payload
      );
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.appliedTransactionLevelDiscounts).toBeTruthy();
    });
    it('LoadAppliedTransactionLevelDiscountsFailure should return error', () => {
      const action = new actions.LoadAppliedTransactionLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing RemoveAllAppliedTransactionLevelDiscounts ', () => {
    beforeEach(() => {});
    it('Load RemoveAllAppliedTransactionLevelDiscounts should set the isLoading to true', () => {
      const paylaod: RemoveAllAppliedTransactionLevelDiscountsPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'BILL_LEVEL_DISCOUNT'
      };

      const action = new actions.RemoveAllAppliedTransactionLevelDiscounts(
        paylaod
      );

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(
        result.isAllAppliedTransactionLevelDiscountDeleted.discountType
      ).toBe(null);
      expect(result.isAllAppliedTransactionLevelDiscountDeleted.isDeleted).toBe(
        false
      );
    });
    it('RemoveAllAppliedTransactionLevelDiscountsSuccess should return list of data', () => {
      const payload = { isDeleted: true, discountType: 'BILL_LEVEL_DISCOUNT' };

      const action = new actions.RemoveAllAppliedTransactionLevelDiscountsSuccess(
        payload
      );
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(
        result.isAllAppliedTransactionLevelDiscountDeleted.discountType
      ).toBe(payload.discountType);
      expect(result.isAllAppliedTransactionLevelDiscountDeleted.isDeleted).toBe(
        payload.isDeleted
      );
    });
    it('RemoveAllAppliedTransactionLevelDiscountsFailure should return error', () => {
      const action = new actions.RemoveAllAppliedTransactionLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing RemoveAppliedTransactionLevelDiscountByID ', () => {
    beforeEach(() => {});
    it('Load RemoveAppliedTransactionLevelDiscountByID should set the isLoading to true', () => {
      const paylaod: RemoveAppliedTransactionLevelDiscountByIDPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'BILL_LEVEL_DISCOUNT',
        discountId: '1111111111111'
      };

      const action = new actions.RemoveAppliedTransactionLevelDiscountByID(
        paylaod
      );

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.isSelectedTransactionLevelDiscountDeleted).toBe(false);
    });
    it('RemoveAppliedTransactionLevelDiscountByIDSuccess should return list of data', () => {
      const payload = true;

      const action = new actions.RemoveAppliedTransactionLevelDiscountByIDSuccess(
        payload
      );
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isSelectedTransactionLevelDiscountDeleted).toBe(true);
    });
    it('RemoveAppliedTransactionLevelDiscountByIDFailure should return error', () => {
      const action = new actions.RemoveAppliedTransactionLevelDiscountByIDFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing ConfirmAppliedTransactionLevelDiscount ', () => {
    beforeEach(() => {});
    it('Load ConfirmAppliedTransactionLevelDiscount should set the isLoading to true', () => {
      const paylaod: ConfirmTransactionLevelDiscountPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'BILL_LEVEL_DISCOUNT',
        discountTxnId: ['111111111111111']
      };

      const action = new actions.ConfirmAppliedTransactionLevelDiscount(
        paylaod
      );

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.isTransactionLevelDiscountConfirmed).toBe(false);
    });
    it('ConfirmAppliedTransactionLevelDiscountSuccess should return list of data', () => {
      const payload = true;

      const action = new actions.ConfirmAppliedTransactionLevelDiscountSuccess(
        payload,
        null
      );
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isTransactionLevelDiscountConfirmed).toBe(true);
    });
    it('ConfirmAppliedTransactionLevelDiscountFailure should return error', () => {
      const action = new actions.ConfirmAppliedTransactionLevelDiscountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing UpdateAppliedTransactionLevelDiscount ', () => {
    beforeEach(() => {});
    it('Load UpdateAppliedTransactionLevelDiscount should set the isLoading to true', () => {
      const paylaod: UpdateTransactionLevelDiscountByIDPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'BILL_LEVEL_DISCOUNT',
        isPriceUpdate: false
      };
      const action = new actions.UpdateAppliedTransactionLevelDiscount(paylaod);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.isTransactionLevelDiscountUpdated).toBe(false);
    });
    it('UpdateAppliedTransactionLevelDiscountSuccess should return list of data', () => {
      const payload = true;

      const action = new actions.UpdateAppliedTransactionLevelDiscountSuccess(
        payload
      );
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isTransactionLevelDiscountUpdated).toBe(true);
    });
    it('UpdateAppliedTransactionLevelDiscountFailure should return error', () => {
      const action = new actions.UpdateAppliedTransactionLevelDiscountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadTataCompanyNameList ', () => {
    beforeEach(() => {});
    it('Load LoadTataCompanyNameList should set the isLoading to true', () => {
      const payload = 'TATA_COMPANY';
      const action = new actions.LoadTataCompanyNameList(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.tataCompanyList.length).toBe(0);
    });
    it('LoadTataCompanyNameListSuccess should return list of data', () => {
      const payload: Lov[] = [{ code: 'TCS', isActive: true, value: 'TCS' }];

      const action = new actions.LoadTataCompanyNameListSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.tataCompanyList.length).toBe(1);
    });
    it('LoadTataCompanyNameListFailure should return error', () => {
      const action = new actions.LoadTataCompanyNameListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing ClearTransactionLevelDiscountDetails ', () => {
    beforeEach(() => {});
    it('Load LoadTataCompanyNameList should set the isLoading to true', () => {
      const action = new actions.ClearTransactionLevelDiscountDetails();

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.transactionLevelDiscounts.length).toBe(0);
      expect(result.error).toBe(null);
      expect(result.isTransactionLevelDiscountApplied).toBe(false);
      expect(result.appliedTransactionLevelDiscounts.length).toBe(0);
      expect(result.isAllAppliedTransactionLevelDiscountDeleted.isDeleted).toBe(
        false
      );
      expect(
        result.isAllAppliedTransactionLevelDiscountDeleted.discountType
      ).toBe(null);
      expect(result.isSelectedTransactionLevelDiscountDeleted).toBe(false);
      expect(result.isTransactionLevelDiscountUpdated).toBe(false);
      expect(result.availableEmployeeDiscounts).toBe(null);
      expect(result.availableTsssDiscounts).toBe(null);
      expect(result.availableTataEmployeeDiscounts).toBe(null);
      expect(result.availableSystemDvDiscounts).toBe(null);
      expect(result.availableEmpowermentDiscounts).toBe(null);
    });
  });
  describe('Testing SetIsRsoSelected ', () => {
    beforeEach(() => {});
    it('Load SetIsRsoSelected should set the isLoading to true', () => {
      const payload = true;
      const action = new actions.ClearTransactionLevelDiscountDetails();

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isRsoSelected).toBe(true);
    });
  });
  describe('Testing LoadDiscountVoucherDetails ', () => {
    beforeEach(() => {});
    it('Load LoadDiscountVoucherDetails should set the isLoading to true', () => {
      const payload: DiscountVoucherDetailsRequestPayload = {
        accountNo: 12345,
        vendorCode: 'DV',
        voucherCode: 9876543
      };

      const action = new actions.LoadDiscountVoucherDetails(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.discountVoucherDetails).toBe(null);
      expect(result.error).toBe(null);
    });
    it('LoadDiscountVoucherDetailsSuccess should return list of data', () => {
      const payload: DiscountVoucherDetailsResponePayload = {
        accountCustomerId: 1,
        accountNo: 12345,
        customerId: 1,
        customerName: 'Joe',
        discountAmount: 1000,
        ghScheme: 'EGHS_SCHEME',
        id: '1111111111111',
        installmentAmount: 1000,
        isGoldCoinAllowed: false,
        issueDate: moment(1626394585),
        mobileNo: '9745512430',
        noOfInstallmentsPaid: 5,
        redeemptionDate: moment(1626394585),
        status: 'OPEN',
        validFrom: moment(1626394585),
        validTill: moment(1626394585),
        voucherNo: 7777777
      };
      const action = new actions.LoadDiscountVoucherDetailsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.discountVoucherDetails).toBe(payload);
    });
    it('LoadDiscountVoucherDetailsFailure should return error', () => {
      const action = new actions.LoadDiscountVoucherDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing RefreshDiscountsAndOffersPanel ', () => {
    beforeEach(() => {});
    it('Load SetIsRsoSelected should set the isLoading to true', () => {
      const payload = true;
      const action = new actions.RefreshDiscountsAndOffersPanel(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isRsoSelected).toBe(true);
    });
  });
  // item level discounts
  describe('Testing LoadItemLevelDiscounts ', () => {
    beforeEach(() => {});
    it('LoadItemLevelDiscounts should set the isLoading to true', () => {
      const payload: ItemLevelDiscountsRequestPayload = {
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
      const action = new actions.LoadItemLevelDiscounts(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isDropdownLoading).toBe(true);
      expect(result.itemLevelDiscounts).toBe(null);
      expect(result.error).toBe(null);
    });
    it('LoadItemLevelDiscountsSuccess should return list of data', () => {
      const payload: DiscountHeaders = {
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
      const action = new actions.LoadItemLevelDiscountsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isDropdownLoading).toBe(false);
      expect(result.itemLevelDiscounts).toBe(payload);
    });
    it('LoadItemLevelDiscountsFailure should return error', () => {
      const action = new actions.LoadItemLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isDropdownLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadItemLevelDiscountsDetails ', () => {
    beforeEach(() => {});
    it('LoadItemLevelDiscountsDetails should set the isLoading to true', () => {
      const payload: ItemLevelDiscountsDetailsRequestPayload = {
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
      const action = new actions.LoadItemLevelDiscountsDetails(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isDiscountDetailsLoading).toBe(true);
      expect(result.itemLevelDiscountsDetails).toBe(null);
      expect(result.error).toBe(null);
    });
    it('LoadItemLevelDiscountsDetailsSuccess should return list of data', () => {
      const payload = {
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
      const action = new actions.LoadItemLevelDiscountsDetailsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isDiscountDetailsLoading).toBe(false);
      expect(result.itemLevelDiscountsDetails).toBe(payload);
    });
    it('LoadItemLevelDiscountsDetailsFailure should return error', () => {
      const action = new actions.LoadItemLevelDiscountsDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isDiscountDetailsLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing GetItemLevelDiscounts ', () => {
    beforeEach(() => {});
    it('GetItemLevelDiscounts should set the isLoading to true', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const action = new actions.GetItemLevelDiscounts(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isAlreadyAddedDiscountsLoading).toBe(true);
      expect(result.getItemLevelDiscountsRes).toBe(null);
      expect(result.error).toBe(null);
    });
    it('GetItemLevelDiscountsSuccess should return list of data', () => {
      const payload: DiscountsResponse[] = [
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
      const action = new actions.GetItemLevelDiscountsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isAlreadyAddedDiscountsLoading).toBe(false);
      expect(result.getItemLevelDiscountsRes).toBe(payload);
    });
    it('GetItemLevelDiscountsFailure should return error', () => {
      const action = new actions.GetItemLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isAlreadyAddedDiscountsLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing SaveItemLevelDiscounts ', () => {
    beforeEach(() => {});
    it('SaveItemLevelDiscounts should set the isLoading to true', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const reqPayload = {
        request: payload,
        data: null
      };
      const action = new actions.SaveItemLevelDiscounts(reqPayload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.saveItemLevelDiscountsRes.response.length).toBe(0);
      expect(result.saveItemLevelDiscountsRes.data).toBe(null);
      expect(result.error).toBe(null);
    });
    it('SaveItemLevelDiscountsSuccess should return list of data', () => {
      const payload: DiscountsResponse[] = [
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
      const resPayload = {
        response: payload,
        data: null
      };
      const action = new actions.SaveItemLevelDiscountsSuccess(resPayload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.saveItemLevelDiscountsRes).toBe(resPayload);
    });
    it('SaveItemLevelDiscountsFailure should return error', () => {
      const action = new actions.SaveItemLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing UpdateItemLevelDiscounts ', () => {
    beforeEach(() => {});
    it('UpdateItemLevelDiscounts should set the isLoading to true', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const action = new actions.UpdateItemLevelDiscounts(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('UpdateItemLevelDiscountsSuccess should return list of data', () => {
      const payload: DiscountsResponse = {
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
      const action = new actions.UpdateItemLevelDiscountsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.updateItemLevelDiscountsRes.length).toBe(1);
    });
    it('UpdateItemLevelDiscountsFailure should return error', () => {
      const action = new actions.UpdateItemLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing DeleteItemLevelDiscounts ', () => {
    beforeEach(() => {});
    it('DeleteItemLevelDiscounts should set the isLoading to true', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const reqPayload = {
        request: payload,
        data: null
      };
      const action = new actions.DeleteItemLevelDiscounts(reqPayload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.deleteItemLevelDiscountsRes.response).toBeFalsy();
      expect(result.deleteItemLevelDiscountsRes.data).toBe(null);
      expect(result.error).toBe(null);
    });
    it('DeleteItemLevelDiscountsSuccess should return list of data', () => {
      const payload = {
        response: true,
        data: null
      };
      const action = new actions.DeleteItemLevelDiscountsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.deleteItemLevelDiscountsRes.response).toBe(
        payload.response
      );
      expect(result.deleteItemLevelDiscountsRes.data).toBe(payload.data);
    });
    it('DeleteItemLevelDiscountsFailure should return error', () => {
      const action = new actions.DeleteItemLevelDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadPcDesc ', () => {
    beforeEach(() => {});
    it('LoadPcDesc should set the isLoading to true', () => {
      const action = new actions.LoadPcDesc();

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadPcDescSuccess should return list of data', () => {
      const payload = {};
      const action = new actions.LoadPcDescSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.productCategoryDesc).toBe(payload);
    });
    it('LoadPcDescFailure should return error', () => {
      const action = new actions.LoadPcDescFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadPgDesc ', () => {
    beforeEach(() => {});
    it('LoadPgDesc should set the isLoading to true', () => {
      const action = new actions.LoadPgDesc();

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadPgDescSuccess should return list of data', () => {
      const payload = {};
      const action = new actions.LoadPgDescSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.productGroupDesc).toBe(payload);
    });
    it('LoadPgDescFailure should return error', () => {
      const action = new actions.LoadPgDescFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadDiscountTypes ', () => {
    beforeEach(() => {});
    it('LoadDiscountTypes should set the isLoading to true', () => {
      const payload = '';
      const action = new actions.LoadDiscountTypes(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.discountTypes.length).toBe(0);
      expect(result.error).toBe(null);
    });
    it('LoadDiscountTypesSuccess should return list of data', () => {
      const payload: Lov[] = [
        {
          code: 'CATEGORY_DISCOUNT',
          isActive: true,
          value: 'CATEGORY_DISCOUNT'
        }
      ];
      const action = new actions.LoadDiscountTypesSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.discountTypes.length).toBe(1);
    });
    it('LoadDiscountTypesFailure should return error', () => {
      const action = new actions.LoadDiscountTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing CheckABCOEligibility ', () => {
    beforeEach(() => {});
    it('CheckABCOEligibility should set the isLoading to true', () => {
      const payload: DiscountsResponse[] = [
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
      const reqPayload = {
        data: null,
        existingDiscounts: payload,
        id: ['']
      };
      const action = new actions.CheckABCOEligibility(reqPayload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.ABCOEligibilityRes).toBe(null);
    });
    it('CheckABCOEligibilitySuccess - True Case - should return list of data', () => {
      const payload = {
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
      const action = new actions.CheckABCOEligibilitySuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.ABCOEligibilityRes).toBe(payload);
    });
    it('CheckABCOEligibilitySuccess - False Case - should return list of data', () => {
      const payload = null;
      const resPayload = 'no-response';
      const action = new actions.CheckABCOEligibilitySuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.ABCOEligibilityRes).toBe(resPayload);
    });
    it('CheckABCOEligibilityFailure should return error', () => {
      const action = new actions.CheckABCOEligibilityFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadABCODiscounts ', () => {
    beforeEach(() => {});
    it('LoadABCODiscounts should set the isLoading to true', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const action = new actions.LoadABCODiscounts(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isABDropdownLoading).toBe(true);
      expect(result.ABCODiscountsRes).toBe(null);
    });
    it('LoadABCODiscountsSuccess should return list of data', () => {
      const payload: DiscountHeaders = {
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
      const action = new actions.LoadABCODiscountsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isABDropdownLoading).toBe(false);
      expect(result.ABCODiscountsRes).toBe(payload);
    });
    it('LoadABCODiscountsFailure should return error', () => {
      const action = new actions.LoadABCODiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isABDropdownLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadNewABCODiscounts ', () => {
    beforeEach(() => {});
    it('LoadNewABCODiscounts should set the isLoading to true', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const action = new actions.LoadNewABCODiscounts(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isABDropdownLoading).toBe(true);
      expect(result.newABCODiscountsRes).toBe(null);
    });
    it('LoadNewABCODiscountsSuccess should return list of data', () => {
      const payload: DiscountHeaders = {
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
      const action = new actions.LoadNewABCODiscountsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isABDropdownLoading).toBe(false);
      expect(result.newABCODiscountsRes).toBe(payload);
    });
    it('LoadNewABCODiscountsFailure should return error', () => {
      const action = new actions.LoadNewABCODiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isABDropdownLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadABCODiscountDetails ', () => {
    beforeEach(() => {});
    it('LoadABCODiscountDetails should set the isLoading to true', () => {
      const payload: DiscountsResponse[] = [
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
      const reqPayload = {
        id: [''],
        existingDiscounts: payload,
        data: null
      };
      const action = new actions.LoadABCODiscountDetails(reqPayload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.ABCODiscountDetailsRes).toBe(null);
    });
    it('LoadABCODiscountDetailsSuccess should return list of data', () => {
      const payload = {
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
      const action = new actions.LoadABCODiscountDetailsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.ABCODiscountDetailsRes).toBe(payload);
    });
    it('LoadABCODiscountDetailsFailure should return error', () => {
      const action = new actions.LoadABCODiscountDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadABCOConfigDetails ', () => {
    beforeEach(() => {});
    it('LoadABCOConfigDetails should set the isLoading to true', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const action = new actions.LoadABCOConfigDetails(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.ABCOConfigDetailsRes).toBe(null);
    });
    it('LoadABCOConfigDetailsSuccess should return list of data', () => {
      const payload = {
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
      const action = new actions.LoadABCOConfigDetailsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.ABCOConfigDetailsRes).toBe(payload);
    });
    it('LoadABCOConfigDetailsFailure should return error', () => {
      const action = new actions.LoadABCOConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadAutoDiscounts ', () => {
    beforeEach(() => {});
    it('LoadAutoDiscounts should set the isLoading to true', () => {
      const payload: AutoDiscRequest = {
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
        }
      };
      const action = new actions.LoadAutoDiscounts(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isAutoDiscLoading).toBe(true);
      expect(result.autoDiscountsRes.response).toBe(null);
      expect(result.autoDiscountsRes.data).toBe(null);
    });
    it('LoadAutoDiscountsSuccess should return list of data', () => {
      const payload = {
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
      const action = new actions.LoadAutoDiscountsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isAutoDiscLoading).toBe(false);
      expect(result.autoDiscountsRes.response).toBe(payload.response);
      expect(result.autoDiscountsRes.data).toBe(payload.data);
    });
    it('LoadAutoDiscountsFailure should return error', () => {
      const action = new actions.LoadAutoDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isAutoDiscLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadRivaahGHSDiscounts ', () => {
    beforeEach(() => {});
    it('LoadRivaahGHSDiscounts should set the isLoading to true', () => {
      const payload: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT'
      };
      const action = new actions.LoadRivaahGHSDiscounts(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.rivaahGHSDiscounts).toBe(null);
      expect(result.error).toBe(null);
    });
    it('LoadRivaahGHSDiscountsSuccess should return list of data', () => {
      const payload: DiscountTransactionLevelResponse[] = [
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
      const resPayload = {
        clubDiscountDetails: [],
        discountDetails: payload
      };
      const action = new actions.LoadRivaahGHSDiscountsSuccess(resPayload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.rivaahGHSDiscounts).toBe(resPayload);
    });
    it('LoadRivaahGHSDiscountsFailure should return error', () => {
      const action = new actions.LoadRivaahGHSDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadRivaahGHSDiscounts ', () => {
    beforeEach(() => {});
    it('LoadRivaahGHSDiscounts should set the isLoading to true', () => {
      const payload: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT'
      };
      const action = new actions.LoadRivaahGHSDiscounts(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.rivaahGHSDiscounts).toBe(null);
      expect(result.error).toBe(null);
    });
    it('LoadRivaahGHSDiscountsSuccess should return list of data', () => {
      const payload: DiscountTransactionLevelResponse[] = [
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
      const resPayload = {
        clubDiscountDetails: [],
        discountDetails: payload
      };
      const action = new actions.LoadRivaahGHSDiscountsSuccess(resPayload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.rivaahGHSDiscounts).toBe(resPayload);
    });
    it('LoadRivaahGHSDiscountsFailure should return error', () => {
      const action = new actions.LoadRivaahGHSDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing SaveRivaahGHSDiscounts ', () => {
    beforeEach(() => {});
    it('SaveRivaahGHSDiscounts should set the isLoading to true', () => {
      const payload: ApplyDiscountRequest = {
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
      const action = new actions.SaveRivaahGHSDiscounts(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.saveRivaahGHSDiscountsResponse).toBe(null);
      expect(result.error).toBe(null);
    });
    it('SaveRivaahGHSDiscountsSuccess should return list of data', () => {
      const payload: string[] = ['RIVAAH_ASHIRWAAD_DISCOUNT'];
      const action = new actions.SaveRivaahGHSDiscountsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.saveRivaahGHSDiscountsResponse).toBe(payload);
    });
    it('SaveRivaahGHSDiscountsFailure should return error', () => {
      const action = new actions.SaveRivaahGHSDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadReasonForChangingDiscounts ', () => {
    beforeEach(() => {});
    it('LoadReasonForChangingDiscounts should set the isLoading to true', () => {
      const payload = 'REASON_FOR_CHANGING_DISCOUNTS';
      const action = new actions.LoadReasonForChangingDiscounts(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadReasonForChangingDiscountsSuccess should return list of data', () => {
      const payload: Lov[] = [
        {
          code: 'GOT_HIGH_VALUE',
          isActive: true,
          value: 'GOT_HIGH_VALUE'
        }
      ];
      const action = new actions.LoadReasonForChangingDiscountsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.reasonForChangingDiscounts).toBe(payload);
    });
    it('LoadReasonForChangingDiscountsFailure should return error', () => {
      const action = new actions.LoadReasonForChangingDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing LoadReasonForNotGivingDiscounts ', () => {
    beforeEach(() => {});
    it('LoadReasonForNotGivingDiscounts should set the isLoading to true', () => {
      const payload = 'REASON_FOR_CHANGING_DISCOUNTS';
      const action = new actions.LoadReasonForNotGivingDiscounts(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadReasonForNotGivingDiscountsSuccess should return list of data', () => {
      const payload: Lov[] = [
        {
          code: 'NOT_INTERESTED',
          isActive: true,
          value: 'NOT_INTERESTED'
        }
      ];
      const action = new actions.LoadReasonForNotGivingDiscountsSuccess(
        payload
      );
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.reasonForNotGivingDiscounts).toBe(payload);
    });
    it('LoadReasonForNotGivingDiscountsFailure should return error', () => {
      const action = new actions.LoadReasonForNotGivingDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing Clear and Set Related Reducers', () => {
    beforeEach(() => {});
    it('Clear should reset the state', () => {
      const action = new actions.Clear();
      const itemLevelDiscountsPayload: DiscountHeaders = {
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
      const autoDiscountsPayload = {
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
      const errorPayload: CustomErrors = {
        error: null,
        code: '',
        message: '',
        traceId: '',
        timeStamp: ''
      };
      testState = {
        ...testState,
        isLoading: true,
        error: errorPayload,
        isABDropdownLoading: true,
        isAutoDiscLoading: true,
        itemLevelDiscounts: itemLevelDiscountsPayload,
        autoDiscountsRes: autoDiscountsPayload
      };

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(null);
      expect(result.isAutoDiscLoading).toBeFalsy();
      expect(result.isABDropdownLoading).toBeFalsy();
      expect(result.itemLevelDiscounts).toBe(null);
      expect(result.autoDiscountsRes.data).toBe(null);
      expect(result.autoDiscountsRes.response).toBe(null);
    });
    it('ClearItemLevelDiscountDetails should reset data', () => {
      const action = new actions.ClearItemLevelDiscountDetails();
      const itemLevelDiscountsDetailsPayload = {
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
      const errorPayload: CustomErrors = {
        error: null,
        code: '',
        message: '',
        traceId: '',
        timeStamp: ''
      };
      testState = {
        ...testState,
        isLoading: true,
        error: errorPayload,
        discountState: '',
        itemLevelDiscountsDetails: itemLevelDiscountsDetailsPayload
      };
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(null);
      expect(result.discountState).toBe(null);
      expect(result.itemLevelDiscountsDetails).toBe(null);
    });
    it('ClearUpdateItemLevelDiscountDetails should reset data', () => {
      const action = new actions.ClearUpdateItemLevelDiscountDetails();
      const errorPayload: CustomErrors = {
        error: null,
        code: '',
        message: '',
        traceId: '',
        timeStamp: ''
      };
      const updateItemLevelDiscountsResPayload: DiscountsResponse = {
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
      testState = {
        ...testState,
        isLoading: true,
        error: errorPayload,
        discountState: '',
        updateItemLevelDiscountsRes: [updateItemLevelDiscountsResPayload]
      };
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(null);
      expect(result.updateItemLevelDiscountsRes.length).toBe(0);
    });
    it('ClearIsEncircleAdded should reset data', () => {
      const action = new actions.ClearIsEncircleAdded();
      const errorPayload: CustomErrors = {
        error: null,
        code: '',
        message: '',
        traceId: '',
        timeStamp: ''
      };
      testState = {
        ...testState,
        isLoading: true,
        error: errorPayload,
        isEncircleDiscDetails: ''
      };
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(null);
      expect(result.isEncircleDiscDetails).toBe(null);
    });
    it('ClearEncircle should reset data', () => {
      const action = new actions.ClearEncircle();
      const errorPayload: CustomErrors = {
        error: null,
        code: '',
        message: '',
        traceId: '',
        timeStamp: ''
      };
      testState = {
        ...testState,
        isLoading: true,
        error: errorPayload,
        isClearEncircle: false
      };
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(null);
      expect(result.isClearEncircle).toBeTruthy();
    });
    it('SetDiscountState should reset data', () => {
      const payload = '';
      const action = new actions.SetDiscountState(payload);
      testState = {
        ...testState,
        discountState: null
      };
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.discountState).toBe(payload);
    });
    it('SetIsEncircleDetails should reset data', () => {
      const payload = '';
      const errorPayload: CustomErrors = {
        error: null,
        code: '',
        message: '',
        traceId: '',
        timeStamp: ''
      };
      const action = new actions.SetIsEncircleDetails(payload);
      testState = {
        ...testState,
        isEncircleDiscDetails: null,
        isLoading: true,
        error: errorPayload
      };
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isEncircleDiscDetails).toBe(payload);
      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(null);
    });
    it('RealodDiscountsGrid should reset data', () => {
      const payload = true;
      const action = new actions.RealodDiscountsGrid(payload);
      testState = {
        ...testState,
        reloadDiscounts: false,
        isLoading: true
      };
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.reloadDiscounts).toBeTruthy();
      expect(result.isLoading).toBeFalsy();
    });
    it('SetOrderDiscDetails should reset data', () => {
      const payload: AdvanceBookingDetailsResponse = {
        activationDetails: {},
        cancellationDetails: {},
        confirmedTime: moment(),
        customerId: 1,
        discountDetails: 0,
        docDate: moment(),
        docNo: 1,
        employeeCode: '',
        finalValue: 123,
        firstHoldTime: moment(),
        fiscalYear: 2015,
        focDetails: {},
        id: '',
        isBestRate: true,
        isFrozenRate: true,
        lastHoldTime: moment(),
        metalRateList: {},
        minValue: 1,
        occasion: '',
        txnType: '',
        otherChargesList: {},
        paidValue: 1,
        refTxnId: '',
        refTxnType: '',
        remarks: '',
        roundingVariance: 1,
        status: StatusTypesEnum.APPROVED,
        subTxnType: '',
        taxDetails: {
          taxes: [
            {
              taxType: 'ITEMCHARGES',
              taxClass: 'TC72',
              data: {
                SGST: { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 437.42 },
                CGST: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 437.42 }
              },
              cess: {}
            }
          ]
        },
        totalDiscount: 1,
        totalQuantity: 1,
        totalTax: 1,
        totalValue: 1,
        totalWeight: 1,
        txnTime: moment(),
        customerDocDetails: null,
        refSubTxnType: 'NEW_AB',
        hallmarkCharges: 120,
        hallmarkDiscount: 0,
        isFrozenAmount: 0,
        cancelTxnId: 2,
        isRivaah: false,
        refDocNo: 1,
        refFiscalYear: 2022,
        cancelRemarks: '',
        minPaymentDetails: {}
      };
      const action = new actions.SetOrderDiscDetails(payload);
      testState = {
        ...testState,
        orderDiscountDetails: null,
        isLoading: true
      };
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.orderDiscountDetails).toBe(payload);
      expect(result.isLoading).toBeFalsy();
    });
    it('ClearOrderDiscDetails should reset data', () => {
      const payload: AdvanceBookingDetailsResponse = {
        activationDetails: {},
        cancellationDetails: {},
        confirmedTime: moment(),
        customerId: 1,
        discountDetails: 0,
        docDate: moment(),
        docNo: 1,
        employeeCode: '',
        finalValue: 123,
        firstHoldTime: moment(),
        fiscalYear: 2015,
        focDetails: {},
        id: '',
        isBestRate: true,
        isFrozenRate: true,
        lastHoldTime: moment(),
        metalRateList: {},
        minValue: 1,
        occasion: '',
        txnType: '',
        otherChargesList: {},
        paidValue: 1,
        refTxnId: '',
        refTxnType: '',
        remarks: '',
        roundingVariance: 1,
        status: StatusTypesEnum.APPROVED,
        subTxnType: '',
        taxDetails: {
          taxes: [
            {
              taxType: 'ITEMCHARGES',
              taxClass: 'TC72',
              data: {
                SGST: { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 437.42 },
                CGST: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 437.42 }
              },
              cess: {}
            }
          ]
        },
        totalDiscount: 1,
        totalQuantity: 1,
        totalTax: 1,
        totalValue: 1,
        totalWeight: 1,
        txnTime: moment(),
        customerDocDetails: null,
        refSubTxnType: 'NEW_AB',
        hallmarkCharges: 120,
        hallmarkDiscount: 0,
        isFrozenAmount: 0,
        cancelTxnId: 2,
        isRivaah: false,
        refDocNo: 1,
        refFiscalYear: 2022,
        cancelRemarks: '',
        minPaymentDetails: {}
      };
      const action = new actions.ClearOrderDiscDetails();
      testState = {
        ...testState,
        orderDiscountDetails: payload,
        isLoading: true
      };
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.orderDiscountDetails).toBe(null);
      expect(result.isLoading).toBeFalsy();
    });
    it('SetEnableCalculateRivaahGHSDiscounts should reset data', () => {
      const payload = true;
      const action = new actions.SetEnableCalculateRivaahGHSDiscounts(payload);
      testState = {
        ...testState,
        enableCalculateRivaahGHSDiscounts: false
      };
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.enableCalculateRivaahGHSDiscounts).toBeTruthy();
    });
    it('SetIsRsoSelected should reset data', () => {
      const payload = true;
      const action = new actions.SetIsRsoSelected(payload);
      testState = {
        ...testState,
        isRsoSelected: false
      };
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isRsoSelected).toBeTruthy();
    });
  });
  describe('Testing LoadDigiGoldDiscounts ', () => {
    beforeEach(() => {});
    it('LoadDigiGoldDiscounts should set the isLoading to true', () => {
      const payload: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'DIGI_GOLD_DISCOUNT'
      };
      const action = new actions.LoadDigiGoldDiscounts(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.digiDiscounts).toBe(null);
      expect(result.error).toBe(null);
    });
    it('LoadDigiGoldDiscountsSuccess should return list of data', () => {
      const payload: DiscountTransactionLevelResponse[] = [
        {
          discountCode: 'e-GHS Spl Discount',
          discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
          discountType: 'DIGI_GOLD_DISCOUNT',
          discountValue: null,
          discountValueDetails: null,
          isEdited: null,
          itemDetails: null,
          basicCriteriaDetails: null
        }
      ];
      const action = new actions.LoadDigiGoldDiscountsSuccess(payload);
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.digiDiscounts).toBe(payload[0]);
    });
    it('LoadDigiGoldDiscountsFailure should return error', () => {
      const action = new actions.LoadDigiGoldDiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing RemoveDigiDiscount ', () => {
    beforeEach(() => {});
    it('RemoveDigiDiscount should set the isLoading to true', () => {
      const payload: RemoveAppliedTransactionLevelDiscountByIDPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'DIGI_GOLD_DISCOUNT',
        discountId: '1111111111111'
      };
      const action = new actions.RemoveDigiDiscount(payload);

      const result: DiscountState = DiscountReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.error).toBe(null);
    });
    it('RemoveDigiDiscountSuccess should return list of data', () => {
      const payload: boolean = true;
      const deletedDiscount: RemoveAppliedTransactionLevelDiscountByIDPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'DIGI_GOLD_DISCOUNT',
        discountId: '1111111111111'
      };
      const action = new actions.RemoveDigiDiscountSuccess(
        payload,
        deletedDiscount
      );
      const result: DiscountState = DiscountReducer(initialState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.currentDeleteDiscount).toBe(deletedDiscount);
    });
    it('RemoveDigiDiscountFailure should return error', () => {
      const action = new actions.RemoveDigiDiscountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DiscountState = DiscountReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.error.message).toEqual('some error');
    });
  });
});
