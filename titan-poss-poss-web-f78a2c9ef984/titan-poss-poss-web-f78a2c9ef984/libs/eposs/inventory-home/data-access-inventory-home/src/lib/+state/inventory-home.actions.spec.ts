import {
  CustomErrors,
  LoadIssueSTNCountsPayload,
  LoadReceiveInvoicePayload,
  LoadSTNCountPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  InventoryHomeActionTypes,
  LoadInvoiceCount,
  LoadInvoiceCountFailure,
  LoadInvoiceCountSuccess,
  LoadIssueSTNCount,
  LoadIssueSTNCountFailure,
  LoadIssueSTNCountSuccess,
  ResetError
} from './inventory-home.actions';
import {
  LoadSTNCount,
  LoadSTNCountFailure,
  LoadSTNCountSuccess
} from './inventory-home.actions';

describe('InventoryHome Actions Testing suit', () => {
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

  describe('LoadSTNCount Action Test Cases', () => {
    it('should check correct type is used for  LoadSTNCount action ', () => {
      const action = new LoadSTNCount();

      expect(action.type).toEqual(InventoryHomeActionTypes.LOAD_STN_COUNT);
    });

    it('should check correct type is used for  LoadSTNCountSuccess action ', () => {
      const action = new LoadSTNCountSuccess(STNCountResponse);

      expect(action.type).toEqual(
        InventoryHomeActionTypes.LOAD_STN_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(STNCountResponse);
    });

    it('should check correct type is used for  LoadSTNCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSTNCountFailure(payload);

      expect(action.type).toEqual(
        InventoryHomeActionTypes.LOAD_STN_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadInvoiceCount Action Test Cases', () => {
    it('should check correct type is used for  LoadInvoiceCount action ', () => {
      const action = new LoadInvoiceCount();

      expect(action.type).toEqual(InventoryHomeActionTypes.LOAD_INVOICE_COUNT);
    });

    it('should check correct type is used for  LoadInvoiceCountSuccess action ', () => {
      const action = new LoadInvoiceCountSuccess(receiveInvoiceResponse);

      expect(action.type).toEqual(
        InventoryHomeActionTypes.LOAD_INVOICE_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(receiveInvoiceResponse);
    });

    it('should check correct type is used for  LoadInvoiceCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadInvoiceCountFailure(payload);

      expect(action.type).toEqual(
        InventoryHomeActionTypes.LOAD_INVOICE_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadIssueSTNCount Action Test Cases', () => {
    it('should check correct type is used for  LoadIssueSTNCount action ', () => {
      const action = new LoadIssueSTNCount();

      expect(action.type).toEqual(InventoryHomeActionTypes.LOAD_ISSUES_COUNT);
    });

    it('should check correct type is used for  LoadIssueSTNCountSuccess action ', () => {
      const action = new LoadIssueSTNCountSuccess(issueCountResponse);

      expect(action.type).toEqual(
        InventoryHomeActionTypes.LOAD_ISSUES_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(issueCountResponse);
    });

    it('should check correct type is used for  LoadIssueSTNCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIssueSTNCountFailure(payload);

      expect(action.type).toEqual(
        InventoryHomeActionTypes.LOAD_ISSUES_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for ResetError action ', () => {
      const action = new ResetError();
      expect({ ...action }).toEqual({
        type: InventoryHomeActionTypes.RESET_ERROR
      });
    });
  });
});
