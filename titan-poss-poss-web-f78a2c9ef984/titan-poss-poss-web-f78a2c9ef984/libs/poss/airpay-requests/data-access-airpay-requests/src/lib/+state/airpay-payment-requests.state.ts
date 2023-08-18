import { AirpayPaymentRequestEntity } from './airpay-payment-requests.entity';
import {
  CustomErrors,
  PaymentRequestDetails,
  CustomerPayload
} from '@poss-web/shared/models';

export interface AirpayPaymentRequestState {
  isSearchingCustomer: boolean;
  hasSearchedCustomer: boolean;
  searchedCustomerDetails: CustomerPayload;

  paymentRequestList: AirpayPaymentRequestEntity;
  paymentRequestListCount: number;

  paymentRequesHistory: AirpayPaymentRequestEntity;
  paymentRequestsHistoryCount: number;

  verificationResponse: PaymentRequestDetails;

  isLoading: boolean;
  error: CustomErrors;
}
