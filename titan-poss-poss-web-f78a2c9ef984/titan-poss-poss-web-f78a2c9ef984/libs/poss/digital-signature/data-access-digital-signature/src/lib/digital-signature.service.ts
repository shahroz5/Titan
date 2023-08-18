import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiService,
  generateOTPForCustomerSignatureUrl,
  getCustomerDetailsForDigitalSignatureUrl,
  getEmployeeSignatureDetailsUrl,
  getStoreDetailsForDigitalSignatureUrl,
  uploadDigitalSignatureUrl,
  uploadEmployeeSignatureUrl,
  validateOTPForCustomerSignatureUrl,
  getDigitalSignatureUrl
} from '@poss-web/shared/util-api-service';
import {
  CustomerDigitalSignatureRequestPayload,
  CustomerDigitalSignatureResponse,
  StoreDetailsResponse
} from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { getNewCustomerDetailsUrl } from 'libs/shared/util-api-service/src/lib/sales-endpoints.constants';

@Injectable({
  providedIn: 'root'
})
export class DigitalSignatureService {
  constructor(private apiService: ApiService) {}

  getCustomerDetails(
    mobileNumber?: string,
    ulpNumber?: string
  ): Observable<CustomerDigitalSignatureResponse[]> {
    const urlObject = getNewCustomerDetailsUrl(mobileNumber, ulpNumber);
    const customerDetailsForDigitalSignatureUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .get(customerDetailsForDigitalSignatureUrl, params)
      .pipe(map(data => data));
  }

  getCustomerDetailsForDigitalSignature(
    customerType: string,
    mobileNumber?: string,
    ulpNumber?: string
  ): Observable<CustomerDigitalSignatureResponse[]> {
    const urlObject = getCustomerDetailsForDigitalSignatureUrl(
      customerType,
      mobileNumber,
      ulpNumber
    );
    const customerDetailsForDigitalSignatureUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .get(customerDetailsForDigitalSignatureUrl, params)
      .pipe(map(data => data));
  }

  getStoreDetailsForDigitalSignature(): Observable<StoreDetailsResponse> {
    const url = getStoreDetailsForDigitalSignatureUrl();
    return this.apiService.get(url).pipe(map(data => data));
  }

  sendCustomerDetailsForDigitalSignature(
    requestPayload: CustomerDigitalSignatureRequestPayload
  ): Observable<CustomerDigitalSignatureResponse> {
    const urlObject = getDigitalSignatureUrl();
    const customerDigitalSignatureUrl = urlObject.path;
    return this.apiService
      .post(customerDigitalSignatureUrl, requestPayload)
      .pipe(map(data => data));
  }

  uploadDigitalSignature(
    mobileNumber: string,
    customerType: string,
    digitalSignature: string
  ): Observable<CustomerDigitalSignatureResponse> {
    const urlObject = uploadDigitalSignatureUrl(mobileNumber, customerType);
    const uploadDigitalSignatureUrlPath = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .post(uploadDigitalSignatureUrlPath, digitalSignature.toString(), params)
      .pipe(map(data => data));
  }

  sendOTPForCustomerSignature(
    customerId: string
  ): Observable<CustomerDigitalSignatureResponse> {
    const urlObject = generateOTPForCustomerSignatureUrl(customerId);
    const generateOTPForCustomerSignaturePath = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .post(generateOTPForCustomerSignaturePath, {}, params)
      .pipe(map(data => data));
  }

  validateOTPForCustomerSignature(
    customerId: string,
    token: string
  ): Observable<CustomerDigitalSignatureResponse> {
    const urlObject = validateOTPForCustomerSignatureUrl(customerId, token);
    const validateOTPForCustomerSignaturePath = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .put(validateOTPForCustomerSignaturePath, {}, params)
      .pipe(map(data => data));
  }

  getEmployeeSignatureDetails(employeeCode: string) {
    const urlObject = getEmployeeSignatureDetailsUrl(employeeCode);
    const employeeSignatureDetailsUrlPath = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .get(employeeSignatureDetailsUrlPath, params)
      .pipe(map(data => data));
  }

  uploadEmployeeSignature(employeeCode: string, cashierSignature: string) {
    const urlObject = uploadEmployeeSignatureUrl(employeeCode);
    const uploadEmployeeSignatureUrlPath = urlObject.path;
    return this.apiService
      .post(uploadEmployeeSignatureUrlPath, cashierSignature.toString())
      .pipe(map(data => data));
  }
}
