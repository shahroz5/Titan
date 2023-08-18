import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DigitalSignatureFacade } from './digital-signature.facade';
import { DigitalSignatureState } from './digital-signature.state';

import {
  GenerateOtp,
  GetCustomerDetailsForDigitalSignature,
  LoadEmployeeSignatureDetails,
  SendCustomerDetailsForDigitalSignature,
  UploadDigitalSignature,
  ValidateOtp
} from './digital-signature.actions';
import { CustomerDigitalSignatureRequestPayload } from '@poss-web/shared/models';

describe('Gift cards facade Testing Suite', () => {
  const initialState: DigitalSignatureState = {
    errors: null,
    isLoading: false,
    getCustomerDetailsForDigitalSignatureResponse: null,
    sendCustomerDetailsForDigitalSignatureResponse: null,
    uploadDigitalSignatureResponse: null,
    isOTPGenerated: null,
    isOTPVerified: null,
    employeeSignatureDetailsResponse: null,
    uploadEmployeeSignatureResponse: null
  };

  let digitalSignatureFacade: DigitalSignatureFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), DigitalSignatureFacade]
    });

    digitalSignatureFacade = TestBed.inject(DigitalSignatureFacade);
  });

  describe('Load Customer Details For Digital Signature', () => {
    it('should dispatch GetCustomerDetailsForDigitalSignature action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new GetCustomerDetailsForDigitalSignature(
          '',
          ''
        );
        digitalSignatureFacade.loadCustomerDetailsForDigitalSignature('', '');
        digitalSignatureFacade.getCustomerDetailsForDigitalSignatureResponse();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('Send Customer Details For Digital Signature', () => {
    it('should dispatch SendCustomerDetailsForDigitalSignature action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
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
        const expectedAction = new SendCustomerDetailsForDigitalSignature(
          payload
        );
        digitalSignatureFacade.sendCustomerDetailsForDigitalSignature(payload);
        digitalSignatureFacade.sendCustomerDetailsForDigitalSignatureResponse();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('Send Customer Details For Digital Signature', () => {
    it('should dispatch SendCustomerDetailsForDigitalSignature action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
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
        const expectedAction = new SendCustomerDetailsForDigitalSignature(
          payload
        );
        digitalSignatureFacade.sendCustomerDetailsForDigitalSignature(payload);
        digitalSignatureFacade.sendCustomerDetailsForDigitalSignatureResponse();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('Upload Digital Signature', () => {
    it('should dispatch UploadDigitalSignature action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new UploadDigitalSignature(
          '9988776655',
          'REGULAR',
          ''
        );
        digitalSignatureFacade.uploadDigitalSignature(
          '9988776655',
          'REGULAR',
          ''
        );
        digitalSignatureFacade.uploadDigitalSignatureResponse();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('Generate Otp for Digital Signature', () => {
    it('should dispatch generateOtpForCustomerSignature action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new GenerateOtp('123');
        digitalSignatureFacade.generateOtpForCustomerSignature('123');
        digitalSignatureFacade.getIsOtpGenerated();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('Validate Otp for Digital Signature', () => {
    it('should dispatch validateOtpForCustomerSignature action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ValidateOtp('123', '');
        digitalSignatureFacade.validateOtpForCustomerSignature('123', '');
        digitalSignatureFacade.getIsOtpVerified();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('Load Employee Signature Details', () => {
    it('should dispatch Load Employee Signature Details action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadEmployeeSignatureDetails('cashiercpd');
        digitalSignatureFacade.loadEmployeeSignatureDetails('cashiercpd');
        digitalSignatureFacade.getEmployeeSignatureDetailsResponse();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
});
