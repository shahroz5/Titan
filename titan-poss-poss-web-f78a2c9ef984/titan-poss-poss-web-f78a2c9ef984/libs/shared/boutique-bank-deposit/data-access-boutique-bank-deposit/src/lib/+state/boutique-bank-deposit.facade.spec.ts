import { BoutiqueBankDepositFacade } from './boutique-bank-deposit.facade';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from './boutique-bank-deposit.reducer';
import { Store } from '@ngrx/store';
import {
  LoadBankDepositDetails,
  LoadPendingDates,
  SaveBankDepositDetails,
  SaveCashDenomition
} from './boutique-bank-deposit.actions';
import { CashDenomition } from '@poss-web/shared/models';
describe('Boutique Bank Deposit Testing Suite', () => {
  let boutiqueBankDepositFacade: BoutiqueBankDepositFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), BoutiqueBankDepositFacade]
    });
    boutiqueBankDepositFacade = TestBed.inject(BoutiqueBankDepositFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions', () => {
    it('should call LOAD_BANK_DEPOSIT_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: any = ['CC', 'DD'];
      const action = new LoadBankDepositDetails(payload);
      boutiqueBankDepositFacade.loadBankDepostDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_BANK_DEPOSIT_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
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
      boutiqueBankDepositFacade.saveBankBoutiqueDepositDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_CASH_DENOMITION', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: CashDenomition = {
        bankDepositIds: ['123'],
        denominationDetails: {
          data: {},
          type: 'string'
        }
      };
      const action = new SaveCashDenomition(payload);
      boutiqueBankDepositFacade.saveCashDenomition(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PENDING_DATES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadPendingDates();
      boutiqueBankDepositFacade.loadPendingDates();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Selector', () => {
    it('should access the get boutique bank details', () => {
      expect(boutiqueBankDepositFacade.getBankDepositDetails()).toEqual(
        boutiqueBankDepositFacade['bankDepositDetails$']
      );
    });
    it('should access the get error', () => {
      expect(boutiqueBankDepositFacade.getError()).toEqual(
        boutiqueBankDepositFacade['error$']
      );
    });
    it('should access the get isloading', () => {
      expect(boutiqueBankDepositFacade.getIsLoading()).toEqual(
        boutiqueBankDepositFacade['isLoading$']
      );
    });
    it('should access the get hassaved', () => {
      expect(boutiqueBankDepositFacade.getHasSaved()).toEqual(
        boutiqueBankDepositFacade['hasSaved$']
      );
    });
    it('should access the get depositAmount', () => {
      expect(boutiqueBankDepositFacade.getDepositedAmount()).toEqual(
        boutiqueBankDepositFacade['depositAmount$']
      );
    });
    it('should access the get saveResponse', () => {
      expect(boutiqueBankDepositFacade.getSaveResponse()).toEqual(
        boutiqueBankDepositFacade['saveResponse$']
      );
    });

    it('should access the get cashDenomitionSaved', () => {
      expect(boutiqueBankDepositFacade.getHasDenomitionSaved()).toEqual(
        boutiqueBankDepositFacade['hasDenomitionSaved$']
      );
    });

    it('should access the get pendingDates', () => {
      expect(boutiqueBankDepositFacade.getPendingDates()).toEqual(
        boutiqueBankDepositFacade['pendingDates$']
      );
    });
  });
});
