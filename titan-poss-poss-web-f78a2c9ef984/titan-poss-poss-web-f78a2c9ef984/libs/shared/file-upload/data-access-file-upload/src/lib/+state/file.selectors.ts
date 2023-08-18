import { createSelector } from '@ngrx/store';
import { selectFileState } from './file.reducer';

const selectFileStatusList = createSelector(
  selectFileState,
  state => state.fileStatusList
);
const selectFileStatusCount = createSelector(
  selectFileState,
  state => state.totalFileStatus
);
const selectIsLoading = createSelector(
  selectFileState,
  state => state.isLoading
);
const selectFileUploadResponse = createSelector(
  selectFileState,
  state => state.fileUploadResponse
);
const selectDocumentUploadResponse = createSelector(
  selectFileState,
  state => state.imageResponse
);
const selectDocumentsList = createSelector(
  selectFileState,
  state => state.docsList
);
const selectIsDeleted = createSelector(
  selectFileState,
  state => state.isDeleted
);
const selectDocumentUrl = createSelector(
  selectFileState,
  state => state.documentUrl
);
const selectFileIds = createSelector(selectFileState, state => state.fileIds);
const selectError = createSelector(selectFileState, state => state.error);
const selectClearFileList = createSelector(
  selectFileState,
  state => state.clearFileList
);
const selectResetFileType = createSelector(
  selectFileState,
  state => state.resetFileType
);
export const FileSelectors = {
  selectFileStatusList,
  selectFileStatusCount,
  selectIsLoading,
  selectError,
  selectFileUploadResponse,
  selectDocumentUploadResponse,
  selectDocumentsList,
  selectIsDeleted,
  selectDocumentUrl,
  selectFileIds,
  selectClearFileList,
  selectResetFileType
};
