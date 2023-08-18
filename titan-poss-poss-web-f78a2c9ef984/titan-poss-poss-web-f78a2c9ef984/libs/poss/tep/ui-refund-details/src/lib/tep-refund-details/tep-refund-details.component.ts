import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-tep-refund-details',
  templateUrl: './tep-refund-details.component.html'
})
export class TepRefundDetailsComponent {
  @Input() tepDetails: any = [];
  @Input() currencyCode: string;
  @Input() refundDeductionAmt: number;
  constructor(private translate: TranslateService) {}
}
