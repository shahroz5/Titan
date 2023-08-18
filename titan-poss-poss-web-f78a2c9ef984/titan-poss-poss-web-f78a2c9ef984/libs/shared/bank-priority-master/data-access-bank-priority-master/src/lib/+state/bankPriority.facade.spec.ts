import { SaveBankPriorityFormDetailsPayload } from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { BankPriorityState } from './bankPriority.state';
import { BankPriorityFacade } from './bankPriority.facade';
import {
  LoadBankPriority,
  SaveBankPriority,
  ResetBankPriorityDialog
} from './bankPriority.action';

describe(' Bank Priority  facade Testing Suite', () => {
  const initialState: BankPriorityState = {
    error: null,
    bankPriorityListing: [],
    isLoading: false,
    hasUpdated: null
  };

  let bankPriorityFacade: BankPriorityFacade;
  let store: MockStore<BankPriorityFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), BankPriorityFacade]
    });
    store = TestBed.inject<any>(Store);
    bankPriorityFacade = TestBed.inject<any>(BankPriorityFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_BANK_PRIORITY_LISTING action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadBankPriority();
      bankPriorityFacade.loadBankPriorityDetailsListing();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_BANK_PRIORITY action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveBankPriorityFormDetailsPayload = {
        addPriority: [{ bankName: 'HDFC', priority: '2', locationCode: '' }],
        removePriority: []
      };
      const action = new SaveBankPriority(payload);
      bankPriorityFacade.saveBankPriorityFormDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call RESET_BANK_PRIORITY_DIALOG_DATA action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetBankPriorityDialog();
      bankPriorityFacade.resetBankPriorityDialogData();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getBankPriorityDetailsListing selector action', () => {
      expect(bankPriorityFacade.getBankPriorityDetailsListing()).toEqual(
        bankPriorityFacade['bankPriorityListing$']
      );
    });

    it('should access the getisLoading selector action', () => {
      expect(bankPriorityFacade.getisLoading()).toEqual(
        bankPriorityFacade['isLoading$']
      );
    });

    it('should access the getHasUpdated selector action', () => {
      expect(bankPriorityFacade.getHasUpdated()).toEqual(
        bankPriorityFacade['hasUpdated$']
      );
    });

    it('should access the getError selector action', () => {
      expect(bankPriorityFacade.getError()).toEqual(
        bankPriorityFacade['hasError$']
      );
    });
  });
});
