import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DocumentListPayload,
  DocumentUploadPayload,
  FileData,
  LoadFileStatusListPayload
} from '@poss-web/shared/models';
import * as fileActions from './file.actions';
import { FileState } from './file.state';
import { FileSelectors } from './/file.selectors';
@Injectable()
export class FileFacade {
  constructor(private store: Store<FileState>) {}

  private fileStatusList$ = this.store.select(
    FileSelectors.selectFileStatusList
  );
  private totalFileStatus$ = this.store.select(
    FileSelectors.selectFileStatusCount
  );
  private fileUploadResponse$ = this.store.select(
    FileSelectors.selectFileUploadResponse
  );
  private documentUploadResponse$ = this.store.select(
    FileSelectors.selectDocumentUploadResponse
  );
  private documentList$ = this.store.select(FileSelectors.selectDocumentsList);
  private isDeleted$ = this.store.select(FileSelectors.selectIsDeleted);
  private isLoading$ = this.store.select(FileSelectors.selectIsLoading);
  private hasError$ = this.store.select(FileSelectors.selectError);
  private documentUrl$ = this.store.select(FileSelectors.selectDocumentUrl);
  private fileIds$ = this.store.select(FileSelectors.selectFileIds);
  private clearFileList$ = this.store.select(FileSelectors.selectClearFileList);
  private resetFileType$ = this.store.select(FileSelectors.selectResetFileType);

  getIsLoading() {
    return this.isLoading$;
  }
  getError() {
    return this.hasError$;
  }
  getFileStatusList() {
    return this.fileStatusList$;
  }
  getTotalFileStatusCount() {
    return this.totalFileStatus$;
  }
  getFileUploadResponse() {
    return this.fileUploadResponse$;
  }
  getDocumentUploadResponse() {
    return this.documentUploadResponse$;
  }
  getDocumentsLst() {
    return this.documentList$;
  }
  getDocumentUrlById() {
    return this.documentUrl$;
  }
  getIsDeleted() {
    return this.isDeleted$;
  }
  getFileIds() {
    return this.fileIds$;
  }
  getClearFileList() {
    return this.clearFileList$;
  }
  getResetFileType() {
    console.log('Reset Facade', this.resetFileType$);
    return this.resetFileType$;
  }
  downloadErrorLog = (id: string, group: string) =>
    this.store.dispatch(new fileActions.ErrorLogDownload(id, group));

  downloadPdfFile = (payload: FileData) =>
    this.store.dispatch(new fileActions.PdfFileDownload(payload));

  loadFileStatusList(loadFileStatusListPayload: LoadFileStatusListPayload) {
    this.store.dispatch(
      new fileActions.LoadFileStatusList(loadFileStatusListPayload)
    );
  }

  loadFileUpload(
    File: FormData,
    fileGroup?: string,
    param?: string,
    appType?: string,
    isServicePoss?: boolean,
  ) {
    this.store.dispatch(
      new fileActions.FileUpload(File, fileGroup, param, appType, isServicePoss)
    );
  }
  uploadForm(data: DocumentUploadPayload) {
    this.store.dispatch(new fileActions.DocumentUpload(data));
  }
  loadDocumentsList(payload: DocumentListPayload) {
    this.store.dispatch(new fileActions.LoadDocumentList(payload));
  }
  loadDocumentUrlById(id: string, locationCode?: string) {
    this.store.dispatch(new fileActions.LoadDocumentUrlById(id, locationCode));
  }
  loadFileIds(ids: string[]) {
    this.store.dispatch(new fileActions.GetUploadedFileIds(ids));
  }
  deleteDocument(fileId: string) {
    this.store.dispatch(new fileActions.DeleteDocument(fileId));
  }
  clearResponse() {
    this.store.dispatch(new fileActions.ResetResponse());
  }
  clearFileList(clear: boolean) {
    this.store.dispatch(new fileActions.ClearFileList(clear));
  }
  resetFileType(payload: boolean) {
    this.store.dispatch(new fileActions.ResetFileType(payload));
  }
}
