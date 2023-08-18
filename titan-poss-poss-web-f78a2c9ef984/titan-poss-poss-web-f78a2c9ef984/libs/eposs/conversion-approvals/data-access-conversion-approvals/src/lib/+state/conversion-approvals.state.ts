import {
  ConversionRequestItems,
  CustomErrors,
  SelectedRequestDetailsResponse
} from '@poss-web/shared/models';
import { ConverionApprovalsRequestEntity } from './conversion-approvals.entity';

export const conversionApprovalsFeatureKey = 'conversionApprovals';

export class ConversionApprovalsState {
  errors?: CustomErrors;
  isLoading: boolean;
  approvalRequestsList: ConverionApprovalsRequestEntity;
  approvalRequestsLength: number;
  selectedRequest: SelectedRequestDetailsResponse;
  selectedRequestData: ConversionRequestItems[];
  itemIds: string[];
  studdedProductGroups: string[];
  updateStatusResponse: SelectedRequestDetailsResponse;
  isLoadingImage: boolean;
}
