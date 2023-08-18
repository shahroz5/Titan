import {
  LoadIssueSTNCountsPayload,
  LoadReceiveInvoicePayload,
  LoadSTNCountPayload
} from '@poss-web/shared/models';
import { initialState } from './inventory-home.reducer';
// you will need to assert that the store is calling the right selector function.
import * as selectors from './inventory-home.selectors';
import { InventoryHomeState } from './inventory-home.state';

describe('Inventory Home related Selectors', () => {
  const STNCountResponse: LoadSTNCountPayload = {
    pendingFactorySTNCount: 10,
    pendingBoutiqueSTNCount: 20,
    pendingMerchandiseSTNcount: 30
  };

  const receiveInvoiceResponse: LoadReceiveInvoicePayload = {
    pendingCFASTNCount: 15
  };

  const issueCountResponse: LoadIssueSTNCountsPayload = {
    pendingIssueBTQ_BTQ_STNCount: 5,
    pendingIssueBTQ_FAC_STNCount: 15,
    pendingIssueBTQ_MER_STNCount: 25
  };

  it('Should return  isLoadingCount status', () => {
    const state: InventoryHomeState = {
      ...initialState,
      isLoadingCount: false
    };
    expect(
      selectors.inventoryHomeSelectors.selectIsLoadingCount.projector(state)
    ).toEqual(false);
  });

  it('Should return  isLoadingIssueCount status', () => {
    const state: InventoryHomeState = {
      ...initialState,
      isLoadingIssueCount: false
    };
    expect(
      selectors.inventoryHomeSelectors.selectIsLoadingIssueCount.projector(
        state
      )
    ).toEqual(false);
  });

  it('Should return error', () => {
    const state: InventoryHomeState = {
      ...initialState,
      error: null
    };
    expect(
      selectors.inventoryHomeSelectors.selectError.projector(state)
    ).toEqual(null);
  });

  it('Should return pendingFactorySTNCount', () => {
    const state: InventoryHomeState = {
      ...initialState,
      pendingFactorySTNCount: STNCountResponse.pendingFactorySTNCount
    };
    expect(
      selectors.inventoryHomeSelectors.selectPendingFactorySTNCount.projector(
        state
      )
    ).toEqual(STNCountResponse.pendingFactorySTNCount);
  });

  it('Should return pendingBoutiqueSTNCount', () => {
    const state: InventoryHomeState = {
      ...initialState,
      pendingBoutiqueSTNCount: STNCountResponse.pendingBoutiqueSTNCount
    };
    expect(
      selectors.inventoryHomeSelectors.selectPendingBoutiqueSTNCount.projector(
        state
      )
    ).toEqual(STNCountResponse.pendingBoutiqueSTNCount);
  });

  it('Should return pendingMerchandiseSTNcount', () => {
    const state: InventoryHomeState = {
      ...initialState,
      pendingMerchandiseSTNcount: STNCountResponse.pendingMerchandiseSTNcount
    };
    expect(
      selectors.inventoryHomeSelectors.selectPendingMerchandiseSTNcount.projector(
        state
      )
    ).toEqual(STNCountResponse.pendingMerchandiseSTNcount);
  });

  it('Should return pendingCFASTNCount', () => {
    const state: InventoryHomeState = {
      ...initialState,
      pendingCFASTNCount: receiveInvoiceResponse.pendingCFASTNCount
    };
    expect(
      selectors.inventoryHomeSelectors.selectPendingCFASTNCount.projector(state)
    ).toEqual(receiveInvoiceResponse.pendingCFASTNCount);
  });

  it('Should return pendingBTQ_FAC_STNCount', () => {
    const state: InventoryHomeState = {
      ...initialState,
      pendingBTQ_FAC_STNCount: issueCountResponse.pendingIssueBTQ_FAC_STNCount
    };
    expect(
      selectors.inventoryHomeSelectors.selectPendingBTQ_FAC_STNCount.projector(
        state
      )
    ).toEqual(issueCountResponse.pendingIssueBTQ_FAC_STNCount);
  });

  it('Should return pendingBTQ_BTQ_STNCount', () => {
    const state: InventoryHomeState = {
      ...initialState,
      pendingBTQ_BTQ_STNCount: issueCountResponse.pendingIssueBTQ_BTQ_STNCount
    };
    expect(
      selectors.inventoryHomeSelectors.selectPendingBTQ_BTQ_STNCount.projector(
        state
      )
    ).toEqual(issueCountResponse.pendingIssueBTQ_BTQ_STNCount);
  });

  it('Should return pendingBTQ_MER_STNCount', () => {
    const state: InventoryHomeState = {
      ...initialState,
      pendingBTQ_MER_STNCount: issueCountResponse.pendingIssueBTQ_MER_STNCount
    };
    expect(
      selectors.inventoryHomeSelectors.selectPendingBTQ_MER_STNCount.projector(
        state
      )
    ).toEqual(issueCountResponse.pendingIssueBTQ_MER_STNCount);
  });
});
