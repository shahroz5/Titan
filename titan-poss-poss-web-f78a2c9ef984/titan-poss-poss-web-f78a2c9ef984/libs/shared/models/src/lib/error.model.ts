export interface Errors {
  errorCode: string;
  errorMessage: string;
}
export interface CustomErrors {
  code: string;
  message: string;
  traceId: string;
  timeStamp: string;
  error: Error;
  errorCause?: any;
  dynamicValues?: any;
}
