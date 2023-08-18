import {
  CustomErrors,
  FileUploadResponse,
} from '@poss-web/shared/models';
import { AirpayHostConfigEntity } from './airpay-host-configuration.entity';
export interface AirpayHostConfigurationState {
  fileUploadResponse: FileUploadResponse;
  hostNameList: AirpayHostConfigEntity;
  totalCount: number;
  updatedHostNameList: string;
  hasError?: CustomErrors;
  isLoading?: boolean;
  errorLog: any;
}
