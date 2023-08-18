import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CreditNoteDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cc-refund-view',
  templateUrl: './cc-refund-view.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CcRefundViewComponent implements OnInit {

  @Input() creditNoteDetails: CreditNoteDetails;

  constructor() { }

  ngOnInit(): void {
  }

}
