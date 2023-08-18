import {
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
  Clear,
  ClearEncircle,
  ClearIsEncircleAdded,
  ClearItemLevelDiscountDetails,
  ClearOrderDiscDetails,
  ClearTransactionLevelDiscountDetails,
  ClearUpdateItemLevelDiscountDetails,
  ConfirmAppliedTransactionLevelDiscount,
  ConfirmAppliedTransactionLevelDiscountFailure,
  ConfirmAppliedTransactionLevelDiscountSuccess,
  DeleteItemLevelDiscounts,
  DeleteItemLevelDiscountsFailure,
  DeleteItemLevelDiscountsSuccess,
  DiscountActionTypes,
  GetItemLevelDiscounts,
  GetItemLevelDiscountsFailure,
  GetItemLevelDiscountsSuccess,
  GetOrderDiscDetails,
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
  LoadDiscountVoucherDetails,
  LoadDiscountVoucherDetailsFailure,
  LoadDiscountVoucherDetailsSuccess,
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
  RealodDiscountsGrid,
  RefreshDiscountsAndOffersPanel,
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
  SetDiscountState,
  SetEnableCalculateRivaahGHSDiscounts,
  SetIsEncircleDetails,
  SetIsRsoSelected,
  SetOrderDiscDetails,
  UpdateAppliedTransactionLevelDiscount,
  UpdateAppliedTransactionLevelDiscountFailure,
  UpdateAppliedTransactionLevelDiscountSuccess,
  UpdateItemLevelDiscounts,
  UpdateItemLevelDiscountsFailure,
  UpdateItemLevelDiscountsSuccess
} from './discount.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';

