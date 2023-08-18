import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  LoadBankPriorityListingSuccessPayload,
  SaveBankPriorityFormDetailsPayload
} from '@poss-web/shared/models';
import {
  BankPriorityActionTypes,
  LoadBankPrioritySuccess,
  LoadBankPriorityFailure,
  SaveBankPriority,
  SaveBankPrioritySuccess,
  SaveBankPriorityFailure,
  ResetBankPriorityDialog,
  LoadBankPriority
} from './bankPriority.action';

describe('Bank Priority Action Testing Suite', () => {
  describe('LoadBankPriority Action Test Cases', () => {
    it('should check correct type is used for  LoadBankPriority action ', () => {
      const action = new LoadBankPriority();
      expect({ ...action }).toEqual({
        type: BankPriorityActionTypes.LOAD_BANK_PRIORITY_LISTING
      });
    });
    it('should check correct type is used for  LoadBankPrioritySuccess action ', () => {
      const payload: LoadBankPriorityListingSuccessPayload = {
        bankPriorityListing: [
          {
            bankName: 'HDFC',
            priority: '1'
          }
        ],
        totalElements: 1
      };
      const action = new LoadBankPrioritySuccess(payload);

      expect({ ...action }).toEqual({
        type: BankPriorityActionTypes.LOAD_BANK_PRIORITY_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadBankPriorityFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBankPriorityFailure(payload);

      expect({ ...action }).toEqual({
        type: BankPriorityActionTypes.LOAD_BANK_PRIORITY_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SaveBankPriority Action Test Cases', () => {
    it('should check correct type is used for  SaveBankPriority action ', () => {
      const payload: SaveBankPriorityFormDetailsPayload = {
        addPriority: [{ bankName: 'HDFC', priority: '2', locationCode: '' }],
        removePriority: []
      };
      const action = new SaveBankPriority(payload);
      expect({ ...action }).toEqual({
        type: BankPriorityActionTypes.SAVE_BANK_PRIORITY,
        payload
      });
    });
    it('should check correct type is used for SaveBankPrioritySuccess action ', () => {
      const action = new SaveBankPrioritySuccess();

      expect({ ...action }).toEqual({
        type: BankPriorityActionTypes.SAVE_BANK_PRIORITY_SUCCESS
      });
    });
    it('should check correct type is used for  SaveBankPriorityFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveBankPriorityFailure(payload);

      expect({ ...action }).toEqual({
        type: BankPriorityActionTypes.SAVE_BANK_PRIORITY_FAILURE,
        payload
      });
    });
  });

  describe('ResetBankPriorityDialog Action Test Cases', () => {
    it('should check correct type is used for  ResetBankPriorityDialog action ', () => {
      const action = new ResetBankPriorityDialog();
      expect({ ...action }).toEqual({
        type: BankPriorityActionTypes.RESET_BANK_PRIORITY_DIALOG_DATA
      });
    });
  });
});
