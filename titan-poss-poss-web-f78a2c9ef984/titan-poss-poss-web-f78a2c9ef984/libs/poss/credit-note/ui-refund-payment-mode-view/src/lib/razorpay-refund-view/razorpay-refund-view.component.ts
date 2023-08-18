import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CreditNoteDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-razorpay-refund-view',
  templateUrl: './razorpay-refund-view.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RazorpayRefundViewComponent implements OnInit {

  @Input() creditNoteDetails: CreditNoteDetails;

  constructor() { }

  ngOnInit(): void {
  }

}
