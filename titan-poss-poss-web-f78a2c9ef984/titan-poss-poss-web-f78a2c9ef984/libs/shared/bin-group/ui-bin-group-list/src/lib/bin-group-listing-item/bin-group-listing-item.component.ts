import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BinGroupDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-bin-group-listing-item',
  templateUrl: './bin-group-listing-item.component.html',
  styleUrls: ['./bin-group-listing-item.component.scss']
})
export class BinGroupListingItemComponent  {
  @Input() binGroupDetailsList: BinGroupDetails;

  @Output() binGroupNameView = new EventEmitter<string>();
  @Output() binGroupName = new EventEmitter<string>();




  getBinGroupNameView(binGroupCode: string) {
    this.binGroupNameView.emit(binGroupCode);
  }
  getBinGroupName(binGroupCode: string) {
    this.binGroupName.emit(binGroupCode);
  }
}
