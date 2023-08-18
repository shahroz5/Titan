import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  CustomerDigitalSignatureResponse,
  CustomerDigitalSignatureRequestPayload,
  EmployeeSignatureDetailsResponse
} from '@poss-web/shared/models';
import {
  SendCustomerDetailsForDigitalSignatureFailure,
  SendCustomerDetailsForDigitalSignatureSuccess,
  SendCustomerDetailsForDigitalSignature,
  DigitalSignatureActionTypes,
  GetCustomerDetailsForDigitalSignature,
  GetCustomerDetailsForDigitalSignatureFailure,
  GetCustomerDetailsForDigitalSignatureSuccess,
  UploadDigitalSignature,
  UploadDigitalSignatureSuccess,
  UploadDigitalSignatureFailure,
  GenerateOtp,
  GenerateOtpSuccess,
  GenerateOtpFailure,
  ValidateOtp,
  ValidateOtpSuccess,
  ValidateOtpFailure,
  LoadEmployeeSignatureDetails,
  LoadEmployeeSignatureDetailsSuccess,
  LoadEmployeeSignatureDetailsFailure,
  UploadEmployeeSignature,
  UploadEmployeeSignatureSuccess,
  UploadEmployeeSignatureFailure,
  ResetDigitalSignature
} from './digital-signature.actions';

