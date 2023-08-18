import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CatchmentDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-catchment-listing-item',
  templateUrl: './catchment-listing-item.component.html'
})
export class CatchmentListingItemComponent implements OnInit {
  @Input() catchmentListItem: CatchmentDetails;
  @Output() taxClassCode = new EventEmitter<any>();
  @Output() emitToggle = new EventEmitter<any>();
  checked: boolean;


  ngOnInit() {
    this.checked = this.catchmentListItem.isActive;
  }

  getCatchmentCode(code: string) {
    this.taxClassCode.emit(code);
  }

  change(event) {
    this.checked = event.checked;
    const obj = {
      isActive: event.checked,
      catchmentCode: this.catchmentListItem.catchmentCode
    };
    this.emitToggle.emit(obj);
  }
}
