import {
  CustomErrors,
  DocumentListResponse,
  FileStatusList,
  NewFileUploadResponse
} from '@poss-web/shared/models';

export interface FileState {
  error: CustomErrors;
  fileStatusList: FileStatusList[];
  totalFileStatus: number;
  isLoading: boolean;
  fileUploadResponse: NewFileUploadResponse;
  imageResponse: string;
  docsList: DocumentListResponse[];
  isDeleted: boolean;
  documentUrl: string;
  fileIds: string[];
  clearFileList: boolean;
  resetFileType: boolean;
}