describe('Digital Signature Action Testing Suite', () => {
  describe('GetCustomerDetailsForDigitalSignature Action Test Cases', () => {
    it('should check correct type is used for GetCustomerDetailsForDigitalSignature action ', () => {
      const action = new GetCustomerDetailsForDigitalSignature('', '');
      expect({ ...action }).toEqual({
        type:
          DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE,
        mobileNumber: '',
        ulpNumber: ''
      });
    });
    it('should check correct type is used for GetCustomerDetailsForDigitalSignatureSuccess action ', () => {
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
      const action = new GetCustomerDetailsForDigitalSignatureSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  GetCustomerDetailsForDigitalSignatureFailure Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetCustomerDetailsForDigitalSignatureFailure(payload);
      expect({ ...action }).toEqual({
        type:
          DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_FAILURE,
        payload
      });
    });
  });
  describe('SendCustomerDetailsForDigitalSignature Action Test Cases', () => {
    it('should check correct type is used for SendCustomerDetailsForDigitalSignature action ', () => {
      const payload: CustomerDigitalSignatureRequestPayload = {
        applicableTransactionTypes: {
          type: '',
          data: {
            isAdvanceOrderOrBooking: false,
            isCashMemo: true,
            isGHS: false,
            isAcceptAdvance: false,
            isGRN: false,
            isGRF: true,
            isGiftCard: false,
            isCNCancellation: false,
            isTEPDeclarationAndExchangeForm: false,
            isGEPDeclarationAndExchangeForm: false,
            isCCAFRequestServicePaymentOrCustomerOrder: false
          }
        },
        emailId: 'abc@email.com',
        mobileNumber: '9999999999',
        ulpNumber: '23456',
        customerType: 'REGULAR'
      };
      const action = new SendCustomerDetailsForDigitalSignature(payload);
      expect({ ...action }).toEqual({
        type:
          DigitalSignatureActionTypes.SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE,
        payload
      });
    });
    it('should check correct type is used for SendCustomerDetailsForDigitalSignatureSuccess action ', () => {
      const payload: CustomerDigitalSignatureResponse = {
        applicableTransactionTypes: '',
        customerAddress: '',
        customerEmail: '',
        customerId: '',
        customerName: '',
        digitalSignature: '',
        mobileNumber: '9999999999',
        ulpNumber: '23456',
        customerType: 'REGULAR'
      };
      const action = new SendCustomerDetailsForDigitalSignatureSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          DigitalSignatureActionTypes.SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SendCustomerDetailsForDigitalSignatureFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SendCustomerDetailsForDigitalSignatureFailure(payload);
      expect({ ...action }).toEqual({
        type:
          DigitalSignatureActionTypes.SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE_FAILURE,
        payload
      });
    });
  });
  describe('UploadDigitalSignature Action Test Cases', () => {
    it('should check correct type is used for UploadDigitalSignature action ', () => {
      const action = new UploadDigitalSignature('9988776655', 'REGULAR', '');
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.UPLOAD_DIGITAL_SIGNATURE,
        mobileNumber: '9988776655',
        customerType: 'REGULAR',
        payload: ''
      });
    });
    it('should check correct type is used for UploadDigitalSignatureSuccess action ', () => {
      const payload: CustomerDigitalSignatureResponse = {
        applicableTransactionTypes: '',
        customerAddress: '',
        customerEmail: '',
        customerId: '',
        customerName: '',
        digitalSignature: '',
        mobileNumber: '9999999999',
        ulpNumber: '23456',
        customerType: 'REGULAR'
      };
      const action = new UploadDigitalSignatureSuccess(payload);
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.UPLOAD_DIGITAL_SIGNATURE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UploadDigitalSignatureFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UploadDigitalSignatureFailure(payload);
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.UPLOAD_DIGITAL_SIGNATURE_FAILURE,
        payload
      });
    });
  });
  describe('GenerateOtp Action Test Cases', () => {
    it('should check correct type is used for GenerateOtp action ', () => {
      const action = new GenerateOtp('');
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.GENERATE_OTP,
        payload: ''
      });
    });
    it('should check correct type is used for GenerateOtpSuccess action ', () => {
      const action = new GenerateOtpSuccess(true);
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.GENERATE_OTP_SUCCESS,
        payload: true
      });
    });
    it('should check correct type is used for  GenerateOtpFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GenerateOtpFailure(payload);
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.GENERATE_OTP_FAILURE,
        payload
      });
    });
  });
  describe('ValidateOtp Action Test Cases', () => {
    it('should check correct type is used for ValidateOtp action ', () => {
      const action = new ValidateOtp('123', '');
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.VALIDATE_OTP,
        customerId: '123',
        token: ''
      });
    });
    it('should check correct type is used for ValidateOtpSuccess action ', () => {
      const action = new ValidateOtpSuccess(true);
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.VALIDATE_OTP_SUCCESS,
        payload: true
      });
    });
    it('should check correct type is used for  ValidateOtpFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ValidateOtpFailure(payload);
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.VALIDATE_OTP_FAILURE,
        payload
      });
    });
  });
  describe('LoadEmployeeSignatureDetails Action Test Cases', () => {
    it('should check correct type is used for LoadEmployeeSignatureDetails action ', () => {
      const action = new LoadEmployeeSignatureDetails('cashiercpd');
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS,
        employeeCode: 'cashiercpd'
      });
    });
    it('should check correct type is used for LoadEmployeeSignatureDetailsSuccess action ', () => {
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
      const action = new LoadEmployeeSignatureDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          DigitalSignatureActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadEmployeeSignatureDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadEmployeeSignatureDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type:
          DigitalSignatureActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('UploadEmployeeSignature Action Test Cases', () => {
    it('should check correct type is used for UploadEmployeeSignature action ', () => {
      const action = new UploadEmployeeSignature('cashiercpd', '');
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.UPLOAD_EMPLOYEE_SIGNATURE,
        employeeCode: 'cashiercpd',
        cashierSignature: ''
      });
    });
    it('should check correct type is used for UploadEmployeeSignatureSuccess action ', () => {
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
      const action = new UploadEmployeeSignatureSuccess(payload);
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.UPLOAD_EMPLOYEE_SIGNATURE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UploadEmployeeSignatureFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UploadEmployeeSignatureFailure(payload);
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.UPLOAD_EMPLOYEE_SIGNATURE_FAILURE,
        payload
      });
    });
  });

  describe('ResetDigitalSignature Action Test Cases', () => {
    it('should check correct type is used for ResetDigitalSignature action ', () => {
      const action = new ResetDigitalSignature();
      expect({ ...action }).toEqual({
        type: DigitalSignatureActionTypes.RESET_DIGITAL_SIGNATURE
      });
    });
  });
});
