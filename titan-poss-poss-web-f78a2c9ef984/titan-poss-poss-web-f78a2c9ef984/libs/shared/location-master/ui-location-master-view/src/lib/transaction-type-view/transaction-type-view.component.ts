import { Component, Input } from '@angular/core';
import { LocationMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-transaction-type-view',
  templateUrl: './transaction-type-view.component.html',
  styles: [
    `
      .h-110 {
        height: 110px;
      }
      .pw-line-height-18 {
        margint-top: 32px;
      }
    `
  ]
})
export class TransactionTypeViewComponent {
  @Input() locationDetails: LocationMasterDetails;
}
