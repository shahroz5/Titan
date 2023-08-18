import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import { DataUploadService } from '../data-upload.service';
import { initialState, dataUploadFeatureKey } from './data-upload.reducers';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { DataUploadEffect } from './data-upload.effects';
import { NewFileUploadResponse } from '@poss-web/shared/models';
import {
  FIRFileUpload,
  FIRFileUploadFailure,
  FIRFileUploadSuccess,
  InvoiceUpload,
  InvoiceUploadFailure,
  InvoiceUploadSuccess,
  MERFileUpload,
  MERFileUploadFailure,
  MERFileUploadSuccess,
  STNUpload,
  STNUploadFailure,
  STNUploadSuccess
} from './data-upload.actions';

describe('Data Upload Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: DataUploadEffect;

  const dataUploadServiceSpy = jasmine.createSpyObj<DataUploadService>([
    'FIRFileUpload',
    'MERFileUpload',
    'InvoiceUpload',
    'STNUpload'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataUploadEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [dataUploadFeatureKey]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: DataUploadService,
          useValue: dataUploadServiceSpy
        }
      ]
    });

    effect = TestBed.inject(DataUploadEffect);
  });

  describe('FIRFileUpload', () => {
    const file = new FormData();

    const fileUploadResponse: NewFileUploadResponse = {
      fileId: '37ac5682-87ae-4766-a72d-172c59e3eaf7',
      message: 'SUCCESS',
      uploadType: 'async',
      hasError: false
    };

    it('should return a FIRFileUpload', () => {
      const action = new FIRFileUpload(file);
      const outcome = new FIRFileUploadSuccess(fileUploadResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: fileUploadResponse });
      dataUploadServiceSpy.FIRFileUpload.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.FIRFileUpload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FIRFileUpload(file);
      const error = new Error('some error');
      const outcome = new FIRFileUploadFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      dataUploadServiceSpy.FIRFileUpload.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.FIRFileUpload$).toBeObservable(expected);
    });
  });

  describe('MERFileUpload', () => {
    const file = new FormData();

    const fileUploadResponse: NewFileUploadResponse = {
      fileId: '37ac5682-87ae-4766-a72d-172c59e3eaf7',
      message: 'SUCCESS',
      uploadType: 'async',
      hasError: false
    };

    it('should return a MERFileUpload', () => {
      const action = new MERFileUpload(file);
      const outcome = new MERFileUploadSuccess(fileUploadResponse);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: fileUploadResponse });
      dataUploadServiceSpy.MERFileUpload.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.MERFileUpload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new MERFileUpload(file);
      const error = new Error('some error');
      const outcome = new MERFileUploadFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      dataUploadServiceSpy.MERFileUpload.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.MERFileUpload$).toBeObservable(expected);
    });
  });

  describe('InvoiceUpload', () => {
    const responseSuccess: boolean = true;

    it('should return a InvoiceUpload', () => {
      const action = new InvoiceUpload();
      const outcome = new InvoiceUploadSuccess(responseSuccess);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: responseSuccess });
      dataUploadServiceSpy.InvoiceUpload.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.InvoiceUpload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new InvoiceUpload();
      const error = new Error('some error');
      const outcome = new InvoiceUploadFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      dataUploadServiceSpy.InvoiceUpload.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.InvoiceUpload$).toBeObservable(expected);
    });
  });

  describe('STNUpload', () => {
    const responseSuccess: boolean = true;

    it('should return a STNUpload', () => {
      const action = new STNUpload();
      const outcome = new STNUploadSuccess(responseSuccess);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: responseSuccess });
      dataUploadServiceSpy.STNUpload.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.STNUpload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new STNUpload();
      const error = new Error('some error');
      const outcome = new STNUploadFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      dataUploadServiceSpy.STNUpload.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.STNUpload$).toBeObservable(expected);
    });
  });
});
