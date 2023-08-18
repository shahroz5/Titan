import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'poss-web-sub-region-listing-item',
  templateUrl: './sub-region-listing-item.component.html',
  styleUrls: ['./sub-region-listing-item.component.scss']
})
export class SubRegionListingItemComponent  {
  @Input() subRegionItem;
  @Output() regionCode = new EventEmitter<any>();
  @Output() emitToggle = new EventEmitter<any>();
  @Output() viewPage = new EventEmitter<string>();




  onEdit(regionCode: string) {
    this.regionCode.emit(regionCode);
  }

  changeEvent(event) {
    const obj = {
      event: event,
      subRegionItem: this.subRegionItem
    };
    this.emitToggle.emit(obj);
  }
  openViewPage(subRegionCode) {
    this.viewPage.emit(subRegionCode);
  }
}
