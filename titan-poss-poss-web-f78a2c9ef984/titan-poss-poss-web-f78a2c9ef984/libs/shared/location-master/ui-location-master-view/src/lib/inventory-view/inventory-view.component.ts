import { Component, Input } from '@angular/core';
import { LocationMasterDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-inventory-view',
  templateUrl: './inventory-view.component.html',
  styles: [
    `
      .h-110 {
        height: 110px;
      }
    `
  ]
})
export class InventoryViewComponent {

  @Input() locationDetails: LocationMasterDetails;


}
