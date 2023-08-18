import { CustomErrors } from '../error.model';

export interface LoadSTNCountPayload {
  pendingFactorySTNCount: number;
  pendingBoutiqueSTNCount: number;
  pendingMerchandiseSTNcount: number;
}

export interface LoadReceiveInvoicePayload {
  pendingCFASTNCount: number;
}

export interface InventoryHomeState {
  pendingFactorySTNCount: number;
  pendingBoutiqueSTNCount: number;
  pendingMerchandiseSTNcount: number;
  pendingCFASTNCount: number;
  isLoadingCount: boolean;

  pendingBTQ_FAC_STNCount: number;
  pendingBTQ_BTQ_STNCount: number;
  pendingBTQ_MER_STNCount: number;
  isLoadingIssueCount: boolean;
  error: CustomErrors;
}
