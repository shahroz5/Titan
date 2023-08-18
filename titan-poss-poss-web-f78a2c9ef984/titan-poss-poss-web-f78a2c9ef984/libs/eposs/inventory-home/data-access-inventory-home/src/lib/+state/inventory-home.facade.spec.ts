import { initialState } from './inventory-home.reducer';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { InventoryHomeFacade } from './inventory-home.facade';
import { provideMockStore } from '@ngrx/store/testing';
import { InventoryHomeState } from './inventory-home.state';
import {
  LoadInvoiceCount,
  LoadIssueSTNCount,
  LoadSTNCount,
  ResetError
} from './inventory-home.actions';
import { of } from 'rxjs';

describe('Inventory Home Facade Testing Suite action', () => {
  let inventoryHomeFacade: InventoryHomeFacade;

  let store: Store<InventoryHomeState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), InventoryHomeFacade]
    });

    inventoryHomeFacade = TestBed.inject(InventoryHomeFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions', () => {
    it('should call LoadSTNCount action', () => {
      const action = new LoadSTNCount();
      inventoryHomeFacade.loadStockTransferNoteCount();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadInvoiceCount action', () => {
      const action = new LoadInvoiceCount();
      inventoryHomeFacade.loadReceiveInvoiceCount();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadIssueSTNCount action', () => {
      const action = new LoadIssueSTNCount();
      inventoryHomeFacade.LoadIssueSTNCount();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetError action', () => {
      const action = new ResetError();
      inventoryHomeFacade.resetError();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector', () => {
    it('should access selectError selector', () => {
      expect(inventoryHomeFacade.getError()).toEqual(
        inventoryHomeFacade['error$']
      );
    });

    it('should access selectIsLoadingCount selector', () => {
      expect(inventoryHomeFacade.getIsLoadingCount()).toEqual(
        inventoryHomeFacade['isLoadingCount$']
      );
    });

    it('should access selectIsLoadingIssueCount selector', () => {
      expect(inventoryHomeFacade.getIsIssueLoadingCount()).toEqual(
        inventoryHomeFacade['isLoadingIssueCount$']
      );
    });

    it('should access selectPendingFactorySTNCount selector', () => {
      expect(inventoryHomeFacade.getPendingFactorySTNCount()).toEqual(
        inventoryHomeFacade['pendingFactorySTNCount$']
      );
    });

    it('should access selectPendingBoutiqueSTNCount selector', () => {
      expect(inventoryHomeFacade.getPendingBoutiqueSTNCount()).toEqual(
        inventoryHomeFacade['pendingBoutiqueSTNCount$']
      );
    });

    it('should access selectPendingMerchandiseSTNcount selector', () => {
      expect(inventoryHomeFacade.getPendingMerchandiseSTNcount()).toEqual(
        inventoryHomeFacade['pendingMerchandiseSTNcount$']
      );
    });

    it('should access selectPendingCFASTNCount selector', () => {
      expect(inventoryHomeFacade.getPendingCFASTNCount()).toEqual(
        inventoryHomeFacade['pendingCFASTNCount$']
      );
    });

    it('should access selectPendingBTQ_BTQ_STNCount selector', () => {
      expect(inventoryHomeFacade.getPendingBTQ_BTQ_STNCount()).toEqual(
        inventoryHomeFacade['pendingBTQ_BTQ_STNCount$']
      );
    });

    it('should access selectPendingBTQ_MER_STNCount selector', () => {
      expect(inventoryHomeFacade.getPendingBTQ_MER_STNCount()).toEqual(
        inventoryHomeFacade['pendingBTQ_MER_STNCount$']
      );
    });

    it('should access selectPendingBTQ_FAC_STNCount selector', () => {
      expect(inventoryHomeFacade.getPendingBTQ_FAC_STNCount()).toEqual(
        inventoryHomeFacade['pendingBTQ_FAC_STNCount$']
      );
    });
  });

  describe('Other Methods', () => {
    it('should return PendingSTNCount', () => {
      expect(inventoryHomeFacade.getPendingSTNCount()).toBeTruthy();
    });

    it('should return ReceiveInvoiceCount', () => {
      expect(inventoryHomeFacade.getReceiveInvoiceCount()).toBeTruthy();
    });

    it('should return PendingIssueSTNCount', () => {
      expect(inventoryHomeFacade.getPendingIssueSTNCount()).toBeTruthy();
    });
  });
});
