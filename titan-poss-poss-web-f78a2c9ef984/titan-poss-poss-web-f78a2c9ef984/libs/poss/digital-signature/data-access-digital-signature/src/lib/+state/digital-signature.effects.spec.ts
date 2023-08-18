import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { DigitalSignatureEffects } from './digital-signature.effects';
import { DigitalSignatureService } from '../digital-signature.service';
import {
  GcCashMemoDetailsRequest,
  AddGiftCardItemPayload,
  PartiallyUpdateGiftDetailsPayload,
  CustomerDigitalSignatureResponse,
  CustomerDigitalSignatureRequestPayload,
  EmployeeSignatureDetailsResponse
} from '@poss-web/shared/models';
import {
  GenerateOtp,
  GenerateOtpFailure,
  GenerateOtpSuccess,
  GetCustomerDetailsForDigitalSignature,
  GetCustomerDetailsForDigitalSignatureFailure,
  GetCustomerDetailsForDigitalSignatureSuccess,
  LoadEmployeeSignatureDetails,
  LoadEmployeeSignatureDetailsFailure,
  LoadEmployeeSignatureDetailsSuccess,
  SendCustomerDetailsForDigitalSignature,
  SendCustomerDetailsForDigitalSignatureFailure,
  SendCustomerDetailsForDigitalSignatureSuccess,
  UploadDigitalSignature,
  UploadDigitalSignatureFailure,
  UploadDigitalSignatureSuccess,
  UploadEmployeeSignature,
  UploadEmployeeSignatureFailure,
  UploadEmployeeSignatureSuccess,
  ValidateOtp,
  ValidateOtpFailure,
  ValidateOtpSuccess
} from './digital-signature.actions';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';
import { LoadEmployeeCodes } from 'libs/eposs/stock-return/data-access-stock-return/src/lib/+state/stock-return.actions';

