import {
  CnRefundAmountDetails,
  CreditNoteDetails,
  CreditNoteSearch,
  CreditNoteSearchResult,
  CustomErrors,
  SentRequestResponse,
  TransferToEghs
} from '@poss-web/shared/models';
import { SentRequestEntity, TransferedCNEntity } from './cn.entity';
export interface CreditNoteState {
  error: CustomErrors;
  isLoading: boolean;
  creditNoteSearchResult: CreditNoteSearchResult[];
  creditNoteDetails: CreditNoteDetails;
  requestNo: string;
  search: CreditNoteSearch;
  sentRequests: SentRequestEntity;
  searchRequests: SentRequestEntity;
  count: number;
  hasSearched: boolean;
  request: SentRequestResponse;
  cnNumber: number;
  requestType: string;
  transferToEghs: TransferToEghs;
  transferedCNs: TransferedCNEntity;
  downloadCN: boolean;
  totalCount: number;
  hasCancelled: boolean;
  totalElements: number;
  transferedCN: CreditNoteSearchResult[];
  refundAmountDetails: CnRefundAmountDetails;
}
