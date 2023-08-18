import { PaymentRequestDetails } from '@poss-web/shared/models';
import { AirpayPaymentAdaptor } from '../airpay-payment-requests/airpay-payments.adaptor';

export class AirpayPaymentsHelper {
  static getAirpayPaymentsDetails(data: any) {
    const response: PaymentRequestDetails[] = [];
    for (const payment of data.results) {
      response.push(AirpayPaymentAdaptor.paymentDetails(payment));
    }
    return { payments: response, count: data.totalElements };
  }
}
