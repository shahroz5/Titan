import { Component, Inject, Input } from '@angular/core';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-cn-view',
  templateUrl: './cn-view.component.html',
  styleUrls: ['./cn-view.component.scss']
})
export class CnViewComponent  {
  @Input() cnDetails: any;

  constructor(@Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode) {}



  // getTotalCashCollected(): number {
  //   if (this.paymentDetails) {
  //     return this.paymentDetails
  //       .filter(payment => this.checkForCash(payment.paymentCode))
  //       .map(payment => payment.amount)
  //       .reduce((amount1, amount2) => amount1 + amount2, 0);
  //   } else {
  //     return 0;
  //   }
  // }

  // checkForCash(paymentMode: PaymentModeEnum): boolean {
  //   return paymentMode === PaymentModeEnum.CASH;
  // }
}