describe('Discount  Action Testing Suite', () => {
  describe('LoadTransactionLevelDiscounts Action Test Cases', () => {
    it('should check correct type is used for  LoadTransactionLevelDiscounts action ', () => {
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'BILL_LEVEL_DISCOUNT'
      };

      const action = new LoadTransactionLevelDiscounts(paylaod);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_TRANSACTION_LEVEL_DISCOUNTS,
        paylaod
      });
    });
    it('should check correct type is used for  LoadTransactionLevelDiscountsSuccess action ', () => {
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

      const action = new LoadTransactionLevelDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadTransactionLevelDiscountsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTransactionLevelDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_TRANSACTION_LEVEL_DISCOUNTS_FAILURE,
        payload
      });
    });
  });
  describe('LoadAvailableEmployeeDiscounts Action Test Cases', () => {
    it('should check correct type is used for  LoadAvailableEmployeeDiscounts action ', () => {
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'EMPLOYEE_DISCOUNT',
        itemDetails: [],
        employeeDetails: { couponDetails: [{ couponCode: '1234567' }] }
      };

      const action = new LoadAvailableEmployeeDiscounts(paylaod);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AVAILABLE_EMPLOYEE_DISCOUNTS,
        paylaod
      });
    });
    it('should check correct type is used for  LoadAvailableEmployeeDiscountsSuccess action ', () => {
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

      const action = new LoadAvailableEmployeeDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AVAILABLE_EMPLOYEE_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadAvailableEmployeeDiscountsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAvailableEmployeeDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AVAILABLE_EMPLOYEE_DISCOUNTS_FAILURE,
        payload
      });
    });
  });
  describe('LoadAvailableTSSSDiscounts Action Test Cases', () => {
    it('should check correct type is used for  LoadAvailableTSSSDiscounts action ', () => {
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'TSSS_DISCOUNT',
        itemDetails: [],
        tsssDetails: { couponDetails: [{ couponCode: '1234567' }] }
      };

      const action = new LoadAvailableTSSSDiscounts(paylaod);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AVAILABLE_TSSS_DISCOUNTS,
        paylaod
      });
    });
    it('should check correct type is used for  LoadAvailableTSSSDiscountsSuccess action ', () => {
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

      const action = new LoadAvailableTSSSDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AVAILABLE_TSSS_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadAvailableTSSSDiscountsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAvailableTSSSDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AVAILABLE_TSSS_DISCOUNTS_FAILURE,
        payload
      });
    });
  });
  describe('LoadAvailableTataEmployeeDiscounts Action Test Cases', () => {
    it('should check correct type is used for  LoadAvailableTataEmployeeDiscounts action ', () => {
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

      const action = new LoadAvailableTataEmployeeDiscounts(paylaod);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AVAILABLE_TATA_EMPLOYEE_DISCOUNTS,
        paylaod
      });
    });
    it('should check correct type is used for  LoadAvailableTataEmployeeDiscountsSuccess action ', () => {
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

      const action = new LoadAvailableTataEmployeeDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.LOAD_AVAILABLE_TATA_EMPLOYEE_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadAvailableTataEmployeeDiscountsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAvailableTataEmployeeDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.LOAD_AVAILABLE_TATA_EMPLOYEE_DISCOUNTS_FAILURE,
        payload
      });
    });
  });
  describe('LoadAvailableSystemDvDiscounts Action Test Cases', () => {
    it('should check correct type is used for  LoadAvailableSystemDvDiscounts action ', () => {
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'SYSTEM_DISCOUNT_DV',
        itemDetails: []
      };

      const action = new LoadAvailableSystemDvDiscounts(paylaod);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AVAILABLE_SYSTEM_DV_DISCOUNTS,
        paylaod
      });
    });
    it('should check correct type is used for  LoadAvailableSystemDvDiscountsSuccess action ', () => {
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

      const action = new LoadAvailableSystemDvDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AVAILABLE_SYSTEM_DV_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadAvailableSystemDvDiscountsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAvailableSystemDvDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AVAILABLE_SYSTEM_DV_DISCOUNTS_FAILURE,
        payload
      });
    });
  });
  describe('LoadAvailableEmpowementDiscounts Action Test Cases', () => {
    it('should check correct type is used for  LoadAvailableEmpowementDiscounts action ', () => {
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'EMPOWERMENT_DISCOUNT',
        itemDetails: [],
        empowermentDetails: { applyEmpowermentDiscount: true }
      };

      const action = new LoadAvailableEmpowementDiscounts(paylaod);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AVAILABLE_EMPOWERMENT_DISCOUNT,
        paylaod
      });
    });
    it('should check correct type is used for  LoadAvailableEmpowementDiscountsSuccess action ', () => {
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

      const action = new LoadAvailableEmpowementDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AVAILABLE_EMPOWERMENT_DISCOUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadAvailableSystemDvDiscountsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAvailableEmpowementDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AVAILABLE_EMPOWERMENT_DISCOUNT_FAILURE,
        payload
      });
    });
  });
  describe('ApplyDiscountAtTransactionLevel Action Test Cases', () => {
    it('should check correct type is used for  ApplyDiscountAtTransactionLevel action ', () => {
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

      const action = new ApplyDiscountAtTransactionLevel(paylaod);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.APPLY_DISCOUNT_AT_TRANSACTION_LEVEL,
        paylaod
      });
    });
    it('should check correct type is used for  ApplyDiscountAtTransactionLevelSucces action ', () => {
      const payload = true;

      const action = new ApplyDiscountAtTransactionLevelSucces(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.APPLY_DISCOUNT_AT_TRANSACTION_LEVEL_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  ApplyDiscountAtTransactionLevelFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ApplyDiscountAtTransactionLevelFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.APPLY_DISCOUNT_AT_TRANSACTION_LEVEL_FAILURE,
        payload
      });
    });
  });
  describe('LoadAppliedTransactionLevelDiscounts Action Test Cases', () => {
    it('should check correct type is used for  LoadAppliedTransactionLevelDiscounts action ', () => {
      const paylaod: LoadAppliedTransactionDiscountsRequest = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM'
      };

      const action = new LoadAppliedTransactionLevelDiscounts(paylaod);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_APPLIED_TRANSACTION_LEVEL_DISCOUNTS,
        paylaod
      });
    });
    it('should check correct type is used for  LoadAppliedTransactionLevelDiscountsSuccess action ', () => {
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

      const action = new LoadAppliedTransactionLevelDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.LOAD_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadAppliedTransactionLevelDiscountsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAppliedTransactionLevelDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.LOAD_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE,
        payload
      });
    });
  });
  describe('RemoveAllAppliedTransactionLevelDiscounts Action Test Cases', () => {
    it('should check correct type is used for  RemoveAllAppliedTransactionLevelDiscounts action ', () => {
      const payload: RemoveAllAppliedTransactionLevelDiscountsPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'BILL_LEVEL_DISCOUNT'
      };

      const action = new RemoveAllAppliedTransactionLevelDiscounts(payload);
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.REMOVE_ALL_APPLIED_TRANSACTION_LEVEL_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for RemoveAllAppliedTransactionLevelDiscountsSuccess action ', () => {
      const payload = { isDeleted: true, discountType: 'BILL_LEVEL_DISCOUNT' };

      const action = new RemoveAllAppliedTransactionLevelDiscountsSuccess(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.REMOVE_ALL_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  RemoveAllAppliedTransactionLevelDiscountsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RemoveAllAppliedTransactionLevelDiscountsFailure(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.REMOVE_ALL_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE,
        payload
      });
    });
  });
  describe('RemoveAppliedTransactionLevelDiscountByID Action Test Cases', () => {
    it('should check correct type is used for  RemoveAppliedTransactionLevelDiscountByID action ', () => {
      const paylaod: RemoveAppliedTransactionLevelDiscountByIDPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'BILL_LEVEL_DISCOUNT',
        discountId: '1111111111111'
      };

      const action = new RemoveAppliedTransactionLevelDiscountByID(paylaod);
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.REMOVE_APPLIED_TRANSACTION_LEVEL_DISCOUNT_BY_ID,
        paylaod
      });
    });
    it('should check correct type is used for RemoveAppliedTransactionLevelDiscountByIDSuccess action ', () => {
      const payload = true;

      const action = new RemoveAppliedTransactionLevelDiscountByIDSuccess(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.REMOVE_APPLIED_TRANSACTION_LEVEL_DISCOUNT_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  RemoveAppliedTransactionLevelDiscountByIDFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RemoveAppliedTransactionLevelDiscountByIDFailure(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.REMOVE_APPLIED_TRANSACTION_LEVEL_DISCOUNT_BY_ID_FAILURE,
        payload
      });
    });
  });
  describe('UpdateAppliedTransactionLevelDiscount Action Test Cases', () => {
    it('should check correct type is used for  UpdateAppliedTransactionLevelDiscount action ', () => {
      const paylaod: UpdateTransactionLevelDiscountByIDPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'BILL_LEVEL_DISCOUNT',
        isPriceUpdate: false
      };

      const action = new UpdateAppliedTransactionLevelDiscount(paylaod);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.UPDATE_APPLIED_TRANSACTION_LEVEL_DISCOUNTS,
        paylaod
      });
    });
    it('should check correct type is used for UpdateAppliedTransactionLevelDiscountSuccess action ', () => {
      const payload = true;

      const action = new UpdateAppliedTransactionLevelDiscountSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.UPDATE_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateAppliedTransactionLevelDiscountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateAppliedTransactionLevelDiscountFailure(payload);
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.UPDATE_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE,
        payload
      });
    });
  });
  describe('ConfirmAppliedTransactionLevelDiscount Action Test Cases', () => {
    it('should check correct type is used for  ConfirmAppliedTransactionLevelDiscount action ', () => {
      const paylaod: ConfirmTransactionLevelDiscountPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'BILL_LEVEL_DISCOUNT',
        discountTxnId: ['111111111111111']
      };

      const action = new ConfirmAppliedTransactionLevelDiscount(paylaod);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.CONFIRM_APPLIED_TRANSACTION_LEVEL_DISCOUNTS,
        paylaod
      });
    });
    it('should check correct type is used for ConfirmAppliedTransactionLevelDiscountSuccess action ', () => {
      const payload = true;

      const action = new ConfirmAppliedTransactionLevelDiscountSuccess(
        payload,
        null
      );
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.CONFIRM_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS,
        payload,
        confirmedDiscounts: null
      });
    });
    it('should check correct type is used for  UpdateAppliedTransactionLevelDiscountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmAppliedTransactionLevelDiscountFailure(payload);
      expect({ ...action }).toEqual({
        type:
          DiscountActionTypes.CONFIRM_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE,
        payload
      });
    });
  });
  describe('LoadTataCompanyNameList Action Test Cases', () => {
    it('should check correct type is used for  LoadTataCompanyNameList action ', () => {
      const payload = 'TATA_COMPANY';

      const action = new LoadTataCompanyNameList(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_TATA_COMPANY_NAME_LIST,
        payload
      });
    });
    it('should check correct type is used for LoadTataCompanyNameListSuccess action ', () => {
      const payload: Lov[] = [{ code: 'TCS', isActive: true, value: 'TCS' }];

      const action = new LoadTataCompanyNameListSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_TATA_COMPANY_NAME_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadTataCompanyNameListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTataCompanyNameListFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_TATA_COMPANY_NAME_LIST_FAILURE,
        payload
      });
    });
  });
  describe('ClearTransactionLevelDiscountDetails Action Test Cases', () => {
    it('should check correct type is used for  ClearTransactionLevelDiscountDetails action ', () => {
      const action = new ClearTransactionLevelDiscountDetails();
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.CLEAR_TRANSACTION_LEVEL_DISCOUNT_DETAILS
      });
    });
  });
  describe('LoadDiscountVoucherDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadDiscountVoucherDetails action ', () => {
      const payload: DiscountVoucherDetailsRequestPayload = {
        accountNo: 12345,
        vendorCode: 'DV',
        voucherCode: 9876543
      };

      const action = new LoadDiscountVoucherDetails(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_DISCOUNT_VOUCHER_DETAILS,
        payload
      });
    });
    it('should check correct type is used for LoadDiscountVoucherDetailsSuccess action ', () => {
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

      const action = new LoadDiscountVoucherDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_DISCOUNT_VOUCHER_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountVoucherDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDiscountVoucherDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_DISCOUNT_VOUCHER_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('SetIsRsoSelected Action Test Cases', () => {
    it('should check correct type is used for  ClearTransactionLevelDiscountDetails action ', () => {
      const payload = true;
      const action = new SetIsRsoSelected(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.SET_IS_RSO_SELECETED,
        payload
      });
    });
  });

  describe('RefreshDiscountsAndOffersPanel Action Test Cases', () => {
    it('should check correct type is used for  ClearTransactionLevelDiscountDetails action ', () => {
      const payload = true;
      const action = new RefreshDiscountsAndOffersPanel(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.REFRESH_DISCOUNT_AND_OFFERS_PANEL,
        payload
      });
    });
  });

  // Item Level Discounts
  describe('LoadItemLevelDiscounts  Action Test Cases', () => {
    it('should check correct type is used for  LoadItemLevelDiscounts  action ', () => {
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
      const action = new LoadItemLevelDiscounts(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for  LoadItemLevelDiscountsSuccess  action ', () => {
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
      const action = new LoadItemLevelDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadItemLevelDiscountsFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemLevelDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('LoadItemLevelDiscountsDetails   Action Test Cases', () => {
    it('should check correct type is used for  LoadItemLevelDiscountsDetails  action ', () => {
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
      const action = new LoadItemLevelDiscountsDetails(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadItemLevelDiscountsDetailsSuccess   action ', () => {
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
      const action = new LoadItemLevelDiscountsDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadItemLevelDiscountsDetailsFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemLevelDiscountsDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('GetItemLevelDiscounts    Action Test Cases', () => {
    it('should check correct type is used for  GetItemLevelDiscounts    action ', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const action = new GetItemLevelDiscounts(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.GET_ITEM_LEVEL_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for  GetItemLevelDiscountsSuccess   action ', () => {
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
      const action = new GetItemLevelDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.GET_ITEM_LEVEL_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  GetItemLevelDiscountsFailure   action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetItemLevelDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.GET_ITEM_LEVEL_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('SaveItemLevelDiscounts     Action Test Cases', () => {
    it('should check correct type is used for  SaveItemLevelDiscounts     action ', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const reqPayload = {
        request: payload,
        data: null
      };
      const action = new SaveItemLevelDiscounts(reqPayload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.SAVE_ITEM_LEVEL_DISCOUNTS,
        payload: reqPayload
      });
    });
    it('should check correct type is used for  SaveItemLevelDiscountsSuccess    action ', () => {
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
      const action = new SaveItemLevelDiscountsSuccess(resPayload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.SAVE_ITEM_LEVEL_DISCOUNTS_SUCCESS,
        payload: resPayload
      });
    });
    it('should check correct type is used for  SaveItemLevelDiscountsFailure    action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveItemLevelDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.SAVE_ITEM_LEVEL_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateItemLevelDiscounts      Action Test Cases', () => {
    it('should check correct type is used for  UpdateItemLevelDiscounts      action ', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const action = new UpdateItemLevelDiscounts(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.UPDATE_ITEM_LEVEL_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for  UpdateItemLevelDiscountsSuccess     action ', () => {
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
      const action = new UpdateItemLevelDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.UPDATE_ITEM_LEVEL_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateItemLevelDiscountsFailure     action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateItemLevelDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.UPDATE_ITEM_LEVEL_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('DeleteItemLevelDiscounts      Action Test Cases', () => {
    it('should check correct type is used for  DeleteItemLevelDiscounts      action ', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const reqPayload = {
        request: payload,
        data: null
      };
      const action = new DeleteItemLevelDiscounts(reqPayload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.DELETE_ITEM_LEVEL_DISCOUNTS,
        payload: reqPayload
      });
    });
    it('should check correct type is used for  DeleteItemLevelDiscountsSuccess     action ', () => {
      const payload = {
        response: true,
        data: null
      };
      const action = new DeleteItemLevelDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.DELETE_ITEM_LEVEL_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  DeleteItemLevelDiscountsFailure     action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DeleteItemLevelDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.DELETE_ITEM_LEVEL_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('Clear and Set Action Test Cases', () => {
    it('should check correct type is used for  Clear       action ', () => {
      const action = new Clear();
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.CLEAR
      });
    });

    it('should check correct type is used for  ClearItemLevelDiscountDetails        action ', () => {
      const action = new ClearItemLevelDiscountDetails();
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.CLEAR_ITEM_LEVEL_DISCOUNT_DETAILS
      });
    });

    it('should check correct type is used for  ClearUpdateItemLevelDiscountDetails         action ', () => {
      const action = new ClearUpdateItemLevelDiscountDetails();
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.CLEAR_UPDATE_ITEM_LEVEL_DISCOUNT_DETAILS
      });
    });

    it('should check correct type is used for  SetDiscountState          action ', () => {
      const payload = '';
      const action = new SetDiscountState(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.SET_DISCOUNT_STATE,
        payload
      });
    });

    it('should check correct type is used for  SetIsEncircleDetails          action ', () => {
      const payload = '';
      const action = new SetIsEncircleDetails(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.SET_ISENCIRCLE_DETAILS,
        payload
      });
    });

    it('should check correct type is used for  ClearIsEncircleAdded         action ', () => {
      const action = new ClearIsEncircleAdded();
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.CLEAR_ISENCIRCLE_ADDED
      });
    });

    it('should check correct type is used for  ClearEncircle         action ', () => {
      const action = new ClearEncircle();
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.CLEAR_ENCIRCLE
      });
    });

    it('should check correct type is used for  RealodDiscountsGrid action ', () => {
      const payload = true;
      const action = new RealodDiscountsGrid(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.RELOAD_GRID_ON_DISCOUNT_APPLY_DELETE,
        payload
      });
    });

    it('should check correct type is used for  SetOrderDiscDetails action ', () => {
      const payload = null;
      const action = new SetOrderDiscDetails(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.SET_ORDER_DISCOUNT_DETAILS,
        payload
      });
    });

    it('should check correct type is used for  GetOrderDiscDetails action ', () => {
      const payload = null;
      const action = new GetOrderDiscDetails(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.GET_ORDER_DISCOUNT_DETAILS,
        payload
      });
    });

    it('should check correct type is used for  ClearOrderDiscDetails action ', () => {
      const action = new ClearOrderDiscDetails();
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.CLEAR_ORDER_DISCOUNT_DETAILS
      });
    });

    it('should check correct type is used for  SetEnableCalculateRivaahGHSDiscounts action ', () => {
      const payload = true;
      const action = new SetEnableCalculateRivaahGHSDiscounts(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.SET_ENABLE_CALCULATE_RIVAAH_GHS_DISCOUNTS,
        payload
      });
    });
  });

  describe('LoadPcDesc   Action Test Cases', () => {
    it('should check correct type is used for  LoadPcDesc   action ', () => {
      const action = new LoadPcDesc();
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_PC_DESC
      });
    });
    it('should check correct type is used for  LoadPcDescSuccess   action ', () => {
      const payload = {};
      const action = new LoadPcDescSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_PC_DESC_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPcDescFailure   action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPcDescFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_PC_DESC_FAILURE,
        payload
      });
    });
  });

  describe('LoadPgDesc    Action Test Cases', () => {
    it('should check correct type is used for  LoadPgDesc    action ', () => {
      const action = new LoadPgDesc();
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_PG_DESC
      });
    });
    it('should check correct type is used for  LoadPgDescSuccess    action ', () => {
      const payload = {};
      const action = new LoadPgDescSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_PG_DESC_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPgDescFailure    action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPgDescFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_PG_DESC_FAILURE,
        payload
      });
    });
  });

  describe('LoadDiscountTypes    Action Test Cases', () => {
    it('should check correct type is used for  LoadDiscountTypes    action ', () => {
      const payload = '';
      const action = new LoadDiscountTypes(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_DISCOUNT_TYPES,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountTypesSuccess    action ', () => {
      const payload: Lov[] = [
        {
          code: 'CATEGORY_DISCOUNT',
          isActive: true,
          value: 'CATEGORY_DISCOUNT'
        }
      ];
      const action = new LoadDiscountTypesSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_DISCOUNT_TYPES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadDiscountTypesFailure    action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDiscountTypesFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_DISCOUNT_TYPES_FAILURE,
        payload
      });
    });
  });

  describe('CheckABCOEligibility    Action Test Cases', () => {
    it('should check correct type is used for  CheckABCOEligibility    action ', () => {
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
      const action = new CheckABCOEligibility(reqPayload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.CHECK_AB_CO_ELIGIBILITY,
        payload: reqPayload
      });
    });
    it('should check correct type is used for  CheckABCOEligibilitySuccess    action ', () => {
      const payload = 'no-response';
      const action = new CheckABCOEligibilitySuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.CHECK_AB_CO_ELIGIBILITY_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  CheckABCOEligibilityFailure    action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CheckABCOEligibilityFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.CHECK_AB_CO_ELIGIBILITY_FAILURE,
        payload
      });
    });
  });

  describe('LoadABCODiscounts    Action Test Cases', () => {
    it('should check correct type is used for  LoadABCODiscounts    action ', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const action = new LoadABCODiscounts(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AB_CO_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for  LoadABCODiscountsSuccess    action ', () => {
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
      const action = new LoadABCODiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AB_CO_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadABCODiscountsFailure    action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadABCODiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AB_CO_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('LoadNewABCODiscounts    Action Test Cases', () => {
    it('should check correct type is used for  LoadNewABCODiscounts    action ', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const action = new LoadNewABCODiscounts(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_NEW_AB_CO_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for  LoadNewABCODiscountsSuccess    action ', () => {
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
      const action = new LoadNewABCODiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_NEW_AB_CO_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadNewABCODiscountsFailure    action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadNewABCODiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_NEW_AB_CO_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('LoadABCODiscountDetails    Action Test Cases', () => {
    it('should check correct type is used for  LoadABCODiscountDetails    action ', () => {
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
      const action = new LoadABCODiscountDetails(reqPayload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AB_CO_DISCOUNT_DETAILS,
        payload: reqPayload
      });
    });
    it('should check correct type is used for  LoadABCODiscountDetailsSuccess    action ', () => {
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
      const action = new LoadABCODiscountDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AB_CO_DISCOUNT_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadABCODiscountDetailsFailure    action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadABCODiscountDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AB_CO_DISCOUNT_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadABCOConfigDetails    Action Test Cases', () => {
    it('should check correct type is used for  LoadABCOConfigDetails    action ', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const action = new LoadABCOConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AB_CO_CONFIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadABCOConfigDetailsSuccess    action ', () => {
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
      const action = new LoadABCOConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AB_CO_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadABCOConfigDetailsFailure    action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadABCOConfigDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AB_CO_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadAutoDiscounts    Action Test Cases', () => {
    it('should check correct type is used for  LoadAutoDiscounts    action ', () => {
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
      const action = new LoadAutoDiscounts(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AUTO_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for  LoadAutoDiscountsSuccess    action ', () => {
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
      const action = new LoadAutoDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AUTO_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadAutoDiscountsFailure    action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAutoDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_AUTO_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('LoadRivaahGHSDiscounts    Action Test Cases', () => {
    it('should check correct type is used for  LoadRivaahGHSDiscounts    action ', () => {
      const payload: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT'
      };
      const action = new LoadRivaahGHSDiscounts(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_RIVAAH_GHS_DISCOUNTS,
        paylaod: payload
      });
    });
    it('should check correct type is used for  LoadRivaahGHSDiscountsSuccess    action ', () => {
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
      const action = new LoadRivaahGHSDiscountsSuccess(resPayload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_RIVAAH_GHS_DISCOUNTS_SUCCESS,
        payload: resPayload
      });
    });
    it('should check correct type is used for  LoadRivaahGHSDiscountsFailure    action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRivaahGHSDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_RIVAAH_GHS_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('SaveRivaahGHSDiscounts    Action Test Cases', () => {
    it('should check correct type is used for  SaveRivaahGHSDiscounts    action ', () => {
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
      const action = new SaveRivaahGHSDiscounts(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.SAVE_RIVAAH_GHS_DISCOUNTS,
        paylaod: payload
      });
    });
    it('should check correct type is used for  SaveRivaahGHSDiscountsSuccess    action ', () => {
      const payload: string[] = ['RIVAAH_ASHIRWAAD_DISCOUNT'];
      const action = new SaveRivaahGHSDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.SAVE_RIVAAH_GHS_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveRivaahGHSDiscountsFailure    action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveRivaahGHSDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.SAVE_RIVAAH_GHS_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('LoadReasonForChangingDiscounts    Action Test Cases', () => {
    it('should check correct type is used for  LoadReasonForChangingDiscounts    action ', () => {
      const payload = 'REASON_FOR_CHANGING_DISCOUNTS';
      const action = new LoadReasonForChangingDiscounts(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_REASON_FOR_CHANGING_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for  LoadReasonForChangingDiscountsSuccess    action ', () => {
      const payload: Lov[] = [
        {
          code: 'GOT_HIGH_VALUE',
          isActive: true,
          value: 'GOT_HIGH_VALUE'
        }
      ];
      const action = new LoadReasonForChangingDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_REASON_FOR_CHANGING_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadReasonForChangingDiscountsFailure    action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadReasonForChangingDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_REASON_FOR_CHANGING_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('LoadReasonForNotGivingDiscounts    Action Test Cases', () => {
    it('should check correct type is used for  LoadReasonForNotGivingDiscounts    action ', () => {
      const payload = 'REASON_FOR_NOTGIVING_DISCOUNTS';
      const action = new LoadReasonForNotGivingDiscounts(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_REASON_FOR_NOTGIVING_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for  LoadReasonForNotGivingDiscountsSuccess    action ', () => {
      const payload: Lov[] = [
        {
          code: 'NOT_INTERESTED',
          isActive: true,
          value: 'NOT_INTERESTED'
        }
      ];
      const action = new LoadReasonForNotGivingDiscountsSuccess(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_REASON_FOR_NOTGIVING_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadReasonForNotGivingDiscountsFailure    action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadReasonForNotGivingDiscountsFailure(payload);
      expect({ ...action }).toEqual({
        type: DiscountActionTypes.LOAD_REASON_FOR_NOTGIVING_DISCOUNTS_FAILURE,
        payload
      });
    });
  });
});
