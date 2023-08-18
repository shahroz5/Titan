import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import {
  initialState,
  inventoryHomeFeatureKey
} from './inventory-home.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadIssueSTNCountsPayload,
  LoadReceiveInvoicePayload,
  LoadSTNCountPayload,
  NewFileUploadResponse
} from '@poss-web/shared/models';
import { InventoryHomeEffects } from './inventory-home.effect';
import { InventoryHomeService } from '../inventory-home.service';
import {
  LoadInvoiceCount,
  LoadInvoiceCountFailure,
  LoadInvoiceCountSuccess,
  LoadIssueSTNCount,
  LoadIssueSTNCountFailure,
  LoadIssueSTNCountSuccess,
  LoadSTNCount,
  LoadSTNCountFailure,
  LoadSTNCountSuccess
} from './inventory-home.actions';

describe('InventoryHome Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: InventoryHomeEffects;

  const inventoryHomeServiceSpy = jasmine.createSpyObj<InventoryHomeService>([
    'getSTNCount',
    'getReceiveInvoice',
    'getIssueCount'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InventoryHomeEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [inventoryHomeFeatureKey]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: InventoryHomeService,
          useValue: inventoryHomeServiceSpy
        }
      ]
    });

    effect = TestBed.inject(InventoryHomeEffects);
  });

  describe('LoadSTNCount', () => {
    const STNCountResponse: LoadSTNCountPayload = {
      pendingFactorySTNCount: 10,
      pendingBoutiqueSTNCount: 20,
      pendingMerchandiseSTNcount: 30
    };

    it('should return a LoadSTNCount', () => {
      const action = new LoadSTNCount();
      const outcome = new LoadSTNCountSuccess(STNCountResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: STNCountResponse });
      inventoryHomeServiceSpy.getSTNCount.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadStockTransferNoteCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadSTNCount();
      const error = new Error('some error');
      const outcome = new LoadSTNCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      inventoryHomeServiceSpy.getSTNCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStockTransferNoteCount$).toBeObservable(expected);
    });
  });

  describe('LoadInvoiceCount', () => {
    const receiveInvoiceResponse: LoadReceiveInvoicePayload = {
      pendingCFASTNCount: 15
    };

    it('should return a LoadInvoiceCount', () => {
      const action = new LoadInvoiceCount();
      const outcome = new LoadInvoiceCountSuccess(receiveInvoiceResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: receiveInvoiceResponse });
      inventoryHomeServiceSpy.getReceiveInvoice.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadInvoiceCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadInvoiceCount();
      const error = new Error('some error');
      const outcome = new LoadInvoiceCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      inventoryHomeServiceSpy.getReceiveInvoice.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadInvoiceCount$).toBeObservable(expected);
    });
  });

  describe('LoadIssueSTNCount', () => {
    const issueCountResponse: LoadIssueSTNCountsPayload = {
      pendingIssueBTQ_BTQ_STNCount: 5,
      pendingIssueBTQ_FAC_STNCount: 15,
      pendingIssueBTQ_MER_STNCount: 25
    };

    it('should return a LoadIssueSTNCount', () => {
      const action = new LoadIssueSTNCount();
      const outcome = new LoadIssueSTNCountSuccess(issueCountResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: issueCountResponse });
      inventoryHomeServiceSpy.getIssueCount.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.LoadIssueStockTransferNoteCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadIssueSTNCount();
      const error = new Error('some error');
      const outcome = new LoadIssueSTNCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      inventoryHomeServiceSpy.getIssueCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadIssueStockTransferNoteCount$).toBeObservable(expected);
    });
  });
});
