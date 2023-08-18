import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StoneDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-stone-listing-item',
  templateUrl: './stone-listing-item.component.html'
})
export class StoneListingItemComponent implements OnInit {
  @Input() stoneDetailsList: StoneDetails;
  @Output() stoneCode = new EventEmitter<any>();
  @Output() emitToggle = new EventEmitter<any>();
  status: string;



  ngOnInit() {
    console.log(this.stoneDetailsList.isActive);

    if (this.stoneDetailsList.isActive) {
      this.status = 'Active';
    } else {
      this.status = 'In-Active';
    }
  }
  getStoneCode(stoneCode: string) {
    this.stoneCode.emit(stoneCode);
  }
}
