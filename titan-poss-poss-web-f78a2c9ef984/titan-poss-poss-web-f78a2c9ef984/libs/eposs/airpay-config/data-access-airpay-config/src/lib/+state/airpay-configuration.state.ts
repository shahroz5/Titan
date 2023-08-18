import {
  CustomErrors,
  FileUploadResponse,
  AirpayVendorList
} from '@poss-web/shared/models';

export interface AirpayConfigurationState {
  fileUploadResponse: FileUploadResponse;
  vendorList: AirpayVendorList[];
  hasError?: CustomErrors;
  isLoading?: boolean;
  totalCount: number;
  errorLog: any;
}
