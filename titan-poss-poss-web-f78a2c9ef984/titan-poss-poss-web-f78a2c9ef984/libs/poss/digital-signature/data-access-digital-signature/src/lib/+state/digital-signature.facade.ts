import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as DigitalSignatureActions from './digital-signature.actions';
import { DigitalSignatureSelectors } from './digital-signature.selectors';
import { DigitalSignatureState } from './digital-signature.state';
import {
  CustomerDigitalSignatureRequestPayload,
  CustomerDigitalSignatureResponse,
  EmployeeSignatureDetailsResponse,
  StoreDetailsResponse
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class DigitalSignatureFacade {
  constructor(private store: Store<DigitalSignatureState>) {}

  private error$ = this.store.select(DigitalSignatureSelectors.selectError);

  private isLoading$ = this.store.select(
    DigitalSignatureSelectors.selectIsLoading
  );

  private getStoreDetailsForDigitalSignature$ = this.store.select(
    DigitalSignatureSelectors.selectGetStoreDetailsResponse
  );

  private getCustomerDetails$ = this.store.select(
    DigitalSignatureSelectors.selectGetCustomerDetailsResponse
  );

  private getCustomerDetailsForDigitalSignature$ = this.store.select(
    DigitalSignatureSelectors.selectGetCustomerDetailsForDigitalSignatureResponse
  );

  private sendCustomerDetailsForDigitalSignature$ = this.store.select(
    DigitalSignatureSelectors.selectSendCustomerDetailsForDigitalSignatureResponse
  );

  private uploadDigitalSignature$ = this.store.select(
    DigitalSignatureSelectors.selectUploadDigitalSignatureResponse
  );

  private isOtpGenerated$ = this.store.select(
    DigitalSignatureSelectors.selectIsOtpGenerated
  );

  private isOtpVerified$ = this.store.select(
    DigitalSignatureSelectors.selectIsOtpVerified
  );

  private employeeSignatureDetailsResponse$ = this.store.select(
    DigitalSignatureSelectors.selectEmployeeSignatureDetailsResponse
  );

  private uploadEmployeeSignatureResponse$ = this.store.select(
    DigitalSignatureSelectors.selectUploadEmployeeSignatureResponse
  );

  loadStoreDetailsForDigitalSignature() {
    this.store.dispatch(
      new DigitalSignatureActions.GetStoreDetailsForDigitalSignature()
    );
  }

  loadCustomerDetails(mobileNumber?: string, ulpNumber?: string) {
    this.store.dispatch(
      new DigitalSignatureActions.GetCustomerDetails(mobileNumber, ulpNumber)
    );
  }

  loadCustomerDetailsForDigitalSignature(
    customerType: string,
    mobileNumber?: string,
    ulpNumber?: string
  ) {
    this.store.dispatch(
      new DigitalSignatureActions.GetCustomerDetailsForDigitalSignature(
        customerType,
        mobileNumber,
        ulpNumber
      )
    );
  }

  sendCustomerDetailsForDigitalSignature(
    requestPayload: CustomerDigitalSignatureRequestPayload
  ) {
    this.store.dispatch(
      new DigitalSignatureActions.SendCustomerDetailsForDigitalSignature(
        requestPayload
      )
    );
  }

  uploadDigitalSignature(
    mobileNumber: string,
    customerType: string,
    digitalSignature: string
  ) {
    this.store.dispatch(
      new DigitalSignatureActions.UploadDigitalSignature(
        mobileNumber,
        customerType,
        digitalSignature
      )
    );
  }

  generateOtpForCustomerSignature(customerId: string) {
    this.store.dispatch(new DigitalSignatureActions.GenerateOtp(customerId));
  }

  validateOtpForCustomerSignature(customerId: string, token: string) {
    this.store.dispatch(
      new DigitalSignatureActions.ValidateOtp(customerId, token)
    );
  }

  resetValidateOtpField() {
    this.store.dispatch(new DigitalSignatureActions.ValidateOtpSuccess(false));
  }

  loadEmployeeSignatureDetails(employeeCode: string) {
    this.store.dispatch(
      new DigitalSignatureActions.LoadEmployeeSignatureDetails(employeeCode)
    );
  }

  uploadEmployeeSignature(employeeCode: string, cashierSignature: string) {
    this.store.dispatch(
      new DigitalSignatureActions.UploadEmployeeSignature(
        employeeCode,
        cashierSignature
      )
    );
  }

  resetIsOtpGenerated() {
    this.store.dispatch(new DigitalSignatureActions.GenerateOtpSuccess(null));
  }

  resetDigitalSignature() {
    this.store.dispatch(new DigitalSignatureActions.ResetDigitalSignature());
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getError() {
    return this.error$;
  }

  getStoreDetailsForDigitalSignatureResponse(): Observable<
    StoreDetailsResponse
  > {
    return this.getStoreDetailsForDigitalSignature$;
  }

  getCustomerDetailsResponse(): Observable<CustomerDigitalSignatureResponse[]> {
    return this.getCustomerDetails$;
  }

  getCustomerDetailsForDigitalSignatureResponse(): Observable<
    CustomerDigitalSignatureResponse[]
  > {
    return this.getCustomerDetailsForDigitalSignature$;
  }

  sendCustomerDetailsForDigitalSignatureResponse(): Observable<
    CustomerDigitalSignatureResponse
  > {
    return this.sendCustomerDetailsForDigitalSignature$;
  }

  uploadDigitalSignatureResponse(): Observable<
    CustomerDigitalSignatureResponse
  > {
    return this.uploadDigitalSignature$;
  }

  getIsOtpGenerated(): Observable<boolean> {
    return this.isOtpGenerated$;
  }

  getIsOtpVerified(): Observable<boolean> {
    return this.isOtpVerified$;
  }

  getEmployeeSignatureDetailsResponse(): Observable<
    EmployeeSignatureDetailsResponse
  > {
    return this.employeeSignatureDetailsResponse$;
  }

  getUploadEmployeeSignatureResponse(): Observable<any> {
    return this.uploadEmployeeSignatureResponse$;
  }
}
