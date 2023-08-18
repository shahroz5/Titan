import { DataPersistence } from '@nrwl/angular';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  LoadFileStatusListSuccessPayload,
  DocumentListResponse
} from '@poss-web/shared/models';
import * as FileActions from './file.actions';
import { FileService } from '../file.service';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
@Injectable()
export class FileEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private fileService: FileService
  ) {}
  @Effect()
  loadFileStatus$ = this.dataPersistence.fetch(
    FileActions.FileActionTypes.LOAD_FILE_STATUS_LIST,
    {
      run: (action: FileActions.LoadFileStatusList) => {
        return this.fileService
          .getFileStatusList(action.payload)
          .pipe(
            map(
              (fileStatus: LoadFileStatusListSuccessPayload) =>
                new FileActions.LoadFileStatusListSuccess(fileStatus)
            )
          );
      },
      onError: (
        action: FileActions.LoadFileStatusList,
        error: HttpErrorResponse
      ) => {
        return new FileActions.LoadFileStatusListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  FileUpload$ = this.dataPersistence.fetch(
    FileActions.FileActionTypes.FILE_UPLOAD,
    {
      run: (action: FileActions.FileUpload) => {
        return this.fileService
          .FileUpload(
            action.payload,
            action.fileGroup,
            action.param,
            action.appType,
            action.isServicePoss,
          )
          .pipe(map(data => new FileActions.FileUploadSuccess(data)));
      },

      onError: (action: FileActions.FileUpload, error: HttpErrorResponse) => {
        return new FileActions.FileUploadFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() upload$: Observable<Action> = this.dataPersistence.fetch(
    FileActions.FileActionTypes.DOCUMENT_UPLOAD,
    {
      run: (action: FileActions.DocumentUpload) => {
        console.log('eeff');
        return this.fileService
          .upload(action.payload)
          .pipe(
            map((data: string) => new FileActions.DocumentUploadSuccess(data))
          );
      },

      onError: (
        action: FileActions.DocumentUpload,
        error: HttpErrorResponse
      ) => {
        return new FileActions.DocumentUploadFailure(this.errorHandler(error));
      }
    }
  );
  @Effect()
  loadDocuments$ = this.dataPersistence.fetch(
    FileActions.FileActionTypes.LOAD_DOCS_LIST,
    {
      run: (action: FileActions.LoadDocumentList) => {
        return this.fileService
          .getDocuments(action.payload)
          .pipe(
            map(
              (fileStatus: DocumentListResponse[]) =>
                new FileActions.LoadDocumentListSuccess(fileStatus)
            )
          );
      },
      onError: (
        action: FileActions.LoadDocumentList,
        error: HttpErrorResponse
      ) => {
        return new FileActions.LoadDocumentListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadDocumentUrl$ = this.dataPersistence.fetch(
    FileActions.FileActionTypes.LOAD_DOCUMENT_URL_BY_ID,
    {
      run: (action: FileActions.LoadDocumentUrlById) => {
        return this.fileService
          .getDocumentUrlById(action.payload, action.locationCode)
          .pipe(
            map(
              (url: string) => new FileActions.LoadDocumentUrlByIdSuccess(url)
            )
          );
      },
      onError: (
        action: FileActions.LoadDocumentUrlById,
        error: HttpErrorResponse
      ) => {
        return new FileActions.LoadDocumentUrlByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  deleteDocument$ = this.dataPersistence.fetch(
    FileActions.FileActionTypes.DELETE_DOCUMENT,
    {
      run: (action: FileActions.DeleteDocument) => {
        return this.fileService
          .deleteDocument(action.payload)
          .pipe(map(() => new FileActions.DeleteDocumentSuccess()));
      },
      onError: (
        action: FileActions.DeleteDocument,
        error: HttpErrorResponse
      ) => {
        return new FileActions.DeleteDocumentFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  ErrorLogDownload = this.dataPersistence.fetch(
    FileActions.FileActionTypes.ERROR_LOG_DOWNLOAD,
    {
      run: (action: FileActions.ErrorLogDownload) => {
        return this.fileService
          .getErrorResponse(action.id, action.fileGroup)
          .pipe(map(() => new FileActions.ErrorLogDownloadSuccess()));
      },
      onError: (
        action: FileActions.ErrorLogDownload,
        error: HttpErrorResponse
      ) => {
        return new FileActions.ErrorLogDownloadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  PdfFileDownload = this.dataPersistence.fetch(
    FileActions.FileActionTypes.PDF_File_DOWNLOAD,
    {
      run: (action: FileActions.PdfFileDownload) => {
        return this.fileService
          .getPdfFileResponse(action.payload)
          .pipe(map(() => new FileActions.PdfFileDownloadSuccess()));
      },
      onError: (
        action: FileActions.PdfFileDownload,
        error: HttpErrorResponse
      ) => {
        return new FileActions.PdfFileDownloadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
