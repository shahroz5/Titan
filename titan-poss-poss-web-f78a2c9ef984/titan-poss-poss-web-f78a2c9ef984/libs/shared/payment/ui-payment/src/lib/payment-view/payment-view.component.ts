import {
  Component,
  Input,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { PaymentDetails, PaymentModeEnum } from '@poss-web/shared/models';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentViewComponent {
  @Input() paymentDetails: PaymentDetails[];
  @Input() tcsCollectedAmount: number;
  @Input() totalAmountDue = 0;
  @Input() totalPaidAmount = 0;
  @Input() showRemainingAmount = true;

  paymentModeEnumRef = PaymentModeEnum;
  constructor(@Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode) {}

  getTotalCashCollected(): number {
    if (this.paymentDetails) {
      return (
        this.paymentDetails
          // .filter(payment => this.checkForCash(payment.paymentCode))
          .map(payment => payment.amount)
          .reduce((amount1, amount2) => amount1 + amount2, 0)
      );
    } else {
      return 0;
    }
  }

  checkForCash(amount: number): boolean {
    return isNaN(amount) || amount === 0;
  }

  checkForUnipayVoid(paymentDetail) {
    return (
      paymentDetail.paymentCode === PaymentModeEnum.UNIPAY &&
      paymentDetail.isVoid
    );
  }

  checkForUnipayPaymentExists() {
    return (
      this.paymentDetails.filter(
        paymentDetail => paymentDetail.paymentCode === PaymentModeEnum.UNIPAY
      ).length > 0
    );
  }
}
