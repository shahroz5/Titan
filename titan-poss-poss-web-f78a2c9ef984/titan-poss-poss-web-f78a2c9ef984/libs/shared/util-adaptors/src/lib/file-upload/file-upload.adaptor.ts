import {
  DocumentListResponse,
  LoadFileStatusListSuccessPayload,
  NewFileUploadResponse
} from '@poss-web/shared/models';
import { FileStatusList } from '@poss-web/shared/models';
import * as moment from 'moment';

export class FileUploadAdaptor {
  static fileStatusList: LoadFileStatusListSuccessPayload;

  static getFileStatusList(data: any): LoadFileStatusListSuccessPayload {
    const fileStatusList: FileStatusList[] = [];
    for (const listItem of data.results) {
      fileStatusList.push({
        fileId: listItem.fileId ? listItem.fileId : '',
        fileName: listItem.fileName ? listItem.fileName : '',
        processedDate: moment(listItem.processedDate),
        status: listItem.status ? listItem.status : '',
        startTime: moment(listItem.startTime).format(' h:mm:ss a'),
        endTime:
          listItem.endTime === null
            ? ''
            : moment(listItem.endTime).format(' h:mm:ss a'),
        fileGroup: listItem.fileGroup ? listItem.fileGroup : '',
        successCount: listItem.successCount ? listItem.successCount : '',
        failureCount: listItem.failureCount ? listItem.failureCount : 0,
        totalCount: listItem.totalCount ? listItem.totalCount : '',
        remarks: listItem.remarks ? listItem.remarks : ''
      });
    }

    this.fileStatusList = {
      fileStatusList: fileStatusList,
      totalElements: data.totalElements
    };
    return this.fileStatusList;
  }

  static getFileUploadResponse(data: any) {
    let fileResponse: NewFileUploadResponse;
    fileResponse = {
      fileId: data.fileId,
      hasError: data.fileValidationError,
      message: data.message,
      errors: data?.errors,
      records: data.records
        ? {
            errorLogId: data.fileId,
            failureCount: data.records?.failureCount,
            successCount: data.records?.successCount,
            totalCount: data.records?.totalCount
          }
        : null,
      uploadType: data.uploadType
      // records: {
      //   errorLogId: data.fileId,
      //   failureCount: data.records?.failureCount,
      //   successCount: data.records?.successCount,
      //   totalCount: data.records?.totalCount
      // }
    };
    console.log('1111', fileResponse, data.errors);

    return fileResponse;
  }
  static getDocumets(data: any): DocumentListResponse[] {
    const documentList: DocumentListResponse[] = [];
    for (const item of data.results) {
      documentList.push({
        id: item.id ? item.id : '',
        name: item.name ? item.name : ''
      });
    }
    console.log(documentList);
    return documentList;
  }
}
