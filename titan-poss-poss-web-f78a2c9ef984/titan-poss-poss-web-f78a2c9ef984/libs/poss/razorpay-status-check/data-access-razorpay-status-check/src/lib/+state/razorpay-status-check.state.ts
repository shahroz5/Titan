import { RazorpayPaymentRequestEntity } from './razorpay-status-check.entity';
import {
  CustomErrors,
  PaymentRequestDetails,
  CustomerPayload
} from '@poss-web/shared/models';

export interface RazorpayStatusCheckState {
  isSearchingCustomer: boolean;
  hasSearchedCustomer: boolean;
  searchedCustomerDetails: CustomerPayload;

  paymentRequestList: RazorpayPaymentRequestEntity;
  paymentRequestListCount: number;

  paymentRequesHistory: RazorpayPaymentRequestEntity;
  paymentRequestsHistoryCount: number;

  verificationResponse: PaymentRequestDetails;

  isLoading: boolean;
  error: CustomErrors;
}
