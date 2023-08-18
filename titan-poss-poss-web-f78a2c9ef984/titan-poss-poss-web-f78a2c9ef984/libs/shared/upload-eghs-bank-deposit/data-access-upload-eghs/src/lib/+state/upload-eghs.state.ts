import { CustomErrors, FileResponse } from '@poss-web/shared/models';
export interface UploadEGHSState {
  error: CustomErrors;
  isLoading: boolean;
  fileResponse: FileResponse;
}