describe('Gift Cards Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: DigitalSignatureEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const digitalSignatureServiceSpy = jasmine.createSpyObj<
    DigitalSignatureService
  >('DigitalSignatureService', [
    'sendCustomerDetailsForDigitalSignature',
    'getCustomerDetailsForDigitalSignature',
    'uploadDigitalSignature',
    'sendOTPForCustomerSignature',
    'validateOTPForCustomerSignature',
    'getEmployeeSignatureDetails',
    'uploadEmployeeSignature'
  ]);
  const storeUserDataServiceSpy = jasmine.createSpyObj<StoreUserDataService>(
    'storeUserDataService',
    ['getStoreUsers']
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DigitalSignatureEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: DigitalSignatureService,
          useValue: digitalSignatureServiceSpy
        },
        {
          provide: StoreUserDataService,
          useValue: storeUserDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(DigitalSignatureEffects);
  });

  describe('getCustomerDetailsForDigitalSignature', () => {
    it('should Get Customer Details For Digital Signature', () => {
      const action = new GetCustomerDetailsForDigitalSignature(
        '9988776655',
        ''
      );
      const payload: CustomerDigitalSignatureResponse[] = [
        {
          applicableTransactionTypes: '',
          customerAddress: '',
          customerEmail: '',
          customerId: '',
          customerName: '',
          digitalSignature: '',
          mobileNumber: '',
          ulpNumber: '',
          customerType: ''
        }
      ];
      const outCome = new GetCustomerDetailsForDigitalSignatureSuccess(payload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: payload });
      digitalSignatureServiceSpy.getCustomerDetailsForDigitalSignature.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getCustomerDetailsForDigitalSignature$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const action = new GetCustomerDetailsForDigitalSignature(
        '9988776655',
        ''
      );
      const error = new Error('some error');
      const outCome = new GetCustomerDetailsForDigitalSignatureFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      digitalSignatureServiceSpy.getCustomerDetailsForDigitalSignature.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.getCustomerDetailsForDigitalSignature$).toBeObservable(
        expected
      );
    });
  });

  describe('sendCustomerDetailsForDigitalSignature', () => {
    it('should Send Customer Details For Digital Signature', () => {
      const payload: CustomerDigitalSignatureRequestPayload = {
        applicableTransactionTypes: {
          type: '',
          data: null
        },
        emailId: '',
        mobileNumber: '',
        ulpNumber: '',
        customerType: ''
      };
      const action = new SendCustomerDetailsForDigitalSignature(payload);
      const response: CustomerDigitalSignatureResponse = {
        applicableTransactionTypes: '',
        customerAddress: '',
        customerEmail: '',
        customerId: '',
        customerName: '',
        digitalSignature: '',
        mobileNumber: '',
        ulpNumber: '',
        customerType: ''
      };
      const outCome = new SendCustomerDetailsForDigitalSignatureSuccess(
        response
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      digitalSignatureServiceSpy.sendCustomerDetailsForDigitalSignature.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.sendCustomerDetailsForDigitalSignature$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload: CustomerDigitalSignatureRequestPayload = {
        applicableTransactionTypes: {
          type: '',
          data: null
        },
        emailId: '',
        mobileNumber: '',
        ulpNumber: '',
        customerType: ''
      };
      const action = new SendCustomerDetailsForDigitalSignature(payload);
      const error = new Error('some error');
      const outCome = new SendCustomerDetailsForDigitalSignatureFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      digitalSignatureServiceSpy.sendCustomerDetailsForDigitalSignature.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.sendCustomerDetailsForDigitalSignature$).toBeObservable(
        expected
      );
    });
  });

  describe('uploadDigitalSignature', () => {
    it('should Upload Digital Signature', () => {
      const action = new UploadDigitalSignature('9988776655', 'REGULAR', '');
      const response: CustomerDigitalSignatureResponse = {
        applicableTransactionTypes: '',
        customerAddress: '',
        customerEmail: '',
        customerId: '',
        customerName: '',
        digitalSignature: '',
        mobileNumber: '',
        ulpNumber: '',
        customerType: ''
      };
      const outCome = new UploadDigitalSignatureSuccess(response);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      digitalSignatureServiceSpy.uploadDigitalSignature.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.uploadDigitalSignature$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UploadDigitalSignature('9988776655', 'REGULAR', '');
      const error = new Error('some error');
      const outCome = new UploadDigitalSignatureFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      digitalSignatureServiceSpy.uploadDigitalSignature.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.uploadDigitalSignature$).toBeObservable(expected);
    });
  });

  describe('GenerateOtp', () => {
    it('should Generate Otp', () => {
      const action = new GenerateOtp('');
      const outCome = new GenerateOtpSuccess(true);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: true });
      digitalSignatureServiceSpy.sendOTPForCustomerSignature.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.generateOTP$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GenerateOtp('');
      const error = new Error('some error');
      const outCome = new GenerateOtpFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      digitalSignatureServiceSpy.sendOTPForCustomerSignature.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.generateOTP$).toBeObservable(expected);
    });
  });

  describe('ValidateOtp', () => {
    it('should Validate Otp', () => {
      const action = new ValidateOtp('123', '');
      const outCome = new ValidateOtpSuccess(true);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: true });
      digitalSignatureServiceSpy.validateOTPForCustomerSignature.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.validateOTP$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ValidateOtp('123', '');
      const error = new Error('some error');
      const outCome = new ValidateOtpFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      digitalSignatureServiceSpy.validateOTPForCustomerSignature.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.validateOTP$).toBeObservable(expected);
    });
  });

  describe('LoadEmployeeSignatureDetails', () => {
    it('should Load Employee Signature Details', () => {
      const action = new LoadEmployeeSignatureDetails('cashiercpd');
      const payload: EmployeeSignatureDetailsResponse = {
        address: '',
        digitalSignature: '',
        emailId: '',
        empName: '',
        employeeCode: '',
        employeeType: '',
        forcePasswordChange: false,
        hasLoginAccess: false,
        isActive: false,
        isLocked: false,
        isLoginActive: false,
        locationCode: 'CPD',
        mobileNo: '9988776655',
        orgCode: '',
        regionCode: '',
        userName: '',
        userType: ''
      };
      const outCome = new LoadEmployeeSignatureDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: payload });
      digitalSignatureServiceSpy.getEmployeeSignatureDetails.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadEmployeeSignatureDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadEmployeeSignatureDetails('cashiercpd');
      const error = new Error('some error');
      const outCome = new LoadEmployeeSignatureDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      digitalSignatureServiceSpy.getEmployeeSignatureDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.loadEmployeeSignatureDetails$).toBeObservable(expected);
    });
  });

  describe('uploadEmployeeSignatureDetails', () => {
    it('should Upload Employee Signature Details', () => {
      const action = new UploadEmployeeSignature('cashiercpd', '');
      const payload: EmployeeSignatureDetailsResponse = {
        address: '',
        digitalSignature: '',
        emailId: '',
        empName: '',
        employeeCode: '',
        employeeType: '',
        forcePasswordChange: false,
        hasLoginAccess: false,
        isActive: false,
        isLocked: false,
        isLoginActive: false,
        locationCode: 'CPD',
        mobileNo: '9988776655',
        orgCode: '',
        regionCode: '',
        userName: '',
        userType: ''
      };
      const outCome = new UploadEmployeeSignatureSuccess(payload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: payload });
      digitalSignatureServiceSpy.uploadEmployeeSignature.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.uploadEmployeeSignatureDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UploadEmployeeSignature('cashiercpd', '');
      const error = new Error('some error');
      const outCome = new UploadEmployeeSignatureFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      digitalSignatureServiceSpy.uploadEmployeeSignature.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.uploadEmployeeSignatureDetails$).toBeObservable(expected);
    });
  });
});
