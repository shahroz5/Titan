import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CreditNoteDetails, RefundOptionTypes } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-rtgs-refund-view',
  templateUrl: './rtgs-refund-view.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RtgsRefundViewComponent implements OnInit {

  @Input() creditNoteDetails: CreditNoteDetails;

  refundOptionTypes = RefundOptionTypes;

  constructor() { }

  ngOnInit(): void {
  }

}
