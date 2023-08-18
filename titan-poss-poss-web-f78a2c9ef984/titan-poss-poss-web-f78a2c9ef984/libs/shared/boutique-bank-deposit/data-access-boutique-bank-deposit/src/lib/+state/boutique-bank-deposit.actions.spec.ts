import {
  BankDepositDetails,
  CashDenomition,
  CustomErrors
} from '@poss-web/shared/models';
import {
  BoutiqueBankDepositActionTypes,
  LoadBankDepositDetails,
  LoadBankDepositDetailsFailure,
  LoadBankDepositDetailsSuccess,
  LoadPendingDates,
  LoadPendingDatesFailure,
  LoadPendingDatesSuccess,
  ResetBoutiqueBankDepositDetails,
  SaveBankDepositDetails,
  SaveBankDepositDetailsFailure,
  SaveBankDepositDetailsSuccess,
  SaveCashDenomition,
  SaveCashDenomitionFailure,
  SaveCashDenomitionSuccess
} from './boutique-bank-deposit.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
describe('Boutique Bank Deposit Actions Testing Suite', () => {
  describe('LoadBankDepositDetails Actions Testing Suite', () => {
    it('should check correct type is used for  LoadBankDepositDetails action ', () => {
      const payload: string[] = ['CC', 'DD'];
      const action = new LoadBankDepositDetails(payload);

      expect(action.type).toEqual(
        BoutiqueBankDepositActionTypes.LOAD_BANK_DEPOSIT_DETAILS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadBankDepositDetailsSuccess action ', () => {
      const boutiqueBankDepositDetails: BankDepositDetails[] = [
        {
          collectionDate: '2020-10-09',
          paymentCode: 'CASH',
          locationCode: 'URB',
          payerBankName: 'AXIS',
          payeeBankName: ['AXIS', 'ICICI'],
          instrumentDate: '2020-10-09',
          depositDate: '2020-10-09',
          businessDate: '2020-10-09',
          instrumentNo: 12,
          amount: 12222,
          openingBalance: 12222,
          depositAmount: 12222,
          pifNo: 12222,
          midCode: 1222,
          depositDetails: {},
          isGhsIncluded: true,
          depositSlipNo: 123,
          password: 'Welcome@123',
          approvalDetails: {},
          isBankingCompleted: true,
          id: 'abc',
          depositedSlipDate: '2020-10-19'
        }
      ];
      const action = new LoadBankDepositDetailsSuccess(
        boutiqueBankDepositDetails
      );

      expect(action.type).toEqual(
        BoutiqueBankDepositActionTypes.LOAD_BANK_DEPOSIT_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(boutiqueBankDepositDetails);
    });
    it('should check correct type is used for  LoadCourierDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBankDepositDetailsFailure(payload);

      expect(action.type).toEqual(
        BoutiqueBankDepositActionTypes.LOAD_BANK_DEPOSIT_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SaveBankDepositDetails Actions Testing Suite', () => {
    it('should check correct type is used for  SaveBankDepositDetails action ', () => {
      const payload: any = {
        bankDeposit: [
          {
            amount: 0,
            approvalDetails: {
              data: {},
              type: 'Approve'
            },
            bankName: 'Axis',
            businessDate: '2020-10-16T16:28:13.029Z',
            collectionDate: '2020-10-16T16:28:13.029Z',
            depositAmount: 0,
            depositDate: '2020-10-16T16:28:13.029Z',
            depositDetails: {
              data: {},
              type: 'string'
            },
            id: 'ABC'
          }
        ]
      };
      const action = new SaveBankDepositDetails(payload);

      expect(action.type).toEqual(
        BoutiqueBankDepositActionTypes.SAVE_BANK_DEPOSIT_DETAILS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  SaveBankDepositDetailsSuccess action ', () => {
      const boutiqueBankDepositDetails: BankDepositDetails[] = [
        {
          collectionDate: '2020-10-09',
          paymentCode: 'CASH',
          locationCode: 'URB',
          payerBankName: 'AXIS',
          payeeBankName: ['AXIS', 'ICICI'],
          instrumentDate: '2020-10-09',
          depositDate: '2020-10-09',
          businessDate: '2020-10-09',
          instrumentNo: 12,
          amount: 12222,
          openingBalance: 12222,
          depositAmount: 12222,
          pifNo: 12222,
          midCode: 1222,
          depositDetails: {},
          isGhsIncluded: true,
          depositSlipNo: 123,
          password: 'Welcome@123',
          approvalDetails: {},
          isBankingCompleted: true,
          id: 'abc',
          depositedSlipDate: '2020-10-19'
        }
      ];
      const action = new SaveBankDepositDetailsSuccess({
        data: boutiqueBankDepositDetails,
        totalDepositAmount: 100
      });

      expect(action.type).toEqual(
        BoutiqueBankDepositActionTypes.SAVE_BANK_DEPOSIT_DETAILS_SUCCESS
      );
      //expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  SaveBankDepositDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveBankDepositDetailsFailure(payload);

      expect(action.type).toEqual(
        BoutiqueBankDepositActionTypes.SAVE_BANK_DEPOSIT_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ResetBoutiqueBankDepositDetails Actions Testing Suite', () => {
    it('should check correct type is used for  ResetBoutiqueBankDepositDetails action ', () => {
      const action = new ResetBoutiqueBankDepositDetails();
      expect(action.type).toEqual(
        BoutiqueBankDepositActionTypes.RESET_BOUTIQUE_BANK_DETAILS
      );
    });
  });

  describe('SaveCashDenomition Actions Testing Suite', () => {
    it('should check correct type is used for SaveCashDenomition action ', () => {
      const payload: CashDenomition = {
        bankDepositIds: ['123'],
        denominationDetails: {
          data: {},
          type: 'string'
        }
      };
      const action = new SaveCashDenomition(payload);
      expect(action.type).toEqual(
        BoutiqueBankDepositActionTypes.SAVE_CASH_DENOMITION
      );
    });

    it('should check correct type is used for SaveCashDenomitionSuccess action ', () => {
      const action = new SaveCashDenomitionSuccess();
      expect(action.type).toEqual(
        BoutiqueBankDepositActionTypes.SAVE_CASH_DENOMITION_SUCCESS
      );
    });

    it('should check correct type is used for SaveCashDenomitionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCashDenomitionFailure(payload);
      expect(action.type).toEqual(
        BoutiqueBankDepositActionTypes.SAVE_CASH_DENOMITION_FAILURE
      );
    });
  });

  describe('LoadPendingDates Actions Testing Suite', () => {
    it('should check correct type is used for LoadPendingDates action ', () => {
      const action = new LoadPendingDates();
      expect(action.type).toEqual(
        BoutiqueBankDepositActionTypes.LOAD_PENDING_DATES
      );
    });

    it('should check correct type is used for LoadPendingDatesSuccess action ', () => {
      const action = new LoadPendingDatesSuccess(['123']);
      expect(action.type).toEqual(
        BoutiqueBankDepositActionTypes.LOAD_PENDING_DATES_SUCCESS
      );
    });

    it('should check correct type is used for LoadPendingDatesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPendingDatesFailure(payload);
      expect(action.type).toEqual(
        BoutiqueBankDepositActionTypes.LOAD_PENDING_DATES_FAILURE
      );
    });
  });
});
