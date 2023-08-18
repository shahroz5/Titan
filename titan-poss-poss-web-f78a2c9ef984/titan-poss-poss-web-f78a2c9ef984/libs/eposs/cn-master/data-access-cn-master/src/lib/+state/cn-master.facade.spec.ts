import { initialState } from './cn-master.reducer';

import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { CreditNoteMasterFacade } from './cn-master.facade';
import { provideMockStore } from '@ngrx/store/testing';
import { CreditNoteMasterState } from './cn-master.state';
import {
  LoadCreditNoteMasterDetailByCNType,
  LoadCreditNoteMasterList,
  LoadReset,
  SearchCreditNoteMasterList,
  UpdateCreditNoteMasterDetail
} from './cn-master.actions';
import { PaginatePayload } from '@poss-web/shared/models';

describe('Credit Note Master facade Testing Suite action', () => {
  let creditNoteMasterFacade: CreditNoteMasterFacade;

  let store: Store<CreditNoteMasterState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CreditNoteMasterFacade]
    });

    creditNoteMasterFacade = TestBed.inject(CreditNoteMasterFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions', () => {
    it('should call LoadCreditNoteMasterList action', () => {
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const action = new LoadCreditNoteMasterList(payload);
      creditNoteMasterFacade.loadCreditNoteMasterList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadCreditNoteMasterDetailByCNType action', () => {
      const payload = 'GEP';

      const action = new LoadCreditNoteMasterDetailByCNType(payload);
      creditNoteMasterFacade.loadCreditNoterMasterDetailByCnType(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UpdateCreditNoteMasterDetail action', () => {
      const payload = {
        cnType: 'GEP',
        cnDetail: {
          creditNoteType: 'BillCancellation',
          description: 'BillCancellation',
          configDetails: {
            data: {
              IsAllowedForGHSGrammageAccount: true,
              IsAllowedforEghs: true
            }
          },
          isActive: true
        }
      };

      const action = new UpdateCreditNoteMasterDetail(payload);
      creditNoteMasterFacade.updateCreditNoteMasterDetail(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SearchCreditNoteMasterList action', () => {
      const payload = 'GEP';

      const action = new SearchCreditNoteMasterList(payload);
      creditNoteMasterFacade.searchCreditNoteMasterList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadReset action', () => {
      const action = new LoadReset();
      creditNoteMasterFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector', () => {
    it('should access CreditNoteMasterList selector', () => {
      expect(creditNoteMasterFacade.getCreditNoteMasterList()).toEqual(
        creditNoteMasterFacade['creditNoteMasterList$']
      );
    });

    it('should access CreditNoteMasterDetailByCnType selector', () => {
      expect(
        creditNoteMasterFacade.getCreditNoteMasterDetailByCnType()
      ).toEqual(creditNoteMasterFacade['creditNoteMasterDetailByCnTpe$']);
    });

    it('should access Error selector', () => {
      expect(creditNoteMasterFacade.getError()).toEqual(
        creditNoteMasterFacade['error$']
      );
    });

    it('should access isLoading selector', () => {
      expect(creditNoteMasterFacade.getIsloading()).toEqual(
        creditNoteMasterFacade['isLoading$']
      );
    });

    it('should access TotalElements selector', () => {
      expect(creditNoteMasterFacade.getTotalElements()).toEqual(
        creditNoteMasterFacade['totalElements$']
      );
    });

    it('should access HasUpdated selector', () => {
      expect(creditNoteMasterFacade.getHasUpdated()).toEqual(
        creditNoteMasterFacade['hasUpdated$']
      );
    });
  });
});
