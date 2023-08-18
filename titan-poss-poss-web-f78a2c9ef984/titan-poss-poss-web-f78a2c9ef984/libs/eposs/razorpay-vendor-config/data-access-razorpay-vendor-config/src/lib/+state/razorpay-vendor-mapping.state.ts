import { CustomErrors, UploadResponse } from '@poss-web/shared/models';
import { RazorpayVendorMappingEntity } from './razorpay-vendor-mapping.entity';

export interface RazorpayVendorConfigurationState {
  fileUploadResponse: UploadResponse;
  vendorList: RazorpayVendorMappingEntity;
  totalCount: number;
  updatedVendorList: string;
  hasError?: CustomErrors;
  isLoading?: boolean;
  errorLog: any;
}
