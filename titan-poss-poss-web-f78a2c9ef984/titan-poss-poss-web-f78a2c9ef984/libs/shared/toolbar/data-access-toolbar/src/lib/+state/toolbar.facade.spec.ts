import { initialState } from './toolbar.reducer';

import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { ToolbarFacade } from './toolbar.facade';
import { provideMockStore } from '@ngrx/store/testing';
import { ToolbarState } from './toolbar.state';
import {
  TransactionListCountPayload,
  ToolbarConfig,
  TransactionListPayload
} from '@poss-web/shared/models';
import {
  LoadMetalPriceDetails,
  LoadOnHold,
  LoadOnHoldCount,
  LoadOpenOrders,
  LoadOpenOrdersCount,
  ResetOnHold,
  ResetOpenOrders,
  ResetValues,
  SetToolbarConfig
} from './toolbar.actions';

describe('Toolbar facade Testing Suite action', () => {
  let toolbarFacade: ToolbarFacade;

  let store: Store<ToolbarState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ToolbarFacade]
    });

    toolbarFacade = TestBed.inject(ToolbarFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions', () => {
    const dummyTransactionListPayload: TransactionListPayload = {
      pageIndex: 0,
      pageSize: 10,
      searchValue: 'Test1',
      status: 'OPEN',
      txnType: 'CM',
      subTxnType: 'NEW_CM'
    };

    const dummyTransactionListCountPayload: TransactionListCountPayload = {
      status: 'HOLD',
      txnType: 'CM',
      subTxnType: 'NEW_CM'
    };

    const dummyToolbarConfig: ToolbarConfig = {
      loadMetalPrices: true,
      loadHoldPopup: true,
      loadOpenOrdersPopup: true
    };

    it('should call LoadMetalPriceDetails action', () => {
      const action = new LoadMetalPriceDetails();
      toolbarFacade.loadMetalPriceDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadOpenOrders action', () => {
      const action = new LoadOpenOrders(dummyTransactionListPayload);
      toolbarFacade.loadOpenOrders(dummyTransactionListPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadOpenOrdersCount action', () => {
      const action = new LoadOpenOrdersCount(dummyTransactionListCountPayload);
      toolbarFacade.loadOpenOrdersCount(dummyTransactionListCountPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadOnHold action', () => {
      const action = new LoadOnHold(dummyTransactionListPayload);
      toolbarFacade.loadOnHold(dummyTransactionListPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadOnHoldCount action', () => {
      const action = new LoadOnHoldCount(dummyTransactionListCountPayload);
      toolbarFacade.loadOnHoldCount(dummyTransactionListCountPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetValues action', () => {
      const action = new ResetValues();
      toolbarFacade.resetValues();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetOnHold action', () => {
      const action = new ResetOnHold();
      toolbarFacade.resetOnHold();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetOpenOrders action', () => {
      const action = new ResetOpenOrders();
      toolbarFacade.resetOpenOrders();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetToolbarConfig action', () => {
      const action = new SetToolbarConfig(dummyToolbarConfig);
      toolbarFacade.setToolbarConfig(dummyToolbarConfig);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector', () => {
    it('should access selectMetalPriceDetails selector', () => {
      expect(toolbarFacade.getMetalPriceDetails()).toEqual(
        toolbarFacade['metalPriceDetails$']
      );
    });

    it('should access selectPreviousMetalPriceDetails selector', () => {
      expect(toolbarFacade.getPreviousMetalPriceDetails()).toEqual(
        toolbarFacade['previousMetalPriceDetails$']
      );
    });

    it('should access Error selector', () => {
      expect(toolbarFacade.getHasError()).toEqual(toolbarFacade['hasError$']);
    });

    it('should access isLoading selector', () => {
      expect(toolbarFacade.getIsLoading()).toEqual(toolbarFacade['isLoading$']);
    });

    it('should access selectOpenOrdersResponse selector', () => {
      expect(toolbarFacade.getOpenOrdersResponse()).toEqual(
        toolbarFacade['openOrdersResponse$']
      );
    });

    it('should access selectOpenOrdersCountResponse selector', () => {
      expect(toolbarFacade.getOpenOrdersCount()).toEqual(
        toolbarFacade['openOrdersCountResponse$']
      );
    });

    it('should access selectOnHoldResponse selector', () => {
      expect(toolbarFacade.getOnHoldResponse()).toEqual(
        toolbarFacade['onHoldResponse$']
      );
    });

    it('should access selectOnHoldCountResponse selector', () => {
      expect(toolbarFacade.getOnHoldCount()).toEqual(
        toolbarFacade['onHoldCountResponse$']
      );
    });

    it('should access selectToolbarConfig selector', () => {
      expect(toolbarFacade.getToolbarConfig()).toEqual(
        toolbarFacade['toolbarConfig$']
      );
    });
  });
});
