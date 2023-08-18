import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrors } from '@poss-web/shared/models';

export class CustomErrorAdaptor {
  static fromJson(error: Error | HttpErrorResponse): CustomErrors {
    let customError: CustomErrors;
    if (error instanceof HttpErrorResponse) {
      if (error.error == null || error.error.code === undefined) {
        customError = {
          code: error.name,
          message: error.message,
          traceId: '',
          timeStamp: '',
          dynamicValues: null,
          error
        };
      } else {
        customError = {
          code: error.error.code,
          message: error.error.message,
          traceId: error.error.traceId,
          timeStamp: error.error.timestamp,
          errorCause: error.error.errorCause,
          dynamicValues: error.error.dynamicValues,
          error
        };
      }
    }
    if (error instanceof Error) {
      customError = {
        code: error.name,
        message: error.message,
        traceId: '',
        timeStamp: '',
        error,
        dynamicValues: null
      };
    }

    return customError;
  }
}
