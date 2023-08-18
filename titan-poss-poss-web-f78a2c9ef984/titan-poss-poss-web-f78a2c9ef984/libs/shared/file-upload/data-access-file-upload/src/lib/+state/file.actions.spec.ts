import {
  CustomErrors,
  AirpayHostSuccessList,
  ListingPayload,
  SortItem,
  HostFileUploadResponse
} from '@poss-web/shared/models';
import {
  FileUploadResponse,
  DocumentUploadPayload,
  NewFileUploadResponse,
  LoadFileStatusListPayload,
  LoadFileStatusListSuccessPayload,
  DocumentListPayload,
  DocumentListResponse
} from '@poss-web/shared/models';
import {
  FileUpload,
  FileUploadSuccess,
  FileUploadFailure,
  ResetResponse,
  DocumentUpload,
  DocumentUploadSuccess,
  DocumentUploadFailure,
  LoadDocumentList,
  LoadDocumentListSuccess,
  LoadDocumentListFailure,
  LoadDocumentUrlById,
  LoadDocumentUrlByIdSuccess,
  LoadDocumentUrlByIdFailure,
  DeleteDocument,
  DeleteDocumentSuccess,
  DeleteDocumentFailure,
  GetUploadedFileIds,
  LoadFileStatusList,
  LoadFileStatusListSuccess,
  LoadFileStatusListFailure,
  FileActionTypes,
  ErrorLogDownload,
  ErrorLogDownloadSuccess,
  ErrorLogDownloadFailure
} from './file.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
const formData: FormData = new FormData();
const uploadResponse: HostFileUploadResponse = {
  fileId: 'test123',
  hasError: false,
  message: 'uploaded',
  records: {
    errorLogId: 'abc123',
    failureCount: 0,
    successCount: 1,
    totalCount: 1
  }
};

const configListingPayload: ListingPayload = {
  pageIndex: 0,
  pageSize: 10
};
const sortField: SortItem = {
  colId: '',
  sort: 'Desc'
};

const unipayConfigurationList: AirpayHostSuccessList = {
  hostList: [
    {
      hostName: 'airpay',
      id: '123',
      isActive: true,
      locationCode: '123',
      newlyAdded: true,
      paymentCode: 'airpay'
    }
  ],
  count: 1
};

const docsListPayload: DocumentListPayload = {
  customerId: 1,
  docType: 'CM',
  fileType: 'OTHERS',
  id: '1222222222'
};
const docsList: DocumentListResponse[] = [
  {
    id: '111',
    name: 'abc.img'
  }
];
describe('Aipay Host Action Testing Suite', () => {
  describe('FileUpload Action Test Cases', () => {
    it('should check correct type is used for  FileUpload action ', () => {
      const action = new FileUpload(formData);

      expect(action.type).toEqual(FileActionTypes.FILE_UPLOAD);

      expect(action.payload).toEqual(formData);
    });
    it('should check correct type is used for FileUploadSuccess action ', () => {
      const action = new FileUploadSuccess(uploadResponse);

      expect(action.type).toEqual(FileActionTypes.FILE_UPLOAD_SUCCESS);
      expect(action.payload).toEqual(uploadResponse);
    });
    it('should check correct type is used for FileUploadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FileUploadFailure(payload);

      expect(action.type).toEqual(FileActionTypes.FILE_UPLOAD_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('GetHostNameList Action Test Cases', () => {
    it('should check correct type is used for  GetHostNameList action ', () => {
      const action = new LoadDocumentList(docsListPayload);

      expect(action.type).toEqual(FileActionTypes.LOAD_DOCS_LIST);
      expect(action.payload).toEqual(docsListPayload);
    });

    it('should check correct type is used for LoadDocumentListSuccess action ', () => {
      const action = new LoadDocumentListSuccess(docsList);

      expect(action.type).toEqual(FileActionTypes.LOAD_DOCS_LIST_SUCCESS);
      expect(action.payload).toEqual(docsList);
    });
    it('should check correct type is used for LoadDocumentListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDocumentListFailure(payload);

      expect(action.type).toEqual(FileActionTypes.LOAD_DOCS_LIST_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ErrorLogDownload Action Test Cases', () => {
    it('should check correct type is used for  ErrorLogDownload action ', () => {
      const id = '111';
      const fileGroup = 'AIRPAY';
      const action = new ErrorLogDownload(id, fileGroup);

      expect(action.type).toEqual(FileActionTypes.ERROR_LOG_DOWNLOAD);

      expect(action.id).toEqual(id);
      expect(action.fileGroup).toEqual(fileGroup);
    });

    it('should check correct type is used for ErrorLogDownloadSuccess action ', () => {
      const action = new ErrorLogDownloadSuccess();

      expect(action.type).toEqual(FileActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS);
    });
    it('should check correct type is used for ErrorLogDownloadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ErrorLogDownloadFailure(payload);

      expect(action.type).toEqual(FileActionTypes.ERROR_LOG_DOWNLOAD_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ResetResponse Action Test Cases', () => {
    it('should check correct type is used for  ResetResponse action ', () => {
      const action = new ResetResponse();

      expect(action.type).toEqual(FileActionTypes.RESET_RESPONSE);
    });
  });
});
