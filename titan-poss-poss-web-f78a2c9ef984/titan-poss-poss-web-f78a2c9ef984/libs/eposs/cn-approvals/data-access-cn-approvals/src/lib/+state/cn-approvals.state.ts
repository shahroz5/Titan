import { CustomErrors } from '@poss-web/shared/models';
import { CnRequestListEntity } from './cn-approvals.entity';

export interface CnApprovalState {
  cnApprovalsList: CnRequestListEntity;
  error: CustomErrors;
  isLoading: boolean;
  hasUpdated: boolean;
}
