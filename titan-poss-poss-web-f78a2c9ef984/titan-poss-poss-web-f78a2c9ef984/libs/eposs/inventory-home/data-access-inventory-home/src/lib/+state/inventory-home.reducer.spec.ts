import {
  CustomErrors,
  LoadIssueSTNCountsPayload,
  LoadReceiveInvoicePayload,
  LoadSTNCountPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { initialState, inventoryHomeReducer } from './inventory-home.reducer';
import * as actions from './inventory-home.actions';
import { InventoryHomeState } from './inventory-home.state';

describe('Inventory Home Reducer Testing Suite', () => {
  let testState = initialState;

  describe('Actions should update state properly', () => {
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

    it('should return the initial state', () => {
      const action: any = {};
      const state: InventoryHomeState = inventoryHomeReducer(undefined, action);
      expect(state).toBe(testState);
    });

    it('LoadSTNCount action', () => {
      testState = {
        ...testState,
        isLoadingCount: false
      };

      const action = new actions.LoadSTNCount();
      const result: InventoryHomeState = inventoryHomeReducer(
        testState,
        action
      );
      expect(result.isLoadingCount).toBeTruthy();
    });

    it('LoadSTNCountSuccess action', () => {
      testState = {
        ...testState,
        isLoadingCount: true,
        pendingFactorySTNCount: STNCountResponse.pendingFactorySTNCount,
        pendingBoutiqueSTNCount: STNCountResponse.pendingBoutiqueSTNCount,
        pendingMerchandiseSTNcount: STNCountResponse.pendingMerchandiseSTNcount
      };
      const action = new actions.LoadSTNCountSuccess(STNCountResponse);
      const result: InventoryHomeState = inventoryHomeReducer(
        testState,
        action
      );
      expect(result.isLoadingCount).toBeFalsy();
      expect(result.pendingFactorySTNCount).toBe(
        STNCountResponse.pendingFactorySTNCount
      );
      expect(result.pendingFactorySTNCount).toBe(
        STNCountResponse.pendingFactorySTNCount
      );
      expect(result.pendingFactorySTNCount).toBe(
        STNCountResponse.pendingFactorySTNCount
      );
    });

    it('LoadSTNCountFailure action', () => {
      testState = {
        ...testState,
        isLoadingCount: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadSTNCountFailure(payload);

      const result: InventoryHomeState = inventoryHomeReducer(
        testState,
        action
      );

      expect(result.isLoadingCount).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LoadInvoiceCount action', () => {
      testState = {
        ...testState,
        isLoadingCount: false
      };

      const action = new actions.LoadInvoiceCount();
      const result: InventoryHomeState = inventoryHomeReducer(
        testState,
        action
      );
      expect(result.isLoadingCount).toBeTruthy();
    });

    it('LoadInvoiceCountSuccess action', () => {
      testState = {
        ...testState,
        isLoadingCount: true,
        pendingCFASTNCount: receiveInvoiceResponse.pendingCFASTNCount
      };
      const action = new actions.LoadInvoiceCountSuccess(
        receiveInvoiceResponse
      );
      const result: InventoryHomeState = inventoryHomeReducer(
        testState,
        action
      );
      expect(result.isLoadingCount).toBeFalsy();
      expect(result.pendingCFASTNCount).toBe(
        receiveInvoiceResponse.pendingCFASTNCount
      );
    });

    it('LoadInvoiceCountFailure action', () => {
      testState = {
        ...testState,
        isLoadingCount: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadInvoiceCountFailure(payload);

      const result: InventoryHomeState = inventoryHomeReducer(
        testState,
        action
      );

      expect(result.isLoadingCount).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LoadIssueSTNCount action', () => {
      testState = {
        ...testState,
        isLoadingIssueCount: false
      };

      const action = new actions.LoadIssueSTNCount();
      const result: InventoryHomeState = inventoryHomeReducer(
        testState,
        action
      );
      expect(result.isLoadingIssueCount).toBeTruthy();
    });

    it('LoadIssueSTNCountSuccess action', () => {
      testState = {
        ...testState,
        isLoadingIssueCount: true,
        pendingBTQ_BTQ_STNCount:
          issueCountResponse.pendingIssueBTQ_BTQ_STNCount,
        pendingBTQ_FAC_STNCount:
          issueCountResponse.pendingIssueBTQ_FAC_STNCount,
        pendingBTQ_MER_STNCount: issueCountResponse.pendingIssueBTQ_MER_STNCount
      };
      const action = new actions.LoadIssueSTNCountSuccess(issueCountResponse);
      const result: InventoryHomeState = inventoryHomeReducer(
        testState,
        action
      );
      expect(result.isLoadingIssueCount).toBeFalsy();
      expect(result.pendingBTQ_BTQ_STNCount).toBe(
        issueCountResponse.pendingIssueBTQ_BTQ_STNCount
      );
      expect(result.pendingBTQ_BTQ_STNCount).toBe(
        issueCountResponse.pendingIssueBTQ_BTQ_STNCount
      );
      expect(result.pendingBTQ_MER_STNCount).toBe(
        issueCountResponse.pendingIssueBTQ_MER_STNCount
      );
    });

    it('LoadIssueSTNCountFailure action', () => {
      testState = {
        ...testState,
        isLoadingIssueCount: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadIssueSTNCountFailure(payload);

      const result: InventoryHomeState = inventoryHomeReducer(
        testState,
        action
      );

      expect(result.isLoadingIssueCount).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('ResetError', () => {
      const action = new actions.ResetError();
      const newState = {
        ...testState,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };
      const result: InventoryHomeState = inventoryHomeReducer(newState, action);
      expect(result.error).toEqual(null);
    });
  });
});
