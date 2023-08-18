import * as selectors from './digital-signature.selectors';
import { initialState } from './digital-signature.reducer';
import { DigitalSignatureState } from './digital-signature.state';
import {
  CustomerDigitalSignatureResponse,
  CustomErrors,
  EmployeeSignatureDetailsResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Digital Signature Selector Testing Suite', () => {
  it('Testing selectGetCustomerDetailsForDigitalSignatureResponse selector', () => {
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
    const state: DigitalSignatureState = {
      ...initialState,
      getCustomerDetailsForDigitalSignatureResponse: payload
    };
    expect(
      selectors.DigitalSignatureSelectors.selectGetCustomerDetailsForDigitalSignatureResponse.projector(
        state
      )
    ).toEqual(payload);
  });
  it('Testing selectError selector', () => {
    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );
    const state: DigitalSignatureState = {
      ...initialState,
      errors: payload
    };
    expect(
      selectors.DigitalSignatureSelectors.selectError.projector(state)
    ).toEqual(payload);
  });
  it('Testing selectIsLoading selector', () => {
    const state: DigitalSignatureState = {
      ...initialState,
      isLoading: true
    };
    expect(
      selectors.DigitalSignatureSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });
  it('Testing selectSendCustomerDetailsForDigitalSignatureResponse selector', () => {
    const data = {
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
    const state: DigitalSignatureState = {
      ...initialState,
      sendCustomerDetailsForDigitalSignatureResponse: data
    };
    expect(
      selectors.DigitalSignatureSelectors.selectSendCustomerDetailsForDigitalSignatureResponse.projector(
        state
      )
    ).toEqual(data);
  });
  it('Testing selectUploadDigitalSignatureResponse selector', () => {
    const data = {
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
    const state: DigitalSignatureState = {
      ...initialState,
      uploadDigitalSignatureResponse: data
    };
    expect(
      selectors.DigitalSignatureSelectors.selectUploadDigitalSignatureResponse.projector(
        state
      )
    ).toEqual(data);
  });
  it('Testing selectIsOtpGenerated selector', () => {
    const state: DigitalSignatureState = {
      ...initialState,
      isOTPGenerated: true
    };
    expect(
      selectors.DigitalSignatureSelectors.selectIsOtpGenerated.projector(state)
    ).toEqual(true);
  });
  it('Testing selectIsOtpVerified selector', () => {
    const state: DigitalSignatureState = {
      ...initialState,
      isOTPVerified: true
    };
    expect(
      selectors.DigitalSignatureSelectors.selectIsOtpVerified.projector(state)
    ).toEqual(true);
  });
  it('Testing selectEmployeeSignatureDetailsResponse selector', () => {
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
    const state: DigitalSignatureState = {
      ...initialState,
      employeeSignatureDetailsResponse: payload
    };
    expect(
      selectors.DigitalSignatureSelectors.selectEmployeeSignatureDetailsResponse.projector(
        state
      )
    ).toEqual(payload);
  });
});
