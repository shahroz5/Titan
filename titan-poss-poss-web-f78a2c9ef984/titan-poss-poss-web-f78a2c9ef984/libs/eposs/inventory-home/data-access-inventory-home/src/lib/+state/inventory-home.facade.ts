import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { combineAll, map } from 'rxjs/operators';

import { inventoryHomeSelectors } from './inventory-home.selectors';
import * as InventoryHomeActions from './inventory-home.actions';
import { InventoryHomeState } from '@poss-web/shared/models';

@Injectable()
export class InventoryHomeFacade {
  private pendingFactorySTNCount$ = this.store.select(
    inventoryHomeSelectors.selectPendingFactorySTNCount
  );

  private pendingBoutiqueSTNCount$ = this.store.select(
    inventoryHomeSelectors.selectPendingBoutiqueSTNCount
  );

  private pendingMerchandiseSTNcount$ = this.store.select(
    inventoryHomeSelectors.selectPendingMerchandiseSTNcount
  );
  private pendingCFASTNCount$ = this.store.select(
    inventoryHomeSelectors.selectPendingCFASTNCount
  );

  private isLoadingCount$ = this.store.select(
    inventoryHomeSelectors.selectIsLoadingCount
  );

  private pendingBTQ_FAC_STNCount$ = this.store.select(
    inventoryHomeSelectors.selectPendingBTQ_FAC_STNCount
  );

  private pendingBTQ_BTQ_STNCount$ = this.store.select(
    inventoryHomeSelectors.selectPendingBTQ_BTQ_STNCount
  );
  private pendingBTQ_MER_STNCount$ = this.store.select(
    inventoryHomeSelectors.selectPendingBTQ_MER_STNCount
  );

  private isLoadingIssueCount$ = this.store.select(
    inventoryHomeSelectors.selectIsLoadingIssueCount
  );

  private error$ = this.store.select(inventoryHomeSelectors.selectError);

  constructor(private store: Store<InventoryHomeState>) {}

  loadStockTransferNoteCount() {
    this.store.dispatch(new InventoryHomeActions.LoadSTNCount());
  }

  loadReceiveInvoiceCount() {
    this.store.dispatch(new InventoryHomeActions.LoadInvoiceCount());
  }

  resetError() {
    this.store.dispatch(new InventoryHomeActions.ResetError());
  }

  getPendingFactorySTNCount() {
    return this.pendingFactorySTNCount$;
  }

  getPendingBoutiqueSTNCount() {
    return this.pendingBoutiqueSTNCount$;
  }

  getPendingMerchandiseSTNcount() {
    return this.pendingMerchandiseSTNcount$;
  }

  getPendingCFASTNCount() {
    return this.pendingCFASTNCount$;
  }

  getIsLoadingCount() {
    return this.isLoadingCount$;
  }

  getPendingSTNCount() {
    const source = of(
      this.pendingFactorySTNCount$,
      this.pendingBoutiqueSTNCount$,
      this.pendingMerchandiseSTNcount$
    );
    return source.pipe(
      combineAll(),
      map(numbers => numbers.reduce((sum, n) => sum + n, 0))
    );
  }

  getReceiveInvoiceCount() {
    const source = of(this.pendingCFASTNCount$);
    return source.pipe(
      combineAll(),
      map(numbers => numbers.reduce((sum, n) => sum + n, 0))
    );
  }

  getPendingBTQ_BTQ_STNCount() {
    return this.pendingBTQ_BTQ_STNCount$;
  }
  getPendingBTQ_MER_STNCount() {
    return this.pendingBTQ_MER_STNCount$;
  }
  getPendingBTQ_FAC_STNCount() {
    return this.pendingBTQ_FAC_STNCount$;
  }

  getIsIssueLoadingCount() {
    return this.isLoadingIssueCount$;
  }

  getPendingIssueSTNCount() {
    const source = of(
      this.pendingBTQ_BTQ_STNCount$,
      this.pendingBTQ_FAC_STNCount$,
      this.pendingBTQ_MER_STNCount$
    );
    return source.pipe(
      combineAll(),
      map(numbers => numbers.reduce((sum, n) => sum + n, 0))
    );
  }

  getError() {
    return this.error$;
  }
  LoadIssueSTNCount() {
    this.store.dispatch(new InventoryHomeActions.LoadIssueSTNCount());
  }
}
