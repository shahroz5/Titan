import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CreditNoteDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-airpay-refund-view',
  templateUrl: './airpay-refund-view.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirpayRefundViewComponent implements OnInit {

  @Input() creditNoteDetails: CreditNoteDetails;

  constructor() { }

  ngOnInit(): void {
  }

}
