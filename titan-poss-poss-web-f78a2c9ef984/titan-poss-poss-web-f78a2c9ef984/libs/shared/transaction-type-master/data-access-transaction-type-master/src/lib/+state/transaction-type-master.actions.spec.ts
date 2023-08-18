import {
  CustomErrors,
  LoadTransactionTypeMasterListingPayload,
  LoadTransactionTypeMasterListingSuccessPayload,
  TransactionTypeMasterDetails
} from '@poss-web/shared/models';
import {
  EditTransactionTypeMasterFormDetails,
  EditTransactionTypeMasterFormDetailsFailure,
  EditTransactionTypeMasterFormDetailsSuccess,
  LoadTransactionTypeMasterByCode,
  LoadTransactionTypeMasterByCodeFailure,
  LoadTransactionTypeMasterByCodeSuccess,
  LoadTransactionTypeMasterListingFailure,
  LoadTransactionTypeMasterListingSuccess,
  SaveTransactionTypeMasterFormDetails,
  SaveTransactionTypeMasterFormDetailsFailure,
  SaveTransactionTypeMasterFormDetailsSuccess,
  SearchTransactionTypeMasterCode,
  SearchTransactionTypeMasterCodeFailure,
  SearchTransactionTypeMasterCodeSuccess,
  TransactionTypeMasterActionTypes
} from './transaction-type-master.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoadTransactionTypeMasterListing } from './transaction-type-master.actions';

describe('Transaction Type Master Action Testing Suite', () => {
  describe('LoadTransactionTypeMasterListing Action Test Cases', () => {
    it('should check correct type is used for LoadTransactionTypeMasterListing action', () => {
      const payload: LoadTransactionTypeMasterListingPayload = {
        pageIndex: 1,
        pageSize: 8
      };
      const action = new LoadTransactionTypeMasterListing(payload);
      expect({ ...action }).toEqual({
        type: TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadTransactionTypeMasterListingSuccess action', () => {
      const payload: LoadTransactionTypeMasterListingSuccessPayload = {
        transactionTypeMasterListing: [],
        totalElements: 8
      };

      const action = new LoadTransactionTypeMasterListingSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTransactionTypeMasterListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTransactionTypeMasterListingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('LoadTransactionTypeMasterByCode Action Test Cases', () => {
    it('should check correct type is used for LoadTransactionTypeMasterByCode action', () => {
      const payload = '1';
      const action = new LoadTransactionTypeMasterByCode(payload);
      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_DETAILS_BY_CODE,
        payload
      });
    });

    it('should check correct type is used for LoadTransactionTypeMasterByCodeSuccess action', () => {
      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new LoadTransactionTypeMasterByCodeSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_DETAILS_BY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTransactionTypeMasterByCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTransactionTypeMasterByCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.TRANSACTION_TYPE_MASTER_DETAILS_BY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('SaveTransactionTypeMasterFormDetails Action Test Cases', () => {
    it('should check correct type is used for SaveTransactionTypeMasterFormDetails action', () => {
      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new SaveTransactionTypeMasterFormDetails(payload);
      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.SAVE_TRANSACTION_TYPE_MASTER_FORM_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveTransactionTypeMasterFormDetailsSuccess action', () => {
      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new SaveTransactionTypeMasterFormDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.SAVE_TRANSACTION_TYPE_MASTER_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveTransactionTypeMasterFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveTransactionTypeMasterFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.SAVE_TRANSACTION_TYPE_MASTER_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('EditTransactionTypeMasterFormDetails Action Test Cases', () => {
    it('should check correct type is used for EditTransactionTypeMasterFormDetails action', () => {
      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new EditTransactionTypeMasterFormDetails(payload);
      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.EDIT_TRANSACTION_TYPE_MASTER_FORM_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveTransactionTypeMasterFormDetailsSuccess action', () => {
      const payload: TransactionTypeMasterDetails = {
        code: 'Code',
        isActive: true,
        value: 'Value'
      };

      const action = new EditTransactionTypeMasterFormDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.EDIT_TRANSACTION_TYPE_MASTER_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for EditTransactionTypeMasterFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditTransactionTypeMasterFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.EDIT_TRANSACTION_TYPE_MASTER_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SearchTransactionTypeMasterCode Action Test Cases', () => {
    it('should check correct type is used for SearchTransactionTypeMasterCode action', () => {
      const payload = 'src';

      const action = new SearchTransactionTypeMasterCode(payload);
      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.SEARCH_TRANSACTION_TYPE_MASTER_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveTransactionTypeMasterFormDetailsSuccess action', () => {
      const payload: LoadTransactionTypeMasterListingSuccessPayload = {
        transactionTypeMasterListing: [],
        totalElements: 8
      };

      const action = new SearchTransactionTypeMasterCodeSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.SEARCH_TRANSACTION_TYPE_MASTER_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchTransactionTypeMasterCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchTransactionTypeMasterCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TransactionTypeMasterActionTypes.SEARCH_TRANSACTION_TYPE_MASTER_DETAILS_FAILURE,
        payload
      });
    });
  });
});
