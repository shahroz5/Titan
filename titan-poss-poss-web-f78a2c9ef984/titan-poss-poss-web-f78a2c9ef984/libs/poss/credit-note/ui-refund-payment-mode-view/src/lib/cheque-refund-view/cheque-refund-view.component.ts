import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CreditNoteDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cheque-refund-view',
  templateUrl: './cheque-refund-view.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChequeRefundViewComponent implements OnInit {

  @Input() creditNoteDetails: CreditNoteDetails;

  constructor() { }

  ngOnInit(): void {
  }

}
