import {
  CustomErrors,
  FileUploadResponse,
} from '@poss-web/shared/models';
import { EmployeeLoanConfigEntity } from './employee-loan-configuration.entity';
export interface EmployeeLoanConfigurationState {
  fileUploadResponse: FileUploadResponse;
  empLoanConfigList: EmployeeLoanConfigEntity;
  totalCount: number;
  configListUpdated: boolean;
  hasError?: CustomErrors;
  isLoading?: boolean;
  errorLog: any;
}
