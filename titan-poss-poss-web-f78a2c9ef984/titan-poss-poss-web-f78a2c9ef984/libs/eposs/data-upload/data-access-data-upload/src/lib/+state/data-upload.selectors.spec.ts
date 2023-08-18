import { NewFileUploadResponse } from '@poss-web/shared/models';
import { initialState } from './data-upload.reducers';
// you will need to assert that the store is calling the right selector function.
import * as selectors from './data-upload.selectors';
import { DataUploadState } from './data-upload.state';

describe('Data Upload related Selectors', () => {
  const fileUploadResponse: NewFileUploadResponse = {
    fileId: '37ac5682-87ae-4766-a72d-172c59e3eaf7',
    message: 'SUCCESS',
    uploadType: 'async',
    hasError: false
  };

  const responseSuccess: boolean = true;
  it('Should return  isLoading status', () => {
    const state: DataUploadState = {
      ...initialState,
      isLoading: false
    };
    expect(
      selectors.dataUploadSelectors.selectIsLoading.projector(state)
    ).toEqual(false);
  });
  it('Should return error', () => {
    const state: DataUploadState = {
      ...initialState,
      hasError: null
    };
    expect(
      selectors.dataUploadSelectors.selectHasError.projector(state)
    ).toEqual(null);
  });

  it('Should return FIRFileUploadResponse', () => {
    const state: DataUploadState = {
      ...initialState,
      FIRFileUploadResponse: fileUploadResponse
    };
    expect(
      selectors.dataUploadSelectors.selectFIRFileUploadResponse.projector(state)
    ).toEqual(fileUploadResponse);
  });
  it('Should return  MERFileUploadResponse', () => {
    const state: DataUploadState = {
      ...initialState,
      MERFileUploadResponse: fileUploadResponse
    };
    expect(
      selectors.dataUploadSelectors.selectMERFileUploadResponse.projector(state)
    ).toEqual(fileUploadResponse);
  });

  it('Should return  invoiceUploadResponse', () => {
    const state: DataUploadState = {
      ...initialState,
      invoiceUploadResponse: responseSuccess
    };
    expect(
      selectors.dataUploadSelectors.selectInvoiceUploadResponse.projector(state)
    ).toEqual(responseSuccess);
  });
  it('Should return  STNUploadResponse', () => {
    const state: DataUploadState = {
      ...initialState,
      STNUploadResponse: responseSuccess
    };
    expect(
      selectors.dataUploadSelectors.selectSTNUploadResponse.projector(state)
    ).toEqual(responseSuccess);
  });
});
