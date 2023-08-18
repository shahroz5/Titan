import { CustomErrors, UploadResponse } from '@poss-web/shared/models';
import { RazorpayAccessMappingEntity } from './razorpay-access-mapping.entity';

export interface RazorpayConfigurationState {
  fileUploadResponse: UploadResponse;
  accessList: RazorpayAccessMappingEntity;
  totalCount: number;
  updatedAccessList: string;
  hasError?: CustomErrors;
  isLoading?: boolean;
  errorLog: any;
}
