import {
  CustomErrors,
  CnTransferSearchResult,
  LocationSummaryList,
  CNDetailsInfo,
  LegacyOutwardTransferResponsePayload,
  LegacyInwardTransferResponsePayload
} from '@poss-web/shared/models';
import { RequestsEnity } from './cn-transfer.entity';
export interface CreditNoteTransferState {
  locationCodes: LocationSummaryList[];
  error: CustomErrors;
  isLoading: boolean;
  creditNoteSearchResult: CnTransferSearchResult[];
  searchCount: number;
  creditNoteDetails: CNDetailsInfo;
  raisedRequestNo: string;
  raisedRequests: RequestsEnity;
  requestsCount: number;
  hasCnUpdateRequestStatus: boolean;
  creditNoteUpdateResponse: CNDetailsInfo;
  isApprovedOrRejected: boolean;
  isTransferRequestCancelled: boolean;
  legacyOutwardTransferResponsePayload: LegacyOutwardTransferResponsePayload;
  legacyInwardTransferResponsePayload: LegacyInwardTransferResponsePayload;
  // requestNo: string;
  // search: CreditNoteSearch;
  // sentRequests: SentRequestResponse[];
  // count: number;
}
