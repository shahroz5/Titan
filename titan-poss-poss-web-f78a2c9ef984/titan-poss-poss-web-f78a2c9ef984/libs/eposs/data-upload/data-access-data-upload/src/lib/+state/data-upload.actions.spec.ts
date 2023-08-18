import { CustomErrors, NewFileUploadResponse } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  FIRFileUpload,
  FIRFileUploadFailure,
  FIRFileUploadSuccess,
  DataUploadActionTypes,
  MERFileUpload,
  MERFileUploadSuccess,
  MERFileUploadFailure,
  InvoiceUpload,
  InvoiceUploadSuccess,
  InvoiceUploadFailure,
  STNUpload,
  STNUploadSuccess,
  STNUploadFailure,
  ResetResponse
} from './data-upload.actions';

describe('Data Upload Actions Testing suit', () => {
  const file = new FormData();

  const fileUploadResponse: NewFileUploadResponse = {
    fileId: '37ac5682-87ae-4766-a72d-172c59e3eaf7',
    message: 'SUCCESS',
    uploadType: 'async',
    hasError: false
  };

  const responseSuccess: boolean = true;

  describe('FIRFileUpload Action Test Cases', () => {
    it('should check correct type is used for  FIRFileUpload action ', () => {
      const action = new FIRFileUpload(file);

      expect(action.type).toEqual(DataUploadActionTypes.FIR_FILE_UPLOAD);
      expect(action.payload).toEqual(file);
    });

    it('should check correct type is used for  FIRFileUploadSuccess action ', () => {
      const action = new FIRFileUploadSuccess(fileUploadResponse);

      expect(action.type).toEqual(
        DataUploadActionTypes.FIR_FILE_UPLOAD_SUCCESS
      );
      expect(action.payload).toEqual(fileUploadResponse);
    });

    it('should check correct type is used for  FIRFileUploadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FIRFileUploadFailure(payload);

      expect(action.type).toEqual(
        DataUploadActionTypes.FIR_FILE_UPLOAD_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('MERFileUpload Action Test Cases', () => {
    it('should check correct type is used for  MERFileUpload action ', () => {
      const action = new MERFileUpload(file);

      expect(action.type).toEqual(DataUploadActionTypes.MER_FILE_UPLOAD);
      expect(action.payload).toEqual(file);
    });

    it('should check correct type is used for  MERFileUploadSuccess action ', () => {
      const action = new MERFileUploadSuccess(fileUploadResponse);

      expect(action.type).toEqual(
        DataUploadActionTypes.MER_FILE_UPLOAD_SUCCESS
      );
      expect(action.payload).toEqual(fileUploadResponse);
    });

    it('should check correct type is used for  MERFileUploadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new MERFileUploadFailure(payload);

      expect(action.type).toEqual(
        DataUploadActionTypes.MER_FILE_UPLOAD_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('InvoiceUpload Action Test Cases', () => {
    it('should check correct type is used for  InvoiceUpload action ', () => {
      const action = new InvoiceUpload();

      expect(action.type).toEqual(DataUploadActionTypes.INVOICE_UPLOAD);
    });

    it('should check correct type is used for  InvoiceUploadSuccess action ', () => {
      const action = new InvoiceUploadSuccess(responseSuccess);

      expect(action.type).toEqual(DataUploadActionTypes.INVOICE_UPLOAD_SUCCESS);
      expect(action.payload).toEqual(responseSuccess);
    });

    it('should check correct type is used for  InvoiceUploadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new InvoiceUploadFailure(payload);

      expect(action.type).toEqual(DataUploadActionTypes.INVOICE_UPLOAD_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('STNUpload Action Test Cases', () => {
    it('should check correct type is used for  STNUpload action ', () => {
      const action = new STNUpload();

      expect(action.type).toEqual(DataUploadActionTypes.STN_UPLOAD);
    });

    it('should check correct type is used for  STNUploadSuccess action ', () => {
      const action = new STNUploadSuccess(responseSuccess);

      expect(action.type).toEqual(DataUploadActionTypes.STN_UPLOAD_SUCCESS);
      expect(action.payload).toEqual(responseSuccess);
    });

    it('should check correct type is used for  STNUploadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new STNUploadFailure(payload);

      expect(action.type).toEqual(DataUploadActionTypes.STN_UPLOAD_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for ResetResponse action ', () => {
      const action = new ResetResponse();
      expect({ ...action }).toEqual({
        type: DataUploadActionTypes.RESET_RESPONSE
      });
    });
  });
});
