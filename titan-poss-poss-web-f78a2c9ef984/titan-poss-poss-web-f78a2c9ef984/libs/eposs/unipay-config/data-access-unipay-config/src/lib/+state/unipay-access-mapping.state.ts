import { CustomErrors, UploadResponse } from '@poss-web/shared/models';
import {UnipayAccessMappingEntity} from './unipay-access-mapping.entity'
export interface UnipayConfigurationState {
  fileUploadResponse: UploadResponse;
  accessList:UnipayAccessMappingEntity
  totalCount:number;
  updatedAccessList:string;
  hasError?: CustomErrors;
  isLoading?: boolean;
  errorLog:any
}
