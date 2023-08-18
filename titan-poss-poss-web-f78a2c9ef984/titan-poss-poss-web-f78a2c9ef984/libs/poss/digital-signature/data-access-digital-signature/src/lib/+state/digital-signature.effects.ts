import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DigitalSignatureActionTypes } from './digital-signature.actions';
import * as DigitalSignatureActions from './digital-signature.actions';
import { DigitalSignatureService } from '../digital-signature.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomerDigitalSignatureResponse,
  CustomErrors,
  EmployeeSignatureDetailsResponse,
  StoreDetailsResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';

@Injectable()
export class DigitalSignatureEffects {
  constructor(
    private dataPersistence: DataPersistence<DigitalSignatureEffects>,
    private digitalSignatureService: DigitalSignatureService,
    private loggerService: LoggerService
  ) {}

  @Effect() getStoreDetailsForDigitalSignature$: Observable<
    Action
  > = this.dataPersistence.fetch(
    DigitalSignatureActionTypes.GET_STORE_DETAILS_FOR_DIGITAL_SIGNATURE,
    {
      run: (
        action: DigitalSignatureActions.GetStoreDetailsForDigitalSignature
      ) => {
        return this.digitalSignatureService
          .getStoreDetailsForDigitalSignature()
          .pipe(
            map(
              (data: StoreDetailsResponse) =>
                new DigitalSignatureActions.GetStoreDetailsForDigitalSignatureSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: DigitalSignatureActions.GetStoreDetailsForDigitalSignature,
        error: HttpErrorResponse
      ) => {
        return new DigitalSignatureActions.GetStoreDetailsForDigitalSignatureFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getCustomerDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS,
    {
      run: (action: DigitalSignatureActions.GetCustomerDetails) => {
        return this.digitalSignatureService
          .getCustomerDetails(action.mobileNumber, action.ulpNumber)
          .pipe(
            map((data: CustomerDigitalSignatureResponse[]) => {
              if (data && data.length) {
                return new DigitalSignatureActions.GetCustomerDetailsSuccess(
                  data
                );
              } else {
                return new DigitalSignatureActions.GetCustomerDetailsSuccess(
                  []
                );
              }
            })
          );
      },
      onError: (
        action: DigitalSignatureActions.GetCustomerDetails,
        error: HttpErrorResponse
      ) => {
        return new DigitalSignatureActions.GetCustomerDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getCustomerDetailsForDigitalSignature$: Observable<
    Action
  > = this.dataPersistence.fetch(
    DigitalSignatureActionTypes.GET_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE,
    {
      run: (
        action: DigitalSignatureActions.GetCustomerDetailsForDigitalSignature
      ) => {
        return this.digitalSignatureService
          .getCustomerDetailsForDigitalSignature(
            action.customerType,
            action.mobileNumber,
            action.ulpNumber
          )
          .pipe(
            map((data: CustomerDigitalSignatureResponse[]) => {
              if (data && data.length) {
                return new DigitalSignatureActions.GetCustomerDetailsForDigitalSignatureSuccess(
                  data
                );
              } else {
                return new DigitalSignatureActions.GetCustomerDetailsForDigitalSignatureSuccess(
                  []
                );
              }
            })
          );
      },
      onError: (
        action: DigitalSignatureActions.GetCustomerDetailsForDigitalSignature,
        error: HttpErrorResponse
      ) => {
        return new DigitalSignatureActions.GetCustomerDetailsForDigitalSignatureFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() sendCustomerDetailsForDigitalSignature$: Observable<
    Action
  > = this.dataPersistence.fetch(
    DigitalSignatureActionTypes.SEND_CUSTOMER_DETAILS_FOR_DIGITAL_SIGNATURE,
    {
      run: (
        action: DigitalSignatureActions.SendCustomerDetailsForDigitalSignature
      ) => {
        return this.digitalSignatureService
          .sendCustomerDetailsForDigitalSignature(action.payload)
          .pipe(
            map(
              (data: CustomerDigitalSignatureResponse) =>
                new DigitalSignatureActions.SendCustomerDetailsForDigitalSignatureSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: DigitalSignatureActions.SendCustomerDetailsForDigitalSignature,
        error: HttpErrorResponse
      ) => {
        return new DigitalSignatureActions.SendCustomerDetailsForDigitalSignatureFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() uploadDigitalSignature$: Observable<
    Action
  > = this.dataPersistence.fetch(
    DigitalSignatureActionTypes.UPLOAD_DIGITAL_SIGNATURE,
    {
      run: (action: DigitalSignatureActions.UploadDigitalSignature) => {
        return this.digitalSignatureService
          .uploadDigitalSignature(
            action.mobileNumber,
            action.customerType,
            action.payload
          )
          .pipe(
            map((data: CustomerDigitalSignatureResponse) => {
              if (data) {
                return new DigitalSignatureActions.UploadDigitalSignatureSuccess(
                  data
                );
              } else {
                return new DigitalSignatureActions.UploadDigitalSignatureSuccess(
                  {
                    applicableTransactionTypes: null,
                    customerAddress: null,
                    customerDocumentTxnId: null,
                    customerEmail: null,
                    customerId: null,
                    customerName: null,
                    digitalSignature: null,
                    mobileNumber: null,
                    ulpNumber: null,
                    customerType: null
                  }
                );
              }
            })
          );
      },
      onError: (
        action: DigitalSignatureActions.UploadDigitalSignature,
        error: HttpErrorResponse
      ) => {
        return new DigitalSignatureActions.UploadDigitalSignatureFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() generateOTP$: Observable<Action> = this.dataPersistence.fetch(
    DigitalSignatureActionTypes.GENERATE_OTP,
    {
      run: (action: DigitalSignatureActions.GenerateOtp) => {
        return this.digitalSignatureService
          .sendOTPForCustomerSignature(action.payload)
          .pipe(
            map(() => new DigitalSignatureActions.GenerateOtpSuccess(true))
          );
      },
      onError: (
        action: DigitalSignatureActions.GenerateOtp,
        error: HttpErrorResponse
      ) => {
        return new DigitalSignatureActions.GenerateOtpFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() validateOTP$: Observable<Action> = this.dataPersistence.fetch(
    DigitalSignatureActionTypes.VALIDATE_OTP,
    {
      run: (action: DigitalSignatureActions.ValidateOtp) => {
        return this.digitalSignatureService
          .validateOTPForCustomerSignature(action.customerId, action.token)
          .pipe(
            map(() => new DigitalSignatureActions.ValidateOtpSuccess(true))
          );
      },
      onError: (
        action: DigitalSignatureActions.ValidateOtp,
        error: HttpErrorResponse
      ) => {
        return new DigitalSignatureActions.ValidateOtpFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadEmployeeSignatureDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    DigitalSignatureActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS,
    {
      run: (action: DigitalSignatureActions.LoadEmployeeSignatureDetails) => {
        return this.digitalSignatureService
          .getEmployeeSignatureDetails(action.employeeCode)
          .pipe(
            map(
              (data: EmployeeSignatureDetailsResponse) =>
                new DigitalSignatureActions.LoadEmployeeSignatureDetailsSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: DigitalSignatureActions.LoadEmployeeSignatureDetails,
        error: HttpErrorResponse
      ) => {
        return new DigitalSignatureActions.LoadEmployeeSignatureDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() uploadEmployeeSignatureDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    DigitalSignatureActionTypes.UPLOAD_EMPLOYEE_SIGNATURE,
    {
      run: (action: DigitalSignatureActions.UploadEmployeeSignature) => {
        return this.digitalSignatureService
          .uploadEmployeeSignature(action.employeeCode, action.cashierSignature)
          .pipe(
            map(
              (data: any) =>
                new DigitalSignatureActions.UploadEmployeeSignatureSuccess(data)
            )
          );
      },
      onError: (
        action: DigitalSignatureActions.UploadEmployeeSignature,
        error: HttpErrorResponse
      ) => {
        return new DigitalSignatureActions.UploadEmployeeSignatureFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
