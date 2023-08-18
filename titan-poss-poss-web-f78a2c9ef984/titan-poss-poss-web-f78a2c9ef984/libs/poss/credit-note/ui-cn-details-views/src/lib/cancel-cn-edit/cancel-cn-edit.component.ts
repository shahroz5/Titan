import { Component, Input } from '@angular/core';
import { CreditNoteDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cancel-cn-edit',
  templateUrl: './cancel-cn-edit.component.html',
  styleUrls: []
})
export class CancelCnEditComponent  {
  @Input() creditNoteDetails: CreditNoteDetails;




}
