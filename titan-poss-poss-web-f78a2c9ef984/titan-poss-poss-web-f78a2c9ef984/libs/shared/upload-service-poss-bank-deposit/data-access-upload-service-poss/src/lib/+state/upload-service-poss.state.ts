import { CustomErrors, FileResponse } from '@poss-web/shared/models';
export interface UploadServicePossState {
  error: CustomErrors;
  isLoading: boolean;
  fileResponse: FileResponse;
}