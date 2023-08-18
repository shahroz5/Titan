import {
  CustomErrors,
  UploadResponse,
  GvStatusList
} from '@poss-web/shared/models';
import { GVStatusUpdateEntity } from './gv-status-update.entity';
export interface GVStatusUpdateState {
  fileUploadResponse: UploadResponse;
  gvStatusUpdateList: GVStatusUpdateEntity;
  totalCount: number;
  updatedList: GvStatusList[];
  newList: GvStatusList[];
  hasError?: CustomErrors;
  isLoading?: boolean;
  errorLog: any;
}
