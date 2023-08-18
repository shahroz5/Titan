import { DigitalSignatureState } from './digital-signature.state';
import {
  initialState,
  DigitalSignatureReducer
} from './digital-signature.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './digital-signature.actions';
import {
  CustomerDigitalSignatureRequestPayload,
  CustomerDigitalSignatureResponse
} from '@poss-web/shared/models';

describe('Digital Signature reducer Testing Suite', () => {
  describe('Testing Get Customer Details For Digital Signature Functionality', () => {
    beforeEach(() => {});
    it('Testing GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE', () => {
      const action = new actions.GetCustomerDetailsForDigitalSignature('', '');
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_SUCCESS should return customer details response', () => {
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
      const action = new actions.GetCustomerDetailsForDigitalSignatureSuccess(
        payload
      );
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.getCustomerDetailsForDigitalSignatureResponse).toBe(
        payload
      );
    });
    it('GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_FAILURE should return error', () => {
      const action = new actions.GetCustomerDetailsForDigitalSignatureFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Send Customer Details For Digital Signature Functionality', () => {
    beforeEach(() => {});
    it('Testing SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE', () => {
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
      const action = new actions.SendCustomerDetailsForDigitalSignature(
        payload
      );
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_SUCCESS should return sent Customer details response', () => {
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
      const action = new actions.SendCustomerDetailsForDigitalSignatureSuccess(
        response
      );
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.sendCustomerDetailsForDigitalSignatureResponse).toBe(
        response
      );
    });
    it('SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_FAILURE should return error', () => {
      const action = new actions.SendCustomerDetailsForDigitalSignatureFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Upload Digital Signature Functionality', () => {
    beforeEach(() => {});
    it('Testing UPLOAD_DIGITAL_SIGNATURE', () => {
      const action = new actions.UploadDigitalSignature(
        '9988776655',
        'REGULAR',
        ''
      );
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('UPLOAD_DIGITAL_SIGNATURE_SUCCESS should return upload digital signature response', () => {
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
      const action = new actions.UploadDigitalSignatureSuccess(response);
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.uploadDigitalSignatureResponse).toBe(response);
    });
    it('UPLOAD_DIGITAL_SIGNATURE_FAILURE should return error', () => {
      const action = new actions.UploadDigitalSignatureFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Generate Otp Functionality', () => {
    beforeEach(() => {});
    it('Testing GENERATE_OTP', () => {
      const action = new actions.GenerateOtp('cashiercpd');
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('GENERATE_OTP_SUCCESS should return true if OTP generation is successful', () => {
      const action = new actions.GenerateOtpSuccess(true);
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.isOTPGenerated).toBe(true);
    });
    it('GENERATE_OTP_FAILURE should return error', () => {
      const action = new actions.GenerateOtpFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Validate Otp Functionality', () => {
    beforeEach(() => {});
    it('Testing VALIDATE_OTP', () => {
      const action = new actions.ValidateOtp('cashiercpd', '');
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('VALIDATE_OTP_SUCCESS should return true if OTP is validated', () => {
      const action = new actions.ValidateOtpSuccess(true);
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.isOTPVerified).toBe(true);
    });
    it('GENERATE_OTP_FAILURE should return error', () => {
      const action = new actions.ValidateOtpFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DigitalSignatureState = DigitalSignatureReducer(
        initialState,
        action
      );
      expect(result.errors.message).toEqual('some error');
    });
  });
});
